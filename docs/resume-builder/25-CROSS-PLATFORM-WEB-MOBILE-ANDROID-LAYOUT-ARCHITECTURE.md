# 25 — Cross-Platform Web, Mobile & Android Layout Architecture

## 1. Objective

Define a production-grade layout and alignment architecture for X Cron Resume Builder across Angular desktop web, responsive mobile web, Ionic + Angular + Capacitor, Android phones/tablets and iOS where supported.

The goal is one coherent product experience with platform-appropriate layouts—not a desktop page compressed onto a phone. This document is the source of truth for responsive behavior, layout constraints, safe areas, Android system integration, navigation, typography, forms, document preview and cross-device validation.

This does not change backend scoring, resume domain logic or local-only document storage rules.

## 2. Core architecture decisions

1. Use shared design tokens, typography, spacing, color, component semantics and domain view models.
2. Compose responsive layouts per breakpoint; do not proportionally scale desktop layouts.
3. Share business behavior and accessible components where practical, while allowing web, Ionic and Android shells to use platform-specific navigation and interaction.
4. Prefer CSS Grid/Flexbox and content-driven sizing over absolute positioning and fixed pixel heights.
5. Never make essential actions hover-only or drag-and-drop-only.
6. Treat Android status/navigation bars, display cutouts, keyboard, gesture navigation and safe areas as first-class constraints.
7. Keep document pages at a readable aspect ratio; scale the page inside a viewport rather than forcing the viewport to match the page.
8. Support text scaling, browser zoom, dynamic content, localization and long translated labels without clipping.
9. Avoid horizontal page overflow at supported widths. Intentional horizontal scrolling is allowed only inside a clearly labelled document or data-comparison viewport.
10. Preserve the local document storage policy: generated and uploaded document files remain on the device.

## 3. Application shell strategy

### 3.1 Shared experience, distinct shells

Use a shared Resume Builder feature layer with platform shells:

- Shared design tokens and semantic components
- Shared feature view models and API clients
- Shared validation and interaction logic
- Angular web shell for desktop and responsive mobile web
- Ionic/Capacitor shell for Android and iOS system integration

Do not maintain separate business logic for web and mobile. Platform differences belong in navigation, file selection/saving, keyboard handling, safe-area treatment, share/open flows and interaction affordances.

### 3.2 Responsive shell behavior

| Capability | Desktop web | Tablet | Mobile web | Android app |
|---|---|---|---|---|
| Primary navigation | Collapsible side rail | Compact rail or top nav | Top bar + drawer | Ionic toolbar + menu/tab pattern |
| Content width | Bounded workspace | Fluid with max width | Full width with safe gutters | Full width with safe gutters |
| Multi-panel analysis | 2–3 panels where useful | 2 panels or tabs | Single panel/tabs | Single panel/tabs |
| Persistent actions | Inline/sticky footer | Sticky footer if space permits | Bottom action bar where safe | Bottom action area above system insets |
| Document preview | Page + controls + inspector | Page + collapsible inspector | Page viewport + compact controls | Page viewport + native-feeling controls |
| File operations | Browser download/picker | Browser download/picker | Download/share fallback | Native picker/filesystem/share sheet |

Do not force desktop sidebars, dense tables or three-column layouts onto mobile.

## 4. Breakpoints and layout grid

Use content-driven breakpoints, not device-name detection. Initial CSS breakpoints:

| Token | Width | Layout intent |
|---|---:|---|
| xs | 0–479 px | Compact phones |
| sm | 480–767 px | Large phones / small landscape |
| md | 768–1023 px | Tablets / compact laptop |
| lg | 1024–1279 px | Desktop |
| xl | 1280–1535 px | Wide desktop |
| 2xl | 1536 px+ | Large workspaces |

Guidelines:
- Main reading content: approximately 640–800 px maximum width.
- Standard workspace: approximately 1120–1280 px maximum width.
- Comparison workspace: up to approximately 1440 px where panels need it.
- Use fluid gutters with sensible minimums and maximums.
- At narrow widths, stack panels in task order; do not shrink text or controls to preserve columns.
- At 200% browser zoom, content must reflow without losing functionality.
- Do not use breakpoint-only device detection for functionality. Feature-detect browser capabilities.

Example token approach:

    :root {
      --layout-reading-max: 48rem;
      --layout-workspace-max: 80rem;
      --layout-comparison-max: 90rem;
      --page-gutter: clamp(1rem, 3vw, 2rem);
      --control-min-height: 2.75rem;
    }
    .page-shell {
      width: min(100% - 2 * var(--page-gutter), var(--layout-workspace-max));
      margin-inline: auto;
    }

