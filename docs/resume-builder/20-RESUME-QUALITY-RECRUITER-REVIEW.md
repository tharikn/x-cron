# 20 — Resume Quality & Recruiter Review Engine

## 1. Purpose and product position

Build a quality-assurance layer that reviews a resume before the user exports or attaches it to an application. It should behave like a careful resume editor and a structured recruiter-readiness reviewer: identify defects, explain why they matter, show the exact evidence, and offer safe, user-approved improvements.

This is a **quality and review system**, not a promise that a resume will pass every ATS, get shortlisted, or reflect the decisions of every recruiter. Do not describe its score as an actual employer ATS score.

The engine complements, but does not replace:
- ATS keyword and job-match analysis in [07-ATS-ENGINE.md](./07-ATS-ENGINE.md)
- Job-specific matching and optimization
- The user's own review and approval before changes are applied

## 2. Design principles

1. **Evidence first:** every finding points to a resume section, field, text span or page where possible.
2. **Deterministic core:** formatting, completeness, consistency, text quality and structural checks use versioned rules.
3. **AI as an assistant:** use AI for nuanced language feedback and recruiter-style observations, never as the sole source of truth for factual findings.
4. **No invented facts:** suggestions must not add unverified metrics, skills, titles, dates, employers, qualifications or outcomes.
5. **Explainable results:** show the issue, impact, evidence, severity, recommended action and confidence.
6. **User control:** suggestions are proposed as diffs; the user accepts, edits or dismisses each one.
7. **Job-aware but not job-dependent:** a general review works without a job description; job-specific review is an additional mode.
8. **Privacy by design:** review structured resume content in memory where practical; do not retain document binaries or send unnecessary personal data to AI providers.
9. **Accessible and localized:** support keyboard navigation, screen readers, clear language and locale-aware date/spelling conventions.
10. **Graceful degradation:** deterministic checks continue when AI is unavailable.

## 3. Review modes

| Mode | Inputs | Output |
|---|---|---|
| General resume review | Selected structured resume + template/render metadata | Overall quality, content, consistency, readability and presentation findings |
| Job-specific review | Resume + normalized job requirements | Relevance, evidence coverage and role-specific improvement suggestions |
| Recruiter-readiness review | Resume + optional role/seniority context | Structured reviewer observations about clarity, credibility, relevance and scanability |
| Pre-export validation | Resume + selected template + render model | Page overflow, clipping, broken links, layout and export-readiness warnings |

A user can run a general review without pasting a job description. Job-specific review must reuse the normalized requirements from the Job Analyzer rather than create a competing keyword engine.

## 4. Logical architecture

Use a pipeline with independently testable stages:

~~~text
Authenticated Resume / Render Model
             |
             v
      Review Orchestrator
             |
     +-------+---------+----------------+
     |                 |                |
     v                 v                v
Deterministic      Structure &      Render / Layout
Rule Engine        Consistency      Validator
     |                 |                |
     +-----------------+----------------+
                       |
                       v
             Evidence Normalizer
                       |
             +---------+----------+
             |                    |
             v                    v
       Optional AI Review    Job Relevance Adapter
       (bounded context)     (existing ATS/Job Analyzer)
             |                    |
             +----------+---------+
                        |
                        v
              Finding Aggregator
                        |
                        v
            Score + Findings + Actions
                        |
                        v
                User Review UI
                        |
                 Accepted diffs only
                        |
                        v
                Resume Versioning
~~~

### NestJS module proposal

~~~text
src/
  resume-review/
    resume-review.module.ts
    resume-review.controller.ts
    resume-review.service.ts
    orchestrator/
    rules/
      content/
      grammar/
      consistency/
      structure/
      readability/
      links/
      layout/
    evidence/
    scoring/
    ai-review/
    recruiter-lens/
    job-relevance-adapter/
    findings/
    suggestions/
    policy/
    dto/
    tests/
~~~

Keep review orchestration separate from the existing ATS scoring module. Reuse its normalized job requirements and evidence where needed; do not duplicate its scoring implementation.

## 5. Review dimensions and checks

### 5.1 Writing and language quality
- Spelling, grammar, punctuation and capitalization.
- Repeated words and phrases.
- Weak, vague or repetitive action verbs.
- Unclear pronouns, jargon and unexplained abbreviations.
- Long or difficult-to-scan sentences and bullets.
- Tense consistency: present tense for current responsibilities where appropriate, past tense for completed roles.
- Tone and professional wording without erasing the user's voice.
- Locale-aware spelling; do not treat valid regional English as an error.

