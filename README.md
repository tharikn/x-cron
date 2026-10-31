# X Cron Jobs

Local-first, multilingual job discovery and publishing. India-first, mobile-first, monochrome (black & white).

Product baseline: PRD v1.0 (31 Oct 2026). Build order follows [docs/ROADMAP.md](docs/ROADMAP.md).  
**Developers:** start at [docs/DEVELOPER.md](docs/DEVELOPER.md) (what shipped, stubs, runbook, release readiness).

## Monorepo

| Path | Role |
| --- | --- |
| `mobile/` | Ionic + Capacitor + Angular Android client |
| `api/` | NestJS modular monolith (`/v1/*`) |
| `web/` | Angular SSR public SEO site |
| `docker-compose.yml` | PostgreSQL for later Prisma runtime |

## Quick start

Requires **Node.js 22.22.3+**.

```bash
# API (memory store — no Postgres required yet)
cd api
npm install --legacy-peer-deps
npm run start:dev
# http://localhost:3000/v1/health
# http://localhost:3000/docs

# Mobile
cd ../mobile
npm install
npm start
# http://localhost:4200  → talks to http://localhost:3000/v1

# Public web (SSR)
cd ../web
npm install
npm start
# http://localhost:4201
# Production-like SSR: npm run build && npm run serve:ssr  → http://localhost:4000
```

### Bulk import demo (Step 4)

1. Sign in as employer (OTP).
2. Mobile → Post → **Bulk import**.
3. Upload a CSV (`title,employer,location,jobType,salary,description,phone`) or paste WhatsApp text / take a screenshot.
4. Review extracted rows (contacts masked) → Approve selected → jobs enter admin moderation.

OCR for images/PDF is a stub provider (`OCR_PROVIDER`) — no invented facts; records require review.

### MVP+ (subscriptions, saved jobs, feed)

1. Sign in as seeker → Account → pick weekly/monthly plan → stub subscribe.
2. Save jobs from job detail; list under Account → Saved jobs.
3. Set Preferences → Account → Your feed (matched listings).
4. `DELETE /v1/me` deletes account + entitlements (Account → Delete account).
5. See [docs/MVP_COMPLETE.md](docs/MVP_COMPLETE.md) for what is still post-MVP.

### Ads, promotions & cost (Step 7)

1. Discover / web home show **labelled** ad slots (`Advertisement`) — never disguised as jobs.
2. Employer → Post → **Promote a job** (stub packages) → search shows Featured/Promoted badge.
3. Admin: `GET /v1/ops/cost-model|metrics|quotas|scale` (sign in as `admin@xcron.local`).
4. Planning doc: [docs/COST_MODEL.md](docs/COST_MODEL.md).

### Preferences + notifications demo (Step 6)

1. Guest: save Preferences → stored by `deviceId` on API (+ local cache).
2. Sign in → mobile claims device prefs into `/v1/me/preferences`.
3. Enable **Job match alerts** (signed-in). Device registers a stub FCM token via `POST /v1/devices`.
4. Admin approve a matching job → in-app notification + FCM stub send; inbox on Account.
5. Quiet hours / daily cap suppress or limit pushes (`NOTIFICATION_MODE=stub`).

### Contact unlock demo (Step 5)

1. Sign in as seeker (OTP).
2. Open a published job → **Unlock contact** (₹5 / 500 paise).
3. Default `PAYMENT_MODE=stub` confirms via `POST /v1/payments/dev/confirm` (no real Razorpay charge).
4. `GET /v1/jobs/{id}/contact` returns phone/email/WhatsApp only after entitlement; responses are `no-store`.
5. Webhook path: `POST /v1/payments/webhooks/razorpay` with `x-razorpay-signature` HMAC-SHA256 (`RAZORPAY_WEBHOOK_SECRET`, default `dev_secret`).

### Auth demo (Step 2)

- Guest browse/search stays public.
- OTP: use any email/phone; in development the API returns `devCode` (`123456`).
- Admin: sign in as `admin@xcron.local` to approve/reject the moderation queue.
- Employer posts require OTP sign-in and enter `needs-review` until approved.

```bash
# Optional Postgres (for upcoming Prisma store)
docker compose up -d
```

## Daily compile + push

```bash
cd api && npm run build
cd ../mobile && npm run build
cd ..
git add .
git commit -m "describe the change"
git push origin main
```

## Brand

**X Cron** (uppercase X, title-case Cron). Descriptor: Jobs. UI is black/white/grayscale only.
