# 27 — Resume Truth Verification and Evidence Provenance

## 1. Purpose
Ensure every resume statement is traceable to a candidate-provided or candidate-confirmed fact. This is a trust and safety layer across profile import, AI rewriting, job tailoring, recruiter view and interview preparation. It does not claim to verify a person's real-world employment or credentials unless a separate authorized verification provider is integrated.

## 2. Core contract
AI may transform language, organize evidence and ask questions. It may not create factual claims. No generated content is written into the canonical profile or resume until the user reviews and accepts it. A claim can be linguistically improved while retaining the same factual meaning; any semantic expansion requires confirmation.

## 3. Claim model
Represent content as atomic claims linked to evidence.

| Field | Description |
|---|---|
| claimId | Stable identifier within a resume version |
| text | Candidate-facing statement |
| claimType | responsibility, achievement, skill, credential, date, title, scope, outcome |
| evidenceRefs | CareerFact / Achievement / Project IDs |
| provenance | user_entered, imported, ai_rewrite, external_verified |
| verificationState | confirmed_by_user, extracted_unconfirmed, unsupported, disputed, externally_verified |
| confidence | Confidence of extraction/mapping, not truth probability |
| transformation | Original text, proposed text and change rationale |
| policyVersion | Verification rules version |

Do not use a single confidence score as proof. External verification is only allowed when a trusted provider returns a verifiable result and the user has consented.

## 4. Processing pipeline
1. Split candidate content into atomic claims.
2. Map each claim to structured source facts.
3. Classify support: direct, partial, ambiguous, absent, contradictory.
4. Detect newly introduced entities, numbers, dates, credentials, skills and causal outcomes.
5. Reject unsupported expansions or request user clarification.
6. Show a before/after diff with supporting evidence.
7. Require explicit user acceptance.
8. Persist accepted content as a new resume version with provenance links.

If the model returns malformed data, unsupported claim types or references outside the supplied context, fail closed and preserve the original content.

## 5. Rules
- Never invent metrics, percentages, revenue, savings, scale, team size or performance outcomes.
- Never upgrade “participated in” to “led” without evidence.
- Never convert exposure to proficiency or a skill mention into demonstrated experience.
- Never infer degree completion, certification validity, employment dates or job titles.
- Do not infer age, health, family status, disability, religion, race, gender, nationality or other protected/sensitive attributes.
- Preserve uncertainty and user wording where evidence is incomplete.
- If the user asks for a stronger bullet but evidence is weak, ask for actual context rather than embellish.
- Mark outdated claims for review; do not silently remove them.

## 6. UX
Each suggested sentence shows: proposed wording, source evidence, what changed, unsupported details (if any), and actions Accept / Edit / Reject / Ask me. Provide a “why flagged” explanation. Batch acceptance is allowed only for low-risk formatting or grammar changes that cannot change meaning; factual claims require individual confirmation.

## 7. Integration points
- Career Intelligence provides canonical facts and provenance.
- Resume Builder stores claim references per resume version.
- JD tailoring may reorder/emphasize evidence but cannot manufacture missing skills.
- Resume Quality Review consumes verification findings.
- Recruiter View exposes only the approved resume projection.
- Interview Assistant uses the exact resume version and its confirmed evidence.
- Analytics stores aggregate rule counts only, never claim text.

## 8. API contracts
- POST /v1/resumes/:resumeId/claims/analyze
- POST /v1/resumes/:resumeId/suggestions/validate
- POST /v1/resumes/:resumeId/suggestions/:suggestionId/decision
- GET /v1/resumes/:resumeId/claims
- GET /v1/resume-claims/:claimId/evidence

Responses include claim IDs, evidence references, support status, policy version and a structured diff. Do not expose internal prompts or provider secrets.

## 9. Security and adversarial handling
Treat uploaded resumes, job descriptions, URLs and pasted text as untrusted data. They cannot override system policy or request secrets. Strip active content from files, validate MIME by content, limit size/pages/time, sandbox parsers and clean temporary bytes on every exit path. Prevent IDOR by verifying ownership of every resume, fact and evidence reference.

## 10. Evaluation
Maintain a versioned benchmark with unsupported metrics, role inflation, ambiguous skills, conflicting dates, prompt injection, copied JD instructions, multilingual content and valid paraphrases. Measure unsupported-claim rate, false-positive rate, evidence-link precision, user correction rate and latency. Release a model/prompt only after it passes all critical factuality gates.

## 11. Acceptance criteria
No unsupported factual expansion can be silently saved. Every accepted AI rewrite has an auditable source mapping. User edits remain possible when AI is unavailable. Deleting a source fact invalidates dependent suggestions/reports or marks them for review. The product never markets this as real-world background verification.