Use minmax(0, 1fr), min-width: 0, max-width: 100% and wrapping to prevent intrinsic content from breaking grid alignment.

## 5. Design tokens and alignment rules

Maintain tokens centrally and consume them consistently in Angular and Ionic:

- Color: white canvas, black/near-black primary text and controls, neutral grey borders/surfaces, restrained semantic statuses.
- Typography: responsive type scale, readable line height, clear heading hierarchy, tabular numerals for scores.
- Spacing: consistent 4/8-point-derived scale.
- Shape: consistent radii and border weights.
- Elevation: minimal shadows; use borders and spacing for separation.
- Focus: high-visibility focus indicator.
- Motion: short purposeful transitions; honor reduced-motion settings.
- Layering: documented z-index tokens for app bars, drawers, dialogs, popovers, toasts and bottom actions.

Alignment requirements:
- Align page title, content, section headings and primary content to the same layout grid.
- Use consistent card padding and heading baselines.
- Keep button heights, icon sizes and text baselines consistent within control groups.
- Avoid fixed card heights where content varies; use equal-height cards only when content structure supports it.
- Use min-height rather than fixed height for content surfaces.
- Keep labels above fields on narrow screens; never rely on placeholder text as a label.
- Do not align components with manual spaces or arbitrary margins.
- Do not use absolute positioning for normal document flow.
- Long titles, URLs, skill names and translated text must wrap or truncate with an accessible full-value alternative.

## 6. Navigation architecture

### Desktop web
- Collapsible left navigation for Resume Builder sections.
- Top-level page header with breadcrumb/context, resume selector and account actions.
- Main content area with bounded width.
- Secondary inspector only for workflows that benefit from it.
- Side navigation must not cause content reflow jumps when opened/closed.

### Tablet
- Compact rail or top navigation.
- Use two-panel comparison only when each panel retains usable reading width.
- Convert secondary inspectors to drawers or tabs when constrained.

### Mobile web
- Compact top app bar with back/title/context.
- Navigation drawer or small stable bottom navigation for top-level areas only.
- Avoid nested bottom navigation bars.
- Preserve navigation state when opening detail panels.

### Android app
- Use Ionic navigation primitives and Angular Router with a documented route hierarchy.
- Android system back closes the topmost modal/drawer/detail overlay first, then navigates back.
- Avoid duplicate back buttons that conflict with system navigation.
- Use native share sheet and document picker where supported.
- Keep tabs for a small number of stable top-level destinations; deep feature routes use normal navigation stacks.
- Handle process recreation and app resume without losing recoverable drafts.

## 7. Android-specific layout engineering

### 7.1 System bars and safe areas
- Configure status bar style/background for contrast with the app header.
- Respect Android edge-to-edge and system-bar insets for supported Android versions.
- Apply safe-area insets to top/bottom interactive regions; never hard-code status-bar heights.
- Ensure bottom actions sit above gesture navigation/navigation bar.
- Test gesture navigation and three-button navigation.
- Handle display cutouts, rounded corners and landscape orientation.
- Avoid double-applying safe-area padding between Ionic and custom shell wrappers.

### 7.2 Keyboard and form layout
- When the soft keyboard opens, keep the active input and validation message visible.
- Use appropriate input types, capitalization, autofill hints and return-key labels.
- Do not let fixed bottom action bars cover the active field or keyboard.
- Scroll the active field into view after focus and when validation errors appear.
- Test Gboard and at least one alternative keyboard.
- Use multiline textareas that grow to a sensible maximum, then scroll internally.
- Preserve typed JD/resume text when switching screens or returning from a file picker.

### 7.3 Android lifecycle and display
- Handle pause/resume, backgrounding and low-memory process recreation.
- Persist recoverable drafts locally with explicit encryption and retention policy.
- Restore current route and safe UI state after returning from external document providers.
- Support portrait by default; landscape remains usable where supported.
- Test small, standard, large and foldable device widths.
- Respect system font scaling; do not clip headings or buttons at larger sizes.

### 7.4 Native file and share interactions
- Use Android Storage Access Framework/document picker when selecting a destination or source.
- Request only permissions needed for the specific operation; avoid broad storage permission when SAF is sufficient.
- Explain whether a selected URI permission is temporary or persistable.
- Confirm save only after native write completes successfully.
- Handle provider cancellation, permission revocation, duplicate filenames, low storage and interrupted writes.
- Open/share exports through supported intents; do not assume every installed app can open every format.

## 8. Screen-specific responsive specifications

