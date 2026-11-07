# CLAUDE.md — `e2e/` (Playwright journeys)

Cross-client **end-to-end** coverage for X Cron: user creation → seeker/recruiter end journeys on **mobile** (`:4200`), **web** (`:4201`), and optional **Android** (Chrome on emulator/device) against API `:3000`.

Parent: [../CLAUDE.md](../CLAUDE.md) · runbook [README.md](./README.md) · [../docs/DEVELOPER.md](../docs/DEVELOPER.md) · [../docs/COMPANY_WORKSPACE.md](../docs/COMPANY_WORKSPACE.md)

## One command

```bash
# from monorepo root
npm run test:e2e
npm run test:e2e:api              # browserless /v1 contract specs
npm run test:e2e:mobile
npm run test:e2e:web
npm run test:e2e:android          # ADB device required — not in default suite
npm run test:e2e:android:smoke
npm run test:e2e -- --grep @smoke
npm run test:e2e:report
```

Orchestrator: [`../scripts/run-e2e.mjs`](../scripts/run-e2e.mjs) — reuses or starts API (e2e-friendly memory + raised rate limits when it starts API), mobile, web; then Playwright. Default run is `--project=api --project=mobile --project=web`; `--project=api` boots only the API.

## Layout

| Path | Role |
| --- | --- |
| `journeys/*.spec.ts` | Specs mapped from product docs / CLAUDE key flows (`13-company-workspace` = recruiter Company desk, `14-job-discovery`, `15-privacy-sessions-aliases`) |
| `api/*.api.spec.ts` | Project `api` — browserless `/v1` contract specs (own `testDir`; UI projects never pick them up) |
| `pages/` | Page Object Model (`company.page.ts` for `/company` · `/tabs/company`) |
| `helpers/api-client.ts` | Bearer API seed (register, job, apply, profile, `completeSeekerProfile`, company, invite); exported `request` retries 429 via `Retry-After` |
| `helpers/theme-prompt.ts` | Skip/dismiss first-open `app-theme-prompt` (localStorage + CTA) |
| `helpers/android-device.ts` | ADB reverse + Playwright `_android` Chrome session |
| `fixtures/test.ts` | `client` = mobile \| web; android project swaps Page → device Chrome |
| `reporters/issues-reporter.ts` | `test-results/ISSUES.md` defect digest |

## Agent rules

- Prefer **API seed + UI assert** over slow form-only setup (traditional practice).
- Keep `workers: 1` unless AUTH_SINGLE_* / throttles are relaxed.
- Admin UI specs must tolerate `@SensitiveThrottle` skips.
- Trust desk / Tracking admin routes are **web-only** — skip on mobile/android projects.
- Company workspace journeys must run on **web + mobile/android** (same Ionic routes for android).
- Signed-in **seeker** UI journeys: seed with `completeSeekerProfile()` (not just `upsertSeekerProfile`) or the app forces `/onboarding/profile`.
- API-contract specs use unique tokens per run (`Date.now().toString(36)`) so they stay re-runnable against a long-lived API.
- When adding a product flow, add a journey here (and an `api/` contract spec for new endpoints) **and** mention it in `docs/E2E.md`, `docs/DEVELOPER.md` + `docs/FILE_MAP.md`.
- Do not commit `test-results/` or `playwright-report/` (gitignored).
