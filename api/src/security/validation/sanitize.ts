import { Transform } from 'class-transformer';

/** Strip null bytes and C0 controls (keep tab/LF/CR). */
export function stripControlChars(value: string, allowNewlines = true): string {
  let out = '';
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code === 0 || code === 127) continue;
    if (code < 32) {
      if (allowNewlines && (code === 9 || code === 10 || code === 13)) {
        out += value[i];
      }
      continue;
    }
    out += value[i];
  }
  return out;
}

/** Remove simple HTML tags from short plain-text fields (names, address, company). */
export function stripSimpleHtml(value: string): string {
  return value.replace(/<\/?[^>]+>/g, '');
}

export function sanitizePlainString(
  value: unknown,
  opts: { allowNewlines?: boolean; stripHtml?: boolean } = {},
): unknown {
  if (typeof value !== 'string') return value;
  let next = stripControlChars(value, opts.allowNewlines ?? false);
  if (opts.stripHtml !== false) {
    next = stripSimpleHtml(next);
  }
  return next.trim();
}

/** Trim + strip controls; empty string → undefined (optional fields). */
export function SanitizeOptionalText(opts: {
  allowNewlines?: boolean;
  stripHtml?: boolean;
} = {}) {
  return Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value !== 'string') return value;
    const cleaned = sanitizePlainString(value, opts);
    if (typeof cleaned === 'string' && cleaned.length === 0) return undefined;
    return cleaned;
  });
}

/** Required string: trim + strip controls (keeps empty so MinLength can fail). */
export function SanitizeText(opts: {
  allowNewlines?: boolean;
  stripHtml?: boolean;
} = {}) {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    return sanitizePlainString(value, {
      allowNewlines: opts.allowNewlines ?? false,
      stripHtml: opts.stripHtml !== false,
    });
  });
}
