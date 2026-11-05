# CLAUDE.md — `e2e/` (Playwright journeys)

Cross-client **end-to-end** coverage for X Cron: user creation → seeker/recruiter end journeys on **mobile** (`:4200`) and **web** (`:4201`) against API `:3000`.

Parent: [../CLAUDE.md](../CLAUDE.md) · runbook [README.md](./README.md) · [../docs/DEVELOPER.md](../docs/DEVELOPER.md)

## One command

```bash
# from monorepo root
npm run test:e2e
npm run test:e2e:mobile
npm run test:e2e:web
npm run test:e2e -- --grep @smoke
npm run test:e2e:report
```

Orchestrator: [`../scripts/run-e2e.mjs`](../scripts/run-e2e.mjs) — reuses or starts API (e2e-friendly memory + raised rate limits when it starts API), mobile, web; then Playwright.

## Layout

| Path | Role |
| --- | --- |
| `journeys/*.spec.ts` | Specs mapped from product docs / CLAUDE key flows |
| `pages/` | Page Object Model |
| `helpers/api-client.ts` | Bearer API seed (register, job, apply, profile) |
| `fixtures/test.ts` | `client` = mobile \| web from project name |
| `reporters/issues-reporter.ts` | `test-results/ISSUES.md` defect digest |

## Agent rules

- Prefer **API seed + UI assert** over slow form-only setup (traditional practice).
- Keep `workers: 1` unless AUTH_SINGLE_* / throttles are relaxed.
- Admin UI specs must tolerate `@SensitiveThrottle` skips.
- When adding a product flow, add a journey here **and** mention it in `docs/DEVELOPER.md` + `docs/FILE_MAP.md`.
- Do not commit `test-results/` or `playwright-report/` (gitignored).
