# CLAUDE.md — `api/src/feedback/`

**Feedback hub**: public **FAQ** + signed-in **Contact Admin** in-app messenger
(seeker → admin, recruiter/employer → admin).

## Patterns

| Pattern | Where |
| --- | --- |
| **Repository** | Abstract `FeedbackStore` → `FeedbackMemoryStore` / `FeedbackPrismaStore` |
| **Strategy** | `FaqProvider` → `StaticFaqProvider` (swap for CMS/AI later via `FAQ_PROVIDER`) |
| **Facade** | `FeedbackService` owns FAQ + thread lifecycle + RBAC ownership |
| **Observer** | `NotificationsService.onSupportEvent` on user message / admin reply |

Do not overload ATS application chat (`applications/`) or AI help chat (`ai/help/`) —
those are seeker↔employer and bot FAQ respectively.

## Domain

- **FaqItem** — seeded catalog (`general` / `seeker` / `recruiter` / `account`)
- **FeedbackThread** — one conversation; `audience` = `seeker` \| `employer`
- **FeedbackMessage** — append-only chat rows (`senderRole` seeker \| employer \| admin)
- Status: `open` · `awaiting_admin` · `awaiting_user` · `closed`

## Endpoints

| Method | Path | Access |
| --- | --- | --- |
| GET | `/v1/feedback/faq` | `@Public` |
| GET/POST | `/v1/feedback/threads` | auth |
| GET | `/v1/feedback/threads/:id` | auth (owner) — includes `presence` |
| POST | `/v1/feedback/threads/:id/typing` | auth (owner) — `{ typing: boolean }` heartbeat |
| POST | `/v1/feedback/threads/:id/messages` | auth (owner) |
| POST | `/v1/feedback/threads/:id/close` | auth (owner) |
| GET | `/v1/admin/feedback/threads` | `@Roles('admin')` |
| GET | `/v1/admin/feedback/threads/:id` | admin — includes `presence` |
| POST | `/v1/admin/feedback/threads/:id/typing` | admin — typing heartbeat |
| POST | `/v1/admin/feedback/threads/:id/messages` | admin |
| POST | `/v1/admin/feedback/threads/:id/close` \| `.../reopen` | admin |

Presence/typing: `FeedbackPresenceTracker` (`feedback-presence.ts`) — online ~20s, typing TTL ~5s; memory Maps by default, Redis keys when `REDIS_URL` connected (multi-instance); not Prisma-backed.

Create/send use `@AuthThrottle`. Audience `employer` requires employer (or admin) role.

## Storage

- `FEEDBACK_STORE=prisma|memory` (falls back to `JOBS_STORE`)
- Prisma: `FeedbackThread` + `FeedbackMessage` — migration `20261105120000_feedback_support_threads`
- Account wipe → `FeedbackService.clearForUser`

## Notifications

Trigger `support_event`. Inbox `data`: `{ threadId, eventType, audience, action: open_feedback }`.
Clients deep-link Feedback / admin desk with `?thread=` (OS tray tap + inbox CTA).
Never put phone/WhatsApp into payloads. Support OS alerts respect push prefs, not job-alert prefs.

## UI

- Web/mobile **Feedback** page: FAQ accordion + Contact Admin messenger (signed-in)
- Web admin desk: `/admin/feedback` under Logs
- Guest: FAQ only (ui-auth — messenger gated)
- Chat: clients mark `/feedback` (+ `/auth/refresh`, `/ai/help`) silent for the global API spinner; mobile uses optimistic pending bubbles (no bouncing Sending spinner row); live peer typing + Online/Last active header + highlight new bubbles
- Clients quiet-poll open threads ~2.5s (+ tab focus) for messages + presence; composer posts typing heartbeats (no WS yet)

## Agent rules

- Keep FAQ Strategy injectable — do not hardcode FAQ only in controllers
- Enforce thread ownership on user mutations; admin routes use `@Roles('admin')`
- New categories/statuses → update types + labels + this file
- Env: update `.env.example`, `.env`, `env-dev` when adding `FEEDBACK_*` keys
