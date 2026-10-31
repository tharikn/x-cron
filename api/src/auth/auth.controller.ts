import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessToken, CurrentUser, Public, Roles } from './decorators';
import {
  AdminLoginDto,
  CreateEmployerDto,
  GoogleAuthDto,
  StartOtpDto,
  VerifyOtpDto,
} from './dto/auth.dto';
import type { AuthUser } from './auth.types';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('otp/start')
  startOtp(@Body() dto: StartOtpDto) {
    return this.authService.startOtp(dto);
  }

  @Public()
  @Post('otp/verify')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Public()
  @Post('google')
  google(@Body() dto: GoogleAuthDto) {
    return this.authService.google(dto);
  }

  @Public()
  @Post('admin/login')
  adminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto);
  }

  @Get('me')
  me(@AccessToken() token?: string) {
    return this.authService.me(token);
  }

  @Post('logout')
  logout(@AccessToken() token?: string) {
    return this.authService.logout(token);
  }
}

@Controller('v1/employers')
export class EmployersController {
  constructor(private readonly authService: AuthService) {}

  @Roles('seeker', 'employer', 'admin')
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateEmployerDto) {
    return this.authService.createEmployer(user.id, dto);
  }

  @Roles('employer', 'admin')
  @Get('me')
  me(@CurrentUser() user: AuthUser, @AccessToken() token?: string) {
    return this.authService.me(token);
  }
}
