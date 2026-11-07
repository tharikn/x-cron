import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';
import { isRedisEnabled, redisUrl } from './redis.config';

/**
 * Thin optional Redis client. When REDIS_URL is unset, `enabled` is false
 * and helpers no-op / return null — callers keep memory fallbacks.
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private ready = false;

  get enabled(): boolean {
    return this.ready && this.client != null;
  }

  /** Live ioredis instance when connected; otherwise null. */
  getClient(): Redis | null {
    return this.enabled ? this.client : null;
  }

  onModuleInit() {
    const url = redisUrl();
    if (!url || !isRedisEnabled()) {
      this.logger.log('REDIS_URL unset — Redis optional features use memory.');
      return;
    }
    try {
      this.client = new Redis(url, {
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
        lazyConnect: true,
        connectTimeout: 5_000,
      });
      this.client.on('error', (err) => {
        this.ready = false;
        this.logger.warn(
          `Redis error: ${err instanceof Error ? err.message : String(err)}`,
        );
      });
      this.client.on('ready', () => {
        this.ready = true;
        this.logger.log('Redis connected.');
      });
      this.client.on('end', () => {
        this.ready = false;
      });
      void this.client
        .connect()
        .then(() => {
          this.ready = true;
        })
        .catch((err) => {
          this.ready = false;
          this.logger.warn(
            `Redis connect failed — falling back to memory: ${
              err instanceof Error ? err.message : String(err)
            }`,
          );
        });
    } catch (err) {
      this.logger.warn(
        `Redis init failed: ${err instanceof Error ? err.message : String(err)}`,
      );
      this.client = null;
      this.ready = false;
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      try {
        await this.client.quit();
      } catch {
        this.client.disconnect();
      }
      this.client = null;
      this.ready = false;
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.enabled || !this.client) return null;
    try {
      return await this.client.get(key);
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!this.enabled || !this.client) return;
    try {
      if (ttlSeconds && ttlSeconds > 0) {
        await this.client.set(key, value, 'EX', ttlSeconds);
      } else {
        await this.client.set(key, value);
      }
    } catch {
      /* cache write failures are non-fatal */
    }
  }

  async del(...keys: string[]): Promise<void> {
    if (!this.enabled || !this.client || keys.length === 0) return;
    try {
      await this.client.del(...keys);
    } catch {
      /* ignore */
    }
  }

  async ping(): Promise<'pong' | 'disabled' | 'error'> {
    if (!this.client) return 'disabled';
    try {
      const pong = await this.client.ping();
      return pong === 'PONG' ? 'pong' : 'error';
    } catch {
      return 'error';
    }
  }
}
