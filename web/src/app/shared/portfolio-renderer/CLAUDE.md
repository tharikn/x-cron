# Web Portfolio Renderer (`web/src/app/shared/portfolio-renderer`)

Single allow-listed renderer for portfolio section JSON. Used by both the draft editor preview and the public SSR route.

## Rules

- Never bind user HTML. Map section `type` to a fixed template branch; ignore unknown types. The single exception is `custom-code`, which renders through `app-portfolio-custom-code` (sandboxed frame, no `allow-same-origin`) — never with `innerHTML` or `bypassSecurityTrustHtml`.
- Localize text with `localizedValue(value, locale, defaultLocale)`; fall back to the site default locale.
- Sanitize links in the API, but still guard hrefs/images here. External links get `target="_blank" rel="noopener noreferrer"`.
- Theme tokens are isolated as CSS custom properties (`--pf-*`) so they cannot leak into the X Cron shell.
- Keep semantic landmarks, heading order, alt text, skip link, and focus-visible styles intact.
- The mobile package has a deliberate copy of this renderer. When markup changes, mirror it in `mobile/src/app/shared/portfolio-renderer`.
