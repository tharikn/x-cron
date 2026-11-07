# User access & engagement tracking

Admin desk for **who created or opened X Cron**, their **emails / IPs**, **engagement mix** (search / apply / share), and **hours spent**.

## Endpoints

| Method | Path | Access |
| --- | --- | --- |
| `POST` | `/v1/tracking/events` | Public (optional session); throttled |
| `GET` | `/v1/admin/tracking/summary` | Admin |
| `GET` | `/v1/admin/tracking/users` | Admin — list + rollups |

Event types: `access` · `heartbeat` · `search` · `share` · `apply` · `page_view`.

## How hours work

Clients send `heartbeat` about once per minute while the tab/app is visible, with `durationMs` (capped server-side). Admin **Total hours** / per-user **Hours** sum those intervals.

## Engagement %

- **Platform cards:** % of accessors who searched / applied / shared / page-viewed at least once.
- **Per-row mix:** that actor’s search / apply / share / page_view counts as a percentage of their action total.

## Persistence

- `TRACKING_STORE=prisma|memory` (falls back to `JOBS_STORE`)
- Prisma `TrackingEvent` + `AuthSession.ip` / `userAgent` / `lastSeenAt`
- Migration: `api/prisma/migrations/20261107140000_user_tracking`

## UI

- Web: `/admin/tracking` (Logs → User tracking); alias `/admin/users`
- Clients: web + mobile `TrackingService` (access, page views, heartbeats, search, share)
- Apply is also recorded server-side on successful ATS apply

## Privacy notes

- Guest traffic is keyed by `X-Tab-Id` visitor key + IP (no invented device fingerprint).
- Account wipe clears the user’s tracking events.
