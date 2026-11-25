import { isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { Injectable } from '@angular/core';

/**
 * A single step of the portfolio editor tour.
 *
 * `target` is a CSS selector of the editor element to highlight for this step,
 * or `null` for a conceptual step (e.g. choosing a template happens in the
 * creation wizard, before the editor opens).
 */
export interface TourStep {
  id: string;
  title: string;
  body: string;
  target: string | null;
  hint?: string;
}

const STORAGE_KEY = 'xcron-portfolio-tour-seen';

const STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to the portfolio editor',
    body: 'Here you build, publish and manage your portfolio site. Everything is draft-only until you publish — nothing is public by default.',
    target: null,
    hint: 'Work at your own pace. Drafts autosave as you edit.',
  },
  {
    id: 'template',
    title: 'Step 1 — Choose a template',
    body: 'You chose a starter design when you created this portfolio (in the creation wizard). You can change the site name, slug and languages in Settings anytime.',
    target: null,
    hint: 'The template only sets the starting point; you can edit every section afterwards.',
  },
  {
    id: 'sections',
    title: 'Step 2 — Add and modify sections',
    body: 'Use the left panel to add sections (Hero, About, Projects, Contact, …), reorder them, show or hide them, and delete them. Select a section to edit it on the right.',
    target: '.panel--sections',
    hint: 'Click “Add section” at the bottom of the section list to insert a new one.',
  },
  {
    id: 'content',
    title: 'Step 3 — Edit content and design',
    body: 'Open the Content tab to edit section fields, the Design tab for colours and spacing, and the Theme tab for fonts and appearance. You can also click any text directly on the canvas preview.',
    target: '.tabs',
    hint: 'Click a section in the left panel first, then edit its fields in the Content tab.',
  },
  {
    id: 'publish',
    title: 'Step 4 — Publish',
    body: 'Open the Publish tab, run the validation check, then click Publish. Publishing creates an immutable snapshot of your site.',
    target: '.publish-actions',
    hint: 'Fix any validation errors shown below before publishing.',
  },
  {
    id: 'versions',
    title: 'Step 5 — Versions',
    body: 'Every publish creates a new version (v1, v2, …). Roll back to any previous version — it publishes a brand-new immutable version instead of overwriting history.',
    target: '.versions',
    hint: 'The version marked “live” is what visitors see at your public URL.',
  },
  {
    id: 'live',
    title: 'Step 6 — Go live',
    body: 'Once published, your site is live at /p/<slug>. Use the “View live” link in the top bar or on the portfolio list to open it. You can unpublish anytime to take it offline.',
    target: null,
    hint: 'View live only appears after the site has been published.',
  },
];

@Injectable({ providedIn: 'root' })
export class PortfolioTourService {
  readonly steps = STEPS;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly seen = signal<boolean>(this.loadSeen());
  private readonly currentIndex = signal(0);
  private readonly active = signal(false);

  readonly isSeen = this.seen;
  readonly isActive = this.active;
  readonly current = computed(() => this.steps[this.currentIndex()]);
  readonly currentNumber = computed(() => this.currentIndex() + 1);
  readonly total = this.steps.length;
  readonly isLast = computed(() => this.currentIndex() >= this.steps.length - 1);

  // Highlight box for the current step's target element.
  readonly highlightRect = signal<DOMRect | null>(null);

  constructor() {
    // Re-measure the highlight whenever the active step changes.
    effect(() => {
      const step = this.current();
      const target = step?.target ?? null;
      if (!target || !isPlatformBrowser(this.platformId)) {
        this.highlightRect.set(null);
        return;
      }
      const el = document.querySelector(target);
      this.highlightRect.set(el?.getBoundingClientRect() ?? null);
    });
  }

  start(): void {
    this.active.set(true);
    this.currentIndex.set(0);
    this.measure();
  }

  next(): void {
    if (this.currentIndex() < this.steps.length - 1) {
      this.currentIndex.update((i) => i + 1);
    } else {
      this.finish();
    }
  }

  prev(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.update((i) => i - 1);
    }
  }

  finish(): void {
    this.active.set(false);
    this.seen.set(true);
    this.persistSeen(true);
  }

  skip(): void {
    this.finish();
  }

  reset(): void {
    this.seen.set(false);
    this.persistSeen(false);
  }

  /** Re-measure the highlight box against the current target element. */
  measure(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    requestAnimationFrame(() => {
      const step = this.current();
      const target = step?.target ?? null;
      this.highlightRect.set(
        target ? document.querySelector(target)?.getBoundingClientRect() ?? null : null,
      );
    });
  }

  private loadSeen(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  }

  private persistSeen(value: boolean): void {
    try {
      if (value) localStorage.setItem(STORAGE_KEY, '1');
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage may be unavailable in private browsing; ignore.
    }
  }
}
