import { mapOcrTextToJobDraft } from './job-ad.mapper';

describe('mapOcrTextToJobDraft', () => {
  it('extracts flyer fields without inventing missing facts', () => {
    const raw = `
WANTED
TAX CONSULTANCY FIRM
OFFICE ASSISTANT (Female) 02
BASIC COMPUTER KNOWLEDGE
& EDU. B COM PASSED.
TRAINING PERIOD 3 MONTHS
SALARY 7000/- TO 9000
IN TRAINING PERIOD
Company Name
ABC PVT LTD
SHRIRAM BLDG., OPP. SAIBABA
SUITWALA, GANDHIDHAM.,
yourmail@gmail.com
9876543210
`;

    const draft = mapOcrTextToJobDraft(raw, 'Appointment_Sample2.jpg', 0.7);

    expect(draft.title.toLowerCase()).toContain('office assistant');
    expect(draft.employerName?.toUpperCase()).toContain('ABC');
    expect(draft.employerName?.toUpperCase()).toMatch(/PVT/);
    expect(draft.locationCity).toBe('Gandhidham');
    expect(draft.salaryText).toMatch(/7000/);
    expect(draft.contactEmail).toBe('yourmail@gmail.com');
    expect(draft.contactPhone).toBe('9876543210');
    expect(draft.description).not.toMatch(/9876543210/);
    expect(draft.description).not.toMatch(/yourmail@gmail.com/);
    expect(draft.confidence).toBeGreaterThan(0.5);
    expect(draft.jobType).toBe('full-time');
  });

  it('falls back safely when OCR text is empty', () => {
    const draft = mapOcrTextToJobDraft('', 'blurry-scan.png', 0.1);
    expect(draft.title).toBe('blurry scan');
    expect(draft.employerName).toBe('From upload');
    expect(draft.confidence).toBeLessThan(0.5);
  });

  it('recovers phones with OCR letter/digit noise but skips masked numbers', () => {
    const noisy = mapOcrTextToJobDraft(
      'Hiring Clerk\nCall 9O8765432I\nhr@example.com',
      'noise.jpg',
      0.8,
    );
    expect(noisy.contactPhone).toBe('9087654321');

    const masked = mapOcrTextToJobDraft(
      'Hiring Clerk\n9xxxxxxx0\nyourmail@gmail.com',
      'masked.jpg',
      0.8,
    );
    expect(masked.contactPhone).toBeUndefined();
    expect(masked.contactEmail).toBe('yourmail@gmail.com');
    expect(masked.notes?.some((n) => /redacted|masked/i.test(n))).toBe(true);
  });
});
