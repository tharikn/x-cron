import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { ResumeLaunchService } from '../../core/services/resume-launch.service';
import { SeoService } from '../../core/services/seo.service';
import { SiteService } from '../../core/services/site.service';
import { ScrollArrowsComponent } from '../../shared/scroll-arrows/scroll-arrows.component';
import {
  LandingPreviewComponent,
  type LandingPreviewKind,
} from './landing-preview.component';
import { LandingRevealDirective } from './landing-reveal.directive';

type ShowcaseTab = {
  id: LandingPreviewKind;
  label: string;
  kicker: string;
  title: string;
  body: string;
  highlights: string[];
};

type LandingReview = {
  name: string;
  detail: string;
  avatar: string;
  quote: string;
  product: string;
};

@Component({
  selector: 'app-landing-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    LandingPreviewComponent,
    LandingRevealDirective,
    ScrollArrowsComponent,
  ],
  templateUrl: './landing.page.html',
  styleUrl: './landing.page.scss',
})
export class LandingPage implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly auth = inject(AuthService);
  private readonly seo = inject(SeoService);
  private readonly site = inject(SiteService);
  protected readonly resumeLaunch = inject(ResumeLaunchService);

  protected readonly isSignedIn = this.auth.isSignedIn;
  protected readonly footer = this.site.footer;
  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly scrollProgress = signal(0);
  protected readonly activeTab = signal<LandingPreviewKind>('jobs');
  protected readonly year = new Date().getFullYear();

  private readonly parallaxY = signal(0);

  protected readonly tabs: ShowcaseTab[] = [
    {
      id: 'jobs',
      label: 'Job Portal',
      kicker: 'Find work that fits',
      title: 'Search, shortlist, and move forward.',
      body: 'Browse roles, explore companies, save what matters, and follow every application in one place.',
      highlights: ['Focused search and filters', 'Company pages', 'Saved jobs and application timeline'],
    },
    {
      id: 'resume',
      label: 'Resume Builder',
      kicker: 'Present your experience well',
      title: 'A clear resume, ready to share.',
      body: 'Choose a professional layout, shape each section, and review the result as you write.',
      highlights: ['Professional layouts', 'Live preview', 'Export and manage versions'],
    },
    {
      id: 'portfolio',
      label: 'Portfolio Generator',
      kicker: 'Show the work behind the résumé',
      title: 'A portfolio you can actually publish.',
      body: 'Start from a template, edit in the browser, preview every change, and publish a version when it is ready.',
      highlights: ['Starter templates', 'Live preview', 'Publish, manage, and roll back'],
    },
  ];

  protected readonly reviews: LandingReview[] = [
    {
      name: 'Ananya R.',
      detail: 'Final-year B.Sc. student · Anna Nagar',
      avatar: 'reviews/student-ananya.svg',
      quote:
        'I shortlisted local roles in the morning, then shaped a resume around them. Having both in one place made the whole process feel much less messy.',
      product: 'Job Portal + Resume Builder',
    },
    {
      name: 'Karthik S.',
      detail: 'Engineering student · Velachery',
      avatar: 'reviews/student-karthik.svg',
      quote:
        'The portfolio templates were the easiest part. I picked one, added my class projects, and had a link ready to share by the evening.',
      product: 'Portfolio Generator',
    },
    {
      name: 'Meera P.',
      detail: 'MBA student · T. Nagar',
      avatar: 'reviews/student-meera.svg',
      quote:
        'Saving roles meant I could come back to the ones that actually fit. The live resume preview helped me catch small mistakes before applying.',
      product: 'Job Portal + Resume Builder',
    },
  ];

  protected readonly currentTab = computed(
    () => this.tabs.find((tab) => tab.id === this.activeTab()) ?? this.tabs[0]!,
  );
  protected readonly progressTransform = computed(
    () => `scaleX(${this.scrollProgress()})`,
  );
  protected readonly heroTransform = computed(
    () => `translate3d(0, ${this.parallaxY()}px, 0)`,
  );
  protected readonly glowTransform = computed(
    () => `translate3d(0, ${Math.abs(this.parallaxY()) * 1.7}px, 0)`,
  );

  private reduceMotion = false;
  private scrollHandler: (() => void) | null = null;

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Jobs, Resumes & Portfolios',
      description:
        'XcronJob brings job discovery, resume creation, and portfolio publishing together. Find opportunities, build your resume, and showcase your work.',
      path: '/',
    });
    this.seo.setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'XcronJob',
      url: `${environment.siteUrl}/`,
      description:
        'An integrated career platform for discovering jobs, creating resumes, and publishing portfolios.',
    });
    this.seo.setSocialImage(`${environment.siteUrl}/brand/xcron-logo-wordmark.png`);

    if (!isPlatformBrowser(this.platformId)) return;

    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.scrollHandler = () => this.updateScrollState();
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    this.updateScrollState();

    if (!this.reduceMotion) {
      this.document.documentElement.classList.add('lp-smooth-scroll', 'lp-anim-ready');
    }
  }

  ngOnDestroy(): void {
    if (this.scrollHandler && isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
    this.document.documentElement.classList.remove('lp-smooth-scroll', 'lp-anim-ready');
  }

  private updateScrollState(): void {
    const y = window.scrollY;
    this.scrolled.set(y > 12);

    const max = this.document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress.set(max > 0 ? Math.min(1, y / max) : 0);

    if (!this.reduceMotion) {
      this.parallaxY.set(-Math.min(y, 700) * 0.045);
    }
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  /** In-page home links scroll to the very top without a route navigation. */
  protected goToTop(event: Event): void {
    this.closeMenu();
    if (!isPlatformBrowser(this.platformId)) return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: this.reduceMotion ? 'auto' : 'smooth' });
  }

  /** Resume Builder is a separate, authenticated product reached by one-time handoff. */
  protected async openResume(): Promise<void> {
    this.closeMenu();
    if (this.isSignedIn()) {
      await this.resumeLaunch.launch();
      return;
    }
    await this.router.navigate(['/sign-in'], { queryParams: { intent: 'resume' } });
  }

  protected selectTab(id: LandingPreviewKind): void {
    this.activeTab.set(id);
  }

  protected onTabKeydown(event: KeyboardEvent, index: number): void {
    const last = this.tabs.length - 1;
    let next = index;
    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    else return;

    event.preventDefault();
    this.selectTab(this.tabs[next]!.id);
    if (isPlatformBrowser(this.platformId) && event.currentTarget instanceof HTMLElement) {
      const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]',
      );
      tabs?.[next]?.focus();
    }
  }
}
