# 23 — Resume Match Score

## 1. Purpose

Provide a dedicated **Resume Match Score** by comparing a selected resume version with a specific job description (JD). The user can provide the JD by:
- Pasting the complete job description.
- Supplying a publicly accessible job-posting URL from LinkedIn, Naukri or Indeed.
- Importing supported job details through an authorized integration, where available.

The result explains how well the resume's evidenced skills, roles, responsibilities and experience align with that particular vacancy, what is missing, and what can be improved truthfully.

This is a job-specific score. It is separate from:
- Resume Quality Score (general resume quality)
- Parsing Test Score (document extraction/compatibility)
- Recruiter View (presentation mode)
- Any proprietary employer ATS score

## 2. Supported JD input methods

### 2.1 Copy and paste — baseline and most reliable
- Provide a text editor for job title, company (optional), location (optional), role/seniority (optional) and full description.
- Accept responsibilities, required/preferred skills, qualifications and experience criteria.
- Show extracted requirements for user confirmation/editing before scoring.
- Keep the original pasted description only as long as required by the user's selected job-analysis history policy.

### 2.2 Job URL — LinkedIn, Naukri and Indeed
- Accept a job-post URL and attempt retrieval only when the page is publicly accessible and retrieval is permitted by the source's terms and technical controls.
- Do not bypass login, paywalls, CAPTCHA, access controls, robots restrictions or anti-bot measures.
- Do not request or store the user's LinkedIn/Naukri/Indeed password or session cookies.
- Do not scrape authenticated pages or use unofficial mechanisms that violate source terms.
- If the page cannot be retrieved, clearly explain why and offer paste-in as the fallback.
- Validate canonical URL/domain and prevent SSRF: block private IPs, localhost, internal metadata endpoints, unsafe redirects and non-HTTP(S) schemes.
- Apply request timeouts, response-size limits, content-type checks and safe HTML-to-text extraction.
- Treat retrieved job content as untrusted data; ignore embedded prompt instructions or scripts.

The user must confirm the extracted job title, company and requirements before calculation. Store source domain and canonical URL only when appropriate; do not imply a platform partnership.

### 2.3 Authorized integrations
Use official APIs or partner integrations only when credentials, scopes, commercial terms and platform permissions are available. Integration is optional and must not block copy/paste.

## 3. Separate feature boundary

Suggested route: `/resume-builder/match-score`.

The Match Score feature owns:
- JD input/source capture
- Requirement normalization and user confirmation
- Resume-to-JD evidence mapping
- Match calculation and explanation
- Match report/version history

It reuses existing Job Description Analyzer, skill taxonomy and ATS evidence. It must not implement a competing parser or duplicate scoring engine.

## 4. End-to-end user flow

1. User selects a resume and exact resume version.
2. User pastes a JD or provides a supported URL.
3. System retrieves or parses the job description and extracts role, responsibilities, required/preferred skills, experience, qualifications and other explicit criteria.
4. User reviews and corrects extracted requirements.
5. Matcher finds evidence in the selected resume's summary, experience, achievements, projects, skills and education.
6. Scoring engine calculates the score and dimension breakdown.
7. Report shows strong matches, partial/related matches, missing evidence and unsupported requirements.
8. User can open a finding in the resume editor or Recruiter View.
9. Optional suggestions propose truthful improvements; user approval is required.
10. User can compare scores across resume versions for the same JD.

## 5. Architecture

```text
JD Input (Paste / Permitted URL / Official Integration)
                         |
                         v
                 JD Source Adapter
                         |
                         v
              Safe Content Extraction
                         |
                         v
              JD Requirement Analyzer
                         |
                         v
             User Confirmation / Editing
                         |
                         v
Selected Resume Version ---> Resume Evidence Extractor
                         |              |
                         +-------+------+
                                 |
                                 v
                       Requirement Matcher
                                 |
                     +-----------+-----------+
                     |                       |
                     v                       v
             Deterministic Scoring     Optional Semantic
                 and Evidence          Similarity Adapter
                     |                       |
                     +-----------+-----------+
                                 |
                                 v
                       Match Report Builder
                                 |
                                 v
                         Match Score UI
```

