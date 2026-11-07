import { BadRequestException } from '@nestjs/common';

/** Max import / OCR upload size (admin ingestion). */
export const UPLOAD_MAX_BYTES = 8 * 1024 * 1024;

const ALLOWED: Array<{
  kind: string;
  mime: RegExp;
  ext: RegExp;
  magic: (buf: Buffer) => boolean;
}> = [
  {
    kind: 'csv',
    mime: /^(text\/csv|application\/csv)$/i,
    ext: /\.csv$/i,
    magic: (buf) => buf.length > 0 && !looksLikeHtmlOrSvg(buf) && !hasNullByte(buf),
  },
  {
    kind: 'xlsx',
    mime: /^application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet$/i,
    ext: /\.xlsx$/i,
    magic: (buf) =>
      buf.length >= 4 &&
      buf[0] === 0x50 &&
      buf[1] === 0x4b &&
      (buf[2] === 0x03 || buf[2] === 0x05 || buf[2] === 0x07),
  },
  {
    kind: 'xls',
    mime: /^application\/vnd\.ms-excel$/i,
    ext: /\.xls$/i,
    magic: (buf) =>
      buf.length >= 8 &&
      buf[0] === 0xd0 &&
      buf[1] === 0xcf &&
      buf[2] === 0x11 &&
      buf[3] === 0xe0,
  },
  {
    kind: 'text',
    mime: /^text\/plain$/i,
    ext: /\.txt$/i,
    magic: (buf) => buf.length > 0 && !looksLikeHtmlOrSvg(buf) && !hasNullByte(buf),
  },
  {
    kind: 'pdf',
    mime: /^application\/pdf$/i,
    ext: /\.pdf$/i,
    magic: (buf) => buf.length >= 5 && buf.subarray(0, 5).toString('ascii') === '%PDF-',
  },
  {
    kind: 'png',
    mime: /^image\/png$/i,
    ext: /\.png$/i,
    magic: (buf) =>
      buf.length >= 8 &&
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4e &&
      buf[3] === 0x47,
  },
  {
    kind: 'jpeg',
    mime: /^image\/jpe?g$/i,
    ext: /\.jpe?g$/i,
    magic: (buf) => buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff,
  },
  {
    kind: 'webp',
    mime: /^image\/webp$/i,
    ext: /\.webp$/i,
    magic: (buf) =>
      buf.length >= 12 &&
      buf.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buf.subarray(8, 12).toString('ascii') === 'WEBP',
  },
];

function hasNullByte(buf: Buffer): boolean {
  return buf.includes(0);
}

function looksLikeHtmlOrSvg(buf: Buffer): boolean {
  const head = buf.subarray(0, Math.min(buf.length, 256)).toString('utf8').toLowerCase();
  return (
    head.includes('<svg') ||
    head.includes('<html') ||
    head.includes('<!doctype html') ||
    head.includes('<script')
  );
}

/**
 * Allow-list formats, size, and magic-byte / active-content checks for admin
 * import uploads. Rejects SVG/HTML and user-controlled paths (caller stores
 * random batch keys — never use originalname as a public path).
 */
export function assertSafeUpload(file: {
  buffer?: Buffer;
  size?: number;
  mimetype?: string;
  originalname?: string;
}): void {
  if (!file?.buffer?.length) {
    throw new BadRequestException('file is required');
  }
  const size = file.size ?? file.buffer.length;
  if (size > UPLOAD_MAX_BYTES) {
    throw new BadRequestException(
      `File too large (max ${Math.floor(UPLOAD_MAX_BYTES / (1024 * 1024))}MB)`,
    );
  }

  const name = file.originalname || 'upload.bin';
  const mime = file.mimetype || '';
  const match = ALLOWED.find(
    (rule) =>
      (rule.mime.test(mime) || rule.ext.test(name)) && rule.magic(file.buffer!),
  );
  if (!match) {
    throw new BadRequestException(
      'Unsupported or unsafe file. Allowed: CSV, XLSX, XLS, TXT, PDF, PNG, JPEG, WEBP.',
    );
  }
}
