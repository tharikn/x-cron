# X Cron Jobs — folder & file map

Inventory of the monorepo **by folder**, with a short purpose for each source path.  
Generated for developers. Excludes `node_modules/`, `dist/`, `www/`, `.git/`, and other build caches.

Also see: [DEVELOPER.md](./DEVELOPER.md) · [ROADMAP.md](./ROADMAP.md)

---

## Repository root

| Path | Purpose |
| --- | --- |
| `README.md` | Project overview, quick start, demo flows |
| `CLAUDE.md` | Root agent guide (monorepo rules) |
| `docker-compose.yml` | Local Postgres 16 + optional Redis 7 |
| `.gitignore` | Git ignore rules |
| `.github/workflows/api-build.yml` | CI: API build |
| `.github/workflows/mobile-build.yml` | CI: mobile build |
| `.github/workflows/web-build.yml` | CI: web build |
| `.cursor/skills/xcron-claude-md/SKILL.md` | Keep CLAUDE.md + docs/env/Prisma in sync on every change |
| `.cursor/skills/xcron-payments/SKILL.md` | Payment gateway Strategy/Adapter + UPI rules |
| `.cursor/skills/xcron-ui-auth/SKILL.md` | Guest vs signed-in nav/chrome (Settings/Notifications/Saved/Score) |

---

## `docs/` — product & engineering docs

| Path | Purpose |
| --- | --- |
| `docs/ROADMAP.md` | PRD release steps R0–R5 + MVP+ status |
| `docs/DEVELOPER.md` | Dev guide: modules, stubs, runbook, release gate |
| `docs/MVP_COMPLETE.md` | MVP checklist vs post-MVP gaps |
| `docs/COST_MODEL.md` | Low-cost ops / budget planning |
| `docs/MOBILE_MVP.md` | Early mobile MVP notes / AC mapping |
| `docs/FILE_MAP.md` | This file — folder-wise inventory |
| `docs/CHANNEL_PULL.md` | Job Fare Telegram / WA bridge design |
| `docs/PERFORMANCE_SCORE.md` | Seeker + recruiter Performance Score + E2E diagram |
| `docs/E2E.md` | Playwright one-command journeys + traditional QA pattern |
| `docs/HIRING_ACTIVITY.md` | Job-list hiring-activity badge (Indeed/LinkedIn thresholds; no “low”) |
| `docs/AUTHENTICATION.md` | Auth + sessions + RBAC design (X Cron-adapted checklist) |
| `docs/SECURITY_PRIVACY.md` | Threat model, controls, privacy/AI/DPDP, IR runbook, gap backlog |
| `docs/JOB_DISCOVERY.md` | Discovery Phase 1 — filters, ranking, match reasons, aliases, FTS |
| `docs/SYSTEM_ARCHITECTURE.md` | Doc 01 topology map — outbox, FTS, files, OTel, Redis |
| `docs/REDIS.md` | Optional Redis / BullMQ / cache |

---

## `api/` — NestJS API

### Config & tooling

| Path | Purpose |
| --- | --- |
| `api/package.json` | API deps & scripts |
| `api/package-lock.json` | Lockfile |
| `api/nest-cli.json` | Nest CLI config |
| `api/tsconfig.json` | TypeScript base |
| `api/tsconfig.build.json` | Build TS config |
| `api/eslint.config.mjs` | ESLint |
| `api/.prettierrc` | Prettier |
| `api/.env.example` | Env template (safe to commit) |
| `api/.env` | Local secrets/config (**do not commit secrets**) |
| `api/README.md` | API package readme |
| `api/CLAUDE.md` | Agent guide for NestJS API |

### `api/prisma/`

| Path | Purpose |
| --- | --- |
| `api/prisma/schema.prisma` | Postgres data model (User, Job, Payment, Entitlement, SavedJob, Subscription, SiteConfig, …) — schema ready; runtime still memory |

### `api/src/` — application code

| Path | Purpose |
| --- | --- |
| `api/src/main.ts` | Bootstrap, CORS, validation, Swagger `/docs`, rawBody for webhooks |
| `api/src/app.module.ts` | Root module — wires all feature modules |

#### `api/src/health/`

| Path | Purpose |
| --- | --- |
| `health.controller.ts` | `GET /v1/health` |

#### `api/src/ai/`

| Path | Purpose |
| --- | --- |
| `ai.module.ts` / `ai.service.ts` / `ai.controller.ts` | Job enrich + help chat routes |
| `help/*` | Signed-in in-app help (quota, providers, prompt) — see `help/CLAUDE.md` |
| `providers/*` · `prompts/*` | Job-enrich OpenAI-compatible + stub providers |
| `CLAUDE.md` | AI agent guide |

#### `api/src/redis/`

| Path | Purpose |
| --- | --- |
| `redis.module.ts` | Optional Redis + BullMQ root (when `REDIS_URL`) |
| `redis.service.ts` / `cache.service.ts` | ioredis client + cache-aside |
| `redis-keys.ts` / `redis.config.ts` / `redis.constants.ts` | Keys, flags, queue names |
| `queues/notification-queue.service.ts` | Enqueue fan-out / push / email |
| `CLAUDE.md` | Redis agent guide · design [REDIS.md](./REDIS.md) |

#### `api/src/config/` · `outbox/` · `files/` · `observability/`

