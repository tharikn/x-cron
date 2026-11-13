# 34 — External Integration SDK and Webhooks

## 1. Purpose
Expose Resume & Career Intelligence as a reusable capability for X Cron Jobs and authorized third-party job, education or career platforms. Keep the initial product a modular NestJS application with a stable API; do not split every domain into a microservice prematurely.

## 2. Integration tiers
- Browser/mobile client: user access token, user-scoped APIs, PKCE for OAuth clients.
- Trusted backend: OAuth2 client credentials or signed service identity plus delegated user authorization.
- Webhooks: signed outbound events with replay protection.
- SDKs: generated from the OpenAPI contract; TypeScript first, other languages when demanded.

## 3. API governance
Use /v1 and OpenAPI as the source of truth. Define request/response schemas, error codes, pagination, idempotency, rate limits, compatibility policy and deprecation windows. Use stable external IDs and never expose internal database IDs as authorization tokens. Avoid generic “update any field” endpoints.

## 4. Authentication and authorization
Validate issuer, audience, expiry, tenant, scopes and subject. Separate application identity from end-user identity. Service credentials cannot access a user's career data without a delegated grant. Scopes are least-privilege, for example career-profile:read, resume:read, resume:write, job-analysis:create, match:create, recruiter-share:create. Enforce object-level ownership in every handler.

## 5. Webhook delivery
Use transactional outbox. Events are versioned and contain eventId, eventType, occurredAt, tenantId, aggregateId and minimal metadata. Sign payloads with rotating secrets, include timestamp, reject stale/replayed signatures, retry with exponential backoff and jitter, and dead-letter repeated failures. Consumers deduplicate by eventId. Provide delivery logs without sensitive payload content.

## 6. Security
Validate callback URLs and block private/loopback/link-local destinations. Apply SSRF protections, DNS rebinding defenses, redirect caps and response-size/time limits to URL ingestion. Use CORS allowlists, CSRF protection for cookie-authenticated browser clients, quotas, abuse detection and secret rotation. Never place secrets in query strings or client bundles.

## 7. SDK design
Generate typed clients from OpenAPI. SDKs must support cancellation, retries only for safe/idempotent operations, request IDs, typed errors and configurable timeouts. Do not embed tenant secrets. Include examples for authentication, profile consent, job analysis, match creation and webhook verification.

## 8. Observability
Expose request ID, integration ID, latency, status, quota and error category. Do not log resume text, JD body, tokens, contact details or prompt contents. Provide integration health and webhook delivery metrics.

## 9. Acceptance criteria
A new client can integrate using public contracts without direct database access. Delegated user consent is mandatory for personal data. Webhooks are signed and idempotent. API changes are versioned and documented. Integration failures do not break manual resume workflows.
