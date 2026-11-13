# 29 — Resume Versioning, Comparison and Regression

## 1. Purpose
Make resume changes safe, explainable and reversible. A resume version is an immutable snapshot of structured content, template package version, layout configuration and relevant engine versions. The master career profile remains separate from every resume snapshot.

## 2. Version model
- Resume: stable logical identity, owner, target role, status and currentVersionId.
- ResumeVersion: immutable content snapshot, parentVersionId, versionNumber, createdBy, changeSummary, createdAt.
- ResumeDesignSnapshot: templateId/version, validated theme/layout overrides, page format and renderer compatibility.
- AnalysisReference: analysis type, reportId, engineVersion and source resumeVersionId.
- VersionTag: user labels such as “Angular role” or “Submitted to Acme”.
- ApplicationLink: external job/application reference and exact submitted resumeVersionId.

Every edit creates a draft or a new immutable version at explicit save/checkpoint boundaries. Autosave may update a draft revision with optimistic concurrency, but published snapshots are immutable. Never rewrite old reports when scoring logic changes.

## 3. Comparison engine
Compare normalized structured fields, not only rendered PDF bytes. Show:
- Added, removed and modified sections.
- Bullet-level text changes.
- Skill and evidence coverage changes.
- Employment/education date changes.
- Template/layout changes separately from content changes.
- Page count, reading-order and parser compatibility changes.
- Score changes with old/new engine versions.

A diff must distinguish content changes from presentation-only changes. Do not assume a score decrease is caused by a content regression when the scoring engine version changed.

## 4. Regression gates
On a new version, optionally rerun:
- Truth/provenance validation.
- Deterministic quality rules.
- Resume match against saved job analysis.
- Parser compatibility for the selected template/export format.
- Layout/overflow validation.

Report regression severity: critical (unsupported fact, missing essential section, corrupt export), warning (material match/parseability decrease), informational (style or non-material changes). Thresholds are configurable and calibrated; no arbitrary blocking score. Users can export despite warnings unless a technical/security failure makes export unsafe.

## 5. APIs
- GET /v1/resumes/:id/versions
- GET /v1/resume-versions/:versionId
- POST /v1/resumes/:id/versions
- POST /v1/resume-versions/:versionId/compare
- POST /v1/resume-versions/:versionId/restore
- POST /v1/resume-versions/:versionId/regression-checks

Restoring creates a new version whose content is copied from the selected historical snapshot; it never moves the current pointer backward or deletes history. Use ETags / If-Match for writes.

## 6. Storage and retention
Persist structured snapshots and compact diffs. Define per-user retention limits and user-visible deletion/export controls. Do not store PDF/DOCX binaries or rendered pages. Historical reports reference the exact version and engine versions. When a source fact is deleted, mark dependent versions/reports for review according to policy without silently rewriting history.

## 7. Job application binding
When a candidate applies to a job, record the exact resumeVersionId and optional cover-letter version used. Later edits must not change the submitted snapshot. Recruiter sharing resolves only the explicitly shared version and scope.

## 8. Acceptance criteria
- Historical versions are immutable and reproducible.
- Restore creates a new version.
- Diffs separate content, design and engine changes.
- Saved match/quality/parser reports identify source version and engine version.
- Regression findings have evidence and actionable explanations.
- Application records retain the exact submitted version reference.
- Concurrent edits cannot silently overwrite each other.
