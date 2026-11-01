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
| `docker-compose.yml` | Local Postgres 16 for future Prisma runtime |
| `.gitignore` | Git ignore rules |
| `.github/workflows/api-build.yml` | CI: API build |
| `.github/workflows/mobile-build.yml` | CI: mobile build |
| `.github/workflows/web-build.yml` | CI: web build |

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

#### `api/src/auth/`

| Path | Purpose |
| --- | --- |
| `auth.module.ts` | Global auth module |
| `auth.controller.ts` | OTP start/verify, Google, admin login, refresh, me, logout; employers routes |
| `auth.service.ts` | Auth business logic |
| `auth.store.ts` | In-memory users, OTP, access+refresh sessions, employers |
| `auth.types.ts` | User / role / session / AuthTokens types |
| `auth.guard.ts` | Global Bearer access-token guard |
| `decorators.ts` | `@Public`, `@Roles`, `@CurrentUser`, `@AccessToken` |
| `dto/auth.dto.ts` | OTP / employer / Google DTOs |

#### `api/src/jobs/`

| Path | Purpose |
| --- | --- |
| `jobs.module.ts` | Jobs feature module |
| `jobs.controller.ts` | Search, detail, related, report, employer post, admin moderation |
| `jobs.service.ts` | Job use-cases; hooks ads boosts + notifications on publish |
| `jobs.memory-store.ts` | In-memory job repository |
| `jobs.mapper.ts` | Public DTO mapper (never leaks `privateContact`) |
| `job.types.ts` | Job domain types |
| `seed-jobs.ts` | Seed published jobs with private contacts |
| `dto/create-job.dto.ts` | Quick/paste create DTOs |
| `dto/search-jobs.dto.ts` | Search query DTO |
| `dto/moderation.dto.ts` | Approve/reject/report DTOs |

#### `api/src/ingestion/`

| Path | Purpose |
| --- | --- |
| `ingestion.module.ts` | Bulk import module |
| `ingestion.controller.ts` | Import-batch CRUD/upload/approve |
| `ingestion.service.ts` | Parse, dedupe, approve → needs-review jobs; `ingestDigestText` for Job Fare |
| `ingestion.store.ts` | In-memory batches/records |
| `ingestion.types.ts` | Batch/record types |
| `dto/ingestion.dto.ts` | Upload/approve DTOs |
| `parsers/parser.types.ts` | Parser interfaces |
| `parsers/parser.registry.ts` | Selects CSV / text / OCR stub |
| `parsers/csv.parser.ts` | CSV extractor |
| `parsers/text.parser.ts` | Pasted WhatsApp/text extractor |
| `parsers/image-ocr.parser.ts` | Image/PDF OCR **stub** |

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
| `preferences.types.ts` | Preference record types |
| `dto/preferences.dto.ts` | Save/claim DTOs |

#### `api/src/notifications/`

| Path | Purpose |
| --- | --- |
| `notifications.module.ts` | In-app + push + mail notifications |
| `notifications.controller.ts` | Devices, prefs, inbox, read, admin dispatch history, dev |
| `notifications.service.ts` | Subscriber match → fan-out; quiet hours / daily cap |
| `notifications.store.ts` | Devices, prefs, inbox, dispatch + delivery history |
| `notifications.types.ts` | Notification domain types |
| `dto/notifications.dto.ts` | Device/prefs/dev DTOs |
| `providers/push-provider.ts` | Push Strategy interface |
| `providers/push-provider.factory.ts` | `PUSH_PROVIDER` → stub/fcm |
| `providers/fcm.stub.ts` | Zero-cost FCM stub sender |
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
| `seeker.module.ts` | Seeker saved jobs + feed |
| `seeker.controller.ts` | `/v1/feed`, `/v1/me/saved-jobs` |
| `seeker.service.ts` | Save/unsave + prefs-based feed |
| `seeker.store.ts` | In-memory saved-job sets |

#### `api/src/account/`

| Path | Purpose |
| --- | --- |
| `account.module.ts` | Account deletion |
| `account.controller.ts` | `DELETE /v1/me`, `DELETE /v1/auth/me` |
| `account.service.ts` | Wipe payments/prefs/seeker + auth user |

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
| `e2e/app.spec.ts` | Playwright smoke |

### `mobile/src/` — app source

| Path | Purpose |
| --- | --- |
| `main.ts` | Angular bootstrap |
| `index.html` | Shell HTML |
| `global.scss` | Global styles |
| `theme/variables.scss` | Ionic / brand CSS variables (monochrome) |
| `test-setup.ts` | Test bootstrap |
| `environments/environment.ts` | Dev API URL |
| `environments/environment.prod.ts` | Prod API URL |
| `assets/icon/favicon.png` | Favicon |
| `assets/shapes.svg` | Decorative asset |

