import { KeyValuePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  CompaniesService,
  type CompanyDto,
  type CompanyMemberDto,
  type RecruiterDashboardDto,
} from '../../core/services/companies.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { friendlyHttpMessage } from '../../core/utils/friendly-http-message';

type Tab = 'dashboard' | 'profile' | 'team' | 'verification';

@Component({
  selector: 'app-company-workspace',
  imports: [FormsModule, RouterLink, KeyValuePipe],
  templateUrl: './company-workspace.page.html',
  styleUrl: './company-workspace.page.scss',
})
export class CompanyWorkspacePage implements OnInit {
  private readonly companies = inject(CompaniesService);
  private readonly toast = inject(ToastService);
  private readonly auth = inject(AuthService);

  readonly tab = signal<Tab>('dashboard');
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly company = signal<CompanyDto | null>(null);
  readonly dashboard = signal<RecruiterDashboardDto | null>(null);
  readonly members = signal<CompanyMemberDto[]>([]);
  readonly invitations = signal<
    Array<{
      id: string;
      email: string;
      role: string;
      status: string;
      expiresAt: string;
    }>
  >([]);
  readonly lastInviteLink = signal<string | null>(null);

  name = '';
  legalName = '';
  about = '';
  website = '';
  industry = '';
  sizeBand = '';
  headquarters = '';
  hiringLocationsText = '';

  inviteEmail = '';
  inviteRole = 'recruiter';

  verifyKind = 'website';
  verifyLabel = '';
  verifyReference = '';
  claimedDomain = '';

  transferMemberId = '';
  transferConfirmName = '';

  async ngOnInit(): Promise<void> {
    await this.reload();
  }

  setTab(t: Tab): void {
    this.tab.set(t);
  }

  async reload(): Promise<void> {
    this.loading.set(true);
    try {
      const dash = await this.companies.dashboard();
      this.dashboard.set(dash);
      this.company.set(dash.company);
      this.fillForm(dash.company);
      const team = await this.companies.listMembers(dash.company.id);
      this.members.set(team.items);
      this.invitations.set(team.invitations);
    } catch (err) {
      // No company yet — offer create from display name.
      try {
        const created = await this.companies.create({
          name:
            this.auth.user()?.displayName ||
            this.auth.user()?.username ||
            'My company',
        });
        this.company.set(created);
        this.fillForm(created);
        const dash = await this.companies.dashboard();
        this.dashboard.set(dash);
        const team = await this.companies.listMembers(created.id);
        this.members.set(team.items);
        this.invitations.set(team.invitations);
      } catch (createErr) {
        this.toast.error(friendlyHttpMessage(createErr, 'Could not load company'));
      }
    } finally {
      this.loading.set(false);
    }
  }

  private fillForm(c: CompanyDto): void {
    this.name = c.name || '';
    this.legalName = c.legalName || '';
    this.about = c.about || '';
    this.website = c.website || '';
    this.industry = c.industry || '';
    this.sizeBand = c.sizeBand || '';
    this.headquarters = c.headquarters || '';
    this.hiringLocationsText = (c.hiringLocations || []).join(', ');
  }

  async saveProfile(): Promise<void> {
    const c = this.company();
    if (!c) return;
    this.saving.set(true);
    try {
      const updated = await this.companies.patch(c.id, {
        name: this.name.trim(),
        legalName: this.legalName.trim() || undefined,
        about: this.about.trim(),
        website: this.website.trim() || undefined,
        industry: this.industry.trim() || undefined,
        sizeBand: this.sizeBand || undefined,
        headquarters: this.headquarters.trim() || undefined,
        hiringLocations: this.hiringLocationsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      });
      this.company.set(updated);
      this.toast.success('Company profile saved');
    } catch (err) {
      this.toast.error(friendlyHttpMessage(err, 'Save failed'));
    } finally {
      this.saving.set(false);
    }
  }

  async sendInvite(): Promise<void> {
    const c = this.company();
    if (!c || !this.inviteEmail.trim()) return;
    this.saving.set(true);
    try {
      const inv = await this.companies.invite(c.id, {
        email: this.inviteEmail.trim(),
        role: this.inviteRole,
      });
      this.lastInviteLink.set(
        `${window.location.origin}/company-invitations/${inv.acceptToken}/accept`,
      );
      this.inviteEmail = '';
      this.toast.success('Invite created — share the accept link');
      const team = await this.companies.listMembers(c.id);
      this.members.set(team.items);
      this.invitations.set(team.invitations);
    } catch (err) {
      this.toast.error(friendlyHttpMessage(err, 'Invite failed'));
    } finally {
      this.saving.set(false);
    }
  }

  async revokeMember(m: CompanyMemberDto): Promise<void> {
    const c = this.company();
    if (!c) return;
    if (!confirm(`Revoke access for ${m.displayName || m.username || m.email}?`)) {
      return;
    }
    try {
      await this.companies.patchMember(c.id, m.id, { status: 'revoked' });
      this.toast.success('Member revoked');
      const team = await this.companies.listMembers(c.id);
      this.members.set(team.items);
    } catch (err) {
      this.toast.error(friendlyHttpMessage(err, 'Revoke failed'));
    }
  }

  async submitVerification(): Promise<void> {
    const c = this.company();
    if (!c) return;
    this.saving.set(true);
    try {
      const updated = await this.companies.submitVerification(c.id, {
        kind: this.verifyKind,
        label: this.verifyLabel.trim() || this.verifyKind,
        reference: this.verifyReference.trim(),
        claimedEmailDomain: this.claimedDomain.trim() || undefined,
      });
      this.company.set(updated);
      this.verifyLabel = '';
      this.verifyReference = '';
      this.toast.success('Evidence submitted — pending review');
    } catch (err) {
      this.toast.error(friendlyHttpMessage(err, 'Submit failed'));
    } finally {
      this.saving.set(false);
    }
  }

  async transferOwnership(): Promise<void> {
    const c = this.company();
    if (!c) return;
    this.saving.set(true);
    try {
      const updated = await this.companies.transferOwnership(c.id, {
        targetMemberId: this.transferMemberId,
        confirmCompanyName: this.transferConfirmName,
      });
      this.company.set(updated);
      this.transferMemberId = '';
      this.transferConfirmName = '';
      this.toast.success('Ownership transferred');
      await this.reload();
    } catch (err) {
      this.toast.error(friendlyHttpMessage(err, 'Transfer failed'));
    } finally {
      this.saving.set(false);
    }
  }

  responseLabel(indicator: string | null | undefined): string {
    switch (indicator) {
      case 'actively_reviewing':
        return 'Actively reviewing';
      case 'usually_responds':
        return 'Usually responds';
      case 'building':
        return 'Building response habits';
      default:
        return 'Not enough data yet';
    }
  }
}
