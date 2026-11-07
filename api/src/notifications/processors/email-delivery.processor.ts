import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import { QUEUE_EMAIL_DELIVERY } from '../../redis/redis.constants';
import type { EmailDeliveryJob } from '../../redis/queues/queue.types';
import { NotificationsService } from '../notifications.service';

@Processor(QUEUE_EMAIL_DELIVERY, { concurrency: 3 })
export class EmailDeliveryProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailDeliveryProcessor.name);

  constructor(private readonly notifications: NotificationsService) {
    super();
  }

  async process(job: Job<EmailDeliveryJob>): Promise<void> {
    const result = await this.notifications.processQueuedEmail(job.data);
    if (result.failed) {
      this.logger.warn(
        `email delivery soft-fail user=${job.data.userId} job=${job.data.jobId}`,
      );
    }
  }
}
