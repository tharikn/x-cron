# CLAUDE.md — `api/src/ai/help/` (in-app help chatbot)

Lightweight **signed-in** help assistant for using X Cron Jobs. Floating FAB on web + mobile. Not job enrich.

Parent: [../CLAUDE.md](../CLAUDE.md)

## Goals

- Free / low-cost model (Groq `openai/gpt-oss-20b` default, or Ollama tiny)
- App-usage help only (search, apply, post, settings) — locked system prompt
- Heavy throttling + per-user cooldown + daily token budget
- No chat persistence (client sends short history only)

## Toggle (env)

| Var | Default | Notes |
| --- | --- | --- |
| `AI_HELP_ENABLED` | `0` | `1` to enable |
| `AI_HELP_PROVIDER` | falls back to `AI_ENRICH_PROVIDER` / `stub` | `stub` \| `groq` \| `ollama` \| `openai` |
| `AI_HELP_API_KEY` | falls back to `AI_ENRICH_API_KEY` | Required for groq/openai |
| `AI_HELP_MODEL` | `openai/gpt-oss-20b` (groq) | Keep small; `llama-3.1-8b-instant` shut down 2026-08-16 |
| `AI_HELP_DAILY_TOKEN_BUDGET` | `2500` | Per user / UTC day (in-memory) |
| `AI_HELP_COOLDOWN_MS` | `20000` | Between messages |
| `AI_HELP_EXHAUST_COOLDOWN_MS` | `21600000` | 6h after budget exhaust |
| `AI_HELP_RATE_LIMIT_MAX` | `3` | `@ChatThrottle` burst / TTL |
| `AI_HELP_RATE_LIMIT_TTL_MS` | `60000` | |
| `AI_HELP_MAX_COMPLETION_TOKENS` | `220` | Cap reply size |
| `AI_HELP_MAX_MESSAGE_CHARS` | `400` | |
| `AI_HELP_MAX_HISTORY_TURNS` | `4` | |

`stub` = zero-cost canned FAQ matcher (still auth + rate limited).

## Endpoints

| Method | Path | Access | Throttle |
| --- | --- | --- | --- |
| GET | `/v1/ai/help/status` | auth | default |
| POST | `/v1/ai/help/chat` | auth | `@ChatThrottle` (~3/min) + service cooldown/budget → **429** |

## Security

- Auth required (guests never see FAB; API still enforces session)
- Input sanitized + length capped; history capped
- System prompt refuses off-topic / secrets / invented contacts
- CSRF + existing cookie/Bearer guards apply
- Quota is per `userId` in-process (resets on API restart / UTC day)

## Files

| File | Role |
| --- | --- |
| `help-chat.service.ts` | Enable, quota, cooldown, chat |
| `help-chat.types.ts` | Types |
| `dto/help-chat.dto.ts` | Message + history validation |
| `prompts/help-chat.prompt.ts` | System + welcome |
| `providers/stub-help.provider.ts` | Canned help |
| `providers/openai-compatible-help.provider.ts` | Groq/Ollama/OpenAI fetch |

## Agent rules

- Keep help separate from job-enrich (different model + caps)
- Do not add paid SDKs; stay OpenAI-compatible `fetch`
- Update this file + env trio when changing help chat keys
