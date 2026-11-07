import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { IntegrationsService } from './integrations.service';

/**
 * In-process feed crawler (₹0 — no Redis required).
 * Default tick: 15 minutes. Disable with JOB_FEED_SCHEDULE_ENABLED=0.
 */
@Injectable()
export class IntegrationsScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(IntegrationsScheduler.name);
  private timer?: ReturnType<typeof setInterval>;

  constructor(private readonly integrations: IntegrationsService) {}

  onModuleInit() {
    if ((process.env.JOB_FEED_SCHEDULE_ENABLED ?? '1') === '0') {
      this.logger.log('JOB_FEED_SCHEDULE_ENABLED=0 — inbound feed crawl off.');
      return;
    }
    const tickMs = Number(process.env.JOB_FEED_TICK_MS || 900_000);
    this.timer = setInterval(() => {
      void this.integrations.maybeRunScheduledFeeds();
    }, Number.isFinite(tickMs) && tickMs >= 60_000 ? tickMs : 900_000);
    this.logger.log(
      `Inbound job-feed crawler started (${Math.round((Number.isFinite(tickMs) ? tickMs : 900_000) / 60000)}m tick).`,
    );
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
