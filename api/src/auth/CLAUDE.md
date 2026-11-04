# CLAUDE.md — `api/src/auth`

Session auth + RBAC for X Cron API. In-memory users/sessions (+ optional Prisma `AUTH_STORE`/`JOBS_STORE=prisma` hydrate).

## Guards (global `APP_GUARD` order)

1. **`SecurityThrottlerGuard`** — rate limits (`api/src/security/`)
2. **`CsrfGuard`** — double-submit when access cookie present
3. **`AuthGuard`** — HttpOnly `xcron_access` cookie **or** Bearer → `request.user`; enforces `X-Tab-Id` when `AUTH_SINGLE_TAB=1`
4. **`RolesGuard`** — `@Roles('seeker'|'employer'|'admin')`. Missing role → **403**. No session on a role route → **401**.

**Rule:** `@Public()` never bypasses `@Roles()`. Admin APIs must use `@Roles('admin')` — never trust the client.

## Tokens + cookies

| Token | Transport | TTL |
| --- | --- | --- |
| access | HttpOnly `xcron_access` + optional `Authorization: Bearer` | `AUTH_ACCESS_TTL_MINUTES` (default **15**) |
| refresh | HttpOnly `xcron_refresh` + optional `POST /auth/refresh` body | SiteConfig `sessionTtlDays` |
| CSRF | readable `xcron_csrf` + request header `X-CSRF-Token` | follows refresh |

Sign-in (`register`, `login`, `google`, `admin/login`) returns `{ token, refreshToken, expiresAt, user, employer }` **and** sets cookies.  
Refresh **rotates** both tokens and invalidates the old refresh. Logout / account delete revoke the pair + clear cookies.

**First login after account create:** `register` and Google `isNewUser` fire `NotificationsService.onUserFirstLogin` (welcome + day-0 profile-complete nudge). Re-logins do not re-send. Day 1–N profile reminders: see `notifications` scheduler.

**Single session:** new sign-in revokes other refresh sessions (`AUTH_SINGLE_SESSION=1`).  
**One tab:** clients send `X-Tab-Id`; mismatch → **401** `session_tab_mismatch`.

**Local auth (beginner default):** username + password (scrypt). No email/SMS OTP.  
`POST /auth/register` requires `confirmPassword` match. Optional `intendedRole` = `seeker` (default) or `employer` (Recruiter) — clients collect this on Create account. Username: `^[a-z0-9_]{3,32}$` (stored lowercase). Password hashes live on `User.passwordHash` / `passwordSalt` — never on public DTOs.

**Google idToken:** verify once on `POST /auth/google`, then discard — clients must **not** store it.

## Endpoints

| Method | Path | Access | Throttle |
| --- | --- | --- | --- |
| POST | `/v1/auth/register` | Public | auth (~10/min) |
| POST | `/v1/auth/login` | Public | auth (~10/min) |
| POST | `/v1/auth/google` | Public | auth |
| POST | `/v1/auth/admin/login` | Public (super-admin password) | **sensitive 1/hour** |
| POST | `/v1/auth/refresh` | Public (refresh cookie/body) | auth |
| GET | `/v1/auth/me` | Authenticated | default |
| POST | `/v1/auth/logout` | Authenticated | default |

Admin role is granted **only** via `SUPER_ADMIN_EMAIL` + `SUPER_ADMIN_PASSWORD` password login — not Google/register/login.

## Agent rules

- Prefer `@Roles(...)` on controllers; do not re-implement ad-hoc role checks unless ownership (resource) checks.
- Clients prefer cookies + `withCredentials`; keep short-lived Bearer in memory; sessionStorage refresh fallback for cross-origin local; on 401 try `/auth/refresh` once. Clear after API restart (in-memory).
- On logout / failed refresh: clients call `POST /devices/unlink` so FCM stops targeting that user.
- Keep `.env.example` keys: `SUPER_ADMIN_*`, `ADMIN_IDENTITIES`, `GOOGLE_CLIENT_ID`, `AUTH_ACCESS_TTL_MINUTES`, `AUTH_COOKIE_*`, `AUTH_SINGLE_*`, `RATE_LIMIT_*`.
- Persistence: `AUTH_STORE=prisma` hydrates `username` / password digests + sessions; migration `20261104233000_user_password_auth`. Concurrent `persistUser` + `persistSession`/`persistEmployer` share `ensureUserRow` (ignore Prisma `P2002` on `User.id`) so session/employer rows still write.
