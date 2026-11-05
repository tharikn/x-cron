---
name: xcron-claude-md
description: >-
  Keep X Cron CLAUDE.md agent guides, technical docs (features/bugs/releases),
  env files, and Prisma DDL migrations in sync whenever code changes. Use when
  editing api/, mobile/, web/, docs/, env keys (.env, .env.example, env-dev),
  prisma schema, APK sideload / version.json updates, shipping a release, fixing
  a bug, or a new feature module — especially AI enrich, OCR, ingestion, jobs,
  payments/UPI gateways, seeker retention.
---

# X Cron — update CLAUDE.md + technical docs on every change

## Rule (verbatim)

wherever you make changes just add claude.md file

## Technical project documents (verbatim rule)

Pls do have project document, whatver any changes done or feature implementation made should keep the technical document updated for every feature any bugs releases that should preserve.

Code is not done until the **project technical docs** reflect it. Preserve a durable record of features, bug fixes, and releases — do not leave `docs/` stale.

## What to do

1. After substantive edits in a package (`api/`, `mobile/`, `web/`) or a new feature folder, **update the nearest `CLAUDE.md`**.
2. If you create a new module directory (e.g. `api/src/ai/`), **add `CLAUDE.md` in that folder** describing purpose, env toggles, endpoints, and agent rules.
3. Also bump the package-level guide when env keys, modules, or smoke paths change:
   - [api/CLAUDE.md](../../../api/CLAUDE.md)
   - [mobile/CLAUDE.md](../../../mobile/CLAUDE.md)
   - [web/CLAUDE.md](../../../web/CLAUDE.md)
   - root [CLAUDE.md](../../../CLAUDE.md) for monorepo-wide rules
4. **Update technical project docs** (see **Technical docs map** below) for every feature, bug fix, and release.
5. Keep env files aligned (see **Env files** below); never commit real secrets into `.env.example`.
6. Keep **Prisma DDL** aligned (see **Prisma / migrations** below) whenever persisted shape changes.
7. Prefer short, accurate deltas — do not rewrite unrelated sections.

## Technical docs map

Canonical project docs live under [`docs/`](../../../docs/). Update the matching file(s) in the **same change** as the code:

| Change type | Update |
| --- | --- |
| New / changed feature (API, mobile, web) | [`docs/DEVELOPER.md`](../../../docs/DEVELOPER.md) — add/adjust under **What was implemented**; note stubs vs live |
| New release step / status | [`docs/ROADMAP.md`](../../../docs/ROADMAP.md) — scope + Done/In progress |
| New files / folders of record | [`docs/FILE_MAP.md`](../../../docs/FILE_MAP.md) — inventory rows |
| MVP include / defer list changes | [`docs/MVP_COMPLETE.md`](../../../docs/MVP_COMPLETE.md) |
| Bug fix (user-visible or shipped) | `docs/DEVELOPER.md` — short note under the relevant release/area (what broke, what fixed); APK bug-fix → also release notes via `scripts/release-apk.mjs` / GitHub Release body |
| APK / client release | Follow **Android APK sideload** below; keep version + notes preservable on GitHub Releases |
| Feature needs its own design/runbook | Add or update a focused doc under `docs/` (e.g. `CHANNEL_PULL.md`, `FCM_SETUP.md`) and link it from `DEVELOPER.md` |
| Cost / ops model | [`docs/COST_MODEL.md`](../../../docs/COST_MODEL.md) when quotas/pricing/ops change |

**Do not:**

- Ship a feature or bugfix with only code/`CLAUDE.md` and leave `docs/DEVELOPER.md` (and FILE_MAP when files moved) unchanged.
- Delete historical release/feature notes — **preserve** prior entries; append or mark superseded.
- Invent a parallel docs tree outside `docs/` + package `CLAUDE.md` files.

## Prisma / migrations (verbatim rule)

db ddl changes are preserved as migration scripts so that higher environments can store and retrieve the data

