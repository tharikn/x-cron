import { Component, Input } from '@angular/core';

/**
 * Primary brand loading indicator.
 *
 * The approved transparent V3A clock is a static PNG. The three-colour ring
 * (primary purple, accent orange, theme-coloured third arc) is a separate PNG
 * that rotates around it, so loading never replaces or recolours the logo.
 */
@Component({
  selector: 'app-xcron-spinner',
  template: `
    <span
      class="xcron-spinner"
      [style.width.px]="size"
      [style.height.px]="size"
      aria-hidden="true"
    >
      <img
        class="xcron-spinner__ring xcron-spinner__ring--on-light"
        src="brand/xcron-spinner-ring-light.png"
        alt=""
      />
      <img
        class="xcron-spinner__ring xcron-spinner__ring--on-dark"
        src="brand/xcron-spinner-ring.png"
        alt=""
      />
      <img
        class="xcron-spinner__logo xcron-spinner__logo--on-light"
        src="brand/xcron-spinner-logo-light.png"
        alt=""
      />
      <img
        class="xcron-spinner__logo xcron-spinner__logo--on-dark"
        src="brand/xcron-spinner-logo.png"
        alt=""
      />
    </span>
  `,
  styles: [
    `
      :host {
        display: inline-grid;
        place-items: center;
      }

      .xcron-spinner {
        position: relative;
        display: grid;
        place-items: center;
      }

      .xcron-spinner__ring,
      .xcron-spinner__logo {
        display: block;
      }

      .xcron-spinner__ring {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        animation: xcron-spinner-turn 900ms linear infinite;
      }

      .xcron-spinner__logo {
        position: absolute;
        inset: 14.285%;
        width: 71.43%;
        height: 71.43%;
      }

      @keyframes xcron-spinner-turn {
        to {
          transform: rotate(360deg);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .xcron-spinner__ring {
          animation-duration: 2.4s;
        }
      }
    `,
  ],
})
export class XcronSpinnerComponent {
  /** Rendered diameter in CSS pixels. */
  @Input() size = 56;
}
