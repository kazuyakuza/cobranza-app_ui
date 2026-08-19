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
- [5. Design Tokens (Theme)](#5-design-tokens-theme)
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
- The Minimal Yet Warm theme (warm sand/cream/taupe + coral accents) (CSS variables + utility classes)
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
| **Theme** | Full Minimal Yet Warm design tokens + utility classes + optional SCSS mixins |
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

## 5. Design Tokens (Theme)

All tokens live under the `--cba-` prefix.

> **Note:** The palette is **Minimal Yet Warm** (warm sand/cream/taupe + controlled coral). Canvas `#BCB5A4` (darker warm sand floor, L* ~74), panel `#F2F0E8` (clearer cream, L* ~94), elevated `#FDFCF8` (near-white cream, L* ~99), inset `#D8C3A5` (warm sand, L* ~81). Canvas → panel ≈ 20 L\*, panel → elevated ≈ 5 L\*, panel → inset ≈ 13 L\*. Border is the primary separator; shadow is secondary depth. Three border levels (subtle `#E8E5DB`, default `#A29D94`, strong `#6B665E`) are deliberately distinct on cream/sand. Coral (`#E98074` soft, `#E85A4F` strong) is reserved for accent/status/focus — NOT for primary CTAs or large fills. Primary/secondary text pass WCAG AA on every intended surface. Muted text is RESTRICTED on the darker canvas (`#BCB5A4`, fails AA) AND on `--cba-bg-tertiary` (inset sand, fails AA) — use `--cba-text-secondary` on those surfaces.

```scss
:root {
  /* Backgrounds — warm Minimal-Yet-Warm surface scale (canvas → panel → elevated → inset) */
  --cba-bg-primary: #BCB5A4;
  --cba-bg-secondary: #F2F0E8;
  --cba-bg-tertiary: #D8C3A5;
  --cba-bg-elevated: #FDFCF8;
  --cba-bg-overlay: rgba(43, 38, 32, 0.45);

  /* Text — warm near-black/taupe; muted restricted on canvas and bg-tertiary (see header) */
  --cba-text-primary: #2B2620;
  --cba-text-secondary: #4A4640;
  --cba-text-muted: #625C55;
  --cba-text-inverse: #FDFCF8;

  /* Borders — three deliberately distinct levels on cream/sand.
     subtle = internal separators; default = structural edges; strong = chrome/outlines */
  --cba-border-subtle: #E8E5DB;
  --cba-border-default: #A29D94;
  --cba-border-strong: #6B665E;

  /* Accents — primary is warm taupe (NOT coral); coral reserved for status/focus */
  --cba-accent-primary: #6B5B4F;
  --cba-accent-success: #3E6B4F;
  --cba-accent-warning: #E98074;
  --cba-accent-danger: #B93E36;
  --cba-accent-info: #56717E;

  /* Interactive states — warm taupe overlays + warm coral focus ring */
  --cba-hover: rgba(43, 38, 32, 0.10);
  --cba-active: rgba(43, 38, 32, 0.18);
  --cba-hover-inverse: rgba(253, 252, 248, 0.12);
  --cba-active-inverse: rgba(253, 252, 248, 0.22);
  --cba-focus-ring: 0 0 0 3px rgba(232, 90, 79, 0.45);

  /* Selected — item actively chosen in a set. selected ≠ active(pressed) ≠ focus */
  --cba-selected-bg: #E4DDD0;
  --cba-selected-border: var(--cba-accent-primary);
  --cba-selected-text: var(--cba-text-primary);
  --cba-selected-hover: #D8CFC0;

  /* Form & control state tokens */
  --cba-state-invalid-border: #B93E36;
  --cba-state-invalid-text: #8B3028;
  --cba-state-valid-border: #3E6B4F;
  --cba-state-valid-text: #2E523C;
  --cba-state-disabled-bg: #E0DCD4;
  --cba-state-disabled-text: #9A958D;

  /* Layout (unchanged) */
  --cba-header-height: 56px;          /* Shell header */
  --cba-footer-height: 64px;          /* Shell footer */
  --cba-module-header-min-height: 40px;

  /* Radius (unchanged) */
  --cba-radius-sm: 6px;
  --cba-radius-md: 10px;
  --cba-radius-lg: 14px;

  /* Shadows — warm-tinted, softer than black. Border is primary separator; shadow secondary */
  --cba-shadow-module: 0 6px 24px rgba(43, 34, 28, 0.18);
  --cba-shadow-elevated: 0 10px 32px rgba(43, 34, 28, 0.26);

  /* Spacing (unchanged) */
  --cba-space-1: 4px;
  --cba-space-2: 8px;
  --cba-space-3: 12px;
  --cba-space-4: 16px;
  --cba-space-5: 20px;
  --cba-space-6: 24px;
  --cba-space-8: 32px;

  /* Typography scale — six steps paired with line-heights */
  --cba-font-size-display: 1.25rem;
  --cba-font-size-heading-lg: 1.125rem;
  --cba-font-size-heading-md: 1rem;
  --cba-font-size-body: 0.875rem;
  --cba-font-size-small: 0.8125rem;
  --cba-font-size-caption: 0.75rem;

  --cba-line-height-display: 1.2;
  --cba-line-height-heading-lg: 1.222;
  --cba-line-height-heading-md: 1.25;
  --cba-line-height-body: 1.5;
  --cba-line-height-small: 1.385;
  --cba-line-height-caption: 1.333;
}
```

**`--cba-text-muted` usage restriction:** `#625C55` passes WCAG AA 4.5:1 on `--cba-bg-secondary` (panel) and `--cba-bg-elevated` (cream). It is RESTRICTED on the darker canvas `--cba-bg-primary` (`#BCB5A4`, fails AA) AND on `--cba-bg-tertiary` (inset sand, fails AA). Prefer `--cba-text-secondary` on canvas and inset sand for lower-emphasis text.

**`--cba-hover-inverse` / `--cba-active-inverse` usage:** light overlays (`rgba(253, 252, 248, 0.12)` and `0.22`, hue matching `--cba-text-inverse`) applied via `background-image: linear-gradient(token, token)` over solid accent fills (`--cba-accent-primary`, `--cba-accent-danger`, `--cba-accent-success`) to make hover/active perceptible on dark backgrounds. The dark overlays (`--cba-hover`, `--cba-active`) remain for `secondary`/`ghost` which sit on light surfaces.

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

> **Authoritative token source:** Token values live ONLY in `src/theme/_variables.scss`. The `docs/USAGE.md` per-token table and `docs/THEME.md` are convenience views, NOT sources of truth. The Angular demo app at `projects/demo/` is the canonical visual reference, but it is a visual view, NOT a token source of truth. If any value diverges, `_variables.scss` wins and the docs/demo MUST be corrected in the same change. See §8.1 Token Change Checklist.

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

### 8.1 Token Change Checklist

Whenever a `--cba-*` token is **added, removed, renamed, or value-changed** in `src/theme/_variables.scss`, the author (human or AI agent) MUST verify every item below in the same change:

1. **`docs/THEME.md`** reflects the token name and value.
2. **`docs/CONSUMER_GUIDE.md`** reflects the token wherever it is referenced as a consumer-facing contract.
3. **`docs/USAGE.md`** per-token table is updated — or, if it duplicates `docs/THEME.md`, removed in favour of the single source.
4. **Every component SCSS file** that references the token (`src/components/**/*.scss`) still compiles (`npm run build`).
5. **`projects/demo/`** swatches / sections that display the token are updated to reflect the new value (the demo reads `var(--cba-*)` directly, so a `build:lib` + `build:demo` cycle regenerates the rendered output; no separate compile step is needed).
6. **`CHANGELOG.md`** records the token change under the current dated `[x.y.z] — YYYY-MM-DD` header (never under `[Unreleased]`).
7. **`context.md`** "Recent Changes" entry mentions the token name that changed.

If any item cannot be satisfied, the change is NOT ready to merge.

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
