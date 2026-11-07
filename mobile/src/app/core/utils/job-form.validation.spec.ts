import {
  isValidPhone,
  isValidUrl,
  parseVacancies,
  validateImportDraftFields,
  validateQuickPostFields,
} from './job-form.validation';

const validPost = {
  title: 'Delivery Executive',
  employerName: 'Acme Logistics',
  locationCity: 'Chennai',
  salaryText: '12000-15000 / month',
  description: 'Deliver parcels across the city.',
  contactPhone: '+91 98765 43210',
  contactEmail: 'hr@acme.in',
  contactWebsite: 'acme.in',
  vacancies: '3',
};

describe('isValidPhone', () => {
  it('accepts Indian mobiles with +91 / 0 prefixes and separators', () => {
    expect(isValidPhone('9876543210')).toBe(true);
    expect(isValidPhone('09876543210')).toBe(true);
    expect(isValidPhone('+91 98765-43210')).toBe(true);
    expect(isValidPhone('(987) 654-3210')).toBe(true);
  });

  it('accepts E.164 international numbers', () => {
    expect(isValidPhone('+14155552671')).toBe(true);
  });

  it('rejects short or junk input', () => {
    expect(isValidPhone('12345')).toBe(false);
    expect(isValidPhone('call me')).toBe(false);
    expect(isValidPhone('')).toBe(false);
  });
});

describe('isValidUrl', () => {
  it('treats blank as valid (optional field)', () => {
    expect(isValidUrl('   ')).toBe(true);
  });

  it('accepts bare domains and http(s) URLs', () => {
    expect(isValidUrl('acme.in')).toBe(true);
    expect(isValidUrl('https://acme.in/careers?x=1')).toBe(true);
  });

  it('rejects non-http schemes and malformed hosts', () => {
    expect(isValidUrl('javascript:alert(1)')).toBe(false);
    expect(isValidUrl('ftp://acme.in')).toBe(false);
    expect(isValidUrl('not a url')).toBe(false);
  });
});

describe('parseVacancies', () => {
  it('parses whole numbers from 1 to 100000', () => {
    expect(parseVacancies('1')).toBe(1);
    expect(parseVacancies(' 42 ')).toBe(42);
    expect(parseVacancies('100000')).toBe(100000);
  });

  it('returns undefined for blank, zero, decimals, negatives and overflow', () => {
    for (const raw of ['', '0', '1.5', '-2', '100001', '01', 'ten']) {
      expect(parseVacancies(raw)).toBeUndefined();
    }
  });
});

describe('validateQuickPostFields', () => {
  it('returns no errors for a valid post', () => {
    expect(validateQuickPostFields(validPost)).toEqual({});
  });

  it('flags required fields when blank', () => {
    const errors = validateQuickPostFields({
      ...validPost,
      title: ' ',
      employerName: '',
      locationCity: '',
      description: '',
    });
    expect(errors['title']).toBe('Title is required.');
    expect(errors['employerName']).toBe('Employer is required.');
    expect(errors['locationCity']).toBe('City / location is required.');
    expect(errors['description']).toBe('Description is required.');
  });

  it('flags length + format problems with API-aligned messages', () => {
    const errors = validateQuickPostFields({
      ...validPost,
      title: 'X',
      description: 'abc',
      salaryText: '<b>lots</b>',
      contactPhone: '123',
      contactEmail: 'nope@',
      contactWebsite: 'javascript:alert(1)',
      vacancies: '0',
    });
    expect(errors['title']).toBe('Title must be 2–200 characters.');
    expect(errors['description']).toBe('Description must be at least 5 characters.');
    expect(errors['salaryText']).toMatch(/range like 12000-15000/);
    expect(errors['contactPhone']).toBe('phone must be a valid mobile number');
    expect(errors['contactEmail']).toBe('email must be a valid email address');
    expect(errors['contactWebsite']).toBe('must be a valid http(s) URL');
    expect(errors['vacancies']).toMatch(/whole number/);
  });

  it('keeps optional contacts optional', () => {
    const errors = validateQuickPostFields({
      ...validPost,
      salaryText: '',
      contactPhone: '',
      contactEmail: '',
      contactWebsite: '',
      vacancies: '',
    });
    expect(errors).toEqual({});
  });
});

describe('validateImportDraftFields', () => {
  const draft = {
    title: 'Data Entry Operator',
    employerName: 'Acme',
    locationCity: 'Madurai',
    jobType: 'full-time',
    salaryText: '7000-9000',
    vacancies: '2',
    contentLanguage: 'ta',
    contactWebsite: '',
    description: 'Typing work in Tamil and English.',
  };

  it('passes a valid draft', () => {
    expect(validateImportDraftFields(draft)).toEqual({});
  });

  it('requires job type and a valid language code', () => {
    const errors = validateImportDraftFields({ ...draft, jobType: '', contentLanguage: 'Tamil' });
    expect(errors['jobType']).toBe('Job type is required.');
    expect(errors['contentLanguage']).toBe('Use a language code like en or ta.');
  });

  it('accepts region-tagged language codes', () => {
    expect(validateImportDraftFields({ ...draft, contentLanguage: 'en-IN' })).toEqual({});
  });

  it('flags a missing language and a bad website', () => {
    const errors = validateImportDraftFields({
      ...draft,
      contentLanguage: '',
      contactWebsite: 'ftp://acme.in',
    });
    expect(errors['contentLanguage']).toBe('Language is required.');
    expect(errors['contactWebsite']).toBe('must be a valid http(s) URL');
  });
});
