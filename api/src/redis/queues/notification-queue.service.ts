import { getQueueToken } from '@nestjs/bullmq';
import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import type { Queue } from 'bullmq';
import {
  QUEUE_EMAIL_DELIVERY,
  QUEUE_NOTIFICATION_FANOUT,
  QUEUE_PUSH_DELIVERY,
} from '../redis.constants';
import { isRedisQueuesEnabled } from '../redis.config';
import type {
  EmailDeliveryJob,
  NotificationFanoutJob,
  PushDeliveryJob,
} from './queue.types';

const DEFAULT_JOB_OPTS = {
  attempts: 5,
  backoff: { type: 'exponential' as const, delay: 2_000 },
  removeOnComplete: 200,
  removeOnFail: 500,
};

/**
 * Enqueues notification work when Redis queues are on.
 * Callers fall back to inline delivery when `queuesActive` is false.
 */
@Injectable()
export class NotificationQueueService {
  private readonly logger = new Logger(NotificationQueueService.name);

  constructor(
    @Optional()
    @Inject(getQueueToken(QUEUE_NOTIFICATION_FANOUT))
    private readonly fanoutQueue?: Queue<NotificationFanoutJob>,
    @Optional()
    @Inject(getQueueToken(QUEUE_PUSH_DELIVERY))
    private readonly pushQueue?: Queue<PushDeliveryJob>,
    @Optional()
    @Inject(getQueueToken(QUEUE_EMAIL_DELIVERY))
    private readonly emailQueue?: Queue<EmailDeliveryJob>,
  ) {}

  get queuesActive(): boolean {
    return (
      isRedisQueuesEnabled() &&
      Boolean(this.fanoutQueue && this.pushQueue && this.emailQueue)
    );
  }

  async enqueueJobPublishedFanout(jobId: string): Promise<boolean> {
    if (!this.queuesActive || !this.fanoutQueue) return false;
    try {
      await this.fanoutQueue.add(
        'job-published',
        { jobId },
        {
          ...DEFAULT_JOB_OPTS,
          // Minute bucket keeps re-publishes distinct while collapsing bursts.
          jobId: `fanout:${jobId}:${Math.floor(Date.now() / 60_000)}`,
        },
      );
      return true;
    } catch (err) {
      this.logger.warn(
        `enqueue fanout failed job=${jobId}: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
      return false;
    }
  }

  async enqueuePush(payload: PushDeliveryJob): Promise<boolean> {
    if (!this.queuesActive || !this.pushQueue) return false;
    const id = `push:${payload.baseDedupe}:${payload.userId}`;
    try {
      await this.pushQueue.add('deliver', payload, {
        ...DEFAULT_JOB_OPTS,
        jobId: id,
      });
      return true;
    } catch (err) {
      this.logger.warn(
        `enqueue push failed: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
      return false;
    }
  }

  async enqueueEmail(payload: EmailDeliveryJob): Promise<boolean> {
    if (!this.queuesActive || !this.emailQueue) return false;
    const id = `mail:${payload.baseDedupe}:${payload.userId}`;
    try {
      await this.emailQueue.add('deliver', payload, {
        ...DEFAULT_JOB_OPTS,
        jobId: id,
      });
      return true;
    } catch (err) {
      this.logger.warn(
        `enqueue email failed: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
      return false;
    }
  }
}
