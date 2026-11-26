import { renderBaseLayout } from './layouts/base.layout';

export interface OtpTemplateData {
  code: string;
  purpose: 'signup' | 'login' | 'recovery' | 'verification';
  expiresInMinutes: number;
  recipientName?: string;
}

export interface VerificationTemplateData {
  verificationUrl: string;
  recipientName?: string;
  expiresInHours?: number;
}

export interface RecoveryTemplateData {
  recoveryUrl: string;
  recipientName?: string;
  expiresInMinutes?: number;
}

export interface JobAlertTemplateData {
  jobTitle: string;
  employerName: string;
  city: string;
  jobType?: string;
  salaryText?: string;
  jobUrl: string;
  summary?: string;
}

export interface WeeklyDigestTemplateData {
  recipientName?: string;
  jobs: Array<{
    title: string;
    employerName: string;
    city: string;
    jobType?: string;
    salaryText?: string;
    url: string;
  }>;
  periodLabel?: string;
  preferencesUrl?: string;
}

export interface WelcomeTemplateData {
  recipientName?: string;
  ctaUrl?: string;
}

const PURPOSE_LABEL: Record<OtpTemplateData['purpose'], string> = {
  signup: 'verify your email and complete sign-up',
  login: 'sign in to your account',
  recovery: 'reset your password',
  verification: 'verify your email address',
};

export function renderOtpEmail(data: OtpTemplateData): {
  subject: string;
  text: string;
  html: string;
} {
  const label = PURPOSE_LABEL[data.purpose];
  const name = data.recipientName?.trim() || 'there';
  const subject = `Your X Cron Jobs verification code: ${data.code}`;
  const text = `Hi ${name},

Your verification code is: ${data.code}

Use this code to ${label}. The code expires in ${data.expiresInMinutes} minutes.

If you didn't request this, you can safely ignore this email.

— X Cron Jobs`;
  const body = `
    <h2>Hi ${escapeHtml(name)},</h2>
    <p>Use the code below to ${escapeHtml(label)}.</p>
    <div style="text-align:center; margin:20px 0;">
      <span class="code">${escapeHtml(data.code)}</span>
    </div>
    <p style="font-size:13px; color:#6b7280;">This code expires in <strong>${data.expiresInMinutes} minutes</strong>. Do not share it with anyone.</p>
    <p style="font-size:13px; color:#6b7280;">If you didn't request this, you can safely ignore this email.</p>
  `;
  const html = renderBaseLayout(body, {
    title: 'Your verification code',
    preheader: `Your code is ${data.code}. Expires in ${data.expiresInMinutes} minutes.`,
  });
  return { subject, text, html };
}

export function renderVerificationEmail(data: VerificationTemplateData): {
  subject: string;
  text: string;
  html: string;
} {
  const name = data.recipientName?.trim() || 'there';
  const hours = data.expiresInHours ?? 24;
  const subject = 'Verify your email address — X Cron Jobs';
  const text = `Hi ${name},

Please verify your email address by visiting:
${data.verificationUrl}

This link expires in ${hours} hours.

If you didn't create an account, you can ignore this email.

— X Cron Jobs`;
  const body = `
    <h2>Hi ${escapeHtml(name)},</h2>
    <p>Thanks for signing up. Please verify your email address to activate your account.</p>
    <p style="text-align:center; margin:24px 0;">
      <a class="cta" href="${escapeAttr(data.verificationUrl)}">Verify email address</a>
    </p>
    <p style="font-size:13px; color:#6b7280;">This link expires in ${hours} hours. If the button doesn't work, copy and paste this URL:</p>
    <p style="font-size:12px; word-break:break-all; color:#6b7280;">${escapeHtml(data.verificationUrl)}</p>
  `;
  const html = renderBaseLayout(body, {
    title: 'Verify your email',
    preheader: 'Confirm your email address to activate your X Cron Jobs account.',
  });
  return { subject, text, html };
}

export function renderRecoveryEmail(data: RecoveryTemplateData): {
  subject: string;
  text: string;
  html: string;
} {
  const name = data.recipientName?.trim() || 'there';
  const minutes = data.expiresInMinutes ?? 30;
  const subject = 'Reset your password — X Cron Jobs';
  const text = `Hi ${name},

We received a request to reset your password. Visit the link below to set a new one:
${data.recoveryUrl}

This link expires in ${minutes} minutes.

If you didn't request this, you can safely ignore this email — your password won't change.

— X Cron Jobs`;
  const body = `
    <h2>Hi ${escapeHtml(name)},</h2>
    <p>We received a request to reset your password. Click the button below to choose a new one.</p>
    <p style="text-align:center; margin:24px 0;">
      <a class="cta" href="${escapeAttr(data.recoveryUrl)}">Reset password</a>
    </p>
    <p style="font-size:13px; color:#6b7280;">This link expires in ${minutes} minutes. If you didn't request this, ignore this email — your password won't change.</p>
    <p style="font-size:12px; word-break:break-all; color:#6b7280;">${escapeHtml(data.recoveryUrl)}</p>
  `;
  const html = renderBaseLayout(body, {
    title: 'Reset your password',
    preheader: 'Reset your X Cron Jobs password. Link expires in ' + minutes + ' minutes.',
  });
  return { subject, text, html };
}

