# Agentic Development Prompt — Profile Onboarding Phase

## Mission

Implement the profile/authentication/vehicle verification foundation for X Cron as production-quality modular code.

## Execution order

1. Inspect repository architecture.
2. Identify current frontend, mobile and API frameworks.
3. Identify existing database/ORM, authentication and validation utilities.
4. Create/update database migrations.
5. Implement Account + Role/Profile model.
6. Implement password authentication.
7. Implement configurable OTP strategy with OTP disabled.
8. Implement profile onboarding APIs.
9. Implement vehicle/document APIs.
10. Implement verification provider interface.
11. Implement the selected RC provider adapter.
12. Implement insurance verification workflow.
13. Implement frontend/mobile onboarding.
14. Add automated tests.
15. Add API documentation.
16. Add audit/security logging.
17. Update module documentation.

## Data model baseline

Recommended logical entities:

- accounts
- account_roles
- profiles
- driver_profiles
- owner_profiles
- business_profiles
- end_user_profiles
- vehicles
- vehicle_driver_assignments
- documents
- verification_requests
- verification_results
- insurance_policies
- audit_events
- auth_sessions
- auth_credentials
- app_config

Use foreign keys, unique constraints, indexes and status enums appropriately.

## Important uniqueness rules

- mobile_number: unique after normalization
- active vehicle registration_number: unique
- driver license number: unique where applicable
- owner-to-vehicle relation: explicit
- one active primary profile per account/role

## API outline

Auth:
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- POST /auth/refresh
- POST /auth/forgot-password
- POST /auth/reset-password
- POST /auth/change-password

Profile:
- GET /profile
- PATCH /profile
- POST /profile/roles
- GET /profile/completion

Vehicles:
- POST /vehicles
- GET /vehicles
- GET /vehicles/:id
- PATCH /vehicles/:id
- POST /vehicles/:id/documents
- POST /vehicles/:id/verify
- GET /vehicles/:id/verification

Do not blindly use these routes if the existing repository has a different REST convention; adapt consistently.

## Error handling

Use stable machine-readable error codes:
- VALIDATION_ERROR
- DUPLICATE_ACCOUNT
- DUPLICATE_VEHICLE
- AUTHENTICATION_FAILED
- ACCOUNT_LOCKED
- OTP_DISABLED
- DOCUMENT_INVALID
- DOCUMENT_EXPIRED
- VERIFICATION_PENDING
- VERIFICATION_REJECTED
- VERIFICATION_MANUAL_REVIEW
- PROVIDER_UNAVAILABLE

Never expose stack traces to clients.

## Testing

Minimum:
- unit tests for validators;
- auth integration tests;
- role/profile integration tests;
- vehicle registration tests;
- duplicate vehicle tests;
- document expiry tests;
- provider adapter tests with mocked responses;
- timeout/retry/idempotency tests;
- authorization tests;
- rate-limit tests;
- end-to-end onboarding test.

## Agent safety rules

Before editing:
- inspect existing code;
- do not delete working functionality;
- do not replace architecture merely for preference;
- do not add dependencies when existing dependencies solve the problem;
- do not hard-code provider secrets;
- do not commit secrets;
- do not log PII;
- do not bypass tests;
- update documentation when contracts change.

After implementation:
- run formatter/linter;
- run unit/integration tests;
- run existing test suite;
- verify database migrations from a clean database;
- verify rollback/down migration where supported;
- provide a concise implementation summary and unresolved assumptions.

## Definition of done

The module is complete only when a DRIVER, OWNER and END_USER can register/login, complete their respective profile, and an OWNER can submit a vehicle for RC/insurance verification with clear verification states and auditable results.
