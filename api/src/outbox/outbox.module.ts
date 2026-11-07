import { Module, forwardRef } from '@nestjs/common';
import { isOutboxEnabled } from '../config/env.validation';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaService } from '../prisma/prisma.service';
import { OutboxMemoryStore } from './outbox.memory-store';
import { OutboxPrismaStore } from './outbox.prisma-store';
import { OutboxRelay } from './outbox.relay';
import { OutboxService } from './outbox.service';
import { OutboxStore } from './outbox.store';

function resolveOutboxStoreMode(): 'prisma' | 'memory' {
  if (!isOutboxEnabled()) return 'memory';
  return (process.env.JOBS_STORE ?? 'memory').toLowerCase() === 'prisma'
    ? 'prisma'
    : 'memory';
}

@Module({
  imports: [forwardRef(() => NotificationsModule)],
  providers: [
    {
      provide: OutboxStore,
      useFactory: (prisma: PrismaService) => {
        if (resolveOutboxStoreMode() === 'prisma') {
          return new OutboxPrismaStore(prisma);
        }
        return new OutboxMemoryStore();
      },
      inject: [PrismaService],
    },
    OutboxService,
    OutboxRelay,
  ],
  exports: [OutboxService],
})
export class OutboxModule {}
