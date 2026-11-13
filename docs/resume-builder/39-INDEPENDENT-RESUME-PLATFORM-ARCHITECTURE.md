# 39 — Independent Resume Platform Architecture

## 1. Architecture decision

The Resume & Career Intelligence product is a separately owned, separately deployed platform that can be launched from X Cron Jobs and integrated by other authorized job portals.

Adopt a **microfrontend + independently deployable backend** architecture:

- **Frontend:** independent Angular application, deployable and versioned without releasing X Cron.
- **Backend:** independent NestJS application exposing versioned APIs.
- **Domain structure:** begin with a modular monolith inside the Resume platform. Keep clear module boundaries and extract services only when measured scaling, isolation, ownership or release needs justify the operational cost.
- **Data:** dedicated PostgreSQL database owned by the Resume platform. X Cron must not read or write its tables directly.
- **Integration:** authenticated APIs, short-lived identity exchange, webhooks and versioned event contracts.
- **Files:** individual resume documents and generated exports remain on the user's device. Source uploads, if server parsing is required, are transient and deleted after processing.

This is the target architecture. It does not require deploying every domain module as a separate microservice.

## 2. Goals and non-goals

### Goals

1. Operate Resume Builder independently from X Cron's web, mobile and API release cycles.
2. Allow X Cron and future partner applications to launch the same Resume experience.
3. Preserve a consistent authenticated user identity without coupling to X Cron's internal database.
4. Own the Resume domain model, database, APIs, templates, scoring rules and release lifecycle.
5. Support web, mobile web and Android/iOS host applications.
6. Keep operational cost low while preserving a path to horizontal scaling and selective service extraction.
7. Keep document files local-first and minimize sensitive data transfer.

### Non-goals

- Splitting every capability into its own microservice on day one.
- Sharing X Cron's PostgreSQL database or ORM models.
- Embedding the entire Resume product as copied Angular components inside X Cron.
- Passing long-lived access tokens in query strings or browser URLs.
- Storing generated resume binaries or permanent source uploads in cloud object storage.
- Making AI mandatory for profile editing, resume creation, preview or export.

## 3. System context

~~~text
                       +---------------------------+
                       |        X Cron Jobs        |
                       |                           |
                       | Angular Web / Ionic App   |
                       | Job Search / Applications |
                       | X Cron Identity Provider  |
                       +-------------+-------------+
                                     |
                    Launch Resume / authenticated handoff
                                     |
                                     v
+-------------------+     +----------+--------------------+
| Future Partner    |---->| Resume Web Microfrontend      |
| Job Portals       |     | Angular, independently hosted |
+-------------------+     +----------+--------------------+
                                     |
                            HTTPS + access token
                                     |
                                     v
                       +-------------+-------------+
                       | Resume API (NestJS)       |
                       | /api/v1                   |
                       | Auth / Domain Modules     |
                       +------+--------------------+
                              |
               +--------------+------------------+
               |                                 |
               v                                 v
      +-------------------+             +-------------------+
      | Resume PostgreSQL |             | Async Worker      |
      | owned by Resume   |<------------| queues/jobs       |
      +-------------------+             +-------------------+
               |
               v
      +------------------------+
      | External integrations  |
      | AI / parser / email /   |
      | authorized job sources |
      +------------------------+

User device:
- Local resume files and exports
- Local folder/file permissions
- Optional client-side parsing/rendering
~~~

X Cron is a host and integration consumer, not the owner of Resume domain data. The Resume platform must remain usable by an authorized client even if that client is not X Cron.

## 4. Repository and ownership model

Create a new repository:

**Repository:** tharikn/x-cron-resume

Suggested structure:

