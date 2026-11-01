---
name: xcron-claude-md
description: >-
  Keep X Cron CLAUDE.md agent guides in sync whenever code changes. Use when
  editing api/, mobile/, web/, docs/, or adding a new feature module — especially
  AI enrich, OCR, ingestion, jobs, payments/UPI gateways, or env keys.
---

# X Cron — update CLAUDE.md on every change

## Rule (verbatim)

wherever you make changes just add claude.md file

## What to do

1. After substantive edits in a package (`api/`, `mobile/`, `web/`) or a new feature folder, **update the nearest `CLAUDE.md`**.
2. If you create a new module directory (e.g. `api/src/ai/`), **add `CLAUDE.md` in that folder** describing purpose, env toggles, endpoints, and agent rules.
3. Also bump the package-level guide when env keys, modules, or smoke paths change:
   - [api/CLAUDE.md](../../../api/CLAUDE.md)
   - [mobile/CLAUDE.md](../../../mobile/CLAUDE.md)
   - [web/CLAUDE.md](../../../web/CLAUDE.md)
   - root [CLAUDE.md](../../../CLAUDE.md) for monorepo-wide rules
4. Keep `.env.example` aligned when adding env vars; never commit real secrets.
5. Prefer short, accurate deltas — do not rewrite unrelated sections.

## AI job enrich (`api/src/ai/`)

- Toggle: `AI_ENRICH_ENABLED` (default off)
- Providers: `stub` | `groq` (free tier) | `ollama` (local free) | `openai`
- Wired into bulk ingestion + quick/paste job create; preview via `POST /v1/ai/job-enrich`
- Docs of record: [api/src/ai/CLAUDE.md](../../../api/src/ai/CLAUDE.md)

## Payments / UPI (`api/src/payments/`)

- Follow project skill [xcron-payments](../xcron-payments/SKILL.md) for every
  gateway change (Strategy/Adapter, factory, free-first UPI QR/VPA).
- Gateways: `stub` | `upi` | `razorpay` (+ future Cashfree/PhonePe adapters)
- Docs of record: [api/src/payments/CLAUDE.md](../../../api/src/payments/CLAUDE.md)

## Notifications (`api/src/notifications/`)

- Strategy/Adapter: `PUSH_PROVIDER=stub|fcm`, `MAIL_PROVIDER=stub|console|smtp`
- Job publish → subscriber fan-out (in-app + push + mail) + dispatch/delivery history
- Docs of record: [api/src/notifications/CLAUDE.md](../../../api/src/notifications/CLAUDE.md)
