import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApplyProfilesService } from '../../core/services/apply-profiles.service';
import { ApplicationsService } from '../../core/services/applications.service';
import { AuthService } from '../../core/services/auth.service';
import { SeekerService } from '../../core/services/seeker.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';
import { ViewedJobsService } from '../../core/services/viewed-jobs.service';
import { jobPath } from '../../core/utils/format';

@Component({
  selector: 'app-seeker',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './seeker.page.html',
  styleUrl: './seeker.page.scss',
})
export class SeekerPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly seeker = inject(SeekerService);
  private readonly applications = inject(ApplicationsService);
  private readonly applyProfilesApi = inject(ApplyProfilesService);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);
  readonly viewed = inject(ViewedJobsService);

  readonly isSignedIn = this.auth.isSignedIn;
  readonly saved = this.seeker.saved;
  readonly feed = this.seeker.feed;
  readonly jobApps = this.applications.mine;
  readonly applyProfiles = this.applyProfilesApi.items;
  readonly error = signal<string | null>(null);
  readonly removingId = signal<string | null>(null);
  readonly jobPath = jobPath;

  versionName = '';
  versionHeadline = '';
  versionSkills: string[] = [];
  versionSkillDraft = '';
  readonly skillMin = 2;
  readonly skillMax = 7;
  versionSummary = '';
  versionLinks = '';
  versionBusy = false;

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Saved jobs',
      description: 'Saved jobs, apply profile versions, and personalised feed on X Cron.',
      path: '/me',
      robots: 'noindex,follow',
    });
    await this.auth.ensureSession();
    if (!this.auth.isSignedIn()) return;
    try {
      await Promise.all([
        this.seeker.loadSaved(),
        this.seeker.loadFeed(),
        this.applications.listMine(),
        this.applyProfilesApi.list(),
      ]);
    } catch {
      this.error.set('Could not load your jobs.');
    }
  }

  addVersionSkill(): void {
    const raw = this.versionSkillDraft.trim();
    if (!raw) return;
    if (this.versionSkills.length >= this.skillMax) {
      this.toast.show(`You can add up to ${this.skillMax} skills.`, 'error');
      return;
    }
    const key = raw.toLowerCase();
    if (this.versionSkills.some((s) => s.toLowerCase() === key)) {
      this.versionSkillDraft = '';
      return;
    }
    this.versionSkills = [...this.versionSkills, raw.slice(0, 60)];
    this.versionSkillDraft = '';
  }

  removeVersionSkill(skill: string): void {
    this.versionSkills = this.versionSkills.filter((s) => s !== skill);
  }

  async saveVersion(): Promise<void> {
    if (!this.versionName.trim()) {
      this.toast.show('Name this version (e.g. Frontend).', 'error');
      return;
    }
    if (this.versionSkillDraft.trim()) {
      this.addVersionSkill();
    }
    if (
      this.versionSkills.length < this.skillMin ||
      this.versionSkills.length > this.skillMax
    ) {
      this.toast.show(
        `Add between ${this.skillMin} and ${this.skillMax} skills.`,
        'error',
      );
      return;
    }
    this.versionBusy = true;
    try {
      await this.applyProfilesApi.create({
        name: this.versionName.trim(),
        headline: this.versionHeadline.trim() || undefined,
        summary: this.versionSummary.trim() || undefined,
        skills: [...this.versionSkills],
        portfolioLinks: this.versionLinks
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const [label, url] = line.split('|').map((p) => p.trim());
            return { label: label || 'Portfolio', url: url || label };
          })
          .filter((l) => l.url.startsWith('http')),
        isDefault: this.applyProfiles().length === 0,
      });
      await this.applyProfilesApi.list();
      this.versionName = '';
      this.versionHeadline = '';
      this.versionSkills = [];
      this.versionSkillDraft = '';
      this.versionSummary = '';
      this.versionLinks = '';
      this.toast.show('Apply profile version saved.');
    } catch {
      this.toast.show('Could not save apply profile.', 'error');
    } finally {
      this.versionBusy = false;
    }
  }

  async setDefault(id: string): Promise<void> {
    try {
      await this.applyProfilesApi.setDefault(id);
      await this.applyProfilesApi.list();
      this.toast.show('Default version updated.');
    } catch {
      this.toast.show('Could not set default.', 'error');
    }
  }

  async removeVersion(id: string): Promise<void> {
    try {
      await this.applyProfilesApi.remove(id);
      await this.applyProfilesApi.list();
      this.toast.show('Version removed.');
    } catch {
      this.toast.show('Could not remove version.', 'error');
    }
  }

  async removeSaved(jobId: string): Promise<void> {
    if (this.removingId()) return;
    this.removingId.set(jobId);
    try {
      await this.seeker.unsave(jobId);
      this.toast.show('Removed from saved jobs.');
    } catch {
      this.toast.show('Could not remove saved job.', 'error');
    } finally {
      this.removingId.set(null);
    }
  }
}
