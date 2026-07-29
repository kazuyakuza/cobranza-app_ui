# @cobranza-apps/ui

Shared Angular component library & intermediate-gray design system for the Cobranza App Company Back-office.

## Table of Contents

- [Overview](#overview)
- [Target Consumers](#target-consumers)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Component Inventory](#component-inventory)
- [Design Tokens (Theme)](#design-tokens-theme)
- [Related Libraries](#related-libraries)
- [Integration Notes (Shell ↔ MFE)](#integration-notes-shell--mfe)
- [Documentation](#documentation)
- [Contributing & AI Agent Onboarding](#contributing--ai-agent-onboarding)
- [License](#license)

## Overview

`@cobranza-apps/ui` provides a shared visual foundation for all Company Back-office applications — the Shell and every Micro-frontend (MFE). It eliminates duplicated UI effort and establishes a single source of truth for the intermediate-gray design system.

**What this library provides:**

- **Layout primitives** — `ModuleHeader` and `ModuleContainer` for the floating workspace.
- **Theme** — Full intermediate-gray design tokens (CSS variables + utility classes + optional SCSS mixins).
- **Basic components** — `CbaButton`, `CbaCard`, `CbaBadge`, `CbaEmptyState`, `CbaSkeleton`, `CbaModal`.
- **Form controls** — Thin wrappers around Bootstrap / ng-bootstrap inputs, selects, and datepickers.
- **Icons** — Font Awesome Free (solid + regular) via `@fortawesome/angular-fontawesome`.

**What this library is NOT:**

- No business logic or domain entities.
- No BFF communication or backend calls.
- No advanced data tables (future dedicated component).
- No drag-and-drop (owned by the Shell).
- No workspace state or persistence (owned by the Shell).
- No mobile / responsive layouts (desktop-only for now).

## Target Consumers

- **Shell developers** — host MFEs using `ModuleHeader` and `ModuleContainer`, import the encapsulated theme.
- **MFE developers** — import the theme and use basic components (`CbaButton`, `CbaCard`, etc.).
- **End users** — Back-office operators using the Shell-hosted interface (desktop-only).

## Installation

```sh
npm install @cobranza-apps/ui
```

Consumers must also install peer dependencies (never jQuery). Exact versions are declared as `peerDependencies` in `package.json`; install the following major ranges:

| Package | Purpose |
| --- | --- |
| `@angular/core`, `@angular/common`, `@angular/forms` | Angular runtime (v22, standalone) |
| `bootstrap` | CSS-only framework (never jQuery) |
| `@ng-bootstrap/ng-bootstrap` | Forms & overlays (v21) |
| `@fortawesome/angular-fontawesome` | Icon rendering |
| `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-regular-svg-icons` | Icon packs (solid + regular) |

## Quick Start

**1. Import the theme** in your global styles file:

```scss
/* global-styles.scss */
@use '@cobranza-apps/ui/theme';
```

> The exact import path is tentative until the library build is finalized (see `package.json`). This is the canonical intended form.

**2. Import components** in your Angular standalone component or module:

```ts
import { ModuleHeader, ModuleContainer, CbaButton } from '@cobranza-apps/ui';
```

For full usage patterns and examples, see the [planned `/docs/USAGE.md`](#documentation).

## Component Inventory

| Component | Description |
| --- | --- |
| `ModuleHeader` | Shell-injected header above each MFE module (title, size, collapse, fullscreen, status). |
| `ModuleContainer` | Wraps `ModuleHeader` + MFE content; handles size, collapse, padding, scroll. |
| `CbaButton` | Variants: primary, secondary, ghost, danger, success; sizes sm/md; loading; icon support. |
| `CbaCard` | Optional header & footer; no forced hover elevation. |
| `CbaBadge` | Semantic colours; solid/outline styles. |
| `CbaEmptyState` | Slots: icon, title, description, primary action. |
| `CbaSkeleton` | Variants: text, avatar, card, table-row, generic. |
| `CbaModal` | Thin wrapper around ng-bootstrap modal. |
| Form controls | Thin wrappers around ng-bootstrap/Bootstrap inputs, selects, datepickers. |

Full Input/Output contracts for each component are documented inline via JSDoc and in the [project brief](.agent/project-info/brief.md#6-core-components-proposal).

## Design Tokens (Theme)

All design tokens live under the `--cba-` prefix and are published as SCSS via `@cobranza-apps/ui/theme`. Token categories:

- **Backgrounds**: primary, secondary, tertiary, elevated, overlay
- **Text**: primary, secondary, muted, inverse
- **Borders**: subtle, default, strong
- **Accents**: primary, success, warning, danger, info
- **Interactive states**: hover, active, focus-ring
- **Layout constants**: header height, footer height, module header min-height
- **Radius**: sm (6px), md (10px), lg (14px)
- **Shadows**: module, elevated (applied only when not fullscreen)
- **Spacing scale**: 4px–32px (`--cba-space-1` through `--cba-space-8`)

**Typography**: Inter (system-ui fallback), base 14px, line-height 1.5, headings weight 500–600.

**Utility classes** (examples):

- `.cba-bg-primary`, `.cba-bg-secondary`, `.cba-bg-tertiary`
- `.cba-text-primary`, `.cba-text-secondary`, `.cba-text-muted`

For the full token reference, see [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme-proposal) and the SCSS source files under `src/lib/theme/`.

## Related Libraries

| Library | Role |
| --- | --- |
| `@cobranza-apps/ui` | Visual components + theme (this library) |
| `@cobranza-apps/entities` | Shared domain models (already on npm) |
| `@cobranza-apps/mfe-events` | Typed event contracts Shell ↔ MFE (not yet published) |

## Integration Notes (Shell ↔ MFE)

- The **Shell** imports the library and uses `ModuleHeader` + `ModuleContainer` to host every remote MFE.
- Each **MFE** imports the encapsulated theme and may use basic components.
- Resize / collapse / fullscreen state:
  - Shell → MFE via component `@Input()` bindings.
  - MFE → Shell via custom events defined in `@cobranza-apps/mfe-events`.
- This library emits **only pure UI events** from `ModuleHeader` (`collapseToggle`, `sizeToggle`, `remove`, `fullscreenToggle`). It never dispatches workspace or routing events.
- **Drag-and-drop is not part of this library** — it is owned by the Shell and `mfe-events`.

## Documentation

- `/docs/USAGE.md` — Patterns and examples for consuming the library (planned, see step 4.4).
- [Project brief](.agent/project-info/brief.md) — Source of truth for scope, design tokens, and component contracts.
- JSDoc on every public `@Input()`, `@Output()`, and component class.

## Contributing & AI Agent Onboarding

This project follows the workflows defined in [AGENTS.md](AGENTS.md) and the [Critical Workflow](.kilo/commands/critical-workflow.md). AI agents and contributors should review these before making changes. The project info files under `.agent/project-info/` are the source of truth for scope, architecture, tech stack, and status.

## License

**License: Proprietary — © Cobranza App Company. All rights reserved.** See `LICENSE`.

> TODO: Confirm license terms with the maintainer. This is a placeholder until a `LICENSE` file is added.
