import { RedisKeys } from './redis-keys';

describe('RedisKeys', () => {
  it('namespaces keys under the versioned prefix', () => {
    expect(RedisKeys.jobPublic('j1')).toBe('xcron:v1:job:public:j1');
    expect(RedisKeys.jobPublicSlug('dev-chennai')).toBe('xcron:v1:job:public:slug:dev-chennai');
    expect(RedisKeys.companyPublic('c1')).toBe('xcron:v1:company:public:c1');
    expect(RedisKeys.feedbackTyping('t1')).toBe('xcron:v1:feedback:typing:t1');
    expect(RedisKeys.feedbackPresence('t1', 'u1')).toBe('xcron:v1:feedback:presence:t1:u1');
    expect(RedisKeys.feedbackPresenceIndex('t1')).toBe('xcron:v1:feedback:presence:idx:t1');
  });

  it('normalises and bounds search suggest keys', () => {
    const key = RedisKeys.searchSuggest(`ANGULAR ${'x'.repeat(100)}`);
    expect(key.startsWith('xcron:v1:search:suggest:angular ')).toBe(true);
    expect(key.length).toBe('xcron:v1:search:suggest:'.length + 64);
  });
});
