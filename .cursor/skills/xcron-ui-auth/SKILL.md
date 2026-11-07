---
name: xcron-ui-auth
description: >-
  X Cron guest vs signed-in and seeker vs recruiter chrome rules: which nav,
  drawer, tabs, badges, and account menus stay hidden until login or by role.
  Use when editing web drawer/header, mobile tabs, Settings/Notifications/Saved/
  Apply/Activity/My Rating UI, auth gates, guest browse UX, Easy apply, or any
  client menu/nav visibility.
---

# X Cron — guest / signed-in / role UI

Guest browse is first-class. Do **not** show account-only chrome to signed-out
users. Hide those entries until `AuthService.isSignedIn()` is true after
`ensureSession()` / `GET /v1/auth/me` — never trust localStorage roles alone.

Role chrome is **stricter than guest chrome**. Recruiters (`isEmployer()`) must
never see seeker Apply / Applied / Saved hubs. Seekers must never see Recruiter
desk / Post / applicant review unless they also hold `employer` (or admin).

## Client role helpers (no `isSeeker` / `isRecruiter`)

| Helper | Meaning |
| --- | --- |
| `isSignedIn()` | Validated session after `/auth/me` |
| `isEmployer()` | Validated + `employer` **or** `admin` |
| `isAdmin()` | Validated + `admin` |
| Seeker chrome | `@if (!isEmployer())` — prefer omit, don’t grey-lock |
| Recruiter chrome | `@if (isEmployer())` |

Register `intendedRole=seeker|employer` only sets the role at signup; UI always
re-checks live `isEmployer()` / `isAdmin()`.

## Auth-only chrome (hide until signed in)

| Surface | Items |
| --- | --- |
| Web drawer | **Settings**, **Notifications**, **My Rating**, **Applied jobs**, **Saved jobs** |
| Web header | Notifications bell / unread badge |
| Web footer quick links | Settings / Preferences / Saved / Applied / Notifications / My Rating |
| Mobile bottom tabs | **Notifications**, **Settings** |
| Mobile Settings segments | **Theme**, **Prefs**, **Saved** (Language may remain if the Settings route is reached) |
| Account / Me hubs | My Rating, Applied jobs, Saved jobs, apply profiles, inbox shortcuts; web drawer profile → `/sign-in` Account tabs |

## Seeker-only chrome (hide when `isEmployer()`)

Recruiters hire; they do **not** easy-apply or manage seeker apply versions.

| Surface | Hide for recruiters |
| --- | --- |
| Account hub tabs | **Apply** (tab + panel). Deep link `?tab=apply` → clamp to **Profile** |
| Account hub **Activity** | Seeker lists (Saved / Applied / Contacted / Saved searches) |
| Job detail | **Easy apply**, apply-profile picker, “Manage apply profiles” CTA |
| Web drawer | **Applied jobs**, **Saved jobs** |
| Web footer | `ql_saved`, `ql_applied` |
| Web `/me` seeker hub | Redirect to Account **Activity** |
| `/me/applied` · `/tabs/applied` | Redirect to employer applicant review |
| Mobile Settings | **Saved** segment |
| Profile accordion | **Career** (already gated `!isEmployer()`) |

### Seeker Activity (when `!isEmployer()`)

- Saved jobs
- Applied jobs (own applications timeline)
- Contacted markers
- Saved searches

## Recruiter-only chrome (show when `isEmployer()`)

| Surface | Show for recruiters |
| --- | --- |
| Account hub **Activity** | **Incoming applications** + **Posted jobs** (not seeker lists) |
| Account **Account** tab | Recruiter desk links (Post + Review applications) |
| Web drawer / mobile tabs | **Post** · **Feeds** / my-jobs |
| Routes | `/post`, `/my-jobs`, `/employer-applications` via `employerGuard` |
| Performance | “As recruiter” score view when dual-role UI exists |

### Recruiter Activity (when `isEmployer()`)

- Incoming applications → `/employer-applications` (web) / `/tabs/employer-applications` (mobile)
- Posted jobs → `/my-jobs` + per-job analytics / applicants
- CTA → Recruiter desk `/post`

Do **not** reuse seeker Saved/Applied/Contacted/Searches blocks for employers.

## Always OK for guests

- **Home / Discover** job browse + search
- **Get the app** (APK CTA)
- **Sign in** / **Create account** / Google guest sign-in
- Public job detail + employer contact (no unlock paywall)
- **Feedback** (FAQ section) — Contact Admin messenger still requires sign-in on the page
- Employer/admin menus stay behind `isEmployer()` / `isAdmin()` **and** a validated session

## Auth-only floating chrome

- **Help chatbot FAB** (web + mobile bottom) — only when `isSignedIn()` **and** API `AI_HELP_ENABLED`; hide on logout / guest browse

## Rules agents must follow

1. **Nav = capability.** If a destination needs a session (inbox, prefs sync, saved list, score), it must not appear in guest chrome. Deep links may still exist; pages should show a Sign-in CTA, not empty account data.
2. **Same rule on web + mobile.** Gate both clients when the feature is shared.
3. **Role chrome is stricter.** Post / Feeds (my-jobs) after `isEmployer()`; Import / Job Fare / Logs / admin desks after `isAdmin()` — always from validated `/auth/me`.
4. **Seeker vs recruiter is orthogonal to guest.** First `isSignedIn()`, then `isEmployer()` / `!isEmployer()`. Never show Apply / Easy apply / Applied / Saved hubs to recruiters.
5. **Do not tease locked nav.** Prefer omit over greyed-out “locked” rows for MVP.
6. **Clamp deep links.** `?tab=apply` for employers → Profile (or Activity). Seeker `/me` and `/me/applied` → recruiter Activity / applicant review.
7. **After login**, reveal the correct role chrome immediately from signals — no full reload required. Seekers with incomplete profiles go to `/onboarding/profile` (Remind later snoozes 24h); recruiters skip.
8. **On logout / 401**, clear session and those items disappear with the same signals.
9. **API still enforces RBAC.** Client hide is UX only (`@Public` / `@Roles` on Nest).

## Implementation anchors

| Client | Files |
| --- | --- |
| Web shell | `web/src/app/app.html`, `web/src/app/app.ts` (`isSignedIn`, `isEmployer`, `showFooterQuickLink`; signed-in drawer ends with initials avatar + name + red Log out) |
| Web Account hub | `web/src/app/pages/sign-in/` — tabs Profile · Apply (seeker) · Activity (role-split) · Rating · Account |
| Web settings hub | `web/src/app/pages/settings-hub/` — Theme + Preferences tabs behind `isSignedIn()` |
| Web seeker hub | `web/src/app/pages/seeker/` — `/me` seeker-only; employers redirected |
| Mobile tabs | `mobile/src/app/tabs/tabs.page.html` |
| Mobile Account hub | `mobile/src/app/pages/account/` — same tab rules as web |
| Mobile settings | `mobile/src/app/pages/settings/settings.page.html` — Theme/Prefs behind sign-in; **Saved** seeker-only |

Pattern:

```html
@if (isSignedIn()) {
  <!-- Settings · Notifications · My Rating -->
  @if (!isEmployer()) {
    <!-- Applied · Saved · Apply tab · Easy apply -->
  }
  @if (isEmployer()) {
    <!-- Post · Recruiter Activity · Recruiter desk -->
  }
}
```

## Related

- Brand / visual tokens: root [CLAUDE.md](../../../CLAUDE.md) § UI / UX
- Docs sync after chrome changes: [xcron-claude-md](../xcron-claude-md/SKILL.md)
- RBAC on API: `@Public` / `@Roles` — client hide is UX only; API still enforces
