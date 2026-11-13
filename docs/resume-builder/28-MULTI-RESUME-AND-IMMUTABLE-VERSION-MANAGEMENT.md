# Resume Builder Capability 03: Multi-Resume and Immutable Version Management

> Part of the reusable Resume & Career Intelligence capability set for X Cron. This specification is independently scoped but follows the shared platform architecture in [03-FUNCTIONAL-MODULES.md](./03-FUNCTIONAL-MODULES.md#19-cross-capability-architecture-rules).

# Multi-Resume and Immutable Version Management

**Goal:** Build multiple role-specific resumes from one profile and preserve exactly what was submitted.

- Support master, role-specific and company/job-specific resume variants.
- Store immutable resume snapshots with content, template version, layout configuration and source profile version.
- Compare versions at section, bullet, skill, evidence, date and design levels.
- Restore a historical version by creating a new version; never mutate history.
- Bind each job application to the exact resume and cover-letter version submitted.
- Use optimistic concurrency for editing and autosave drafts.
- Acceptance: historical versions remain reproducible and a later edit never changes an already submitted resume.
