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

- **Phase 12 — Part C complete (v0.18.0)**: demo app delivered and static HTML preview removed. See "Recent Changes" for full details.
- **Shell UI Bug Fixes Round 2 complete (v0.14.0)**: six library-side fixes identified during Shell UI Bug Fixes Round 2 have been implemented and published. ModuleContainer now exposes `scrollChaining` and retains background color in fullscreen mode. CbaButton gained `truncate`, `iconOnly`, and `block` inputs. The theme preview HTML was completely rewritten with a minimizable sidebar, Shell+MFE workspace mockup, seven module examples, and an expanded style showcase. All changes merged to `main` and pushed to `origin`.
- **Phase 10 — Theme Hardening complete (v0.12.1)**: theme is hardened and ready as platform foundation for real MFEs. Preview now accurately reflects actual component rendering. Surfaces and borders retuned for multi-module density, selected/form-state/typography tokens added, ModuleHeader actions reworked, form controls wired to visual states, and consumer docs (THEME.md, CONSUMER_GUIDE.md) updated. Next focus: real product UI on top of tokens + consumer guide.
- **Phase 9 — Surface hierarchy fix + consumer guide**: widened the four-level Minimal Yet Warm surface scale in `src/theme/_variables.scss`, strengthened borders and module shadows, refreshed `docs/theme-preview.html` for visual verification, and published `docs/CONSUMER_GUIDE.md` for Shell/MFE authors.
- **Phase 0 — Library scaffolding complete**: all seven TODO tasks finished. Peer deps configured (Angular 22, Bootstrap 5, ng-bootstrap 21, Font Awesome); TypeScript path mapping for `@cobranza-apps/ui`; theme SCSS folder at `src/theme/`; build, Jest, ESLint all pass.
- Active branch: `fix/theme-import-dev-server` (v0.15.2 — theme dev-server directory-index fix in progress).

## Recent Changes

- **Demo header search input centering spec (2026-08-20)** — Front-end technical specification created at `.kilo/plans/20260820-fix-demo-bugs-task2-frontend-spec.md`. Identifies the root cause as unequal left/right header group widths combined with `margin: 0 auto`, and prescribes a flexbox equal-gutter layout with no markup changes.

- **Phase 12 Part C — demo delivery + static preview removal (2026-08-19, v0.18.0)** — `build:lib` → `build:demo` pipeline documented in README with `dist/demo/browser/` artifact location; `docs/theme-preview.html` + `docs/theme-preview.css` deleted; `npm run build:preview` script removed; `src/theme/preview-html.spec.ts` deleted; `PREVIEW_HTML_PATH` / `PREVIEW_CSS_PATH` exports removed from `src/components/testing/theme-fixtures.ts`; README, docs/INDEX.md, docs/CONSUMER_GUIDE.md, brief.md §5/§8.1, instructions.md retargeted to `projects/demo/` as the canonical visual reference. See `.agent/todos/20260818/20260818-todo-0.md` Part C and `.kilo/plans/20260818-phase12-partC-plan.md`.

- **Theme dev-server directory-index fix (2026-08-13, v0.15.2)** — `@use '@cobranza-apps/ui/theme'` now resolves under Angular's dev-server Sass importer via the new `src/theme/_index.scss` directory-index partial. The v0.15.1 package-root `src/theme.scss` shim and `package.json` `exports["./theme"]` remain unchanged. See `CHANGELOG.md` and `.agent/todos/20260812/20260812-todo-2.md`.

- **Theme dev-server import fix (2026-08-12, v0.15.1)** — patched `@use '@cobranza-apps/ui/theme'` so it resolves under Angular's dev-server Sass importer, which ignores `package.json` `exports` conditions. Added package-root shim `src/theme.scss` (`@forward './theme/theme.scss'`) and a second `ng-package.json` asset entry to publish it to `dist/theme.scss`. The existing `exports["./theme"]` map remains unchanged. Shell can drop its `stylePreprocessorOptions.includePaths` workaround and use the canonical import. See `.agent/todos/20260812/20260812-todo-1.md`.

