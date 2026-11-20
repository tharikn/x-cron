import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

const TAB_ID_KEY = 'xcron.web.tabId';
const ACTIVE_TAB_KEY = 'xcron.web.activeTab';
const ACTIVE_TAB_HEARTBEAT_KEY = 'xcron.web.activeTabHeartbeat';
const CHANNEL = 'xcron-web-auth-tab';
const STALE_MS = 3000;

/**
 * One active browser tab per window/profile for signed-in sessions.
 * Tab id lives in sessionStorage (per-tab); ownership lock in localStorage.
 */
@Injectable({ providedIn: 'root' })
export class TabSessionService {
  private readonly platformId = inject(PLATFORM_ID);
  private channel: BroadcastChannel | null = null;

  readonly tabId = signal<string>('');

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    let id = sessionStorage.getItem(TAB_ID_KEY);
    if (!id) {
      id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `tab_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(TAB_ID_KEY, id);
    }
    this.tabId.set(id);

    try {
      this.channel = new BroadcastChannel(CHANNEL);
      this.channel.onmessage = (event: MessageEvent<{ type: string; tabId: string }>) => {
        if (event.data?.type === 'claim' && event.data.tabId !== this.tabId()) {
          this.blockedByOtherTab.set(true);
        }
        if (event.data?.type === 'release' && event.data.tabId !== this.tabId()) {
          // Peer released — allow this tab to reclaim on next ensureSession.
        }
      };
    } catch {
      this.channel = null;
    }

    window.addEventListener('storage', (event) => {
      if (event.key !== ACTIVE_TAB_KEY) return;
      if (event.newValue && event.newValue !== this.tabId()) {
        this.blockedByOtherTab.set(true);
      }
    });

    // Keep a heartbeat so a tab that navigated away / closed can be reclaimed.
    if (isPlatformBrowser(this.platformId)) {
      window.setInterval(() => {
        if (localStorage.getItem(ACTIVE_TAB_KEY) === this.tabId()) {
          localStorage.setItem(ACTIVE_TAB_HEARTBEAT_KEY, String(Date.now()));
        }
      }, 1000);
    }
  }

  readonly blockedByOtherTab = signal(false);

  /** Claim exclusive auth ownership for this tab. */
  claim(): boolean {
    if (!isPlatformBrowser(this.platformId)) return true;
    const owner = localStorage.getItem(ACTIVE_TAB_KEY);
    const heartbeat = Number(localStorage.getItem(ACTIVE_TAB_HEARTBEAT_KEY) || 0);
    const stale =
      !owner ||
      owner === this.tabId() ||
      Date.now() - heartbeat > STALE_MS;
    if (owner && owner !== this.tabId() && !stale) {
      this.blockedByOtherTab.set(true);
      return false;
    }
    localStorage.setItem(ACTIVE_TAB_KEY, this.tabId());
    localStorage.setItem(ACTIVE_TAB_HEARTBEAT_KEY, String(Date.now()));
    this.blockedByOtherTab.set(false);
    this.channel?.postMessage({ type: 'claim', tabId: this.tabId() });
    return true;
  }

  /** Steal lock (explicit sign-in in this tab). */
  forceClaim(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(ACTIVE_TAB_KEY, this.tabId());
    localStorage.setItem(ACTIVE_TAB_HEARTBEAT_KEY, String(Date.now()));
    this.blockedByOtherTab.set(false);
    this.channel?.postMessage({ type: 'claim', tabId: this.tabId() });
  }

  release(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (localStorage.getItem(ACTIVE_TAB_KEY) === this.tabId()) {
      localStorage.removeItem(ACTIVE_TAB_KEY);
      localStorage.removeItem(ACTIVE_TAB_HEARTBEAT_KEY);
    }
    this.channel?.postMessage({ type: 'release', tabId: this.tabId() });
  }

  headers(): Record<string, string> {
    const id = this.tabId();
    return id ? { 'X-Tab-Id': id } : {};
  }
}