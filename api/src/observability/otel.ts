import { Logger } from '@nestjs/common';
import { flagEnabled } from '../config/env.validation';

const logger = new Logger('OpenTelemetry');

/**
 * Optional Node tracer bootstrap (doc 01 observability).
 * Enable with OTEL_ENABLED=1. Uses console span exporter when no OTLP endpoint.
 */
export async function startOpenTelemetry(): Promise<void> {
  if (!flagEnabled(process.env.OTEL_ENABLED, false)) {
    return;
  }

  try {
    const { Resource } = await import('@opentelemetry/resources');
    const {
      ATTR_SERVICE_NAME,
    } = await import('@opentelemetry/semantic-conventions');
    const { NodeTracerProvider } = await import(
      '@opentelemetry/sdk-trace-node'
    );
    const { SimpleSpanProcessor, ConsoleSpanExporter } = await import(
      '@opentelemetry/sdk-trace-base'
    );

    const serviceName =
      process.env.OTEL_SERVICE_NAME?.trim() || 'xcron-api';
    const provider = new NodeTracerProvider({
      resource: new Resource({
        [ATTR_SERVICE_NAME]: serviceName,
      }),
    });
    provider.addSpanProcessor(
      new SimpleSpanProcessor(new ConsoleSpanExporter()),
    );
    provider.register();
    logger.log(`OpenTelemetry tracing on service=${serviceName}`);
  } catch (err) {
    logger.warn(
      `OTEL_ENABLED but SDK init failed: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
  }
}
