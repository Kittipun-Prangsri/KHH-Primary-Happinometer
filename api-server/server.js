// Standalone entrypoint for running this backend via PM2 on a server with a
// static, MOPH-whitelisted IP — the same api/ handlers Vercel invokes as
// serverless functions, just wired up behind a plain Express app instead.
require('dotenv').config();

const express = require('express');

const app = express();
const PORT = process.env.PORT || 4001;

app.get('/api/auth/login-url', require('./api/auth/login-url'));
app.get('/api/auth/health-id/callback', require('./api/auth/health-id/callback'));

app.listen(PORT, () => {
  console.log(`KHH Happinometer OAuth backend listening on port ${PORT}`);
});
