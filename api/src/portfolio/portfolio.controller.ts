import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { createHash } from 'crypto';
import type { AuthUser } from '../auth/auth.types';
import { CurrentUser, Public } from '../auth/decorators';
import { AuthThrottle } from '../security/decorators';
import {
  CreatePortfolioSiteDto,
  GeneratePortfolioCopyDto,
  ListPortfolioTemplatesQueryDto,
  PortfolioEventDto,
  PublishPortfolioDto,
  RollbackPortfolioDto,
  SavePortfolioDraftDto,
  UpdatePortfolioSiteDto,
  ValidatePortfolioDraftDto,
} from './dto/portfolio.dto';
import { PortfolioAiService } from './portfolio-ai.service';
import { PortfolioService } from './portfolio.service';

@Controller('v1/portfolio')
export class PortfolioController {
  constructor(
    private readonly portfolio: PortfolioService,
    private readonly ai: PortfolioAiService,
  ) {}

  // ── Catalog / registry (signed-in editor) ───────────────────────────────

  /** Immutable template catalog for the create wizard and template picker. */
  @Get('templates')
  listTemplates(@Query() query: ListPortfolioTemplatesQueryDto) {
    const items = this.portfolio.listTemplates(query.category);
    return {
      items,
      total: items.length,
      catalogVersion: '2026.11',
    };
  }

  @Get('templates/:templateId')
  getTemplate(@Param('templateId') templateId: string) {
    return this.portfolio.getTemplate(templateId);
  }

  /**
   * Allow-listed component schemas. Drives the editor property panel — the
   * editor never invents fields the API would reject.
   */
  @Get('components')
  listComponents() {
    return { items: this.portfolio.listComponents() };
  }

  /** Optional copy assist. Proposals only — nothing is auto-applied. */
  @AuthThrottle()
  @Post('ai/generate')
  generateCopy(@Body() dto: GeneratePortfolioCopyDto) {
    return this.ai.generateCopy(dto);
  }

  // ── Media library (URL-based in MVP; binary upload deferred) ─────────────

  @Get('media')
  listMedia(@CurrentUser() user: AuthUser) {
    return this.portfolio.listMedia(user.id).then((items) => ({ items }));
  }

  @Post('media')
  addMedia(@CurrentUser() user: AuthUser, @Body() body: { url: string }) {
    return this.portfolio.addMedia(user.id, body.url);
  }

  @Delete('media/:assetId')
  deleteMedia(
    @CurrentUser() user: AuthUser,
    @Param('assetId') assetId: string,
  ) {
    return this.portfolio.deleteMedia(user.id, assetId);
  }

  // ── Sites ───────────────────────────────────────────────────────────────

  @Get('sites')
  listSites(@CurrentUser() user: AuthUser) {
    return this.portfolio.listSites(user.id).then((items) => ({ items }));
  }

  @AuthThrottle()
  @Post('sites')
  createSite(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreatePortfolioSiteDto,
  ) {
    return this.portfolio.createSite(user.id, dto);
  }

  @Get('sites/:siteId')
  getSite(@CurrentUser() user: AuthUser, @Param('siteId') siteId: string) {
    return this.portfolio.getSite(user.id, siteId);
  }

  @Patch('sites/:siteId')
  updateSite(
    @CurrentUser() user: AuthUser,
    @Param('siteId') siteId: string,
    @Body() dto: UpdatePortfolioSiteDto,
  ) {
    return this.portfolio.updateSite(user.id, siteId, dto);
  }

  @Delete('sites/:siteId')
  deleteSite(@CurrentUser() user: AuthUser, @Param('siteId') siteId: string) {
    return this.portfolio.deleteSite(user.id, siteId);
  }

  // ── Draft / autosave ────────────────────────────────────────────────────

  @Get('sites/:siteId/draft')
  getDraft(@CurrentUser() user: AuthUser, @Param('siteId') siteId: string) {
    return this.portfolio.getDraft(user.id, siteId);
  }

  /** Revision-aware autosave. Stale `baseRevision` → 409 conflict. */
  @Put('sites/:siteId/draft')
  saveDraft(
    @CurrentUser() user: AuthUser,
    @Param('siteId') siteId: string,
    @Body() dto: SavePortfolioDraftDto,
  ) {
    return this.portfolio.saveDraft(user.id, siteId, dto);
  }

  @Post('sites/:siteId/draft/validate')
  validateDraft(
    @CurrentUser() user: AuthUser,
    @Param('siteId') siteId: string,
    @Body() dto: ValidatePortfolioDraftDto,
  ) {
    return this.portfolio.validateDraft(user.id, siteId, dto.document);
  }

  // ── Versions / publishing ───────────────────────────────────────────────

  @Get('sites/:siteId/versions')
  listVersions(
    @CurrentUser() user: AuthUser,
    @Param('siteId') siteId: string,
  ) {
    return this.portfolio
      .listVersions(user.id, siteId)
      .then((items) => ({ items }));
  }

  @Get('sites/:siteId/versions/:versionId')
  getVersion(
    @CurrentUser() user: AuthUser,
    @Param('siteId') siteId: string,
    @Param('versionId') versionId: string,
  ) {
    return this.portfolio.getVersion(user.id, siteId, versionId);
  }

  @AuthThrottle()
  @Post('sites/:siteId/publish')
  publish(
    @CurrentUser() user: AuthUser,
    @Param('siteId') siteId: string,
    @Body() dto: PublishPortfolioDto,
  ) {
    return this.portfolio.publish(user.id, siteId, dto);
  }

  @AuthThrottle()
  @Post('sites/:siteId/rollback')
  rollback(
    @CurrentUser() user: AuthUser,
    @Param('siteId') siteId: string,
    @Body() dto: RollbackPortfolioDto,
  ) {
    return this.portfolio.rollback(user.id, siteId, dto);
  }

  @Post('sites/:siteId/unpublish')
  unpublish(
    @CurrentUser() user: AuthUser,
    @Param('siteId') siteId: string,
  ) {
    return this.portfolio.unpublish(user.id, siteId);
  }

  @Get('sites/:siteId/analytics')
  analytics(@CurrentUser() user: AuthUser, @Param('siteId') siteId: string) {
    return this.portfolio.analytics(user.id, siteId);
  }

  // ── Public runtime (anonymous) ──────────────────────────────────────────

  /**
   * Read-optimized published representation. Draft/preview data is never
   * returned here. Immutable version ids make this safe to cache long-term.
   */
  @Public()
  @Get('public/:slug')
  getPublic(@Param('slug') slug: string, @Query('locale') locale?: string) {
    return this.portfolio.getPublicSite(slug, locale);
  }

  /** Privacy-light analytics beacon. Never blocks rendering. */
  @Public()
  @Post('public/:slug/events')
  recordEvent(
    @Param('slug') slug: string,
    @Body() dto: PortfolioEventDto,
    @Req() req: Request,
  ) {
    const ua = req.headers['user-agent'] ?? '';
    const ip = req.ip ?? '';
    const day = new Date().toISOString().slice(0, 10);
    // Rotating daily hash — no raw IP is stored.
    const visitorKey = createHash('sha256')
      .update(`${ip}|${ua}|${day}|portfolio`)
      .digest('hex')
      .slice(0, 24);
    return this.portfolio.recordPublicEvent(slug, dto, visitorKey);
  }
}
