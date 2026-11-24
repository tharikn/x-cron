# Public Runtime Renderer

## Goal

Render published JSON as a safe, fast public website.

## Pipeline

Request -> route resolution -> published version lookup -> cache -> JSON validation -> component renderer -> SEO/head -> response.

## Delivery preference

Prefer static/edge-friendly output for published content. Dynamic server rendering is a fallback for content that requires it.

## Security boundary

The renderer accepts only validated published JSON.

It must:
- allow only registered components
- sanitize URLs
- reject dangerous protocols
- escape text
- prevent arbitrary script/style injection
- allow external embeds only from an approved list

## Cache key

Use a key based on site ID, published version ID, locale, path and theme mode. Immutable version IDs allow long-lived caching.

## Public features

Navigation, locale switch, theme mode, profile, projects, skills, experience, education, testimonials, gallery, social/contact links and optional resume download.

## Failure handling

Component failure logs context and renders a safe fallback. Stack traces never reach visitors. Draft data is never exposed.

## Bundle separation

Public runtime must not ship editor/admin/drag-drop code.
