import type { Response } from 'express';
import {
  RequestLoggingMiddleware,
  type RequestWithLogging,
} from './request-logging.middleware';

function run(status = 200) {
  let finishHandler: ((...args: unknown[]) => void) | undefined;
  const req = {
    method: 'GET',
    originalUrl: '/v1/health',
    correlationId: 'corr-abc',
    user: { id: 'user-1' },
  } as unknown as RequestWithLogging;
  const res = {
    statusCode: status,
    on: (_event: string, cb: (...args: unknown[]) => void) => {
      finishHandler = cb;
      return res;
    },
  } as unknown as Response;
  const next = jest.fn();
  const middleware = new RequestLoggingMiddleware();
  const loggerMock = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
  (middleware as unknown as { logger: unknown }).logger = loggerMock;

  middleware.use(req, res, next);
  expect(next).toHaveBeenCalledTimes(1);

  return { loggerMock, finish: () => finishHandler?.() };
}

describe('RequestLoggingMiddleware', () => {
  it('emits one log line with status, duration and correlation on finish', () => {
    const { loggerMock, finish } = run(200);
    finish();

    expect(loggerMock.log).toHaveBeenCalledTimes(1);
    expect(loggerMock.log).toHaveBeenCalledWith(
      expect.stringContaining('GET /v1/health'),
    );
    expect(loggerMock.log).toHaveBeenCalledWith(
      expect.stringContaining('status=200'),
    );
    expect(loggerMock.log).toHaveBeenCalledWith(
      expect.stringContaining('correlationId=corr-abc'),
    );
    expect(loggerMock.log).toHaveBeenCalledWith(
      expect.stringContaining('userId=user-1'),
    );
    expect(loggerMock.log).toHaveBeenCalledWith(
      expect.stringContaining('durationMs='),
    );
  });

  it('warns on 4xx responses', () => {
    const { loggerMock, finish } = run(400);
    finish();
    expect(loggerMock.warn).toHaveBeenCalledTimes(1);
    expect(loggerMock.log).not.toHaveBeenCalled();
  });

  it('errors on 5xx responses', () => {
    const { loggerMock, finish } = run(500);
    finish();
    expect(loggerMock.error).toHaveBeenCalledTimes(1);
    expect(loggerMock.warn).not.toHaveBeenCalled();
  });
});
