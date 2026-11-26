import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { AuthUser } from '../auth/auth.types';
import { CurrentUser, Roles } from '../auth/decorators';
import { MAX_DOCUMENT_BYTES, MAX_IMAGE_BYTES } from '../storage/upload-validation';
import { JobAssetsService } from './job-assets.service';

const IMAGE_PURPOSES = new Set(['company-logo', 'profile-photo']);

@Controller('v1/job-assets')
@Roles('seeker', 'employer', 'admin')
export class JobAssetsController {
  constructor(private readonly assets: JobAssetsService) {}

  @Post('images')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_IMAGE_BYTES, files: 1 },
    }),
  )
  uploadImage(
    @CurrentUser() user: AuthUser,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body('purpose') purpose?: string,
  ) {
    if (!purpose || !IMAGE_PURPOSES.has(purpose)) {
      throw new BadRequestException('purpose must be company-logo or profile-photo');
    }
    return this.assets.uploadImage(
      user,
      file,
      purpose as 'company-logo' | 'profile-photo',
    );
  }

  @Post('resumes')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_DOCUMENT_BYTES, files: 1 },
    }),
  )
  uploadResume(
    @CurrentUser() user: AuthUser,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    return this.assets.uploadResume(user, file);
  }

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.assets.list(user).then((items) => ({ items }));
  }

  @Delete(':id')
  delete(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.assets.delete(user, id);
  }
}
