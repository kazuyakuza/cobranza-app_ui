# @cobranza-apps/ui — Tech Stack

## Stack Versions

| Technology | Version / Choice | Notes |
| --- | --- | --- |
| Angular | 22 (latest compatible minor, to pin in Task 4) | Standalone only; no NgModules |
| Bootstrap | 5.x | CSS-only; never jQuery |
| @ng-bootstrap/ng-bootstrap | v21 | Forms / overlays |
| @fortawesome/angular-fontawesome | latest compatible with Angular 22 | solid + regular icon packs |
| ng-packagr | latest compatible with Angular 22 | Library build |
| TypeScript | ~5.x (aligned to Angular 22) | |
| SCSS | built-in | Theme + optional mixins |
| Jest | latest | Unit tests where useful |
| Node | LTS compatible with Angular 22 | |

> **Note**: Exact minor/patch versions are finalized in Task 4 when `package.json` is created. This file records the major version choices only.

## Peer Dependencies (runtime, expected by consumers)

- `@angular/core`, `@angular/common`, `@angular/forms`
- `bootstrap` (CSS)
- `@ng-bootstrap/ng-bootstrap`
- `@fortawesome/angular-fontawesome`
- `@fortawesome/free-solid-svg-icons`
- `@fortawesome/free-regular-svg-icons`

## Dev Dependencies (build / test tooling)

- Angular CLI
- `ng-packagr`
- TypeScript + `@types/*`
- Jest + Angular-compatible preset / config
- SCSS tooling (provided by Angular / ng-packagr)

Exact pins are set in Task 4 (`package.json`).

## Scripts (planned, finalized in Task 4)

- `build` — `ng-packagr` build
- `test` — Jest unit tests
- `lint` — code linting
- `format` — code formatting

## Development Setup

1. Clone repository.
2. `npm install` (after Task 4 creates `package.json`).
3. `npm run build` outputs `dist/` via `ng-package.json`.
4. Local consumption: `npm link` or `npm pack` for Shell/MFE integration (documented later in `/docs/USAGE.md`).

## Tooling Constraints

- **Desktop-only** — no mobile / responsive test matrix.
- **No jQuery**, no ngx-bootstrap.
- **No Storybook** for now.
- Manual QA first; Playwright integration tests added later.
- JSDoc required on every public `@Input()`, `@Output()`, and component class.
- Code rules from `.kilo/rules/` apply:
  - Max 200 lines per source file in `src/`.
  - Max 50 lines per method.
  - Max 2 constructor / method parameters (use a config/options object beyond 2).
  - Max 2 levels of nesting (extract into methods beyond that).
  - Prefer private members by default.
- No domain logic, BFF communication, or workspace state in this library.

## Cross-Reference

- [Project Brief](brief.md) — token values, component specs, tooling decisions.
- [Architecture](architecture.md) — build strategy, public API, integration patterns.
