/** India-first field patterns — keep messages aligned with web/mobile clients. */

export const XCRON_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

/** Indian mobile (+91 / 0 prefix) or E.164-ish international. */
export const XCRON_PHONE_CLEAN_RE = /^[\d+\-\s().]+$/;

export const XCRON_PINCODE_RE = /^\d{6}$/;

/** Salary free-text: digits, commas, dots, ranges, LPA/month words. */
export const XCRON_SALARY_RE = /^[\d,.\-\s/+a-zA-Z₹]*$/;

export const XCRON_USERNAME_RE = /^[a-zA-Z0-9_]+$/;

/** HTTP(S) URL with optional scheme. */
export const XCRON_URL_RE =
  /^(https?:\/\/)?([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(\/[^\s]*)?$/i;

export const MSG = {
  email: 'email must be a valid email address',
  phone: 'phone must be a valid mobile number',
  pincode: 'pincode must be a 6-digit Indian PIN',
  salary: 'salary may only use digits, currency symbols, and short labels',
  url: 'must be a valid http(s) URL',
  safeText: 'must be plain text without control characters or markup',
  emptyOptional: 'must not be empty when provided',
} as const;

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/** True when empty (optional fields) or a valid phone. */
export function isValidXcronPhone(raw: string): boolean {
  const cleaned = raw.replace(/[\s\-().]/g, '');
  if (!cleaned) return false;
  if (!XCRON_PHONE_CLEAN_RE.test(raw.trim())) return false;
  if (/^\+91[6-9]\d{9}$/.test(cleaned)) return true;
  if (/^0?[6-9]\d{9}$/.test(cleaned)) return true;
  if (/^\+[1-9]\d{6,14}$/.test(cleaned)) return true;
  const digits = digitsOnly(cleaned);
  return digits.length >= 10 && digits.length <= 15;
}

export function isValidXcronEmail(raw: string): boolean {
  const value = raw.trim();
  return value.length > 0 && value.length <= 160 && XCRON_EMAIL_RE.test(value);
}

export function isValidXcronPincode(raw: string): boolean {
  return XCRON_PINCODE_RE.test(raw.trim());
}

export function isValidXcronSalary(raw: string): boolean {
  const value = raw.trim();
  if (!value) return false;
  if (value.length > 40) return false;
  return XCRON_SALARY_RE.test(value);
}

export function isValidXcronUrl(raw: string): boolean {
  const value = raw.trim();
  if (!value) return false;
  if (!XCRON_URL_RE.test(value)) return false;
  try {
    const href = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const url = new URL(href);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Printable text: no null bytes / C0 controls (except tab/newline when allowed). */
export function isSafePlainText(
  raw: string,
  opts: { allowNewlines?: boolean; max?: number } = {},
): boolean {
  const value = raw;
  if (opts.max != null && value.length > opts.max) return false;
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code === 0) return false;
    if (code < 32) {
      if (opts.allowNewlines && (code === 9 || code === 10 || code === 13)) continue;
      return false;
    }
    if (code === 127) return false;
  }
  // Reject obvious markup tags in short plain fields
  if (/<\s*\/?\s*[a-z!]/i.test(value)) return false;
  return true;
}
