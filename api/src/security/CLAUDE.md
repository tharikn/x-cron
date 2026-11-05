# CLAUDE.md — `api/src/security/`

Cross-cutting API security for the job portal: **rate limits**, **HttpOnly cookie sessions**, **CSRF**, **one-tab binding**, **input protector**, **shared field validators**.

## Guards / middleware order

1. **`InputProtectorMiddleware`** (`SecurityModule.configure`) — rejects XSS / SQLi *payload* patterns, null bytes, prototype-pollution keys on JSON body + query (not English SQL keyword blacklists; Prisma stays parameterized — never interpolate UI into SQL)
2. **`SecurityThrottlerGuard`** — named throttlers (`default` / `auth` / `sensitive`)
3. **`CsrfGuard`** — double-submit when access cookie is present; **skipped** when `Authorization: Bearer` is present (Capacitor / cross-origin cannot read `xcron_csrf` via `document.cookie`)
4. **`AuthGuard`** — Bearer (preferred) or cookie access → `request.user` + tab binding; public routes do not hard-fail on `session_tab_mismatch` (stale cookie + new tab id)
5. **`RolesGuard`** — `@Roles(...)` RBAC

## Validation (`validation/`)

| Piece | Role |
| --- | --- |
| `patterns.ts` | India-first email / phone / pincode / salary / URL helpers + stable `MSG` strings |
| `decorators.ts` | `@IsXcronEmail` `@IsXcronPhone` `@IsXcronPincode` `@IsXcronSalaryText` `@IsXcronUrl` `@IsSafeText` |
| `sanitize.ts` | `@SanitizeText` / `@SanitizeOptionalText` — trim, strip controls, optional HTML strip |
| `validation-exception.filter.ts` | Global filter + `validationFailedException` → `{ message: "Validation failed", errors: { field: msg } }` |

Wired in `main.ts`: `ValidationPipe` (`whitelist` + `forbidNonWhitelisted` + `exceptionFactory`) + `ValidationExceptionFilter`.

Use the shared decorators on auth / seeker / jobs / applications / apply-profiles / ingestion contact+text DTOs. Keep job-detail public contacts unmasked on clients.

## Cookies

| Cookie | HttpOnly | Role |
| --- | --- | --- |
| `xcron_access` | yes | Short access token |
| `xcron_refresh` | yes | Refresh token |
| `xcron_csrf` | no | Double-submit CSRF twin |

Clients must send `credentials: 'include'` and `X-CSRF-Token` (from `xcron_csrf`) on mutating **cookie-only** auth calls. Requests with `Authorization: Bearer` skip CSRF (native Capacitor + cross-origin web dual-auth). Token util prefers Bearer over access cookie when both are sent.

## One tab

- Client sends `X-Tab-Id` (sessionStorage UUID).
- Session stores `tabId`; mismatch → **401** `session_tab_mismatch`.
- New sign-in **revokes** other sessions for that user (single concurrent session).

## Throttle decorators

| Decorator | Use |
| --- | --- |
| `@AuthThrottle()` | register / login / Google / refresh / AI enrich / channel pull (~10/min) |
| `@ApplyThrottle()` | Job apply burst (~5/min); pair with `APPLY_DAILY_CAP` in applications |
| `@ChatThrottle()` | In-app AI help chat (~3/min); pair with per-user cooldown + token budget |
| `@SensitiveThrottle()` | **1 / hour** — admin login, account delete, payment `dev/confirm`, notification `dev/*` |
| `@NoThrottle()` | Health only |

## Env

`RATE_LIMIT_*`, `APPLY_RATE_LIMIT_*`, `APPLY_DAILY_CAP`, `AI_HELP_RATE_LIMIT_*`, `AUTH_COOKIE_SAMESITE`, `AUTH_COOKIE_SECURE`, `AUTH_SINGLE_TAB` (default `1`), `AUTH_SINGLE_SESSION` (default `1`).

Update `.env.example`, `.env`, and `env-dev` when changing keys.
