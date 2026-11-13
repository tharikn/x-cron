# Resume Builder Capability 08: Application Resume Vault

> Part of the reusable Resume & Career Intelligence capability set for X Cron. This specification is independently scoped but follows the shared platform architecture in [03-FUNCTIONAL-MODULES.md](./03-FUNCTIONAL-MODULES.md#19-cross-capability-architecture-rules).

# Application Resume Vault

**Goal:** Give candidates a reliable history of what they sent to each employer and when.

- Maintain a private application-to-resume mapping with external job ID, employer label, application date, resumeVersionId and optional coverLetterVersionId.
- Store a snapshot reference, not a mutable link to the current resume.
- Allow candidate notes, interview stages and follow-up reminders where the host portal owns the application workflow.
- Show which resume version was shared or submitted.
- Acceptance: changing a resume later cannot alter the historical application record; the portal remains the source of truth for application status.
