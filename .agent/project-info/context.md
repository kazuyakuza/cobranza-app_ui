<!--
  FILE: context.md — Project Context & Status
  PURPOSE: Tracks current work focus, recent changes, immediate next steps, and open risks for @cobranza-apps/ui.
  AUDIENCE: AI agents and developers needing a quick status overview.
  RELATIONSHIPS:
    - brief.md — source of truth for scope, tokens, and component specs.
    - product.md — product goals, target consumers, UX focus.
    - architecture.md — build strategy, folder layout, integration patterns.
    - tech.md — exact versions, dependencies, tooling constraints.
  MAINTENANCE: Update after each significant change or task completion. Keep "Recent Changes" and "Next Steps" current.
-->

# @cobranza-apps/ui — Context

[Project Info: Active]

## Current Work Focus

- **Library bootstrap complete**: all four initial TODO tasks finished.
- `main` branch is clean, up to date, and pushed to `origin`.
- `npm run build`, `npm test`, `npm run lint` all pass.
- Ready for component-level implementation.

## Recent Changes

- Initialized all project-info files (`brief.md`, `product.md`, `architecture.md`, `tech.md`, `context.md`).
- Rewrote `README.md` for `@cobranza-apps/ui` consumers; created `USAGE.md` with integration examples.
- Defined project structure under `src/lib/` with folders: `components`, `directives`, `pipes`, `services`, `models`, `utils`, `styles`, `theme`.
- Created `src/public-api.ts` as the library entry point (barrel file).
- Set up `package.json` (Angular 22, Bootstrap 5, ng-bootstrap v21, rxjs) with `ng-packagr` build config.
- Installed all dependencies — `npm install` completed successfully.
- Merged `feat/ui-library-setup` branch into `main` and pushed to `origin`.

## Immediate Next Steps

1. Implement individual components (e.g., `ModuleHeader`, `ModuleContainer`).
2. Create theme SCSS files (`src/lib/theme/`).
3. Set up CI/CD pipeline for automated build and publish.
4. Publish `@cobranza-apps/mfe-events` package for event contracts.

## Open Items / Risks

- `@cobranza-apps/mfe-events` not yet published — workspace event contracts deferred.
- Components not yet implemented; no test coverage beyond scaffolding.

## Cross-Reference

- [Project Brief](brief.md) — scope, tokens, component specs, source of truth.
- [Product Info](product.md) — product goals, target consumers, UX focus.
- [Architecture](architecture.md) — standalone components, ng-packagr build, theme encapsulation, integration patterns.
- [Tech Stack](tech.md) — exact versions, dependencies, tooling constraints.
- [TODO file](../todos/20260729/20260729-todo-0-DONE.md) — completed tasks.
- [Global plan](../../.kilo/plans/20260729-ui-library-setup.md) — overall workflow.
