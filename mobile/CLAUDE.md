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
npm run release:apk        # bump APK versionCode + versionName (patch)
npm run release:apk:ship   # bump + commit + tag v{versionName} + push → GitHub Release
```

Sideload APK release helper: [`../scripts/release-apk.mjs`](../scripts/release-apk.mjs) (same as above). Tag push triggers [`.github/workflows/android-release.yml`](../.github/workflows/android-release.yml). Do **not** use `web` `sync:apk` for prod.

Requires API running for live data (`../api`). Env: `src/environments/environment*.ts` → `apiUrl`.

## Architecture

- Ionic 9 + Angular 22 standalone components; Capacitor 8 (`capacitor.config.ts`)
- Routes: `src/app/app.routes.ts` under `/tabs/*`
- Tabs: Discover · Notifications · Settings (`src/app/tabs/`) — employers also Post. Settings hosts segment tabs Language · Prefs · Account (`/tabs/settings?tab=`). Old `/tabs/preferences` and `/tabs/account` redirect into Settings. No Ads tab / discover feed ad slot.
- Pages: `src/app/pages/<name>/` (`*.page.ts|html|scss`)
- Shared: `src/app/shared/job-card/`
- Core services: `src/app/core/services/` — `auth` (access + refresh), `jobs`, `preferences`, `ingestion`, `channels`, `payments`, `notifications`, `ads`, `seeker`
- Models/utils: `core/models/`, `core/utils/format.ts`, offline `core/data/mock-jobs.ts`
- App init: `AuthService.ensureSession()` (`APP_INITIALIZER` + `app.component`) via `/auth/me`; `adminGuard` blocks Import/Job Fare until admin is confirmed; `employerGuard` gates Post; `authInterceptor` refreshes once on 401 then clears
- Admin tabs render only when `isAdmin()` is true after session validation — never from localStorage alone
- Android project: `android/` (permissions in `AndroidManifest.xml`; camera for import)

## Product / UI rules

- Guest browse is first-class; sign-in for post, sync, save, subscribe
- Employer contact is public on the job DTO — show phone/email/WhatsApp/website on job detail with no unlock paywall
- House ad creatives / Ads admin screen are not shown in the seeker UI (route removed)
- Featured/promoted jobs show a badge — not disguised as organic-only

## UI / UX (follow monorepo standards)

Full standards: [../CLAUDE.md](../CLAUDE.md) § **UI / UX standards**. Mobile specifics:

- Fonts loaded in `src/index.html` (Outfit + Manrope + Fraunces italic quote + Noto Sans Tamil). Discover hero quote uses soft Fraunces italic + curly quotes.
- Tokens in `src/theme/variables.scss` (night-sky + violet→amber CTA + shared `--xcron-text-*` type scale); Ionic chrome overrides in `src/global.scss` (starfield, gradient solid buttons). Search/input placeholders: set `--placeholder-color` / `--color` on `ion-searchbar.sc-ion-searchbar-*-h` (and input/textarea hosts) — bare `ion-searchbar` loses to Ionic’s md host vars (`--color: #262626`, `--placeholder-color: initial`) and placeholders go invisible on night-sky wash
- Job detail uses role tokens (Outfit titles, Manrope body/UI) — keep in sync with web job-detail
- `--ion-color-dark` is remapped to white ink so `color="dark"` outline/clear buttons stay readable on night sky (never near-black)
- App frame: `ion-app` max-width 480px centered; on ≥520px viewports keep the rounded phone-frame card with fixed height (`100vh - 32px`) so only `ion-content` scrolls (no body + content double scrollbar)
- Discover mirrors web hero + search panel; shared `job-card` uses radius, shadow, lift
- Job list type ladder (shared `job-card`): title = Outfit `--xcron-text-title` / bold / `--xcron-ink`; employer = Manrope `--xcron-text-body` / medium / `--xcron-ink-soft`; facts + posted time = Manrope `--xcron-text-meta` (time uses `--xcron-faint`); CTA = label token — no one-off rem sizes or Ionic `color="medium"` on time
- Job detail contact mirrors web: show contact values directly; Save/Share in a two-column secondary row
- Labelled ad slots + Discover/notification empty states use elevated/wash dark tokens (not light grey wash) so they sit on the night-sky canvas
- Notifications inbox: elevated night-sky cards (unread = left blue beam + wash); quiet count/unread pills; no sheen/pulse chrome
- Prefer existing Ionic components restyled to tokens — do not invent a second visual language
- Stay visually aligned with web (`:4201`); do not regress to light mint/teal / Plus Jakarta / white chrome

## Key flows to preserve

| Flow | Where |
| --- | --- |
| Search / pref prompt | `pages/discover` — salary/remote/postedWithin/walk-in/nearby/save search/recently viewed |
| Clear preferences / filters | Discover **Clear preferences** (also Settings → Prefs Clear) |
| Contact (direct) | `pages/job-detail` from public job DTO (+ contacted marker, hide, employer link) |
| Save job | job-detail → `seeker.service` |
| Saved jobs list / remove | Settings → **Saved** (`pages/saved-jobs`; also Account + `/tabs/saved` redirect) |
| Seeker profile / applications / saved searches | Settings → Account |
| Employer public page | `/tabs/employers/:id` |
| Quick/paste/promote | `pages/post-job` (`employerGuard` for employer or admin) — client field validation via `core/utils/job-form.validation.ts` (required title/employer/city/description; regex for phone, email, URL, salary, optional vacancies 1–100000) |
| Bulk CSV/camera/clipboard | `pages/import-batch` — full-width review rows (checkbox + body, actions wrap below; no viewport 3-col table — `ion-app` is 480px) + **Edit** / **Chat** / **Improve with AI** in a **popup modal** (`updateRecord` + `enrichRecord` with optional instruction); Edit Save uses the same `job-form.validation` helpers (vacancies integer, language code, apply URL) |
| Job Fare channel workflow | `pages/job-fare` (admin; reach from Post tab, not Account). Web parity: `/admin/job-fare` under Post drawer group |
| Language / Prefs / Account / Saved | Settings tab segments → `pages/language`, `pages/preferences`, `pages/account`, `pages/saved-jobs` |
| Prefs + alert channel toggles | Settings → Prefs (`pages/preferences`) |
| Notifications inbox | `pages/notifications` |
| OTP, subscribe, feed, delete | Settings → Account (`pages/account`) |

Discover search location starts empty (applies saved prefs only when present) — no hardcoded Palani default.

## When changing code

- Prefer Ionic components already used; keep layout simple and mobile-first
- New API calls → extend the relevant `core/services/*` with `AuthService.authHeaders()` when needed
- After native plugin or web asset changes that Android needs: `npm run cap:sync`
- Do not hand-edit generated `android/.../assets/public/chunk-*` — rebuild + sync
- Avoid drive-by refactors / unrelated lint churn

## Stubs

- Payments: stub confirm, or UPI QR/VPA when API `PAYMENT_GATEWAY=upi` (see monorepo payments skill)
- System tray: always via `@capacitor/local-notifications` (`ensureOsTrayPermission`) — must not depend on FCM. FCM (`PushNotifications.register`) only when `environment.fcmEnabled` + `android/app/google-services.json`; without Firebase, keep `fcmEnabled: false` or the native register call fatally crashes. Poll-driven local tray still works with `stub_fcm_*` while the app process is alive.
- OS tray when app closed/killed: server `PUSH_PROVIDER=fcm` + firebase-admin (see `api/src/notifications/CLAUDE.md`)
- OS tray when app open / browser: `@capacitor/local-notifications` or Web Notification API; inbox poll ~8s for in-app list; foreground FCM mirrored to local tray
- Poll `syncOsAlerts` must still schedule LocalNotifications when FCM is not trusted (device not linked, or app visible). Do **not** skip tray solely because `remotePushReady` — that caused badge-only / inbox-on-open with no shade. First-seed keeps older history quiet but still announces alerts created in the last ~15 minutes. After `ensurePushPermission`, re-`registerDevice` so a live FCM token is POSTed (first boot may have exited on `stub_fcm_*`).
- Session ↔ push: Google idToken exchanged once (not stored); app access ~15m + refresh ~30d. `registerDevice` only while signed in; `unlinkDevice` on logout / failed refresh. Foreground/resume runs `ensureSession` then inbox. API also suppresses pushes without a live refresh session.
- Alert channel toggles live on Prefs; inbox page remains at `/tabs/notifications` (not shown in tab bar)
- Discover **Open roles** badge uses API search `total` (not loaded-page length)
- Job cards show uploaded/published date + time via `formatPostedDate`
- Google sign-in: **native** uses `@capawesome/capacitor-google-sign-in` (Credential Manager — stays in-app); **browser** uses GIS popup. Web client ID in `environment*.ts`. **Required for APK:** Android OAuth client in the *same* Google Cloud project — package `com.xcron.jobs` + signing SHA-1. Debug SHA-1 from this machine: `82:DC:02:56:2D:7F:F2:62:C9:ED:20:39:C1:55:7F:54:E8:CF:AF:22` (`keytool -list -v -keystore %USERPROFILE%\.android\debug.keystore -alias androiddebugkey -storepass android`). Missing/wrong Android client surfaces as fake cancel: `activity is cancelled by the user`.
- **CI signing:** `android/app/debug.keystore` is committed and wired in `build.gradle` so every GitHub Release APK shares one signature (avoids “package conflicts with an existing package”). Same SHA-1 as above for Google Sign-In. Do not rotate that keystore without a forced uninstall wave.
- APK updates (sideload): `AppUpdateService` checks `environment.githubReleasesLatestUrl` on launch when native; parses `xcron-manifest` from the latest GitHub Release body. Higher `versionCode` → Update / Later (opens GitHub APK asset URL). Publish: bump `android/app/build.gradle` → tag `v{versionName}` → `.github/workflows/android-release.yml`. See `web/public/downloads/README.md`.
