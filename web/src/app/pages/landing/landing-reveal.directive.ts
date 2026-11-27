import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
} from '@angular/core';

/** Adds a one-time scroll-reveal class when the host enters the viewport. */
@Directive({
  selector: '[lpReveal]',
  host: {
    class: 'lp-reveal',
    '[class.is-visible]': 'visible()',
  },
})
export class LandingRevealDirective implements AfterViewInit, OnDestroy {
  readonly visible = signal(false);

  private observer: IntersectionObserver | null = null;

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof IntersectionObserver === 'undefined'
    ) {
      this.visible.set(true);
      return;
    }

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        this.visible.set(true);
        this.observer?.disconnect();
        this.observer = null;
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
