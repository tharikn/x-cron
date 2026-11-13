# 06 — AI Architecture

## 1. AI's role

AI is an optional assistant for language understanding and content suggestions. It is not the source of truth and must not be required for ordinary profile editing, resume layout or deterministic export.

## 2. Suitable AI use cases

- Parse uploaded resume text into candidate structured fields.
- Convert user-provided role/responsibility notes into structured draft bullets.
- Extract skills and requirements from job descriptions.
- Rewrite user-provided content for clarity and professional tone.
- Suggest a summary based on confirmed career facts.
- Identify possible keyword gaps.
- Explain recommendations in plain language.
- Produce semantic embeddings for job/profile matching where cost-effective.

## 3. Keep deterministic

Use ordinary application code for:
- CRUD, validation and authorization
- Date/experience calculations
- Template selection and rendering
- File generation
- ATS score arithmetic and weighting
- Keyword exact/normalized matching
- Ownership, retention and security
- Versioning and local file save behavior

## 4. Provider abstraction

Define interfaces such as:
- TextGenerationProvider.generateStructured(...)
- EmbeddingProvider.embed(...)
- ResumeParser.extractText(...)

Provider adapters may support commercial APIs or a self-hosted model later. Business modules must depend on interfaces, not vendor SDKs. Store model/provider name and prompt/schema version for diagnostics, not sensitive prompt content.

## 5. Safe generation pipeline

```text
User Input / Extracted Text
       ↓
Length + File + Content Validation
       ↓
Prompt Construction (minimal required context)
       ↓
LLM Provider
       ↓
Strict JSON Schema Validation
       ↓
Evidence / Provenance Check
       ↓
User Review and Edit
       ↓
Explicit User Confirmation
       ↓
Persist Confirmed Structured Data
```

Never render raw AI HTML, CSS, JavaScript or SQL. Render only validated structured content through trusted templates.

## 6. Truthfulness rules

The model must not invent:
- Employer or client names
- Job titles or employment dates
- Degrees, certifications or licenses
- Tools, technologies or skills
- Projects or responsibilities not supported by the source
- Revenue, percentages, team sizes or performance metrics

If an achievement would benefit from a metric, ask the user for the actual value rather than generating one. Mark inferred content as a suggestion and require confirmation.

## 7. Prompt injection and data minimization

- Treat job descriptions, uploaded documents and user text as untrusted data, never as system instructions.
- Do not allow source documents to change model behavior or request secrets.
- Send only the selected resume fields and target job requirements needed for the task.
- Avoid sending contact details or unrelated profile data to AI.
- Do not include credentials, tokens or internal prompts in model context.
- Validate output schema and allowed fields after generation.

## 8. Cost controls

- Use deterministic parsing/keyword logic before invoking an LLM.
- Cache normalized job description analysis by content hash and analyzer version.
- Cache embeddings where permitted.
- Debounce repeated user requests and enforce per-user quotas.
- Use smaller/cheaper models for extraction and reserve stronger models for tasks that benefit from them.
- Keep prompts short and structured.
- Track token usage and cost by feature without logging full resume content.

## 9. Failure behavior

Handle timeout, rate limit, unavailable provider, malformed JSON and low-confidence extraction. Return a recoverable error and preserve user input. Manual builder, saved data and deterministic ATS components must continue to work.

## 10. Testing

- Unit-test schemas, validation and provenance rules.
- Use fixed mock provider outputs in automated tests.
- Test hallucination-sensitive cases (missing dates, absent metrics, ambiguous skill).
- Test prompt-injection content in uploaded files/JDs.
- Maintain a versioned evaluation set and compare extraction quality before changing models/prompts.