Whenever domain code needs **new or changed persistent columns/tables/indexes/enums** (Postgres via Prisma):

1. Update [`api/prisma/schema.prisma`](../../../api/prisma/schema.prisma) first (source of truth).
2. **Always add a versioned migration** under `api/prisma/migrations/<timestamp>_<name>/migration.sql` — never ship schema-only / `db push`-only for features that higher envs (staging/prod Render) must store or read.
3. Wire read/write in the Prisma store/map path used when `*_STORE=prisma` (or `JOBS_STORE` fallback) — memory-only fields that higher envs must keep **are not done**.
4. Run locally: `cd api && npm run prisma:validate` (and migrate against local Postgres when available).
5. Mention the new models/fields in the nearest module `CLAUDE.md` + `api/CLAUDE.md` smoke/persistence notes.

**Do not:**

- Add Job/seeker/payment/auth columns only on TypeScript `*.types.ts` / memory Maps and call the feature “done” for production.
- Edit old migration files that may already be applied in higher envs — add a **new** forward migration instead.
- Put secrets or environment-specific data into migration SQL (DDL + safe seeds only).

Deploy path for higher envs: `npm run prisma:migrate` (or the host’s migrate deploy) against prod `DATABASE_URL` so tables/columns exist before traffic hits the new code.

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
| Latest on home Download | GitHub `…/releases/latest` → web `get-app-cta` (version + size + published datetime); history deferred |
| In-app update check | `AppUpdateService` → `environment.githubReleasesLatestUrl` (parses `xcron-manifest` fence in release body) |
| CI | `.github/workflows/android-release.yml` on tag `v*` (or workflow_dispatch) |
| Manifest helper | `scripts/apk-release-manifest.mjs` |
| Local smoke only | `cd web && npm run sync:apk` (gitignored local file; **not** prod) |
| Stable APK signing / Google Sign-In SHA-1 | Committed `mobile/android/app/debug.keystore` (wired in `build.gradle`). Android OAuth client: package `com.xcron.jobs` + SHA-1 `82:DC:02:56:2D:7F:F2:62:C9:ED:20:39:C1:55:7F:54:E8:CF:AF:22` |

**Ship a bug-fix APK**

Preferred (automated bump + tag + push):

```bash
node scripts/release-apk.mjs --ship
# or: cd mobile && npm run release:apk:ship
# options: --version 1.1.0 --notes "…" --dry-run
```

Manual equivalent:

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

## In-app help chatbot (`api/src/ai/help/`)

- Toggle: `AI_HELP_ENABLED` (default off); signed-in floating FAB on web + mobile
- Free/low model (Groq `openai/gpt-oss-20b`); `@ChatThrottle` + per-user cooldown + daily token budget
- Docs of record: [api/src/ai/help/CLAUDE.md](../../../api/src/ai/help/CLAUDE.md)

## Guest vs signed-in chrome (web + mobile)

- Follow project skill [xcron-ui-auth](../xcron-ui-auth/SKILL.md) when adding
  drawer, tab, header, footer, or account menu links.
- Auth-only until login: Settings, Notifications, My Rating, Saved jobs
  (plus header notif bell / matching footer quick links).

## Payments / UPI (`api/src/payments/`)

- Follow project skill [xcron-payments](../xcron-payments/SKILL.md) for every
  gateway change (Strategy/Adapter, factory, free-first UPI QR/VPA).
- Gateways: `stub` | `upi` | `razorpay` (+ future Cashfree/PhonePe adapters)
- Docs of record: [api/src/payments/CLAUDE.md](../../../api/src/payments/CLAUDE.md)

## Notifications (`api/src/notifications/`)

- Strategy/Adapter: `PUSH_PROVIDER=stub|fcm`, `MAIL_PROVIDER=stub|console|smtp`
- Job publish → subscriber fan-out (in-app + push + mail) + dispatch/delivery history
- Docs of record: [api/src/notifications/CLAUDE.md](../../../api/src/notifications/CLAUDE.md)
