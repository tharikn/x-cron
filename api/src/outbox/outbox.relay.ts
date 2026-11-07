import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
  Optional,
  forwardRef,
} from '@nestjs/common';
import { isOutboxEnabled } from '../config/env.validation';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationQueueService } from '../redis/queues/notification-queue.service';
import { OutboxService } from './outbox.service';

/**
 * Polls pending outbox rows and delivers to BullMQ (preferred) or inline
 * notification fan-out. Consumers remain idempotent via dispatch/dedupe keys.
 */
@Injectable()
export class OutboxRelay implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OutboxRelay.name);
  private timer: NodeJS.Timeout | null = null;
  private running = false;

  constructor(
    private readonly outbox: OutboxService,
    @Optional()
    @Inject(forwardRef(() => NotificationsService))
    private readonly notifications?: NotificationsService,
    @Optional() private readonly queues?: NotificationQueueService,
  ) {}

  onModuleInit() {
    if (!isOutboxEnabled()) {
      this.logger.log('Outbox relay idle (OUTBOX_ENABLED off / memory store).');
      return;
    }
    const tick = Math.max(
      2_000,
      Number(process.env.OUTBOX_TICK_MS || 5_000) || 5_000,
    );
    this.timer = setInterval(() => void this.tick(), tick);
    this.logger.log(`Outbox relay started tick=${tick}ms`);
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  async tick() {
    if (this.running || !isOutboxEnabled()) return;
    this.running = true;
    try {
      const batch = await this.outbox.claimPending(25);
      for (const event of batch) {
        try {
          await this.deliver(event.topic, event.payload, event.id);
          await this.outbox.markProcessed(event.id);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          this.logger.warn(`outbox deliver failed id=${event.id}: ${msg}`);
          await this.outbox.markFailed(event.id, msg, event.attempts);
        }
      }
    } finally {
      this.running = false;
    }
  }

  private async deliver(
    topic: string,
    payload: { jobId?: string; [key: string]: unknown },
    eventId: string,
  ) {
    if (topic === 'job.published' || topic === 'notification.fanout') {
      const jobId = String(payload.jobId ?? '');
      if (!jobId) throw new Error('missing jobId');

      if (this.queues?.queuesActive) {
        const ok = await this.queues.enqueueJobPublishedFanout(jobId);
        if (ok) {
          this.logger.debug(
            `outbox→queue job.published jobId=${jobId} event=${eventId}`,
          );
          return;
        }
      }

      if (!this.notifications) {
        throw new Error('NotificationsService unavailable for outbox deliver');
      }
      await this.notifications.runJobPublishedFanout(jobId);
      return;
    }

    this.logger.warn(`Unknown outbox topic=${topic} — marking processed`);
  }
}