| Path | Purpose |
| --- | --- |
| `config/env.validation.ts` | Zod fail-fast env schema |
| `outbox/*` | Transactional outbox + relay (job.published → notify) |
| `files/*` | `/v1/files` upload/download + local/stub/s3-mirror storage |
| `observability/otel.ts` | Optional OpenTelemetry console tracer |

#### `api/src/security/`

| Path | Purpose |
| --- | --- |
| `security.module.ts` | Global throttler (+ Redis storage when enabled) + CSRF + `CorrelationIdMiddleware` + `InputProtectorMiddleware` + `AuditService` |
| `correlation-id.middleware.ts` | Assign/echo `X-Request-Id` for support correlation |
| `audit.service.ts` | Privileged-access audit ring (admin login, export/delete, import upload) |
| `upload-guard.ts` | Import allow-list, magic bytes, size cap, SVG/HTML reject |
| `input-protector.middleware.ts` | Reject XSS/SQLi payload patterns, control chars, prototype pollution |
| `validation/patterns.ts` | India-first email/phone/pincode/salary/URL helpers |
| `validation/decorators.ts` | `@IsXcronEmail` / Phone / Pincode / Salary / Url / `@IsSafeText` |
| `validation/sanitize.ts` | Trim + strip controls / simple HTML transforms |
| `validation/validation-exception.filter.ts` | Field-keyed `{ errors }` validation 400s |
| `csrf.guard.ts` / `security-throttler.guard.ts` | CSRF + rate limits |
| `CLAUDE.md` | Security agent guide |

#### `api/src/auth/`

| Path | Purpose |
| --- | --- |
| `auth.module.ts` | Global auth module |
| `auth.controller.ts` | register/login (username+password), Google, admin login, refresh, me, logout, logout-all, sessions; employers + `admin/staff/roles` |
| `auth.service.ts` | Auth business logic |
| `auth.store.ts` | In-memory users, password digests, access+refresh sessions + family/reuse ledger, employers (company profile fields) |

#### `api/src/moderation/`

| Path | Purpose |
| --- | --- |
| `moderation.module.ts` | Trust desk module (memory\|prisma store) |
| `moderation.controller.ts` | Reports, cases, suspend, search, audit, admin config |
| `moderation.service.ts` | Queues, risk, appeals, suspensions, audit facade |
| `moderation.store.ts` / `*.memory-store.ts` / `*.prisma-store.ts` | Persistence |
| `risk-signals.ts` | Soft prioritisation flags |
| `moderation.scheduler.ts` | Timed suspension expiry |
| `dto/moderation.dto.ts` | Report / decide / suspend / config DTOs |
| `moderation.types.ts` | Case / report / audit / config types |
| `CLAUDE.md` | Agent guide · design [ADMIN_TRUST_MODERATION.md](./ADMIN_TRUST_MODERATION.md) |

#### `api/src/companies/`

| Path | Purpose |
| --- | --- |
| `companies.module.ts` | Company workspace module |
| `companies.controller.ts` | `/v1/companies`, invitations accept, recruiter dashboard, admin verification |
| `companies.service.ts` | Membership RBAC, verification, invites, dashboard |
| `companies.store.ts` | Members / invites / evidence / notes / interviews (memory + Prisma) |
| `companies.types.ts` | Roles, verification states, dashboard DTO |
| `dto/companies.dto.ts` | Create/patch/invite/verify DTOs |
| `CLAUDE.md` | Agent guide · design [COMPANY_WORKSPACE.md](./COMPANY_WORKSPACE.md) |
| `auth.store.spec.ts` | Refresh reuse, disabled users, session list/revoke unit tests |
| `mobile/.../token-vault.service.ts` | Capacitor Preferences refresh vault (native) |
| `auth.types.ts` | User / role / session / AuthTokens / PublicSession types |
| `auth.guard.ts` | Global Bearer access-token guard |
| `decorators.ts` | `@Public`, `@Roles`, `@CurrentUser`, `@AccessToken` |
| `dto/auth.dto.ts` | Register / login / employer / Google DTOs |

#### `api/src/jobs/`

| Path | Purpose |
| --- | --- |
| `jobs.module.ts` | Jobs feature module (+ analytics store wiring) |
| `jobs.controller.ts` | Search (+ `/jobs/search` alias), recommendations alias, not-relevant alias, detail, related, report, employer post, job events, analytics, admin moderation |
| `jobs-search.util.ts` | Shared filter / sort / paginate for memory + Prisma |
| `jobs-match.util.ts` | Deterministic ranking score + matchReasons (discovery) |
| `jobs.service.ts` | Job use-cases; hooks ads boosts + notifications on publish; myJobs analytics enrich; expireDueJobs |
| `jobs.lifecycle.ts` | Allowed status transitions (employer/admin/system) + listing-window helpers |
| `jobs.scheduler.ts` | In-process auto-expire watcher (`published` → `expired`) |
| `CLAUDE.md` | Job lifecycle / status map / env for agents |
| `jobs.memory-store.ts` | In-memory job repository |
| `jobs.mapper.ts` | Public DTO mapper (contacts + optional `screeningQuestion`) |
| `job.types.ts` | Job domain types (+ optional screening question) |
| `seed-jobs.ts` | Seed published jobs with private contacts |
| `analytics/*` | Recruiter listing views + analytics service/stores (see folder CLAUDE.md) |
| `dto/create-job.dto.ts` | Quick/paste create DTOs |
| `dto/job-event.dto.ts` | `POST /jobs/:id/events` body |
| `dto/job-analytics-query.dto.ts` | Analytics lookback `days` |
| `dto/search-jobs.dto.ts` | Search query DTO (skills/verified/fresher/easyApply/`q`) |
| `dto/moderation.dto.ts` | Approve/reject/report DTOs |

