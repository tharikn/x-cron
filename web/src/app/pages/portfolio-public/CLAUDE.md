# Public Portfolio Runtime (`web/src/app/pages/portfolio-public`)

Server-rendered public page at `/p/:slug`. Reads only the immutable published JSON from `GET /v1/portfolio/public/:slug`; draft content can never reach this route.

## Rules

- Use `PortfolioRendererComponent` from `shared/portfolio-renderer` — never a second markup implementation.
- SEO metadata and JSON-LD come from the API payload via `SeoService.setPage`, `setStructuredData`, and `setSocialImage`.
- Analytics beacons are fire-and-forget and browser-only (`isPlatformBrowser`). Never send them during SSR.
- `?locale=` is honoured only when the site declares that locale; otherwise the site default is used.
- No auth headers on this route. Keep it cacheable and anonymous.
