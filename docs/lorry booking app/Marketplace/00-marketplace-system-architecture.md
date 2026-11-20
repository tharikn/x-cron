# Load Marketplace — System Architecture

Product: X Cron Lorry Booking Platform  
Scope: Core Load Marketplace only  
Stack: Flutter, NestJS, PostgreSQL, Redis  
Market: India

## 1. Scope and boundaries

Marketplace enables shippers to publish freight-load listings and transporters to discover, search, filter, compare and save them.

Included:
- Draft, create, validate, publish, edit, pause, resume, expire and withdraw load listings.
- Load search, filtering, sorting, pagination and listing details.
- Basic vehicle/cargo requirement compatibility using existing Profile/Fleet data.
- Saved loads and saved search preferences.
- List/map result parity, listing moderation, privacy, audit and cache management.

Explicitly excluded; implement as separate modules/documents:
- Backhaul and return-load optimization.
- Offers, negotiation, booking, allocation and payments.
- Trip lifecycle, GPS tracking, driver operations, proof of delivery and FASTag.
- Route optimization, fuel/toll costing, earnings and profit estimation.
- User, fleet and vehicle onboarding. Reuse the existing Profile onboard module.

Do not add excluded capabilities to Marketplace. Provide stable listing IDs and integration events for other modules.

## 2. Actors and permissions

- SHIPPER / LOAD_OWNER: manage only their own listings.
- TRANSPORTER / TRUCK_OWNER: search, view, filter and save eligible listings.
- ADMIN / MODERATOR: review, hide, restore or remove listings with a reason and audit record.

A user may have multiple roles. Reuse canonical account, profile, fleet and vehicle records. Enforce role permissions and resource ownership on every API.

## 3. Architecture overview

Use a NestJS modular monolith initially. Avoid premature microservices.

    Flutter App
        |
        | HTTPS REST / OpenAPI
        v
    NestJS API
      ├── Marketplace Loads
      ├── Search & Discovery
      ├── Compatibility / Relevance
      ├── Saved Loads & Search Preferences
      ├── Moderation
      ├── Audit
      └── Outbox / Background Workers
              |
        ├── PostgreSQL (+ PostGIS where available)
        ├── Redis (cache, rate limits, queue coordination)
        └── Object Storage (optional listing attachments)

Technology responsibilities:
- Flutter: screens, forms, filters, map/list presentation and local UI state.
- NestJS: validation, authorization, listing rules, search orchestration and API contracts.
- PostgreSQL: source of truth for listings, statuses, preferences, saves and audit history.
- PostGIS: indexed geographic/radius search when enabled.
- Redis: short-lived search cache, rate limiting and queue coordination only.
- Workers: listing expiry, media scanning, cache invalidation and notification dispatch.
- Object storage: optional listing attachments using short-lived signed URLs.

PostgreSQL remains authoritative. Redis loss must not lose marketplace data. Confirm PostGIS availability before relying on spatial SQL; isolate spatial access behind repository methods and document a fallback.

## 4. NestJS module structure

Adapt to the existing repository conventions:

    src/modules/marketplace/
      loads/
        domain/
        application/
        infrastructure/
        presentation/
      search/
        domain/
        application/
        infrastructure/
        presentation/
      compatibility/
      saved-items/
      preferences/
      moderation/
      audit/
      outbox/

Each module separates:
- Domain: listing rules, state transitions and policies.
- Application: use cases and orchestration.
- Infrastructure: ORM repositories, Redis, storage and queue adapters.
- Presentation: controllers, DTOs, guards and response serializers.

Reuse the existing ORM, auth guards, migrations, logging, notification and storage integrations. Keep controllers thin. Never return raw ORM entities.

## 5. Marketplace data model

Use UUIDs or the existing project ID standard. Store timestamps in UTC. Store currency as integer minor units (INR paise) or a documented integer-rupee convention; never floating-point. Store weight in kg and dimensions in documented units.

