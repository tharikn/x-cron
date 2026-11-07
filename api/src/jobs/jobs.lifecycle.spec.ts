import { BadRequestException } from '@nestjs/common';
import { JobsLifecycleService } from './jobs.lifecycle';

describe('JobsLifecycleService', () => {
  const lifecycle = new JobsLifecycleService();

  it.each([
    ['draft', 'published', 'employer'],
    ['expired', 'published', 'employer'],
    ['published', 'draft', 'employer'],
    ['published', 'removed', 'employer'],
    ['needs-review', 'published', 'admin'],
    ['needs-review', 'rejected', 'admin'],
    ['published', 'expired', 'system'],
    ['needs-review', 'rejected', 'system'],
  ] as const)('allows %s → %s for %s', (from, to, actor) => {
    expect(() => lifecycle.assertTransition(from, to, actor)).not.toThrow();
  });

  it.each([
    ['needs-review', 'published', 'employer'],
    ['rejected', 'published', 'employer'],
    ['removed', 'published', 'employer'],
    ['published', 'expired', 'employer'],
    ['draft', 'published', 'admin'],
    ['published', 'draft', 'system'],
  ] as const)('rejects %s → %s for %s', (from, to, actor) => {
    expect(() => lifecycle.assertTransition(from, to, actor)).toThrow(
      BadRequestException,
    );
  });

  it('treats same-status transitions as no-ops', () => {
    expect(() =>
      lifecycle.assertTransition('removed', 'removed', 'system'),
    ).not.toThrow();
  });

  it('detects past expiry and ignores invalid dates', () => {
    const now = Date.parse('2026-11-07T12:00:00Z');
    expect(lifecycle.isPastExpiry({ expiresAt: '2026-11-07T11:59:59Z' }, now)).toBe(true);
    expect(lifecycle.isPastExpiry({ expiresAt: '2026-11-08T00:00:00Z' }, now)).toBe(false);
    expect(lifecycle.isPastExpiry({ expiresAt: 'not-a-date' }, now)).toBe(false);
  });

  it('opens the listing window between effectiveFrom/publishedAt and expiresAt', () => {
    const now = Date.parse('2026-11-07T12:00:00Z');
    const base = {
      publishedAt: '2026-11-01T00:00:00Z',
      expiresAt: '2026-12-01T00:00:00Z',
    };
    expect(lifecycle.isListingWindowOpen(base, now)).toBe(true);
    expect(
      lifecycle.isListingWindowOpen({ ...base, effectiveFrom: '2026-11-08T00:00:00Z' }, now),
    ).toBe(false);
    expect(
      lifecycle.isListingWindowOpen({ ...base, expiresAt: '2026-11-07T00:00:00Z' }, now),
    ).toBe(false);
  });
});
