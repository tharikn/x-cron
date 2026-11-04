import type { Request } from 'express';
import { ACCESS_COOKIE, REFRESH_COOKIE, TAB_ID_HEADER } from './security.constants';

type CookieBag = Record<string, string | undefined>;

function cookiesOf(req: Request): CookieBag {
  return (req.cookies ?? {}) as CookieBag;
}

/** Prefer HttpOnly access cookie; fall back to Authorization Bearer (native / legacy). */
export function extractAccessToken(req: Request): string | undefined {
  const fromCookie = cookiesOf(req)[ACCESS_COOKIE]?.trim();
  if (fromCookie) return fromCookie;

  const header =
    (req.headers['authorization'] as string | undefined) ||
    (req.headers['Authorization'] as string | undefined);
  if (header?.startsWith('Bearer ')) {
    const token = header.slice('Bearer '.length).trim();
    return token || undefined;
  }
  return undefined;
}

/** Prefer HttpOnly refresh cookie; fall back to JSON body. */
export function extractRefreshToken(
  req: Request,
  bodyToken?: string,
): string | undefined {
  const fromCookie = cookiesOf(req)[REFRESH_COOKIE]?.trim();
  if (fromCookie) return fromCookie;
  const fromBody = bodyToken?.trim();
  return fromBody || undefined;
}

export function extractTabId(req: Request): string | undefined {
  const raw = req.headers[TAB_ID_HEADER];
  if (typeof raw === 'string' && raw.trim()) return raw.trim();
  if (Array.isArray(raw) && raw[0]?.trim()) return raw[0].trim();
  return undefined;
}
