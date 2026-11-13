# 35 — AI Evaluation, Governance and Cost Controls

## 1. Purpose
Provide measurable quality and safety controls for every AI-enabled feature. AI is optional; deterministic editing, export, scoring and validation continue without it. Model choice is an implementation detail behind provider interfaces.

## 2. AI capability registry
For each use case record: owner, purpose, input fields, output schema, provider/model, prompt version, data classification, retention behavior, user consent, fallback, quota and evaluation suite. Separate extraction, rewriting, semantic ranking, feedback and interview assistance; do not use one unrestricted general prompt.

## 3. Evaluation datasets
Maintain synthetic and explicitly consented test fixtures for:
- Resume extraction and field mapping.
- JD requirement extraction.
- Evidence-grounded rewriting.
- Unsupported metric and credential detection.
- Multilingual and regional language variants.
- Prompt injection in resumes and job descriptions.
- Ambiguous, contradictory and missing facts.
- Interview question grounding and feedback quality.
- Protected-attribute leakage and discriminatory recommendations.

Never use production resumes for training/evaluation without a separate, informed opt-in and approved retention controls.

## 4. Metrics and release gates
Measure schema validity, task success, evidence-link precision, unsupported-claim rate, factuality failures, false-positive/negative rate, user correction/dismissal rate, latency, provider failure and cost per successful task. Define thresholds per feature; critical unsupported factual claims block release. Compare candidate model/prompt versions against a fixed baseline and retain reproducible evaluation metadata.

## 5. Runtime architecture
Business modules call typed interfaces such as TextGenerationProvider, StructuredExtractionProvider and EmbeddingProvider. An AI Gateway applies policy, consent, redaction, quotas, provider routing, timeouts, retries and telemetry. It returns typed results with provider/model/prompt/schema versions. Domain services validate outputs and provenance independently; provider output is always untrusted.

## 6. Privacy and consent
Explain when data leaves the device and which fields are sent. Send only the minimum excerpt and context required. Remove contact data and unrelated identifiers where feasible. Do not send full career profiles for single-bullet rewriting. Do not log prompts, responses or raw resume/JD text. Honor provider retention controls and deletion obligations. User can decline AI and still use the builder.

## 7. Cost management
Use deterministic logic first. Cache normalized JD extraction by content hash only where retention/consent permits. Cache embeddings with model/version keys. Debounce repeated requests, batch compatible tasks, cap tokens/pages, enforce per-user quotas, use smaller models for extraction and reserve stronger models for tasks where evaluations justify them. Track cost by feature and tenant without content logging. Circuit-break unavailable providers and fail gracefully.

## 8. Prompt and tool security
Treat every document, JD, URL and user answer as untrusted data. No model output may execute SQL, HTML, JavaScript, shell commands or arbitrary URLs. Use strict JSON schemas, allowlisted fields, output size limits and deterministic validation. Do not let retrieved content change system policy. Tools require explicit authorization and server-side validation.

## 9. Governance
Maintain model inventory, prompt ownership, change review, incident response, data-flow records and rollback capability. Re-evaluate when provider, model, prompt, taxonomy or policy changes. Disclose material AI use to users. Provide a way to report harmful or inaccurate suggestions.

## 10. Acceptance criteria
Every AI feature has a documented purpose, input contract, output schema, consent policy, deterministic fallback and evaluation suite. Critical factuality tests pass before release. No raw content appears in ordinary logs or analytics. AI provider outage does not block core resume creation or export. Cost and latency are measurable per feature.
