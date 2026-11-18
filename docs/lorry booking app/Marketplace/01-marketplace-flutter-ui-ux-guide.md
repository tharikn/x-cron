# Load Marketplace — Flutter UI/UX Design System & Implementation Prompt

> Product: X Cron Lorry Booking Platform  
> Module: Load Marketplace  
> Client: Flutter  
> Companion: 00-marketplace-system-architecture.md

## 1. Design objective

Create a high-quality mobile-first marketplace that feels as quick and intuitive as a leading mobility app while serving freight workflows. Apply broad mobility-product usability principles—prominent route search, clear action hierarchy, map/list choice, live status, concise cards, trust cues and low-friction repeat actions—but create original X Cron information architecture, component composition, typography, icon treatment, spacing, visual language and copy.

Do not reproduce Uber/Ola screens pixel-for-pixel, brand colors/logos, illustrations, source, wording, proprietary assets or exact interaction sequences. Competitors are usability references only, not design templates.

Primary users include truck drivers using phones in bright daylight, fleet owners comparing vehicles and shippers publishing loads. Optimize for readability, one-handed use, low cognitive load, intermittent networks and varied digital literacy.

## 2. UX principles

1. Route first: pickup and delivery are the first things users scan.
2. Earnings transparent: freight is separate from estimated expenses/net; estimates are never guaranteed profit.
3. Compatibility visible: vehicle fit, capacity, dimensions and timing are easy to understand.
4. Progressive disclosure: cards show decision essentials; details show operational/commercial record.
5. Map/list parity: every map result has an equivalent list result and accessible details.
6. One primary action per screen; secondary actions are quieter.
7. Trust without clutter: verification and completion metrics have clear definitions.
8. Status clarity: text plus icon/color, never color alone.
9. Field-friendly: large targets, strong contrast, readable type, simple language and safe recovery.
10. Original X Cron design; no competitor asset or pixel-copy.

## 3. Information architecture

### Carrier / truck owner bottom navigation

- Home: active vehicle, availability, trip summary and recommended action.
- Find Loads: feed, route search, filters, map/list.
- Backhaul: return opportunities based on active/expected delivery.
- Bookings: offers, confirmed bookings, active trips and history.
- Account: profile, fleet, vehicles, preferences, support and settings.

If testing favors four destinations, combine Home/Account entry points carefully; never hide marketplace or bookings.

### Shipper navigation

- Overview
- Post a Load
- Find Trucks
- Bookings
- Account

Role switcher is explicit for multi-role accounts. Preserve selected role and active vehicle across sessions while allowing quick switching.

## 4. Screen inventory and behavior

### A. Carrier marketplace / Find Loads

Header:
- Compact account identity.
- Active vehicle selector with verification/availability state.
- Location permission indicator and manual place selection fallback.
- Notifications entry.

Route search panel:
- Pickup field (current location or selected place).
- Optional destination field.
- Swap action where relevant.
- Pickup date/time selector.
- Search CTA, recent searches and saved route shortcuts.

Quick categories: Recommended, Nearby pickup, Backhaul, Interstate, Saved. Use selectable horizontal chips; avoid fragmenting the same result set into too many tabs.

Feed:
- Best matches / Available loads.
- Sort and filter actions.
- Result count/applied-filter summary.
- Cards with route, freight, pickup date, vehicle fit, weight, distance and trust cue.
- List/map toggle.
- Pull-to-refresh with stale timestamp and retry.
- Cursor-based infinite scroll; preserve scroll position returning from details.

### B. Load card

Recommended hierarchy:

    [match reason / verified label]                    [save]
    PICKUP CITY  ───────── route line ─────────  DROP CITY
    Pickup date/time                           Delivery window
    ₹ Freight amount                           Fixed / Negotiable
    Vehicle required       Weight       Distance
    [estimated net, only when reliable inputs exist]
    [View details]                              [Make offer]

