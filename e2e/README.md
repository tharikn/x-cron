# X Cron Playwright journeys

End-to-end coverage from **user creation → end journey** for **mobile (`:4200`)** and **web (`:4201`)**, against API `:3000`.

Mapped from project docs (`docs/DEVELOPER.md`, `mobile/CLAUDE.md`, `web/CLAUDE.md`, `xcron-ui-auth`).

## One command

From repo root (starts or reuses API + clients):

```bash
npm run test:e2e
```

Scoped:

```bash
npm run test:e2e:mobile
npm run test:e2e:web
npm run test:e2e -- --grep @smoke
npm run test:e2e:report
```

## Traditional app pattern (what we copied)

| Practice | Here |
| --- | --- |
| Critical + full journeys | `@smoke` tags + full `@journey` / role suites |
| Page Object Model | `e2e/pages/*` |
| API seed + UI assert | `e2e/helpers/api-client.ts` (Bearer, skips CSRF) |
| Role fixtures | seeker / recruiter / admin helpers |
| Single orchestrator | `scripts/run-e2e.mjs` |
| Failure digest | `e2e/test-results/ISSUES.md` + HTML + trace/screenshot/video |
| Serial workers | `workers: 1` (session + rate-limit safe) |

## Suites

| Spec | Covers |
| --- | --- |
| `01-guest-discover` | Brand, list/search |
| `02-guest-chrome` | Guest nav gates + Feedback FAQ |
| `03-seeker-register` | Sign Up Job Seeker + login |
| `04-seeker-profile-apply` | Profile, apply versions, Easy apply, public contact |
| `05-recruiter-post` | Recruiter signup, Post desk, My jobs, analytics |
| `06-applications-timeline` | Applied list, Overview/Chat/Timeline, employer review |
| `07-saved-feed-rating` | Saved jobs, My Rating |
| `08-notifications-prefs-theme` | Auth-only Settings surfaces |
| `09-feedback` | FAQ + Contact Admin |
| `10-routing-guards` | employerGuard, role chrome, admin gates |
| `11-admin-desk` | Admin login / desks (skips if SensitiveThrottle) |
| `12-end-to-end-journey` | Golden path dual-role |

## Issues list

After each run:

1. Open `e2e/test-results/ISSUES.md` — triage like a QA defect list.
2. Open `e2e/playwright-report/index.html` — screenshots / traces.
3. Fix product or selectors; re-run.

Admin login uses API `@SensitiveThrottle` (**1/hour** on default config). The runner starts API with `RATE_LIMIT_SENSITIVE_MAX=50` when it boots the API itself. If you reuse a long-lived API, admin tests may skip — that skip is listed in the digest.

## Env overrides

| Var | Default |
| --- | --- |
| `XCRON_API_URL` | `http://localhost:3000/v1` |
| `XCRON_MOBILE_URL` | `http://localhost:4200` |
| `XCRON_WEB_URL` | `http://localhost:4201` |
| `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` | from local API `.env` |
| `XCRON_E2E_VERBOSE` | set to `1` to stream API/client logs |
