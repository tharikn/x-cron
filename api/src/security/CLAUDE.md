# CLAUDE.md — `api/src/security/`

Cross-cutting API security for the job portal: **rate limits**, **HttpOnly cookie sessions**, **CSRF**, **one-tab binding**, **input protector**, **shared field validators**, **upload allow-list**, **privileged audit ring**.

Design map: [../../../docs/SECURITY_PRIVACY.md](../../../docs/SECURITY_PRIVACY.md).

## Guards / middleware order

1. **`CorrelationIdMiddleware`** (`SecurityModule.configure`, applied before the input protector so rejected requests still carry an id) — assign/echo `X-Request-Id` (`req.correlationId`); CORS exposes the header; validation 400s include `correlationId`
2. **`InputProtectorMiddleware`** (`SecurityModule.configure`) — rejects XSS / SQLi *payload* patterns, null bytes, prototype-pollution keys on JSON body + query (not English SQL keyword blacklists; Prisma stays parameterized — never interpolate UI into SQL)
3. **`SecurityThrottlerGuard`** — named throttlers (`default` / `auth` / `sensitive`)
4. **`CsrfGuard`** — double-submit when access cookie is present; **skipped** when `Authorization: Bearer` is present, or on auth bootstrap (`/auth/login|register|refresh|google|admin/login`) so a stale cookie cannot block re-login
5. **`AuthGuard`** — Bearer (preferred) or cookie access → `request.user` + tab binding; public routes do not hard-fail on `session_tab_mismatch` (stale cookie + new tab id)
6. **`RolesGuard`** — `@Roles(...)` RBAC

Clients send `X-Request-Id` via `correlationInterceptor`; `friendlyHttpMessage` may append `(ref: …)` for support.

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

## Upload hardening (`upload-guard.ts`)

Admin import uploads: allow-list CSV/TXT/PDF/PNG/JPEG/WEBP, magic-byte checks, reject SVG/HTML, **8MB** cap (`UPLOAD_MAX_BYTES`). Wired from `ingestion` controller limits + `IngestionService.uploadFile`.

## Audit (`audit.service.ts`)

Provided + exported from global `SecurityModule` (injectable in `AuthService` / `AccountService` / `IngestionService`). In-process ring (≤500) + structured logs for `admin.login` / `admin.login_failed`, `account.export`, `account.delete`, `import.upload`. Not durable SIEM — upgrade before production launch.

## Env

`RATE_LIMIT_*`, `APPLY_RATE_LIMIT_*`, `APPLY_DAILY_CAP`, `AI_HELP_RATE_LIMIT_*`, `AUTH_COOKIE_SAMESITE`, `AUTH_COOKIE_SECURE`, `AUTH_SINGLE_TAB` (default `1`), `AUTH_SINGLE_SESSION` (default `1`).

`REDIS_URL` + `REDIS_THROTTLE_ENABLED` (default on when URL set) → `@nest-lab/throttler-storage-redis` for multi-instance counters; unset → in-memory Nest storage.

Production: `helmet` HSTS when `NODE_ENV=production` (`main.ts`).

Update `.env.example`, `.env`, and `env-dev` when changing keys.