export function renderJobAlertEmail(data: JobAlertTemplateData): {
  subject: string;
  text: string;
  html: string;
} {
  const subject = `New job: ${data.jobTitle} at ${data.employerName}`;
  const salary = data.salaryText ? ` · ${data.salaryText}` : '';
  const text = `${data.jobTitle}
${data.employerName} · ${data.city}${salary}

${data.summary || ''}

View the job: ${data.jobUrl}

— X Cron Jobs`;
  const body = `
    <h2>New job for you</h2>
    <div class="card">
      <h3>${escapeHtml(data.jobTitle)}</h3>
      <p class="meta">${escapeHtml(data.employerName)} · ${escapeHtml(data.city)}${data.jobType ? ` · ${escapeHtml(data.jobType)}` : ''}</p>
      ${data.salaryText ? `<p class="salary">${escapeHtml(data.salaryText)}</p>` : ''}
      ${data.summary ? `<p style="margin-top:8px;">${escapeHtml(data.summary)}</p>` : ''}
    </div>
    <p style="text-align:center; margin:24px 0;">
      <a class="cta" href="${escapeAttr(data.jobUrl)}">View job</a>
    </p>
  `;
  const html = renderBaseLayout(body, {
    title: 'New job alert',
    preheader: `${data.jobTitle} at ${data.employerName} in ${data.city}.`,
  });
  return { subject, text, html };
}

export function renderWeeklyDigestEmail(data: WeeklyDigestTemplateData): {
  subject: string;
  text: string;
  html: string;
} {
  const name = data.recipientName?.trim() || 'there';
  const period = data.periodLabel || 'this week';
  const count = data.jobs.length;
  const subject = `${count} new job${count === 1 ? '' : 's'} for you — X Cron Jobs weekly digest`;

  const textLines = data.jobs
    .map(
      (j) =>
        `• ${j.title} — ${j.employerName} (${j.city})${j.salaryText ? ` · ${j.salaryText}` : ''}\n  ${j.url}`,
    )
    .join('\n\n');

  const text = `Hi ${name},

Here are ${count} new job${count === 1 ? '' : 's'} matching your preferences from ${period}:

${textLines}

${data.preferencesUrl ? `Update your preferences: ${data.preferencesUrl}\n` : ''}
— X Cron Jobs`;

  const cards = data.jobs
    .map(
      (j) => `
    <div class="card">
      <h3>${escapeHtml(j.title)}</h3>
      <p class="meta">${escapeHtml(j.employerName)} · ${escapeHtml(j.city)}${j.jobType ? ` · ${escapeHtml(j.jobType)}` : ''}</p>
      ${j.salaryText ? `<p class="salary">${escapeHtml(j.salaryText)}</p>` : ''}
      <p style="margin-top:8px;"><a href="${escapeAttr(j.url)}" style="color:#2563eb; font-size:13px; text-decoration:none;">View job →</a></p>
    </div>`,
    )
    .join('');

  const body = `
    <h2>Hi ${escapeHtml(name)},</h2>
    <p>Here are <strong>${count}</strong> new job${count === 1 ? '' : 's'} matching your preferences from ${escapeHtml(period)}.</p>
    ${cards}
    ${data.preferencesUrl ? `<p style="margin-top:16px; font-size:13px; color:#6b7280;">Want different matches? <a href="${escapeAttr(data.preferencesUrl)}">Update your preferences</a>.</p>` : ''}
  `;

  const html = renderBaseLayout(body, {
    title: 'Weekly jobs digest',
    preheader: `${count} new job${count === 1 ? '' : 's'} matching your preferences.`,
  });
  return { subject, text, html };
}

export function renderWelcomeEmail(data: WelcomeTemplateData): {
  subject: string;
  text: string;
  html: string;
} {
  const name = data.recipientName?.trim() || 'there';
  const cta = data.ctaUrl || 'https://xcron.jobs/jobs';
  const subject = 'Welcome to X Cron Jobs';
  const text = `Hi ${name},

Welcome to X Cron Jobs! Browse local roles and turn on alerts that fit you.

Get started: ${cta}

— X Cron Jobs`;
  const body = `
    <h2>Welcome, ${escapeHtml(name)}! 👋</h2>
    <p>You're in. Browse local roles and turn on alerts that fit you.</p>
    <p style="text-align:center; margin:24px 0;">
      <a class="cta" href="${escapeAttr(cta)}">Browse jobs</a>
    </p>
  `;
  const html = renderBaseLayout(body, {
    title: 'Welcome to X Cron Jobs',
    preheader: 'Browse local roles and turn on alerts that fit you.',
  });
  return { subject, text, html };
}

function escapeHtml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}
