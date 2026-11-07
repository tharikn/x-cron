import {
  isSafePlainText,
  isValidXcronEmail,
  isValidXcronPhone,
  isValidXcronPincode,
  isValidXcronSalary,
  isValidXcronUrl,
} from './patterns';

describe('validation patterns (India-first)', () => {
  it.each([
    ['9876543210', true],
    ['+91 98765 43210', true],
    ['09876543210', true],
    ['+14155552671', true],
    ['12345', false],
    ['98765abc10', false],
    ['', false],
  ])('phone %s → %s', (raw, ok) => {
    expect(isValidXcronPhone(raw)).toBe(ok);
  });

  it.each([
    ['hr@kovai.in', true],
    [' jobs@example.co ', true],
    ['no-at-sign', false],
    ['a@b.c', false],
  ])('email %s → %s', (raw, ok) => {
    expect(isValidXcronEmail(raw)).toBe(ok);
  });

  it('validates 6-digit PIN codes', () => {
    expect(isValidXcronPincode('624601')).toBe(true);
    expect(isValidXcronPincode('62460')).toBe(false);
  });

  it('allows short salary labels but rejects markup and long text', () => {
    expect(isValidXcronSalary('₹15,000 - 20,000 / month')).toBe(true);
    expect(isValidXcronSalary('3.5 LPA')).toBe(true);
    expect(isValidXcronSalary('<b>50k</b>')).toBe(false);
    expect(isValidXcronSalary('1'.repeat(41))).toBe(false);
  });

  it('accepts http(s) URLs with or without scheme', () => {
    expect(isValidXcronUrl('https://kovai.example/careers')).toBe(true);
    expect(isValidXcronUrl('kovai.example')).toBe(true);
    expect(isValidXcronUrl('javascript:alert(1)')).toBe(false);
    expect(isValidXcronUrl('ftp://files.example')).toBe(false);
  });

  it('rejects control characters and markup in plain text', () => {
    expect(isSafePlainText('Night shift available')).toBe(true);
    expect(isSafePlainText('line1\nline2')).toBe(false);
    expect(isSafePlainText('line1\nline2', { allowNewlines: true })).toBe(true);
    expect(isSafePlainText('hi<script>')).toBe(false);
    expect(isSafePlainText('abc', { max: 2 })).toBe(false);
    expect(isSafePlainText('a\u0000b')).toBe(false);
  });
});
