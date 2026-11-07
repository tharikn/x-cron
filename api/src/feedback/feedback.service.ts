import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthUser } from '../auth/auth.types';
import { AuthStore } from '../auth/auth.store';
import { NotificationsService } from '../notifications/notifications.service';
import { RedisService } from '../redis/redis.service';
import {
  CreateFeedbackThreadDto,
  SendFeedbackMessageDto,
} from './dto/feedback.dto';
import { FAQ_PROVIDER, FaqProvider } from './faq/faq.provider';
import { FeedbackPresenceTracker } from './feedback-presence';
import { FeedbackStore } from './feedback.store';
import {
  FEEDBACK_CATEGORY_LABELS,
  FEEDBACK_STATUS_LABELS,
  type FeedbackAudience,
  type FeedbackMessage,
  type FeedbackSenderRole,
  type FeedbackThread,
  type FeedbackThreadStatus,
} from './feedback.types';

@Injectable()
export class FeedbackService {
  private readonly presence: FeedbackPresenceTracker;

  constructor(
    private readonly store: FeedbackStore,
    @Inject(FAQ_PROVIDER) private readonly faq: FaqProvider,
    private readonly authStore: AuthStore,
    private readonly notifications: NotificationsService,
    redis: RedisService,
  ) {
    this.presence = new FeedbackPresenceTracker(redis);
  }

  async listFaq() {
    const items = await this.faq.list();
    return {
      provider: this.faq.name,
      items,
    };
  }

  async listMyThreads(user: AuthUser) {
    const threads = await this.store.listThreadsForUser(user.id);
    return { items: threads.map((t) => this.toThreadDto(t)) };
  }

  async getMyThread(user: AuthUser, id: string) {
    const thread = await this.requireOwnedThread(user, id);
    const role = thread.audience as FeedbackSenderRole;
    await this.presence.touch(thread.id, user.id, role);
    const messages = await this.store.listMessages(thread.id);
    return this.toDetailDto(thread, messages, user, false);
  }

  async createThread(user: AuthUser, dto: CreateFeedbackThreadDto) {
    this.assertAudienceAllowed(user, dto.audience);
    const subject = dto.subject.trim();
    const body = dto.body.trim();
    if (!subject || !body) {
      throw new BadRequestException('Subject and message body are required');
    }

    const senderRole = dto.audience as FeedbackSenderRole;
    const thread = await this.store.createThread({
      userId: user.id,
      audience: dto.audience,
      category: dto.category,
      subject,
      status: 'awaiting_admin',
      lastSenderRole: senderRole,
    });

    const message = await this.store.appendMessage({
      threadId: thread.id,
      senderUserId: user.id,
      senderRole,
      body,
    });

    await this.store.updateThread(thread.id, {
      lastMessageAt: message.createdAt,
      lastSenderRole: senderRole,
      status: 'awaiting_admin',
    });

    const fresh = (await this.store.getThread(thread.id))!;
    await this.presence.setTyping(fresh.id, user.id, senderRole, false);
    await this.presence.touch(fresh.id, user.id, senderRole);
    await this.notifyAdmins(fresh, message, 'New feedback message');

    const messages = await this.store.listMessages(fresh.id);
    return this.toDetailDto(fresh, messages, user, false);
  }

  async sendMyMessage(
    user: AuthUser,
    id: string,
    dto: SendFeedbackMessageDto,
  ) {
    const thread = await this.requireOwnedThread(user, id);
    if (thread.status === 'closed') {
      throw new BadRequestException('This conversation is closed');
    }
    const body = dto.body.trim();
    if (!body) throw new BadRequestException('Message body is required');

    const senderRole = thread.audience as FeedbackSenderRole;
    const message = await this.store.appendMessage({
      threadId: thread.id,
      senderUserId: user.id,
      senderRole,
      body,
    });

    const updated = await this.store.updateThread(thread.id, {
      lastMessageAt: message.createdAt,
      lastSenderRole: senderRole,
      status: 'awaiting_admin',
    });

    await this.presence.setTyping(thread.id, user.id, senderRole, false);
    await this.notifyAdmins(updated!, message, 'New feedback message');
    return message;
  }

