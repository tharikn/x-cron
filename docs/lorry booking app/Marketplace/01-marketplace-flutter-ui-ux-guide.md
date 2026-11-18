# Load Marketplace — Flutter UI/UX Design Guide

Product: X Cron Lorry Booking Platform  
Scope: Core Load Marketplace only  
Client: Flutter  
Backend: 00-marketplace-system-architecture.md

## 1. Design objective

Design an original freight-load marketplace for shippers and transporters. Use broad mobility-product usability principles—fast search, strong route hierarchy, concise result cards, clear filters, map/list parity and predictable navigation—without copying Uber/Ola branding, assets, screen layouts, wording or proprietary interaction patterns.

This guide covers load publishing and load discovery only. Backhaul, negotiation, booking, payments, tracking and trip operations belong to separate modules and must not appear as implemented Marketplace features.

Prioritize Android phones, bright outdoor use, one-handed interaction, low cognitive load, intermittent connectivity and varied digital literacy.

## 2. Marketplace journeys

Transporter:
1. Open Find Loads.
2. Select an active vehicle from existing Profile/Fleet data.
3. Search by pickup, destination and date.
4. Refine with filters and list/map view.
5. Compare cards and open load details.
6. Save a load or hand off to the separately implemented enquiry/transaction flow.

Shipper:
1. Open My Listings.
2. Create a draft.
3. Enter route, cargo, vehicle requirements, schedule and freight terms.
4. Review and publish.
5. View, edit, pause, resume or withdraw own listings.

Use the app's existing role switcher and navigation where possible. Do not duplicate profile, fleet or vehicle onboarding.

## 3. Screens and information architecture

Marketplace destinations, nested within the existing app navigation:
- Find Loads — transporter discovery feed.
- Post a Load — shipper creation flow.
- My Listings — shipper's own drafts and published listings.
- Saved Loads — transporter's saved items.
- Search Preferences — saved filters/searches, if enabled.

### A. Find Loads

Header:
- Page title and concise location context.
- Active vehicle selector using existing verified vehicle data.
- Manual location selection and permission state.
- Search history or saved-search shortcut.

Search panel:
- Pickup location.
- Optional destination.
- Pickup date/date range.
- Search action.

Feed controls:
- Result count, sort, filter with active count, list/map toggle.
- Applied-filter chips with remove/clear behavior.
- Cursor-paginated cards, pull-to-refresh and last-updated indication.
- Preserve scroll position when returning from details.

Do not add Backhaul, earnings, booking status or live-trip widgets.

### B. Load result card

    [Verified shipper]                         [Save]
    PICKUP CITY  ───────── route line ───  DROP CITY
    Pickup date / time                    Number of stops
    ₹ Freight amount                      Fixed / Negotiable
    Required vehicle       Cargo weight   Listing age
    [View load details]

Design rules:
- Pickup and destination are the strongest visual anchors.
- Freight amount is prominent and formatted in INR.
- Show vehicle type, cargo weight, pickup window and stop count.
- Show fixed/negotiable pricing clearly.
- Compatibility label only when backend provides it: Compatible, Not compatible or Needs verification.
- Never fabricate match percentages, road distance, net earnings or availability.
- Save is secondary and has a clear selected state.
- Keep metadata compact; avoid excessive chips.

### C. Load details

Sections:
1. Route: ordered pickup/delivery stops, permitted address detail and map preview.
2. Schedule: pickup/delivery windows and stop instructions.
3. Cargo: category, description, weight, volume, package count and handling.
4. Vehicle requirements: type/body, capacity, dimensions and mandatory equipment/permits.
5. Freight: amount, currency, fixed/negotiable mode and shipper-provided payment/loading notes.
6. Shipper summary: approved display name and verification status.
7. Attachments: preview/download only through authorized short-lived URLs.
8. Listing metadata: reference code, published/updated time and status.
9. Marketplace action: Save load. Any enquiry action must hand off to the separate transaction module.

Never expose phone/email, private exact addresses or document URLs unless backend authorizes disclosure. Hiding a field in Flutter is not a security control.

### D. Filters bottom sheet

Groups:
- Pickup: place/city/state and radius.
- Destination: place/city/state.
- Date: pickup date or range.
- Vehicle: type/body/capacity.
- Cargo: category, weight range and loading type.
- Freight: minimum/maximum and fixed/negotiable.
- Trust: verified shipper only.
- Sort: relevance, nearest pickup, highest freight, newest.

