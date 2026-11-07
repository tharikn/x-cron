/** Injection tokens + queue names for optional Redis / BullMQ. */

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

/** Schema/version prefix — bump when cache payload shape changes. */
export const REDIS_KEY_PREFIX = 'xcron:v1';

export const QUEUE_PUSH_DELIVERY = 'push-delivery';
export const QUEUE_EMAIL_DELIVERY = 'email-delivery';
export const QUEUE_NOTIFICATION_FANOUT = 'notification-fanout';

/** Default TTLs (seconds). */
export const CACHE_TTL = {
  jobPublic: 60,
  companyPublic: 120,
  searchSuggest: 30,
} as const;
