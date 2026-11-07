import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { correlationInterceptor } from './correlation.interceptor';

describe('correlationInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([correlationInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => backend.verify());

  it('adds a fresh X-Request-Id to every request', () => {
    http.get('/v1/jobs').subscribe();
    http.get('/v1/jobs').subscribe();
    const [a, b] = backend.match('/v1/jobs');
    const idA = a.request.headers.get('X-Request-Id');
    const idB = b.request.headers.get('X-Request-Id');
    expect(idA).toBeTruthy();
    expect(idB).toBeTruthy();
    expect(idA).not.toBe(idB);
    a.flush({});
    b.flush({});
  });

  it('keeps a caller-provided X-Request-Id', () => {
    http.get('/v1/health', { headers: { 'X-Request-Id': 'mine-1' } }).subscribe();
    const req = backend.expectOne('/v1/health');
    expect(req.request.headers.get('X-Request-Id')).toBe('mine-1');
    req.flush({});
  });

  async function failWith(
    body: Record<string, unknown>,
    headers: Record<string, string> = {},
  ): Promise<HttpErrorResponse & { correlationId?: string }> {
    const pending = firstValueFrom(http.get('/v1/me/profile'));
    const req = backend.expectOne('/v1/me/profile');
    const sent = req.request.headers.get('X-Request-Id');
    req.flush(body, { status: 400, statusText: 'Bad Request', headers });
    try {
      await pending;
    } catch (err) {
      return Object.assign(err as HttpErrorResponse, { sentId: sent });
    }
    throw new Error('expected request to fail');
  }

  it('stamps the API body correlationId onto errors first', async () => {
    const err = await failWith({ correlationId: 'body-id' }, { 'X-Request-Id': 'hdr-id' });
    expect(err).toBeInstanceOf(HttpErrorResponse);
    expect(err.correlationId).toBe('body-id');
  });

  it('falls back to the response header, then the sent id', async () => {
    expect((await failWith({}, { 'X-Request-Id': 'hdr-id' })).correlationId).toBe('hdr-id');
    const noIds = (await failWith({})) as HttpErrorResponse & {
      correlationId?: string;
      sentId?: string;
    };
    expect(noIds.correlationId).toBe(noIds.sentId);
  });
});
