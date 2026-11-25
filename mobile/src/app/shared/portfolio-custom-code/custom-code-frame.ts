/**
 * Sandboxed custom-code frame helpers.
 *
 * User HTML/CSS/JS is treated as opaque, untrusted input. It is never parsed by
 * Angular and never executes on the app origin: it is composed into a separate
 * document that only ever loads inside an iframe WITHOUT `allow-same-origin`,
 * which gives it an opaque origin (no cookies, storage, DOM or authenticated
 * fetch). This mirrors how Framer, Webflow and CodePen host user code.
 *
 * Keep this file in sync with the web copy:
 * web/src/app/shared/portfolio-custom-code/custom-code-frame.ts
 */

export const CUSTOM_CODE_LIMITS = {
  html: 200_000,
  css: 120_000,
  js: 200_000,
  minHeight: 120,
  maxHeight: 3000,
  defaultHeight: 520,
} as const;

export interface CustomCodeFrameProps {
  title: string;
  html: string;
  css: string;
  js: string;
  height: number;
  allowForms: boolean;
  allowPopups: boolean;
  allowExternal: boolean;
}

export interface CustomCodeSplit {
  html: string;
  css: string;
  js: string;
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function flag(value: unknown): boolean {
  return value === true || value === 'true';
}

function clampHeight(value: number): number {
  const { minHeight, maxHeight, defaultHeight } = CUSTOM_CODE_LIMITS;
  if (!Number.isFinite(value)) return defaultHeight;
  return Math.min(maxHeight, Math.max(minHeight, Math.round(value)));
}

export function readCustomCodeProps(
  props: Record<string, unknown>,
): CustomCodeFrameProps {
  return {
    title: text(props['title']).trim().slice(0, 120) || 'Custom code',
    html: text(props['html']).slice(0, CUSTOM_CODE_LIMITS.html),
    css: text(props['css']).slice(0, CUSTOM_CODE_LIMITS.css),
    js: text(props['js']).slice(0, CUSTOM_CODE_LIMITS.js),
    height: clampHeight(Number(text(props['height']))),
    allowForms: flag(props['allowForms']),
    allowPopups: flag(props['allowPopups']),
    allowExternal: flag(props['allowExternal']),
  };
}

/**
 * The sandbox is the security boundary. `allow-same-origin` is deliberately
 * never included: with it, the frame could read cookies and call the API with
 * the visitor's session. Top navigation, modals and pointer lock stay denied.
 */
export function customCodeSandbox(props: CustomCodeFrameProps): string {
  const tokens = ['allow-scripts'];
  if (props.allowForms) tokens.push('allow-forms');
  if (props.allowPopups) tokens.push('allow-popups');
  return tokens.join(' ');
}

function escapeScript(source: string): string {
  return source.replace(/<\/(script)/gi, '<\\/$1').replace(/<!--/g, '<\\!--');
}

function escapeStyle(source: string): string {
  return source.replace(/<\/(style)/gi, '<\\/$1');
}

function buildCsp(props: CustomCodeFrameProps): string {
  const external = props.allowExternal ? ' https: http:' : '';
  return [
    "default-src 'none'",
    "img-src https: http: data: blob:",
    "media-src https: http: data: blob:",
    "font-src https: http: data:",
    `style-src 'unsafe-inline'${external}`,
    `script-src 'unsafe-inline' 'unsafe-eval'${external}`,
    props.allowExternal ? "connect-src https: http:" : "connect-src 'none'",
    props.allowForms ? 'form-action https: http:' : "form-action 'none'",
    "base-uri 'none'",
    "frame-src 'none'",
    "object-src 'none'",
    "worker-src 'none'",
  ].join('; ');
}

/**
 * Height + error bridge. This is our code, injected before the author's script
 * so runtime errors are reported even when the author script throws early.
 */
function bridgeScript(token: string): string {
  return `(function(){
  var TOKEN = ${JSON.stringify(token)};
  var sent = 0;
  var last = 0;
  var pending = null;
  function send(message) {
    if (sent++ > 5000) return;
    message.__pf = TOKEN;
    try { parent.postMessage(message, '*'); } catch (error) {}
  }
  function measure() {
    var root = document.documentElement;
    var body = document.body;
    var height = Math.max(root ? root.scrollHeight : 0, body ? body.scrollHeight : 0);
    send({ type: 'height', height: height });
  }
  function schedule() {
    var now = Date.now();
    if (now - last < 60) {
      if (!pending) pending = setTimeout(function () { pending = null; measure(); }, 60);
      return;
    }
    last = now;
    measure();
  }
  window.addEventListener('error', function (event) {
    send({ type: 'error', message: String((event && event.message) || 'Script error').slice(0, 300) });
  });
  window.addEventListener('unhandledrejection', function (event) {
    send({ type: 'error', message: ('Unhandled rejection: ' + String((event && event.reason) || '')).slice(0, 300) });
  });
  var originalError = console.error;
  console.error = function () {
    try {
      send({ type: 'error', message: Array.prototype.map.call(arguments, String).join(' ').slice(0, 300) });
    } catch (error) {}
    return originalError.apply(console, arguments);
  };
  document.addEventListener('DOMContentLoaded', schedule);
  window.addEventListener('load', schedule);
  try { new ResizeObserver(schedule).observe(document.documentElement); } catch (error) {}
  setTimeout(schedule, 80);
  setTimeout(schedule, 500);
  send({ type: 'ready' });
})();`;
}

/**
 * Compose the isolated document. The author's CSS/JS are embedded as text with
 * `</script`/`</style` escapes so their source cannot break out of the wrapper.
 */
export function composeCustomCodeDocument(
  props: CustomCodeFrameProps,
  options: { mode: 'light' | 'dark'; token: string },
): string {
  return [
    '<!doctype html>',
    `<html lang="en" data-pf-theme="${options.mode}">`,
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<meta http-equiv="Content-Security-Policy" content="${buildCsp(props)}">`,
    '<meta name="referrer" content="no-referrer">',
    `<style>:root{color-scheme:${options.mode}}html,body{margin:0;padding:0}body{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;line-height:1.5;overflow-wrap:break-word}</style>`,
    `<style>${escapeStyle(props.css)}</style>`,
    `<script>${bridgeScript(options.token)}</script>`,
    '</head>',
    '<body>',
    props.html,
    `<script>${escapeScript(props.js)}</script>`,
    '</body>',
    '</html>',
  ].join('\n');
}

/**
 * Turn a pasted or imported full page into three panes: inline classic scripts
 * become JavaScript, `<style>` blocks become CSS, and the remaining body markup
 * (including stylesheet links) stays HTML. Module scripts and non-JS script
 * types stay in the markup so their semantics are preserved.
 */
export function splitCustomCodePage(source: string): CustomCodeSplit {
  const input = text(source);
  const looksLikePage = /<html[\s>]|<body[\s>]|<head[\s>]|<style[\s>]|<script[\s>]/i.test(
    input,
  );
  if (!looksLikePage || typeof DOMParser === 'undefined') {
    return { html: input, css: '', js: '' };
  }

  const parsed = new DOMParser().parseFromString(input, 'text/html');
  const css: string[] = [];
  const js: string[] = [];

  parsed.querySelectorAll('style').forEach((element) => {
    const content = element.textContent?.trim();
    if (content) css.push(content);
    element.remove();
  });

  parsed.querySelectorAll('script').forEach((element) => {
    if (element.getAttribute('src')) return;
    const type = (element.getAttribute('type') ?? '').trim().toLowerCase();
    const isClassicJs =
      !type || type === 'text/javascript' || type === 'application/javascript';
    if (!isClassicJs) return;
    const content = element.textContent ?? '';
    if (content.trim()) js.push(content.trim());
    element.remove();
  });

  const headLinks: string[] = [];
  parsed.querySelectorAll('head link[rel~="stylesheet"], head style').forEach((element) => {
    if (element.tagName.toLowerCase() === 'link') headLinks.push(element.outerHTML);
    element.remove();
  });

  const body = parsed.body ? parsed.body.innerHTML.trim() : '';
  return {
    html: [headLinks.join('\n'), body].filter(Boolean).join('\n').trim(),
    css: css.join('\n\n'),
    js: js.join('\n\n'),
  };
}

/**
 * Heuristic used by the importer: does this source load anything from the
 * network? Fonts, stylesheets, scripts, images, media, fetches and sockets all
 * need the `allowExternal` CSP relaxation; plain `<a href>` links do not.
 */
export function usesExternalResources(...sources: string[]): boolean {
  const source = sources.filter(Boolean).join('\n');
  if (!source) return false;
  return [
    /@import\s+(?:url\()?['"]?https?:\/\//i,
    /\burl\(\s*['"]?https?:\/\//i,
    /<script[^>]+src\s*=\s*['"]?https?:\/\//i,
    /<link[^>]+href\s*=\s*['"]?https?:\/\//i,
    /<img[^>]+src\s*=\s*['"]?https?:\/\//i,
    /<(?:source|audio)[^>]+src\s*=\s*['"]?https?:\/\//i,
    /<video[^>]+(?:src|poster)\s*=\s*['"]?https?:\/\//i,
    /\bfetch\s*\(\s*['"`]https?:\/\//i,
    /\bimport\s*\(\s*['"`]https?:\/\//i,
    /\bfrom\s+['"`]https?:\/\//i,
    /new\s+WebSocket\s*\(\s*['"`]wss?:\/\//i,
  ].some((pattern) => pattern.test(source));
}

export function codeByteLength(value: unknown): number {
  const source = text(value);
  if (!source) return 0;
  return new TextEncoder().encode(source).length;
}

export function codeLineCount(value: unknown): number {
  const source = text(value);
  if (!source) return 0;
  return source.split('\n').length;
}
