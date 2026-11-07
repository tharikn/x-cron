import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';
import {
  isRedisThrottleEnabled,
  redisUrl,
} from '../redis/redis.config';
import { THROTTLE_DEFAULT } from './security.constants';
import { AuditService } from './audit.service';
import { CorrelationIdMiddleware } from './correlation-id.middleware';
import { CsrfGuard } from './csrf.guard';
import { InputProtectorMiddleware } from './input-protector.middleware';
import { SecurityThrottlerGuard } from './security-throttler.guard';

function envInt(name: string, fallback: number): number {
  const raw = Number(process.env[name] ?? '');
  return Number.isFinite(raw) && raw > 0 ? raw : fallback;
}

function buildThrottlerModule() {
  const throttlers = [
    {
      name: THROTTLE_DEFAULT,
      ttl: envInt('RATE_LIMIT_TTL_MS', 60_000),
      limit: envInt('RATE_LIMIT_MAX', 120),
    },
  ];

  if (isRedisThrottleEnabled()) {
    const url = redisUrl()!;
    // Fail-fast if Redis is down — do not buffer every limiter call offline.
    const redis = new Redis(url, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      lazyConnect: false,
    });
    return ThrottlerModule.forRoot({
      throttlers,
      storage: new ThrottlerStorageRedisService(redis),
    });
  }

  return ThrottlerModule.forRoot(throttlers);
}

@Global()
@Module({
  imports: [
    /**
     * Single named throttler. Route decorators override `limit`/`ttl` for
     * auth (~10/min) and sensitive (1/hour) endpoints — do not register
     * separate global named throttlers (Nest applies all of them to every route).
     * When REDIS_URL + REDIS_THROTTLE_ENABLED: Redis-backed counters for multi-instance.
     */
    buildThrottlerModule(),
  ],
  providers: [
    AuditService,
    {
      provide: APP_GUARD,
      useClass: SecurityThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CsrfGuard,
    },
  ],
  exports: [ThrottlerModule, AuditService],
})
export class SecurityModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(CorrelationIdMiddleware, InputProtectorMiddleware)
      .forRoutes('*');
  }
}
