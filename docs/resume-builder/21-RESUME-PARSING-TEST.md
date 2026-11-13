# 21 — Resume Parsing Test

## 1. Purpose

Provide a dedicated **Resume Parsing Test** that verifies whether a resume's exported PDF or DOCX can be read and interpreted reliably by common resume parsers. This is a validation tool, not the normal import flow and not a promise that every employer ATS will parse the file identically.

The feature answers:
- Can a parser extract the resume's text?
- Are name/contact details, sections, dates, job titles, employers, skills and education recognized?
- Is the reading order correct?
- Did columns, tables, icons, text boxes, headers/footers or graphics cause content loss?
- Does the exported file preserve the intended content?

## 2. Separate feature boundary

This feature has its own route, screen, service and report history. It is separate from:
- Resume Import / Parser (which imports content into the profile)
- Resume Quality & Recruiter Review (which reviews writing and content)
- Resume Match Score (which compares a resume to a job)
- Preview and Export (which create the document)

Suggested route: `/resume-builder/parsing-test`.

## 3. User flow

1. User selects an existing resume version and chooses an export format, or selects a local PDF/DOCX file.
2. The client obtains the bytes from the user's local file selection or generates a test export.
3. The parsing test runs against one or more supported parser adapters.
4. The engine extracts text and structured fields.
5. The test compares extracted output with the expected structured resume data when the source is an X Cron-generated resume.
6. The user sees a report with extraction quality, missing fields, reading-order problems and exact evidence.
7. User can fix the source layout/content and run the test again.

For an externally created file, expected structured data may not exist. In that case, show extraction diagnostics only and do not invent a ground-truth accuracy percentage.

## 4. Architecture

```text
Local PDF/DOCX or Generated Export
              |
              v
      Parsing Test Orchestrator
              |
      +-------+--------+
      |                |
      v                v
Format Validator   Parser Adapters
      |           (PDF / DOCX)
      |                |
      +-------+--------+
              |
              v
      Structured Extraction
              |
      +-------+------------------+
      |                          |
      v                          v
Expected Resume Comparator   Reading Order Analyzer
(when source is known)       + Layout Diagnostics
      |                          |
      +------------+-------------+
                   |
                   v
          Parsing Test Report
                   |
                   v
             User Review UI
```

### NestJS module proposal

```text
src/
  parsing-test/
    parsing-test.module.ts
    parsing-test.controller.ts
    parsing-test.service.ts
    orchestrator/
    adapters/
      pdf/
      docx/
    extraction/
    comparison/
    diagnostics/
    scoring/
    reports/
    policy/
    dto/
    tests/
```

Prefer client-side parsing for supported formats where practical. If a backend parser is required, stream the selected file through a short-lived isolated process and delete bytes immediately after the test, including failure, timeout and cancellation paths.

## 5. Test dimensions

| Dimension | Checks |
|---|---|
| Text extraction | Is selectable text present and complete? |
| Field recognition | Name, email, phone, links, role, employer, dates, education, skills |
| Section recognition | Experience, education, skills, projects, certifications, summary |
| Reading order | Is content extracted in the intended sequence? |
| Layout compatibility | Columns, tables, text boxes, sidebars, icons and graphics |
| Date interpretation | Are employment and education dates extracted correctly? |
| Link integrity | Are URLs and email links preserved? |
| Unicode/font support | Are symbols and non-English characters preserved? |
| Page integrity | Clipping, hidden content, blank pages, image-only pages |
| Export fidelity | Does extracted text match the source resume version? |

## 6. Score and report

Show a **Parsing Test Score** only when a valid expected source exists for comparison. Otherwise show status indicators such as Text Extracted, Fields Detected and Reading Order.

Suggested comparison weights (calibrate with test fixtures):

| Dimension | Weight |
|---|---:|
| Text coverage | 25% |
| Section recognition | 20% |
| Field recognition | 20% |
| Reading order | 15% |
| Date and chronology extraction | 10% |
| Link and Unicode preservation | 5% |
| Layout integrity | 5% |

Do not blend this score with Resume Quality Score or Resume Match Score. Explain the test parser/version and the scope of the test.

## 7. Report model

Each diagnostic should contain:
- Stable finding ID and rule/parser version
- Category and severity
- Page/section/field reference when available
- Expected value and extracted value only when comparison is authorized
- Explanation and suggested correction
- Parser adapter and version
- Confidence and reproducibility metadata

Do not retain full extracted resume text in logs or analytics.

## 8. UX

Dedicated report screen:
- Parsing Test Score or extraction status
- Text extraction preview
- Detected sections and fields
- Missing/misread fields
- Reading-order view
- Page/layout warnings
- Parser/version details
- Re-test action

Selecting a finding should highlight the corresponding preview region when coordinates are available. Use clear language: “This parser did not detect your Skills heading” rather than “All ATS systems will reject this resume.”

## 9. API proposal

All endpoints require authentication and ownership checks.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /resumes/:id/parsing-tests | Test a generated resume version/export |
| POST | /parsing-tests/upload | Test a user-selected local PDF/DOCX transiently |
| GET | /parsing-tests/:testId | Retrieve authorized report |
| GET | /resumes/:id/parsing-tests | List report metadata |
| DELETE | /parsing-tests/:testId | Delete report history |

Example request:

```json
{
  "resumeVersionId": "resume-version-id",
  "format": "pdf",
  "parserProfiles": ["generic_pdf_v1"]
}
```

A parser profile is an internal test adapter, not a claim to emulate a named employer's proprietary ATS. Any named third-party parser integration requires a valid license/API agreement.

## 10. Privacy and file lifecycle

- Individual document files remain on the user's device.
- Prefer local parsing when possible.
- Backend parsing must use transient encrypted streaming or isolated ephemeral storage.
- Delete bytes immediately after processing and on all error paths.
- Persist only report metadata, parser version, structured diagnostics and user-selected history.
- Never save the user's local path or copy document bytes into PostgreSQL, object storage, logs or analytics.
- Clearly disclose if an external parsing provider receives resume content.

## 11. Testing and acceptance criteria

- PDF and DOCX fixtures cover single/multi-column, tables, links, headers, footers, Unicode and multi-page content.
- Known source resumes validate extraction and field comparison.
- Unknown external resumes never receive fabricated accuracy scores.
- Parser failures and cancellation clean temporary bytes.
- Reports identify the parser/version and limitations.
- Parsing Test Score remains separate from all other scores.
- No claim of universal ATS compatibility is made.

## 12. Delivery phases

1. PDF/DOCX local text extraction and diagnostics.
2. Structured field/section recognition.
3. Comparison against generated resume source data.
4. Reading-order and layout analysis.
5. Multiple licensed/approved parser adapters and regression fixtures.

## 13. Related documents

- [07-ATS-ENGINE.md](./07-ATS-ENGINE.md)
- [08-EXPORT-ENGINE.md](./08-EXPORT-ENGINE.md)
- [17-PREVIEW-DESIGN.md](./17-PREVIEW-DESIGN.md)
- [20-RESUME-QUALITY-RECRUITER-REVIEW.md](./20-RESUME-QUALITY-RECRUITER-REVIEW.md)
- [22-RECRUITER-VIEW.md](./22-RECRUITER-VIEW.md)
