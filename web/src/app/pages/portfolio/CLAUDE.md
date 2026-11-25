# Web Portfolio Editor (`web/src/app/pages/portfolio`)

Signed-in draft editor for Dynamic Portfolios. Routes: `/portfolio` (list), `/portfolio/new` (three-step creation wizard) and `/portfolio/:siteId` (editor, step 3 of the flow).

## Isolated by design

- Only imports portfolio-local model, service, guard, and renderer. No job-portal service or shared guard was modified.
- UI copy is English literals in this folder; do not add shared i18n keys for this feature.
- State is local (`signal`/`computed`). Draft writes are revision-aware; stale writes surface a conflict with a reload action.
- The preview embeds `PortfolioRendererComponent`, the same component used by the public page. Keep preview/production parity.

## Key files

- `portfolio-list.page.*` — open, publish status, delete; entry point for the wizard.
- `portfolio-wizard.page.*` — step 1 choose a design, step 2 name/slug/languages, step 3 create the draft and open the editor.
- `portfolio-wizard-stepper.component.*` — shared step indicator; locked with step 3 active in the editor.
- `portfolio-editor.page.*` — section tree, schema-driven property forms, theme, locale, device preview, undo/redo, debounced autosave, validation, publish/unpublish/rollback, insights.

## Rules

- Do not bind user HTML anywhere except the `custom-code` section, which renders through the sandboxed `app-portfolio-custom-code` frame. Section fields come from `GET /v1/portfolio/components`.
- Flush pending autosave before publishing or rolling back.
- Theme colors must stay valid hex; fonts must stay in the allowed list enforced by the API.
