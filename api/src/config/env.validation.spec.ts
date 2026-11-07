import {
  flagEnabled,
  isOutboxEnabled,
  isSearchFtsEnabled,
  validateEnv,
} from './env.validation';

describe('env.validation', () => {
  const saved = { ...process.env };

  afterEach(() => {
    process.env = { ...saved };
  });

  it('accepts the memory-store dev defaults', () => {
    const env = validateEnv({ JOBS_STORE: 'memory' });
    expect(env.NODE_ENV).toBe('development');
  });

  it('requires DATABASE_URL when a prisma store is selected', () => {
    expect(() => validateEnv({ JOBS_STORE: 'prisma' })).toThrow(/DATABASE_URL/);
    expect(() => validateEnv({ AUTH_STORE: 'prisma' })).toThrow(/DATABASE_URL/);
    expect(() =>
      validateEnv({ JOBS_STORE: 'prisma', DATABASE_URL: 'postgresql://x' }),
    ).not.toThrow();
  });

  it('rejects unknown store modes', () => {
    expect(() => validateEnv({ JOBS_STORE: 'mongo' })).toThrow(/JOBS_STORE/);
  });

  it('requires a strong super-admin password in production', () => {
    expect(() => validateEnv({ NODE_ENV: 'production' })).toThrow(/SUPER_ADMIN_PASSWORD/);
    expect(() =>
      validateEnv({ NODE_ENV: 'production', SUPER_ADMIN_PASSWORD: 'change-me-please' }),
    ).toThrow(/SUPER_ADMIN_PASSWORD/);
    expect(() =>
      validateEnv({ NODE_ENV: 'production', SUPER_ADMIN_PASSWORD: 'S3cure!pass' }),
    ).not.toThrow();
  });

  it('requires a bucket when FILE_STORAGE=s3', () => {
    expect(() => validateEnv({ FILE_STORAGE: 's3' })).toThrow(/FILE_S3_BUCKET/);
    expect(() => validateEnv({ FILE_STORAGE: 's3', FILE_S3_BUCKET: 'b' })).not.toThrow();
  });

  it('parses boolean-ish flags', () => {
    for (const v of ['1', 'true', 'YES', ' on ']) expect(flagEnabled(v)).toBe(true);
    for (const v of ['0', 'false', 'off']) expect(flagEnabled(v)).toBe(false);
    expect(flagEnabled(undefined, true)).toBe(true);
    expect(flagEnabled('', false)).toBe(false);
  });

  it('defaults outbox + FTS to JOBS_STORE=prisma unless explicitly set', () => {
    delete process.env.OUTBOX_ENABLED;
    delete process.env.SEARCH_FTS_ENABLED;
    process.env.JOBS_STORE = 'memory';
    expect(isOutboxEnabled()).toBe(false);
    expect(isSearchFtsEnabled()).toBe(false);

    process.env.JOBS_STORE = 'prisma';
    expect(isOutboxEnabled()).toBe(true);
    expect(isSearchFtsEnabled()).toBe(true);

    process.env.OUTBOX_ENABLED = '0';
    process.env.SEARCH_FTS_ENABLED = '0';
    expect(isOutboxEnabled()).toBe(false);
    expect(isSearchFtsEnabled()).toBe(false);
  });
});
