import { Module, forwardRef } from '@nestjs/common';
import { JobsModule } from '../jobs/jobs.module';
import { PreferencesModule } from '../preferences/preferences.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsStore } from './notifications.store';

@Module({
  imports: [forwardRef(() => JobsModule), PreferencesModule],
  controllers: [NotificationsController],
  providers: [NotificationsStore, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}