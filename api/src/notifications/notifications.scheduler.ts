import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';

/**
 * Lightweight in-process scheduler (no paid queue).
 * Nudges incomplete seeker profiles for the first N days after signup.
 */
@Injectable()
export class NotificationsScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationsScheduler.name);
  private timer?: ReturnType<typeof setInterval>;

  constructor(private readonly notifications: NotificationsService) {}

  onModuleInit() {
    if ((process.env.PROFILE_REMINDER_SCHEDULE_ENABLED ?? '1') === '0') {
      this.logger.log(
        'PROFILE_REMINDER_SCHEDULE_ENABLED=0 — profile reminders off.',
      );
      return;
    }
    const tickMs = Math.max(
      60_000,
      Number(process.env.PROFILE_REMINDER_TICK_MS ?? '3600000') || 3_600_000,
    );
    this.timer = setInterval(() => {
      void this.notifications
        .runProfileCompleteReminders()
        .then((stats) => {
          if (stats.sent > 0) {
            this.logger.log(
              `Profile reminders: sent=${stats.sent} considered=${stats.considered}`,
            );
          }
        })
        .catch((err) => {
          this.logger.warn(
            `Profile reminder tick failed: ${err instanceof Error ? err.message : String(err)}`,
          );
        });
    }, tickMs);
    this.logger.log(
      `Profile reminder watcher started (${Math.round(tickMs / 60_000)}m tick).`,
    );
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
