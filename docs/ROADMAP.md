# X Cron Jobs — build roadmap (from PRD §26)

| Step | Release | Scope | Status |
| --- | --- | --- | --- |
| 0 | R0 | Brand, monorepo, cost model, PRD baseline | Done |
| 1 | R1 foundation | NestJS API jobs/search/preferences + Prisma schema + mobile wired to API | Done |
| 2 | R1 discovery | Auth (username/password; OTP removed), employer accounts, admin moderation | Done |
| 3 | R1 web | Angular SSR public job pages + SEO | Done |
| 4 | R2 | Bulk ingestion, OCR adapters, Capacitor camera/files | Done |
| 5 | R3 | Contact vault, ₹5 unlock, Razorpay webhooks, entitlements | Done |
| 6 | R4 | Synced preferences, FCM notifications | Done |
| 7 | R5 | Ads, promotions, scale/cost tuning | Done |
| — | MVP+ | Subscriptions, saved jobs, feed, account delete, quotas | **Done** |
| — | Channel pull | Free Telegram Bot + WhatsApp bridge → Job Fare admin workflow | **Done (MVP)** |
| — | Apply anti-spam | Throttle/quota/cooldown, profile gate, identical notes, screening Q, velocity badge | **Done** |
| — | Performance Score | Seeker + recruiter trust score (fit ≥50% up / &lt;50% down, chat + review discipline); clear UI + roadmap highlight | **Done (MVP)** |
| — | Onboarding alerts | Welcome + profile-complete on first login; auto profile nudges for first 2 days | **Done** |
| — | Recruiter desk | Separate post screen: Review + Preview + AI chat; confirm preview → `directPublish` live (not Blog Approval) | **Done (MVP)** |

## Step 7 acceptance

- [x] Configurable ad placements + frequency caps (`GET /v1/ads/slots/{slot}`)
- [x] Clearly labelled creatives; impression/click events (`POST /v1/ads/events`)
- [x] Employer promotion packages + stub purchase; boosted jobs badged in search
- [x] Admin placement/creative management
- [x] Cost model + quotas + scale hints (`/v1/ops/*`, `docs/COST_MODEL.md`)
- [x] Mobile discover/detail ad slots; Post → promote; web home ad rail

## Channel pull acceptance (MVP)

- [x] Telegram Bot API adapter (free long-poll / optional webhook) — no paid scrapers
- [x] WhatsApp **manual bridge** only (paste into Job Fare inbox)
- [x] Morning/evening configurable schedule (`Asia/Kolkata`)
- [x] Digest pull → existing import-batch review
- [x] Admin workflow UI (`/tabs/job-fare`) with pipeline tracking
- [x] Design doc: [CHANNEL_PULL.md](./CHANNEL_PULL.md)

## Performance Score acceptance (MVP)

- [x] Dual-role score (seeker + employer/recruiter), start 50, bands Rising / Steady / Needs care
- [x] Apply-time match % (skills + experience); ≥50% raises seeker score, &lt;50% lowers it
- [x] Points for active apply, chat reply, employer view + status advance (daily caps)
- [x] API `GET /v1/reputation/me` + public summary on application DTOs
- [x] Clear UI: mobile `/tabs/performance`, web `/performance`, callouts on Account / Saved / employer inbox
- [x] Design + E2E diagram: [PERFORMANCE_SCORE.md](./PERFORMANCE_SCORE.md)
