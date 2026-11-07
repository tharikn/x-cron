import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { AuthService } from '../../core/services/auth.service';
import {
  OnboardingService,
  PROFILE_SETUP_STEPS,
  type ProfileSetupStep,
} from '../../core/services/onboarding.service';
import { ApplyProfilesService } from '../../core/services/apply-profiles.service';
import {
  SeekerService,
  type CareerStage,
  type EducationStatus,
  type NoticePeriod,
} from '../../core/services/seeker.service';
import {
  type FieldErrors,
  validateSeekerProfileFields,
} from '../../core/utils/form-validation';
import {
  fieldErrorsFromHttp,
  friendlyHttpMessage,
} from '../../core/utils/friendly-http-message';
import { PiiFieldComponent } from '../../shared/pii-field/pii-field.component';

@Component({
  selector: 'app-profile-setup',
  imports: [FormsModule, TranslatePipe, PiiFieldComponent, IonContent],
  templateUrl: './profile-setup.page.html',
  styleUrls: ['./profile-setup.page.scss'],
})
export class ProfileSetupPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly seeker = inject(SeekerService);
  private readonly applyProfiles = inject(ApplyProfilesService);
  private readonly onboarding = inject(OnboardingService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastController = inject(ToastController);

  readonly step = signal<ProfileSetupStep>('personal');
  readonly celebrating = signal(false);
  readonly busy = signal(false);
  readonly progress = signal(25);

  /** Match apply-profile limits so onboard skills unlock Easy apply. */
  readonly skillMin = 2;
  readonly skillMax = 7;

  displayName = '';
  mobile = '';
  email = '';
  showContact = false;
  address = '';
  pincode = '';
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
  skills: string[] = [];
  skillDraft = '';
  cities: string[] = [];
  cityDraft = '';
  openToWork = true;
  fieldErrors: FieldErrors = {};

  readonly noticeOptions: Array<{ value: NoticePeriod; label: string }> = [
    { value: 'serving', label: 'Serving' },
    { value: '1', label: '1 mo' },
    { value: '2', label: '2 mo' },
    { value: '3', label: '3 mo' },
    { value: 'immediate', label: 'Immediate' },
  ];

  async ngOnInit(): Promise<void> {
    await this.auth.ensureSession();
    if (!this.auth.isSignedIn()) {
      await this.router.navigate(['/tabs/account'], {
        queryParams: { returnUrl: '/onboarding/profile' },
        replaceUrl: true,
      });
      return;
    }
    if (this.auth.isEmployer() || this.auth.isAdmin()) {
      await this.router.navigateByUrl(
        this.auth.isAdmin() ? '/tabs/import' : '/tabs/post',
        { replaceUrl: true },
      );
      return;
    }
    try {
      const profile = await this.seeker.loadProfile();
      if (this.onboarding.isProfileComplete(profile)) {
        this.onboarding.clearRemindLater();
        await this.router.navigateByUrl('/tabs/discover', { replaceUrl: true });
        return;
      }
      this.applyProfile(profile);
    } catch {
      // start empty
    }
    this.syncProgress();
  }

  stepTitleKey(): string {
    return this.onboarding.stepLabelKey(this.step());
  }

  remindLater(): void {
    this.onboarding.remindLater();
    void this.exitSetup();
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

  clearError(key: string): void {
    if (!this.fieldErrors[key]) return;
    const next = { ...this.fieldErrors };
    delete next[key];
    this.fieldErrors = next;
  }

  addSkill(): void {
    const raw = this.skillDraft.trim();
    if (!raw) return;
    const key = raw.toLowerCase();
    if (this.skills.some((s) => s.toLowerCase() === key)) {
      this.skillDraft = '';
      return;
    }
    if (this.skills.length >= this.skillMax) {
      void this.showToast(
        `Add between ${this.skillMin} and ${this.skillMax} skills.`,
        'error',
      );
      return;
    }
    this.skills = [...this.skills, raw.slice(0, 60)];
    this.skillDraft = '';
  }

  removeSkill(skill: string): void {
    this.skills = this.skills.filter((s) => s !== skill);
  }

  addCity(): void {
    const raw = this.cityDraft.trim();
    if (!raw) return;
    const key = raw.toLowerCase();
    if (this.cities.some((c) => c.toLowerCase() === key)) {
      this.cityDraft = '';
      return;
    }
    if (this.cities.length >= 20) {
      void this.showToast('You can add up to 20 cities.', 'error');
      return;
    }
    this.cities = [...this.cities, raw.slice(0, 60)];
    this.cityDraft = '';
  }

  removeCity(city: string): void {
    this.cities = this.cities.filter((c) => c !== city);
  }

  async back(): Promise<void> {
    const index = PROFILE_SETUP_STEPS.indexOf(this.step());
    if (index <= 0) return;
    this.step.set(PROFILE_SETUP_STEPS[index - 1]!);
    this.syncProgress();
  }

  async next(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    try {
      const ok = await this.saveCurrentStep();
      if (!ok) return;
      const index = PROFILE_SETUP_STEPS.indexOf(this.step());
      if (index >= PROFILE_SETUP_STEPS.length - 1) {
        this.onboarding.clearRemindLater();
        this.celebrating.set(true);
        this.progress.set(100);
        window.setTimeout(() => void this.finish(), 2600);
        return;
      }
      this.step.set(PROFILE_SETUP_STEPS[index + 1]!);
      this.syncProgress();
    } finally {
      this.busy.set(false);
    }
  }

  async finish(): Promise<void> {
    await this.exitSetup(true);
  }

  private async exitSetup(replaceUrl = false): Promise<void> {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    const target =
      returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
        ? returnUrl
        : '/tabs/discover';
    await this.router.navigateByUrl(target, { replaceUrl });
  }

  private syncProgress(): void {
    this.progress.set(this.onboarding.progressPercent(this.step()));
  }

  private applyProfile(profile: Awaited<ReturnType<SeekerService['loadProfile']>>): void {
    const u = this.auth.user();
    this.displayName =
      profile.displayName?.trim() ||
      u?.displayName?.trim() ||
      u?.username?.trim() ||
      '';
    this.mobile = profile.mobile ?? '';
    this.email = profile.email?.trim() || u?.email?.trim() || '';
    this.showContact = profile.showContact ?? false;
    this.address = profile.address ?? '';
    this.pincode = profile.pincode ?? '';
    this.careerStage = profile.careerStage ?? '';
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
    this.skills = profile.skills ?? [];
    this.cities = profile.preferredCities ?? [];
    this.openToWork = profile.openToWork ?? true;
  }

  private async saveCurrentStep(): Promise<boolean> {
    const step = this.step();
    if (step === 'personal') {
      const errors = validateSeekerProfileFields({
        displayName: this.displayName,
        mobile: this.mobile,
        email: this.email,
        address: '',
        pincode: '',
      });
      this.fieldErrors = errors;
      if (Object.keys(errors).length) {
        await this.showToast(
          Object.values(errors)[0] ?? 'Fix the highlighted fields.',
          'error',
        );
        return false;
      }
      if (!this.displayName.trim()) {
        await this.showToast('Enter your name to continue.', 'error');
        return false;
      }
      return this.patch({
        displayName: this.displayName.trim(),
        mobile: this.mobile.trim() || undefined,
        email: this.email.trim() || undefined,
        showContact: this.showContact,
      });
    }

    if (step === 'location') {
      const errors = validateSeekerProfileFields({
        displayName: this.displayName,
        mobile: this.mobile,
        email: this.email,
        address: this.address,
        pincode: this.pincode,
      });
      this.fieldErrors = {
        ...(errors['address'] ? { address: errors['address'] } : {}),
        ...(errors['pincode'] ? { pincode: errors['pincode'] } : {}),
      };
      if (Object.keys(this.fieldErrors).length) {
        await this.showToast(Object.values(this.fieldErrors)[0]!, 'error');
        return false;
      }
      return this.patch({
        address: this.address.trim() || undefined,
        pincode: this.pincode.trim() || undefined,
      });
    }

    if (step === 'career') {
      if (!this.careerStage) {
        await this.showToast('Choose Fresher or Experienced.', 'error');
        return false;
      }
      if (
        this.careerStage === 'experienced' &&
        (this.experienceYears == null || this.experienceYears < 0)
      ) {
        await this.showToast('Enter years of experience.', 'error');
        return false;
      }
      const errors = validateSeekerProfileFields({
        displayName: this.displayName,
        mobile: this.mobile,
        email: this.email,
        address: this.address,
        pincode: this.pincode,
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
      this.fieldErrors = errors;
      if (Object.keys(errors).length) {
        await this.showToast(Object.values(errors)[0]!, 'error');
        return false;
      }
      return this.patch({
        careerStage: this.careerStage,
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
            ? (this.experienceYears ?? undefined)
            : undefined,
        experienceMonths:
          this.careerStage === 'experienced'
            ? (this.experienceMonths ?? undefined)
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
      });
    }

    if (
      this.skills.length < this.skillMin ||
      this.skills.length > this.skillMax
    ) {
      await this.showToast(
        `Add between ${this.skillMin} and ${this.skillMax} skills for Easy apply.`,
        'error',
      );
      return false;
    }
    if (!this.cities.length) {
      await this.showToast('Add at least one preferred city.', 'error');
      return false;
    }
    const saved = await this.patch({
      skills: this.skills,
      preferredCities: this.cities,
      openToWork: this.openToWork,
    });
    if (!saved) return false;
    return this.ensureDefaultApplyProfile();
  }

  /**
   * First onboard finish creates a Default apply version from wizard skills
   * so Easy apply works without a separate Account → Apply step.
   */
  private async ensureDefaultApplyProfile(): Promise<boolean> {
    try {
      const profile = this.seeker.profile();
      const band =
        profile?.experienceBand ??
        (this.careerStage === 'fresher'
          ? 'fresher'
          : this.bandFromYears(this.experienceYears));
      const created = await this.applyProfiles.ensureDefaultFromSkills({
        skills: this.skills,
        experienceBand: band ?? undefined,
      });
      return Boolean(created);
    } catch (err) {
      await this.showToast(
        friendlyHttpMessage(
          err,
          'Profile saved, but could not create an Easy apply version. Add one under Account → Apply.',
        ),
        'error',
      );
      return false;
    }
  }

  private bandFromYears(
    years: number | null,
  ): '0-1' | '1-3' | '3-5' | '5+' | undefined {
    if (years == null || years < 0) return undefined;
    if (years < 1) return '0-1';
    if (years < 3) return '1-3';
    if (years < 5) return '3-5';
    return '5+';
  }

  private async patch(
    data: Parameters<SeekerService['saveProfile']>[0],
  ): Promise<boolean> {
    try {
      await this.seeker.saveProfile(data);
      this.fieldErrors = {};
      return true;
    } catch (err) {
      const apiErrors = fieldErrorsFromHttp(err);
      if (Object.keys(apiErrors).length) {
        this.fieldErrors = apiErrors;
        await this.showToast(Object.values(apiErrors)[0] ?? 'Could not save.', 'error');
        return false;
      }
      await this.showToast(
        friendlyHttpMessage(err, 'Could not save profile.'),
        'error',
      );
      return false;
    }
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
