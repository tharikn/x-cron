import { expect, test } from '@playwright/test';
import {
  type AuthSession,
  type CompanyDto,
  createCompany,
  getRecruiterDashboard,
  healthCheck,
  inviteCompanyMember,
  registerUser,
  request,
} from '../helpers/api-client';

const as = (s: AuthSession) => ({ token: s.token, tabId: s.tabId });

/** docs/COMPANY_WORKSPACE.md — company, dashboard, team invites, member access. */
test.describe('@api @company Company workspace', () => {
  test.describe.configure({ mode: 'serial' });

  let owner: AuthSession;
  let company: CompanyDto;

  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API not reachable');
    owner = await registerUser({ intendedRole: 'employer' });
    company = await createCompany(owner);
  });

  test('@smoke owner reads company + recruiter dashboard', async () => {
    const got = await request<CompanyDto>('GET', `/companies/${company.id}`, as(owner));
    expect(got.data.id).toBe(company.id);
    expect(got.data.name).toBe(company.name);

    const dash = await getRecruiterDashboard(owner);
    expect(dash.company.id).toBe(company.id);
    expect(dash.jobs.total).toBeGreaterThanOrEqual(0);
    expect(dash.applicants.total).toBeGreaterThanOrEqual(0);
  });

  test('invite → accept grants membership; outsiders stay locked out', async () => {
    const invite = await inviteCompanyMember(owner, company.id, {
      email: `teammate_${Date.now()}@example.com`,
      role: 'recruiter',
    });
    expect(invite.acceptToken).toBeTruthy();

    const teammate = await registerUser({ intendedRole: 'seeker' });
    await request('POST', `/company-invitations/${invite.acceptToken}/accept`, {
      ...as(teammate),
      body: {},
    });

    const members = await request<{ items: Array<{ userId: string; role: string; status: string }> }>(
      'GET',
      `/companies/${company.id}/members`,
      as(owner),
    );
    const joined = members.data.items.find((m) => m.userId === teammate.user.id);
    expect(joined).toMatchObject({ role: 'recruiter', status: 'active' });

    const reused = await request('POST', `/company-invitations/${invite.acceptToken}/accept`, {
      ...as(teammate),
      body: {},
      expectOk: false,
    });
    expect(reused.status).toBe(400);

    const outsider = await registerUser({ intendedRole: 'employer' });
    const denied = await request('GET', `/companies/${company.id}`, { ...as(outsider), expectOk: false });
    expect([403, 404]).toContain(denied.status);
  });

  test('seekers cannot open company admin surfaces', async () => {
    const seeker = await registerUser({ intendedRole: 'seeker' });
    const res = await request('GET', `/companies/${company.id}/members`, { ...as(seeker), expectOk: false });
    expect(res.status).toBe(403);
  });
});

