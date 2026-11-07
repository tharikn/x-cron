import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AiModule } from './ai/ai.module';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/roles.guard';
import { ChannelsModule } from './channels/channels.module';
import { CompaniesModule } from './companies/companies.module';
import { validateEnv } from './config/env.validation';
import { FilesModule } from './files/files.module';
import { HealthController } from './health/health.controller';
import { I18nModule } from './i18n/i18n.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { JobsModule } from './jobs/jobs.module';
import { AccountModule } from './account/account.module';
import { AdsModule } from './ads/ads.module';
import { ApplyProfilesModule } from './apply-profiles/apply-profiles.module';
import { ApplicationsModule } from './applications/applications.module';
import { FeedbackModule } from './feedback/feedback.module';
import { LocationsModule } from './locations/locations.module';
import { ModerationModule } from './moderation/moderation.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OpsModule } from './ops/ops.module';
import { OutboxModule } from './outbox/outbox.module';
import { PaymentsModule } from './payments/payments.module';
import { PreferencesModule } from './preferences/preferences.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReputationModule } from './reputation/reputation.module';
import { SeekerModule } from './seeker/seeker.module';
import { RedisModule } from './redis/redis.module';
import { SecurityModule } from './security/security.module';
import { SiteModule } from './site/site.module';
import { TrackingModule } from './tracking/tracking.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    RedisModule.forRoot(),
    SecurityModule,
    PrismaModule,
    OutboxModule,
    FilesModule,
    AiModule,
    AuthModule,
    CompaniesModule,
    ModerationModule,
    JobsModule,
    IngestionModule,
    IntegrationsModule,
    ChannelsModule,
    PaymentsModule,
    PreferencesModule,
    NotificationsModule,
    AdsModule,
    OpsModule,
    SeekerModule,
    ApplyProfilesModule,
    ReputationModule,
    ApplicationsModule,
    FeedbackModule,
    TrackingModule,
    AccountModule,
    I18nModule,
    SiteModule,
    LocationsModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

