import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { IngestionModule } from '../ingestion/ingestion.module';
import { JobsModule } from '../jobs/jobs.module';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsScheduler } from './integrations.scheduler';
import { IntegrationsService } from './integrations.service';
import { IntegrationsStore } from './integrations.store';
import { PartnerController } from './partner.controller';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [AuthModule, JobsModule, IngestionModule],
  controllers: [
    IntegrationsController,
    PartnerController,
    WebhookController,
  ],
  providers: [
    IntegrationsStore,
    IntegrationsService,
    IntegrationsScheduler,
  ],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
