# Load Marketplace — System Architecture & Backend Implementation Prompt

> Product: X Cron Lorry Booking Platform  
> Module: Load Marketplace  
> Stack: Flutter, NestJS, PostgreSQL, Redis  
> Market: India, including intra-state and interstate freight

## 1. Objective

Build a two-sided freight marketplace connecting shippers/load owners with truck owners and fleet operators. Shippers publish loads; eligible carriers discover, evaluate, negotiate and book them. The marketplace also recommends return-load (backhaul) opportunities to reduce empty kilometres.

This is an implementation specification, not a clone of another product. Use broad mobility/freight usability principles—fast search, clear route hierarchy, map/list parity, transparent pricing, live status, trust signals and low-friction actions—while creating original X Cron product design. Do not copy competitor source, assets, branding, wording, exact screen layouts or proprietary interaction flows.

## 2. Roles and product modes

- SHIPPER / LOAD_OWNER: create and manage loads, review carrier offers, negotiate, award and track bookings.
- OWNER / FLEET_OPERATOR: manage trucks/drivers, search loads, negotiate and book.
- DRIVER: view assigned trip details and perform authorized operational milestones; cannot alter commercial terms unless explicitly authorized.
- ADMIN / OPS: moderate listings, review suspicious activity, handle disputes and operational exceptions.

One account may hold multiple roles. Keep one canonical account identity and enforce role/resource permissions.

Marketplace modes:
1. Find Loads — carrier searches loads compatible with vehicle, capacity, location, route and time.
2. Find Trucks — shipper searches available eligible vehicles for a load.
3. Backhaul — loads near a vehicle's expected delivery point and aligned with its return corridor.
4. My Loads / My Bookings — listings, offers, negotiations, confirmed bookings and trip lifecycle.

The same domain and data model must power both sides.

## 3. Architecture decision

Start with a **modular monolith in NestJS**, not premature microservices. Keep module boundaries, interfaces, events and data ownership explicit so high-volume modules can be extracted later.

    Flutter App (shipper / owner / driver)
              |
       HTTPS REST API
       WebSocket gateway only for timely live updates
              |
       NestJS application
        ├── Auth & Authorization
        ├── Accounts / Profiles / Fleet / Vehicles (existing onboarding)
        ├── Load Management
        ├── Marketplace Search & Discovery
        ├── Matching & Backhaul
        ├── Offers / Negotiation
        ├── Booking & Allocation
        ├── Trip / Tracking integration boundary
        ├── Pricing & Earnings Estimate
        ├── Notifications
        ├── Moderation / Trust
        ├── Audit
        └── Outbox / Background Jobs
              |
        ├── PostgreSQL + PostGIS
        ├── Redis (cache, rate limits, ephemeral presence, queue coordination)
        └── Object storage (load documents and proof files)

### Stack responsibilities

| Technology | Responsibility | Not for |
|---|---|---|
| Flutter | Mobile UI, local form state, maps, push handling | Authoritative pricing, eligibility or booking decisions |
| NestJS | Domain rules, validation, authorization, APIs, orchestration | Unbounded synchronous long-running work |
| PostgreSQL | Source of truth, transactions, constraints, history | High-frequency ephemeral presence polling |
| PostGIS | Radius, corridor and spatial queries | Replacing road-network routing |
| Redis | Cache, rate limits, short-lived presence, job coordination | Permanent load/booking records or sole source of truth |
| Worker | Matching refresh, notifications, expiry, retries | Untracked business decisions |
| Maps adapter | Geocoding, road distance, ETA, route geometry | Direct provider coupling in domain services |

Use migrations. Confirm PostGIS exists in all target environments. Isolate spatial access behind repository interfaces. If PostGIS is unavailable initially, document a temporary fallback rather than scattering distance calculations across services.

## 4. NestJS module boundaries

Suggested structure; adapt to the actual repository conventions:

    src/
      modules/
        loads/
        marketplace/
        matching/
        offers/
        bookings/
        pricing/
        fleet/
        vehicles/
        notifications/
        audit/
        outbox/
      integrations/
        maps/
        object-storage/
        push/
      common/
        auth/ validation/ errors/ pagination/ observability/
      workers/

