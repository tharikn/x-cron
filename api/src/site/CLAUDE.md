# CLAUDE.md — `api/src/site`

Public site chrome + admin-tunable config. Runtime is **Prisma `SiteConfig`** (JSON rows by key); in-memory cache for sync reads. Seed files apply only when a key is missing on boot.

## Keys

| Key | Shape | Public GET | Admin PUT |
| --- | --- | --- | --- |
| `footer` | brand, addresses, social, links | `GET /v1/site/footer` | `PUT /v1/admin/site/footer` |
| `commerce` | `unlockPricePaise`, `paymentsEnabled` (`postJob*` forced none/0) | `GET /v1/site/commerce` | `PUT /v1/admin/site/commerce` |
| `auth` | `sessionTtlDays`, `otpTtlMinutes` | `GET /v1/site/auth` | `PUT /v1/admin/site/auth` |

## Persistence

- Source of truth: Postgres table `xcron.SiteConfig` (`key` + `value` JSON).
- Settings UI (`web` `/settings/site`) writes commerce + auth via admin PUT; values survive API restart.
- First boot (missing key): insert from `seed-*.ts` constants (not env). Do not re-read `UNLOCK_PRICE_PAISE` / `SESSION_TTL_*` at runtime.

## Auth TTLs

- Defaults (seed only): **90** days session (sliding on refresh), 10 minutes OTP.
- Bounds: session 1–365 days; OTP 1–60 minutes.
- `SiteStore` syncs TTLs into `AuthStore.setAuthTtls()` on boot and on admin update.
- Changing TTLs does **not** rewrite existing session `expiresAt` values.
- Web Site config (`/settings/site`) edits commerce + auth for admins (Settings hub tab). User tabs: language / preferences / account.

## Agent rules

- Do not put private contacts in footer/commerce/auth docs.
- Keep seed files aligned with Prisma `SiteConfig` key names.
- Prefer extending this module over scattering app config elsewhere.
