# Global Plan — Phase 1: Theme Foundation

**Source TODO**: `.agent/todos/20260729/20260729-todo-2.md`
**Date**: 2026-07-30
**Project**: `@cobranza-apps/ui`

---

## Pre-Analysis

### Technical Context
- Angular 22 library built with `ng-packagr`.
- Theme SCSS folder skeleton exists at `src/lib/theme/` with placeholder partials (`_variables.scss`, `_utilities.scss`, `_mixins.scss`, `theme.scss`).
- `public-api.ts` is minimal (`export {};`) and builds cleanly.
- `ng-package.json` points to `src/lib/public-api.ts`; no `assets` or `styleIncludePaths` configured yet.
- Version is `0.1.0`. This is a feature phase, so bump to `0.2.0` (minor).
- All tasks are front-end related (SCSS/theme).

### Architecture Decisions
- Use modern Sass `@use` (already in `theme.scss`).
- CSS custom properties go under `:root` in `_variables.scss`.
- Utility classes in `_utilities.scss` map 1:1 to token variables.
- Mixins in `_mixins.scss` are small and focused.
- Base typography lives in a dedicated `_base.scss` partial imported by `theme.scss`.
- ng-packagr `assets` array will include theme SCSS so consumers can import it.
- Desktop-only; no mobile breakpoints.

---

## Step 2 — Git Feature Branch Setup
**Agent**: `implementer`
- Run `git status`; commit any unstaged changes.
- Switch to `main`, create `feat/phase1-theme-foundation`.

---

## Step 3 — Version Update
**Agent**: `implementer`
- Bump `package.json` version to `0.2.0`.
- Commit: `chore: bump version to 0.2.0`.

---

## Task 1 — Design Tokens (`_variables.scss`)
**Scope**: Create `src/lib/theme/_variables.scss` with all `--cba-*` CSS custom properties under `:root` using exact values from brief.md §5.
**Front-end related**: Yes

### 4.1a — Front-end Technical Specification
**Agent**: `frontend-specialist`
- Save spec to `.kilo/plans/20260730-phase1-task1-frontend-spec.md`.

### 4.1b — Implementation Plan
**Agent**: `architector`
- Plan: write `_variables.scss`, verify no typos in token names/values.
- Save plan to `.kilo/plans/20260730-phase1-task1-plan.md`.
- Present to user for approval.

### 4.2 — Implementation
**Agent**: `implementer`
- Write `src/lib/theme/_variables.scss` with all tokens under `:root`.
- Commit: `feat(theme): add design tokens in _variables.scss`.

### 4.3 — Code Review & Simplification
**Agents**: `code-reviewer` + `code-simplifier` (concurrent)
- Review for typos, missing tokens, deviations from brief.
- Save fix/simplification plan if needed; implementer applies.

### 4.4 — Documentation
**Agent**: `docs-specialist`
- Add top-of-file comment describing responsibility.

### 4.5a — Front-end Verification
**Agent**: `frontend-specialist`
- Verify every token from brief.md §5 is present with exact value.

### 4.5b — Overall Plan Adherence
**Agent**: `architector`
- Confirm all tokens exist and compile.

### 4.6 — Task Completion
**Agent**: `implementer`
- Mark `[DONE]` in TODO file for Task 1.
- Commit: `chore: mark task 1 done in todo`.

---

## Task 2 — Utility Classes (`_utilities.scss`)
**Scope**: Create `src/lib/theme/_utilities.scss` with background, text, border, radius, shadow, and minimal spacing utilities mapped to tokens.
**Front-end related**: Yes

### 4.1a — Front-end Technical Specification
**Agent**: `frontend-specialist`
- Save spec to `.kilo/plans/20260730-phase1-task2-frontend-spec.md`.

### 4.1b — Implementation Plan
**Agent**: `architector`
- Plan: define utility classes; spacing helpers minimal (e.g., `.cba-p-1` through `.cba-p-6`, `.cba-m-1` through `.cba-m-6`).
- Save plan to `.kilo/plans/20260730-phase1-task2-plan.md`.
- Present to user for approval.

### 4.2 — Implementation
**Agent**: `implementer`
- Write `src/lib/theme/_utilities.scss`.
- Commit: `feat(theme): add utility classes in _utilities.scss`.

### 4.3 — Code Review & Simplification
**Agents**: `code-reviewer` + `code-simplifier` (concurrent)

### 4.4 — Documentation
**Agent**: `docs-specialist`
- Add top-of-file comment.

### 4.5a — Front-end Verification
**Agent**: `frontend-specialist`
- Verify all required utilities exist and use `var(--cba-*)`.

### 4.5b — Overall Plan Adherence
**Agent**: `architector`

### 4.6 — Task Completion
**Agent**: `implementer`
- Mark `[DONE]` in TODO file for Task 2.
- Commit.

---

