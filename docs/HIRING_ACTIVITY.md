# Hiring activity badge (job opening list)

Seeker-facing badge on Discover / Open roles that signals when a recruiter is
**actively reviewing applicants** — without shaming quieter employers.

Related: [APPLICATIONS_TIMELINE.md](./APPLICATIONS_TIMELINE.md) · [PERFORMANCE_SCORE.md](./PERFORMANCE_SCORE.md)

## Product rules

| Rule | Why |
| --- | --- |
| Show **earned positive** labels only | Matches Indeed / LinkedIn; recruiters should not feel judged |
| Never publish **Low / Unresponsive / Quiet** | LinkedIn omits insights when data is thin; we omit the badge |
| Compute per **job opening**, not company-wide | Seekers care about *this* role’s desk |
| Separate from Promoted / Performance Score | Ads ≠ responsiveness; score stays on Applied / Rating surfaces |

### Public labels

| Internal level | Badge copy | Feel |
| --- | --- | --- |
| `high` | **Actively reviewing** | LinkedIn-style; warm amber outline |
| `medium` | **Usually responds** | Soft violet outline; still positive |
| _(none)_ | — | No badge (not “low”) |

## Industry thresholds (anchors)

| Source | Signal | Our use |
| --- | --- | --- |
| LinkedIn — “Actively reviewing applicants” | ≥1 review in past **14 days** | Required for **high**; alone can earn **medium** |
| LinkedIn — review-time insight | Reviewed ~**35%+** of apps (30d) | **Medium** rate floor |
| Indeed — Responsive Employer | Response rate **> 51%** over **30 days** | **High** rate floor (with recent activity) |

### What counts as a “response / review”

From `JobApplication` (no extra event fan-out on list):

- `viewedAt` set (employer opened the application), or
- status moved past `applied` (not `withdrawn`)

Withdrawn applications are excluded from the 30-day rate denominator (seeker-driven).

### Decision table

Let `rate` = reviewed ÷ applications created in the last 30 days (excl. withdrawn).  
Let `recent` = any review activity in the last 14 days.  
Min volume for rate-based badges: **2** applications (avoids 1/1 noise).

| Condition | Level |
| --- | --- |
| `recent` **and** `rate ≥ 0.51` (n ≥ 2) | **high** → Actively reviewing |
| `recent` **or** `rate ≥ 0.35` (n ≥ 2) | **medium** → Usually responds |
| Otherwise | no badge |

## API

Public job DTO (`toPublicJob`):

```json
{
  "hiringActivity": "high" | "medium" | null,
  "hiringActivityBadge": "Actively reviewing" | "Usually responds" | null
}
```

Wired on seeker list/detail paths that already call `publicJob` with enrich:

- `GET /v1/jobs` (search)
- `GET /v1/jobs/:id` · slug
- related jobs

Source: `ApplicationsService.summarizeHiringActivityForJobs` → `hiring-activity.util.ts`.

## Clients

| Surface | Where |
| --- | --- |
| Web home Open roles | `web/.../home.page` — `.badge--hiring` |
| Mobile Discover cards | `mobile/.../job-card` — `.job-card__hiring` |

## Out of scope (MVP)

- Showing “low” privately to recruiters as a coaching tip (could live on Performance Score later)
- Median review-time copy (“typically 1 week”)
- Company-level badge across all openings
