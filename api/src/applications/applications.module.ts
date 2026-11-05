import { Module, forwardRef } from '@nestjs/common';
import { ApplyProfilesModule } from '../apply-profiles/apply-profiles.module';
import { JobsModule } from '../jobs/jobs.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaService } from '../prisma/prisma.service';
import { ReputationModule } from '../reputation/reputation.module';
import { SeekerModule } from '../seeker/seeker.module';
import { SiteModule } from '../site/site.module';
import { ApplicationsController } from './applications.controller';
import { ApplicationsMemoryStore } from './applications.memory-store';
import { ApplicationsPrismaStore } from './applications.prisma-store';
import { ApplicationsService } from './applications.service';
import { ApplicationsStore } from './applications.store';

function resolveApplicationsStoreMode(): 'prisma' | 'memory' {
  const dedicated = (process.env.APPLICATIONS_STORE ?? '')
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
    SiteModule,
    forwardRef(() => NotificationsModule),
    ApplyProfilesModule,
    ReputationModule,
    SeekerModule,
  ],
  controllers: [ApplicationsController],
  providers: [
    {
      provide: ApplicationsStore,
      useFactory: (prisma: PrismaService) => {
        if (resolveApplicationsStoreMode() === 'prisma') {
          return new ApplicationsPrismaStore(prisma);
        }
        return new ApplicationsMemoryStore();
      },
      inject: [PrismaService],
    },
    ApplicationsService,
  ],
  exports: [ApplicationsService, ApplicationsStore],
})
export class ApplicationsModule {}
