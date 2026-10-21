import test from "node:test";
import assert from "node:assert/strict";
import {
  SESSION_COOKIE,
  adminConfig,
  createSessionToken,
  hashPassword,
  isSameOrigin,
  safeNextPath,
  sessionCookieOptions,
  verifyCredentials,
  verifySessionToken,
} from "./session.js";
import {
  checkRateLimit,
  clearFailures,
  recordFailure,
  resetRateLimits,
  RATE_LIMIT,
} from "./rateLimit.js";

const ENV_KEYS = [
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "ADMIN_PASSWORD_HASH",
  "ADMIN_PASSWORD_SALT",
  "SESSION_SECRET",
  "ADMIN_SESSION_HOURS",
];
const original = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
const originalNodeEnv = process.env.NODE_ENV;

function resetEnv() {
  ENV_KEYS.forEach((key) => {
    if (original[key] === undefined) delete process.env[key];
    else process.env[key] = original[key];
  });
  process.env.NODE_ENV = originalNodeEnv;
}
test.afterEach(() => {
  resetEnv();
  resetRateLimits();
});

test("development falls back to the documented demo account", () => {
  process.env.NODE_ENV = "development";
  ENV_KEYS.forEach((key) => delete process.env[key]);
  const config = adminConfig();
  assert.equal(config.source, "development");
  assert.equal(config.configured, true);
  assert.equal(verifyCredentials("admin@yrpm.local", "studio-preview"), true);
  assert.equal(verifyCredentials("admin@yrpm.local", "wrong"), false);
  assert.equal(verifyCredentials("someone@else.test", "studio-preview"), false);
});

test("production without credentials stays locked", () => {
  process.env.NODE_ENV = "production";
  ENV_KEYS.forEach((key) => delete process.env[key]);
  assert.equal(adminConfig().configured, false);
  assert.equal(verifyCredentials("admin@yrpm.local", "studio-preview"), false);
});

test("environment credentials accept plain or scrypt-hashed passwords only", () => {
  process.env.NODE_ENV = "production";
  process.env.ADMIN_EMAIL = "Steward@Example.com";
  process.env.ADMIN_PASSWORD = "a-plain-secret";
  assert.equal(verifyCredentials("steward@example.com", "a-plain-secret"), true);
  assert.equal(verifyCredentials("steward@example.com", "nope"), false);

  const { hash, salt } = hashPassword("hashed-secret-value");
  process.env.ADMIN_PASSWORD = "";
  process.env.ADMIN_PASSWORD_HASH = hash;
  process.env.ADMIN_PASSWORD_SALT = salt;
  assert.equal(verifyCredentials("steward@example.com", "hashed-secret-value"), true);
  assert.equal(verifyCredentials("steward@example.com", "hashed-secret-valuE"), false);
});

test("session tokens round-trip and reject tampering", () => {
  process.env.NODE_ENV = "production";
  process.env.ADMIN_EMAIL = "steward@example.com";
  process.env.ADMIN_PASSWORD = "a-plain-secret";
  process.env.SESSION_SECRET = "0123456789abcdef0123456789abcdef";
  process.env.ADMIN_SESSION_HOURS = "2";

  const token = createSessionToken("steward@example.com");
  const payload = verifySessionToken(token);
  assert.equal(payload.sub, "steward@example.com");
  assert.ok(payload.exp - payload.iat === 2 * 60 * 60 * 1000);

  // Flipped byte in the signature.
  const [body, sig] = token.split(".");
  const badSig = `${body}.${sig.slice(0, -2)}${sig.endsWith("A") ? "BB" : "AA"}`;
  assert.equal(verifySessionToken(badSig), null);

  // Re-encoded payload keeps the old signature.
  const forged = Buffer.from(
    JSON.stringify({ ...payload, sub: "attacker@example.com" }),
  ).toString("base64url");
  assert.equal(verifySessionToken(`${forged}.${sig}`), null);

  assert.equal(verifySessionToken(""), null);
  assert.equal(verifySessionToken("not-a-token"), null);
  assert.equal(verifySessionToken("a.b.c"), null);
  assert.equal(verifySessionToken(null), null);
  assert.equal(verifySessionToken("x".repeat(2000)), null);
});

test("expired sessions are refused", () => {
  process.env.NODE_ENV = "production";
  process.env.ADMIN_EMAIL = "steward@example.com";
  process.env.ADMIN_PASSWORD = "a-plain-secret";
  process.env.SESSION_SECRET = "0123456789abcdef0123456789abcdef";
  const token = createSessionToken("steward@example.com", Date.now() - 9 * 60 * 60 * 1000);
  assert.equal(verifySessionToken(token), null);
});

test("cookie attributes are hardened and follow the environment", () => {
  process.env.NODE_ENV = "production";
  process.env.SESSION_SECRET = "0123456789abcdef0123456789abcdef";
  const cookie = sessionCookieOptions();
  assert.equal(SESSION_COOKIE, "yrpm_admin");
  assert.equal(cookie.httpOnly, true);
  assert.equal(cookie.sameSite, "strict");
  assert.equal(cookie.secure, true);
  assert.equal(cookie.path, "/");
  assert.ok(cookie.maxAge > 0);

  process.env.NODE_ENV = "development";
  assert.equal(sessionCookieOptions().secure, false);
});

test("post-login redirects cannot leave the site", () => {
  assert.equal(safeNextPath("/dashboard"), "/dashboard");
  assert.equal(safeNextPath("/sermons/divine-service/x"), "/sermons/divine-service/x");
  assert.equal(safeNextPath("https://evil.example"), "/dashboard");
  assert.equal(safeNextPath("//evil.example"), "/dashboard");
  assert.equal(safeNextPath("/\\evil.example"), "/dashboard");
  assert.equal(safeNextPath("/\nevil"), "/dashboard");
  assert.equal(safeNextPath("/admin/login"), "/dashboard");
  assert.equal(safeNextPath(undefined), "/dashboard");
  assert.equal(safeNextPath({}), "/dashboard");
});

test("same-origin guard rejects foreign origins", () => {
  const make = (headers) => ({ headers: new Headers(headers) });
  assert.equal(
    isSameOrigin(make({ origin: "https://site.test", host: "site.test" })),
    true,
  );
  assert.equal(
    isSameOrigin(make({ origin: "https://evil.test", host: "site.test" })),
    false,
  );
  assert.equal(isSameOrigin(make({ host: "site.test" })), true);
  assert.equal(
    isSameOrigin(make({ "sec-fetch-site": "cross-site", host: "site.test" })),
    false,
  );
});

test("login throttling blocks after the configured attempts and recovers", () => {
  resetRateLimits();
  const key = "hashed-client";
  const start = 1_000_000;
  for (let i = 0; i < RATE_LIMIT.maxAttempts - 1; i += 1)
    recordFailure(key, start + i);
  assert.equal(checkRateLimit(key, start + 10).allowed, true);

  recordFailure(key, start + 20);
  const blocked = checkRateLimit(key, start + 30);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfter > 0);

  // Still blocked near the end of the window.
  assert.equal(
    checkRateLimit(key, start + RATE_LIMIT.windowMs - 1000).allowed,
    false,
  );
  // Allowed again once the window expires.
  assert.equal(
    checkRateLimit(key, start + RATE_LIMIT.windowMs + 60_000).allowed,
    true,
  );

  clearFailures(key);
  assert.equal(checkRateLimit(key, start + 40).allowed, true);
});
