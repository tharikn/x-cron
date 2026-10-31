import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { CurrentUser, Public } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import {
  ClaimPreferencesDto,
  PreferenceFieldsDto,
  SaveGuestPreferencesDto,
} from './dto/preferences.dto';
import { PreferencesService } from './preferences.service';

@Controller('v1')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  /** Guest / device-local preferences (no account). */
  @Public()
  @Post('preferences')
  saveGuest(@Body() dto: SaveGuestPreferencesDto) {
    const { deviceId, ...fields } = dto;
    return {
      scope: 'device' as const,
      deviceId,
      ...this.preferencesService.saveGuest(deviceId, fields),
    };
  }

  @Public()
  @Get('preferences')
  getGuest(@Query('deviceId') deviceId: string) {
    const id = deviceId || 'anonymous';
    return {
      scope: 'device' as const,
      deviceId: id,
      ...this.preferencesService.getGuest(id),
    };
  }

  /** Account-synced preferences. */
  @Get('me/preferences')
  getMine(@CurrentUser() user: AuthUser) {
    return {
      scope: 'account' as const,
      userId: user.id,
      ...this.preferencesService.getForUser(user),
    };
  }

  @Put('me/preferences')
  saveMine(@CurrentUser() user: AuthUser, @Body() dto: PreferenceFieldsDto) {
    return {
      scope: 'account' as const,
      userId: user.id,
      ...this.preferencesService.saveForUser(user, dto),
    };
  }

  @Post('me/preferences/claim')
  claim(@CurrentUser() user: AuthUser, @Body() dto: ClaimPreferencesDto) {
    return {
      scope: 'account' as const,
      userId: user.id,
      ...this.preferencesService.claimDevice(user, dto.deviceId),
    };
  }

  @Delete('me/preferences')
  clearMine(@CurrentUser() user: AuthUser) {
    return {
      scope: 'account' as const,
      userId: user.id,
      ...this.preferencesService.clearForUser(user),
    };
  }
}
