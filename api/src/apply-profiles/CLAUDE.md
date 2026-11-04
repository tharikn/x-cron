# CLAUDE.md — `api/src/apply-profiles/`

Multi-version **apply profiles** for seekers (Naukri-style skill/project/portfolio versions). **No CV/resume upload** — versions are structured data only.

## Concept

A seeker may keep several named versions (e.g. “Frontend”, “Backend”). On formal apply they pick one; the API freezes a **snapshot** onto `JobApplication.applyProfileSnapshotJson`.

Light feed prefs stay in [`../seeker/`](../seeker/CLAUDE.md) (`/v1/me/profile`). Formal ATS apply lives in [`../applications/`](../applications/CLAUDE.md).

## Limits

| Cap | Default |
| --- | --- |
| Versions per user | 8 |
| Skills per version | 2–7 (badge UI on clients) |
| Projects | 12 |
| Portfolio links | 10 |
| Tech tags / project | 20 |

## Endpoints (auth)

| Method | Path |
| --- | --- |
| GET | `/v1/me/apply-profiles` |
| GET | `/v1/me/apply-profiles/:id` |
| POST | `/v1/me/apply-profiles` |
| PATCH | `/v1/me/apply-profiles/:id` |
| DELETE | `/v1/me/apply-profiles/:id` |

First version (or `isDefault: true`) becomes the default; clearing default promotes another when possible.

## Storage

- `APPLY_PROFILES_STORE=prisma|memory` (falls back to `APPLICATIONS_STORE` → `JOBS_STORE`)
- Prisma model `ApplyProfile` — migration `20261104230000_apply_profiles_chat`
- Account wipe → `ApplyProfilesService.clearForUser`

## Apply readiness

`assertReadyForApply(profile)` — used by `ApplicationsService.apply`. A version is submit-ready when it has at least one of: **skills**, **headline**, **summary**, or a **project** with a title. Named empty shells are rejected.

## Agent rules

- Never add resume/CV file upload here
- Snapshot on apply is owned by applications module (`toSnapshot`)
- Keep version count capped; do not invent portfolio URLs
- Account wipe → `clearForUser` (wired from `account/`)
