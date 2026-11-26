import { BadRequestException } from '@nestjs/common';
import { UploadPurpose } from './storage.types';

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_DOCUMENT_BYTES = 5 * 1024 * 1024;

export type ValidatedKind = 'image' | 'document';

export interface ValidatedUpload {
  kind: ValidatedKind;
  /** Normalised MIME type, taken from the verified bytes rather thanTrusting the client. */
  mimeType: string;
  extension: string;
}

const IMAGE_RULES: Record<
  string,
  { mime: string; magic?: (buf: Buffer) => boolean }
> = {
  png: {
    mime: 'image/png',
    magic: (buf) =>
      buf.length >= 8 &&
      buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  },
  jpg: {
    mime: 'image/jpeg',
    magic: (buf) =>
      buf.length >= 3 &&
      buf[0] === 0xff &&
      buf[1] === 0xd8 &&
      buf[2] === 0xff,
  },
  jpeg: {
    mime: 'image/jpeg',
    magic: (buf) =>
      buf.length >= 3 &&
      buf[0] === 0xff &&
      buf[1] === 0xd8 &&
      buf[2] === 0xff,
  },
  svg: {
    mime: 'image/svg+xml',
    magic: isSafeSvg,
  },
};

const DOCUMENT_RULES: Record<
  string,
  { mime: string; magic: (buf: Buffer) => boolean }
> = {
  pdf: {
    mime: 'application/pdf',
    magic: (buf) => buf.length >= 5 && buf.subarray(0, 5).toString('latin1') === '%PDF-',
  },
  doc: {
    mime: 'application/msword',
    magic: (buf) =>
      buf.length >= 8 &&
      buf
        .subarray(0, 8)
        .equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])),
  },
  docx: {
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    magic: (buf) =>
      buf.length >= 4 &&
      buf.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04])) &&
      buf.includes(Buffer.from('word/document.xml')) &&
      !buf.includes(Buffer.from('vbaProject.bin')),
  },
};

/**
 * SVG is allowed by product request, but it must be inert markup only. Active
 * constructs are rejected outright instead of being "sanitised" — the file is
 * later served through the API proxy with a sandbox CSP and nosniff headers.
 */
function isSafeSvg(buf: Buffer): boolean {
  const text = buf.toString('utf8');
  if (text.includes('\u0000')) return false;
  if (!/<svg[\s>/]/i.test(text)) return false;

  const forbidden = [
    /<script[\s>]/i,
    /<\?xml-stylesheet/i,
    /<foreignObject[\s>]/i,
    /<iframe[\s>]/i,
    /<object[\s>]/i,
    /<embed[\s>]/i,
    /<link[\s>]/i,
    /\son[a-z]+\s*=/i,
    /javascript\s*:/i,
    /<use\b[^>]*\b(?:href|xlink:href)\s*=\s*["'](?:https?:)?\/\//i,
  ];
  return !forbidden.some((pattern) => pattern.test(text));
}

function extensionOf(originalName: string): string {
  const name = (originalName || '').trim().toLowerCase();
  const dot = name.lastIndexOf('.');
  return dot === -1 ? '' : name.slice(dot + 1, 16);
}

function declaredMimeMatches(mime: string | undefined, expected: string): boolean {
  if (!mime) return true; // Some clients omit Content-Type; bytes decide.
  const normalised = mime.trim().toLowerCase().split(';')[0];
  return (
    normalised === expected ||
    (expected === 'image/jpeg' && normalised === 'image/jpg') ||
    normalised === 'application/octet-stream'
  );
}

/**
 * Validate an upload before it touches object storage. Files are already
 * buffered by Multer with a hard size limit; this is the authoritative check.
 */
export function validateUpload(
  file: Express.Multer.File | undefined,
  purpose: UploadPurpose,
): ValidatedUpload {
  if (!file || !file.buffer || file.buffer.length === 0) {
    throw new BadRequestException('file is required');
  }

  const isImage = purpose !== 'resume';
  const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_DOCUMENT_BYTES;
  if (file.size > maxBytes || file.buffer.length > maxBytes) {
    throw new BadRequestException(
      isImage ? 'image must be 5 MB or smaller' : 'document must be 5 MB or smaller',
    );
  }

  const ext = extensionOf(file.originalname || '');
  if (isImage) {
    const rule = IMAGE_RULES[ext];
    if (!rule) {
      throw new BadRequestException(
        'unsupported image type; only svg, png, jpg and jpeg are allowed',
      );
    }
    if (!declaredMimeMatches(file.mimetype, rule.mime)) {
      throw new BadRequestException('image content type does not match the file');
    }
    if (rule.magic && !rule.magic(file.buffer)) {
      throw new BadRequestException('image content does not match its extension');
    }
    return { kind: 'image', mimeType: rule.mime, extension: ext === 'jpeg' ? 'jpg' : ext };
  }

  const rule = DOCUMENT_RULES[ext];
  if (!rule) {
    throw new BadRequestException('unsupported resume type; only pdf, doc and docx are allowed');
  }
  if (!declaredMimeMatches(file.mimetype, rule.mime)) {
    throw new BadRequestException('document content type does not match the file');
  }
  if (!rule.magic(file.buffer)) {
    throw new BadRequestException('document content does not match its extension');
  }
  return { kind: 'document', mimeType: rule.mime, extension: ext };
}
