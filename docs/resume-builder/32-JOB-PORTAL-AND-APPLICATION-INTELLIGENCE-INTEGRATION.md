# Resume Builder Capability 07: Job Portal and Application Intelligence Integration

> Part of the reusable Resume & Career Intelligence capability set for X Cron. This specification is independently scoped but follows the shared platform architecture in [03-FUNCTIONAL-MODULES.md](./03-FUNCTIONAL-MODULES.md#19-cross-capability-architecture-rules).

# Job Portal and Application Intelligence Integration

**Goal:** Connect job discovery to tailored resumes while keeping this resume capability reusable outside X Cron.

- Integrate through versioned APIs and normalized job-context contracts, not direct access to job portal database tables.
- Flow: open job -> analyze requirements -> select resume -> map evidence -> propose tailoring -> review diff -> create version -> export/apply.
- Keep job/application lifecycle owned by the host job portal.
- Record the exact resume version used for each application.
- Support paste-in job descriptions as the reliable fallback; URL ingestion is best-effort and must respect source access controls.
- Do not automate applications or bypass CAPTCHA, authentication or platform terms in the initial scope.
- Acceptance: Resume Builder works without X Cron-specific schema dependencies and all candidate data access requires user authorization.
