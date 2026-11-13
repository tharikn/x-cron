# 32 — Resume-Grounded Interview Assistant

## 1. Purpose
Prepare candidates for interviews using the exact resume version and target job context they choose. The assistant generates practice questions, facilitates mock sessions and gives actionable feedback without inventing candidate experience or claiming to predict an employer's interview.

## 2. Modes
- Resume walkthrough: questions about the candidate's stated projects, roles and achievements.
- Job-specific practice: questions derived from confirmed job requirements.
- Technical practice: configurable topic and difficulty, clearly separated from claims about candidate experience.
- Behavioral practice: structured STAR practice using user-provided examples.
- Mock interview: turn-based session with user-controlled duration and feedback timing.
- Answer review: clarity, relevance, structure, completeness and evidence alignment.

## 3. Grounding
Every resume-specific question references a resumeVersionId and one or more claim/evidence IDs. If the resume contains no evidence for a topic, ask a general knowledge question or ask the candidate to provide an example; never imply they performed work not documented. User may add a private practice story without automatically adding it to the resume.

## 4. Session model
InterviewSession: id, subjectId, tenantId, resumeVersionId, jobAnalysisId, mode, locale, status, startedAt, endedAt, retentionPolicyVersion.
InterviewTurn: sessionId, sequence, questionType, questionText, answerText, feedback, evidenceRefs, model/prompt version.
Keep session data private. Do not use recordings by default. Audio/video, if added later, requires separate explicit consent, clear retention, deletion and vendor disclosures.

## 5. Feedback rubric
Provide separate dimensions: relevance, structure, clarity, specificity, technical correctness (only where a reliable rubric exists), and evidence alignment. Feedback is coaching, not a pass/fail hiring score. Avoid evaluating accent, voice, appearance, disability, emotion or other sensitive/protected characteristics. Do not infer personality or mental health.

## 6. AI and safety
Use bounded context from the selected resume version and confirmed JD requirements. Treat user answers and JD text as untrusted content. Validate structured model output. AI provider outage must preserve session and allow text practice with fallback prompts. Do not train models on sessions without separate explicit consent.

## 7. APIs
- POST /v1/interview-sessions
- GET /v1/interview-sessions/:id
- POST /v1/interview-sessions/:id/turns
- POST /v1/interview-sessions/:id/feedback
- POST /v1/interview-sessions/:id/complete
- DELETE /v1/interview-sessions/:id

Enforce ownership, quotas, input limits, idempotency and retention policy. Do not log answers or raw prompts.

## 8. Acceptance criteria
Questions are grounded in selected versions or clearly labelled general practice. Feedback is actionable and non-discriminatory. Session state survives recoverable failures. User can delete history. No hiring prediction or guaranteed interview outcome is claimed.
