# 30 — Job Portal and Application Intelligence Integration

## 1. Purpose
Connect job discovery to resume selection, job-specific tailoring and application tracking without coupling the Resume service to X Cron Jobs database tables. The Resume service remains reusable by other authorized platforms.

## 2. Integration boundary
Use a versioned API contract and an anti-corruption adapter. X Cron sends a normalized job payload or a stable authorized job reference. Resume service does not query the job portal's database. External clients use the same contract and tenant-scoped authorization.

Normalized JobContext: externalJobId, source, title, employer, description or normalized requirements, location, employmentType, publishedAt, sourceUrl, locale, tenantId and consent/retention metadata. Avoid copying unnecessary employer/user data.

## 3. Candidate journey
1. Candidate opens a job listing.
2. Client requests analysis for that job.
3. Analyzer extracts requirements and presents them for confirmation.
4. Candidate chooses an existing resume version.
5. Matching maps each requirement to evidence.
6. Tailoring proposes reorder/wording changes only from approved facts.
7. Candidate reviews a diff and creates a new resume version.
8. Candidate exports locally or continues the application.
9. Application system records the exact submitted resume and cover-letter version.
10. Candidate tracks application status and optional interview notes.

No automatic application submission in the initial scope. Never bypass board access controls, CAPTCHA, login walls or terms. Public URL retrieval is best-effort; paste-in JD and normalized partner payload are reliable paths.

## 4. Integration API
- POST /v1/integrations/jobs/analyze
- POST /v1/job-contexts (authorized normalized job)
- GET /v1/job-contexts/:id/analysis
- POST /v1/job-contexts/:id/matches
- POST /v1/job-contexts/:id/tailoring-proposals
- POST /v1/job-contexts/:id/applications (reference only; host owns application workflow)
- POST /v1/webhooks/subscriptions

Use OAuth2 client credentials or signed service-to-service tokens for platform integrations, scoped to jobs:analyze, matches:create and resume:read-minimal. User authorization is still required to access candidate resumes. Validate issuer, audience, expiry, tenant, scopes and subject delegation. Use idempotency keys and rate limits.

## 5. Events and webhooks
Versioned events: job.analysis.completed, resume.match.completed, resume.tailoring.proposed, resume.version.created, application.resume.bound. Use transactional outbox, at-least-once delivery, signature verification, replay protection, retries with backoff and dead-letter handling. Events contain IDs and minimal status only; do not send resume text, contact details or raw JD by default.

## 6. Application tracking ownership
The host job portal owns application status, employer workflow and job lifecycle. Resume service may store an external application reference and exact resumeVersionId for traceability, but it must not become a second source of truth for job application status. Candidate can disconnect integration and revoke scopes.

## 7. Security and privacy
Enforce per-user consent and tenant access on every resume operation. A service token alone must not grant access to a candidate's profile. Use delegated user context, least privilege, field-level projections, audit logs without sensitive content, retention limits and deletion propagation. Validate callback URLs to prevent SSRF; outbound fetches must use allowlists, DNS/IP checks, redirect limits and private-network blocking.

## 8. Acceptance criteria
- Resume service works independently of X Cron Jobs schema.
- Job payloads are normalized and versioned.
- User confirms extracted requirements and proposed resume changes.
- Exact resume version is bound to each application.
- Host platform remains source of truth for job/application state.
- Webhooks are signed, idempotent and replay-protected.
- Unauthorized tenant or user access is rejected.
- No scraping or auto-apply bypass is required for core functionality.