#### `api/src/ingestion/`

| Path | Purpose |
| --- | --- |
| `CLAUDE.md` | Bulk import / CSV RFC4180 / dedupe agent guide |
| `ingestion.module.ts` | Bulk import module |
| `ingestion.controller.ts` | Import-batch CRUD/upload/approve + public CSV/XLSX templates |
| `ingestion.service.ts` | Parse, Set dedupe, approve → needs-review jobs; `ingestDigestText` / `ingestDrafts` |
| `ingestion.store.ts` | In-memory batches/records |
| `ingestion.types.ts` | Batch/record types |
| `dto/ingestion.dto.ts` | Upload/approve DTOs |
| `parsers/parser.types.ts` | Parser interfaces |
| `parsers/parser.registry.ts` | Selects Excel / CSV / text / OCR stub |
| `parsers/excel.parser.ts` | Free SheetJS `.xlsx`/`.xls` → CSV column map |
| `parsers/csv.parser.ts` | CSV extractor (quoted newlines + `externalJobId` / WhatsApp columns) |
| `parsers/text.parser.ts` | Pasted WhatsApp/text extractor |
| `parsers/image-ocr.parser.ts` | Image/PDF OCR **stub** |

#### `api/src/integrations/`

| Path | Purpose |
| --- | --- |
| `CLAUDE.md` | Free Partner API / feeds / webhook agent guide |
| `integrations.module.ts` | Integration module |
| `integrations.controller.ts` | Employer API keys, feeds, webhooks, sheet pull |
| `partner.controller.ts` | `/v1/partner/*` machine Job API |
| `webhook.controller.ts` | Public Zapier/ATS inbound webhook |
| `integrations.service.ts` | Upsert, crawl, webhook/sheet ingest |
| `integrations.store.ts` | In-memory keys / feeds / webhooks / external refs |
| `integrations.scheduler.ts` | In-process feed crawl tick |
| `feed-parse.util.ts` | XML/JSON feed → drafts |
| `dto/integrations.dto.ts` | Integration DTOs |

#### `api/src/channels/`

| Path | Purpose |
| --- | --- |
| `CLAUDE.md` | Agent guide — free Telegram + WA bridge rules |
| `channels.module.ts` | Job Fare channel pull module |
| `channels.controller.ts` | `/v1/channels/*` admin + public Telegram webhook |
| `channels.service.ts` | Inbox, pull digests, schedule ownership |
| `channels.store.ts` | In-memory sources / messages / pulls |
| `channels.scheduler.ts` | 1m tick for morning/evening windows |
| `channels.types.ts` | Domain types + workflow stages |
| `dto/channels.dto.ts` | Source / manual message / schedule DTOs |
| `adapters/channel-provider.ts` | Provider interface |
| `adapters/telegram.adapter.ts` | Free Telegram Bot API (poll/webhook) |

#### `api/src/payments/`

| Path | Purpose |
| --- | --- |
| `payments.module.ts` | Payments + unlocks + subscriptions |
| `payments.controller.ts` | Contact orders, contact reveal, webhooks, plans, checkout, entitlements |
| `payments.service.ts` | Orders, entitlements, stub confirm, subscription grant |
| `payments.store.ts` | In-memory orders/entitlements/plans |
| `payments.types.ts` | Payment/entitlement/subscription types |
| `dto/payments.dto.ts` | Webhook / confirm / subscription DTOs |
| `providers/payment-provider.ts` | Provider interface |
| `providers/razorpay.stub.ts` | Razorpay adapter stub + HMAC verify |

#### `api/src/preferences/`

| Path | Purpose |
| --- | --- |
| `preferences.module.ts` | Preferences module |
| `preferences.controller.ts` | Guest device prefs + `/me/preferences` + claim |
| `preferences.service.ts` | Device/account preference store |
| `preferences.types.ts` | Preference record types (+ `theme`) |
| `dto/preferences.dto.ts` | Save/claim DTOs (+ `theme` enum) |

#### `api/src/notifications/`

| Path | Purpose |
| --- | --- |
| `notifications.module.ts` | In-app + push + mail notifications |
| `notifications.controller.ts` | Devices, prefs (incl. PATCH), inbox, read (POST/PATCH), admin dispatch history, dev |
| `notifications.service.ts` | Subscriber match → fan-out (inline or BullMQ); welcome/profile onboarding; quiet hours / daily cap |
| `notifications.scheduler.ts` | Hourly tick — profile-complete nudges for first N days |
| `processors/*` | BullMQ workers: fan-out / push / email (when `REDIS_QUEUES_ENABLED`) |
| `notifications.store.ts` | Devices, prefs, inbox, dispatch + delivery history |
| `notifications.types.ts` | Notification domain types |
| `dto/notifications.dto.ts` | Device/prefs/dev DTOs |
| `providers/push-provider.ts` | Push Strategy interface |
| `providers/push-provider.factory.ts` | `PUSH_PROVIDER` → stub/fcm |
| `providers/fcm.stub.ts` | Zero-cost FCM stub sender |
| `providers/fcm.provider.ts` | Live firebase-admin FCM (needs service account) |
| `providers/mail-provider.ts` | Mail Strategy interface |
| `providers/mail-provider.factory.ts` | `MAIL_PROVIDER` → stub/console/smtp |
| `providers/mail.stub.ts` | Zero-cost mail logger |
| `CLAUDE.md` | Agent guide for notification adapters |

