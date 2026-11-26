export interface EmailLayoutOptions {
  title: string;
  preheader?: string;
  tenantName?: string;
  unsubscribeUrl?: string;
  footerNote?: string;
}

/**
 * Base HTML layout for all transactional emails. Mobile-friendly, table-based
 * for broad email client support. Uses inline styles only.
 */
export function renderBaseLayout(
  bodyHtml: string,
  opts: EmailLayoutOptions,
): string {
  const tenant = opts.tenantName || 'X Cron Jobs';
  const preheader = opts.preheader || '';
  const unsubscribe = opts.unsubscribeUrl || '#';
  const footerNote =
    opts.footerNote ||
    'You received this email because you signed up for X Cron Jobs alerts.';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${escapeHtml(opts.title)}</title>
  <style>
    body { margin:0; padding:0; background:#f4f6f9; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#1f2937; }
    .container { max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,.06); }
    .header { background:linear-gradient(135deg,#2563eb,#1d4ed8); padding:24px 32px; color:#ffffff; }
    .header h1 { margin:0; font-size:20px; font-weight:700; }
    .header p { margin:4px 0 0; font-size:13px; opacity:.85; }
    .body { padding:32px; line-height:1.6; font-size:15px; }
    .body h2 { margin:0 0 12px; font-size:18px; color:#111827; }
    .body p { margin:0 0 12px; }
    .cta { display:inline-block; margin:16px 0; padding:12px 24px; background:#2563eb; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600; font-size:15px; }
    .code { display:inline-block; padding:12px 20px; background:#f3f4f6; border:1px dashed #9ca3af; border-radius:8px; font-family:monospace; font-size:22px; font-weight:700; letter-spacing:4px; color:#111827; margin:12px 0; }
    .card { border:1px solid #e5e7eb; border-radius:10px; padding:16px; margin:12px 0; background:#fafbfc; }
    .card h3 { margin:0 0 4px; font-size:16px; color:#111827; }
    .card .meta { font-size:13px; color:#6b7280; margin:0 0 8px; }
    .card .salary { font-size:13px; color:#059669; font-weight:600; }
    .footer { padding:20px 32px; background:#f9fafb; border-top:1px solid #e5e7eb; font-size:12px; color:#6b7280; text-align:center; }
    .footer a { color:#2563eb; text-decoration:none; }
    .preheader { display:none; max-height:0; overflow:hidden; mso-hide:all; }
  </style>
</head>
<body>
  <span class="preheader">${escapeHtml(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px;">
    <tr><td align="center">
      <div class="container">
        <div class="header">
          <h1>${escapeHtml(tenant)}</h1>
          <p>${escapeHtml(opts.title)}</p>
        </div>
        <div class="body">${bodyHtml}</div>
        <div class="footer">
          <p>${escapeHtml(footerNote)}</p>
          <p style="margin:8px 0 0;">
            <a href="${escapeAttr(unsubscribe)}">Unsubscribe</a> ·
            <a href="https://xcron.jobs">xcron.jobs</a>
          </p>
          <p style="margin:8px 0 0; color:#9ca3af;">© ${new Date().getFullYear()} X Cron Jobs. All rights reserved.</p>
        </div>
      </div>
    </td></tr>
  </table>
</body>
</html>`;
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
