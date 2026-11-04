# CLAUDE.md — `api/` (NestJS)

X Cron Jobs **modular monolith** API. Prefix: `/v1/*`. OpenAPI: `http://localhost:3000/docs`.

Parent monorepo context: [../CLAUDE.md](../CLAUDE.md) · [../docs/DEVELOPER.md](../docs/DEVELOPER.md) · [../docs/FILE_MAP.md](../docs/FILE_MAP.md)

## Commands

```bash
npm install --legacy-peer-deps
npm run start:dev          # watch — :3000
npm run build              # prisma generate && nest build (avoids stale client on Render cache)
npm run start:prod         # node dist/main
npm run lint
npm run test
npm run test:e2e
npm run prisma:validate
npm run prisma:generate
```

Optional Postgres: from repo root `docker compose up -d`, then `npm run prisma:migrate` (DDL in schema `xcron`, not `public`). Set `JOBS_STORE=prisma` to persist jobs + bulk import. `NOTIFICATIONS_STORE` / `PAYMENTS_STORE` default to following `JOBS_STORE` when unset (auth/prefs stay memory). Higher-env deploys must run `prisma generate` before `nest build` and `prisma migrate deploy` so Job columns like `lat`/`lng`/`walkInAt`/`applyBy` exist in both client types and Postgres.

## Architecture

- NestJS 11 + `ConfigModule` + global `ValidationPipe` + global `AuthGuard` + `RolesGuard`
- Mark public routes `@Public()`; role routes `@Roles('seeker'|'employer'|'admin')` — `@Public()` never bypasses `@Roles()`
- Clients must validate sessions via `GET /v1/auth/me` on boot; on 401 try `POST /v1/auth/refresh` once before clearing (stale tokens after API restart still clear)
- Feature modules under `src/`: `ai`, `auth`, `jobs`, `ingestion`, `channels`, `payments`, `preferences`, `notifications`, `ads`, `ops`, `seeker`, `account`, `health`
- Ads house seed (`ads.store`): labelled placements only — do not seed “unlock contact” copy; seeker UI shows public contacts with no paywall
- Job Fare channel pull (`src/channels/`, see [src/channels/CLAUDE.md](src/channels/CLAUDE.md)): free Telegram Bot + WhatsApp paste bridge → digest → ingestion; design [../docs/CHANNEL_PULL.md](../docs/CHANNEL_PULL.md)
- Optional job-text AI enrich (`src/ai/`, see [src/ai/CLAUDE.md](src/ai/CLAUDE.md)): Telegram/OCR noise strip, field mapping (`salaryText` / `vacancies` / `contactWebsite` / language), bullet-line `description`, chat `instruction` on import/post/moderation when `AI_ENRICH_ENABLED=1`; channel digests use `splitJobs` so multi-recruitment Telegram posts become separate import rows
- Admin moderation edit: `PATCH /v1/admin/jobs/:id` (Blog Approval desk)
- Typical pattern per feature: `*.module.ts`, `*.controller.ts`, `*.service.ts`, dual `*.store` (memory + prisma where wired), `*.types.ts`, `dto/`
- **Public job DTOs** via `jobs/jobs.mapper.ts` — include phone/email/whatsapp/website from `privateContact` (no unlock gate for seekers)
- Legacy contact reveal still exists: `GET /v1/jobs/:id/contact` (auth + entitlement; `Cache-Control: no-store`) — unused by current clients
- Payments: Strategy/Adapter (`PAYMENT_GATEWAY=stub|upi|razorpay`); SiteConfig `paymentsEnabled` + `postJobPaymentMode`; history + CSV/PDF admin export; hardened `POST /v1/payments/dev/confirm` (blocked in production); `PAYMENTS_STORE=prisma` persists orders/entitlements/history. Used for post-job fees / subscriptions; job contact unlock is not in the seeker UI. Skill: [../.cursor/skills/xcron-payments/SKILL.md](../.cursor/skills/xcron-payments/SKILL.md) · [src/payments/CLAUDE.md](src/payments/CLAUDE.md)
- Notifications: Strategy/Adapter push (`PUSH_PROVIDER=stub|fcm` + optional `FIREBASE_SERVICE_ACCOUNT_*`) + mail (`MAIL_PROVIDER=stub|console|smtp`); job publish → subscriber fan-out with dispatch/delivery history; `NOTIFICATIONS_STORE=prisma` persists devices/prefs/inbox/dispatches. Live FCM required for Android tray when app is closed. See [src/notifications/CLAUDE.md](src/notifications/CLAUDE.md)
- Prisma: `prisma/schema.prisma` + versioned `prisma/migrations/*` (deploy with `npm run prisma:migrate`). Jobs/ingestion/notifications/payments use Prisma when their `*_STORE=prisma` (or `JOBS_STORE` fallback).
- **DDL rule:** new persistent columns/tables must update `schema.prisma` **and** add `prisma/migrations/<ts>_<name>/migration.sql` so higher envs can store/retrieve — see [../.cursor/skills/xcron-claude-md/SKILL.md](../.cursor/skills/xcron-claude-md/SKILL.md) § Prisma / migrations.

