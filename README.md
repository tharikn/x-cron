# X Cron Jobs

Local-first, multilingual job discovery and publishing. India-first, mobile-first, monochrome (black & white).

## Repository layout

| Path | Status |
| --- | --- |
| `mobile/` | Ionic + Capacitor + Angular Android client (**active**) |
| `api/` | NestJS API — planned |
| `web/` | Angular SSR/public SEO site — planned |
| `docs/` | Product notes |

Product baseline: `X_Cron_Jobs_Product_Requirements_and_Architecture.docx` (v1.0, 31 Oct 2026).

## Mobile app (start here)

Requirements:

- Node.js **22.22.3+**
- npm 10+

```bash
cd mobile
npm install
npm start          # http://localhost:4200
npm run build      # production web build → mobile/www
```

Capacitor (Android project sync):

```bash
cd mobile
npm run cap:sync
```

Native APK builds need Android Studio / SDK on the machine. CI currently verifies the TypeScript/web compile every push.

### What works in this MVP

- Guest discover / search / sort / filter (mock local jobs)
- Job detail with **masked** employer contact (no raw contact in UI payloads)
- Preference prompt after search activity + local preference storage
- Employer quick-post and WhatsApp/Telegram paste extraction (local mock publish)
- Strict black-and-white visual system and **X Cron** brand lockup

### Daily push workflow

1. Work in `mobile/`
2. `npm run build` before commit
3. Commit and push to `main` (or open a PR)
4. GitHub Actions runs `mobile` production build

```bash
git add .
git commit -m "mobile: describe the change"
git push origin main
```

## Brand

Primary wordmark: **X Cron** (uppercase X, title-case Cron). Descriptor: Jobs.
