import { z } from 'zod';

const storeMode = z.enum(['memory', 'prisma']).optional();

/**
 * Fail-fast env schema (doc 01 §8). Soft keys stay optional; production
 * requires a real SUPER_ADMIN_PASSWORD and DATABASE_URL when using Prisma.
 */
const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'test', 'production', 'staging'])
      .optional()
      .default('development'),
    PORT: z.string().optional(),
    JOBS_STORE: storeMode,
    AUTH_STORE: storeMode,
    NOTIFICATIONS_STORE: storeMode,
    PAYMENTS_STORE: storeMode,
    APPLICATIONS_STORE: storeMode,
    APPLY_PROFILES_STORE: storeMode,
    SEEKER_STORE: storeMode,
    REPUTATION_STORE: storeMode,
    FEEDBACK_STORE: storeMode,
    TRACKING_STORE: storeMode,
    MODERATION_STORE: storeMode,
    DATABASE_URL: z.string().optional(),
    CORS_ORIGINS: z.string().optional(),
    SUPER_ADMIN_EMAIL: z.string().optional(),
    SUPER_ADMIN_PASSWORD: z.string().optional(),
    REDIS_URL: z.string().optional(),
    REDIS_QUEUES_ENABLED: z.string().optional(),
    REDIS_CACHE_ENABLED: z.string().optional(),
    REDIS_THROTTLE_ENABLED: z.string().optional(),
    OUTBOX_ENABLED: z.string().optional(),
    OUTBOX_TICK_MS: z.string().optional(),
    FILE_STORAGE: z.enum(['local', 's3', 'stub']).optional(),
    FILE_LOCAL_DIR: z.string().optional(),
    FILE_S3_BUCKET: z.string().optional(),
    FILE_S3_REGION: z.string().optional(),
    FILE_S3_ENDPOINT: z.string().optional(),
    // Isolated upload/storage layer (portfolio media + job-portal assets).
    UPLOAD_STORAGE: z.enum(['local', 'memory', 'r2', 'supabase']).optional(),
    UPLOAD_LOCAL_DIR: z.string().optional(),
    R2_BUCKET: z.string().optional(),
    R2_ENDPOINT: z.string().optional(),
    R2_ACCESS_KEY_ID: z.string().optional(),
    R2_SECRET_ACCESS_KEY: z.string().optional(),
    R2_REGION: z.string().optional(),
    SUPABASE_BUCKET: z.string().optional(),
    SUPABASE_ENDPOINT: z.string().optional(),
    SUPABASE_ACCESS_KEY_ID: z.string().optional(),
    SUPABASE_SECRET_ACCESS_KEY: z.string().optional(),
    SUPABASE_REGION: z.string().optional(),
    OTEL_ENABLED: z.string().optional(),
    OTEL_SERVICE_NAME: z.string().optional(),
    SEARCH_FTS_ENABLED: z.string().optional(),
    EMAIL_PROVIDER: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    EMAIL_FROM: z.string().optional(),
    EMAIL_FROM_NAME: z.string().optional(),
    EMAIL_WEEKLY_ALERTS_ENABLED: z.string().optional(),
    EMAIL_WEEKLY_DAY: z.string().optional(),
    EMAIL_WEEKLY_HOUR: z.string().optional(),
    OTP_TTL_MINUTES: z.string().optional(),
    APP_URL: z.string().optional(),
  })
  .passthrough()
  .superRefine((env, ctx) => {
    const jobsStore = (env.JOBS_STORE ?? 'memory').toLowerCase();
    const prismaNeeded =
      jobsStore === 'prisma' ||
      (env.AUTH_STORE ?? '').toLowerCase() === 'prisma' ||
      (env.NOTIFICATIONS_STORE ?? '').toLowerCase() === 'prisma';

    if (prismaNeeded && !env.DATABASE_URL?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['DATABASE_URL'],
        message: 'DATABASE_URL is required when any *_STORE=prisma',
      });
    }

    const isProd = (env.NODE_ENV ?? 'development') === 'production';
    if (isProd) {
      const pwd = env.SUPER_ADMIN_PASSWORD ?? '';
      if (!pwd.trim() || /change-me/i.test(pwd)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['SUPER_ADMIN_PASSWORD'],
          message:
            'SUPER_ADMIN_PASSWORD must be a strong secret in production',
        });
      }
    }

    if ((env.FILE_STORAGE ?? '').toLowerCase() === 's3') {
      if (!env.FILE_S3_BUCKET?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['FILE_S3_BUCKET'],
          message: 'FILE_S3_BUCKET required when FILE_STORAGE=s3',
        });
      }
    }

    const uploadMode = (env.UPLOAD_STORAGE ?? 'local').toLowerCase();
    if (uploadMode === 'r2' || uploadMode === 'supabase') {
      const prefix = uploadMode === 'r2' ? 'R2' : 'SUPABASE';
      const suffixes = [
        'BUCKET',
        'ENDPOINT',
        'ACCESS_KEY_ID',
        'SECRET_ACCESS_KEY',
        // Supabase uses a real region for SigV4; R2's client defaults to `auto`.
        ...(uploadMode === 'supabase' ? ['REGION'] : []),
      ];
      for (const suffix of suffixes) {
        const label = `${prefix}_${suffix}`;
        if (!String((env as Record<string, unknown>)[label] ?? '').trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [label],
            message: `${label} required when UPLOAD_STORAGE=${uploadMode}`,
          });
        }
      }
    }
  });

export type AppEnv = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): AppEnv {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    const lines = parsed.error.issues.map(
      (issue) => `  - ${issue.path.join('.') || 'env'}: ${issue.message}`,
    );
    throw new Error(`Invalid environment:\n${lines.join('\n')}`);
  }
  return parsed.data;
}

export function flagEnabled(
  value: string | undefined,
  defaultWhenUnset = false,
): boolean {
  if (value === undefined || value === '') return defaultWhenUnset;
  const v = value.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes' || v === 'on';
}

/** Outbox on when explicitly enabled, or when JOBS_STORE=prisma (durable path). */
export function isOutboxEnabled(): boolean {
  const explicit = process.env.OUTBOX_ENABLED;
  if (explicit !== undefined && explicit !== '') {
    return flagEnabled(explicit, false);
  }
  return (process.env.JOBS_STORE ?? 'memory').toLowerCase() === 'prisma';
}

export function isSearchFtsEnabled(): boolean {
  const explicit = process.env.SEARCH_FTS_ENABLED;
  if (explicit !== undefined && explicit !== '') {
    return flagEnabled(explicit, false);
  }
  return (process.env.JOBS_STORE ?? 'memory').toLowerCase() === 'prisma';
}
