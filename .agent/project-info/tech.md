<!--
  FILE: tech.md — Tech Stack
  PURPOSE: Records the exact technology versions, peer/dev dependencies, planned scripts, development setup, and tooling constraints for @cobranza-apps/ui.
  AUDIENCE: AI agents and developers setting up or maintaining the build environment.
  RELATIONSHIPS:
    - brief.md — token values, component specs, tooling decisions.
    - architecture.md — build strategy, public API, integration patterns.
    - product.md — product goals, target consumers, UX focus.
    - context.md — current work status and next steps.
  MAINTENANCE: Update when dependency versions change or new tooling is adopted. Pin exact versions in Task 4 (package.json).
-->

# @cobranza-apps/ui — Tech Stack

## Stack Versions

| Technology | Version / Choice | Notes |
| --- | --- | --- |
| Angular | ^22.0.0 | Standalone only; no NgModules |
| Bootstrap | ^5.3.0 | CSS-only; never jQuery |
| @ng-bootstrap/ng-bootstrap | ^21.0.0 | Forms / overlays |
| @fortawesome/angular-fontawesome | ^5.0.0 (peer), ^5.1.0 (dev) | solid + regular icon packs |
| ng-packagr | ^22.1.0 | Library build |
| TypeScript | ~6.0.3 | Angular 22 requires TS 6.x |
| SCSS | built-in | Theme + optional mixins |
| Jest | ^30.4.0 | Unit tests via jest-preset-angular |
| ESLint | ^9.0.0 | Flat config with angular-eslint ^22.0.0 |
| Prettier | ^3.0.0 | Code formatting |
| Node.js | ^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0 | Engine requirement in package.json |

## Peer Dependencies (runtime, expected by consumers)

- `@angular/core`, `@angular/common`, `@angular/forms`
- `bootstrap` (CSS)
- `@ng-bootstrap/ng-bootstrap`
- `@fortawesome/angular-fontawesome`
- `@fortawesome/fontawesome-svg-core`
- `@fortawesome/free-solid-svg-icons`
- `@fortawesome/free-regular-svg-icons`

## Dev Dependencies (build / test tooling)

- `@angular/cli` ^22.0.9
- `ng-packagr` ^22.1.0
- TypeScript ~6.0.3 + `@types/jest` ^30.0.0, `@types/node` ^22.0.0
- Jest ^30.4.0 + jest-preset-angular ^17.0.0 + jest-environment-jsdom ^30.4.1
- ESLint ^9.0.0 + angular-eslint ^22.0.0 + typescript-eslint ^8.0.0
- Prettier ^3.0.0
- rxjs ^7.8.1, tslib ^2.3.0, zone.js ~0.16.0

## Scripts

Defined in `package.json`:

| Script | Command | Purpose |
| --- | --- | --- |
| `build` | `ng-packagr -p ng-package.json -c tsconfig.lib.json` | Build library to `dist/` |
| `test` | `jest --passWithNoTests` | Run Jest unit tests |
| `lint` | `eslint "src/**/*.ts"` | Lint TypeScript sources |
| `format` | `prettier --write "src/**/*.{ts,scss,css,json,md}"` | Format source files |

## Development Setup

1. Clone repository.
2. `npm install` — installs all dev dependencies.
3. `npm run build` — outputs `dist/` via `ng-package.json`.
4. Local consumption: `npm link` or `npm pack` for Shell/MFE integration (see `/docs/USAGE.md`).

## Tooling Constraints

- **Desktop-only** — no mobile / responsive test matrix.
- **No jQuery**, no ngx-bootstrap.
- **No Storybook** for now.
- Manual QA first; Playwright integration tests added later.
- JSDoc required on every public `@Input()`, `@Output()`, and component class.
- Code rules from `.kilo/rules/` apply (e.g., line/method limits, parameter caps, nesting depth, and private-by-default members).
- No domain logic, BFF communication, or workspace state in this library.

## Cross-Reference

- [Project Brief](brief.md) — token values, component specs, tooling decisions.
- [Architecture](architecture.md) — build strategy, public API, integration patterns.
- [Product Info](product.md) — product goals, target consumers, UX focus.
- [Context](context.md) — current work status, recent changes, next steps.
