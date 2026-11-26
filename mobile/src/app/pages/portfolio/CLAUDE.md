# Mobile Portfolio Pages (`mobile/src/app/pages/portfolio`)

Ionic/Capacitor pages for Dynamic Portfolios. Routes: `/tabs/portfolio` (list/create) and `/tabs/portfolio/:id` (full visual editor). Linked from Account → My portfolios.

## Scope

- The mobile editor is a touch-first, Canva-style canvas: tap a section to select it, edit text inline, drag the grip to reorder, and use bottom sheets for properties, design, section picker, and layers.
- Changes are explicit: **Save** writes a draft with the current revision; **Publish** saves, validates, then publishes. Validation issues are shown on the canvas and in the status row.
- Registry field keys and defaults come from the API component registry. Keep them aligned with `api/src/portfolio/component-registry.ts`.
- API client is portfolio-local (`core/services/portfolio.service.ts`); no auth service changes were needed.

## Rules

- Do not add shared i18n keys; copy is local English literals.
- The editor and public preview use the mobile renderer copy in `shared/portfolio-renderer`. Keep that copy in sync with the web renderer.
- Add no new heavy dependencies; the editor is built from Ionic/Angular primitives already present in the app.
- Publish/unpublish and version history remain available on web; mobile surfaces status and share.
