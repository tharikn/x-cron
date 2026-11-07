import { BullModule } from '@nestjs/bullmq';
import { Module, forwardRef } from '@nestjs/common';
import { JobsModule } from '../jobs/jobs.module';
import { OutboxModule } from '../outbox/outbox.module';
import { PrismaService } from '../prisma/prisma.service';
import { PreferencesModule } from '../preferences/preferences.module';
import {
  QUEUE_EMAIL_DELIVERY,
  QUEUE_NOTIFICATION_FANOUT,
  QUEUE_PUSH_DELIVERY,
} from '../redis/redis.constants';
import { isRedisQueuesEnabled } from '../redis/redis.config';
import { SeekerModule } from '../seeker/seeker.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsMemoryStore } from './notifications.memory-store';
import { NotificationsPrismaStore } from './notifications.prisma-store';
import { NotificationsScheduler } from './notifications.scheduler';
import { NotificationsService } from './notifications.service';
import { NotificationsStore } from './notifications.store';
import { EmailDeliveryProcessor } from './processors/email-delivery.processor';
import { NotificationFanoutProcessor } from './processors/notification-fanout.processor';
import { PushDeliveryProcessor } from './processors/push-delivery.processor';

function resolveNotificationsStoreMode(): 'prisma' | 'memory' {
  const dedicated = (process.env.NOTIFICATIONS_STORE ?? '')
    .trim()
    .toLowerCase();
  if (dedicated === 'prisma' || dedicated === 'memory') return dedicated;
  return (process.env.JOBS_STORE ?? 'memory').toLowerCase() === 'prisma'
    ? 'prisma'
    : 'memory';
}

const queueProviders = isRedisQueuesEnabled()
  ? [
      NotificationFanoutProcessor,
      PushDeliveryProcessor,
      EmailDeliveryProcessor,
    ]
  : [];

const queueImports = isRedisQueuesEnabled()
  ? [
      BullModule.registerQueue(
        { name: QUEUE_NOTIFICATION_FANOUT },
        { name: QUEUE_PUSH_DELIVERY },
        { name: QUEUE_EMAIL_DELIVERY },
      ),
    ]
  : [];

@Module({
  imports: [
    forwardRef(() => JobsModule),
    PreferencesModule,
    forwardRef(() => SeekerModule),
    forwardRef(() => OutboxModule),
    ...queueImports,
  ],
  controllers: [NotificationsController],
  providers: [
    {
      provide: NotificationsStore,
      useFactory: (prisma: PrismaService) => {
        if (resolveNotificationsStoreMode() === 'prisma') {
          return new NotificationsPrismaStore(prisma);
        }
        return new NotificationsMemoryStore();
      },
      inject: [PrismaService],
    },
    NotificationsService,
    NotificationsScheduler,
    ...queueProviders,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
