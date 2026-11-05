import { Module, forwardRef } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaService } from '../prisma/prisma.service';
import { FeedbackController } from './feedback.controller';
import { FeedbackMemoryStore } from './feedback.memory-store';
import { FeedbackPrismaStore } from './feedback.prisma-store';
import { FeedbackService } from './feedback.service';
import { FeedbackStore } from './feedback.store';
import { FAQ_PROVIDER } from './faq/faq.provider';
import { StaticFaqProvider } from './faq/static-faq.provider';

function resolveFeedbackStoreMode(): 'prisma' | 'memory' {
  const dedicated = (process.env.FEEDBACK_STORE ?? '').trim().toLowerCase();
  if (dedicated === 'prisma' || dedicated === 'memory') return dedicated;
  return (process.env.JOBS_STORE ?? 'memory').toLowerCase() === 'prisma'
    ? 'prisma'
    : 'memory';
}

@Module({
  imports: [forwardRef(() => NotificationsModule)],
  controllers: [FeedbackController],
  providers: [
    {
      provide: FeedbackStore,
      useFactory: (prisma: PrismaService) => {
        if (resolveFeedbackStoreMode() === 'prisma') {
          return new FeedbackPrismaStore(prisma);
        }
        return new FeedbackMemoryStore();
      },
      inject: [PrismaService],
    },
    {
      provide: FAQ_PROVIDER,
      useClass: StaticFaqProvider,
    },
    FeedbackService,
  ],
  exports: [FeedbackService],
})
export class FeedbackModule {}