### 5.2 Content strength and evidence
- Generic summary with no supported specialization or value proposition.
- Responsibilities listed without outcomes or context.
- Bullets that are vague, overly long or duplicate one another.
- Unsupported superlatives and unsubstantiated claims.
- Missing context such as scale, scope, tools or business outcome where the source profile contains evidence.
- Metrics that appear inconsistent or lack context; flag for confirmation rather than changing them.
- Skills listed without supporting evidence in experience, projects or education.
- Acronyms or technical terms that may be unclear to a general reviewer.

### 5.3 Structure and completeness
- Missing or unusually sparse relevant sections.
- Inconsistent section headings and ordering.
- Duplicate sections, duplicate bullets or repeated content.
- Unclear chronology and unexplained date gaps (flag neutrally; never assume a gap is negative).
- Inconsistent date formats, overlapping employment dates or impossible chronology.
- Contact information and professional links missing or malformed, where relevant.
- Education, certification and project details missing only when expected for the user's selected career stage or target role.

### 5.4 Consistency and credibility
- Job title, employer, location and date formatting inconsistencies.
- Different date ranges for the same role across resume versions.
- Conflicting skill levels or claims within the document.
- Inconsistent capitalization of product names, technologies and acronyms.
- Claims in generated text that cannot be traced to approved profile facts.
- Potentially sensitive personal data that is unnecessary for the selected region or role; warn without silently deleting it.

### 5.5 Readability and recruiter scanability
- Summary clarity and relevance.
- Clear role, organization and date hierarchy.
- Appropriate information density and whitespace.
- Bullet length and visual grouping.
- Important information buried too far down.
- Excessive repetition or low-value filler.
- Whether a reviewer can quickly identify role, seniority, core skills and recent relevant experience.

Do not hard-code a single universal ideal page count. Guidance depends on career stage, region, role, industry and the user's selected format.

### 5.6 ATS and technical document checks
- Text extraction sanity check for exported PDF/DOCX.
- Reading order and section heading recognition.
- Unusual columns, text boxes, tables, icons or graphics that may reduce parser reliability.
- Broken or malformed hyperlinks.
- Font embedding, clipping, overflow, missing glyphs and page-boundary issues.
- Image-only/scanned output without a usable text layer.
- Header/footer content that may be missed by parsers.

These are compatibility signals, not a guarantee of compatibility with a specific ATS vendor.

### 5.7 Job relevance (optional)
- Required and preferred skills supported by evidence.
- Relevant experience and achievements surfaced clearly.
- Job language that is absent despite evidence in the profile.
- Important requirements that have no supporting evidence.
- Irrelevant or distracting content relative to the target role.

Reuse the ATS engine's exact/related/missing distinctions. Never recommend inserting a keyword unless the user has supporting experience or confirms it is accurate.

## 6. Finding model

Each finding should have a stable, machine-readable shape:

~~~json
{
  "id": "finding-id",
  "ruleId": "CONTENT.WEAK_BULLET",
  "ruleVersion": "1.0.0",
  "category": "content",
  "severity": "warning",
  "title": "This bullet describes activity but not its outcome",
  "explanation": "The statement explains what was done but does not show the result or scope.",
  "evidence": {
    "section": "experience",
    "itemId": "experience-item-id",
    "field": "bullets",
    "text": "Managed database migration activities."
  },
  "recommendation": "Add scale, responsibility or outcome if you can verify it.",
  "suggestion": null,
  "confidence": 0.94,
  "source": "deterministic_rule",
  "requiresUserConfirmation": true
}
~~~

Allowed severity values: `critical`, `warning`, `suggestion`, `info`.

Allowed sources: `deterministic_rule`, `render_validator`, `ai_assisted`, `job_match_adapter`.

Evidence references should use structured section/item/field IDs and optional text offsets. Avoid storing full document text inside analytics or long-lived review logs.

## 7. Scoring model

Keep **Resume Quality Score** separate from **Job Match / ATS Score**.

Initial quality score dimensions (weights are configurable and must be calibrated with test data):

| Dimension | Initial weight |
|---|---:|
| Writing and language | 20% |
| Content strength and evidence | 25% |
| Structure and completeness | 15% |
| Consistency and credibility | 15% |
| Readability and scanability | 15% |
| Technical / export quality | 10% |