Rules:
- Route is the strongest visual element.
- Freight is prominent without obscuring route hierarchy.
- Limit metadata chips; prioritize vehicle fit, cargo weight, pickup time and distance.
- Show Fixed or Negotiable explicitly.
- Show Backhaul opportunity only when backend returns a real match reason.
- Omit net estimate if unavailable; never fabricate it.
- Neutral card surfaces, subtle borders/elevation and consistent radius.
- No full-screen color block per card; status is not color-only.

### C. Load details

Sections:
1. Route summary, ordered stops and map preview.
2. Pickup/delivery windows and service time.
3. Cargo: category, description, weight, volume, package count, loading type and special handling.
4. Vehicle requirements: type/body, capacity, dimensions, permits and equipment.
5. Freight/payment: amount, pricing mode, advance/balance terms and responsibility for loading/tolls/other charges.
6. Estimate: distance, fuel/toll assumptions, expenses, estimated net/per-km, timestamp and "estimate only".
7. Shipper: verification, platform tenure and meaningful completion metrics when available.
8. Instructions, attachments and report-listing action.
9. Sticky bottom action: Make offer / Book at fixed price according to backend policy.

Never reveal phone/email before backend authorizes disclosure. UI visibility alone is not authorization; API must decide field exposure.

### D. Filters bottom sheet

Groups:
- Route: pickup place/radius; destination/state/corridor.
- Date: pickup window.
- Vehicle: type, body, capacity, dimensions.
- Cargo: category, weight, loading type, FTL/PTL.
- Commercial: minimum freight, fixed/negotiable, payment terms.
- Trust: verified shipper only.
- Sort: best match, nearest pickup, highest freight, best estimated net, newest.

Behavior:
- Active filter count, Reset and Apply.
- Draft filter state separate from applied state.
- Preserve filters when returning from details.
- Explain zero-result state and suggest widening radius/date.
- Do not repeatedly request location permission; manual search remains available.

### E. Map view

- Same result IDs and eligibility as list.
- Cluster dense markers.
- Marker selection opens compact preview; preview opens details.
- Recenter and return-to-list actions.
- Draw route only when route geometry/estimate exists.
- Loading, permission-denied, offline and provider-error states.
- Map is never the only way to access results.
- Do not continuously track a user just because map is open.

### F. Backhaul

Show context first: expected delivery location/time, active vehicle, preferred return destination/corridor, radius and maximum deviation.

Each result shows:
- Original delivery -> suggested next pickup deadhead segment.
- Suggested pickup -> next delivery.
- Extra pickup detour/deadhead km.
- Total additional distance/time.
- Freight and estimated incremental net.
- Match reasons: corridor fit, pickup proximity, time feasibility and vehicle compatibility.
- View load / Make offer.

A nearby load is not automatically a backhaul match. Empty state offers widen radius, adjust corridor or enable alerts. Thresholds are configurable and user-controlled.

### G. Offer and negotiation

- Offer amount, currency and fixed/negotiable context.
- Optional message, availability and selected vehicle.
- Counter-offer history in chronological order, actor and timestamp.
- Expiry from server timestamp with timezone-safe rendering.
- Confirmation before submit, withdraw or accept.
- Disable duplicate taps while request is pending.
- On conflict, refresh state and explain what changed.
- Never show booking confirmed until API confirms.

### H. Booking and trip states

Map backend states to clear user labels:
- Offer pending
- Counter-offer received
- Accepted / booking confirmed
- Vehicle/driver assigned
- Pickup pending
- Loaded / in transit
- Delivered
- Completed / closed
- Cancelled / expired / issue reported

Show timeline, timestamps and actor. Driver operational actions are separate from owner commercial actions. Add proof upload only when backend requires it.

### I. Shipper: Post a Load

Step flow:
1. Pickup and delivery stops.
2. Cargo and handling.
3. Vehicle requirements.
4. Pickup/delivery windows.
5. Freight and payment terms.
6. Instructions and optional documents.
7. Review and publish.

