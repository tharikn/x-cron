# Feedback hub — FAQ + Contact Admin messenger

Design for seeker/recruiter support inside X Cron (dev MVP).

## Goals

1. **Feedback screen** with an **FAQ** section (guest-readable).
2. **In-app messenger** — Contact Admin — for **Seeker → Admin** and **Recruiter → Admin**.
3. Same architecture patterns as applications / notifications (not a one-off chat).

## Patterns

| Pattern | Role |
| --- | --- |
| **Repository** | `FeedbackStore` → memory \| Prisma (`FEEDBACK_STORE`) |
| **Strategy** | `FaqProvider` → `StaticFaqProvider` (CMS/AI later) |
| **Facade** | `FeedbackService` owns FAQ + threads + RBAC |
| **Observer** | `NotificationsService.onSupportEvent` (`support_event`) |

ATS application chat stays seeker↔employer. AI help chat stays bot FAQ. Do not merge those into this module.

## Domain

- **FaqItem** — seeded Q&A (`general` / `seeker` / `recruiter` / `account`)
- **FeedbackThread** — `audience` = `seeker` \| `employer` (recruiter UX); status awaiting_admin / awaiting_user / closed
- **FeedbackMessage** — append-only; `senderRole` seeker \| employer \| admin

One user may open many threads (bugs, account, suggestions). Audience picker routes context when the account has both roles.

## API (summary)

- `GET /v1/feedback/faq` — `@Public`
- `GET|POST /v1/feedback/threads` (+ `/:id`, messages, close) — signed-in owner
- `GET|POST /v1/admin/feedback/threads…` — `@Roles('admin')`

Prisma migration: `20261105120000_feedback_support_threads`.

## Clients

| Surface | Path |
| --- | --- |
| Web Feedback | `/feedback` (drawer **Feedback** — guests OK for FAQ) |
| Web admin desk | `/admin/feedback` (Logs → Feedback desk) |
| Mobile Feedback | `/tabs/feedback` (Account / guest CTA) |
| Mobile admin | `/tabs/admin-feedback` |

Messenger UI is auth-gated on the page; FAQ is not. Chat polls quietly (no global interceptor spinner on `/feedback`, `/auth/refresh`, or `/ai/help`). Mobile send is **optimistic** (bubble appears instantly with a soft pending state — no full-screen brand overlay / bouncing “Sending…” spinner row); live peer typing row remains; newly arrived bubbles get a short in-container highlight (`New`). Header shows WhatsApp-style **Online** / **Last active** from ephemeral presence.

Open threads **poll quietly ~2.5s** (plus tab focus / Ionic re-enter) so replies, typing, and presence update without a manual refresh. Composer heartbeats `POST …/typing` while the peer is typing. No WebSocket yet — same poll style as the notifications inbox.

### Presence / typing (ephemeral)

| Piece | Behavior |
| --- | --- |
| `GET …/threads/:id` | Touches viewer last-seen; returns `presence: { peerOnline, peerLastSeenAt, peerTyping, peerLabel }` |
| `POST …/threads/:id/typing` `{ typing }` | User heartbeat (TTL ~5s); admin twin under `/admin/feedback/…` |
| Online window | Peer seen within ~20s while chat is open |
| Storage | In-memory only (not Prisma) — multi-instance needs Redis later |

Static “Waiting for admin/user…” fake typing rows were removed; turn status stays on the thread meta label only.

## Notifications

Inbox `data.action=open_feedback` + `threadId` / `eventType`. Admin reply → user; user message → admin users from `AuthStore.listUsers()`.

Channels: **in-app** always (badge + Notifications list) + **push/OS tray** when push alerts are on (mobile LocalNotifications / web + mobile browser `Notification` API; FCM when configured). Support alerts are **not** gated on job-alert prefs. Inbox / OS tap deep-links `?thread=` on Feedback / admin desk. OS shade uses the square X Cron mark; admin-reply body is multi-line (`Your feedback` / `Re: {subject}`).

**Bug fix (2026-11-05):** Inbox **Open feedback** used `[routerLink]` with a path that embedded `?thread=` (`/feedback?thread=…`). Angular encodes `?` as `%3F`, so the route never matched and the chat never opened. Fix: path + `[queryParams]="{ thread }"` on web + mobile notifications; mobile Feedback / admin desk also re-read `?thread=` on `ionViewWillEnter` (Ionic page reuse).

**Bug fix (2026-11-06):** Mobile Feedback chat felt blocked by a spinner — send waited on the API with a bouncing “Sending…” row, and `/auth/refresh` / help-chat `/ai/help` could still flash the global brand overlay. Fix: optimistic pending bubbles, quiet open/poll (no `busy` gate on send), silent interceptor markers for refresh + help.

## Agent notes

Module guide: [`api/src/feedback/CLAUDE.md`](../api/src/feedback/CLAUDE.md). Docs sync skill: [`.cursor/skills/xcron-claude-md`](../.cursor/skills/xcron-claude-md/SKILL.md).
