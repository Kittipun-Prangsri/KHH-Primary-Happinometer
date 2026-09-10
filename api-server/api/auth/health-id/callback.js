const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");
const { providerIdToUuid } = require("../../../lib/providerUuid");
const {
  HEALTH_ID_BASE_URL,
  HEALTH_ID_CLIENT_ID,
  HEALTH_ID_CLIENT_SECRET,
  PROVIDER_ID_BASE_URL,
  PROVIDER_CLIENT_ID,
  PROVIDER_SECRET_KEY,
  REDIRECT_URI,
  FRONTEND_URL,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_ANON_KEY,
} = require("../../../lib/config");

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Callback URL ที่ Health ID ส่ง Authorization Code กลับมา
module.exports = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    res.status(400).send("Missing authorization code");
    return;
  }

  try {
    // แลก code เป็น Health ID Access Token
    const tokenRes = await axios.post(
      `${HEALTH_ID_BASE_URL}/api/v1/token`,
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: HEALTH_ID_CLIENT_ID,
        client_secret: HEALTH_ID_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    // ตาม คู่มือ Provider ID (หน้า 5) response ห่อด้วย { status, data: {...}, message }
    const healthIdToken = tokenRes.data?.data?.access_token;
    if (!healthIdToken) {
      throw new Error(`Health ID token exchange returned no access_token: ${JSON.stringify(tokenRes.data)}`);
    }

    // แลก Health ID Token เป็น Provider ID Token
    const providerTokenRes = await axios.post(`${PROVIDER_ID_BASE_URL}/api/v1/services/token`, {
      client_id: PROVIDER_CLIENT_ID,
      secret_key: PROVIDER_SECRET_KEY,
      token_by: "Health ID",
      token: healthIdToken,
    });

    // ตาม คู่มือ Provider ID (หน้า 8) response ห่อด้วย { status, message, data: {...} } เช่นกัน
    const providerToken = providerTokenRes.data?.data?.access_token;
    if (!providerToken) {
      throw new Error(`Provider ID token exchange returned no access_token: ${JSON.stringify(providerTokenRes.data)}`);
    }

    // ดึง Profile บุคลากร — ตาม คู่มือ (หน้า 9) ต้องแนบ client-id / secret-key
    // เป็น header คู่กับ Authorization ไม่งั้นจะได้ 401 "Authentication is required"
    const profileRes = await axios.get(
      `${PROVIDER_ID_BASE_URL}/api/v1/services/profile?moph_center_token=1&position_type=1`,
      {
        headers: {
          Authorization: `Bearer ${providerToken}`,
          "client-id": PROVIDER_CLIENT_ID,
          "secret-key": PROVIDER_SECRET_KEY,
        },
      }
    );

    const profile = profileRes.data?.data || profileRes.data;

    // เจ้าหน้าที่ทุกคนที่ยืนยันตัวตนผ่าน Provider ID สำเร็จ จะได้สิทธิ์ admin ทันที
    const providerId = String(profile.provider_id || profile.account_id || `provider-${Date.now()}`);
    const uid = providerIdToUuid(providerId);
    // MOPH's profile response doesn't include an email — synthesize a stable,
    // unique one so this maps to exactly one Supabase Auth user per provider_id.
    const syntheticEmail = `${providerId}@khh-staff.invalid`;
    const appMetadata = { approved: true, role: "admin" };

    const { error: createError } = await supabaseAdmin.auth.admin.createUser({
      id: uid,
      email: syntheticEmail,
      email_confirm: true,
      user_metadata: { provider_id: providerId },
      app_metadata: appMetadata,
    });
    if (createError) {
      const alreadyExists = /already.*registered|already.*exists/i.test(createError.message || "");
      if (!alreadyExists) throw createError;
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(uid, {
        app_metadata: appMetadata,
      });
      if (updateError) throw updateError;
    }

    const { error: upsertError } = await supabaseAdmin.from("khh_staff").upsert(
      {
        id: uid,
        provider_id: providerId,
        profile,
        approved: true,
        role: "admin",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (upsertError) throw upsertError;

    // มินต์ session จริงของ Supabase ให้ frontend โดยไม่ต้องส่งอีเมลจริง —
    // generateLink สร้าง token แล้ว verifyOtp แลกเป็น access/refresh token ทันที
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: syntheticEmail,
    });
    if (linkError) throw linkError;

    const { data: sessionData, error: verifyError } = await supabaseAnon.auth.verifyOtp({
      type: "magiclink",
      token_hash: linkData.properties.hashed_token,
      email: syntheticEmail,
    });
    if (verifyError) throw verifyError;

    const { access_token: accessToken, refresh_token: refreshToken } = sessionData.session;

    // ส่งข้อมูลกลับไปหน้าเว็บหลัก (Base64 URL encode เพื่อความปลอดภัยของข้อมูลภาษาไทย)
    const encodedProfile = Buffer.from(JSON.stringify(profile)).toString("base64");
    res.redirect(
      302,
      `${FRONTEND_URL}/?auth_data=${encodedProfile}&access_token=${accessToken}&refresh_token=${refreshToken}`
    );
  } catch (error) {
    const errDetail = (error.response && error.response.data) || error.message;
    console.error("Auth Error:", errDetail);
    res.redirect(302, `${FRONTEND_URL}/?error=auth_failed`);
  }
};
