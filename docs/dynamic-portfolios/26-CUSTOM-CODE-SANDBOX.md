# Custom Code Sandbox

Status: ✅ DONE (phase 1 — isolated block). Phase 2 (separate-origin site hosting) is specified below and not implemented.

## Why this exists

Users want to paste or import HTML, CSS and JavaScript into a portfolio and publish it. That is incompatible with two older rules:

- "Never persist user-authored HTML" — impossible if users must keep their own markup.
- "Never execute user code on the app origin" — this one is **not** negotiable.

Both rules are now expressed as a single invariant:

> User code may be stored as opaque text, but it is never parsed by Angular and never executes on the application origin. It only runs inside an opaque-origin sandbox.

Nothing in this feature sanitises JavaScript. Sanitising JS is not a solvable problem; isolation is.

## What ships

- Allow-listed section type `custom-code` (`variant: sandbox`), registered in `api/src/portfolio/component-registry.ts`.
- Props: `title`, `html`, `css`, `js`, `height`, `allowForms`, `allowPopups`, `allowExternal`, `acknowledged`.
- Editor: paste panes for HTML/CSS/JS, file import (`.html`, `.htm`, `.css`, `.js`, `.mjs`, multiple at once), "Split full page" for a pasted whole document, byte/line counters, runtime-error strip, sandbox notice.
- Renderer: `web/src/app/shared/portfolio-custom-code/` (mirrored in `mobile/src/app/shared/portfolio-custom-code/`), used by the editor preview and the public page through the same `PortfolioRendererComponent`.
- Publish gate: the acknowledgement must be ticked, otherwise publishing is blocked with `PORTFOLIO_CUSTOM_CODE_UNACKNOWLEDGED`.

## Isolation model

| Control | Implementation |
|---|---|
| Origin | `<iframe sandbox="allow-scripts …">` **without** `allow-same-origin` → opaque origin |
| Cookies / session | Unreachable: no `document.cookie`, no authenticated `fetch`, and `credentialless` strips credentials from subresource requests in Chromium |
| Browser storage | Bridged, not shared: an in-frame `Storage` shim works through postMessage and the host persists only this section's namespace on the app origin |
| Parent DOM | Unreachable (no `allow-same-origin`) |
| Top navigation | Denied (`allow-top-navigation*` never granted) |
| Modals, pointer lock, downloads, presentation | Denied |
| Network | `Content-Security-Policy: default-src 'none'` inside the frame; external hosts only when `allowExternal` is on |
| Forms | `form-action 'none'` unless `allowForms` is on |
| Workers / nested frames / objects | Denied by CSP (`worker-src`, `frame-src`, `object-src`) |
| Base URL hijack | `base-uri 'none'` |
| Referrer leakage | `referrerpolicy="no-referrer"` + `<meta name="referrer" content="no-referrer">` |
| Message spoofing | Parent accepts a message only when `event.source === iframe.contentWindow` **and** the per-instance random token matches |
| Source break-out | Author CSS/JS is embedded as text with `</style`/`</script`/`<!--` escapes, so it cannot terminate the wrapper |

The iframe is display-only in the editor (`pointer-events: none`) so section selection, drag-and-drop and keyboard focus in the builder keep working. It becomes interactive in Preview and on the live site.

## Rendering: srcdoc must be set imperatively

`<iframe [srcdoc]="…">` is not used, and must not be reintroduced. Angular classifies `iframe[srcdoc]` as an HTML sink and runs its sanitizer on the binding, which removes the frame's `<style>` and `<script>` blocks. That silently strips the author's CSS and JavaScript while leaving the markup intact — an imported page then looks unstyled inside the editor and on the live site even though the CSS pane is populated.

The component assigns `frame.srcdoc = source` directly after render. The Angular sanitizer cannot help here: author code is deliberately never sanitised, and the security boundary is the `sandbox` attribute plus the in-frame CSP, not the template binding. `sandbox` itself must stay a static attribute; Angular 22 rejects a dynamic binding with `NG0910`.

A unit test (`portfolio-custom-code.component.spec.ts`) asserts that the rendered `srcdoc` still contains `<style>` and `<script>`.

## Browser storage compatibility

Author code that reads `localStorage` or `sessionStorage` used to fail immediately: an opaque origin throws `SecurityError`, which aborts the whole script before it renders anything (this was the cause of the imported "LOL Factory" page losing its joke grid and theme). The bridge now installs a `Storage`-compatible shim **before** the author script runs:

| Property | Behaviour |
|---|---|
| API | `getItem`, `setItem`, `removeItem`, `clear`, `key`, `length`, property access, `in`, `delete`, `Object.keys` |
| Initial data | Seeded synchronously while the document is composed, so the author's first read sees the saved value |
| Persistence | Writes are posted to the parent and stored under `xcron.pf-code.v1.<siteId>:<sectionId>.<localStorage|sessionStorage>` in the host origin's matching store |
| Scope | One namespace per site + section; the frame can never read app keys, cookies or another section's data |
| Limits | 64 KB per section/store, 128-byte keys, 32 KB values; values over quota throw `QuotaExceededError` like the native API |
| Failure mode | If host storage is unavailable (private mode, embedded browser), the shim keeps working in memory for the page lifetime |

`sessionStorage` is persisted to the host `sessionStorage`, so it survives a reload in the same tab and resets like the native API. Cookies remain unavailable and are not emulated.

## Size and count limits

| Limit | Value |
|---|---|
| HTML | 200,000 characters |
| CSS | 120,000 characters |
| JavaScript | 200,000 characters |
| Height | 120–3000 px (clamped server-side) |
| Imported file | 512 KB (editor guard) |

Oversized code is rejected at save time (`PORTFOLIO_CODE_TOO_LARGE`) rather than silently truncated, because truncated JavaScript is broken JavaScript.

