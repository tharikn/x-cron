# Domain, Subdomain and Routing

## Platform URL

Every site receives a platform URL such as username.xcron.example or site-slug.xcron.example. The actual platform domain is environment-configured.

## Custom domains

Future paid capability: example.com and www.example.com.

## Domain binding

Store domain, siteId, verification state, DNS challenge metadata, TLS state, createdAt and verifiedAt.

## Verification

Use DNS TXT/CNAME verification. Never trust a user-provided domain without proof of ownership.

## Routing

host -> verified domain binding -> site ID -> published version -> locale/path.

## Slug rules

Lowercase, URL-safe, reserved words blocked, unique and stable unless explicitly changed.

## Domain changes

Verify ownership, attach domain, provision/validate certificate, warm routing and optionally preserve redirects.

## Security

Prevent host-header injection and cross-tenant routing leakage. Public host resolution must use explicit verified bindings.