### 8.1 Workspace/dashboard
Desktop: resume list/table, separate feature entry cards for Analyser, Parsing Test, Recruiter View and Match Score, and a readable recent-reports list. Avoid turning every metric into a dashboard card.

Mobile/Android: resume cards with title, target role, updated time and one primary action. Use a two-column feature grid only when cards remain comfortably tappable; otherwise stack. Recent reports become compact rows/cards. No horizontal data tables.

### 8.2 Resume editor
Desktop: optionally use three regions—section navigation, editor canvas and live preview. Allow collapsing the preview and section rail. Keep editor width readable and preview page proportions intact.

Tablet: use two regions or tabs for editor and preview; section navigation becomes compact/drawer-based.

Mobile/Android: one task at a time—section list, section editor, preview. Use full-width fields and clear Save/Done actions. Section ordering includes accessible move-up/down controls; drag is optional only. Avoid side-by-side form and page preview. Preserve drafts on back navigation.

### 8.3 Resume Analyser
Desktop: score summary and key findings in a balanced two-column layout. Finding details may use a side panel when there is sufficient width.

Mobile: score summary first, then prioritized findings. Finding detail opens as a full-screen page or bottom sheet. Filters open in a sheet and active filters remain visible as removable chips. Before/after suggestions stack vertically.

### 8.4 Parsing Test
Desktop: side-by-side source page and extracted text/structure, with synchronized navigation where feasible.

Mobile: switch between Source and Extracted tabs. Diagnostics are grouped below. Highlighted errors also have textual labels; color alone is insufficient.

### 8.5 Recruiter View
Desktop: centered reading column, optional section navigation and anonymization controls. Keep editor controls out of the reading surface.

Mobile: single reading column with compact section navigation. Preserve readable line length and spacing; avoid sticky overlays covering content.

### 8.6 Job Match Score
Desktop: JD requirement list, resume evidence and score summary may use a three-region workspace. Panels can collapse; selecting a requirement highlights corresponding resume evidence.

Tablet: two-panel comparison or JD/Resume tabs with a compact score summary.

Mobile/Android: guided sequence—job details, resume selection, score summary, requirement list, evidence detail. Use JD and Resume tabs. Each requirement is a tappable row with status text, not a dense table. Score dimensions use stacked bars and text values. Keep primary actions above system navigation insets.

### 8.7 Preview and export
Desktop: center document pages on a neutral canvas with zoom, page navigation and optional inspector. Preserve page aspect ratio; show overflow warnings outside the page.

Mobile: fit page to available width by default; pinch/zoom is optional, not the only way to read. Put page navigation and zoom controls outside the document surface. Use full-screen preview, avoid tiny embedded viewports, and follow browser/Android save capabilities.

## 9. Forms, tables and long content

- Use one-column forms on phones; two columns only for related short fields at adequate widths.
- Labels remain visible; helper text and validation messages occupy space without overlap.
- Use field-level validation plus a concise error summary for long forms.
- Keep submit/save controls reachable when keyboard is open.
- Tables become cards or labelled key-value rows on mobile.
- Genuine tabular data may use a contained horizontal scroll region with a clear affordance; never cause whole-page horizontal overflow.
- Long skills, job descriptions and achievement bullets wrap safely.
- Use line clamping only for previews with an explicit expand action.

## 10. Accessibility and inclusive layout

Target WCAG 2.2 AA for web and equivalent native accessibility practices on Android.

- Practical touch targets at least 44×44 CSS px, with adequate spacing.
- Text contrast at least 4.5:1 for normal text and 3:1 for large text/UI boundaries where required.
- Visible keyboard focus and logical focus order.
- Semantic headings, landmarks, labels and descriptive button names.
- Never communicate status through color alone.
- Support browser zoom/reflow, Android font scaling and screen magnification.
- Respect reduced motion; remove nonessential animation.
- Dialogs, drawers and bottom sheets manage focus correctly and expose accessible labels.
- Test TalkBack on Android and NVDA/VoiceOver on web platforms.

## 11. Technical implementation standards

### Angular and CSS
- Use standalone components and lazy-loaded feature routes.
- Use CSS custom properties/design tokens and component-scoped styles.
- Prefer Grid/Flexbox, logical properties and intrinsic sizing.
- Avoid global selectors that leak between features.
- Avoid fixed heights for text-bearing components.
- Use min-width: 0 for flex/grid children with long content.
- Use overflow-wrap: anywhere for untrusted long strings where appropriate.
- Use container queries where supported, with breakpoint fallbacks.
- Keep layout state separate from domain state.
- Do not use DOM measurements as the primary responsive layout strategy.

