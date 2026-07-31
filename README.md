<!-- AI Agent Note: This README is the primary entry point for consumers and AI agents.
     Structure: Overview → Installation → Quick Start → Components → Theme → Integration → Docs → Contributing.
     For detailed usage patterns and code examples, see /docs/USAGE.md.
     For project scope and design tokens, see .agent/project-info/brief.md. -->

# @cobranza-apps/ui

Shared Angular component library & intermediate-gray design system for the Cobranza App Company Back-office.

## Table of Contents

- [Overview](#overview)
- [Target Consumers](#target-consumers)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Development Commands](#development-commands)
- [Component Inventory](#component-inventory)
- [Design Tokens (Theme)](#design-tokens-theme)
- [Related Libraries](#related-libraries)
- [Integration Notes (Shell ↔ MFE)](#integration-notes-shell--mfe)
- [Documentation](#documentation)
- [Contributing & AI Agent Onboarding](#contributing--ai-agent-onboarding)
- [License](#license)

## Overview

`@cobranza-apps/ui` is the shared visual foundation for the Company Back-office Shell and every MFE. It provides a single source of truth for the intermediate-gray design system and removes duplicated UI effort.

**What this library provides:**

- **Layout primitives** — `ModuleHeader` and `ModuleContainer` for the floating workspace.
- **Theme** — Full intermediate-gray design tokens (CSS variables + utility classes + optional SCSS mixins).
- **Basic components** — `CbaButton`, `CbaCard`, `CbaBadge`, `CbaEmptyState`, `CbaSkeleton`, `CbaModal`.
- **Form controls** — Thin wrappers around Bootstrap / ng-bootstrap inputs, selects, and datepickers.
- **Icons** — Font Awesome Free (solid + regular) via `@fortawesome/angular-fontawesome`.
- **Directives** — Lightweight helpers (e.g., autofocus, click-outside) when needed.

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

Install peer dependencies separately (jQuery is never required). Exact versions are declared in `package.json`; use these major ranges:

| Package | Purpose |
| --- | --- |
| `@angular/core`, `@angular/common`, `@angular/forms` | Angular runtime (v22, standalone) |
| `bootstrap` | CSS-only framework (never jQuery) |
| `@ng-bootstrap/ng-bootstrap` | Forms & overlays (v21) |
| `@fortawesome/angular-fontawesome` | Icon rendering |
| `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-regular-svg-icons` | Icon packs (solid + regular) |

Install the major ranges declared in package.json peerDependencies: `@angular/core@^22`, `@angular/common@^22`, `@angular/forms@^22`, `bootstrap@^5`, `@ng-bootstrap/ng-bootstrap@^21`, plus the latest compatible `@fortawesome/angular-fontawesome` and icon packs.

## Quick Start

**1. Import the theme** in your global styles file:

```scss
/* global-styles.scss */
@use '@cobranza-apps/ui/theme';
```

> The theme is published as SCSS via the `./theme` package subpath (see `package.json` `exports`). `@use '@cobranza-apps/ui/theme'` is the supported global import. Loading the theme emits the `--cba-*` variables on `:root` and the opt-in `.cba-*` utility classes.

**2. Import components** in your Angular standalone component or module:

```ts
import { ModuleHeaderComponent, ModuleContainer, CbaButton } from '@cobranza-apps/ui';
```

For usage patterns and examples, see [`/docs/USAGE.md`](/docs/USAGE.md).

<!-- AI Agent Note: Component contracts (Inputs/Outputs) are defined in brief.md §6.
     When adding new components, update both the table below and brief.md §6. -->

## Development Commands

<!-- AI Agent Note: These commands are defined in package.json scripts.
     Run from the project root. Requires Node.js ^22.22.3 || ^24.15.0 || >=26.0.0. -->

| Command | Description |
| --- | --- |
| `npm run build` | Build the library via ng-packagr → outputs to `dist/` |
| `npm test` | Run Jest unit tests (`--passWithNoTests`) |
| `npm run lint` | Lint `src/**/*.ts` with ESLint (angular-eslint) |
| `npm run format` | Format source files with Prettier (TS, SCSS, CSS, JSON, MD) |

**Config files reference:**

| File | Purpose |
| --- | --- |
| `ng-package.json` | ng-packagr entry point (`src/public-api.ts`) and output (`dist/`) |
| `tsconfig.json` | Base TypeScript config (extended by lib and spec configs) |
| `tsconfig.lib.json` | Library build config — partial compilation, declarations |
| `tsconfig.spec.json` | Jest test config — CommonJS module, Jest types |
| `jest.config.js` | Jest config with jest-preset-angular CJS preset |
| `setup-jest.ts` | Angular Zone.js test environment bootstrap |
| `eslint.config.js` | Flat ESLint config (angular-eslint recommended) |
| `.prettierrc.json` | Prettier rules (100 char width, single quotes, LF) |

## Component Inventory

| Component | Description |
| --- | --- |
| `ModuleHeaderComponent` | Shell-injected header above each MFE module (title, size, collapse, fullscreen, status). |
| `ModuleContainer` | Wraps `ModuleHeader` + MFE content; handles size, collapse, padding, scroll. |
| `CbaButton` | Variants: primary, secondary, ghost, danger, success; sizes sm/md; loading; icon support. |
| `CbaCard` | Optional header & footer; no forced hover elevation. |
| `CbaBadge` | Semantic colours; solid/outline styles. |
| `CbaEmptyState` | Slots: icon, title, description, primary action. |
| `CbaSkeleton` | Variants: text, avatar, card, table-row, generic. |
| `CbaModal` | Thin wrapper around ng-bootstrap modal. |
| `CbaDropdown` | Thin wrapper around ng-bootstrap dropdown with themed menu surface. |
| `CbaPopover` | Thin wrapper around ng-bootstrap popover with themed window surface. |
| `CbaTypeahead` | Thin wrapper around ng-bootstrap typeahead with themed input and popup surface. |
| Form controls | Thin wrappers around ng-bootstrap/Bootstrap inputs, selects, datepickers. |

Full Input/Output contracts are in JSDoc and the [project brief](.agent/project-info/brief.md#6-core-components-proposal).

## Design Tokens (Theme)

Design tokens are published as SCSS via `@cobranza-apps/ui/theme` and use the `--cba-` prefix:

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

For the full token reference, see [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme-proposal) and the SCSS source files under `src/theme/`.

For a quick reference, see [`/docs/THEME.md`](/docs/THEME.md).

## Related Libraries

| Library | Role |
| --- | --- |
| `@cobranza-apps/ui` | Visual components + theme (this library) |
| `@cobranza-apps/entities` | Shared domain models (already on npm) |
| `@cobranza-apps/mfe-events` | Typed event contracts Shell ↔ MFE (not yet published) |

## Integration Notes (Shell ↔ MFE)

- The **Shell** uses `ModuleHeader` and `ModuleContainer` to host each remote MFE.
- Each **MFE** imports the theme and may use basic components.
- Resize / collapse / fullscreen state:
  - Shell → MFE via component `@Input()` bindings.
  - MFE → Shell via custom events defined in `@cobranza-apps/mfe-events`.
- This library emits **only pure UI events** from `ModuleHeader` (`collapseToggle`, `sizeToggle`, `remove`, `fullscreenToggle`). It never dispatches workspace or routing events.
- **Drag-and-drop is not part of this library** — it is owned by the Shell and `mfe-events`.

<!-- AI Agent Note: Keep this section updated when adding new documentation files.
     All docs should be linked from both README and brief.md §10. -->

## Documentation

- [`/docs/USAGE.md`](/docs/USAGE.md) — Patterns and examples for consuming the library.
- [`/docs/THEME.md`](/docs/THEME.md) — Theme import, tokens, and utility classes.
- [`/docs/MODULE_HEADER.md`](/docs/MODULE_HEADER.md) — `ModuleHeader` selector, API, status values, fullscreen & drag notes.
- [`/docs/MODULE_CONTAINER.md`](/docs/MODULE_CONTAINER.md) — `ModuleContainer` selector, API, size/collapse/fullscreen/padding behaviour, scroll & chrome notes.
- [`/docs/CBA_BUTTON.md`](/docs/CBA_BUTTON.md) — `CbaButton` selector, API, variant mapping, size options, loading/disabled behaviour.
- [`/docs/CBA_CARD.md`](/docs/CBA_CARD.md) — `CbaCard` selector, content projection slots, layout examples.
- [`/docs/CBA_BADGE.md`](/docs/CBA_BADGE.md) — `CbaBadge` selector, API, variant colours, solid vs outline.
- [`/docs/CBA_EMPTY_STATE.md`](/docs/CBA_EMPTY_STATE.md) — `CbaEmptyState` selector, content projection slots, usage example.
- [`/docs/CBA_SKELETON.md`](/docs/CBA_SKELETON.md) — `CbaSkeleton` selector, API, variant descriptions, usage examples.
- [`/docs/CBA_DROPDOWN.md`](/docs/CBA_DROPDOWN.md) — `CbaDropdown` selector, API, projection slots, theming, ng-bootstrap behavior notes.
- [`/docs/CBA_POPOVER.md`](/docs/CBA_POPOVER.md) — `CbaPopover` selector, API, projection slots, theming, ng-bootstrap behavior notes.
- [`/docs/CBA_TYPEAHEAD.md`](/docs/CBA_TYPEAHEAD.md) — `CbaTypeahead` selector, API, search function, formatters, theming, ng-bootstrap behavior notes.
- [Project brief](.agent/project-info/brief.md) — Source of truth for scope, design tokens, and component contracts.
- [Product info](.agent/project-info/product.md) — Product goals, target consumers, UX focus.
- [Architecture](.agent/project-info/architecture.md) — Build strategy, folder layout, integration patterns.
- [Tech stack](.agent/project-info/tech.md) — Exact versions, dependencies, tooling constraints.
- JSDoc on every public `@Input()`, `@Output()`, and component class.

<!-- AI Agent Note: Before contributing, read AGENTS.md and .agent/project-info/ files.
     Follow workflows in .agent/WORKFLOWS.md and rules in .kilo/rules/. -->

## Contributing & AI Agent Onboarding

Review [AGENTS.md](AGENTS.md) and the project info files under `.agent/project-info/` before making changes.

## License

**License: Proprietary — © <company>. See `LICENSE`.**

> TODO: Confirm license terms with the maintainer. This is a placeholder until a `LICENSE` file is added.
