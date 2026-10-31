import sharp from 'sharp';
import { createWorker, type Worker } from 'tesseract.js';

export interface OcrEngineResult {
  text: string;
  meanConfidence: number;
  pages: number;
}

let workerPromise: Promise<Worker> | null = null;
let workerLangs = '';

function resolveLangs(): string {
  return (process.env.OCR_LANGS || 'eng').trim() || 'eng';
}

async function getWorker(): Promise<Worker> {
  const langs = resolveLangs();
  if (!workerPromise || workerLangs !== langs) {
    if (workerPromise) {
      try {
        const prior = await workerPromise;
        await prior.terminate();
      } catch {
        // ignore terminate races on lang switch
      }
    }
    workerLangs = langs;
    const options: { cachePath?: string; logger: (m: unknown) => void } = {
      logger:
        process.env.OCR_DEBUG === '1'
          ? (m) => console.log('[ocr]', m)
          : () => undefined,
    };
    if (process.env.OCR_CACHE_PATH) {
      options.cachePath = process.env.OCR_CACHE_PATH;
    }
    workerPromise = createWorker(langs, 1, options);
  }
  return workerPromise;
}

/** Grayscale + contrast so colorful flyer bars OCR more reliably. */
export async function preprocessImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .rotate()
    .resize({
      width: 1800,
      height: 1800,
      fit: 'inside',
      withoutEnlargement: false,
    })
    .grayscale()
    .normalize()
    .sharpen()
    .png()
    .toBuffer();
}

export async function recognizeImage(buffer: Buffer): Promise<OcrEngineResult> {
  const prepared = await preprocessImage(buffer);
  const worker = await getWorker();
  const {
    data: { text, confidence },
  } = await worker.recognize(prepared);

  return {
    text: text || '',
    meanConfidence: typeof confidence === 'number' ? confidence / 100 : 0.5,
    pages: 1,
  };
}
