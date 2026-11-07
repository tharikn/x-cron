# Company workspace (recruiter & company module)

Baseline: external guidance `04-RECRUITER-AND-COMPANY-MODULE.md`.  
X Cron maps **Company ↔ `Employer`** (legacy clients + public `/employers/:id` pages keep that name).

## What shipped

### Company workspace
- Display + legal name, website, verified email domain, industry, size band, HQ, hiring locations, logo, about
- Workspace settings JSON (notify prefs / pipeline defaults)
- Internal trust tier + risk flags (owner/admin + platform admin only)

### Verification
States: `unverified` · `pending` · `verified` · `rejected` · `suspended` · `reverify_required`  
Recruiters submit evidence (`domain_email` / `business_registration` / `website` / `other`). Admin decides via `/v1/admin/companies/:id/verification/decision`. Evidence views are audited. Badge = `verified` only.

### Team membership
Roles: **Owner · Admin · Recruiter · Hiring manager · Viewer**  
Invites expire (7d), can be revoked; accept at `/v1/company-invitations/:token/accept`.  
Revoking a member removes access immediately on the next API call.  
Ownership transfer requires typing the company display name.

### Recruiter workspace
- Job list (existing My jobs) scoped by **company membership**
- Applicant pipeline (existing employer applications) same scope
- Company-internal notes + interview scheduling APIs
- `GET /v1/recruiter/dashboard` — job/applicant counts, unreviewed reminder, soft response-quality indicator (`actively_reviewing` / `usually_responds` / `building`) — never a guaranteed SLA

### Clients
| Surface | Route |
| --- | --- |
| Web | `/company`, invite accept `/company-invitations/:token/accept` |
| Mobile | `/tabs/company`, `/tabs/company-invitations/:token/accept` |

Drawer / Account **Company** links appear for `isEmployer()`.

### E2E

Playwright: `e2e/journeys/13-company-workspace.spec.ts` (+ recruiter/golden-path hooks) on **web**, **mobile**, and **Android Chrome**. See [E2E.md](./E2E.md) · [e2e/README.md](../e2e/README.md).

## Acceptance mapping

| Criterion | How |
| --- | --- |
| No cross-company job/applicant access | Membership check on `employerId` |
| Revoke is immediate | `status=revoked` → `findActiveMember` fails |
| Evidence private + audited | Evidence endpoints + `EmployerVerificationAudit` |
| Ownership transfer confirmation | `confirmCompanyName` must match |

## Stubs / gaps for later
- Email delivery of invites (token returned for share link in MVP)
- Assigned-job scoping per recruiter (all company jobs for now)
- Rich interview calendar UI (API + dashboard list first)
