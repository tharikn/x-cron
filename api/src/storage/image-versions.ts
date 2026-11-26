import sharp from 'sharp';

export interface GeneratedVersion {
  name: 'original' | 'thumb' | 'medium' | 'large';
  body: Buffer;
  contentType: string;
  width: number | null;
  height: number | null;
  format: string;
}

const SIZES: ReadonlyArray<{
  name: Exclude<GeneratedVersion['name'], 'original'>;
  width: number;
  height: number;
}> = [
  { name: 'thumb', width: 320, height: 320 },
  { name: 'medium', width: 1024, height: 1024 },
  { name: 'large', width: 1920, height: 1920 },
];

/**
 * Produce bounded, predictable image variants. The original bytes are kept
 * intact; derivatives are re-encoded with metadata stripped. SVG derivatives
 * are rasterised to PNG so no script-bearing markup is ever served as a
 * version. `sharp` never executes SVG scripts.
 */
export async function generateImageVersions(
  source: Buffer,
  extension: string,
): Promise<GeneratedVersion[]> {
  const metadata = await sharp(source, {
    failOn: 'error',
    limitInputPixels: 40_000_000,
    density: 96,
  }).metadata();

  const originalFormat = extension === 'svg' ? 'svg' : extension === 'jpg' ? 'jpg' : 'png';
  const originalContentType =
    extension === 'svg' ? 'image/svg+xml' : extension === 'jpg' ? 'image/jpeg' : 'image/png';

  const versions: GeneratedVersion[] = [
    {
      name: 'original',
      body: source,
      contentType: originalContentType,
      width: metadata.width ?? null,
      height: metadata.height ?? null,
      format: originalFormat,
    },
  ];

  const outputFormat = extension === 'svg' || extension === 'png' ? 'png' : 'jpeg';
  for (const size of SIZES) {
    let pipeline = sharp(source, {
      failOn: 'error',
      limitInputPixels: 40_000_000,
      density: 96,
    })
      .rotate()
      .resize(size.width, size.height, {
        fit: 'inside',
        withoutEnlargement: true,
      });

    pipeline =
      outputFormat === 'png'
        ? pipeline.png({ compressionLevel: 9, palette: true })
        : pipeline.jpeg({ quality: 82, progressive: true, mozjpeg: true });

    const body = await pipeline.toBuffer();
    const info = await sharp(body).metadata();
    versions.push({
      name: size.name,
      body,
      contentType: outputFormat === 'png' ? 'image/png' : 'image/jpeg',
      width: info.width ?? null,
      height: info.height ?? null,
      format: outputFormat,
    });
  }

  return versions;
}
