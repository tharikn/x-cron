import type { FileStorageBackend } from '../files.types';

export abstract class FileStorageAdapter {
  abstract readonly name: FileStorageBackend;

  abstract put(input: {
    key: string;
    buffer: Buffer;
    mimeType: string;
  }): Promise<{ storageKey: string }>;

  abstract get(storageKey: string): Promise<Buffer | null>;

  abstract delete(storageKey: string): Promise<void>;
}
