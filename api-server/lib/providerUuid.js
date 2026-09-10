const crypto = require("crypto");

// Supabase Auth users need a UUID id. MOPH's provider_id/account_id isn't
// one, so derive a stable, deterministic UUID from it — the same staff
// member always maps to the same Supabase Auth user across logins.
function providerIdToUuid(providerId) {
  const hash = crypto.createHash("sha256").update(String(providerId)).digest("hex");
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    "5" + hash.slice(13, 16),
    ((parseInt(hash[16], 16) & 0x3) | 0x8).toString(16) + hash.slice(17, 20),
    hash.slice(20, 32),
  ].join("-");
}

module.exports = { providerIdToUuid };
