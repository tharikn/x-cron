import { BadRequestException } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import {
  InputProtectorMiddleware,
  allowsPortfolioCode,
  scanRequestPayload,
} from './input-protector.middleware';

const CUSTOM_CODE_DOCUMENT = {
  document: {
    pages: [
      {
        id: 'page-1',
        sections: [
          {
            id: 'section-1',
            type: 'custom-code',
            variant: 'sandbox',
            props: {
              title: 'Joke factory',
              html: '<div onclick="alert(1)"><script>window.x = 1;</script></div>',
              css: "@import url('https://fonts.googleapis.com/css2?family=Nunito');\n/* card */\n.card { color: red; }",
              js: "document.querySelector('.card').addEventListener('click', () => { /* noop */ });",
              allowExternal: 'true',
            },
          },
        ],
      },
    ],
  },
  baseRevision: 3,
};

function run(originalUrl: string, body: unknown): { next: NextFunction } {
  const req = {
    originalUrl,
    url: originalUrl,
    body,
    query: {},
    headers: { 'content-type': 'application/json' },
  } as unknown as Request;
  const res = {} as Response;
  const next = jest.fn();
  new InputProtectorMiddleware().use(req, res, next);
  return { next };
}

describe('allowsPortfolioCode', () => {
  it('matches only the draft write routes', () => {
    expect(allowsPortfolioCode('/v1/portfolio/sites/site_1/draft')).toBe(true);
    expect(allowsPortfolioCode('/v1/portfolio/sites/site_1/draft/validate')).toBe(
      true,
    );
    expect(allowsPortfolioCode('/v1/portfolio/sites/site_1/draft?x=1')).toBe(true);
    expect(allowsPortfolioCode('/v1/portfolio/sites/site_1/draft/')).toBe(true);
    expect(allowsPortfolioCode('/v1/portfolio/sites/site_1')).toBe(false);
    expect(allowsPortfolioCode('/v1/portfolio/sites/site_1/publish')).toBe(false);
    expect(allowsPortfolioCode('/v1/portfolio/sites/site_1/draft/extra')).toBe(
      false,
    );
    expect(allowsPortfolioCode('/v1/auth/login')).toBe(false);
  });
});

describe('InputProtectorMiddleware', () => {
  it('lets custom-code drafts through on the draft route', () => {
    const { next } = run('/v1/portfolio/sites/site_1/draft', CUSTOM_CODE_DOCUMENT);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('lets custom-code drafts through on the validate route', () => {
    const { next } = run(
      '/v1/portfolio/sites/site_1/draft/validate',
      CUSTOM_CODE_DOCUMENT,
    );
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('still rejects the same code on any other route', () => {
    for (const url of [
      '/v1/portfolio/sites/site_1',
      '/v1/portfolio/sites/site_1/publish',
      '/v1/auth/login',
    ]) {
      expect(() => run(url, CUSTOM_CODE_DOCUMENT)).toThrow(BadRequestException);
    }
  });

  it('keeps scanning non-code fields of a custom-code section', () => {
    const body = {
      document: {
        pages: [
          {
            sections: [
              {
                type: 'custom-code',
                props: {
                  title: '<script>alert(1)</script>',
                  html: '<p>safe</p>',
                },
              },
            ],
          },
        ],
      },
    };
    expect(() => run('/v1/portfolio/sites/site_1/draft', body)).toThrow(
      BadRequestException,
    );
  });

  it('rejects prototype pollution keys inside code sections', () => {
    // JSON.parse keeps `__proto__` as an own enumerable key — same as the wire format.
    const body = JSON.parse(
      '{"document":{"sections":[{"type":"custom-code","props":{"html":"<p>ok</p>","__proto__":{"polluted":true}}}]}}',
    );
    expect(() => run('/v1/portfolio/sites/site_1/draft', body)).toThrow(
      BadRequestException,
    );
  });

  it('rejects control characters inside code fields', () => {
    const body = {
      document: {
        sections: [
          { type: 'custom-code', props: { html: '<p>a\u0000b</p>' } },
        ],
      },
    };
    expect(() => run('/v1/portfolio/sites/site_1/draft', body)).toThrow(
      BadRequestException,
    );
  });

  it('exposes the same rules to direct scanners', () => {
    expect(
      scanRequestPayload(CUSTOM_CODE_DOCUMENT, {}, { allowPortfolioCode: true }),
    ).toHaveLength(0);
    expect(scanRequestPayload(CUSTOM_CODE_DOCUMENT, {})).not.toHaveLength(0);
  });
});