~~~text
x-cron-resume/
  apps/
    resume-web/                 # Angular microfrontend / standalone app
    resume-api/                 # NestJS HTTP API
    resume-worker/              # Optional asynchronous worker process
  packages/
    api-contracts/              # OpenAPI-generated/shared typed contracts
    domain/                      # Domain types and shared domain primitives
    ui/                          # Resume-specific Angular UI library
    template-engine/             # Safe declarative template/render model
    integration-sdk/             # Typed client for host applications
  database/
    prisma/
      schema.prisma
      migrations/
    seeds/
  infrastructure/
    docker/
    deployment/
    monitoring/
  docs/
    architecture/
    api/
    security/
    operations/
  .github/
    workflows/
  README.md
~~~

Use a monorepo for this new platform initially. The apps are independently buildable and deployable even though they share one repository. This reduces dependency/version drift and avoids premature repository sprawl.

### Ownership boundaries

| Concern | Owner |
|---|---|
| Job listings, employer accounts, applications | X Cron |
| Login credential lifecycle and primary identity | X Cron identity provider (initial host) |
| Career profile and structured resume data | Resume platform |
| Resume versions, templates and rendering rules | Resume platform |
| JD analysis, match, quality and parsing reports | Resume platform |
| Resume platform database and migrations | Resume platform |
| Job/application context supplied for analysis | Host portal, passed through authorized contracts |
| User's exported document files | User's device |

The Resume platform owns its own authorization decisions even when identity is issued by X Cron.

## 5. Frontend architecture — microfrontend

### 5.1 Deployment model

Deploy the Angular Resume application independently, preferably at a dedicated origin such as:

- https://resume.xcron.in for the standalone product.
- X Cron launches it through a navigation route or a controlled embedded experience.

Use the standalone origin as the reliable baseline. Avoid making iframe embedding a requirement. If a later host needs embedded rendering, implement it as an optional shell adapter with a strict origin allowlist, CSP and explicit postMessage schema.

### 5.2 Host integration options

| Integration mode | Recommendation | Notes |
|---|---|---|
| Dedicated route/subdomain navigation | Default | Lowest coupling; simplest deployment and browser security model |
| Module Federation / runtime remote | Optional later | Use only if seamless in-shell composition is a real requirement and framework/runtime versions are controlled |
| iframe | Optional fallback only | Stronger isolation but adds sizing, accessibility, navigation and secure messaging complexity |
| Native mobile WebView | Supported adapter | Use a secure native bridge for file picker/share and host navigation; never expose arbitrary native methods |

The standalone Angular app must work without the X Cron shell. Host-specific navigation, theme, analytics and file-system capabilities are adapters, not core dependencies.

### 5.3 Frontend modules and routes

Keep user experiences separated by feature boundary:

- /dashboard
- /profile
- /resumes
- /resumes/:resumeId/editor
- /resumes/:resumeId/preview
- /templates
- /job-analysis
- /match-reports
- /quality-reviews
- /parsing-lab
- /recruiter-view
- /settings

Use lazy-loaded Angular feature areas and typed API clients. UI components must not implement authoritative scoring, authorization or business rules.

### 5.4 Shared UI and branding

- Keep X Cron's monochrome visual identity: white, black and grayscale with restrained semantic status colors.
- Build responsive desktop, mobile web and Android/iOS layouts.
- Use accessible reusable components, keyboard navigation, focus management and WCAG 2.2 AA targets.
- Keep host-specific theme/navigation integration behind configuration and adapters.
- Do not make the Resume application import X Cron's private Angular modules or internal services.

## 6. Authentication and secure host handoff

### 6.1 Identity provider

Initial integration: X Cron remains the primary identity provider. The Resume API validates a signed access token using an agreed issuer, audience, signing keys and claims. The Resume platform maps the stable subject claim to its own internal user record.

Required claims should include:

- iss: trusted issuer.
- sub: stable, non-reassignable user subject.
- aud: Resume API audience.
- exp and iat: token lifetime.
- tenant_id: only when multi-tenant context is applicable.
- scope or equivalent permissions: least-privilege access.

Never accept user ID or tenant ID as authority from arbitrary request bodies or query strings.

### 6.2 Preferred browser flow

Use a standards-based OIDC Authorization Code flow with PKCE where the identity provider supports it:

1. User signs in to X Cron.
2. User selects Resume Builder.
3. Browser navigates to the Resume application with an authorization request; no bearer token is placed in the URL.
4. Resume application completes the OIDC code + PKCE flow with the trusted identity provider.
5. Resume application obtains a short-lived token whose audience is the Resume API.
6. API validates signature, issuer, audience, expiry, scopes and tenant/user context.

If X Cron does not yet support the required OIDC flow, implement a short-lived, single-use authorization-code exchange endpoint. The host creates a one-time code bound to the user, audience, redirect URI, expiry and nonce. Resume exchanges that code server-to-server for a short-lived Resume-scoped token. Do not pass refresh tokens or long-lived credentials to the browser.

### 6.3 Session handling

- Prefer secure, HttpOnly, SameSite cookies for a same-site deployment where architecture permits.
- For cross-origin SPA/API deployments, define exact CORS origins and credential policy; do not use wildcard origins with credentials.
- Keep access tokens short-lived and in memory where a browser bearer-token pattern is required.
- Never store long-lived tokens in localStorage, sessionStorage or URLs.
- Implement logout, token expiry, revocation/rotation strategy and safe return navigation.
- Mobile clients use platform secure storage and the system browser/OIDC authorization flow where supported.
- Partner platforms must register their issuer, client, redirect URIs and allowed scopes. Do not trust arbitrary issuers.

### 6.4 Authorization

The Resume API performs object-level authorization on every resource. A valid X Cron token is not sufficient to access another user's resume. Resolve the token subject to the Resume-owned user mapping, then enforce ownership/tenant scope in the service and database query.

## 7. Backend architecture — independently deployed NestJS platform

### 7.1 Initial deployment

Start with one NestJS API deployment, one Resume-owned PostgreSQL database and an optional worker deployment. The API is a **modular monolith**, not a collection of networked microservices.

This gives independent deployment from X Cron while retaining low infrastructure and development overhead.

### 7.2 Domain modules

| Domain module | Responsibilities |
|---|---|
| Identity Adapter | Token validation, user/tenant mapping, host registration |
| Career Profile | Normalized career facts and achievement bank |
| Resume Management | Resume definitions, sections, immutable versions |
| Template Catalog | Versioned declarative templates |
| Render / Preview | Shared normalized render model and layout validation |
| Import / Parser | Transient file parsing and reviewed extraction |
| Parsing Lab | Parser compatibility and diagnostics |
| Job Intelligence | JD ingestion, normalization and skill taxonomy |
| Match Engine | Evidence mapping and deterministic match reports |
| Quality Review | Rule-based quality findings and approved suggestions |
| Optimizer | Reviewable content/layout suggestions |
| Recruiter View | Read-only projection and consent-controlled sharing |
| Application Vault | Resume-to-application/version association |
| Career Readiness | Evidence-based skill gaps and goals |
| Interview Preparation | Resume-grounded interview prompts |
| Recruiter Feedback | Consent, feedback workflow and audit |
| Integration Platform | SDK, partner registration, API keys where appropriate, webhooks |
| AI Governance | Provider adapters, budgets, evaluation and audit metadata |
| Analytics | Privacy-safe aggregate usage and operational metrics |

Modules communicate through application services and domain events inside the process. Do not make HTTP calls between modules in the same deployment.

### 7.3 Optional worker

Introduce a worker when a task is long-running, retryable or resource intensive:

- large PDF/DOCX parsing;
- batch parser compatibility tests;
- AI-assisted review or interview generation;
- bulk template validation;
- webhook delivery and retries.

Use a queue only when needed. A managed queue or lightweight Redis-backed queue can be selected based on deployment environment and measured workload. Do not require Kafka for the initial product.

Workers must receive opaque job IDs and minimum necessary data. Sensitive document bytes should not be placed in durable queue payloads. Prefer client-side processing or a short-lived encrypted stream; if temporary storage is unavoidable, enforce strict TTL, encryption, access isolation and cleanup on success, failure, timeout and cancellation.

