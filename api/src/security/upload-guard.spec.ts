import { BadRequestException } from '@nestjs/common';
import { assertSafeUpload, UPLOAD_MAX_BYTES } from './upload-guard';

const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);
const PDF = Buffer.from('%PDF-1.7\n');
const XLSX_ZIP = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x00]);
const WEBP = Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WEBP')]);

describe('assertSafeUpload', () => {
  it.each([
    ['jobs.csv', 'text/csv', Buffer.from('title,location\nA,B')],
    ['paste.txt', 'text/plain', Buffer.from('Hiring drivers')],
    ['ad.png', 'image/png', PNG],
    ['ad.jpg', 'image/jpeg', JPEG],
    ['ad.webp', 'image/webp', WEBP],
    ['ad.pdf', 'application/pdf', PDF],
    [
      'batch.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      XLSX_ZIP,
    ],
  ])('accepts %s', (originalname, mimetype, buffer) => {
    expect(() => assertSafeUpload({ originalname, mimetype, buffer })).not.toThrow();
  });

  it('requires a non-empty file', () => {
    expect(() => assertSafeUpload({ buffer: Buffer.alloc(0) })).toThrow('file is required');
  });

  it('rejects files above the size cap', () => {
    expect(() =>
      assertSafeUpload({
        originalname: 'big.csv',
        mimetype: 'text/csv',
        buffer: Buffer.from('a'),
        size: UPLOAD_MAX_BYTES + 1,
      }),
    ).toThrow(/too large/);
  });

  it('rejects mismatched magic bytes (renamed binaries)', () => {
    expect(() =>
      assertSafeUpload({ originalname: 'fake.png', mimetype: 'image/png', buffer: JPEG }),
    ).toThrow(BadRequestException);
  });

  it('rejects SVG / HTML active content disguised as text', () => {
    for (const body of ['<svg onload=alert(1)>', '<!DOCTYPE html><html>', '<script>x</script>']) {
      expect(() =>
        assertSafeUpload({ originalname: 'x.csv', mimetype: 'text/csv', buffer: Buffer.from(body) }),
      ).toThrow(/Unsupported or unsafe/);
    }
  });

  it('rejects null bytes in text uploads and unknown types', () => {
    expect(() =>
      assertSafeUpload({ originalname: 'x.txt', mimetype: 'text/plain', buffer: Buffer.from([0x41, 0x00]) }),
    ).toThrow(BadRequestException);
    expect(() =>
      assertSafeUpload({ originalname: 'x.exe', mimetype: 'application/octet-stream', buffer: Buffer.from('MZ') }),
    ).toThrow(BadRequestException);
  });
});
