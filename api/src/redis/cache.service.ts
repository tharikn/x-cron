import { Injectable, Logger } from '@nestjs/common';
import { CACHE_TTL } from './redis.constants';
import { isRedisCacheEnabled } from './redis.config';
import { RedisKeys } from './redis-keys';
import { RedisService } from './redis.service';

/**
 * Cache-aside helper for public read models.
 * Never use for apply eligibility / private profiles — re-check Postgres/store.
 */
@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(private readonly redis: RedisService) {}

  get active(): boolean {
    return isRedisCacheEnabled() && this.redis.enabled;
  }

  async getJson<T>(key: string): Promise<T | null> {
    if (!this.active) return null;
    const raw = await this.redis.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      await this.redis.del(key);
      return null;
    }
  }

  async setJson(
    key: string,
    value: unknown,
    ttlSeconds: number,
  ): Promise<void> {
    if (!this.active) return;
    try {
      await this.redis.set(key, JSON.stringify(value), ttlSeconds);
    } catch (err) {
      this.logger.debug(
        `cache set failed ${key}: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }
  }

  async getOrSetJson<T>(
    key: string,
    ttlSeconds: number,
    loader: () => Promise<T>,
  ): Promise<T> {
    const hit = await this.getJson<T>(key);
    if (hit != null) return hit;
    const value = await loader();
    await this.setJson(key, value, ttlSeconds);
    return value;
  }

  async invalidateJobPublic(job: {
    id: string;
    slug?: string | null;
    employerId?: string | null;
  }): Promise<void> {
    const keys = [RedisKeys.jobPublic(job.id)];
    if (job.slug) keys.push(RedisKeys.jobPublicSlug(job.slug));
    if (job.employerId) keys.push(RedisKeys.companyPublic(job.employerId));
    await this.redis.del(...keys);
  }

  async invalidateCompanyPublic(companyId: string): Promise<void> {
    await this.redis.del(RedisKeys.companyPublic(companyId));
  }

  jobPublicKey(jobId: string) {
    return RedisKeys.jobPublic(jobId);
  }

  jobPublicSlugKey(slug: string) {
    return RedisKeys.jobPublicSlug(slug);
  }

  companyPublicKey(companyId: string) {
    return RedisKeys.companyPublic(companyId);
  }

  get ttl() {
    return CACHE_TTL;
  }
}
