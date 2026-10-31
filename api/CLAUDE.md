# CLAUDE.md — `api/` (NestJS)

X Cron Jobs **modular monolith** API. Prefix: `/v1/*`. OpenAPI: `http://localhost:3000/docs`.

Parent monorepo context: [../CLAUDE.md](../CLAUDE.md) · [../docs/DEVELOPER.md](../docs/DEVELOPER.md) · [../docs/FILE_MAP.md](../docs/FILE_MAP.md)

## Commands

```bash
npm install --legacy-peer-deps
npm run start:dev          # watch — :3000
npm run build              # nest build
npm run start:prod         # node dist/main
npm run lint
npm run test
npm run test:e2e
npm run prisma:validate
npm run prisma:generate
```

Optional Postgres: from repo root `docker compose up -d`, then `npm run prisma:migrate` (DDL in schema `xcron`, not `public`; **runtime still memory** unless `JOBS_STORE=prisma`).

## Architecture

- NestJS 11 + `ConfigModule` + global `ValidationPipe` + global `AuthGuard`
- Mark public routes `@Public()`; role routes `@Roles('seeker'|'employer'|'admin')`
- Feature modules under `src/`: `auth`, `jobs`, `ingestion`, `payments`, `preferences`, `notifications`, `ads`, `ops`, `seeker`, `account`, `health`
- Typical pattern per feature: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.store.ts` (in-memory), `*.types.ts`, `dto/`
- **Public job DTOs** via `jobs/jobs.mapper.ts` — never serialize `privateContact`
- Contact reveal: `GET /v1/jobs/:id/contact` requires auth + entitlement; `Cache-Control: no-store`
- Payments: Razorpay **stub**; webhook HMAC; stub confirm `POST /v1/payments/dev/confirm` when `PAYMENT_MODE=stub`
- Subscriptions grant `subscription_contact` (unlimited unlocks while valid)
- Prisma: `prisma/schema.prisma` + versioned `prisma/migrations/*` (deploy with `npm run prisma:migrate`) — do not assume DB persistence in handlers today

## Important env (`../api/.env` / `.env.example`)

`PORT`, `JOBS_STORE=memory`, `DATABASE_URL`, `CORS_ORIGINS`, `UNLOCK_PRICE_PAISE`, `ADMIN_IDENTITIES`, `PAYMENT_MODE`, `RAZORPAY_WEBHOOK_SECRET`, quota/budget vars for `ops`

Admin demo identity: `admin@xcron.local` (dev OTP `123456`).

## When changing code

- New endpoint → DTO with `class-validator`, wire module in `app.module.ts` if new feature
- Job publish → may trigger `NotificationsService.onJobPublished`; search may use `AdsService.activeBoosts()`
- Quotas: import batches + contact unlocks consult `OpsService` where wired
- Account wipe: `account/` clears payments/prefs/seeker + auth user
- Prefer extending existing modules over new cross-cutting frameworks
- Do not commit real secrets; keep `.env.example` updated when adding env keys

## Smoke hints

```text
GET  /v1/health
POST /v1/auth/otp/start → verify (devCode)
GET  /v1/jobs
POST /v1/jobs/:id/contact-orders → /payments/dev/confirm → GET contact
POST /v1/subscriptions/checkout → confirm
GET  /v1/feed · POST /v1/me/saved-jobs/:id · DELETE /v1/me
```
