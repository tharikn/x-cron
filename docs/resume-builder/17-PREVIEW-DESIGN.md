# 17 — Dedicated Resume Preview Design

## 1. Purpose and separation

Preview is a dedicated feature, route and rendering subsystem. It is not the dashboard, not a dashboard panel, and not the editor itself. Dashboard provides navigation to Preview; Editor sends the selected resume/template/render model to Preview.

## 2. User experience

- Open Preview from the editor or resume actions.
- Show a dedicated page with page-by-page A4/Letter rendering.
- Provide zoom in/out, fit-to-width, fit-to-page, page navigation and full-screen mode.
- Show page boundaries, margins, page count and overflow warnings.
- Allow return to editor without losing edits.
- Provide a separate final-export preview using the actual export renderer when feasible.
- Mobile editing may be responsive, but preview must represent printed pages rather than the mobile viewport.

## 3. Architecture

~~~text
Authenticated Editor
  → Resume Content + Template Version + Design Overrides
  → Render Model Normalizer
  → Preview API / Renderer
  → Dedicated Preview Screen
  → User confirms export
  → Export Renderer → bytes/stream
  → Local Storage adapter saves to device folder
~~~

Preview and export consume the same immutable template version and normalized render model. Do not maintain separate layout logic for preview and PDF export.

## 4. Rendering model

The normalized render model includes:
- Page size, orientation, margins and page count.
- Template ID/version and schema version.
- Section order, visibility and semantic layout.
- Typography tokens, font references and spacing scale.
- Text, links, lists, dates and supported rich-text blocks.
- Page-break preferences and overflow diagnostics.

Use renderer-neutral measurements with explicit conversion to CSS pixels/points. Avoid arbitrary user-supplied x/y pixel coordinates.

## 5. Fidelity and pagination

- Use the same font files, typography tokens and layout constraints across preview/export.
- Prefer predictable layout primitives over unsupported CSS.
- Keep headings with following content where possible.
- Avoid splitting bullet items where possible.
- Detect overflow, clipped content, empty trailing pages and unsupported glyphs.
- Provide warnings instead of silently dropping content.
- Exact pixel identity across browser and PDF engines cannot be guaranteed; run visual regression tests against representative resumes and supported platforms.

## 6. Security and performance

- Preview APIs require authentication and ownership checks.
- Sanitize rich text and links; never execute template or AI-provided scripts.
- Debounce preview rendering after edits.
- Cache only safe render artifacts in memory with short TTL; do not persist preview documents.
- Do not log resume content or preview HTML.
- Cancel stale render requests when a newer version is requested.

## 7. Acceptance criteria

- Preview opens as a separate route/screen, not inside dashboard.
- It displays realistic page dimensions and pagination.
- Preview and export use the same render model/template version.
- Overflow and layout issues are visible to the user.
- Returning to editor preserves current edits.
- Preview content is not permanently stored on the server.