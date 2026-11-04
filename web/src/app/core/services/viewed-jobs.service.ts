import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import type { Job } from '../models/job.model';

const KEY = 'xcron.web.recentlyViewed';

interface ViewedEntry {
  id: string;
  title: string;
  employerName: string;
  slug: string;
  city: string;
  viewedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ViewedJobsService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly items = signal<ViewedEntry[]>(this.read());

  track(job: Pick<Job, 'id' | 'title' | 'employerName' | 'slug' | 'location'>): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const entry: ViewedEntry = {
      id: job.id,
      title: job.title,
      employerName: job.employerName,
      slug: job.slug,
      city: job.location?.city ?? '',
      viewedAt: new Date().toISOString(),
    };
    const next = [entry, ...this.read().filter((r) => r.id !== job.id)].slice(0, 12);
    localStorage.setItem(KEY, JSON.stringify(next));
    this.items.set(next);
  }

  private read(): ViewedEntry[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as ViewedEntry[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
