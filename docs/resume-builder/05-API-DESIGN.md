# 05 — API Design

## 1. Conventions

Base path: `/api/v1`.

- JSON request/response unless a file upload or export stream is required.
- Bearer token or trusted service identity from the host authentication system.
- Every request is scoped to an authenticated user and tenant.
- Validate DTOs, content length and file type.
- Return a correlation ID and consistent error envelope.
- Do not accept userId/tenantId as trusted authorization claims from arbitrary request bodies.

Example error:
```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "The request is invalid",
  "correlationId": "request-id",
  "details": []
}
```

## 2. Career profile

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /career-profile | Get current user's profile |
| PUT | /career-profile | Create/update profile |
| PATCH | /career-profile/sections/:section | Update a section |
| GET | /career-profile/completeness | Return completeness hints |
| DELETE | /career-profile | Delete profile, subject to confirmation/policy |

## 3. Resume management

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /resumes | List user's resumes |
| POST | /resumes | Create resume definition |
| GET | /resumes/:id | Get resume |
| PATCH | /resumes/:id | Update name/configuration |
| DELETE | /resumes/:id | Delete resume |
| POST | /resumes/:id/versions | Create a version/snapshot |
| GET | /resumes/:id/versions | List version metadata |
| GET | /resumes/:id/preview | Return render model or preview HTML |

## 4. Import and generation

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /resume-imports | Upload PDF/DOCX for parsing |
| GET | /resume-imports/:id | Get parse result/status |
| POST | /role-generation | Generate reviewable structure from text |
| POST | /resumes/:id/suggestions | Generate suggestions for selected resume |

Use bounded upload size and asynchronous processing only when required.

## 5. Job analysis and ATS

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /job-analyses | Analyze a job description |
| GET | /job-analyses/:id | Get normalized requirements |
| POST | /ats/reports | Calculate ATS/match report |
| GET | /ats/reports/:id | Get report |
| POST | /resumes/:id/optimize | Generate reviewable optimization suggestions |

Example ATS request:
```json
{
  "resumeId": "uuid",
  "jobAnalysisId": "uuid"
}
```

Example response:
```json
{
  "reportId": "uuid",
  "score": 78,
  "engineVersion": "1.0",
  "breakdown": [
    { "key": "required_skills", "score": 82, "weight": 20, "evidence": ["Angular", "REST APIs"] }
  ],
  "gaps": ["No evidence found for Kubernetes"],
  "recommendations": ["Add relevant Kubernetes experience only if you have it"]
}
```

Scores in examples are illustrative, not a promise of external ATS results.

## 6. Export

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /resumes/:id/export/pdf | Generate PDF |
| POST | /resumes/:id/export/html | Generate HTML |
| POST | /resumes/:id/export/xlsx | Export structured career workbook |
| POST | /resumes/:id/export/docx | Generate DOCX |
| POST | /integrations/google-docs | Optional Google Docs creation |

Export request may include versionId, templateVersion, locale and page settings. Export responses should stream bytes or return a short-lived, one-time retrieval token. Do not persist files by default.

## 7. Templates

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /templates | List available templates |
| GET | /templates/:id | Get template metadata |
| GET | /templates/:id/versions/:version | Get compatible version metadata |

Do not expose executable template code to untrusted clients.

## 8. Host job portal integration

Recommended service-to-service endpoint or API call passes:
- external job ID (optional)
- job title
- full job description
- location/work mode (optional)
- source/tenant context

Do not allow an arbitrary externalJobId to grant access to portal data. Authenticate and authorize retrieval at the host boundary.

## 9. Idempotency and limits

- Use an Idempotency-Key for expensive generation/export operations when retry duplication is possible.
- Rate-limit AI and file endpoints separately from CRUD.
- Limit job description and free-text lengths.
- Define upload size, page count and processing time limits.
- Return 429 with retry guidance when throttled.