#### `mobile/src/app/`

| Path | Purpose |
| --- | --- |
| `app.component.ts/html/scss` | Root shell; hydrates prefs + device on init |
| `app.component.spec.ts` | Unit test |
| `app.routes.ts` | Tab + page routes |

#### `mobile/src/app/tabs/`

| Path | Purpose |
| --- | --- |
| `tabs.page.ts/html/scss` | Bottom tabs: Discover / Post / Prefs / Account |

#### `mobile/src/app/core/`

| Path | Purpose |
| --- | --- |
| `models/job.model.ts` | Job / prefs client models |
| `data/mock-jobs.ts` | Offline fallback jobs |
| `utils/format.ts` | Salary/location/unlock formatters |
| `services/auth.service.ts` | OTP auth client |
| `services/jobs.service.ts` | Search/post/moderation API client |
| `services/preferences.service.ts` | Local + API prefs sync/claim |
| `services/ingestion.service.ts` | Bulk import API client |
| `services/channels.service.ts` | Job Fare channel pull API client |
| `services/payments.service.ts` | Unlock + subscription client |
| `services/notifications.service.ts` | Device + inbox client |
| `services/ads.service.ts` | Ad slots + promote packages |
| `services/seeker.service.ts` | Saved jobs, feed, account delete |

#### `mobile/src/app/pages/`

| Path | Purpose |
| --- | --- |
| `discover/*` | Guest search + labelled ad slot + pref prompt |
| `job-detail/*` | Detail, unlock, save, share, report, footer ad |
| `post-job/*` | Quick/paste post + promote packages |
| `import-batch/*` | CSV / camera / clipboard import UI |
| `job-fare/*` | Admin Job Fare channel pull workflow (pipeline + schedule) |
| `preferences/*` | Job prefs + notification toggles |
| `notifications/*` | Inbox + channel toggles (tab) |
| `account/*` | OTP, employer, subscription, feed, saved, moderation, delete |

#### `mobile/src/app/shared/`

| Path | Purpose |
| --- | --- |
| `job-card/*` | Job list card (incl. Featured badge) |

#### `mobile/src/app/home/`

| Path | Purpose |
| --- | --- |
| `home.page.*` | Legacy starter home (routes use tabs/discover) |

### `mobile/android/` — Capacitor Android project

| Path / area | Purpose |
| --- | --- |
| `android/app/src/main/AndroidManifest.xml` | Permissions (incl. camera) |
| `android/app/src/main/java/com/xcron/jobs/MainActivity.java` | Main activity |
| `android/app/src/main/res/**` | Icons, splash drawables, styles, strings |
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

### `web/src/`

| Path | Purpose |
| --- | --- |
| `main.ts` | Browser bootstrap |
| `main.server.ts` | Server bootstrap |
| `server.ts` | Express SSR + `/sitemap.xml` + robots |
| `index.html` | Shell |
| `styles.scss` | Global styles |
| `environments/environment.ts` | Dev API / site URL |
| `environments/environment.prod.ts` | Prod env |

#### `web/src/app/`

| Path | Purpose |
| --- | --- |
| `app.ts` / `app.html` / `app.scss` | Root app |
| `app.config.ts` | Client app config |
| `app.config.server.ts` | Server app config |
| `app.routes.ts` | Client routes |
| `app.routes.server.ts` | SSR route rules |
| `core/models/job.model.ts` | Job model |
| `core/services/jobs.service.ts` | Jobs API client |
| `core/services/seo.service.ts` | Title/meta/canonical |
| `core/services/ads.service.ts` | Home ad rail client |
| `core/services/site.service.ts` | Public footer config client (`GET /site/footer`) |
| `core/models/site.model.ts` | Footer config types |
| `core/utils/format.ts` | Display helpers |
| `pages/home/*` | SEO home + search + ad rail |
| `pages/job-detail/*` | Public job page |
| `pages/location/*` | Location landing page |
| `pages/notifications/*` | User inbox + channel toggles |
| `pages/admin-notifications/*` | Admin dispatch / delivery history |

---

## Mental model (where to change what)

| You want to… | Start here |
| --- | --- |
| Add an API endpoint | `api/src/<module>/*.controller.ts` + service |
| Change public job shape | `api/src/jobs/jobs.mapper.ts` (+ mobile/web models) |
| Touch unlock / subscribe | `api/src/payments/` |
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
