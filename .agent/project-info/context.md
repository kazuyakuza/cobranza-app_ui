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

- **Task 1 — Lighten gray theme complete**: gray palette lightened in `src/theme/_variables.scss`; contrast verified WCAG AA for all intended text/background pairs.
- **Phase 0 — Library scaffolding complete**: all seven TODO tasks finished.
- Peer dependencies configured (Angular 22, Bootstrap 5, ng-bootstrap 21, Font Awesome).
- TypeScript path mapping set up for `@cobranza-apps/ui` local development.
- Theme SCSS folder created (`src/theme/`) with tokenized `_variables.scss`.
- Library build verified — `npm run build`, `npm test`, `npm run lint` all pass with no errors.
- Branch `feat/lighten-gray-theme` ready for merge.

## Recent Changes

- **Theme lightened from near-dark to medium-gray palette** — background tokens shifted to lighter grays (#7a838d–#aeb6bf), text tokens changed to near-black (#0f1115–#2a2e35) for contrast, interactive overlays switched from white to dark, shadows reduced in opacity. All intended text/background pairs meet WCAG AA 4.5:1 except `--cba-text-muted` on `--cba-bg-primary` (documented restriction). Token names unchanged. Source: `src/theme/_variables.scss`, brief.md §5 updated.
- **Front-end specification for lightened gray theme** created in `.kilo/plans/20260803-lighten-gray-theme-frontend-spec.md` (Task 1, step 4.1a).
- **Contrast fix applied** (`066b556`) — `--cba-text-secondary` darkened to `#15181c` and `--cba-text-muted` to `#212429` (spec-authoritative values). Both previously failing pairs now pass WCAG AA: `--cba-text-secondary` on `--cba-bg-primary` is 4.63:1, `--cba-text-muted` on `--cba-bg-secondary` is 5.13:1.
- **Front-end verification completed** in `.kilo/plans/20260803-lighten-gray-theme-task1-verification.md` (Task 1, step 4.5a). Implementation matches the spec exactly; `npm run build` and `npm run lint` pass. Only sub-AA pair remaining: `--cba-text-muted` on `--cba-bg-primary` at 4.05:1 (documented intentional exception).
- **Overall plan adherence verified** in `.kilo/plans/20260803-lighten-gray-theme-task1-adherence.md` (Task 1, step 4.5b) — implementation ADHERENT with accepted deviations (spec-aligned contrast fix, value-equivalent border-subtle alias, docs-only changes).
- **CHANGELOG.md created** — initial release changelog documenting v0.8.1 theme lightening changes, contrast fixes, and docs updates. Format follows Keep a Changelog; includes maintainer guidance header and AI agent cross-references.
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

1. **Contrast discrepancies resolved** — tokens adjusted and verified passing WCAG AA (`--cba-text-secondary` on `--cba-bg-primary` at 4.63:1; `--cba-text-muted` on `--cba-bg-secondary` at 5.13:1); `--cba-text-muted` on `--cba-bg-primary` (4.05:1) remains a documented, restricted exception. brief.md and the front-end spec updated accordingly.
2. **Phase 1 — Theme tokens**: implement utility classes in `src/theme/_utilities.scss` and mixins in `src/theme/_mixins.scss` (design tokens in `_variables.scss` already implemented).
3. **Component implementation**: build `ModuleHeader`, `ModuleContainer`, and basic components (`CbaButton`, `CbaCard`, `CbaBadge`, `CbaEmptyState`, `CbaSkeleton`, `CbaModal`).
4. Set up CI/CD pipeline for automated build and publish.
5. Publish `@cobranza-apps/mfe-events` package for event contracts.

## Open Items / Risks

- `@cobranza-apps/mfe-events` not yet published — workspace event contracts deferred.
- Components not yet implemented; no test coverage beyond scaffolding.
- `--cba-text-muted` on `--cba-bg-primary` is 4.05:1 (below WCAG AA 4.5:1) — documented intentional exception; no library component should pair them.

## Cross-Reference

- [Project Brief](brief.md) — scope, tokens, component specs, source of truth.
- [Product Info](product.md) — product goals, target consumers, UX focus.
- [Architecture](architecture.md) — standalone components, ng-packagr build, theme encapsulation, integration patterns.
- [Tech Stack](tech.md) — exact versions, dependencies, tooling constraints.
- [TODO file](../todos/20260803/20260803-todo-0.md) — Task 1: lighten gray theme.
- [Global plan](../../.kilo/plans/20260803-lighten-gray-theme.md) — overall workflow.
- [CHANGELOG](../../CHANGELOG.md) — release changelog (Keep a Changelog format).
