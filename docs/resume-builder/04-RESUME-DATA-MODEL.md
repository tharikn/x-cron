# 04 — Resume Data Model

## 1. Modeling principles

- Career facts are stored independently from resume presentation.
- A user may create many resume definitions from one career profile.
- A resume definition selects, orders and optionally overrides profile content.
- Store enough structured data/configuration to reproduce a resume; do not store every exported binary.
- Use tenant/user ownership on all user-owned records.
- Use soft deletion only where recovery/audit requirements justify it; define retention explicitly.

## 2. Core entities

| Entity | Purpose |
|---|---|
| UserCareerProfile | Root profile owned by a user/tenant |
| ContactInfo | Name and contact fields |
| Experience | Employment record |
| ExperienceBullet | Responsibility or achievement item |
| Skill | Normalized skill reference and user proficiency/context |
| Education | Education record |
| Project | Personal/professional project |
| Certification | Certification or license |
| Achievement | Standalone achievement/award |
| Language | Language and proficiency |
| Resume | Named resume definition |
| ResumeSection | Included sections and display order |
| ResumeContentOverride | Resume-specific text overrides |
| ResumeVersion | Version metadata and reproducible structured snapshot |
| Template | Versioned rendering definition |
| JobAnalysis | Normalized job description analysis |
| AtsReport | Score, breakdown and evidence metadata |
| AiSuggestion | Proposed content and review status |

## 3. Relationship overview

```text
User / Tenant
  └── CareerProfile
       ├── Experiences ── ExperienceBullets
       ├── Skills
       ├── Education
       ├── Projects
       ├── Certifications
       ├── Achievements
       └── Languages

CareerProfile
  └── Resumes
       ├── ResumeSections
       ├── ContentOverrides
       └── ResumeVersions

JobAnalysis ── AtsReport (references resume/profile version)
AiSuggestion ── source/provenance + review status
Template ── template version referenced by Resume
```

## 4. Suggested fields

### UserCareerProfile
- id (UUID)
- tenantId
- userId
- headline
- summary
- contactInfo (normalized columns or related table)
- createdAt, updatedAt

### Experience
- id, profileId
- employerName
- jobTitle
- employmentType
- location
- startDate, endDate
- isCurrent
- description
- displayOrder

### ExperienceBullet
- id, experienceId
- kind: RESPONSIBILITY | ACHIEVEMENT
- content
- sourceText (optional)
- isUserConfirmed
- displayOrder

### Skill
- id, profileId
- taxonomySkillId (nullable)
- name
- category
- proficiency (optional)
- yearsUsed (optional; only if user supplied)
- isUserConfirmed

### Resume
- id, profileId
- name
- targetRole
- templateId, templateVersion
- status
- createdAt, updatedAt

### ResumeSection
- id, resumeId
- sectionType
- sourceEntityId (nullable)
- visibility
- displayOrder

### ResumeVersion
- id, resumeId
- versionNumber
- structuredSnapshot (JSONB)
- changeSummary
- createdAt

Snapshot contains structured resume content and render configuration, not exported PDF/DOCX bytes. Apply retention limits to old versions.

### JobAnalysis
- id, owner/tenant context
- sourceJobId (nullable external ID)
- descriptionHash
- normalizedRequirements (JSONB)
- analyzerVersion
- createdAt, expiresAt

### AtsReport
- id, resumeVersionId or profile/resume reference
- jobAnalysisId
- totalScore
- scoreBreakdown (JSONB)
- matchedEvidence (JSONB)
- gaps (JSONB)
- engineVersion
- createdAt

## 5. Prisma implementation notes

- Use UUID primary keys.
- Use explicit enums for controlled states.
- Add indexes for tenantId/userId and parent foreign keys.
- Add unique constraints for profile ownership and resume version numbers.
- Use JSONB only for genuinely flexible snapshots/reports, not every core field.
- Use transactions for multi-record profile updates.
- Validate all ownership before reading or writing child entities.
- Avoid storing raw uploaded files in PostgreSQL.

## 6. Data lifecycle

- Career profile remains until user deletes it or account retention policy applies.
- Resume definitions and snapshots remain according to product retention policy.
- Job analysis cache should have TTL and be keyed by normalized description hash plus analyzer/taxonomy version.
- ATS reports may be retained as metadata with user controls.
- Temporary uploaded source files and export temp files must be deleted promptly.
- Exported documents saved on the user's device are outside backend retention.

## 7. Privacy and integrity

Treat career data as sensitive personal information. Encrypt transport, restrict database access, avoid PII in logs, and implement account-level export/deletion. Never use a user's career data for model training unless a separate explicit and valid consent process exists.
