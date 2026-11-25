# Mobile Portfolio Pages (`mobile/src/app/pages/portfolio`)

Ionic/Capacitor pages for Dynamic Portfolios. Routes: `/tabs/portfolio` (list/create) and `/tabs/portfolio/:id` (preview + quick edit). Linked from Account → My portfolios.

## Scope

- Full section/property editing is web-only in this MVP. Mobile covers list, create from template, preview, and quick Hero/About text edits.
- Quick edits use registry field keys (`headline`, `subheadline`, `body`) and must stay aligned with the API component registry.
- API client is portfolio-local (`core/services/portfolio.service.ts`); no auth service changes were needed.

## Rules

- Do not add shared i18n keys; copy is local English literals.
- Preview uses the mobile renderer copy in `shared/portfolio-renderer`. Mirror renderer changes from web.
- Publish/unpublish and version history are available on web; mobile surfaces status and share only.
