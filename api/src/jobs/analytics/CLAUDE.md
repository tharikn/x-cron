# CLAUDE.md — `api/src/jobs/analytics/`

Recruiter **posted-job analytics**: listing views, formal applies, and seeker contact taps — with daily series for the per-job board.

## Endpoints

| Method | Path | Role | Notes |
| --- | --- | --- | --- |
| POST | `/v1/jobs/:id/events` | public | `{ type: 'view', viewerKey? }` — once per viewerKey / UTC day; `@AuthThrottle(60/min)` |
| GET | `/v1/employers/jobs` | employer/admin | Each item includes `analytics` totals |
| GET | `/v1/employers/jobs/:id/analytics?days=30` | employer/admin (owner) | KPI totals + daily `{ views, applied, contacted }` series |

## Metrics

| Metric | Source |
| --- | --- |
| **Views** | `JobViewEvent` (memory or Prisma) — deduped by `(jobId, viewerKey, day)` |
| **Applied** | `JobApplication` rows for the job (`appliedActive` excludes `withdrawn`) |
| **Contacted** | `SeekerApplication` contact markers (`/v1/me/applications`) for the job |
| **Rates** | `applyRatePct` / `contactRatePct` = metric ÷ views (null when views = 0) |
| **daysLive** / **reportCount** | from job record |

Clients fire `recordJobView` from job-detail (web + mobile) with a stable `localStorage` viewer key.

## Storage

- Follows `JOBS_STORE=memory|prisma`
- Prisma model `JobViewEvent` + migration `20261105220000_job_view_events`
- Applies/contacted aggregates reuse Applications + Seeker stores (no duplicate event tables)

## Agent rules

- Do not invent unique-viewer / search-impression / source-attribution without a new migration
- Keep contact markers separate from ATS apply (`seeker/` vs `applications/`)
- Owner check on analytics dashboard — never leak another recruiter’s series
- Clients: web `/my-jobs` + `/my-jobs/:id`; mobile `/tabs/my-jobs` + `/tabs/my-jobs/:id`
