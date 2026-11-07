import { Injectable } from '@nestjs/common';
import { ApplicationsService } from '../applications/applications.service';
import { ApplyProfilesService } from '../apply-profiles/apply-profiles.service';
import { AuthService } from '../auth/auth.service';
import { FeedbackService } from '../feedback/feedback.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentsService } from '../payments/payments.service';
import { PreferencesService } from '../preferences/preferences.service';
import { ReputationService } from '../reputation/reputation.service';
import { AuditService } from '../security/audit.service';
import { SeekerService } from '../seeker/seeker.service';
import { TrackingService } from '../tracking/tracking.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly auth: AuthService,
    private readonly payments: PaymentsService,
    private readonly preferences: PreferencesService,
    private readonly seeker: SeekerService,
    private readonly applyProfiles: ApplyProfilesService,
    private readonly applications: ApplicationsService,
    private readonly feedback: FeedbackService,
    private readonly notifications: NotificationsService,
    private readonly reputation: ReputationService,
    private readonly tracking: TrackingService,
    private readonly audit: AuditService,
  ) {}

  /**
   * DPDP-oriented portable export of the caller's stored account data.
   * Omits password digests, refresh tokens, and raw provider secrets.
   */
  async exportAccount(token?: string) {
    const user = this.auth.requireUser(token);
    const publicUser = this.auth.me(token);
    const [profile, applyProfiles, applications, savedJobs, hiddenJobs, savedSearches, notifPrefs] =
      await Promise.all([
        this.seeker.getProfile(user),
        this.applyProfiles.list(user),
        this.applications.listMine(user),
        this.seeker.listSaved(user),
        this.seeker.listHidden(user),
        this.seeker.listSavedSearches(user),
        this.notifications.getNotificationPreferences(user),
      ]);

    const preferences = this.preferences.getForUser(user);

    this.audit.record('account.export', {
      actorUserId: user.id,
      targetUserId: user.id,
    });

    return {
      exportedAt: new Date().toISOString(),
      schemaVersion: 1,
      notice:
        'Personal data export for your X Cron account. Passwords and session secrets are never included. Keep this file private.',
      account: publicUser,
      preferences,
      notificationPreferences: notifPrefs,
      seekerProfile: profile,
      applyProfiles: applyProfiles.items,
      applications: applications.items,
      savedJobs,
      hiddenJobs,
      savedSearches,
    };
  }

  async deleteAccount(token?: string) {
    const user = this.auth.requireUser(token);
    this.audit.record('account.delete', {
      actorUserId: user.id,
      targetUserId: user.id,
    });
    await this.payments.wipeUser(user.id);
    this.preferences.clearForUser(user);
    await this.seeker.clearUser(user.id);
    await this.applyProfiles.clearForUser(user.id);
    await this.applications.clearForUser(user.id);
    await this.feedback.clearForUser(user.id);
    await this.reputation.clearForUser(user.id);
    await this.notifications.clearForUser(user);
    await this.tracking.clearForUser(user.id);
    this.auth.purgeUserRecord(user.id, token);
    return {
      ok: true,
      message: 'Account and associated entitlements/preferences were deleted.',
    };
  }
}
