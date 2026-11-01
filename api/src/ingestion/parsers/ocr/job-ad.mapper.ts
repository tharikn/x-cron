import { ExtractedJobDraft } from '../parser.types';

const CITY_HINTS = [
  'Gandhidham',
  'Ahmedabad',
  'Surat',
  'Rajkot',
  'Vadodara',
  'Palani',
  'Madurai',
  'Coimbatore',
  'Dindigul',
  'Chennai',
  'Bengaluru',
  'Bangalore',
  'Hyderabad',
  'Mumbai',
  'Pune',
  'Delhi',
  'Noida',
  'Gurugram',
  'Gurgaon',
  'Kolkata',
  'Jaipur',
  'Indore',
  'Nagpur',
  'Kochi',
  'Trichy',
  'Tiruchirappalli',
  'Salem',
  'Erode',
  'Tiruppur',
];

const NOISE_LINE =
  /^(wanted|hiring|vacancy|vacancies|company\s*name|urgent|walk[- ]?in|bhaskarad\.com|www\.|http)/i;

const ROLE_HINT =
  /\b(assistant|executive|manager|clerk|accountant|developer|engineer|designer|operator|driver|nurse|teacher|receptionist|sales|marketing|hr|admin|trainee|intern|staff|helper|technician|consultant|officer|supervisor|cook|waiter|security|cashier)\b/i;

const EMPLOYER_HINT =
  /\b(pvt\.?\s*ltd\.?|private\s+limited|ltd\.?|llp|inc\.?|corporation|company|firm|hospital|school|college|hotel|restaurant)\b/i;

function normalizeLines(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .filter((line) => line.length > 1);
}

function isContactLine(line: string): boolean {
  const compact = line.replace(/\s/g, '');
  return (
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(line) ||
    /(?:\+91[-\s]?)?[6-9]\d{9}/.test(compact) ||
    /^9x{3,}0$/i.test(compact) ||
    /x{3,}/i.test(compact) ||
    /^\d[\d\s-]{8,}\d$/.test(line.trim())
  );
}

