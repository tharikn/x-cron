# X Cron Jobs — build roadmap (from PRD §26)

| Step | Release | Scope | Status |
| --- | --- | --- | --- |
| 0 | R0 | Brand, monorepo, cost model, PRD baseline | Done |
| 1 | R1 foundation | NestJS API jobs/search/preferences + Prisma schema + mobile wired to API | Done |
| 2 | R1 discovery | Auth (OTP), employer accounts, admin moderation | Done |
| 3 | R1 web | Angular SSR public job pages + SEO | **Done** |
| 4 | R2 | Bulk ingestion, OCR adapters, Capacitor camera/files | Next |
| 5 | R3 | Contact vault, ₹5 unlock, Razorpay webhooks, entitlements | Planned |
| 6 | R4 | Synced preferences, FCM notifications | Planned |
| 7 | R5 | Ads, promotions, scale/cost tuning | Planned |

## Step 3 acceptance

- [x] Angular SSR web app (`web/`)
- [x] Public home search + job detail + location landing
- [x] Canonical URLs `/jobs/{slug}`
- [x] Title/description/Open Graph + JobPosting JSON-LD (no contact fields)
- [x] `/robots.txt` and `/sitemap.xml` from SSR server
- [x] Monochrome brand chrome
