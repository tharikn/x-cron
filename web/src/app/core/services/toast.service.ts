import { Injectable, DestroyRef, inject, signal } from '@angular/core';

export type ToastTone = 'default' | 'error';

export interface ToastMessage {
  id: number;
  text: string;
  tone: ToastTone;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly destroyRef = inject(DestroyRef);
  private nextId = 1;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  readonly messages = signal<ToastMessage[]>([]);

  constructor() {
    this.destroyRef.onDestroy(() => {
      for (const timer of this.timers.values()) clearTimeout(timer);
      this.timers.clear();
    });
  }

  show(text: string, tone: ToastTone = 'default', durationMs = 3200): void {
    const id = this.nextId++;
    this.messages.update((list) => [...list, { id, text, tone }]);
    const timer = setTimeout(() => this.dismiss(id), durationMs);
    this.timers.set(id, timer);
  }

  error(text: string, durationMs = 4200): void {
    this.show(text, 'error', durationMs);
  }

  dismiss(id: number): void {
    const timer = this.timers.get(id);
    if (timer != null) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this.messages.update((list) => list.filter((item) => item.id !== id));
  }
}
