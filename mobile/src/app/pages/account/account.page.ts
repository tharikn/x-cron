import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AlertController,
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToggle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import type { Job } from '../../core/models/job.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AuthService } from '../../core/services/auth.service';
import { GoogleIdentityService } from '../../core/services/google-identity.service';
import { JobsService } from '../../core/services/jobs.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { PreferencesService } from '../../core/services/preferences.service';
import {
  ApplicationsService,
  type JobApplication,
} from '../../core/services/applications.service';
import { ApplyProfilesService } from '../../core/services/apply-profiles.service';
import {
  type CareerStage,
  type EducationStatus,
  type NoticePeriod,
  SeekerService,
} from '../../core/services/seeker.service';
import {
  fieldErrorsFromHttp,
  friendlyHttpMessage,
} from '../../core/utils/friendly-http-message';
import {
  isValidEmail,
  validateSeekerProfileFields,
  type FieldErrors,
} from '../../core/utils/form-validation';
import { PiiFieldComponent } from '../../shared/pii-field/pii-field.component';

export type AccountTab = 'profile' | 'apply' | 'activity' | 'rating' | 'account';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    TranslatePipe,
    PiiFieldComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonAccordionGroup,
    IonAccordion,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonButton,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonToggle,
  ],
})
export class AccountPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly google = inject(GoogleIdentityService);
  private readonly jobsService = inject(JobsService);
  private readonly preferences = inject(PreferencesService);
  private readonly notifications = inject(NotificationsService);
  private readonly seeker = inject(SeekerService);
  private readonly jobApplications = inject(ApplicationsService);
  private readonly applyProfilesApi = inject(ApplyProfilesService);
  private readonly toastController = inject(ToastController);
  private readonly alertController = inject(AlertController);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly user = this.auth.user;
  readonly employer = this.auth.employer;
  readonly isSignedIn = this.auth.isSignedIn;
  readonly isAdmin = this.auth.isAdmin;
  readonly profileLabel = computed(() => {
    const u = this.auth.user();
    if (!u) return 'Account';
    return (
      u.displayName?.trim() ||
      u.username?.trim() ||
      u.email?.trim() ||
      'Account'
    );
  });
  readonly queue = signal<Job[]>([]);
  readonly inbox = this.notifications.items;
  readonly savedJobs = this.seeker.saved;
  readonly feedJobs = this.seeker.feed;
  readonly applications = this.seeker.applications;
  readonly jobApps = this.jobApplications.mine;
  readonly applyProfiles = this.applyProfilesApi.items;
  readonly savedSearches = this.seeker.savedSearches;
  readonly employerApps = signal<JobApplication[]>([]);
  readonly postedJobs = signal<Job[]>([]);
  readonly profile = this.seeker.profile;
  readonly isEmployer = this.auth.isEmployer;
  /** Profile form — personal / location / career */
  profileName = '';
  profileMobile = '';
  profileEmail = '';
  showContact = false;
  profileAddress = '';
  profilePincode = '';
  profileFieldErrors: FieldErrors = {};
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
  /** Preserved for feed ranking when saving profile */
  profileSkills: string[] = [];
  profileCities: string[] = [];
  openToWork = true;
  profileAccordion: string | string[] = ['personal', 'career'];
  readonly noticeOptions: Array<{ value: NoticePeriod; label: string }> = [
    { value: 'serving', label: 'Serving' },
    { value: '1', label: '1 mo' },
    { value: '2', label: '2 mo' },
    { value: '3', label: '3 mo' },
    { value: 'immediate', label: 'Immediate' },
  ];
  /** Draft for a new / edited apply-profile version (no CV). */
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
  /** Import / Job Fare / explicit admin mode — never Post (employers use Google). */
  readonly needsAdminLogin = computed(() => {
    const modeParam = this.route.snapshot.queryParamMap.get('mode');
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '';
    const wantsAdmin =
      modeParam === 'admin' ||
      returnUrl.startsWith('/tabs/import') ||
      returnUrl.startsWith('/tabs/job-fare');
    return wantsAdmin && !this.isAdmin();
  });
  readonly needsEmployerSignIn = computed(() => {
    const modeParam = this.route.snapshot.queryParamMap.get('mode');
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '';
    const wantsEmployer =
      modeParam === 'employer' || returnUrl.startsWith('/tabs/post');
    return wantsEmployer && !this.isEmployer() && !this.needsAdminLogin();
  });

  accountForm: 'login' | 'register' = 'login';
  /** Register form: Job Seeker (seeker) or Recruiter (employer). */
  intendedRoleChoice: 'seeker' | 'employer' = 'seeker';
  username = '';
  password = '';
  confirmPassword = '';
  authBusy = false;
  readonly tab = signal<AccountTab>('profile');

  async ngOnInit(): Promise<void> {
    this.tab.set(this.readTab(this.route.snapshot.queryParamMap.get('tab')));
    this.route.queryParamMap.subscribe((params) => {
      this.tab.set(this.readTab(params.get('tab')));
    });
    await this.auth.ensureSession();
    if (this.isSignedIn() && this.needsEmployerSignIn()) {
      await this.ensureEmployerProfileIfNeeded();
      if (this.isEmployer()) {
        await this.afterSignIn();
        await this.redirectIfNeeded();
        return;
      }
    }
    if (this.isSignedIn() && !this.needsAdminLogin()) {
      await this.afterSignIn();
      await this.redirectIfNeeded();
      return;
    }
    if (this.needsAdminLogin() && !this.isAdmin()) {
      // Keep current session visible; prompt admin password only when needed.
      await this.signInAsAdmin();
    } else if (this.isSignedIn()) {
      await this.afterSignIn();
      await this.redirectIfNeeded();
    }
  }

  async onTabChange(value: string | number | undefined): Promise<void> {
    const next = this.clampTab(this.readTab(value == null ? null : String(value)));
    this.tab.set(next);
    await this.router.navigate(['/tabs/account'], {
      queryParams: { tab: next },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private readTab(raw: string | null): AccountTab {
    if (raw === 'apply' || raw === 'activity' || raw === 'rating' || raw === 'account') {
      return this.clampTab(raw);
    }
    return 'profile';
  }

  /** Seeker-only Apply tab — recruiters never land on it. */
  private clampTab(tab: AccountTab): AccountTab {
    if (tab === 'apply' && this.isEmployer()) return 'profile';
    return tab;
  }

  async signInAsAdmin(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Admin sign in',
      message: 'Use the SUPER_ADMIN email and password for Import, Job Fare, and moderation.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'superadmin@xcron.app',
          value: '',
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Password',
        },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Sign in',
          handler: (data) => {
            void this.completeAdminLogin(data?.email, data?.password);
            return false;
          },
        },
      ],
    });
    await alert.present();
  }

  setAccountForm(value: 'login' | 'register'): void {
    this.accountForm = value;
    this.confirmPassword = '';
    if (value === 'register') {
      this.intendedRoleChoice = this.needsEmployerSignIn() ? 'employer' : 'seeker';
    }
  }

  async submitAccount(): Promise<void> {
    if (this.accountForm === 'register') {
      await this.registerAccount();
      return;
    }
    await this.loginAccount();
  }

  async signInWithGoogle(): Promise<void> {
    this.authBusy = true;
    try {
      const intendedRole = this.resolveIntendedRole();
      if (this.google.isConfigured) {
        const idToken = await this.google.requestIdToken();
        await this.auth.signInWithGoogle({ idToken, intendedRole });
      } else {
        await this.auth.signInWithGoogle({
          email: 'guest@xcron.local',
          displayName: 'Guest',
          intendedRole,
        });
      }
      await this.ensureEmployerProfileIfNeeded();
      await this.afterSignIn();
      await this.showToast('Signed in with Google.');
      await this.redirectIfNeeded();
    } catch (err: unknown) {
      await this.showToast(
        friendlyHttpMessage(err, "Couldn't sign in with Google. Try again."),
        'error',
      );
    } finally {
      this.authBusy = false;
    }
  }

  async forgotPassword(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Forgot password',
      message:
        'Password reset is not available yet. Create a new account, or use Sign in with Google as a guest.',
      buttons: [
        { text: 'OK', role: 'cancel' },
        {
          text: 'Sign Up',
          handler: () => {
            this.setAccountForm('register');
          },
        },
      ],
    });
    await alert.present();
  }

  private async registerAccount(): Promise<void> {
    const username = this.username.trim();
    if (!/^[a-zA-Z0-9_]{3,32}$/.test(username)) {
      await this.showToast('Username: 3–32 letters, numbers, or underscore.', 'error');
      return;
    }
    if (this.password.length < 8) {
      await this.showToast('Password must be at least 8 characters.', 'error');
      return;
    }
    if (this.password !== this.confirmPassword) {
      await this.showToast('Passwords do not match.', 'error');
      return;
    }
    this.authBusy = true;
    const intendedRole = this.intendedRoleChoice;
    try {
      await this.auth.register({
        username,
        password: this.password,
        confirmPassword: this.confirmPassword,
        intendedRole,
      });
      await this.ensureEmployerProfileIfNeeded();
      await this.afterSignIn();
      await this.showToast(
        intendedRole === 'employer'
          ? 'Recruiter account created. You can post jobs.'
          : 'Account created.',
      );
      await this.redirectIfNeeded();
    } catch (err: unknown) {
      await this.showToast(
        friendlyHttpMessage(err, 'Could not create account. Please try again.'),
        'error',
      );
    } finally {
      this.authBusy = false;
    }
  }

  private resolveIntendedRole(): 'seeker' | 'employer' {
    if (this.accountForm === 'register') {
      return this.intendedRoleChoice;
    }
    return this.needsEmployerSignIn() ? 'employer' : 'seeker';
  }

  private async loginAccount(): Promise<void> {
    const username = this.username.trim();
    if (username.length < 3 || this.password.length < 8) {
      await this.showToast('Enter Username and password.', 'error');
      return;
    }
    this.authBusy = true;
    const intendedRole = this.needsEmployerSignIn() ? 'employer' : 'seeker';
    try {
      await this.auth.login({
        username,
        password: this.password,
        intendedRole,
      });
      await this.ensureEmployerProfileIfNeeded();
      await this.afterSignIn();
      await this.showToast(
        intendedRole === 'employer'
          ? 'Signed in as recruiter. You can post jobs.'
          : 'Signed in.',
      );
      await this.redirectIfNeeded();
    } catch (err: unknown) {
      await this.showToast(
        friendlyHttpMessage(err, "Couldn't sign in. Check your username and password."),
        'error',
      );
    } finally {
      this.authBusy = false;
    }
  }

  private async completeAdminLogin(email?: string, password?: string): Promise<void> {
    const adminEmail = (email ?? '').trim();
    if (!isValidEmail(adminEmail) || !password || password.length < 8) {
      await this.showToast('Enter a valid admin email and password.', 'error');
      return;
    }
    try {
      await this.auth.signInAsAdmin({
        email: adminEmail,
        password,
      });
      const top = await this.alertController.getTop();
      await top?.dismiss();
      await this.afterSignIn();
      await this.showToast('Signed in as super admin.');
      await this.redirectIfNeeded();
    } catch (err: unknown) {
      await this.showToast(
        friendlyHttpMessage(err, "Couldn't sign in. Check your email and password."),
        'error',
      );
    }
  }

  /** Employer role alone is not enough for Post — create profile if missing. */
  private async ensureEmployerProfileIfNeeded(): Promise<void> {
    if (!this.auth.isSignedIn() || this.auth.employer()) return;
    const modeParam = this.route.snapshot.queryParamMap.get('mode');
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '';
    const wantsEmployer =
      this.auth.user()?.roles.includes('employer') ||
      modeParam === 'employer' ||
      returnUrl.startsWith('/tabs/post');
    if (!wantsEmployer) return;
    const name =
      this.auth.user()?.displayName?.trim() ||
      this.auth.user()?.username?.trim() ||
      this.auth.user()?.email?.split('@')[0] ||
      'My Business';
    try {
      await this.auth.createEmployer(name);
    } catch {
      // Post page can retry createEmployer
    }
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    this.queue.set([]);
    this.notifications.items.set([]);
    this.seeker.saved.set([]);
    this.seeker.feed.set([]);
    await this.showToast('Signed out. Guest browsing still works.');
  }

  async deleteAccount(): Promise<void> {
    try {
      await this.seeker.deleteAccount();
      await this.auth.logout();
      this.queue.set([]);
      this.seeker.saved.set([]);
      await this.showToast('Account deleted.');
    } catch {
      await this.showToast('Could not delete account.', 'error');
    }
  }

  async markRead(id: string): Promise<void> {
    try {
      await this.notifications.markRead(id);
    } catch {
      await this.showToast('Could not mark notification read.', 'error');
    }
  }

  async refreshInbox(): Promise<void> {
    try {
      await this.notifications.refreshInbox();
    } catch {
      await this.showToast('Could not load notifications.', 'error');
    }
  }

  private async afterSignIn(): Promise<void> {
    try {
      await this.preferences.hydrate();
      await this.notifications.registerDevice();
      await this.notifications.loadPrefs();
      await this.notifications.refreshInbox({ announce: false });
      if (this.notifications.prefs().pushAlertsEnabled !== false) {
        const result = await this.notifications.promptOsPermissionAfterSignIn();
        if (result.asked) {
          await this.showToast(
            result.status === 'granted'
              ? 'System notifications enabled'
              : result.status === 'denied'
                ? 'System notifications blocked — enable them in phone settings'
                : 'Could not enable system notifications',
            result.status === 'granted' ? 'success' : 'error',
          );
        }
        await this.notifications.registerDevice();
      }
      this.notifications.startPolling();
      this.tab.set(this.clampTab(this.tab()));
      if (this.isEmployer()) {
        const [apps, jobs] = await Promise.all([
          this.jobApplications.listEmployer(),
          this.jobsService.listMyJobs({ page: 1, limit: 10 }),
        ]);
        this.employerApps.set(apps.slice(0, 8));
        this.postedJobs.set(jobs.items.slice(0, 8));
      } else {
        await this.seeker.loadSaved();
        await this.seeker.loadFeed();
        await this.seeker.loadApplications();
        await this.jobApplications.listMine();
        await this.applyProfilesApi.list();
        await this.seeker.loadSavedSearches();
      }
      const profile = await this.seeker.loadProfile();
      this.applyLoadedProfile(profile);
    } catch {
      // API optional for account chrome
    }
    if (this.isAdmin()) await this.reloadQueue();
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

  private applyLoadedProfile(profile: {
    displayName?: string;
    mobile?: string;
    email?: string;
    showContact?: boolean;
    address?: string;
    pincode?: string;
    careerStage?: CareerStage;
    educationStatus?: EducationStatus;
    openToInternship?: boolean;
    courseDetails?: string;
    branchStudied?: string;
    academicScore?: string;
    experienceYears?: number;
    experienceMonths?: number;
    companyName?: string;
    companyArea?: string;
    currentSalary?: string;
    expectedSalary?: string;
    noticePeriod?: NoticePeriod;
    experienceBand?: string;
    skills: string[];
    preferredCities: string[];
    openToWork: boolean;
  }): void {
    const u = this.user();
    this.profileName =
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
      (profile.experienceBand === 'fresher' ? 'fresher' : profile.experienceBand ? 'experienced' : '');
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
  }

  clearProfileFieldError(key: string): void {
    if (!this.profileFieldErrors[key]) return;
    const next = { ...this.profileFieldErrors };
    delete next[key];
    this.profileFieldErrors = next;
  }

  async saveProfile(): Promise<void> {
    const clientErrors = validateSeekerProfileFields({
      displayName: this.profileName,
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
      await this.showToast(
        Object.values(clientErrors)[0] ?? 'Fix the highlighted fields.',
        'error',
      );
      return;
    }

    try {
      await this.seeker.saveProfile({
        displayName: this.profileName.trim() || undefined,
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
      await this.showToast('Profile saved.');
    } catch (err) {
      const apiErrors = fieldErrorsFromHttp(err);
      if (Object.keys(apiErrors).length) {
        this.profileFieldErrors = apiErrors;
        await this.showToast(
          Object.values(apiErrors)[0] ?? 'Could not save profile.',
          'error',
        );
        return;
      }
      await this.showToast(friendlyHttpMessage(err, 'Could not save profile.'), 'error');
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
    this.applyPortfolio = row.portfolioLinks
      .map((l) => `${l.label}|${l.url}`)
      .join('\n');
    this.applyBand = row.experienceBand ?? '';
  }

  addApplySkill(): void {
    const raw = this.applySkillDraft.trim();
    if (!raw) return;
    if (this.applySkills.length >= this.applySkillMax) {
      void this.showToast(`You can add up to ${this.applySkillMax} skills.`, 'error');
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
      await this.showToast('Give this version a name (e.g. Frontend).', 'error');
      return;
    }
    if (this.applySkillDraft.trim()) {
      this.addApplySkill();
    }
    if (
      this.applySkills.length < this.applySkillMin ||
      this.applySkills.length > this.applySkillMax
    ) {
      await this.showToast(
        `Add between ${this.applySkillMin} and ${this.applySkillMax} skills.`,
        'error',
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
      this.startEditApply();
      await this.showToast('Apply profile version saved.');
    } catch {
      await this.showToast('Could not save apply profile.', 'error');
    } finally {
      this.applyBusy = false;
    }
  }

  async setDefaultApply(id: string): Promise<void> {
    try {
      await this.applyProfilesApi.setDefault(id);
      await this.applyProfilesApi.list();
      await this.showToast('Default apply version updated.');
    } catch {
      await this.showToast('Could not set default.', 'error');
    }
  }

  async deleteApply(id: string): Promise<void> {
    try {
      await this.applyProfilesApi.remove(id);
      await this.applyProfilesApi.list();
      if (this.editingApplyId === id) this.startEditApply();
      await this.showToast('Apply profile removed.');
    } catch {
      await this.showToast('Could not remove apply profile.', 'error');
    }
  }

  async deleteSavedSearch(id: string): Promise<void> {
    try {
      await this.seeker.deleteSavedSearch(id);
      await this.showToast('Saved search removed.');
    } catch {
      await this.showToast('Could not remove saved search.', 'error');
    }
  }

  async removeSavedJob(jobId: string): Promise<void> {
    try {
      await this.seeker.unsave(jobId);
      await this.showToast('Removed from saved jobs.');
    } catch {
      await this.showToast('Could not remove saved job.', 'error');
    }
  }

  private async redirectIfNeeded(): Promise<void> {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (!returnUrl?.startsWith('/') || returnUrl.startsWith('//')) return;
    if (!this.isAdmin() && !this.isEmployer()) return;
    await this.router.navigateByUrl(returnUrl);
  }

  async reloadQueue(): Promise<void> {
    try {
      this.queue.set(await this.jobsService.moderationQueue('needs-review'));
    } catch {
      this.queue.set([]);
    }
  }

  async approve(job: Job): Promise<void> {
    await this.jobsService.approveJob(job.id, 'Approved');
    await this.reloadQueue();
    await this.showToast(`Approved ${job.title}`);
  }

  async reject(job: Job): Promise<void> {
    await this.jobsService.rejectJob(job.id, 'Rejected by moderator');
    await this.reloadQueue();
    await this.showToast(`Rejected ${job.title}`);
  }

  private async showToast(
    message: string,
    tone: 'success' | 'error' = 'success',
  ): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: tone === 'error' ? 4200 : 2800,
      position: 'bottom',
      cssClass:
        tone === 'error'
          ? ['xcron-toast', 'xcron-toast--error']
          : ['xcron-toast', 'xcron-toast--success'],
    });
    await toast.present();
  }
}
