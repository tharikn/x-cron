---
name: xcron-claude-md
description: >-
  Keep X Cron CLAUDE.md agent guides and env files in sync whenever code
  changes. Use when editing api/, mobile/, web/, docs/, env keys (.env,
  .env.example, env-dev), APK sideload / version.json updates, or a new feature
  module — especially AI enrich, OCR, ingestion, jobs, payments/UPI gateways.
---

# X Cron — update CLAUDE.md on every change

## Rule (verbatim)

wherever you make changes just add claude.md file

## What to do

1. After substantive edits in a package (`api/`, `mobile/`, `web/`) or a new feature folder, **update the nearest `CLAUDE.md`**.
2. If you create a new module directory (e.g. `api/src/ai/`), **add `CLAUDE.md` in that folder** describing purpose, env toggles, endpoints, and agent rules.
3. Also bump the package-level guide when env keys, modules, or smoke paths change:
   - [api/CLAUDE.md](../../../api/CLAUDE.md)
   - [mobile/CLAUDE.md](../../../mobile/CLAUDE.md)
   - [web/CLAUDE.md](../../../web/CLAUDE.md)
   - root [CLAUDE.md](../../../CLAUDE.md) for monorepo-wide rules
4. Keep env files aligned (see **Env files** below); never commit real secrets into `.env.example`.
5. Prefer short, accurate deltas — do not rewrite unrelated sections.

## Env files (verbatim rule)

whenever make any env change you should add env-dev as well and env-dev only for live prod urls

| File | Role |
| --- | --- |
| `api/.env.example` | Documented keys + safe placeholders / localhost defaults (committed) |
| `api/.env` | Local/runtime values the running API loads |
| `api/env-dev` | **Live production only** — Render web/API hosts, prod `DATABASE_URL`, prod CORS, live gateway/AI/Telegram values. No `localhost` / LAN URLs |

Whenever you add, rename, remove, or change meaning of an env key:

1. Update `api/.env.example` (placeholders only).
2. Update `api/.env` if the local runtime needs it.
3. **Also update `api/env-dev`** with the same key — values must stay **live prod URLs / prod secrets**, not local.
4. Mention the key in the relevant `CLAUDE.md` when it affects agents.

Do not put `http://localhost:*` (or local Postgres) into `env-dev`. Prod site: `https://x-cron.onrender.com` · prod API: `https://x-cron-api.onrender.com`.

## Android APK sideload updates (GitHub Releases)

Sideload path (not Play Store). **Production binary lives on GitHub Releases** — website Download buttons link straight to the release asset (no Render APK upload, no Drive).

| Piece | Where |
| --- | --- |
| Latest APK | `https://github.com/tharikn/x-cron/releases/latest/download/xcron-jobs.apk` |
| Version history + notes | GitHub Releases API → web `get-app-cta` versions list |
| In-app update check | `AppUpdateService` → `environment.githubReleasesLatestUrl` (parses `xcron-manifest` fence in release body) |
| CI | `.github/workflows/android-release.yml` on tag `v*` (or workflow_dispatch) |
| Manifest helper | `scripts/apk-release-manifest.mjs` |
| Local smoke only | `cd web && npm run sync:apk` (gitignored local file; **not** prod) |

**Ship a bug-fix APK**

1. Bump `versionCode` (required) + `versionName` in `mobile/android/app/build.gradle`.
2. Commit, then `git tag v{versionName}` and `git push origin v{versionName}` (tag must match `versionName`, e.g. `1.0.1` → `v1.0.1`).
3. CI builds debug APK, creates Release with notes + assets `xcron-jobs.apk` + `version.json`.
4. Site Download / in-app Update use that GitHub asset URL directly.

Do **not** run `sync:apk` on Render. Do **not** host prod APKs on Google Drive.

**System notifications:** OS tray uses LocalNotifications (`ensureOsTrayPermission`) and must work without Firebase. Never gate tray alerts on FCM success.

**FCM (free, closed-app push):** Code is ready (`PUSH_PROVIDER=fcm`, `FcmProvider`, Capacitor push). Credentials are **not** inventable — user must download from Firebase Console (Spark ₹0). Setup: [docs/FCM_SETUP.md](../../../docs/FCM_SETUP.md) + `node scripts/setup-fcm.mjs` after placing `mobile/android/app/google-services.json` and `api/secrets/firebase-service-account.json`. Without those files keep `fcmEnabled: false` / `PUSH_PROVIDER=stub` or the app crashes / API falls back to stub. CI secret `GOOGLE_SERVICES_JSON` for release APKs.

Docs: `web/public/downloads/README.md`, `web/CLAUDE.md`, `mobile/CLAUDE.md`.

## AI job enrich (`api/src/ai/`)

- Toggle: `AI_ENRICH_ENABLED` (default off)
- Providers: `stub` | `groq` (free tier) | `ollama` (local free) | `openai`
- Wired into bulk ingestion + quick/paste job create; preview via `POST /v1/ai/job-enrich`
- Docs of record: [api/src/ai/CLAUDE.md](../../../api/src/ai/CLAUDE.md)

## Payments / UPI (`api/src/payments/`)

- Follow project skill [xcron-payments](../xcron-payments/SKILL.md) for every
  gateway change (Strategy/Adapter, factory, free-first UPI QR/VPA).
- Gateways: `stub` | `upi` | `razorpay` (+ future Cashfree/PhonePe adapters)
- Docs of record: [api/src/payments/CLAUDE.md](../../../api/src/payments/CLAUDE.md)

## Notifications (`api/src/notifications/`)

- Strategy/Adapter: `PUSH_PROVIDER=stub|fcm`, `MAIL_PROVIDER=stub|console|smtp`
- Job publish → subscriber fan-out (in-app + push + mail) + dispatch/delivery history
- Docs of record: [api/src/notifications/CLAUDE.md](../../../api/src/notifications/CLAUDE.md)