Scoring requirements:
- Normalize each dimension to 0–100.
- Exclude dimensions that cannot be evaluated and renormalize remaining weights; disclose incomplete coverage.
- Critical defects can trigger a visible readiness warning even if the numeric score is high.
- Show dimension scores, findings and score-change explanations.
- Never imply scientific precision or guarantee recruiter outcomes.
- Version the scoring configuration and preserve the version used for each report.
- Do not compare scores across different scoring versions without a migration/recalculation policy.

Suggested UI labels: **Quality score**, **Job match**, and **Export readiness**. Avoid a single opaque “ATS pass” badge.

## 8. AI review design and guardrails

AI is optional and should run only after deterministic checks identify relevant context.

### AI may
- Suggest clearer phrasing while preserving meaning.
- Explain why a bullet may be difficult to understand.
- Identify possible repetition or generic language.
- Provide a recruiter-style critique based on explicit role/seniority context.
- Offer alternative summaries grounded in approved profile facts.
- Ask the user for missing context instead of fabricating it.

### AI must not
- Invent numbers, percentages, savings, revenue, team size or business impact.
- Add skills, certifications, employers, degrees, titles or dates not present in approved facts.
- Infer protected characteristics, age, health, family status or other sensitive traits.
- Penalize career gaps, nontraditional backgrounds, career breaks or employment status.
- Make hiring decisions, predict protected-trait suitability or claim to know a recruiter's actual decision.
- Rewrite or apply changes without user approval.

### Context minimization
- Send only the relevant excerpt and the minimum context needed for the requested review.
- Remove contact details and unrelated personal identifiers before AI processing where feasible.
- Do not send the full career profile for a single-bullet rewrite.
- Apply provider retention controls where available and disclose AI processing to the user.
- Do not log prompts, raw resume text or AI responses in ordinary application logs.
- Provide deterministic review when AI consent is declined or the provider is unavailable.

## 9. User experience

Provide a dedicated **Review** panel/route, not an extension of the dashboard.

Recommended layout:
- Header with Quality Score, Job Match (only when a job is selected), and Export Readiness.
- Dimension summary with clear coverage indicators.
- Filterable findings list by severity/category.
- Selecting a finding highlights the exact text/section in the resume preview/editor.
- Finding detail shows why it matters, evidence, confidence and a practical recommendation.
- Actions: Accept suggestion, Edit suggestion, Dismiss, Ignore this rule for this resume.
- Batch actions may apply only low-risk formatting corrections after explicit confirmation.
- High-impact content changes always require individual review.
- Re-run review after accepted edits and show what improved, remained or regressed.
- Allow the user to export without reaching an arbitrary score threshold; show warnings, not a forced gate.

Keep accessibility in scope: keyboard-operable findings, meaningful focus handling, screen-reader announcements and no severity conveyed by color alone.

## 10. Data and persistence

Persist only what is useful and disclosed:
- Review report metadata: resume/version ID, review mode, score dimensions, rule/scoring version, timestamps and status.
- Findings metadata and structured evidence references, subject to a configurable retention policy.
- User decisions on suggestions, if needed for undo/history.
- Aggregated, privacy-safe product metrics.

Do not persist:
- Uploaded source document bytes.
- Generated PDF/DOCX/HTML/XLSX files.
- Full resume text copied into analytics or telemetry.
- Raw prompts/responses in ordinary logs.
- Arbitrary local file paths or device folder contents.

The resume's structured content remains under the existing account data policy. Individual document files remain local-only as defined in [18-LOCAL-STORAGE-DESIGN.md](./18-LOCAL-STORAGE-DESIGN.md). Users must be able to delete review history and associated retained evidence according to the retention policy.

## 11. API proposal

All endpoints require authenticated identity and user/tenant ownership checks.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /resumes/:id/reviews | Start general or job-specific review |
| GET | /resumes/:id/reviews | List authorized review report metadata |
| GET | /resume-reviews/:reviewId | Get report, scores and findings |
| POST | /resume-reviews/:reviewId/recheck | Re-run review against the current resume version |
| POST | /resume-reviews/:reviewId/findings/:findingId/decision | Accept, dismiss or ignore a finding |
| POST | /resume-reviews/:reviewId/suggestions/:suggestionId/apply | Apply an approved structured diff |
| DELETE | /resume-reviews/:reviewId | Delete review history subject to retention rules |

Example request:

~~~json
{
  "mode": "job_specific",
  "jobAnalysisId": "authorized-job-analysis-id",
  "includeAiReview": true,
  "locale": "en-IN"
}
~~~

Example response envelope:

