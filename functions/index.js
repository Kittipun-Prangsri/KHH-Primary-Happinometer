const functions = require("firebase-functions");
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const admin = require("firebase-admin");

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// ค่า URL กลางของ สธ. (สลับเป็น https://moph.id.th และ https://provider.id.th เมื่อใช้งานจริง)
const HEALTH_ID_BASE_URL = process.env.HEALTH_ID_URL || "https://uat-moph.id.th";
const PROVIDER_ID_BASE_URL = process.env.PROVIDER_ID_URL || "https://uat-provider.id.th";

// ข้อมูล Credential ที่ได้จากการลงทะเบียน
const HEALTH_ID_CLIENT_ID = process.env.HEALTH_CLIENT_ID || "9370d9a5-597b-40da-b61a-6df9143f62ce";
const HEALTH_ID_CLIENT_SECRET = process.env.HEALTH_CLIENT_SECRET || "VzyDtE1SDaOB5FHODg6Cdmr8dN96JG34";
const REDIRECT_URI = process.env.PROVIDER_REDIRECT_URI || "https://khh-primary-happinometer.web.app/api/auth/health-id/callback";

const PROVIDER_CLIENT_ID = process.env.PROVIDER_CLIENT_ID || "9370d9a5-597b-40da-b61a-6df9143f62ce";
const PROVIDER_SECRET_KEY = process.env.PROVIDER_CLIENT_SECRET || "VzyDtE1SDaOB5FHODg6Cdmr8dN96JG34";

// 1. Endpoint ดึง URL สำหรับไปล็อกอิน Health ID (หมอพร้อม)
app.get("/auth/login-url", (req, res) => {
  const state = Math.random().toString(36).substring(7);
  const targetUrl = `${HEALTH_ID_BASE_URL}/oauth/redirect?client_id=${HEALTH_ID_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&state=${state}`;
  res.json({ url: targetUrl });
});

// 2. Callback URL ที่ Health ID ส่ง Authorization Code กลับมา
app.get("/auth/health-id/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Missing authorization code");
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
        code: code
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    // ตาม คู่มือ Provider ID (หน้า 5) response ห่อด้วย { status, data: {...}, message }
    const healthIdToken = tokenRes.data?.data?.access_token;
    if (!healthIdToken) {
      throw new Error(`Health ID token exchange returned no access_token: ${JSON.stringify(tokenRes.data)}`);
    }

    // แลก Health ID Token เป็น Provider ID Token
    const providerTokenRes = await axios.post(
      `${PROVIDER_ID_BASE_URL}/api/v1/services/token`,
      {
        client_id: PROVIDER_CLIENT_ID,
        secret_key: PROVIDER_SECRET_KEY,
        token_by: "Health ID",
        token: healthIdToken
      }
    );

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
        }
      }
    );

    const profileData = profileRes.data;
    const profile = profileData.data || profileData;

    // เจ้าหน้าที่ทุกคนที่ยืนยันตัวตนผ่าน Provider ID สำเร็จ จะได้สิทธิ์ admin ทันที
    // (ไม่มีขั้นตอนรออนุมัติแยกต่างหาก) — uid ใช้ provider_id/account_id ของ MOPH
    // เป็นตัวระบุตัวตนที่คงที่ในระบบ Firebase Auth ของเรา
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
    // ใช้ `profile` (ที่แกะ .data ออกมาแล้ว) ไม่ใช่ profileData ทั้ง envelope
    // เพราะฝั่ง frontend คาดหวัง field แบบแบน (name_th, organization, ...)
    const encodedProfile = Buffer.from(JSON.stringify(profile)).toString("base64");
    res.redirect(
      `https://khh-primary-happinometer.web.app/?auth_data=${encodedProfile}&token=${customToken}`
    );

  } catch (error) {
    const errDetail = (error.response && error.response.data) || error.message;
    console.error("Auth Error:", errDetail);
    res.redirect(`https://khh-primary-happinometer.web.app/?error=auth_failed`);
  }
});

// Export เป็น Cloud Function ชื่อ 'api'
exports.api = functions.https.onRequest(app);
