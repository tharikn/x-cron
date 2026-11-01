import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import type { AuthUser } from '../auth/auth.types';
import { IngestionService } from '../ingestion/ingestion.service';
import { TelegramAdapter } from './adapters/telegram.adapter';
import type { InboundChannelPost } from './adapters/channel-provider';
import { ChannelsStore } from './channels.store';
import type {
  ChannelMessage,
  ChannelSource,
  ChannelWorkflowSnapshot,
  PullRun,
  PullTrigger,
  WorkflowStageCount,
} from './channels.types';
import {
  CreateChannelSourceDto,
  ManualChannelMessageDto,
  UpdateChannelSourceDto,
  UpdatePullScheduleDto,
} from './dto/channels.dto';

@Injectable()
export class ChannelsService implements OnModuleInit {
  private readonly logger = new Logger(ChannelsService.name);

  constructor(
    private readonly store: ChannelsStore,
    private readonly telegram: TelegramAdapter,
    private readonly ingestion: IngestionService,
  ) {}

  onModuleInit() {
    this.telegram.onPosts((post) => this.ingestInbound(post));
    void this.telegram.start();
  }

  status() {
    return {
      telegramConfigured: this.telegram.configured,
      telegramMode: process.env.TELEGRAM_MODE ?? 'poll',
      schedule: this.store.getSchedule(),
      pendingMessages: this.store.listMessages({ status: 'pending' }).length,
      sources: this.store.listSources().length,
    };
  }

  workflow(): ChannelWorkflowSnapshot {
    const pending = this.store.listMessages({ status: 'pending' }).length;
    const pulled = this.store.listMessages({ status: 'pulled' }).length;
    const failed = this.store.listMessages({ status: 'failed' }).length;
    const pulls = this.store.listPulls(20);
    const review = pulls.filter((p) => p.status === 'needs_review').length;
    const publishedish = pulls.filter((p) => p.status === 'completed').length;
    const stages: WorkflowStageCount[] = [
      { key: 'inbox', label: 'Inbox', count: pending },
      { key: 'pulling', label: 'In digests', count: pulled },
      { key: 'review', label: 'Needs review', count: review },
      { key: 'published', label: 'Completed pulls', count: publishedish },
      { key: 'failed', label: 'Failed messages', count: failed },
    ];
    const schedule = this.store.getSchedule();
    return {
      stages,
      pendingMessages: pending,
      activeSources: this.store
        .listSources()
        .filter((s) => s.status === 'active').length,
      lastPull: pulls[0],
      nextPullHint: this.nextPullHint(schedule),
      schedule,
      telegramConfigured: this.telegram.configured,
    };
  }

  listSources() {
    return { items: this.store.listSources() };
  }

  createSource(dto: CreateChannelSourceDto): ChannelSource {
    const now = new Date().toISOString();
    const existing = this.store.findSourceByExternal(
      dto.provider,
      dto.externalId,
    );
    if (existing) {
      throw new BadRequestException('Source with this externalId already exists');
    }
    return this.store.saveSource({
      id: this.store.newId('src'),
      provider: dto.provider,
      label: dto.label.trim(),
      externalId: dto.externalId.trim(),
      status: 'active',
      notes: dto.notes?.trim(),
      createdAt: now,
      updatedAt: now,
    });
  }

  updateSource(id: string, dto: UpdateChannelSourceDto): ChannelSource {
    const source = this.store.getSource(id);
    if (!source) throw new NotFoundException('Source not found');
    const next: ChannelSource = {
      ...source,
      label: dto.label?.trim() || source.label,
      status: dto.status || source.status,
      notes: dto.notes !== undefined ? dto.notes.trim() : source.notes,
      externalId: dto.externalId?.trim() || source.externalId,
      updatedAt: new Date().toISOString(),
      lastError: dto.status === 'active' ? undefined : source.lastError,
    };
    return this.store.saveSource(next);
  }

  listMessages(status?: ChannelMessage['status'], sourceId?: string) {
    return {
      items: this.store.listMessages({ status, sourceId }),
    };
  }

  skipMessages(messageIds: string[]) {
    let skipped = 0;
    for (const id of messageIds) {
      const msg = this.store.getMessage(id);
      if (!msg || msg.status !== 'pending') continue;
      msg.status = 'skipped';
      this.store.saveMessage(msg);
      skipped += 1;
    }
    return { skipped };
  }

