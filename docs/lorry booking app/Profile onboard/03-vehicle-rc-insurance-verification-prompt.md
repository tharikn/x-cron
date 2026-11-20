# Module 03 — Vehicle, RC & Insurance Verification Prompt

## Goal

Allow owners to register commercial vehicles and verify vehicle registration/insurance before the vehicle becomes eligible for transport jobs.

## Vehicle fields

Collect:
- registration_number
- vehicle_type
- body_type
- make
- model
- manufacturing_year
- fuel_type
- capacity_tons
- permitted_load_capacity where applicable
- axle_count where relevant
- owner_account_id
- assigned_driver_id (optional)
- status

Do not trust manually entered make/model/owner data after verification if authoritative provider data is available.

## Documents

Store document metadata, not uncontrolled document blobs in database rows:
- document_type
- document_number/reference
- storage_key
- issued_at
- expires_at
- verification_status
- provider
- provider_reference
- verified_at
- rejection_reason

Required/conditional:
- RC
- insurance
- fitness certificate for applicable commercial vehicles
- permit/national permit where applicable
- pollution certificate where applicable
- other state/business-required documents

## RC verification

Primary identifier:
- vehicle registration number

Normalize:
- uppercase;
- remove spaces/hyphens;
- validate Indian registration format;
- preserve the original user input separately if needed for audit.

Verification should retrieve, where authorized:
- registration status
- owner name
- vehicle class
- make/model
- fuel
- registration date
- RC validity/status
- insurance validity indicator if provider supplies it
- fitness/permit information where available
- masked chassis/engine information where available

## Provider strategy

Do not build directly against the public Parivahan UI. Government transport data is available through authorized data-sharing/API channels, but access is controlled and approval/contractual requirements apply.

For the first provider adapter, use a provider such as StampMitra's RC verification API because it exposes a documented B2B REST contract and a sandbox. Keep the provider replaceable.

Provider abstraction:

```
VehicleVerificationProvider
  verifyRegistration(vehicleNumber)
  verifyInsurance(vehicleNumber, optionalPolicyDetails)
```

The production deployment must confirm provider authorization, data-processing terms, pricing, SLA and permitted use before enabling live verification.

Government/official integration can be added later through authorized MoRTH/VAHAN/API Setu access when the business is eligible.

## Owner matching

Verification must compare the registered owner against the account/profile.

Do not use exact string equality only.

Use:
- normalized case/whitespace;
- punctuation removal;
- configurable token comparison;
- business-name matching rules;
- manual review when confidence is low.

Never automatically approve ownership solely because the API returned an owner name.

## Insurance validation

Treat insurance validity as a separate verification concern.

Minimum:
- policy/document upload;
- policy number;
- insurer;
- start date;
- expiry date;
- document verification status.

If provider data includes insurance validity, compare it with the submitted policy information.

Rules:
- expired insurance => vehicle not eligible;
- missing insurance => pending/rejected according to business policy;
- mismatch => MANUAL_REVIEW;
- provider unavailable => do not silently approve; use PENDING/RETRY.

## Verification workflow

```
Vehicle Added
   |
RC Verification
   |
   +-- Match + valid --> Insurance Verification
   |
   +-- mismatch ------> MANUAL_REVIEW
   |
   +-- provider error -> RETRY/PENDING
                    |
Insurance
   |
   +-- valid --------> VERIFIED
   +-- expired ------> REJECTED
   +-- mismatch -----> MANUAL_REVIEW
```

## Security

- Do not expose full owner PII.
- Mask chassis/engine numbers.
- Encrypt sensitive documents at rest.
- Restrict document access by role.
- Do not put provider API keys in frontend/mobile apps.
- Redact provider responses from application logs.
- Record consent/legitimate purpose where required.
- Retain only necessary data.

## Reverification

Verification should have a timestamp and validity policy.

Recommended:
- verify at onboarding;
- reverify expiring documents before expiry;
- reverify before high-risk/long-haul bookings;
- allow manual "Verify now" by authorized operations users;
- cache successful results for a configurable period.

## Acceptance criteria

A vehicle cannot become ACTIVE until required verification rules pass. Every failed or ambiguous check is explainable to the owner and traceable to an audit record.
