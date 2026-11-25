# Web Custom Code Frame (`web/src/app/shared/portfolio-custom-code`)

Renders the allow-listed `custom-code` section. User HTML/CSS/JS is untrusted and is **isolated, never sanitised**.

## Non-negotiables

- The frame loads with `<iframe sandbox="allow-scripts [allow-forms] [allow-popups]" credentialless>` and **no** `allow-same-origin`. Adding `allow-same-origin` hands the visitor's session to the author's code — treat it as a security incident, not a feature.
- Never `innerHTML`, `bypassSecurityTrustHtml` or interpolate author source into an Angular template. `composeCustomCodeDocument()` builds the document as text and it is set through `srcdoc`.
- Author `css`/`js` are embedded with `</style`, `</script` and `<!--` escapes. Keep those escapes when editing the composer.
- Parent↔frame messages are accepted only when `event.source === iframe.contentWindow` **and** the per-instance token matches. Opaque-origin frames report `origin: "null"`, so origin checks are not usable here.
- The frame is `pointer-events: none` while `editable` so the builder keeps selection, drag and focus.
- `srcdoc` is empty during SSR and the hydration pass (`hydrated` signal) so server and client markup match and the SSR payload stays small.

## Files

- `custom-code-frame.ts` — pure helpers: limits, prop coercion, sandbox tokens, CSP, document composer, page splitter, byte/line counts.
- `portfolio-custom-code.component.*` — iframe host, height bridge, diagnostics strip.

## Mirrored copy

`mobile/src/app/shared/portfolio-custom-code/` is a deliberate duplicate (same rule as the renderer). Keep both in sync.

Design notes and the phase-2 separate-origin plan: `docs/dynamic-portfolios/26-CUSTOM-CODE-SANDBOX.md`.
