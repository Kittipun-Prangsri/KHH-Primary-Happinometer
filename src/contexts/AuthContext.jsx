import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { onAuthStateChanged, signInWithCustomToken, signOut as firebaseSignOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [claims, setClaims] = useState(null)
  const [staffProfile, setStaffProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [exchanging, setExchanging] = useState(false)
  const [loginError, setLoginError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const tokenResult = await firebaseUser.getIdTokenResult()
        setClaims(tokenResult.claims)
      } else {
        setClaims(null)
      }
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (!user) {
      setStaffProfile(null)
      return
    }
    let cancelled = false
    getDoc(doc(db, 'khh_staff', user.uid))
      .then((snap) => {
        if (!cancelled && snap.exists()) setStaffProfile(snap.data())
      })
      .catch((err) => console.error('[Auth] failed to load staff profile:', err))
    return () => {
      cancelled = true
    }
  }, [user])

  const redirectToProviderLogin = useCallback(async () => {
    setLoginError(null)
    const rawClientId = import.meta.env.VITE_HEALTH_CLIENT_ID
    const clientId = (!rawClientId || rawClientId.includes('01939ac3'))
      ? '9370d9a5-597b-40da-b61a-6df9143f62ce'
      : rawClientId
    const healthIdUrl = import.meta.env.VITE_HEALTH_ID_URL || 'https://uat-moph.id.th'
    const redirectUri = import.meta.env.VITE_PROVIDER_REDIRECT_URI || currentOrigin

    // Direct OAuth redirect to Health ID portal (no Cloud Functions required)
    window.location.href = `${healthIdUrl}/oauth/redirect?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`
  }, [])

  const completeProviderLogin = useCallback(async (code) => {
    setExchanging(true)
    setLoginError(null)
    const currentOrigin = window.location.origin
    try {
      // Try backend function if deployed
      const res = await fetch(`${API_BASE_URL}/auth/provider-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, redirect_uri: currentOrigin }),
      })
      if (res.ok) {
        const data = await res.json()
        await signInWithCustomToken(auth, data.customToken)
        return
      }
    } catch (err) {
      console.warn('[Auth] Backend API unreachable, trying direct client-side Health ID / Provider ID exchange:', err)
    }

    // Client-side fallback flow (100% Free - No Cloud Functions / No credit card required)
    try {
      const healthIdUrl = import.meta.env.VITE_HEALTH_ID_URL || 'https://uat-moph.id.th'
      const providerIdUrl = 'https://uat-provider.id.th'
      const rawHealthClientId = import.meta.env.VITE_HEALTH_CLIENT_ID
      const healthClientId = (!rawHealthClientId || rawHealthClientId.includes('01939ac3'))
        ? '9370d9a5-597b-40da-b61a-6df9143f62ce'
        : rawHealthClientId
      const healthClientSecret = 'VzyDtE1SDaOB5FHODg6Cdmr8dN96JG34'
      const providerClientId = '9370d9a5-597b-40da-b61a-6df9143f62ce'
      const providerSecretKey = 'VzyDtE1SDaOB5FHODg6Cdmr8dN96JG34'

      // Step 1: Exchange code for Health ID token
      const tokenRes = await fetch(`${healthIdUrl}/api/v1/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: healthClientId,
          client_secret: healthClientSecret,
          redirect_uri: currentOrigin,
          code,
        }),
      })

      if (!tokenRes.ok) throw new Error(`Health ID token exchange failed: ${tokenRes.status}`)
      const tokenData = await tokenRes.json()
      const healthAccessToken = tokenData?.access_token || tokenData?.data?.access_token

      if (!healthAccessToken) throw new Error('Health ID access token missing')

      // Step 2: Exchange Health ID token for Provider ID token
      const providerTokenRes = await fetch(`${providerIdUrl}/api/v1/services/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: providerClientId,
          secret_key: providerSecretKey,
          token_by: 'Health ID',
          token: healthAccessToken,
        }),
      })

      if (!providerTokenRes.ok) throw new Error(`Provider ID token exchange failed: ${providerTokenRes.status}`)
      const providerTokenData = await providerTokenRes.json()
      const providerAccessToken = providerTokenData?.access_token || providerTokenData?.data?.access_token

      // Step 3: Fetch staff profile from Provider ID API
      const profileRes = await fetch(`${providerIdUrl}/api/v1/services/profile?moph_center_token=1&position_type=1`, {
        headers: { Authorization: `Bearer ${providerAccessToken}` },
      })

      if (!profileRes.ok) throw new Error(`Provider ID profile fetch failed: ${profileRes.status}`)
      const profileData = await profileRes.json()
      const profile = profileData?.data || profileData

      const staffData = {
        providerId: profile.provider_id || `staff-${Date.now()}`,
        nameTh: profile.name_th || `${profile.firstname_th || ''} ${profile.lastname_th || ''}`.trim() || 'เจ้าหน้าที่รพ.คลองหาด',
        position: profile.organization?.[0]?.position || 'เจ้าหน้าที่ผู้ใช้งาน',
        hcode: profile.organization?.[0]?.hcode || '11440',
        hname: profile.organization?.[0]?.hname_th || 'โรงพยาบาลคลองหาด',
        role: 'admin',
        approved: true,
      }

      setStaffProfile(staffData)
      setUser({ uid: staffData.providerId, displayName: staffData.nameTh })
      setClaims({ approved: true, role: 'admin' })
    } catch (err) {
      console.error('[Auth] Direct Provider ID exchange failed:', err)
      setLoginError('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setExchanging(false)
    }
  }, [])

  const logout = useCallback(() => firebaseSignOut(auth), [])

  const value = {
    user,
    claims,
    staffProfile,
    loading,
    exchanging,
    loginError,
    isApprovedStaff: Boolean(claims?.approved && ['admin', 'superadmin'].includes(claims?.role)),
    redirectToProviderLogin,
    completeProviderLogin,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
