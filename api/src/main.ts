import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // rawBody required for Razorpay webhook HMAC verification
  const app = await NestFactory.create(AppModule, { rawBody: true });

  const origins = (process.env.CORS_ORIGINS ?? 'http://localhost:4200,http://localhost:4201')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  app.enableCors({
    origin: origins,
    credentials: true,
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
