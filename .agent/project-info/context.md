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

- **Phase 9 — Surface hierarchy fix + consumer guide**: widened the four-level Minimal Yet Warm surface scale in `src/theme/_variables.scss`, strengthened borders and module shadows, refreshed `docs/theme-preview.html` for visual verification, and published `docs/CONSUMER_GUIDE.md` for Shell/MFE authors.
- **Phase 0 — Library scaffolding complete**: all seven TODO tasks finished. Peer deps configured (Angular 22, Bootstrap 5, ng-bootstrap 21, Font Awesome); TypeScript path mapping for `@cobranza-apps/ui`; theme SCSS folder at `src/theme/`; build, Jest, ESLint all pass.
- Active branch: `feat/phase9-surface-hierarchy` (Tasks A + B).

## Recent Changes

- **Phase 9 token tuning (Task A)** — widened Minimal Yet Warm surface hierarchy in `src/theme/_variables.scss`: canvas `#C5BFAE`, panel `#F2F0E8`, elevated `#FDFCF8`, inset `#D8C3A5`; `--cba-border-subtle` `#DAD7CA`; `--cba-shadow-module` `0 6px 24px rgba(43,34,28,0.18)`; `--cba-shadow-elevated` `0 10px 32px rgba(43,34,28,0.26)`. `docs/theme-preview.html` refreshed; four surfaces visibly distinct. Token names unchanged.
- **Phase 9 consumer guide + docs sync (Task B)** — created `docs/CONSUMER_GUIDE.md` (theme load, surface ownership map, Shell checklist, MFE checklist, anti-patterns, quick verify). Linked from `docs/INDEX.md`, `README.md` (Integration Notes + Documentation), and `docs/THEME.md` (new `### Surface hierarchy` note). README "intermediate-gray" → "Minimal Yet Warm". `CHANGELOG.md` 0.10.0 entry added (dated 2026-08-05). `brief.md` §5 token values + muted-restriction prose updated; `context.md` status updated.
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

1. **Phase 9 user visual confirmation** of `docs/theme-preview.html` (TODO §5 checkpoint); if still flat, iterate tokens once more inside Minimal Yet Warm.
2. **Shell apply the consumer guide** in the Shell repo (`docs/CONSUMER_GUIDE.md`); this library only publishes the guide — Shell implementation is its own PR.
3. **Continue component coverage**: remaining basic components and form-control hardening per brief.md §6.
4. Publish `@cobranza-apps/mfe-events` for Shell ↔ MFE event contracts.
5. Set up CI/CD pipeline for automated build and publish (version auto-bumps on push to origin).

## Open Items / Risks

- `@cobranza-apps/mfe-events` not yet published — workspace event contracts deferred.
- `--cba-text-muted` is now restricted on the darker canvas (`#C5BFAE`, ~3.6:1) AND on `--cba-bg-tertiary` (~3.86:1) — both below WCAG AA; library components and Shell/MFE must use `--cba-text-secondary` on those surfaces.
- Visual breaking change for Shell layouts that depended on near-identical canvas/panel surfaces (previously both ~#EAE7DC/#F3F1E9); Shell authors should review `docs/CONSUMER_GUIDE.md` and confirm workspace uses `--cba-bg-primary`.
- Phase 9 TODO §5 human visual confirmation checkpoint still pending.

## Cross-Reference

- [Project Brief](brief.md) — scope, tokens, component specs, source of truth.
- [Product Info](product.md) — product goals, target consumers, UX focus.
- [Architecture](architecture.md) — standalone components, ng-packagr build, theme encapsulation, integration patterns.
- [Tech Stack](tech.md) — exact versions, dependencies, tooling constraints.
- [Phase 9 TODO](../todos/20260805/20260805-todo-0.md) — Surface hierarchy fix + consumer guide.
- [Phase 9 global plan](../../.kilo/plans/20260805-phase9-surface-hierarchy-fix.md) — overall workflow.
- [Consumer Guide](../../docs/CONSUMER_GUIDE.md) — Shell & MFE integration rules (surface ownership, checklists, anti-patterns).
- [Theme Reference](../../docs/THEME.md) — token quick reference.
- [CHANGELOG](../../CHANGELOG.md) — release changelog (Keep a Changelog format), latest 0.10.0.
