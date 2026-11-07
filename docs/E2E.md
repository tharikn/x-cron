# X Cron — Playwright E2E

Canonical runbook: [`e2e/README.md`](../e2e/README.md).

## One command

```bash
npm run test:e2e                 # api contract + mobile (:4200 Chromium) + web (:4201)
npm run test:e2e:api             # API-only HTTP contract specs (no browser, no clients)
npm run test:e2e:android         # same journeys on Android Chrome (emulator/device + adb)
npm run test:e2e:android:smoke
```

**API project** (`e2e/api/*.api.spec.ts`) exercises `/v1` directly with `fetch` — platform headers, auth/session rotation + reuse, CSRF, RBAC, discovery filters, ATS, company invites, import integrations (Partner API / feeds SSRF / webhooks), tracking, trust reports, privacy export/delete, admin reads. Point it at any API with `XCRON_API_URL`.

Android is **opt-in** (not in the default suite). Needs a running AVD/USB device, Chrome on device, and `adb devices`. Uses Playwright experimental `_android` + `adb reverse` for `:3000` / `:4200` — Ionic UI on real Android Chrome (Capacitor APK WebView attach is a follow-up; debug WebView inspection is enabled in `MainActivity`).

Produces:

| Artifact | Path |
| --- | --- |
| Issues digest (QA defect list) | `e2e/test-results/ISSUES.md` |
| HTML report | `e2e/playwright-report/index.html` |
| Traces / screenshots / video | `e2e/test-results/` (on failure) |

## Traditional handling (how mature apps do this)

1. **Critical path (`@smoke`)** on every PR — guest browse, seeker register, recruiter post gate.
2. **Full journeys (option C)** nightly / pre-release — this suite.
3. **API seed + UI assert** — create users/jobs via `/v1` Bearer + stable `X-Tab-Id`, then drive the client.
4. **Page Object Model** — locators live in `e2e/pages/`, not duplicated in specs.
5. **Failure digest** — triage `ISSUES.md` like a bug list; fix product or selectors; re-run.
6. **Isolated e2e API** — when the runner starts API it uses memory stores (incl. tracking + moderation), stub files/OCR, raised rate limits (`AUTH_SINGLE_TAB=0`, `AUTH_SINGLE_SESSION=0`, sensitive max 50), relaxed apply anti-spam (`APPLY_COOLDOWN_MS=1` — `0` falls back to 30s), schedulers off, and Telegram in webhook mode (never long-poll a real bot). Reusing a prod-like API with `AUTH_SINGLE_TAB=1` requires the helper’s per-session tab id (already wired); `api-client.request` honours `Retry-After` on 429 (≤ 65s, 2 retries).
7. **Unit tests per package** — fast logic checks run before E2E (see below).

## Unit tests (per package)

| Package | Command | Runner | Scope |
| --- | --- | --- | --- |
| `api/` | `npm test` | Jest + ts-jest (`src/**/*.spec.ts`) | match/search/lifecycle utils, risk signals, feed + CSV/Excel parsers, upload guard, tokens, correlation id, env validation, outbox backoff, redis keys, tracking service, auth store |
| `web/` | `npm run test:unit` | `ng test` (Vitest + jsdom) | form / job-form validation, friendly HTTP messages + support ref, format, CSRF cookie, admin/employer/moderator guards |
| `mobile/` | `npm run test:unit` | `ng test` (Vitest + jsdom) | same utils + deep-link mapper (Android links), correlation interceptor, guards |

`api/test/app.e2e-spec.ts` (Nest scaffold) is not run: Jest CJS cannot load ESM-only `@nestjs/config`. HTTP-level API coverage lives in the Playwright `api` project instead.

## Coverage map (docs → specs)

| Product flow (docs / CLAUDE) | Spec |
| --- | --- |
| Guest discover / brand | `01-guest-discover` |
| Guest chrome (ui-auth) | `02-guest-chrome` |
| Seeker Sign Up / login | `03-seeker-register` |
| Profile · Apply version · Easy apply · public contact | `04-seeker-profile-apply` |
| Recruiter Sign Up · Post · My jobs · analytics · Company | `05-recruiter-post` |
| Applied · Timeline · employer review | `06-applications-timeline` |
| Saved · My Rating | `07-saved-feed-rating` |
| Notifications · Prefs · Theme | `08-notifications-prefs-theme` |
| Feedback FAQ + Contact Admin | `09-feedback` |
| employerGuard · role chrome · admin / Trust / Tracking gates | `10-routing-guards` |
| Admin desk (+ Trust desk web) | `11-admin-desk` |
| Golden dual-role journey (+ Company workspace) | `12-end-to-end-journey` |
| Company workspace (dashboard / team / invite / chrome) | `13-company-workspace` |
| Job discovery: URL-synced filters, chips, Clear all, Save search ([JOB_DISCOVERY](JOB_DISCOVERY.md)) | `14-job-discovery` |
| Privacy page, alias + legacy deep-link redirects, Devices & sessions, Export my data ([WEBSITE_AND_ANDROID_UX](WEBSITE_AND_ANDROID_UX.md), [SECURITY_PRIVACY](SECURITY_PRIVACY.md)) | `15-privacy-sessions-aliases` |

### API contract map (`e2e/api/`)

| Product flow (docs) | Spec |
| --- | --- |
| Health, `X-Request-Id`, helmet headers, validation error map, whitelist, input protector, public reads | `01-platform.api` |
| Register/login, refresh rotation + family reuse revoke, sessions, logout-all, CSRF double-submit, RBAC ([AUTHENTICATION](AUTHENTICATION.md)) | `02-auth-sessions.api` |
| Search filters / aliases / match reasons, detail contact, not-relevant, saved searches, feed, lifecycle ([JOB_DISCOVERY](JOB_DISCOVERY.md)) | `03-discovery.api` |
| Apply, duplicates, employer transitions, chat, access control, withdraw ([APPLICATIONS_TIMELINE](APPLICATIONS_TIMELINE.md)) | `04-applications.api` |
| Company invite/accept, Partner API keys, feed SSRF guard, webhooks ([COMPANY_WORKSPACE](COMPANY_WORKSPACE.md), [JOB_IMPORT_INTEGRATIONS](JOB_IMPORT_INTEGRATIONS.md)) | `05-company-integrations.api` |
| Tracking events, reports/appeals, notification prefs, export/delete ([TRACKING](TRACKING.md), [ADMIN_TRUST_MODERATION](ADMIN_TRUST_MODERATION.md)) | `06-trust-tracking-privacy.api` |
| Admin tracking / moderation / dispatch / Job Fare reads (skips on SensitiveThrottle) | `07-admin.api` |
