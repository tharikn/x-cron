# CLAUDE.md — `api/src/reputation`

**Performance Score** for seekers and employers (recruiters). Builds confidence: thoughtful applies and responsive chat raise score; low-fit applies lower it.

## Scoring (0–100, start 50)

| Role | Event | Δ | Notes |
| --- | --- | --- | --- |
| Seeker | `apply_active` | +1 | Daily cap 3 |
| Seeker | `apply_good_match` | +4 | Fit ≥50% (skills + experience) |
| Seeker | `apply_poor_match` | −5 | Fit &lt;50% |
| Seeker | `message_reply` | +2 | Reply after employer chat |
| Employer | `application_viewed` | +1 | First open |
| Employer | `status_advanced` | +2 | Status moved (review → decide) |
| Employer | `message_reply` | +2 | Reply after seeker chat |

Bands: **Rising** ≥70 · **Steady** 50–69 · **Needs care** &lt;50.

Match %: `match-score.util.ts` — 70% skills overlap vs job skills/requirements, 30% experience band vs `experienceLabel`. Stored on `JobApplication.matchPercent` at apply.

## Endpoints

| Method | Path | Auth |
| --- | --- | --- |
| GET | `/v1/reputation/me?role=seeker\|employer` | Session — tips + event ledger |
| GET | `/v1/reputation/users/:userId?role=` | Session — public band for counterpart |

Application list/detail DTOs include `matchPercent` and `reputation` summary for the counterpart.

## Storage

`REPUTATION_STORE=prisma|memory` (falls back to `JOBS_STORE`). Prisma: `UserReputation`, `ReputationEvent` + `JobApplication.matchPercent`.

Wired from `ApplicationsService` on apply / first employer view / status transition / chat reply. Account wipe clears reputation.

## Agent rules

- Do not invent contacts or fake ratings — only event-driven deltas.
- Keep daily caps so velocity spam cannot farm score.
- Update this file + `docs/PERFORMANCE_SCORE.md` when rules change.