- **Project-wide audit & cross-file drift remediation (2026-08-12, v0.15.0)** — comprehensive audit of package/build config, theme tokens, component SCSS compliance, documentation accuracy, and `docs/theme-preview.html` consumer reference. Added `--cba-module-footer-height`, `--cba-icon-size-md`, `--cba-dropdown-min-width` tokens; fixed `package.json` `exports["./theme"]` (`sass` + `style` + `default`), `sideEffects`, and stale `dist/package.json` version; replaced hard-coded `font-size`/`line-height` in component SCSS with `--cba-*` tokens; renamed `ModuleFooterComponent` → `CbaModuleFooterComponent` and added `host` blocks to module-header/module-footer; corrected 6 stale hex values and token mis-references in `docs/USAGE.md` / `docs/CBA_TYPEAHEAD.md` / `docs/CBA_MODULE_FOOTER.md` / `docs/CBA_FORM_FIELD.md` / `docs/CBA_INPUT.md` / `docs/CBA_SELECT.md` / `docs/CBA_DATEPICKER.md` / `docs/CBA_EMPTY_STATE.md`; added `<p class="section-caption">` to every preview section mapping demo CSS to the real library API; preview accessibility fixes (`.t-callout` WCAG AA, focusable `.search`, `--cba-*` base font-size). **Process guardrails added** to prevent recurrence: `brief.md` §5 authoritative token source note, `brief.md` §8.1 Token Change Checklist, `instructions.md` pre-commit cross-file sync verification (grep mandate), `context.md` audit record + open risk. See `.kilo/plans/20260812-project-audit-and-fixes.md`.

- **Shell UI Bug Fixes Round 2 (2026-08-11, v0.14.0)** — `ModuleContainerComponent` gained `scrollChaining` input (opt-in `overscroll-behavior: auto`) and fullscreen mode now retains `background-color` while suppressing only border/radius/shadow. `CbaButtonComponent` gained three new inputs: `truncate` (ellipsis overflow), `iconOnly` (minimal square icon-only button), and `block` (full-width layout). `docs/theme-preview.html` completely rewritten with minimizable sidebar (localStorage persistence), Shell+MFE workspace mockup, seven module examples (100%/50% × expanded/collapsed), and expanded style showcase (31 token swatches, button matrix, labels, pills, icon grid, text-on-surfaces, typography scale, border/selected/form/status demos). Tests expanded to 212 (22 suites). `npm run lint` clean, `npm run build` passes. All docs updated (`CBA_MODULE_CONTAINER.md`, `CBA_BUTTON.md`, `README.md`, `CHANGELOG.md`). No `[Unreleased]` section per changelog-versioning rule.
- **Preview accuracy fix (2026-08-08, v0.12.1)** — `docs/theme-preview.html` module header and container mockup now uses the exact CSS class names, selectors, and Font Awesome icons from the actual Angular components (`module-header.component.scss` / `module-container.component.scss`). Added Font Awesome 6.7.2 CDN link to the preview `<head>`. Copied component SCSS rules into the preview inline `<style>` with "keep in sync" comments. Replaced hardcoded px values (`border-radius: 12px`, `min-height: 42px`, `font-size: 15px`) with `var(--cba-*)` CSS variables. Updated `renderDensityStrip()` JS function to emit the same component structure. Applied safe code-simplification suggestions from review (merged duplicate `:focus-visible` rules, unified pill base styles, replaced inline muted color with `.cba-text-muted` utility). `npm test` (202/202 pass), `npm run lint` clean, `preview-html.spec.ts` stable. `CHANGELOG.md` updated with dated `[0.12.1] — 2026-08-08` header per changelog-versioning rule. See `.kilo/plans/20260808-fix-preview-accuracy-task1.md`.
- **Phase 10 — Theme Hardening (2026-08-07, v0.12.0)** — surface retuning (canvas `#BCB5A4`, panel `#F2F0E8`, elevated `#FDFCF8`); border system retuning (subtle `#E8E5DB` / default `#A29D94` / strong `#6B665E`, visibly distinct by role; borders primary separator, shadows secondary); new selected tokens (`--cba-selected-*`), form state tokens (`--cba-state-*`), typography scale tokens (`--cba-font-size-*` / `--cba-line-height-*`); ModuleHeader icon swap and action reorder (drag, collapse, size toggle, fullscreen, remove); form control state wiring (readonly, valid, invalid, disabled); dropdown selected pattern (`.cba-dropdown__item--selected`); theme preview updated with multi-module density, border swatches, selected samples, form states, type scale, status badges; docs updated (THEME.md, CONSUMER_GUIDE.md, README, CHANGELOG, brief.md); version bumped to 0.12.0.
- **Preview readability token tune (Task B, 2026-08-06)** — increased interactive overlay opacity in `src/theme/_variables.scss`: `--cba-hover` to `rgba(43, 38, 32, 0.10)` and `--cba-active` to `rgba(43, 38, 32, 0.18)`. Updated `docs/theme-preview.html` token labels, warning callout, accent pills, and Shell footer background for readability. Synced `docs/CONSUMER_GUIDE.md`, `.agent/project-info/brief.md` §5, and regenerated `docs/theme-preview.css`.
- **Changelog versioning rule established (Task A, 2026-08-06)** — new rule `.kilo/rules/changelog-versioning.md` prohibits `[Unreleased]` sections in `CHANGELOG.md` (every push to `origin` publishes the lib). Index reference added to `.agent/RULES.md`; `CHANGELOG.md` header comment rewritten to drop `[Unreleased]` instructions and point to the rule file.
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

