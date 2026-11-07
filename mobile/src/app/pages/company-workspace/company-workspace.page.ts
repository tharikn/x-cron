import { KeyValuePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import {
  CompaniesService,
  type CompanyDto,
  type CompanyMemberDto,
  type RecruiterDashboardDto,
} from '../../core/services/companies.service';
import { AuthService } from '../../core/services/auth.service';
import { friendlyHttpMessage } from '../../core/utils/friendly-http-message';

type Tab = 'dashboard' | 'profile' | 'team' | 'verification';

@Component({
  selector: 'app-company-workspace',
  imports: [
    FormsModule,
    RouterLink,
    KeyValuePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonButton,
  ],
  templateUrl: './company-workspace.page.html',
  styleUrl: './company-workspace.page.scss',
})
export class CompanyWorkspacePage implements OnInit {
  private readonly companies = inject(CompaniesService);
  private readonly toastController = inject(ToastController);
  private readonly auth = inject(AuthService);

  readonly tab = signal<Tab>('dashboard');
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly company = signal<CompanyDto | null>(null);
  readonly dashboard = signal<RecruiterDashboardDto | null>(null);
  readonly members = signal<CompanyMemberDto[]>([]);
  readonly invitations = signal<
    Array<{ id: string; email: string; role: string; status: string; expiresAt: string }>
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
    } catch {
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
        await this.toast(
          friendlyHttpMessage(createErr, 'Could not load company'),
          'danger',
        );
      }
    } finally {
      this.loading.set(false);
    }
  }

  private async toast(message: string, color: 'success' | 'danger' = 'success') {
    const t = await this.toastController.create({
      message,
      duration: 2800,
      color,
      position: 'bottom',
    });
    await t.present();
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
      await this.toast('Company profile saved');
    } catch (err) {
      await this.toast(friendlyHttpMessage(err, 'Save failed'), 'danger');
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
        `${window.location.origin}/tabs/company-invitations/${inv.acceptToken}/accept`,
      );
      this.inviteEmail = '';
      await this.toast('Invite created');
      const team = await this.companies.listMembers(c.id);
      this.members.set(team.items);
      this.invitations.set(team.invitations);
    } catch (err) {
      await this.toast(friendlyHttpMessage(err, 'Invite failed'), 'danger');
    } finally {
      this.saving.set(false);
    }
  }

  async revokeMember(m: CompanyMemberDto): Promise<void> {
    const c = this.company();
    if (!c) return;
    try {
      await this.companies.patchMember(c.id, m.id, { status: 'revoked' });
      await this.toast('Member revoked');
      const team = await this.companies.listMembers(c.id);
      this.members.set(team.items);
    } catch (err) {
      await this.toast(friendlyHttpMessage(err, 'Revoke failed'), 'danger');
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
      await this.toast('Evidence submitted');
    } catch (err) {
      await this.toast(friendlyHttpMessage(err, 'Submit failed'), 'danger');
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