## Task 3 — Mixins (`_mixins.scss`)
**Scope**: Create `src/lib/theme/_mixins.scss` with `cba-focus-ring`, `cba-elevated-surface`, `cba-hover-surface`. Keep file small.
**Front-end related**: Yes

### 4.1a — Front-end Technical Specification
**Agent**: `frontend-specialist`
- Save spec to `.kilo/plans/20260730-phase1-task3-frontend-spec.md`.

### 4.1b — Implementation Plan
**Agent**: `architector`
- Save plan to `.kilo/plans/20260730-phase1-task3-plan.md`.
- Present to user for approval.

### 4.2 — Implementation
**Agent**: `implementer`
- Write `src/lib/theme/_mixins.scss`.
- Commit: `feat(theme): add scss mixins in _mixins.scss`.

### 4.3 — Code Review & Simplification
**Agents**: `code-reviewer` + `code-simplifier` (concurrent)

### 4.4 — Documentation
**Agent**: `docs-specialist`
- Add top-of-file comment.

### 4.5a — Front-end Verification
**Agent**: `frontend-specialist`

### 4.5b — Overall Plan Adherence
**Agent**: `architector`

### 4.6 — Task Completion
**Agent**: `implementer`
- Mark `[DONE]` in TODO file for Task 3.
- Commit.

---

## Task 4 — Theme Entry Point (`theme.scss`)
**Scope**: Ensure `src/lib/theme/theme.scss` imports partials in correct order; optionally add header comment.
**Front-end related**: Yes

### 4.1a — Front-end Technical Specification
**Agent**: `frontend-specialist`
- Save spec to `.kilo/plans/20260730-phase1-task4-frontend-spec.md`.

### 4.1b — Implementation Plan
**Agent**: `architector`
- Save plan to `.kilo/plans/20260730-phase1-task4-plan.md`.
- Present to user for approval.

### 4.2 — Implementation
**Agent**: `implementer`
- Update `theme.scss` to import `_base.scss` (new) after `variables` and before `mixins/utilities`.
- Ensure order: `variables`, `base`, `mixins`, `utilities`.
- Commit: `feat(theme): update theme.scss entry point with base imports`.

### 4.3 — Code Review & Simplification
**Agents**: `code-reviewer` + `code-simplifier` (concurrent)

### 4.4 — Documentation
**Agent**: `docs-specialist`
- Add header comment to `theme.scss`.

### 4.5a — Front-end Verification
**Agent**: `frontend-specialist`

### 4.5b — Overall Plan Adherence
**Agent**: `architector`

### 4.6 — Task Completion
**Agent**: `implementer`
- Mark `[DONE]` in TODO file for Task 4.
- Commit.

---

## Task 5 — Base Typography & Defaults
**Scope**: Create `src/lib/theme/_base.scss` (or inline in `theme.scss`) with Inter font stack, 14px base, 1.5 line-height, text/background defaults, heading weights, link/focus defaults. Complement Bootstrap 5, don't fight it.
**Front-end related**: Yes

### 4.1a — Front-end Technical Specification
**Agent**: `frontend-specialist`
- Save spec to `.kilo/plans/20260730-phase1-task5-frontend-spec.md`.

### 4.1b — Implementation Plan
**Agent**: `architector`
- Plan: create `_base.scss` partial; set global but restrained defaults on `html`, `body`.
- Save plan to `.kilo/plans/20260730-phase1-task5-plan.md`.
- Present to user for approval.

### 4.2 — Implementation
**Agent**: `implementer`
- Write `src/lib/theme/_base.scss`.
- Update `theme.scss` to `@use 'base';`.
- Commit: `feat(theme): add base typography and defaults in _base.scss`.

### 4.3 — Code Review & Simplification
**Agents**: `code-reviewer` + `code-simplifier` (concurrent)

### 4.4 — Documentation
**Agent**: `docs-specialist`
- Add top-of-file comment.

### 4.5a — Front-end Verification
**Agent**: `frontend-specialist`
- Verify typography matches brief.md §5.

### 4.5b — Overall Plan Adherence
**Agent**: `architector`

### 4.6 — Task Completion
**Agent**: `implementer`
- Mark `[DONE]` in TODO file for Task 5.
- Commit.

---

## Task 6 — Make the Theme Consumable
**Scope**: Ensure theme SCSS is part of library build output (ng-packagr assets/styles config or documented path). Document import path.
**Front-end related**: Yes

### 4.1a — Front-end Technical Specification
**Agent**: `frontend-specialist`
- Save spec to `.kilo/plans/20260730-phase1-task6-frontend-spec.md`.

### 4.1b — Implementation Plan
**Agent**: `architector`
- Plan: update `ng-package.json` to include `src/lib/theme/**/*.scss` in `assets`; verify build produces accessible SCSS path.
- Save plan to `.kilo/plans/20260730-phase1-task6-plan.md`.
- Present to user for approval.

