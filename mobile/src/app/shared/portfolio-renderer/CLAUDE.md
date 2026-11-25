# Mobile Portfolio Renderer (`mobile/src/app/shared/portfolio-renderer`)

Deliberate copy of the web portfolio renderer. Kept in the mobile package so the feature stays isolated (no new shared lib or monorepo restructuring).

## Rules

- Mirror markup, section coverage, theme tokens (`--pf-*`), and accessibility behaviour from `web/src/app/shared/portfolio-renderer`.
- Never bind user HTML; only allow-listed section types. `custom-code` renders through the sandboxed `app-portfolio-custom-code` frame — never `innerHTML` or `bypassSecurityTrustHtml`.
- Localize with `localizedValue(value, locale, defaultLocale)`.
- External links get `target="_blank" rel="noopener noreferrer"`.
- Any change here requires the same change in the web renderer copy to keep preview/production parity across clients.
