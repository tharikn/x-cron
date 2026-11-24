# Visual Editor and Page Builder

## Editor areas

- Template selector
- Page navigator
- Section tree
- Canvas preview
- Properties panel
- Theme panel
- Content/localization panel
- Media picker
- Device preview
- Undo/redo
- Validation
- Publish

## Section operations

Add, remove, duplicate, reorder, hide/show, change variant and reset to template defaults.

## Component editing

Generate property forms from component schemas. The editor never exposes arbitrary DOM/CSS/HTML in the normal flow.

## Drag/drop

Allow only valid parent-child relationships. Persist semantic order, not screen coordinates. Avoid absolute positioning for ordinary portfolio content.

## Autosave

Use debounced writes, optimistic UI, revision numbers, mutation IDs, retry and explicit save state.

## Undo/redo

Use commands such as addSection, removeSection, updateProps, moveSection, updateTheme and updateLocale. Prefer patch history rather than copying the full document for every keystroke.

## Preview

Desktop, tablet, mobile, locale, light/dark and reduced-motion modes.

## Validation states

Error = publish blocked.
Warning = publish allowed.
Suggestion = optional improvement.

## UX principle

The user edits content and design intent, not framework internals.
