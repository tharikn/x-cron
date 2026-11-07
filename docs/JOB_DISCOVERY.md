# Job discovery, search and matching (X Cron)

Phase 1 gap-close against the job-portal discovery blueprint. Postgres `tsvector` + `pg_trgm` are **on** when `JOBS_STORE=prisma` / `SEARCH_FTS_ENABLED=1`. **Meilisearch** and a search-quality metrics pipeline remain **deferred**.

Related: [DEVELOPER.md](./DEVELOPER.md) · [api/src/jobs/CLAUDE.md](../api/src/jobs/CLAUDE.md) · [api/src/seeker/CLAUDE.md](../api/src/seeker/CLAUDE.md)

## Canonical APIs

| Capability | Canonical path | Doc alias (thin) |
| --- | --- | --- |
| Public search | `GET /v1/jobs` | `GET /v1/jobs/search` |
| Personalised feed | `GET /v1/feed` | `GET /v1/jobs/recommendations` |
| Not interested | `POST /v1/me/hidden-jobs/:jobId` | `POST /v1/jobs/:jobId/not-relevant` |
| Saved searches | `GET/POST/PATCH/DELETE /v1/me/saved-searches` | *(no move)* |

## Search filters

Query params on `GET /v1/jobs` (also shareable on web `/` and mobile `/tabs/discover`):

`q` / `keyword`, `location`, `jobType`, `category`, `language`, `skills` (comma-separated overlap), `salaryMin`, `remote`, `postedWithin` (`1d`\|`7d`\|`30d`), `nearLat`/`nearLng`/`radiusKm`, `walkInOnly`, `verifiedEmployer`, `fresher`, `easyApply`, `sort`, `cursor`, `limit`.

- **Fresher:** `experienceLabel` heuristics + internship/apprenticeship when label empty.
- **Easy apply:** at least one public contact path (phone / email / WhatsApp / website).
- Signed-in seekers: hidden jobs are excluded; profile skills / preferred cities / remote prefs feed ranking + `matchReasons`.

Only `status=published` jobs inside the listing window appear (existing `listPublished`).

## Ranking

Deterministic weighted score in `jobs-match.util.ts` / `jobs-search.util.ts`:

- Title / skills / employer / category / description keyword hits
- Skill overlap vs seeker or filter skills
- Remote + preferred-location fit
- Capped freshness; capped `priority`; small verified-employer bump
- Promoted jobs may float on `newest`/`relevance` but stay labelled (`promoted` / `promotionBadge`)

Same scorer powers `GET /v1/feed` cold start (recency/`priority` when prefs/skills empty) and personalised ranking.

## Match reasons

Public/search/feed items may include `matchReasons: string[]` (max 3). Examples:

- “Matches 4 of your 5 selected skills.”
- “Remote work matches your preference.”
- “Verified employer.”

**Never** a match percentage on discovery cards. Apply-time `matchPercent` stays inside ATS / Performance Score only.

## Clients

- **Web Home** + **Mobile Discover:** URL query sync, active-filter chips (dismiss / clear filters without wiping Preferences), richer filters, match-reason chips, Save search (signed-in), Open saved search → discovery URL.
- **Mobile:** signed-in **For you** rail from `GET /v1/feed`.

## Postgres FTS (Phase 1 search index)

- Column `Job.searchDocument` (tsvector) maintained by trigger; GIN + `pg_trgm` on title/city.
- `JobsPrismaStore.search` runs ranked `$queryRaw` when a keyword is present, then applies structured filters in-process.
- Fallback: in-memory scorer if FTS SQL fails (extension/migration not applied yet).

## Deferred

- Meilisearch / Elasticsearch outbox indexing
- Hybrid / on-site work-mode enum (keep `remote` boolean)
- Education filter; search-quality metrics (zero-result rate, reformulation, CTR by rank)
