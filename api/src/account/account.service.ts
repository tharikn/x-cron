import { Injectable } from '@nestjs/common';
import { ApplicationsService } from '../applications/applications.service';
import { ApplyProfilesService } from '../apply-profiles/apply-profiles.service';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentsService } from '../payments/payments.service';
import { PreferencesService } from '../preferences/preferences.service';
import { ReputationService } from '../reputation/reputation.service';
import { SeekerService } from '../seeker/seeker.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly auth: AuthService,
    private readonly payments: PaymentsService,
    private readonly preferences: PreferencesService,
    private readonly seeker: SeekerService,
    private readonly applyProfiles: ApplyProfilesService,
    private readonly applications: ApplicationsService,
    private readonly notifications: NotificationsService,
    private readonly reputation: ReputationService,
  ) {}

  async deleteAccount(token?: string) {
    const user = this.auth.requireUser(token);
    await this.payments.wipeUser(user.id);
    this.preferences.clearForUser(user);
    this.seeker.clearUser(user.id);
    await this.applyProfiles.clearForUser(user.id);
    await this.applications.clearForUser(user.id);
    await this.reputation.clearForUser(user.id);
    await this.notifications.clearForUser(user);
    this.auth.purgeUserRecord(user.id, token);
    return {
      ok: true,
      message: 'Account and associated entitlements/preferences were deleted.',
    };
  }
}
