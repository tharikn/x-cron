import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import {
  QUEUE_EMAIL_DELIVERY,
  QUEUE_NOTIFICATION_FANOUT,
  QUEUE_PUSH_DELIVERY,
} from './redis.constants';
import {
  isRedisEnabled,
  isRedisQueuesEnabled,
  redisUrl,
} from './redis.config';
import { NotificationQueueService } from './queues/notification-queue.service';
import { RedisService } from './redis.service';

const logger = new Logger('RedisModule');

@Global()
@Module({})
export class RedisModule {
  static forRoot(): DynamicModule {
    const redisOn = isRedisEnabled();
    const queuesOn = isRedisQueuesEnabled();

    const imports: NonNullable<DynamicModule['imports']> = [];
    const providers: NonNullable<DynamicModule['providers']> = [
      RedisService,
      CacheService,
      NotificationQueueService,
    ];
    const exports: NonNullable<DynamicModule['exports']> = [
      RedisService,
      CacheService,
      NotificationQueueService,
    ];

    if (redisOn && queuesOn) {
      const url = redisUrl()!;
      logger.log(
        `BullMQ queues enabled (${url.replace(/:[^:@/]+@/, ':***@')})`,
      );
      // Root connection only — queue registration + processors live in NotificationsModule.
      imports.push(
        BullModule.forRoot({
          connection: { url, maxRetriesPerRequest: null },
          prefix: 'xcron',
          defaultJobOptions: {
            attempts: 5,
            backoff: { type: 'exponential', delay: 2_000 },
            removeOnComplete: 200,
            removeOnFail: 500,
          },
        }),
        BullModule.registerQueue(
          { name: QUEUE_NOTIFICATION_FANOUT },
          { name: QUEUE_PUSH_DELIVERY },
          { name: QUEUE_EMAIL_DELIVERY },
        ),
      );
      exports.push(BullModule);
    } else if (redisOn) {
      logger.log('Redis on; REDIS_QUEUES_ENABLED=0 — inline delivery.');
    } else {
      logger.log('Redis off — memory throttle/cache/queues.');
    }

    return {
      module: RedisModule,
      global: true,
      imports,
      providers,
      exports,
    };
  }
}