| Table | Main fields / purpose |
|---|---|
| marketplace_loads | id, shipper_id, reference_code, status, cargo_type, description, weight_kg, volume, package_count, loading_type, required_vehicle_type, required_capacity_kg, special_requirements, pickup_window, delivery_window, pricing_mode, freight_amount, currency, visibility, published_at, expires_at, created_at, updated_at |
| marketplace_load_stops | id, load_id, sequence, stop_type, address fields, place_id, geography(Point,4326), service_window, instructions |
| marketplace_load_media | id, load_id, object_key, media_type, uploader_id, scan_status, created_at |
| marketplace_load_requirements | id, load_id, requirement_key, typed_value |
| marketplace_saved_loads | user_id, load_id, created_at; unique(user_id, load_id) |
| marketplace_search_preferences | id, user_id, name, normalized_filters, alert_enabled, created_at, updated_at |
| marketplace_listing_events | id, load_id, actor_id, event_type, previous_status, new_status, reason, metadata, created_at |
| marketplace_audit_logs | actor_id, action, resource_type, resource_id, correlation_id, metadata, created_at |
| outbox_events | event_id, aggregate_type, aggregate_id, event_type, payload, created_at, published_at, retry_count |

Reference existing vehicle, fleet, user and profile records; do not duplicate them. If a stable vehicle snapshot is required for audit, store only the minimum necessary snapshot and document why.

Support ordered multi-stop routes with at least one pickup and one delivery. Validate stop sequence and address completeness before publishing. Store human-readable address fields and provider place IDs as well as optional geography points. Geocoding may be pending; expose status and permit correction. Do not present straight-line distance as road distance.

### Indexes and constraints

- marketplace_loads(status, published_at DESC, id)
- marketplace_loads(shipper_id, created_at DESC)
- marketplace_load_stops(load_id, sequence)
- GiST index on stop geography when PostGIS is enabled.
- Unique marketplace_saved_loads(user_id, load_id).
- marketplace_search_preferences(user_id, created_at DESC).
- Unique public reference_code.
- Check constraints for positive weight, valid freight amount and valid time windows.
- Idempotency key unique per actor and operation for retryable mutations.

Use cursor pagination with stable ordering and a unique tie-breaker. Validate indexes with representative query plans; do not index every filter column.

## 6. Listing lifecycle and rules

    DRAFT -> PUBLISHED -> PAUSED
                  |          |
                  v          v
                EXPIRED    PUBLISHED
                  |
                  v
               WITHDRAWN

Keep moderation visibility (REVIEW_REQUIRED, HIDDEN, REMOVED) separate from owner lifecycle status.

Rules:
1. Draft and paused listings are not publicly discoverable.
2. Only authorized owners can edit or withdraw their listings.
3. Publishing validates cargo, stops, schedule, vehicle requirements and freight fields.
4. Expired, withdrawn, hidden and removed listings are excluded from public search.
5. Material edits update freshness, invalidate cache and create audit events.
6. Expiry is enforced in search queries even if the worker is delayed.
7. A user cannot save the same listing twice.
8. Admin moderation requires a reason and immutable audit event.
9. Visibility and contact disclosure are server-side decisions.
10. All mutations are authorized and auditable.

Implement transitions in a domain state machine. Do not accept arbitrary status changes from clients.

## 7. Load publishing

Use a draft-first flow:
- Pickup and delivery locations/stops.
- Cargo category, description, weight, volume and package count.
- Loading/unloading type and special handling.
- Required vehicle type/body, capacity and dimensions.
- Pickup and delivery date/time windows.
- Freight amount, currency and fixed/negotiable mode.
- Shipper-provided payment/loading notes and optional attachments.
- Listing expiry where policy permits.

Validate units, numeric bounds, time windows, stop order, supported values, ownership and account eligibility on the server. Allow partial draft saves without making drafts searchable. Use allowlisted DTOs and reject unknown/immutable fields.

## 8. Search, discovery and basic compatibility

