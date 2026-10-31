import { Module, forwardRef } from '@nestjs/common';
import { AdsModule } from '../ads/ads.module';
import { JobsModule } from '../jobs/jobs.module';
import { PreferencesModule } from '../preferences/preferences.module';
import { SiteModule } from '../site/site.module';
import { SeekerController } from './seeker.controller';
import { SeekerService } from './seeker.service';
import { SeekerStore } from './seeker.store';

@Module({
  imports: [
    JobsModule,
    PreferencesModule,
    SiteModule,
    forwardRef(() => AdsModule),
  ],
  controllers: [SeekerController],
  providers: [SeekerStore, SeekerService],
  exports: [SeekerService],
})
export class SeekerModule {}
