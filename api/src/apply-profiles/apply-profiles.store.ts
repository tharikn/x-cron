import {
  ApplyProfile,
  ApplyProfileLink,
  ApplyProfileProject,
  ExperienceBand,
} from './apply-profiles.types';

export type ApplyProfileWriteInput = {
  name: string;
  headline?: string;
  summary?: string;
  experienceBand?: ExperienceBand;
  skills: string[];
  projects: ApplyProfileProject[];
  portfolioLinks: ApplyProfileLink[];
  isDefault: boolean;
};

export abstract class ApplyProfilesStore {
  abstract listForUser(userId: string): Promise<ApplyProfile[]>;

  abstract findById(id: string): Promise<ApplyProfile | undefined>;

  abstract countForUser(userId: string): Promise<number>;

  abstract create(
    userId: string,
    input: ApplyProfileWriteInput,
  ): Promise<ApplyProfile>;

  abstract update(
    id: string,
    patch: Partial<ApplyProfileWriteInput>,
  ): Promise<ApplyProfile | undefined>;

  /** Clear isDefault on all other versions for this user. */
  abstract clearDefaultExcept(
    userId: string,
    keepId: string,
  ): Promise<void>;

  abstract delete(id: string): Promise<boolean>;

  abstract clearForUser(userId: string): Promise<void>;
}
