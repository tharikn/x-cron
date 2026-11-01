# CLAUDE.md — `api/src/auth`

Session auth + RBAC for X Cron API. In-memory users/sessions (reset on API restart).

## Guards (global `APP_GUARD` order)

1. **`AuthGuard`** — Bearer **access** token → `request.user`; rejects unauthenticated calls unless `@Public()` and no `@Roles()`.
2. **`RolesGuard`** — enforces `@Roles('seeker'|'employer'|'admin')`. Missing role → **403**. No session on a role route → **401**.

**Rule:** `@Public()` never bypasses `@Roles()`. Admin APIs must use `@Roles('admin')` — never trust the client.

## Tokens

| Token | Use | TTL |
| --- | --- | --- |
| `token` (access) | `Authorization: Bearer` | `AUTH_ACCESS_TTL_MINUTES` (default **15**) |
| `refreshToken` | `POST /v1/auth/refresh` body only — **not** accepted as Bearer | SiteConfig `sessionTtlDays` (default **30**) |

Sign-in (`otp/verify`, `google`, `admin/login`) returns `{ token, refreshToken, expiresAt, user, employer }`.  
Refresh **rotates** both tokens and invalidates the old refresh. Logout / account delete revoke the pair.

## Endpoints

| Method | Path | Access |
| --- | --- | --- |
| POST | `/v1/auth/otp/start`, `/otp/verify` | Public |
| POST | `/v1/auth/google` | Public |
| POST | `/v1/auth/admin/login` | Public (super-admin password) |
| POST | `/v1/auth/refresh` | Public (valid refresh token) |
| GET | `/v1/auth/me` | Authenticated (access) |
| POST | `/v1/auth/logout` | Authenticated (access) |

Admin role is granted **only** via `SUPER_ADMIN_EMAIL` + `SUPER_ADMIN_PASSWORD` password login — not Google/OTP.

## Agent rules

- Prefer `@Roles(...)` on controllers; do not re-implement ad-hoc role checks unless ownership (resource) checks.
- Clients store both tokens; on 401 try `/auth/refresh` once before clearing the session. Clear after API restart (in-memory).
- Keep `.env.example` keys: `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`, `ADMIN_IDENTITIES`, `GOOGLE_CLIENT_ID`, `AUTH_ACCESS_TTL_MINUTES`.
