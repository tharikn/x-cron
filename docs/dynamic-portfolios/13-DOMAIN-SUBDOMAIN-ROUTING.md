# Domain, Subdomain and Routing

## MVP implementation status

The shipped MVP serves public portfolios from the platform path `/p/:slug` (anonymous, no auth). Subdomain routing is deferred; custom domain binding and verification are implemented for published sites.

## Platform URL

Every site receives a platform URL such as username.xcron.example or site-slug.xcron.example. The actual platform domain is environment-configured.

## Custom domains

Optional capability: example.com and www.example.com, bound only after DNS ownership verification.

Implemented: `POST /v1/portfolio/domains` issues a TXT (`_xcron.<host>` → `xcron-verify=<token>`) or CNAME (`<host>` → `<token>.cname.xcron.app`) ownership challenge; `POST /v1/portfolio/domains/:domainId/verify` accepts the published record value and promotes the binding to `verified`; `DELETE /v1/portfolio/domains/:domainId` detaches it.

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
