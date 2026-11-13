# Resume Builder Capability 02: Resume Truth Verification and Evidence Provenance

> Part of the reusable Resume & Career Intelligence capability set for X Cron. This specification is independently scoped but follows the shared platform architecture in [03-FUNCTIONAL-MODULES.md](./03-FUNCTIONAL-MODULES.md#19-cross-capability-architecture-rules).

# Resume Truth Verification and Evidence Provenance

**Goal:** Ensure every factual resume claim can be traced to user-provided or user-confirmed evidence.

- Classify claims as user-entered, imported, AI-rewritten or externally verified.
- Track support as direct, partial, ambiguous, absent or contradictory.
- Link bullets, skills, titles, dates, credentials and metrics to source fact IDs.
- Show before/after diffs, evidence and rationale for every AI rewrite.
- Require explicit user approval before factual suggestions are saved.
- Never invent numbers, leadership, skills, dates, credentials, employers or outcomes.
- Acceptance: unsupported factual expansions cannot be silently saved; externally verified is used only with a trusted verification provider and consent.