#### `api/src/ads/`

| Path | Purpose |
| --- | --- |
| `ads.module.ts` | Ads + employer promotions |
| `ads.controller.ts` | Slots, events, packages, purchase, admin CRUD |
| `ads.service.ts` | Frequency caps, boosts, stub promo checkout |
| `ads.store.ts` | Placements, creatives, promotions |
| `ads.types.ts` | Ad/promo types |
| `dto/ads.dto.ts` | Event/purchase/admin DTOs |

#### `api/src/tracking/`

| File | Role |
| --- | --- |
| `tracking.module.ts` | User access / engagement analytics |
| `tracking.controller.ts` | `POST /tracking/events` · `GET /admin/tracking/*` |
| `tracking.service.ts` | Aggregate users, hours, engagement % |
| `tracking.store.ts` · `*.memory-store` · `*.prisma-store` | Dual store (`TRACKING_STORE`) |
| `tracking.types.ts` · `dto/tracking.dto.ts` | Event + admin list DTOs |
| `CLAUDE.md` | Agent guide |

#### `api/src/ops/`

| Path | Purpose |
| --- | --- |
| `ops.module.ts` | Global ops/metrics (admin) |
| `ops.controller.ts` | cost-model, metrics, quotas, scale |
| `ops.service.ts` | Cost lines, counters, quota views |
| `ops.store.ts` | Metric counters |
| `ops.types.ts` | Ops types |

#### `api/src/seeker/`

| Path | Purpose |
| --- | --- |
| `seeker.module.ts` | Seeker saved jobs + feed; `SEEKER_STORE` factory |
| `seeker.controller.ts` | `/v1/feed`, `/v1/me/saved-jobs`, `/v1/me/profile`, applications/hidden/saved-searches |
| `seeker.service.ts` | Save/unsave + prefs-based feed + profile career upsert; attaches `completion` checklist on GET/PATCH profile |
| `seeker.store.ts` | Abstract seeker store (profile / saved / hidden / searches) |
| `seeker.memory-store.ts` | In-memory seeker store |
| `seeker.prisma-store.ts` | Postgres seeker store (`SeekerProfile`, `SavedJob`, …) |
| `seeker.types.ts` | SeekerProfile career/personal fields + `ProfileCompletion` / `buildProfileCompletion` |
| `dto/seeker.dto.ts` | UpsertSeekerProfileDto + saved-search DTOs |

#### `api/src/applications/`

| Path | Purpose |
| --- | --- |
| `applications.module.ts` | ATS apply → offer letter |
| `applications.controller.ts` | Seeker apply (`@ApplyThrottle`) + employer review + `/v1/conversations*` aliases |
| `applications.service.ts` | Status machine + timeline + notify + anti-spam + reputation hooks |
| `applications.*.store.ts` | Memory / Prisma dual store (quota counts + cover-note history + matchPercent) |
| `applications.types.ts` | Statuses, events, transitions |
| `hiring-activity.util.ts` | Per-job high/medium hiring badge (public; omit when quiet) |
| `dto/applications.dto.ts` | Apply / transition / note DTOs |

#### `api/src/feedback/`

| Path | Purpose |
| --- | --- |
| `feedback.module.ts` | FAQ + Contact Admin messenger |
| `feedback.controller.ts` | Public FAQ + user threads + admin desk |
| `feedback.service.ts` | Facade: ownership, audience RBAC, notify admins/users |
| `feedback-presence.ts` | Ephemeral Online / Last active / typing tracker |
| `feedback.*.store.ts` | Memory / Prisma dual store (`FEEDBACK_STORE`) |
| `feedback.types.ts` | Thread / message / FAQ types |
| `faq/faq.provider.ts` | Strategy port for FAQ catalogs |
| `faq/static-faq.provider.ts` | Seeded FAQ (seeker + recruiter + general) |
| `dto/feedback.dto.ts` | Create thread / send message / typing / admin list query |
| `CLAUDE.md` | Agent guide |

#### `api/src/reputation/`

| Path | Purpose |
| --- | --- |
| `reputation.module.ts` | Performance Score (seeker + employer) |
| `reputation.controller.ts` | `GET /v1/reputation/me`, `GET /v1/reputation/users/:id` |
| `reputation.service.ts` | Event deltas, tips, bands |
| `match-score.util.ts` | Apply-time skills/experience fit % |
| `reputation.*.store.ts` | Memory / Prisma dual store |
| `reputation.types.ts` | Score / event / band helpers |
| `CLAUDE.md` | Agent guide |

#### `api/src/apply-profiles/`

| Path | Purpose |
| --- | --- |
| `apply-profiles.module.ts` | Multi-version apply profiles (no CV) |
| `apply-profiles.controller.ts` | `/v1/me/apply-profiles` CRUD |
| `apply-profiles.service.ts` | Versions + `assertReadyForApply` |
| `apply-profiles.*.store.ts` | Memory / Prisma dual store |
| `apply-profiles.types.ts` | Profile + snapshot helpers; skill limits 2–7 |

