import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import { QUEUE_PUSH_DELIVERY } from '../../redis/redis.constants';
import type { PushDeliveryJob } from '../../redis/queues/queue.types';
import { NotificationsService } from '../notifications.service';

@Processor(QUEUE_PUSH_DELIVERY, { concurrency: 5 })
export class PushDeliveryProcessor extends WorkerHost {
  private readonly logger = new Logger(PushDeliveryProcessor.name);

  constructor(private readonly notifications: NotificationsService) {
    super();
  }

  async process(job: Job<PushDeliveryJob>): Promise<void> {
    const result = await this.notifications.processQueuedPush(job.data);
    if (result.failed) {
      this.logger.warn(
        `push delivery soft-fail user=${job.data.userId} job=${job.data.jobId}`,
      );
    }
  }
}
