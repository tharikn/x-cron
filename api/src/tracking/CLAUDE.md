# CLAUDE.md — `api/src/tracking/`

Platform **user access + engagement tracking** for the admin desk.

## What it tracks

| Event | Source | Notes |
| --- | --- | --- |
| `access` | Client boot / sign-in | First touch + return visits |
| `heartbeat` | Client every ~60s (visible tab) | Accumulates `durationMs` → hours spent |
| `search` | Client home search + server `JobsService.search` when signed-in | |
| `share` | Client job-detail Share | |
| `apply` | Server `ApplicationsService.apply` | |
| `page_view` | Client router navigation | |

IP + User-Agent captured on each event. Auth sessions also store `ip` / `userAgent` / `lastSeenAt`.

## Endpoints

| Method | Path | Access |
| --- | --- | --- |
| POST | `/v1/tracking/events` | `@Public` (auth attaches userId); `@AuthThrottle` |
| GET | `/v1/admin/tracking/summary` | `@Roles('admin')` |
| GET | `/v1/admin/tracking/users` | `@Roles('admin')` — list + engagement % + hours |

## Engagement %

- **Platform:** share of accessors who searched / applied / shared / page-viewed at least once.
- **Per user:** mix of that actor’s search/share/apply/page_view counts (sums to ~100 when any actions exist).

## Storage

- `TRACKING_STORE=prisma|memory` (falls back to `JOBS_STORE`)
- Prisma model `TrackingEvent` — migration `20261107140000_user_tracking`
- Account wipe → `TrackingService.clearForUser`

## UI

- Web admin desk: `/admin/tracking` under drawer **Logs**
- Clients: `TrackingService` (web + mobile) heartbeat + hooks

## Agent rules

- Do not put PII into `meta` beyond jobId/path
- Keep guest `visitorKey` from `X-Tab-Id` — never invent device fingerprints beyond that
- Env: update `.env.example`, `.env`, `env-dev` when adding `TRACKING_*` keys
