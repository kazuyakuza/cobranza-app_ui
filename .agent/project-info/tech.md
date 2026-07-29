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
| Angular | 22 (latest compatible minor, to pin in Task 4) | Standalone only; no NgModules |
| Bootstrap | 5.x | CSS-only; never jQuery |
| @ng-bootstrap/ng-bootstrap | v21 | Forms / overlays |
| @fortawesome/angular-fontawesome | latest compatible with Angular 22 | solid + regular icon packs |
| ng-packagr | latest compatible with Angular 22 | Library build |
| TypeScript | ~6.0.3 | Angular 22 requires TS 6.x, supersedes earlier brief estimate |
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
- Code rules from `.kilo/rules/` apply (e.g., line/method limits, parameter caps, nesting depth, and private-by-default members).
- No domain logic, BFF communication, or workspace state in this library.

## Cross-Reference

- [Project Brief](brief.md) — token values, component specs, tooling decisions.
- [Architecture](architecture.md) — build strategy, public API, integration patterns.
- [Product Info](product.md) — product goals, target consumers, UX focus.
- [Context](context.md) — current work status, recent changes, next steps.
