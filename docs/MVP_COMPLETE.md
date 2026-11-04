# MVP complete checklist (post R0–R5)

This marks the **product MVP slice** as complete for local demo and iteration. It is **not** a production launch certificate.

## Included in MVP

| Area | Status |
| --- | --- |
| Guest search + monochrome UI | Done |
| Username/password auth, employer post, admin moderation | Done |
| SSR SEO job pages + sitemap | Done |
| Bulk import (CSV/text/OCR stub) | Done |
| ₹5 contact unlock + Razorpay webhook stub | Done |
| **Subscriptions** (weekly/monthly unlimited unlocks) | Done |
| Prefs sync + FCM stub + in-app alerts | Done |
| Ads / employer promotions + cost model | Done |
| **Saved jobs** + **personalised feed** | Done |
| **Account deletion** (`DELETE /v1/me`) | Done |
| Import / unlock **quota enforcement** | Done |
| Prisma schema (incl. SavedJob, Subscription) | Ready |

## Still deferred (post-MVP / production)

- Persist auth/payments/prefs/ads (jobs + bulk import already support `JOBS_STORE=prisma`)
- Real Razorpay keys, Firebase FCM, production OCR/LLM
- Google Play packaging + billing policy review (AC-20)
- Backups, load tests, malware scan, encrypted vault at rest (AC-23)
- Email campaigns, DOCX/XLSX full parsers
- Radius / nearby search, richer filters, saved searches, seeker profile, contacted marker, hide job, employer self-serve + company page (shipped in seeker-first gap close)

## Local demo

```bash
cd api && npm run start:dev
cd mobile && npm start
```

Seeker: username/password → Preferences → Account subscribe / save jobs / feed.
Employer: username/password (`intendedRole=employer`) → Post → promote. Admin: `SUPER_ADMIN_*` password login.
