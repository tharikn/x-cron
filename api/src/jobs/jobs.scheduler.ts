import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { JobsService } from './jobs.service';

/**
 * Lightweight in-process scheduler (no paid queue).
 * Flips `published` → `expired` when `expiresAt` has passed.
 */
@Injectable()
export class JobsScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(JobsScheduler.name);
  private timer?: ReturnType<typeof setInterval>;

  constructor(private readonly jobs: JobsService) {}

  onModuleInit() {
    if ((process.env.JOB_EXPIRE_SCHEDULE_ENABLED ?? '1') === '0') {
      this.logger.log('JOB_EXPIRE_SCHEDULE_ENABLED=0 — auto-expire off.');
      return;
    }
    const tickMs = Math.max(
      60_000,
      Number(process.env.JOB_EXPIRE_TICK_MS ?? '300000') || 300_000,
    );
    this.timer = setInterval(() => {
      void this.jobs
        .expireDueJobs()
        .then((count) => {
          if (count > 0) {
            this.logger.log(`Auto-expired ${count} job(s).`);
          }
        })
        .catch((err) => {
          this.logger.warn(
            `Job expire tick failed: ${err instanceof Error ? err.message : String(err)}`,
          );
        });
    }, tickMs);
    this.logger.log(
      `Job auto-expire watcher started (${Math.round(tickMs / 60_000)}m tick).`,
    );
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
