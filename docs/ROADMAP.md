# X Cron Jobs — build roadmap (from PRD §26)

| Step | Release | Scope | Status |
| --- | --- | --- | --- |
| 0 | R0 | Brand, monorepo, cost model, PRD baseline | Done |
| 1 | R1 foundation | NestJS API jobs/search/preferences + Prisma schema + mobile wired to API | Done |
| 2 | R1 discovery | Auth (OTP), employer accounts, admin moderation | Done |
| 3 | R1 web | Angular SSR public job pages + SEO | Done |
| 4 | R2 | Bulk ingestion, OCR adapters, Capacitor camera/files | Done |
| 5 | R3 | Contact vault, ₹5 unlock, Razorpay webhooks, entitlements | Done |
| 6 | R4 | Synced preferences, FCM notifications | Done |
| 7 | R5 | Ads, promotions, scale/cost tuning | Done |
| — | MVP+ | Subscriptions, saved jobs, feed, account delete, quotas | **Done** |

## Step 7 acceptance

- [x] Configurable ad placements + frequency caps (`GET /v1/ads/slots/{slot}`)
- [x] Clearly labelled creatives; impression/click events (`POST /v1/ads/events`)
- [x] Employer promotion packages + stub purchase; boosted jobs badged in search
- [x] Admin placement/creative management
- [x] Cost model + quotas + scale hints (`/v1/ops/*`, `docs/COST_MODEL.md`)
- [x] Mobile discover/detail ad slots; Post → promote; web home ad rail
