import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  input,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';

/**
 * Lightweight route overlay enter: re-triggers a CSS class on path changes.
 * Web default direction is left → right (`xcron-route-enter--ltr`).
 */
@Directive({
  selector: '[appRouteEnter]',
  standalone: true,
})
export class RouteEnterDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private sub?: Subscription;
  private lastPath = '';
  private clearTimer: ReturnType<typeof setTimeout> | null = null;

  /** CSS direction modifier: `ltr` (web) or `btt` (sheet-style). */
  readonly appRouteEnter = input<'ltr' | 'btt'>('ltr');

  /**
   * When set, only animate when the URL under this prefix changes
   * (e.g. `/settings` for the settings hub panel).
   */
  readonly routeEnterScope = input<string>('');

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.lastPath = this.pathKey(this.router.url);
    this.sub = this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        const next = this.pathKey(e.url);
        if (!this.shouldAnimate(next)) return;
        this.prepareEnter();
        return;
      }
      if (
        e instanceof NavigationEnd ||
        e instanceof NavigationCancel ||
        e instanceof NavigationError
      ) {
        const next = this.pathKey(
          e instanceof NavigationEnd ? e.urlAfterRedirects : this.router.url,
        );
        if (!this.shouldAnimate(next)) return;
        this.lastPath = next;
        if (e instanceof NavigationEnd) {
          this.playEnter();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    if (this.clearTimer) clearTimeout(this.clearTimer);
  }

  private shouldAnimate(nextPath: string): boolean {
    if (nextPath === this.lastPath) return false;
    const scope = this.routeEnterScope().trim();
    if (scope) {
      const prefix = scope.endsWith('/') ? scope.slice(0, -1) : scope;
      const inScope = (p: string) => p === prefix || p.startsWith(`${prefix}/`);
      if (!inScope(nextPath) && !inScope(this.lastPath)) return false;
      return true;
    }
    // Shell host: skip when only a nested hub child changes (child outlet animates).
    if (this.sameNestedHub(this.lastPath, nextPath)) return false;
    return true;
  }

  private sameNestedHub(a: string, b: string): boolean {
    for (const hub of ['/settings']) {
      const under = (p: string) => p === hub || p.startsWith(`${hub}/`);
      if (under(a) && under(b)) return true;
    }
    return false;
  }

  private pathKey(url: string): string {
    const raw = (url.split('?')[0] ?? '').split('#')[0] ?? '';
    return raw.startsWith('/') ? raw : `/${raw}`;
  }

  private prepareEnter(): void {
    const host = this.el.nativeElement;
    host.classList.remove('xcron-route-enter', this.dirClass());
  }

  private playEnter(): void {
    const host = this.el.nativeElement;
    if (this.clearTimer) clearTimeout(this.clearTimer);
    host.classList.remove('xcron-route-enter', this.dirClass());
    // Force reflow so the animation can re-trigger on consecutive navigations.
    void host.offsetWidth;
    host.classList.add('xcron-route-enter', this.dirClass());
    this.clearTimer = setTimeout(() => {
      host.classList.remove('xcron-route-enter', this.dirClass());
      this.clearTimer = null;
    }, 900);
  }

  private dirClass(): string {
    return this.appRouteEnter() === 'btt'
      ? 'xcron-route-enter--btt'
      : 'xcron-route-enter--ltr';
  }
}
