# 05 — API Design

## 1. Conventions and authentication
Base path: /api/v1.

**All Resume Builder APIs require authentication.** The client must obtain a valid X Cron identity token before opening the builder or calling its APIs. No guest-session, anonymous-workspace or unauthenticated resume APIs are allowed.

- Bearer token or trusted service identity from the host authentication system.
- Validate issuer, audience, signature, expiry and required claims.
- Every request is scoped to authenticated user and tenant.
- Never trust userId/tenantId from arbitrary request bodies.
- Unauthenticated requests return 401; ownership/permission failures return 403 or a non-disclosing 404.
- Google OAuth is optional for Google Docs, not Resume Builder sign-in.

## 2. Career profile
| Method | Endpoint | Purpose |
|---|---|---|
| GET | /career-profile | Get current user's profile |
| PUT | /career-profile | Create/update profile |
| PATCH | /career-profile/sections/:section | Update a section |
| GET | /career-profile/completeness | Return completeness hints |
| DELETE | /career-profile | Delete profile subject to confirmation |

## 3. Resume management
| Method | Endpoint | Purpose |
|---|---|---|
| GET | /resumes | List user's resume metadata |
| POST | /resumes | Create resume definition |
| GET | /resumes/:id | Get authorized structured resume data |
| PATCH | /resumes/:id | Update name/configuration |
| DELETE | /resumes/:id | Delete structured resume data |
| POST | /resumes/:id/versions | Create structured version/snapshot |
| GET | /resumes/:id/versions | List version metadata |
| GET | /resumes/:id/render-model | Return normalized render model |

These APIs must not upload or return permanent document files. Clearly distinguish account-backed structured resume data from local document files.

## 4. Import and generation
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /resume-imports/parse | Transiently parse a user-selected local PDF/DOCX |
| POST | /role-generation | Generate reviewable structure from text |
| POST | /resumes/:id/suggestions | Generate suggestions for selected resume |

Import requires authentication, bounded size, MIME/signature validation and malware checks. Stream or use encrypted ephemeral storage only when necessary. Do not persist original file bytes or expose a permanent file URL. Delete temporary bytes immediately after parsing, including failure/cancellation. Return structured suggestions for user review.

## 5. Job analysis and ATS
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /job-analyses | Analyze a job description |
| GET | /job-analyses/:id | Get authorized normalized requirements |
| POST | /ats/reports | Calculate ATS/match report |
| GET | /ats/reports/:id | Get report |
| POST | /resumes/:id/optimize | Generate reviewable suggestions |

## 6. Resume Parsing Test
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /resumes/:id/parsing-tests | Test a generated resume version/export |
| POST | /parsing-tests/upload | Test a user-selected local PDF/DOCX transiently |
| GET | /parsing-tests/:testId | Get authorized parsing report |
| GET | /resumes/:id/parsing-tests | List report metadata |
| DELETE | /parsing-tests/:testId | Delete report history |

Parsing test upload must use bounded transient processing and immediate cleanup. Prefer client-side parsing where practical. Do not persist document bytes or local file paths. Only calculate an accuracy score when a known structured source is available for comparison.

## 7. Recruiter View
| Method | Endpoint | Purpose |
|---|---|---|
| GET | /resumes/:id/recruiter-view | Build read-only recruiter projection |
| POST | /resumes/:id/recruiter-view/preview | Return projection with optional target-role context |
| GET | /resumes/:id/recruiter-view/annotations | Retrieve linked review annotations |

Recruiter View is private and read-only. Require resume ownership and version checks. Do not expose public sharing endpoints in the initial release.

## 8. Resume Match Score
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /job-descriptions | Create JD from pasted text and metadata |
| POST | /job-descriptions/import-url | Attempt permitted public URL retrieval |
| GET | /job-descriptions/:jobDescriptionId | Get authorized normalized JD |
| PATCH | /job-descriptions/:jobDescriptionId | Correct extracted requirements |
| POST | /resumes/:resumeId/match-reports | Calculate match against JD and resume version |
| GET | /resume-match-reports/:reportId | Get score and evidence report |
| GET | /resumes/:resumeId/match-reports | List authorized match history |
| POST | /resume-match-reports/:reportId/recalculate | Recalculate after resume/JD changes |
| DELETE | /resume-match-reports/:reportId | Delete report/history |

URL import must use safe HTTP(S) retrieval only when permitted and accessible. Block SSRF, private/internal addresses, unsafe redirects, oversized responses and unsupported content. Never bypass login, CAPTCHA, paywalls or anti-bot controls. Return explicit statuses such as imported, manual_paste_required, unsupported_source or retrieval_failed. Pasted JD must always remain available as a fallback.

