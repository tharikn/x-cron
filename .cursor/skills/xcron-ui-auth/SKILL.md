---
name: xcron-ui-auth
description: >-
  X Cron guest vs signed-in chrome rules: which nav, drawer, tabs, badges, and
  account menus stay hidden until login. Use when editing web drawer/header,
  mobile tabs, Settings/Notifications/Saved/Performance Score UI, auth gates,
  guest browse UX, or any client menu/nav visibility.
---

# X Cron — guest vs signed-in UI / UX

Guest browse is first-class. Do **not** show account-only chrome to signed-out
users. Hide those entries until `AuthService.isSignedIn()` is true after
`ensureSession()` / `GET /v1/auth/me` — never trust localStorage roles alone.

## Auth-only chrome (hide until signed in)

| Surface | Items |
| --- | --- |
| Web drawer | **Settings**, **Notifications**, **Performance Score**, **Saved jobs** |
| Web header | Notifications bell / unread badge |
| Web footer quick links | Settings / Preferences / Saved / Notifications / Performance Score |
| Mobile bottom tabs | **Notifications**, **Settings** |
| Mobile Settings segments | **Prefs**, **Saved** (Language may remain if the Settings route is reached) |
| Account / Me hubs | Performance Score, Saved jobs, apply profiles, inbox shortcuts; web drawer profile → `/sign-in` Account tabs (Profile · Apply · Activity · Rating · Account) |

## Always OK for guests

- **Home / Discover** job browse + search
- **Get the app** (APK CTA)
- **Sign in** / **Create account** / Google guest sign-in
- Public job detail + employer contact (no unlock paywall)
- Employer/admin menus stay behind `isEmployer()` / `isAdmin()` **and** a validated session

## Rules agents must follow

1. **Nav = capability.** If a destination needs a session (inbox, prefs sync, saved list, score), it must not appear in guest chrome. Deep links may still exist; pages should show a Sign-in CTA, not empty account data.
2. **Same rule on web + mobile.** Gate both clients when the feature is shared.
3. **Role chrome is stricter.** Post / Feeds (my-jobs) after `isEmployer()`; Import / Job Fare / Logs / admin desks after `isAdmin()` — always from validated `/auth/me`.
4. **Do not tease locked nav.** Prefer omit over greyed-out “locked” rows for MVP.
5. **After login**, reveal the auth-only items immediately from `isSignedIn()` (signals) — no full reload required.
6. **On logout / 401**, clear session and those items disappear with the same signals.

## Implementation anchors

| Client | Files |
| --- | --- |
| Web shell | `web/src/app/app.html`, `web/src/app/app.ts` (`isSignedIn`, `showFooterQuickLink`; signed-in drawer ends with initials avatar + name + red Log out) |
| Web settings hub | `web/src/app/pages/settings-hub/` — Preferences tab behind `isSignedIn()` |
| Mobile tabs | `mobile/src/app/tabs/tabs.page.html` |
| Mobile settings | `mobile/src/app/pages/settings/settings.page.html` — Prefs/Saved behind `isSignedIn()` |

Pattern:

```html
@if (isSignedIn()) {
  <!-- Settings · Notifications · Performance Score · Saved -->
}
```

## Related

- Brand / visual tokens: root [CLAUDE.md](../../../CLAUDE.md) § UI / UX
- Docs sync after chrome changes: [xcron-claude-md](../xcron-claude-md/SKILL.md)
- RBAC on API: `@Public` / `@Roles` — client hide is UX only; API still enforces
