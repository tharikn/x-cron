import { DocumentParser, ParseInput, ParseResult } from './parser.types';
import { mapOcrTextToJobDraft } from './ocr/job-ad.mapper';
import { recognizeImage } from './ocr/tesseract.engine';

/**
 * Image/PDF OCR parser.
 * Default provider: free local Tesseract (`OCR_PROVIDER=tesseract`).
 * Set `OCR_PROVIDER=stub` to force the deterministic review stub.
 */
export class ImageOcrParser implements DocumentParser {
  readonly id = (process.env.OCR_PROVIDER || 'tesseract').trim() || 'tesseract';

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
    const sourceType = input.sourceType === 'pdf' ? 'pdf' : 'image';
    const provider = this.id;

    if (provider === 'stub') {
      return this.stubResult(input, sourceType);
    }

    if (sourceType === 'pdf' || input.mimeType === 'application/pdf') {
      return {
        provider,
        sourceType: 'pdf',
        drafts: [
          {
            ...mapOcrTextToJobDraft('', input.filename, 0.2),
            title:
              input.filename.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim() ||
              'Scanned PDF notice',
            description:
              'Free local OCR supports images (PNG/JPEG/WebP). Export the PDF page as an image and re-upload for extraction.',
            confidence: 0.2,
            notes: [
              'PDF page rendering is not enabled in the free OCR path.',
              'Upload PNG/JPEG/WebP for Tesseract extraction.',
            ],
          },
        ],
        warnings: [
          'PDF OCR requires an image export in this build. Re-upload as PNG/JPEG/WebP.',
        ],
        pagesProcessed: 0,
      };
    }

    if (!input.buffer?.length) {
      return {
        provider,
        sourceType,
        drafts: [],
        warnings: ['Image upload had no bytes — OCR skipped.'],
        pagesProcessed: 0,
      };
    }

    try {
      const ocr = await recognizeImage(input.buffer);
      const draft = mapOcrTextToJobDraft(ocr.text, input.filename, ocr.meanConfidence);
      const warnings: string[] = [];
      if (!ocr.text.trim()) {
        warnings.push('OCR returned empty text — check image quality and contrast.');
      }
      if (draft.confidence < 0.5) {
        warnings.push('Low OCR confidence — record routed to needs-review.');
      }

      return {
        provider,
        sourceType,
        drafts: [draft],
        warnings,
        pagesProcessed: ocr.pages,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'ocr_failed';
      return {
        provider,
        sourceType,
        drafts: [
          {
            ...mapOcrTextToJobDraft('', input.filename, 0.2),
            description:
              'OCR failed — confirm title, location, pay and duties from the original image. No facts were invented.',
            confidence: 0.2,
            notes: [`OCR error: ${message}`, 'Record kept for manual review.'],
          },
        ],
        warnings: [`Local OCR failed: ${message}`],
        pagesProcessed: 0,
      };
    }
  }

  private stubResult(
    input: ParseInput,
    sourceType: 'image' | 'pdf',
  ): ParseResult {
    const baseName = input.filename.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
    return {
      provider: 'ocr-stub',
      sourceType,
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
            'Set OCR_PROVIDER=tesseract (default) for free local extraction.',
          ],
        },
      ],
      warnings: [
        'OCR provider is stub. Upload preserved for audit; employer review required.',
      ],
      pagesProcessed: 0,
    };
  }
}
