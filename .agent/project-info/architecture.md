# @cobranza-apps/ui — Architecture

## High-Level Architecture

`@cobranza-apps/ui` is a single publishable Angular library consumed by the Shell and each MFE in the Company Back-office.

- **Standalone components only** — no NgModules.
- One public entry point (`src/lib/public-api.ts`) re-exporting all components, theme, and directives.
- Built via `ng-packagr` into `dist/`.

## Folder / Layout

```
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
│   │   │   ├── _mixins.scss
│   │   │   └── theme.scss
│   │   ├── directives/
│   │   └── public-api.ts
│   └── ...
├── package.json
├── README.md
├── docs/
│   ├── ...
│   └── USAGE.md
└── ng-package.json
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
- Token categories (refer to [brief.md](brief.md) section 5 for exact values):
  - Backgrounds (`--cba-bg-*`), text (`--cba-text-*`), borders (`--cba-border-*`)
  - Accents (`--cba-accent-*`), interactive states (`--cba-hover`, `--cba-active`, `--cba-focus-ring`)
  - Layout constants (`--cba-header-height`, `--cba-module-header-min-height`, etc.)
  - Radius (`--cba-radius-*`), shadows (`--cba-shadow-*`), spacing scale (`--cba-space-*`)
- Primary font: Inter (system-ui fallback), base size 14px, line-height 1.5.

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

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `''` | Module title (defined by MFE logic) |
| `size` | `'50%' \| '100%'` | `'100%'` | Current width mode |
| `isCollapsed` | `boolean` | `false` | Whether module body is collapsed |
| `isFullscreen` | `boolean` | `false` | Whether module is fullscreen |
| `status` | `'loading' \| 'loaded' \| 'success' \| 'warning' \| 'error' \| 'dirty' \| null` | `null` | Optional status indicator |

| Output | Payload | Description |
| --- | --- | --- |
| `collapseToggle` | `void` | User clicked collapse / expand |
| `sizeToggle` | `'50%' \| '100%'` | User requested size change |
| `remove` | `void` | User requested to remove the module |
| `fullscreenToggle` | `void` | User requested fullscreen |

Minimum height: 40px. Visual behaviour per brief section 6.1.

### ModuleContainer

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'50%' \| '100%'` | `'100%'` | Width mode |
| `isCollapsed` | `boolean` | `false` | Hides body when true |
| `isFullscreen` | `boolean` | `false` | Fullscreen mode |
| `padding` | `'none' \| 'sm' \| 'md'` | `'sm'` | Internal padding |

Responsibilities: apply size classes, hide body on collapse, apply border-radius + shadow only when not fullscreen, provide internal scroll when expanded.

### Other Components

- `CbaButton`: variants `primary`, `secondary`, `ghost`, `danger`, `success`; sizes `sm` / `md`; loading state; icon support.
- `CbaCard`: optional header & footer; no forced hover elevation.
- `CbaBadge`: semantic colours; solid / outline styles.
- `CbaEmptyState`: slots for icon, title, description, primary action.
- `CbaSkeleton`: variants `text`, `avatar`, `card`, `table-row`, plus generic.
- `CbaModal`: thin wrapper around ng-bootstrap modal.
- Form controls: thin wrappers around ng-bootstrap Bootstrap inputs, selects, datepickers.

## Related Libraries

| Library | Role |
| --- | --- |
| `@cobranza-apps/ui` | Visual components + theme (this library) |
| `@cobranza-apps/entities` | Shared domain models (already exists on npm) |
| `@cobranza-apps/mfe-events` | Typed event contracts Shell ↔ MFE (not yet published) |

## Cross-Reference

- [Project Brief](brief.md) — source of truth for tokens and component specifications.
- [Tech Stack](tech.md) — exact versions, dependencies, tooling constraints.
- [Product Info](product.md) — product goals, UX focus, target consumers.
