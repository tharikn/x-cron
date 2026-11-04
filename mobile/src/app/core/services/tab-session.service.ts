import { Injectable, signal } from '@angular/core';

const TAB_ID_KEY = 'xcron.tabId';
const ACTIVE_TAB_KEY = 'xcron.activeTab';
const CHANNEL = 'xcron-auth-tab';

/**
 * One active browser tab for the Ionic web shell / PWA.
 * Native Capacitor usually has a single WebView — claim always succeeds.
 */
@Injectable({ providedIn: 'root' })
export class TabSessionService {
  private channel: BroadcastChannel | null = null;

  readonly tabId = signal<string>('');
  readonly blockedByOtherTab = signal(false);

  constructor() {
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
  }

  claim(): boolean {
    const owner = localStorage.getItem(ACTIVE_TAB_KEY);
    if (owner && owner !== this.tabId()) {
      this.blockedByOtherTab.set(true);
      return false;
    }
    localStorage.setItem(ACTIVE_TAB_KEY, this.tabId());
    this.blockedByOtherTab.set(false);
    this.channel?.postMessage({ type: 'claim', tabId: this.tabId() });
    return true;
  }

  forceClaim(): void {
    localStorage.setItem(ACTIVE_TAB_KEY, this.tabId());
    this.blockedByOtherTab.set(false);
    this.channel?.postMessage({ type: 'claim', tabId: this.tabId() });
  }

  release(): void {
    if (localStorage.getItem(ACTIVE_TAB_KEY) === this.tabId()) {
      localStorage.removeItem(ACTIVE_TAB_KEY);
    }
    this.channel?.postMessage({ type: 'release', tabId: this.tabId() });
  }

  headers(): Record<string, string> {
    const id = this.tabId();
    return id ? { 'X-Tab-Id': id } : {};
  }
}