Filters:
- Pickup place/city/district/state and configurable radius.
- Destination place/city/district/state.
- Pickup date/date window.
- Vehicle type/body and capacity.
- Cargo category, weight range and loading type.
- FTL/PTL only if supported by the product model.
- Freight range and fixed/negotiable mode.
- Verified shipper.
- Sort by relevance, nearest pickup, highest freight or newest.

Search pipeline:
1. Validate and normalize filters.
2. Restrict to published, visible, non-expired listings.
3. Apply role, moderation and block rules.
4. Apply hard cargo/vehicle requirements when an active vehicle is selected.
5. Apply geographic filters using PostGIS where configured.
6. Rank remaining candidates deterministically.
7. Return compact cards, applied filters and an opaque next cursor.

List and map views use the same search contract and result IDs. Manual place search must work without location permission. Bound radius, page size and query complexity.

Compatibility is limited to comparing listing requirements with existing transporter vehicle data:
- Vehicle type/body.
- Rated capacity vs load weight.
- Dimensions/equipment where known.
- Cargo restrictions and mandatory permits where represented.
- Pickup window validity.

Hard requirements are filters, not ranking bonuses. Unknown vehicle data must produce NEEDS_VERIFICATION, not an assumed match. Relevance may rank by pickup proximity, destination preference, pickup date preference, freight sort and listing freshness. Return reason codes such as VEHICLE_TYPE_MATCH, CAPACITY_MATCH and PICKUP_NEARBY. Do not calculate backhaul, route feasibility, road detours or profit.

## 9. API contract

Use /api/v1 and existing naming conventions. Authenticate all endpoints unless product policy explicitly allows otherwise.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /marketplace/loads | Create draft |
| PATCH | /marketplace/loads/:id | Update own listing |
| POST | /marketplace/loads/:id/publish | Validate and publish |
| POST | /marketplace/loads/:id/pause | Pause own listing |
| POST | /marketplace/loads/:id/resume | Resume paused listing |
| POST | /marketplace/loads/:id/withdraw | Withdraw own listing |
| GET | /marketplace/loads | Search and paginate |
| GET | /marketplace/loads/:id | Role-aware listing details |
| POST | /marketplace/loads/:id/save | Save listing |
| DELETE | /marketplace/loads/:id/save | Unsave listing |
| GET | /marketplace/saved-loads | List saved listings |
| POST | /marketplace/search-preferences | Save normalized search |
| GET | /marketplace/search-preferences | List saved searches |
| PATCH | /marketplace/search-preferences/:id | Update own search |
| DELETE | /marketplace/search-preferences/:id | Delete own search |
| POST | /admin/marketplace/loads/:id/hide | Hide with reason |
| POST | /admin/marketplace/loads/:id/restore | Restore after review |

Booking, offers and negotiation endpoints belong to their separate modules, not Marketplace.

Example:
    GET /api/v1/marketplace/loads?pickupPlaceId=<place>&pickupRadiusKm=40&destinationState=Karnataka&vehicleId=<uuid>&sort=relevance&limit=20

Response example:
    {
      "items": [{
        "id": "load-uuid",
        "referenceCode": "XC-LOAD-1024",
        "route": {
          "pickup": {"label": "Madurai, Tamil Nadu"},
          "delivery": {"label": "Bengaluru, Karnataka"},
          "stopCount": 2
        },
        "cargo": {"category": "General", "weightKg": 12000},
        "vehicleRequirement": {"type": "CONTAINER_32_FT", "capacityKg": 15000},
        "freight": {"amountMinor": 2800000, "currency": "INR", "mode": "FIXED"},
        "compatibility": {"status": "MATCH", "reasons": ["VEHICLE_TYPE_MATCH", "CAPACITY_MATCH"]},
        "shipper": {"displayName": "Verified shipper", "verification": "VERIFIED"}
      }],
      "appliedFilters": {},
      "nextCursor": "opaque-cursor"
    }

Validate coordinate bounds, maximum radius, date/timezone and vehicle ownership. Prefer place IDs over raw free-form coordinates. Never expose private phone/email, exact private addresses or storage object keys in public search results.

## 10. Redis and background jobs

