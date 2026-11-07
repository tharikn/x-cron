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
npm run test               # Jest unit specs (src/**/*.spec.ts)
npm run test:e2e           # Nest scaffold — currently broken (Jest CJS vs ESM @nestjs/config); use root `npm run test:e2e:api`
npm run prisma:validate
npm run prisma:generate
```

Optional Postgres: from repo root `docker compose up -d`, then `npm run prisma:migrate` (DDL in schema `xcron`, not `public`). Set `JOBS_STORE=prisma` to persist jobs + bulk import. `NOTIFICATIONS_STORE` / `PAYMENTS_STORE` default to following `JOBS_STORE` when unset (auth/prefs stay memory). Higher-env deploys must run `prisma generate` before `nest build` and `prisma migrate deploy` so Job columns like `lat`/`lng`/`walkInAt`/`applyBy` exist in both client types and Postgres.

## Architecture

- NestJS 11 + `ConfigModule` + global `ValidationPipe` + `SecurityModule` (throttler + CSRF) + `AuthGuard` + `RolesGuard`
- Mark public routes `@Public()`; role routes `@Roles('seeker'|'employer'|'admin')` — `@Public()` never bypasses `@Roles()`
- Cookie sessions (`xcron_access` / `xcron_refresh` / `xcron_csrf`) + Bearer fallback; one-tab via `X-Tab-Id`; see [src/security/CLAUDE.md](src/security/CLAUDE.md) · [src/auth/CLAUDE.md](src/auth/CLAUDE.md)
- Auth dual store: `AUTH_STORE=prisma|memory` (default follow `JOBS_STORE`) — persists User/Session/Employer so mobile refresh survives API restart
- Rate limits: default ~120/min; `@AuthThrottle` ~10/min; `@SensitiveThrottle` **1/hour** (admin login / account wipe / payment+notification dev); Redis-backed counters when `REDIS_URL` + `REDIS_THROTTLE_ENABLED`
- Optional Redis (`src/redis/`, see [src/redis/CLAUDE.md](src/redis/CLAUDE.md) · [../docs/REDIS.md](../docs/REDIS.md)): public job/company cache-aside, BullMQ notification queues, feedback presence; unset `REDIS_URL` = memory/inline MVP path (`docker compose up -d redis` for local)
- Clients must validate sessions via `GET /v1/auth/me` on boot (`withCredentials` + tab/CSRF headers); on 401 try `POST /v1/auth/refresh` once before clearing; sliding refresh extends `sessionTtlDays` (seed **90**)
- Feature modules under `src/`: `ai`, `auth`, `companies`, `jobs` (lifecycle + auto-expire + PG FTS — see [src/jobs/CLAUDE.md](src/jobs/CLAUDE.md)), `ingestion`, `channels`, `payments`, `preferences`, `notifications`, `outbox` ([src/outbox/CLAUDE.md](src/outbox/CLAUDE.md)), `files` ([src/files/CLAUDE.md](src/files/CLAUDE.md)), `ads`, `ops`, `seeker`, `apply-profiles`, `applications`, `feedback`, `tracking`, `reputation`, `account`, `health`, `config` (Zod env validate), `observability` (optional OTel)
- Architecture map: [../docs/SYSTEM_ARCHITECTURE.md](../docs/SYSTEM_ARCHITECTURE.md)
- Company workspace (`src/companies/`, see [src/companies/CLAUDE.md](src/companies/CLAUDE.md)): Employer = company; membership, verification, invites, recruiter dashboard; design [../docs/COMPANY_WORKSPACE.md](../docs/COMPANY_WORKSPACE.md)
- Feedback hub (`src/feedback/`, see [src/feedback/CLAUDE.md](src/feedback/CLAUDE.md)): public FAQ + Contact Admin messenger (seeker/recruiter ↔ admin); `FEEDBACK_STORE` follows `JOBS_STORE`; design [../docs/FEEDBACK.md](../docs/FEEDBACK.md)
- User tracking (`src/tracking/`, see [src/tracking/CLAUDE.md](src/tracking/CLAUDE.md)): access / heartbeat / search / share / apply / page_view; admin `/admin/tracking/*`; `TRACKING_STORE` follows `JOBS_STORE`; design [../docs/TRACKING.md](../docs/TRACKING.md)
- Trust & moderation (`src/moderation/`, see [src/moderation/CLAUDE.md](src/moderation/CLAUDE.md)): cases/queues, reports, risk signals, suspensions, appeals, trust audit; `moderator` role + web `/admin/trust`; `MODERATION_STORE` follows `JOBS_STORE`; design [../docs/ADMIN_TRUST_MODERATION.md](../docs/ADMIN_TRUST_MODERATION.md)
- Ads house seed (`ads.store`): labelled placements only — do not seed “unlock contact” copy; seeker UI shows public contacts with no paywall
- Performance Score (`src/reputation/`, see [src/reputation/CLAUDE.md](src/reputation/CLAUDE.md)): seeker + employer trust score; apply fit % + chat/review discipline; design [../docs/PERFORMANCE_SCORE.md](../docs/PERFORMANCE_SCORE.md)
- Job Fare channel pull (`src/channels/`, see [src/channels/CLAUDE.md](src/channels/CLAUDE.md)): free Telegram Bot + WhatsApp paste bridge → digest → ingestion; design [../docs/CHANNEL_PULL.md](../docs/CHANNEL_PULL.md)
- Free job import integrations (`src/integrations/`, see [src/integrations/CLAUDE.md](src/integrations/CLAUDE.md)): Excel/CSV templates, Partner Job API (`/v1/partner/*`), HTTPS XML/JSON feed crawl, Zapier/ATS webhook + Google Sheet CSV pull → import review; design [../docs/JOB_IMPORT_INTEGRATIONS.md](../docs/JOB_IMPORT_INTEGRATIONS.md)
- Optional job-text AI enrich (`src/ai/`, see [src/ai/CLAUDE.md](src/ai/CLAUDE.md)): Telegram/OCR noise strip, field mapping (`salaryText` / `vacancies` / `contactWebsite` / language), bullet-line `description`, chat `instruction` on import/post/moderation when `AI_ENRICH_ENABLED=1`; channel digests use `splitJobs` so multi-recruitment Telegram posts become separate import rows
- In-app help chatbot (`src/ai/help/`, see [src/ai/help/CLAUDE.md](src/ai/help/CLAUDE.md)): signed-in floating FAB; free/low Groq model; `@ChatThrottle` + per-user cooldown + daily token budget when `AI_HELP_ENABLED=1`
- Admin moderation edit: `PATCH /v1/admin/jobs/:id` (Blog Approval desk)
- Typical pattern per feature: `*.module.ts`, `*.controller.ts`, `*.service.ts`, dual `*.store` (memory + prisma where wired), `*.types.ts`, `dto/`
- **Public job DTOs** via `jobs/jobs.mapper.ts` — include phone/email/whatsapp/website from `privateContact` (no unlock gate for seekers)
- Legacy contact reveal still exists: `GET /v1/jobs/:id/contact` (auth + entitlement; `Cache-Control: no-store`) — unused by current clients
- Payments: Strategy/Adapter (`PAYMENT_GATEWAY=stub|upi|razorpay`); SiteConfig `paymentsEnabled` (post-job fee removed — `postJobPaymentMode` always `none`); history + CSV/PDF admin export; hardened `POST /v1/payments/dev/confirm` (blocked in production); `PAYMENTS_STORE=prisma` persists orders/entitlements/history. Used for subscriptions (legacy unlock/post-order endpoints unused by clients). Skill: [../.cursor/skills/xcron-payments/SKILL.md](../.cursor/skills/xcron-payments/SKILL.md) · [src/payments/CLAUDE.md](src/payments/CLAUDE.md)
- Notifications: Strategy/Adapter push (`PUSH_PROVIDER=stub|fcm` + optional `FIREBASE_SERVICE_ACCOUNT_*`) + mail (`MAIL_PROVIDER=stub|console|smtp`); job publish → subscriber fan-out; ATS application actions → `onApplicationEvent`; first-login welcome + profile-complete nudges (`PROFILE_REMINDER_*`); `NOTIFICATIONS_STORE=prisma` persists devices/prefs/inbox/dispatches. Live FCM required for Android tray when app is closed. See [src/notifications/CLAUDE.md](src/notifications/CLAUDE.md)
- Job applications ATS (`src/applications/`, see [src/applications/CLAUDE.md](src/applications/CLAUDE.md)): seeker apply → employer review → offer letter with append-only timeline; separate from seeker contact markers; `APPLICATIONS_STORE` follows `JOBS_STORE`; apply requires ready apply-profile + contact (see [src/apply-profiles/CLAUDE.md](src/apply-profiles/CLAUDE.md)); optional job `screeningQuestion` requires `screeningAnswer`; public job DTO may include earned `hiringActivity` / `hiringActivityBadge` (Indeed/LinkedIn thresholds — never a public “low”; [../docs/HIRING_ACTIVITY.md](../docs/HIRING_ACTIVITY.md))
- Apply profiles (`src/apply-profiles/`): multi-version skill/project portfolios (no CV); `APPLY_PROFILES_STORE` follows `APPLICATIONS_STORE` / `JOBS_STORE`
- Seeker retention (`src/seeker/`): profile / saved jobs / hidden / contact markers / saved searches; `SEEKER_STORE` follows `JOBS_STORE` — dual memory + Prisma store
- Prisma: `prisma/schema.prisma` + versioned `prisma/migrations/*` (deploy with `npm run prisma:migrate`). Jobs/ingestion/notifications/payments/seeker use Prisma when their `*_STORE=prisma` (or `JOBS_STORE` fallback).
- **DDL rule:** new persistent columns/tables must update `schema.prisma` **and** add `prisma/migrations/<ts>_<name>/migration.sql` so higher envs can store/retrieve — see [../.cursor/skills/xcron-claude-md/SKILL.md](../.cursor/skills/xcron-claude-md/SKILL.md) § Prisma / migrations.

## Important env (`api/.env` / `.env.example` / `api/env-dev`)

Whenever you change env keys: update **`.env.example`**, local **`.env`**, and **`env-dev`**. `env-dev` is **live prod URLs only** (Render web/API, prod DB/CORS/gateways) — no localhost. See [../.cursor/skills/xcron-claude-md/SKILL.md](../.cursor/skills/xcron-claude-md/SKILL.md).

`PORT`, `JOBS_STORE=memory|prisma`, `NOTIFICATIONS_STORE` / `PAYMENTS_STORE` / `AUTH_STORE` / `APPLICATIONS_STORE` / `APPLY_PROFILES_STORE` / `SEEKER_STORE` / `REPUTATION_STORE` / `FEEDBACK_STORE` / `TRACKING_STORE` / `MODERATION_STORE` (default: follow `JOBS_STORE`), `MODERATOR_EMAILS` / `MODERATION_SCHEDULE_ENABLED` / `MODERATION_TICK_MS`, `REDIS_URL` / `REDIS_CACHE_ENABLED` / `REDIS_QUEUES_ENABLED` / `REDIS_THROTTLE_ENABLED` (optional; see [src/redis/CLAUDE.md](src/redis/CLAUDE.md)), `OUTBOX_ENABLED` / `OUTBOX_TICK_MS`, `SEARCH_FTS_ENABLED`, `FILE_STORAGE` / `FILE_LOCAL_DIR` / `FILE_S3_*`, `OTEL_ENABLED` / `OTEL_SERVICE_NAME`, `OPENAPI_EXPORT`, `DATABASE_URL`, `CORS_ORIGINS`, `ADMIN_IDENTITIES`, `AUTH_ACCESS_TTL_MINUTES` (cookie / Bearer access TTL; default 15), `AUTH_COOKIE_SAMESITE` / `AUTH_COOKIE_SECURE` / `AUTH_SINGLE_TAB` / `AUTH_SINGLE_SESSION`, `RATE_LIMIT_*`, `APPLY_RATE_LIMIT_*` / `APPLY_DAILY_CAP` / `APPLY_HOURLY_CAP` / `APPLY_COOLDOWN_MS` / `APPLY_IDENTICAL_NOTE_*` / `APPLY_VELOCITY_FLAG_*` (job apply anti-spam), `PAYMENT_GATEWAY` / `PAYMENT_MODE`, `PAYMENT_UPI_VPA` / `PAYMENT_UPI_PAYEE_NAME` / `PAYMENT_UPI_ALLOW_DEV_CONFIRM`, `RAZORPAY_WEBHOOK_SECRET`, `PUSH_PROVIDER` / `MAIL_PROVIDER` / `NOTIFICATION_FANOUT_BATCH` / `PROFILE_REMINDER_SCHEDULE_ENABLED` / `PROFILE_REMINDER_MAX_DAYS` / `PROFILE_REMINDER_TICK_MS`, quota/budget vars for `ops`, `OCR_PROVIDER`, `AI_ENRICH_ENABLED` / `AI_ENRICH_PROVIDER` / `AI_ENRICH_API_KEY` (off by default; free Groq or local Ollama), `AI_HELP_ENABLED` / `AI_HELP_PROVIDER` / `AI_HELP_MODEL` / `AI_HELP_DAILY_TOKEN_BUDGET` / `AI_HELP_COOLDOWN_MS` (in-app help; off by default; reuses enrich key when unset), `TELEGRAM_BOT_TOKEN` / `TELEGRAM_MODE` / `CHANNEL_SCHEDULE_ENABLED` / `CHANNEL_PULL_OWNER_USER_ID` (Job Fare; optional), `JOB_EXPIRE_SCHEDULE_ENABLED` / `JOB_EXPIRE_TICK_MS` (published → expired when past `expiresAt`), `JOB_FEED_SCHEDULE_ENABLED` / `JOB_FEED_TICK_MS` / `PARTNER_AUTO_PUBLISH` (free import integrations). Unlock price + refresh TTLs live in Prisma `SiteConfig` (Settings UI), not env.

Site config (`src/site/`, see [src/site/CLAUDE.md](src/site/CLAUDE.md)): Prisma `SiteConfig` keys `footer` / `commerce` / `auth` (Settings UI persists; seed only if missing). Auth `sessionTtlDays` = refresh token TTL; OTP TTL separate. See [src/auth/CLAUDE.md](src/auth/CLAUDE.md).

Admin demo identity: `SUPER_ADMIN_EMAIL` + `SUPER_ADMIN_PASSWORD` via `POST /v1/auth/admin/login`.

## When changing code

- New endpoint → DTO with `class-validator` (prefer `security/validation` `@IsXcron*` / `@IsSafeText` + sanitize transforms for PII/contact/text); wire module in `app.module.ts` if new feature. Validation 400s use field-keyed `errors` map via `validationFailedException`.
- Job publish → may trigger `NotificationsService.onJobPublished`; search may use `AdsService.activeBoosts()`
- Quotas: import batches + contact unlocks consult `OpsService` where wired
- Account wipe + export: `account/` — `GET /v1/me/export` (portable JSON) · `DELETE /v1/me` clears payments/prefs/seeker/apply-profiles/applications/feedback/reputation/notifications/tracking + auth user. Privacy/compliance map: [../docs/SECURITY_PRIVACY.md](../docs/SECURITY_PRIVACY.md)
- Prefer extending existing modules over new cross-cutting frameworks
- Do not commit real secrets into `.env.example`; when adding env keys also update `env-dev` (prod URLs only)

## Smoke hints

```text
GET  /v1/health
POST /v1/auth/register { username, password, confirmPassword } → session
POST /v1/auth/login { username, password } → refreshToken
POST /v1/auth/refresh
GET  /v1/auth/sessions · DELETE /v1/auth/sessions/:sessionId · POST /v1/auth/logout-all
GET  /v1/jobs
POST /v1/subscriptions/checkout → confirm
GET  /v1/feed · POST /v1/me/saved-jobs/:id · GET /v1/me/export · DELETE /v1/me
GET/PATCH /v1/me/profile · GET/POST /v1/me/apply-profiles · POST /v1/me/applications/:jobId · POST /v1/me/hidden-jobs/:jobId
POST /v1/jobs/:jobId/apply (requires applyProfileId; screeningAnswer if job has screeningQuestion) · GET /v1/me/job-applications · GET/POST …/messages · POST …/messages/read
GET /v1/conversations · GET/POST /v1/conversations/:id/messages · POST|PATCH /v1/conversations/:id/read
GET /v1/employers/jobs/:jobId/applications
GET /v1/employers/jobs · GET /v1/employers/jobs/:id/analytics?days=30 · POST /v1/jobs/:id/events `{ type:'view' }`
POST /v1/companies · GET/PATCH /v1/companies/:id · POST …/verification · POST …/invitations · GET …/members · GET /v1/recruiter/dashboard · POST /v1/company-invitations/:token/accept
GET/POST /v1/me/saved-searches · GET /v1/employers/:id/public · POST /v1/employers/jobs/:id/renew
GET  /v1/jobs?q=&skills=&verifiedEmployer=&fresher=&easyApply=&remote=&postedWithin=&nearLat=&nearLng=&radiusKm=&walkInOnly=&sort=relevance
GET  /v1/jobs/search · GET /v1/jobs/recommendations · POST /v1/jobs/:jobId/not-relevant
GET  /v1/channels/workflow · POST /v1/channels/messages/manual · POST /v1/channels/pull
GET  /v1/import-batches/template.csv · /template.xlsx
# Large CSV upload: IngestionPrismaStore.update uses createMany chunks + 120s tx (avoids P2028)
POST /v1/integrations/api-keys · feeds · webhooks · sheets/pull
POST /v1/partner/jobs (+ batch / :externalJobId) · POST /v1/integrations/webhooks/:token
GET  /v1/reputation/me · GET /v1/reputation/users/:userId?role=seeker|employer
GET  /v1/feedback/faq · GET/POST /v1/feedback/threads · POST /v1/feedback/threads/:id/typing · GET/POST /v1/admin/feedback/threads (+ typing)
POST /v1/tracking/events · GET /v1/admin/tracking/summary · GET /v1/admin/tracking/users
```

Seeker retention (profile, applications, hidden, saved searches): [src/seeker/CLAUDE.md](src/seeker/CLAUDE.md).  
Apply profile versions (no CV): [src/apply-profiles/CLAUDE.md](src/apply-profiles/CLAUDE.md).  
ATS apply + chat: [src/applications/CLAUDE.md](src/applications/CLAUDE.md).  
Feedback FAQ + Contact Admin: [src/feedback/CLAUDE.md](src/feedback/CLAUDE.md).  
User tracking: [src/tracking/CLAUDE.md](src/tracking/CLAUDE.md).  
Performance Score: [src/reputation/CLAUDE.md](src/reputation/CLAUDE.md).  
Employer self-serve job CRUD uses `@Roles('employer','admin')` (not admin-only); ownership via `ownerUserId`. Register/login with `intendedRole=employer` for Post — admin password only for Import/Job Fare/ops. `POST /v1/employers/jobs` (+ `/paste`) accept optional `directPublish: true` — recruiter privilege publishes as `published` + notification fan-out (skips Blog Approval); omit the flag for import/admin noise → `needs-review`. Employer `PATCH` ignores `status` (use activate/deactivate/hide/renew); `activate` only from `draft`/`expired` — never `needs-review`/`rejected`/`removed`. Local auth is username/password (no email/SMS OTP) — see [src/auth/CLAUDE.md](src/auth/CLAUDE.md).
Recruiter job analytics (`src/jobs/analytics/`, see [src/jobs/analytics/CLAUDE.md](src/jobs/analytics/CLAUDE.md)): `GET /employers/jobs` includes `analytics` totals; `GET /employers/jobs/:id/analytics` returns KPI + daily views/applied/contacted series; clients `POST /jobs/:id/events` on listing open. Prisma `JobViewEvent` when `JOBS_STORE=prisma`.
