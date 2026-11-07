import { Module, forwardRef } from '@nestjs/common';
import { AdsModule } from '../ads/ads.module';
import { ApplyProfilesModule } from '../apply-profiles/apply-profiles.module';
import { JobsModule } from '../jobs/jobs.module';
import { PreferencesModule } from '../preferences/preferences.module';
import { PrismaService } from '../prisma/prisma.service';
import { SiteModule } from '../site/site.module';
import { SeekerController } from './seeker.controller';
import { SeekerMemoryStore } from './seeker.memory-store';
import { SeekerPrismaStore } from './seeker.prisma-store';
import { SeekerService } from './seeker.service';
import { SeekerStore } from './seeker.store';

function resolveStoreMode(): 'prisma' | 'memory' {
  const dedicated = (process.env.SEEKER_STORE ?? '').trim().toLowerCase();
  if (dedicated === 'prisma' || dedicated === 'memory') return dedicated;
  return (process.env.JOBS_STORE ?? 'memory').toLowerCase() === 'prisma'
    ? 'prisma'
    : 'memory';
}

@Module({
  imports: [
    forwardRef(() => JobsModule),
    ApplyProfilesModule,
    PreferencesModule,
    SiteModule,
    forwardRef(() => AdsModule),
  ],
  controllers: [SeekerController],
  providers: [
    {
      provide: SeekerStore,
      useFactory: (prisma: PrismaService) => {
        if (resolveStoreMode() === 'prisma') {
          return new SeekerPrismaStore(prisma);
        }
        return new SeekerMemoryStore();
      },
      inject: [PrismaService],
    },
    SeekerService,
  ],
  exports: [SeekerService, SeekerStore],
})
export class SeekerModule {}
