# X Cron Jobs — build roadmap (from PRD §26)

| Step | Release | Scope | Status |
| --- | --- | --- | --- |
| 0 | R0 | Brand, monorepo, cost model, PRD baseline | Done |
| 1 | R1 foundation | NestJS API jobs/search/preferences + Prisma schema + mobile wired to API | **In progress** |
| 2 | R1 discovery | Auth (OTP), employer accounts, admin moderation | Next |
| 3 | R1 web | Angular SSR public job pages + SEO | Planned |
| 4 | R2 | Bulk ingestion, OCR adapters, Capacitor camera/files | Planned |
| 5 | R3 | Contact vault, ₹5 unlock, Razorpay webhooks, entitlements | Planned |
| 6 | R4 | Synced preferences, FCM notifications | Planned |
| 7 | R5 | Ads, promotions, scale/cost tuning | Planned |

## Step 1 acceptance (this push)

- [x] `GET /v1/jobs` guest search with filters/sort
- [x] `GET /v1/jobs/:id` public job DTO (masked contact only)
- [x] `GET /v1/jobs/:id/contact` denies without entitlement
- [x] `POST /v1/employers/jobs` + paste endpoint
- [x] Prisma schema for PRD entities
- [x] Mobile uses API with offline mock fallback
- [x] `npm run build` for api + mobile
