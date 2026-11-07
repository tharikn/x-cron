# CLAUDE.md — `api/src/companies/`

**Company workspace** for recruiters (doc `04-RECRUITER-AND-COMPANY-MODULE`).  
`Employer` rows are the company records; API surface is `/v1/companies` (+ legacy `/v1/employers`).

## Domain

| Concept | Notes |
| --- | --- |
| Company profile | legal/display name, website, domain, industry, size, HQ, hiring locations, logo, about, workspace settings |
| Verification | `unverified` → `pending` → `verified` / `rejected` / `suspended` / `reverify_required`; private evidence + audit log |
| Membership | `owner` \| `admin` \| `recruiter` \| `hiring_manager` \| `viewer`; status `active` \| `revoked`; invites with token + expiry |
| Internal notes | Company-only (not seeker timeline notes) |
| Interviews | Scheduled against an application |
| Dashboard | `GET /v1/recruiter/dashboard` — job/applicant funnel + soft response-quality indicator |

## Endpoints

| Method | Path | Access |
| --- | --- | --- |
| POST | `/v1/companies` | seeker/employer/admin |
| GET/PATCH | `/v1/companies/:companyId` | employer/admin + membership |
| POST | `/v1/companies/:companyId/verification` | owner/admin |
| GET | `/v1/companies/:companyId/verification/evidence` | owner/admin (audited) |
| POST | `/v1/companies/:companyId/invitations` | owner/admin |
| POST | `/v1/company-invitations/:token/accept` | auth |
| GET | `/v1/companies/:companyId/members` | members |
| PATCH | `/v1/companies/:companyId/members/:memberId` | owner/admin (revoke immediate) |
| POST | `/v1/companies/:companyId/transfer-ownership` | owner (confirm name) |
| GET/POST | `/v1/companies/:companyId/internal-notes` | review roles |
| GET/POST/PATCH | `/v1/companies/:companyId/interviews` | schedule roles |
| GET | `/v1/recruiter/dashboard` | employer/admin |
| POST | `/v1/admin/companies/:companyId/verification/decision` | admin |

## Access rules

- Jobs + applications enforce **company membership** via `CompaniesService.requireAction` (not `ownerUserId` alone).
- Revoking a member drops access on the next request (no client-cached permission).
- Cross-company jobs/applicants are never returned.
- Trust tier / risk flags / evidence stay off public job DTOs.

## Storage

- Profile fields on Prisma `Employer` (+ memory `AuthStore`)
- `EmployerMember`, `EmployerInvitation`, `EmployerVerificationEvidence`, `EmployerVerificationAudit`, `CompanyInternalNote`, `CompanyInterview`
- Migration `20261107120000_company_workspace`
- Persistence follows `AUTH_STORE` / `JOBS_STORE=prisma`

## Clients

- Web `/company` + `/company-invitations/:token/accept`
- Mobile `/tabs/company` + `/tabs/company-invitations/:token/accept`

## Agent rules

- Prefer extending this module over inventing a parallel “Company” Prisma model
- Keep verification evidence private + audited
- Ownership transfer always requires confirm name
- Update this file + `docs/COMPANY_WORKSPACE.md` when roles/states change
