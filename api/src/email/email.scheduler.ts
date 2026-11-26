import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EmailService } from './email.service';

/**
 * Lightweight weekly jobs-alert scheduler. Runs the digest once a week on
 * the configured day/hour (default: Monday 09:00 local). Uses setTimeout/
 * setInterval so we don't add a cron dependency.
 *
 * Disable with EMAIL_WEEKLY_ALERTS_ENABLED=0.
 */
@Injectable()
export class EmailScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EmailScheduler.name);
  private timer: NodeJS.Timeout | null = null;
  private stopped = false;

  constructor(private readonly email: EmailService) {}

  onModuleInit(): void {
    if ((process.env.EMAIL_WEEKLY_ALERTS_ENABLED ?? '1') === '0') {
      this.logger.log('Weekly email alerts disabled via env.');
      return;
    }
    const day = Number(process.env.EMAIL_WEEKLY_DAY ?? 1) || 1; // 0=Sun..6=Sat, default Monday
    const hour = Number(process.env.EMAIL_WEEKLY_HOUR ?? 9) || 9;
    this.scheduleNext(day, hour);
  }

  onModuleDestroy(): void {
    this.stopped = true;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private scheduleNext(day: number, hour: number): void {
    if (this.stopped) return;
    const now = new Date();
    const next = new Date(now);
    next.setHours(hour, 0, 0, 0);
    // Move to target day-of-week.
    const diff = (day - now.getDay() + 7) % 7;
    next.setDate(now.getDate() + diff);
    if (next.getTime() <= now.getTime()) {
      next.setDate(next.getDate() + 7);
    }
    const delay = next.getTime() - now.getTime();
    this.logger.log(
      `Next weekly jobs alert scheduled for ${next.toISOString()} (in ${Math.round(delay / 60000)} min).`,
    );
    this.timer = setTimeout(async () => {
      try {
        await this.email.runWeeklyJobsAlert();
      } catch (err) {
        this.logger.warn(
          `Weekly jobs alert failed: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
      // Schedule next week.
      this.scheduleNext(day, hour);
    }, delay);
  }
}
