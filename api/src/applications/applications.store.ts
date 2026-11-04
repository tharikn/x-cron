import type { ApplyProfileSnapshot } from '../apply-profiles/apply-profiles.types';
import {
  ApplicationEvent,
  ApplicationEventType,
  ApplicationMessage,
  ApplicationStatus,
  JobApplication,
} from './applications.types';

export abstract class ApplicationsStore {
  abstract createApplication(input: {
    jobId: string;
    employerId: string;
    seekerUserId: string;
    ownerUserId: string;
    coverNote?: string;
    applyProfileId?: string;
    applyProfileSnapshot?: ApplyProfileSnapshot;
    seekerName?: string;
    seekerPhone?: string;
    seekerEmail?: string;
    screeningAnswer?: string;
    likelySpam?: boolean;
    spamReasons?: string[];
    matchPercent?: number;
  }): Promise<JobApplication>;

  abstract findById(id: string): Promise<JobApplication | undefined>;

  abstract findBySeekerAndJob(
    seekerUserId: string,
    jobId: string,
  ): Promise<JobApplication | undefined>;

  abstract listForSeeker(seekerUserId: string): Promise<JobApplication[]>;

  /** Count applications created by seeker at/after `sinceIso` (inclusive). */
  abstract countCreatedBySeekerSince(
    seekerUserId: string,
    sinceIso: string,
  ): Promise<number>;

  /** Latest application createdAt for seeker (any job), or undefined. */
  abstract latestCreatedAtForSeeker(
    seekerUserId: string,
  ): Promise<string | undefined>;

  /** Non-empty cover notes created by seeker at/after `sinceIso` (anti copy-paste spam). */
  abstract listCoverNotesBySeekerSince(
    seekerUserId: string,
    sinceIso: string,
  ): Promise<string[]>;

  abstract listForJob(jobId: string): Promise<JobApplication[]>;

  abstract listForOwner(ownerUserId: string): Promise<JobApplication[]>;

  abstract updateApplication(
    id: string,
    patch: Partial<
      Pick<
        JobApplication,
        | 'status'
        | 'coverNote'
        | 'seekerName'
        | 'seekerPhone'
        | 'seekerEmail'
        | 'offerLetterText'
        | 'viewedAt'
      >
    >,
  ): Promise<JobApplication | undefined>;

  abstract appendEvent(input: {
    applicationId: string;
    type: ApplicationEventType;
    fromStatus?: ApplicationStatus;
    toStatus?: ApplicationStatus;
    actorUserId?: string;
    actorRole: ApplicationEvent['actorRole'];
    note?: string;
    meta?: Record<string, string | number | boolean | null>;
  }): Promise<ApplicationEvent>;

  abstract listEvents(applicationId: string): Promise<ApplicationEvent[]>;

  abstract appendMessage(input: {
    applicationId: string;
    senderUserId: string;
    senderRole: ApplicationMessage['senderRole'];
    body: string;
  }): Promise<ApplicationMessage>;

  abstract listMessages(applicationId: string): Promise<ApplicationMessage[]>;

  abstract clearForUser(userId: string): Promise<void>;
}
