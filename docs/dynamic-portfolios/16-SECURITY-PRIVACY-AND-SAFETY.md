# Security, Privacy and Safety

## Threat model

Protect against XSS, stored script injection, unsafe URLs, malicious SVG, SSRF through embeds, tenant leakage, IDOR, domain hijacking, upload abuse, cache poisoning, preview token leakage and template supply-chain compromise.

## JSON safety

Never evaluate JSON as code. Validate component type, props, URLs, embeds and resource limits.

## URL policy

Allow only approved protocols such as HTTPS, plus mailto/tel where explicitly supported. Reject javascript, file and other dangerous schemes.

## Tenant isolation

Every mutable resource query must be scoped to workspace/site authorization. Add explicit authorization tests for each resource.

## Rate limits

Apply limits to auth, draft writes, publish, upload intents, domain verification and abuse-sensitive public endpoints.

## Content moderation

Admin tools must support reports and removal for illegal content, impersonation, phishing/malware, abusive content and valid copyright complaints.

## Privacy

Store minimum analytics data required. Do not expose visitor personal information to portfolio owners.

## Security headers

Support CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy and frame-ancestors policy. CSP must match approved embeds.

## Secrets

No secrets in site JSON, template JSON or public runtime payloads.
