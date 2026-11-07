import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import * as XLSX from 'xlsx';
import { CurrentUser, Public, Roles } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import { UPLOAD_MAX_BYTES } from '../security/upload-guard';
import {
  ApproveRecordsDto,
  CreateImportBatchDto,
  EnrichRecordDto,
  TextUploadDto,
  UpdateImportRecordDto,
} from './dto/ingestion.dto';
import { IngestionService } from './ingestion.service';

@Controller('v1/import-batches')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  /** Free CSV template for bulk job import (Excel-compatible). */
  @Public()
  @Get('template.csv')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header(
    'Content-Disposition',
    'attachment; filename="xcron-job-import-template.csv"',
  )
  templateCsv() {
    return this.ingestionService.importTemplateCsv();
  }

  /** Free Excel template (same columns as CSV). */
  @Public()
  @Get('template.xlsx')
  templateXlsx(@Res() res: Response) {
    const rows = this.ingestionService.importTemplateCsv()
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => line.split(','));
    const sheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Jobs');
    const buffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    }) as Buffer;
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="xcron-job-import-template.xlsx"',
    );
    res.send(buffer);
  }

  @Roles('admin')
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateImportBatchDto) {
    return this.ingestionService.createBatch(user, dto);
  }

  @Roles('admin')
  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.ingestionService.listMine(user);
  }

  @Roles('admin')
  @Get(':id')
  get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.ingestionService.getBatch(user, id);
  }

  @Roles('admin')
  @Get(':id/records')
  records(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.ingestionService.getRecords(user, id);
  }

  @Roles('admin')
  @Post(':id/uploads/text')
  uploadText(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: TextUploadDto,
  ) {
    return this.ingestionService.uploadText(user, id, dto);
  }

  @Roles('admin')
  @Post(':id/uploads')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: UPLOAD_MAX_BYTES, files: 1 },
    }),
  )
  uploadFile(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('sourceType') sourceType?: string,
  ) {
    return this.ingestionService.uploadFile(user, id, file, sourceType);
  }

  @Roles('admin')
  @Post(':id/records/:recordId/enrich')
  enrichRecord(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Param('recordId') recordId: string,
    @Body() dto: EnrichRecordDto,
  ) {
    return this.ingestionService.enrichRecord(user, id, recordId, dto);
  }

  @Roles('admin')
  @Patch(':id/records/:recordId')
  updateRecord(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Param('recordId') recordId: string,
    @Body() dto: UpdateImportRecordDto,
  ) {
    return this.ingestionService.updateRecord(user, id, recordId, dto);
  }

  @Roles('admin')
  @Post(':id/approve')
  approve(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: ApproveRecordsDto,
  ) {
    return this.ingestionService.approve(user, id, dto);
  }
}