Behavior:
- Keep draft filter values separate until Apply.
- Show active count, Reset and Apply.
- Preserve filters when opening/closing details.
- Allow individual filter-chip removal.
- Explain zero results and suggest widening pickup radius/date or clearing a restrictive filter.
- Manual place search works without location permission.

### E. Map view

- Use the same search result IDs and eligibility as list view.
- Cluster dense markers.
- Marker selection opens a compact preview; preview opens details.
- Provide recenter and return-to-list actions.
- Draw route lines only when geometry is supplied by an approved location integration.
- Handle loading, offline, denied permission and provider failure.
- Map is never the only way to browse.
- Do not start continuous tracking because the map is open.

### F. Post a Load

Progressive multi-step form:
1. Route and stops — pickup, delivery and optional additional stops.
2. Cargo — category, description, weight, dimensions/volume, package count and handling.
3. Vehicle requirement — type/body, capacity and required equipment.
4. Schedule — pickup/delivery windows and stop service notes.
5. Freight — amount, currency, fixed/negotiable and shipper-provided payment/loading terms.
6. Attachments/instructions — optional files and notes.
7. Review and publish.

Requirements:
- Save draft and resume later.
- Show progress and allow backward navigation without data loss.
- Validate inline and show a review summary.
- Address autocomplete plus manual correction/map pin where supported.
- Make units explicit (kg, tonnes, cm/ft).
- Mark mandatory vs optional fields.
- Prevent duplicate publish taps.
- Confirm only after server acknowledgement.
- After publishing, navigate to My Listings; do not imply a booking has been made.

### G. My Listings

Tabs or filters:
- Draft
- Published
- Paused
- Expired
- Withdrawn

Each card shows route, cargo, freight, published/updated time and status. Owner actions depend on server state: Continue draft, Edit, Pause, Resume or Withdraw. Confirm destructive actions and collect a reason if policy requires it. Show moderation-hidden/review-required states with a safe explanation.

### H. Saved Loads and Search Preferences

Saved Loads:
- Reuse the same listing card component.
- Label expired/withdrawn items and disable unavailable actions.
- Allow unsave.

Search Preferences:
- Save current filters with an optional name.
- Edit and delete saved searches.
- Enable/disable alerts only if backend notification support exists.
- Do not imply alerts are active until backend confirms.

## 4. Visual styling guide

Audit the existing Flutter theme first and reuse sound tokens. If no design system exists, establish the original X Cron visual direction below and validate it on devices.

### Color tokens

| Token | Suggested value | Usage |
|---|---|---|
| Brand primary | #172B4D | Primary actions and navigation emphasis |
| Brand accent | #2563EB | Links, selected controls and map focus |
| Success | #15803D | Verified/positive status |
| Warning | #B45309 | Review/pending status |
| Danger | #B91C1C | Destructive/error status |
| App background | #F6F7F9 | Main canvas |
| Surface | #FFFFFF | Cards and sheets |
| Text primary | #17202A | Main text |
| Text secondary | #667085 | Supporting text |
| Border | #E4E7EC | Dividers and outlines |

Use semantic theme tokens, not widget-level hard-coded colors. Validate WCAG 2.2 AA contrast and never communicate status by color alone. Do not imitate competitor palettes or brand assets.

### Typography
- Use a highly legible platform font or properly licensed bundled family.
- Define semantic styles: page title, section title, card title, body, label, caption and numeric emphasis.
- Use tabular figures for freight, weight and dates where supported.
- Prefer sentence case, plain language and short labels.
- Respect system text scaling; avoid clipped values and fixed-height text containers.

### Spacing, shape and elevation
Use an 8-point spacing scale: 4, 8, 12, 16, 24 and 32dp. Suggested page padding 16–20dp, card padding 16dp, section spacing 24dp and field spacing 8–12dp. Use consistent 8dp control radius, 12–16dp card radius and 20dp sheet radius. Use subtle elevation only when it clarifies hierarchy. Avoid excessive gradients, glass effects and decorative animation.

### Touch and accessibility
- Minimum touch target 48x48dp.
- WCAG 2.2 AA contrast.
- Semantic labels and screen-reader traversal for all controls.
- Never rely on color alone.
- Support system font scaling and external keyboard focus.
- Place validation messages beside the relevant field.
- Use haptics sparingly for acknowledged actions.

### Iconography and imagery
Use one consistent icon family and stroke weight. Label ambiguous icons. Use permissioned logistics imagery only where useful; avoid decorative stock-photo clutter. Never use Uber/Ola logos or assets.

## 5. Flutter feature architecture

