import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  isSameOrigin,
  sessionCookieOptions,
} from "../../../admin/_lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  if (!isSameOrigin(request))
    return NextResponse.json(
      { ok: false, error: "Unexpected origin." },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );

  const response = NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set(SESSION_COOKIE, "", {
    ...sessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}
