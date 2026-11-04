import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // rawBody required for Razorpay webhook HMAC verification
  const app = await NestFactory.create(AppModule, { rawBody: true });

  // CommonJS middleware (avoid TS callability issues with esModuleInterop).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const helmetMw = require('helmet');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const cookieParserMw = require('cookie-parser');
  app.use(
    helmetMw({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
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
    ],
    exposedHeaders: ['Retry-After', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const isProd = (process.env.NODE_ENV ?? 'development') === 'production';
  if (!isProd || process.env.ENABLE_SWAGGER === '1') {
    const swagger = new DocumentBuilder()
      .setTitle('X Cron Jobs API')
      .setDescription(
        'Modular monolith API for local-first multilingual job discovery (PRD §17).',
      )
      .setVersion('0.1.0')
      .build();
    SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swagger));
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
