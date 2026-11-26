import sharp from 'sharp';
import { MemoryStorageProvider } from './providers/memory.storage';
import { UploadMemoryStore } from './upload.memory-store';
import { UploadService } from './upload.service';
import { validateUpload } from './upload-validation';

function file(
  buffer: Buffer,
  originalname: string,
  mimetype: string,
): Express.Multer.File {
  return {
    buffer,
    originalname,
    mimetype,
    size: buffer.length,
  } as Express.Multer.File;
}

describe('upload validation', () => {
  it('accepts png, jpeg and inert svg up to 5 MB', async () => {
    const png = await sharp({ create: { width: 4, height: 4, channels: 3, background: '#fff' } })
      .png()
      .toBuffer();
    expect(validateUpload(file(png, 'a.png', 'image/png'), 'portfolio').mimeType).toBe('image/png');

    const jpeg = await sharp({ create: { width: 4, height: 4, channels: 3, background: '#fff' } })
      .jpeg()
      .toBuffer();
    expect(validateUpload(file(jpeg, 'a.jpeg', 'image/jpeg'), 'company-logo').extension).toBe('jpg');

    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
    expect(validateUpload(file(svg, 'a.svg', 'image/svg+xml'), 'portfolio').mimeType).toBe(
      'image/svg+xml',
    );
  });

  it('rejects unsupported types, fake magic bytes and active SVG', async () => {
    const png = await sharp({ create: { width: 4, height: 4, channels: 3, background: '#fff' } })
      .png()
      .toBuffer();

    expect(() => validateUpload(file(png, 'a.gif', 'image/gif'), 'portfolio')).toThrow();
    expect(() => validateUpload(file(Buffer.from('nope'), 'a.png', 'image/png'), 'portfolio')).toThrow();
    expect(() =>
      validateUpload(
        file(Buffer.from('<svg><script>alert(1)</script></svg>'), 'x.svg', 'image/svg+xml'),
        'portfolio',
      ),
    ).toThrow();

    const tooBig = Buffer.concat([png, Buffer.alloc(5 * 1024 * 1024)]);
    expect(() => validateUpload(file(tooBig, 'a.png', 'image/png'), 'portfolio')).toThrow(
      /5 MB/,
    );
  });
});

describe('UploadService', () => {
  let provider: MemoryStorageProvider;
  let service: UploadService;

  beforeEach(() => {
    provider = new MemoryStorageProvider();
    service = new UploadService(provider, new UploadMemoryStore());
    process.env.APP_URL = 'http://localhost:3010';
  });

  it('stores original plus bounded image versions', async () => {
    const png = await sharp({ create: { width: 800, height: 600, channels: 3, background: '#123456' } })
      .png()
      .toBuffer();

    const asset = await service.upload(file(png, 'hero.png', 'image/png'), 'user-1', 'portfolio');

    expect(asset.versions.map((v) => v.name)).toEqual([
      'original',
      'thumb',
      'medium',
      'large',
    ]);
    expect(asset.url).toMatch(/^http:\/\/localhost:3010\/v1\/storage\/public\//);
    expect(asset.versions[1].width).toBeLessThanOrEqual(320);

    const publicAsset = await service.getPublic(asset.id, 'thumb');
    expect(publicAsset?.contentType).toBe('image/png');
    expect(publicAsset?.headers['X-Content-Type-Options']).toBe('nosniff');
  });

  it('never exposes resume assets publicly', async () => {
    const pdf = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\n%%EOF');
    const asset = await service.upload(file(pdf, 'cv.pdf', 'application/pdf'), 'user-2', 'resume');

    expect(asset.versions).toHaveLength(0);
    expect(await service.getPublic(asset.id, 'original')).toBeNull();

    const downloaded = await service.downloadOwned(asset.id, 'user-2');
    expect(downloaded.response.headers['Content-Disposition']).toContain('attachment');

    await expect(service.downloadOwned(asset.id, 'someone-else')).rejects.toThrow();
    await expect(service.deleteOwned(asset.id, 'user-2')).resolves.toBe(true);
  });
});
