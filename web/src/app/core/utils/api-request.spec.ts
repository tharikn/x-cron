import { environment } from '../../../environments/environment';
import { isAppApiRequest } from './api-request';

describe('isAppApiRequest', () => {
  it('accepts relative API paths', () => {
    expect(isAppApiRequest('/v1/jobs')).toBe(true);
    expect(isAppApiRequest('/v1/portfolio/public/demo')).toBe(true);
  });

  it('rejects protocol-relative and third-party URLs', () => {
    expect(isAppApiRequest('//api.github.com/repos')).toBe(false);
    expect(isAppApiRequest('https://api.github.com/repos/tharikn/x-cron/releases/latest')).toBe(false);
    expect(isAppApiRequest('http://localhost:3001/v1/jobs')).toBe(false);
  });

  it('accepts absolute URLs on the configured API origin and prefix only', () => {
    expect(isAppApiRequest(`${environment.apiUrl}/jobs`)).toBe(true);
    expect(isAppApiRequest(`${environment.apiUrl}/jobs?sort=newest`)).toBe(true);
    expect(isAppApiRequest(`${environment.apiUrl}/../../v2/jobs`)).toBe(false);
    expect(isAppApiRequest(`${environment.apiUrl.replace(/\/v1\/?$/, '')}/v2/jobs`)).toBe(false);
  });
});
