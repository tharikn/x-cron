import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import compression from 'compression';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');
const apiUrl = process.env['API_URL'] || 'http://localhost:3000/v1';
const siteUrl = process.env['SITE_URL'] || 'http://localhost:4000';

const app = express();
const angularApp = new AngularNodeAppEngine();
const isProd = (process.env['NODE_ENV'] ?? 'development') === 'production';

app.use(compression());

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
    const [jobsRes, portfoliosRes] = await Promise.allSettled([
      fetch(`${apiUrl}/jobs?sort=newest&limit=50`).then((r) =>
        r.ok ? ((r.json() as unknown) as { items: Array<{ slug: string; publishedAt: string; location: { state: string; city: string } }> }) : null,
      ),
      fetch(`${apiUrl}/portfolio/public-sitemap`).then((r) =>
        r.ok ? ((r.json() as unknown) as Array<{ slug: string; updatedAt: string }>) : null,
      ),
    ]);

    const jobsData = jobsRes.status === 'fulfilled' ? jobsRes.value : null;
    const portfoliosData = portfoliosRes.status === 'fulfilled' ? portfoliosRes.value : null;

    const urls: Array<{ loc: string; lastmod: string }> = [
      { loc: `${siteUrl}/`, lastmod: new Date().toISOString() },
    ];

    if (jobsData?.items && Array.isArray(jobsData.items)) {
      urls.push(
        ...jobsData.items.map((job) => ({
          loc: `${siteUrl}/jobs/${job.slug}`,
          lastmod: job.publishedAt,
        })),
        ...[...new Set(jobsData.items.map((job) => `${job.location.state}/${job.location.city}`))].map(
          (place) => ({
            loc: `${siteUrl}/locations/${place
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9\-\/]/g, '')}`,
            lastmod: new Date().toISOString(),
          }),
        ),
      );
    }

    if (Array.isArray(portfoliosData)) {
      for (const pf of portfoliosData) {
        if (pf?.slug) {
          urls.push({
            loc: `${siteUrl}/p/${pf.slug}`,
            lastmod: pf.updatedAt || new Date().toISOString(),
          });
        }
      }
    }

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
    immutable: true,
    index: false,
    redirect: false,
  }),
);

app.use((req, res, next) => {
  if (req.path.startsWith('/p/')) {
    res.setHeader(
      'Cache-Control',
      'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400',
    );
  }
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch((err) => {
      // Isolate faulty live portfolio renders from crashing the server or affecting other sites
      if (req.path.startsWith('/p/')) {
        console.warn(`[SSR Portfolio Protect] Faulty live portfolio encountered at ${req.path}. Routing to main app.`);
        return res.redirect(302, '/');
      }
      next(err);
    });
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
