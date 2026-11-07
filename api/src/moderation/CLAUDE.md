# CLAUDE.md — `api/src/moderation/`

**Admin Trust & Moderation** — cases, reports, risk signals, suspensions,
appeals, append-only trust audit. Design: [docs/ADMIN_TRUST_MODERATION.md](../../../docs/ADMIN_TRUST_MODERATION.md).

## Roles

| Role | Access |
| --- | --- |
| `moderator` | Trust desk, Blog Approval, suspend/reactivate, company verification decisions |
| `admin` | Everything moderator has + ops/payments/Job Fare/site + `PUT /admin/moderation/config` + `POST /admin/staff/roles` |

Never grant `moderator` / `admin` via register or Google. Seed moderators with
`MODERATOR_EMAILS` (comma emails) or `POST /v1/admin/staff/roles`.

## Queues

`employer_verification` · `new_job_review` · `reported_target` ·
`suspected_duplicate` · `suspicious_account` · `appeal`

## Endpoints

| Method | Path | Access |
| --- | --- | --- |
| POST | `/v1/reports` | signed-in |
| POST | `/v1/reports/public` | public (throttled) |
| POST | `/v1/jobs/:id/report` | public (throttled; category + details) |
| POST | `/v1/moderation/appeals` | signed-in |
| GET | `/v1/moderation/dashboard` | moderator\|admin |
| GET/PATCH/POST | `/v1/moderation/cases*` | moderator\|admin |
| POST | `/v1/moderation/users/:id/suspend\|reactivate` | moderator\|admin |
| GET | `/v1/moderation/search` · `/audit` | moderator\|admin |
| GET/PUT | `/v1/admin/moderation/config` | admin |

## Storage

- `MODERATION_STORE=prisma|memory` (falls back to `JOBS_STORE`)
- Prisma: `ModerationCase`, `ModerationReport`, `TrustAuditEvent`,
  `AccountSuspension`, `ModerationConfigRow` — migration
  `20261107150000_moderation_trust`

## Agent rules

- Risk signals prioritise only — never auto-ban on one unverified report
- Reporter ids are staff-only; never expose to the reported party
- Every staff decision writes `TrustAuditEvent` (append-only)
- Job Fare / Import / Payments stay `@Roles('admin')` — not moderator
- Env: update `.env.example`, `.env`, `env-dev` for `MODERATION_*` / `MODERATOR_EMAILS`
