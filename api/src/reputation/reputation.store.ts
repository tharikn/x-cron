import {
  ReputationEvent,
  ReputationEventType,
  ReputationRole,
  ReputationScore,
} from './reputation.types';

export abstract class ReputationStore {
  abstract getScore(
    userId: string,
    role: ReputationRole,
  ): Promise<ReputationScore>;

  abstract setScore(row: ReputationScore): Promise<ReputationScore>;

  abstract appendEvent(
    input: Omit<ReputationEvent, 'id' | 'createdAt'> & { createdAt?: string },
  ): Promise<ReputationEvent>;

  abstract listEvents(
    userId: string,
    role: ReputationRole,
    limit?: number,
  ): Promise<ReputationEvent[]>;

  abstract countEventsToday(
    userId: string,
    role: ReputationRole,
    type: ReputationEventType,
  ): Promise<number>;

  abstract clearForUser(userId: string): Promise<void>;
}
