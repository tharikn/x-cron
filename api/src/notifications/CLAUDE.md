# CLAUDE.md — `api/src/notifications/`

Job-alert fan-out for subscribers: **in-app** (free) + **push** + **mail**.  
Providers are Strategy/Adapter — zero-cost stubs by default; swap in FCM / SMTP later without changing callers.

## Pattern

- Domain: `notifications.service.ts` + `notifications.store.ts` (devices, prefs, inbox, **dispatch** + **delivery** history)
- Push: `providers/push-provider.ts` + factory ← `PUSH_PROVIDER` (`stub` | `fcm`)
- Mail: `providers/mail-provider.ts` + factory ← `MAIL_PROVIDER` (`stub` | `console` | `smtp`)
- Legacy: `NOTIFICATION_MODE` still accepted as push fallback
- Prisma models exist for future persistence; **runtime store is in-memory** today

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

- Web user inbox: `/notifications` (drawer → Notifications)
- Web admin log: `/admin/notifications` (drawer → Alert log)
- Mobile inbox: Notifications tab (`/tabs/notifications`) — list only
- Mobile channel toggles: Prefs tab (`/tabs/preferences`) — job/in-app/push/email
- Mobile OS tray: Web Notification API (browser) + `@capacitor/local-notifications` (native); client polls inbox ~8s + focus/resume with alert chime; server FCM still stub until Firebase credentials

## Agent rules

- Do not call Firebase/SMTP SDKs from jobs/controllers — only via providers
- Inbox `data` includes `{ jobId, slug }` — web **View role** must use `slug` (SEO `/jobs/...` path); id-only links are a fallback on job detail
- Never put phone/email/WhatsApp from jobs into notification payloads beyond job id/title/city
- Keep caps + quiet hours when adding providers (cost control)
- New providers: implement interface + factory case; update this file + `.env.example`
