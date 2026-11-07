import { Injectable } from '@nestjs/common';
import { createHash, randomBytes, randomUUID } from 'crypto';
import {
  ExternalJobRef,
  JobFeed,
  PartnerApiKey,
  WebhookEndpoint,
} from './integrations.types';

@Injectable()
export class IntegrationsStore {
  private readonly apiKeys = new Map<string, PartnerApiKey>();
  private readonly keyHashIndex = new Map<string, string>();
  private readonly feeds = new Map<string, JobFeed>();
  private readonly webhooks = new Map<string, WebhookEndpoint>();
  private readonly webhookTokenIndex = new Map<string, string>();
  private readonly externalRefs = new Map<string, ExternalJobRef>();

  newId(prefix: string): string {
    return `${prefix}_${randomUUID().replace(/-/g, '').slice(0, 12)}`;
  }

  hashApiKey(raw: string): string {
    return createHash('sha256').update(raw).digest('hex');
  }

  mintApiKeyRaw(): { raw: string; prefix: string; hash: string } {
    const raw = `xcron_pk_${randomBytes(24).toString('base64url')}`;
    return {
      raw,
      prefix: raw.slice(0, 16),
      hash: this.hashApiKey(raw),
    };
  }

  mintWebhookToken(): string {
    return randomBytes(24).toString('base64url');
  }

  createApiKey(
    input: Omit<PartnerApiKey, 'id' | 'keyHash' | 'keyPrefix' | 'createdAt'> & {
      rawKey: string;
      keyPrefix: string;
      keyHash: string;
    },
  ): PartnerApiKey & { rawKey: string } {
    const row: PartnerApiKey = {
      id: this.newId('pak'),
      employerId: input.employerId,
      ownerUserId: input.ownerUserId,
      label: input.label,
      keyHash: input.keyHash,
      keyPrefix: input.keyPrefix,
      autoPublish: input.autoPublish,
      createdAt: new Date().toISOString(),
    };
    this.apiKeys.set(row.id, row);
    this.keyHashIndex.set(row.keyHash, row.id);
    return { ...row, rawKey: input.rawKey };
  }

  listApiKeys(ownerUserId: string): PartnerApiKey[] {
    return [...this.apiKeys.values()].filter(
      (k) => k.ownerUserId === ownerUserId && !k.revokedAt,
    );
  }

  revokeApiKey(id: string, ownerUserId: string): boolean {
    const row = this.apiKeys.get(id);
    if (!row || row.ownerUserId !== ownerUserId) return false;
    row.revokedAt = new Date().toISOString();
    this.keyHashIndex.delete(row.keyHash);
    return true;
  }

  findApiKeyByRaw(raw: string): PartnerApiKey | undefined {
    const hash = this.hashApiKey(raw.trim());
    const id = this.keyHashIndex.get(hash);
    if (!id) return undefined;
    const row = this.apiKeys.get(id);
    if (!row || row.revokedAt) return undefined;
    row.lastUsedAt = new Date().toISOString();
    return row;
  }

  createFeed(input: Omit<JobFeed, 'id' | 'createdAt' | 'updatedAt'>): JobFeed {
    const now = new Date().toISOString();
    const row: JobFeed = {
      ...input,
      id: this.newId('feed'),
      createdAt: now,
      updatedAt: now,
    };
    this.feeds.set(row.id, row);
    return row;
  }

  listFeeds(ownerUserId: string): JobFeed[] {
    return [...this.feeds.values()].filter((f) => f.ownerUserId === ownerUserId);
  }

  listEnabledFeeds(): JobFeed[] {
    return [...this.feeds.values()].filter((f) => f.enabled);
  }

  getFeed(id: string): JobFeed | undefined {
    return this.feeds.get(id);
  }

  updateFeed(id: string, patch: Partial<JobFeed>): JobFeed | undefined {
    const row = this.feeds.get(id);
    if (!row) return undefined;
    Object.assign(row, patch, { updatedAt: new Date().toISOString() });
    return row;
  }

  createWebhook(
    input: Omit<WebhookEndpoint, 'id' | 'createdAt'>,
  ): WebhookEndpoint {
    const row: WebhookEndpoint = {
      ...input,
      id: this.newId('wh'),
      createdAt: new Date().toISOString(),
    };
    this.webhooks.set(row.id, row);
    this.webhookTokenIndex.set(row.token, row.id);
    return row;
  }

  listWebhooks(ownerUserId: string): WebhookEndpoint[] {
    return [...this.webhooks.values()].filter(
      (w) => w.ownerUserId === ownerUserId && w.enabled,
    );
  }

  findWebhookByToken(token: string): WebhookEndpoint | undefined {
    const id = this.webhookTokenIndex.get(token);
    if (!id) return undefined;
    const row = this.webhooks.get(id);
    if (!row || !row.enabled) return undefined;
    row.lastUsedAt = new Date().toISOString();
    return row;
  }

  revokeWebhook(id: string, ownerUserId: string): boolean {
    const row = this.webhooks.get(id);
    if (!row || row.ownerUserId !== ownerUserId) return false;
    row.enabled = false;
    this.webhookTokenIndex.delete(row.token);
    return true;
  }

  externalKey(employerId: string, externalJobId: string): string {
    return `${employerId}::${externalJobId.trim().toLowerCase()}`;
  }

  upsertExternalRef(
    input: Omit<ExternalJobRef, 'id' | 'updatedAt'>,
  ): ExternalJobRef {
    const key = this.externalKey(input.employerId, input.externalJobId);
    const existing = this.externalRefs.get(key);
    const row: ExternalJobRef = {
      id: existing?.id || this.newId('xref'),
      ...input,
      updatedAt: new Date().toISOString(),
    };
    this.externalRefs.set(key, row);
    return row;
  }

  findExternalRef(
    employerId: string,
    externalJobId: string,
  ): ExternalJobRef | undefined {
    return this.externalRefs.get(
      this.externalKey(employerId, externalJobId),
    );
  }

  listExternalRefsByFeed(feedId: string): ExternalJobRef[] {
    return [...this.externalRefs.values()].filter((r) => r.feedId === feedId);
  }

  listExternalRefsByEmployer(employerId: string): ExternalJobRef[] {
    return [...this.externalRefs.values()].filter(
      (r) => r.employerId === employerId,
    );
  }
}
