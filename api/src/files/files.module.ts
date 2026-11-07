import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FileStorageAdapter } from './storage/file-storage';
import { LocalFileStorage } from './storage/local.storage';
import { S3FileStorage } from './storage/s3.storage';
import { StubFileStorage } from './storage/stub.storage';

function createStorage(): FileStorageAdapter {
  const mode = (process.env.FILE_STORAGE ?? 'local').toLowerCase();
  if (mode === 's3') return new S3FileStorage();
  if (mode === 'stub') return new StubFileStorage();
  return new LocalFileStorage();
}

@Module({
  controllers: [FilesController],
  providers: [
    { provide: FileStorageAdapter, useFactory: createStorage },
    FilesService,
  ],
  exports: [FilesService],
})
export class FilesModule {}