  async setMyTyping(user: AuthUser, id: string, typing: boolean) {
    const thread = await this.requireOwnedThread(user, id);
    if (thread.status === 'closed') {
      return {
        ok: true as const,
        presence: await this.peerPresence(thread, user, false),
      };
    }
    const role = thread.audience as FeedbackSenderRole;
    await this.presence.setTyping(thread.id, user.id, role, typing);
    return {
      ok: true as const,
      presence: await this.peerPresence(thread, user, false),
    };
  }

  async closeMyThread(user: AuthUser, id: string) {
    const thread = await this.requireOwnedThread(user, id);
    if (thread.status === 'closed') {
      return this.toThreadDto(thread);
    }
    const updated = await this.store.updateThread(thread.id, {
      status: 'closed',
      closedAt: new Date().toISOString(),
    });
    return this.toThreadDto(updated!);
  }

  async listAdminThreads(filter?: {
    status?: FeedbackThreadStatus | 'all';
    audience?: FeedbackAudience;
  }) {
    const threads = await this.store.listThreadsAdmin(filter);
    return {
      items: threads.map((t) => {
        const user = this.authStore.getUser(t.userId);
        return {
          ...this.toThreadDto(t),
          userDisplayName:
            user?.displayName || user?.username || user?.email || t.userId,
        };
      }),
    };
  }

  async getAdminThread(id: string, admin: AuthUser) {
    const thread = await this.requireThread(id);
    await this.presence.touch(thread.id, admin.id, 'admin');
    const messages = await this.store.listMessages(thread.id);
    const user = this.authStore.getUser(thread.userId);
    return {
      ...(await this.toDetailDto(thread, messages, admin, true)),
      userDisplayName:
        user?.displayName || user?.username || user?.email || thread.userId,
    };
  }

  async sendAdminMessage(
    admin: AuthUser,
    id: string,
    dto: SendFeedbackMessageDto,
  ) {
    const thread = await this.requireThread(id);
    if (thread.status === 'closed') {
      throw new BadRequestException('This conversation is closed — reopen first');
    }
    const body = dto.body.trim();
    if (!body) throw new BadRequestException('Message body is required');

    const message = await this.store.appendMessage({
      threadId: thread.id,
      senderUserId: admin.id,
      senderRole: 'admin',
      body,
    });

    const updated = await this.store.updateThread(thread.id, {
      lastMessageAt: message.createdAt,
      lastSenderRole: 'admin',
      status: 'awaiting_user',
    });

    await this.presence.setTyping(thread.id, admin.id, 'admin', false);
    await this.notifications.onSupportEvent({
      threadId: thread.id,
      recipientUserId: thread.userId,
      recipientRole: thread.audience,
      title: 'Admin replied',
      body: `Your feedback\nRe: ${thread.subject}`,
      eventType: 'admin_reply',
      audience: thread.audience,
      messageId: message.id,
    });

    return { message, thread: this.toThreadDto(updated!) };
  }

  async setAdminTyping(admin: AuthUser, id: string, typing: boolean) {
    const thread = await this.requireThread(id);
    if (thread.status === 'closed') {
      return {
        ok: true as const,
        presence: await this.peerPresence(thread, admin, true),
      };
    }
    await this.presence.setTyping(thread.id, admin.id, 'admin', typing);
    return {
      ok: true as const,
      presence: await this.peerPresence(thread, admin, true),
    };
  }

  async closeAdminThread(id: string) {
    const thread = await this.requireThread(id);
    const updated = await this.store.updateThread(thread.id, {
      status: 'closed',
      closedAt: new Date().toISOString(),
    });
    return this.toThreadDto(updated!);
  }