### NestJS module proposal

```text
src/
  resume-match/
    resume-match.module.ts
    resume-match.controller.ts
    resume-match.service.ts
    jd-sources/
      paste/
      public-url/
      official-integrations/
    extraction/
    requirement-normalizer/
    evidence-mapper/
    matcher/
    scoring/
    explanations/
    reports/
    version-comparison/
    policy/
    dto/
    tests/
```

The module orchestrates existing job-analysis and ATS services. Avoid a second copy of keyword extraction, synonym taxonomy or scoring arithmetic.

## 6. Match dimensions and initial weights

Initial configurable weights (calibrate against a representative, consented evaluation set):

| Dimension | Weight | What is compared |
|---|---:|---|
| Required skills | 25% | Required skills with direct resume evidence |
| Relevant experience | 20% | Responsibilities, projects and achievements related to the role |
| Role and seniority alignment | 15% | Job title, function and level where evidence supports comparison |
| Responsibilities alignment | 15% | Evidence of performing similar work |
| Preferred skills | 10% | Preferred skills with direct or related evidence |
| Education / certifications | 5% | Explicit job criteria against resume facts |
| Domain / tools / keywords | 5% | Relevant domain terms and tools, without keyword stuffing |
| Semantic relevance | 5% | Contextual similarity as a supporting signal |
| **Total** | **100%** | |

Rules:
- LLM output must never directly determine the numeric score.
- Deterministic matching and evidence rules own score arithmetic.
- If a dimension is absent from the JD or cannot be evaluated, mark it not applicable and redistribute its weight using a documented rule.
- Do not treat a skill mentioned only in a skills list as equivalent to demonstrated experience.
- Distinguish exact match, synonym/related match, partial evidence and no evidence.
- Do not infer years of experience, proficiency or qualifications from ambiguous text.
- Do not penalize a user for unstated or irrelevant criteria.
- Show score confidence/coverage when the JD is incomplete or extraction is uncertain.

## 7. Result presentation

The result page should clearly display:

- **Overall Resume Match Score** (0–100)
- Selected resume name and version
- Job title, company and source
- JD extraction confirmation status
- Dimension-by-dimension score and weight
- Strong matches with exact resume evidence
- Partial/related matches with explanation
- Missing requirements with no evidence found
- Requirements not evaluated due to insufficient JD detail
- Recommended next actions

Example result structure (illustrative only):

```text
Resume Match Score: 78 / 100

Strong matches
- NestJS — supported by recent project experience
- PostgreSQL — supported by work experience

Partial matches
- AWS — appears in skills, but project evidence is limited

Missing evidence
- Kubernetes — no supporting resume evidence found

Next action
- Add relevant Kubernetes experience only if it reflects actual work.
```

Never call the score “chance of selection”, “hiring probability” or “guaranteed ATS pass”. A high score does not guarantee shortlisting; a lower score does not mean the candidate is unqualified.

## 8. Finding and evidence model

Each matched requirement should include:
- Requirement ID and normalized skill/criterion
- JD source text/span
- Requirement type: required, preferred, responsibility, experience, qualification
- Match status: exact, related, partial, missing, not_evaluated
- Resume section/item IDs and evidence excerpts
- Confidence and matching method
- Explanation and possible action

Do not expose fabricated evidence. A missing match means “not found in this resume”, not “the candidate does not have this skill.”

## 9. API proposal

All endpoints require authentication and ownership validation.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /job-descriptions | Create JD from pasted text or metadata |
| POST | /job-descriptions/import-url | Attempt permitted public URL retrieval |
| GET | /job-descriptions/:jobDescriptionId | Get authorized normalized JD |
| PATCH | /job-descriptions/:jobDescriptionId | Correct extracted requirements |
| POST | /resumes/:resumeId/match-reports | Calculate match against JD and resume version |
| GET | /resume-match-reports/:reportId | Get match report and evidence |
| GET | /resumes/:resumeId/match-reports | List authorized match history |
| POST | /resume-match-reports/:reportId/recalculate | Recalculate after resume/JD change |
| DELETE | /resume-match-reports/:reportId | Delete report/history |

