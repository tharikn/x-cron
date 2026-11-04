# CLAUDE.md — `api/src/applications/`

Formal **ATS job applications**: seeker apply (with apply-profile version) → employer review → offer / job letter → hired, with a Naukri-style **append-only timeline** (ISO date + hour), **in-app chat**, and system notifications on every action.

Contact-first markers stay in [`../seeker/`](../seeker/CLAUDE.md) (`/v1/me/applications`) — do not overload them.

**No CV/resume.** Apply requires `applyProfileId` from [`../apply-profiles/`](../apply-profiles/CLAUDE.md); a frozen snapshot is stored on the application.

## Status machine

`applied` → `under_review` → `shortlisted` → `interview` → `offered` (job letter) → `hired`  
Also: `rejected`, `withdrawn` (seeker). Transitions enforced in `applications.service.ts` via `EMPLOYER_TRANSITIONS` / `SEEKER_TRANSITIONS`.

Issuing `offered` requires `offerLetterText` (appointment / offer letter body).

## Timeline

`ApplicationEvent` rows are append-only: `applied`, `viewed_by_employer`, `status_changed`, `offer_issued`, `note_added`, `withdrawn`, `chat_message`. Each has `at` (full ISO datetime). First employer open of a detail sets `viewedAt` + timeline + seeker notify.

## Chat

Seeker ↔ recruiter messages on an application (`ApplicationMessage`). Endpoints under seeker and employer paths; both call the same service with participant checks. Notifies the other party via `onApplicationEvent` (`chat_message`).

## Anti-spam (apply)

- `@ApplyThrottle()` on `POST .../apply` — burst limit (`APPLY_RATE_LIMIT_MAX` / `APPLY_RATE_LIMIT_TTL_MS`, default **5/min**).
- **Cooldown** between applies (`APPLY_COOLDOWN_MS`, default **30s**).
- **Hourly cap** (`APPLY_HOURLY_CAP`, default **8**).
- Per-seeker **UTC daily cap** (`APPLY_DAILY_CAP`, default **20**) via `countCreatedBySeekerSince` — includes withdrawn creates; `403` when exceeded.
- Unique `(seekerUserId, jobId)`; no re-apply after withdraw.
- Ops policy key `seeker_applies` + `OpsService.recordApply()`.
- **Profile gate (P0.2):** owned `applyProfileId` must pass `assertReadyForApply` (skills / headline / summary / project); contact needs **display name** + **phone or email**. Empty shells → `400`. Snapshot frozen on the application.
- **Identical cover note (P1):** normalized note reuse capped (`APPLY_IDENTICAL_NOTE_MAX` default **2** in `APPLY_IDENTICAL_NOTE_WINDOW_MS` default **24h**). Empty notes skip; `403` when exceeded.
- **Screening question (P1):** when `Job.screeningQuestion` is set, apply requires `screeningAnswer` (≥2 chars) → stored on the application; missing → `400`.
- **Velocity spam badge (P2):** soft flag at apply (`likelySpam` + `spamReasons`) when seeker hits `APPLY_VELOCITY_FLAG_HOURLY` (default **5**) or `APPLY_VELOCITY_FLAG_DAILY` (default **12**) — **does not block**. Employer list/detail expose `spamBadge: "Likely spam"`; seeker views omit these fields.
- **Performance Score:** on apply computes `matchPercent` and calls `ReputationService` (good/poor fit + active apply). Employer first view, status advance, and chat replies also update scores. List/detail DTOs include `matchPercent` + counterpart `reputation` summary — see [../reputation/CLAUDE.md](../reputation/CLAUDE.md).

## Endpoints

| Method | Path | Role |
| --- | --- | --- |
| POST | `/v1/jobs/:jobId/apply` | auth (seeker); `applyProfileId` + gates + optional `screeningAnswer` |
| GET | `/v1/me/job-applications` | auth |
| GET | `/v1/me/job-applications/:id` | auth (owner seeker) |
| POST | `/v1/me/job-applications/:id/withdraw` | auth (owner seeker) |
| GET/POST | `/v1/me/job-applications/:id/messages` | auth (participant) |
| GET | `/v1/employers/applications` | employer/admin |
| GET | `/v1/employers/jobs/:jobId/applications` | employer/admin + job ownership |
| GET | `/v1/employers/applications/:id` | employer/admin (records first view) |
| POST | `/v1/employers/applications/:id/transition` | employer/admin |
| POST | `/v1/employers/applications/:id/notes` | employer/admin |
| GET/POST | `/v1/employers/applications/:id/messages` | employer/admin |

## Storage

- Default: in-memory (`ApplicationsMemoryStore`)
- `APPLICATIONS_STORE=prisma|memory` (falls back to `JOBS_STORE`)
- Prisma: `JobApplication` + `ApplicationEvent` + `ApplicationMessage` — migrations `20261104210000_…`, `20261104220000_…`, `20261104230000_…`, `20261104233000_job_screening_question`, `20261104234000_application_spam_risk`
- Index `(seekerUserId, createdAt)` for quota counts; `(likelySpam)` for employer filters
- `screeningAnswer` on application when the job has `screeningQuestion`
- `likelySpam` / `spamReasonsJson` snapshot at apply (employer badge only)

## Notifications

Every apply / view / transition / note / withdraw / chat → `NotificationsService.onApplicationEvent` (trigger `application_event`). Payload: `jobId`, `slug`, `applicationId`, `eventType`, `status` — never put phone/WhatsApp in notification text beyond job title/city.

## Agent rules

- Keep seeker contact markers separate from this module
- Enforce ownership (`ownerUserId` / `seekerUserId`) on mutations
- Do not reintroduce `resumeUrl` on apply DTO
- New statuses → update transition maps + labels + this file
- Account wipe clears applications via `ApplicationsService.clearForUser`
