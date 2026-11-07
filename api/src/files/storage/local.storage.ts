import { Injectable, Logger } from '@nestjs/common';
import { mkdir, readFile, unlink, writeFile } from 'fs/promises';
import { dirname, join, resolve } from 'path';
import { FileStorageAdapter } from './file-storage';

@Injectable()
export class LocalFileStorage extends FileStorageAdapter {
  readonly name = 'local' as const;
  private readonly logger = new Logger(LocalFileStorage.name);
  private readonly root: string;

  constructor() {
    super();
    this.root = resolve(
      process.env.FILE_LOCAL_DIR?.trim() || join(process.cwd(), 'uploads'),
    );
  }

  async put(input: {
    key: string;
    buffer: Buffer;
    mimeType: string;
  }): Promise<{ storageKey: string }> {
    const path = join(this.root, input.key);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, input.buffer);
    this.logger.debug(`local put ${input.key} (${input.mimeType})`);
    return { storageKey: input.key };
  }

  async get(storageKey: string): Promise<Buffer | null> {
    try {
      return await readFile(join(this.root, storageKey));
    } catch {
      return null;
    }
  }

  async delete(storageKey: string): Promise<void> {
    try {
      await unlink(join(this.root, storageKey));
    } catch {
      /* ignore missing */
    }
  }
}