## 8. Data architecture

### 8.1 Database ownership

- Resume platform has its own PostgreSQL database and Prisma migrations.
- X Cron does not share tables, foreign keys, Prisma models or database credentials.
- Use a stable external identity key such as issuer + subject; do not use email as the durable identity key.
- Keep tenant ownership explicit on tenant-scoped records.
- Apply row ownership checks in application services and tenant-scoped queries.
- Use migrations, backups, restore tests and retention policies.

### 8.2 Data categories

| Data | Persistence |
|---|---|
| Approved career profile facts | Resume PostgreSQL |
| Structured resume content and immutable versions | Resume PostgreSQL |
| Template definitions and versions | Resume PostgreSQL or versioned application assets |
| JD normalized requirements | Resume PostgreSQL under disclosed retention policy |
| Match, quality and parsing report metadata | Resume PostgreSQL under retention policy |
| Generated PDF/DOCX/HTML/XLSX binaries | User device only |
| Uploaded source resume bytes | Client-side or transient processing only; delete immediately |
| Local folder paths and file contents | User device only |
| Analytics | Allowlisted, aggregated and privacy-safe only |
| Access/audit events | Minimal metadata; never resume/JD body or tokens |

### 8.3 File lifecycle

1. Prefer client-side parsing and rendering where feasible.
2. If server parsing is needed, accept a bounded authenticated upload or stream.
3. Validate MIME and file signature, size, page count and processing time; scan untrusted content where supported.
4. Process in an isolated worker.
5. Return structured extraction candidates for user review.
6. Delete temporary bytes on every terminal path and verify cleanup.
7. Persist only user-approved structured facts and permitted report metadata.
8. Generate export bytes as a stream and let the client save them to the selected local folder.

Never persist permanent resume files in object storage, server disk or database blobs under the current privacy requirement.

## 9. Host integration contracts

### 9.1 Launch context

The host may provide context such as:

- source application identifier;
- optional external job ID;
- optional application ID;
- target job title and normalized job description, only with authorization and user context;
- locale and return route.

Treat all host-provided job/application data as untrusted input. Validate size, schema, tenant and authorization. An external ID alone does not grant access to host data.

### 9.2 API integration

- Base path: /api/v1.
- Publish OpenAPI as the canonical API contract.
- Generate typed TypeScript SDK clients from OpenAPI.
- Require scoped user access tokens for user actions and service credentials for permitted server-to-server operations.
- Use idempotency keys for expensive create/export/review/match operations.
- Enforce per-user, per-tenant and per-client quotas.
- Never let a partner service impersonate an end user without an explicit delegated authorization model.

### 9.3 Webhooks and events

Initial outbound events may include:

- resume.profile.updated
- resume.version.created
- resume.match.completed
- resume.export.completed (metadata only)
- resume.share.revoked

Webhook requirements:

- signed payloads with timestamp and replay protection;
- endpoint verification and allowlisted HTTPS destinations;
- retries with exponential backoff and dead-letter handling;
- idempotent event IDs;
- versioned schemas;
- minimal payloads containing IDs/status, not resume text or document bytes;
- tenant/user authorization and delivery audit;
- user consent where an event reveals personal activity to a host.

For inbound events, validate source identity and schema; never trust a webhook solely because its URL is obscure.

## 10. Service extraction strategy

Do not split by feature count. Extract a module only when at least one condition is demonstrated:

1. It needs independent horizontal scaling or specialized compute.
2. It requires a different security boundary or data residency.
3. It has a distinct release cadence or team ownership.
4. It creates unacceptable failure/resource contention in the API.
5. Operational metrics show independent deployment would reduce cost or risk.

Possible future extraction order:

| Candidate | Extract when | Boundary |
|---|---|---|
| Parser/Document Processing | CPU/memory-heavy parsing affects API latency | Job API + opaque job ID + structured result |
| AI Processing | Provider workloads, quotas or cost need independent control | AI task contract; no direct database sharing |
| Export/Render | Rendering load or format dependencies need isolation | Render model in, short-lived bytes out |
| Webhook Delivery | Retries/backlogs affect API reliability | Outbox event to delivery worker/service |
| Search/Analytics | Read/report workload affects transactional database | Replicated/derived read model |

Each extracted service owns its runtime and data where justified. Communicate via APIs/events, not cross-service database joins. Keep the original modular boundaries so extraction does not require rewriting the product.

## 11. Deployment topology

### 11.1 Cost-conscious initial production topology

- Static Angular assets served from a CDN or low-cost static hosting.
- One containerized NestJS API deployment behind HTTPS reverse proxy/load balancer.
- One managed PostgreSQL instance or a properly backed-up PostgreSQL deployment.
- Worker disabled until asynchronous workloads justify it; then deploy one worker process from the same codebase.
- Secrets stored in the deployment platform's secret manager/environment injection, never committed.
- CI builds and tests each app independently; deploy frontend and API independently.
- Separate development, staging and production environments.

### 11.2 Scale-out topology

When demand grows:

- multiple stateless API replicas;
- shared managed PostgreSQL with connection pooling;
- queue + independently scaled workers;
- CDN caching for public immutable template assets;
- read replicas or derived read models only when measured read load requires them;
- separate parser/AI/export services only after extraction criteria are met.

Do not introduce Kubernetes, service mesh, Kafka or multiple databases solely for architectural appearance. Use the simplest deployment platform that meets availability and scaling needs.

### 11.3 Environment and configuration

Maintain separate values for development, staging and production. Configure API origins, allowed host origins, identity issuer/audience, signing-key discovery, database credentials, encryption keys, AI provider settings, quotas, queue configuration and webhook signing secrets through secure environment configuration.

## 12. Reliability, observability and operations

- Structured logs with correlation/request IDs; redact tokens and personal/resume content.
- Metrics: API latency/error rate, queue depth/age, parser duration/failure, export duration/failure, AI spend/quota, database pool saturation and webhook delivery.
- Distributed tracing across API, worker and external providers when multiple processes are introduced.
- Health endpoints: liveness and readiness; readiness checks required dependencies without exposing secrets.
- Timeouts, bounded retries, circuit breakers for external providers and graceful degradation.
- AI/provider outage must not block manual editing, deterministic scoring, preview or export.
- Use an outbox pattern for reliable event publication once events are persisted.
- Back up PostgreSQL and regularly test restoration.
- Define retention, deletion, incident response and key-rotation procedures.
- No sensitive resume/JD content in logs, analytics, traces or webhook payloads.

## 13. Security baseline

- TLS for all external and internal service traffic.
- OIDC/JWT signature and claim validation; rotate signing keys.
- Strict CORS allowlist, CSP, security headers and CSRF protections where cookie auth is used.
- Object-level authorization on every resume, profile, report and share.
- Rate limits and abuse controls for auth, parsing, AI, URL retrieval and exports.
- SSRF protection for URL import: block private/internal IP ranges, unsafe redirects and non-HTTP(S) schemes.
- Validate file signatures, MIME, size, decompression limits and parser timeouts.
- Use declarative templates; never execute template-supplied scripts or arbitrary AI HTML.
- Encrypt sensitive data at rest and in transit; keep secrets out of source control.
- Audit admin actions, identity mappings, sharing grants/revocations and data deletion.
- Consent-based recruiter sharing with expiry and revocation.
- Tenant isolation tests and security tests are release gates.

## 14. API and contract versioning

- Public APIs use /api/v1; introduce /api/v2 for breaking changes.
- Publish OpenAPI on every release and keep generated SDK versions aligned.
- Prefer additive changes, explicit deprecation windows and compatibility tests.
- Version webhook event schemas independently.
- Version scoring rules, parser adapters, templates and render model.
- Persist the exact resume version and engine/rule/template/parser versions referenced by each report.
- Maintain consumer contract tests for X Cron and at least one independent sample client.