### Ionic and Capacitor
- Use Ionic components where they provide native-feeling behavior and accessibility; avoid brittle deep selectors.
- Centralize status-bar, keyboard, safe-area and back-button integration in platform services.
- Verify plugin support and behavior for minimum/target Android versions.
- Keep platform capability checks behind adapters.

### Shared components
AppShell, PageHeader, ResponsiveContainer, SectionHeader, DesktopSideNav, MobileNavigationDrawer, MobileBottomActions, ResumeCard, ReportRow, ScoreSummary, ScoreBar, FindingCard, ResponsiveFormField, FieldError, FilterSheet, DetailDrawer, DocumentViewport, PageToolbar, RequirementEvidencePanel, EmptyState, OfflineState, LoadingState and ErrorRecoveryPanel.

Components expose semantic inputs/outputs and must not rely on parent DOM structure or hard-coded viewport assumptions.

## 12. State, persistence and navigation resilience

- Preserve editor drafts during route changes, keyboard display, file picker handoff and temporary network failure.
- Use version identifiers and conflict detection for server-backed structured data.
- Protect and clean local draft storage according to security/privacy policy.
- Do not persist entire exported documents in localStorage.
- Restore scroll position only when it improves continuity; reset when context changes.
- Handle Android process death and browser refresh with safe draft recovery.
- Use route guards for authentication and ownership; hidden UI is not authorization.

## 13. Performance

- Lazy-load feature routes, document rendering and optional analysis visualization modules.
- Avoid large DOM trees for multi-page resumes; virtualize page thumbnails or long report lists where justified.
- Avoid loading desktop-only assets on mobile.
- Minimize layout shifts by reserving space for asynchronous content and fonts.
- Keep animations transform/opacity-based and limited.
- Test low-memory Android devices and slower networks.
- Ensure keyboard opening, drawer transitions and page scrolling remain smooth.
- Monitor Core Web Vitals for web and startup/render performance for Android.

## 14. Device and viewport test matrix

Minimum validation set:
- Android small phone: 360×640 logical viewport.
- Android mainstream phone: 393×852.
- Android large phone: 432×960.
- Android landscape: 800×360 or equivalent.
- Android tablet: 800×1280 and 1280×800.
- Foldable inner/outer widths where available.
- Compact and large iPhone viewports.
- Mobile Safari and Chrome Android.
- Desktop widths: 1280, 1440 and 1920.
- Browser zoom: 200%.
- Android font/display scaling: default and enlarged.
- Keyboard visible/hidden, gesture and three-button navigation.

Test every key route with long names, URLs, translated labels, empty/partial/error/loading states, validation messages, network failures, screen reader, keyboard-only interaction, portrait/landscape changes and app resume.

## 15. Release acceptance criteria

A release is not accepted until:
1. No unintended horizontal page overflow exists on supported viewport sizes.
2. No clipped, overlapping or off-screen primary controls exist.
3. Main content aligns to a consistent grid across all routes.
4. Desktop panels collapse into usable tablet/mobile patterns rather than shrinking.
5. Android system bars, cutouts, keyboard and bottom navigation do not cover content/actions.
6. Back navigation and modal dismissal follow expected Android behavior.
7. Resume editor drafts survive app backgrounding and recoverable process recreation.
8. Document preview remains legible and preserves page proportions.
9. Forms, tables and requirement matrices work without horizontal page scrolling.
10. Touch targets, text scaling, focus and screen-reader labels pass accessibility checks.
11. No essential action requires hover or drag-and-drop.
12. Local file operations are tested on real Android devices and report success only after native success.
13. Automated visual regression screenshots are reviewed at agreed breakpoints.
14. Manual QA verifies key journeys on a real Android phone and tablet-sized viewport.

## 16. Implementation sequence

1. Audit current web/mobile screens and record baseline screenshots at device matrix sizes.
2. Implement global tokens, ResponsiveContainer, PageShell and platform shell adapters.
3. Fix navigation, safe areas, system bars, keyboard and Android back handling.
4. Refactor shared controls, form fields, cards, tables and action bars.
5. Implement responsive layouts for workspace, editor and preview.
6. Implement analyser, parsing, recruiter and match-score responsive patterns.
7. Add accessibility, localization and large-text validation.
8. Add visual regression and real-device QA to CI/release checklist.
9. Fix defects by severity: clipped actions/overflow first, alignment second, polish last.

## 17. Definition of done

Web and Android are aligned when they share product language, content hierarchy, labels, domain behavior and design tokens, while each uses interactions and layouts appropriate to its screen size and operating system. Pixel-identical layouts are not the goal; predictable, polished and accessible task completion is.