#### `api/src/account/`

| Path | Purpose |
| --- | --- |
| `account.module.ts` | Account export + deletion |
| `account.controller.ts` | `GET /v1/me/export`, `DELETE /v1/me`, `DELETE /v1/auth/me` |
| `account.service.ts` | Portable JSON export; wipe payments/prefs/seeker/apply-profiles/applications/feedback/reputation + auth user |
| `CLAUDE.md` | Account agent guide |

#### `api/src/site/`

| Path | Purpose |
| --- | --- |
| `site.module.ts` | Public site chrome (footer) |
| `site.controller.ts` | `GET /v1/site/footer`, admin `PUT /v1/admin/site/footer` |
| `site.service.ts` | Footer read/update use-cases |
| `site.store.ts` | In-memory footer document (mirrors Prisma `SiteConfig`) |
| `site.types.ts` | Footer DTO shapes |
| `seed-footer.ts` | Default brand, addresses, social + quick links |
| `dto/update-footer.dto.ts` | Admin upsert validation |

### `api/test/`

| Path | Purpose |
| --- | --- |
| `app.e2e-spec.ts` | Nest e2e smoke scaffold |
| `jest-e2e.json` | E2E Jest config |

---

## `mobile/` — Ionic + Capacitor + Angular

### Config & tooling

| Path | Purpose |
| --- | --- |
| `mobile/package.json` | Mobile deps & scripts |
| `mobile/package-lock.json` | Lockfile |
| `mobile/angular.json` | Angular workspace |
| `mobile/ionic.config.json` | Ionic project config |
| `mobile/ionic.starter.json` | Starter metadata |
| `mobile/capacitor.config.ts` | Capacitor app id / webDir / plugins |
| `mobile/tsconfig*.json` | TS configs (app/spec/e2e) |
| `mobile/eslint.config.js` | ESLint |
| `mobile/playwright.config.ts` | Playwright e2e |
| `mobile/vitest.config.mts` | Unit test (Vitest) |
| `mobile/CLAUDE.md` | Agent guide for Ionic/Capacitor mobile |
| `mobile/.browserslistrc` | Browser targets |
| `mobile/.editorconfig` / `.npmrc` / `.prettierignore` | Editor / npm / prettier |
| `mobile/.vscode/*` | VS Code workspace hints |

### `mobile/e2e/`

| Path | Purpose |
| --- | --- |
| `e2e/app.spec.ts` | Package-local Playwright smoke (brand). Full journeys → root `e2e/` |

### Root `e2e/` (Playwright journeys)

| Path | Purpose |
| --- | --- |
| `package.json` | `@playwright/test` package |
| `playwright.config.ts` | Projects: `api` (browserless, `testDir ./api`) + `mobile` (`:4200`) + `web` (`:4201`) + opt-in `android`; HTML + JSON + ISSUES reporters |
| `api/*.api.spec.ts` | `/v1` contract specs: platform, auth-sessions, discovery, applications, company-integrations, trust-tracking-privacy, admin |
| `helpers/api-client.ts` | API seed (register/login/job/apply/profile/`completeSeekerProfile`/feedback/company/invite) + exported `request` (429 `Retry-After` retry) |
| `helpers/env.ts` | Base URLs + path maps per client (incl. `/company`, web Trust/Tracking) |
| `helpers/android-device.ts` | ADB reverse + Playwright `_android` Chrome session |
| `helpers/theme-prompt.ts` | Skip first-open theme chooser for journeys |
| `pages/*.ts` | Page objects (auth, discover, job-detail, post-job, company, chrome) |
| `fixtures/test.ts` | Client-aware Playwright fixtures (android swaps to device Chrome) |
| `journeys/*.spec.ts` | Guest → seeker → recruiter → company → admin/routing journeys (`13-company-workspace`, `14-job-discovery`, `15-privacy-sessions-aliases`) |
| `reporters/issues-reporter.ts` | Writes `test-results/ISSUES.md` defect digest |
| `README.md` | How traditional apps structure this + one-command usage |
| `scripts/run-e2e.mjs` | Root orchestrator (`npm run test:e2e`) |
| `package.json` (repo root) | `test:e2e` / `:api` / `:mobile` / `:web` / `:android` / `:android:smoke` / `:report` |

### Unit specs (per package)

| Path | Purpose |
| --- | --- |
| `api/src/**/*.spec.ts` | Jest: jobs match/search/lifecycle, moderation risk signals, feed + CSV/Excel parsers, upload guard, token util, correlation middleware, validation patterns, env validation, outbox, redis keys, tracking service, auth store |
| `web/vitest.config.mts` · `web/src/app/core/utils/*.spec.ts` · `core/guards/guards.spec.ts` | Vitest via `ng test`: validators, friendly HTTP + support ref, format, CSRF, guards |
| `mobile/src/app/core/{utils,guards,interceptors,services}/*.spec.ts` | Vitest: same utils + guards, correlation interceptor, deep-link mapper |

### `mobile/src/` — app source

| Path | Purpose |
| --- | --- |
| `main.ts` | Angular bootstrap |
| `index.html` | Shell HTML + `#boot-splash` logo until Angular ready |
| `global.scss` | Global styles + shared text-control / ion-input chrome |
| `theme/variables.scss` | Ionic / brand CSS variables + light/warm `data-theme` variants |
| `test-setup.ts` | Test bootstrap |
| `environments/environment.ts` | Dev API URL |
| `environments/environment.prod.ts` | Prod API URL |
| `assets/icon/favicon.png` | Favicon |
| `assets/shapes.svg` | Decorative asset |

