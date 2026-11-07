import { expect, test } from '@playwright/test';
import {
  type AuthSession,
  type PublishedJob,
  createPublishedJob,
  healthCheck,
  registerUser,
  request,
} from '../helpers/api-client';

type JobHit = PublishedJob & {
  matchReasons?: string[];
  contact?: { phone?: string | null; hasPhone?: boolean };
};
type SearchResult = { items: JobHit[]; total: number; nextCursor?: string };

/** docs/JOB_DISCOVERY.md — filters, ranking, match reasons, hide, saved searches, feed. */
test.describe('@api @discovery Job discovery', () => {
  test.describe.configure({ mode: 'serial' });

  const token = `zq${Date.now().toString(36)}`;
  let recruiter: AuthSession;
  let seeker: AuthSession;
  let job: PublishedJob;

  async function search(params: Record<string, string>, session?: AuthSession) {
    const qs = new URLSearchParams({ limit: '50', ...params });
    const { data } = await request<SearchResult>('GET', `/jobs?${qs}`, {
      token: session?.token,
      tabId: session?.tabId,
    });
    return data;
  }

  const ids = (r: SearchResult) => r.items.map((j) => j.id);

  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API not reachable');
    recruiter = await registerUser({ intendedRole: 'employer' });
    seeker = await registerUser({ intendedRole: 'seeker' });
    job = await createPublishedJob(recruiter, {
      title: `Kotlin ${token} Engineer`,
      skills: ['Kotlin', 'Android'],
      experienceLabel: 'Fresher',
    });
  });

  test('@smoke keyword search finds the published job (canonical + /jobs/search alias)', async () => {
    const canonical = await search({ q: token });
    expect(ids(canonical)).toContain(job.id);
    expect(canonical.total).toBeGreaterThanOrEqual(1);

    const alias = await request<SearchResult>('GET', `/jobs/search?q=${token}&limit=50`);
    expect(alias.data.items.map((j) => j.id)).toContain(job.id);
  });

  test('structured filters include / exclude the job truthfully', async () => {
    const includes: Record<string, string>[] = [
      { easyApply: 'true' },
      { fresher: 'true' },
      { postedWithin: '1d' },
      { skills: 'kotlin' },
      { location: 'chennai' },
      { jobType: 'full-time' },
    ];
    for (const extra of includes) {
      expect(ids(await search({ q: token, ...extra })), JSON.stringify(extra)).toContain(job.id);
    }

    const excludes: Record<string, string>[] = [
      { remote: 'true' },
      { verifiedEmployer: 'true' },
      { walkInOnly: 'true' },
      { skills: 'cobol' },
      { salaryMin: '1000000' },
      { jobType: 'internship' },
      { location: 'zz-nowhere' },
    ];
    for (const extra of excludes) {
      expect(ids(await search({ q: token, ...extra })), JSON.stringify(extra)).not.toContain(job.id);
    }
  });

  test('relevance ranking adds truthful match reasons — never a percentage', async () => {
    const result = await search({ q: token, skills: 'kotlin,android', sort: 'relevance' });
    const hit = result.items.find((j) => j.id === job.id);
    expect(hit?.matchReasons?.length).toBeGreaterThan(0);
    expect(hit!.matchReasons!.join(' ')).toMatch(/Matches 2 of your 2 selected skills/);
    expect(hit!.matchReasons!.join(' ')).not.toContain('%');
  });

  test('rejects invalid filter values with field errors', async () => {
    const bad = await request<{ errors?: Record<string, string> }>(
      'GET',
      '/jobs?postedWithin=99d&limit=500',
      { expectOk: false },
    );
    expect(bad.status).toBe(400);
    expect(Object.keys(bad.data.errors ?? {})).toEqual(
      expect.arrayContaining(['postedWithin', 'limit']),
    );
  });

  test('job detail is public and exposes employer contact (no paywall)', async () => {
    const { data } = await request<JobHit>('GET', `/jobs/${job.id}`);
    expect(data.id).toBe(job.id);
    expect(data.contact?.hasPhone).toBe(true);
    expect(data.contact?.phone).toBe('9876501234');

    const view = await request('POST', `/jobs/${job.id}/events`, { body: { type: 'view' } });
    expect(view.status).toBeLessThan(300);
  });

  test('"Not interested" hides the job for that seeker only, and can be undone', async () => {
    await request('POST', `/jobs/${job.id}/not-relevant`, {
      token: seeker.token,
      tabId: seeker.tabId,
      body: {},
    });
    expect(ids(await search({ q: token }, seeker))).not.toContain(job.id);
    expect(ids(await search({ q: token }))).toContain(job.id);

    await request('DELETE', `/me/hidden-jobs/${job.id}`, { token: seeker.token, tabId: seeker.tabId });
    expect(ids(await search({ q: token }, seeker))).toContain(job.id);
  });

  test('saved searches CRUD keeps the exact query', async () => {
    const auth = { token: seeker.token, tabId: seeker.tabId };
    const created = await request<{ id: string; name: string }>('POST', '/me/saved-searches', {
      ...auth,
      body: {
        name: `E2E ${token}`,
        query: { keyword: token, skills: 'kotlin', fresher: true, postedWithin: '7d' },
        alertEnabled: true,
      },
    });
    expect(created.data.id).toBeTruthy();

    const list = await request<{ items?: Array<{ id: string; query: Record<string, unknown> }> } | Array<{ id: string; query: Record<string, unknown> }>>(
      'GET',
      '/me/saved-searches',
      auth,
    );
    const rows = Array.isArray(list.data) ? list.data : list.data.items ?? [];
    const row = rows.find((r) => r.id === created.data.id);
    expect(row?.query).toMatchObject({ keyword: token, skills: 'kotlin', fresher: true });

    await request('PATCH', `/me/saved-searches/${created.data.id}`, {
      ...auth,
      body: { alertEnabled: false },
    });
    await request('DELETE', `/me/saved-searches/${created.data.id}`, auth);
    const after = await request<{ items?: Array<{ id: string }> } | Array<{ id: string }>>(
      'GET',
      '/me/saved-searches',
      auth,
    );
    const afterRows = Array.isArray(after.data) ? after.data : after.data.items ?? [];
    expect(afterRows.map((r) => r.id)).not.toContain(created.data.id);
  });

  test('personalised feed + recommendations alias require a session', async () => {
    const anon = await request('GET', '/feed', { expectOk: false });
    expect(anon.status).toBe(401);
    for (const path of ['/feed', '/jobs/recommendations']) {
      const res = await request('GET', path, { token: seeker.token, tabId: seeker.tabId });
      expect(res.status, path).toBe(200);
    }
  });

  test('employer can deactivate and reactivate (lifecycle) — search follows status', async () => {
    const auth = { token: recruiter.token, tabId: recruiter.tabId };
    await request('POST', `/employers/jobs/${job.id}/deactivate`, { ...auth, body: {} });
    expect(ids(await search({ q: token }))).not.toContain(job.id);

    await request('POST', `/employers/jobs/${job.id}/activate`, { ...auth, body: {} });
    expect(ids(await search({ q: token }))).toContain(job.id);
  });
});
