import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type LandingPreviewKind = 'jobs' | 'resume' | 'portfolio';

/**
 * Decorative previews of the three products, filled with sample content so the
 * landing page shows what each product actually produces. Nothing here is a
 * live listing or a working clone: every label is a styled span, never a link
 * or button, and the host stays hidden from assistive technology.
 */
@Component({
  selector: 'app-landing-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'lp-preview',
    'aria-hidden': 'true',
    '[attr.data-kind]': 'kind()',
  },
  template: `
    <div class="pv__window">
      <div class="pv__chrome">
        <span class="pv__dots"><i></i><i></i><i></i></span>
        <span class="pv__label">{{ label() }}</span>
        <span class="pv__chrome-end"></span>
      </div>

      @switch (kind()) {
        @case ('jobs') {
          <div class="pv__body pv__body--jobs">
            <div class="pv__search">
              <span class="pv__glass"></span>
              <span class="pv__search-text">Product Designer · Chennai</span>
              <span class="pv__search-go">Search</span>
            </div>
            <div class="pv__chips">
              <span>Full-time</span><span>Remote</span><span>₹15k+</span><span>Easy apply</span>
            </div>

            <div class="pv__job-stack">
              <article class="pv__job-card">
                <div class="pv__job-top"><span>Featured role</span><span>2h ago</span></div>
                <div class="pv__job-title">Senior Product Designer</div>
                <div class="pv__job-meta">Northstar Labs · Chennai · ₹22,000 / month</div>
                <p class="pv__job-desc">
                  Shape clear, accessible experiences for a growing product team. You will own
                  research, flows, and the design system.
                </p>
                <div class="pv__reqs">
                  @for (req of requirements; track req) {
                    <span>{{ req }}</span>
                  }
                </div>
                <span class="pv__apply">Apply now <span aria-hidden="true">→</span></span>
              </article>

              <div class="pv__rail">
                <div class="pv__rail-head">More roles <span>18 nearby</span></div>
                @for (role of roles; track role.title) {
                  <div class="pv__rail-row">
                    <span class="pv__rail-mark"></span>
                    <span class="pv__rail-copy">
                      <b>{{ role.title }}</b>
                      <small>{{ role.company }} · {{ role.place }}</small>
                    </span>
                    <span class="pv__rail-pay">{{ role.pay }}</span>
                  </div>
                }
                <div class="pv__rail-foot">View all opportunities →</div>
              </div>
            </div>
          </div>
        }

        @case ('resume') {
          <div class="pv__body pv__body--paper">
            <div class="pv__doc">
              <div class="pv__doc-head">
                <span class="pv__monogram">AR</span>
                <div class="pv__identity">
                  <strong>Ananya R.</strong>
                  <span>Product Designer · Chennai, Tamil Nadu</span>
                  <span>ananya.example</span>
                </div>
              </div>
              <div class="pv__doc-rule"></div>

              <div class="pv__doc-section pv__doc-section--profile">
                <div class="pv__doc-title">Profile</div>
                <p class="pv__doc-text">
                  Product designer with 3 years turning research into simple mobile interfaces.
                </p>
              </div>

              <div class="pv__doc-section">
                <div class="pv__doc-title">Experience</div>
                <div class="pv__entry">
                  <b>Product Designer · Northstar Labs</b><time>2023 — Present</time>
                </div>
                <p class="pv__doc-text">
                  Cut onboarding drop-off by 18%. Built the shared design system.
                </p>
                <div class="pv__entry">
                  <b>Design Intern · Studio Fold</b><time>2022</time>
                </div>
                <p class="pv__doc-text">Supported user interviews and shipped three client sites.</p>
              </div>

              <div class="pv__doc-section pv__doc-section--education">
                <div class="pv__doc-title">Education</div>
                <div class="pv__entry">
                  <b>B.Sc. Computer Science · Madras University</b><time>2022</time>
                </div>
              </div>

              <div class="pv__doc-section">
                <div class="pv__doc-title">Skills</div>
                <div class="pv__skills">
                  @for (skill of skills; track skill) {
                    <span>{{ skill }}</span>
                  }
                </div>
              </div>
            </div>
          </div>
        }

        @case ('portfolio') {
          <div class="pv__body pv__body--site">
            <div class="pv__site-bar">
              <span class="pv__brand">ananya.design</span>
              <span class="pv__site-nav"><i>Work</i><i>About</i><i>Contact</i></span>
            </div>
            <div class="pv__site-hero">
              <span class="pv__kicker">Product designer · Chennai</span>
              <span class="pv__headline">I design products that feel easy to use.</span>
              <p class="pv__hero-text">
                Selected work from three years of designing for real people and small teams.
              </p>
              <span class="pv__cta">View my work →</span>
            </div>
            <div class="pv__tiles">
              @for (project of projects; track project.title) {
                <div class="pv__tile">
                  <span class="pv__tile-art pv__tile-art--{{ project.art }}"></span>
                  <span class="pv__tile-label">
                    <b>{{ project.title }}</b>
                    <small>{{ project.detail }}</small>
                  </span>
                </div>
              }
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: `
    :host {
      --pv-accent: #6d55ef;
      --pv-soft: #f0edff;
      --pv-line: #e7e8f0;
      --pv-ink: #202233;
      --pv-muted: #777b90;
      --pv-chrome-h: clamp(20px, 7.5cqw, 30px);
      --pv-fs-xs: clamp(7px, 2.1cqw, 10px);
      --pv-fs-sm: clamp(8px, 2.5cqw, 12px);
      --pv-fs-md: clamp(9px, 3.1cqw, 14px);
      --pv-fs-lg: clamp(11px, 3.7cqw, 17px);
      container-type: inline-size;
      display: block;
      width: 100%;
      color: var(--pv-ink);
      font-family: var(--xcron-font-body, system-ui, sans-serif);
    }

    :host([data-kind='resume']) {
      --pv-accent: #b06a17;
      --pv-soft: #fbf1e2;
    }

    :host([data-kind='portfolio']) {
      --pv-accent: #17796f;
      --pv-soft: #e7f5f2;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .pv__window {
      aspect-ratio: 4 / 3;
      width: 100%;
      overflow: hidden;
      border: 1px solid var(--pv-line);
      border-radius: 16px;
      background: #fff;
      box-shadow:
        0 1px 2px rgba(22, 24, 40, 0.04),
        0 18px 42px rgba(22, 24, 40, 0.1);
    }

    .pv__chrome {
      display: flex;
      align-items: center;
      gap: 10px;
      height: var(--pv-chrome-h);
      padding: 0 clamp(8px, 3cqw, 12px);
      border-bottom: 1px solid var(--pv-line);
      background: #fbfbfd;
    }

    .pv__dots {
      display: inline-flex;
      gap: 4px;
    }

    .pv__dots i {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #d5d7e2;
    }

    .pv__dots i:first-child {
      background: var(--pv-accent);
    }

    .pv__label {
      flex: 1;
      overflow: hidden;
      color: #868a9c;
      font-size: var(--pv-fs-xs);
      font-weight: 600;
      letter-spacing: 0.02em;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .pv__chrome-end {
      width: 24px;
    }

    .pv__body {
      display: flex;
      flex-direction: column;
      gap: clamp(4px, 1.5cqw, 9px);
      height: calc(100% - var(--pv-chrome-h));
      padding: clamp(8px, 3cqw, 16px);
      overflow: hidden;
    }

    /* ---------- Job discovery ---------- */

    .pv__search {
      display: flex;
      align-items: center;
      gap: clamp(4px, 1.5cqw, 8px);
      height: clamp(18px, 7cqw, 28px);
      flex: 0 0 auto;
      padding: 0 clamp(5px, 2cqw, 9px);
      border: 1px solid var(--pv-line);
      border-radius: 8px;
      background: #fff;
    }

    .pv__glass {
      position: relative;
      width: clamp(7px, 2.6cqw, 11px);
      height: clamp(7px, 2.6cqw, 11px);
      flex: 0 0 auto;
      border: 2px solid var(--pv-accent);
      border-radius: 50%;
      opacity: 0.8;
    }

    .pv__glass::after {
      content: '';
      position: absolute;
      right: -3px;
      bottom: -2px;
      width: 5px;
      height: 2px;
      background: var(--pv-accent);
      transform: rotate(45deg);
    }

    .pv__search-text {
      overflow: hidden;
      color: #4a4d60;
      font-size: var(--pv-fs-xs);
      font-weight: 600;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .pv__search-go {
      margin-left: auto;
      padding: 2px clamp(4px, 1.5cqw, 8px);
      border-radius: 5px;
      background: var(--pv-accent);
      color: #fff;
      font-size: var(--pv-fs-xs);
      font-weight: 700;
      line-height: 1.4;
    }

    .pv__chips {
      display: flex;
      gap: clamp(3px, 1cqw, 6px);
      flex: 0 0 auto;
      overflow: hidden;
    }

    .pv__chips span,
    .pv__reqs span,
    .pv__skills span {
      padding: 2px clamp(4px, 1.4cqw, 7px);
      border-radius: 999px;
      background: var(--pv-soft);
      color: var(--pv-accent);
      font-size: var(--pv-fs-xs);
      font-weight: 600;
      line-height: 1.35;
      white-space: nowrap;
    }

    .pv__chips span:nth-child(n + 3) {
      background: #f2f3f7;
      color: #6f7386;
    }

    .pv__job-stack {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: clamp(5px, 1.6cqw, 9px);
      min-height: 0;
      flex: 1;
    }

    .pv__job-card {
      display: flex;
      min-height: 0;
      flex-direction: column;
      gap: clamp(2px, 0.9cqw, 5px);
      padding: clamp(6px, 2.2cqw, 12px);
      border: 1px solid #e9eaf2;
      border-radius: 9px;
      background: #fff;
      box-shadow: 0 2px 8px rgba(30, 27, 60, 0.04);
    }

    .pv__job-top {
      display: flex;
      justify-content: space-between;
      gap: 6px;
      color: var(--pv-accent);
      font-size: var(--pv-fs-xs);
      font-weight: 700;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    .pv__job-top span:last-child {
      color: var(--pv-muted);
      font-weight: 500;
      text-transform: none;
    }

    .pv__job-title {
      font-size: var(--pv-fs-md);
      font-weight: 700;
      line-height: 1.2;
    }

    .pv__job-meta {
      color: #5d6175;
      font-size: var(--pv-fs-xs);
      font-weight: 600;
    }

    .pv__job-desc {
      margin: 0;
      color: var(--pv-muted);
      font-size: var(--pv-fs-xs);
      line-height: 1.4;
    }

    .pv__reqs {
      display: flex;
      flex-wrap: wrap;
      gap: clamp(3px, 1cqw, 6px);
      overflow: hidden;
    }

    .pv__reqs span {
      background: #f4f4f8;
      color: #656980;
    }

    .pv__apply {
      align-self: flex-start;
      margin-top: auto;
      padding: 2px clamp(6px, 2cqw, 10px);
      border-radius: 6px;
      background: var(--pv-accent);
      color: #fff;
      font-size: var(--pv-fs-xs);
      font-weight: 700;
      line-height: 1.5;
      white-space: nowrap;
    }

    .pv__rail {
      display: none;
      min-height: 0;
      flex-direction: column;
      gap: clamp(4px, 1.3cqw, 7px);
      padding: clamp(6px, 2cqw, 10px);
      border: 1px solid #e9eaf2;
      border-radius: 9px;
      background: #fcfcfe;
    }

    .pv__rail-head {
      display: flex;
      justify-content: space-between;
      gap: 6px;
      font-size: var(--pv-fs-xs);
      font-weight: 700;
    }

    .pv__rail-head span {
      color: var(--pv-accent);
      font-weight: 600;
    }

    .pv__rail-row {
      display: flex;
      align-items: center;
      gap: clamp(4px, 1.4cqw, 8px);
      padding: clamp(4px, 1.4cqw, 8px);
      border: 1px solid #efeff4;
      border-radius: 7px;
      background: #fff;
    }

    .pv__rail-mark {
      width: clamp(14px, 5cqw, 22px);
      height: clamp(14px, 5cqw, 22px);
      flex: 0 0 auto;
      border-radius: 6px;
      background: var(--pv-soft);
    }

    .pv__rail-copy {
      display: flex;
      min-width: 0;
      flex: 1;
      flex-direction: column;
      gap: 2px;
    }

    .pv__rail-copy b,
    .pv__rail-copy small {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .pv__rail-copy b {
      font-size: var(--pv-fs-xs);
    }

    .pv__rail-copy small,
    .pv__rail-pay {
      color: var(--pv-muted);
      font-size: var(--pv-fs-xs);
    }

    .pv__rail-pay {
      flex: 0 0 auto;
      font-weight: 700;
    }

    .pv__rail-foot {
      margin-top: auto;
      color: var(--pv-accent);
      font-size: var(--pv-fs-xs);
      font-weight: 700;
    }

    /* ---------- Resume ---------- */

    .pv__body--paper {
      align-items: center;
      justify-content: center;
      background: #f4f3f8;
    }

    .pv__doc {
      width: 88%;
      height: 95%;
      padding: clamp(7px, 2.4cqw, 10px);
      overflow: hidden;
      border: 1px solid #ececf2;
      border-radius: 6px;
      background: #fff;
      box-shadow: 0 6px 18px rgba(28, 26, 48, 0.07);
    }

    .pv__doc-head {
      display: flex;
      align-items: center;
      gap: clamp(6px, 2cqw, 11px);
    }

    .pv__monogram {
      display: grid;
      width: clamp(22px, 6.5cqw, 30px);
      height: clamp(22px, 6.5cqw, 30px);
      flex: 0 0 auto;
      place-items: center;
      border-radius: 50%;
      background: var(--pv-soft);
      color: var(--pv-accent);
      font-size: var(--pv-fs-xs);
      font-weight: 700;
    }

    .pv__identity {
      display: flex;
      min-width: 0;
      flex-direction: column;
      gap: 2px;
    }

    .pv__identity strong {
      font-size: var(--pv-fs-md);
      font-weight: 700;
      line-height: 1.15;
    }

    .pv__identity span {
      overflow: hidden;
      color: var(--pv-muted);
      font-size: var(--pv-fs-xs);
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .pv__doc-rule {
      height: 2px;
      margin: clamp(3px, 1cqw, 6px) 0;
      background: var(--pv-accent);
      opacity: 0.6;
    }

    .pv__doc-section {
      margin-bottom: clamp(2px, 0.8cqw, 5px);
    }

    .pv__doc-title {
      margin-bottom: clamp(2px, 0.9cqw, 5px);
      color: var(--pv-accent);
      font-size: var(--pv-fs-xs);
      font-weight: 700;
      letter-spacing: 0.09em;
      text-transform: uppercase;
    }

    .pv__doc-text {
      margin: 0 0 1px;
      color: #55596d;
      font-size: var(--pv-fs-xs);
      line-height: 1.4;
    }

    .pv__entry {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 6px;
    }

    .pv__entry b {
      font-size: var(--pv-fs-xs);
      font-weight: 700;
    }

    .pv__entry time {
      flex: 0 0 auto;
      color: var(--pv-muted);
      font-size: var(--pv-fs-xs);
    }

    .pv__skills {
      display: flex;
      flex-wrap: wrap;
      gap: clamp(3px, 1cqw, 6px);
    }

    /* ---------- Portfolio ---------- */

    .pv__site-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding-bottom: clamp(4px, 1.4cqw, 8px);
      border-bottom: 1px solid var(--pv-line);
    }

    .pv__brand {
      font-size: var(--pv-fs-sm);
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .pv__site-nav {
      display: flex;
      gap: clamp(5px, 1.8cqw, 10px);
    }

    .pv__site-nav i {
      color: var(--pv-muted);
      font-size: var(--pv-fs-xs);
      font-style: normal;
      font-weight: 600;
    }

    .pv__site-nav i:first-child {
      color: var(--pv-accent);
    }

    .pv__site-hero {
      display: flex;
      min-height: 0;
      flex: 1;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: clamp(3px, 1.2cqw, 7px);
      padding: clamp(4px, 1.6cqw, 8px) 0;
    }

    .pv__kicker {
      color: var(--pv-accent);
      font-size: var(--pv-fs-xs);
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .pv__headline {
      max-width: 22ch;
      font-size: var(--pv-fs-lg);
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1.12;
    }

    .pv__hero-text {
      max-width: 38ch;
      margin: 0;
      color: var(--pv-muted);
      font-size: var(--pv-fs-xs);
      line-height: 1.4;
    }

    .pv__cta {
      margin-top: 2px;
      padding: 3px clamp(6px, 2.2cqw, 11px);
      border-radius: 999px;
      background: var(--pv-accent);
      color: #fff;
      font-size: var(--pv-fs-xs);
      font-weight: 700;
      line-height: 1.35;
    }

    .pv__tiles {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: clamp(4px, 1.4cqw, 8px);
      flex: 0 0 auto;
    }

    .pv__tile {
      display: flex;
      min-width: 0;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid var(--pv-line);
      border-radius: 7px;
      background: #fff;
    }

    .pv__tile-art {
      display: block;
      height: clamp(20px, 8cqw, 42px);
      background: var(--pv-soft);
    }

    .pv__tile-art--chart {
      background:
        linear-gradient(to top, var(--pv-accent) 32%, transparent 32%) 14% 100% / 18% 74% no-repeat,
        linear-gradient(to top, var(--pv-accent) 58%, transparent 58%) 42% 100% / 18% 74% no-repeat,
        linear-gradient(to top, var(--pv-accent) 44%, transparent 44%) 70% 100% / 18% 74% no-repeat,
        var(--pv-soft);
      opacity: 0.85;
    }

    .pv__tile-art--cards {
      background:
        linear-gradient(#fff, #fff) 18% 24% / 58% 46% no-repeat,
        linear-gradient(var(--pv-accent), var(--pv-accent)) 58% 54% / 24% 16% no-repeat,
        var(--pv-soft);
    }

    .pv__tile-art--grid {
      background:
        radial-gradient(circle at 30% 35%, var(--pv-accent) 18%, transparent 19%),
        radial-gradient(circle at 68% 60%, #b06a17 14%, transparent 15%),
        var(--pv-soft);
    }

    .pv__tile-label {
      display: flex;
      flex-direction: column;
      gap: 1px;
      padding: clamp(3px, 1.2cqw, 7px);
    }

    .pv__tile-label b,
    .pv__tile-label small {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .pv__tile-label b {
      font-size: var(--pv-fs-xs);
    }

    .pv__tile-label small {
      color: var(--pv-muted);
      font-size: var(--pv-fs-xs);
    }

    /* The hero cards are narrow on phones: keep the most useful content. */
    @container (max-width: 360px) {
      .pv__chips span:nth-child(n + 3),
      .pv__rail,
      .pv__doc-section--profile,
      .pv__doc-section--education,
      .pv__tile:nth-child(3),
      .pv__hero-text {
        display: none;
      }

      .pv__tiles {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @container (min-width: 361px) {
      .pv__job-stack {
        grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
      }

      .pv__rail {
        display: flex;
      }
    }
  `,
})
export class LandingPreviewComponent {
  readonly kind = input.required<LandingPreviewKind>();
  readonly label = input<string>('Preview');

  protected readonly requirements = ['3+ years', 'Design systems'];
  protected readonly roles = [
    { title: 'UX Designer', company: 'Kite Studio', place: 'T. Nagar', pay: '₹18k' },
    { title: 'Frontend Developer', company: 'Fold Labs', place: 'Remote', pay: '₹24k' },
    { title: 'Visual Designer', company: 'Cove', place: 'Anna Nagar', pay: '₹16k' },
  ];
  protected readonly skills = ['Figma', 'Research', 'Design systems', 'Prototyping'];
  protected readonly projects = [
    { title: 'Finly', detail: 'Mobile app', art: 'chart' },
    { title: 'Campus Kart', detail: 'Web storefront', art: 'cards' },
    { title: 'Field Notes', detail: 'Design system', art: 'grid' },
  ];
}
