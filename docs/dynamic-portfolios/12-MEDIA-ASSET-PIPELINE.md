# Media Asset Pipeline

## Supported assets

JPEG, PNG, WebP, AVIF and sanitized SVG. Fonts come from an approved catalog or controlled upload pipeline.

## MVP implementation status

The shipped MVP implements a URL-based asset registry instead of the binary upload pipeline described below: clients submit an `http(s)` image URL (`POST /v1/portfolio/media`), assets are stored per user, and `DELETE /v1/portfolio/media/:assetId` removes them. The spec's signed-URL intent/complete upload flow and async optimized variants are deferred.

## Upload flow

1. Request upload intent.
2. Validate declared metadata.
3. Upload directly to object storage using a short-lived signed URL.
4. Validate content and security.
5. Generate optimized variants asynchronously.
6. Store metadata.
7. Mark asset ready.

## Image variants

Generate responsive widths such as thumbnail, 480, 768, 1024 and 1440, plus original when allowed.

## Rendering

Use width/height, responsive srcset, lazy loading below the fold and eager loading only for important LCP media.

## Alt text

Alt text is structured content. Allow meaningful alt, decorative flag and empty alt for decorative images.

## Security

Validate content type and magic bytes, scan where available, sanitize SVG, enforce size limits, use signed access and never expose an uncontrolled upload bucket.

## Deletion

Prevent physical deletion while an asset is referenced or until retention rules allow removal.

## Cost

Deduplicate by content hash and avoid unnecessary image variants.
