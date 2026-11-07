import { Module, forwardRef } from '@nestjs/common';
import { ApplicationsModule } from '../applications/applications.module';
import { JobsModule } from '../jobs/jobs.module';
import { ModerationModule } from '../moderation/moderation.module';
import {
  AdminCompaniesController,
  CompaniesController,
  CompanyInvitationsController,
  RecruiterController,
} from './companies.controller';
import { CompaniesService } from './companies.service';
import { CompaniesStore } from './companies.store';

@Module({
  imports: [
    forwardRef(() => JobsModule),
    forwardRef(() => ApplicationsModule),
    forwardRef(() => ModerationModule),
  ],
  controllers: [
    CompaniesController,
    CompanyInvitationsController,
    RecruiterController,
    AdminCompaniesController,
  ],
  providers: [CompaniesStore, CompaniesService],
  exports: [CompaniesService, CompaniesStore],
})
export class CompaniesModule {}
