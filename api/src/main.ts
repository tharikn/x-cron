import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { AppModule } from './app.module';
import { startOpenTelemetry } from './observability/otel';
import {
  ValidationExceptionFilter,
  validationFailedException,
} from './security/validation';

async function bootstrap() {
  await startOpenTelemetry();

  // rawBody required for Razorpay webhook HMAC verification
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  // CommonJS middleware (avoid TS callability issues with esModuleInterop).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const helmetMw = require('helmet');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const cookieParserMw = require('cookie-parser');
  const isProd = (process.env.NODE_ENV ?? 'development') === 'production';
  app.use(
    helmetMw({
      // API returns JSON — CSP is enforced on the web SSR origin instead.
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      hsts: isProd
        ? { maxAge: 15552000, includeSubDomains: true, preload: false }
        : false,
      referrerPolicy: { policy: 'no-referrer' },
    }),
  );
  app.use(cookieParserMw());

  const origins = (process.env.CORS_ORIGINS ?? 'http://localhost:4200,http://localhost:4201')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  app.enableCors({
    origin: origins,
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-CSRF-Token',
      'X-Tab-Id',
      'X-Retry-After-Refresh',
      'X-Requested-With',
      'X-Request-Id',
    ],
    exposedHeaders: [
      'Retry-After',
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-Request-Id',
    ],
  });

  /**
   * Portfolio drafts carry pasted/imported HTML + CSS + JS (up to ~520 KB of
   * code per document, see the custom-code registry entry), which exceeds the
   * Express default 100 KB JSON limit. Registering this parser before Nest's
   * own (at init) replaces the default limit while keeping the `rawBody`
   * capture the Razorpay webhook HMAC depends on.
   */
  app.useBodyParser('json', { limit: '2mb' });

  app.useGlobalFilters(new ValidationExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: validationFailedException,
    }),
  );

  if (!isProd || process.env.ENABLE_SWAGGER === '1') {
    const swagger = new DocumentBuilder()
      .setTitle('X Cron Jobs API')
      .setDescription(
        'Modular monolith API for local-first multilingual job discovery (PRD §17).',
      )
      .setVersion('0.1.0')
      .build();
    const document = SwaggerModule.createDocument(app, swagger);
    SwaggerModule.setup('docs', app, document);
    // Typed client codegen input: npm run openapi:export (or OPENAPI_EXPORT=1 at boot)
    if (process.env.OPENAPI_EXPORT === '1') {
      const out = join(process.cwd(), 'openapi.json');
      await writeFile(out, JSON.stringify(document, null, 2), 'utf8');
      // eslint-disable-next-line no-console
      console.log(`OpenAPI exported to ${out}`);
    }
  }

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`X Cron API listening on http://localhost:${port}`);
  if (!isProd || process.env.ENABLE_SWAGGER === '1') {
    // eslint-disable-next-line no-console
    console.log(`OpenAPI docs at http://localhost:${port}/docs`);
  }
}

bootstrap();
