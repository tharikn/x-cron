import { csrfHeaders, readCsrfCookie } from './csrf';
import { CSRF_COOKIE } from './security-constants';

function clearCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

describe('CSRF double-submit helpers', () => {
  afterEach(() => {
    clearCookie(CSRF_COOKIE);
    clearCookie('other');
  });

  it('returns null / no header when the cookie is absent', () => {
    expect(readCsrfCookie()).toBeNull();
    expect(csrfHeaders()).toEqual({});
  });

  it('reads and URL-decodes the CSRF twin cookie among others', () => {
    document.cookie = 'other=1; path=/';
    document.cookie = `${CSRF_COOKIE}=${encodeURIComponent('abc/+=')}; path=/`;
    expect(readCsrfCookie()).toBe('abc/+=');
    expect(csrfHeaders()).toEqual({ 'X-CSRF-Token': 'abc/+=' });
  });

  it('does not match a cookie that merely shares the prefix', () => {
    document.cookie = `${CSRF_COOKIE}_old=stale; path=/`;
    expect(readCsrfCookie()).toBeNull();
    clearCookie(`${CSRF_COOKIE}_old`);
  });
});
