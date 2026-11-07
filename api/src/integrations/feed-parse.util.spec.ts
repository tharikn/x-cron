import { mapLooseJob, parseJsonFeed, parseXmlFeed } from './feed-parse.util';

describe('feed-parse.util', () => {
  describe('mapLooseJob', () => {
    it('maps common ATS / Zapier aliases to an import draft', () => {
      const draft = mapLooseJob(
        {
          jobTitle: 'Delivery Partner',
          companyName: 'Swift Logistics',
          city: 'Madurai',
          employmentType: 'Part Time',
          pay: '18000/month',
          openings: '12 posts',
          jobDescription: 'Two-wheeler deliveries across the city.',
          mobile: '9876543210',
          apply_url: 'https://swift.example/apply',
          requisitionId: 'REQ-42',
        },
        0,
        'zapier:hook',
      );
      expect(draft).toMatchObject({
        title: 'Delivery Partner',
        employerName: 'Swift Logistics',
        locationCity: 'Madurai',
        jobType: 'part-time',
        salaryText: '18000/month',
        vacancies: 12,
        contactPhone: '9876543210',
        contactWebsite: 'https://swift.example/apply',
        externalJobId: 'REQ-42',
        confidence: 0.82,
        sourceLocator: 'zapier:hook#REQ-42',
      });
    });

    it('falls back to safe defaults and low confidence when fields are missing', () => {
      const draft = mapLooseJob({ id: 7 }, 2, 'feed');
      expect(draft.title).toBe('Imported role 3');
      expect(draft.description).toBe('Not provided');
      expect(draft.jobType).toBe('full-time');
      expect(draft.confidence).toBe(0.45);
      expect(draft.externalJobId).toBe('7');
    });

    it('rejects out-of-range vacancies and truncates long titles', () => {
      const draft = mapLooseJob(
        { title: 'x'.repeat(200), vacancies: '0', description: 'ok' },
        0,
        'feed',
      );
      expect(draft.title).toHaveLength(120);
      expect(draft.vacancies).toBeUndefined();
    });
  });

  describe('parseJsonFeed', () => {
    it('accepts arrays and { jobs | items | data } envelopes', () => {
      for (const body of [
        [{ title: 'A' }],
        { jobs: [{ title: 'A' }] },
        { items: [{ title: 'A' }] },
        { data: [{ title: 'A' }] },
      ]) {
        const { drafts } = parseJsonFeed(JSON.stringify(body), 'json');
        expect(drafts.map((d) => d.title)).toEqual(['A']);
      }
    });

    it('treats a single object as one job', () => {
      expect(parseJsonFeed('{"title":"Solo"}', 'json').drafts).toHaveLength(1);
    });

    it('warns on invalid JSON or empty feeds', () => {
      expect(parseJsonFeed('{nope', 'json')).toEqual({
        drafts: [],
        warnings: ['Invalid JSON feed.'],
      });
      expect(parseJsonFeed('[]', 'json').warnings).toEqual([
        'JSON feed contained no jobs.',
      ]);
    });
  });

  describe('parseXmlFeed', () => {
    it('parses repeating <job> blocks including CDATA', () => {
      const xml = `<?xml version="1.0"?>
        <source>
          <job>
            <title><![CDATA[Nurse]]></title>
            <company>City Hospital</company>
            <city>Trichy</city>
            <description><![CDATA[Night shifts <b>available</b>]]></description>
            <referencenumber>H-1</referencenumber>
            <url>https://hospital.example/jobs/1</url>
          </job>
          <job><title>Ward boy</title><referencenumber>H-2</referencenumber></job>
        </source>`;
      const { drafts, warnings } = parseXmlFeed(xml, 'xml');
      expect(drafts).toHaveLength(2);
      expect(drafts[0]).toMatchObject({
        title: 'Nurse',
        employerName: 'City Hospital',
        locationCity: 'Trichy',
        externalJobId: 'H-1',
        contactWebsite: 'https://hospital.example/jobs/1',
      });
      expect(drafts[0].description).toContain('Night shifts');
      expect(warnings).toEqual(['XML feed yielded 2 job(s).']);
    });

    it('warns when the feed has no <job> elements', () => {
      expect(parseXmlFeed('<rss></rss>', 'xml')).toEqual({
        drafts: [],
        warnings: ['XML feed had no <job> elements.'],
      });
    });
  });
});
