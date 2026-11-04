import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  AuthThrottle,
  SensitiveThrottle,
} from '../security/decorators';
import {
  extractRefreshToken,
  extractTabId,
} from '../security/token.util';
import { AuthService } from './auth.service';
import { AccessToken, CurrentUser, Public, Roles } from './decorators';
import {
  AdminLoginDto,
  CreateEmployerDto,
  GoogleAuthDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
} from './dto/auth.dto';
import type { AuthUser } from './auth.types';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Create local username/password account. */
  @Public()
  @AuthThrottle()
  @Post('register')
  register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(dto, res, extractTabId(req));
  }

  /** Sign in with local username/password. */
  @Public()
  @AuthThrottle()
  @Post('login')
  login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, res, extractTabId(req));
  }

  @Public()
  @AuthThrottle()
  @Post('google')
  google(
    @Body() dto: GoogleAuthDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.google(dto, res, extractTabId(req));
  }

  /** Super-admin password login — 1 attempt per hour per tracker. */
  @Public()
  @SensitiveThrottle()
  @Post('admin/login')
  adminLogin(
    @Body() dto: AdminLoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.adminLogin(dto, res, extractTabId(req));
  }

  @Public()
  @AuthThrottle()
  @Post('refresh')
  refresh(
    @Body() dto: RefreshTokenDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = extractRefreshToken(req, dto.refreshToken);
    return this.authService.refresh(refreshToken, res, extractTabId(req));
  }

  @Get('me')
  me(@AccessToken() token?: string) {
    return this.authService.me(token);
  }

  @Post('logout')
  logout(
    @AccessToken() token: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(token, res);
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
  me(@AccessToken() token?: string) {
    return this.authService.me(token);
  }
}
