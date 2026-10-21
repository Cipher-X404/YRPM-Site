# Admin Access & Backend Handoff

`/dashboard` is restricted to authenticated administrators. It is not linked anywhere on the public site, is excluded from search engines (`robots.txt` + `X-Robots-Tag: noindex, nofollow, noarchive` + `Cache-Control: no-store`), and is gated at two server layers before any studio UI is sent.

## How to sign in

1. Open **`/admin/login`** (or navigate to **`/dashboard`**, which issues an HTTP `307` redirect to `/admin/login?next=%2Fdashboard`).
2. In **development** (`NODE_ENV !== "production"`), if no `ADMIN_*` environment variables are set, the login screen displays a local preview account:
   - Email: `admin@yrpm.local`
   - Password: `studio-preview`
3. In **production**, the demo fallback is disabled. If `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` + `ADMIN_PASSWORD_SALT` (or `ADMIN_PASSWORD`) are not set, `/admin/login` renders a locked screen and `/api/admin/login` returns `503`.

## Setting production credentials

Generate an `scrypt` password hash and salt:

```bash
npm run admin:hash -- "your long passphrase"
```

Then set these in `.env.local` (or your hosting provider's environment settings):

```ini
ADMIN_EMAIL=steward@yourdomain.org
ADMIN_PASSWORD_HASH=<printed hex hash>
ADMIN_PASSWORD_SALT=<printed hex salt>
SESSION_SECRET=<openssl rand -hex 32>
ADMIN_SESSION_HOURS=8
```

## Security measures in place today

| Layer | Implementation |
| --- | --- |
| Request-edge gate | `proxy.js` verifies the `yrpm_admin` HMAC-SHA256 session cookie on `/dashboard/*` and `/admin/login` and returns `307` before React streams. |
| Server-component gate | `app/dashboard/layout.js` and `app/dashboard/page.js` both call `requireAdmin()` (`dynamic = "force-dynamic"`, `revalidate = 0`). |
| Password verification | `scryptSync` (64-byte key) + `crypto.timingSafeEqual` over both email and password in `app/admin/_lib/session.js`, plus a minimum 250 ms response floor on `/api/admin/login`. |
| Session token | Versioned payload (`{ sub, v, iat, exp, jti }`) signed with HMAC-SHA256 (`SESSION_SECRET`) and stored in an `HttpOnly; SameSite=Strict; Path=/` cookie (`Secure` in production). |
| Brute-force protection | `app/admin/_lib/rateLimit.js` caps failed logins at 5 attempts per 15-minute window per HMAC-hashed client IP and returns `429` with `Retry-After`. |
| CSRF & open-redirect protection | `isSameOrigin()` checks `Origin` / `Sec-Fetch-Site` on `/api/admin/login` and `/api/admin/logout`; `safeNextPath()` restricts `next` redirects to same-site paths outside `/admin`. |
| HTTP headers | `next.config.js` sets `Content-Security-Policy`, `Referrer-Policy`, `X-Content-Type-Options: nosniff`, `Permissions-Policy`, `Cross-Origin-Resource-Policy: same-origin`, `Strict-Transport-Security` (prod), `X-Robots-Tag`, and `Cache-Control: no-store` on admin/dashboard routes, and disables `X-Powered-By` and production browser source maps. |

## Swapping in your backend later

All auth decisions live in three small server files:

1. **`app/admin/_lib/session.js`** — replace `verifyCredentials(email, password)` with a database or identity-provider lookup, and replace `createSessionToken` / `verifySessionToken` if you move to server-stored sessions or JWTs from your backend.
2. **`app/admin/_lib/rateLimit.js`** — replace the in-memory `Map` with Redis / Upstash or your database so rate limits are shared across serverless instances.
3. **`app/sermons/_data/studio.js` & `studioAudio.js`** — replace the `localStorage` / `IndexedDB` persistence helpers with `fetch()` calls to your backend API (every studio action already flows through `saveSermon`, `deleteSermon`, `duplicateSermon`, `importJSON`, and `saveAudioBlob`).
