import { expect, test } from '@playwright/test';
import {
  type AuthSession,
  type PublishedJob,
  applyToJob,
  createApplyProfile,
  createPublishedJob,
  healthCheck,
  registerUser,
  request,
  upsertSeekerProfile,
} from '../helpers/api-client';

type Application = { id: string; status: string; jobId: string };
type Listed = { items?: Application[] } | Application[];
const rows = (d: Listed) => (Array.isArray(d) ? d : d.items ?? []);

/** docs/APPLICATIONS_TIMELINE.md — apply → review → chat → withdraw; ownership. */
test.describe('@api @applications ATS applications', () => {
  test.describe.configure({ mode: 'serial' });

  let recruiter: AuthSession;
  let seeker: AuthSession;
  let job: PublishedJob;
  let applicationId: string;

  const as = (s: AuthSession) => ({ token: s.token, tabId: s.tabId });

  test.beforeAll(async () => {
    test.skip(!(await healthCheck()), 'API not reachable');
    recruiter = await registerUser({ intendedRole: 'employer' });
    seeker = await registerUser({ intendedRole: 'seeker' });
    job = await createPublishedJob(recruiter);
    await upsertSeekerProfile(seeker);
  });

  test('@smoke seeker applies with an apply-profile version', async () => {
    const profile = await createApplyProfile(seeker);
    const app = await applyToJob(seeker, job.id, profile.id);
    applicationId = app.id;

    const mine = await request<Listed>('GET', '/me/job-applications', as(seeker));
    const row = rows(mine.data).find((a) => a.id === applicationId);
    expect(row?.status).toBe('applied');

    const duplicate = await request('POST', `/jobs/${job.id}/apply`, {
      ...as(seeker),
      body: { applyProfileId: profile.id, coverNote: 'Second try' },
      expectOk: false,
    });
    expect(duplicate.status).toBeGreaterThanOrEqual(400);
    expect(duplicate.status).toBeLessThan(500);
    const again = await request<Listed>('GET', '/me/job-applications', as(seeker));
    expect(rows(again.data).filter((a) => a.jobId === job.id)).toHaveLength(1);
  });

  test('apply without an apply-profile id is rejected', async () => {
    const other = await registerUser({ intendedRole: 'seeker' });
    const res = await request<{ errors?: Record<string, string> }>('POST', `/jobs/${job.id}/apply`, {
      ...as(other),
      body: {},
      expectOk: false,
    });
    expect(res.status).toBe(400);
    expect(Object.keys(res.data.errors ?? {})).toContain('applyProfileId');
  });

  test('employer sees the applicant and moves the status forward', async () => {
    const list = await request<Listed>('GET', `/employers/jobs/${job.id}/applications`, as(recruiter));
    expect(rows(list.data).map((a) => a.id)).toContain(applicationId);

    const detail = await request<Application>('GET', `/employers/applications/${applicationId}`, as(recruiter));
    expect(detail.data.id).toBe(applicationId);

    const moved = await request<Application>('POST', `/employers/applications/${applicationId}/transition`, {
      ...as(recruiter),
      body: { status: 'under_review', note: 'Looks promising' },
    });
    expect(moved.data.status).toBe('under_review');

    const offerWithoutLetter = await request('POST', `/employers/applications/${applicationId}/transition`, {
      ...as(recruiter),
      body: { status: 'offered' },
      expectOk: false,
    });
    expect(offerWithoutLetter.status).toBe(400);
  });

  test('conversation chat + read cursor work for both participants', async () => {
    await request('POST', `/conversations/${applicationId}/messages`, {
      ...as(seeker),
      body: { body: 'Hi, when is the interview?' },
    });
    const employerView = await request<{ items?: Array<{ body: string }> } | Array<{ body: string }>>(
      'GET',
      `/employers/applications/${applicationId}/messages`,
      as(recruiter),
    );
    const messages = Array.isArray(employerView.data) ? employerView.data : employerView.data.items ?? [];
    expect(messages.map((m) => m.body)).toContain('Hi, when is the interview?');

    const read = await request('POST', `/conversations/${applicationId}/read`, { ...as(recruiter), body: {} });
    expect(read.status).toBeLessThan(300);

    const inbox = await request('GET', '/conversations', as(seeker));
    expect(inbox.status).toBe(200);
  });

  test('other users cannot read someone else’s application', async () => {
    const stranger = await registerUser({ intendedRole: 'seeker' });
    const res = await request('GET', `/me/job-applications/${applicationId}`, {
      ...as(stranger),
      expectOk: false,
    });
    expect([403, 404]).toContain(res.status);

    const otherRecruiter = await registerUser({ intendedRole: 'employer' });
    const emp = await request('GET', `/employers/applications/${applicationId}`, {
      ...as(otherRecruiter),
      expectOk: false,
    });
    expect([403, 404]).toContain(emp.status);
  });

  test('seeker withdraws; timeline records it and chat is closed', async () => {
    const withdrawn = await request<Application>('POST', `/me/job-applications/${applicationId}/withdraw`, {
      ...as(seeker),
      body: { note: 'Accepted another offer' },
    });
    expect(withdrawn.data.status).toBe('withdrawn');

    const blocked = await request('POST', `/conversations/${applicationId}/messages`, {
      ...as(seeker),
      body: { body: 'One more thing' },
      expectOk: false,
    });
    expect(blocked.status).toBeGreaterThanOrEqual(400);
  });
});
