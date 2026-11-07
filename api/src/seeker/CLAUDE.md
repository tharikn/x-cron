# CLAUDE.md — `api/src/seeker`

Seeker retention: saved jobs, personalised feed, light profile, applications (contacted marker), hidden jobs, saved searches.

## Endpoints (auth required)

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/v1/feed` | Prefs + profile skills ranked via `jobs-match.util`; `matchReasons`; excludes hidden. Alias: `GET /v1/jobs/recommendations` |
| GET/POST/DELETE | `/v1/me/saved-jobs[/:jobId]` | Bookmark published jobs (clients: Settings → Saved / web `/me` list + Remove) |
| GET/PATCH | `/v1/me/profile` | Profile: personal (name/mobile/email/showContact), location (address/pincode), career (fresher/experienced + education + notice badges); also skills/cities/openToWork for feed. Response includes computed `completion` (`percent`, `complete`, `items[]` with value-forward hints) — progressive checklist for Account/`/me` (personal · location · career · skills/cities · default apply-profile ready). Not a hard apply gate. |
| GET/POST | `/v1/me/applications[/:jobId]` | Contact-first “I reached out” marker |
| GET/POST/DELETE | `/v1/me/hidden-jobs[/:jobId]` | Not interested (+ optional employer hide). Alias: `POST /v1/jobs/:jobId/not-relevant` |
| GET/POST/PATCH/DELETE | `/v1/me/saved-searches[/:id]` | Exact query + optional `alertEnabled` (parity with search filters incl. postedWithin / near / skills / verified / fresher / easyApply) |

## Storage

- `SEEKER_STORE=prisma|memory` (falls back to `JOBS_STORE`)
- Dual store: abstract `SeekerStore` → `seeker.memory-store.ts` | `seeker.prisma-store.ts` (factory in `seeker.module.ts`)
- Prisma models: `SeekerProfile`, `SavedJob`, `SeekerApplication`, `HiddenJob`, `SavedSearch`
- DDL: migration `20261104050000_seeker_job_geo_walkin` (+ Job geo/walk-in + Employer slug); career/personal columns in `20261104235000_seeker_profile_career`
- Apply with `npm run prisma:migrate` / migrate deploy before relying on Postgres
- Account wipe → `SeekerService.clearUser` (deletes profile + saved/hidden/applications/searches)

## Agent rules

- Keep contact-first: `/v1/me/applications` markers stay `contacted`/`applied` for phone/WA taps — **not** the ATS inbox.
- Formal apply → offer letter lives in [`../applications/`](../applications/CLAUDE.md) (`/v1/jobs/:jobId/apply`, `/v1/me/job-applications`, employer review). Apply contact gate reads this profile’s `displayName` / `mobile` / `email` when auth identity has none.

- Multi-version skillset / portfolio (no CV) lives in [`../apply-profiles/`](../apply-profiles/CLAUDE.md) — do not overload light `SeekerProfile`.
- Feed must respect hidden jobs/employers.
- `discoveryHints(user)` supplies hidden ids + skills/locations/remote for public search ranking.
- `jobMatchesSavedQuery` reuses `filterJobs` (notifications fan-out for saved-search alerts).
- Do not add more seeker fields without a new forward Prisma migration + store mapping.
- Discovery design: [../../docs/JOB_DISCOVERY.md](../../docs/JOB_DISCOVERY.md)
