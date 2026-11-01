# CLAUDE.md — `api/src/payments/`

Contact unlock, seeker subscriptions, post-job fees. **Entitlements are separate from the PSP.**

Agents: follow [`.cursor/skills/xcron-payments/SKILL.md`](../../../.cursor/skills/xcron-payments/SKILL.md).

## Pattern

- `PaymentProvider` Strategy/Adapter in `providers/`
- Factory: `providers/payment-provider.factory.ts` ← `PAYMENT_GATEWAY`
- Domain: `payments.service.ts` + `payments.store.ts`
- History: structured `PaymentHistoryEvent` rows (admin table + CSV/PDF export)
- Site master switch: `SiteCommerceConfig.paymentsEnabled` (+ `postJobPaymentMode`)

## Confirm security (`POST /v1/payments/dev/confirm`)

Blocked when:

- `NODE_ENV=production`
- `paymentsEnabled=false`
- gateway not `stub` / UPI without `PAYMENT_UPI_ALLOW_DEV_CONFIRM=1`
- `PAYMENT_ALLOW_CLIENT_CONFIRM=0`
- order not owned by caller, not `created`, expired (>30m), or >5 attempts

Every failure writes `confirm_failed` history (reason, IP, UA).

## Admin

- `GET /v1/admin/payments/history`
- `GET /v1/admin/payments/history/export.csv` (Excel-friendly)
- `GET /v1/admin/payments/history/export.pdf`

## Products

`job_contact_unlock` | `subscription` | `job_post`

## Env

`PAYMENT_GATEWAY`, `PAYMENT_UPI_*`, `PAYMENT_ALLOW_CLIENT_CONFIRM`, plus Settings commerce.
