# 10 — Security and Privacy

## 1. Data classification
Career profiles and structured resume data contain personal information and must be treated as sensitive user data. Individual resume document files are local-device assets and must not be permanently stored on the service.

## 2. Authentication and authorization
- Integrate with X Cron identity; authentication is mandatory before any Resume Builder screen/API.
- Guest and anonymous access are not supported.
- Validate token signature, issuer, audience, expiry and relevant claims.
- Enforce user and tenant ownership at every read/write boundary.
- Use service-to-service credentials for trusted backend integrations.
- Never trust userId or tenantId supplied only in request body/query.
- Apply least-privilege database and service permissions.

## 3. API security
- DTO validation and strict allowlists.
- Request body, text length, file size and page-count limits.
- Rate limits for parser, AI and export endpoints.
- CORS allowlist and secure transport.
- Safe error messages; no stack traces or secrets in production.
- Idempotency and abuse controls for expensive operations.
- Dependency scanning and regular patching.

## 4. File and parser security
- Individual generated resume files must be saved to the user's local device folder only.
- Never permanently store generated PDF/DOCX/HTML/XLSX files or uploaded source documents on server, object storage or database blobs.
- Allow only required formats and validate actual file signatures, not only extension/MIME.
- Set strict size, page and decompression limits.
- Parse in an isolated process/container where practical.
- Reject encrypted, malformed or suspicious documents.
- Do not execute macros, scripts, embedded objects or active content.
- Delete temporary upload bytes immediately after parsing, including errors, timeout and cancellation.
- If temporary export artifacts are unavoidable, encrypt and delete immediately after delivery; prefer streaming.

## 5. AI security
- Treat uploaded files and job descriptions as untrusted input.
- Protect against prompt injection and data exfiltration attempts.
- Send minimum necessary context.
- Validate AI output against schemas/business rules and sanitize before rendering.
- Require user approval before AI suggestions become confirmed facts.

## 6. Web and export security
- Escape user content in HTML and apply CSP.
- Do not inject raw AI HTML.
- Prevent spreadsheet formula injection.
- Generate safe filenames and prevent path traversal.
- Do not expose permanent public links to personal documents.
- Client filesystem writes must use platform permission APIs and confirm success.

## 7. Privacy and retention
- Backend may store approved structured career data and metadata according to disclosed product behavior.
- Do not store individual document binaries or permanent source-file copies.
- Keep temporary processing artifacts only for the minimum time and delete them on all paths.
- Define retention for job analysis, ATS reports, AI metadata and structured resume versions.
- Support user data export and deletion.
- Avoid logging resume text, contact details, local paths, file bytes or full job descriptions.
- Do not use identifiable career data for model training without separate explicit lawful consent.
- Disclose when external AI providers process user-submitted text.

## 8. Audit and observability
Log security-relevant events such as access denial, suspicious upload rejection, account deletion and administrative access. Logs should contain IDs and event metadata, not resume content, local paths or secrets.

## 9. Threat scenarios
- Unauthenticated access and cross-user/tenant IDOR.
- Malicious PDF/DOCX and decompression bombs.
- Prompt injection in resume/JD content.
- XSS through profile fields/imported documents.
- Spreadsheet formula injection.
- Path traversal and unsafe local filenames.
- Accidental PII exposure in logs, traces or analytics.
