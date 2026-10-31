# X Cron Jobs

Local-first, multilingual job discovery and publishing. India-first, mobile-first, monochrome (black & white).

Product baseline: PRD v1.0 (31 Oct 2026). Build order follows [docs/ROADMAP.md](docs/ROADMAP.md).

## Monorepo

| Path | Role |
| --- | --- |
| `mobile/` | Ionic + Capacitor + Angular Android client |
| `api/` | NestJS modular monolith (`/v1/*`) |
| `web/` | Angular SSR SEO site — planned |
| `docker-compose.yml` | PostgreSQL for later Prisma runtime |

## Quick start (Step 1)

Requires **Node.js 22.22.3+**.

```bash
# API (memory store — no Postgres required yet)
cd api
npm install --legacy-peer-deps
npm run start:dev
# http://localhost:3000/v1/health
# http://localhost:3000/docs

# Mobile
cd ../mobile
npm install
npm start
# http://localhost:4200  → talks to http://localhost:3000/v1
```

```bash
# Optional Postgres (for upcoming Prisma store)
docker compose up -d
```

## Daily compile + push

```bash
cd api && npm run build
cd ../mobile && npm run build
cd ..
git add .
git commit -m "describe the change"
git push origin main
```

## Brand

**X Cron** (uppercase X, title-case Cron). Descriptor: Jobs. UI is black/white/grayscale only.
