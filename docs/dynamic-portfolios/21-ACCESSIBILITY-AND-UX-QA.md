# Accessibility and UX QA

## Baseline
Target WCAG 2.2 AA-oriented behavior.

## Public requirements
Keyboard navigation, visible focus, semantic headings, landmarks, labels, alt text, sufficient contrast, 200% zoom, text resizing, reduced motion, suitable touch targets and accessible errors.

## Editor requirements
Provide keyboard alternatives for drag/drop, screen-reader labels, focus restoration, accessible dialogs and announcements for autosave/publish states.

## Motion
Animations must have a purpose, must not block content and must reduce/stop when reduced motion is requested.

## Responsive QA
Test 320px, 375px, 768px, 1024px and 1440px+ plus zoom and long localized strings.

## Quality gate
A template fails if visual effects make content unreadable, inaccessible or unusable.
