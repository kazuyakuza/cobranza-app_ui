# @cobranza-apps/ui — Product Info

## Problem Definition

The Company Back-office consists of a Shell hosting multiple Micro-frontends (MFEs). Each team (Shell and MFE) independently implements visual components and theme tokens, causing:

- Duplicated effort across teams for common UI primitives.
- Inconsistent intermediate-gray theme rendering across back-office modules.
- Lack of a single source of truth for shared UI, eroding visual coherence.

## Product Goals

- Provide a coherent, calm, professional gray design system via `--cba-` CSS custom properties.
- Ship reusable layout primitives (`ModuleHeader`, `ModuleContainer`) tailored to the floating workspace pattern.
- Keep wrappers thin and low-coupling around Bootstrap 5 / ng-bootstrap — no business logic leaks into the library.
- Encapsulate the theme so each consumer (Shell or MFE) controls import and avoids global style conflicts.

## Target Consumers

Two distinct layers:

1. **Library consumers** — Company Back-office **Shell** team and every **MFE** team. They depend on `@cobranza-apps/ui` for visual primitives and theme.
2. **End users** — Back-office operators using the Shell-hosted interface. Desktop-only, desktop-first.

## Scope

### In Scope

- Layout primitives: `ModuleHeader`, `ModuleContainer`.
- Basic components: `CbaButton`, `CbaCard`, `CbaBadge`, `CbaEmptyState`, `CbaSkeleton`.
- Overlays & forms: `CbaModal` (thin ng-bootstrap wrapper), basic Input / Select / Datepicker wrappers.
- Theme: full intermediate gray design tokens plus utility classes and optional SCSS mixins.
- Directives: lightweight helpers (e.g. autofocus, click-outside).
- Icons: Font Awesome Free (solid + regular) via `@fortawesome/angular-fontawesome`.

### Out of Scope

- Business logic or domain entities.
- Communication with BFF or any backend.
- Advanced data tables (future dedicated `mfe-table` or specialized component).
- Drag & Drop (owned by the Shell).
- Workspace state / persistence (owned by the Shell).
- Mobile / responsive layouts (desktop-first and desktop-only).

## UX Focus

- **Modern professional, calm, friendly** — not classic rigid corporate.
- **Order and clarity** without feeling cold or aggressive.
- **Balanced spacing** — neither sparse empty regions nor cramped density.
- **High readability** with strong contrast and clear hierarchy.
- **Desktop-only** — no mobile considerations for now.
- **Encapsulated theme** — each consumer imports and controls the theme; prefer `ViewEncapsulation.Emulated`.
- **Thin wrappers first** — start simple, extend only when needed.

## Accessibility Goals

- WCAG AA target for readability (high contrast text and interactive elements).
- Visible focus rings using `--cba-focus-ring`.
- Meaningful `aria-*` attributes on interactive `ModuleHeader` controls.
- Keyboard-operable buttons.

## Cross-Reference

- [Project Brief](brief.md) — source of truth for scope, tokens, and component specs.
- [Architecture](architecture.md) — build strategy, public API, integration patterns.
- [Tech Stack](tech.md) — exact versions, dependencies, tooling constraints.
