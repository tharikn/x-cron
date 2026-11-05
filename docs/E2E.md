# X Cron — Playwright E2E

Canonical runbook: [`e2e/README.md`](../e2e/README.md).

## One command

```bash
npm run test:e2e
```

Produces:

| Artifact | Path |
| --- | --- |
| Issues digest (QA defect list) | `e2e/test-results/ISSUES.md` |
| HTML report | `e2e/playwright-report/index.html` |
| Traces / screenshots / video | `e2e/test-results/` (on failure) |

## Traditional handling (how mature apps do this)

1. **Critical path (`@smoke`)** on every PR — guest browse, seeker register, recruiter post gate.
2. **Full journeys (option C)** nightly / pre-release — this suite.
3. **API seed + UI assert** — create users/jobs via `/v1` Bearer + stable `X-Tab-Id`, then drive the client.
4. **Page Object Model** — locators live in `e2e/pages/`, not duplicated in specs.
5. **Failure digest** — triage `ISSUES.md` like a bug list; fix product or selectors; re-run.
6. **Isolated e2e API** — when the runner starts API it uses memory stores + raised rate limits (`AUTH_SINGLE_TAB=0`, sensitive max 50). Reusing a prod-like API with `AUTH_SINGLE_TAB=1` requires the helper’s per-session tab id (already wired).

## Coverage map (docs → specs)

| Product flow (docs / CLAUDE) | Spec |
| --- | --- |
| Guest discover / brand | `01-guest-discover` |
| Guest chrome (ui-auth) | `02-guest-chrome` |
| Seeker Sign Up / login | `03-seeker-register` |
| Profile · Apply version · Easy apply · public contact | `04-seeker-profile-apply` |
| Recruiter Sign Up · Post · My jobs · analytics | `05-recruiter-post` |
| Applied · Timeline · employer review | `06-applications-timeline` |
| Saved · My Rating | `07-saved-feed-rating` |
| Notifications · Prefs · Theme | `08-notifications-prefs-theme` |
| Feedback FAQ + Contact Admin | `09-feedback` |
| employerGuard · role chrome · admin gates | `10-routing-guards` |
| Admin desk | `11-admin-desk` |
| Golden dual-role journey | `12-end-to-end-journey` |
