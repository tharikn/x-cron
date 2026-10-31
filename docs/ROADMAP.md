# X Cron Jobs — build roadmap (from PRD §26)

| Step | Release | Scope | Status |
| --- | --- | --- | --- |
| 0 | R0 | Brand, monorepo, cost model, PRD baseline | Done |
| 1 | R1 foundation | NestJS API jobs/search/preferences + Prisma schema + mobile wired to API | Done |
| 2 | R1 discovery | Auth (OTP), employer accounts, admin moderation | Done |
| 3 | R1 web | Angular SSR public job pages + SEO | Done |
| 4 | R2 | Bulk ingestion, OCR adapters, Capacitor camera/files | **Done** |
| 5 | R3 | Contact vault, ₹5 unlock, Razorpay webhooks, entitlements | Next |
| 6 | R4 | Synced preferences, FCM notifications | Planned |
| 7 | R5 | Ads, promotions, scale/cost tuning | Planned |

## Step 4 acceptance

- [x] `POST /v1/import-batches` + text/file uploads + records review + approve
- [x] Parser abstraction: CSV, pasted text/WhatsApp, image/PDF OCR stub
- [x] Extracted contacts never returned in public record DTOs
- [x] Dedupe within batch; low-confidence stays needs_review
- [x] Approved records create jobs in `needs-review` (admin publish gate)
- [x] Mobile bulk import page: clipboard, camera, file picker
- [x] Android camera permission declared
