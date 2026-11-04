# CLAUDE.md — `api/src/security/`

Cross-cutting API security for the job portal: **rate limits**, **HttpOnly cookie sessions**, **CSRF**, **one-tab binding**.

## Guards (global `APP_GUARD` order — see `app.module` + this module)

1. **`SecurityThrottlerGuard`** — named throttlers (`default` / `auth` / `sensitive`)
2. **`CsrfGuard`** — double-submit when access cookie is present
3. **`AuthGuard`** — cookie or Bearer access → `request.user` + tab binding
4. **`RolesGuard`** — `@Roles(...)` RBAC

## Cookies

| Cookie | HttpOnly | Role |
| --- | --- | --- |
| `xcron_access` | yes | Short access token |
| `xcron_refresh` | yes | Refresh token |
| `xcron_csrf` | no | Double-submit CSRF twin |

Clients must send `credentials: 'include'` and `X-CSRF-Token` (from `xcron_csrf`) on mutating cookie-auth calls. Bearer-only (no access cookie) skips CSRF for Capacitor/native.

## One tab

- Client sends `X-Tab-Id` (sessionStorage UUID).
- Session stores `tabId`; mismatch → **401** `session_tab_mismatch`.
- New sign-in **revokes** other sessions for that user (single concurrent session).

## Throttle decorators

| Decorator | Use |
| --- | --- |
| `@AuthThrottle()` | register / login / Google / refresh / AI enrich / channel pull (~10/min) |
| `@ApplyThrottle()` | Job apply burst (~5/min); pair with `APPLY_DAILY_CAP` in applications |
| `@SensitiveThrottle()` | **1 / hour** — admin login, account delete, payment `dev/confirm`, notification `dev/*` |
| `@NoThrottle()` | Health only |

## Env

`RATE_LIMIT_*`, `APPLY_RATE_LIMIT_*`, `APPLY_DAILY_CAP`, `AUTH_COOKIE_SAMESITE`, `AUTH_COOKIE_SECURE`, `AUTH_SINGLE_TAB` (default `1`), `AUTH_SINGLE_SESSION` (default `1`).

Update `.env.example`, `.env`, and `env-dev` when changing keys.
