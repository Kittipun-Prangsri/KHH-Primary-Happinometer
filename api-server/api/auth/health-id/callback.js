const axios = require("axios");
const admin = require("../../../lib/firebaseAdmin");
const {
  HEALTH_ID_BASE_URL,
  HEALTH_ID_CLIENT_ID,
  HEALTH_ID_CLIENT_SECRET,
  PROVIDER_ID_BASE_URL,
  PROVIDER_CLIENT_ID,
  PROVIDER_SECRET_KEY,
  REDIRECT_URI,
  FRONTEND_URL,
} = require("../../../lib/config");

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
    // uid ใช้ provider_id/account_id ของ MOPH เป็นตัวระบุตัวตนที่คงที่
    const uid = String(profile.provider_id || profile.account_id || `provider-${Date.now()}`);
    const claims = { approved: true, role: "admin" };

    await admin.firestore().collection("khh_staff").doc(uid).set(
      {
        profile,
        ...claims,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    const customToken = await admin.auth().createCustomToken(uid, claims);

    // ส่งข้อมูลกลับไปหน้าเว็บหลัก (Base64 URL encode เพื่อความปลอดภัยของข้อมูลภาษาไทย)
    const encodedProfile = Buffer.from(JSON.stringify(profile)).toString("base64");
    res.redirect(302, `${FRONTEND_URL}/?auth_data=${encodedProfile}&token=${customToken}`);
  } catch (error) {
    const errDetail = (error.response && error.response.data) || error.message;
    console.error("Auth Error:", errDetail);
    res.redirect(302, `${FRONTEND_URL}/?error=auth_failed`);
  }
};
