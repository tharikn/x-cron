# MVP complete checklist (post R0–R5)

This marks the **product MVP slice** as complete for local demo and iteration. It is **not** a production launch certificate.

## Included in MVP

| Area | Status |
| --- | --- |
| Guest search + monochrome UI | Done |
| Discovery Phase 1 (URL chips, match reasons, richer filters) | Done — [JOB_DISCOVERY.md](./JOB_DISCOVERY.md); Meilisearch/metrics deferred |
| Username/password auth, employer post, admin moderation | Done |
| SSR SEO job pages + sitemap | Done |
| Bulk import (CSV/Excel/text/OCR stub) | Done |
| Partner API + XML/JSON feeds + Zapier/Sheet (lean, ₹0) | Done |
| ₹5 contact unlock + Razorpay webhook stub | Done |
| **Subscriptions** (weekly/monthly unlimited unlocks) | Done |
| Prefs sync + FCM stub + in-app alerts | Done |
| Ads / employer promotions + cost model | Done |
| **Saved jobs** + **personalised feed** | Done |
| **Account deletion** (`DELETE /v1/me`) | Done |
| Import / unlock **quota enforcement** | Done |
| **Feedback hub** (FAQ + Contact Admin messenger seeker/recruiter → admin) | Done |
| **Admin trust & moderation** (cases, reports, audit, suspend, appeals, `moderator`) | Done — [ADMIN_TRUST_MODERATION.md](./ADMIN_TRUST_MODERATION.md) |
| Prisma schema (incl. SavedJob, Subscription, FeedbackThread, ModerationCase) | Ready |

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
