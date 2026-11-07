import { REDIS_KEY_PREFIX } from './redis.constants';

/** Cache-aside + ephemeral key builders (never cache private PII without principal). */
export const RedisKeys = {
  jobPublic: (jobId: string) => `${REDIS_KEY_PREFIX}:job:public:${jobId}`,
  jobPublicSlug: (slug: string) =>
    `${REDIS_KEY_PREFIX}:job:public:slug:${slug}`,
  companyPublic: (companyId: string) =>
    `${REDIS_KEY_PREFIX}:company:public:${companyId}`,
  searchSuggest: (q: string) =>
    `${REDIS_KEY_PREFIX}:search:suggest:${q.toLowerCase().slice(0, 64)}`,
  feedbackPresence: (threadId: string, userId: string) =>
    `${REDIS_KEY_PREFIX}:feedback:presence:${threadId}:${userId}`,
  feedbackTyping: (threadId: string) =>
    `${REDIS_KEY_PREFIX}:feedback:typing:${threadId}`,
  feedbackPresenceIndex: (threadId: string) =>
    `${REDIS_KEY_PREFIX}:feedback:presence:idx:${threadId}`,
} as const;
