import { DocumentParser, ParseInput, ParseResult } from './parser.types';

export class TextParser implements DocumentParser {
  readonly id = 'text-line-parser';

  supports(input: ParseInput): boolean {
    return (
      !!input.text?.trim() &&
      ['text', 'whatsapp', 'telegram', 'unknown'].includes(input.sourceType)
    );
  }

  async parse(input: ParseInput): Promise<ParseResult> {
    const raw = input.text?.trim() ?? '';
    const blocks = raw
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .filter(Boolean);

    const drafts = (blocks.length ? blocks : [raw]).map((block, index) => {
      const lines = block
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      const joined = lines.join(' ');
      const phone = joined.match(/(?:\+91[-\s]?)?[6-9]\d{9}/)?.[0];
      const email = joined.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
      const websiteRaw =
        joined.match(/https?:\/\/[^\s<>"']+/i)?.[0] ??
        joined.match(/(?:www\.)[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(?:\/[^\s<>"']*)?/i)?.[0];
      const website = websiteRaw
        ? /^https?:\/\//i.test(websiteRaw)
          ? websiteRaw.replace(/[.,);]+$/, '')
          : `https://${websiteRaw.replace(/[.,);]+$/, '')}`
        : undefined;
      const title =
        lines.find((line) => /hiring|wanted|job|வேலை|வேண்டும்/i.test(line)) ??
        lines[0] ??
        `Pasted role ${index + 1}`;
      const salary = joined.match(
        /₹?\s?\d[\d,]*(?:\s?[-–to]+\s?₹?\s?\d[\d,]*)?(?:\s?(?:per\s)?(?:month|day|daily))?/i,
      )?.[0];
      const city = ['Palani', 'Madurai', 'Coimbatore', 'Dindigul', 'Chennai'].find((c) =>
        new RegExp(c, 'i').test(joined),
      );

      return {
        title: title.slice(0, 120),
        employerName: 'From pasted message',
        locationCity: city,
        jobType: /part[- ]?time/i.test(joined)
          ? 'part-time'
          : /intern/i.test(joined)
            ? 'internship'
            : /daily/i.test(joined)
              ? 'daily-wage'
              : 'full-time',
        salaryText: salary,
        description: block,
        contentLanguage: /[\u0B80-\u0BFF]/.test(block) ? 'ta' : 'en',
        contactPhone: phone,
        contactEmail: email,
        contactWebsite: website,
        confidence: phone || salary || city ? 0.72 : 0.55,
        sourceLocator: `${input.filename}#block-${index + 1}`,
        notes: ['Parsed from pasted/plain text. Employer must confirm before publish.'],
      };
    });

    return {
      provider: this.id,
      sourceType: input.sourceType,
      drafts,
      warnings: drafts.length > 50 ? ['Large paste truncated mentally; review carefully.'] : [],
    };
  }
}
