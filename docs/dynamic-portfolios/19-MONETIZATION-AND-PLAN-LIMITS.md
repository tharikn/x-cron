# Monetization and Plan Limits

## Example tiers

### Free
- limited published portfolios
- platform subdomain
- core template catalog
- standard sections
- basic multilingual support
- basic analytics
- X Cron branding

### Pro
- more sites
- full template catalog
- custom domain
- advanced analytics
- branding removal
- advanced sections
- larger media limits

### Studio
- team collaboration
- client workspaces
- white-label
- advanced permissions and domain controls

## Entitlement engine

Do not scatter plan checks throughout the UI. Use a centralized feature + plan + usage + policy evaluation. Backend is authoritative.

## Usage counters

Published sites, storage bytes, traffic, domains, analytics retention and collaborators.

## Graceful limits

Show current usage and exact limit. Block only the operation requiring more quota. Never take an already published site offline just because a user reaches a soft usage threshold.
