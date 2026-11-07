# CLAUDE.md — `api/src/jobs/`

Public job search/detail, recruiter self-serve CRUD, Blog Approval moderation, and listing lifecycle.

## Status map (blueprint → X Cron)

| Blueprint | X Cron `JobStatus` | Notes |
| --- | --- | --- |
| DRAFT | `draft` | Create without publish; **also** employer deactivate (“pause”) |
| PENDING_REVIEW | `needs-review` | Blog Approval / import path (no `directPublish`) |
| PUBLISHED | `published` | Live in search when inside listing window |
| PAUSED | `draft` via `deactivate` | No separate `paused` status in MVP |
| CLOSED | `removed` via `hide` | No separate `closed` status in MVP |
| EXPIRED | `expired` | Auto-set when past `expiresAt` |
| REJECTED / REMOVED | `rejected` / `removed` | Admin reject; hide / soft-delete |

## Lifecycle

- Transitions enforced in `jobs.lifecycle.ts` (`JobsLifecycleService.assertTransition`) for actors `employer` | `admin` | `system`.
- Callers: `activate` / `deactivate` / `hide` / `renew` / `approve` / `reject` / auto-expire / duplicate auto-reject.
- Employer PATCH must not change `status` (stripped in `JobsService.updateMyJob`).

```
draft|expired → published     (activate / renew)
published → draft             (deactivate)
published → expired           (system: past expiresAt)
needs-review → published      (admin approve)
needs-review → rejected       (admin reject / system duplicate)
* → removed                   (hide; limited source statuses)
```

## Auto-expire

- `JobsScheduler` (in-process) ticks every `JOB_EXPIRE_TICK_MS` (default 5m) when `JOB_EXPIRE_SCHEDULE_ENABLED=1`.
- Also flips on public detail (`getById` / `getBySlug`) and on `POST …/apply` so status is correct without waiting for the tick.
- Search already requires `status === published` **and** `effectiveFrom`→`expiresAt` window (`listPublished`).

## Apply gate

`ApplicationsService` rejects apply when status is not `published`, listing window closed, or past optional `applyBy`. Time-expired published rows are flipped to `expired` first.

## Env

| Key | Default | Notes |
| --- | --- | --- |
| `JOB_EXPIRE_SCHEDULE_ENABLED` | `1` | `0` disables background expire watcher |
| `JOB_EXPIRE_TICK_MS` | `300000` | Interval (min 60s) |

## Discovery / search (Phase 1)

- Shared filter + sort: `jobs-search.util.ts`; ranking + reasons: `jobs-match.util.ts`
- Filters: keyword/`q`, location, jobType, category, language, skills, salaryMin, remote, postedWithin, near/radius, walkInOnly, verifiedEmployer, fresher, easyApply
- Hits may include `matchReasons` (text only — never %). Signed-in search excludes hidden jobs via `SeekerService.discoveryHints`
- Aliases: `GET /v1/jobs/search`, `GET /v1/jobs/recommendations` → feed, `POST /v1/jobs/:jobId/not-relevant` → hide
- Design: [../../docs/JOB_DISCOVERY.md](../../docs/JOB_DISCOVERY.md)

## Agent rules

- Do not invent `paused` / `closed` statuses without a Prisma migration + client labels.
- Keep salary visible on public DTOs (India MVP); do not add unlock paywall.
- Postgres FTS (`tsvector` / `pg_trgm`) is on when `SEARCH_FTS_ENABLED` / `JOBS_STORE=prisma` — see migration `20261107180000_outbox_and_job_fts`. Do not add Meilisearch without measured need.
- After lifecycle or search changes: update this file + `api/CLAUDE.md` + `docs/DEVELOPER.md` + `docs/FILE_MAP.md` (+ `docs/JOB_DISCOVERY.md` for discovery).
