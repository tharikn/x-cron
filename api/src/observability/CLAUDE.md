# CLAUDE.md — `api/src/observability/`

OpenTelemetry bootstrap for metrics/logs/traces (doc 01). Correlation IDs remain the primary cross-request debug tool (`CorrelationIdMiddleware`).

## Env

| Key | Default | Notes |
| --- | --- | --- |
| `OTEL_ENABLED` | `0` | `1` starts NodeTracerProvider + console span exporter |
| `OTEL_SERVICE_NAME` | `xcron-api` | Resource attribute |

Wire an OTLP exporter when a collector exists — do not spam console spans in production.