## 15. CI/CD and repository workflow

### Pull request checks

1. Formatting, lint and type checks.
2. Unit and domain tests.
3. API integration and database migration tests.
4. OpenAPI breaking-change check.
5. Frontend build and accessibility smoke tests.
6. Dependency, secret and container scans.
7. Authorization, tenant isolation and file-cleanup tests.

### Deployment

- Build versioned frontend and API artifacts.
- Deploy API and frontend independently.
- Run backward-compatible migrations before application rollout.
- Use health checks and staged rollout/rollback.
- Keep API contract compatibility with the currently deployed frontend and SDK.
- Use tagged releases and maintain a deployment changelog.

## 16. Testing strategy

- Domain unit tests for career profile, versions, template validation and scoring.
- API tests for authentication, authorization, ownership and tenant isolation.
- Contract tests for X Cron and external consumers.
- End-to-end tests for sign-in handoff, create/edit/preview/export and local save.
- Cross-browser and Android/iOS device tests for file picker, download, keyboard, safe area and navigation.
- Parser fixtures for PDF/DOCX, malformed files, Unicode and reading order.
- Security tests for SSRF, upload abuse, XSS, CSRF, IDOR and webhook replay.
- Resilience tests for AI/parser/queue/database outages.
- Performance tests before splitting services or adding infrastructure.

## 17. Delivery roadmap

| Stage | Deliverables | Exit criteria |
|---|---|---|
| A — Platform foundation | New repo, Angular app, NestJS API, PostgreSQL, CI, OpenAPI, identity adapter | Independent local build/deploy; authenticated API |
| B — Host integration | Secure X Cron launch, OIDC/code exchange, SDK, return navigation | No token in URL; host can launch and sign out safely |
| C — Core builder | Profile, resumes, versions, templates, editor, preview, local export | Works independently of X Cron internals and AI |
| D — Intelligence | JD analysis, matching, quality, parsing, achievement bank | Explainable reports tied to immutable versions |
| E — Ecosystem | Webhooks, partner registration, sample integration client | A second host can integrate using public contracts |
| F — Scale | Worker, queues, selective service extraction | Extraction justified by measured bottleneck/ownership |

## 18. Architecture acceptance criteria

- [ ] Resume Builder source code is in a repository separate from X Cron.
- [ ] Resume frontend and backend can be built and deployed without deploying X Cron.
- [ ] X Cron launches Resume through a documented secure identity flow.
- [ ] No long-lived token or bearer token is passed in a URL.
- [ ] Resume API validates identity and enforces its own resource ownership.
- [ ] Resume platform owns its database, migrations and domain records.
- [ ] X Cron does not query Resume tables directly.
- [ ] A sample independent client can use the public API/SDK.
- [ ] Resume document files remain local; transient upload cleanup is tested.
- [ ] API, frontend and optional worker can be released independently.
- [ ] Every domain capability has a module boundary and documented contract.
- [ ] No separate microservice is introduced without a documented extraction reason.
- [ ] CI includes contract, security, tenant-isolation and migration checks.

## 19. Related specifications

- [01-HLD.md](./01-HLD.md)
- [02-ARCHITECTURE.md](./02-ARCHITECTURE.md)
- [05-API-DESIGN.md](./05-API-DESIGN.md)
- [10-SECURITY-PRIVACY.md](./10-SECURITY-PRIVACY.md)
- [11-MOBILE-ARCHITECTURE.md](./11-MOBILE-ARCHITECTURE.md)
- [12-WEB-ARCHITECTURE.md](./12-WEB-ARCHITECTURE.md)
- [14-PERFORMANCE-SCALABILITY.md](./14-PERFORMANCE-SCALABILITY.md)
- [37-INTEGRATION-SDK-API-AND-WEBHOOK-PLATFORM.md](./37-INTEGRATION-SDK-API-AND-WEBHOOK-PLATFORM.md)
