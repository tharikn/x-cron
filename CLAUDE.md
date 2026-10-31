# X Cron Jobs (monorepo)

Local-first, multilingual job discovery (India-first). PRD baseline v1.0.  
**Brand:** X Cron / Jobs. **UI:** black / white / grayscale only — no colored accents.

## Packages

| Dir | Role | CLAUDE.md |
| --- | --- | --- |
| `api/` | NestJS `/v1/*` API | [api/CLAUDE.md](api/CLAUDE.md) |
| `mobile/` | Ionic + Capacitor Android client | [mobile/CLAUDE.md](mobile/CLAUDE.md) |
| `web/` | Angular SSR public SEO site | [web/CLAUDE.md](web/CLAUDE.md) |
| `docs/` | Roadmap, FILE_MAP, DEVELOPER, MVP notes | — |

## Shared rules for agents

- Prefer **small, focused changes**; do not drive-by refactor or fix unrelated lint.
- Contacts are **private by default** — never put phone/email/WhatsApp in public DTOs, HTML, SEO, or caches.
- Payments / FCM / OCR are largely **stubs** (`PAYMENT_MODE=stub`). Do not assume live Razorpay/Firebase.
- Default data store is **in-memory**; Prisma schema exists but is not the live path yet.
- Node **22.22.3+**. Install API with `npm install --legacy-peer-deps` if peers complain.
- After substantive API/mobile/web work: `npm run build` in that package.
- Only commit/push when the user asks (or when continuing the established daily push workflow they requested).

## Docs to read first

- [docs/DEVELOPER.md](docs/DEVELOPER.md) — what shipped, stubs, release gate  
- [docs/FILE_MAP.md](docs/FILE_MAP.md) — folder-wise file inventory  
- [docs/ROADMAP.md](docs/ROADMAP.md) — R0–R5 + MVP+  
- [docs/MVP_COMPLETE.md](docs/MVP_COMPLETE.md) — MVP vs production gaps  

## Release reality

This is a **dev MVP**, not production/Play-ready. See DEVELOPER.md § release.
