# Resume Builder Capability 01: Career Intelligence Profile and Achievement Bank

> Part of the reusable Resume & Career Intelligence capability set for X Cron. This specification is independently scoped but follows the shared platform architecture in [03-FUNCTIONAL-MODULES.md](./03-FUNCTIONAL-MODULES.md#19-cross-capability-architecture-rules).

# Career Intelligence Profile and Achievement Bank

**Goal:** Let candidates enter career information once and reuse approved facts across multiple resumes, job matches and interview preparation.

- Maintain structured work experience, projects, skills, education, certifications, achievements and career preferences.
- Store achievements as context, personal action, skills used, scope and outcome; metrics remain optional and require candidate confirmation.
- Link each fact to its source, creation method, confirmation state and revision history.
- Support partial dates, concurrent roles, career breaks and nontraditional paths without treating gaps as negative.
- Keep a canonical career profile separate from resume-specific content.
- APIs: `/v1/career-profile`, `/v1/career-facts`, `/v1/achievement-drafts`, `/v1/skill-taxonomy`.
- Acceptance: facts are reusable; edits to a resume do not silently change the master profile; user can export, correct and delete profile data.
