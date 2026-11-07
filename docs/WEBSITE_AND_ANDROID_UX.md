# Website and Android UX (X Cron map)

Adaptation of external job-portal Doc 10 for **X Cron** (Angular SSR web + Ionic/Capacitor Android). Canonical product routes stay X Cron names; Doc 10 paths are aliases only.

Related: [DEVELOPER.md](./DEVELOPER.md) · [MOBILE_MVP.md](./MOBILE_MVP.md) · [AUTHENTICATION.md](./AUTHENTICATION.md) · [FCM_SETUP.md](./FCM_SETUP.md) · guest/role chrome [`.cursor/skills/xcron-ui-auth/SKILL.md`](../.cursor/skills/xcron-ui-auth/SKILL.md)

---

## 1. Platform approach

| Doc 10 | X Cron |
| --- | --- |
| Angular + Ionic + Capacitor | **Shipped** — `web/` SSR `:4201`, `mobile/` Capacitor Android |
| Separate native app only if needed | Not planned; deepen Capacitor instead |

---

## 2. Route structure (canonical → Doc 10 alias)

### Candidate / seeker

| X Cron | Doc 10 alias (redirect) |
| --- | --- |
| `/` (web) · `/tabs/discover` (mobile) | `/jobs` list (discover/home; SEO `/jobs/:slug` = detail) |
| `/jobs/**` | `/jobs/:slug` |
| `/sign-in` | `/login`, `/register`, `/profile` |
| `/me` · Account Apply tab | `/profile`, `/profile/resume` (no CV — apply profiles) |
| `/me/applied` · `/tabs/applied` | `/applications` |
| `/me/applications/:id` · `/tabs/applications/:id` | `/applications/:id` |
| Saved on `/me` / Settings → Saved | `/saved-jobs` |
| `/notifications` · `/tabs/notifications` | `/alerts` |
| `/feedback` · `/tabs/feedback` | `/messages` |
| `/privacy` · `/settings/privacy` · `/tabs/privacy` | `/settings/privacy` |

### Recruiter

| X Cron | Doc 10 alias |
| --- | --- |
| `/post` · `/tabs/post` | `/recruiter/dashboard`, `/recruiter/jobs/new` |
| `/my-jobs` · `/tabs/my-jobs` | `/recruiter/jobs` |
| `/my-jobs/:id` | `/recruiter/jobs/:id` |
| `/employer-applications` | `/recruiter/jobs/:id/applicants` |
| Company via `/employers/:id` | `/recruiter/company` (alias → post for now) |

### Admin

| X Cron | Doc 10 alias |
| --- | --- |
| `/admin` | `/admin/dashboard` |
| `/blog-approval` | `/admin/jobs/review` |
| `/admin/notifications` | `/admin/audit` (closest ops log) |

Guards remain UX-only (`employerGuard` / `adminGuard`); API `@Roles` is authoritative.

---

## 3. Responsive behaviour

| Surface | Behaviour |
| --- | --- |
| Candidate search (web home) | List then full `/jobs/:slug` (no desktop sticky preview pane) |
| Recruiter ATS | `/employer-applications` list/detail split on desktop; compact rows on narrow viewports (no kanban yet) |
| Admin desks | Full-bleed tables / evidence panels; usable on tablet |
| Primary workflows | Avoid horizontal scroll (shared night-sky shell) |

---

## 4. Android-specific

| Requirement | X Cron status |
| --- | --- |
| Hardware back | `AndroidBackService` — history → Discover → `App.exitApp()` |
| Deep links | `DeepLinkService` + Manifest `https://x-cron.onrender.com` + `xcron://`; maps jobs, applications, feedback, Doc 10 aliases |
| FCM + notification routing | `NotificationsService` — register/rotate when `fcmEnabled`; tap → `pathFromPayload` |
| Resume / file upload | Apply profiles are **no CV**; import OCR uses Capacitor file/camera. Progress/retry for CV N/A |
| Network + resume | `ConnectivityService` offline banner; app resume refreshes session/inbox |
| Token storage | Access in memory; refresh cookie / Bearer restore — encrypted vault deferred |
| Permissions | Notifications / camera requested at feature use (prefs + import) |
| Version / minSdk | `android/app/build.gradle` `versionCode` / `versionName`; Capacitor `minSdkVersion` from variables |

---

## 5. Shared frontend patterns

| Pattern | Where |
| --- | --- |
| Typed API services | `web|mobile/src/app/core/services/*` |
| Auth interceptor + single-flight refresh | `auth.interceptor` + `AuthService.refreshPromise` |
| Correlation ID | Client `correlationInterceptor` (`X-Request-Id`); API `CorrelationIdMiddleware`; errors may show `(ref: …)` via `friendlyHttpMessage` |
| Route guards | `employerGuard`, `adminGuard` |
| Skeleton / empty / offline / retry | Shared skeleton components; offline banner; page Refresh actions |
| Route overlay enter | **Web:** left→right (`shared/route-enter` on shell + Settings panel). **Mobile/Android:** bottom→top (`xcron-nav-animation` Ionic `navAnimation` + tab `ionTabsDidChange`). Path-change only; `prefers-reduced-motion` skips |
| Feature flags | Env toggles (`AI_*`, `fcmEnabled`, payment gateway) — not a client flag SDK |

---

## 6. Accessibility and localisation

- Semantic headings on hubs; reduced-motion tokens in web `styles.scss` / mobile globals
- Locale service + `en-IN` date/salary helpers (`formatPostedDate`, `formatSalary`)
- Full WCAG 2.2 AA audit still deferred; privacy copy at `/settings/privacy`

---

## 7. Acceptance criteria (mapped)

| Criterion | Notes |
| --- | --- |
| Search, view, apply, track on Android | Discover → job detail Easy apply → `/tabs/applied` + timeline |
| Common mobile viewports | Phone frame + responsive web |
| Deep links to authenticated screens | `xcron://` / https host → tabs; session restore via `ensureSession` |
| Upload interruption / resume | N/A for CV; import batches are admin OCR |
| Keyboard / screen-reader on core journeys | Partial — continue when touching those pages |

---

## Intentionally not copied from Doc 10

- Unlock / contact paywall UX (X Cron shows employer contact on the public job DTO)
- CV/resume upload hub (apply profiles: skills 2–7 + summary)
- Kanban ATS board
- Separate `/recruiter/team` product surface
