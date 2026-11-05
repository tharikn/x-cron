import { API_BASE, DEFAULT_PASSWORD, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } from './env';
import { uniqueLabel, uniqueUsername } from './unique';

export type AuthSession = {
  token: string;
  refreshToken?: string;
  /** Must stay constant for AUTH_SINGLE_TAB=1 sessions. */
  tabId: string;
  user: {
    id: string;
    username?: string;
    email?: string;
    roles: string[];
    displayName?: string;
  };
};

export type PublishedJob = {
  id: string;
  slug?: string;
  title: string;
  employerName: string;
};

type Json = Record<string, unknown>;

function newTabId(): string {
  return `e2e-${Math.random().toString(36).slice(2, 12)}`;
}

async function request<T = Json>(
  method: string,
  path: string,
  opts: {
    body?: unknown;
    token?: string;
    tabId?: string;
    expectOk?: boolean;
  } = {},
): Promise<{ status: number; data: T; headers: Headers }> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Tab-Id': opts.tabId || newTabId(),
  };
  if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (opts.token) {
    headers.Authorization = `Bearer ${opts.token}`;
  }
  const res = await fetch(`${API_BASE}${path.startsWith('/') ? path : `/${path}`}`, {
    method,
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  const text = await res.text();
  let data = {} as T;
  if (text) {
    try {
      data = JSON.parse(text) as T;
    } catch {
      data = { raw: text } as T;
    }
  }
  if (opts.expectOk !== false && !res.ok) {
    throw new Error(
      `API ${method} ${path} → ${res.status}: ${text.slice(0, 400)}`,
    );
  }
  return { status: res.status, data, headers: res.headers };
}

function asSession(
  data: AuthSession & { token?: string },
  tabId: string,
): AuthSession {
  if (!data?.token) {
    throw new Error(`Auth response missing token: ${JSON.stringify(data).slice(0, 200)}`);
  }
  return {
    token: data.token,
    refreshToken: data.refreshToken,
    tabId,
    user: data.user || {
      id: 'unknown',
      roles: [],
    },
  };
}

export async function healthCheck(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE.replace(/\/v1$/, '')}/v1/health`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function registerUser(opts: {
  intendedRole?: 'seeker' | 'employer';
  username?: string;
  password?: string;
}): Promise<AuthSession & { username: string; password: string }> {
  const username = opts.username || uniqueUsername(opts.intendedRole === 'employer' ? 'rec' : 'sk');
  const password = opts.password || DEFAULT_PASSWORD;
  const tabId = newTabId();
  const { data } = await request<AuthSession>('POST', '/auth/register', {
    tabId,
    body: {
      username,
      password,
      confirmPassword: password,
      intendedRole: opts.intendedRole || 'seeker',
    },
  });
  return { ...asSession(data, tabId), username, password };
}

export async function loginUser(opts: {
  username: string;
  password: string;
  intendedRole?: 'seeker' | 'employer';
}): Promise<AuthSession> {
  const tabId = newTabId();
  const { data } = await request<AuthSession>('POST', '/auth/login', {
    tabId,
    body: {
      username: opts.username,
      password: opts.password,
      intendedRole: opts.intendedRole,
    },
  });
  return asSession(data, tabId);
}

export async function adminLogin(
  email = SUPER_ADMIN_EMAIL,
  password = SUPER_ADMIN_PASSWORD,
): Promise<AuthSession> {
  const tabId = newTabId();
  const { data, status } = await request<AuthSession>('POST', '/auth/admin/login', {
    tabId,
    body: { email, password },
    expectOk: false,
  });
  if (status === 429) {
    throw new Error(
      'Admin login rate-limited (SensitiveThrottle 1/hour). Restart API with RATE_LIMIT_SENSITIVE_MAX raised for e2e.',
    );
  }
  if (status >= 400) {
    throw new Error(`Admin login failed (${status}): ${JSON.stringify(data).slice(0, 200)}`);
  }
  return asSession(data, tabId);
}

export async function upsertSeekerProfile(
  session: AuthSession,
  patch: {
    displayName?: string;
    mobile?: string;
    email?: string;
  } = {},
): Promise<void> {
  await request('PATCH', '/me/profile', {
    token: session.token,
    tabId: session.tabId,
    body: {
      displayName: patch.displayName || 'E2E Seeker',
      mobile: patch.mobile || '9876543210',
      email: patch.email || `e2e_${Date.now()}@example.com`,
      showContact: true,
    },
  });
}

export async function createApplyProfile(session: AuthSession): Promise<{ id: string }> {
  const { data } = await request<{ id: string }>('POST', '/me/apply-profiles', {
    token: session.token,
    tabId: session.tabId,
    body: {
      name: uniqueLabel('Frontend'),
      headline: 'Angular developer',
      experienceBand: '1-3',
      skills: ['Angular', 'TypeScript', 'RxJS'],
      summary: 'E2E apply profile for journey tests.',
      isDefault: true,
    },
  });
  if (!data?.id) {
    throw new Error(`apply-profile missing id: ${JSON.stringify(data).slice(0, 200)}`);
  }
  return data;
}

export async function createPublishedJob(
  session: AuthSession,
  overrides: Partial<{
    title: string;
    employerName: string;
    locationCity: string;
    screeningQuestion: string;
  }> = {},
): Promise<PublishedJob> {
  const title = overrides.title || uniqueLabel('E2E Role');
  const { data } = await request<PublishedJob>('POST', '/employers/jobs', {
    token: session.token,
    tabId: session.tabId,
    body: {
      title,
      employerName: overrides.employerName || 'E2E Corp',
      locationCity: overrides.locationCity || 'Chennai',
      jobType: 'full-time',
      salaryText: '25000-35000 / month',
      description:
        'E2E published job for Playwright journeys. Looking for a reliable team member.',
      contentLanguage: 'en',
      contactPhone: '9876501234',
      contactEmail: 'hr@e2ecorp.example',
      contactWebsite: 'https://e2ecorp.example',
      vacancies: 2,
      directPublish: true,
      screeningQuestion: overrides.screeningQuestion,
    },
  });
  if (!data?.id) {
    throw new Error(`create job missing id: ${JSON.stringify(data).slice(0, 200)}`);
  }
  return data;
}

export async function applyToJob(
  session: AuthSession,
  jobId: string,
  applyProfileId: string,
  extras: { coverNote?: string; screeningAnswer?: string } = {},
): Promise<{ id: string }> {
  const { data } = await request<{ id: string }>('POST', `/jobs/${jobId}/apply`, {
    token: session.token,
    tabId: session.tabId,
    body: {
      applyProfileId,
      coverNote: extras.coverNote || 'Excited to apply via e2e.',
      screeningAnswer: extras.screeningAnswer,
    },
  });
  if (!data?.id) {
    throw new Error(`apply missing id: ${JSON.stringify(data).slice(0, 200)}`);
  }
  return data;
}

export async function searchJobs(q?: string): Promise<{ items: PublishedJob[]; total: number }> {
  const qs = new URLSearchParams();
  if (q) qs.set('q', q);
  qs.set('limit', '20');
  const { data } = await request<{ items?: PublishedJob[]; total?: number; jobs?: PublishedJob[] }>(
    'GET',
    `/jobs?${qs.toString()}`,
  );
  const items = data.items || data.jobs || [];
  return { items, total: data.total ?? items.length };
}

export async function saveJob(session: AuthSession, jobId: string): Promise<void> {
  await request('POST', `/me/saved-jobs/${jobId}`, {
    token: session.token,
    tabId: session.tabId,
    body: {},
  });
}

export async function createFeedbackThread(
  session: AuthSession,
  body = 'E2E Contact Admin message',
  audience: 'seeker' | 'employer' = 'seeker',
): Promise<{ id: string }> {
  const { data } = await request<{ id: string }>('POST', '/feedback/threads', {
    token: session.token,
    tabId: session.tabId,
    body: {
      audience,
      category: 'question',
      subject: uniqueLabel('E2E help'),
      body,
    },
  });
  return data;
}

export async function getFaq(): Promise<unknown> {
  const { data } = await request('GET', '/feedback/faq');
  return data;
}

export async function getReputation(session: AuthSession): Promise<unknown> {
  const { data } = await request('GET', '/reputation/me', {
    token: session.token,
    tabId: session.tabId,
  });
  return data;
}
