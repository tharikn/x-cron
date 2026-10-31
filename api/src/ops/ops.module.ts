import { Global, Module, forwardRef } from '@nestjs/common';
import { AdsModule } from '../ads/ads.module';
import { JobsModule } from '../jobs/jobs.module';
import { OpsController } from './ops.controller';
import { OpsService } from './ops.service';
import { OpsStore } from './ops.store';

@Global()
@Module({
  imports: [forwardRef(() => JobsModule), forwardRef(() => AdsModule)],
  controllers: [OpsController],
  providers: [OpsStore, OpsService],
  exports: [OpsService],
})
export class OpsModule {}
