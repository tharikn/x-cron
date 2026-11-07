import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');
const apiUrl = process.env['API_URL'] || 'http://localhost:3000/v1';
const siteUrl = process.env['SITE_URL'] || 'http://localhost:4000';

const app = express();
const angularApp = new AngularNodeAppEngine();
const isProd = (process.env['NODE_ENV'] ?? 'development') === 'production';

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), payment=()',
  );
  if (isProd) {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=15552000; includeSubDomains',
    );
  }
  next();
});

app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send(
    [
      'User-agent: *',
      'Allow: /',
      `Sitemap: ${siteUrl}/sitemap.xml`,
      '',
    ].join('\n'),
  );
});

app.get('/sitemap.xml', async (_req, res) => {
  try {
    const response = await fetch(`${apiUrl}/jobs?sort=newest&limit=50`);
    if (!response.ok) {
      throw new Error(`API ${response.status}`);
    }
    const data = (await response.json()) as {
      items: Array<{ slug: string; publishedAt: string; location: { state: string; city: string } }>;
    };

    const urls = [
      { loc: `${siteUrl}/`, lastmod: new Date().toISOString() },
      ...data.items.map((job) => ({
        loc: `${siteUrl}/jobs/${job.slug}`,
        lastmod: job.publishedAt,
      })),
      ...[...new Set(data.items.map((job) => `${job.location.state}/${job.location.city}`))].map(
        (place) => ({
          loc: `${siteUrl}/locations/${place
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-\/]/g, '')}`,
          lastmod: new Date().toISOString(),
        }),
      ),
    ];

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (item) => `  <url>
    <loc>${escapeXml(item.loc)}</loc>
    <lastmod>${item.lastmod}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>`;

    res.type('application/xml').send(body);
  } catch {
    res.status(503).type('application/xml').send(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
    );
  }
});

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }
    console.log(`X Cron web SSR listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
