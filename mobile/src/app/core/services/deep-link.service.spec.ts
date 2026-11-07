import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { DeepLinkService } from './deep-link.service';

describe('DeepLinkService.mapUrlToPath', () => {
  let service: DeepLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    service = TestBed.inject(DeepLinkService);
  });

  it('returns null for blank or unknown links', () => {
    expect(service.mapUrlToPath('')).toBeNull();
    expect(service.mapUrlToPath('   ')).toBeNull();
    expect(service.mapUrlToPath('https://x-cron.app/unknown/place')).toBeNull();
  });

  it('keeps in-app tab paths (with query) as-is', () => {
    expect(service.mapUrlToPath('/tabs/settings?tab=theme')).toBe('/tabs/settings?tab=theme');
  });

  it('maps https and xcron:// job links (slug or id) onto job detail', () => {
    expect(service.mapUrlToPath('https://x-cron.app/jobs/abc123')).toBe('/tabs/jobs/abc123');
    expect(service.mapUrlToPath('xcron://jobs/abc123')).toBe('/tabs/jobs/abc123');
    expect(service.mapUrlToPath('/jobs/chennai/delivery-exec-42/')).toBe(
      '/tabs/jobs/delivery-exec-42',
    );
    expect(service.mapUrlToPath('/jobs')).toBe('/tabs/discover');
  });

  it('maps application timeline links and keeps the employer view flag only', () => {
    expect(service.mapUrlToPath('/me/applications/app-1')).toBe('/tabs/applications/app-1');
    expect(service.mapUrlToPath('/applications/app-1?as=employer&x=1')).toBe(
      '/tabs/applications/app-1?as=employer',
    );
    expect(service.mapUrlToPath('/applications')).toBe('/tabs/applied');
    expect(service.mapUrlToPath('/me/applied')).toBe('/tabs/applied');
  });

  it('carries feedback thread ids for seeker and admin inboxes', () => {
    expect(service.mapUrlToPath('/feedback?thread=t 1')).toBe('/tabs/feedback?thread=t%201');
    expect(service.mapUrlToPath('/messages')).toBe('/tabs/feedback');
    expect(service.mapUrlToPath('/admin/feedback?thread=t2')).toBe(
      '/tabs/admin-feedback?thread=t2',
    );
  });

  it('maps Doc 10 web aliases onto Ionic tabs', () => {
    const cases: Array<[string, string]> = [
      ['/alerts', '/tabs/notifications'],
      ['/saved-jobs', '/tabs/settings?tab=saved'],
      ['/privacy', '/tabs/privacy'],
      ['/settings/privacy', '/tabs/privacy'],
      ['/settings', '/tabs/settings?tab=preferences'],
      ['/login', '/tabs/account'],
      ['/sign-in', '/tabs/account'],
      ['/me', '/tabs/account'],
      ['/onboarding/profile', '/onboarding/profile'],
      ['/recruiter/dashboard', '/tabs/post'],
      ['/recruiter/jobs', '/tabs/my-jobs'],
      ['/recruiter/jobs/j-9', '/tabs/my-jobs/j-9'],
      ['/recruiter/jobs/j-9/applicants', '/tabs/employer-applications'],
      ['/performance', '/tabs/performance'],
      ['/', '/tabs/discover'],
    ];
    for (const [input, expected] of cases) {
      expect(service.mapUrlToPath(input), input).toBe(expected);
    }
  });

  it('encodes path segments so links cannot inject extra routes', () => {
    expect(service.mapUrlToPath('/me/applications/a%3Fb')).toBe('/tabs/applications/a%253Fb');
  });

  it('open() navigates only for mappable links', () => {
    const router = TestBed.inject(Router);
    const nav = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    expect(service.open('xcron://alerts')).toBe(true);
    expect(nav).toHaveBeenCalledWith('/tabs/notifications');
    expect(service.open('https://x-cron.app/nope')).toBe(false);
    expect(nav).toHaveBeenCalledOnce();
  });
});
