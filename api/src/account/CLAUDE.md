# CLAUDE.md — `api/src/account/`

Account lifecycle: **portable data export** + **full wipe**.

## Endpoints

| Method | Path | Throttle | Notes |
| --- | --- | --- | --- |
| GET | `/v1/me/export` | `@AuthThrottle` | JSON download of profile, prefs, apply versions, applications, saved/hidden/searches, notification prefs. No passwords/session secrets. Audits `account.export`. |
| DELETE | `/v1/me` · `/v1/auth/me` | `@SensitiveThrottle` (1/hour) | Wipe payments/prefs/seeker/apply-profiles/applications/feedback/reputation/notifications + auth user; clears cookies. Audits `account.delete`. |

## Agent rules

- Keep wipe fan-out in sync when adding user-owned modules (includes `TrackingService.clearForUser`)
- Export must never include `passwordHash` / refresh tokens / provider secrets
- Privacy UX: web `/privacy` · mobile `/tabs/privacy`; clients offer **Export my data** next to delete
- Design: [../../../docs/SECURITY_PRIVACY.md](../../../docs/SECURITY_PRIVACY.md)
