import type { Response } from 'express';
import {
  CorrelationIdMiddleware,
  type RequestWithCorrelation,
} from './correlation-id.middleware';

function run(incoming?: string) {
  const headers = new Map<string, string>();
  const req = {
    header: (name: string) => (name.toLowerCase() === 'x-request-id' ? incoming : undefined),
  } as unknown as RequestWithCorrelation;
  const res = {
    setHeader: (name: string, value: string) => headers.set(name, value),
  } as unknown as Response;
  const next = jest.fn();
  new CorrelationIdMiddleware().use(req, res, next);
  return { req, headers, next };
}

describe('CorrelationIdMiddleware', () => {
  it('echoes a client-supplied X-Request-Id', () => {
    const { req, headers, next } = run('client-req-123');
    expect(req.correlationId).toBe('client-req-123');
    expect(headers.get('X-Request-Id')).toBe('client-req-123');
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('generates a UUID when missing, blank or oversized', () => {
    for (const incoming of [undefined, '   ', 'x'.repeat(129)]) {
      const { req, headers } = run(incoming);
      expect(req.correlationId).toMatch(/^[0-9a-f-]{36}$/);
      expect(headers.get('X-Request-Id')).toBe(req.correlationId);
    }
  });
});
