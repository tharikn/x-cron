import { Injectable } from '@nestjs/common';
import { TrackingStore } from './tracking.store';
import type { TrackingEvent, TrackingEventType } from './tracking.types';

@Injectable()
export class TrackingMemoryStore extends TrackingStore {
  private readonly events: TrackingEvent[] = [];
  private readonly maxEvents = 50_000;

  async record(event: TrackingEvent): Promise<TrackingEvent> {
    this.events.push(event);
    if (this.events.length > this.maxEvents) {
      this.events.splice(0, this.events.length - this.maxEvents);
    }
    return event;
  }

  async listEvents(filter?: {
    userId?: string;
    visitorKey?: string;
    type?: TrackingEventType;
    from?: string;
    to?: string;
    limit?: number;
  }): Promise<TrackingEvent[]> {
    const fromMs = filter?.from ? Date.parse(filter.from) : undefined;
    const toMs = filter?.to ? Date.parse(filter.to) : undefined;
    const limit = Math.min(Math.max(filter?.limit ?? 20_000, 1), 50_000);
    const out: TrackingEvent[] = [];
    for (let i = this.events.length - 1; i >= 0; i -= 1) {
      const ev = this.events[i];
      if (filter?.userId && ev.userId !== filter.userId) continue;
      if (filter?.visitorKey && ev.visitorKey !== filter.visitorKey) continue;
      if (filter?.type && ev.type !== filter.type) continue;
      const at = Date.parse(ev.createdAt);
      if (fromMs != null && at < fromMs) continue;
      if (toMs != null && at > toMs) continue;
      out.push(ev);
      if (out.length >= limit) break;
    }
    return out.reverse();
  }

  async clearForUser(userId: string): Promise<void> {
    for (let i = this.events.length - 1; i >= 0; i -= 1) {
      if (this.events[i].userId === userId) {
        this.events.splice(i, 1);
      }
    }
  }
}
