# Product Scope and User Flows

## Personas

- Developer/software engineer
- UI/UX designer
- Photographer
- Writer
- Student/graduate
- Researcher/academic
- Product manager
- Freelancer
- Consultant
- Artist/creator
- Content creator
- Agency/studio
- General professional

## Create journey

1. Sign in.
2. Choose Create Portfolio.
3. Select template or starter.
4. Select primary locale and optional locales.
5. Enter/import profile content.
6. Configure sections.
7. Customize theme.
8. Preview desktop/tablet/mobile.
9. Validate links, content and accessibility.
10. Save draft.

## Publish journey

1. Open Publish.
2. Run deterministic validation.
3. Show blocking errors and non-blocking warnings.
4. Choose public slug/subdomain.
5. Create immutable published snapshot.
6. Generate/read-cache public representation.
7. Verify health URL.
8. Show public URL.

## Editing

Editing creates a new draft. Current public version remains unchanged until a successful publish.

## Rollback

Selecting an old version creates a new publish operation from that snapshot. History is never mutated.

## Duplicate

Duplicating creates a new site with new site ID, domain bindings and analytics identity while copying permitted content.

## Functional scope

Site dashboard, template catalog, template preview, site creation, page/section management, component editing, theme editing, media, localization, autosave, preview, validation, publish, unpublish, version history, rollback, public runtime, SEO, sitemap, analytics, domains, sharing and admin template governance.

## Non-goals for v1

- Arbitrary HTML execution
- Arbitrary JavaScript injection
- Full ecommerce platform
- Full visual Figma replacement
- Unlimited custom server code
- Machine translation as the only multilingual mechanism

## Acceptance

A non-technical user can publish a polished portfolio from a template without editing HTML/CSS. A published URL works without login.
