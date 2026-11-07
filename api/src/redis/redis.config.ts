/**
 * Optional Redis wiring for X Cron.
 * Unset REDIS_URL → memory throttler + inline notification delivery + no cache.
 */
export function redisUrl(): string | undefined {
  const raw = (process.env.REDIS_URL ?? '').trim();
  return raw || undefined;
}

export function isRedisEnabled(): boolean {
  return Boolean(redisUrl());
}

/** Queues need Redis; default on when REDIS_URL is set, overridable. */
export function isRedisQueuesEnabled(): boolean {
  if (!isRedisEnabled()) return false;
  const flag = (process.env.REDIS_QUEUES_ENABLED ?? '1').trim().toLowerCase();
  return flag !== '0' && flag !== 'false' && flag !== 'off';
}

/** Public job/company cache-aside; default on when REDIS_URL is set. */
export function isRedisCacheEnabled(): boolean {
  if (!isRedisEnabled()) return false;
  const flag = (process.env.REDIS_CACHE_ENABLED ?? '1').trim().toLowerCase();
  return flag !== '0' && flag !== 'false' && flag !== 'off';
}

/** Distributed Nest throttler storage; default on when REDIS_URL is set. */
export function isRedisThrottleEnabled(): boolean {
  if (!isRedisEnabled()) return false;
  const flag = (process.env.REDIS_THROTTLE_ENABLED ?? '1').trim().toLowerCase();
  return flag !== '0' && flag !== 'false' && flag !== 'off';
}
