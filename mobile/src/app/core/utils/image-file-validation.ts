/** Client-side mirror of the API image policy. The API remains authoritative. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ALLOWED: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  svg: 'image/svg+xml',
};

export function imageFileError(file: File): string | null {
  if (!file.size) return 'Choose an image file.';
  if (file.size > MAX_IMAGE_BYTES) return 'Image must be 5 MB or smaller.';

  const dot = file.name.lastIndexOf('.');
  const ext = dot < 0 ? '' : file.name.slice(dot + 1).toLowerCase();
  const expected = ALLOWED[ext];
  if (!expected) return 'Only svg, png, jpg and jpeg images are allowed.';

  const declared = (file.type || '').split(';')[0].toLowerCase();
  if (declared && declared !== expected && declared !== 'application/octet-stream') {
    return 'Image type does not match the file extension.';
  }
  return null;
}
