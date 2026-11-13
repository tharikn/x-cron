# 07 — ATS Scoring Engine

## 1. Objective and disclaimer

Provide an **ATS compatibility estimate** for a selected resume and job description. The score is an internal guidance metric, not a guarantee of passing any employer's ATS. External systems use different parsing and ranking rules.

## 2. Hybrid design

Combine deterministic evidence-based checks with optional semantic analysis:
1. Normalize job description and resume text.
2. Extract required/preferred skills and role requirements.
3. Match exact and synonym-normalized terms.
4. Compare experience and role evidence.
5. Check structure and parseability.
6. Optionally calculate semantic similarity.
7. Produce a weighted score with evidence, gaps and recommendations.

LLM output must not directly decide the numeric score.

## 3. Initial score model

Suggested initial weights (tune using test data):

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

A component may be marked not applicable when the job description provides no reliable evidence for it. Define and document weight redistribution rather than silently assigning zero.

## 4. Matching rules

- Normalize case, punctuation, whitespace and common variants.
- Maintain a versioned skill/keyword taxonomy.
- Distinguish exact match, synonym match, related concept and no evidence.
- Avoid treating a keyword in a skills list as equivalent to demonstrated work experience.
- Prefer evidence from experience/project bullets for experience requirements.
- Do not penalize a user for requirements that are absent or ambiguous in the job description.
- Avoid overcounting repeated keywords.

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

Do not claim that a template is accepted by every ATS.

## 7. Calibration

- Create a representative test set of anonymized job descriptions and resumes.
- Compare score behavior with human reviewer judgments.
- Review false positives and false negatives.
- Version weights, taxonomy and algorithms.
- Never silently change old report meaning; store engineVersion.
- Avoid training or evaluation use of identifiable user resumes without appropriate consent.

## 8. UX presentation

Show:
- Overall estimated compatibility score
- Component breakdown
- Strong matches
- Missing or weak evidence
- Suggested improvements
- Clear disclaimer that score is an estimate

Do not present a single score without explanation.
