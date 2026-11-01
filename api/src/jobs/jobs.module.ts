import { Module, forwardRef } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { AdsModule } from '../ads/ads.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaService } from '../prisma/prisma.service';
import { SiteModule } from '../site/site.module';
import { JobsController } from './jobs.controller';
import { JobsMemoryStore } from './jobs.memory-store';
import { JobsPrismaStore } from './jobs.prisma-store';
import { JobsService } from './jobs.service';
import { JobsStore } from './jobs.store';

@Module({
  imports: [
    SiteModule,
    AiModule,
    forwardRef(() => NotificationsModule),
    forwardRef(() => AdsModule),
  ],
  controllers: [JobsController],
  providers: [
    {
      provide: JobsStore,
      useFactory: (prisma: PrismaService) => {
        if ((process.env.JOBS_STORE ?? 'memory') === 'prisma') {
          return new JobsPrismaStore(prisma);
        }
        return new JobsMemoryStore();
      },
      inject: [PrismaService],
    },
    JobsService,
  ],
  exports: [JobsService, JobsStore],
})
export class JobsModule {}
