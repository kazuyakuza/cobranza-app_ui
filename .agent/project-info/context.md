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

- **Bootstrapping the library**: initializing project-info documentation (this TODO Task 1).
- Repository is pre-`package.json`; `src/` contains only `.gitkeep`.
- Branch: `feat/ui-library-setup`.

## Recent Changes

- Cleaned up base-project template files.
- Created `feat/ui-library-setup` branch.
- Authored `brief.md` (project brief, source of truth).

## Immediate Next Steps

1. **Task 2**: Update `README.md` for `@cobranza-apps/ui` consumers.
2. **Task 3**: Define project structure (create folders under `src/lib/`).
3. **Task 4**: Create `package.json` + `ng-package.json`, install dependencies.

## Open Items / Risks

- `@cobranza-apps/mfe-events` not yet published — workspace event contracts deferred.
- Exact minor/patch versions of Angular 22 / Bootstrap 5 / ng-bootstrap v21 to be finalized in Task 4 (`package.json`).

## Cross-Reference

- [Project Brief](brief.md) — scope, tokens, component specs, source of truth.
- [Product Info](product.md) — product goals, target consumers, UX focus.
- [Architecture](architecture.md) — standalone components, ng-packagr build, theme encapsulation, integration patterns.
- [Tech Stack](tech.md) — exact versions, dependencies, tooling constraints.
- [TODO file](../todos/20260729/20260729-todo-0.md) — active tasks.
- [Global plan](../../.kilo/plans/20260729-ui-library-setup.md) — overall workflow.
