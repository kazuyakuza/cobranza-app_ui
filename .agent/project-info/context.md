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

- **Phase 0 — Library scaffolding complete**: all seven TODO tasks finished.
- Peer dependencies configured (Angular 22, Bootstrap 5, ng-bootstrap 21, Font Awesome).
- TypeScript path mapping set up for `@cobranza-apps/ui` local development.
- Theme SCSS folder skeleton created (`src/lib/theme/`) with placeholder files.
- Library build verified — `npm run build`, `npm test`, `npm run lint` all pass with no errors.
- Branch `feat/phase0-library-scaffolding` ready for merge.

## Recent Changes

- **Phase 0 completed** — all seven scaffolding tasks done on `feat/phase0-library-scaffolding`.
- Configured peer dependencies in `package.json` (Angular 22, Bootstrap 5, ng-bootstrap 21, Font Awesome 6/7).
- Installed all dev dependencies and peer packages; lockfile consistent.
- Created theme SCSS folder skeleton (`src/lib/theme/`) with `_variables.scss`, `_utilities.scss`, `_mixins.scss`, `theme.scss` placeholders.
- Added TypeScript path mapping for `@cobranza-apps/ui` → `src/public-api.ts`.
- Verified library build (`ng-packagr`), Jest tests, and ESLint all pass cleanly.
- Cleaned up CLI-generated boilerplate; `public-api.ts` is minimal with no unwanted exports.
- Initialized all project-info files (`brief.md`, `product.md`, `architecture.md`, `tech.md`, `context.md`).
- Rewrote `README.md` for `@cobranza-apps/ui` consumers; created `USAGE.md` with integration examples.
- Defined project structure under `src/lib/` with folders: `components`, `directives`, `pipes`, `services`, `models`, `utils`, `styles`, `theme`.

## Immediate Next Steps

1. **Phase 1 — Theme tokens**: implement design tokens in `src/lib/theme/_variables.scss` (CSS custom properties with `--cba-` prefix), utility classes in `_utilities.scss`, and mixins in `_mixins.scss`.
2. **Component implementation**: build `ModuleHeader`, `ModuleContainer`, and basic components (`CbaButton`, `CbaCard`, `CbaBadge`, `CbaEmptyState`, `CbaSkeleton`, `CbaModal`).
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
- [TODO file](../todos/20260729/20260729-todo-1.md) — Phase 0 tasks (in progress).
- [Global plan](../../.kilo/plans/20260729-ui-library-setup.md) — overall workflow.