function tidyEmployerName(name: string): string {
  return name
    .replace(/PVT\.?\s*LTD\.?/gi, 'PVT LTD')
    .replace(/PVTLTD/gi, 'PVT LTD')
    .replace(/([A-Za-z])(PVT LTD)/gi, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Fix common OCR swaps in phone-like tokens (O→0, I/l→1); never invent masked digits. */
function extractPhone(joined: string): string | undefined {
  if (/[6-9][xX*]{3,}\d?/.test(joined.replace(/\s/g, ''))) {
    return undefined;
  }

  const ocrFixed = joined
    .replace(/(?<=[\d\s+\-]|^)[Oo](?=[\d\s\-]|[Oo]|$)/g, '0')
    .replace(/(?<=[\d\s+\-]|^)[Il|](?=[\d\s\-]|[Il|]|$)/g, '1');

  const candidates = [
    ...ocrFixed.matchAll(/(?:\+91[-\s]?)?[6-9](?:[\s\-.]?\d){9}/g),
  ].map((m) => m[0]);

  for (const candidate of candidates) {
    const digits = candidate.replace(/\D/g, '');
    if (digits.length === 10 && /^[6-9]/.test(digits)) return digits;
    if (digits.length === 12 && digits.startsWith('91') && /^[6-9]/.test(digits.slice(2))) {
      return digits.slice(2);
    }
  }
  return undefined;
}

function extractEmail(joined: string): string | undefined {
  return joined.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
}

function extractWebsite(joined: string): string | undefined {
  const full = joined.match(/https?:\/\/[^\s<>"']+/i)?.[0];
  if (full) {
    return full.replace(/[.,);]+$/, '');
  }
  const bare = joined.match(
    /(?:www\.)[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(?:\/[^\s<>"']*)?/i,
  )?.[0];
  if (!bare) return undefined;
  const cleaned = bare.replace(/[.,);]+$/, '');
  return `https://${cleaned}`;
}

function extractSalary(lines: string[], joined: string): string | undefined {
  const salaryLine = lines.find((line) => /salary|ctc|pay|stipend|₹|rs\.?/i.test(line));
  const fromLine = salaryLine?.match(
    /(?:salary|ctc|pay|stipend)?[:\s]*((?:₹|rs\.?\s*)?\d[\d,]*(?:\s*\/?-?\s*)?(?:\s*(?:to|-|–)\s*(?:₹|rs\.?\s*)?\d[\d,]*)?)/i,
  )?.[1];
  if (fromLine?.trim()) {
    const cleaned = fromLine.trim().replace(/\s+/g, ' ');
    if (/\d/.test(cleaned)) return cleaned.slice(0, 80);
  }

  const fallback = joined.match(
    /(?:₹|rs\.?\s*)\s?\d[\d,]*(?:\s*(?:to|-|–)\s*(?:₹|rs\.?\s*)?\d[\d,]*)?/i,
  )?.[0];
  return fallback?.trim();
}

function extractVacancies(lines: string[], joined: string): number | undefined {
  const vacancyLine = lines.find((line) =>
    /\b(?:vacancies?|posts?|openings?|no\.?\s*of\s*posts?|number\s*of\s*posts?)\b/i.test(
      line,
    ),
  );
  const fromLine = vacancyLine?.match(
    /(?:vacancies?|posts?|openings?|no\.?\s*of\s*posts?|number\s*of\s*posts?)[:\s\-–]*(\d{1,5})/i,
  )?.[1];
  if (fromLine) {
    const n = Number(fromLine);
    if (Number.isFinite(n) && n >= 1 && n <= 100000) return Math.floor(n);
  }

  const fallback = joined.match(
    /\b(\d{1,5})\s*(?:vacancies?|posts?|openings?)\b/i,
  )?.[1];
  if (fallback) {
    const n = Number(fallback);
    if (Number.isFinite(n) && n >= 1 && n <= 100000) return Math.floor(n);
  }
  return undefined;
}

function extractCity(joined: string, lines: string[]): string | undefined {
  const hit = CITY_HINTS.find((city) => new RegExp(`\\b${city}\\b`, 'i').test(joined));
  if (hit) return hit === 'Bangalore' ? 'Bengaluru' : hit === 'Gurgaon' ? 'Gurugram' : hit;

  const addressish = lines.find((line) =>
    /\b(road|rd\.?|street|st\.?|nagar|colony|opp\.?|near|building|bldg|floor|suit|plaza|market)\b/i.test(
      line,
    ),
  );
  if (addressish) {
    const tail = addressish.split(/[.,]/).map((p) => p.trim()).filter(Boolean);
    const last = tail[tail.length - 1];
    if (last && last.length >= 3 && last.length <= 40 && !/\d{5,}/.test(last)) {
      return last.replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }
  return undefined;
}

function extractEmployer(lines: string[]): string | undefined {
  const labelIdx = lines.findIndex((line) => /^company\s*name\b/i.test(line));
  if (labelIdx >= 0) {
    const same = lines[labelIdx].replace(/^company\s*name[:\s-]*/i, '').trim();
    if (same && same.length > 2) return tidyEmployerName(same).slice(0, 120);
    const next = lines[labelIdx + 1];
    if (next && !isContactLine(next) && !NOISE_LINE.test(next)) {
      return tidyEmployerName(next).slice(0, 120);
    }
  }

  const firm = lines.find(
    (line) =>
      (EMPLOYER_HINT.test(line) || /pvtltd/i.test(line)) &&
      !/wanted|salary|training/i.test(line),
  );
  return firm ? tidyEmployerName(firm).slice(0, 120) : undefined;
}

function extractTitle(lines: string[], filename: string): string {
  const roleLine = lines.find(
    (line) =>
      ROLE_HINT.test(line) &&
      !/salary|training period|basic computer|edu\.|qualification/i.test(line) &&
      !EMPLOYER_HINT.test(line),
  );
  if (roleLine) {
    return roleLine
      .replace(/\b0?2\b/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 120);
  }

  const afterWanted = lines.find(
    (line, idx) =>
      idx > 0 &&
      /wanted|hiring/i.test(lines[idx - 1]) &&
      !NOISE_LINE.test(line) &&
      !/salary/i.test(line),
  );
  if (afterWanted) return afterWanted.slice(0, 120);

  const baseName = filename.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();
  return (baseName || 'Scanned job notice').slice(0, 120);
}

function extractJobType(joined: string): string {
  if (/part[- ]?time/i.test(joined)) return 'part-time';
  if (/\bintern(?:ship)?\b|\btrainee\b/i.test(joined)) return 'internship';
  if (/daily\s*wage|per\s*day/i.test(joined)) return 'daily-wage';
  if (/contract/i.test(joined)) return 'contract';
  return 'full-time';
}

function buildDescription(lines: string[]): string {
  const body = lines
    .filter((line) => !isContactLine(line))
    .filter((line) => !/^bhaskarad\.com$/i.test(line))
    .map((line) => line.replace(/^[-*•·]\s*/, '').trim())
    .filter(Boolean)
    .map((line) => `• ${line}`)
    .join('\n')
    .trim();
  return (
    body ||
    '• OCR extracted little readable text — confirm title, location, pay and duties from the original image.'
  );
}

function scoreConfidence(input: {
  title: string;
  employerName?: string;
  locationCity?: string;
  salaryText?: string;
  vacancies?: number;
  phone?: string;
  email?: string;
  ocrMean?: number;
  lineCount: number;
}): number {
  let score = 0.35;
  if (ROLE_HINT.test(input.title)) score += 0.18;
  if (input.employerName) score += 0.12;
  if (input.locationCity) score += 0.1;
  if (input.salaryText) score += 0.12;
  if (input.vacancies) score += 0.04;
  if (input.phone || input.email) score += 0.08;
  if (input.lineCount >= 5) score += 0.05;
  if (typeof input.ocrMean === 'number') {
    score = score * 0.7 + Math.min(0.95, Math.max(0.2, input.ocrMean)) * 0.3;
  }
  return Math.round(Math.min(0.92, Math.max(0.2, score)) * 100) / 100;
}

/**
 * Map free OCR text into a single job draft. Contacts are extracted for server-side
 * review/unlock paths; they are omitted from the public description body when possible.
 */
export function mapOcrTextToJobDraft(
  rawText: string,
  filename: string,
  ocrMeanConfidence?: number,
): ExtractedJobDraft {
  const lines = normalizeLines(rawText);
  const joined = lines.join(' ');
  const phone = extractPhone(joined);
  const email = extractEmail(joined);
  const website = extractWebsite(joined);
  const salaryText = extractSalary(lines, joined);
  const vacancies = extractVacancies(lines, joined);
  const employerName = extractEmployer(lines);
  const locationCity = extractCity(joined, lines);
  const title = extractTitle(lines, filename);
  const description = buildDescription(lines);
  const contentLanguage = /[\u0B80-\u0BFF]/.test(rawText) ? 'ta' : 'en';
  const confidence = scoreConfidence({
    title,
    employerName,
    locationCity,
    salaryText,
    vacancies,
    phone,
    email,
    ocrMean: ocrMeanConfidence,
    lineCount: lines.length,
  });

  const notes = [
    'Parsed with free local Tesseract OCR — confirm fields before publish.',
  ];
  if (!lines.length) notes.push('No OCR text detected; upload a clearer photo if needed.');
  if (confidence < 0.5) notes.push('Low confidence — human review required.');
  if (!phone && /[6-9][xX*]{3,}|x{4,}/i.test(joined.replace(/\s/g, ''))) {
    notes.push('Phone looks redacted/masked on the image — enter it manually before publish.');
  }
  if (!phone && !email && !website) {
    notes.push(
      'No phone/email/website extracted — unlock will stay empty until contacts are added.',
    );
  }

  return {
    title,
    employerName: employerName || 'From upload',
    locationCity,
    jobType: extractJobType(joined),
    salaryText,
    vacancies,
    description,
    contentLanguage,
    contactPhone: phone,
    contactEmail: email,
    contactWebsite: website,
    confidence,
    sourceLocator: filename,
    notes,
  };
}
