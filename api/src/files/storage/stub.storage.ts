import { Injectable, Logger } from '@nestjs/common';
import { FileStorageAdapter } from './file-storage';

/** In-memory only — for tests / memory-store demos. */
@Injectable()
export class StubFileStorage extends FileStorageAdapter {
  readonly name = 'stub' as const;
  private readonly logger = new Logger(StubFileStorage.name);
  private readonly blobs = new Map<string, Buffer>();

  async put(input: {
    key: string;
    buffer: Buffer;
    mimeType: string;
  }): Promise<{ storageKey: string }> {
    this.blobs.set(input.key, input.buffer);
    this.logger.debug(`stub put ${input.key}`);
    return { storageKey: input.key };
  }

  async get(storageKey: string): Promise<Buffer | null> {
    return this.blobs.get(storageKey) ?? null;
  }

  async delete(storageKey: string): Promise<void> {
    this.blobs.delete(storageKey);
  }
}
