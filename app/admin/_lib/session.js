// Server-only auth core. No Next.js imports here so it can be unit tested.
// Replace the credential check with your identity provider when the backend lands.
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "yrpm_admin";
export const DEFAULT_SESSION_HOURS = 8;

const DEV_EMAIL = "admin@yrpm.local";
const DEV_PASSWORD = "studio-preview";

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

/** Compares equal-length buffers without leaking timing information. */
export function safeEqual(a, b) {
  const left = Buffer.from(String(a ?? ""));
  const right = Buffer.from(String(b ?? ""));
  if (left.length !== right.length) {
    // Still run a comparison so a wrong-length guess is not measurably faster.
    timingSafeEqual(right, right);
    return false;
  }
  return timingSafeEqual(left, right);
}

/**
 * Reads admin credentials from the environment.
 * - `ADMIN_PASSWORD` is a quick start; `ADMIN_PASSWORD_HASH` + `ADMIN_PASSWORD_SALT` is preferred.
 * - Development falls back to a printed demo login so the studio can be reviewed.
 * - Production without configuration locks the studio instead of guessing.
 */
export function adminConfig() {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  const hash = (process.env.ADMIN_PASSWORD_HASH || "").trim().toLowerCase();
  const salt = process.env.ADMIN_PASSWORD_SALT || "";
  const configured = Boolean(email && (password || (hash && salt)));
  if (configured)
    return { email, password, hash, salt, configured: true, source: "env" };
  if (!isProduction())
    return {
      email: DEV_EMAIL,
      password: DEV_PASSWORD,
      hash: "",
      salt: "",
      configured: true,
      source: "development",
    };
  return {
    email,
    password: "",
    hash: "",
    salt: "",
    configured: false,
    source: "unconfigured",
  };
}

export function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(String(password), salt, 64).toString("hex");
  return { hash, salt };
}

/** Always performs the same work shape so failures do not reveal which field was wrong. */
export function verifyCredentials(email, password) {
  const config = adminConfig();
  if (!config.configured) return false;
  const emailOk = safeEqual(
    String(email ?? "").trim().toLowerCase(),
    config.email,
  );
  const passwordOk = config.hash && config.salt
    ? safeEqual(scryptSync(String(password ?? ""), config.salt, 64).toString("hex"), config.hash)
    : safeEqual(password, config.password);
  return emailOk && passwordOk;
}

export function sessionHours() {
  const value = Number(process.env.ADMIN_SESSION_HOURS);
  return Number.isFinite(value) && value > 0 && value <= 72
    ? value
    : DEFAULT_SESSION_HOURS;
}

function sessionSecret() {
  const configured = process.env.SESSION_SECRET;
  if (configured && configured.length >= 16) return configured;
  const scope = globalThis;
  if (!scope.__yrpmSessionSecret) {
    scope.__yrpmSessionSecret = randomBytes(32).toString("hex");
    if (isProduction())
      console.warn(
        "[admin] SESSION_SECRET is not set. Sessions will be invalidated when this process restarts.",
      );
  }
  return scope.__yrpmSessionSecret;
}

const encode = (value) => Buffer.from(value).toString("base64url");
const sign = (body) =>
  createHmac("sha256", sessionSecret()).update(body).digest("base64url");

export function createSessionToken(email, now = Date.now()) {
  const payload = {
    sub: String(email || "").toLowerCase(),
    v: 1,
    iat: now,
    exp: now + sessionHours() * 60 * 60 * 1000,
    jti: randomBytes(9).toString("base64url"),
  };
  const body = encode(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

/** Returns the payload for a valid, unexpired, correctly signed token; otherwise null. */
export function verifySessionToken(token, now = Date.now()) {
  if (typeof token !== "string" || !token || token.length > 1200) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, signature] = parts;
  if (!body || !signature) return null;
  if (!safeEqual(signature, sign(body))) return null;
  let payload;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (!payload || payload.v !== 1) return null;
  if (typeof payload.exp !== "number" || payload.exp <= now) return null;
  if (typeof payload.sub !== "string" || !payload.sub) return null;
  return payload;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict",
    secure: isProduction(),
    path: "/",
    maxAge: sessionHours() * 60 * 60,
  };
}

/** Only same-site absolute paths are allowed as post-login destinations. */
export function safeNextPath(value) {
  if (typeof value !== "string") return "/dashboard";
  if (!value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  if (value.includes("\\") || value.includes("\n") || value.includes("\r"))
    return "/dashboard";
  if (value.startsWith("/admin")) return "/dashboard";
  return value.slice(0, 300);
}

/** Same-origin check for state-changing requests (defence in depth with SameSite=Strict). */
export function isSameOrigin(request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }
  const fetchSite = request.headers.get("sec-fetch-site");
  return !fetchSite || fetchSite === "same-origin" || fetchSite === "none";
}

export function clientKey(request) {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const ip = forwarded.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
  return createHmac("sha256", "yrpm-rate-limit").update(ip).digest("hex").slice(0, 32);
}
