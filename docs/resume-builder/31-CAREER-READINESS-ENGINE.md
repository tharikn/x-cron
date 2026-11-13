# 31 — Career Readiness and Skill Gap Engine

## 1. Purpose
Help candidates understand evidence-backed alignment with a target role and plan practical development. This is guidance, not a hiring prediction, credential verification or employability verdict.

## 2. Inputs and boundaries
Inputs: confirmed career profile facts, user-selected target role, optional confirmed job requirements, skill taxonomy and user-stated learning goals. Do not infer protected traits or use demographic proxies. A missing skill in the profile means “no evidence recorded”, not “candidate does not have the skill”.

## 3. Requirement taxonomy
Normalize each requirement into:
- canonical skill or competency
- aliases and related skills
- importance: required, preferred, contextual
- proficiency expectation when explicitly stated
- evidence type: demonstrated work, project, certification, education, self-reported
- source span and confidence
- user-confirmation state

Keep technical skills, domain knowledge, tools, behavioral competencies and credentials distinct. Do not equate a course with professional experience.

## 4. Evidence mapping
Map requirements to CareerFact, Achievement, Project, Education or Certification IDs. Statuses: strong_evidence, partial_evidence, self_reported, no_recorded_evidence, ambiguous, not_applicable. Explain the mapping and allow user correction. Semantic similarity may propose candidate links but deterministic policy and user review decide accepted evidence.

## 5. Output
- Role alignment summary with coverage and evidence quality.
- Strengths with source facts.
- Gaps phrased as missing recorded evidence.
- Transferable skills with source experience.
- Suggested projects or learning paths, labelled as recommendations.
- Progress history and user-defined goals.

Avoid a single “employability score”. If a readiness index is later exposed, publish its formula, coverage, version and limitations and ensure it is not used for hiring decisions.

## 6. Learning plan
A plan includes target competency, current evidence, learning objective, recommended practice, estimated effort range, milestone and self-review. Estimates are guidance only. Do not promise placement or salary outcomes. User controls goals and can dismiss recommendations.

## 7. APIs
- POST /v1/career-readiness/assessments
- GET /v1/career-readiness/assessments/:id
- POST /v1/career-readiness/assessments/:id/corrections
- POST /v1/career-readiness/goals
- PATCH /v1/career-readiness/goals/:id
- GET /v1/skill-taxonomy/:id/related

Assessment requests bind an exact profileVersion and optional jobAnalysisId. Reports are reproducible and versioned.

## 8. Acceptance criteria
Every recommendation cites supporting profile facts or is clearly marked as a learning suggestion. Missing evidence is not described as lack of ability. User can correct mappings, define goals and delete reports. No protected attribute or hiring outcome prediction is produced.
