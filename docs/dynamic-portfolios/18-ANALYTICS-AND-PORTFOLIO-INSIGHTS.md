# Analytics and Portfolio Insights

## Metrics

- page views
- privacy-preserving unique visits
- referrer category
- device category
- locale
- top pages
- outbound clicks
- resume/download clicks
- contact CTA clicks
- engagement metrics where legally appropriate

## Architecture

Public page -> lightweight event endpoint -> queue/buffer -> aggregation -> analytics storage.

Analytics is asynchronous and never blocks rendering.

## Privacy

Do not retain raw IP addresses longer than necessary. Prefer aggregation and privacy-preserving identifiers. Provide retention and opt-out controls where required.

## Dashboard

Show visits over time, popular pages, referrers, locale distribution and CTA performance.

## Failure behavior

Analytics outage must not affect public page availability.

## Authorization

Portfolio owners see analytics only for their own workspace/sites.
