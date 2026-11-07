import {
  correlationIdFromHttp,
  fieldErrorsFromHttp,
  friendlyHttpMessage,
} from './friendly-http-message';

function httpError(
  status: number,
  error: unknown,
  headers: Record<string, string> = {},
): { status: number; error: unknown; headers: { get: (k: string) => string | null } } {
  return {
    status,
    error,
    headers: { get: (k: string) => headers[k] ?? null },
  };
}

describe('fieldErrorsFromHttp', () => {
  it('extracts the Nest field error map', () => {
    const err = httpError(400, {
      message: 'Validation failed',
      errors: { username: 'username is required', age: 3 },
    });
    expect(fieldErrorsFromHttp(err)).toEqual({ username: 'username is required' });
  });

  it('ignores arrays, strings and missing bodies', () => {
    expect(fieldErrorsFromHttp(httpError(400, { errors: ['x'] }))).toEqual({});
    expect(fieldErrorsFromHttp(httpError(400, 'plain'))).toEqual({});
    expect(fieldErrorsFromHttp(null)).toEqual({});
  });
});

describe('correlationIdFromHttp', () => {
  it('prefers a stamped id, then X-Request-Id, then body correlationId', () => {
    expect(correlationIdFromHttp({ correlationId: ' stamp ' })).toBe('stamp');
    expect(correlationIdFromHttp(httpError(500, {}, { 'X-Request-Id': 'hdr-1' }))).toBe('hdr-1');
    expect(correlationIdFromHttp(httpError(500, { correlationId: 'body-1' }))).toBe('body-1');
  });

  it('returns null when nothing is present', () => {
    expect(correlationIdFromHttp(httpError(500, {}))).toBeNull();
    expect(correlationIdFromHttp(undefined)).toBeNull();
  });
});

describe('friendlyHttpMessage', () => {
  it('shows the first field error instead of "Validation failed"', () => {
    const err = httpError(400, {
      message: 'Validation failed',
      errors: { email: 'email must be a valid email address' },
    });
    expect(friendlyHttpMessage(err, 'Could not save')).toBe('email must be a valid email address');
  });

  it('never surfaces raw "Failed to fetch" / status-0 noise', () => {
    const offline = "We couldn't reach X Cron. Check your connection and try again.";
    expect(friendlyHttpMessage(new TypeError('Failed to fetch'), 'x')).toBe(offline);
    expect(
      friendlyHttpMessage(
        httpError(0, null),
        'x',
      ),
    ).toBe(offline);
    expect(
      friendlyHttpMessage(
        { status: 0, message: 'Http failure response for http://api: 0 Unknown Error' },
        'x',
      ),
    ).toBe(offline);
  });

  it('passes through a human API message', () => {
    const err = httpError(409, { message: 'Username already taken' });
    expect(friendlyHttpMessage(err, 'Could not register')).toBe('Username already taken');
  });

  it('uses the first entry of a message array', () => {
    const err = httpError(400, { message: ['title should not be empty', 'other'] });
    expect(friendlyHttpMessage(err, 'x')).toBe('title should not be empty');
  });

  it('falls back for developer noise and bare "Validation failed"', () => {
    expect(
      friendlyHttpMessage(httpError(500, { message: 'connect ECONNREFUSED 127.0.0.1' }), 'Try later'),
    ).toBe('Try later');
    expect(friendlyHttpMessage(httpError(400, { message: 'Validation failed' }), 'Check form')).toBe(
      'Check form',
    );
  });

  it('appends a short support ref from the correlation id', () => {
    const err = httpError(
      500,
      { message: 'Something broke' },
      { 'X-Request-Id': '0123456789abcdef' },
    );
    expect(friendlyHttpMessage(err, 'x')).toBe('Something broke (ref: 01234567)');
  });
});
