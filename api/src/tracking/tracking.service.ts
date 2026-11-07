import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AuthStore } from '../auth/auth.store';
import type { AuthUser } from '../auth/auth.types';
import { TrackEventDto, TrackingUsersQueryDto } from './dto/tracking.dto';
import { TrackingStore } from './tracking.store';
import type {
  TrackingActorAgg,
  TrackingEngagementPct,
  TrackingEvent,
  TrackingEventType,
  TrackingSummary,
  TrackingUserRow,
  TrackingUsersResponse,
} from './tracking.types';

const MAX_HEARTBEAT_MS = 5 * 60 * 1000;

@Injectable()
export class TrackingService {
  constructor(
    private readonly store: TrackingStore,
    private readonly auth: AuthStore,
  ) {}

  async recordClientEvent(
    dto: TrackEventDto,
    opts: {
      user?: AuthUser | null;
      ip?: string;
      userAgent?: string;
      visitorKey?: string;
    },
  ): Promise<{ ok: true; id: string }> {
    const visitorKey =
      dto.visitorKey?.trim() || opts.visitorKey?.trim() || undefined;
    const durationMs =
      dto.type === 'heartbeat'
        ? Math.min(Math.max(dto.durationMs ?? 0, 0), MAX_HEARTBEAT_MS)
        : dto.durationMs;

    const event = await this.record({
      type: dto.type,
      userId: opts.user?.id,
      visitorKey,
      jobId: dto.jobId?.trim() || undefined,
      path: dto.path?.trim() || undefined,
      ip: opts.ip,
      userAgent: opts.userAgent,
      durationMs,
      meta: dto.meta,
    });
    return { ok: true, id: event.id };
  }

  /** Server-side hooks (apply / search / sign-in). */
  async record(input: {
    type: TrackingEventType;
    userId?: string;
    visitorKey?: string;
    jobId?: string;
    path?: string;
    ip?: string;
    userAgent?: string;
    durationMs?: number;
    meta?: Record<string, unknown>;
  }): Promise<TrackingEvent> {
    const event: TrackingEvent = {
      id: randomUUID(),
      type: input.type,
      userId: input.userId,
      visitorKey: input.visitorKey,
      jobId: input.jobId,
      path: input.path,
      ip: input.ip,
      userAgent: input.userAgent,
      durationMs: input.durationMs,
      meta: input.meta,
      createdAt: new Date().toISOString(),
    };
    return this.store.record(event);
  }

  async summary(filter?: { from?: string; to?: string }): Promise<TrackingSummary> {
    const events = await this.store.listEvents({
      from: filter?.from,
      to: filter?.to,
      limit: 50_000,
    });
    const aggs = this.aggregate(events);
    return this.buildSummary(aggs, events.length);
  }

