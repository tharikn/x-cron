# Resume Builder Capability 06: Resume Quality, Export Readiness and Regression Testing

> Part of the reusable Resume & Career Intelligence capability set for X Cron. This specification is independently scoped but follows the shared platform architecture in [03-FUNCTIONAL-MODULES.md](./03-FUNCTIONAL-MODULES.md#19-cross-capability-architecture-rules).

# Resume Quality, Export Readiness and Regression Testing

**Goal:** Prevent a resume improvement from accidentally damaging factual accuracy, readability or parsing compatibility.

- Keep Resume Quality, Job Match and Parsing Compatibility as distinct reports.
- Check grammar, clarity, repetition, evidence strength, chronology, consistency, section completeness and recruiter scanability.
- Validate PDF/DOCX text extraction, reading order, hyperlinks, clipping, overflow and page layout.
- Run regression checks when content, template, renderer or scoring rules change.
- Compare against the previous version and explain material gains, regressions and engine-version changes.
- Maintain synthetic fixtures across templates, page lengths, languages and role families.
- Acceptance: critical factual/export failures are surfaced before export; warnings remain explainable and do not become arbitrary blocking scores.