~~~json
{
  "reviewId": "review-id",
  "resumeVersionId": "resume-version-id",
  "status": "completed",
  "score": {
    "quality": 82,
    "coverage": "complete",
    "scoringVersion": "1.0.0"
  },
  "dimensions": [],
  "findings": [],
  "summary": {
    "critical": 0,
    "warning": 3,
    "suggestion": 5,
    "info": 2
  }
}
~~~

Implementation notes:
- Validate that the resume and optional job analysis belong to the authenticated user/tenant.
- Use idempotency keys for review creation/rechecks where appropriate.
- Return 202 for asynchronous reviews and expose status polling if processing exceeds the synchronous budget.
- Apply rate limits and per-user AI quotas.
- Applying a suggestion creates a new structured resume version or auditable version change; never mutate a local file on the server.
- Avoid returning a permanent document URL.

## 12. Performance, reliability and cost

- Run deterministic checks in-process on normalized structured content.
- Cache only safe, version-keyed intermediate results; invalidate when resume content, template or rule version changes.
- Use bounded concurrency for export parsing and AI calls.
- Batch compatible AI feedback requests, but keep evidence pointers per finding.
- Set strict input, token, page-count and execution-time limits.
- Support cancellation and mark partial reports clearly.
- Prioritize deterministic findings first so users receive value even if AI review is delayed.
- Use background jobs only for reviews that exceed request latency targets.
- Track latency, failure rates, AI token usage and rule hit rates without collecting resume content.

## 13. Rule governance and fairness

- Store rules as versioned, testable definitions; avoid embedding all logic in controller/service methods.
- Every rule needs a description, rationale, severity, applicability conditions, test fixtures and false-positive notes.
- Allow locale, industry, career-stage and target-role context where justified.
- Do not treat one cultural writing style, regional English variant, career path or resume convention as universal.
- Regularly review false positives and user dismissal rates.
- Keep an explicit exclusion list for protected or sensitive attributes.
- Do not train or tune models on user resumes without separate, explicit consent.

## 14. Testing and acceptance criteria

### Unit and integration tests
- Each deterministic rule has positive, negative, boundary and false-positive fixtures.
- Dates, chronology, duplicate content, links, Unicode, regional spelling and multilingual text are tested.
- AI suggestions are checked against source evidence and must not introduce unsupported facts.
- Ownership, tenant isolation, authorization, rate limits and deletion are tested.
- Failure, timeout and cancellation paths leave no uploaded document bytes behind.
- Rule/scoring version changes are reproducible.

### Export and parser tests
- Generate PDF/DOCX fixtures and extract text using independent parsers.
- Validate reading order, headings, links, page count, clipping, missing glyphs and overflow.
- Test one-column and multi-column templates separately.
- Compare preview and export render models for consistency.
- Run a parser round-trip suite against the supported template catalogue.

### Product acceptance criteria
- Every finding includes an understandable reason and traceable evidence.
- Users can dismiss or accept suggestions individually.
- No suggestion is silently applied.
- No score is represented as a hiring guarantee or actual ATS vendor result.
- General review works without a job description.
- Job-specific review reuses the existing Job Analyzer/ATS output.
- Review remains useful with AI disabled.
- Review/export can proceed without permanently storing document files.
- Users can remove review history under the configured retention policy.

## 15. Delivery plan

| Phase | Scope |
|---|---|
| 1 — Foundation | Finding schema, deterministic rules, rule versioning, basic quality dimensions and report API |
| 2 — Content review | Writing, evidence, structure, consistency and readability checks |
| 3 — Export validation | PDF/DOCX extraction, layout validation, parser round-trip and export readiness |
| 4 — Job-aware review | Adapter to existing Job Analyzer/ATS; role-specific relevance findings |
| 5 — AI assistance | Optional excerpt-based critique and grounded rewrite suggestions with user approval |
| 6 — Calibration | Locale/industry fixtures, false-positive analysis, fairness review and scoring calibration |

## 16. Related documents

- [03-FUNCTIONAL-MODULES.md](./03-FUNCTIONAL-MODULES.md)
- [05-API-DESIGN.md](./05-API-DESIGN.md)
- [06-AI-ARCHITECTURE.md](./06-AI-ARCHITECTURE.md)
- [07-ATS-ENGINE.md](./07-ATS-ENGINE.md)
- [08-EXPORT-ENGINE.md](./08-EXPORT-ENGINE.md)
- [10-SECURITY-PRIVACY.md](./10-SECURITY-PRIVACY.md)
- [17-PREVIEW-DESIGN.md](./17-PREVIEW-DESIGN.md)
- [18-LOCAL-STORAGE-DESIGN.md](./18-LOCAL-STORAGE-DESIGN.md)
