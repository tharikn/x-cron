import {
  JobEnrichInput,
  JobEnrichResult,
  JobSplitInput,
  JobSplitResult,
  AiEnrichProvider,
} from '../ai.types';
import { splitJobPostBlocks } from '../utils/split-job-blocks';

/** Pass-through when AI enrich is off or provider is stub. */
export class StubEnrichProvider implements AiEnrichProvider {
  readonly id = 'stub';

  async enrichJob(input: JobEnrichInput): Promise<JobEnrichResult> {
    const description =
      (input.description || input.rawText || '').trim() || 'Not provided';
    return {
      title: input.title,
      employerName: input.employerName,
      locationCity: input.locationCity,
      jobType: input.jobType,
      salaryText: input.salaryText,
      vacancies: input.vacancies,
      contactWebsite: input.contactWebsite,
      description,
      contentLanguage: input.contentLanguage,
      cleaned: false,
      provider: this.id,
      notes: ['AI enrich disabled or stub provider — original text kept.'],
    };
  }

  async splitJobs(input: JobSplitInput): Promise<JobSplitResult> {
    const blocks = splitJobPostBlocks(input.rawText || '');
    const jobs = blocks.map((block, index) => {
      const lines = block
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      const title = (lines[0] || `Job ${index + 1}`).slice(0, 120);
      return {
        title,
        description: block,
        contentLanguage: /[\u0B80-\u0BFF]/.test(block) ? 'ta' : 'en',
        cleaned: false,
        provider: this.id,
        notes: [
          blocks.length > 1
            ? 'Heuristic multi-job split (AI off/stub).'
            : 'AI enrich disabled or stub — single block kept.',
        ],
      } satisfies JobEnrichResult;
    });
    return {
      jobs: jobs.length ? jobs : [],
      split: jobs.length > 1,
      provider: this.id,
      notes:
        jobs.length > 1
          ? [`Heuristic split into ${jobs.length} job(s).`]
          : undefined,
    };
  }
}
