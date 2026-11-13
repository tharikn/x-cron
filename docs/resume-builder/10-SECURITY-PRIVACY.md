# 10 — Security and Privacy

## 1. Data classification

Career profiles and resumes contain personal information and must be treated as sensitive user data. Limit access to the minimum required for the feature and user action.

## 2. Authentication and authorization

- Integrate with the host identity provider; do not build a second mandatory login.
- Validate token signature, issuer, audience, expiry and relevant claims.
- Enforce user and tenant ownership at every read/write boundary.
- Use service-to-service credentials for trusted backend integrations.
- Never trust userId or tenantId supplied only in request body/query.
- Apply least-privilege database and service permissions.

## 3. API security

- DTO validation and strict allowlists.
- Request body, text length, file size and page-count limits.
- Rate limits for authentication-sensitive, parser, AI and export endpoints.
- CORS allowlist and secure transport.
- Safe error messages; no stack traces or secrets in production.
- Idempotency and abuse controls for expensive operations.
- Dependency scanning and regular patching.

## 4. File and parser security

- Allow only required formats and validate actual file signatures, not only extension/MIME.
- Set strict size, page and decompression limits.
- Parse in an isolated process/container where practical.
- Reject encrypted, malformed or suspicious documents.
- Do not execute macros, scripts, embedded objects or active content.
- Delete temporary upload files according to retention policy.

## 5. AI security

- Treat uploaded files and job descriptions as untrusted input.
- Protect against prompt injection and data exfiltration attempts.
- Do not expose system prompts, API keys or internal data to the model.
- Send minimum necessary context.
- Validate AI output against schemas and business rules.
- Sanitize content before rendering.
- Require user approval before AI suggestions become confirmed facts.

## 6. Web and export security

- Escape user content in HTML.
- Use a restrictive Content Security Policy where applicable.
- Do not inject raw AI HTML.
- Prevent spreadsheet formula injection in XLSX.
- Generate safe filenames.
- Protect temporary export URLs with short expiry and authorization.
- Do not expose permanent public links to personal documents.

## 7. Privacy and retention

- Do not store generated exports by default.
- Keep temporary upload/export artifacts only as long as necessary.
- Define retention for job analysis, ATS reports, AI metadata and resume versions.
- Support user data export and deletion.
- Avoid logging resume text, contact details or full job-search history.
- Do not use identifiable career data for model training without a separate explicit lawful consent process.
- Disclose when external AI providers process user-submitted text.

## 8. Audit and observability

Log security-relevant events such as access denial, suspicious upload rejection, account deletion and administrative access. Logs should contain IDs and event metadata, not full resume content or secrets.

## 9. Threat scenarios to test

- Cross-user and cross-tenant IDOR.
- Malicious PDF/DOCX and decompression bombs.
- Prompt injection in resume/JD content.
- XSS through profile fields and imported documents.
- Spreadsheet formula injection.
- Replayed/expired export links.
- Excessive AI/export usage and denial of service.
- Accidental PII exposure in logs, traces or analytics.
