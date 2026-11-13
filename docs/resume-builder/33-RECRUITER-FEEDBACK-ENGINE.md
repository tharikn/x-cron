# 33 — Consent-Based Recruiter Feedback

## 1. Purpose
Allow a candidate to optionally share a specific resume version with a recruiter and receive structured feedback. This is not a public resume directory, a hiring decision engine or permission to edit the candidate's master profile.

## 2. Sharing model
Default is private. Candidate creates a share grant bound to:
- exact resumeVersionId
- recipient identity or one-time secure invitation
- permitted actions: view, submit feedback
- expiry and revocation time
- contact visibility policy
- optional job context
- audit metadata

Use opaque high-entropy tokens stored hashed at rest. Apply expiry, rate limits, revocation, access logging and anti-enumeration controls. Do not expose a permanent public URL by default.

## 3. Recruiter projection
Expose only approved fields from the selected resume version. Candidate can hide contact details, address, links or other fields. The recruiter projection is read-only. Do not reveal private career facts, other resume versions, internal scores or profile history.

## 4. Feedback schema
Feedback categories: clarity, role relevance, evidence strength, missing context, presentation and optional role-specific notes. Each feedback item has severity, explanation and optional section reference. Avoid protected-trait or demographic feedback. Recruiter identity/organization claims are not treated as verified unless independently validated.

## 5. Candidate workflow
Candidate reviews feedback, marks helpful/not helpful, and may create a proposed resume edit. All edits are candidate-owned and require candidate approval. Recruiter cannot write to career profile or resume content. Feedback does not automatically change match/quality scores; reports are rerun after an accepted edit.

## 6. APIs
- POST /v1/resume-shares
- GET /v1/resume-shares/:id
- POST /v1/resume-shares/:id/revoke
- GET /v1/shared-resumes/:token
- POST /v1/shared-resumes/:token/feedback
- GET /v1/resumes/:id/recruiter-feedback

Use separate recruiter-facing authorization from candidate authorization. Token scopes are read-only plus feedback submission. Protect against CSRF, token leakage, scraping and replay.

## 7. Retention and moderation
Candidate can revoke access at any time. Feedback retention is disclosed and deletable subject to legal requirements. Provide reporting/blocking for abusive feedback. Do not use recruiter feedback to train models without separate consent.

## 8. Acceptance criteria
No share without explicit candidate action. Share grants are scoped, expiring and revocable. Recruiters cannot mutate source data. Contact visibility is configurable. Feedback is structured, auditable and candidate-controlled.
