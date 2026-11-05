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

**ATS applications:** `onApplicationEvent(...)` (trigger `application_event`) — targeted fan-out to seeker or employer on apply / first view / status change / offer letter / note / withdraw / chat. Called from `applications` module only. Inbox `data` includes `applicationId`, `eventType`, `status`, `recipientRole` so clients open the application timeline (not only the job). Design: [../../../docs/APPLICATIONS_TIMELINE.md](../../../docs/APPLICATIONS_TIMELINE.md).

**Contact Admin messenger:** `onSupportEvent(...)` (trigger `support_event`) — targeted fan-out on user message / admin reply from `feedback` module. Inbox `data`: `{ threadId, eventType, audience, action: open_feedback }`. Clients OS-tray + deep-link `?thread=` (not gated on job-alert prefs). Design: [../../../docs/FEEDBACK.md](../../../docs/FEEDBACK.md).

**Onboarding (welcome + profile complete):**

1. Account create + first login (`POST /auth/register`, or Google when `isNewUser`) → `AuthService` → `onUserFirstLogin(userId)`
2. Sends **welcome** (`user_welcome`, dedupe `welcome:{userId}`) + **day-0 profile nudge** (`profile_complete`, dedupe `profile_complete:{userId}:day0`) when seeker profile is incomplete (needs `experienceBand` + skills + preferredCities)
3. `NotificationsScheduler` (hourly by default) → `runProfileCompleteReminders()` for seekers created within `PROFILE_REMINDER_MAX_DAYS` (default **2**) — day 1…N nudges while still incomplete
4. Inbox `data.action`: `browse_jobs` | `complete_profile` (clients deep-link Account / Discover)
5. In-app always written for onboarding; push/mail still respect prefs + quiet hours

## Env (free-first)

| Key | Default | Notes |
| --- | --- | --- |
| `NOTIFICATIONS_STORE` | follow `JOBS_STORE` | `prisma` \| `memory` |
| `PUSH_PROVIDER` | `stub` | `stub` = log-only; `fcm` = firebase-admin (falls back to stub if no credentials) |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | — | Inline service-account JSON for live FCM |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | — | Path to service-account JSON file (alt to inline) |
| `FCM_ANDROID_CHANNEL_ID` | `xcron-job-alerts-v2` | Must match mobile LocalNotifications channel |
| `MAIL_PROVIDER` | `stub` | Log-only; `console` alias; `smtp` → stub until `MAIL_SMTP_URL` |
| `NOTIFICATION_FANOUT_BATCH` | `25` | Yield between batches for large user sets |
| `NOTIFICATION_MODE` | — | Legacy push mode alias |
| `PROFILE_REMINDER_SCHEDULE_ENABLED` | `1` | `0` disables day 1–N profile nudge watcher |
| `PROFILE_REMINDER_MAX_DAYS` | `2` | Auto profile nudges while account age ≤ N days (day 0 = first login) |
| `PROFILE_REMINDER_TICK_MS` | `3600000` | Scheduler interval (min 60s) |

## Session ↔ push contract

- `POST /v1/devices` — **authenticated**; links FCM/device to the signed-in user (job fan-out is per `userId`)
- `POST /v1/devices/unlink` — **public** with `{ deviceId, fcmToken }` proof; clears `userId` on logout / refresh expiry
- Push send targets devices still linked to `userId` (logout → `POST /devices/unlink`). Do **not** gate FCM on in-memory refresh sessions — those reset on Render restart while device rows persist, which blocked closed-app tray alerts.
- On Render set `FIREBASE_SERVICE_ACCOUNT_JSON` (one-line JSON). `FIREBASE_SERVICE_ACCOUNT_PATH` is a **file path** only — never paste JSON into PATH.

## Endpoints

- `POST /v1/devices` — link stub/FCM token to signed-in user
- `POST /v1/devices/unlink` — detach device (logout / session death)
- `GET|PUT|POST /v1/notifications/preferences` — channel toggles + quiet hours + daily cap
- `GET /v1/notifications` · `POST /v1/notifications/:id/read` — in-app inbox
- `GET /v1/admin/notification-dispatches` · `.../:id` — trigger + delivery history
- `POST /v1/notifications/dev/send` · `.../dev/dispatch-published/:jobId` — **admin** + `@SensitiveThrottle` (1/hour); not public

## UI

- Web user inbox: `/notifications` — **list only** (Refresh + Inbox); no channel toggles
- Web alert channels: `/settings/preferences` (Settings → Preferences) — job/in-app/push/email
- Web admin log: `/admin/notifications` (drawer Logs → menu label Notification)
- Mobile inbox: Notifications tab (`/tabs/notifications`) — list only
- Mobile channel toggles: Settings → Prefs (`/tabs/settings?tab=preferences`) — job/in-app/push/email
- Mobile OS tray (closed/background app): live FCM via `@capacitor/push-notifications` + API `PUSH_PROVIDER=fcm`
- Mobile OS tray (foreground / browser): `@capacitor/local-notifications` or Web Notification API; inbox poll ~8s remains for in-app list
- Shade copy: short title + multi-line body (`\n` between job title/employer/city; feedback `Your feedback\nRe: …`). Clients also split middot runs for older rows.
- **Badge up / inbox only after open / no shade** → check dispatch deliveries for `no_device`, `session_expired`, or `stub_or_invalid_token`. In-app always writes; push is separate. Mobile must not skip LocalNotifications just because a local FCM token exists (see `mobile` CLAUDE).
- Do not put Preferences / Alert channels back on the notifications inbox screen

## Live FCM setup (killed-app delivery, ₹0)

Full steps: [docs/FCM_SETUP.md](../../../docs/FCM_SETUP.md) · helper: `node scripts/setup-fcm.mjs`

1. Firebase Console (Spark) → Android app `com.xcron.jobs` → `mobile/android/app/google-services.json`
2. Service account private key → `api/secrets/firebase-service-account.json`
3. `node scripts/setup-fcm.mjs` → sets `PUSH_PROVIDER=fcm` + mobile `fcmEnabled: true`
4. Rebuild APK / restart API; **sign in**, grant notifications so a live FCM token hits authenticated `POST /v1/devices`
5. Force-stop app → publish job / `POST /v1/notifications/dev/send` → tray alert (user must still have a live refresh session)

`providers/fcm.provider.ts` uses firebase-admin **modular** exports (`getApps` / `cert` / `getMessaging`) — not the legacy `admin.apps` / `admin.credential` / `admin.messaging()` shape (those are undefined on current firebase-admin and crash send with `reading 'length'`). Sends `notification` + `data` + Android `channelId`. Stub tokens (`stub_fcm_*`) are rejected by the live provider. Without credentials, factory falls back to stub. Mobile must `POST /v1/devices` with a **live** FCM token after sign-in (never upload `stub_fcm_*` when `fcmEnabled`).

## Agent rules

- Do not call Firebase/SMTP SDKs from jobs/controllers — only via providers
- Inbox `data` includes `{ jobId, slug }` — web **View role** must use `slug` (SEO `/jobs/...` path); id-only links are a fallback on job detail
- Never put phone/email/WhatsApp from jobs into notification payloads beyond job id/title/city
- Keep caps + quiet hours when adding providers (cost control)
- New providers: implement interface + factory case; update this file + `.env.example`
