import { Injectable } from '@nestjs/common';
import type { FaqItem } from '../feedback.types';
import { FaqProvider } from './faq.provider';

const SEED: FaqItem[] = [
  {
    id: 'faq-what-is-xcron',
    category: 'general',
    question: 'What is X Cron Jobs?',
    answer:
      'X Cron is a local-first job discovery app for younger seekers in India. Browse roles freely — employer phone, email, WhatsApp, and website show on job detail with no unlock paywall.',
    sortOrder: 10,
  },
  {
    id: 'faq-guest-browse',
    category: 'general',
    question: 'Do I need an account to browse jobs?',
    answer:
      'No. Guests can search and open job detail. Sign in when you want to save jobs, apply, sync preferences, or Contact Admin.',
    sortOrder: 20,
  },
  {
    id: 'faq-seeker-apply',
    category: 'seeker',
    question: 'How do I apply for a job?',
    answer:
      'Sign in as a Job Seeker, complete an Apply profile (skills + headline + summary), open a role, and use Easy apply. You can track status and chat with the recruiter on Applied jobs.',
    sortOrder: 30,
  },
  {
    id: 'faq-seeker-contact',
    category: 'seeker',
    question: 'Where do I find employer contact details?',
    answer:
      'On every job detail page. Phone, email, WhatsApp, and website are public — there is no paywall to unlock contact.',
    sortOrder: 40,
  },
  {
    id: 'faq-seeker-score',
    category: 'seeker',
    question: 'What is My Rating / Performance Score?',
    answer:
      'It reflects apply fit and chat discipline so recruiters and seekers build trust. Keep profiles complete and reply in application chat to stay in a healthy band.',
    sortOrder: 50,
  },
  {
    id: 'faq-recruiter-post',
    category: 'recruiter',
    question: 'How do I post a job as a recruiter?',
    answer:
      'Create an account as Recruiter (or open Post), fill the compose form, preview, then publish. Recruiter posts go live directly; noisy imports still use Blog Approval for admins.',
    sortOrder: 60,
  },
  {
    id: 'faq-recruiter-applicants',
    category: 'recruiter',
    question: 'How do I review applicants?',
    answer:
      'Open Feeds / My Jobs → applicants for a role. You can advance status, send an offer letter, and chat with the seeker in the application timeline.',
    sortOrder: 70,
  },
  {
    id: 'faq-account-roles',
    category: 'account',
    question: 'Can I be both a seeker and a recruiter?',
    answer:
      'Yes. One account can hold both roles. Use Contact Admin as Seeker or as Recruiter so we route your message with the right context.',
    sortOrder: 80,
  },
  {
    id: 'faq-contact-admin',
    category: 'general',
    question: 'How do I contact X Cron admin?',
    answer:
      'Open Feedback → Contact Admin after sign-in. Start a thread (question, bug, suggestion, or account). An admin replies in the same in-app messenger.',
    sortOrder: 90,
  },
  {
    id: 'faq-notifications',
    category: 'general',
    question: 'Why am I not getting notifications?',
    answer:
      'Sign in, open Settings → Preferences, and enable in-app / push / email alerts. On Android, allow notification permission so tray alerts can appear.',
    sortOrder: 100,
  },
];

@Injectable()
export class StaticFaqProvider extends FaqProvider {
  readonly name = 'static';

  async list(): Promise<FaqItem[]> {
    return [...SEED].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getById(id: string): Promise<FaqItem | null> {
    return SEED.find((item) => item.id === id) ?? null;
  }
}
