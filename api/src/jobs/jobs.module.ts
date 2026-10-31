import { Module, forwardRef } from '@nestjs/common';
import { AdsModule } from '../ads/ads.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SiteModule } from '../site/site.module';
import { JobsController } from './jobs.controller';
import { JobsMemoryStore } from './jobs.memory-store';
import { JobsService } from './jobs.service';

@Module({
  imports: [
    SiteModule,
    forwardRef(() => NotificationsModule),
    forwardRef(() => AdsModule),
  ],
  controllers: [JobsController],
  providers: [JobsMemoryStore, JobsService],
  exports: [JobsService, JobsMemoryStore],
})
export class JobsModule {}

