/** Product analytics: access, engagement actions, and time-on-app. */

export type TrackingEventType =
  | 'access'
  | 'heartbeat'
  | 'search'
  | 'share'
  | 'apply'
  | 'page_view';

export interface TrackingEvent {
  id: string;
  type: TrackingEventType;
  /** Signed-in user when known. */
  userId?: string;
  /** Anonymous / guest visitor key (tab / device). */
  visitorKey?: string;
  jobId?: string;
  path?: string;
  ip?: string;
  userAgent?: string;
  /** Active time attributed by a heartbeat (ms). */
  durationMs?: number;
  meta?: Record<string, unknown>;
  createdAt: string;
}

export interface TrackingActorAgg {
  /** Stable key: `user:<id>` or `visitor:<key>`. */
  key: string;
  userId?: string;
  visitorKey?: string;
  email?: string;
  username?: string;
  displayName?: string;
  roles?: string[];
  createdAt?: string;
  firstSeenAt: string;
  lastSeenAt: string;
  ips: string[];
  durationMs: number;
  accessCount: number;
  searchCount: number;
  shareCount: number;
  applyCount: number;
  pageViewCount: number;
}

export interface TrackingEngagementPct {
  /** Share of accessors who searched at least once. */
  searchPct: number;
  /** Share of accessors who applied at least once. */
  applyPct: number;
  /** Share of accessors who shared a job at least once. */
  sharePct: number;
  /** Share of accessors with any page view. */
  pageViewPct: number;
}

export interface TrackingSummary {
  usersCreated: number;
  usersAccessed: number;
  guestsAccessed: number;
  accessorsTotal: number;
  totalHours: number;
  totalDurationMs: number;
  eventsTotal: number;
  engagement: TrackingEngagementPct;
  actionTotals: {
    access: number;
    search: number;
    share: number;
    apply: number;
    pageView: number;
    heartbeat: number;
  };
  time: string;
}

export interface TrackingUserRow {
  key: string;
  kind: 'user' | 'guest';
  userId?: string;
  visitorKey?: string;
  email?: string;
  username?: string;
  displayName?: string;
  roles: string[];
  accountCreatedAt?: string;
  firstSeenAt: string;
  lastSeenAt: string;
  ips: string[];
  hoursSpent: number;
  durationMs: number;
  counts: {
    access: number;
    search: number;
    share: number;
    apply: number;
    pageView: number;
  };
  /** Per-user mix of tracked actions (search/share/apply/page_view). */
  usagePct: {
    search: number;
    share: number;
    apply: number;
    pageView: number;
  };
}

export interface TrackingUsersResponse {
  total: number;
  limit: number;
  offset: number;
  items: TrackingUserRow[];
  summary: TrackingSummary;
  time: string;
}
