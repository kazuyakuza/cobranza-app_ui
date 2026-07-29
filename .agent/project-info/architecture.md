<!--
  FILE: architecture.md — Architecture
  PURPOSE: Documents the high-level architecture, folder layout, build strategy, public API strategy, theme encapsulation, and integration patterns for @cobranza-apps/ui.
  AUDIENCE: AI agents, architects, and developers.
  RELATIONSHIPS:
    - brief.md — source of truth for tokens and component specifications.
    - product.md — product goals, target consumers, UX focus.
    - context.md — current work status and next steps.
    - tech.md — exact versions, dependencies, tooling constraints.
  MAINTENANCE: Update when architecture decisions change (e.g., entry points, build tooling, integration patterns).
-->

# @cobranza-apps/ui — Architecture

## High-Level Architecture

`@cobranza-apps/ui` is a single publishable Angular library consumed by the Shell and each MFE in the Company Back-office.

- **Standalone components only** — no NgModules.
- One public entry point (`src/lib/public-api.ts`) re-exporting all components, theme, and directives.
- Built via `ng-packagr` into `dist/`.

## Folder / Layout

```
src/lib/
  components/   - module-header, module-container, button, card, badge, empty-state, skeleton, modal, ...
  theme/        - variables, utilities, mixins, theme.scss
  directives/   - autofocus, click-outside, ...
  public-api.ts
```

Concrete folder creation happens in Task 3; this file documents the intended structure.

## Build Strategy

- `ng-packagr` configured via `ng-package.json` points to `src/lib/public-api.ts`.
- Output directory: `dist/`.
- Concrete config created in Task 4.

## Public API Strategy

- **Now**: single barrel `public-api.ts` re-exports all public components, directives, and theme.
- **Later**: secondary entry points (`@cobranza-apps/ui/button`, `@cobranza-apps/ui/theme`) if bundle size becomes an issue.

## Theme Encapsulation

- Theme uses SCSS + CSS variables under the `--cba-` prefix.
- Published as importable SCSS; consumers explicitly import what they need.
- Components use `ViewEncapsulation.Emulated` by default.
- Global styles only when strictly necessary.
- Token categories (backgrounds, text, borders, accents, interactive states, layout constants, radius, shadows, spacing) are defined in [brief.md](brief.md) section 5.

## Integration Patterns (Shell ↔ MFE)

- **Shell** imports the library; uses `ModuleHeader` + `ModuleContainer` to host each remote MFE.
- **Each MFE** also imports the encapsulated theme and may use basic components (`CbaButton`, `CbaBadge`, etc.).
- Resize/collapse/fullscreen state:
  - Shell → MFE via component `@Input()` bindings.
  - MFE → Shell via custom events defined in `@cobranza-apps/mfe-events` (not yet published — open dependency).
- This library emits **only pure UI events** from `ModuleHeader` (`collapseToggle`, `sizeToggle`, `remove`, `fullscreenToggle`); it never dispatches workspace or routing events.
- **Drag & Drop does NOT belong in this library** — owned by Shell + `mfe-events`.

## Component Contracts

### ModuleHeader

Inputs: `title`, `size`, `isCollapsed`, `isFullscreen`, `status`.  
Outputs: `collapseToggle`, `sizeToggle`, `remove`, `fullscreenToggle`.  
Minimum height: 40px.

### ModuleContainer

Inputs: `size`, `isCollapsed`, `isFullscreen`, `padding`.  
Responsibilities: apply size classes, hide body on collapse, apply border-radius + shadow when not fullscreen, provide internal scroll.

### Other Components

`CbaButton`, `CbaCard`, `CbaBadge`, `CbaEmptyState`, `CbaSkeleton`, `CbaModal`, and thin form-control wrappers. Details per brief.md section 6.3.

## Related Libraries

| Library | Role |
| --- | --- |
| `@cobranza-apps/entities` | Shared domain models (already on npm) |
| `@cobranza-apps/mfe-events` | Typed event contracts Shell ↔ MFE (not yet published) |

## Cross-Reference

- [Project Brief](brief.md) — source of truth for tokens and component specifications.
- [Product Info](product.md) — product goals, UX focus, target consumers.
- [Context](context.md) — current work status, recent changes, next steps.
- [Tech Stack](tech.md) — exact versions, dependencies, tooling constraints.
