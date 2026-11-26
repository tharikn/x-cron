import { PortfolioMemoryStore } from './portfolio.memory-store';
import { PortfolioService } from './portfolio.service';

describe('PortfolioService', () => {
  it('creates a predefined sample draft for a user with no portfolios', async () => {
    const store = new PortfolioMemoryStore();
    const service = new PortfolioService(store);

    const sites = await service.listSites('user-1');

    expect(sites).toHaveLength(1);
    expect(sites[0]).toMatchObject({
      name: 'Sample Portfolio',
      status: 'draft',
      template: { id: 'minimal-swiss-01' },
    });
    expect(sites[0].slug).toBe('sample-portfolio');
    expect(sites[0].sectionCount).toBeGreaterThan(0);
  });

  it('does not create a duplicate sample draft on subsequent list calls', async () => {
    const store = new PortfolioMemoryStore();
    const service = new PortfolioService(store);

    const first = await service.listSites('user-1');
    const second = await service.listSites('user-1');

    expect(second).toHaveLength(1);
    expect(second[0].id).toBe(first[0].id);
  });

  it('does not seed a sample when the user already has portfolios', async () => {
    const store = new PortfolioMemoryStore();
    const service = new PortfolioService(store);

    const created = await service.createSite('user-1', {
      name: 'My Real Portfolio',
      templateId: 'minimal-swiss-01',
    });

    const sites = await service.listSites('user-1');

    expect(sites).toHaveLength(1);
    expect(sites[0].id).toBe(created.id);
    expect(sites[0].name).toBe('My Real Portfolio');
  });

  it('seeds sample drafts independently per user', async () => {
    const store = new PortfolioMemoryStore();
    const service = new PortfolioService(store);

    const [user1Sites, user2Sites] = await Promise.all([
      service.listSites('user-1'),
      service.listSites('user-2'),
    ]);

    expect(user1Sites).toHaveLength(1);
    expect(user2Sites).toHaveLength(1);
    expect(user1Sites[0].id).not.toBe(user2Sites[0].id);
    expect(user1Sites[0].status).toBe('draft');
    expect(user2Sites[0].status).toBe('draft');
  });
});

describe('PortfolioService custom domain bindings', () => {
  it('creates a pending domain binding with a DNS ownership challenge', async () => {
    const store = new PortfolioMemoryStore();
    const service = new PortfolioService(store);
    const site = await service.createSite('user-1', {
      name: 'Acme Studio',
      templateId: 'minimal-swiss-01',
    });

    const domain = await service.createDomain('user-1', site.id, {
      hostname: 'www.acme.com',
      verificationMethod: 'TXT',
    });

    expect(domain.status).toBe('pending');
    expect(domain.verificationMethod).toBe('TXT');
    expect(domain.challenge?.type).toBe('TXT');
    expect(domain.challenge?.name).toBe('_xcron.www.acme.com');
    expect(String(domain.challenge?.value ?? '')).toMatch(/^xcron-verify=[a-f0-9]+$/);
  });

  it('rejects hostnames that are not valid domain names', async () => {
    const store = new PortfolioMemoryStore();
    const service = new PortfolioService(store);
    const site = await service.createSite('user-1', {
      name: 'Acme Studio',
      templateId: 'minimal-swiss-01',
    });

    await expect(
      service.createDomain('user-1', site.id, {
        hostname: 'not a host name',
        verificationMethod: 'TXT',
      }),
    ).rejects.toThrow();
  });

  it('verifies a domain once the owner published the expected DNS record', async () => {
    const store = new PortfolioMemoryStore();
    const service = new PortfolioService(store);
    const site = await service.createSite('user-1', {
      name: 'Acme Studio',
      templateId: 'minimal-swiss-01',
    });

    const domain = await service.createDomain('user-1', site.id, {
      hostname: 'www.acme.com',
      verificationMethod: 'TXT',
    });
    const proof = String(domain.challenge?.value ?? '');
    const verified = await service.verifyDomain('user-1', domain.id, { token: proof });

    expect(verified.status).toBe('verified');
    expect(verified.verifiedAt).toBeTruthy();
    expect(verified.tlsState).toBe('provisioning');
  });

  it('rejects a domain proof that does not match the issued challenge', async () => {
    const store = new PortfolioMemoryStore();
    const service = new PortfolioService(store);
    const site = await service.createSite('user-1', {
      name: 'Acme Studio',
      templateId: 'minimal-swiss-01',
    });

    const domain = await service.createDomain('user-1', site.id, {
      hostname: 'www.acme.com',
      verificationMethod: 'CNAME',
    });

    await expect(
      service.verifyDomain('user-1', domain.id, { token: 'wrong-target' }),
    ).rejects.toThrow();
  });

  it('refuses to serve public content through an unverified domain', async () => {
    const store = new PortfolioMemoryStore();
    const service = new PortfolioService(store);
    const site = await service.createSite('user-1', {
      name: 'Acme Studio',
      templateId: 'minimal-swiss-01',
    });

    const domain = await service.createDomain('user-1', site.id, {
      hostname: 'www.acme.com',
      verificationMethod: 'TXT',
    });

    await expect(service.getPublicSiteByHostname('www.acme.com')).rejects.toThrow();
  });
});
