import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { THROTTLE_DEFAULT } from './security.constants';
import { CsrfGuard } from './csrf.guard';
import { SecurityThrottlerGuard } from './security-throttler.guard';

function envInt(name: string, fallback: number): number {
  const raw = Number(process.env[name] ?? '');
  return Number.isFinite(raw) && raw > 0 ? raw : fallback;
}

@Global()
@Module({
  imports: [
    /**
     * Single named throttler. Route decorators override `limit`/`ttl` for
     * auth (~10/min) and sensitive (1/hour) endpoints — do not register
     * separate global named throttlers (Nest applies all of them to every route).
     */
    ThrottlerModule.forRoot([
      {
        name: THROTTLE_DEFAULT,
        ttl: envInt('RATE_LIMIT_TTL_MS', 60_000),
        limit: envInt('RATE_LIMIT_MAX', 120),
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SecurityThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CsrfGuard,
    },
  ],
  exports: [ThrottlerModule],
})
export class SecurityModule {}
