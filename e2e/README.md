# X Cron Playwright journeys

End-to-end coverage from **user creation → end journey** for **mobile (`:4200`)**, **web (`:4201`)**, and optional **Android** (emulator/device Chrome), against API `:3000`.

Mapped from project docs (`docs/DEVELOPER.md`, `mobile/CLAUDE.md`, `web/CLAUDE.md`, `xcron-ui-auth`).

## One command

From repo root (starts or reuses API + clients):

```bash
npm run test:e2e
```

Scoped:

```bash
npm run test:e2e:api              # HTTP contract specs only (API, no browser)
npm run test:e2e:mobile
npm run test:e2e:web
npm run test:e2e:android          # requires emulator/device + adb
npm run test:e2e:android:smoke
npm run test:e2e -- --grep @smoke
npm run test:e2e:report
```

### Android (Playwright experimental)

Same journey specs as `mobile`, driven on **Chrome for Android** (not the Capacitor APK shell yet). Runner starts API + Ionic `:4200`, checks `adb devices`, and each test runs `adb reverse` for `:3000` / `:4200` so `localhost` in the app hits the host.

```bash
# 1) Start an AVD (Android Studio → Device Manager) or USB device with debugging
adb devices
# 2) Chrome installed on the device; optional chrome://flags → "Enable command line on non-rooted devices"
# 3) Run
npm run test:e2e:android:smoke
```

Optional: `XCRON_ANDROID_SERIAL=<serial>` when multiple devices are attached. Debug APK WebView inspection is enabled in `MainActivity` (`BuildConfig.DEBUG`) for a future Capacitor-attach path.

## Traditional app pattern (what we copied)

| Practice | Here |
| --- | --- |
| Critical + full journeys | `@smoke` tags + full `@journey` / role suites |
| Page Object Model | `e2e/pages/*` |
| API seed + UI assert | `e2e/helpers/api-client.ts` (Bearer, skips CSRF) |
| Role fixtures | seeker / recruiter / admin helpers |
| Single orchestrator | `scripts/run-e2e.mjs` |
| Failure digest | `e2e/test-results/ISSUES.md` + HTML + trace/screenshot/video |
| Serial workers | `workers: 1` (session + rate-limit safe) |

## Suites

| Spec | Covers |
| --- | --- |
| `01-guest-discover` | Brand, list/search |
| `02-guest-chrome` | Guest nav gates + Feedback FAQ |
| `03-seeker-register` | Sign Up Job Seeker + login |
| `04-seeker-profile-apply` | Profile, apply versions, Easy apply, public contact |
| `05-recruiter-post` | Recruiter signup, Post desk, My jobs, analytics, Company entry |
| `06-applications-timeline` | Applied list, Overview/Chat/Timeline, employer review |
| `07-saved-feed-rating` | Saved jobs, My Rating |
| `08-notifications-prefs-theme` | Auth-only Settings surfaces |
| `09-feedback` | FAQ + Contact Admin |
| `10-routing-guards` | employerGuard, role chrome, admin / Trust / Tracking gates |
| `11-admin-desk` | Admin login / Feedback + Trust desk (skips if SensitiveThrottle) |
| `12-end-to-end-journey` | Golden path dual-role + Company workspace |
| `13-company-workspace` | Company dashboard / Profile / Team / invite / chrome (web + mobile/Android) |
| `14-job-discovery` | Deep-linked filters → chips → URL sync, Clear all, Save search (seeker only) |
| `15-privacy-sessions-aliases` | Privacy page, `/login` · `/applications` · `/alerts` · `/jobs/:id` redirects, Devices & sessions revoke, Export my data |

### API project (`e2e/api/*.api.spec.ts`)

Browserless `/v1` contract specs (project `api`, runs first in the default suite): platform headers + correlation id, auth sessions/refresh reuse/CSRF/RBAC, discovery filters, ATS applications, company invites + import integrations, tracking/trust/privacy, admin reads. See the map in [`docs/E2E.md`](../docs/E2E.md).

The Devices & sessions revoke test skips when the API runs `AUTH_SINGLE_SESSION=1` (the UI login already revokes the API seed session). Signed-in seeker journeys use `completeSeekerProfile()` so the forced `/onboarding/profile` redirect does not intercept them.

## Issues list

After each run:

1. Open `e2e/test-results/ISSUES.md` — triage like a QA defect list.
2. Open `e2e/playwright-report/index.html` — screenshots / traces.
3. Fix product or selectors; re-run.

Admin login uses API `@SensitiveThrottle` (**1/hour** on default config). The runner starts API with `RATE_LIMIT_SENSITIVE_MAX=50` when it boots the API itself. If you reuse a long-lived API, admin tests may skip — that skip is listed in the digest.

## Env overrides

| Var | Default |
| --- | --- |
| `XCRON_API_URL` | `http://localhost:3000/v1` |
| `XCRON_MOBILE_URL` | `http://localhost:4200` |
| `XCRON_WEB_URL` | `http://localhost:4201` |
| `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` | from local API `.env` |
| `XCRON_E2E_VERBOSE` | set to `1` to stream API/client logs |
