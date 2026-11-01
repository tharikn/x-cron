# Payments reference — env, UPI URI, checkout shape

## Env

| Key | Default | Meaning |
| --- | --- | --- |
| `PAYMENT_GATEWAY` | falls back to `PAYMENT_MODE` | `stub` \| `upi` \| `razorpay` \| (future) |
| `PAYMENT_MODE` | `stub` | Legacy alias; prefer `PAYMENT_GATEWAY` |
| `PAYMENT_UPI_VPA` | — | Merchant UPI ID (required for `upi`) |
| `PAYMENT_UPI_PAYEE_NAME` | `X Cron` | Shown in UPI apps |
| `PAYMENT_UPI_ALLOW_DEV_CONFIRM` | `0` | Allow `/payments/dev/confirm` with `upi` in non-prod |
| `RAZORPAY_KEY_ID` | `rzp_test_stub` | Checkout key when gateway is razorpay |
| `RAZORPAY_WEBHOOK_SECRET` | `dev_secret` | HMAC for razorpay webhooks |
| `UNLOCK_PRICE_PAISE` | `500` | ₹5 unlock |

## UPI intent URI

```
upi://pay?pa={encodeURIComponent(vpa)}
         &pn={encodeURIComponent(payeeName)}
         &am={amountRupeesFixed2}
         &cu=INR
         &tn={encodeURIComponent(shortNote)}
         &tr={encodeURIComponent(gatewayOrderId)}
```

- `am` is rupees with two decimals (`500` paise → `5.00`), not paise.
- `qrPayload` must equal this URI string; clients render QR locally (e.g. Ionic
  Capacitor barcode / web QR lib). Server does not need a QR API.
- Deep link the same URI for “Pay with UPI app”.

## Checkout response (clients)

```json
{
  "order": { "id": "…", "gateway": "upi", "gatewayOrderId": "…", "status": "created" },
  "checkout": {
    "gateway": "upi",
    "gatewayOrderId": "…",
    "amountPaise": 500,
    "currency": "INR",
    "checkoutMode": "upi",
    "description": "Unlock employer contact – ₹5",
    "upi": {
      "vpa": "merchant@oksbi",
      "payeeName": "X Cron",
      "intentUri": "upi://pay?pa=…",
      "qrPayload": "upi://pay?pa=…"
    }
  }
}
```

Hosted PSP example keeps `keyId` and omits `upi` (or includes both if dual-method).

## Webhook normalization

Every adapter maps vendor payloads →:

```ts
{ gatewayOrderId, gatewayPaymentId, status: 'paid' | 'failed', rawEventId? }
```

`PaymentsService.markPaid` is the only place that grants entitlements.

## Future adapters

Mirror AI enrich (`stub` | `groq` | `ollama` | `openai`):

1. Implement `PaymentProvider`
2. One factory `case`
3. No changes to entitlement math unless product rules change
