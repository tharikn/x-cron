# 28 — Multi-Parser Compatibility Laboratory

## 1. Purpose and honest positioning
Test whether generated or user-selected resume documents preserve readable text, structure and expected field extraction across independent parser implementations. This is a compatibility laboratory, not a replica of proprietary ATS products and not a guarantee of ranking, shortlist or hiring outcomes.

## 2. Inputs and privacy boundary
Supported inputs initially: PDF and DOCX. Prefer locally executed parsing in the client where practical. If server parsing is required, stream to an isolated ephemeral worker, enforce strict limits, encrypt temporary storage, disable content logging and delete bytes on success, failure, timeout and cancellation. Never persist source or output binaries. The user may optionally provide the structured source resume as ground truth.

## 3. Adapter architecture
Define a ParserAdapter contract:
- id, version, supportedFormats, capabilities
- extract(fileStream, options) -> normalized ParseResult
- healthCheck() and resourceLimits
- deterministic error taxonomy

Adapters return a common model: document metadata, pages, text blocks, reading order, section candidates, contact candidates, date candidates, skills and hyperlinks. Each extracted value carries page/offset evidence and parser confidence. Keep raw parser-specific output transient and do not expose it as a stable public API.

Start with at least two independent implementations per supported format where feasible. Pin versions and licenses. Parser diversity matters more than running many wrappers around the same underlying engine.

## 4. Test dimensions
- File integrity, MIME/signature, encryption and malformed input.
- Text extraction and selectable text.
- Reading order and column interpretation.
- Section heading and section boundary detection.
- Contact, employment, education and date extraction.
- Skill and technology extraction.
- Hyperlinks and URL integrity.
- Unicode, ligatures, symbols and regional scripts.
- Header/footer and page-boundary behavior.
- Tables, text boxes, icons and graphics.
- Font embedding, missing glyphs, clipping and overflow.
- Page count and whitespace anomalies.

## 5. Ground-truth comparison
When a document was generated from a known structured resume, compare extracted fields with that exact source version. Normalize only safe variations such as whitespace, punctuation and date formatting. Report precision/recall or field-level agreement only where a ground-truth field exists. If no ground truth is supplied, show diagnostics and parser coverage; do not invent an “accuracy percentage”.

## 6. Result model
Each run stores: runId, userId/tenantId, resumeVersionId if applicable, inputFormat, fileHash (short-lived or privacy-reviewed), parser adapter/version, test suite version, started/completed timestamps, status, field diagnostics, reading-order diagnostics, layout warnings and retention expiry. Avoid retaining raw text or full file hashes if they create unnecessary linkability.

Use separate statuses: pass, warning, fail, not_tested. Each finding includes ruleId/version, severity, page/region, evidence excerpt only when necessary, impact and remediation. Parser-specific differences are visible rather than averaged away.

## 7. Score policy
Prefer a dimension report over one score. If a numeric Parsing Compatibility Score is exposed, publish its formula and version, include coverage, exclude not-tested dimensions with disclosed weight renormalization, and never label it “ATS pass”. Do not average parser outputs blindly; disagreement between parsers is itself a diagnostic.

## 8. API and execution
- POST /v1/parsing-tests (202 accepted; returns runId)
- GET /v1/parsing-tests/:runId
- GET /v1/parsing-tests/:runId/findings
- DELETE /v1/parsing-tests/:runId
- GET /v1/parsing-tests/capabilities

Use queue-backed isolated workers only when load justifies them. Enforce per-user concurrency, file/page/CPU/memory/time limits, cancellation and idempotency. Core builder/export must not depend on this service being available.

## 9. Template regression integration
Every published template version must have fixtures covering single-page, multi-page, long content, Unicode and relevant role sections. On renderer/template changes, run the parser suite and visual regression suite. Store test metadata and results, not fixture binaries containing real user data. Use synthetic fixtures.

## 10. Acceptance criteria
- Every result names parser and version.
- No universal ATS guarantee or unsupported accuracy claim.
- Ground-truth metrics are shown only when a valid source exists.
- Parser disagreement and unsupported features are explicit.
- Temporary bytes are deleted on all execution paths.
- Resource exhaustion, malicious files, cancellation and cross-tenant access are tested.
- Template releases cannot bypass required regression checks.
