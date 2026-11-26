import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { PortfolioCustomCodeComponent } from './portfolio-custom-code.component';
import {
  composeCustomCodeDocument,
  readCustomCodeProps,
} from './custom-code-frame';

const PROPS = {
  title: 'Preview',
  html: '<div class="hero">Hello</div>',
  css: '.hero{background:#7655e8}',
  js: 'window.__authorRan = true;',
  height: '400',
};

describe('composeCustomCodeDocument', () => {
  it('keeps author CSS and JS as text inside the sandboxed document', () => {
    const source = composeCustomCodeDocument(readCustomCodeProps(PROPS), {
      mode: 'light',
      token: 'test-token',
    });

    expect(source).toContain('.hero{background:#7655e8}');
    expect(source).toContain('window.__authorRan = true;');
    expect(source).toContain("default-src 'none'");
  });

  it('seeds the storage shim without allowing script break-out', () => {
    const source = composeCustomCodeDocument(readCustomCodeProps(PROPS), {
      mode: 'light',
      token: 'test-token',
      storage: {
        localStorage: { theme: 'dark', note: '</script><img src=x>' },
        sessionStorage: { tab: '1' },
      },
    });

    expect(source).toContain('installStorage(\'localStorage\'');
    expect(source).toContain('"theme":"dark"');
    expect(source).toContain('"tab":"1"');
    // The value is JSON-escaped, so it cannot terminate the wrapper script.
    expect(source).not.toContain('</script><img src=x>');
  });
});

describe('PortfolioCustomCodeComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [PortfolioCustomCodeComponent],
    }).compileComponents();
  });

  async function render(storageKey = 'site-1:code-1') {
    const fixture = TestBed.createComponent(PortfolioCustomCodeComponent);
    fixture.componentRef.setInput('props', PROPS);
    fixture.componentRef.setInput('storageKey', storageKey);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    const iframe = fixture.nativeElement.querySelector('iframe') as HTMLIFrameElement;
    return { fixture, iframe, srcdoc: iframe.getAttribute('srcdoc') ?? '' };
  }

  it('assigns the document through the srcdoc property so styles survive', async () => {
    const { iframe, srcdoc } = await render();

    expect(iframe).toBeTruthy();
    expect(srcdoc).toContain('<style>');
    expect(srcdoc).toContain('.hero{background:#7655e8}');
    expect(srcdoc).toContain('window.__authorRan = true;');
  });

  it('never grants allow-same-origin', async () => {
    const { iframe } = await render();

    expect(iframe.getAttribute('sandbox')).toBe('allow-scripts');
    expect(iframe.getAttribute('sandbox')).not.toContain('allow-same-origin');
  });

  it('hydrates the frame storage from the namespaced parent key', async () => {
    localStorage.setItem(
      'xcron.pf-code.v1.site-1:code-1.localStorage',
      JSON.stringify({ theme: 'dark' }),
    );

    const { srcdoc } = await render();

    expect(srcdoc).toContain('"theme":"dark"');
  });
});
