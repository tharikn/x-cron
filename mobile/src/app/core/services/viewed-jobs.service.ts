import { Injectable, signal } from '@angular/core';
import type { Job } from '../models/job.model';

const KEY = 'xcron.recentlyViewed';
const MAX = 12;

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
  readonly items = signal<ViewedEntry[]>(this.read());

  track(job: Pick<Job, 'id' | 'title' | 'employerName' | 'slug' | 'location'>): void {
    const entry: ViewedEntry = {
      id: job.id,
      title: job.title,
      employerName: job.employerName,
      slug: job.slug,
      city: job.location?.city ?? '',
      viewedAt: new Date().toISOString(),
    };
    const next = [
      entry,
      ...this.read().filter((row) => row.id !== job.id),
    ].slice(0, MAX);
    this.write(next);
    this.items.set(next);
  }

  clear(): void {
    this.write([]);
    this.items.set([]);
  }

  private read(): ViewedEntry[] {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as ViewedEntry[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private write(rows: ViewedEntry[]): void {
    try {
      localStorage.setItem(KEY, JSON.stringify(rows));
    } catch {
      // ignore quota
    }
  }
}
