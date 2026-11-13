# 07 — ATS Scoring Engine

## 1. Objective and disclaimer

Provide deterministic, explainable ATS compatibility and matching primitives for a selected resume and job description. The score is internal guidance, not a guarantee of passing any employer's ATS. External systems use different parsing and ranking rules.

The dedicated user-facing **Resume Match Score** experience is specified in [23-RESUME-MATCH-SCORE.md](./23-RESUME-MATCH-SCORE.md). This document defines shared matching/scoring capabilities; it does not define a competing feature or second scoring implementation.

## 2. Shared matching pipeline

1. Normalize job description and resume text.
2. Extract required/preferred skills and role requirements.
3. Match exact and synonym-normalized terms.
4. Compare experience and role evidence.
5. Check structure and parseability.
6. Optionally calculate semantic similarity.
7. Produce weighted dimensions with evidence and recommendations.

LLM output must not directly decide the numeric score.

## 3. Initial score model

The ATS compatibility model may use these initial weights (tune using test data):

| Dimension | Weight |
|---|---:|
| Required skills match | 20% |
| Preferred skills match | 10% |
| Relevant experience evidence | 20% |
| Role/title relevance | 10% |
| Keyword coverage | 10% |
| Semantic relevance | 10% |
| Resume structure/parseability | 10% |
| Content clarity and completeness | 10% |
| **Total** | **100%** |

The dedicated Resume Match Score has its own product-facing dimension model and weights documented in document 23. Do not add the two totals together or present them as interchangeable. Shared matching primitives may be reused while keeping each report's score definition and version explicit.

A component may be marked not applicable when the job description provides no reliable evidence for it. Define and document weight redistribution rather than silently assigning zero.

## 4. Matching rules

- Normalize case, punctuation, whitespace and common variants.
- Maintain a versioned skill/keyword taxonomy.
- Distinguish exact match, synonym match, related concept and no evidence.
- Avoid treating a keyword in a skills list as equivalent to demonstrated work experience.
- Prefer evidence from experience/project bullets for experience requirements.
- Do not penalize a user for requirements that are absent or ambiguous in the job description.
- Avoid overcounting repeated keywords.
- Treat missing evidence as “not found in this resume”, not proof that the candidate lacks the skill.

## 5. Explainability

Every score component should include:
- score and maximum
- configured weight
- matched requirements
- missing/weak requirements
- source evidence from the resume
- scoring engine/taxonomy version

Recommendations must be actionable and honest. Example: “The job asks for Kubernetes, but no Kubernetes evidence was found. Add relevant experience only if you have it.”

## 6. Parser/format checks

Check whether the resume has:
- recognizable section headings
- readable text extraction
- consistent date patterns
- standard contact and experience fields
- sensible section order
- excessive layout complexity or text embedded as images

Detailed document-level parser diagnostics belong to the separate [21-RESUME-PARSING-TEST.md](./21-RESUME-PARSING-TEST.md). Do not merge its score into job matching.

## 7. Calibration

- Create a representative test set of anonymized job descriptions and resumes.
- Compare score behavior with human reviewer judgments.
- Review false positives and false negatives.
- Version weights, taxonomy and algorithms.
- Never silently change old report meaning; store engineVersion.
- Avoid training or evaluation use of identifiable user resumes without appropriate consent.

## 8. UX presentation

The ATS compatibility primitives should expose:
- component breakdown
- strong matches
- missing or weak evidence
- suggested improvements
- clear disclaimer that score is an estimate

The dedicated Resume Match Score route owns the user-facing 0–100 job match summary and evidence report. Do not present a single score without explanation.