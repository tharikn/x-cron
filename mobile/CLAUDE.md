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
- Tabs: Discover · (signed-in) Notifications · (signed-in) Settings · **Sign in / Profile** (last) (`src/app/tabs/`) — employers also Post. Profile tab is `/tabs/account` (standalone auth + signed-in account desk). Settings hosts Language always; **Prefs · Saved only after sign-in** (`/tabs/settings?tab=`). Guests who open Prefs/Saved are sent to Sign in. Guest chrome skill: [../.cursor/skills/xcron-ui-auth/SKILL.md](../.cursor/skills/xcron-ui-auth/SKILL.md). No Ads tab / discover feed ad slot.
- Pages: `src/app/pages/<name>/` (`*.page.ts|html|scss`)
- Shared: `src/app/shared/job-card/`
- Core services: `src/app/core/services/` — `auth` (access + refresh), `jobs`, `preferences`, `ingestion`, `channels`, `payments`, `notifications`, `ads`, `seeker`
- Models/utils: `core/models/`, `core/utils/format.ts`, offline `core/data/mock-jobs.ts`
- App init: `AuthService.ensureSession()` (`APP_INITIALIZER` + `app.component`) via `/auth/me`; cookie + memory Bearer + one-tab (`TabSessionService` / `X-Tab-Id`); `adminGuard` blocks Import/Job Fare until admin is confirmed; `employerGuard` gates Post (employer username/password register/login, not admin); `authInterceptor` uses `withCredentials` + CSRF/tab headers and refreshes once on 401 then clears; foreground resume calls `slideSessionIfNeeded` for long-lived alerts
- Admin tabs render only when `isAdmin()` is true after session validation — never from localStorage roles alone. Post is employer+admin; Import/Job Fare stay admin-only
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
| Saved jobs list / remove | Settings → **Saved** after sign-in (`pages/saved-jobs`; `/tabs/saved` redirects there) |
| Seeker profile / apply versions / applications / saved searches | Bottom-nav **Sign in / Profile** (`/tabs/account`) — guest stack Login → Sign Up (**Job Seeker / Recruiter** role picker → `intendedRole`) → Google → Forgot password; signed-in desk uses header segments **Profile · Apply · Activity · Rating · Account** (`?tab=`). **Profile** accordion: Personal (name/mobile/email/show contact) · Location (address/pincode) · Career (Fresher/Experienced, Currently studying/Degree completed; fresher internship+course; experienced years/company/salary + notice badges). **Apply** versions (no CV): skills as removable **badges** (2–7) + ATS on other tabs; **Rating** → Performance Score; red **Sign out** on Account. |
| Apply + timeline | Job detail **Apply** → `/tabs/applications/:id` |
| Employer applicant review | Post tab / Account → `/tabs/employer-applications` (+ detail `?as=employer`) |
| Employer public page | `/tabs/employers/:id` |
| Recruiter desk (post) | `pages/post-job` (`employerGuard`) — Compose \| Review \| Preview panels; AI Improve + chat (`core/services/ai.service.ts` → `/v1/ai/job-enrich`); confirm alert (“did you preview?”) then `directPublish: true` (live, skips Blog Approval). Admin Import/Job Fare links only when `isAdmin()`. Field validation via `core/utils/job-form.validation.ts` |
| Bulk CSV/camera/clipboard | `pages/import-batch` — full-width review rows (checkbox + body, actions wrap below; no viewport 3-col table — `ion-app` is 480px) + **Edit** / **Chat** / **Improve with AI** in a **popup modal** (`updateRecord` + `enrichRecord` with optional instruction); Edit Save uses the same `job-form.validation` helpers (vacancies integer, language code, apply URL) |
| Job Fare channel workflow | `pages/job-fare` (admin; reach from Post tab, not Account). Web parity: `/admin/job-fare` under Post drawer group |
| Language / Prefs / Saved | Settings segments → `pages/language`, `pages/preferences`, `pages/saved-jobs` (Prefs + Saved gated to signed-in) |
| Prefs + alert channel toggles | Settings → Prefs (`pages/preferences`) after sign-in |
| Notifications inbox | `pages/notifications` — job Open + `data.action` CTAs (`complete_profile` → Account, `browse_jobs` → Discover) |
| Sign in / Profile / delete | Bottom-nav Profile tab (`pages/account`) — signed-in segments Profile · Apply · Activity · Rating · Account (no subscription UI) |
| Auth toasts | Bottom-center Ionic toast: success → `xcron-toast--success` (primary), error → `xcron-toast--error` (red) + `friendlyHttpMessage` |
| Performance Score | `/tabs/performance` (Account callout + employer inbox fit/score badges) |