  async listUsers(query: TrackingUsersQueryDto): Promise<TrackingUsersResponse> {
    const events = await this.store.listEvents({
      from: query.from,
      to: query.to,
      limit: 50_000,
    });
    const aggs = this.aggregate(events);
    this.enrichFromAuth(aggs);

    // Also include registered users who have no events yet (created but never accessed).
    for (const user of this.auth.listUsers()) {
      const key = `user:${user.id}`;
      if (aggs.has(key)) continue;
      aggs.set(key, {
        key,
        userId: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        roles: user.roles,
        createdAt: user.createdAt,
        firstSeenAt: user.createdAt,
        lastSeenAt: user.createdAt,
        ips: this.auth.listSessionIpsForUser(user.id),
        durationMs: 0,
        accessCount: 0,
        searchCount: 0,
        shareCount: 0,
        applyCount: 0,
        pageViewCount: 0,
      });
    }

    let rows = [...aggs.values()].map((a) => this.toRow(a));
    const q = query.q?.trim().toLowerCase();
    if (q) {
      rows = rows.filter((row) => {
        const hay = [
          row.email,
          row.username,
          row.displayName,
          row.userId,
          row.visitorKey,
          ...row.ips,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return hay.includes(q);
      });
    }

    rows.sort((a, b) => Date.parse(b.lastSeenAt) - Date.parse(a.lastSeenAt));
    const total = rows.length;
    const limit = Math.min(Math.max(query.limit ?? 50, 1), 200);
    const offset = Math.max(query.offset ?? 0, 0);
    const items = rows.slice(offset, offset + limit);
    const summary = this.buildSummary(aggs, events.length);

    return {
      total,
      limit,
      offset,
      items,
      summary,
      time: new Date().toISOString(),
    };
  }

  async clearForUser(userId: string): Promise<void> {
    await this.store.clearForUser(userId);
  }

  private aggregate(events: TrackingEvent[]): Map<string, TrackingActorAgg> {
    const map = new Map<string, TrackingActorAgg>();
    for (const ev of events) {
      const key = ev.userId
        ? `user:${ev.userId}`
        : ev.visitorKey
          ? `visitor:${ev.visitorKey}`
          : ev.ip
            ? `ip:${ev.ip}`
            : null;
      if (!key) continue;

      let agg = map.get(key);
      if (!agg) {
        agg = {
          key,
          userId: ev.userId,
          visitorKey: ev.visitorKey,
          firstSeenAt: ev.createdAt,
          lastSeenAt: ev.createdAt,
          ips: [],
          durationMs: 0,
          accessCount: 0,
          searchCount: 0,
          shareCount: 0,
          applyCount: 0,
          pageViewCount: 0,
        };
        map.set(key, agg);
      }

      if (ev.userId) agg.userId = ev.userId;
      if (ev.visitorKey && !agg.visitorKey) agg.visitorKey = ev.visitorKey;
      if (Date.parse(ev.createdAt) < Date.parse(agg.firstSeenAt)) {
        agg.firstSeenAt = ev.createdAt;
      }
      if (Date.parse(ev.createdAt) > Date.parse(agg.lastSeenAt)) {
        agg.lastSeenAt = ev.createdAt;
      }
      if (ev.ip && !agg.ips.includes(ev.ip)) {
        agg.ips.push(ev.ip);
        if (agg.ips.length > 20) agg.ips = agg.ips.slice(-20);
      }
      if (ev.type === 'heartbeat' && ev.durationMs) {
        agg.durationMs += ev.durationMs;
      }
      if (ev.type === 'access') agg.accessCount += 1;
      if (ev.type === 'search') agg.searchCount += 1;
      if (ev.type === 'share') agg.shareCount += 1;
      if (ev.type === 'apply') agg.applyCount += 1;
      if (ev.type === 'page_view') agg.pageViewCount += 1;
    }
    return map;
  }

  private enrichFromAuth(aggs: Map<string, TrackingActorAgg>): void {
    for (const agg of aggs.values()) {
      if (!agg.userId) continue;
      const user = this.auth.getUser(agg.userId);
      if (!user) continue;
      agg.email = user.email;
      agg.username = user.username;
      agg.displayName = user.displayName;
      agg.roles = user.roles;
      agg.createdAt = user.createdAt;
      for (const ip of this.auth.listSessionIpsForUser(user.id)) {
        if (!agg.ips.includes(ip)) agg.ips.push(ip);
      }
    }
  }

  private toRow(agg: TrackingActorAgg): TrackingUserRow {
    const actionTotal =
      agg.searchCount + agg.shareCount + agg.applyCount + agg.pageViewCount;
    const pct = (n: number) =>
      actionTotal > 0 ? Math.round((n / actionTotal) * 1000) / 10 : 0;
    return {
      key: agg.key,
      kind: agg.userId ? 'user' : 'guest',
      userId: agg.userId,
      visitorKey: agg.visitorKey,
      email: agg.email,
      username: agg.username,
      displayName: agg.displayName,
      roles: agg.roles ?? [],
      accountCreatedAt: agg.createdAt,
      firstSeenAt: agg.firstSeenAt,
      lastSeenAt: agg.lastSeenAt,
      ips: agg.ips,
      hoursSpent: Math.round((agg.durationMs / 3_600_000) * 100) / 100,
      durationMs: agg.durationMs,
      counts: {
        access: agg.accessCount,
        search: agg.searchCount,
        share: agg.shareCount,
        apply: agg.applyCount,
        pageView: agg.pageViewCount,
      },
      usagePct: {
        search: pct(agg.searchCount),
        share: pct(agg.shareCount),
        apply: pct(agg.applyCount),
        pageView: pct(agg.pageViewCount),
      },
    };
  }

  private buildSummary(
    aggs: Map<string, TrackingActorAgg>,
    eventsTotal: number,
  ): TrackingSummary {
    const values = [...aggs.values()];
    const accessors = values.filter(
      (a) =>
        a.accessCount > 0 ||
        a.searchCount > 0 ||
        a.shareCount > 0 ||
        a.applyCount > 0 ||
        a.pageViewCount > 0 ||
        a.durationMs > 0,
    );
    const usersAccessed = accessors.filter((a) => a.userId).length;
    const guestsAccessed = accessors.filter((a) => !a.userId).length;
    const denom = accessors.length || 1;
    const engagement: TrackingEngagementPct = {
      searchPct: Math.round(
        (accessors.filter((a) => a.searchCount > 0).length / denom) * 1000,
      ) / 10,
      applyPct: Math.round(
        (accessors.filter((a) => a.applyCount > 0).length / denom) * 1000,
      ) / 10,
      sharePct: Math.round(
        (accessors.filter((a) => a.shareCount > 0).length / denom) * 1000,
      ) / 10,
      pageViewPct: Math.round(
        (accessors.filter((a) => a.pageViewCount > 0).length / denom) * 1000,
      ) / 10,
    };
    const totalDurationMs = values.reduce((s, a) => s + a.durationMs, 0);
    const actionTotals = {
      access: values.reduce((s, a) => s + a.accessCount, 0),
      search: values.reduce((s, a) => s + a.searchCount, 0),
      share: values.reduce((s, a) => s + a.shareCount, 0),
      apply: values.reduce((s, a) => s + a.applyCount, 0),
      pageView: values.reduce((s, a) => s + a.pageViewCount, 0),
      heartbeat: 0,
    };

    return {
      usersCreated: this.auth.listUsers().length,
      usersAccessed,
      guestsAccessed,
      accessorsTotal: accessors.length,
      totalHours: Math.round((totalDurationMs / 3_600_000) * 100) / 100,
      totalDurationMs,
      eventsTotal,
      engagement,
      actionTotals,
      time: new Date().toISOString(),
    };
  }
}
