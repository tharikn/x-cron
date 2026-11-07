import { expect, test } from '@playwright/test';
import { healthCheck, request } from '../helpers/api-client';

/** Cross-cutting API contract: health, correlation id, security headers, validation shape. */
test.describe('@smoke @api Platform contract', () => {
  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API /v1/health not reachable');
  });

  test('health reports stores, redis, outbox, FTS and file storage', async () => {
    const { status, data } = await request<Record<string, unknown>>('GET', '/health');
    expect(status).toBe(200);
    expect(data).toMatchObject({
      status: 'ok',
      product: 'X Cron Jobs',
      redis: expect.objectContaining({ configured: expect.any(Boolean) }),
      outbox: expect.objectContaining({ enabled: expect.any(Boolean) }),
      searchFts: expect.any(Boolean),
      fileStorage: expect.any(String),
    });
    expect(Date.parse(String(data.time))).not.toBeNaN();
  });

  test('echoes a client X-Request-Id and generates one when missing', async () => {
    const echoed = await request('GET', '/health', {
      headers: { 'X-Request-Id': 'e2e-corr-123' },
    });
    expect(echoed.headers.get('x-request-id')).toBe('e2e-corr-123');

    const generated = await request('GET', '/health');
    expect(generated.headers.get('x-request-id')).toMatch(/^[0-9a-f-]{36}$/);
  });

  test('sends hardened security headers (helmet)', async () => {
    const { headers } = await request('GET', '/health');
    expect(headers.get('x-content-type-options')).toBe('nosniff');
    expect(headers.get('referrer-policy')).toBe('no-referrer');
    expect(headers.get('x-powered-by')).toBeNull();
  });

  test('validation 400s use a field-keyed errors map + correlationId', async () => {
    const { status, data } = await request<Record<string, unknown>>('POST', '/auth/register', {
      body: { username: 'A!', password: 'x', confirmPassword: 'y' },
      expectOk: false,
      headers: { 'X-Request-Id': 'e2e-validation' },
    });
    expect(status).toBe(400);
    expect(data.message).toBe('Validation failed');
    expect(data.errors).toEqual(expect.objectContaining({ username: expect.any(String) }));
    expect(data.correlationId).toBe('e2e-validation');
  });

  test('rejects unknown body fields (forbidNonWhitelisted)', async () => {
    const { status, data } = await request<{ errors?: Record<string, string> }>(
      'POST',
      '/tracking/events',
      { body: { type: 'access', isAdmin: true }, expectOk: false },
    );
    expect(status).toBe(400);
    expect(Object.keys(data.errors ?? {})).toContain('isAdmin');
  });

  test('input protector rejects XSS payloads in query strings', async () => {
    const { status, data } = await request<{ message?: string }>(
      'GET',
      `/jobs?q=${encodeURIComponent('<script>alert(1)</script>')}`,
      { expectOk: false },
    );
    expect(status).toBe(400);
    expect(data.message).toMatch(/input protector|Validation/i);
  });

  test('public read endpoints answer without auth', async () => {
    for (const path of ['/jobs?limit=1', '/jobs/meta/categories', '/feedback/faq', '/languages']) {
      const { status } = await request('GET', path);
      expect(status, path).toBe(200);
    }
  });
});