## Important env (`api/.env` / `.env.example` / `api/env-dev`)

Whenever you change env keys: update **`.env.example`**, local **`.env`**, and **`env-dev`**. `env-dev` is **live prod URLs only** (Render web/API, prod DB/CORS/gateways) — no localhost. See [../.cursor/skills/xcron-claude-md/SKILL.md](../.cursor/skills/xcron-claude-md/SKILL.md).

`PORT`, `JOBS_STORE=memory|prisma`, `NOTIFICATIONS_STORE` / `PAYMENTS_STORE` (default: follow `JOBS_STORE`), `DATABASE_URL`, `CORS_ORIGINS`, `ADMIN_IDENTITIES`, `AUTH_ACCESS_TTL_MINUTES` (Bearer access TTL; default 15), `PAYMENT_GATEWAY` / `PAYMENT_MODE`, `PAYMENT_UPI_VPA` / `PAYMENT_UPI_PAYEE_NAME` / `PAYMENT_UPI_ALLOW_DEV_CONFIRM`, `RAZORPAY_WEBHOOK_SECRET`, `PUSH_PROVIDER` / `MAIL_PROVIDER` / `NOTIFICATION_FANOUT_BATCH`, quota/budget vars for `ops`, `OCR_PROVIDER`, `AI_ENRICH_ENABLED` / `AI_ENRICH_PROVIDER` / `AI_ENRICH_API_KEY` (off by default; free Groq or local Ollama), `TELEGRAM_BOT_TOKEN` / `TELEGRAM_MODE` / `CHANNEL_SCHEDULE_ENABLED` / `CHANNEL_PULL_OWNER_USER_ID` (Job Fare; optional). Unlock price + refresh TTLs live in Prisma `SiteConfig` (Settings UI), not env.

Site config (`src/site/`, see [src/site/CLAUDE.md](src/site/CLAUDE.md)): Prisma `SiteConfig` keys `footer` / `commerce` / `auth` (Settings UI persists; seed only if missing). Auth `sessionTtlDays` = refresh token TTL; OTP TTL separate. See [src/auth/CLAUDE.md](src/auth/CLAUDE.md).

Admin demo identity: `admin@xcron.local` (dev OTP `123456`).

## When changing code

- New endpoint → DTO with `class-validator`, wire module in `app.module.ts` if new feature
- Job publish → may trigger `NotificationsService.onJobPublished`; search may use `AdsService.activeBoosts()`
- Quotas: import batches + contact unlocks consult `OpsService` where wired
- Account wipe: `account/` clears payments/prefs/seeker/notifications + auth user
- Prefer extending existing modules over new cross-cutting frameworks
- Do not commit real secrets into `.env.example`; when adding env keys also update `env-dev` (prod URLs only)

## Smoke hints

```text
GET  /v1/health
POST /v1/auth/otp/start → verify (devCode) → refreshToken
POST /v1/auth/refresh
GET  /v1/jobs
POST /v1/subscriptions/checkout → confirm
GET  /v1/feed · POST /v1/me/saved-jobs/:id · DELETE /v1/me
GET/PATCH /v1/me/profile · POST /v1/me/applications/:jobId · POST /v1/me/hidden-jobs/:jobId
GET/POST /v1/me/saved-searches · GET /v1/employers/:id/public · POST /v1/employers/jobs/:id/renew
GET  /v1/jobs?remote=&postedWithin=&nearLat=&nearLng=&radiusKm=&walkInOnly=&sort=distance
GET  /v1/channels/workflow · POST /v1/channels/messages/manual · POST /v1/channels/pull
```

Seeker retention (profile, applications, hidden, saved searches): [src/seeker/CLAUDE.md](src/seeker/CLAUDE.md).
Employer self-serve job CRUD uses `@Roles('employer','admin')` (not admin-only).
