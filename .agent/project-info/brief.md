<!--
  FILE: brief.md — Project Brief (source of truth)
  PURPOSE: Defines scope, design tokens, component specs, design principles, and integration notes for @cobranza-apps/ui.
  AUDIENCE: AI agents, architects, and developers.
  RELATIONSHIPS:
    - product.md  — product goals, target consumers, UX focus.
    - context.md  — current work status, recent changes, next steps.
    - architecture.md — build strategy, folder layout, integration patterns.
    - tech.md     — exact versions, dependencies, tooling constraints.
  MAINTENANCE: Update this file when scope, tokens, or component contracts change. Keep other files consistent.
-->

# @cobranza-apps/ui — Project Brief

**Target consumers:** Company Back-office Shell + all Micro-frontends (MFEs)

## Table of Contents

- [1. Purpose](#1-purpose)
- [2. Scope](#2-scope)
- [3. Design Principles](#3-design-principles)
- [4. Technical Stack](#4-technical-stack)
- [5. Design Tokens (Theme)](#5-design-tokens-theme-proposal)
- [6. Core Components](#6-core-components-proposal)
- [7. Library Structure](#7-library-structure-suggested)
- [8. Integration Notes](#8-integration-notes)
- [9. Accessibility & Quality](#9-accessibility--quality)
- [10. Documentation Expectations](#10-documentation-expectations)
- [11. Related Libraries](#11-some-related-libraries)
- [Cross-Reference](#cross-reference)

## 1. Purpose

`@cobranza-apps/ui` is the shared Angular component library and design-system (theme) for the Cobranza App **Company Back-office**.

It provides:

- Reusable visual components
- The intermediate gray theme (CSS variables + utility classes)
- Layout primitives specific to the floating workspace (`ModuleHeader`, `ModuleContainer`)
- Thin wrappers around Bootstrap / ng-bootstrap for forms and overlays

It does **not** contain business logic, BFF communication, advanced tables, drag-and-drop, or workspace state management.

## 2. Scope

### 2.1 In scope

| Category | Items |
| ---------- | ------- |
| **Layout primitives** | `ModuleHeader`, `ModuleContainer` |
| **Basic components** | `CbaButton`, `CbaCard`, `CbaBadge`, `CbaEmptyState`, `CbaSkeleton` |
| **Overlays & forms** | `CbaModal` (thin ng-bootstrap wrapper), basic Input / Select / Datepicker wrappers |
| **Theme** | Full intermediate gray design tokens + utility classes + optional SCSS mixins |
| **Directives** | Lightweight helpers (e.g. autofocus, click-outside) if needed |
| **Icons** | Font Awesome Free (solid + regular) via `@fortawesome/angular-fontawesome` |

### 2.2 Out of scope

- Business logic or domain entities
- Communication with BFF or any backend
- Advanced data tables (future dedicated `mfe-table` or specialized component)
- Drag & Drop (owned by the Shell)
- Workspace state / persistence (owned by the Shell)
- Mobile / responsive layouts (desktop-first and desktop-only for now)

## 3. Design Principles

- **Modern professional, calm, friendly** — not classic rigid corporate.
- **Order and clarity** without feeling cold or aggressive.
- **Balanced spacing** — neither sparse empty regions nor cramped density.
- **High readability** — strong contrast, clear hierarchy.
- **Desktop-only** — No mobile considerations for now.
- **Encapsulated theme** — each consumer (Shell or MFE) imports the theme; prefer ViewEncapsulation.
- **Thin wrappers first** — start simple, extend only when needed.

## 4. Technical Stack

| Technology | Version / Choice | Notes |
| ------------ | ------------------ | ------- |
| Angular | **22** | Latest active release (July 2026) |
| Components | Standalone only | No NgModules |
| UI framework | Bootstrap 5 + **@ng-bootstrap/ng-bootstrap** (v21) | Preferred over ngx-bootstrap |
| Icons | Font Awesome Free + `@fortawesome/angular-fontawesome` | solid + regular packs |
| Styling | CSS Variables + SCSS + utility classes | Optional small set of SCSS mixins |
| Build | Angular library (`ng-packagr`) | Single public entry point initially |
| Testing | Jest (unit) where useful | Manual QA first; Playwright later |
| Documentation | JSDoc + README + USAGE.md | No Storybook required for now |

**Peer dependencies (expected):**

- `@angular/core`, `@angular/common`, `@angular/forms`
- `bootstrap` (CSS) => NEVER JQUERY!
- `@ng-bootstrap/ng-bootstrap`
- `@fortawesome/angular-fontawesome` + free icon packs

## 5. Design Tokens (Theme) (Proposal)

All tokens live under the `--cba-` prefix.

```scss
:root {
  /* Backgrounds */
  --cba-bg-primary: #2a2d32;
  --cba-bg-secondary: #34383e;
  --cba-bg-tertiary: #3e434a;
  --cba-bg-elevated: #454a52;
  --cba-bg-overlay: rgba(0, 0, 0, 0.55);

  /* Text */
  --cba-text-primary: #e8eaed;
  --cba-text-secondary: #b0b4ba;
  --cba-text-muted: #8b9098;
  --cba-text-inverse: #1a1d21;

  /* Borders */
  --cba-border-subtle: #4a4f57;
  --cba-border-default: #5a606a;
  --cba-border-strong: #6b7280;

  /* Accents */
  --cba-accent-primary: #3b82f6;
  --cba-accent-success: #22c55e;
  --cba-accent-warning: #f59e0b;
  --cba-accent-danger: #ef4444;
  --cba-accent-info: #06b6d4;

  /* Interactive states */
  --cba-hover: rgba(255, 255, 255, 0.06);
  --cba-active: rgba(255, 255, 255, 0.10);
  --cba-focus-ring: 0 0 0 3px rgba(59, 130, 246, 0.45);

  /* Layout constants */
  --cba-header-height: 56px;          /* Shell header */
  --cba-footer-height: 64px;          /* Shell footer */
  --cba-module-header-min-height: 40px;

  /* Radius */
  --cba-radius-sm: 6px;
  --cba-radius-md: 10px;
  --cba-radius-lg: 14px;

  /* Shadows (applied only when module is NOT fullscreen) */
  --cba-shadow-module: 0 4px 16px rgba(0, 0, 0, 0.28);
  --cba-shadow-elevated: 0 8px 24px rgba(0, 0, 0, 0.35);

  /* Spacing scale (balanced) */
  --cba-space-1: 4px;
  --cba-space-2: 8px;
  --cba-space-3: 12px;
  --cba-space-4: 16px;
  --cba-space-5: 20px;
  --cba-space-6: 24px;
  --cba-space-8: 32px;
}
```

**Typography**

- Primary font: Inter (with system-ui fallback)
- Base size: 14px
- Line-height: 1.5
- Headings: weight 500–600

**Utility classes** (examples)

- Background: `.cba-bg-primary`, `.cba-bg-secondary`, `.cba-bg-tertiary`
- Text: `.cba-text-primary`, `.cba-text-secondary`, `.cba-text-muted`
- Spacing helpers and common layout utilities as needed

Theme is published as SCSS and can be imported by Shell and every MFE. Prefer encapsulation; global styles only when strictly necessary.

## 6. Core Components (Proposal)

### 6.1 ModuleHeader

Injected by the Shell above each MFE module.

#### Inputs

| Name | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `title` | `string` | `''` | Module title (defined by the MFE logic) |
| `size` | `'50%' \| '100%'` | `'100%'` | Current width mode |
| `isCollapsed` | `boolean` | `false` | Whether the module body is collapsed |
| `isFullscreen` | `boolean` | `false` | Whether the module is shown in fullscreen view |
| `status` | `'loading' \| 'loaded' \| 'success' \| 'warning' \| 'error' \| 'dirty' \| null` | `null` | Optional status indicator |

#### Status semantics

| Value | Visual | Typical use |
| ------- | -------- | ------------- |
| `loading` | Spinner | Data loading / ongoing operation |
| `loaded` | Check | Data ready (no explicit save) |
| `success` | Stronger success indicator | Explicit save / submit succeeded |
| `warning` | Warning icon | Soft validation / incomplete data |
| `error` | Error icon | Load failure or hard validation error |
| `dirty` | Subtle indicator (dot / pencil) | Unsaved changes present |
| `null` | Nothing | Normal state |

#### Outputs

| Name | Payload | Description |
| ------ | --------- | ------------- |
| `collapseToggle` | `void` | User clicked collapse / expand |
| `sizeToggle` | `'50%' \| '100%'` | User requested size change |
| `remove` | `void` | User requested to remove the module |
| `fullscreenToggle` | `void` | User requested fullscreen |

> **Note:** Drag-handle and `dragStart` do **not** live in this library. Drag & drop contracts belong to `@cobranza-apps/mfe-events` and the Shell, both to be implemented later.

#### Visual behaviour

- **Collapsed:** collapse button becomes expand; all other buttons remain.
- **Fullscreen:** only the title is shown. Back navigation btn lives in the Shell header; “Workbench” button lives in the Shell footer.
- **50% ↔ 100%:** the size-toggle button reflects the *current* opposite action; other buttons stay visible.
- Layout structure:
  - Left: status icon section (fixed width, top-aligned)
  - Center: title (flex-grow, can increase height so the full title is always visible)
  - Right: action buttons (fixed size, always top-right)
- Title is **never** editable from the header.

**Height:** minimum 40 px; can grow when the title needs more vertical space.

### 6.2 ModuleContainer

Wrapper that holds `ModuleHeader` + the MFE content.

#### Inputs

| Name | Type | Default | Description |
| ------ | ------ | --------- | ------------- |
| `size` | `'50%' \| '100%'` | `'100%'` | Width mode |
| `isCollapsed` | `boolean` | `false` | Hides body when true |
| `isFullscreen` | `boolean` | `false` | Fullscreen mode |
| `padding` | `'none' \| 'sm' \| 'md'` | `'sm'` | Internal padding (configurable) |

#### Responsibilities

- Apply size classes (50 % / 100 %)
- Handle collapsed state (body not rendered / not visible)
- Apply border-radius + shadow **only when not fullscreen**
- Provide internal scroll when expanded
- Preferred scrollbar: thin by default, larger thumb on hover, optional top/bottom jump buttons

Scroll exists only while the module is expanded. Outside the container the workspace (Shell) handles scrolling.

### 6.3 Other Proposed Components

| Component | Notes |
| ----------- | ------- |
| `CbaButton` | Variants: `primary`, `secondary`, `ghost`, `danger`, `success`. Sizes: `sm` / `md`. Loading state. Icon support. |
| `CbaCard` | Optional header & footer (configurable). No forced hover elevation. |
| `CbaBadge` | Semantic colours + solid / outline styles. |
| `CbaEmptyState` | Slots: icon, title, description, primary action. |
| `CbaSkeleton` | Variants: `text`, `avatar`, `card`, `table-row`, plus generic. `table-row` is a simple multi-cell placeholder useful while any table (including future `mfe-table`) loads data. |
| `CbaModal` | Thin wrapper around ng-bootstrap modal. |
| Form controls | Thin wrappers around ng-bootstrap / Bootstrap inputs, selects, datepickers. |

## 7. Library Structure (suggested)

```text
ui/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── module-header/
│   │   │   ├── module-container/
│   │   │   ├── button/
│   │   │   ├── card/
│   │   │   ├── badge/
│   │   │   ├── empty-state/
│   │   │   ├── skeleton/
│   │   │   ├── modal/
│   │   │   └── ...
│   │   ├── theme/
│   │   │   ├── _variables.scss
│   │   │   ├── _utilities.scss
│   │   │   ├── _mixins.scss          # optional
│   │   │   └── theme.scss
│   │   ├── directives/
│   │   └── public-api.ts             # single entry point (until there are more public things to export)
│   └── ...
├── package.json
├── README.md
├── docs/
│   ├── ...
│   └── USAGE.md                      # patterns & examples for developers / AI agents
└── ng-package.json
```

### Public API strategy

- For now: single `public-api.ts` that re-exports everything needed.
- Later (if bundle size becomes an issue): secondary entry points (`@cobranza-apps/ui/button`, `@cobranza-apps/ui/theme`, etc.).

## 8. Integration Notes

- The **Shell** imports the library and uses `ModuleHeader` + `ModuleContainer` to host every remote MFE.
- Each **MFE** also imports the theme (encapsulated) and may use the basic components.
- Communication of resize / collapse / fullscreen state between Shell and MFE is handled via:
  - Component inputs (Shell → MFE)
  - Custom events defined in `@cobranza-apps/mfe-events` (MFE → Shell)
- This library never dispatches workspace or routing events itself; it only emits pure UI events from `ModuleHeader`.

## 9. Accessibility & Quality

- High contrast text and interactive elements (WCAG AA target for readability).
- Visible focus rings using `--cba-focus-ring`.
- Meaningful `aria-*` attributes on interactive controls of `ModuleHeader`.
- Keyboard operable buttons.

## 10. Documentation Expectations

- Clear JSDoc on every public `@Input()`, `@Output()`, and component.
- /docs files, linked to `README.md` and related files, with installation, theme import, and quick-start examples.
- `USAGE.md` (or equivalent) describing recommended patterns so both humans and AI agents can consume the library correctly.
- No Storybook required for now.

## 11. (Some) Related Libraries

| Library | Role |
| --------- | ------ |
| `@cobranza-apps/ui` | Visual components + theme (this brief) |
| `@cobranza-apps/entities` | Shared domain models (already exists on npm) |
| `@cobranza-apps/mfe-events` | Typed event contracts Shell ↔ MFE (no runtime logic) (not available yet) |

## Cross-Reference

- [Product Info](product.md) — product goals, target consumers, UX focus.
- [Context](context.md) — current work status, recent changes, next steps.
- [Architecture](architecture.md) — build strategy, folder layout, integration patterns.
- [Tech Stack](tech.md) — exact versions, dependencies, tooling constraints.

<!-- DO NOT DELETE NEXT SECTION -->

## Important Note for AI Agents

All agents working on this project MUST adhere to the workflows and rules outlined in [AI Agent Onboarding document](../../AGENTS.md).

Before starting any task:

1. **Review `AGENTS.md`**: is the primary source of instructions for agents.
2. **Follow Workflows**: follow the procedures defined in `.agent/WORKFLOWS.md`, especially the `.kilo/commands/critical-workflow.md`.

<!-- END DO NOT DELETE -->