### 4.2 — Implementation
**Agent**: `implementer`
- Update `ng-package.json` with assets array for theme SCSS.
- Verify build outputs theme files in `dist/`.
- Commit: `build(ng-packagr): include theme scss in library assets`.

### 4.3 — Code Review & Simplification
**Agents**: `code-reviewer` + `code-simplifier` (concurrent)

### 4.4 — Documentation
**Agent**: `docs-specialist`
- Update README.md / docs with import instructions.

### 4.5a — Front-end Verification
**Agent**: `frontend-specialist`
- Verify import path works for consumers.

### 4.5b — Overall Plan Adherence
**Agent**: `architector`

### 4.6 — Task Completion
**Agent**: `implementer`
- Mark `[DONE]` in TODO file for Task 6.
- Commit.

---

## Task 7 — Public API / Exports
**Scope**: Confirm `public-api.ts` builds cleanly; no new TS exports needed for Phase 1.
**Front-end related**: No (infrastructure only)

### 4.1b — Implementation Plan
**Agent**: `architector`
- Plan: verify `public-api.ts` unchanged; confirm build passes.
- Save plan to `.kilo/plans/20260730-phase1-task7-plan.md`.
- Present to user for approval.

### 4.2 — Implementation
**Agent**: `implementer`
- Run `npm run build`; verify success.
- No code changes expected.
- Commit if any incidental fixes needed.

### 4.3 — Code Review & Simplification
**Agents**: `code-reviewer` + `code-simplifier` (concurrent)

### 4.4 — Documentation
**Agent**: `docs-specialist`
- None needed for this task.

### 4.5b — Overall Plan Adherence
**Agent**: `architector`

### 4.6 — Task Completion
**Agent**: `implementer`
- Mark `[DONE]` in TODO file for Task 7.
- Commit.

---

## Task 8 — Build Verification
**Scope**: Run library build, confirm no Sass errors, spot-check dist contains theme styles.
**Front-end related**: No (infrastructure only)

### 4.1b — Implementation Plan
**Agent**: `architector`
- Plan: run `npm run build`, inspect `dist/` for SCSS files, fix any compilation errors.
- Save plan to `.kilo/plans/20260730-phase1-task8-plan.md`.
- Present to user for approval.

### 4.2 — Implementation
**Agent**: `implementer`
- Run `npm run build`; fix any Sass compilation errors.
- Verify `dist/` contains theme SCSS/CSS.
- Commit fixes if needed.

### 4.3 — Code Review & Simplification
**Agents**: `code-reviewer` + `code-simplifier` (concurrent)

### 4.4 — Documentation
**Agent**: `docs-specialist`
- None needed.

### 4.5b — Overall Plan Adherence
**Agent**: `architector`

### 4.6 — Task Completion
**Agent**: `implementer`
- Mark `[DONE]` in TODO file for Task 8.
- Commit.

---

## Task 9 — Documentation & Tests
**Scope**: Create `/docs/theme.md` linked from README; add top comments to each SCSS partial; keep stylelint green.
**Front-end related**: Yes

### 4.1a — Front-end Technical Specification
**Agent**: `frontend-specialist`
- Save spec to `.kilo/plans/20260730-phase1-task9-frontend-spec.md`.

### 4.1b — Implementation Plan
**Agent**: `architector`
- Plan: create `docs/theme.md` with import guide, token groups, utility prefix note; ensure README links to it.
- Save plan to `.kilo/plans/20260730-phase1-task9-plan.md`.
- Present to user for approval.

### 4.2 — Implementation
**Agent**: `implementer`
- Create `docs/theme.md`.
- Add top comments to `_variables.scss`, `_utilities.scss`, `_mixins.scss`, `_base.scss`, `theme.scss`.
- Update README.md to link to `docs/theme.md`.
- Run `npm run lint` / any stylelint check; fix if needed.
- Commit: `docs(theme): add theme documentation and scss comments`.

### 4.3 — Code Review & Simplification
**Agents**: `code-reviewer` + `code-simplifier` (concurrent)

### 4.4 — Documentation
**Agent**: `docs-specialist`
- Ensure `docs/theme.md` has TOC if >100 lines.

### 4.5a — Front-end Verification
**Agent**: `frontend-specialist`
- Verify docs accuracy against implementation.

### 4.5b — Overall Plan Adherence
**Agent**: `architector`

### 4.6 — Task Completion
**Agent**: `implementer`
- Mark `[DONE]` in TODO file for Task 9.
- Commit.

---

## Step 5 — TODO File Completion
**Agent**: `implementer`
- Rename TODO file to `20260729-todo-2-DONE.md`.
- Merge `feat/phase1-theme-foundation` into `main`.
- Push `main` to `origin` only.

---

## Continuation Prompt

After completion, user should proceed with next TODO via:

```text
full read @AGENTS.md & follow /critical-workflow
do @.agent/todos/<next-todo-file>
```
