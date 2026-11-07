import { Module, forwardRef } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { AdsModule } from '../ads/ads.module';
import { ApplicationsModule } from '../applications/applications.module';
import { CompaniesModule } from '../companies/companies.module';
import { ModerationModule } from '../moderation/moderation.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaService } from '../prisma/prisma.service';
import { SeekerModule } from '../seeker/seeker.module';
import { SiteModule } from '../site/site.module';
import { TrackingModule } from '../tracking/tracking.module';
import { JobAnalyticsMemoryStore } from './analytics/job-analytics.memory-store';
import { JobAnalyticsPrismaStore } from './analytics/job-analytics.prisma-store';
import { JobAnalyticsService } from './analytics/job-analytics.service';
import { JobAnalyticsStore } from './analytics/job-analytics.store';
import { JobsController } from './jobs.controller';
import { JobsLifecycleService } from './jobs.lifecycle';
import { JobsMemoryStore } from './jobs.memory-store';
import { JobsPrismaStore } from './jobs.prisma-store';
import { JobsScheduler } from './jobs.scheduler';
import { JobsService } from './jobs.service';
import { JobsStore } from './jobs.store';

function resolveJobsStoreMode(): 'prisma' | 'memory' {
  return (process.env.JOBS_STORE ?? 'memory').toLowerCase() === 'prisma'
    ? 'prisma'
    : 'memory';
}

@Module({
  imports: [
    SiteModule,
    AiModule,
    forwardRef(() => NotificationsModule),
    forwardRef(() => AdsModule),
    forwardRef(() => ApplicationsModule),
    forwardRef(() => SeekerModule),
    forwardRef(() => CompaniesModule),
    forwardRef(() => ModerationModule),
    TrackingModule,
  ],
  controllers: [JobsController],
  providers: [
    {
      provide: JobsStore,
      useFactory: (prisma: PrismaService) => {
        if (resolveJobsStoreMode() === 'prisma') {
          return new JobsPrismaStore(prisma);
        }
        return new JobsMemoryStore();
      },
      inject: [PrismaService],
    },
    {
      provide: JobAnalyticsStore,
      useFactory: (prisma: PrismaService) => {
        if (resolveJobsStoreMode() === 'prisma') {
          return new JobAnalyticsPrismaStore(prisma);
        }
        return new JobAnalyticsMemoryStore();
      },
      inject: [PrismaService],
    },
    JobAnalyticsService,
    JobsLifecycleService,
    JobsService,
    JobsScheduler,
  ],
  exports: [JobsService, JobsStore, JobAnalyticsService, JobsLifecycleService],
})
export class JobsModule {}
