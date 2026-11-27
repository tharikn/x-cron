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

  it('does not open the theme chooser', () => {
    const service = TestBed.inject(OnboardingService);
    expect(service.needsThemePrompt()).toBe(false);

    service.openThemePromptIfNeeded();
    expect(service.themePromptOpen()).toBe(false);
  });
});