  addManualMessage(dto: ManualChannelMessageDto): ChannelMessage {
    let source = dto.sourceId
      ? this.store.getSource(dto.sourceId)
      : this.store
          .listSources()
          .find((s) => s.provider === 'whatsapp_manual' && s.status === 'active');

    if (!source && dto.label) {
      const now = new Date().toISOString();
      source = this.store.saveSource({
        id: this.store.newId('src'),
        provider: 'whatsapp_manual',
        label: dto.label.trim(),
        externalId: `wa:${dto.label.trim().toLowerCase().replace(/\s+/g, '-')}`,
        status: 'active',
        notes: 'Created from manual WhatsApp bridge paste.',
        createdAt: now,
        updatedAt: now,
      });
    }
    if (!source) {
      throw new BadRequestException(
        'No WhatsApp bridge source. Pass sourceId or label.',
      );
    }

    const now = new Date().toISOString();
    const message: ChannelMessage = {
      id: this.store.newId('msg'),
      sourceId: source.id,
      provider: source.provider,
      externalMessageId: `manual-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      text: dto.text.trim(),
      authorName: dto.authorName?.trim(),
      receivedAt: now,
      status: 'pending',
      createdAt: now,
    };
    this.store.saveMessage(message);
    source.lastMessageAt = now;
    source.updatedAt = now;
    this.store.saveSource(source);
    return message;
  }

  listPulls() {
    return { items: this.store.listPulls() };
  }

  getPull(id: string) {
    const run = this.store.getPull(id);
    if (!run) throw new NotFoundException('Pull run not found');
    const messages = run.messageIds
      .map((mid) => this.store.getMessage(mid))
      .filter(Boolean);
    return { run, messages };
  }

  getSchedule() {
    return this.store.getSchedule();
  }

  updateSchedule(user: AuthUser, dto: UpdatePullScheduleDto) {
    const current = this.store.getSchedule();
    return this.store.setSchedule({
      ...current,
      timezone: dto.timezone?.trim() || current.timezone,
      morningEnabled:
        dto.morningEnabled !== undefined
          ? dto.morningEnabled
          : current.morningEnabled,
      morningTime: dto.morningTime || current.morningTime,
      eveningEnabled:
        dto.eveningEnabled !== undefined
          ? dto.eveningEnabled
          : current.eveningEnabled,
      eveningTime: dto.eveningTime || current.eveningTime,
      ownerUserId: user.id,
      updatedAt: new Date().toISOString(),
      updatedByUserId: user.id,
    });
  }

  async handleTelegramWebhook(
    update: Record<string, unknown>,
    secretHeader?: string,
  ) {
    const expected = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
    if (expected && secretHeader !== expected) {
      throw new BadRequestException('Invalid webhook secret');
    }
    await this.telegram.handleWebhookUpdate(update);
    return { ok: true };
  }

  async ingestInbound(post: InboundChannelPost) {
    let source = this.store.findSourceByExternal(
      post.provider,
      post.externalChatId,
    );
    if (!source) {
      const now = new Date().toISOString();
      source = this.store.saveSource({
        id: this.store.newId('src'),
        provider: post.provider,
        label: post.chatTitle || `Telegram ${post.externalChatId}`,
        externalId: post.externalChatId,
        status: 'active',
        notes: 'Auto-registered from inbound Telegram post.',
        createdAt: now,
        updatedAt: now,
      });
      this.logger.log(`Auto-registered Telegram source ${source.externalId}`);
    }
    if (source.status === 'paused') return;

    if (
      this.store.findMessageByExternal(
        post.provider,
        source.id,
        post.externalMessageId,
      )
    ) {
      return;
    }

    const now = new Date().toISOString();
    this.store.saveMessage({
      id: this.store.newId('msg'),
      sourceId: source.id,
      provider: post.provider,
      externalMessageId: post.externalMessageId,
      text: post.text,
      authorName: post.authorName,
      receivedAt: post.receivedAt || now,
      status: 'pending',
      createdAt: now,
    });
    source.lastMessageAt = now;
    source.updatedAt = now;
    this.store.saveSource(source);
  }

  async pullNow(
    user: AuthUser | undefined,
    trigger: PullTrigger,
    opts?: {
      sourceIds?: string[];
      messageIds?: string[];
      maxMessages?: number;
    },
  ): Promise<PullRun> {
    const sourceIds = opts?.sourceIds;
    const messageIds = opts?.messageIds;
    const maxMessages = opts?.maxMessages;
    const run: PullRun = {
      id: this.store.newId('pull'),
      trigger,
      status: 'running',
      sourceIds: sourceIds ?? [],
      messageIds: [],
      messageCount: 0,
      recordCount: 0,
      startedAt: new Date().toISOString(),
      createdByUserId: user?.id,
    };
    this.store.savePull(run);

    try {
      let pending = this.store.listMessages({ status: 'pending' });
      if (messageIds?.length) {
        const allowed = new Set(messageIds);
        pending = pending.filter((m) => allowed.has(m.id));
      }
      if (sourceIds?.length) {
        const allowed = new Set(sourceIds);
        pending = pending.filter((m) => allowed.has(m.sourceId));
        run.sourceIds = sourceIds;
      } else {
        run.sourceIds = [
          ...new Set(
            pending
              .map((m) => m.sourceId)
              .filter((id) => this.store.getSource(id)?.status === 'active'),
          ),
        ];
        pending = pending.filter((m) => run.sourceIds.includes(m.sourceId));
      }

      pending = [...pending].sort((a, b) =>
        a.receivedAt.localeCompare(b.receivedAt),
      );
      if (maxMessages && maxMessages > 0 && pending.length > maxMessages) {
        pending = pending.slice(0, maxMessages);
      }

      if (!pending.length) {
        run.status = 'empty';
        run.finishedAt = new Date().toISOString();
        this.store.savePull(run);
        return run;
      }

      const digest = pending
        .map((m) => {
          const src = this.store.getSource(m.sourceId);
          return [
            `---`,
            `Source: ${src?.label || m.sourceId}`,
            m.authorName ? `From: ${m.authorName}` : null,
            m.text,
          ]
            .filter(Boolean)
            .join('\n');
        })
        .join('\n\n');

      const ownerUserId =
        user?.id ||
        this.store.getSchedule().ownerUserId ||
        process.env.CHANNEL_PULL_OWNER_USER_ID?.trim();
      if (!ownerUserId) {
        throw new BadRequestException(
          'No pull owner. Open Job Fare as admin once (saves schedule owner) or set CHANNEL_PULL_OWNER_USER_ID.',
        );
      }

      const sourceType = pending.every((m) => m.provider === 'telegram')
        ? 'telegram'
        : pending.every((m) => m.provider === 'whatsapp_manual')
          ? 'whatsapp'
          : 'telegram';

      const result = await this.ingestion.ingestDigestText({
        ownerUserId,
        employerName: 'Job Fare channel pull',
        text: digest,
        sourceType,
        filename: `jobfare-${trigger}-${run.id}.txt`,
      });

      run.importBatchId = result.batch.id;
      run.messageIds = pending.map((m) => m.id);
      run.messageCount = pending.length;
      run.recordCount = result.recordIds.length;
      run.status = 'needs_review';
      run.finishedAt = new Date().toISOString();

      for (const msg of pending) {
        msg.status = 'pulled';
        msg.pullRunId = run.id;
        msg.importBatchId = result.batch.id;
        this.store.saveMessage(msg);
      }
      this.store.savePull(run);
      return run;
    } catch (err) {
      run.status = 'failed';
      run.error = err instanceof Error ? err.message : 'pull_failed';
      run.finishedAt = new Date().toISOString();
      this.store.savePull(run);
      throw err;
    }
  }

  /** Called by scheduler for morning/evening windows. */
  async maybeRunScheduledSlot(): Promise<PullRun | null> {
    const schedule = this.store.getSchedule();
    const nowParts = this.zonedHm(schedule.timezone || 'Asia/Kolkata');
    const hm = `${nowParts.hh}:${nowParts.mm}`;
    const dayKey = `${nowParts.ymd}-${hm}`;

    let trigger: PullTrigger | null = null;
    if (schedule.morningEnabled && schedule.morningTime === hm) {
      trigger = 'morning';
    } else if (schedule.eveningEnabled && schedule.eveningTime === hm) {
      trigger = 'evening';
    }
    if (!trigger) return null;
    if (this.store.getLastFiredSlotKey() === dayKey) return null;

    this.store.setLastFiredSlotKey(dayKey);
    this.logger.log(`Scheduled Job Fare pull (${trigger}) at ${hm}`);
    try {
      return await this.pullNow(undefined, trigger);
    } catch (err) {
      this.logger.warn(
        `Scheduled pull failed: ${err instanceof Error ? err.message : String(err)}`,
      );
      return null;
    }
  }

  private nextPullHint(schedule: ReturnType<ChannelsStore['getSchedule']>) {
    const parts: string[] = [];
    if (schedule.morningEnabled) {
      parts.push(`Morning ${schedule.morningTime}`);
    }
    if (schedule.eveningEnabled) {
      parts.push(`Evening ${schedule.eveningTime}`);
    }
    if (!parts.length) return 'Schedule disabled';
    return `${parts.join(' · ')} (${schedule.timezone})`;
  }

  private zonedHm(timeZone: string) {
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    });
    const parts = fmt.formatToParts(new Date());
    const get = (type: string) =>
      parts.find((p) => p.type === type)?.value ?? '00';
    return {
      ymd: `${get('year')}-${get('month')}-${get('day')}`,
      hh: get('hour'),
      mm: get('minute'),
    };
  }
}
