# Authentication and Access Control (X Cron)

Identity, sessions, RBAC, and account safety for the NestJS API and clients
(Angular web + Ionic/Capacitor Android). Adapted from the job-portal auth
checklist to **what X Cron actually ships** in this MVP.

## 1. Supported identity methods

### MVP (shipped)

| Method | Purpose |
| --- | --- |
| Username + password | Primary credential for seekers and recruiters (`POST /v1/auth/register`, `/login`) |
| Optional Google sign-in | `POST /v1/auth/google` (stub email allowed in non-prod when `AUTH_GOOGLE_STUB=1`) |
| Super-admin password | `POST /v1/auth/admin/login` via `SUPER_ADMIN_EMAIL` + `SUPER_ADMIN_PASSWORD` only |

### Explicitly deferred

Email/phone OTP, password-reset tokens, passkeys, and enterprise SSO — OTP was
removed in R1; do not re-add without a product decision. Password reset is a
known gap (Option B/C).

## 2. Password and session security

### Passwords

- Hash with **Node `scrypt`** (salted); never encrypt, log, or return plaintext.
- Digests live on `User.passwordHash` / `passwordSalt` — never on public DTOs.
- Argon2id is acceptable later; scrypt meets the “bcrypt-class” bar for MVP.

### Session model

**One model:** short-lived access + rotating refresh (cookie and/or Bearer).

| Token | Transport | TTL |
| --- | --- | --- |
| access | HttpOnly `xcron_access` + optional `Authorization: Bearer` | `AUTH_ACCESS_TTL_MINUTES` (default **15**) |
| refresh | HttpOnly `xcron_refresh` + optional `POST /v1/auth/refresh` body | SiteConfig `sessionTtlDays` (seed **90**) |
| CSRF | readable `xcron_csrf` + `X-CSRF-Token` | follows refresh |

### Lifecycle controls (shipped)

- Refresh **rotates** on every successful use; old refresh is **retired**.
- **Reuse detection:** presenting a retired refresh revokes the entire
  **token family** (`refresh_token_reuse`) and drops live siblings.
- Logout current session (`POST /v1/auth/logout`).
- Logout **all** sessions (`POST /v1/auth/logout-all`).
- List / revoke sessions: `GET /v1/auth/sessions`, `DELETE /v1/auth/sessions/:sessionId`.
- New sign-in may revoke siblings when `AUTH_SINGLE_SESSION=1` (default).
- One browser tab when `AUTH_SINGLE_TAB=1` via `X-Tab-Id`.

### Client notes

| Surface | Rule |
| --- | --- |
| Web | Prefer cookies + `withCredentials`; CSRF on cookie mutations |
| Android | Bearer preferred; refresh in `@capacitor/preferences` via `TokenVaultService` (migrates legacy localStorage once) |
| Disabled accounts | Blocked on `getUserByToken`, refresh, and password/Google login |

## 3. OTP controls

**Not in MVP.** SiteConfig still stores `otpTtlMinutes` for future use; no OTP
issuance path remains in `api/src/auth`.

## 4. RBAC and resource-level authorisation

### Roles (X Cron)

| Role | Scope |
| --- | --- |
| `seeker` | Own profile, apply profiles, applications, saved jobs |
| `employer` | Jobs + applicants where `ownerUserId` / employer membership matches |
| `moderator` | Trust desk / Blog Approval / suspend / company verification — not Job Fare/ops/payments |
| `admin` | Platform ops + trust — only via super-admin password login |

Doc aliases `CANDIDATE` → `seeker`, `RECRUITER` → `employer`,
`PLATFORM_ADMIN` → `admin`, `MODERATOR` → `moderator`. Company workspace
roles (`owner` / `admin` / …) are separate from platform `moderator`.

### Enforcement layers

1. **Guards** (global): throttler → CSRF → `AuthGuard` → `RolesGuard`
2. **Service ownership** checks (`ownerUserId`, apply-profile `userId`, etc.)
3. **Never trust** client-supplied role / owner ids for authorisation

`@Public()` never bypasses `@Roles()`. Clients hide chrome after
`GET /v1/auth/me` only — see [`.cursor/skills/xcron-ui-auth/SKILL.md`](../.cursor/skills/xcron-ui-auth/SKILL.md).

## 5. Account lifecycle

```text
ACTIVE ↔ DISABLED   (CLOSED ≈ account wipe DELETE /v1/me)
```

| State | Behaviour |
| --- | --- |
| `active` | Full access per roles |
| `disabled` | Sessions revoked; login/refresh/`/me` fail; cannot use access tokens |
| Account delete | `DELETE /v1/me` — sessions + identities purged (see `account/`) |

Timed / indefinite suspensions use `AccountSuspension` + `User.status=disabled`
(see [ADMIN_TRUST_MODERATION.md](./ADMIN_TRUST_MODERATION.md)). Appeals:
`POST /v1/moderation/appeals` (+ Contact Admin Feedback for messaging).

## 6. API routes

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/v1/auth/register` | Username + password; `@AuthThrottle` |
| `POST` | `/v1/auth/login` | Username + password; `@AuthThrottle` |
| `POST` | `/v1/auth/google` | Optional IdP |
| `POST` | `/v1/auth/admin/login` | `@SensitiveThrottle` (1/hour) |
| `POST` | `/v1/auth/refresh` | Rotate; reuse → family revoke |
| `GET` | `/v1/auth/me` | Validated principal |
| `POST` | `/v1/auth/logout` | Current session |
| `POST` | `/v1/auth/logout-all` | All sessions for principal |
| `GET` | `/v1/auth/sessions` | Active sessions (no secrets) |
| `DELETE` | `/v1/auth/sessions/:sessionId` | Revoke one; clears cookies if current |

Persistence: `AUTH_STORE=prisma` hydrates users/sessions + `RevokedRefreshToken`
(migration `20261107103000_auth_session_family_reuse`).

## 7. Acceptance criteria

| Criterion | Status |
| --- | --- |
| Brute-force login rate-limited / lockout | Done (`@AuthThrottle` + store lockout) |
| Refresh rotation + reuse detection tested | Done (`auth.store.spec.ts`) |
| Disabled accounts cannot keep a live session | Done |
| Users can list / revoke sessions + logout-all | Done (API + Account **Devices & sessions** on web/mobile) |
| Mobile refresh not left in WebView localStorage | Done (`TokenVaultService` + Capacitor Preferences) |
| Cross-owner IDOR fails at service layer | Done (existing ownership checks) |
| Password reset / OTP / Argon2 | Deferred (Option C) |

## Related

- Agent guide: [`api/src/auth/CLAUDE.md`](../api/src/auth/CLAUDE.md)
- Security cookies/CSRF: [`api/src/security/CLAUDE.md`](../api/src/security/CLAUDE.md)
- Guest / role chrome: [`.cursor/skills/xcron-ui-auth/SKILL.md`](../.cursor/skills/xcron-ui-auth/SKILL.md)
