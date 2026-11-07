import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash, randomUUID } from 'crypto';
import { extname } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import type { FileUploadInput, StoredFile } from './files.types';
import { FileStorageAdapter } from './storage/file-storage';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'text/plain',
  'text/csv',
]);

@Injectable()
export class FilesService {
  constructor(
    private readonly storage: FileStorageAdapter,
    private readonly prisma: PrismaService,
  ) {}

  async upload(input: FileUploadInput): Promise<StoredFile> {
    if (!ALLOWED.has(input.mimeType)) {
      throw new ForbiddenException('Unsupported file type');
    }
    if (input.buffer.length > MAX_BYTES) {
      throw new ForbiddenException('File exceeds 5MB limit');
    }

    const id = `file_${randomUUID().slice(0, 12)}`;
    const ext = extname(input.originalName || '').slice(0, 12) || '';
    const hash = createHash('sha256')
      .update(input.buffer)
      .digest('hex')
      .slice(0, 16);
    const key = `${input.ownerUserId}/${id}_${hash}${ext}`;

    const put = await this.storage.put({
      key,
      buffer: input.buffer,
      mimeType: input.mimeType,
    });

    const usePrisma =
      (process.env.JOBS_STORE ?? 'memory').toLowerCase() === 'prisma';

    if (usePrisma) {
      await this.prisma.user.upsert({
        where: { id: input.ownerUserId },
        create: { id: input.ownerUserId },
        update: {},
      });
      const row = await this.prisma.storedFile.create({
        data: {
          id,
          ownerUserId: input.ownerUserId,
          originalName: input.originalName.slice(0, 255),
          mimeType: input.mimeType,
          sizeBytes: input.buffer.length,
          storageKey: put.storageKey,
          backend: this.storage.name,
        },
      });
      return this.map(row);
    }

    return {
      id,
      ownerUserId: input.ownerUserId,
      originalName: input.originalName.slice(0, 255),
      mimeType: input.mimeType,
      sizeBytes: input.buffer.length,
      storageKey: put.storageKey,
      backend: this.storage.name,
      createdAt: new Date().toISOString(),
    };
  }

  async getOwned(id: string, userId: string): Promise<{
    meta: StoredFile;
    buffer: Buffer;
  }> {
    const usePrisma =
      (process.env.JOBS_STORE ?? 'memory').toLowerCase() === 'prisma';
    if (!usePrisma) {
      throw new NotFoundException('File not found');
    }
    const row = await this.prisma.storedFile.findUnique({ where: { id } });
    if (!row || row.ownerUserId !== userId) {
      throw new NotFoundException('File not found');
    }
    const buffer = await this.storage.get(row.storageKey);
    if (!buffer) throw new NotFoundException('File blob missing');
    return { meta: this.map(row), buffer };
  }

  private map(row: {
    id: string;
    ownerUserId: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    storageKey: string;
    backend: string;
    createdAt: Date;
  }): StoredFile {
    return {
      id: row.id,
      ownerUserId: row.ownerUserId,
      originalName: row.originalName,
      mimeType: row.mimeType,
      sizeBytes: row.sizeBytes,
      storageKey: row.storageKey,
      backend: row.backend as StoredFile['backend'],
      createdAt: row.createdAt.toISOString(),
    };
  }
}