## Transport: getting code past the generic API protections

Two shared guards would otherwise block legitimate imports, so both are handled narrowly:

1. **Input protector** (`api/src/security/input-protector.middleware.ts`). It rejects XSS/SQLi payload patterns in every JSON body. `ScanOptions.allowPortfolioCode` skips the pattern checks for exactly `html`, `css` and `js` of an object whose `type` is `custom-code`. Control characters and prototype-pollution keys are still rejected, and every other field (including the section `title`) is scanned as usual. The middleware enables the option **only** for `PUT /v1/portfolio/sites/:id/draft` and `POST /v1/portfolio/sites/:id/draft/validate`; publish, rollback and every other endpoint keep the strict scan. This is why the exception lives in the middleware and not in the schema: the schema still validates the code shape, and the sandbox still isolates execution.
2. **JSON body size**. The Express default is 100 KB, below the ~520 KB of code a document may hold. `main.ts` calls `app.useBodyParser('json', { limit: '2mb' })`; because it is registered before Nest's parser, it replaces the 100 KB default while preserving the `rawBody` capture the Razorpay webhook HMAC needs (verified with a pretty-printed signed payload).

## Import pipeline

1. User pastes into a pane or picks files with **Import file**.
2. Files are routed by extension: `.html/.htm` → split into panes, `.css` → CSS pane, `.js/.mjs` → JS pane.
3. `splitCustomCodePage()` parses the document with `DOMParser` (never executing it), moves `<style>` blocks to CSS, classic inline `<script>` blocks to JS, keeps stylesheet `<link>` tags and body markup in HTML, and leaves module scripts in place so their semantics survive.
4. **Split full page** applies the same split to whatever is already in the HTML pane — the copy-paste path for whole templates.
5. When the imported source loads external resources (`@import`, `url(...)`, `<script src>`, `<link href>`, images, `fetch`, sockets), the editor turns on `allowExternal` and says so in the notice, because the frame CSP would otherwise block them silently.
6. If the section has no frame title yet, the first imported HTML file name becomes the title (required by the schema).
7. **Replace, not append.** The toolbar **Import code** button removes the existing template sections and navigation items and creates a single `custom-code` section, so the imported page becomes the whole portfolio instead of being dropped below the template. It asks for confirmation first. The renderer also drops its own header/footer chrome in that case, so the imported page fills the viewport. Per-field **Import file** still targets an existing section without replacing anything.
8. The editor autosaves with the existing revision guard; publishing snapshots the document exactly like any other section, so rollback restores the code too.

## Validation warnings (non-blocking)

- `PORTFOLIO_CUSTOM_CODE_UNACKNOWLEDGED` — acknowledgement missing (warning at save, **error at publish**).
- `PORTFOLIO_CUSTOM_CODE_TITLE_MISSING` — no accessible frame title.
- `PORTFOLIO_CUSTOM_CODE_EXTERNAL_BLOCKED` — external `src`/`href`/`@import`/`fetch` while external requests are off.
- `PORTFOLIO_CUSTOM_CODE_BASE_TAG` — `<base>` is ignored in the sandbox.
- `PORTFOLIO_CUSTOM_CODE_HEADINGS_NOT_INDEXED` — `<h1>`/`<h2>` inside a frame are not indexed.

## Known limitations

- **SEO**: iframe content is not indexed. Keep primary headings, copy and links in normal sections; the block is for interactive extras.
- **CSP via `<meta>`**: the in-frame policy is best-effort. A determined author can remove their own meta tag. The sandbox attribute is the real boundary; the CSP only limits accidental network egress.
- **No build step**: files are concatenated, not bundled. ES module imports and TypeScript do not work yet.
- **No asset upload**: images must be `https:` URLs, same as the rest of the MVP.
- **Storage is browser-local**: values persist per browser/device, not per account, and are capped at 64 KB per section. Cookies and cross-visitor data are not available until phase 2 gives the site its own origin.
- **Cross-origin CSRF surface**: an opaque-origin frame can still issue simple requests to public endpoints. Mutating API routes rely on the existing CSRF token; the public analytics endpoint is rate-limited and non-sensitive. Phase 2 removes this class entirely.

## Phase 2 — separate-origin hosting (designed, not built)

To make custom code fully first-class (indexable, own URLs, no shared-origin requests):

1. Wildcard site origin, e.g. `https://<slug>.sites.x-cron.app`, with its own TLS certificate. Cookies stay scoped to the app origin and never travel to the site origin.
2. Build worker (container or gVisor) that unpacks imports with no network egress, CPU/memory/time caps, and rewrites relative asset URLs.
3. Immutable bundle per publish (`contentHash`), stored on the CDN; the site's "live pointer" is swapped atomically. Rollback = repoint the pointer — the same model as `PortfolioVersionRecord`.
4. Response headers on the site origin: `Content-Security-Policy: sandbox allow-scripts allow-forms; default-src 'none'`, `X-Content-Type-Options: nosniff`, `Cross-Origin-Opener-Policy: same-origin`, `Referrer-Policy: no-referrer`, no `Set-Cookie`.
5. Keep the sandboxed block for the in-editor path; the separate origin serves the full-site path.

## Testing

- `api/src/portfolio/site-schema.spec.ts` → `portfolio custom code sandbox` covers formatting preservation, clamping, unknown props, size rejection, warnings and the publish gate.
- `web/src/app/shared/portfolio-custom-code/portfolio-custom-code.component.spec.ts` → composed document keeps author CSS/JS, storage seed cannot break out of the wrapper script, `srcdoc` is assigned through the property, `allow-same-origin` is never granted, and namespaced storage hydrates the frame.
- Web and mobile builds verify the renderer integration; the frame itself is browser-only by design.
