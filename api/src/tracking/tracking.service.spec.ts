import type { AuthStore } from '../auth/auth.store';
import { TrackingMemoryStore } from './tracking.memory-store';
import { TrackingService } from './tracking.service';

type FakeUser = {
  id: string;
  username?: string;
  email?: string;
  displayName?: string;
  roles: string[];
  createdAt: string;
};

function fakeAuth(users: FakeUser[]): AuthStore {
  return {
    listUsers: () => users,
    getUser: (id: string) => users.find((u) => u.id === id),
    listSessionIpsForUser: (id: string) => (id === 'u1' ? ['198.51.100.7'] : []),
  } as unknown as AuthStore;
}

describe('TrackingService', () => {
  const users: FakeUser[] = [
    { id: 'u1', username: 'asha', email: 'asha@example.com', roles: ['seeker'], createdAt: '2026-11-01T00:00:00Z' },
    { id: 'u2', username: 'quiet', roles: ['employer'], createdAt: '2026-11-02T00:00:00Z' },
  ];
  let store: TrackingMemoryStore;
  let service: TrackingService;

  beforeEach(() => {
    store = new TrackingMemoryStore();
    service = new TrackingService(store, fakeAuth(users));
  });

  it('caps heartbeat duration at 5 minutes and prefers dto visitorKey', async () => {
    await service.recordClientEvent(
      { type: 'heartbeat', durationMs: 15 * 60 * 1000, visitorKey: 'dto-key' },
      { visitorKey: 'tab-key', ip: '203.0.113.1' },
    );
    const [ev] = await store.listEvents();
    expect(ev.durationMs).toBe(5 * 60 * 1000);
    expect(ev.visitorKey).toBe('dto-key');
    expect(ev.ip).toBe('203.0.113.1');
  });

  it('attaches the signed-in user and trims ids/paths', async () => {
    const res = await service.recordClientEvent(
      { type: 'page_view', path: ' /jobs/x ', jobId: ' j1 ' },
      { user: { id: 'u1' } as never },
    );
    expect(res.ok).toBe(true);
    const [ev] = await store.listEvents();
    expect(ev).toMatchObject({ userId: 'u1', path: '/jobs/x', jobId: 'j1' });
  });

  it('summarises accessors, engagement % and hours', async () => {
    await service.record({ type: 'access', userId: 'u1' });
    await service.record({ type: 'search', userId: 'u1' });
    await service.record({ type: 'heartbeat', userId: 'u1', durationMs: 1_800_000 });
    await service.record({ type: 'access', visitorKey: 'guest-1' });

    const summary = await service.summary();
    expect(summary).toMatchObject({
      usersCreated: 2,
      usersAccessed: 1,
      guestsAccessed: 1,
      accessorsTotal: 2,
      totalHours: 0.5,
      eventsTotal: 4,
    });
    expect(summary.engagement.searchPct).toBe(50);
    expect(summary.actionTotals.search).toBe(1);
  });

  it('lists users with usage %, includes never-seen accounts, and filters by q', async () => {
    await service.record({ type: 'search', userId: 'u1' });
    await service.record({ type: 'apply', userId: 'u1' });
    await service.record({ type: 'share', userId: 'u1' });
    await service.record({ type: 'page_view', userId: 'u1' });

    const all = await service.listUsers({});
    expect(all.total).toBe(2);
    const asha = all.items.find((r) => r.userId === 'u1')!;
    expect(asha.kind).toBe('user');
    expect(asha.email).toBe('asha@example.com');
    expect(asha.ips).toContain('198.51.100.7');
    expect(asha.usagePct).toEqual({ search: 25, share: 25, apply: 25, pageView: 25 });
    expect(all.items.find((r) => r.userId === 'u2')?.counts.access).toBe(0);

    const filtered = await service.listUsers({ q: 'ASHA' });
    expect(filtered.items.map((r) => r.userId)).toEqual(['u1']);

    const paged = await service.listUsers({ limit: 1, offset: 1 });
    expect(paged.items).toHaveLength(1);
    expect(paged.limit).toBe(1);
  });

  it('clears a user’s events on account wipe', async () => {
    await service.record({ type: 'access', userId: 'u1' });
    await service.record({ type: 'access', userId: 'u2' });
    await service.clearForUser('u1');
    const events = await store.listEvents();
    expect(events.map((e) => e.userId)).toEqual(['u2']);
  });
});
