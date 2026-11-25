import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { PortfolioTourService } from './portfolio-tour.service';

describe('PortfolioTourService', () => {
  let service: PortfolioTourService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    service = TestBed.inject(PortfolioTourService);
  });

  it('starts unseen with the full set of guided steps', () => {
    expect(service.isSeen()).toBe(false);
    expect(service.total).toBeGreaterThanOrEqual(7);
    expect(service.currentNumber()).toBe(1);
    expect(service.current()?.id).toBe('welcome');
  });

  it('walks forward through the steps and finishes at the last one', () => {
    service.start();
    expect(service.isActive()).toBe(true);

    for (let i = 1; i <= service.total; i += 1) {
      expect(service.currentNumber()).toBe(i);
      service.next();
    }

    // Last step finishes the tour and marks it as seen.
    expect(service.isActive()).toBe(false);
    expect(service.isSeen()).toBe(true);
  });

  it('navigates back but not before the first step', () => {
    service.start();
    service.next();
    expect(service.currentNumber()).toBe(2);
    service.prev();
    expect(service.currentNumber()).toBe(1);
    service.prev();
    expect(service.currentNumber()).toBe(1);
  });

  it('covers template, editing, publish, versions and live', () => {
    const titles = service.steps.map((step) => `${step.id} ${step.title}`.toLowerCase());
    expect(titles.some((title) => title.includes('template'))).toBe(true);
    expect(titles.some((title) => title.includes('modif'))).toBe(true);
    expect(titles.some((title) => title.includes('publish'))).toBe(true);
    expect(titles.some((title) => title.includes('version'))).toBe(true);
    expect(titles.some((title) => title.includes('live'))).toBe(true);
  });

  it('marks seen on skip and can be reopened and reset', () => {
    service.start();
    service.skip();
    expect(service.isSeen()).toBe(true);
    expect(service.isActive()).toBe(false);

    service.start();
    expect(service.isActive()).toBe(true);
    expect(service.currentNumber()).toBe(1);

    service.reset();
    expect(service.isSeen()).toBe(false);
  });

  it('persists the seen flag in localStorage', () => {
    expect(localStorage.getItem('xcron-portfolio-tour-seen')).toBeNull();
    service.finish();
    expect(localStorage.getItem('xcron-portfolio-tour-seen')).toBe('1');
    service.reset();
    expect(localStorage.getItem('xcron-portfolio-tour-seen')).toBeNull();
  });
});
