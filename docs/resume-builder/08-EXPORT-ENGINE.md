# 08 — Export Engine

## 1. Objective

Render a confirmed structured resume into common formats. Export should be reproducible from a resume version, template version, locale and export settings.

## 2. Supported formats

| Format | Intended use | Priority |
|---|---|---|
| PDF | Ready-to-send professional resume | MVP |
| HTML | Portable web/print representation | MVP |
| XLSX | Structured career-data workbook, not the primary resume format | Phase 2 |
| DOCX | Editable document and Google Docs interchange | Phase 2 |
| Google Docs | Direct cloud document creation | Optional later integration |

## 3. Rendering pipeline

```text
Resume Version + Template Version + Locale
                 ↓
           Render Model
                 ↓
         Format-specific Adapter
       /       |       |       \
     PDF      HTML    XLSX     DOCX
       \       |       |       /
           File Bytes / Stream
                 ↓
             Client Save
```

The renderer accepts validated structured data only. Never render arbitrary HTML/JS from AI output.

## 4. PDF

- Use selectable text and standard fonts where possible.
- Support page breaks, margins, headers/footers and links.
- Avoid layouts that convert all content to an image.
- Validate multi-page output and prevent clipped sections.
- Test text extraction from generated PDFs.

## 5. HTML

- Produce self-contained or clearly documented HTML/CSS.
- Sanitize all user-controlled text.
- Do not include scripts or remote tracking by default.
- Provide print styles and accessible semantic headings.
- Ensure downloaded HTML does not depend on authenticated API URLs.

## 6. XLSX

XLSX is a structured-data export, not a visual resume substitute. Suggested worksheets:
- Profile
- Experience
- Skills
- Education
- Projects
- Certifications
- Achievements
- Languages

Escape formula-like user values to prevent spreadsheet formula injection. Preserve text exactly and label empty values clearly.

## 7. DOCX and Google Docs

DOCX is the baseline editable document format. Keep styles and headings compatible with common word processors.

Direct Google Docs:
- Optional feature, not a core dependency.
- Requires explicit Google OAuth consent and appropriate Drive/Docs scopes.
- Create a document in the user's authorized Drive.
- Explain what permissions are requested.
- Allow disconnect/revocation and handle token expiry.
- Never require Google sign-in to use the Resume Builder.

## 8. Local-first delivery

Return export bytes or a short-lived retrieval response. Client saves the file using platform APIs. Server-side temporary files, if required, must have a short TTL and cleanup. Do not retain generated files by default.

## 9. Export tests

Test:
- long names, long URLs and non-English characters
- one-page and multi-page resumes
- missing optional sections
- page breaks and font fallback
- HTML sanitization and XSS
- XLSX formula injection
- DOCX openability in Word and Google Docs
- generated PDF text extraction
