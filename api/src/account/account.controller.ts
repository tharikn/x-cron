import { Controller, Delete, Get, Header, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AccessToken } from '../auth/decorators';
import { clearAuthCookies } from '../security/auth-cookies';
import { AuthThrottle, SensitiveThrottle } from '../security/decorators';
import { AccountService } from './account.service';

@Controller('v1')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  /** Portable personal-data export (JSON download). */
  @AuthThrottle()
  @Get('me/export')
  @Header('Cache-Control', 'no-store')
  async exportMe(
    @AccessToken() token: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const payload = await this.accountService.exportAccount(token);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="xcron-data-export-${payload.exportedAt.slice(0, 10)}.json"`,
    );
    return payload;
  }

  @SensitiveThrottle()
  @Delete('me')
  async deleteMe(
    @AccessToken() token: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.accountService.deleteAccount(token);
    clearAuthCookies(res);
    return result;
  }

  @SensitiveThrottle()
  @Delete('auth/me')
  async deleteAuthMe(
    @AccessToken() token: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.accountService.deleteAccount(token);
    clearAuthCookies(res);
    return result;
  }
}
