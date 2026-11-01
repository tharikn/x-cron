# CLAUDE.md — `api/src/notifications/`

Job-alert fan-out for subscribers: **in-app** (free) + **push** + **mail**.  
Providers are Strategy/Adapter — zero-cost stubs by default; swap in FCM / SMTP later without changing callers.

## Pattern

- Domain: `notifications.service.ts` + dual store (abstract `NotificationsStore`)
  - `notifications.memory-store.ts` — in-memory Maps
  - `notifications.prisma-store.ts` — Postgres via Prisma models
- Factory in `notifications.module.ts` ← `NOTIFICATIONS_STORE` (falls back to `JOBS_STORE` when unset)
- Push: `providers/push-provider.ts` + factory ← `PUSH_PROVIDER` (`stub` | `fcm`)
- Mail: `providers/mail-provider.ts` + factory ← `MAIL_PROVIDER` (`stub` | `console` | `smtp`)
- Legacy: `NOTIFICATION_MODE` still accepted as push fallback
- Field map: domain `data` / `meta` → Prisma `dataJson` / `metaJson`; dates ISO ↔ `DateTime`
- Daily cap: count distinct base `dedupeKey` among today's `sent`/`read` `NotificationRecord`s (UTC day)
- User FKs: prisma store upserts `User` before prefs / records / deliveries

## Trigger flow

1. Job publish / approve → `NotificationsService.onJobPublished(jobId)`
2. Creates `NotificationDispatch` (history row)
3. Collects subscribers (job prefs ∪ alert prefs ∪ active users with alerts on)
4. Preference match (empty filters = all-job subscriber); daily cap + quiet hours
5. Channels: in-app always (if enabled); push/mail when not quiet
6. Each attempt → `NotificationDelivery` log + inbox/`NotificationRecord` for in-app

## Env (free-first)

| Key | Default | Notes |
| --- | --- | --- |
| `NOTIFICATIONS_STORE` | follow `JOBS_STORE` | `prisma` \| `memory` |
| `PUSH_PROVIDER` | `stub` | Log-only FCM stub; `fcm` reserved for firebase-admin |
| `MAIL_PROVIDER` | `stub` | Log-only; `console` alias; `smtp` → stub until `MAIL_SMTP_URL` |
| `NOTIFICATION_FANOUT_BATCH` | `25` | Yield between batches for large user sets |
| `NOTIFICATION_MODE` | — | Legacy push mode alias |

## Endpoints

- `POST /v1/devices` — register stub/FCM token
- `GET|PUT|POST /v1/notifications/preferences` — channel toggles + quiet hours + daily cap
- `GET /v1/notifications` · `POST /v1/notifications/:id/read` — in-app inbox
- `GET /v1/admin/notification-dispatches` · `.../:id` — trigger + delivery history
- `POST /v1/notifications/dev/send` · `.../dev/dispatch-published/:jobId`

## UI

- Web user inbox: `/notifications` — **list only** (Refresh + Inbox); no channel toggles
- Web alert channels: `/preferences` (drawer → Preferences) — job/in-app/push/email
- Web admin log: `/admin/notifications` (drawer → Alert log)
- Mobile inbox: Notifications tab (`/tabs/notifications`) — list only
- Mobile channel toggles: Prefs tab (`/tabs/preferences`) — job/in-app/push/email
- Mobile OS tray: Web Notification API (browser) + `@capacitor/local-notifications` (native); client polls inbox ~8s + focus/resume with alert chime; server FCM still stub until Firebase credentials
- Do not put Preferences / Alert channels back on the notifications inbox screen

## Agent rules

- Do not call Firebase/SMTP SDKs from jobs/controllers — only via providers
- Inbox `data` includes `{ jobId, slug }` — web **View role** must use `slug` (SEO `/jobs/...` path); id-only links are a fallback on job detail
- Never put phone/email/WhatsApp from jobs into notification payloads beyond job id/title/city
- Keep caps + quiet hours when adding providers (cost control)
- New providers: implement interface + factory case; update this file + `.env.example`
