<!--
  FILE: product.md — Product Info
  PURPOSE: Defines the problem, product goals, target consumers, scope, UX focus, and accessibility goals for @cobranza-apps/ui.
  AUDIENCE: AI agents, product managers, and developers.
  RELATIONSHIPS:
    - brief.md — source of truth for scope, tokens, and component specs.
    - context.md — current work status and next steps.
    - architecture.md — build strategy, public API, integration patterns.
    - tech.md — exact versions, dependencies, tooling constraints.
  MAINTENANCE: Update when product goals, scope, or UX priorities change.
-->

# @cobranza-apps/ui — Product Info

## Problem Definition

The Company Back-office Shell hosts multiple MFEs. Each team independently implements visual components and theme tokens, causing duplicated effort, inconsistent intermediate-gray rendering, and no single source of truth for shared UI.

## Product Goals

- Provide a calm, professional gray design system via `--cba-` CSS custom properties.
- Ship reusable layout primitives (`ModuleHeader`, `ModuleContainer`) for the floating workspace.
- Keep Bootstrap 5 / ng-bootstrap wrappers thin and business-logic-free.
- Encapsulate the theme so each consumer controls its own import.

## Target Consumers

- **Library consumers** — Shell and MFE teams that depend on `@cobranza-apps/ui` for visual primitives and theme.
- **End users** — Back-office operators using the Shell-hosted interface (desktop-only).

## Scope

### In Scope

- Layout primitives: `ModuleHeader`, `ModuleContainer`.
- Basic components: `CbaButton`, `CbaCard`, `CbaBadge`, `CbaEmptyState`, `CbaSkeleton`.
- Overlays & forms: `CbaModal` (thin ng-bootstrap wrapper), basic Input / Select / Datepicker wrappers.
- Theme: full intermediate gray design tokens plus utility classes and optional SCSS mixins.
- Directives: lightweight helpers (e.g. autofocus, click-outside) if needed.
- Icons: Font Awesome Free (solid + regular) via `@fortawesome/angular-fontawesome`.

### Out of Scope

- Business logic or domain entities.
- Communication with BFF or any backend.
- Advanced data tables (future dedicated `mfe-table` or specialized component).
- Drag & Drop (owned by the Shell).
- Workspace state / persistence (owned by the Shell).
- Mobile / responsive layouts (desktop-first and desktop-only for now).

## UX Focus

- **Modern professional, calm, friendly** — not classic rigid corporate
- **Order and clarity** without feeling cold or aggressive.
- **Balanced spacing** — neither sparse empty regions nor cramped density.
- **High readability** with strong contrast and clear hierarchy.
- **Desktop-only** — no mobile considerations for now.
- **Encapsulated theme** — each consumer imports and controls the theme; prefer ViewEncapsulation.
- **Thin wrappers first** — start simple, extend only when needed.

## Accessibility Goals

- WCAG AA readability target.
- Visible focus rings via `--cba-focus-ring`.
- Meaningful `aria-*` attributes on interactive `ModuleHeader` controls.
- Keyboard-operable buttons.

## Cross-Reference

- [Project Brief](brief.md) — source of truth for scope, tokens, and component specs.
- [Context](context.md) — current work status, recent changes, next steps.
- [Architecture](architecture.md) — build strategy, public API, integration patterns.
- [Tech Stack](tech.md) — exact versions, dependencies, tooling constraints.
