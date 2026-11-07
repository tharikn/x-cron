import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ModerationService } from './moderation.service';

@Injectable()
export class ModerationScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ModerationScheduler.name);
  private timer?: ReturnType<typeof setInterval>;

  constructor(private readonly moderation: ModerationService) {}

  onModuleInit() {
    const enabled = (process.env.MODERATION_SCHEDULE_ENABLED ?? '1') !== '0';
    if (!enabled) return;
    const tickMs = Number(process.env.MODERATION_TICK_MS ?? 60_000);
    this.timer = setInterval(() => {
      void this.moderation.expireSuspensions().then((n) => {
        if (n > 0) {
          this.logger.log(`Auto-reactivated ${n} timed suspension(s)`);
        }
      });
    }, Number.isFinite(tickMs) && tickMs >= 15_000 ? tickMs : 60_000);
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
