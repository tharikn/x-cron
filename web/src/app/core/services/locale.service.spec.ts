import { HttpClient } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LocaleService } from './locale.service';

describe('LocaleService fallback catalog', () => {
  let service: LocaleService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: HttpClient, useValue: {} },
      ],
    });
    service = TestBed.inject(LocaleService);
  });

  it('translates side-nav labels before the remote catalog loads', () => {
    expect(service.t('nav.home')).toBe('Home');
    expect(service.t('nav.feedbackAdmin')).toBe('Feedback desk');
    expect(service.t('nav.feedback')).toBe('Feedback');
  });

  it('does not expose raw keys used by the shell and feedback page', () => {
    for (const key of ['common.loading', 'appDownload.ctaResume', 'feedback.title']) {
      expect(service.t(key)).not.toBe(key);
    }
  });
});
