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
- Tabs: Discover · Post · Prefs · Account (`src/app/tabs/`)
- Pages: `src/app/pages/<name>/` (`*.page.ts|html|scss`)
- Shared: `src/app/shared/job-card/`
- Core services: `src/app/core/services/` — `auth`, `jobs`, `preferences`, `ingestion`, `payments`, `notifications`, `ads`, `seeker`
- Models/utils: `core/models/`, `core/utils/format.ts`, offline `core/data/mock-jobs.ts`
- App init (`app.component.ts`): refresh auth, hydrate prefs, register stub FCM device
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
- Prefer existing Ionic components restyled to tokens — do not invent a second visual language
- Stay visually aligned with web (`:4201`); do not regress to sharp boxes / IBM Plex / Space Grotesk / flat white-only chrome

## Key flows to preserve

| Flow | Where |
| --- | --- |
| Search / pref prompt | `pages/discover` |
| Unlock ₹5 / reveal | `pages/job-detail` + `payments.service` |
| Save job | job-detail → `seeker.service` |
| Quick/paste/promote | `pages/post-job` |
| Bulk CSV/camera/clipboard | `pages/import-batch` |
| Prefs + job alerts | `pages/preferences` |
| OTP, subscribe, feed, saved, delete | `pages/account` |

## When changing code

- Prefer Ionic components already used; keep layout simple and mobile-first
- New API calls → extend the relevant `core/services/*` with `AuthService.authHeaders()` when needed
- After native plugin or web asset changes that Android needs: `npm run cap:sync`
- Do not hand-edit generated `android/.../assets/public/chunk-*` — rebuild + sync
- Avoid drive-by refactors / unrelated lint churn

## Stubs

- Payments confirm via API stub mode
- FCM token is a local stub string until Capacitor Push + Firebase are wired
- Google sign-in button is informational only
