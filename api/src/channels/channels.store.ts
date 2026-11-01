import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type {
  ChannelMessage,
  ChannelSource,
  PullRun,
  PullSchedule,
} from './channels.types';

@Injectable()
export class ChannelsStore {
  private readonly sources = new Map<string, ChannelSource>();
  private readonly messages = new Map<string, ChannelMessage>();
  private readonly pulls = new Map<string, PullRun>();
  private schedule: PullSchedule = {
    timezone: 'Asia/Kolkata',
    morningEnabled: true,
    morningTime: '07:30',
    eveningEnabled: true,
    eveningTime: '18:30',
    updatedAt: new Date().toISOString(),
  };
  /** Prevent double-fire of the same HH:mm slot in one day */
  private lastFiredSlotKey?: string;

  constructor() {
    this.seedDemo();
  }

  newId(prefix: string) {
    return `${prefix}_${randomUUID().slice(0, 8)}`;
  }

  getSchedule(): PullSchedule {
    return { ...this.schedule };
  }

  setSchedule(next: PullSchedule) {
    this.schedule = { ...next };
    return this.getSchedule();
  }

  getLastFiredSlotKey() {
    return this.lastFiredSlotKey;
  }

  setLastFiredSlotKey(key: string) {
    this.lastFiredSlotKey = key;
  }

  listSources(): ChannelSource[] {
    return [...this.sources.values()].sort((a, b) =>
      a.label.localeCompare(b.label),
    );
  }

  getSource(id: string) {
    return this.sources.get(id);
  }

  findSourceByExternal(provider: string, externalId: string) {
    return [...this.sources.values()].find(
      (s) => s.provider === provider && s.externalId === externalId,
    );
  }

  saveSource(source: ChannelSource) {
    this.sources.set(source.id, source);
    return source;
  }

  listMessages(filter?: {
    status?: ChannelMessage['status'];
    sourceId?: string;
  }): ChannelMessage[] {
    let items = [...this.messages.values()];
    if (filter?.status) items = items.filter((m) => m.status === filter.status);
    if (filter?.sourceId) {
      items = items.filter((m) => m.sourceId === filter.sourceId);
    }
    return items.sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
  }

  getMessage(id: string) {
    return this.messages.get(id);
  }

  findMessageByExternal(
    provider: string,
    sourceId: string,
    externalMessageId: string,
  ) {
    return [...this.messages.values()].find(
      (m) =>
        m.provider === provider &&
        m.sourceId === sourceId &&
        m.externalMessageId === externalMessageId,
    );
  }

  saveMessage(message: ChannelMessage) {
    this.messages.set(message.id, message);
    return message;
  }

  listPulls(limit = 30): PullRun[] {
    return [...this.pulls.values()]
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
      .slice(0, limit);
  }

  getPull(id: string) {
    return this.pulls.get(id);
  }

  savePull(run: PullRun) {
    this.pulls.set(run.id, run);
    return run;
  }

  private seedDemo() {
    const now = new Date().toISOString();
    const tg: ChannelSource = {
      id: this.newId('src'),
      provider: 'telegram',
      label: 'Palani Jobfare (Telegram)',
      externalId: '-1000000000001',
      status: 'paused',
      notes:
        'Demo source. Replace externalId with real Telegram chat/channel id after adding the bot.',
      createdAt: now,
      updatedAt: now,
    };
    const wa: ChannelSource = {
      id: this.newId('src'),
      provider: 'whatsapp_manual',
      label: 'Local WhatsApp Jobfare (bridge)',
      externalId: 'wa:palani-jobfare',
      status: 'active',
      notes:
        'Free bridge: paste/forward WhatsApp posts here. No unofficial WA scrapers.',
      createdAt: now,
      updatedAt: now,
    };
    this.sources.set(tg.id, tg);
    this.sources.set(wa.id, wa);

    const sample: ChannelMessage = {
      id: this.newId('msg'),
      sourceId: wa.id,
      provider: 'whatsapp_manual',
      externalMessageId: `demo-${Date.now()}`,
      text: [
        'Hiring: Shop Assistant — Palani',
        'Salary ₹12,000/month',
        'Call 9876543210 after 6pm',
        'Tamil + English OK',
      ].join('\n'),
      authorName: 'Demo employer',
      receivedAt: now,
      status: 'pending',
      createdAt: now,
    };
    this.messages.set(sample.id, sample);
  }
}
