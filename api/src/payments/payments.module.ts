import { Module } from '@nestjs/common';
import { JobsModule } from '../jobs/jobs.module';
import { SiteModule } from '../site/site.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentsStore } from './payments.store';

@Module({
  imports: [JobsModule, SiteModule],
  controllers: [PaymentsController],
  providers: [PaymentsStore, PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
