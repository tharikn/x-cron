import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-scroll-arrows',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './scroll-arrows.component.html',
  styleUrl: './scroll-arrows.component.scss',
})
export class ScrollArrowsComponent implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly canScrollUp = signal(false);
  protected readonly canScrollDown = signal(false);

  private reduceMotion = false;
  private scrollHandler: (() => void) | null = null;
  private resizeHandler: (() => void) | null = null;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.scrollHandler = () => this.updateState();
    this.resizeHandler = () => this.updateState();
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    window.addEventListener('resize', this.resizeHandler, { passive: true });
    this.updateState();
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.scrollHandler) window.removeEventListener('scroll', this.scrollHandler);
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
  }

  protected scrollToTop(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.scrollTo({
      top: 0,
      behavior: this.reduceMotion ? 'auto' : 'smooth',
    });
  }

  protected scrollToBottom(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const max = this.maxScroll();
    window.scrollTo({
      top: max,
      behavior: this.reduceMotion ? 'auto' : 'smooth',
    });
  }

  private updateState(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const y = window.scrollY;
    const max = this.maxScroll();
    this.canScrollUp.set(y > 16);
    this.canScrollDown.set(max > 0 && y < max - 16);
  }

  private maxScroll(): number {
    const doc = this.document.documentElement;
    const body = this.document.body;
    return Math.max(doc.scrollHeight, body?.scrollHeight ?? 0) - window.innerHeight;
  }
}
