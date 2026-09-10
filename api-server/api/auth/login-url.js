const { HEALTH_ID_BASE_URL, HEALTH_ID_CLIENT_ID, REDIRECT_URI, FRONTEND_URL } = require("../../lib/config");

// Endpoint ดึง URL สำหรับไปล็อกอิน Health ID (หมอพร้อม)
module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);

  const state = Math.random().toString(36).slice(2);
  const targetUrl =
    `${HEALTH_ID_BASE_URL}/oauth/redirect?client_id=${encodeURIComponent(HEALTH_ID_CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&state=${state}`;

  res.status(200).json({ url: targetUrl });
};
