/** Shared client field checks (India-first) — keep messages aligned with API MSG. */

import {
  JOB_EMAIL_RE,
  JOB_SALARY_RE,
  isValidPhone,
  type FieldErrors,
} from './job-form.validation';

export const PINCODE_RE = /^\d{6}$/;

export type SeekerProfileFormInput = {
  displayName: string;
  mobile: string;
  email: string;
  address: string;
  pincode: string;
  courseDetails?: string;
  branchStudied?: string;
  academicScore?: string;
  companyName?: string;
  companyArea?: string;
  currentSalary?: string;
  expectedSalary?: string;
  experienceYears?: number | null;
  experienceMonths?: number | null;
  careerStage?: string;
};

export function validateSeekerProfileFields(input: SeekerProfileFormInput): FieldErrors {
  const errors: FieldErrors = {};
  const name = input.displayName.trim();
  const mobile = input.mobile.trim();
  const email = input.email.trim();
  const address = input.address.trim();
  const pincode = input.pincode.trim();

  if (name && (name.length > 80 || /<\s*\/?\s*[a-z!]/i.test(name))) {
    errors['displayName'] = 'must be plain text without control characters or markup';
  }

  if (mobile && !isValidPhone(mobile)) {
    errors['mobile'] = 'phone must be a valid mobile number';
  }

  if (email && !JOB_EMAIL_RE.test(email)) {
    errors['email'] = 'email must be a valid email address';
  }

  if (address && (address.length > 240 || /<\s*\/?\s*[a-z!]/i.test(address))) {
    errors['address'] = 'must be plain text without control characters or markup';
  }

  if (pincode && !PINCODE_RE.test(pincode)) {
    errors['pincode'] = 'pincode must be a 6-digit Indian PIN';
  }

  if (input.careerStage === 'fresher') {
    for (const [key, max] of [
      ['courseDetails', 120],
      ['branchStudied', 80],
      ['academicScore', 40],
    ] as const) {
      const raw = String(input[key] ?? '').trim();
      if (raw && (raw.length > max || /<\s*\/?\s*[a-z!]/i.test(raw))) {
        errors[key] = 'must be plain text without control characters or markup';
      }
    }
  }

  if (input.careerStage === 'experienced') {
    for (const [key, max] of [
      ['companyName', 120],
      ['companyArea', 120],
    ] as const) {
      const raw = String(input[key] ?? '').trim();
      if (raw && (raw.length > max || /<\s*\/?\s*[a-z!]/i.test(raw))) {
        errors[key] = 'must be plain text without control characters or markup';
      }
    }
    const current = String(input.currentSalary ?? '').trim();
    const expected = String(input.expectedSalary ?? '').trim();
    if (current && !JOB_SALARY_RE.test(current)) {
      errors['currentSalary'] =
        'salary may only use digits, currency symbols, and short labels';
    }
    if (expected && !JOB_SALARY_RE.test(expected)) {
      errors['expectedSalary'] =
        'salary may only use digits, currency symbols, and short labels';
    }
    const years = input.experienceYears;
    if (years != null && (!Number.isFinite(years) || years < 0 || years > 50)) {
      errors['experienceYears'] = 'years must be between 0 and 50';
    }
    const months = input.experienceMonths;
    if (months != null && (!Number.isFinite(months) || months < 0 || months > 11)) {
      errors['experienceMonths'] = 'months must be between 0 and 11';
    }
  }

  return errors;
}

export function isValidEmail(raw: string): boolean {
  const value = raw.trim();
  return value.length > 0 && JOB_EMAIL_RE.test(value);
}

export { JOB_EMAIL_RE, isValidPhone, type FieldErrors };
