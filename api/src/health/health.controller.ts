import { Controller, Get, Optional } from '@nestjs/common';
import { Public } from '../auth/decorators';
import {
  isOutboxEnabled,
  isSearchFtsEnabled,
} from '../config/env.validation';
import { OutboxService } from '../outbox/outbox.service';
import {
  isRedisCacheEnabled,
  isRedisEnabled,
  isRedisQueuesEnabled,
  isRedisThrottleEnabled,
} from '../redis/redis.config';
import { RedisService } from '../redis/redis.service';
import { NoThrottle } from '../security/decorators';

@Controller('v1/health')
export class HealthController {
  constructor(
    @Optional() private readonly redis?: RedisService,
    @Optional() private readonly outbox?: OutboxService,
  ) {}

  @Public()
  @NoThrottle()
  @Get()
  async check() {
    const redisPing = this.redis ? await this.redis.ping() : 'disabled';
    const outboxCounts = this.outbox?.enabled
      ? await this.outbox.counts()
      : undefined;
    return {
      status: 'ok',
      product: 'X Cron Jobs',
      store: process.env.JOBS_STORE ?? 'memory',
      redis: {
        configured: isRedisEnabled(),
        ping: redisPing,
        cache: isRedisCacheEnabled(),
        queues: isRedisQueuesEnabled(),
        throttle: isRedisThrottleEnabled(),
      },
      outbox: {
        enabled: isOutboxEnabled(),
        counts: outboxCounts,
      },
      searchFts: isSearchFtsEnabled(),
      fileStorage: process.env.FILE_STORAGE ?? 'local',
      time: new Date().toISOString(),
    };
  }
}
