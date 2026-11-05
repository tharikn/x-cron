# CLAUDE.md — `api/src/ai/` (job content enrich + in-app help)

Optional **free-tier / local** LLM cleanup for messy job ads (Telegram digests, WhatsApp, OCR, newspaper paste).

Goals: strip decorative noise, re-align text, map facts into form fields, guess language, follow moderator chat instructions — **no invented contacts**.

Also hosts the **signed-in floating help chatbot** under [`help/`](help/CLAUDE.md) (separate env + small model + heavy rate limits).

Parent: [../CLAUDE.md](../../CLAUDE.md) · package: [../../CLAUDE.md](../../CLAUDE.md)

## Toggle (env)

| Var | Default | Notes |
| --- | --- | --- |
| `AI_ENRICH_ENABLED` | `0` | `1` / `true` / `on` to enable |
| `AI_ENRICH_PROVIDER` | `stub` | `stub` \| `groq` \| `ollama` \| `openai` |
| `AI_ENRICH_API_KEY` | — | Required for `groq` / `openai` |
| `AI_ENRICH_BASE_URL` | provider default | OpenAI-compatible base |
| `AI_ENRICH_MODEL` | provider default | e.g. Groq `openai/gpt-oss-20b` |
| `AI_ENRICH_TIMEOUT_MS` | `45000` | Per-call abort (Telegram digests need headroom) |
| `AI_ENRICH_MONTHLY_CAP` | `2000` | In-process soft cap |

**Recommended free path:** Groq free tier (`AI_ENRICH_PROVIDER=groq` + API key). Fully free local: `ollama` + pulled model.

When disabled or on failure → original text kept (stub / passthrough). Provider also runs a light deterministic emoji/decoration strip before the model call.

## Endpoints

- `GET /v1/ai/status` — public; gate “Improve with AI” UI
- `POST /v1/ai/job-enrich` — employer/admin preview cleanup + optional `instruction` chat correction (does not publish)
- `GET /v1/ai/help/status` · `POST /v1/ai/help/chat` — signed-in app help (see [`help/CLAUDE.md`](help/CLAUDE.md))
- `POST /v1/import-batches/:id/records/:recordId/enrich` — autocorrect one OCR/import row (`instruction` optional) and persist
- Blog Approval desk uses `job-enrich` then `PATCH /v1/admin/jobs/:id` to save mapped boxes

## Result fields

`title`, `employerName`, `locationCity`, `jobType`, `salaryText`, `vacancies`, `contactWebsite`, `description`, `contentLanguage`, `notes`, `cleaned`, `provider`

**Description format:** cleaned body is **bullet lines** — each non-empty line starts with `• `. Salary / vacancies / employer / city / website stay in their fields, not duplicated as the only content of description.

**Vacancies:** integer headcount when present in source (`10 Posts`, `Vacancies: 05`); mapped into import review + publish (`Job.vacancies`).

## Auto wiring

- Bulk / OCR / paste → `IngestionService` enrichs drafts after parse when enabled
- **Channel / Job Fare digest** → `AiService.splitJobs` (one LLM call) splits multi-recruitment Telegram posts into separate import records; heuristic dash/`Recruitment` split when AI off or model collapses
- Quick post + paste job → `JobsService` enrichs description before create

## Multi-job digest split

Telegram jobfare often packs many orgs in **one** chat message (`-----` separators, Tamil+EN bullets). `splitJobs` returns `{ jobs: JobEnrichResult[], split }` so pull creates **one review row per recruitment**, not one mega-job.

| Path | Behavior |
| --- | --- |
| `AI_ENRICH_ENABLED=1` | LLM `job-split.prompt` → structured `jobs[]`; if model returns 1 but separators imply many → heuristic |
| AI off / stub / error | `utils/split-job-blocks.ts` (dash lines, blank lines, Recruitment cues) |

## Files

| File | Role |
| --- | --- |
| `ai.service.ts` | Enable flag, cap, provider resolve, batch enrich, `splitJobs` |
| `ai.controller.ts` | status + job-enrich |
| `providers/openai-compatible.provider.ts` | fetch → `/chat/completions` + noise strip + split |
| `providers/stub.provider.ts` | no-op enrich; heuristic `splitJobs` |
| `prompts/job-enrich.prompt.ts` | system + user JSON (single job) |
| `prompts/job-split.prompt.ts` | multi-job digest → `jobs[]` |
| `utils/split-job-blocks.ts` | deterministic multi-post splitter |
| `dto/enrich-job.dto.ts` | includes `instruction`, `contactWebsite`, `vacancies` |
| `help/*` | In-app help chatbot (quota, stub/LLM providers) |

## Agent rules

- Keep phones/emails/WhatsApp out of public description prompts/results
- Apply links may fill `contactWebsite` only
- Do not add paid SDKs by default; stay OpenAI-compatible + `fetch`
- Update this file when changing AI enrich behavior or env keys
- Help chat changes → also update [`help/CLAUDE.md`](help/CLAUDE.md)
