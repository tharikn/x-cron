import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import { QUEUE_NOTIFICATION_FANOUT } from '../../redis/redis.constants';
import type { NotificationFanoutJob } from '../../redis/queues/queue.types';
import { NotificationsService } from '../notifications.service';

@Processor(QUEUE_NOTIFICATION_FANOUT, { concurrency: 2 })
export class NotificationFanoutProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationFanoutProcessor.name);

  constructor(private readonly notifications: NotificationsService) {
    super();
  }

  async process(job: Job<NotificationFanoutJob>): Promise<void> {
    this.logger.log(`fanout start jobId=${job.data.jobId} bull=${job.id}`);
    await this.notifications.runJobPublishedFanout(job.data.jobId);
  }
}
