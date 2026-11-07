import { evaluateRiskSignals, priorityFromScore } from './risk-signals';
import { DEFAULT_MODERATION_CONFIG, type ModerationConfig } from './moderation.types';

const config: ModerationConfig = {
  ...DEFAULT_MODERATION_CONFIG,
  prohibitedPhrases: ['pay registration fee'],
  brandImpersonationKeywords: ['infosys'],
};

describe('evaluateRiskSignals', () => {
  it('returns no flags for a clean listing', () => {
    expect(
      evaluateRiskSignals(
        {
          title: 'Billing executive',
          description: 'Handle billing at our Palani store.',
          ownerEmail: 'hr@kovai.example',
          applyUrl: 'https://kovai.example/careers',
        },
        config,
      ),
    ).toEqual({ flags: [], score: 0 });
  });

  it('flags prohibited payment language and brand impersonation', () => {
    const result = evaluateRiskSignals(
      {
        title: 'Infosys hiring now',
        description: 'Pay registration fee of 500 to confirm your seat.',
      },
      config,
    );
    expect(result.flags).toEqual(
      expect.arrayContaining(['payment_request_language', 'brand_impersonation']),
    );
    expect(result.score).toBe(65);
  });

  it('flags disposable email, shortened links and IP hosts', () => {
    const result = evaluateRiskSignals(
      {
        title: 'Data entry',
        description: 'Apply at http://192.168.1.10/apply',
        ownerEmail: 'boss@mailinator.com',
      },
      config,
    );
    expect(result.flags).toEqual(
      expect.arrayContaining(['disposable_email', 'suspicious_external_link']),
    );
  });

  it('flags unrealistic fresher salaries, velocity, duplicates and DM-only patterns', () => {
    const result = evaluateRiskSignals(
      {
        title: 'Fresher role',
        description: 'No experience needed. WhatsApp only.',
        salaryText: '12 lakh per month',
        recentPostCount: 9,
        siblingDuplicateCount: 2,
      },
      config,
    );
    expect(result.flags).toEqual(
      expect.arrayContaining([
        'unrealistic_compensation',
        'high_posting_velocity',
        'copied_description_or_duplicate',
        'unusual_recruiting_pattern',
      ]),
    );
    expect(result.score).toBe(80);
  });

  it('caps the score at 100 and de-duplicates flags', () => {
    const result = evaluateRiskSignals(
      {
        title: 'Infosys fresher',
        description:
          'Pay registration fee. No experience. Pay to apply. https://bit.ly/x',
        salaryText: '10 lakh',
        ownerEmail: 'a@yopmail.com',
        recentPostCount: 20,
        siblingDuplicateCount: 3,
      },
      config,
    );
    expect(result.score).toBe(100);
    expect(new Set(result.flags).size).toBe(result.flags.length);
  });
});

describe('priorityFromScore', () => {
  it.each([
    [0, 'low'],
    [19, 'low'],
    [20, 'normal'],
    [40, 'high'],
    [70, 'urgent'],
    [100, 'urgent'],
  ] as const)('%d → %s', (score, priority) => {
    expect(priorityFromScore(score)).toBe(priority);
  });
});
