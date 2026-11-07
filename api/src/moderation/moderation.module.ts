import { Module, forwardRef } from '@nestjs/common';
import { CompaniesModule } from '../companies/companies.module';
import { JobsModule } from '../jobs/jobs.module';
import { PrismaService } from '../prisma/prisma.service';
import { ModerationController } from './moderation.controller';
import { ModerationMemoryStore } from './moderation.memory-store';
import { ModerationPrismaStore } from './moderation.prisma-store';
import { ModerationScheduler } from './moderation.scheduler';
import { ModerationService } from './moderation.service';
import { ModerationStore } from './moderation.store';

function resolveModerationStoreMode(): 'prisma' | 'memory' {
  const dedicated = (process.env.MODERATION_STORE ?? '').trim().toLowerCase();
  if (dedicated === 'prisma' || dedicated === 'memory') return dedicated;
  return (process.env.JOBS_STORE ?? 'memory').toLowerCase() === 'prisma'
    ? 'prisma'
    : 'memory';
}

@Module({
  imports: [
    forwardRef(() => JobsModule),
    forwardRef(() => CompaniesModule),
  ],
  controllers: [ModerationController],
  providers: [
    {
      provide: ModerationStore,
      useFactory: (prisma: PrismaService) => {
        if (resolveModerationStoreMode() === 'prisma') {
          return new ModerationPrismaStore(prisma);
        }
        return new ModerationMemoryStore();
      },
      inject: [PrismaService],
    },
    ModerationService,
    ModerationScheduler,
  ],
  exports: [ModerationService],
})
export class ModerationModule {}
