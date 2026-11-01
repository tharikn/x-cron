# CLAUDE.md — `api/src/channels/` (Job Fare channel pull)

Free, no-PSP channel inbox for local jobfare posts → digest pull → existing import-batch review.

## Design (best-case / free)

| Provider | Mode | Cost |
| --- | --- | --- |
| **Telegram** | Official Bot API (long-poll or webhook) | ₹0 |
| **WhatsApp** | Manual bridge only (paste / forward text) | ₹0 |
| Unofficial WA scrapers | **Do not implement** | Ban / ToS risk |

Pattern: **Strategy/Adapter** (`adapters/telegram.adapter.ts`) + in-memory inbox → scheduled or manual **digest pull** → `IngestionService.ingestDigestText` → admin review UI.

**Multi-job posts:** one Telegram message may list many recruitments (dash separators / Tamil jobfare digests). Pull uses `AiService.splitJobs` (when `AI_ENRICH_ENABLED=1`) or heuristic block split so each recruitment becomes its own import record — not one merged mega-job.

## Env

| Key | Default | Notes |
| --- | --- | --- |
| `TELEGRAM_BOT_TOKEN` | unset | Free bot from @BotFather; idle if missing |
| `TELEGRAM_MODE` | `poll` | `poll` long-poll, or `webhook` |
| `TELEGRAM_WEBHOOK_SECRET` | unset | Optional `X-Telegram-Bot-Api-Secret-Token` |
| `CHANNEL_SCHEDULE_ENABLED` | `1` | `0` disables morning/evening watcher |
| `CHANNEL_PULL_OWNER_USER_ID` | unset | Fallback owner for scheduled digests; else last schedule updater |

## Endpoints (`/v1/channels/*`)

Admin unless noted:

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/workflow` | Pipeline counts (inbox → digest → review) |
| GET | `/status` | Bot + schedule snapshot |
| GET/POST | `/sources` | List / register Telegram or WA-manual sources |
| PATCH | `/sources/:id` | Pause/activate/relabel |
| GET | `/messages` | Inbox (`?status=pending`) |
| POST | `/messages/manual` | WhatsApp paste bridge |
| POST | `/messages/skip` | Skip noisy posts |
| POST | `/pull` | Pull now → import batch (`maxMessages` / `messageIds` / `sourceIds`) |
| GET | `/pulls` · `/pulls/:id` | Pull run history |
| GET/PUT | `/schedule` | Morning/evening HH:mm + timezone |
| POST | `/telegram/webhook` | **Public** webhook receiver |

Admin UIs: web `/admin/job-fare` (drawer **Job Fare**), mobile `/tabs/job-fare`.

## Agent rules

- Contacts stay private; digests go through ingestion parsers (masked in public DTOs).
- Never add Baileys / whatsapp-web.js / paid WA Cloud group sync for this product path.
- Keep schedule in-process for MVP (no Redis/Bull requirement).
- After changes: update this file + `api/CLAUDE.md` + `docs/CHANNEL_PULL.md`.
