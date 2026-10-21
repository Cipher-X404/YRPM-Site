// Server-only glue between the auth core and Next.js request APIs.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "./session";

export async function getSession() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Authoritative gate for every admin surface. Runs on the server for each request. */
export async function requireAdmin(nextPath = "/dashboard") {
  const session = await getSession();
  if (!session) {
    redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`);
  }
  return session;
}
