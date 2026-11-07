import { DatePipe, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ApplicationsService,
  type JobApplication,
} from '../../core/services/applications.service';
import { ApplyProfilesService } from '../../core/services/apply-profiles.service';
import {
  AuthService,
  type AuthDeviceSession,
} from '../../core/services/auth.service';
import { GoogleIdentityService } from '../../core/services/google-identity.service';
import { JobsService } from '../../core/services/jobs.service';
import {
  type CareerStage,
  type EducationStatus,
  type NoticePeriod,
  type ProfileCompletion,
  type ProfileCompletionItemId,
  SeekerService,
} from '../../core/services/seeker.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { OnboardingService } from '../../core/services/onboarding.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';
import {
  fieldErrorsFromHttp,
  friendlyHttpMessage,
} from '../../core/utils/friendly-http-message';
import {
  isValidEmail,
  validateSeekerProfileFields,
  type FieldErrors,
} from '../../core/utils/form-validation';
import { formatPostedDate, jobPath } from '../../core/utils/format';
import type { Job } from '../../core/models/job.model';
import { PiiFieldComponent } from '../../shared/pii-field/pii-field.component';

type SignInMode = 'account' | 'admin';
type AccountForm = 'login' | 'register';
export type AccountTab = 'profile' | 'apply' | 'activity' | 'rating' | 'account';

