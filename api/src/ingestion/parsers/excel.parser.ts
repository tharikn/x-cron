import * as XLSX from 'xlsx';
import { CsvParser } from './csv.parser';
import { DocumentParser, ParseInput, ParseResult } from './parser.types';

/**
 * Free Excel (.xlsx / .xls) → same column mapping as CSV (SheetJS community).
 * First sheet only; header row required.
 */
export class ExcelParser implements DocumentParser {
  readonly id = 'excel-sheet-parser';
  private readonly csv = new CsvParser();

  supports(input: ParseInput): boolean {
    const name = input.filename.toLowerCase();
    return (
      input.sourceType === 'excel' ||
      name.endsWith('.xlsx') ||
      name.endsWith('.xls') ||
      input.mimeType ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      input.mimeType === 'application/vnd.ms-excel'
    );
  }

  async parse(input: ParseInput): Promise<ParseResult> {
    if (!input.buffer?.length) {
      return {
        provider: this.id,
        sourceType: 'excel',
        drafts: [],
        warnings: ['Excel file buffer is empty.'],
      };
    }

    let workbook: XLSX.WorkBook;
    try {
      workbook = XLSX.read(input.buffer, { type: 'buffer', cellDates: false });
    } catch {
      return {
        provider: this.id,
        sourceType: 'excel',
        drafts: [],
        warnings: ['Could not parse Excel workbook.'],
      };
    }

    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return {
        provider: this.id,
        sourceType: 'excel',
        drafts: [],
        warnings: ['Workbook has no sheets.'],
      };
    }

    const sheet = workbook.Sheets[sheetName];
    const csvText = XLSX.utils.sheet_to_csv(sheet);
    const parsed = await this.csv.parse({
      sourceType: 'csv',
      filename: `${input.filename}#${sheetName}.csv`,
      text: csvText,
    });

    return {
      provider: this.id,
      sourceType: 'excel',
      drafts: parsed.drafts.map((d) => ({
        ...d,
        sourceLocator: d.sourceLocator.replace(/\.csv/, '.xlsx'),
        notes: [
          ...(d.notes ?? []),
          `Excel sheet "${sheetName}" mapped via CSV columns.`,
        ],
      })),
      warnings: [
        ...parsed.warnings,
        `Parsed Excel sheet "${sheetName}" (${parsed.drafts.length} row(s)).`,
      ],
    };
  }
}
