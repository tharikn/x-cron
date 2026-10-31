import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health/health.controller';
import { IngestionModule } from './ingestion/ingestion.module';
import { JobsModule } from './jobs/jobs.module';
import { AccountModule } from './account/account.module';
import { AdsModule } from './ads/ads.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OpsModule } from './ops/ops.module';
import { PaymentsModule } from './payments/payments.module';
import { PreferencesModule } from './preferences/preferences.module';
import { SeekerModule } from './seeker/seeker.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    JobsModule,
    IngestionModule,
    PaymentsModule,
    PreferencesModule,
    NotificationsModule,
    AdsModule,
    OpsModule,
    SeekerModule,
    AccountModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
