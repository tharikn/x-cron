# External Verification Provider Decision

## Decision

Use a provider-adapter architecture.

### Initial RC provider

Use **StampMitra Vehicle RC Verification** as the first development adapter because its current documentation exposes a B2B REST API, sandbox, RC verification fields and a clear reference ID/audit pattern.

The integration must remain behind:

```
VehicleVerificationProvider
  -> StampMitraVehicleVerificationProvider
```

Do not expose provider-specific request/response models outside the adapter.

### Government/official path

MoRTH's 2025 data-sharing policy describes shareable Vahan vehicle-registration datasets, including registration, owner, vehicle, validity, permit and insurance information, and states that access to PII/sensitive parameters requires approval. The policy also describes vehicle lookup by registration, chassis or engine number.

Therefore, do not assume that Parivahan/VAHAN is an unrestricted public API. For production, pursue authorized MoRTH/VAHAN/API Setu access if the business qualifies.

### Insurance

Do not treat an RC response's insurance date as a complete insurance-policy verification.

Capture:
- insurer
- policy number
- policy start/end
- uploaded policy document
- provider verification result where available

A mismatch must go to MANUAL_REVIEW.

### Provider replacement

The code must allow a future provider such as an authorized API Setu/VAHAN integration, another compliant verification vendor, or a direct insurer/IIB integration without changing vehicle business logic.

### Required operational controls

- API keys only on backend
- secrets in environment/secret manager
- consent/legal-purpose handling where required
- PII minimization
- masked logs
- provider request IDs
- audit events
- timeout and retry policy
- idempotency
- circuit breaker/provider health state
- configurable cache/reverification interval
- manual-review fallback

## Development note

Provider choice is an implementation dependency, not a business-domain dependency. The domain must make the decision "vehicle verified/not verified/manual review" independently of any provider's proprietary response format.
