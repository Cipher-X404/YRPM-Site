import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./app/admin/_lib/session";

/**
 * First-line gate at the request edge.
 * Unauthenticated requests to `/dashboard` get an HTTP redirect to `/admin/login`
 * before React begins streaming. The server component layout and page still call
 * `requireAdmin()` as a second, independent check.
 */
export function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const session = verifySessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  if (pathname.startsWith("/dashboard") && !session) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(login, {
      status: 307,
      headers: { "Cache-Control": "no-store" },
    });
  }

  if (pathname === "/admin/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url), {
      status: 307,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/login"],
};
