import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import { ApplyProfilesService } from './apply-profiles.service';
import {
  CreateApplyProfileDto,
  UpdateApplyProfileDto,
} from './dto/apply-profiles.dto';

@Controller('v1/me/apply-profiles')
export class ApplyProfilesController {
  constructor(private readonly profiles: ApplyProfilesService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.profiles.list(user);
  }

  @Get(':id')
  get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.profiles.get(user, id);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateApplyProfileDto) {
    return this.profiles.create(user, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateApplyProfileDto,
  ) {
    return this.profiles.update(user, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.profiles.remove(user, id);
  }
}
