import type {
  FeedbackAudience,
  FeedbackCategory,
  FeedbackMessage,
  FeedbackSenderRole,
  FeedbackThread,
  FeedbackThreadStatus,
} from './feedback.types';

/** Repository port — memory or Prisma implementations. */
export abstract class FeedbackStore {
  abstract createThread(input: {
    userId: string;
    audience: FeedbackAudience;
    category: FeedbackCategory;
    subject: string;
    status: FeedbackThreadStatus;
    lastSenderRole: FeedbackSenderRole;
  }): Promise<FeedbackThread>;

  abstract updateThread(
    id: string,
    patch: {
      status?: FeedbackThreadStatus;
      lastMessageAt?: string;
      lastSenderRole?: FeedbackSenderRole;
      /** Pass `null` to clear closedAt (reopen). */
      closedAt?: string | null;
      updatedAt?: string;
    },
  ): Promise<FeedbackThread | null>;

  abstract getThread(id: string): Promise<FeedbackThread | null>;

  abstract listThreadsForUser(userId: string): Promise<FeedbackThread[]>;

  abstract listThreadsAdmin(filter?: {
    status?: FeedbackThreadStatus | 'all';
    audience?: FeedbackAudience;
  }): Promise<FeedbackThread[]>;

  abstract appendMessage(input: {
    threadId: string;
    senderUserId: string;
    senderRole: FeedbackSenderRole;
    body: string;
  }): Promise<FeedbackMessage>;

  abstract listMessages(threadId: string): Promise<FeedbackMessage[]>;

  abstract clearForUser(userId: string): Promise<void>;
}
