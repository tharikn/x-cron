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

## Android APK sideload updates

Sideload path (not Play Store). Hosted files on web:

- APK: `web/public/downloads/xcron-jobs.apk` (gitignored binary)
- Manifest: `web/public/downloads/version.json` (committed; mobile reads this)
- Sync: `cd web && npm run sync:apk` (copies APK from mobile debug build, writes `version.json` from `mobile/android/app/build.gradle`, bumps web `androidApkVersion` / `androidApkSizeLabel`)
- Native check: `mobile` `AppUpdateService` → `environment.appUpdateManifestUrl` on launch; prompts Update / Later when hosted `versionCode` > installed build

**Ship a bug-fix APK**

1. Bump `versionCode` (required) + `versionName` in `mobile/android/app/build.gradle`.
2. `cd mobile && npx cap sync android && cd android && ./gradlew assembleDebug` (Windows: `.\gradlew.bat assembleDebug`).
3. `cd web && npm run sync:apk` (optional `SITE_URL=…` / `APK_NOTES=…`).
4. Deploy web so APK + `version.json` update together.
5. Users already on a build that includes `AppUpdateService` get the in-app prompt; others re-download from the site CTA.

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