/** docs/JOB_IMPORT_INTEGRATIONS.md — templates, Partner API keys, feeds SSRF guard, webhooks. */
test.describe('@api @integrations Free job import integrations', () => {
  test.describe.configure({ mode: 'serial' });

  let recruiter: AuthSession;

  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API not reachable');
    recruiter = await registerUser({ intendedRole: 'employer' });
  });

  test('@smoke public CSV + Excel import templates', async () => {
    const csv = await request<{ raw?: string }>('GET', '/import-batches/template.csv');
    expect(csv.headers.get('content-type')).toMatch(/text\/csv/);
    expect(csv.headers.get('content-disposition')).toMatch(/xcron-job-import-template\.csv/);
    expect(csv.data.raw?.split(/\r?\n/)[0].toLowerCase()).toContain('title');

    const xlsx = await request<{ raw?: string }>('GET', '/import-batches/template.xlsx');
    expect(xlsx.status).toBe(200);
    expect(xlsx.data.raw?.startsWith('PK')).toBe(true);
  });

  test('Partner API: key auth → upsert → update → list → close → revoke', async () => {
    const key = await request<{ id: string; apiKey: string; keyPrefix: string }>(
      'POST',
      '/integrations/api-keys',
      { ...as(recruiter), body: { label: 'E2E partner' } },
    );
    expect(key.data.apiKey).toMatch(/^xcron_pk_/);

    const listed = await request('GET', '/integrations/api-keys', as(recruiter));
    expect(JSON.stringify(listed.data)).not.toContain(key.data.apiKey);

    const noKey = await request('POST', '/partner/jobs', {
      body: { externalJobId: 'E2E-1', title: 'Picker', description: 'Warehouse picking' },
      expectOk: false,
    });
    expect(noKey.status).toBe(401);

    const partner = { headers: { 'X-Api-Key': key.data.apiKey } };
    const externalJobId = `E2E-${Date.now().toString(36)}`;
    const created = await request<{ action: string; jobId: string; status: string }>('POST', '/partner/jobs', {
      ...partner,
      body: {
        externalJobId,
        title: 'Warehouse Picker',
        employerName: 'E2E Logistics',
        locationCity: 'Hosur',
        description: 'Pick and pack orders on day shift.',
      },
    });
    expect(created.data.action).toBe('created');
    expect(created.data.status).toBe('needs-review');

    const updated = await request<{ action: string; jobId: string }>('PUT', `/partner/jobs/${externalJobId}`, {
      ...partner,
      body: { title: 'Senior Warehouse Picker', description: 'Pick, pack and train new joiners.' },
    });
    expect(updated.data).toMatchObject({ action: 'updated', jobId: created.data.jobId });

    const mine = await request<{ items: Array<{ externalJobId: string }> }>('GET', '/partner/jobs', partner);
    expect(mine.data.items.map((i) => i.externalJobId)).toContain(externalJobId);

    const closed = await request<{ ok: boolean; status: string }>('DELETE', `/partner/jobs/${externalJobId}`, partner);
    expect(closed.data).toMatchObject({ ok: true, status: 'removed' });

    await request('DELETE', `/integrations/api-keys/${key.data.id}`, as(recruiter));
    const revoked = await request('GET', '/partner/jobs', { ...partner, expectOk: false });
    expect(revoked.status).toBe(401);
  });

  test('feeds only accept public HTTPS URLs (SSRF guard)', async () => {
    for (const url of [
      'http://feeds.example.com/jobs.xml',
      'https://localhost/jobs.xml',
      'https://127.0.0.1/jobs.xml',
      'https://192.168.1.20/jobs.xml',
    ]) {
      const res = await request('POST', '/integrations/feeds', {
        ...as(recruiter),
        body: { label: 'E2E feed', url },
        expectOk: false,
      });
      expect(res.status, url).toBe(400);
    }
  });

  test('Zapier-style webhook ingests into import review; bad token / secret rejected', async () => {
    const hook = await request<{ id: string; urlPath: string }>('POST', '/integrations/webhooks', {
      ...as(recruiter),
      body: { label: 'E2E hook' },
    });
    expect(hook.data.urlPath).toMatch(/^\/v1\/integrations\/webhooks\//);
    const path = hook.data.urlPath.replace(/^\/v1/, '');

    const ingest = await request<{ batch?: { id: string }; recordIds?: string[] }>('POST', path, {
      body: { jobs: [{ title: 'Packer', description: 'Pack parcels', city: 'Salem' }] },
    });
    expect(ingest.status).toBeLessThan(300);

    const empty = await request('POST', path, { body: { foo: 'bar' }, expectOk: false });
    expect(empty.status).toBe(400);

    const unknown = await request('POST', '/integrations/webhooks/not-a-real-token', {
      body: { title: 'x' },
      expectOk: false,
    });
    expect(unknown.status).toBe(404);

    const secured = await request<{ urlPath: string }>('POST', '/integrations/webhooks', {
      ...as(recruiter),
      body: { label: 'E2E secured', secret: 's3cret-e2e-value' },
    });
    const securedPath = secured.data.urlPath.replace(/^\/v1/, '');
    const wrong = await request('POST', securedPath, {
      body: { title: 'x', description: 'y' },
      headers: { 'X-Webhook-Secret': 'nope-nope' },
      expectOk: false,
    });
    expect(wrong.status).toBe(401);
    const right = await request('POST', securedPath, {
      body: { title: 'Loader', description: 'Load trucks' },
      headers: { 'X-Webhook-Secret': 's3cret-e2e-value' },
    });
    expect(right.status).toBeLessThan(300);
  });
});