- Safe draft autosave and saved/unsaved indicator.
- Progress; allow backward navigation without data loss.
- Inline validation and review summary.
- Address autocomplete, manual correction and map-pin adjustment.
- Units visible for weight/dimensions.
- Mandatory vs optional fields explained.
- Confirm publication and show next action (review offers).
- Do not force every advanced field onto the first screen.

### J. Shipper: Find Trucks

Search by pickup/radius, destination corridor, pickup window, vehicle type/capacity, body type and verification. Cards show vehicle fit, availability freshness, carrier trust and route suitability. Respect carrier privacy; do not expose driver personal details without authorization.

## 5. Visual styling guide

Audit the existing Flutter theme first and reuse it if sound. If no design system exists, use the following original X Cron neutral logistics direction as a starting proposal; validate it with users.

### Color tokens

| Token | Suggested value | Usage |
|---|---|---|
| Brand primary | #172B4D | Primary navigation/action emphasis |
| Brand accent | #2563EB | Links, selected controls, map focus |
| Success | #15803D | Verified/completed/positive |
| Warning | #B45309 | Pending/attention |
| Danger | #B91C1C | Destructive/error |
| App background | #F6F7F9 | Main canvas |
| Surface | #FFFFFF | Cards/sheets |
| Text primary | #17202A | Main text |
| Text secondary | #667085 | Supporting text |
| Border | #E4E7EC | Dividers/outlines |

These are proposed tokens, not competitor brand reproduction. Validate WCAG 2.2 AA contrast and adjust where needed. Do not hard-code colors in individual widgets. Add dark theme only when ready to test it.

### Typography

- Highly legible sans-serif available on Android/iOS (platform system font or licensed bundled family).
- Semantic styles: display, page title, section title, card title, body, label, caption, numeric emphasis.
- Tabular figures for freight, weight, distance and timestamps where supported.
- Sentence case, plain language and short labels.
- Avoid all-caps long labels.
- Respect system text scaling; prevent clipping.

### Spacing and shape

Use an 8-point base scale: 4, 8, 12, 16, 24, 32. Suggested page padding 16–20dp, card padding 16dp, section gap 24dp, field gap 8–12dp. Consistent radii: 8dp controls, 12–16dp cards, 20dp sheets. Use subtle elevation only where it clarifies hierarchy. Avoid excessive gradients, glass effects, oversized decorative illustrations and unnecessary animation.

### Touch and accessibility

- Minimum touch target 48x48dp.
- WCAG 2.2 AA contrast.
- Semantic labels for icons and controls.
- Never rely on color alone.
- Keyboard/focus behavior for external keyboards.
- Screen-reader labels and meaningful traversal order.
- Validation text close to the field.
- Haptics sparingly for confirmed actions, not every tap.

### Iconography and imagery

Use one consistent icon family/stroke weight. Give icons labels or accessible semantics when meaning is unclear. Use permissioned logistics imagery only where it adds value; avoid stock-photo filler on every card. Never use competitor logos/assets.

## 6. Flutter implementation guidance

Inspect existing Flutter project before selecting state management, routing, networking, serialization, maps or design-system libraries. Reuse sound existing standards; do not add competing packages.

Suggested feature separation:

    features/marketplace/
      presentation/   screens, widgets, state
      application/    controllers, notifiers, use cases
      domain/         typed models and client policies
      data/           API client, DTO mapping, repositories
    core/
      design_system/
      network/
      location/
      navigation/

Guidelines:
- Typed immutable models and explicit DTO-to-domain mapping.
- Separate API DTOs from view models where transformation is needed.
- Repository abstractions for search, details, offers, bookings and backhaul.
- Explicit loading, empty, error, offline, stale and permission-denied states.
- Debounce place search; cancel stale requests when filters change.
- Cursor pagination and item deduplication by ID.
- Cache only safe recent results locally; refresh authoritative status before booking.
- Secure token storage consistent with existing auth.
- Never store sensitive documents/full contact data in plain preferences.
- No business calculations in widgets; display server estimates with assumptions.
- WebSocket/push only for timely updates; REST is recovery source.
- Analytics without PII: search, filter, details, offer started/submitted, booking confirmed.
- Map API errors to actionable messages; retain correlation ID for support.