  async reopenAdminThread(id: string) {
    await this.requireThread(id);
    const updated = await this.store.updateThread(id, {
      status: 'awaiting_admin',
      closedAt: null,
    });
    return this.toThreadDto(updated!);
  }

  async clearForUser(userId: string): Promise<void> {
    await this.store.clearForUser(userId);
  }

  private assertAudienceAllowed(user: AuthUser, audience: FeedbackAudience) {
    if (audience === 'employer') {
      if (
        !user.roles.includes('employer') &&
        !user.roles.includes('admin')
      ) {
        throw new ForbiddenException(
          'Recruiter role required to contact admin as recruiter',
        );
      }
      return;
    }
    // seeker audience — any signed-in user (default seeker role)
    if (
      !user.roles.includes('seeker') &&
      !user.roles.includes('employer') &&
      !user.roles.includes('admin')
    ) {
      throw new ForbiddenException('Signed-in role required');
    }
  }

  private async requireOwnedThread(
    user: AuthUser,
    id: string,
  ): Promise<FeedbackThread> {
    const thread = await this.requireThread(id);
    if (thread.userId !== user.id && !user.roles.includes('admin')) {
      throw new ForbiddenException('Not your feedback thread');
    }
    return thread;
  }

  private async requireThread(id: string): Promise<FeedbackThread> {
    const thread = await this.store.getThread(id);
    if (!thread) throw new NotFoundException('Feedback thread not found');
    return thread;
  }

  private async notifyAdmins(
    thread: FeedbackThread,
    message: FeedbackMessage,
    title: string,
  ) {
    const admins = this.authStore
      .listUsers()
      .filter((u) => u.roles.includes('admin') && u.id !== message.senderUserId);
    const targets = admins.length
      ? admins
      : this.authStore.listUsers().filter((u) => u.roles.includes('admin'));

    await Promise.all(
      targets.map((admin) =>
        this.notifications.onSupportEvent({
          threadId: thread.id,
          recipientUserId: admin.id,
          recipientRole: 'employer',
          title,
          body: `${thread.audience === 'employer' ? 'Recruiter' : 'Seeker'}\n${thread.subject}`,
          eventType: 'user_message',
          audience: thread.audience,
          messageId: message.id,
        }),
      ),
    );
  }

  private toThreadDto(thread: FeedbackThread) {
    return {
      id: thread.id,
      userId: thread.userId,
      audience: thread.audience,
      audienceLabel: thread.audience === 'employer' ? 'Recruiter' : 'Seeker',
      category: thread.category,
      categoryLabel: FEEDBACK_CATEGORY_LABELS[thread.category],
      subject: thread.subject,
      status: thread.status,
      statusLabel: FEEDBACK_STATUS_LABELS[thread.status],
      lastMessageAt: thread.lastMessageAt,
      lastSenderRole: thread.lastSenderRole,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
      closedAt: thread.closedAt ?? null,
    };
  }

  private async toDetailDto(
    thread: FeedbackThread,
    messages: FeedbackMessage[],
    viewer?: AuthUser,
    asAdmin = false,
  ) {
    return {
      ...this.toThreadDto(thread),
      messages: messages.map((m) => ({
        id: m.id,
        threadId: m.threadId,
        senderUserId: m.senderUserId,
        senderRole: m.senderRole,
        body: m.body,
        createdAt: m.createdAt,
      })),
      presence: viewer
        ? await this.peerPresence(thread, viewer, asAdmin)
        : null,
    };
  }

  private peerPresence(
    thread: FeedbackThread,
    viewer: AuthUser,
    asAdmin: boolean,
  ) {
    return this.presence.peerFor({
      threadId: thread.id,
      threadUserId: thread.userId,
      audience: thread.audience,
      viewerUserId: viewer.id,
      viewerIsAdmin: asAdmin,
    });
  }
}