Inspect the existing Flutter project before choosing state management, routing, networking, maps or UI libraries. Reuse established standards; do not add competing packages.

    features/marketplace/
      presentation/
        find_loads/
        load_details/
        post_load/
        my_listings/
        saved_loads/
        search_preferences/
        widgets/
      application/
        controllers/
        use_cases/
      domain/
        models/
        policies/
      data/
        dto/
        repositories/
        services/

Guidelines:
- Reuse shared authentication, profile, fleet and vehicle features.
- Use typed immutable models and explicit DTO-to-domain mapping.
- Separate API DTOs from view models where useful.
- Use repositories for listings, search, saved items and preferences.
- Include loading, empty, error, offline, stale and permission-denied states.
- Debounce place search and cancel stale requests after filter changes.
- Use cursor pagination and deduplicate by listing ID.
- Cache only safe recent listing data; refresh authoritative state before owner mutations.
- Store auth tokens only through the existing secure mechanism.
- Keep listing validation and compatibility decisions on the backend.
- Do not calculate route feasibility, profit or backhaul in Flutter.
- Keep analytics free of PII: search, filter, details viewed, save/unsave, draft started and publish completed.
- Preserve request correlation IDs for support diagnostics.

## 6. API/UI contract

Follow 00-marketplace-system-architecture.md. Flutter needs:
- Create/update draft and publish/pause/resume/withdraw listing.
- Search with normalized filters, sorting and cursor pagination.
- Role-aware listing details and owner listing management.
- Saved loads and saved search preferences.
- Compatibility status and reason codes from backend.
- Stable validation/error codes and server-confirmed state.

Do not hard-code sample listings, counts, freight or verification badges in production. Demo fixtures must be isolated and visibly marked.

## 7. Responsive behavior and performance

- Design for common Android phone widths first; adapt to tablets.
- No horizontal overflow with long city names, large freight values or large text.
- Lazy-load feed cards and bounded attachment thumbnails.
- Avoid rebuilding the entire feed for one saved-state change.
- Debounce search, cancel stale requests and use bounded timeouts.
- Cluster map markers and dispose map controllers/listeners.
- Provide pagination, retry and offline messaging.
- Show last-updated time when cached data may be stale.

## 8. India localization

- Locale-aware INR formatting and Indian number grouping.
- Explicit units for kg/tonne and dimensions.
- Store UTC; display dates/times clearly in the applicable local timezone.
- Support Indian states, districts, PIN codes and local address conventions.
- Keep strings in localization resources; avoid concatenated translated phrases.
- Plan layouts for Tamil, Hindi and other languages without fixed text assumptions.
- Use simple operational wording and explain unfamiliar freight terms.

## 9. UI states and copy

Every screen defines loading, empty, error, offline/stale, permission-denied, validation and server-confirmed success states.

Example copy:
- "No loads match these filters." — "Try widening the pickup radius or date range."
- "This listing is no longer available." — "Refresh to see current loads."
- "Location access is off." — "Choose a pickup city instead."
- "Draft saved." — show only after server acknowledgement.
- "Load published." — show only after server acknowledgement.

If publishing fails, preserve the draft and field values. If a listing expires while details are open, refresh its state and disable unavailable actions.

## 10. Design QA checklist

- Pickup, destination and freight are immediately scannable.
- Vehicle requirement and cargo weight are easy to compare.
- Search works with and without location permission.
- List and map show the same eligible listings.
- Filters are grouped, preserved and removable.
- Multi-stop route and schedule are understandable.
- Draft creation resumes without data loss.
- Owner actions reflect backend listing state.
- Contact details and private addresses follow API authorization.
- Long place names, large values and large text are tested.
- Screen readers, contrast and touch targets pass.
- Loading, empty, error, offline and stale states are complete.
- No backhaul, negotiation, booking, payment or tracking UI is implemented here.
- No competitor assets, logos, exact layouts or copied text.

## 11. Agentic AI implementation prompt

Before implementation:
1. Inspect Flutter navigation, state management, API client, theme, localization and existing Profile/vehicle onboarding.
2. Reuse account, role, fleet and vehicle models; do not duplicate onboarding.
3. Review backend API contracts and report gaps before coding.
4. Produce screen flow and reusable component inventory.
5. Implement: Post Load -> My Listings -> Find Loads -> Filters/Map -> Details -> Saved Loads/Search Preferences.
6. Include accessibility and loading/empty/error/offline/permission states in each slice.
7. Use real APIs outside isolated demo fixtures.
8. Keep design original to X Cron; do not copy competitor interfaces.
9. Add widget, unit and integration tests; add golden tests if supported.
10. Implement only Marketplace scope and integrate other modules through documented hand-off contracts.
