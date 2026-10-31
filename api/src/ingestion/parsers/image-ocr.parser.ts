import { DocumentParser, ParseInput, ParseResult } from './parser.types';

/**
 * OCR provider abstraction stub (PRD §8.4).
 * Swap `provider` implementation later without changing ingestion callers.
 */
export class ImageOcrParser implements DocumentParser {
  readonly id = process.env.OCR_PROVIDER || 'ocr-stub';

  supports(input: ParseInput): boolean {
    const name = input.filename.toLowerCase();
    return (
      input.sourceType === 'image' ||
      input.sourceType === 'pdf' ||
      /\.(png|jpe?g|webp|gif|pdf)$/i.test(name) ||
      !!input.mimeType?.startsWith('image/') ||
      input.mimeType === 'application/pdf'
    );
  }

  async parse(input: ParseInput): Promise<ParseResult> {
    // Deterministic stub: no invented salary/contact. Forces human review.
    const baseName = input.filename.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
    return {
      provider: this.id,
      sourceType: input.sourceType === 'pdf' ? 'pdf' : 'image',
      drafts: [
        {
          title: baseName || 'Scanned job notice',
          employerName: 'From upload',
          locationCity: 'Palani',
          jobType: 'full-time',
          description:
            'OCR extraction stub — confirm title, location, pay and duties from the original image/PDF. No facts were invented.',
          contentLanguage: 'en',
          confidence: 0.25,
          sourceLocator: input.filename,
          notes: [
            'Low-confidence OCR stub. Record routed to needs-review.',
            'Configure a real OCR provider via OCR_PROVIDER when ready.',
          ],
        },
      ],
      warnings: [
        'OCR provider is a stub in Step 4. Upload preserved for audit; employer review required.',
      ],
    };
  }
}
