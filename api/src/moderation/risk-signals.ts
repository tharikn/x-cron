import type { ModerationConfig } from './moderation.types';

export interface RiskInput {
  title?: string;
  description?: string;
  salaryText?: string;
  city?: string;
  applyUrl?: string;
  contactWebsite?: string;
  ownerEmail?: string;
  recentPostCount?: number;
  siblingDuplicateCount?: number;
  brandName?: string;
}

export interface RiskResult {
  flags: string[];
  score: number;
}

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'guerrillamail.com',
  'tempmail.com',
  '10minutemail.com',
  'yopmail.com',
  'trashmail.com',
]);

/** Soft risk signals for prioritisation — never auto-ban alone. */
export function evaluateRiskSignals(
  input: RiskInput,
  config: ModerationConfig,
): RiskResult {
  const flags: string[] = [];
  let score = 0;
  const text = `${input.title ?? ''} ${input.description ?? ''}`.toLowerCase();

  for (const phrase of config.prohibitedPhrases) {
    if (phrase && text.includes(phrase.toLowerCase())) {
      flags.push('payment_request_language');
      score += 35;
      break;
    }
  }

  for (const brand of config.brandImpersonationKeywords) {
    if (brand && text.includes(brand.toLowerCase())) {
      flags.push('brand_impersonation');
      score += 30;
      break;
    }
  }

  const email = input.ownerEmail?.trim().toLowerCase() ?? '';
  const domain = email.includes('@') ? email.split('@')[1] : '';
  if (domain && DISPOSABLE_DOMAINS.has(domain)) {
    flags.push('disposable_email');
    score += 25;
  }

  const urls = [
    input.applyUrl,
    input.contactWebsite,
    ...(text.match(/https?:\/\/[^\s)]+/gi) ?? []),
  ].filter(Boolean) as string[];
  for (const url of urls) {
    try {
      const host = new URL(url).hostname.toLowerCase();
      if (
        host.includes('bit.ly') ||
        host.includes('tinyurl') ||
        host.includes('t.me') ||
        /\d{1,3}(\.\d{1,3}){3}/.test(host)
      ) {
        flags.push('suspicious_external_link');
        score += 15;
        break;
      }
    } catch {
      /* ignore bad URLs */
    }
  }

  const salary = (input.salaryText ?? '').toLowerCase();
  if (
    /(?:\d{1,2})\s*lakh/.test(salary) &&
    /fresher|no experience|0\s*year/.test(text)
  ) {
    flags.push('unrealistic_compensation');
    score += 20;
  }

  if ((input.recentPostCount ?? 0) >= 8) {
    flags.push('high_posting_velocity');
    score += 20;
  }

  if ((input.siblingDuplicateCount ?? 0) >= 1) {
    flags.push('copied_description_or_duplicate');
    score += 25;
  }

  if (/whatsapp\s*only|dm\s*for\s*job|pay\s*to\s*apply/i.test(text)) {
    flags.push('unusual_recruiting_pattern');
    score += 15;
  }

  return {
    flags: [...new Set(flags)],
    score: Math.min(100, score),
  };
}

export function priorityFromScore(score: number): 'low' | 'normal' | 'high' | 'urgent' {
  if (score >= 70) return 'urgent';
  if (score >= 40) return 'high';
  if (score >= 20) return 'normal';
  return 'low';
}
