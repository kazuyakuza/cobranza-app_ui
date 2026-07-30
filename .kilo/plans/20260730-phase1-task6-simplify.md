# Phase 1 — Task 6 Simplification Plan

**Scope:** `ng-package.json`, `package.json`, `README.md` (files touched while making the theme consumable).
**Goal:** Reduce duplication, remove non-essential configuration, and keep the README focused on consumers.

## 1. `ng-package.json`

### Current observations
- `$schema` is declared but only used for IDE/schema validation; `ng-packagr` does not require it.
- `dest` is explicitly set to `./dist`, which is the `ng-packagr` default.
- `assets` contains a single object entry that is already as minimal as the schema allows.
- `styleIncludePaths` is a single-element array.

### Simplification opportunities
1. Remove `$schema` to eliminate a file-system dependency and a line of boilerplate.
2. Remove `dest` if the project is happy with the default `dist/` output.

### Proposed minimal shape
```json
{
  "assets": [
    {
      "glob": "**/*.scss",
      "input": "src/lib/theme",
      "output": "theme"
    }
  ],
  "lib": {
    "entryFile": "src/lib/public-api.ts",
    "styleIncludePaths": ["src/lib/theme"]
  }
}
```

## 2. `package.json`

### Current observations
- `engines.node` lists three disjoint ranges (`^22.22.3 || ^24.15.0 || >=26.0.0`).
- `scripts.test` contains the `--passWithNoTests` flag inline.
- `scripts.lint` includes a glob pattern that is duplicated from the ESLint config.
- `peerDependencies` for Font Awesome icon packs use the verbose form `^6.0.0 || ^7.0.0`.
- `description` and `README` have overlapping information about the design system.

### Simplification opportunities
1. Narrow `engines.node` to the single LTS range the project actually uses (e.g., `^22.22.3`), unless there is verified CI/runtime demand for Node 24/26.
2. Move `--passWithNoTests` into `jest.config.js` so the script becomes `"test": "jest"`.
3. Simplify `lint` to `"lint": "eslint src"` if the flat config already covers the file set.
4. Shorten peer ranges: `"^6 || ^7"` for the Font Awesome icon packs.
5. Keep `exports["./theme"]` as-is; it is the minimal SCSS sub-path needed for consumers.

### Proposed script simplification
```json
{
  "scripts": {
    "build": "ng-packagr -p ng-package.json -c tsconfig.lib.json",
    "test": "jest",
    "lint": "eslint src",
    "format": "prettier --write \"src/**/*.{ts,scss,css,json,md}\""
  }
}
```

## 3. `README.md`

### Current observations
- README is a monolithic entry point mixing consumer, contributor, and AI-agent information.
- The `Component Inventory` and `Design Tokens` sections repeat detailed tables that are better suited to the existing `docs/USAGE.md`.
- The `Development Commands` and `Config files reference` tables are developer-focused, not consumer-focused.
- The `Installation` section has a paragraph that restates the table above it.

### Simplification opportunities
1. Move the full `Component Inventory` table to `docs/USAGE.md`; keep a one-line summary and a link.
2. Move the detailed `Design Tokens` list to `docs/USAGE.md`; keep the high-level `@use '@cobranza-apps/ui/theme';` guidance and the token prefix note.
3. Move `Development Commands` and `Config files reference` to a new `docs/DEVELOPMENT.md` (or append to an existing contributor doc) and link from the README.
4. Remove the redundant paragraph after the peer-dependency installation table.
5. Keep the single top-level AI agent note and a final link to `AGENTS.md`; remove the inline AI agent notes that duplicate that guidance.

### Proposed README structure
- Overview
- Target Consumers
- Installation
- Quick Start
- Theme Import
- Related Libraries
- Integration Notes (Shell ↔ MFE)
- Documentation
- Contributing & AI Agent Onboarding
- License

## 4. Files to update
- `ng-package.json` — remove optional `$schema` and default `dest`.
- `package.json` — simplify scripts, engine range, and peer ranges.
- `README.md` — move detailed tables to docs and deduplicate installation text.
- Optional: `docs/USAGE.md` — absorb the Component Inventory and Design Tokens details.
- Optional: `docs/DEVELOPMENT.md` — absorb Development Commands and Config files reference.

## 5. Out of scope
- No peer/dev dependency additions or removals.
- No changes to the actual SCSS theme, library entry point, or `exports["./theme"]` shape.
- No build command or test configuration logic changes beyond moving the `--passWithNoTests` flag.

## 6. Risks / questions
- Confirm the active Node version/range before narrowing `engines.node`.
- Verify that ESLint flat config already covers `src/**/*.ts` before shortening `lint`.
- Confirm `jest.config.js` is the right place for `--passWithNoTests`.
