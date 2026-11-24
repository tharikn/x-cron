# Template Engine

## Template package

Each template contains:
- templateId
- version
- category
- display metadata
- preview assets
- supported locales
- supported theme modes
- component manifest
- default site JSON
- token overrides
- responsive rules
- animation presets
- accessibility metadata
- compatibility range

## Separation

Template is presentation defaults.
Portfolio JSON is user content plus selected presentation configuration.
Renderer is the execution engine.

Never put business logic inside a template.

## Component registry

A component registry maps a safe component type and variant to:
- renderer
- prop schema
- accessibility contract
- supported children
- version compatibility

Only registered components can render.

## Template inheritance

Allow base template plus controlled token/section variations. Do not support arbitrary code inheritance.

## Lifecycle

draft -> QA -> approved -> published -> deprecated -> archived.

A published site keeps the exact template version it uses.

## Template switching

Switching templates creates a draft transformation:
1. Map semantic sections.
2. Preserve content IDs.
3. Apply target defaults.
4. Report unmapped sections.
5. Let user review.
6. Save new draft.

## Safety

Templates cannot execute arbitrary JavaScript, access secrets, read other tenants or call arbitrary external APIs.
