import { Module, forwardRef } from '@nestjs/common';
import { JobsModule } from '../jobs/jobs.module';
import { PrismaService } from '../prisma/prisma.service';
import { PreferencesModule } from '../preferences/preferences.module';
import { SeekerModule } from '../seeker/seeker.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsMemoryStore } from './notifications.memory-store';
import { NotificationsPrismaStore } from './notifications.prisma-store';
import { NotificationsService } from './notifications.service';
import { NotificationsStore } from './notifications.store';

function resolveNotificationsStoreMode(): 'prisma' | 'memory' {
  const dedicated = (process.env.NOTIFICATIONS_STORE ?? '')
    .trim()
    .toLowerCase();
  if (dedicated === 'prisma' || dedicated === 'memory') return dedicated;
  return (process.env.JOBS_STORE ?? 'memory').toLowerCase() === 'prisma'
    ? 'prisma'
    : 'memory';
}

@Module({
  imports: [
    forwardRef(() => JobsModule),
    PreferencesModule,
    forwardRef(() => SeekerModule),
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
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
