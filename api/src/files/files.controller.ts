import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { memoryStorage } from 'multer';
import { CurrentUser, Roles } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import { FilesService } from './files.service';

@Controller('v1/files')
export class FilesController {
  constructor(private readonly files: FilesService) {}

  @Post()
  @Roles('seeker', 'employer', 'admin')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async upload(
    @CurrentUser() user: AuthUser,
    @UploadedFile()
    file?: {
      originalname: string;
      mimetype: string;
      buffer: Buffer;
      size: number;
    },
  ) {
    if (!file?.buffer?.length) {
      return { ok: false, error: 'file required' };
    }
    const stored = await this.files.upload({
      ownerUserId: user.id,
      originalName: file.originalname || 'upload',
      mimeType: file.mimetype || 'application/octet-stream',
      buffer: file.buffer,
    });
    return {
      id: stored.id,
      originalName: stored.originalName,
      mimeType: stored.mimeType,
      sizeBytes: stored.sizeBytes,
      backend: stored.backend,
      createdAt: stored.createdAt,
    };
  }

  @Get(':id')
  @Roles('seeker', 'employer', 'admin')
  async download(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const { meta, buffer } = await this.files.getOwned(id, user.id);
    res.setHeader('Content-Type', meta.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${meta.originalName.replace(/"/g, '')}"`,
    );
    res.setHeader('Cache-Control', 'private, no-store');
    res.send(buffer);
  }
}