Example request:

```json
{
  "resumeVersionId": "resume-version-id",
  "jobDescriptionId": "job-description-id",
  "scoringVersion": "1.0.0"
}
```

URL import request:

```json
{
  "url": "https://www.example.com/jobs/role"
}
```

The API must return a clear import status such as `imported`, `manual_paste_required`, `unsupported_source` or `retrieval_failed`. Do not claim that a URL was successfully read unless the source content was actually retrieved and validated.

## 10. Data model

Suggested entities:
- JobDescription: owner/tenant, sourceType, sourceDomain, canonicalUrl (optional), title, company (optional), location (optional), rawText retention reference, normalizedRequirements, extractionVersion, confirmationStatus.
- ResumeMatchReport: owner/tenant, resumeId, resumeVersionId, jobDescriptionId, totalScore, dimensionScores, coverage, scoringVersion, createdAt.
- ResumeMatchEvidence: reportId, requirementId, matchStatus, resumeSection/item references, evidence excerpt (minimal), confidence and method.

Store raw JD text only according to a clear retention policy. Do not persist full resume document files. Avoid logging JD text, resume text, contact information or scraped HTML.

## 11. Security, privacy and fairness

- Require authenticated user and verify ownership of resume, JD and report.
- Protect URL retrieval against SSRF, malicious redirects, oversized content and unsafe document types.
- Do not bypass third-party access controls or collect platform credentials.
- Sanitize HTML and treat JD text as untrusted input.
- Send minimum necessary resume/JD excerpts to AI providers.
- Provide disclosure and consent controls for external AI processing.
- Do not use protected characteristics or infer age, gender, ethnicity, health, family status or other sensitive traits.
- Do not treat career gaps, nontraditional backgrounds or regional wording as negative match evidence.
- Keep deterministic score calculation explainable and versioned.

## 12. Performance and cost

- Normalize and cache JD extraction by content hash and analyzer version where retention/consent permits.
- Reuse existing skill taxonomy and ATS matching services.
- Run exact/synonym matching before optional embeddings/LLM.
- Invoke AI only for ambiguous semantic explanations, not every keyword.
- Apply URL fetch timeouts, response limits, rate limits and per-user quotas.
- Store score/evidence metadata rather than repeated raw documents.
- Allow recalculation when scoring/taxonomy versions change.

## 13. Acceptance criteria

- User can paste a JD and obtain a complete match report.
- LinkedIn, Naukri and Indeed URLs are accepted as input, but retrieval is attempted only where permitted and accessible.
- Login-protected or blocked pages fall back to paste-in; no credential collection or access-control bypass.
- User can confirm/edit extracted requirements before scoring.
- Match report is tied to an exact resume version and JD version.
- Every score dimension has an explanation and evidence.
- Missing evidence is not represented as proof that the candidate lacks the skill.
- Resume Match Score is separate from Quality Score and Parsing Test Score.
- AI is optional; deterministic matching remains functional.
- No hiring outcome or ATS vendor guarantee is claimed.

## 14. Delivery phases

1. Copy/paste JD input, requirement extraction and confirmation.
2. Deterministic resume evidence mapping and explainable score.
3. Match report UI and history/version comparison.
4. Safe public URL retrieval with fallback for LinkedIn, Naukri and Indeed pages.
5. Optional authorized platform integrations and semantic similarity enhancements.

## 15. Related documents

- [07-ATS-ENGINE.md](./07-ATS-ENGINE.md)
- [06-AI-ARCHITECTURE.md](./06-AI-ARCHITECTURE.md)
- [20-RESUME-QUALITY-RECRUITER-REVIEW.md](./20-RESUME-QUALITY-RECRUITER-REVIEW.md)
- [21-RESUME-PARSING-TEST.md](./21-RESUME-PARSING-TEST.md)
- [22-RECRUITER-VIEW.md](./22-RECRUITER-VIEW.md)
