# @cobranza-apps/ui — Demo App

Angular mini-app that consumes the **built** `@cobranza-apps/ui` library
(`dist/`) and renders every section previously covered by the static
`docs/theme-preview.html` with real library components and live
`var(--cba-*)` token swatches.

This is the canonical visual reference for the Minimal Yet Warm design
system. It replaces the static HTML preview as the source of truth for
how components and tokens look in a real consumer app.

## What the demo shows

- Shell chrome mock (header / workspace / footer) using theme tokens + real `cba-button`
- Module card + header + footer using real `cba-module-container`, `cba-module-header`, `cba-module-footer`
- Token swatches reading `var(--cba-*)` directly (no duplicated hex tables)
- Button state matrix: real `<cba-button>` variants × surfaces (panel / elevated / canvas) × states (normal / disabled / loading) × sizes (sm / md)
- Text on surfaces, border scale, radius & shadow samples
- Selected / nav / footer pill patterns using `--cba-selected-*` tokens
- Form states using real `cba-input`, `cba-select`
- Typography scale using `--cba-font-size-*` tokens
- Semantic status using real `cba-badge`
- Accent pills using token-based styles

## Prerequisites

- Node.js `^22.22.3 || ^24.15.0 || >=26.0.0`
- The library must be built before the demo can resolve it

## How to run the demo

### Option A — Dev server (recommended for development)

```sh
# 1. Build the library → emits dist/
npm run build:lib

# 2. Materialize node_modules/@cobranza-apps/ui from file:./dist
npm install

# 3. Serve the demo app (does NOT rebuild the library)
npm run start:demo
```

The dev server starts at `http://localhost:4200/` by default.

> **Important:** `start:demo` does **not** rebuild the library. After making
> library changes, re-run `npm run build:lib` (and `npm install` if the
> package.json exports changed), then refresh the dev server.

### Option B — Production build

```sh
# Builds the library then the demo app in sequence
npm run build:demo

# Output: dist/demo/browser/index.html
```

Serve `dist/demo/browser/` with any static file server to view the
production build.

## Architecture

- **Location:** `projects/demo/` (Angular application project in `angular.json`)
- **Library dependency:** `@cobranza-apps/ui` resolved via `file:./dist` in the root `package.json` devDependencies, so the demo imports from `node_modules/@cobranza-apps/ui` — the same path real consumers use.
- **Theme:** `projects/demo/src/styles.scss` imports `@use '@cobranza-apps/ui/theme'` exactly as a consumer would.
- **No deep `src/` imports:** the demo never imports from `src/components/...` or `src/theme/...`. All imports go through `@cobranza-apps/ui`.
- **Demo-only components:** `projects/demo/src/app/components/` contains helper components (`demo-section`, `demo-swatch`, `demo-button-matrix`, `demo-module-card`) that are **not** part of the public library API. They exist only to simplify the demo page markup.

## npm scripts

| Command | Description |
| --- | --- |
| `npm run build:lib` | Build the library → `dist/` |
| `npm run build:demo` | Build library + demo app → `dist/demo/browser/` |
| `npm run start:demo` | Serve demo via Angular dev server (no lib rebuild) |

## Related docs

- [Root README](../../README.md) — library overview and installation
- [Consumer Guide](../../docs/CONSUMER_GUIDE.md) — Shell & MFE integration rules
- [Theme Guide](../../docs/THEME.md) — token reference and utility classes
- [Project Brief](../../.agent/project-info/brief.md) — design tokens and component contracts
