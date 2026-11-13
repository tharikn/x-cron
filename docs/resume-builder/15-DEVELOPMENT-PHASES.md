# 15 — Development Phases and Acceptance Criteria

## Phase 0 — Foundation

- Confirm identity/tenant integration contract.
- Create NestJS service/module skeleton.
- Configure PostgreSQL and Prisma migrations.
- Establish API versioning, validation, logging and CI.
- Define privacy, retention and export-file policy.

**Exit criteria:** authenticated user context is enforced; migrations and health checks work; no cross-user access.

## Phase 1 — Manual Resume Builder MVP

- Career profile CRUD.
- Experience, skills, education, projects and certifications.
- Resume definitions and section ordering.
- Initial ATS-friendly templates.
- Preview.
- PDF and HTML export.
- Mobile/web client integration.
- Device-local export save.

**Exit criteria:** a user can create a profile, create a resume without AI, preview it and save PDF/HTML locally. Backend does not retain generated exports.

## Phase 2 — Import and editable formats

- PDF/DOCX text extraction.
- Review-and-confirm import workflow.
- XLSX structured-data export.
- DOCX export.
- Import/export security tests.

**Exit criteria:** imported fields are not silently persisted as confirmed; DOCX opens in common word processors; XLSX formula injection is prevented.

## Phase 3 — Job-aware analysis

- Job description normalization.
- Skill/keyword taxonomy baseline.
- Deterministic exact/synonym matching.
- Initial explainable ATS score and breakdown.
- Job portal integration contract.

**Exit criteria:** each score component has evidence; scoring is versioned and reproducible; no unsupported ATS guarantee is shown.

## Phase 4 — AI assistance

- Role/responsibility text generator.
- Resume parsing assistance and summary suggestions.
- Achievement/bullet rewriting.
- Resume optimizer.
- Provider abstraction, quotas and evaluation tests.

**Exit criteria:** AI suggestions require user approval; no unsupported facts are added; manual editing remains available when AI fails.

## Phase 5 — Advanced matching

- Embedding-based semantic matching.
- Skill-gap analysis.
- Improved score calibration using reviewed test data.
- Optional career recommendations.

**Exit criteria:** semantic score is explainable enough for product use and does not override deterministic evidence without clear weighting.

## Phase 6 — Optional integrations and maturity

- Google Docs creation with explicit OAuth consent.
- Optional cloud backup only with opt-in.
- Usage analytics with privacy-safe aggregation.
- Template management and localization improvements.
- Operational dashboards and cost controls.

**Exit criteria:** integrations can be disconnected/revoked; local export remains available without Google; retention/deletion controls are tested.

## Recommended implementation order

1. Read HLD, architecture, data model and API design.
2. Implement Phase 0 and Phase 1 completely.
3. Validate local file behavior on Android, iOS and web.
4. Add import and DOCX/XLSX.
5. Add deterministic job analysis and ATS.
6. Add AI capabilities only after data structures and review UX are stable.
7. Add semantic matching and optional cloud integrations last.

## Definition of done for every module

- DTO and domain validation
- Authorization/tenant tests
- Unit and integration tests
- Error and empty states
- Logging without PII
- API documentation
- Mobile/web behavior verified where applicable
- Retention and cleanup behavior verified
- Updated documentation and migration notes
