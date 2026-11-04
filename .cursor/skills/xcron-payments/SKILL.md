---
name: xcron-payments
description: >-
  X Cron payment gateway architecture: Strategy/Adapter providers, UPI QR or
  VPA (UPI ID) checkout, free-first gateways, entitlements separate from PSP.
  Use when adding/changing payments, unlock checkout, subscriptions, Razorpay,
  Cashfree, PhonePe, UPI, QR, webhooks, PAYMENT_MODE, or PAYMENT_GATEWAY.
---

# X Cron — payments & UPI gateways

Any payment work **must** follow this skill. Do not wire a PSP directly into
controllers, job unlock UI, or entitlement grants.

## Hard rules

1. **Strategy / Adapter only** — every PSP implements `PaymentProvider`.
2. **Domain ≠ gateway** — `PaymentsService` + store own orders/entitlements/audit;
   providers only create checkout payloads and parse webhooks.
3. **Factory by env** — resolve provider from `PAYMENT_GATEWAY` (fallback
   `PAYMENT_MODE`). Never `new Razorpay…` inside feature methods.
4. **Webhook path** — `POST /v1/payments/webhooks/:gateway`; verify signature
   **inside** the adapter; keep webhook handling **idempotent**.
5. **Free-first** — prefer ₹0 / sandbox paths for MVP: `stub`, then `upi`
   (merchant VPA), then live PSP. Do not assume paid Razorpay/Cashfree keys.
6. **Job contact unlock is retired from seeker UI** — public job DTOs expose
   phone/email/WhatsApp/website directly. Keep legacy `job_contact_unlock` /
   `GET …/contact` paths working for entitlements/history, but do not re-add
   unlock CTAs on job detail.
7. **Client payment section** — when collecting subscription fees,
   open an in-app payment panel (UPI QR + UPI ID / hosted checkout). Never
   auto-confirm or deep-link UPI without that panel. Confirm only after
   explicit “I have paid” (or verified webhook). **Post-job fee is removed**
   (jobs post free; do not reintroduce a post fee panel).
8. **History** — every create / confirm_attempt / confirm_failed / paid / free_grant
   must append `PaymentHistoryEvent` (admin `/admin/payments`, CSV+PDF export).
9. **Confirm hardening** — client confirm blocked in production; ownership + TTL
   + attempt cap; log failures with IP/UA. Never skip history on failure.
10. **Commerce config** — respect `paymentsEnabled` from SiteConfig; Settings UI
    is source of truth for unlock. `postJobPaymentMode` is forced `none` (retired).
11. **Update docs** — `api/src/payments/CLAUDE.md`, `api/CLAUDE.md`, `.env.example`
    when adding a gateway or env key (see `xcron-claude-md` skill).

## Provider contract

Location: `api/src/payments/providers/`

```ts
interface PaymentProvider {
  readonly name: PaymentGatewayId; // 'stub' | 'upi' | 'razorpay' | …
  createOrder(input: CreateOrderInput): Promise<CreateGatewayOrderResult>;
  parseWebhook(
    rawBody: string | Record<string, unknown>,
    signature?: string,
    headers?: Record<string, string | undefined>,
  ): GatewayWebhookPayload;
}
```

`CreateGatewayOrderResult` **must** stay gateway-agnostic at the top level and
carry optional method payloads:

| Field | Purpose |
| --- | --- |
| `gatewayOrderId` | PSP or local order id |
| `amountPaise` / `currency` | INR only for MVP |
| `checkoutMode` | `stub` \| `upi` \| `razorpay` \| … |
| `keyId?` | Hosted-checkout PSPs (Razorpay key id) |
| `upi?` | `{ vpa, payeeName, intentUri, qrPayload }` when method is UPI |

`GatewayWebhookPayload` normalizes to:
`{ gatewayOrderId, gatewayPaymentId, status: 'paid' \| 'failed', rawEventId? }`.

### Adding a new gateway (checklist)

- [ ] New file `providers/<name>.provider.ts` implementing `PaymentProvider`
- [ ] Register in `providers/payment-provider.factory.ts`
- [ ] Extend `PaymentGatewayId` / `checkoutMode` unions in `payments.types.ts`
- [ ] Webhook header/signature handled only in that adapter
- [ ] Env keys in `.env.example` (no secrets committed)
- [ ] Checkout DTO exposed to mobile/web stays generic + optional `upi` block
- [ ] Folder `CLAUDE.md` + this skill reference updated if behavior changes

## UPI (QR or UPI ID) — free path

Default free live-ish path: **`PAYMENT_GATEWAY=upi`**.

- Collect to merchant **VPA** (`PAYMENT_UPI_VPA`, e.g. `merchant@oksbi`) and
  **payee name** (`PAYMENT_UPI_PAYEE_NAME`).
- Build NPCI intent:
  `upi://pay?pa={vpa}&pn={name}&am={rupees}&cu=INR&tn={note}&tr={orderRef}`
- **QR**: `upi.qrPayload` === intent URI (client encodes QR). Do not require a
  paid QR SaaS.
- **UPI ID**: show `upi.vpa` for manual pay / copy.
- Confirmation: until a PSP webhook exists, allow
  `POST /v1/payments/dev/confirm` when `PAYMENT_MODE=stub` **or**
  `PAYMENT_UPI_ALLOW_DEV_CONFIRM=1` (dev only). Production must verify via a
  real PSP webhook or bank reconciliation — never trust client “I paid”.

### Free / cheap gateway matrix

Prefer in this order for India MVP:

| Id | Cost to start | UPI QR / VPA | Notes |
| --- | --- | --- | --- |
| `stub` | Free | Simulated | Local only; `/payments/dev/confirm` |
| `upi` | Free | Yes (intent + QR payload) | Your VPA; weak auto-verify without PSP |
| `razorpay` | Free test keys | Yes via Checkout | Existing stub/HMAC shape |
| `cashfree` | Free sandbox | Yes | Add as new adapter when needed |
| `phonepe` | Free sandbox | Yes | Add as new adapter when needed |

Do **not** hardcode one PSP in mobile/web. Branch on `checkout.checkoutMode`
and optional `checkout.upi`.

## Anti-patterns

- Calling Razorpay/Cashfree SDKs from `JobsController` or page components
- Granting entitlements before webhook/stub confirm
- Storing raw card/UPI PIN (never); VPA of **merchant** only in server env
- Gateway-specific columns leaking into public job DTOs
- New gateway that bypasses `PaymentProvider` / factory

## Code map

| Piece | Path |
| --- | --- |
| Types | `api/src/payments/payments.types.ts` |
| Interface | `api/src/payments/providers/payment-provider.ts` |
| Factory | `api/src/payments/providers/payment-provider.factory.ts` |
| Stub / Razorpay | `api/src/payments/providers/razorpay.stub.ts` |
| UPI | `api/src/payments/providers/upi.provider.ts` |
| Domain | `api/src/payments/payments.service.ts` |
| Module guide | `api/src/payments/CLAUDE.md` |

## More detail

- Gateway env + UPI URI rules: [reference.md](reference.md)
