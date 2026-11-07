import type { ExtractedJobDraft } from '../ingestion/parsers/parser.types';

/** Map a loose job object (JSON feed / ATS / Zapier) into an import draft. */
export function mapLooseJob(
  raw: Record<string, unknown>,
  index: number,
  sourceLocator: string,
): ExtractedJobDraft {
  const str = (...keys: string[]) => {
    for (const key of keys) {
      const v = raw[key];
      if (typeof v === 'string' && v.trim()) return v.trim();
      if (typeof v === 'number' && Number.isFinite(v)) return String(v);
    }
    return undefined;
  };

  const title = str('title', 'jobTitle', 'name', 'role') || `Imported role ${index + 1}`;
  const description =
    str('description', 'about', 'body', 'duties', 'jobDescription') ||
    'Not provided';
  const externalJobId = str(
    'externalJobId',
    'partnerJobId',
    'referencenumber',
    'referenceNumber',
    'requisitionId',
    'id',
    'jobId',
  );

  return {
    title: title.slice(0, 120),
    employerName: str('employer', 'employerName', 'company', 'companyName'),
    locationCity: str('location', 'locationCity', 'city') || 'Palani',
    jobType: normalizeJobType(str('jobType', 'type', 'employmentType')),
    salaryText: str('salary', 'salaryText', 'pay'),
    vacancies: parseVacancies(str('vacancies', 'vacancy', 'openings', 'posts')),
    description,
    contentLanguage: str('language', 'contentLanguage') || 'en',
    contactPhone: str('phone', 'contactPhone', 'mobile'),
    contactEmail: str('email', 'contactEmail'),
    contactWhatsapp: str('whatsapp', 'contactWhatsapp', 'wa'),
    contactWebsite: str(
      'website',
      'applyUrl',
      'url',
      'contactWebsite',
      'apply_url',
    ),
    externalJobId,
    confidence: description === 'Not provided' ? 0.45 : 0.82,
    sourceLocator: `${sourceLocator}#${externalJobId || index + 1}`,
    notes: ['Mapped from integration payload.'],
  };
}

export function parseJsonFeed(
  text: string,
  sourceLocator: string,
): { drafts: ExtractedJobDraft[]; warnings: string[] } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { drafts: [], warnings: ['Invalid JSON feed.'] };
  }

  let rows: unknown[] = [];
  if (Array.isArray(parsed)) {
    rows = parsed;
  } else if (parsed && typeof parsed === 'object') {
    const obj = parsed as Record<string, unknown>;
    if (Array.isArray(obj.jobs)) rows = obj.jobs;
    else if (Array.isArray(obj.items)) rows = obj.items;
    else if (Array.isArray(obj.data)) rows = obj.data;
    else rows = [obj];
  }

  const drafts = rows
    .filter((r): r is Record<string, unknown> => !!r && typeof r === 'object')
    .map((r, i) => mapLooseJob(r, i, sourceLocator));

  return {
    drafts,
    warnings: drafts.length
      ? [`JSON feed yielded ${drafts.length} job(s).`]
      : ['JSON feed contained no jobs.'],
  };
}

/**
 * Minimal Indeed/LinkedIn-style XML job feed parser (no paid XML libs).
 * Looks for repeating <job>…</job> blocks and common child tags.
 */
export function parseXmlFeed(
  text: string,
  sourceLocator: string,
): { drafts: ExtractedJobDraft[]; warnings: string[] } {
  const blocks = [...text.matchAll(/<job\b[^>]*>([\s\S]*?)<\/job>/gi)];
  if (!blocks.length) {
    return {
      drafts: [],
      warnings: ['XML feed had no <job> elements.'],
    };
  }

  const drafts = blocks.map((match, index) => {
    const body = match[1] ?? '';
    const tag = (name: string) => {
      const m = body.match(
        new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i'),
      );
      return m?.[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
    };
    return mapLooseJob(
      {
        title: tag('title'),
        company: tag('company') || tag('employer'),
        location: tag('city') || tag('location'),
        description: tag('description') || tag('body'),
        salary: tag('salary'),
        jobType: tag('jobtype') || tag('type'),
        phone: tag('phone'),
        email: tag('email'),
        website: tag('url') || tag('applyurl') || tag('applyUrl'),
        externalJobId:
          tag('referencenumber') ||
          tag('partnerJobId') ||
          tag('id') ||
          tag('jobid'),
        vacancies: tag('vacancies'),
        language: tag('language'),
      },
      index,
      sourceLocator,
    );
  });

  return {
    drafts,
    warnings: [`XML feed yielded ${drafts.length} job(s).`],
  };
}

function normalizeJobType(value?: string): string {
  const v = (value || 'full-time').toLowerCase().replace(/\s+/g, '-');
  const allowed = [
    'full-time',
    'part-time',
    'contract',
    'temporary',
    'internship',
    'apprenticeship',
    'daily-wage',
  ];
  return allowed.includes(v) ? v : 'full-time';
}

function parseVacancies(value?: string): number | undefined {
  if (!value?.trim()) return undefined;
  const n = Number(value.replace(/[^\d]/g, ''));
  if (!Number.isFinite(n)) return undefined;
  const floor = Math.floor(n);
  return floor >= 1 && floor <= 100000 ? floor : undefined;
}