#### `mobile/src/app/`

| Path | Purpose |
| --- | --- |
| `app.component.ts/html/scss` | Root shell; hydrates prefs + device on init; dismisses boot + Capacitor splash |
| `app.component.spec.ts` | Unit test |
| `app.routes.ts` | Tab + page routes |

#### `mobile/src/app/tabs/`

| Path | Purpose |
| --- | --- |
| `tabs.page.ts/html/scss` | Bottom tabs: Discover / Post / Alerts / Settings / Sign in (Profile last) |

#### `mobile/src/app/core/`

| Path | Purpose |
| --- | --- |
| `models/job.model.ts` | Job / prefs client models |
| `data/mock-jobs.ts` | Offline fallback jobs |
| `utils/format.ts` | Salary/location/unlock formatters |
| `utils/xcron-nav-animation.ts` | Bottom→top Ionic `navAnimation` + tab-bar enter helper |
| `utils/job-form.validation.ts` | Post/import client regex (phone/email/URL/salary) |
| `utils/form-validation.ts` | Seeker profile client validators |
| `utils/friendly-http-message.ts` | Toasts + `fieldErrorsFromHttp` + optional `(ref: …)` correlation |
| `interceptors/correlation.interceptor.ts` | Send `X-Request-Id`; stamp errors for support refs |
| `services/deep-link.service.ts` | Map https / `xcron://` URLs → tab routes |
| `services/android-back.service.ts` | Hardware back → history / Discover / exit |
| `services/connectivity.service.ts` | Online/offline banner signal |
| `services/auth.service.ts` | Username/password + Google + admin auth client |
| `services/jobs.service.ts` | Search/post/moderation API client (`directPublish` on create) |
| `services/ai.service.ts` | Job enrich + in-app help client (`/v1/ai/*`, `/v1/ai/help/*`) |
| `services/preferences.service.ts` | Local + API prefs sync/claim (incl. `theme`) |
| `services/theme.service.ts` | Appearance preference → `html[data-theme]` |
| `services/onboarding.service.ts` | First-open theme prompt + seeker profile wizard gates / Remind later |
| `services/ingestion.service.ts` | Bulk import API client |
| `services/channels.service.ts` | Job Fare channel pull API client |
| `services/payments.service.ts` | Unlock + subscription client |
| `services/notifications.service.ts` | Device + inbox client; OS permission prompt/watch + `pushPermission` |
| `services/ads.service.ts` | Ad slots + promote packages |
| `services/seeker.service.ts` | Saved jobs, feed, profile (+ optional `completion`), contacted apps, saved searches, account delete |
| `services/app-update.service.ts` | Native APK update check vs GitHub Releases latest |

#### `mobile/src/app/pages/`

| Path | Purpose |
| --- | --- |
| `discover/*` | Guest search + labelled ad slot + pref prompt |
| `job-detail/*` | Detail, unlock, save, share, report, footer ad |
| `post-job/*` | Recruiter desk: Compose / Review / Preview + AI chat + direct publish confirm |
| `import-batch/*` | CSV / camera / clipboard import UI |
| `job-fare/*` | Admin Job Fare channel pull workflow (pipeline + schedule) |
| `preferences/*` | Job prefs + notification toggles (+ marketing consent) |
| `privacy/*` | In-app Privacy disclosure (`/tabs/privacy`) |
| `theme/*` | Settings Theme tab (system / light / dark / warm) |
| `profile-setup/*` | Seeker multi-step complete-profile wizard + congrats (`/onboarding/profile`) |
| `settings/*` | Settings hub segments (Language · Theme · Prefs · Saved) |
| `language/*` | Interface language picker |
| `saved-jobs/*` | Saved jobs list (Settings segment) |
| `notifications/*` | Inbox + channel toggles (tab) |
| `account/*` | Username/password account, employer, feed, saved, export/delete |
| `core/services/feedback.service.ts` | FAQ + Contact Admin client |
| `performance/*` | Performance Score screen (seeker + recruiter) |
| `employer-applications/*` | Employer applicant inbox (score + fit badges) |
| `my-jobs/*` | Recruiter posted-jobs list with views/applied/contacted |
| `my-job-analytics/*` | Per-job analytics board (KPI + daily funnel chart) |
| `applied-jobs/*` | Seeker Applied jobs list (`/tabs/applied`) |
| `application-detail/*` | ATS detail tabs (Overview · Chat · Timeline) + score/fit |
| `feedback/*` | FAQ + Contact Admin messenger |
| `admin-feedback/*` | Admin Contact Admin desk |

#### `mobile/src/app/shared/`

| Path | Purpose |
| --- | --- |
| `job-card/*` | Job list card (Featured + hiring-activity badges) |
| `pii-field/*` | Masked profile PII input + View/Hide; wash/radius/focus styled to match form controls |
| `theme-prompt/*` | First-open theme chooser overlay |
| `help-chat/*` | Signed-in floating help chatbot (messenger UI above tab bar) |
| `skeleton/*` | Layout-matched skeletons aligned with web (job-list, table, list variants, detail, score, analytics, top-bar api-loading) |

