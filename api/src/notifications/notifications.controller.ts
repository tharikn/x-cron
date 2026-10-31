import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser, Public } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import {
  DevSendNotificationDto,
  NotificationPreferencesDto,
  RegisterDeviceDto,
} from './dto/notifications.dto';
import { NotificationsService } from './notifications.service';

@Controller('v1')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Public()
  @Post('devices')
  registerDevice(
    @Body() dto: RegisterDeviceDto,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.notificationsService.registerDevice(dto, user);
  }

  @Get('notifications/preferences')
  getPrefs(@CurrentUser() user: AuthUser) {
    return this.notificationsService.getNotificationPreferences(user);
  }

  @Put('notifications/preferences')
  savePrefs(
    @CurrentUser() user: AuthUser,
    @Body() dto: NotificationPreferencesDto,
  ) {
    return this.notificationsService.saveNotificationPreferences(user, dto);
  }

  /** PRD lists POST; same handler as PUT. */
  @Post('notifications/preferences')
  savePrefsPost(
    @CurrentUser() user: AuthUser,
    @Body() dto: NotificationPreferencesDto,
  ) {
    return this.notificationsService.saveNotificationPreferences(user, dto);
  }

  @Get('notifications')
  list(@CurrentUser() user: AuthUser) {
    return this.notificationsService.listInApp(user);
  }

  @Post('notifications/:id/read')
  markRead(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.notificationsService.markRead(user, id);
  }

  @Public()
  @Post('notifications/dev/send')
  devSend(@Body() dto: DevSendNotificationDto) {
    return this.notificationsService.devSend(dto);
  }

  @Public()
  @Post('notifications/dev/dispatch-published/:jobId')
  dispatchPublished(@Param('jobId') jobId: string) {
    return this.notificationsService.onJobPublished(jobId);
  }
}
