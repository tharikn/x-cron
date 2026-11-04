# Job Fare channel pull — design & ops

**Status:** implemented (MVP, in-memory channel inbox)  
**Constraint:** **₹0** platform fees for the base product (local employer jobfare).

## Goal

Receive morning/evening jobfare posts from **multiple Telegram groups/channels** (and WhatsApp via a free bridge), digest them into X Cron, and review in a dedicated **admin workflow UI** before publish.

## Best-case architecture

```text
WhatsApp groups  --(paste / forward / export)-->  WhatsApp bridge source
Telegram groups  --(Bot API, free)------------->  Telegram adapter
                                                      |
                                              ChannelMessage inbox
                                                      |
                         morning / evening schedule  OR  Pull now
                                                      |
                                   ImportBatch (existing ingestion)
                                                      |
                              Job Fare UI → Bulk review → moderation → search
```

### Design patterns

| Pattern | Where |
| --- | --- |
| Strategy / Adapter | `api/src/channels/adapters/*` (Telegram free Bot API; manual WA bridge) |
| Digest batching | Pull run concatenates pending posts → one import batch |
| Multi-job split | One TG message with many recruitments → `AiService.splitJobs` (or dash heuristic) → many import records |
| Workflow tracking | `GET /v1/channels/workflow` stages: inbox → digests → review → completed |
| Reuse | Existing `ingestion` parsers + approve path; contacts stay private |

### What we deliberately do **not** do

- Unofficial WhatsApp clients (Baileys, WhatsApp Web scrapers) — ToS / ban risk
- Paid Meta Cloud API group listening for free local jobfare
- Auto-publish without human review

## Admin UX

| Surface | Route |
| --- | --- |
| **Web** (drawer → Post → Job Fare) | `/admin/job-fare` |
| **Mobile** | `/tabs/job-fare` (Post → Job Fare pull) |

Both are admin-guarded and share the same `/v1/channels/*` API.

1. **Pipeline strip** — counts for Inbox / In digests / Needs review / Completed / Failed  
2. **Status** — Telegram configured/mode, pending count, schedule snapshot, last pull  
3. **Pull** — manual pull; optional source filter; **posts-per-batch** split; pull selected; pull-all-as-multiple-batches → deep-link `/import?batchId=…` (web) or `/tabs/import?batchId=…` (mobile)  
4. **Inbox** — paste WhatsApp bridge posts; select/skip noise  
5. **Sources** — Telegram chat ids + WA bridge labels; pause/activate  
6. **Schedule** — morning/evening `HH:mm` in `Asia/Kolkata`  
7. **History** — pull runs with link back to review batch  

`POST /v1/channels/pull` accepts `maxMessages`, `messageIds`, and `sourceIds` so large inboxes can be split into reviewable import batches.

## Free Telegram setup

1. Create a bot with [@BotFather](https://t.me/BotFather) (free).  
2. Set `TELEGRAM_BOT_TOKEN` in `api/.env`.  
3. Add the bot to jobfare groups/channels (admin recommended for channels).  
4. First message auto-registers a source, or register chat id under Sources.  
5. Optional webhook: `TELEGRAM_MODE=webhook` + `POST /v1/channels/telegram/webhook`.

Default mode is **long-poll** (`TELEGRAM_MODE=poll`) so local MVP needs no public URL.

## WhatsApp (free bridge)

Operators copy/forward jobfare messages into Job Fare → **Add to inbox**, or paste into classic Bulk import. Same digest/review path.

## Schedule ownership

Auto-pull creates import batches under an owner user:

1. Prefer the admin who last **saved schedule** (`ownerUserId` on schedule), else  
2. `CHANNEL_PULL_OWNER_USER_ID`, else  
3. Manual **Pull now** (uses signed-in admin).

## Env reference

See `api/.env.example` and [`api/src/channels/CLAUDE.md`](../api/src/channels/CLAUDE.md).

## Persistence note

Channel sources/messages/pulls are **in-memory** for this MVP (restart clears inbox). Jobs/import batches still follow `JOBS_STORE`. Prisma models for channels can follow when production persistence is required.
