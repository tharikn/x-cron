import { OutboxMemoryStore } from './outbox.memory-store';
import { OutboxService } from './outbox.service';

describe('Outbox (memory store + service)', () => {
  const saved = process.env.OUTBOX_ENABLED;
  let store: OutboxMemoryStore;
  let service: OutboxService;

  beforeEach(() => {
    process.env.OUTBOX_ENABLED = '1';
    store = new OutboxMemoryStore();
    service = new OutboxService(store);
  });

  afterAll(() => {
    if (saved === undefined) delete process.env.OUTBOX_ENABLED;
    else process.env.OUTBOX_ENABLED = saved;
  });

  it('returns null without writing when the outbox is disabled', async () => {
    process.env.OUTBOX_ENABLED = '0';
    expect(await service.record('job.published', { jobId: 'j1' })).toBeNull();
    expect(await service.counts()).toEqual({});
  });

  it('records, claims (FIFO) and marks events processed', async () => {
    const a = await service.record('job.published', { jobId: 'a' });
    const b = await service.record('job.published', { jobId: 'b' });
    expect(a?.status).toBe('pending');

    const claimed = await service.claimPending(10);
    expect(claimed.map((r) => r.payload.jobId)).toEqual(['a', 'b']);
    expect(claimed.every((r) => r.status === 'processing' && r.attempts === 1)).toBe(true);

    // Already processing → not claimed twice.
    expect(await service.claimPending(10)).toEqual([]);

    await service.markProcessed(a!.id);
    expect(await service.counts()).toEqual({ processed: 1, processing: 1 });
    expect(b).toBeTruthy();
  });

  it('schedules failed events for retry with exponential backoff (max 60s)', async () => {
    const row = await service.record('job.published', { jobId: 'x' });
    await service.claimPending(1);

    jest.useFakeTimers({ now: Date.parse('2026-11-07T12:00:00Z') });
    try {
      await service.markFailed(row!.id, 'boom', 3);
      // attempts=3 → 2s * 2^2 = 8s → not yet available.
      expect(await service.claimPending(10)).toEqual([]);
      expect(await service.counts()).toEqual({ failed: 1 });

      jest.setSystemTime(Date.parse('2026-11-07T12:00:08Z'));
      const [retried] = await service.claimPending(10);
      expect(retried.id).toBe(row!.id);
    } finally {
      jest.useRealTimers();
    }
  });

  it('re-claims failed events once their retry time passes', async () => {
    const row = await store.append({ topic: 'job.published', payload: { jobId: 'r' } });
    await store.claimPending(1);
    await store.markFailed(row.id, 'x'.repeat(5000), new Date(Date.now() - 1));
    const [again] = await store.claimPending(1);
    expect(again.id).toBe(row.id);
    expect(again.attempts).toBe(2);
    expect(again.lastError).toHaveLength(2000);
  });
});
