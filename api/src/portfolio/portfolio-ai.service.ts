import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../ai/ai.service';

export interface PortfolioAiGenerateInput {
  role: string;
  experience?: string;
  skills?: string[];
  tone?: 'professional' | 'creative' | 'minimal';
  locale?: string;
}

export interface PortfolioAiGenerateResult {
  headline: string;
  subheadline: string;
  bio: string;
  suggestedSkills: string[];
  aiGenerated: boolean;
}

/**
 * Reuses existing AI configuration & provider strategy (`AiService`) to
 * assist users in drafting portfolio copy (headlines, bios, skill tags).
 */
@Injectable()
export class PortfolioAiService {
  private readonly logger = new Logger(PortfolioAiService.name);

  constructor(private readonly ai: AiService) {}

  async generateCopy(
    input: PortfolioAiGenerateInput,
  ): Promise<PortfolioAiGenerateResult> {
    const role = input.role.trim() || 'Software Engineer';
    const skills = (input.skills ?? []).filter((s) => s.trim().length > 0);
    const tone = input.tone ?? 'professional';

    // Reuse AiService enabled/provider check; fallback cleanly to deterministic template
    if (!this.ai.isEnabled()) {
      return this.fallbackGenerate(role, skills, tone);
    }

    try {
      const prompt = [
        `Role: ${role}`,
        input.experience ? `Experience: ${input.experience}` : '',
        skills.length ? `Skills: ${skills.join(', ')}` : '',
        `Tone: ${tone}`,
      ]
        .filter(Boolean)
        .join('\n');

      const enriched = await this.ai.enrichJob({
        title: role,
        description: prompt,
        rawText: prompt,
        contentLanguage: input.locale ?? 'en-IN',
      });

      const bio =
        enriched.description && enriched.description.length > 20
          ? enriched.description
          : this.fallbackGenerate(role, skills, tone).bio;

      return {
        headline: enriched.title || `${role} crafting impactful products`,
        subheadline:
          skills.length > 0
            ? `Specialized in ${skills.slice(0, 4).join(' · ')}`
            : `Focused on quality, architecture, and user experience`,
        bio,
        suggestedSkills:
          skills.length > 0
            ? skills
            : ['TypeScript', 'Problem Solving', 'System Design', 'Collaboration'],
        aiGenerated: true,
      };
    } catch (err) {
      this.logger.warn(`Portfolio AI fallback used: ${(err as Error).message}`);
      return this.fallbackGenerate(role, skills, tone);
    }
  }

  private fallbackGenerate(
    role: string,
    skills: string[],
    tone: string,
  ): PortfolioAiGenerateResult {
    const skillStr =
      skills.length > 0 ? skills.slice(0, 4).join(', ') : 'modern technologies';
    const tonePrefix =
      tone === 'creative'
        ? `Designing and building memorable experiences as a ${role}.`
        : tone === 'minimal'
          ? `${role}. Focused on clarity and craft.`
          : `Results-driven ${role} with expertise in ${skillStr}.`;

    return {
      headline: `${role}`,
      subheadline: `Building reliable solutions with ${skillStr}`,
      bio: `${tonePrefix} Passionate about delivering clean, maintainable work that solves real-world problems.`,
      suggestedSkills:
        skills.length > 0
          ? skills
          : ['JavaScript', 'TypeScript', 'Architecture', 'Agile Delivery'],
      aiGenerated: false,
    };
  }
}
