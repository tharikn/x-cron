import { Module, forwardRef } from '@nestjs/common';
import { JobsModule } from '../jobs/jobs.module';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { AdsStore } from './ads.store';

@Module({
  imports: [forwardRef(() => JobsModule)],
  controllers: [AdsController],
  providers: [AdsStore, AdsService],
  exports: [AdsService, AdsStore],
})
export class AdsModule {}
