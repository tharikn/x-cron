import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplyProfilesController } from './apply-profiles.controller';
import { ApplyProfilesMemoryStore } from './apply-profiles.memory-store';
import { ApplyProfilesPrismaStore } from './apply-profiles.prisma-store';
import { ApplyProfilesService } from './apply-profiles.service';
import { ApplyProfilesStore } from './apply-profiles.store';

function resolveStoreMode(): 'prisma' | 'memory' {
  const dedicated = (process.env.APPLY_PROFILES_STORE ?? '')
    .trim()
    .toLowerCase();
  if (dedicated === 'prisma' || dedicated === 'memory') return dedicated;
  const apps = (process.env.APPLICATIONS_STORE ?? '').trim().toLowerCase();
  if (apps === 'prisma' || apps === 'memory') return apps;
  return (process.env.JOBS_STORE ?? 'memory').toLowerCase() === 'prisma'
    ? 'prisma'
    : 'memory';
}

@Module({
  controllers: [ApplyProfilesController],
  providers: [
    {
      provide: ApplyProfilesStore,
      useFactory: (prisma: PrismaService) => {
        if (resolveStoreMode() === 'prisma') {
          return new ApplyProfilesPrismaStore(prisma);
        }
        return new ApplyProfilesMemoryStore();
      },
      inject: [PrismaService],
    },
    ApplyProfilesService,
  ],
  exports: [ApplyProfilesService],
})
export class ApplyProfilesModule {}
