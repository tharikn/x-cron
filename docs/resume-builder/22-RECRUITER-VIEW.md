# 22 — Recruiter View

## 1. Purpose

Create a dedicated **Recruiter View** that presents a selected resume in a fast, professional, recruiter-oriented reading experience. It helps the resume owner understand how a hiring reviewer may scan the document: role identity, summary, recent experience, evidence of impact, skills and qualifications.

Recruiter View is a presentation and review mode. It is not an actual recruiter's decision, an employer ATS, or a hiring prediction.

## 2. Separate feature boundary

Recruiter View has its own route and presentation model. It is separate from:
- Resume Editor and template designer
- Dashboard and analytics
- Standard page-by-page Preview
- Resume Quality & Recruiter Review findings
- Resume Parsing Test
- Resume Match Score

Suggested route: `/resume-builder/recruiter-view/:resumeId`.

## 3. Primary goals

- Let users inspect their resume from a recruiter's perspective.
- Make the most important career information easy to find.
- Reveal weak or buried evidence without changing the source resume.
- Support quick navigation across experience, skills, projects and education.
- Compare recruiter-facing presentation with the original designed resume.

## 4. Recruiter reading layout

Recommended information hierarchy:

1. Name and professional headline
2. Target role / specialization
3. Short professional summary
4. Most recent and relevant experience
5. Evidence-backed achievements and measurable outcomes
6. Core skills and technologies
7. Selected projects
8. Education and certifications
9. Professional links and contact details

Do not hide content solely because an algorithm considers it less relevant. Provide a full-content mode and show any collapsed sections clearly.

## 5. UX capabilities

- Clean, low-distraction recruiter-style layout.
- Compact overview with role, seniority (if supported), years/periods of experience and core skills.
- Expandable experience entries with achievements and source context.
- Highlight user-selected target-role evidence.
- Section navigation and quick scan mode.
- Toggle between Recruiter View and original formatted preview.
- Optional anonymized view that masks contact details for safe sharing/screenshots.
- Print-friendly view using the same approved resume content.
- Accessibility support, keyboard navigation and screen-reader landmarks.

The UI must distinguish source facts from generated suggestions. Recruiter View itself must not silently rewrite, reorder or delete the underlying resume.

## 6. Optional review annotations

Recruiter View may display non-destructive annotations from Resume Quality & Recruiter Review:
- unclear bullet
- repeated content
- missing context
- achievement evidence that is hard to find
- inconsistent date/title presentation

Annotations must link to the originating finding and can be hidden. Do not duplicate the review engine or create a second score.

## 7. Data and rendering architecture

```text
Authorized Resume Version
          |
          v
Recruiter View Projection
          |
          +------ Optional Target Role / Match Context
          |
          +------ Optional Quality Review Annotations
          |
          v
Recruiter Presentation Renderer
          |
          v
Read-only Recruiter View
```

The projection is a read-only view model derived from the selected structured resume version. It must preserve provenance and never modify canonical resume content.

## 8. Sharing and privacy

- Recruiter View is private by default and requires authenticated access.
- Do not create a public URL automatically.
- If sharing is added later, require explicit user action, clear scope, expiry/revocation and access controls.
- Offer anonymization before screenshot/print/share.
- Never expose private profile fields or another user's resume through guessed IDs.
- Do not log resume text or contact details in analytics.

## 9. API proposal

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /resumes/:id/recruiter-view | Build read-only recruiter projection |
| POST | /resumes/:id/recruiter-view/preview | Return recruiter-view projection with optional role context |
| GET | /resumes/:id/recruiter-view/annotations | Retrieve linked review annotations |

All endpoints require authentication, resume ownership validation and version scoping. Do not expose public sharing endpoints in the initial release.

## 10. Acceptance criteria

- Recruiter View is a separate route and design.
- It is read-only and does not mutate resume content.
- It makes core career facts and relevant achievements easy to scan.
- It supports full-content and quick-scan modes.
- Optional annotations link back to existing review findings.
- Contact anonymization works before print/share.
- No public link is created without explicit opt-in.
- Recruiter View has no duplicate ATS or quality score.

## 11. Delivery phases

1. Read-only projection and recruiter-oriented layout.
2. Quick-scan navigation, expand/collapse and anonymized mode.
3. Optional quality review annotations.
4. Print/share enhancements with explicit privacy controls.

## 12. Related documents

- [17-PREVIEW-DESIGN.md](./17-PREVIEW-DESIGN.md)
- [20-RESUME-QUALITY-RECRUITER-REVIEW.md](./20-RESUME-QUALITY-RECRUITER-REVIEW.md)
- [23-RESUME-MATCH-SCORE.md](./23-RESUME-MATCH-SCORE.md)
