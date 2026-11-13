# Resume Builder Capability 13: AI Governance, Evaluation and Cost Control

> Part of the reusable Resume & Career Intelligence capability set for X Cron. This specification is independently scoped but follows the shared platform architecture in [03-FUNCTIONAL-MODULES.md](./03-FUNCTIONAL-MODULES.md#19-cross-capability-architecture-rules).

# AI Governance, Evaluation and Cost Control

**Goal:** Use AI only where it adds measurable value, with deterministic fallbacks and verifiable quality.

- Keep CRUD, validation, rendering, export, score arithmetic and exact matching deterministic.
- Use AI selectively for parsing assistance, job-description extraction, semantic mapping, rewriting and interview coaching.
- Route AI through typed provider interfaces and a policy gateway for consent, redaction, quotas, timeouts and provider selection.
- Validate every response against strict schemas and evidence rules; model output is untrusted.
- Maintain synthetic evaluation fixtures for factuality, unsupported metrics, prompt injection, multilingual content and bias.
- Track schema validity, unsupported-claim rate, user correction rate, latency, failure rate and cost per successful task.
- Use caching, debouncing, token/page limits and smaller models where evaluations support them.
- Acceptance: AI can be disabled without breaking resume creation/export; critical factuality tests gate releases; prompts and resume content are not written to ordinary logs.