Discover search location starts empty (applies saved prefs only when present) — no hardcoded Palani default.

## When changing code

- Prefer Ionic components already used; keep layout simple and mobile-first
- New API calls → extend the relevant `core/services/*` with `AuthService.authHeaders()` when needed
- After native plugin or web asset changes that Android needs: `npm run cap:sync`
- Do not hand-edit generated `android/.../assets/public/chunk-*` — rebuild + sync
- Avoid drive-by refactors / unrelated lint churn
- **Android launcher icon:** full-bleed square from `src/assets/icon/xcron-logo-mark-square.png` → `android/app/src/main/res/mipmap-*/ic_launcher*.png` + adaptive bg `#0A0A0A`. Do not leave Capacitor default robot icons. Source `xcron-logo-mark.png` has white corner padding — always flatten to the square asset before regenerating mipmaps.

## Stubs

- Payments: stub confirm, or UPI QR/VPA when API `PAYMENT_GATEWAY=upi` (see monorepo payments skill)
- System tray: always via `@capacitor/local-notifications` (`ensureOsTrayPermission`) — must not depend on FCM. FCM (`PushNotifications.register`) only when `environment.fcmEnabled` + `android/app/google-services.json`; without Firebase, keep `fcmEnabled: false` or the native register call fatally crashes. Poll-driven local tray still works with `stub_fcm_*` while the app process is alive.
- OS tray when app closed/killed: server `PUSH_PROVIDER=fcm` + firebase-admin (see `api/src/notifications/CLAUDE.md`)
- OS tray when app open / browser: `@capacitor/local-notifications` or Web Notification API; inbox poll ~8s for in-app list; foreground FCM mirrored to local tray
- Poll `syncOsAlerts` must still schedule LocalNotifications when FCM is not trusted (device not linked, or app visible). Do **not** skip tray solely because `remotePushReady` — that caused badge-only / inbox-on-open with no shade. First-seed keeps older history quiet but still announces alerts created in the last ~15 minutes. After `ensurePushPermission`, re-`registerDevice` so a live FCM token is POSTed (first boot may have exited on `stub_fcm_*`).
- Session ↔ push: Google idToken exchanged once (not stored); app access ~15m + refresh ~30d. `registerDevice` only while signed in; `unlinkDevice` on logout / failed refresh. Foreground/resume runs `ensureSession` then inbox. API also suppresses pushes without a live refresh session.
- Alert channel toggles live on Prefs; inbox page remains at `/tabs/notifications` (tab bar only when signed in)
- Discover **Open roles** badge uses API search `total` (not loaded-page length)
- Job cards show uploaded/published date + time via `formatPostedDate`
- Local auth (default): username + password (+ confirm on create) via `/v1/auth/register` and `/v1/auth/login`. Create account asks **Job Seeker** or **Recruiter** (`intendedRole=seeker|employer`; Post flow preselects Recruiter). No email/SMS OTP. Job-detail sheet (`shared/google-sign-in-sheet`) uses the same password form.
- Google Identity helpers remain in the codebase but Account / job-detail sheets use password auth for the beginner MVP.
- **CI signing:** `android/app/debug.keystore` is committed and wired in `build.gradle` so every GitHub Release APK shares one signature (avoids “package conflicts with an existing package”). SHA-1 `82:DC:02:56:2D:7F:F2:62:C9:ED:20:39:C1:55:7F:54:E8:CF:AF:22`. Do not rotate that keystore without a forced uninstall wave.
- APK updates (sideload): `AppUpdateService` checks `environment.githubReleasesLatestUrl` on launch when native; parses `xcron-manifest` from the latest GitHub Release body. Higher `versionCode` → Update / Later (opens GitHub APK asset URL). Publish: bump `android/app/build.gradle` → tag `v{versionName}` → `.github/workflows/android-release.yml`. See `web/public/downloads/README.md`.
