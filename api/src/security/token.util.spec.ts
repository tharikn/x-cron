import type { Request } from 'express';
import {
  extractAccessToken,
  extractClientIp,
  extractRefreshToken,
  extractTabId,
  extractUserAgent,
} from './token.util';

function req(partial: {
  headers?: Record<string, string | string[] | undefined>;
  cookies?: Record<string, string>;
  ip?: string;
}): Request {
  return {
    headers: partial.headers ?? {},
    cookies: partial.cookies ?? {},
    ip: partial.ip,
  } as unknown as Request;
}

describe('token.util', () => {
  it('prefers Bearer over the access cookie', () => {
    expect(
      extractAccessToken(
        req({
          headers: { authorization: 'Bearer bearer-token' },
          cookies: { xcron_access: 'cookie-token' },
        }),
      ),
    ).toBe('bearer-token');
  });

  it('falls back to the access cookie and ignores empty Bearer', () => {
    expect(
      extractAccessToken(
        req({ headers: { authorization: 'Bearer   ' }, cookies: { xcron_access: ' c1 ' } }),
      ),
    ).toBe('c1');
    expect(extractAccessToken(req({}))).toBeUndefined();
  });

  it('prefers body refresh token, then the refresh cookie', () => {
    const r = req({ cookies: { xcron_refresh: 'from-cookie' } });
    expect(extractRefreshToken(r, ' from-body ')).toBe('from-body');
    expect(extractRefreshToken(r, '')).toBe('from-cookie');
    expect(extractRefreshToken(req({}))).toBeUndefined();
  });

  it('reads X-Tab-Id as string or first array value', () => {
    expect(extractTabId(req({ headers: { 'x-tab-id': ' tab-1 ' } }))).toBe('tab-1');
    expect(extractTabId(req({ headers: { 'x-tab-id': ['tab-2', 'tab-3'] } }))).toBe('tab-2');
    expect(extractTabId(req({ headers: { 'x-tab-id': '' } }))).toBeUndefined();
  });

  it('uses the first X-Forwarded-For hop before req.ip', () => {
    expect(
      extractClientIp(req({ headers: { 'x-forwarded-for': '203.0.113.5, 10.0.0.1' }, ip: '::1' })),
    ).toBe('203.0.113.5');
    expect(extractClientIp(req({ ip: '127.0.0.1' }))).toBe('127.0.0.1');
  });

  it('truncates user agents to 512 chars', () => {
    const ua = 'x'.repeat(600);
    expect(extractUserAgent(req({ headers: { 'user-agent': ua } }))).toHaveLength(512);
    expect(extractUserAgent(req({}))).toBeUndefined();
  });
});
