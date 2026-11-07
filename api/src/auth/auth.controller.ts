import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  AuthThrottle,
  SensitiveThrottle,
} from '../security/decorators';
import {
  extractClientIp,
  extractRefreshToken,
  extractTabId,
  extractUserAgent,
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
  StaffRolesDto,
} from './dto/auth.dto';
import type { AuthUser } from './auth.types';

function clientSessionOpts(req: Request) {
  return {
    tabId: extractTabId(req),
    ip: extractClientIp(req),
    userAgent: extractUserAgent(req),
  };
}

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
    return this.authService.register(dto, res, clientSessionOpts(req));
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
    return this.authService.login(dto, res, clientSessionOpts(req));
  }

  @Public()
  @AuthThrottle()
  @Post('google')
  google(
    @Body() dto: GoogleAuthDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.google(dto, res, clientSessionOpts(req));
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
    return this.authService.adminLogin(dto, res, clientSessionOpts(req));
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
    return this.authService.refresh(refreshToken, res, clientSessionOpts(req));
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

  /** Revoke every session for the caller. */
  @Post('logout-all')
  logoutAll(
    @AccessToken() token: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logoutAll(token, res);
  }

  /** List active sessions (no token secrets). */
  @Get('sessions')
  sessions(@AccessToken() token?: string) {
    return this.authService.listSessions(token);
  }

  /** Revoke one session by id. Revoking the current session clears cookies. */
  @Delete('sessions/:sessionId')
  revokeSession(
    @AccessToken() token: string | undefined,
    @Param('sessionId') sessionId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.revokeSession(token, sessionId, res);
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

@Controller('v1/admin/staff')
export class StaffController {
  constructor(private readonly authService: AuthService) {}

  @Roles('admin')
  @Post('roles')
  setRoles(@CurrentUser() user: AuthUser, @Body() dto: StaffRolesDto) {
    return this.authService.setStaffRoles(user, dto);
  }
}
