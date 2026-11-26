import {
  PutObjectInput,
  StorageProvider,
  StorageProviderName,
  StoredObject,
} from '../storage.types';

/** Test-only provider. Objects live for the lifetime of the process. */
export class MemoryStorageProvider implements StorageProvider {
  readonly name: StorageProviderName = 'memory';
  private readonly objects = new Map<string, StoredObject>();

  async put(input: PutObjectInput): Promise<{ key: string }> {
    this.objects.set(input.key, {
      key: input.key,
      body: Buffer.from(input.body),
      contentType: input.contentType,
      ...(input.cacheControl ? { cacheControl: input.cacheControl } : {}),
    });
    return { key: input.key };
  }

  async get(key: string): Promise<StoredObject | null> {
    return this.objects.get(key) ?? null;
  }

  async delete(key: string): Promise<void> {
    this.objects.delete(key);
  }
}
