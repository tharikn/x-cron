# 15 — Development Phases and Acceptance Criteria

## Phase 0 — Foundation
- Confirm X Cron identity/tenant integration contract.
- Create NestJS service/module skeleton.
- Configure PostgreSQL and Prisma migrations.
- Establish API versioning, validation, logging and CI.
- Define strict local-only document policy and transient upload cleanup.

Exit: authenticated identity is enforced on every builder route/API; no guest routes; no cross-user access; no permanent document file storage.

## Phase 1 — Authenticated Resume Builder MVP
- Career profile CRUD and structured resume management.
- Experience, skills, education, projects and certifications.
- Resume definitions and section ordering.
- Publish at least 50 finished predefined templates (target 60).
- Separate dashboard, editor and dedicated preview routes.
- PDF and HTML export.
- Local folder creation/selection and device-local save.
- Mobile/web client integration.

Exit: signed-in user can create/edit a resume, select a template, preview it and save PDF/HTML into a local folder. Dashboard does not contain the preview or file browser. Backend does not retain generated files.

## Phase 2 — Import and editable formats
- Transient PDF/DOCX parsing with immediate file-byte deletion.
- Review-and-confirm import workflow.
- XLSX structured-data export and DOCX export.
- Import/export security tests.

Exit: source files are not retained; extracted fields are not silently confirmed; DOCX opens in common word processors; XLSX formula injection is prevented.

## Phase 3 — Job-aware analysis
- Job description normalization.
- Skill/keyword taxonomy baseline.
- Deterministic matching and explainable ATS score.
- Job portal integration contract.

Exit: every score component has evidence; scoring is versioned and reproducible; no unsupported ATS guarantee.

## Phase 4 — AI assistance
- Role/responsibility text generator.
- Resume parsing assistance and summary suggestions.
- Achievement/bullet rewriting and resume optimizer.
- Provider abstraction, quotas and evaluation tests.

Exit: AI suggestions require user approval; no unsupported facts are added; manual editing remains available when AI fails.

## Phase 5 — Advanced matching
- Embedding-based semantic matching.
- Skill-gap analysis and score calibration.
- Optional career recommendations.

Exit: semantic score is explainable and does not override deterministic evidence without clear weighting.

## Phase 6 — Optional integrations and maturity
- Google Docs creation with explicit OAuth consent.
- Usage analytics with privacy-safe aggregation.
- Template management/localization improvements.
- Operational dashboards and cost controls.

Cloud document backup/sync is excluded from this design. Do not add it without a separate explicit product requirement and approval.

## Recommended implementation order
1. Identity foundation and API authorization.
2. Structured profile/resume model.
3. 50+ predefined templates and template gallery.
4. Editor and dedicated preview renderer.
5. Local folder manager and PDF/HTML export.
6. Import and DOCX/XLSX.
7. Deterministic job analysis and ATS.
8. AI capabilities.
9. Analytics and optional Google Docs integration.

## Definition of done
- DTO/domain validation and authorization tests.
- Unit/integration tests and error/empty states.
- Logs contain no PII or document content.
- Local save verified on Android, iOS and web.
- Temporary source files deleted on all paths.
- Retention and cleanup behavior verified.
- Documentation and migrations updated.