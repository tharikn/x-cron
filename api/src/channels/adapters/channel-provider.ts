import type { ChannelProviderKind } from '../channels.types';

/** Normalized inbound post from any free channel adapter. */
export interface InboundChannelPost {
  provider: ChannelProviderKind;
  externalChatId: string;
  externalMessageId: string;
  text: string;
  authorName?: string;
  receivedAt: string;
  chatTitle?: string;
}

export interface ChannelProvider {
  readonly kind: ChannelProviderKind;
  /** Optional long-poll / webhook warm-up */
  start?(): Promise<void> | void;
  stop?(): Promise<void> | void;
}
