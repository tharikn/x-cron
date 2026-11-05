import { Controller, Get, Param, Query } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import { ReputationService } from './reputation.service';
import type { ReputationRole } from './reputation.types';

@Controller('v1/reputation')
export class ReputationController {
  constructor(private readonly reputation: ReputationService) {}

  /** Own scores + event ledger + tips (seeker and/or employer). */
  @Get('me')
  me(
    @CurrentUser() user: AuthUser,
    @Query('role') role?: string,
  ) {
    const r =
      role === 'seeker' || role === 'employer'
        ? (role as ReputationRole)
        : undefined;
    return this.reputation.getMine(user, r);
  }

  /** Public band for counterpart (application cards). */
  @Get('users/:userId')
  forUser(
    @Param('userId') userId: string,
    @Query('role') role = 'seeker',
  ) {
    const r: ReputationRole = role === 'employer' ? 'employer' : 'seeker';
    return this.reputation.getPublic(userId, r);
  }
}
