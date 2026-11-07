import { CsvParser } from './csv.parser';

describe('CsvParser', () => {
  const parser = new CsvParser();

  it('supports csv by source type, extension, mime or header sniff', () => {
    expect(parser.supports({ sourceType: 'csv', filename: 'x' })).toBe(true);
    expect(parser.supports({ sourceType: 'text', filename: 'jobs.CSV' })).toBe(true);
    expect(
      parser.supports({ sourceType: 'text', filename: 'paste', text: 'title,location\nA,B' }),
    ).toBe(true);
    expect(parser.supports({ sourceType: 'text', filename: 'note.txt', text: 'hello' })).toBe(
      false,
    );
  });

  it('maps canonical + alias columns into drafts', async () => {
    const csv = [
      'Title,Company,City,Job_Type,Salary,Openings,Description,Contact_Phone,Apply_URL,External_Job_Id',
      'Cashier,Kovai Mart,Coimbatore,Part Time,12000,3,Billing counter,9876543210,https://kovai.example,EXT-9',
    ].join('\n');
    const { drafts, warnings } = await parser.parse({
      sourceType: 'csv',
      filename: 'jobs.csv',
      text: csv,
    });
    expect(warnings).toEqual([]);
    expect(drafts).toHaveLength(1);
    expect(drafts[0]).toMatchObject({
      title: 'Cashier',
      employerName: 'Kovai Mart',
      locationCity: 'Coimbatore',
      jobType: 'part-time',
      salaryText: '12000',
      vacancies: 3,
      description: 'Billing counter',
      contactPhone: '9876543210',
      contactWebsite: 'https://kovai.example',
      externalJobId: 'EXT-9',
      confidence: 0.85,
      sourceLocator: 'jobs.csv#row-2',
    });
  });

  it('keeps quoted multiline cells and escaped quotes in one record', async () => {
    const csv =
      'title,location,description\r\n' +
      '"Driver","Salem","Line one\nLine two with ""quotes"", commas"\r\n' +
      'Helper,Erode,Loading\r\n';
    const { drafts } = await parser.parse({ sourceType: 'csv', filename: 'm.csv', text: csv });
    expect(drafts).toHaveLength(2);
    expect(drafts[0].description).toBe('Line one\nLine two with "quotes", commas');
    expect(drafts[1].title).toBe('Helper');
  });

  it('strips a UTF-8 BOM and flags rows missing required fields', async () => {
    const { drafts } = await parser.parse({
      sourceType: 'csv',
      filename: 'bom.csv',
      text: '\uFEFFtitle,location\n,Palani',
    });
    expect(drafts[0].title).toBe('CSV row 1');
    expect(drafts[0].confidence).toBe(0.4);
    expect(drafts[0].notes?.[0]).toMatch(/Missing title/);
  });

  it('warns when there is no data row', async () => {
    const result = await parser.parse({ sourceType: 'csv', filename: 'h.csv', text: 'title' });
    expect(result.drafts).toEqual([]);
    expect(result.warnings[0]).toMatch(/header row and at least one data row/);
  });
});
