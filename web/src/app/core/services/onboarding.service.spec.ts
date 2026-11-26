import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { OnboardingService } from './onboarding.service';

describe('OnboardingService', () => {
  const routerStub = { url: '/' };

  beforeEach(() => {
    sessionStorage.clear();
    routerStub.url = '/';
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: Router, useValue: routerStub },
        {
          provide: AuthService,
          useValue: {
            isSignedIn: () => false,
            isEmployer: () => false,
            isAdmin: () => false,
          },
        },
      ],
    });
  });

  it('opens the theme chooser once on a normal route', () => {
    const service = TestBed.inject(OnboardingService);
    expect(service.needsThemePrompt()).toBe(true);

    service.openThemePromptIfNeeded();
    expect(service.themePromptOpen()).toBe(true);

    service.completeThemePrompt();
    expect(service.themePromptOpen()).toBe(false);
    expect(service.needsThemePrompt()).toBe(false);
  });

  it('never opens the theme chooser on a published portfolio URL', () => {
    routerStub.url = '/p/jane-doe?locale=en-IN';
    const service = TestBed.inject(OnboardingService);
    expect(service.needsThemePrompt()).toBe(true);

    service.openThemePromptIfNeeded();
    expect(service.themePromptOpen()).toBe(false);
    expect(sessionStorage.getItem('xcron.web.themePromptDone')).toBeNull();
  });
});