Each module has:
- Domain: entities, value objects, state transitions and policies; no NestJS/provider SDK dependency.
- Application: use cases and transaction orchestration.
- Infrastructure: ORM repositories, Redis, provider adapters and queue handlers.
- Presentation: controllers, DTOs, guards, serializers and API documentation.

Do not introduce a second ORM or competing architectural pattern. Reuse the existing ORM, auth guards, response conventions and migration tooling. Controllers stay thin; validate DTOs and return explicit response DTOs, never raw database entities.

## 5. Core domain model

Use UUIDs or the repository's established ID standard. Store timestamps in UTC. Use integer minor units for currency (INR paise) or one explicitly documented integer-rupee convention; never floating-point. Store weight in kg and distance in metres/km consistently.

| Table | Key fields / purpose |
|---|---|
| loads | id, shipper_id, status, reference_code, cargo_type, description, weight_kg, volume, package_count, loading_type, required_vehicle_type, required_capacity_kg, hazardous flag, special requirements, pickup/delivery windows, pricing mode, offered_amount, currency, visibility |
| load_stops | load_id, sequence, stop_type, address, place_id, geography(Point,4326), service window, instructions |
| vehicles | Reuse existing vehicle aggregate, type/body, capacity, dimensions, verification state |
| vehicle_availability | vehicle_id, availability window, current/expected location, status, source, last_seen_at |
| load_requirements | load_id, typed requirement key/value for extensible validated requirements |
| load_media | load_id, object key, media type, uploader, malware scan status |
| load_offers | load_id, carrier_id, vehicle_id, amount, currency, message, status, expires_at, idempotency key |
| offer_events | offer_id, actor_id, event type, previous/new status, snapshot, timestamp |
| bookings | load_id, winning_offer_id, shipper_id, carrier_id, vehicle_id, driver_id, status, agreed amount/currency, version |
| booking_events | booking_id, actor_id, event type, from/to status, metadata, timestamp |
| saved_loads | user_id, load_id, created_at |
| search_preferences | user_id, role, route, radius, vehicle filters, corridor and notification settings |
| route_estimates | origin/destination, provider, distance, duration, route version, expiry |
| matching_results | load_id, vehicle_id, score, score breakdown, reasons, calculated_at, expiry |
| audit_logs | actor, action, resource, before/after references, correlation ID, timestamp |
| outbox_events | event ID, aggregate, event type, payload, created_at, published_at, retry metadata |

Use normalized address fields and PostGIS geography points. Store address text and geocoding provider IDs, not coordinates alone. Keep PII/contact access controlled and masked. Do not store FASTag credentials, bank credentials or unrelated sensitive data in marketplace records.

Support multi-stop loads from day one: at least one pickup and one delivery, ordered stops, stop types, time windows, service durations and instructions. Validate sequence and time feasibility server-side. Geocoded points may be nullable while geocoding is pending; retain geocode status and manual correction.

### Indexes

- loads(status, pickup_window_start, created_at DESC)
- loads(shipper_id, created_at DESC)
- load_stops(load_id, sequence)
- GiST indexes on pickup/delivery geography
- load_offers(load_id, status, created_at DESC) and (carrier_id, status, created_at DESC)
- Unique active booking constraint per load using a partial unique index for active statuses.
- Unique idempotency key scoped to actor and operation.
- vehicle_availability(status, available_from, available_until), plus GiST location index.
- bookings(carrier_id, status, created_at DESC).

Validate query plans with realistic data. Use cursor pagination with stable ordering and a unique tie-breaker. Do not index every field.

## 6. Load lifecycle and invariants

Conceptual lifecycle:

    DRAFT -> PUBLISHED -> RESERVED -> BOOKED -> IN_TRANSIT -> DELIVERED -> CLOSED
                 |           |          |
                 +-> PAUSED  +-> EXPIRED +-> CANCELLED
                 +-> CANCELLED

Define an explicit state machine and transition matrix in code: allowed transitions, actor, required fields, side effects and cancellation reasons.

