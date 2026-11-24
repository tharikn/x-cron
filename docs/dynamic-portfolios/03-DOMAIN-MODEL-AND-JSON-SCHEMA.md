# Domain Model and JSON Schema

## Canonical rule

Portfolio documents are JSON-first. PostgreSQL stores structured JSONB as the canonical site document. HTML is always derived.

## Entities

User, Workspace, PortfolioSite, PortfolioDraft, PortfolioVersion, Template, TemplateVersion, Page, Section, Component, Theme, Locale, MediaAsset, DomainBinding, PublishJob, AnalyticsProperty and SubscriptionEntitlement.

## Example site document

{
  "schemaVersion": "1.0",
  "site": {
    "id": "site_123",
    "slug": "jane-doe",
    "defaultLocale": "en-IN",
    "locales": ["en-IN", "ta-IN"],
    "template": {
      "id": "creative-editorial-01",
      "version": "1.0.0"
    }
  },
  "theme": {
    "mode": "system",
    "tokens": {
      "primary": "#111111",
      "accent": "#6C5CE7",
      "surface": "#FFFFFF",
      "text": "#111111",
      "fontHeading": "Inter",
      "fontBody": "Inter",
      "radius": "lg",
      "density": "comfortable"
    }
  },
  "navigation": [
    {
      "id": "nav-home",
      "label": {
        "en-IN": "Home",
        "ta-IN": "முகப்பு"
      },
      "target": "/"
    }
  ],
  "pages": [
    {
      "id": "home",
      "path": "/",
      "seo": {
        "title": {
          "en-IN": "Jane Doe | Portfolio"
        }
      },
      "sections": [
        {
          "id": "hero-1",
          "type": "hero",
          "variant": "split-media",
          "props": {
            "headline": {
              "en-IN": "Designing useful digital products"
            }
          }
        }
      ]
    }
  ]
}

## Localized value

A localized value is a map from locale code to native content.

{
  "en-IN": "Product Designer",
  "ta-IN": "தயாரிப்பு வடிவமைப்பாளர்"
}

Fallback is exact locale -> language fallback -> site default locale -> safe empty value.

## Component contract

Every component requires:
- stable type
- schema version
- variant
- validated props
- accessibility contract
- responsive behavior
- supported locales
- supported token usage
- allowed child types

## Validation

Validate at API ingress, draft save, publish and renderer boundaries. Unknown component types or unsafe properties are rejected.

## Database strategy

Relational columns for query-heavy metadata. JSONB for flexible site documents and template definitions.

## Migration

Every schema change requires a version, migration function, fixture, automated migration test and rollback strategy. Never silently reinterpret an old document.
