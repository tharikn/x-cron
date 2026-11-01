import type { PaymentHistoryEvent } from './payments.types';

const COLUMNS = [
  'id',
  'createdAt',
  'status',
  'reason',
  'orderId',
  'userId',
  'actorId',
  'jobId',
  'planId',
  'product',
  'gateway',
  'gatewayOrderId',
  'gatewayPaymentId',
  'amountPaise',
  'currency',
  'ip',
  'userAgent',
  'metadata',
] as const;

function cell(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Excel-friendly CSV (UTF-8 BOM). */
export function historyToExcelCsv(rows: PaymentHistoryEvent[]): Buffer {
  const lines = [
    COLUMNS.join(','),
    ...rows.map((row) =>
      COLUMNS.map((key) => csvEscape(cell(row[key]))).join(','),
    ),
  ];
  const body = `\uFEFF${lines.join('\r\n')}`;
  return Buffer.from(body, 'utf8');
}

/** Minimal single-page PDF table (no external deps). */
export function historyToPdf(rows: PaymentHistoryEvent[]): Buffer {
  const title = 'X Cron — Payment history';
  const header =
    'createdAt | status | orderId | userId | product | amountPaise | reason';
  const lines = [
    title,
    `Exported ${new Date().toISOString()} · ${rows.length} row(s)`,
    '',
    header,
    ...rows.slice(0, 80).map((r) =>
      [
        r.createdAt,
        r.status,
        r.orderId ?? '',
        r.userId ?? '',
        r.product ?? '',
        r.amountPaise ?? '',
        (r.reason ?? '').replace(/\s+/g, ' ').slice(0, 60),
      ].join(' | '),
    ),
  ];
  if (rows.length > 80) {
    lines.push(`… ${rows.length - 80} more row(s) omitted in PDF preview`);
  }

  const contentLines = lines.map((line, i) => {
    const y = 800 - i * 12;
    const safe = line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    return `BT /F1 9 Tf 40 ${y} Td (${safe}) Tj ET`;
  });
  const stream = contentLines.join('\n');
  const objects: string[] = [];
  objects.push('1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj');
  objects.push('2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj');
  objects.push(
    '3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Contents 4 0 R /Resources<< /Font<< /F1 5 0 R >> >> >>endobj',
  );
  objects.push(
    `4 0 obj<< /Length ${Buffer.byteLength(stream, 'utf8')} >>stream\n${stream}\nendstream endobj`,
  );
  objects.push('5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj');

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += `${obj}\n`;
  }
  const xrefPos = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  return Buffer.from(pdf, 'utf8');
}
