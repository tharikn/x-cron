/** Free-first job import integrations (partner API, feeds, Zapier/ATS webhooks). */

export type IntegrationSource =
  | 'partner'
  | 'feed'
  | 'webhook'
  | 'sheet'
  | 'ats';

export interface PartnerApiKey {
  id: string;
  employerId: string;
  ownerUserId: string;
  label: string;
  /** Full key shown once at create; store only hash + prefix afterward. */
  keyHash: string;
  keyPrefix: string;
  /** When true and PARTNER_AUTO_PUBLISH=1, upserts publish live. Default false → needs-review. */
  autoPublish: boolean;
  revokedAt?: string;
  lastUsedAt?: string;
  createdAt: string;
}

export interface JobFeed {
  id: string;
  employerId: string;
  ownerUserId: string;
  label: string;
  /** Public HTTPS URL of full open-jobs XML or JSON feed. */
  url: string;
  format: 'xml' | 'json' | 'auto';
  enabled: boolean;
  /** Close jobs previously synced from this feed but missing in the latest crawl. */
  closeMissing: boolean;
  lastPulledAt?: string;
  lastStatus?: 'ok' | 'error' | 'empty';
  lastError?: string;
  lastBatchId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookEndpoint {
  id: string;
  employerId: string;
  ownerUserId: string;
  label: string;
  /** Opaque path token — never a session secret. */
  token: string;
  /** Optional shared secret checked via X-Xcron-Signature or X-Webhook-Secret. */
  secret?: string;
  enabled: boolean;
  lastUsedAt?: string;
  createdAt: string;
}

export interface ExternalJobRef {
  id: string;
  employerId: string;
  ownerUserId: string;
  externalJobId: string;
  jobId: string;
  source: IntegrationSource;
  feedId?: string;
  updatedAt: string;
}
