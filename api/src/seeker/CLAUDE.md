# CLAUDE.md — `api/src/seeker`

Seeker retention: saved jobs, personalised feed, light profile, applications (contacted marker), hidden jobs, saved searches.

## Endpoints (auth required)

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/v1/feed` | Prefs + profile skills ranked; excludes hidden |
| GET/POST/DELETE | `/v1/me/saved-jobs[/:jobId]` | Bookmark published jobs (clients: Settings → Saved / web `/me` list + Remove) |
| GET/PATCH | `/v1/me/profile` | Light profile (skills, cities, experience band, openToWork) |
| GET/POST | `/v1/me/applications[/:jobId]` | Contact-first “I reached out” marker |
| GET/POST/DELETE | `/v1/me/hidden-jobs[/:jobId]` | Not interested (+ optional employer hide) |
| GET/POST/PATCH/DELETE | `/v1/me/saved-searches[/:id]` | Exact query + optional `alertEnabled` |

## Storage

Runtime today: in-memory `SeekerStore` (cleared on API restart / account wipe).

**DDL (higher envs):** Prisma models `SeekerProfile`, `SeekerApplication`, `HiddenJob`, `SavedSearch` + Job `lat`/`lng`/`walkInAt`/`applyBy` + Employer `slug`/`about`/`logoUrl` ship in migration `20261104050000_seeker_job_geo_walkin`. Apply with `npm run prisma:migrate` / migrate deploy before relying on Postgres. Prisma seeker store wiring can follow; do not add more seeker fields without a new forward migration.

## Agent rules

- Keep contact-first: applications are `contacted`/`applied` markers, not ATS resume inbox.
- Feed must respect hidden jobs/employers.
- `jobMatchesSavedQuery` is used by notifications fan-out for saved-search alerts.
