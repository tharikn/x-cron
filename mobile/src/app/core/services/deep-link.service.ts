import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

/**
 * Maps https://x-cron… and xcron:// URLs onto Ionic tab routes.
 * Covers jobs, applications, feedback threads, and common web aliases.
 */
@Injectable({ providedIn: 'root' })
export class DeepLinkService {
  private readonly router = inject(Router);
  private started = false;

  /** Bind Capacitor launch + open listeners (native only). */
  start(): void {
    if (this.started || typeof window === 'undefined') return;
    this.started = true;
    if (!Capacitor.isNativePlatform()) return;

    void App.addListener('appUrlOpen', ({ url }) => {
      this.open(url);
    });
    void App.getLaunchUrl()
      .then((result) => {
        if (result?.url) this.open(result.url);
      })
      .catch(() => {
        // No cold-start URL — normal launch.
      });
  }

  /** Navigate from an absolute or path-style deep link. */
  open(raw: string): boolean {
    const path = this.mapUrlToPath(raw);
    if (!path) return false;
    void this.router.navigateByUrl(path);
    return true;
  }

  /** Pure mapper — also useful for unit tests / notification payloads. */
  mapUrlToPath(raw: string): string | null {
    const trimmed = (raw || '').trim();
    if (!trimmed) return null;

    let pathname = '';
    let search = '';
    try {
      if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
        const u = new URL(trimmed);
        if (u.protocol === 'xcron:') {
          pathname = '/' + (u.hostname + u.pathname).replace(/^\/+/, '');
          search = u.search;
        } else {
          pathname = u.pathname || '/';
          search = u.search;
        }
      } else {
        const u = new URL(trimmed, 'https://x-cron.local');
        pathname = u.pathname || '/';
        search = u.search;
      }
    } catch {
      return null;
    }

    pathname = pathname.replace(/\/+$/, '') || '/';
    const qs = search.startsWith('?') ? search.slice(1) : search;
    const params = new URLSearchParams(qs);

    // Direct tab paths already in-app.
    if (pathname.startsWith('/tabs/')) {
      return pathname + (qs ? `?${qs}` : '');
    }

    // Job detail — SEO slug path or id.
    const jobMatch = pathname.match(/^\/jobs(?:\/(.+))?$/i);
    if (jobMatch) {
      const slugOrId = (jobMatch[1] || '').replace(/^\/+|\/+$/g, '');
      if (!slugOrId || slugOrId === '**') return '/tabs/discover';
      const id = slugOrId.includes('/')
        ? slugOrId.split('/').pop() || slugOrId
        : slugOrId;
      return `/tabs/jobs/${encodeURIComponent(id)}`;
    }

    // Applications / ATS timeline.
    const appMatch = pathname.match(
      /^\/(?:me\/)?applications\/([^/]+)$/i,
    );
    if (appMatch?.[1]) {
      const asEmployer =
        params.get('as') === 'employer' ? '?as=employer' : '';
      return `/tabs/applications/${encodeURIComponent(appMatch[1])}${asEmployer}`;
    }
    if (
      pathname === '/applications' ||
      pathname === '/me/applied' ||
      pathname === '/me/applications'
    ) {
      return '/tabs/applied';
    }

    // Feedback / Contact Admin.
    if (pathname === '/feedback' || pathname === '/messages') {
      const thread = params.get('thread');
      return thread
        ? `/tabs/feedback?thread=${encodeURIComponent(thread)}`
        : '/tabs/feedback';
    }
    if (pathname === '/admin/feedback') {
      const thread = params.get('thread');
      return thread
        ? `/tabs/admin-feedback?thread=${encodeURIComponent(thread)}`
        : '/tabs/admin-feedback';
    }

    // Alerts / settings / profile aliases from external UX docs.
    if (pathname === '/alerts' || pathname === '/notifications') {
      return '/tabs/notifications';
    }
    if (pathname === '/saved-jobs' || pathname === '/saved') {
      return '/tabs/settings?tab=saved';
    }
    if (pathname === '/settings/privacy' || pathname === '/privacy') {
      return '/tabs/privacy';
    }
    if (pathname === '/settings/preferences' || pathname === '/settings') {
      return '/tabs/settings?tab=preferences';
    }
    if (
      pathname === '/profile' ||
      pathname === '/profile/resume' ||
      pathname === '/login' ||
      pathname === '/register' ||
      pathname === '/sign-in' ||
      pathname === '/me'
    ) {
      return '/tabs/account';
    }
    if (pathname === '/onboarding/profile') {
      return '/onboarding/profile';
    }

    // Recruiter aliases.
    if (
      pathname === '/recruiter/dashboard' ||
      pathname === '/recruiter/jobs/new' ||
      pathname === '/post'
    ) {
      return '/tabs/post';
    }
    if (pathname === '/recruiter/jobs' || pathname === '/my-jobs') {
      return '/tabs/my-jobs';
    }
    const recruiterJob = pathname.match(/^\/recruiter\/jobs\/([^/]+)$/i);
    if (recruiterJob?.[1]) {
      return `/tabs/my-jobs/${encodeURIComponent(recruiterJob[1])}`;
    }
    if (
      pathname.match(/^\/recruiter\/jobs\/[^/]+\/applicants$/i) ||
      pathname === '/employer-applications'
    ) {
      return '/tabs/employer-applications';
    }

    // Performance / home.
    if (pathname === '/performance') return '/tabs/performance';
    if (pathname === '/' || pathname === '/discover') {
      return '/tabs/discover';
    }

    return null;
  }
}
