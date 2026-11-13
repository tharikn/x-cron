# 14 — Performance and Scalability

## 1. Performance goals

Set measurable service-level objectives after collecting baseline usage. Initial targets should distinguish ordinary CRUD from AI and document processing; do not promise a fixed latency before benchmarking.

## 2. API and database

- Index userId/tenantId, profileId, resumeId and common lookup fields.
- Paginate resume, version and report lists.
- Avoid N+1 queries; select only fields needed by the request.
- Use transactions for multi-entity updates.
- Keep database connections bounded.
- Use optimistic concurrency/version checks for concurrent editing.
- Avoid storing large binaries in PostgreSQL.

## 3. Export performance

- Benchmark PDF/DOCX rendering with long and multi-page resumes.
- Bound concurrent rendering to protect CPU/memory.
- Stream output where supported.
- Use temporary storage only when a renderer requires it.
- Cache immutable template assets, not user-specific documents.
- Do not cache sensitive exports in shared caches.

## 4. AI performance

- Apply request timeouts and bounded retries.
- Do not retry non-idempotent operations blindly.
- Use asynchronous jobs for large parsing or batch analysis when measured latency warrants it.
- Cache normalized job analysis and embeddings with version-aware keys.
- Return task status for long-running work.
- Isolate provider throttling from ordinary API traffic.

## 5. Scaling path

Start with a modular monolith inside one independently deployable service. Scale horizontally when CPU, memory, throughput or availability metrics justify it. Keep sessions stateless and use shared PostgreSQL. If export or AI workloads become noisy, move those workers into separately scalable processes while preserving module contracts.

## 6. Observability

Capture:
- request latency and error rate by endpoint
- database latency and pool saturation
- export duration and failure rate by format
- parser duration and rejected file counts
- AI latency, timeout and provider error rate
- ATS report duration
- queue depth and retry count, if queues are introduced

Use correlation IDs. Never log full resumes, contact data, uploaded document text, prompts containing PII or access tokens.

## 7. Resilience

- Timeouts and circuit breakers for external providers.
- Bounded retries with backoff.
- Graceful degradation when AI is down.
- Health/readiness endpoints.
- Database backup and restore testing.
- Cleanup job monitoring for temporary artifacts.
