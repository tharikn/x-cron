# 13 — Cost Optimization

## 1. Objective

Deliver useful resume functionality with a low recurring infrastructure and AI cost. Do not introduce paid services until usage or quality measurements justify them.

## 2. Prioritize deterministic features

Build profile CRUD, resume editing, templates, preview, PDF/HTML export and basic keyword analysis without paid AI. These features deliver a usable product even when AI is disabled.

## 3. AI cost controls

- Make AI opt-in per action, not continuously running.
- Use concise prompts and send only relevant fields.
- Prefer smaller models for extraction/rewrite.
- Cache job description analysis by normalized hash and engine version.
- Reuse embeddings where permitted.
- Debounce repeated requests.
- Enforce quotas, per-user rate limits and maximum input sizes.
- Track token usage and feature cost.
- Provide graceful fallback to manual editing.

## 4. Infrastructure

- Start with one NestJS service deployment and PostgreSQL.
- Avoid microservice sprawl inside the resume service.
- Use existing X Cron infrastructure where security and isolation requirements permit.
- Add a queue only when workloads require it.
- Avoid permanent object storage for exports.
- Use managed or self-hosted components only after comparing operational cost and maintenance.

## 5. Storage savings

- Store structured profile/resume data rather than export binaries.
- TTL temporary uploads and generated artifacts.
- Cache normalized job analysis with a bounded retention policy.
- Keep logs free of resume content.
- Set limits for version snapshots and analysis history.

## 6. Feature gating

Separate features by cost profile:
- Free/local: manual builder, templates, preview, basic exports.
- Metered: AI role generation, rewrite, semantic analysis.
- Optional integration: Google Docs creation.
- Future paid tiers may use quotas, but do not hard-code pricing into domain logic.

## 7. Measure before optimizing

Track aggregate:
- cost per AI operation
- tokens per operation
- export latency/failure
- storage per active user
- analysis cache hit rate
- active usage per feature

Do not collect full resume text in analytics. Review actual usage before introducing complex infrastructure or a new vendor.
