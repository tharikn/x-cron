# Security, Privacy & Compliance (X Cron)

Maps the job-portal baseline (**§14 Security, Privacy and Compliance**) onto what X Cron ships today, what we closed in this pass, and what stays deferred until a production launch.

Related: [AUTHENTICATION.md](AUTHENTICATION.md) · [api/src/security/CLAUDE.md](../api/src/security/CLAUDE.md) · [DEVELOPER.md](DEVELOPER.md)

> Not legal advice. India DPDP / IT / consumer / intermediary obligations need qualified counsel before public paid launch.

---

## 1. Threat model (in scope)

Protect against: account takeover, credential stuffing, IDOR, recruiter data scraping, malicious uploads, fake employers, spam, SQL injection, XSS, CSRF, SSRF, supply-chain compromise, insider misuse.

X Cron MVP posture: modular Nest API + cookie/Bearer sessions + RBAC + rate limits + input protector; clients hide admin/recruiter chrome only after `/auth/me`.

---

## 2. Minimum controls — status

| Control | Status | Notes |
| --- | --- | --- |
| TLS everywhere; HSTS on production web/API | **Partial** | Render terminates TLS. API `helmet` HSTS when `NODE_ENV=production`. Web SSR sets HSTS + frame/nosniff/referrer headers. |
| Argon2id / bcrypt password hashing | **MVP OK** | scrypt + per-user salt + `timingSafeEqual` (`auth.store`). Argon2id optional later. |
| MFA for privileged roles | **Deferred** | Admin login is `@SensitiveThrottle` **1/hour** + env password. TOTP MFA before broad admin launch. |
| Secure cookies + CSRF | **Done** | HttpOnly access/refresh + readable CSRF twin; skipped for Bearer / auth bootstrap. |
| Strict CORS, CSP, security headers | **Partial** | `CORS_ORIGINS` allow-list. API CSP off (JSON). Web SSR baseline headers; fuller CSP after inventory of third-party scripts (GIS, etc.). |
| DTO validation, output encoding, parameterized SQL | **Done** | `ValidationPipe` whitelist + `@IsXcron*` / sanitize; Prisma parameterized; `InputProtectorMiddleware`. |
| Rate limits + bot/abuse monitoring | **Partial** | Global + `@AuthThrottle` / `@ApplyThrottle` / `@ChatThrottle` / `@SensitiveThrottle`. No external bot farm yet. |
| Secrets manager; rotation; least privilege | **Deferred** | Env / Render secrets for MVP. |
| Dependency / container scanning | **Partial** | API CI `npm audit --audit-level=high` (non-blocking). Container scan deferred. |
| Private object storage, signed URLs, malware scan | **N/A / deferred** | No seeker resume upload (structured apply profiles only). Admin import files are memory-parsed, not served as public objects. Malware SaaS deferred. |
| DB backups encrypted + restore drills | **Deferred** | Prisma/Postgres path exists; ops drill not done (see DEVELOPER release gate). |
| Audit logging for privileged access / exports | **MVP** | In-process `AuditService` ring + structured logs: admin login, account export/delete, import upload. Durable table / SIEM later. |

---

## 3. File upload controls

Admin ingestion only (`POST /v1/import-batches/:id/uploads`):

- Allow-list: CSV, TXT, PDF, PNG, JPEG, WEBP
- Magic-byte / active-content checks; reject SVG/HTML/`<script>`
- Size cap **8MB** (multer + `assertSafeUpload`)
- Parsed in memory → import records; original filename is metadata only (not a public storage path)
- Audit event `import.upload`
- No CV/resume upload path for seekers (by design)

---

## 4. Candidate privacy

| Requirement | Status |
| --- | --- |
| Profile visibility explicit + reversible | `showContact` default **false** (Account / Profile) |
| Separate consent: job alerts / marketing / recruiter visibility | Job alerts + marketing + channel toggles on Preferences; recruiter visibility via Easy apply + `showContact` |
| Explain what happens when applying | Easy apply disclosure on job detail + Privacy page |
| Export + account closure | `GET /v1/me/export` · `DELETE /v1/me` (clients: Export my data / Delete account) |
| Restrict recruiter exports / bulk scraping | No bulk seeker export API; applications are job-owner scoped; apply anti-spam caps |
| Retention / deletion schedules | Account wipe clears payments/prefs/seeker/apply-profiles/applications/feedback/reputation/notifications + auth. Formal retention schedule = launch counsel |
| Minimise PII in logs / analytics / AI | Audit meta avoids passwords; AI prompts forbid inventing contacts / protected traits; notifications omit phone/WhatsApp |

Public pages: `/privacy`, `/terms` (web) · `/tabs/privacy` (mobile). Footer legal links point here.

---

## 5. AI and automated decisions

- Job enrich + help chat are **off by default** (`AI_ENRICH_ENABLED` / `AI_HELP_ENABLED`).
- Role: text cleanup / app help only — **not** candidate ranking or hiring decisions.
- Prompts: no invented contacts; no protected-trait inference; human review before publish.
- Correction: moderators edit enrich results; seekers edit apply-profile fields.
- No resume-parsing AI (no CV upload).

---

## 6. India-focused legal review

Checklist before launch (owner: product + counsel):

- [ ] DPDP applicability, notice/consent, purpose limitation
- [ ] Cross-border processing (if any LLM/PSP abroad)
- [ ] Intermediary / IT Rules safe-harbour ops
- [ ] Consumer / employment advertising rules for job posts
- [ ] Play Store privacy disclosures + data safety form

Do not treat this file as counsel sign-off.

---

## 7. Security testing

| Practice | Status |
| --- | --- |
| OWASP ASVS / MASVS | Deferred formal assessment |
| SAST / secret scan / container scan in CI | Partial — build + `npm audit` (high); expand later |
| DAST against staging | Deferred |
| Authorisation / IDOR suite | Covered in part by e2e + `@Roles` / ownership checks; expand dedicated IDOR tests |
| Pen test | Deferred until broader launch |

---

## 8. Incident response (MVP runbook)

**Severity**

| Level | Examples | Response target |
| --- | --- | --- |
| Sev-1 | Auth bypass, mass PII leak, payment webhook forgery | Immediate contain + rotate secrets |
| Sev-2 | Elevated privilege abuse, malware in import pipeline | Same day |
| Sev-3 | Single-account compromise, spam wave | Next business day |

**Roles:** incident commander = on-call engineer / founder; legal notify if personal data of many users may be affected (counsel).

**Steps:** (1) contain (revoke sessions, disable gateway/AI keys, tighten CORS) (2) preserve logs / audit ring / Render logs (3) assess notification duty (4) recover (patch, rotate, restore from backup when available) (5) postmortem + corrective actions.

**Contacts:** maintain a private ops list (not in repo). Backup restore procedure: Prisma migrate + host snapshots — drill before launch.

---

## Gap backlog (production)

1. Admin MFA (TOTP) + break-glass
2. Durable `AuditEvent` table + admin viewer
3. Secrets manager + dependency/container gate that fails CI
4. Formal CSP on web; WAF / bot protection
5. Backup encryption + restore drill evidence
6. Counsel-reviewed Privacy/Terms + DPDP notices
7. Pen test + ASVS checklist sign-off
