# 19 — Advanced Predefined Resume Template Catalogue (50+)

## 1. Product requirement

The first production catalogue must include **at least 50 complete, polished, predefined resume templates**. This is a launch requirement, not a future enhancement. Templates must be genuinely different in layout hierarchy and use case, not merely recolored copies.

The catalogue/gallery is a separate authenticated feature and route. It is not the dashboard and not the preview screen.

## 2. Catalogue composition

Initial target: 60 templates across the following families.

| Family | Count | Template concepts |
|---|---:|---|
| ATS classic / single column | 10 | Classic chronological; clean professional; compact ATS; minimal serif; modern ATS; skills-forward ATS; achievement-led ATS; academic ATS; entry-level ATS; senior ATS |
| Modern professional | 8 | Modern split header; elegant minimal; bold section header; editorial; refined serif; clean geometric; contemporary mono; structured timeline |
| Technology / software | 8 | Software engineer; full-stack developer; frontend engineer; backend engineer; DevOps/SRE; data engineer; cybersecurity; QA/automation |
| Business / corporate | 6 | Business analyst; project manager; operations manager; product manager; consultant; finance professional |
| Leadership / executive | 5 | Executive concise; director profile; senior leadership; strategy leader; board/advisor profile |
| Graduate / early career | 5 | Graduate; internship; student project-led; career starter; academic-to-industry |
| Creative / portfolio | 5 | Graphic designer; UX/UI designer; creative director; content/brand specialist; portfolio-led |
| Sales / customer / HR | 4 | Sales leader; account executive; customer success; HR/recruitment |
| Healthcare / education / public service | 4 | Healthcare professional; educator; researcher; public-service profile |
| International / regional | 5 | International CV; Europass-inspired structured CV; bilingual-ready layout; India professional CV; compact global CV |
| **Total** | **60** | **At least 50 must be release-ready** |

The names above define distinct template starting points. Final catalogue records should include unique IDs, thumbnail, layout, theme, use-case guidance and ATS/readability notes.

## 3. Template package architecture

Templates are declarative, immutable, versioned packages. Never store templates as screenshots or accept arbitrary HTML/JavaScript from users.

Each package contains:
- manifest: ID, slug, display name, description, category, tags, version, schema version, supported locales/page sizes, renderer compatibility, ATS profile and thumbnail reference.
- layout: semantic regions, columns, section order, spacing, alignment and pagination constraints.
- theme: typography, font assets, sizes, colors, borders, spacing tokens and icon policy.
- section map: supported section types and presentation variants.
- assets: licensed thumbnail/font/icon assets.
- compatibility: supported PDF/DOCX/HTML formats and known limitations.
- test fixtures: sample structured resume data and expected render snapshots.

Keep source packages in Git. Publish immutable package versions to the runtime catalogue. A published version is never edited in place.

## 4. Categories and filters

Provide filters for:
- Career level: student, entry, mid, senior, executive.
- Industry/role: technology, business, finance, healthcare, education, creative, sales, HR, public service.
- Layout: single-column, two-column, timeline, compact, portfolio.
- Style: classic, modern, minimal, formal, creative.
- ATS profile: ATS-first, balanced, visual/portfolio.
- Page format: A4 and Letter.
- Language/script support.

Each card shows thumbnail, name, category, best-use description, page format, ATS-readability label and preview action. Never promise a template will pass every ATS.

## 5. Template selection and preview

- User must be authenticated to browse/use templates.
- Gallery selection creates or updates a resume's template reference.
- Selecting a template does not overwrite resume content.
- Provide a separate Preview route using the exact selected template version.
- Let the user compare templates without duplicating the underlying career profile.
- Show warnings for two-column/graphics-heavy templates that may parse less reliably in some ATS systems.

## 6. ATS and accessibility guidance

Every template must declare an ATS profile:
- ATS-first: single-column, conventional headings, selectable text, simple bullets, no critical content in graphics.
- Balanced: moderate visual styling while retaining reading order.
- Visual/portfolio: intended for creative presentation; clearly warn about parser limitations.

All templates must use semantic headings, readable contrast, selectable text, logical reading order, accessible font sizes and keyboard-friendly editor controls. Do not encode text as images.

## 7. Versioning and publication

Publication pipeline:
1. Validate manifest and JSON schemas.
2. Check required assets and licenses.
3. Render sample fixtures through preview and export renderers.
4. Run accessibility and ATS structure checks.
5. Run visual regression tests for A4 and Letter.
6. Assign immutable version and publish.
7. Keep previous versions available for resumes that reference them.

Store template metadata/version status in PostgreSQL; keep source package definitions in Git and serve static assets from bundled resources or a low-cost CDN. User selection stores template ID/version and validated overrides, not a copied template package.

## 8. Suggested data model

- Template: id, slug, name, category, status, tags.
- TemplateVersion: templateId, version, schemaVersion, manifest, layout, theme, compatibility, publishedAt.
- TemplateAsset: templateVersionId, assetKey, assetType, license, sourcePath.
- ResumeDesignConfig: resumeId, templateId, templateVersion, validatedOverrides.

## 9. Delivery and quality gates

- Release gate: at least 50 finished templates; target catalogue is 60.
- Every template has a thumbnail, unique layout identity, use-case description and ATS label.
- All 50+ templates render through the dedicated Preview feature.
- Every template supports the documented export formats or clearly declares limitations.
- No template contains executable user-supplied code.
- Template upgrades do not silently alter existing resumes; explicit migration or version selection is required.