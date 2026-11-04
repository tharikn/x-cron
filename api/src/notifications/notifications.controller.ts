import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CurrentUser, Public, Roles } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import {
  DevSendNotificationDto,
  NotificationPreferencesDto,
  RegisterDeviceDto,
  UnlinkDeviceDto,
} from './dto/notifications.dto';
import { NotificationsService } from './notifications.service';

@Controller('v1')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /** Link FCM/device to the signed-in user (requires live access token). */
  @Post('devices')
  registerDevice(
    @Body() dto: RegisterDeviceDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.notificationsService.registerDevice(dto, user);
  }

  /** Detach FCM device from user (logout / refresh expiry). Public + device proof. */
  @Public()
  @Post('devices/unlink')
  unlinkDevice(@Body() dto: UnlinkDeviceDto) {
    return this.notificationsService.unlinkDevice(dto);
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

  /** Trigger history (batch fan-outs). Admin only. */
  @Roles('admin')
  @Get('admin/notification-dispatches')
  listDispatches(
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.notificationsService.listDispatches(limit);
  }

  @Roles('admin')
  @Get('admin/notification-dispatches/:id')
  getDispatch(@Param('id') id: string) {
    return this.notificationsService.getDispatch(id);
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