1. **Theme is ready as platform foundation for real MFEs** — further work is product UI on top of tokens + consumer guide, not another palette reset.
2. **Continue component coverage**: remaining basic components and form-control hardening per brief.md §6.
3. **Shell apply the consumer guide** in the Shell repo (`docs/CONSUMER_GUIDE.md`); this library only publishes the guide — Shell implementation is its own PR.
4. Publish `@cobranza-apps/mfe-events` for Shell ↔ MFE event contracts.
5. Set up CI/CD pipeline for automated build and publish (version auto-bumps on push to origin).

## Open Items / Risks

- **Phase 10 visual breaking change** for Shell layouts that depended on the previous surface values (canvas `#C5BFAE`, panel `#E6DDC6`, elevated `#FBF7ED`): canvas is now clearly darker (`#BCB5A4`) and modules lift more distinctly; borders retuned (subtle `#E8E5DB`, default `#A29D94`, strong `#6B665E`). Shell authors should review `docs/CONSUMER_GUIDE.md` and verify in the demo app (`npm run start:demo`).
- `--cba-text-muted` (`#625C55`) is restricted on the darker canvas (`--cba-bg-primary` `#BCB5A4`, ~3.2:1) AND on `--cba-bg-tertiary` (`#D8C3A5`, ~3.9:1) — both below WCAG AA; library components and Shell/MFE must use `--cba-text-secondary` on those surfaces.
- `@cobranza-apps/mfe-events` not yet published — workspace event contracts deferred.

- **Cross-file drift recurrence risk (procedural)** — the 2026-08-12 audit found tokens, component SCSS, and docs had drifted apart sprint-by-sprint. Remediation encoded process guardrails in `brief.md` §5/§8.1 and `instructions.md` (pre-commit cross-file grep). The guardrails are only effective if every future token/class change runs the Token Change Checklist; a change that skips the checklist reintroduces drift. Mitigation: review the checklist at every `src/theme/_variables.scss` change and at every demo app / docs PR.

## Cross-Reference

- [Shell UI Bug Fixes Round 2 TODO](../todos/20260811/20260811-todo-0-DONE.md) — library-side fixes from Shell UI Bug Fixes Round 2.
- [Shell UI Bug Fixes Round 2 global plan](../../.kilo/plans/20260811-shell-ui-bug-fixes-round-2.md) — overall workflow.
- [Phase 10 TODO](../todos/20260807/20260807-todo-1-DONE.md) — Theme Hardening (pre–real MFEs).
- [Project Brief](brief.md) — scope, tokens, component specs, source of truth.
- [Product Info](product.md) — product goals, target consumers, UX focus.
- [Architecture](architecture.md) — standalone components, ng-packagr build, theme encapsulation, integration patterns.
- [Tech Stack](tech.md) — exact versions, dependencies, tooling constraints.
- [Phase 9 TODO](../todos/20260805/20260805-todo-0.md) — Surface hierarchy fix + consumer guide.
- [Phase 9 global plan](../../.kilo/plans/20260805-phase9-surface-hierarchy-fix.md) — overall workflow.
- [Consumer Guide](../../docs/CONSUMER_GUIDE.md) — Shell & MFE integration rules (surface ownership, checklists, anti-patterns).
- [Theme Reference](../../docs/THEME.md) — token quick reference.
- [CHANGELOG](../../CHANGELOG.md) — release changelog (Keep a Changelog format), latest 0.18.0.
