import { DocumentParser, ParseInput, ParseResult } from './parser.types';

export class CsvParser implements DocumentParser {
  readonly id = 'csv-row-parser';

  supports(input: ParseInput): boolean {
    const name = input.filename.toLowerCase();
    return (
      input.sourceType === 'csv' ||
      name.endsWith('.csv') ||
      input.mimeType === 'text/csv' ||
      (!!input.text && /title.*,.*location/i.test(input.text.split('\n')[0] ?? ''))
    );
  }

  async parse(input: ParseInput): Promise<ParseResult> {
    const raw = (input.text ?? input.buffer?.toString('utf8') ?? '').replace(/^\uFEFF/, '');
    const lines = raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      return {
        provider: this.id,
        sourceType: 'csv',
        drafts: [],
        warnings: ['CSV needs a header row and at least one data row.'],
      };
    }

    const headers = this.splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
    const drafts = lines.slice(1).map((line, index) => {
      const cols = this.splitCsvLine(line);
      const row: Record<string, string> = {};
      headers.forEach((header, i) => {
        row[header] = (cols[i] ?? '').trim();
      });

      const title = row['title'] || row['job title'] || row['role'] || `CSV row ${index + 1}`;
      const description =
        row['description'] || row['duties'] || row['about'] || 'Not provided';
      const phone = row['phone'] || row['contactphone'] || row['contact_phone'];
      const email = row['email'] || row['contactemail'] || row['contact_email'];
      const website =
        row['website'] ||
        row['applyurl'] ||
        row['apply_url'] ||
        row['contactwebsite'] ||
        row['contact_website'];

      const missingRequired = !row['title'] || !description || description === 'Not provided';
      return {
        title: title.slice(0, 120),
        employerName: row['employer'] || row['employername'] || row['company'] || 'Employer',
        locationCity: row['location'] || row['city'] || row['locationcity'] || 'Palani',
        jobType: this.normalizeJobType(row['jobtype'] || row['job_type'] || row['type']),
        salaryText: row['salary'] || row['pay'] || row['salarytext'],
        vacancies: this.parseVacancies(
          row['vacancies'] || row['vacancy'] || row['posts'] || row['openings'],
        ),
        description,
        contentLanguage: row['language'] || row['contentlanguage'] || 'en',
        contactPhone: phone,
        contactEmail: email,
        contactWebsite: website,
        confidence: missingRequired ? 0.4 : 0.85,
        sourceLocator: `${input.filename}#row-${index + 2}`,
        notes: missingRequired
          ? ['Missing title/description — marked for review.']
          : ['CSV row mapped to canonical fields.'],
      };
    });

    return {
      provider: this.id,
      sourceType: 'csv',
      drafts,
      warnings: drafts.length > 5000 ? ['Batch exceeds soft preview size; approve in chunks.'] : [],
    };
  }

  private splitCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }
      if (ch === ',' && !inQuotes) {
        result.push(current);
        current = '';
        continue;
      }
      current += ch;
    }
    result.push(current);
    return result;
  }

  private parseVacancies(value?: string): number | undefined {
    if (!value?.trim()) return undefined;
    const n = Number(value.replace(/[^\d]/g, ''));
    if (!Number.isFinite(n)) return undefined;
    const floor = Math.floor(n);
    return floor >= 1 && floor <= 100000 ? floor : undefined;
  }

  private normalizeJobType(value?: string): string {
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
}
