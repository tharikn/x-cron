import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { JobsModule } from '../jobs/jobs.module';
import { PreferencesModule } from '../preferences/preferences.module';
import { NotificationQueueService } from '../redis/queues/notification-queue.service';
import { AuthStore } from '../auth/auth.store';
import { JobsStore } from '../jobs/jobs.store';
import { PreferencesService } from '../preferences/preferences.service';
import { EmailController } from './email.controller';
import { EmailScheduler } from './email.scheduler';
import { EmailService } from './email.service';
import { EmailStore } from './stores/email.store';
import { EmailMemoryStore } from './stores/email.memory-store';

@Module({
  imports: [AuthModule, forwardRef(() => JobsModule), PreferencesModule],
  controllers: [EmailController],
  providers: [
    {
      provide: EmailStore,
      useClass: EmailMemoryStore,
    },
    {
      provide: EmailService,
      useFactory: (
        auth: AuthStore,
        jobs: JobsStore,
        prefs: PreferencesService,
        store: EmailStore,
        queues: NotificationQueueService,
      ) => new EmailService(auth, jobs, prefs, store, queues),
      inject: [
        AuthStore,
        JobsStore,
        PreferencesService,
        EmailStore,
        NotificationQueueService,
      ],
    },
    EmailScheduler,
  ],
  exports: [EmailService, EmailStore],
})
export class EmailModule {}