Redis is for short-TTL search cache, rate-limit counters, cache/version coordination and job deduplication only. Cache keys include normalized filters, caller visibility scope, role and selected vehicle. Invalidate/version cache after publish, pause, resume, withdrawal, expiry, moderation or material edits. Always re-check authoritative state for details and mutations.

Use the existing durable queue (BullMQ only if compatible) for listing expiry, media scanning, cache invalidation, saved-search alerts and outbox delivery.

Use a transactional outbox: commit listing changes and event records in one PostgreSQL transaction. Consumers are idempotent, retry transient failures with bounded backoff and expose dead-letter/manual replay. Search queries must enforce expiry independently of the worker.

## 11. Security and privacy

- Reuse central authentication; enforce role and ownership checks to prevent IDOR.
- Validate IDs, DTOs, units, addresses, timestamps, numeric values and uploads.
- Use signed short-lived attachment URLs and scan uploaded files.
- Mask contact information and private exact addresses until separately authorized.
- Rate-limit search, draft creation, publishing, saving and moderation.
- Detect spam/duplicate listings and provide report/moderation workflows.
- Audit publish, material edits, pause/resume, withdrawal and moderation.
- Never log tokens, full phone numbers, private addresses, documents or payment secrets.
- Apply encryption in transit and the platform's at-rest security baseline.
- Define retention/deletion for drafts, attachments, saved searches and audit records.
- Do not collect continuous driver/vehicle location as part of marketplace search.

## 12. Observability and tests

Metrics: search p50/p95 and error rate, cache hit rate, zero-result rate, draft-to-publish conversion, listing freshness/expiry lag, validation failures, moderation queue age, saved-load usage, notification delivery and spatial query latency.

Tests:
- Unit: listing validation, lifecycle, filter normalization and compatibility.
- Integration: PostGIS, Redis invalidation, outbox and expiry worker idempotency.
- Authorization: cross-shipper edits, unauthorized withdrawal, hidden listing visibility and saved-item ownership.
- Contract: DTO validation, pagination and response privacy.
- Concurrency: duplicate publish/edit/withdraw retries.
- Performance: realistic listing volume, spatial density and cold/warm cache.
- Failure: Redis outage, queue restart, delayed expiry and duplicate events.
- Migration: clean install and upgrade.

## 13. Delivery phases

1. Inspect repository, ORM, auth, Profile onboard, vehicle/fleet schema, Redis, queues and migrations.
2. Build listing schema, lifecycle, audit and DTOs.
3. Implement draft, stops, cargo, requirements, attachments and publish.
4. Implement search, filters, pagination, list/map contract and details.
5. Add vehicle compatibility and explainable relevance.
6. Add saved loads, saved searches and optional alerts.
7. Harden moderation, privacy, cache, observability and performance.

## 14. Agentic AI implementation instructions

Before coding:
1. Inspect actual NestJS structure, ORM, migrations, auth, Redis, queue and existing Profile/Fleet/Vehicle models.
2. Reuse canonical account, role, fleet and vehicle entities.
3. Identify shared notification, storage and location integrations before adding dependencies.
4. Produce a gap analysis mapped to actual files and a phased implementation plan.
5. Implement only Marketplace scope in this document.
6. Do not implement backhaul, offers, negotiation, booking, payment, tracking, route optimization or earnings.
7. Avoid new microservices and paid providers without documented need and approval.
8. Add tests, OpenAPI updates, migrations and architecture notes with each vertical slice.

## 15. Definition of done

- Shippers can draft, validate, publish, pause, resume and withdraw listings.
- Transporters can search, filter, sort, view and save published listings.
- Search respects visibility, expiry, role and ownership.
- Compatibility uses existing profile/fleet data and never guesses missing attributes.
- List and map views show the same eligible listings.
- Listing lifecycle, moderation and material edits are auditable.
- PostgreSQL is authoritative; Redis loss does not lose marketplace data.
- Search is paginated, indexed, bounded and observable.
- APIs are documented, secured, validated and tested.
- Profile onboard and separate transaction/booking modules remain unaffected.