#### `mobile/src/app/home/`

| Path | Purpose |
| --- | --- |
| `home.page.*` | Legacy starter home (routes use tabs/discover) |

### `mobile/android/` — Capacitor Android project

| Path / area | Purpose |
| --- | --- |
| `android/app/src/main/AndroidManifest.xml` | Permissions (camera, notifications) + https / `xcron://` deep-link intent filters |
| `android/app/src/main/java/com/xcron/jobs/MainActivity.java` | Main activity |
| `android/app/src/main/res/**` | Icons, branded splash (`splash.xml` + `splash_logo`), styles, strings |
| `capacitor.config.ts` | Capacitor app id + SplashScreen / LocalNotifications / Push plugins |
| `android/app/src/main/assets/**` | Capacitor config + **synced web build** assets |
| `android/app/build.gradle` | App Gradle |
| `android/build.gradle` / `settings.gradle` / `variables.gradle` | Project Gradle |
| `android/gradlew*` / `gradle/wrapper/**` | Gradle wrapper |
| `android/capacitor.settings.gradle` | Capacitor Android settings |
| `android/capacitor-cordova-android-plugins/**` | Cordova/Capacitor plugin bridge |
| `android/app/src/test/**` / `androidTest/**` | Example Android tests |

> Note: `android/.../assets/public/chunk-*.js` are **generated** web bundles from `cap sync`, not hand-edited source.

---

## `web/` — Angular SSR public site

### Config

| Path | Purpose |
| --- | --- |
| `web/package.json` | Web deps & scripts |
| `web/package-lock.json` | Lockfile |
| `web/angular.json` | Angular workspace |
| `web/tsconfig*.json` | TS configs |
| `web/.editorconfig` / `.prettierrc` / `.gitignore` | Tooling |
| `web/.vscode/*` | Launch/tasks/extensions |
| `web/README.md` | Web package readme |
| `web/CLAUDE.md` | Agent guide for Angular SSR web |
| `web/public/favicon.ico` | Favicon |
| `web/public/brand/xcron-logo-mark-square.png` | Square brand mark for browser OS notifications |
| `mobile/src/assets/icon/xcron-logo-mark-square.png` | Square brand mark (mobile browser Notification icon) |
| `mobile/android/.../drawable/ic_notification_large.png` | Android expanded notification large icon (X Cron square) |
| `mobile/android/.../drawable/ic_stat_xcron.xml` | Android status-bar white silhouette for LocalNotifications / FCM |
| `web/public/downloads/` | Local smoke APK (gitignored) + pointer `version.json` + README — **prod APK = GitHub Releases** |
| `web/scripts/sync-apk.mjs` | Local-only debug APK copy for `ng serve` smoke |
| `.github/workflows/android-release.yml` | Tag `v*` → build APK → GitHub Release + notes + assets |
| `scripts/apk-release-manifest.mjs` | Writes `version.json` + release body `xcron-manifest` fence |
| `scripts/release-apk.mjs` | Bump `versionCode`/`versionName` + optional `--ship` (commit/tag/push) for APK Releases |
| `scripts/setup-fcm.mjs` | Wires free FCM after google-services + service account files are present |
| `docs/FCM_SETUP.md` | Free Firebase / FCM setup for closed-app push |

### `web/src/`

| Path | Purpose |
| --- | --- |
| `main.ts` | Browser bootstrap |
| `main.server.ts` | Server bootstrap |
| `server.ts` | Express SSR + `/sitemap.xml` + robots |
| `index.html` | Shell |
| `styles.scss` | Global styles + dark/light/warm `data-theme` tokens + shared text-control chrome |
| `environments/environment.ts` | Dev API / site URL |
| `environments/environment.prod.ts` | Prod env |

#### `web/src/app/`

