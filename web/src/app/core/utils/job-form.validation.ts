/** Client-side field checks for Post / import edit (India-first patterns). */

export const JOB_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
export const JOB_URL_RE =
  /^(https?:\/\/)?([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(\/[^\s]*)?$/i;
export const JOB_VACANCIES_RE = /^[1-9]\d{0,5}$/;
export const JOB_LANG_RE = /^[a-z]{2}(-[A-Za-z]{2})?$/;
export const JOB_SALARY_RE = /^[\d,.\-\s/+a-zA-Z₹]*$/;
export const JOB_TITLE_RE = /^[\s\S]{2,200}$/;
export const JOB_EMPLOYER_RE = /^[\s\S]{2,200}$/;
export const JOB_CITY_RE = /^[\s\S]{2,120}$/;
export const JOB_DESC_RE = /^[\s\S]{5,20000}$/;

export type FieldErrors = Partial<Record<string, string>>;

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/** Indian mobile (+91 / 0 prefix) or E.164-ish international. */
export function isValidPhone(raw: string): boolean {
  const cleaned = raw.replace(/[\s\-().]/g, '');
  if (/^\+91[6-9]\d{9}$/.test(cleaned)) return true;
  if (/^0?[6-9]\d{9}$/.test(cleaned)) return true;
  if (/^\+[1-9]\d{6,14}$/.test(cleaned)) return true;
  const digits = digitsOnly(cleaned);
  return digits.length >= 10 && digits.length <= 15;
}

export function isValidUrl(raw: string): boolean {
  const value = raw.trim();
  if (!value) return true;
  if (!JOB_URL_RE.test(value)) return false;
  try {
    const href = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const url = new URL(href);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function parseVacancies(raw: string): number | undefined {
  const value = String(raw ?? '').trim();
  if (!value) return undefined;
  if (!JOB_VACANCIES_RE.test(value)) return undefined;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1 || n > 100000) return undefined;
  return Math.floor(n);
}

export function validateQuickPostFields(input: {
  title: string;
  employerName: string;
  locationCity: string;
  salaryText: string;
  description: string;
  contactPhone: string;
  contactEmail: string;
  contactWebsite: string;
  vacancies?: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  const title = input.title.trim();
  const employer = input.employerName.trim();
  const city = input.locationCity.trim();
  const description = input.description.trim();
  const salary = input.salaryText.trim();
  const phone = input.contactPhone.trim();
  const email = input.contactEmail.trim();
  const website = input.contactWebsite.trim();
  const vacancies = String(input.vacancies ?? '').trim();

  if (!title) errors['title'] = 'Title is required.';
  else if (!JOB_TITLE_RE.test(title)) errors['title'] = 'Title must be 2–200 characters.';

  if (!employer) errors['employerName'] = 'Employer is required.';
  else if (!JOB_EMPLOYER_RE.test(employer))
    errors['employerName'] = 'Employer must be 2–200 characters.';

  if (!city) errors['locationCity'] = 'City / location is required.';
  else if (!JOB_CITY_RE.test(city)) errors['locationCity'] = 'City must be 2–120 characters.';

  if (!description) errors['description'] = 'Description is required.';
  else if (!JOB_DESC_RE.test(description))
    errors['description'] = 'Description must be at least 5 characters.';

  if (salary && !JOB_SALARY_RE.test(salary))
    errors['salaryText'] = 'Use numbers or a range like 12000-15000 / month.';

  if (phone && !isValidPhone(phone))
    errors['contactPhone'] = 'phone must be a valid mobile number';

  if (email && !JOB_EMAIL_RE.test(email))
    errors['contactEmail'] = 'email must be a valid email address';

  if (website && !isValidUrl(website))
    errors['contactWebsite'] = 'must be a valid http(s) URL';

  if (vacancies && parseVacancies(vacancies) === undefined)
    errors['vacancies'] = 'Vacancies must be a whole number from 1 to 100000.';

  return errors;
}

export function validateImportDraftFields(input: {
  title: string;
  employerName: string;
  locationCity: string;
  jobType: string;
  salaryText: string;
  vacancies: string;
  contentLanguage: string;
  contactWebsite: string;
  description: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  const title = input.title.trim();
  const employer = input.employerName.trim();
  const city = input.locationCity.trim();
  const jobType = input.jobType.trim();
  const description = input.description.trim();
  const salary = input.salaryText.trim();
  const language = input.contentLanguage.trim();
  const website = input.contactWebsite.trim();
  const vacancies = String(input.vacancies ?? '').trim();

  if (!title) errors['title'] = 'Title is required.';
  else if (!JOB_TITLE_RE.test(title)) errors['title'] = 'Title must be 2–200 characters.';

  if (!employer) errors['employerName'] = 'Employer is required.';
  else if (!JOB_EMPLOYER_RE.test(employer))
    errors['employerName'] = 'Employer must be 2–200 characters.';

  if (!city) errors['locationCity'] = 'City / location is required.';
  else if (!JOB_CITY_RE.test(city)) errors['locationCity'] = 'City must be 2–120 characters.';

  if (!jobType) errors['jobType'] = 'Job type is required.';

  if (!description) errors['description'] = 'Description is required.';
  else if (!JOB_DESC_RE.test(description))
    errors['description'] = 'Description must be at least 5 characters.';

  if (salary && !JOB_SALARY_RE.test(salary))
    errors['salaryText'] = 'Use numbers or a range like 7000-9000.';

  if (vacancies && parseVacancies(vacancies) === undefined)
    errors['vacancies'] = 'Vacancies must be a whole number from 1 to 100000.';

  if (!language) errors['contentLanguage'] = 'Language is required.';
  else if (!JOB_LANG_RE.test(language))
    errors['contentLanguage'] = 'Use a language code like en or ta.';

  if (website && !isValidUrl(website))
    errors['contactWebsite'] = 'Enter a valid URL (https://…).';

  return errors;
}
