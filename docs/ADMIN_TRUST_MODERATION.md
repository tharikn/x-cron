# Admin Trust and Moderation

X Cron adaptation of the job-portal **Administration, Trust and Moderation**
blueprint. Runtime lives in [`api/src/moderation/`](../api/src/moderation/).

## Capabilities

| Capability | How |
| --- | --- |
| Pending jobs | Blog Approval + `new_job_review` cases |
| Employer verification | Company evidence → `employer_verification` queue |
| Abuse reports | Category reports → `reported_target` case + immutable `ModerationReport` rows |
| Search | `GET /v1/moderation/search?q=` (users / companies / jobs) |
| Evidence + history | Case detail + append-only `TrustAuditEvent` (evidence views logged) |
| Suspend / reactivate | Timed or indefinite; sessions revoked while disabled |
| Remove jobs | `POST /v1/admin/jobs/:id/remove` + case decision |
| Appeals | `POST /v1/moderation/appeals` (+ Contact Admin Feedback for messaging) |
| Config | Admin `GET/PUT /v1/admin/moderation/config` (phrases, SLA hours, report threshold) |
| Risk signals | Soft flags for priority; staff can override |

## Roles

- **`admin`** — platform ops + trust
- **`moderator`** — trust desk / Blog Approval only (not Job Fare, payments, site)

Grant: `MODERATOR_EMAILS` env allowlist or `POST /v1/admin/staff/roles`.

## Acceptance criteria mapping

| Criterion | Status |
| --- | --- |
| Every moderation action has actor, timestamp, reason | `TrustAuditEvent` + case `decidedBy` / `decidedAt` / `reason` |
| Moderator ≠ platform admin | Separate `moderator` role |
| Report status trackable | Case `status` + report rows |
| Evidence access restricted + logged | Staff-only case detail; `evidence_viewed` audit |
| Risk flags reviewable / overridable | `override_risk` + `dismissedRiskFlags` |

## UI

- Web Trust desk: `/admin/trust` (moderator or admin)
- Blog Approval: `/blog-approval` (moderator or admin); shows report counts
- Mobile: Account moderation Approve/Reject (+ note to use web Trust desk)

## Env

`MODERATION_STORE`, `MODERATOR_EMAILS`, `MODERATION_SCHEDULE_ENABLED`,
`MODERATION_TICK_MS`
