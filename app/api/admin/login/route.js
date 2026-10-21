import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  adminConfig,
  clientKey,
  createSessionToken,
  isSameOrigin,
  sessionCookieOptions,
  verifyCredentials,
} from "../../../admin/_lib/session";
import {
  checkRateLimit,
  clearFailures,
  recordFailure,
} from "../../../admin/_lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = {
  "Cache-Control": "no-store, no-cache, must-revalidate, private",
  Pragma: "no-cache",
};

function fail(status, error, extra = {}) {
  return NextResponse.json(
    { ok: false, error, ...extra },
    { status, headers: noStore },
  );
}

export async function POST(request) {
  if (!isSameOrigin(request))
    return fail(403, "This request came from an unexpected origin.");

  const config = adminConfig();
  if (!config.configured)
    return fail(
      503,
      "Admin access is not configured on this deployment. Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH.",
    );

  const key = clientKey(request);
  const limit = checkRateLimit(key);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many attempts. Wait a few minutes before trying again.",
        retryAfter: limit.retryAfter,
      },
      {
        status: 429,
        headers: { ...noStore, "Retry-After": String(limit.retryAfter) },
      },
    );
  }

  const raw = await request.text();
  if (raw.length > 2048) return fail(413, "That request was too large.");

  let body;
  try {
    body = JSON.parse(raw || "{}");
  } catch {
    return fail(400, "Send a JSON body with email and password.");
  }

  const email = typeof body?.email === "string" ? body.email.slice(0, 320) : "";
  const password =
    typeof body?.password === "string" ? body.password.slice(0, 400) : "";

  if (!email || !password) {
    recordFailure(key);
    return fail(400, "Enter both your email and password.");
  }

  // Small constant delay smooths over hash/crypto timing differences.
  const startedAt = Date.now();
  const valid = verifyCredentials(email, password);
  const elapsed = Date.now() - startedAt;
  if (elapsed < 250) await new Promise((r) => setTimeout(r, 250 - elapsed));

  if (!valid) {
    recordFailure(key);
    const after = checkRateLimit(key);
    return fail(401, "Email or password is incorrect.", {
      remaining: after.remaining,
    });
  }

  clearFailures(key);
  const response = NextResponse.json(
    { ok: true, email: email.trim().toLowerCase() },
    { headers: noStore },
  );
  response.cookies.set(
    SESSION_COOKIE,
    createSessionToken(config.email),
    sessionCookieOptions(),
  );
  return response;
}
