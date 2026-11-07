export type FileStorageBackend = 'local' | 's3' | 'stub';

export interface StoredFile {
  id: string;
  ownerUserId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
  backend: FileStorageBackend;
  createdAt: string;
}

export interface FileUploadInput {
  ownerUserId: string;
  originalName: string;
  mimeType: string;
  buffer: Buffer;
}
