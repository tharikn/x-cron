import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

const POLLUTION_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/** XSS / script injection in string values. */
const XSS_PATTERNS: RegExp[] = [
  /<\s*script\b/i,
  /javascript\s*:/i,
  /\bon[a-z]+\s*=/i,
  /<\s*iframe\b/i,
  /<\s*object\b/i,
  /<\s*embed\b/i,
  /data\s*:\s*text\/html/i,
  /<\s*svg\b[^>]*\bon\w+/i,
];

/**
 * SQL *injection payload* patterns — not English reserved-word blacklists
 * (those break job titles like "SQL Select Trainer").
 */
const SQLI_PATTERNS: RegExp[] = [
  /(\b(union)\b\s+\b(all\s+)?select\b)/i,
  /(\b(drop|alter|truncate)\b\s+\b(table|database|schema)\b)/i,
  /(\b(insert)\b\s+\b(into)\b)/i,
  /(\b(delete)\b\s+\b(from)\b)/i,
  /(\b(exec|execute)\b\s*\()/i,
  /;\s*(drop|delete|update|insert|alter)\b/i,
  /('\s*or\s+'?\d+'?\s*=\s*'?\d+)/i,
  /('\s*or\s+'[^']*'\s*=\s*')/i,
  /(--\s*$)|(\/\*[\s\S]*?\*\/)/,
  /(\bxp_cmdshell\b)/i,
  /(\binformation_schema\b)/i,
];

function hasDangerousControls(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code === 0) return true;
    // Allow tab / LF / CR; reject other C0
    if (code < 32 && code !== 9 && code !== 10 && code !== 13) return true;
  }
  return false;
}

function matchAny(value: string, patterns: RegExp[]): boolean {
  return patterns.some((re) => re.test(value));
}

export type ProtectorHit = { path: string; reason: string };

export function scanValue(
  value: unknown,
  path: string,
  hits: ProtectorHit[],
  depth = 0,
): void {
  if (depth > 12) return;

  if (typeof value === 'string') {
    if (hasDangerousControls(value)) {
      hits.push({ path, reason: 'contains illegal control characters' });
      return;
    }
    if (matchAny(value, XSS_PATTERNS)) {
      hits.push({ path, reason: 'contains disallowed script or markup' });
      return;
    }
    if (matchAny(value, SQLI_PATTERNS)) {
      hits.push({ path, reason: 'contains disallowed query injection pattern' });
      return;
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, i) => scanValue(item, `${path}[${i}]`, hits, depth + 1));
    return;
  }

  if (value && typeof value === 'object') {
    // Skip Buffers / streams
    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) return;
    for (const key of Object.keys(value as object)) {
      const childPath = path ? `${path}.${key}` : key;
      if (POLLUTION_KEYS.has(key)) {
        hits.push({ path: childPath, reason: 'prototype pollution key rejected' });
        continue;
      }
      scanValue((value as Record<string, unknown>)[key], childPath, hits, depth + 1);
    }
  }
}

export function scanRequestPayload(body: unknown, query: unknown): ProtectorHit[] {
  const hits: ProtectorHit[] = [];
  if (body != null && typeof body === 'object') {
    scanValue(body, '', hits);
  }
  if (query != null && typeof query === 'object') {
    scanValue(query, 'query', hits);
  }
  return hits;
}

@Injectable()
export class InputProtectorMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    // Multipart uploads: only scan non-file string fields if body was parsed as object
    const contentType = String(req.headers['content-type'] ?? '');
    if (contentType.includes('multipart/form-data')) {
      // Multer leaves text fields on body; still scan those strings
    }

    const hits = scanRequestPayload(req.body, req.query);
    if (hits.length > 0) {
      const errors: Record<string, string> = {};
      for (const hit of hits.slice(0, 20)) {
        const key = hit.path || '_body';
        if (!errors[key]) errors[key] = hit.reason;
      }
      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Request rejected by input protector',
        errors,
      });
    }
    next();
  }
}
