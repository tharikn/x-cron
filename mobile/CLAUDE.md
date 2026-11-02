# CLAUDE.md — `mobile/` (Ionic + Capacitor + Angular)

X Cron Jobs **Android-first** client. Browser: `ng serve` → usually `:4200`, talks to API `:3000/v1`.

Parent monorepo: [../CLAUDE.md](../CLAUDE.md) · [../docs/DEVELOPER.md](../docs/DEVELOPER.md) · [../docs/FILE_MAP.md](../docs/FILE_MAP.md)

## Commands

```bash
npm install
npm start                  # ng serve
npm run build              # www/ for Capacitor
npm run build:prod
npm run lint
npm run test:unit
npm run test:e2e           # Playwright
npm run cap:sync           # build + npx cap sync
npm run cap:android        # open Android Studio
```

Requires API running for live data (`../api`). Env: `src/environments/environment*.ts` → `apiUrl`.

## Architecture

- Ionic 9 + Angular 22 standalone components; Capacitor 8 (`capacitor.config.ts`)
- Routes: `src/app/app.routes.ts` under `/tabs/*`
- Tabs: Discover · Post · Prefs · Notifications · Account (`src/app/tabs/`)
- Pages: `src/app/pages/<name>/` (`*.page.ts|html|scss`)
- Shared: `src/app/shared/job-card/`
- Core services: `src/app/core/services/` — `auth` (access + refresh), `jobs`, `preferences`, `ingestion`, `channels`, `payments`, `notifications`, `ads`, `seeker`
- Models/utils: `core/models/`, `core/utils/format.ts`, offline `core/data/mock-jobs.ts`
- App init: `AuthService.ensureSession()` (`APP_INITIALIZER` + `app.component`) via `/auth/me`; `adminGuard` blocks Post/Ads/Import until admin is confirmed; `authInterceptor` refreshes once on 401 then clears
- Admin tabs render only when `isAdmin()` is true after session validation — never from localStorage alone
- Android project: `android/` (permissions in `AndroidManifest.xml`; camera for import)

## Product / UI rules

- Guest browse is first-class; sign-in for post, unlock, sync, save, subscribe
- Contacts stay masked until unlock/subscription; never display raw contacts from public job DTO
- Ads must stay **labelled** (“Advertisement”), visually separate from job cards
- Featured/promoted jobs show a badge — not disguised as organic-only

## UI / UX (follow monorepo standards)

Full standards: [../CLAUDE.md](../CLAUDE.md) § **UI / UX standards**. Mobile specifics:

- Fonts loaded in `src/index.html` (Syne + DM Sans + Noto Sans Tamil)
- Tokens in `src/theme/variables.scss`; Ionic chrome overrides in `src/global.scss`
- Discover mirrors web hero + search panel; shared `job-card` uses radius, shadow, lift
- Job detail contact mirrors web: private badge, channel chips, vault peek, solid Unlock CTA; Save/Share in a two-column secondary row
- Notifications inbox: soft elevated light cards (unread = left ink beam + wash, not inverted black); quiet count/unread pills; no sheen/pulse chrome
- Prefer existing Ionic components restyled to tokens — do not invent a second visual language
- Stay visually aligned with web (`:4201`); do not regress to sharp boxes / IBM Plex / Space Grotesk / flat white-only chrome

## Key flows to preserve

| Flow | Where |
| --- | --- |
| Search / pref prompt | `pages/discover` |
| Clear preferences / filters | Discover **Clear preferences** (also Prefs tab Clear) |
| Unlock ₹5 / reveal | `pages/job-detail` + `payments.service` |
| Save job | job-detail → `seeker.service` |
| Quick/paste/promote | `pages/post-job` |
| Bulk CSV/camera/clipboard | `pages/import-batch` — full-width review rows + **Edit** / **Chat** / **Improve with AI** in a **popup modal** (`updateRecord` + `enrichRecord` with optional instruction) |
| Job Fare channel workflow | `pages/job-fare` (admin; Telegram/WA bridge + schedule). Web parity: `/admin/job-fare` |
| Prefs + alert channel toggles | `pages/preferences` |
| Notifications inbox | `pages/notifications` |
| OTP, subscribe, feed, saved, delete | `pages/account` |

Discover search location starts empty (applies saved prefs only when present) — no hardcoded Palani default.

## When changing code

- Prefer Ionic components already used; keep layout simple and mobile-first
- New API calls → extend the relevant `core/services/*` with `AuthService.authHeaders()` when needed
- After native plugin or web asset changes that Android needs: `npm run cap:sync`
- Do not hand-edit generated `android/.../assets/public/chunk-*` — rebuild + sync
- Avoid drive-by refactors / unrelated lint churn

## Stubs

- Payments: stub confirm, or UPI QR/VPA when API `PAYMENT_GATEWAY=upi` (see monorepo payments skill)
- Push: `@capacitor/push-notifications` registers a live FCM token on Android (needs `android/app/google-services.json`); browser still uses `stub_fcm_*`
- OS tray when app closed/killed: server `PUSH_PROVIDER=fcm` + firebase-admin (see `api/src/notifications/CLAUDE.md`)
- OS tray when app open / browser: `@capacitor/local-notifications` or Web Notification API; inbox poll ~8s for in-app list; foreground FCM mirrored to local tray
- Alert channel toggles live on Prefs; Notifications tab is inbox-only
- Discover **Open roles** badge uses API search `total` (not loaded-page length)
- Job cards show uploaded/published date + time via `formatPostedDate`
- Google sign-in: **native** uses `@capawesome/capacitor-google-sign-in` (Credential Manager — stays in-app); **browser** uses GIS popup. Web client ID in `environment*.ts`. **Required for APK:** Android OAuth client in the *same* Google Cloud project — package `com.xcron.jobs` + signing SHA-1. Debug SHA-1 from this machine: `82:DC:02:56:2D:7F:F2:62:C9:ED:20:39:C1:55:7F:54:E8:CF:AF:22` (`keytool -list -v -keystore %USERPROFILE%\.android\debug.keystore -alias androiddebugkey -storepass android`). Missing/wrong Android client surfaces as fake cancel: `activity is cancelled by the user`.
- APK updates (sideload): `AppUpdateService` checks `environment.githubReleasesLatestUrl` on launch when native; parses `xcron-manifest` from the latest GitHub Release body. Higher `versionCode` → Update / Later (opens GitHub APK asset URL). Publish: bump `android/app/build.gradle` → tag `v{versionName}` → `.github/workflows/android-release.yml`. See `web/public/downloads/README.md`.
