const admin = require("firebase-admin");

if (!admin.apps.length) {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (!raw) {
    throw new Error("Missing required env var: FIREBASE_SERVICE_ACCOUNT_B64");
  }
  const serviceAccount = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