Match reports are tied to an exact resume version and JD version. Every dimension must expose score, weight, matched requirements, missing/partial evidence and scoring version. Do not label the result as selection probability or an actual third-party ATS score.

## 9. Export
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /resumes/:id/export/pdf | Generate/stream PDF bytes |
| POST | /resumes/:id/export/html | Generate/stream HTML |
| POST | /resumes/:id/export/xlsx | Generate/stream workbook |
| POST | /resumes/:id/export/docx | Generate/stream DOCX |
| POST | /integrations/google-docs | Optional Google Docs creation after explicit consent |

Export responses stream bytes or use a short-lived one-time retrieval token. Never persist output in permanent server storage, object storage or database blobs. Client saves returned bytes into the local folder.

## 10. Templates and preview
| Method | Endpoint | Purpose |
|---|---|---|
| GET | /templates | List published templates with filters/categories |
| GET | /templates/:id | Get template metadata |
| GET | /templates/:id/versions/:version | Get immutable package metadata/layout/theme |
| POST | /preview/render | Render preview from authorized structured data and selected template |
| POST | /preview/validate | Validate layout and return overflow/compatibility warnings |

Preview is a separate feature/route, not a dashboard subview. Do not expose executable template code.

## 11. Resume quality and recruiter review
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /resumes/:id/reviews | Start general or job-specific review |
| GET | /resumes/:id/reviews | List authorized review report metadata |
| GET | /resume-reviews/:reviewId | Get report, scores and findings |
| POST | /resume-reviews/:reviewId/recheck | Re-run review against the current resume version |
| POST | /resume-reviews/:reviewId/findings/:findingId/decision | Accept, dismiss or ignore a finding |
| POST | /resume-reviews/:reviewId/suggestions/:suggestionId/apply | Apply an approved structured diff |
| DELETE | /resume-reviews/:reviewId | Delete review history subject to retention rules |

Review endpoints require authenticated ownership checks for the resume, report, finding, suggestion and optional job analysis. A job-specific review must reuse authorized Job Analyzer/ATS output. Suggestion application creates a structured resume version/change; it must never modify a local document file on the server. Persist report metadata and evidence references according to the disclosed retention policy, not document binaries or raw resume text in logs.

## 12. Dashboard and analytics
| Method | Endpoint | Purpose |
|---|---|---|
| GET | /dashboard/me | User's own resume summary and recent activity |
| GET | /analytics/me/usage | User's own usage aggregates |
| POST | /analytics/events | Ingest allowlisted privacy-safe events |
| GET | /admin/analytics/overview | Admin aggregate KPIs |
| GET | /admin/analytics/trends | Admin time-series metrics |
| GET | /admin/analytics/templates | Template usage statistics |
| GET | /admin/analytics/exports | Export and local-save signals |

All dashboard routes require authentication; admin analytics require explicit permission. Events must not contain resume text, contact details, job descriptions or file bytes.

## 13. Host job portal integration
Pass normalized job title, description, optional external job ID, location/work mode and source/tenant context. An externalJobId alone must never grant access to portal data.

## 14. Platform authentication and host integration

The API is deployed independently from X Cron and must not rely on X Cron internal controllers, database access or private ORM models.

- Publish an OpenAPI specification as the canonical contract and generate typed client SDKs from it.
- Support OIDC Authorization Code + PKCE where available.
- If the host identity provider cannot support OIDC directly, use a short-lived, single-use authorization-code exchange bound to issuer, subject, audience, redirect URI, nonce and expiry.
- Never pass bearer tokens, refresh tokens or long-lived credentials in URLs.
- Validate issuer, audience, signature, expiry, scopes and tenant context on every request.
- Map the stable external identity (issuer + subject) to a Resume-owned user record; email is not the identity key.
- Enforce Resume-owned object-level authorization even for requests authenticated by X Cron.
- Host job/application context must be passed as validated, minimal, authorized payloads. An external job/application ID alone never authorizes access to host data.
- Use signed, versioned webhooks for outbound events. Payloads contain IDs/status metadata only, never resume text or document binaries.
- See [39-INDEPENDENT-RESUME-PLATFORM-ARCHITECTURE.md](./39-INDEPENDENT-RESUME-PLATFORM-ARCHITECTURE.md) for the complete host handoff, client and deployment design.

## 15. Idempotency and limits
Use idempotency keys for expensive generation/export/review/match operations. Rate-limit AI, URL import and file endpoints. Limit text lengths, upload size, page count, response size and processing time. Return 429 with retry guidance. Delete temporary uploaded bytes on success, error, timeout and cancellation.