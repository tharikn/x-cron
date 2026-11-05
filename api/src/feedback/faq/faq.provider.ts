import type { FaqItem } from '../feedback.types';

/**
 * Strategy interface for FAQ catalogs.
 * Swap StaticFaqProvider for CMS/AI-backed providers without changing callers.
 */
export abstract class FaqProvider {
  abstract readonly name: string;
  abstract list(): Promise<FaqItem[]>;
  abstract getById(id: string): Promise<FaqItem | null>;
}

export const FAQ_PROVIDER = Symbol('FAQ_PROVIDER');
