import type { AiService } from '../ai/ai.service';
import { PortfolioAiService } from './portfolio-ai.service';

describe('PortfolioAiService', () => {
  it('returns deterministic fallback when AI is disabled', async () => {
    const mockAi = {
      isEnabled: () => false,
      enrichJob: jest.fn(),
    } as unknown as AiService;

    const service = new PortfolioAiService(mockAi);
    const res = await service.generateCopy({
      role: 'Full Stack Developer',
      skills: ['TypeScript', 'NestJS', 'Angular'],
      tone: 'minimal',
    });

    expect(res.aiGenerated).toBe(false);
    expect(res.headline).toBe('Full Stack Developer');
    expect(res.suggestedSkills).toEqual(['TypeScript', 'NestJS', 'Angular']);
    expect(res.bio).toContain('Focused on clarity and craft');
  });

  it('delegates to AiService when enabled', async () => {
    const mockAi = {
      isEnabled: () => true,
      enrichJob: jest.fn().mockResolvedValue({
        title: 'Senior Product Engineer',
        description: 'Building scalable cloud-native products with TypeScript and Angular.',
        cleaned: true,
      }),
    } as unknown as AiService;

    const service = new PortfolioAiService(mockAi);
    const res = await service.generateCopy({
      role: 'Product Engineer',
      skills: ['TypeScript', 'Angular'],
    });

    expect(res.aiGenerated).toBe(true);
    expect(res.headline).toBe('Senior Product Engineer');
    expect(res.bio).toContain('scalable cloud-native products');
  });
});
