import * as XLSX from 'xlsx';
import { ExcelParser } from './excel.parser';

function workbookBuffer(rows: unknown[][], bookType: XLSX.BookType = 'xlsx'): Buffer {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), 'Jobs');
  return XLSX.write(wb, { type: 'buffer', bookType }) as Buffer;
}

describe('ExcelParser', () => {
  const parser = new ExcelParser();

  it('supports xlsx/xls by extension, mime or source type', () => {
    expect(parser.supports({ sourceType: 'excel', filename: 'x' })).toBe(true);
    expect(parser.supports({ sourceType: 'csv', filename: 'jobs.xlsx' })).toBe(true);
    expect(parser.supports({ sourceType: 'csv', filename: 'jobs.xls' })).toBe(true);
    expect(
      parser.supports({
        sourceType: 'csv',
        filename: 'upload',
        mimeType: 'application/vnd.ms-excel',
      }),
    ).toBe(true);
    expect(parser.supports({ sourceType: 'csv', filename: 'jobs.csv' })).toBe(false);
  });

  it('maps the first sheet through the CSV column mapper', async () => {
    const buffer = workbookBuffer([
      ['title', 'employer', 'city', 'description', 'externalJobId'],
      ['Tailor', 'Tiruppur Knits', 'Tiruppur', 'Stitching unit', 'TK-1'],
      ['Checker', 'Tiruppur Knits', 'Tiruppur', 'Quality checks', 'TK-2'],
    ]);
    const result = await parser.parse({
      sourceType: 'excel',
      filename: 'batch.xlsx',
      buffer,
    });
    expect(result.provider).toBe('excel-sheet-parser');
    expect(result.sourceType).toBe('excel');
    expect(result.drafts.map((d) => d.externalJobId)).toEqual(['TK-1', 'TK-2']);
    expect(result.drafts[0].sourceLocator).toContain('.xlsx');
    expect(result.drafts[0].notes).toContain('Excel sheet "Jobs" mapped via CSV columns.');
    expect(result.warnings).toContain('Parsed Excel sheet "Jobs" (2 row(s)).');
  });

  it('warns on empty buffers', async () => {
    const result = await parser.parse({ sourceType: 'excel', filename: 'e.xlsx', buffer: Buffer.alloc(0) });
    expect(result.drafts).toEqual([]);
    expect(result.warnings).toEqual(['Excel file buffer is empty.']);
  });
});