Invariants:
1. Drafts are not discoverable.
2. Publishing validates required fields, ownership, verification and policy.
3. A load cannot have two active confirmed bookings.
4. Offers require an eligible vehicle and authorized carrier.
5. Driver assignment must belong to the carrier/fleet or be explicitly accepted.
6. Expired/withdrawn loads cannot accept offers.
7. Agreed commercial terms are an immutable booking snapshot; amendments require auditable acceptance.
8. Every transition records actor, timestamp, reason and correlation ID.
9. Cancellation/no-show rules are role-aware and explicit.
10. Every mutation is authorized server-side.

Use a PostgreSQL transaction plus row lock or compare-and-swap version check when accepting an offer. Verify load and offer eligibility, reserve the load, create booking, update offer states and write outbox events atomically. Add a unique constraint as the final concurrency guard. Redis locks must never be the only double-booking protection.

## 7. Marketplace discovery

Filters:
- Pickup current location, selected city/district/state and radius.
- Destination city/district/state, destination radius or route corridor.
- Pickup date/time window.
- Vehicle type/body, capacity and dimensions.
- Cargo category, loading/unloading type and special handling.
- FTL/PTL where supported.
- Minimum freight and pricing mode.
- Payment terms, verified shipper/carrier.
- Listing status and freshness.

Behavior:
- Default to loads compatible with the selected active vehicle; allow vehicle switching.
- Return only published, visible, non-expired loads.
- Apply authorization, moderation, blocklist and eligibility rules before response.
- List and map views must use the same query contract.
- Use validated filters, bounded page size and cursor pagination.
- Return applied filters, next cursor and a clear empty state.
- Hide shipper phone/email until the approved contact-disclosure milestone.
- Keep feed response compact; fetch full details separately.

Cache only safe non-personal search results. Cache keys include normalized filters, role, active vehicle, authorization scope and relevant version. Invalidate/version cache when status, terms, stops or visibility changes. PostgreSQL remains authoritative.

## 8. Matching and backhaul engine

Pipeline:
1. Candidate retrieval: published loads with pickup near current/expected vehicle location or a configured route corridor.
2. Hard eligibility: vehicle type/body, capacity, dimensions, cargo restrictions, permits, verification, availability, account status and time windows.
3. Route feasibility: road distance/ETA to pickup, loaded route, delivery-to-next-pickup distance, service time and schedule.
4. Scoring: rank eligible candidates and persist explainable score components.
5. Presentation: show reasons, pickup detour, route deviation, empty km, estimated gross/net and freshness.
6. Refresh on relevant load/vehicle/location/booking events and periodically for stale candidates.

Hard filters always run before ranking. A high score cannot override capacity, safety or schedule failure.

Initial configurable score weights (hypotheses to calibrate, not fixed truth):

| Signal | Initial weight |
|---|---:|
| Pickup proximity / detour | 20 |
| Destination alignment with preferred corridor | 20 |
| Vehicle/cargo compatibility quality | 10 (hard gate first) |
| Pickup/delivery time feasibility | 15 (hard gate first) |
| Estimated net per total km | 20 |
| Shipper trust/completion history | 10 |
| Listing freshness | 5 |

Normalize components to 0–1, version the scoring model and persist breakdown. Do not show fake precision percentages. Explain matches with grounded reasons such as "Vehicle compatible", "Pickup 18 km away" or "Low return-route deviation".

### Backhaul rules

Backhaul is not merely the reverse route. For a vehicle expected to deliver at destination D:
- Find loads with pickup near D (configurable radius or road detour).
- Evaluate the new destination against the truck's home/target corridor.
- Calculate D-to-pickup deadhead, loaded route distance, destination deviation and schedule feasibility.
- Ensure the vehicle is not committed and has enough turnaround/loading time.
- Compare incremental net contribution against deadhead, tolls, fuel, waiting, empty-return baseline and risk.
- Explain why the load matches and how much additional distance it adds.

