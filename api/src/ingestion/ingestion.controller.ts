import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser, Roles } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import {
  ApproveRecordsDto,
  CreateImportBatchDto,
  TextUploadDto,
} from './dto/ingestion.dto';
import { IngestionService } from './ingestion.service';

@Controller('v1/import-batches')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Roles('employer', 'admin')
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateImportBatchDto) {
    return this.ingestionService.createBatch(user, dto);
  }

  @Roles('employer', 'admin')
  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.ingestionService.listMine(user);
  }

  @Roles('employer', 'admin')
  @Get(':id')
  get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.ingestionService.getBatch(user, id);
  }

  @Roles('employer', 'admin')
  @Get(':id/records')
  records(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.ingestionService.getRecords(user, id);
  }

  @Roles('employer', 'admin')
  @Post(':id/uploads/text')
  uploadText(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: TextUploadDto,
  ) {
    return this.ingestionService.uploadText(user, id, dto);
  }

  @Roles('employer', 'admin')
  @Post(':id/uploads')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('sourceType') sourceType?: string,
  ) {
    return this.ingestionService.uploadFile(user, id, file, sourceType);
  }

  @Roles('employer', 'admin')
  @Post(':id/approve')
  approve(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: ApproveRecordsDto,
  ) {
    return this.ingestionService.approve(user, id, dto);
  }
}
