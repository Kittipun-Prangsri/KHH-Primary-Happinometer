const { onRequest } = require('firebase-functions/v2/https')
const { defineSecret } = require('firebase-functions/params')
const logger = require('firebase-functions/logger')
const admin = require('firebase-admin')
const express = require('express')

admin.initializeApp()

const HEALTH_CLIENT_SECRET = defineSecret('HEALTH_CLIENT_SECRET')
const PROVIDER_CLIENT_SECRET = defineSecret('PROVIDER_CLIENT_SECRET')

// Roles that are allowed to view the admin analytics dashboard once approved.
const ALLOWED_ROLES = ['admin', 'superadmin']

function requireEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing required configuration "${name}". Set it in functions/.env (see functions/.env.example) before deploying — there is no built-in fallback.`
    )
  }
  return value
}

const app = express()
app.use(express.json())

app.get('/auth/provider-redirect', (req, res) => {
  try {
    const healthIdUrl = requireEnv('HEALTH_ID_URL')
    const clientId = requireEnv('HEALTH_CLIENT_ID')
    const redirectUri = req.query.redirect_uri || process.env.PROVIDER_REDIRECT_URI || 'https://khh-primary-happinometer.web.app'

    const url =
      `${healthIdUrl}/oauth/redirect?client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code`

    const wantsJson = (req.get('accept') || '').includes('application/json') || req.xhr
    if (wantsJson) {
      res.json({ url })
    } else {
      res.redirect(url)
    }
  } catch (err) {
    logger.error('[provider-redirect] configuration error:', err)
    res.status(500).json({ error: 'config_error', message: 'ระบบยืนยันตัวตนยังไม่ได้ตั้งค่าให้พร้อมใช้งาน' })
  }
})

app.post('/auth/provider-login', async (req, res) => {
  try {
    const { code, redirect_uri } = req.body || {}
    if (!code) {
      return res.status(400).json({ error: 'missing_code' })
    }

    // Mock login is only reachable inside the local Firebase emulator — this
    // check cannot be flipped on in a deployed environment via any env var.
    const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true'

    let profile
    if (isEmulator && code.startsWith('mock-')) {
      profile = {
        provider_id: `mock-${code}`,
        name_th: 'ผู้ทดสอบระบบ (Mock, emulator only)',
        organization: [{ position: 'เจ้าหน้าที่ทดสอบ', hcode: '00000', hname_th: 'รพ.คลองหาด (ทดสอบ)', license_id: null }],
      }
    } else {
      const healthIdUrl = requireEnv('HEALTH_ID_URL')
      const providerIdUrl = requireEnv('PROVIDER_ID_URL')
      const healthClientId = requireEnv('HEALTH_CLIENT_ID')
      const providerClientId = requireEnv('PROVIDER_CLIENT_ID')
      const redirectUri = redirect_uri || process.env.PROVIDER_REDIRECT_URI || 'https://khh-primary-happinometer.web.app'
      const healthClientSecret = (HEALTH_CLIENT_SECRET.value && HEALTH_CLIENT_SECRET.value()) || process.env.HEALTH_CLIENT_SECRET
      const providerClientSecret = (PROVIDER_CLIENT_SECRET.value && PROVIDER_CLIENT_SECRET.value()) || process.env.PROVIDER_CLIENT_SECRET
      if (!healthClientSecret || !providerClientSecret) {
        throw new Error('Missing HEALTH_CLIENT_SECRET or PROVIDER_CLIENT_SECRET — set them in functions/.env or via `firebase functions:secrets:set`.')
      }

      const healthTokenRes = await fetch(`${healthIdUrl}/api/v1/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: healthClientId,
          client_secret: healthClientSecret,
        }),
      })
      if (!healthTokenRes.ok) {
        const errData = await healthTokenRes.json().catch(() => ({}))
        const errMsg = errData.message || `Health ID token exchange failed: ${healthTokenRes.status}`
        logger.error('[provider-login] Health ID token error:', errData)
        throw new Error(errMsg)
      }
      const healthTokenData = await healthTokenRes.json()
      const healthAccessToken = healthTokenData?.data?.access_token || healthTokenData?.access_token

      if (!healthAccessToken) {
        throw new Error('Health ID token response missing access_token')
      }

      const providerTokenRes = await fetch(`${providerIdUrl}/api/v1/services/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: providerClientId,
          secret_key: providerClientSecret,
          token_by: 'Health ID',
          token: healthAccessToken,
        }),
      })
      if (!providerTokenRes.ok) {
        const errData = await providerTokenRes.json().catch(() => ({}))
        if (providerTokenRes.status === 400) {
          return res.status(400).json({
            error: 'not_a_provider',
            message: errData.message_th || errData.message || 'ไม่พบข้อมูล Provider ID ของผู้ใช้งานนี้ (400 Bad Request)',
          })
        }
        throw new Error(errData.message_th || errData.message || `Provider ID token exchange failed: ${providerTokenRes.status}`)
      }
      const providerTokenData = await providerTokenRes.json()
      const providerAccessToken = providerTokenData?.data?.access_token || providerTokenData?.access_token

      if (!providerAccessToken) {
        throw new Error('Provider ID token response missing access_token')
      }

      const profileRes = await fetch(`${providerIdUrl}/api/v1/services/profile`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${providerAccessToken}`,
          'client-id': providerClientId,
          'secret-key': providerClientSecret,
        },
      })
      if (!profileRes.ok) {
        const errData = await profileRes.json().catch(() => ({}))
        throw new Error(errData.message_th || errData.message || `Profile fetch failed: ${profileRes.status}`)
      }
      const profileData = await profileRes.json()
      profile = profileData?.data || profileData
    }

    const providerId = profile.provider_id
    if (!providerId) throw new Error('Profile response missing provider_id')

    const org = (profile.organization && profile.organization[0]) || {}
    const db = admin.firestore()
    const staffRef = db.collection('khh_staff').doc(providerId)
    const staffSnap = await staffRef.get()

    const profileFields = {
      providerId,
      nameTh: profile.name_th || `${profile.firstname_th || ''} ${profile.lastname_th || ''}`.trim() || null,
      nameEng: profile.name_eng || `${profile.firstname_en || ''} ${profile.lastname_en || ''}`.trim() || null,
      firstnameTh: profile.firstname_th || null,
      lastnameTh: profile.lastname_th || null,
      specialTitleTh: profile.special_title_th || null,
      position: org.position || org.position_type || null,
      positionType: org.position_type || null,
      hcode: org.hcode || null,
      hname: org.hname_th || null,
      hnameEng: org.hname_eng || null,
      licenseId: org.license_id || null,
      expertise: org.expertise || null,
      isHrAdmin: Boolean(org.is_hr_admin),
      isDirector: Boolean(org.is_director),
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
    }

    if (!staffSnap.exists) {
      // New account: never auto-approved and never auto-granted a role.
      // An existing admin must flip status to 'approved' and set a role
      // directly in Firestore (khh_staff/{providerId}) before this person
      // can access the dashboard.
      await staffRef.set({
        ...profileFields,
        status: 'pending',
        role: null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })
      return res.status(403).json({
        error: 'pending_approval',
        message: 'สร้างบัญชีของคุณเรียบร้อยแล้ว กรุณารอผู้ดูแลระบบอนุมัติสิทธิ์เข้าใช้งาน Dashboard',
      })
    }

    await staffRef.set(profileFields, { merge: true })
    const staffData = staffSnap.data()

    if (staffData.status !== 'approved' || !ALLOWED_ROLES.includes(staffData.role)) {
      return res.status(403).json({
        error: 'pending_approval',
        message: 'บัญชีของคุณยังไม่ได้รับการอนุมัติสิทธิ์เข้าใช้งาน Dashboard จากผู้ดูแลระบบ',
      })
    }

    const customToken = await admin.auth().createCustomToken(providerId, {
      role: staffData.role,
      approved: true,
    })

    return res.json({
      customToken,
      profile: { nameTh: profileFields.nameTh, position: profileFields.position, role: staffData.role },
    })
  } catch (err) {
    logger.error('[provider-login] error:', err)
    return res.status(500).json({ error: 'login_failed', message: 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' })
  }
})

exports.api = onRequest({ region: 'asia-southeast1', secrets: [HEALTH_CLIENT_SECRET, PROVIDER_CLIENT_SECRET] }, app)
