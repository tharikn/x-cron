import { isValidEmail, validateSeekerProfileFields } from './form-validation';

const base = {
  displayName: 'Priya S',
  mobile: '9876543210',
  email: 'priya@example.com',
  address: '12 Anna Salai, Chennai',
  pincode: '600002',
};

describe('validateSeekerProfileFields', () => {
  it('returns no errors for a valid profile', () => {
    expect(validateSeekerProfileFields(base)).toEqual({});
  });

  it('allows every field to be blank (progressive profile)', () => {
    expect(
      validateSeekerProfileFields({
        displayName: '',
        mobile: '',
        email: '',
        address: '',
        pincode: '',
      }),
    ).toEqual({});
  });

  it('rejects markup in name / address', () => {
    const errors = validateSeekerProfileFields({
      ...base,
      displayName: '<script>x</script>',
      address: 'Flat <b>4</b>',
    });
    expect(errors['displayName']).toMatch(/plain text/);
    expect(errors['address']).toMatch(/plain text/);
  });

  it('rejects over-long name / address', () => {
    const errors = validateSeekerProfileFields({
      ...base,
      displayName: 'a'.repeat(81),
      address: 'b'.repeat(241),
    });
    expect(errors['displayName']).toBeDefined();
    expect(errors['address']).toBeDefined();
  });

  it('validates mobile, email and 6-digit PIN', () => {
    const errors = validateSeekerProfileFields({
      ...base,
      mobile: '123',
      email: 'bad@',
      pincode: '60002',
    });
    expect(errors['mobile']).toBe('phone must be a valid mobile number');
    expect(errors['email']).toBe('email must be a valid email address');
    expect(errors['pincode']).toBe('pincode must be a 6-digit Indian PIN');
  });

  it('checks fresher-only fields only for freshers', () => {
    const long = 'c'.repeat(121);
    expect(
      validateSeekerProfileFields({ ...base, careerStage: 'fresher', courseDetails: long })[
        'courseDetails'
      ],
    ).toMatch(/plain text/);
    expect(
      validateSeekerProfileFields({ ...base, careerStage: 'experienced', courseDetails: long }),
    ).not.toHaveProperty('courseDetails');
  });

  it('checks salary and experience ranges for experienced seekers', () => {
    const errors = validateSeekerProfileFields({
      ...base,
      careerStage: 'experienced',
      companyName: '<i>Acme</i>',
      currentSalary: '15k <script>',
      expectedSalary: '₹25,000 / month',
      experienceYears: 51,
      experienceMonths: 12,
    });
    expect(errors['companyName']).toMatch(/plain text/);
    expect(errors['currentSalary']).toMatch(/salary may only use/);
    expect(errors).not.toHaveProperty('expectedSalary');
    expect(errors['experienceYears']).toBe('years must be between 0 and 50');
    expect(errors['experienceMonths']).toBe('months must be between 0 and 11');
  });

  it('accepts boundary experience values', () => {
    expect(
      validateSeekerProfileFields({
        ...base,
        careerStage: 'experienced',
        experienceYears: 0,
        experienceMonths: 11,
      }),
    ).toEqual({});
  });
});

describe('isValidEmail', () => {
  it('requires a non-blank, well-formed address', () => {
    expect(isValidEmail(' hr@acme.in ')).toBe(true);
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('hr@acme')).toBe(false);
    expect(isValidEmail('hr acme.in')).toBe(false);
  });
});
