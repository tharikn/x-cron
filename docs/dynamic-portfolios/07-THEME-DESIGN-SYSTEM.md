# Theme and Design System

## Token layers

Primitive -> semantic -> component -> template -> user override.

## Token groups

Color, typography, spacing, radius, shadow, border, motion, container width, breakpoints, icon size and z-index.

## Typography

Support variable fonts, responsive type scale, heading/body pairing, language-specific fallback stacks, line-height and letter-spacing.

Only use approved fonts or controlled uploads. Do not allow arbitrary remote font URLs.

## Theme modes

- light
- dark
- system

Dark mode uses dedicated semantic tokens rather than simple inversion.

## Design families

Minimal, editorial, bento, glass accent, brutalist, luxury dark, playful, monochrome, colorful and image-led.

## Responsive implementation

Prefer fluid CSS using clamp, grid, flex and container queries where useful. Avoid duplicating entire component trees for breakpoints.

## Motion

Central motion tokens define duration and easing. Every animated component must have a reduced-motion alternative.

## Customization boundaries

User customization stays within safe design tokens. Arbitrary CSS injection is out of scope for v1.
