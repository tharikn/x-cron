# Profile & Vehicle Onboarding — Architecture Prompt

## Purpose

Implement the first production module for the X Cron logistics/lorry platform: identity, authentication, role-based profiles, driver/owner onboarding, end-user onboarding, and vehicle document verification.

This document is an implementation prompt for an agentic AI development workflow. The agent must inspect the existing repository before changing code and must preserve existing architecture and conventions where they are sound.

## Scope

Roles:
- DRIVER — drives vehicles and accepts/executes trips.
- OWNER — owns one or more commercial vehicles and can assign drivers.
- END_USER — books transportation/services.
- ADMIN/OPS — verifies documents, handles exceptions and audits.

A person must have one canonical account identity and may later hold multiple roles. Do not create duplicate users for each role.

## Recommended architecture

Use modular boundaries even if the initial deployment is a modular monolith.

```
Web / Mobile
    |
API Gateway / BFF
    |
    +-- Auth Module
    +-- Profile Module
    +-- Driver Module
    +-- Owner/Fleet Module
    +-- Vehicle Module
    +-- Verification Module
    +-- Document Module
    +-- Notification Module
    +-- Audit Module
    |
PostgreSQL
    |
External providers
    +-- OTP provider (disabled initially)
    +-- Vehicle/RC verification provider
    +-- Insurance verification provider where available
```

Keep external integrations behind provider interfaces. Never couple business rules directly to a third-party API.

## Core principles

1. Account identity is separate from role/profile.
2. Role-specific data is stored in role-specific tables/entities.
3. Vehicle ownership and driver assignment are explicit relationships.
4. Verification has a state machine, not a single boolean.
5. External verification responses are stored as an auditable snapshot with provider reference and timestamp; do not repeatedly call the provider unnecessarily.
6. Sensitive PII must be masked in logs and normal UI.
7. Every verification decision must have an audit trail.
8. OTP must be feature-flag/config driven and disabled in the initial release.
9. Password authentication must be available while OTP is disabled.
10. UI validation and server validation must both exist.
11. Do not trust client-side validation.
12. Design for Indian transport requirements but keep state/RTO/provider values configurable.

## Verification states

Use:
- NOT_STARTED
- PENDING
- VERIFIED
- PARTIALLY_VERIFIED
- REJECTED
- EXPIRED
- MANUAL_REVIEW
- PROVIDER_UNAVAILABLE

Never overwrite a previous verification result without retaining the audit history.

## Definition of done

- All three user journeys can create profiles.
- Authentication works with password when OTP is disabled.
- OTP configuration exists but does not execute when disabled.
- Driver/owner/end-user fields have field-level and cross-field validation.
- Owner can add a vehicle.
- Vehicle RC number is normalized and verified through the provider adapter.
- RC owner matching is implemented with configurable matching rules.
- Insurance validity is captured and checked.
- Expired/missing/contradictory documents route to manual review.
- Sensitive values are masked.
- Tests cover happy paths, validation failures, duplicate accounts, duplicate vehicles, provider failures, and retry/idempotency.
