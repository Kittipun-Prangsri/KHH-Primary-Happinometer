function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

module.exports = {
  HEALTH_ID_BASE_URL: process.env.HEALTH_ID_URL || "https://uat-moph.id.th",
  HEALTH_ID_CLIENT_ID: required("HEALTH_CLIENT_ID"),
  HEALTH_ID_CLIENT_SECRET: required("HEALTH_CLIENT_SECRET"),
  PROVIDER_ID_BASE_URL: process.env.PROVIDER_ID_URL || "https://uat-provider.id.th",
  PROVIDER_CLIENT_ID: required("PROVIDER_CLIENT_ID"),
  PROVIDER_SECRET_KEY: required("PROVIDER_CLIENT_SECRET"),
  // Must exactly match (a) what's registered with MOPH for this client_id and
  // (b) this deployment's own /api/auth/health-id/callback URL.
  REDIRECT_URI: required("PROVIDER_REDIRECT_URI"),
  FRONTEND_URL: process.env.FRONTEND_URL || "https://khh-primary-happinometer.web.app",
  SUPABASE_URL: required("SUPABASE_URL"),
  SUPABASE_SERVICE_ROLE_KEY: required("SUPABASE_SERVICE_ROLE_KEY"),
  SUPABASE_ANON_KEY: required("SUPABASE_ANON_KEY"),
};