Route deviation thresholds (e.g. 20–50 km) are configurable experiments, not universal constants. Prefer road distance/ETA from a routing provider over straight-line distance. If provider is unavailable, degrade gracefully, label approximate distance and do not claim route feasibility.

### Earnings estimate

Show freight separately from estimated expenses/net:
- Freight amount and payment terms.
- Loaded + deadhead distance.
- Fuel based on vehicle-specific or configurable mileage and fuel price.
- Toll only when reliable route toll data exists; otherwise state not included/estimated.
- Loading, unloading, waiting, parking and platform fees when configured.
- Estimated net contribution and per-km figure.

Show assumptions and calculation timestamp. Never claim guaranteed profit or invent toll/fuel costs.

## 9. REST API contract

Use /api/v1, repository naming conventions, authentication, authorization, DTO validation, rate limits and OpenAPI.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /loads | Create draft |
| PATCH | /loads/:id | Edit own draft/allowed fields |
| POST | /loads/:id/publish | Validate and publish |
| POST | /loads/:id/pause | Pause own listing |
| POST | /loads/:id/cancel | Cancel with reason |
| GET | /marketplace/loads | Search feed |
| GET | /loads/:id | Role-aware details |
| POST | /loads/:id/save | Save load |
| DELETE | /loads/:id/save | Unsave load |
| POST | /loads/:id/offers | Submit offer |
| GET | /loads/:id/offers | Authorized shipper offers |
| POST | /offers/:id/counter | Counter-offer |
| POST | /offers/:id/accept | Accept and atomically create booking |
| POST | /offers/:id/withdraw | Withdraw own offer |
| GET | /marketplace/backhaul | Return-load recommendations |
| GET | /marketplace/vehicles | Shipper-side vehicle discovery |
| GET | /bookings/:id | Booking details |
| POST | /bookings/:id/cancel | Authorized cancellation |

Use strict allowlist DTOs; reject unknown/immutable fields. Require Idempotency-Key for publish, offer submission, acceptance and booking/payment-related operations. Return stable error codes: LOAD_NOT_BOOKABLE, VEHICLE_NOT_ELIGIBLE, OFFER_EXPIRED, BOOKING_CONFLICT, ROUTE_ESTIMATE_UNAVAILABLE. Include safe message and correlation ID.

Example search:

    GET /api/v1/marketplace/loads?pickupLat=9.9252&pickupLng=78.1198&pickupRadiusKm=40&destinationState=Karnataka&vehicleId=<uuid>&sort=best_match&limit=20

Coordinates and date values in examples are illustrative. Validate coordinate bounds, timezone conversion and maximum radius. Prefer saved place IDs.

Example response (illustrative):

    {
      "items": [{
        "id": "load-uuid",
        "route": {
          "pickup": {"label": "Madurai, Tamil Nadu"},
          "delivery": {"label": "Bengaluru, Karnataka"}
        },
        "cargo": {"category": "General", "weightKg": 12000},
        "vehicleRequirement": {"type": "CONTAINER_32_FT", "capacityKg": 15000},
        "freight": {"amountMinor": 2800000, "currency": "INR", "mode": "FIXED"},
        "match": {"label": "Good route fit", "reasons": ["Vehicle compatible", "Pickup within 18 km"]},
        "shipper": {"displayName": "Verified shipper", "verification": "VERIFIED"}
      }],
      "nextCursor": "opaque-cursor"
    }

The amount convention must match the currency storage convention. Never return private contact details in public search results.

## 10. Redis, queues and event processing

Redis:
- Short-TTL search cache and reference data.
- Rate-limit counters and abuse throttles.
- Short-lived vehicle presence/last-seen cache; persist meaningful location snapshots according to consent/retention policy.
- Queue coordination and job deduplication.
- WebSocket presence only if needed.

Use a durable queue (BullMQ if compatible with the existing project) for matching refresh, route estimates, load/offer expiry, notifications, media scanning and stale-match cleanup.

Use the **transactional outbox pattern**: write domain changes and outbox event in the same PostgreSQL transaction. Workers publish/process events and mark delivery. Consumers are idempotent. Retry transient failures with bounded exponential backoff and dead-letter/manual replay. Booking notifications must not be lost if a process crashes after DB commit.