| Path | Purpose |
| --- | --- |
| `app.ts` / `app.html` / `app.scss` | Root shell; drawer last item Sign in / profile name → `/sign-in` |
| `app.config.ts` | Client app config |
| `app.config.server.ts` | Server app config |
| `app.routes.ts` | Client routes + Doc 10 UX aliases |
| `app.routes.server.ts` | SSR route rules |
| `core/models/job.model.ts` | Job model |
| `core/services/jobs.service.ts` | Jobs API client |
| `core/services/seo.service.ts` | Title/meta/canonical |
| `core/services/ads.service.ts` | Home ad rail client |
| `core/services/site.service.ts` | Public footer config client (`GET /site/footer`) |
| `core/services/connectivity.service.ts` | Online/offline banner signal |
| `core/interceptors/correlation.interceptor.ts` | Send `X-Request-Id`; stamp errors for support refs |
| `core/models/site.model.ts` | Footer config types |
| `core/utils/format.ts` | Display helpers |
| `core/utils/friendly-http-message.ts` | Map network/HTTP noise to end-user toast copy + `(ref: …)` |
| `core/services/toast.service.ts` | Shell toast stack (premium error = red panel) |
| `pages/home/*` | SEO home + search; cards navigate to `/jobs/:slug` |
| `pages/privacy/*` | Privacy disclosure (`/privacy`, also `/settings/privacy`) |
| `pages/terms/*` | Terms disclosure (`/terms`) |
| `pages/post-job/*` | Recruiter desk: Compose / Review / Preview + AI chat + direct publish |
| `pages/my-jobs/*` | Posted jobs table with views/applied/contacted + manage actions |
| `pages/my-job-analytics/*` | Per-job analytics board (`/my-jobs/:id`) — KPI + daily funnel chart |
| `pages/sign-in/*` | Guest auth + signed-in Account hub (Profile / Apply / Activity / Rating / Account); profile regex + PII eye-mask fields |
| `shared/pii-field/*` | Masked input + View/Hide for seeker profile PII (styled with global form tokens) |
| `core/utils/form-validation.ts` | Shared seeker profile client validators (aligned with API) |
| `core/utils/friendly-http-message.ts` | Toasts + `fieldErrorsFromHttp` for Nest `{ errors }` maps |
| `pages/seeker/*` | `/me` tabbed Saved hub (Apply · Saved · Applied · For you) |
| `pages/applied-jobs/*` | `/me/applied` seeker Applied jobs list |
| `pages/application-detail/*` | ATS detail tabs (Overview · Chat · Timeline) |
| `shared/get-app-cta/*` | Android APK download CTA (home panel / footer band / drawer foot link with version + published datetime) |
| `shared/help-chat/*` | Signed-in floating help chatbot (messenger UI, bottom-right shell) |
| `shared/route-enter/*` | Lightweight left→right route overlay enter (`appRouteEnter`) for shell + Settings panel |
| `shared/datetime-picker/*` | Branded night-sky date/datetime popover (`app-xcron-datetime-picker`) for Post / My Jobs / Admin filters |
| `shared/skeleton/*` | Layout-matched skeletons: job-list, table, list (applied/inbox/split), job-detail, score, analytics + top-bar api-loading |
| `core/services/apk-releases.service.ts` | GitHub Releases API client for APK versions / notes |
| `core/services/seeker.service.ts` | Saved jobs, feed, profile (+ optional `completion`), contacted apps, saved searches, account delete |
| `core/services/tracking.service.ts` | Client access/heartbeat/search/share + admin tracking API |
| `core/services/apply-profiles.service.ts` | Multi-version apply profiles client |
| `pages/job-detail/*` | Public job page |
| `pages/location/*` | Location landing page |
| `pages/notifications/*` | User inbox + channel toggles |
| `pages/admin-notifications/*` | Admin dispatch history (paginated) + delivery detail below row |
| `pages/feedback/*` | FAQ + Contact Admin messenger (`/feedback`) |
| `pages/admin-feedback/*` | Admin Feedback desk (`/admin/feedback`) |
| `pages/admin-tracking/*` | User tracking desk (`/admin/tracking`) — emails, IPs, engagement %, hours |
| `pages/admin-tracking/*` | User tracking desk (`/admin/tracking`) — emails, IPs, engagement %, hours |
| `pages/admin-trust/*` | Trust desk (`/admin/trust`) — queues, cases, search |
| `core/services/moderation.service.ts` | Trust desk + report API client |
| `core/guards/moderator.guard.ts` | Trust desk / Blog Approval gate |
| `core/services/feedback.service.ts` | FAQ + threads + admin messenger client |
| `pages/settings-hub/*` | Settings shell (Language · Theme · Preferences · Site) |
| `pages/theme/*` | Appearance Theme tab (system / light / dark / warm) |
| `pages/profile-setup/*` | Seeker multi-step complete-profile wizard + congrats (`/onboarding/profile`) |
| `pages/language/*` | Interface language picker |
| `pages/preferences/*` | Job prefs + alert channel toggles (+ marketing consent) |
| `pages/privacy/*` | Public Privacy disclosure (`/privacy`) |
| `pages/terms/*` | Public Terms (`/terms`) |
| `shared/theme-prompt/*` | First-open theme chooser overlay |
| `core/services/theme.service.ts` | Appearance preference → `html[data-theme]` |
| `core/services/onboarding.service.ts` | Theme prompt + seeker wizard gates / Remind later |
| `core/services/preferences.service.ts` | Local + API prefs sync (incl. `theme`) |

---

## Mental model (where to change what)

| You want to… | Start here |
| --- | --- |
| Add an API endpoint | `api/src/<module>/*.controller.ts` + service |
| Change public job shape | `api/src/jobs/jobs.mapper.ts` (+ mobile/web models) |
| Touch unlock / subscribe | `api/src/payments/` |
| Touch FAQ / Contact Admin messenger | `api/src/feedback/` · [FEEDBACK.md](./FEEDBACK.md) |
| Touch user access / engagement tracking | `api/src/tracking/` · [TRACKING.md](./TRACKING.md) · web `/admin/tracking` |
| Touch trust / moderation / reports / suspend | `api/src/moderation/` · [ADMIN_TRUST_MODERATION.md](./ADMIN_TRUST_MODERATION.md) |
| Touch bulk import / OCR | `api/src/ingestion/` |
| Touch Job Fare / Telegram pull | `api/src/channels/` · `mobile/.../job-fare/` · `docs/CHANNEL_PULL.md` |
| Change mobile screen | `mobile/src/app/pages/<name>/` |
| Change SEO web page | `web/src/app/pages/<name>/` |
| Update roadmap / release notes | `docs/` |

---

## Not listed (intentionally)

- `**/node_modules/**`
- `**/dist/**`, `mobile/www/**`, `.angular/**`, coverage
- Transient Android build outputs under `android/app/build`, `.gradle`

Regenerate this map after large structural moves by re-scanning the tree and editing this file.
