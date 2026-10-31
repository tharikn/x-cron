import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CurrentUser, Public, Roles } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import { AdsService } from './ads.service';
import {
  AdEventDto,
  PurchasePromotionDto,
  UpsertCreativeDto,
  UpsertPlacementDto,
} from './dto/ads.dto';
import type { AdSlot } from './ads.types';

@Controller('v1')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Public()
  @Get('ads/slots/:slot')
  getSlot(
    @Param('slot') slot: string,
    @Query('deviceId') deviceId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adsService.getSlot(
      slot as AdSlot,
      deviceId || 'anonymous',
      limit ? Number(limit) : 1,
    );
  }

  @Public()
  @Post('ads/events')
  event(@Body() dto: AdEventDto) {
    return this.adsService.recordEvent(dto);
  }

  @Public()
  @Get('promotions/packages')
  packages() {
    return this.adsService.listPackages();
  }

  @Roles('employer', 'admin')
  @Post('employers/promotions')
  purchase(
    @CurrentUser() user: AuthUser,
    @Body() dto: PurchasePromotionDto,
  ) {
    return this.adsService.purchasePromotion(user, dto);
  }

  @Roles('employer', 'admin')
  @Get('employers/promotions')
  mine(@CurrentUser() user: AuthUser) {
    return this.adsService.myPromotions(user);
  }

  @Roles('admin')
  @Get('admin/ads/placements')
  adminPlacements() {
    return this.adsService.adminListPlacements();
  }

  @Roles('admin')
  @Put('admin/ads/placements/:slot')
  adminUpsertPlacement(
    @Param('slot') slot: string,
    @Body() dto: UpsertPlacementDto,
  ) {
    return this.adsService.adminUpsertPlacement(slot as AdSlot, dto);
  }

  @Roles('admin')
  @Get('admin/ads/creatives')
  adminCreatives() {
    return this.adsService.adminListCreatives();
  }

  @Roles('admin')
  @Post('admin/ads/creatives')
  adminUpsertCreative(@Body() dto: UpsertCreativeDto) {
    return this.adsService.adminUpsertCreative(dto);
  }
}
