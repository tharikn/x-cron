import { createAnimation } from '@ionic/angular';
import type { Animation, AnimationBuilder } from '@ionic/angular';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const DURATION_MS = 780;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Bottom → top overlay page transition for mobile / Android nav.
 * Entering page covers the leaving page (lightweight sheet-style open).
 */
export const xcronNavAnimation: AnimationBuilder = (
  _baseEl: HTMLElement,
  opts?: {
    enteringEl?: HTMLElement;
    leavingEl?: HTMLElement;
    direction?: string;
  },
): Animation => {
  const duration = prefersReducedMotion() ? 0 : DURATION_MS;
  const enteringEl = opts?.enteringEl;
  const leavingEl = opts?.leavingEl;
  const back = opts?.direction === 'back';

  const root = createAnimation().duration(duration).easing(EASE);

  if (enteringEl) {
    enteringEl.style.zIndex = back ? '9' : '10';
    const enter = createAnimation().addElement(enteringEl);
    if (back) {
      enter.fromTo('transform', 'translateY(-4%)', 'translateY(0)');
      enter.fromTo('opacity', '0.85', '1');
    } else {
      enter.fromTo('transform', 'translateY(100%)', 'translateY(0)');
      enter.fromTo('opacity', '0.55', '1');
    }
    root.addAnimation(enter);
  }

  if (leavingEl) {
    leavingEl.style.zIndex = back ? '10' : '9';
    const leave = createAnimation().addElement(leavingEl);
    if (back) {
      leave.fromTo('transform', 'translateY(0)', 'translateY(100%)');
      leave.fromTo('opacity', '1', '0.55');
    } else {
      leave.fromTo('transform', 'translateY(0)', 'translateY(-4%)');
      leave.fromTo('opacity', '1', '0.72');
    }
    root.addAnimation(leave);
  }

  return root;
};

/** Play a one-shot bottom→top enter on an element (tab bar switches). */
export function playBottomToTopEnter(el: HTMLElement | null | undefined): void {
  if (!el || prefersReducedMotion()) return;
  const anim = createAnimation()
    .addElement(el)
    .duration(DURATION_MS)
    .easing(EASE)
    .fromTo('transform', 'translateY(16%)', 'translateY(0)')
    .fromTo('opacity', '0.55', '1');
  void anim.play();
}
