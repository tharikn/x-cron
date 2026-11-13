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

## 6. Export
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /resumes/:id/export/pdf | Generate/stream PDF bytes |
| POST | /resumes/:id/export/html | Generate/stream HTML |
| POST | /resumes/:id/export/xlsx | Generate/stream workbook |
| POST | /resumes/:id/export/docx | Generate/stream DOCX |
| POST | /integrations/google-docs | Optional Google Docs creation after explicit consent |

Export responses stream bytes or use a short-lived one-time retrieval token. Never persist output in permanent server storage, object storage or database blobs. Client saves returned bytes into the local folder.

## 7. Templates and preview
| Method | Endpoint | Purpose |
|---|---|---|
| GET | /templates | List published templates with filters/categories |
| GET | /templates/:id | Get template metadata |
| GET | /templates/:id/versions/:version | Get immutable package metadata/layout/theme |
| POST | /preview/render | Render preview from authorized structured data and selected template |
| POST | /preview/validate | Validate layout and return overflow/compatibility warnings |

Preview is a separate feature/route, not a dashboard subview. Do not expose executable template code.

## 8. Dashboard and analytics
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

## 9. Host job portal integration
Pass normalized job title, description, optional external job ID, location/work mode and source/tenant context. An externalJobId alone must never grant access to portal data.

## 10. Idempotency and limits
Use idempotency keys for expensive generation/export operations. Rate-limit AI and file endpoints. Limit text lengths, upload size, page count and processing time. Return 429 with retry guidance. Delete temporary uploaded bytes on success, error, timeout and cancellation.