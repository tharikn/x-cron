import type { TrackingEvent, TrackingEventType } from './tracking.types';

/** Repository port — memory or Prisma. */
export abstract class TrackingStore {
  abstract record(event: TrackingEvent): Promise<TrackingEvent>;

  abstract listEvents(filter?: {
    userId?: string;
    visitorKey?: string;
    type?: TrackingEventType;
    from?: string;
    to?: string;
    limit?: number;
  }): Promise<TrackingEvent[]>;

  abstract clearForUser(userId: string): Promise<void>;
}
