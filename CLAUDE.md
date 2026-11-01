# X Cron Jobs (monorepo)

Local-first, multilingual job discovery (India-first). PRD baseline v1.0.  
**Brand:** X Cron / Jobs. **Audience:** younger job seekers (Gen Z–first).

## Packages

| Dir | Role | CLAUDE.md |
| --- | --- | --- |
| `api/` | NestJS `/v1/*` API | [api/CLAUDE.md](api/CLAUDE.md) |
| `mobile/` | Ionic + Capacitor Android client | [mobile/CLAUDE.md](mobile/CLAUDE.md) |
| `web/` | Angular SSR public SEO site | [web/CLAUDE.md](web/CLAUDE.md) |
| `docs/` | Roadmap, FILE_MAP, DEVELOPER, MVP notes | — |

## UI / UX standards (web + mobile)

Keep **web (`:4201`)** and **mobile (`:4200`)** visually aligned. Prefer modern app feel over print/classifieds or raw-form HTML.

### Brand & color

- Brand name **X Cron** is a hero-level signal on Discover/home; **Jobs** is a small uppercase secondary label.
- **Monochrome only:** black / white / grayscale. No colored accents (no purple, blue CTAs, green success, etc.).
- Atmosphere via soft gray washes, grain/dot texture, and light surfaces — not flat pure-white pages or rainbow themes.
- Light theme only for MVP (no dark-mode product theme).

### Typography

- Display / brand: **Syne** (`--xcron-display` / `--xcron-font-display`).
- Body / UI: **DM Sans** (`--xcron-sans` / `--xcron-font-body`).
- Tamil: **Noto Sans Tamil** as fallback alongside the pair above.
- Do **not** use system defaults as the primary face (Segoe UI, Arial, Roboto, Inter).
- Tight display tracking on brand/headlines; clear hierarchy (title → employer → facts → about).

### Shape, depth, controls

- Rounded corners: ~10–14px controls/cards, ~22px large panels (`--xcron-radius*`). Avoid sharp `border-radius: 0` chrome.
- Soft elevation (`--xcron-shadow` / hover) instead of hairline-only boxes.
- Primary actions: solid near-black fill, white label. Secondary: outline / white fill.
- Badges/chips: compact uppercase, pill radius OK for meta only — do not overuse pill clusters.
- Inputs sit on wash backgrounds with clear focus ring (grayscale).

### Layout & content UX

- Mobile-first density; thumb-friendly tap targets (~44px+).
- First viewport: brand + one headline + one short lead + search/CTA — avoid clutter (no stat strips, promo stickers on hero media).
- Job rows/cards are the interactive containers; hover/press lift + optional “View role” cue.
- Guest browse is first-class; never show unmasked phone/email/WhatsApp on public surfaces.
- Ads stay **labelled** and visually separate from organic jobs; promoted jobs use an explicit badge.
- Respect `prefers-reduced-motion`; keep motion intentional (enter rise, hover lift, drawer/tab transitions) — 2–3 motions, not noise.

### Tokens & files of record

| Surface | Tokens / globals |
| --- | --- |
| Web | `web/src/styles.scss`, page SCSS under `web/src/app/` |
| Mobile | `mobile/src/theme/variables.scss`, `mobile/src/global.scss`, page/shared SCSS |

When changing UI, update **both** clients unless the change is package-specific (SEO/SSR vs Capacitor/Ionic).

## Shared rules for agents

- Prefer **small, focused changes**; do not drive-by refactor or fix unrelated lint.
- **RBAC:** API `AuthGuard` + `RolesGuard` are authoritative (`@Roles` / `@Public`). Clients hide admin nav and block routes only after `GET /v1/auth/me` confirms the session — never trust localStorage roles alone; clear on 401.
- Contacts are **private by default** — never put phone/email/WhatsApp in public DTOs, HTML, SEO, or caches.
- Payments use Strategy/Adapter (`PAYMENT_GATEWAY=stub|upi|razorpay`). Free path: stub or UPI VPA/QR (`upi` + `PAYMENT_UPI_VPA`). Follow [`.cursor/skills/xcron-payments/SKILL.md`](.cursor/skills/xcron-payments/SKILL.md). Notifications use the same adapter pattern (`PUSH_PROVIDER=stub|fcm`, `MAIL_PROVIDER=stub|console|smtp`) — job publish fans out in-app + push + mail with dispatch/delivery history; stubs are ₹0. Image OCR uses free local Tesseract (`OCR_PROVIDER=tesseract`; `stub` to disable). Do not assume live Razorpay/Firebase.
- Optional AI job-text enrich is **off by default** (`AI_ENRICH_ENABLED=0`). Prefer free Groq or local Ollama — see `api/src/ai/CLAUDE.md`. Never invent contacts in public descriptions.
- Job Fare channel pull is **free-first**: Telegram Bot API + WhatsApp paste bridge only — never unofficial WA scrapers. See [docs/CHANNEL_PULL.md](docs/CHANNEL_PULL.md) · [api/src/channels/CLAUDE.md](api/src/channels/CLAUDE.md).
- When you change a package or feature folder, update that package’s `CLAUDE.md` (and add a folder `CLAUDE.md` for new modules).
- Default data store is **in-memory**; Prisma schema exists but is not the live path yet.
- Node **22.22.3+**. Install API with `npm install --legacy-peer-deps` if peers complain.
- After substantive API/mobile/web work: `npm run build` in that package.
- Only commit/push when the user asks (or when continuing the established daily push workflow they requested).

## Docs to read first

- [docs/DEVELOPER.md](docs/DEVELOPER.md) — what shipped, stubs, release gate  
- [docs/FILE_MAP.md](docs/FILE_MAP.md) — folder-wise file inventory  
- [docs/ROADMAP.md](docs/ROADMAP.md) — R0–R5 + MVP+  
- [docs/MVP_COMPLETE.md](docs/MVP_COMPLETE.md) — MVP vs production gaps  
- [docs/CHANNEL_PULL.md](docs/CHANNEL_PULL.md) — Job Fare Telegram/WA bridge design  

## Release reality

This is a **dev MVP**, not production/Play-ready. See DEVELOPER.md § release.
