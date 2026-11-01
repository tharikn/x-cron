import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';

/**
 * Lightweight in-process scheduler (no paid queue).
 * Checks IST (or configured TZ) once per minute for morning/evening pull windows.
 */
@Injectable()
export class ChannelsScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ChannelsScheduler.name);
  private timer?: ReturnType<typeof setInterval>;

  constructor(private readonly channels: ChannelsService) {}

  onModuleInit() {
    if ((process.env.CHANNEL_SCHEDULE_ENABLED ?? '1') === '0') {
      this.logger.log('CHANNEL_SCHEDULE_ENABLED=0 — Job Fare auto-pull off.');
      return;
    }
    this.timer = setInterval(() => {
      void this.channels.maybeRunScheduledSlot();
    }, 60_000);
    this.logger.log('Job Fare schedule watcher started (1m tick).');
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
