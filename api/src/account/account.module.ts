import { Module } from '@nestjs/common';
import { ApplicationsModule } from '../applications/applications.module';
import { ApplyProfilesModule } from '../apply-profiles/apply-profiles.module';
import { FeedbackModule } from '../feedback/feedback.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentsModule } from '../payments/payments.module';
import { PreferencesModule } from '../preferences/preferences.module';
import { ReputationModule } from '../reputation/reputation.module';
import { SeekerModule } from '../seeker/seeker.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [
    PaymentsModule,
    PreferencesModule,
    SeekerModule,
    ApplyProfilesModule,
    ApplicationsModule,
    FeedbackModule,
    ReputationModule,
    NotificationsModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
