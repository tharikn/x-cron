# CLAUDE.md — `api/src/seeker`

Seeker retention: saved jobs, personalised feed, light profile, applications (contacted marker), hidden jobs, saved searches.

## Endpoints (auth required)

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/v1/feed` | Prefs + profile skills ranked; excludes hidden |
| GET/POST/DELETE | `/v1/me/saved-jobs[/:jobId]` | Bookmark published jobs (clients: Settings → Saved / web `/me` list + Remove) |
| GET/PATCH | `/v1/me/profile` | Profile: personal (name/mobile/email/showContact), location (address/pincode), career (fresher/experienced + education + notice badges); also skills/cities/openToWork for feed |
| GET/POST | `/v1/me/applications[/:jobId]` | Contact-first “I reached out” marker |
| GET/POST/DELETE | `/v1/me/hidden-jobs[/:jobId]` | Not interested (+ optional employer hide) |
| GET/POST/PATCH/DELETE | `/v1/me/saved-searches[/:id]` | Exact query + optional `alertEnabled` |

## Storage

Runtime today: in-memory `SeekerStore` (cleared on API restart / account wipe).

**DDL (higher envs):** Prisma models `SeekerProfile`, `SeekerApplication`, `HiddenJob`, `SavedSearch` + Job `lat`/`lng`/`walkInAt`/`applyBy` + Employer `slug`/`about`/`logoUrl` ship in migration `20261104050000_seeker_job_geo_walkin`. Career/personal columns (`mobile`, `email`, `showContact`, `address`, `pincode`, `careerStage`, education/internship/company/salary/notice fields) ship in `20261104235000_seeker_profile_career`. Apply with `npm run prisma:migrate` / migrate deploy before relying on Postgres. Runtime store is still in-memory; Prisma seeker store wiring can follow — do not add more seeker fields without a new forward migration.

## Agent rules

- Keep contact-first: `/v1/me/applications` markers stay `contacted`/`applied` for phone/WA taps — **not** the ATS inbox.
- Formal apply → offer letter lives in [`../applications/`](../applications/CLAUDE.md) (`/v1/jobs/:jobId/apply`, `/v1/me/job-applications`, employer review).
- Multi-version skillset / portfolio (no CV) lives in [`../apply-profiles/`](../apply-profiles/CLAUDE.md) — do not overload light `SeekerProfile`.
- Feed must respect hidden jobs/employers.
- `jobMatchesSavedQuery` is used by notifications fan-out for saved-search alerts.
