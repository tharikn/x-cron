# Applied jobs — timeline + notifications (architecture)

Formal ATS applications for seekers and recruiters. Product goal: a seeker **Applied jobs** menu, a stage timeline with exact **date + time**, and a clear notify for the **other role** on every action — designed so writes stay correct when traffic grows to millions of applications.

Related: [api/src/applications/CLAUDE.md](../api/src/applications/CLAUDE.md) · [api/src/notifications/CLAUDE.md](../api/src/notifications/CLAUDE.md) · [PERFORMANCE_SCORE.md](./PERFORMANCE_SCORE.md)

**Do not confuse** with seeker contact markers (`/v1/me/applications`) — those track phone/WhatsApp taps. Formal ATS lives at `/v1/me/job-applications`.

---

## Product surfaces

| Role | List | Detail |
| --- | --- | --- |
| Seeker | Web `/me/applied` · Mobile `/tabs/applied` · drawer/Activity shortcuts | Web `/me/applications/:id` · Mobile `/tabs/applications/:id` — tabbed **Overview · Chat · Timeline** (`?tab=`) |
| Employer | `/employer-applications` (web) · `/tabs/employer-applications` (mobile) | Same detail page with `?as=employer` (+ optional `?tab=overview\|chat\|timeline`) |

Guest chrome hides Applied jobs until `isSignedIn()` (see [`.cursor/skills/xcron-ui-auth/SKILL.md`](../.cursor/skills/xcron-ui-auth/SKILL.md)).

---

## Domain model

```
JobApplication          ← current status projection (hot row)
ApplicationEvent        ← append-only timeline (source of truth for history)
ApplicationMessage      ← in-app chat (also mirrored as chat_message events)
NotificationRecord      ← inbox row for counterparty (thin payload)
```

### Status machine

`applied` → `under_review` → `shortlisted` → `interview` → `offered` → `hired`  
Also: `rejected` (employer), `withdrawn` (seeker). Transitions enforced in `applications.service.ts`.

### Timeline event types

| Type | When | `at` |
| --- | --- | --- |
| `applied` | Seeker Easy apply | ISO datetime |
| `viewed_by_employer` | First employer open of detail | ISO datetime |
| `status_changed` | Employer/admin status move | ISO datetime |
| `offer_issued` | Status → offered (+ letter text) | ISO datetime |
| `note_added` | Employer timeline note | ISO datetime |
| `withdrawn` | Seeker withdraw | ISO datetime |
| `chat_message` | Either side sends chat | ISO datetime |

Each event stores `fromStatus` / `toStatus`, `actorRole`, optional `note` / `meta`, and **`at`** (full ISO — clients show `dd MMM yyyy, HH:mm`).

---

## Write path (single command)

Every mutation uses one path so timeline and notify cannot drift:

```
Command (apply | view | transition | note | withdraw | chat)
  → auth + ownership + status machine
  → update JobApplication (status, updatedAt, …)
  → APPEND ApplicationEvent (immutable; at = now)
  → notify counterparty (onApplicationEvent)
  → return detail DTO (status + timeline[])
```

Rules:

1. **Timeline is history**; `JobApplication.status` is only the latest projection.
2. Never edit past events (account wipe is the only bulk clear).
3. Notifications are a **side effect of the event**, never a silent status write.
4. Notify the **counterparty only** (seeker action → employer; employer action → seeker).

### Notify matrix

| Action | Event | Recipient |
| --- | --- | --- |
| Apply | `applied` | Employer |
| First employer open | `viewed_by_employer` | Seeker |
| Status / offer | `status_changed` / `offer_issued` | Seeker |
| Employer note | `note_added` | Seeker |
| Withdraw | `withdrawn` | Employer |
| Chat | `chat_message` | Other role |

Channels: in-app + push + mail via `NotificationsService.onApplicationEvent` (`triggerType: application_event`). Payload data: `jobId`, `slug`, `applicationId`, `eventType`, `status` — no phone/WhatsApp in copy.

Inbox CTA should deep-link to application timeline when `data.applicationId` is present.

---

## API (current)

| Method | Path | Role |
| --- | --- | --- |
| POST | `/v1/jobs/:jobId/apply` | seeker |
| GET | `/v1/me/job-applications` | seeker list |
| GET | `/v1/me/job-applications/:id` | seeker detail + timeline |
| POST | `/v1/me/job-applications/:id/withdraw` | seeker |
| GET/POST | `/v1/me/job-applications/:id/messages` | participant |
| GET | `/v1/employers/applications` | employer inbox |
| GET | `/v1/employers/jobs/:jobId/applications` | per job |
| GET | `/v1/employers/applications/:id` | employer detail (records first view) |
| POST | `/v1/employers/applications/:id/transition` | employer |
| POST | `/v1/employers/applications/:id/notes` | employer |

Storage: `APPLICATIONS_STORE=prisma|memory` (falls back to `JOBS_STORE`). Prisma models in migrations `20261104210000_job_applications_timeline` et al.

---

## Scale plan (millions of applications)

MVP is correct domain-wise; higher traffic needs ops hardening — **not** a domain redesign.

### Data / indexes

- List seeker apps: `(seekerUserId, updatedAt DESC)`
- Employer inbox: `(ownerUserId, status, updatedAt DESC)`
- Per-job desk: `(jobId, status, createdAt DESC)`
- Quota: `(seekerUserId, createdAt)` (exists)
- Events: `(applicationId, at)` (exists); later **partition `ApplicationEvent` by month**

### Read path

- Cursor pagination on lists (`limit` + `cursor`)
- Detail: application + last N events; older timeline via `GET …/timeline?cursor=`
- Denormalize `jobTitle` / `employerName` / `city` onto the application at apply (or short TTL cache) to kill N+1 job lookups
- Optional Redis summary `app:{id}` invalidated on event append

### Write / notify path

1. Request: **transaction** = update application + insert event (+ message)
2. Publish `application.event` to a queue (BullMQ / SQS / Redis stream)
3. Workers: in-app / push / mail + reputation + analytics
4. Idempotency: `applicationId + eventId` so retries do not double-notify

### Traffic controls (keep)

- Apply throttle, cooldown, hourly/daily caps, identical-note cap, velocity spam badge
- Add employer transition rate limits per job when needed
- Read replicas for list/timeline; primary for writes
- Archive old terminal apps (`hired` / `rejected` / `withdrawn`) to cold storage while keeping events queryable

### Target API shape (forward)

```
GET /v1/me/job-applications?status=&cursor=&limit=
GET /v1/me/job-applications/:id/timeline?cursor=&limit=
```

---

## Client checklist

- [x] Signed-in **Applied jobs** nav (web drawer + mobile route)
- [x] List shows status + last update date/time
- [x] Detail timeline shows each stage with date + time
- [x] Notification CTA prefers `applicationId` → timeline
- [ ] Cursor pagination + async notify queue (scale phase)
- [ ] Denormalized job fields on application row

---

## Agent rules

- Keep contact markers (`seeker/`) separate from ATS (`applications/`)
- New statuses → update transition maps, labels, this doc, module `CLAUDE.md`
- Never put contact PII in notification text beyond job title/city
- DDL changes need schema + forward migration (see [xcron-claude-md](../.cursor/skills/xcron-claude-md/SKILL.md))