## 11. Security, privacy and abuse

- RBAC plus ownership checks for every resource/action; prevent IDOR.
- Validate and normalize addresses, phone numbers, vehicle IDs and monetary values.
- Mask contact details and sensitive documents until authorized disclosure.
- Use signed short-lived object-storage URLs and scan uploads.
- Rate-limit search, offer, login and publish; detect spam/duplicate low-quality listings.
- Prevent duplicate offers/booking races with idempotency and DB constraints.
- Audit price changes, offer acceptance, cancellation, contact disclosure and admin overrides.
- Never log tokens, full phone numbers, documents, precise location histories or payment secrets.
- Encrypt traffic and sensitive persisted data per platform security baseline.
- Define location consent, retention and deletion policies before continuous tracking.
- Provide report/block/moderation flows; admin overrides require reason and immutable audit.

## 12. Observability and tests

Structured logs include request/correlation ID, internal actor ID, module, action, latency and outcome. Metrics:
- Search p50/p95, error rate and cache hit rate.
- Candidate count and match duration.
- Offer-to-booking conversion and time-to-book.
- Successful duplicate bookings (target zero).
- Queue lag, retries and dead letters.
- Routing-provider latency/errors/cost.
- Expired listing and stale-result ratio.

Tests:
- Unit: state machines, eligibility, scoring, backhaul deviation, earnings assumptions.
- Integration: PostGIS, Redis invalidation, outbox and queue idempotency.
- Concurrency: simultaneous competing offer acceptance; exactly one booking succeeds.
- Authorization: cross-shipper edits, driver commercial mutation, private offer visibility.
- Contract/privacy: DTOs and response field exposure.
- Performance: realistic spatial density, pagination, cache cold/warm and offer activity.
- Failure: Redis outage, routing timeout, worker restart, duplicate event, push failure.
- Migration: clean install and upgrade.

## 13. Delivery phases

1. Foundation: inspect code, auth/profile/vehicle models, schema, migrations and observability.
2. Load publishing: draft, stops, cargo, requirements, media, validation and moderation.
3. Carrier discovery: filters, list/map, saved loads, details and eligibility.
4. Offers/booking: offer/counter/accept, transactional allocation, cancellation and audit.
5. Matching: candidate filtering, explainable ranking, cache and background refresh.
6. Backhaul: delivery-to-pickup corridor, route deviation and incremental earnings.
7. Hardening: load tests, fraud controls, dashboards, failure recovery and rollout.

Feature flags control backhaul, route provider, earnings estimate and notifications. Deploy schema changes backward-compatibly. Do not silently change Profile onboard flows.

## 14. Agentic AI implementation instructions

Before coding:
1. Inspect repository structure, NestJS modules, ORM, migrations, auth guards, user/profile/vehicle entities, Redis, queues, API conventions and tests.
2. Read existing Profile onboard docs and reuse canonical identity, owner/fleet and vehicle models. Do not recreate them.
3. Produce a gap analysis and implementation plan referencing actual files.
4. Confirm PostGIS and queue support; propose minimal compatible changes if absent.
5. Implement small vertical slices with migrations, tests and OpenAPI updates.
6. Do not introduce microservices, infrastructure or paid providers without documenting cost and operational trade-offs.
7. Keep business rules server-side and state changes auditable.
8. Record architecture changes and migration impact in this document.

## 15. Definition of done

- Shippers can draft, publish, pause and cancel valid loads.
- Carriers discover only eligible published loads and receive privacy-safe details.
- Vehicle compatibility and schedule checks are enforced server-side.
- Offers/counters have complete auditable lifecycle.
- Concurrent acceptance cannot create duplicate active bookings.
- Backhaul is route- and schedule-aware, explainable and clearly estimated.
- PostgreSQL is authoritative; Redis loss does not lose business data.
- Background work is durable, retryable and idempotent.
- APIs are documented, validated, secured and tested.
- Flutter/backend contracts agree on states, filters, errors and pagination.
- Existing Profile onboard functionality remains intact.
