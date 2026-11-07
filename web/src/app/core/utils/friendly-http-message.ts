import type { FieldErrors } from './job-form.validation';

/** Map HTTP / network failures to end-user copy (never raw "Failed to fetch"). */
export function friendlyHttpMessage(err: unknown, fallback: string): string {
  const fields = fieldErrorsFromHttp(err);
  const firstField = Object.values(fields)[0];
  if (firstField) return withCorrelation(firstField, err);

  const raw = extractRawMessage(err);
  if (raw && looksLikeNetworkNoise(raw)) {
    return withCorrelation(
      "We couldn't reach X Cron. Check your connection and try again.",
      err,
    );
  }
  if (raw && !looksLikeDeveloperNoise(raw) && raw !== 'Validation failed') {
    return withCorrelation(raw, err);
  }
  if (isNetworkFailure(err)) {
    return withCorrelation(
      "We couldn't reach X Cron. Check your connection and try again.",
      err,
    );
  }
  return withCorrelation(fallback, err);
}

/** Support ref from X-Request-Id / API correlationId (Doc 10 §5). */
export function correlationIdFromHttp(err: unknown): string | null {
  const stamped = (err as { correlationId?: unknown })?.correlationId;
  if (typeof stamped === 'string' && stamped.trim()) return stamped.trim();
  const headers = (err as { headers?: { get?: (k: string) => string | null } })
    ?.headers;
  const fromHeader = headers?.get?.('X-Request-Id');
  if (fromHeader?.trim()) return fromHeader.trim();
  const body = (err as { error?: unknown })?.error;
  if (body && typeof body === 'object') {
    const id = (body as { correlationId?: unknown }).correlationId;
    if (typeof id === 'string' && id.trim()) return id.trim();
  }
  return null;
}

function withCorrelation(message: string, err: unknown): string {
  const id = correlationIdFromHttp(err);
  if (!id || message.includes(id)) return message;
  return `${message} (ref: ${id.slice(0, 8)})`;
}

/** Extract Nest `errors: { field: message }` map from HttpErrorResponse-like errors. */
export function fieldErrorsFromHttp(err: unknown): FieldErrors {
  const body = (err as { error?: unknown })?.error;
  if (!body || typeof body !== 'object') return {};
  const errors = (body as { errors?: unknown }).errors;
  if (!errors || typeof errors !== 'object' || Array.isArray(errors)) return {};
  const out: FieldErrors = {};
  for (const [key, value] of Object.entries(errors as Record<string, unknown>)) {
    if (typeof value === 'string' && value.trim()) out[key] = value.trim();
  }
  return out;
}

function extractRawMessage(err: unknown): string | null {
  const http = err as {
    error?: unknown;
    message?: string;
    status?: number;
  };
  const body = http?.error;
  if (typeof body === 'string' && body.trim()) return body.trim();
  if (body && typeof body === 'object') {
    const message = (body as { message?: string | string[] }).message;
    if (Array.isArray(message) && message[0]) return String(message[0]).trim();
    if (typeof message === 'string' && message.trim()) return message.trim();
  }
  if (err instanceof Error && err.message.trim()) return err.message.trim();
  if (typeof http?.message === 'string' && http.message.trim()) return http.message.trim();
  return null;
}

function isNetworkFailure(err: unknown): boolean {
  const status = (err as { status?: number })?.status;
  if (status === 0) return true;
  const name = err instanceof Error ? err.name : (err as { name?: string })?.name;
  return name === 'TypeError' || name === 'NetworkError';
}

function looksLikeNetworkNoise(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m === 'failed to fetch' ||
    m.includes('failed to fetch') ||
    m.includes('networkerror') ||
    m.includes('network request failed') ||
    m.includes('load failed') ||
    m.includes('err_connection') ||
    m.includes('err_internet') ||
    m.includes('err_name_not_resolved') ||
    m.includes('http failure response') ||
    m.includes('unknown error')
  );
}

function looksLikeDeveloperNoise(message: string): boolean {
  if (looksLikeNetworkNoise(message)) return true;
  const m = message.toLowerCase();
  return (
    m.startsWith('http failure') ||
    m.includes('status code') ||
    m.includes('econnrefused') ||
    m.includes('enotfound')
  );
}
