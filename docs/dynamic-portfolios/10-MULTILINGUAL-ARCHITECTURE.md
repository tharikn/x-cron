# Multilingual Architecture

## Principle

Users author and maintain native content for multiple locales. Do not depend on request-time machine translation.

## Locale model

Each site stores:
- defaultLocale
- enabledLocales
- locale metadata
- fallback chain
- locale-specific SEO
- locale navigation

Examples: en-IN, ta-IN, ml-IN, hi-IN.

## Content

Localized fields are maps from locale code to native content.

## Fallback

Exact locale -> language fallback -> site default locale -> safe empty value.

## Editor

Users can add/remove locales, switch locale, see missing fields, copy content from another locale as a starting point and preview each locale.

## URL strategy

Default locale can use root path. Additional locales can use /ta/ or /ta-in/. The chosen strategy must remain stable.

## SEO

Each locale needs title, description, canonical, hreflang, social metadata and appropriate structured data.

## Typography

Use language-specific fallback stacks. Test Latin, Tamil, Malayalam, Hindi and other supported scripts.

## Publish validation

Block or warn on missing required localized content, invalid locale codes, broken localized links and duplicate localized routes.
