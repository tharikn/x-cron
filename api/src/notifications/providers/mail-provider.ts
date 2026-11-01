export interface MailSendResult {
  ok: boolean;
  providerMessageId?: string;
  error?: string;
}

/**
 * Mail Strategy/Adapter. Swap stub → SMTP / Resend / SES without touching callers.
 */
export interface MailProvider {
  readonly name: string;
  send(input: {
    to: string;
    subject: string;
    text: string;
    html?: string;
    data?: Record<string, string>;
  }): Promise<MailSendResult>;
}
