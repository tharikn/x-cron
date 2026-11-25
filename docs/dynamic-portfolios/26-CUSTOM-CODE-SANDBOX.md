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
- Web and mobile builds verify the renderer integration; the frame itself is browser-only by design.
