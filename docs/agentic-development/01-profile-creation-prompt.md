# Module 01 — Profile Creation Implementation Prompt

## Goal

Build profile onboarding for DRIVER, OWNER and END_USER without duplicating account identity data.

## Account-level fields

Collect only information needed for authentication and account management:
- account_id
- mobile_number
- email (optional initially)
- password_hash
- status
- roles
- preferred_language
- terms_accepted_at
- privacy_consent_at
- created_at / updated_at
- last_login_at

Do not store plain passwords.

## Common profile fields

- full_name
- profile_photo (optional)
- date_of_birth where legally/business relevant
- gender only if genuinely required by a downstream requirement
- address
- state
- district
- city/town
- pincode
- emergency_contact_name/phone where applicable
- preferred_language
- notification_preferences

Avoid collecting unnecessary PII.

## DRIVER profile

Required:
- full_name
- mobile_number
- address
- state/district/city/pincode
- driving_license_number
- driving_license_type/class
- driving_license_valid_from
- driving_license_valid_to
- experience_years
- preferred_operating_states/regions
- emergency_contact

Recommended:
- date_of_birth
- profile_photo
- current employment/association status
- languages
- trip preferences
- availability status

Do not allow a driver to claim ownership of a vehicle merely by entering its registration number.

## OWNER profile

Support both:
- INDIVIDUAL_OWNER
- BUSINESS/FLEET_OWNER

Individual:
- full_name
- mobile_number
- address
- state/district/city/pincode
- identity verification status

Business:
- legal_business_name
- trade_name
- business_type
- registered_address
- operating_states
- GSTIN where applicable
- PAN/business identifier where applicable
- authorized_contact_name
- authorized_contact_mobile
- document references

Do not make GSTIN mandatory for an individual owner.

## END_USER profile

The end user may be an individual or business booking cargo transport.

Individual:
- full_name
- mobile
- email optional
- pickup address preferences
- billing/contact preferences

Business:
- company_name
- contact_person
- mobile
- email
- billing_address
- GSTIN optional/conditional
- booking contact preferences

## Role selection UX

During onboarding:
1. Ask "How will you use X Cron?"
2. Show DRIVER / VEHICLE OWNER / BOOK TRANSPORT.
3. Allow multiple roles later.
4. Do not ask for vehicle documents until OWNER is selected.
5. Do not ask for driver-license data until DRIVER is selected.
6. Save progress and support resume-later.

## Validation

Client:
- required fields
- input length
- character restrictions
- mobile format
- email format
- pincode format
- password strength
- date constraints
- license number format where applicable

Server:
- repeat every validation
- normalize mobile and identifiers
- enforce uniqueness
- enforce role-specific required fields
- reject impossible dates
- reject duplicate active profiles
- enforce authorization

## Agent instructions

Before implementation:
- inspect current API/web/mobile structure;
- identify existing auth, user and database modules;
- reuse existing shared validation/error/response utilities;
- do not introduce a second ORM, auth framework, or validation library without justification;
- write migrations;
- add unit and integration tests;
- document API contracts;
- update README/module index.

## Acceptance criteria

A user can register once, select a role, complete the relevant profile, leave onboarding and resume it, and see a clear verification status without exposing unnecessary PII.