@Component({
  selector: 'app-sign-in',
  imports: [DatePipe, FormsModule, RouterLink, PiiFieldComponent],
  templateUrl: './sign-in.page.html',
  styleUrl: './sign-in.page.scss',
})
export class SignInPage implements OnInit, AfterViewInit {
  private readonly auth = inject(AuthService);
  private readonly seo = inject(SeoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly google = inject(GoogleIdentityService);
  private readonly toast = inject(ToastService);
  private readonly notifications = inject(NotificationsService);
  private readonly onboarding = inject(OnboardingService);
  private readonly seeker = inject(SeekerService);
  private readonly jobApplications = inject(ApplicationsService);
  private readonly applyProfilesApi = inject(ApplyProfilesService);
  private readonly jobsService = inject(JobsService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly googleHost = viewChild<ElementRef<HTMLDivElement>>('googleHost');
  private googleRendered = false;

  readonly isSignedIn = this.auth.isSignedIn;
  readonly isAdmin = this.auth.isAdmin;
  readonly isEmployer = this.auth.isEmployer;
  readonly user = this.auth.user;
  readonly busy = signal(false);
  readonly mode = signal<SignInMode>(this.initialMode());
  readonly accountForm = signal<AccountForm>('login');
  readonly tab = signal<AccountTab>('profile');
  readonly googleConfigured = computed(() => this.google.isConfigured);
  readonly profileName = computed(() => {
    const u = this.user();
    if (!u) return '';
    return (
      u.displayName?.trim() ||
      u.username?.trim() ||
      u.email?.trim() ||
      'Account'
    );
  });
  /** Admin password for Dashboard / Import / Job Fare — never Post (employers use account). */
  readonly needsAdminLogin = computed(() => {
    const modeParam = this.route.snapshot.queryParamMap.get('mode');
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '';
    const wantsAdmin =
      modeParam === 'admin' || this.isAdminReturnUrl(returnUrl);
    return wantsAdmin && !this.isAdmin();
  });
  readonly needsEmployerSignIn = computed(() => {
    const modeParam = this.route.snapshot.queryParamMap.get('mode');
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '';
    const wantsEmployer =
      modeParam === 'employer' ||
      returnUrl.startsWith('/post') ||
      returnUrl.startsWith('/my-jobs');
    return wantsEmployer && !this.auth.isEmployer() && !this.needsAdminLogin();
  });

  readonly savedJobs = this.seeker.saved;
  readonly feedJobs = this.seeker.feed;
  readonly contacted = this.seeker.applications;
  readonly jobApps = this.jobApplications.mine;
  readonly applyProfiles = this.applyProfilesApi.items;
  readonly savedSearches = this.seeker.savedSearches;
  readonly profileCompletion = computed((): ProfileCompletion | null => {
    if (this.isEmployer()) return null;
    const completion = this.seeker.profile()?.completion;
    if (!completion || completion.complete) return null;
    return completion;
  });
  readonly employerApps = signal<JobApplication[]>([]);
  readonly postedJobs = signal<Job[]>([]);
  readonly jobPath = jobPath;

  username = '';
  password = '';
  confirmPassword = '';
  /** Register form: Job Seeker (seeker) or Recruiter (employer). */
  intendedRoleChoice: 'seeker' | 'employer' = 'seeker';
  adminEmail = '';
  adminPassword = '';

  profileDisplayName = '';
  profileMobile = '';
  profileEmail = '';
  showContact = false;
  profileAddress = '';
  profilePincode = '';
  careerStage: CareerStage | '' = '';
  educationStatus: EducationStatus | '' = '';
  openToInternship = false;
  courseDetails = '';
  branchStudied = '';
  academicScore = '';
  experienceYears: number | null = null;
  experienceMonths: number | null = null;
  companyName = '';
  companyArea = '';
  currentSalary = '';
  expectedSalary = '';
  noticePeriod: NoticePeriod | '' = '';
  profileSkills: string[] = [];
  profileCities: string[] = [];
  openToWork = true;
  profileOpen: Record<'personal' | 'location' | 'career', boolean> = {
    personal: true,
    location: false,
    career: true,
  };
  profileFieldErrors: FieldErrors = {};
  readonly noticeOptions: Array<{ value: NoticePeriod; label: string }> = [
    { value: 'serving', label: 'Serving' },
    { value: '1', label: '1 mo' },
    { value: '2', label: '2 mo' },
    { value: '3', label: '3 mo' },
    { value: 'immediate', label: 'Immediate' },
  ];

  applyName = '';
  applyHeadline = '';
  applySummary = '';
  applySkills: string[] = [];
  applySkillDraft = '';
  readonly applySkillMin = 2;
  readonly applySkillMax = 7;
  applyPortfolio = '';
  applyBand: 'fresher' | '0-1' | '1-3' | '3-5' | '5+' | '' = '';
  applyBusy = false;
  editingApplyId: string | null = null;

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Sign in',
      description: 'Sign in to X Cron Jobs with username and password.',
      path: '/sign-in',
    });
    this.tab.set(this.readTab(this.route.snapshot.queryParamMap.get('tab')));
    this.route.queryParamMap.subscribe((params) => {
      this.tab.set(this.readTab(params.get('tab')));
    });
    await this.auth.ensureSession();
    if (this.needsAdminLogin()) {
      this.mode.set('admin');
    } else if (this.isSignedIn() && this.needsEmployerSignIn()) {
      await this.ensureEmployerProfileIfNeeded();
      if (this.auth.isEmployer()) {
        await this.redirectAfterSignIn();
        return;
      }
    }
    if (this.isSignedIn() && !this.needsAdminLogin()) {
      await this.loadAccountHub();
    }
  }

  ngAfterViewInit(): void {
    void this.mountGoogleButton();
  }

  setMode(value: SignInMode): void {
    if (this.needsAdminLogin() && value !== 'admin') return;
    this.mode.set(value);
    if (value === 'account') {
      queueMicrotask(() => void this.mountGoogleButton());
    }
  }

  setAccountForm(value: AccountForm): void {
    this.accountForm.set(value);
    this.confirmPassword = '';
    if (value === 'register') {
      this.intendedRoleChoice = this.needsEmployerSignIn() ? 'employer' : 'seeker';
    }
    if (value === 'login') {
      this.googleRendered = false;
      queueMicrotask(() => void this.mountGoogleButton());
    }
  }

  async setTab(next: AccountTab): Promise<void> {
    const tab = this.clampTab(next);
    this.tab.set(tab);
    await this.router.navigate(['/sign-in'], {
      queryParams: { tab },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
    if (tab === 'account' && this.isSignedIn()) {
      await this.loadSessions();
    }
  }

  readonly deviceSessions = signal<AuthDeviceSession[]>([]);
  readonly sessionsBusy = signal(false);

  formatSessionWhen(iso: string): string {
    return formatPostedDate(iso);
  }

  async loadSessions(): Promise<void> {
    if (!this.isSignedIn()) {
      this.deviceSessions.set([]);
      return;
    }
    this.sessionsBusy.set(true);
    try {
      this.deviceSessions.set(await this.auth.listSessions());
    } catch {
      this.deviceSessions.set([]);
    } finally {
      this.sessionsBusy.set(false);
    }
  }

  async revokeDeviceSession(session: AuthDeviceSession): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    if (session.current) {
      if (
        !window.confirm(
          'Revoke this device? You will be signed out here.',
        )
      ) {
        return;
      }
    }
    this.sessionsBusy.set(true);
    try {
      await this.auth.revokeSession(session.id);
      if (session.current) {
        this.auth.clearSession();
        this.seeker.saved.set([]);
        this.seeker.feed.set([]);
        this.seeker.applications.set([]);
        this.seeker.savedSearches.set([]);
        this.applyProfilesApi.items.set([]);
        this.jobApplications.mine.set([]);
        this.deviceSessions.set([]);
        this.toast.show('Signed out on this device.');
        return;
      }
      await this.loadSessions();
      this.toast.show('Session revoked.');
    } catch {
      this.toast.error('Could not revoke session.');
    } finally {
      this.sessionsBusy.set(false);
    }
  }

  async logoutEverywhere(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    if (
      !window.confirm(
        'Sign out on every device? You will need to sign in again everywhere.',
      )
    ) {
      return;
    }
    this.sessionsBusy.set(true);
    try {
      await this.auth.logoutAll();
      this.seeker.saved.set([]);
      this.seeker.feed.set([]);
      this.seeker.applications.set([]);
      this.seeker.savedSearches.set([]);
      this.applyProfilesApi.items.set([]);
      this.jobApplications.mine.set([]);
      this.deviceSessions.set([]);
      this.toast.show('Signed out everywhere.');
    } catch {
      this.toast.error('Could not sign out everywhere.');
    } finally {
      this.sessionsBusy.set(false);
    }
  }

  async submitAccount(): Promise<void> {
    if (this.accountForm() === 'register') {
      await this.register();
      return;
    }
    await this.login();
  }

  async signInAdmin(): Promise<void> {
    if (!isValidEmail(this.adminEmail) || this.adminPassword.trim().length < 8) {
      this.toast.error('Enter admin email and password.');
      return;
    }
    this.busy.set(true);
    try {
      await this.auth.signInAsAdmin({
        email: this.adminEmail.trim(),
        password: this.adminPassword,
      });
      await this.redirectAfterSignIn();
    } catch (err: unknown) {
      this.toast.error(
        friendlyHttpMessage(err, "Couldn't sign in. Check your email and password."),
      );
    } finally {
      this.busy.set(false);
    }
  }

  async signInWithGoogleStub(): Promise<void> {
    this.busy.set(true);
    try {
      await this.auth.signInWithGoogle({
        email: 'guest@xcron.local',
        displayName: 'Guest',
        intendedRole: this.intendedRole(),
      });
      await this.ensureEmployerProfileIfNeeded();
      await this.redirectAfterSignIn();
    } catch (err: unknown) {
      this.toast.error(
        friendlyHttpMessage(err, 'Google sign-in is not available right now.'),
      );
    } finally {
      this.busy.set(false);
    }
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    this.seeker.saved.set([]);
    this.seeker.feed.set([]);
    this.seeker.applications.set([]);
    this.seeker.savedSearches.set([]);
    this.applyProfilesApi.items.set([]);
    this.jobApplications.mine.set([]);
    this.toast.show('Signed out. Guest browsing still works.');
  }

  async exportAccount(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      await this.seeker.exportAccount();
      this.toast.show('Data export downloaded.');
    } catch {
      this.toast.error('Could not export account data.');
    }
  }

  async deleteAccount(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!window.confirm('Delete this account and all synced data? This cannot be undone.')) {
      return;
    }
    try {
      await this.seeker.deleteAccount();
      await this.auth.logout();
      this.seeker.saved.set([]);
      this.seeker.feed.set([]);
      this.toast.show('Account deleted.');
    } catch {
      this.toast.error('Could not delete account.');
    }
  }

  forgotPassword(): void {
    this.setAccountForm('register');
    this.toast.show(
      'Password reset is not available yet. Create a new account, or use Sign in with Google.',
    );
  }

  toggleProfileSection(key: 'personal' | 'location' | 'career'): void {
    this.profileOpen = {
      ...this.profileOpen,
      [key]: !this.profileOpen[key],
    };
  }

  async focusCompletion(id: ProfileCompletionItemId): Promise<void> {
    if (id === 'applyReady') {
      await this.setTab('apply');
      return;
    }
    if (id === 'skills') {
      await this.router.navigate(['/onboarding/profile']);
      return;
    }
    await this.setTab('profile');
    this.profileOpen = {
      personal: id === 'personal',
      location: id === 'location',
      career: id === 'career',
    };
  }

  setCareerStage(value: CareerStage): void {
    this.careerStage = value;
  }

  setEducationStatus(value: EducationStatus): void {
    this.educationStatus = value;
  }

  setNoticePeriod(value: NoticePeriod): void {
    this.noticePeriod = value;
  }

  clearProfileFieldError(key: string): void {
    if (!this.profileFieldErrors[key]) return;
    const next = { ...this.profileFieldErrors };
    delete next[key];
    this.profileFieldErrors = next;
  }

  async saveProfile(): Promise<void> {
    const clientErrors = validateSeekerProfileFields({
      displayName: this.profileDisplayName,
      mobile: this.profileMobile,
      email: this.profileEmail,
      address: this.profileAddress,
      pincode: this.profilePincode,
      careerStage: this.careerStage,
      courseDetails: this.courseDetails,
      branchStudied: this.branchStudied,
      academicScore: this.academicScore,
      companyName: this.companyName,
      companyArea: this.companyArea,
      currentSalary: this.currentSalary,
      expectedSalary: this.expectedSalary,
      experienceYears: this.experienceYears,
      experienceMonths: this.experienceMonths,
    });
    this.profileFieldErrors = clientErrors;
    if (Object.keys(clientErrors).length) {
      this.toast.error(Object.values(clientErrors)[0] ?? 'Fix the highlighted fields.');
      return;
    }

    try {
      await this.seeker.saveProfile({
        displayName: this.profileDisplayName.trim() || undefined,
        mobile: this.profileMobile.trim() || undefined,
        email: this.profileEmail.trim() || undefined,
        showContact: this.showContact,
        address: this.profileAddress.trim() || undefined,
        pincode: this.profilePincode.trim() || undefined,
        careerStage: this.careerStage || undefined,
        educationStatus: this.educationStatus || undefined,
        openToInternship:
          this.careerStage === 'fresher' ? this.openToInternship : undefined,
        courseDetails:
          this.careerStage === 'fresher'
            ? this.courseDetails.trim() || undefined
            : undefined,
        branchStudied:
          this.careerStage === 'fresher'
            ? this.branchStudied.trim() || undefined
            : undefined,
        academicScore:
          this.careerStage === 'fresher'
            ? this.academicScore.trim() || undefined
            : undefined,
        experienceYears:
          this.careerStage === 'experienced'
            ? this.experienceYears ?? undefined
            : undefined,
        experienceMonths:
          this.careerStage === 'experienced'
            ? this.experienceMonths ?? undefined
            : undefined,
        companyName:
          this.careerStage === 'experienced'
            ? this.companyName.trim() || undefined
            : undefined,
        companyArea:
          this.careerStage === 'experienced'
            ? this.companyArea.trim() || undefined
            : undefined,
        currentSalary:
          this.careerStage === 'experienced'
            ? this.currentSalary.trim() || undefined
            : undefined,
        expectedSalary:
          this.careerStage === 'experienced'
            ? this.expectedSalary.trim() || undefined
            : undefined,
        noticePeriod:
          this.careerStage === 'experienced'
            ? this.noticePeriod || undefined
            : undefined,
        skills: this.profileSkills,
        preferredCities: this.profileCities,
        openToWork: this.openToWork,
      });
      this.profileFieldErrors = {};
      this.toast.show('Profile saved.');
    } catch (err) {
      const apiErrors = fieldErrorsFromHttp(err);
      if (Object.keys(apiErrors).length) {
        this.profileFieldErrors = apiErrors;
        this.toast.error(Object.values(apiErrors)[0] ?? 'Could not save profile.');
        return;
      }
      this.toast.error(friendlyHttpMessage(err, 'Could not save profile.'));
    }
  }

  startEditApply(id?: string): void {
    if (!id) {
      this.editingApplyId = null;
      this.applyName = '';
      this.applyHeadline = '';
      this.applySummary = '';
      this.applySkills = [];
      this.applySkillDraft = '';
      this.applyPortfolio = '';
      this.applyBand = '';
      return;
    }
    const row = this.applyProfiles().find((p) => p.id === id);
    if (!row) return;
    this.editingApplyId = row.id;
    this.applyName = row.name;
    this.applyHeadline = row.headline ?? '';
    this.applySummary = row.summary ?? '';
    this.applySkills = row.skills.slice(0, this.applySkillMax);
    this.applySkillDraft = '';
    this.applyPortfolio = row.portfolioLinks.map((l) => `${l.label}|${l.url}`).join('\n');
    this.applyBand = row.experienceBand ?? '';
  }

  addApplySkill(): void {
    const raw = this.applySkillDraft.trim();
    if (!raw) return;
    if (this.applySkills.length >= this.applySkillMax) {
      this.toast.error(`You can add up to ${this.applySkillMax} skills.`);
      return;
    }
    const key = raw.toLowerCase();
    if (this.applySkills.some((s) => s.toLowerCase() === key)) {
      this.applySkillDraft = '';
      return;
    }
    this.applySkills = [...this.applySkills, raw.slice(0, 60)];
    this.applySkillDraft = '';
  }

  removeApplySkill(skill: string): void {
    this.applySkills = this.applySkills.filter((s) => s !== skill);
  }

  async saveApplyProfile(): Promise<void> {
    if (!this.applyName.trim()) {
      this.toast.error('Give this version a name (e.g. Frontend).');
      return;
    }
    if (this.applySkillDraft.trim()) {
      this.addApplySkill();
    }
    if (
      this.applySkills.length < this.applySkillMin ||
      this.applySkills.length > this.applySkillMax
    ) {
      this.toast.error(
        `Add between ${this.applySkillMin} and ${this.applySkillMax} skills.`,
      );
      return;
    }
    this.applyBusy = true;
    const payload = {
      name: this.applyName.trim(),
      headline: this.applyHeadline.trim() || undefined,
      summary: this.applySummary.trim() || undefined,
      experienceBand: this.applyBand || undefined,
      skills: [...this.applySkills],
      portfolioLinks: this.applyPortfolio
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [label, url] = line.split('|').map((p) => p.trim());
          return { label: label || 'Portfolio', url: url || label };
        })
        .filter((l) => l.url.startsWith('http')),
      isDefault: this.applyProfiles().length === 0,
    };
    try {
      if (this.editingApplyId) {
        await this.applyProfilesApi.update(this.editingApplyId, payload);
      } else {
        await this.applyProfilesApi.create(payload);
      }
      await this.applyProfilesApi.list();
      await this.seeker.loadProfile();
      this.startEditApply();
      this.toast.show('Apply profile version saved.');
    } catch {
      this.toast.error('Could not save apply profile.');
    } finally {
      this.applyBusy = false;
    }
  }

  async setDefaultApply(id: string): Promise<void> {
    try {
      await this.applyProfilesApi.setDefault(id);
      await this.applyProfilesApi.list();
      await this.seeker.loadProfile();
      this.toast.show('Default apply version updated.');
    } catch {
      this.toast.error('Could not set default.');
    }
  }

  async deleteApply(id: string): Promise<void> {
    try {
      await this.applyProfilesApi.remove(id);
      await this.applyProfilesApi.list();
      if (this.editingApplyId === id) this.startEditApply();
      this.toast.show('Apply profile removed.');
    } catch {
      this.toast.error('Could not remove apply profile.');
    }
  }

  async removeSavedJob(jobId: string): Promise<void> {
    try {
      await this.seeker.unsave(jobId);
      this.toast.show('Removed from saved jobs.');
    } catch {
      this.toast.error('Could not remove saved job.');
    }
  }

  async deleteSavedSearch(id: string): Promise<void> {
    try {
      await this.seeker.deleteSavedSearch(id);
      this.toast.show('Saved search removed.');
    } catch {
      this.toast.error('Could not remove saved search.');
    }
  }

  openSavedSearch(row: { query: Record<string, unknown> }): void {
    const q = row.query ?? {};
    const queryParams: Record<string, string> = {};
    const map: Record<string, string> = {
      keyword: 'q',
      q: 'q',
      location: 'location',
      jobType: 'jobType',
      category: 'category',
      language: 'language',
      skills: 'skills',
      salaryMin: 'salaryMin',
      remote: 'remote',
      postedWithin: 'postedWithin',
      walkInOnly: 'walkInOnly',
      verifiedEmployer: 'verifiedEmployer',
      fresher: 'fresher',
      easyApply: 'easyApply',
      sort: 'sort',
    };
    for (const [from, to] of Object.entries(map)) {
      const value = q[from];
      if (value == null || value === '' || value === false) continue;
      queryParams[to] = String(value);
    }
    void this.router.navigate(['/'], { queryParams });
  }

  private async mountGoogleButton(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.google.isConfigured) return;
    if (this.isSignedIn() || this.needsAdminLogin() || this.mode() === 'admin') return;
    const host = this.googleHost()?.nativeElement;
    if (!host || this.googleRendered) return;
    try {
      await this.google.renderButton(host, (idToken) => {
        void this.completeGoogle(idToken);
      });
      this.googleRendered = true;
    } catch {
      // Fallback button remains if GIS fails to mount
    }
  }

  private async completeGoogle(idToken: string): Promise<void> {
    this.busy.set(true);
    try {
      await this.auth.signInWithGoogle({
        idToken,
        intendedRole: this.intendedRole(),
      });
      await this.ensureEmployerProfileIfNeeded();
      await this.redirectAfterSignIn();
    } catch (err: unknown) {
      this.toast.error(
        friendlyHttpMessage(err, "Couldn't sign in with Google. Try again."),
      );
    } finally {
      this.busy.set(false);
    }
  }

  private async register(): Promise<void> {
    const username = this.username.trim();
    if (!/^[a-zA-Z0-9_]{3,32}$/.test(username)) {
      this.toast.error('Username: 3–32 letters, numbers, or underscore.');
      return;
    }
    if (this.password.length < 8) {
      this.toast.error('Password must be at least 8 characters.');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.toast.error('Passwords do not match.');
      return;
    }
    this.busy.set(true);
    try {
      await this.auth.register({
        username,
        password: this.password,
        confirmPassword: this.confirmPassword,
        intendedRole: this.intendedRole(),
      });
      await this.ensureEmployerProfileIfNeeded();
      await this.redirectAfterSignIn();
    } catch (err: unknown) {
      this.toast.error(friendlyHttpMessage(err, 'Could not create account. Please try again.'));
    } finally {
      this.busy.set(false);
    }
  }

  private async login(): Promise<void> {
    const username = this.username.trim();
    if (username.length < 3 || this.password.length < 8) {
      this.toast.error('Enter Username and password.');
      return;
    }
    this.busy.set(true);
    try {
      await this.auth.login({
        username,
        password: this.password,
        intendedRole: this.intendedRole(),
      });
      await this.ensureEmployerProfileIfNeeded();
      await this.redirectAfterSignIn();
    } catch (err: unknown) {
      this.toast.error(
        friendlyHttpMessage(err, "Couldn't sign in. Check your username and password."),
      );
    } finally {
      this.busy.set(false);
    }
  }

  private initialMode(): SignInMode {
    const modeParam = this.route.snapshot.queryParamMap.get('mode');
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '';
    if (modeParam === 'admin' || this.isAdminReturnUrl(returnUrl)) {
      return 'admin';
    }
    return 'account';
  }

  private isAdminReturnUrl(url: string): boolean {
    return (
      url.startsWith('/admin') ||
      url.startsWith('/blog-approval') ||
      url.startsWith('/import') ||
      url.startsWith('/settings/site')
    );
  }

  private intendedRole(): 'seeker' | 'employer' {
    if (this.accountForm() === 'register') {
      return this.intendedRoleChoice;
    }
    return this.needsEmployerSignIn() ? 'employer' : 'seeker';
  }

  private readTab(raw: string | null): AccountTab {
    if (raw === 'apply' || raw === 'activity' || raw === 'rating' || raw === 'account') {
      return this.clampTab(raw);
    }
    return 'profile';
  }

  /** Seeker-only Apply tab — recruiters never land on it. */
  private clampTab(tab: AccountTab): AccountTab {
    if (tab === 'apply' && this.auth.isEmployer()) return 'profile';
    return tab;
  }

  private async loadAccountHub(): Promise<void> {
    try {
      if (this.tab() === 'account') {
        void this.loadSessions();
      }
      const profile = await this.seeker.loadProfile();
      const u = this.user();
      this.profileDisplayName =
        profile.displayName?.trim() ||
        u?.displayName?.trim() ||
        u?.username?.trim() ||
        '';
      this.profileMobile = profile.mobile ?? '';
      this.profileEmail = profile.email?.trim() || u?.email?.trim() || '';
      this.showContact = profile.showContact ?? false;
      this.profileAddress = profile.address ?? '';
      this.profilePincode = profile.pincode ?? '';
      this.careerStage =
        profile.careerStage ??
        (profile.experienceBand === 'fresher'
          ? 'fresher'
          : profile.experienceBand
            ? 'experienced'
            : '');
      this.educationStatus = profile.educationStatus ?? '';
      this.openToInternship = profile.openToInternship ?? false;
      this.courseDetails = profile.courseDetails ?? '';
      this.branchStudied = profile.branchStudied ?? '';
      this.academicScore = profile.academicScore ?? '';
      this.experienceYears = profile.experienceYears ?? null;
      this.experienceMonths = profile.experienceMonths ?? null;
      this.companyName = profile.companyName ?? '';
      this.companyArea = profile.companyArea ?? '';
      this.currentSalary = profile.currentSalary ?? '';
      this.expectedSalary = profile.expectedSalary ?? '';
      this.noticePeriod = profile.noticePeriod ?? '';
      this.profileSkills = profile.skills ?? [];
      this.profileCities = profile.preferredCities ?? [];
      this.openToWork = profile.openToWork;
      this.tab.set(this.clampTab(this.tab()));
      if (this.auth.isEmployer()) {
        const [apps, jobs] = await Promise.all([
          this.jobApplications.listEmployer(),
          this.jobsService.listMyJobs({ page: 1, limit: 10 }),
        ]);
        this.employerApps.set(apps.items.slice(0, 8));
        this.postedJobs.set(jobs.items.slice(0, 8));
      } else {
        await Promise.all([
          this.seeker.loadSaved(),
          this.seeker.loadFeed(),
          this.seeker.loadApplications(),
          this.seeker.loadSavedSearches(),
          this.jobApplications.listMine(),
          this.applyProfilesApi.list(),
        ]);
      }
    } catch {
      // API optional for account chrome
    }
  }

  private async ensureEmployerProfileIfNeeded(): Promise<void> {
    if (!this.auth.isSignedIn()) return;
    const modeParam = this.route.snapshot.queryParamMap.get('mode');
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '';
    const wantsEmployer =
      this.user()?.roles.includes('employer') ||
      modeParam === 'employer' ||
      returnUrl.startsWith('/post') ||
      returnUrl.startsWith('/my-jobs');
    if (!wantsEmployer) return;
    const name =
      this.user()?.displayName?.trim() ||
      this.user()?.username?.trim() ||
      this.user()?.email?.split('@')[0] ||
      'My Business';
    try {
      await this.auth.createEmployer(name);
    } catch {
      // Post page can retry
    }
  }

  private async redirectAfterSignIn(): Promise<void> {
    await this.promptSystemNotifications();
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl?.startsWith('/') && !returnUrl.startsWith('//')) {
      if (this.isAdminReturnUrl(returnUrl) && !this.isAdmin()) {
        this.toast.error('Admin password login is required for Dashboard and Import.');
        this.mode.set('admin');
        return;
      }
      const employerReturn =
        returnUrl.startsWith('/post') || returnUrl.startsWith('/my-jobs');
      if (employerReturn && !this.auth.isEmployer() && !this.isAdmin()) {
        this.toast.error('Employer sign-in is required to post jobs.');
        return;
      }
      if (
        !returnUrl.startsWith('/onboarding/profile') &&
        !this.isAdmin() &&
        !this.auth.isEmployer()
      ) {
        try {
          const profile = await this.seeker.loadProfile();
          if (this.onboarding.shouldForceProfileSetup(profile)) {
            await this.router.navigate(['/onboarding/profile'], {
              queryParams: { returnUrl },
              replaceUrl: true,
            });
            return;
          }
        } catch {
          // fall through to returnUrl
        }
      }
      await this.router.navigateByUrl(returnUrl);
      return;
    }
    if (this.isAdmin()) {
      await this.router.navigateByUrl('/admin');
      return;
    }
    if (this.auth.isEmployer()) {
      await this.router.navigateByUrl('/post');
      return;
    }
    // Seeker: mandatory profile wizard when incomplete (Remind later snoozes).
    try {
      const profile = await this.seeker.loadProfile();
      if (this.onboarding.shouldForceProfileSetup(profile)) {
        await this.router.navigateByUrl('/onboarding/profile');
        return;
      }
    } catch {
      // stay on account hub
    }
    await this.loadAccountHub();
    this.seo.setPage({
      title: this.profileName() || 'Account',
      description: 'Manage your X Cron profile, apply versions, and activity.',
      path: '/sign-in',
      robots: 'noindex,follow',
    });
  }

  /** Ask the browser for OS notification permission right after login. */
  private async promptSystemNotifications(): Promise<void> {
    try {
      await this.notifications.loadPrefs();
      if (this.notifications.prefs().pushAlertsEnabled === false) return;
      const result = await this.notifications.promptOsPermissionAfterSignIn();
      if (!result.asked) return;
      if (result.status === 'granted') {
        this.toast.show('System notifications enabled');
        return;
      }
      if (result.status === 'denied') {
        this.toast.error(
          'System notifications blocked — enable them in browser settings',
        );
      }
    } catch {
      // permission prompt is best-effort
    }
  }
}
