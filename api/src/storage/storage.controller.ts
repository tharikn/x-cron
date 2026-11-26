import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { memoryStorage } from 'multer';
import type { AuthUser } from '../auth/auth.types';
import { CurrentUser, Public, Roles } from '../auth/decorators';
import { MAX_DOCUMENT_BYTES, MAX_IMAGE_BYTES } from './upload-validation';
import {
  UPLOAD_PURPOSES,
  UploadPurpose,
} from './storage.types';
import { UploadService } from './upload.service';

@Controller('v1/storage')
export class StorageController {
  constructor(private readonly uploads: UploadService) {}

  /**
   * Single upload endpoint for every feature. `purpose` selects the
   * validation policy (image-only vs resume document) and the key namespace.
   */
  @Post('uploads')
  @Roles('seeker', 'employer', 'admin')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: Math.max(MAX_IMAGE_BYTES, MAX_DOCUMENT_BYTES), files: 1 },
    }),
  )
  upload(
    @CurrentUser() user: AuthUser,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body('purpose') bodyPurpose?: string,
    @Query('purpose') queryPurpose?: string,
  ) {
    const purpose = (bodyPurpose || queryPurpose || '') as UploadPurpose;
    if (!UPLOAD_PURPOSES.includes(purpose)) {
      throw new BadRequestException(
        'purpose must be one of portfolio, company-logo, profile-photo or resume',
      );
    }
    return this.uploads.upload(file, user.id, purpose);
  }

  /** Public, immutable image variants. Resumes are never served here. */
  @Public()
  @Get('public/:assetId/:versionName')
  async publicAsset(
    @Param('assetId') assetId: string,
    @Param('versionName') versionName: string,
    @Res() res: Response,
  ) {
    const asset = await this.uploads.getPublic(assetId, versionName);
    if (!asset) {
      res.status(404).json({ statusCode: 404, message: 'Asset not found' });
      return;
    }
    for (const [key, value] of Object.entries(asset.headers)) {
      res.setHeader(key, value);
    }
    res.send(asset.body);
  }

  /** Owner-only download for non-public assets (resumes). */
  @Get('assets/:assetId/download')
  async downloadOwned(
    @CurrentUser() user: AuthUser,
    @Param('assetId') assetId: string,
    @Res() res: Response,
  ) {
    const result = await this.uploads.downloadOwned(assetId, user.id);
    for (const [key, value] of Object.entries(result.response.headers)) {
      res.setHeader(key, value);
    }
    res.send(result.response.body);
  }

  @Delete('assets/:assetId')
  async deleteOwned(
    @CurrentUser() user: AuthUser,
    @Param('assetId') assetId: string,
  ) {
    await this.uploads.deleteOwned(assetId, user.id);
    return { ok: true };
  }
}