## 7. API/UI contract alignment

Follow 00-marketplace-system-architecture.md. Flutter must support search filters/cursors, role-aware list/detail, applied filters and match reasons, offer/counter/withdraw/accept states, booking lifecycle, backhaul reasons/deviation, earnings assumptions/freshness and stable error codes.

Never hard-code sample loads, counts, freight or live badges in production. Keep demo fixtures isolated to demo/dev environments and visibly label them.

## 8. Responsive behavior and performance

- Design for common Android phone widths first, then adapt to larger phones/tablets.
- No horizontal overflow on narrow screens or large text.
- Lazy lists and bounded image thumbnails.
- Avoid rebuilding entire feed when one card's saved state changes.
- Debounce search and cancel outdated requests.
- Cluster map markers and dispose controllers/listeners.
- Pagination, request timeouts, retry rules and offline messaging.
- Avoid excessive polling; push/WebSocket reconnects use backoff.
- Show last-updated time for potentially stale results.

## 9. Localization for India

- Locale-aware INR currency and number grouping.
- Explicit units for weight (kg/tonne), dimensions and distance.
- Store UTC; display selected/local timezone with unambiguous date/time.
- Support Indian states, districts, PIN codes and local address conventions.
- Keep strings in localization resources; do not concatenate translated sentences.
- Plan for Tamil, Hindi and other languages with expandable layouts.
- Use simple operational wording and explain logistics terms where needed.

## 10. UI states and microcopy

Every screen includes loading skeleton, useful empty state, retryable error, offline/stale state, permission-denied state, disabled-action reason and server-confirmed success. Include conflict state when a load is booked/expired by another user.

Example copy:
- "No loads match these filters." / "Try widening the pickup radius."
- "This load is no longer available." / "Refresh results to see current loads."
- "Location access is off." / "Choose a pickup city instead."
- "Your offer was sent." / "Track replies in Bookings."

Do not claim success before API acknowledgement.

## 11. Design QA checklist

- Route/freight hierarchy is immediately understandable.
- Vehicle compatibility is clear without opening each result.
- Search works with and without location permission.
- List/map use consistent result IDs and statuses.
- Filters are grouped, editable and preserved.
- Details disclose commercial assumptions and payment terms.
- Backhaul shows deadhead, route deviation and match reason.
- Contact is hidden until API authorization.
- Offer/booking actions prevent duplicate submissions.
- Long city names and large values are tested.
- Large text, screen readers, contrast and touch targets pass.
- Loading, empty, error, offline and stale states are designed.
- No competitor assets, logos, exact layouts or copied text.

## 12. Agentic AI implementation prompt

Before implementation:
1. Inspect Flutter structure, navigation, state management, API client, theme, localization, maps and Profile/vehicle onboarding.
2. Reuse established identity, vehicle and fleet models; do not duplicate profile or vehicle forms.
3. Review backend API contract and report missing endpoints before coding against assumptions.
4. Produce screen flow and component inventory; build tokens/reusable components first.
5. Implement vertical slices: Find Loads -> Details -> Offer -> Booking -> Backhaul -> Shipper Post Load -> Find Trucks.
6. Include loading/empty/error/offline/permission and accessibility states in each slice.
7. Use real API responses outside isolated demo fixtures.
8. Use broad usability inspiration only; keep original X Cron design.
9. Add widget, unit and integration tests; use golden screenshots if project supports them.
10. Update this document when decisions materially change.

## 13. Definition of done

- Carrier and shipper experiences are distinct but share one marketplace domain.
- Core screens work on supported Android/iOS devices.
- Search, list/map, filters, details, offers, bookings and backhaul use documented APIs.
- Freight is distinct from estimates and estimate assumptions are visible.
- Actions reflect server-confirmed state.
- Offline/loading/empty/error/permission states are complete.
- Accessibility, localization, responsive and performance checks pass.
- Visual system is consistent and original to X Cron.
