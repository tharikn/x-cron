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

/**
 * Section types whose fields hold user-authored source code. Their code fields
 * are rendered only inside a sandboxed frame (see `docs/dynamic-portfolios/26-CUSTOM-CODE-SANDBOX.md`),
 * so markup/script patterns are expected there.
 */
const CODE_SECTION_TYPES = new Set(['custom-code']);
const CODE_FIELD_KEYS = new Set(['html', 'css', 'js']);

export interface ScanOptions {
  /**
   * Exempt `html` / `css` / `js` fields of portfolio `custom-code` sections from
   * the XSS and SQLi pattern checks. Control characters and prototype-pollution
   * keys are still rejected, and every other field is scanned as usual.
   *
   * Only enable this for the portfolio draft routes — never for the whole API.
   */
  allowPortfolioCode?: boolean;
}

interface ScanState {
  hits: ProtectorHit[];
  options?: ScanOptions;
}

function scanNode(
  value: unknown,
  path: string,
  depth: number,
  state: ScanState,
  /** Current string is a user code field: only control characters are checked. */
  skipPatterns = false,
  /** Ancestor object is a code-bearing section, so its `props` inherit the flag. */
  inCodeSection = false,
): void {
  if (depth > 12) return;

  if (typeof value === 'string') {
    if (hasDangerousControls(value)) {
      state.hits.push({ path, reason: 'contains illegal control characters' });
      return;
    }
    if (skipPatterns) return;
    if (matchAny(value, XSS_PATTERNS)) {
      state.hits.push({ path, reason: 'contains disallowed script or markup' });
      return;
    }
    if (matchAny(value, SQLI_PATTERNS)) {
      state.hits.push({
        path,
        reason: 'contains disallowed query injection pattern',
      });
      return;
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, i) =>
      scanNode(item, `${path}[${i}]`, depth + 1, state, false, inCodeSection),
    );
    return;
  }

  if (value && typeof value === 'object') {
    // Skip Buffers / streams
    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) return;
    const record = value as Record<string, unknown>;
    const codeSection =
      inCodeSection ||
      (state.options?.allowPortfolioCode === true &&
        typeof record['type'] === 'string' &&
        CODE_SECTION_TYPES.has(record['type']));
    for (const key of Object.keys(record)) {
      const childPath = path ? `${path}.${key}` : key;
      if (POLLUTION_KEYS.has(key)) {
        state.hits.push({
          path: childPath,
          reason: 'prototype pollution key rejected',
        });
        continue;
      }
      scanNode(
        record[key],
        childPath,
        depth + 1,
        state,
        codeSection && CODE_FIELD_KEYS.has(key),
        codeSection,
      );
    }
  }
}

export function scanValue(
  value: unknown,
  path: string,
  hits: ProtectorHit[],
  depth = 0,
  options?: ScanOptions,
): void {
  scanNode(value, path, depth, { hits, options });
}

export function scanRequestPayload(
  body: unknown,
  query: unknown,
  options?: ScanOptions,
): ProtectorHit[] {
  const hits: ProtectorHit[] = [];
  if (body != null && typeof body === 'object') {
    scanValue(body, '', hits, 0, options);
  }
  if (query != null && typeof query === 'object') {
    scanValue(query, 'query', hits, 0, options);
  }
  return hits;
}

/**
 * Draft writes are the only routes allowed to carry raw user code. Publish,
 * rollback and every other endpoint keep the strict scan.
 */
const PORTFOLIO_CODE_ROUTES = /^\/v1\/portfolio\/sites\/[^/]+\/draft(?:\/validate)?$/;

export function allowsPortfolioCode(originalUrl: string): boolean {
  const path = String(originalUrl ?? '').split('?')[0].replace(/\/+$/, '');
  return PORTFOLIO_CODE_ROUTES.test(path);
}

@Injectable()
export class InputProtectorMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    // Multipart uploads: only scan non-file string fields if body was parsed as object
    const contentType = String(req.headers['content-type'] ?? '');
    if (contentType.includes('multipart/form-data')) {
      // Multer leaves text fields on body; still scan those strings
    }

    const hits = scanRequestPayload(req.body, req.query, {
      allowPortfolioCode: allowsPortfolioCode(req.originalUrl ?? req.url),
    });
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
