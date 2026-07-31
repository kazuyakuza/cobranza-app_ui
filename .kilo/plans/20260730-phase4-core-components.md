# Global Plan — Phase 4: Core Presentational Components

**Source:** `.agent/todos/20260730/20260730-todo-2.md`
**Date:** 2026-07-30

---

## Pre-Analysis

### Project State

- `@cobranza-apps/ui` is an Angular 22 library built with `ng-packagr`.
- Source code currently lives under `src/lib/` (components, theme, directives, `public-api.ts`).
- Phase 0 (scaffolding) and Phase 3 (`ModuleHeader` + `ModuleContainer`) are complete and merged to `main`.
- Theme tokens (`_variables.scss`, `_base.scss`, `_mixins.scss`, `_utilities.scss`) are fully implemented.
- Build (`npm run build`), test (`npm test`), and lint (`npm run lint`) all pass cleanly.
- Version: `0.4.0`.
- On branch `main`, working tree clean.

### Task Summary

| # | Task | Type | Front-end? |
|---|------|------|------------|
| 0 | Move source code from `src/lib/` to `src/` | Structural | No |
| 1 | Implement `CbaButton` | Component | Yes |
| 2 | Implement `CbaCard` | Component | Yes |
| 3 | Implement `CbaBadge` | Component | Yes |
| 4 | Implement `CbaEmptyState` | Component | Yes |
| 5 | Implement `CbaSkeleton` | Component | Yes |

### Technical & Architecture Decisions

1. **Flatten `src/lib` → `src/`**: This is the only lib project; no need for the extra `/lib` nesting. All configs referencing `src/lib/` must be updated.
2. **Component pattern**: Follow the established pattern from `ModuleHeader`/`ModuleContainer`:
   - Standalone components (`standalone: true`)
   - `ChangeDetectionStrategy.OnPush`
   - Signal-based inputs (`input()`, `input.required()`)
   - Host bindings for CSS modifier classes
   - Separate `.ts`, `.html`, `.scss`, `.spec.ts` files per component
   - Barrel `index.ts` per component folder
3. **Styling**: Use only `--cba-*` tokens. No hard-coded colors. Use existing mixins (`cba-focus-ring`, `cba-elevated-surface`, `cba-hover-surface`) where helpful.
4. **Testing**: Jest with `TestBed`, `ComponentFixture`. Focus on behavior assertions (render, projection, click emission, variant classes, loading/disabled states).
5. **Documentation**: JSDoc on all public members. Add component docs to `/docs/` (follow `MODULE_HEADER.md` / `MODULE_CONTAINER.md` pattern). Update `README.md` Component Inventory and `USAGE.md` with real examples.
6. **Public API**: Export each component from `public-api.ts`.
7. **Version bump**: `0.4.0` → `0.5.0` (minor, new features).

### Files to Update for Task 0 (Move lib→src)

- `ng-package.json`: `entryFile`, `styleIncludePaths`, `assets[].input`
- `tsconfig.lib.json`: `include`, `exclude`, `compilerOptions.outDir`
- `tsconfig.json`: `paths["@cobranza-apps/ui"]`
- `jest.config.js`: `testMatch`
- `package.json`: `exports["./theme"].sass`
- `src/lib/public-api.ts`: internal relative imports (e.g., `./components/...`)
- All component barrel `index.ts` files: internal relative imports (already relative to their folder, likely unchanged)
- Component `.ts` files: template/style relative paths (already relative, unchanged)

### New Files for Tasks 1–5

Per component (`<name>` = `button`, `card`, `badge`, `empty-state`, `skeleton`):
- `src/components/<name>/index.ts` (barrel)
- `src/components/<name>/cba-<name>.component.ts`
- `src/components/<name>/cba-<name>.component.html`
- `src/components/<name>/cba-<name>.component.scss`
- `src/components/<name>/cba-<name>.component.spec.ts`

Docs:
- `docs/CBA_BUTTON.md`
- `docs/CBA_CARD.md`
- `docs/CBA_BADGE.md`
- `docs/CBA_EMPTY_STATE.md`
- `docs/CBA_SKELETON.md`

Updates:
- `src/public-api.ts` (add exports)
- `README.md` (update inventory)
- `USAGE.md` (add usage examples)

---

## Execution Overview

### Step 2 — Git Feature Branch Setup
**Agent:** implementer
- Commit any unstaged files (none expected; verify).
- Create and switch to branch: `feat/phase4-core-components`.

### Step 3 — Version Update
**Agent:** implementer
- Bump `package.json` version: `0.4.0` → `0.5.0`.
- Commit: `chore: bump version to 0.5.0`.

---

## Task 0 — Move Source Code from `src/lib/` to `src/`

### 4.1b — Analysis & Planning (Task 0)
**Agent:** architector
- Analyze every file that references `src/lib/`.
- Produce a detailed move plan with file list, path mappings, and verification steps.
- Save plan to `.kilo/plans/20260730-task0-move-lib-to-src.md`.

### 4.2 — Implementation (Task 0)
**Agent:** implementer
- Move all files from `src/lib/` to `src/` (preserve folder structure under `src/`).
- Update all config files (`ng-package.json`, `tsconfig.lib.json`, `tsconfig.json`, `jest.config.js`, `package.json`).
- Update `public-api.ts` internal import paths.
- Delete empty `src/lib/` directory.
- Run `npm run build`, `npm test`, `npm run lint` to verify.
- Commit with meaningful message.

### 4.3 — Code Review & Simplification (Task 0)
**Agent:** code-reviewer + code-simplifier (concurrent)
- Review for missed references, broken paths, or unnecessary complexity.
- Save fix/simplification plan if needed.

### 4.3-fix — Apply Fixes (Task 0)
**Agent:** implementer
- Apply any fixes from 4.3.
- Re-verify build/test/lint.
- Commit.

### 4.4 — Documentation (Task 0)
**Agent:** docs-specialist
- Update `public-api.ts` JSDoc comments if they reference `src/lib/`.
- Update any docs that mention `src/lib/` paths (e.g., `THEME.md`, `MODULE_HEADER.md`, `MODULE_CONTAINER.md`).

### 4.5b — Overall Plan Adherence (Task 0)
**Agent:** architector
- Verify all files moved, all references updated, build/test/lint pass.

### 4.6 — Task Completion (Task 0)
**Agent:** implementer
- Mark Task 0 as `[DONE]` in the TODO file.
- Commit.

---

## Tasks 1–5 — Implement CbaButton, CbaCard, CbaBadge, CbaEmptyState, CbaSkeleton

**Note:** These five component tasks are related, thin, and presentational. They share the same patterns, theme tokens, and testing approach. They are grouped into one cycle for efficiency, with a single front-end spec and implementation plan covering all five.

### 4.1a — Front-end Technical Specification (Tasks 1–5)
**Agent:** frontend-specialist
- Analyze the 5 component APIs from the TODO file.
- Produce a single **Front-end Technical Specification** covering all five components:
  - Detailed HTML templates, SCSS styling strategies, content projection patterns, host binding classes, animation decisions, accessibility notes.
  - Explicit token usage per variant/state.
- Save spec to `.kilo/plans/20260730-phase4-components-frontend-spec.md`.

### 4.1b — Analysis & Planning (Tasks 1–5)
**Agent:** architector
- Read the front-end spec produced in 4.1a.
- Research any required dependencies (Font Awesome for icons in Button/EmptyState — already a peer dependency; no new deps expected).
- Generate a detailed implementation plan covering all 5 components:
  - Exact file paths, names, and folder structure.
  - Component class signatures (inputs, outputs, host bindings).
  - SCSS strategy (token mapping, mixins, modifier classes).
  - Test strategy (fixture setup, helper functions, assertions per component).
  - Docs strategy (which files to create/update).
- Save plan to `.kilo/plans/20260730-phase4-components-impl.md`.

### 4.2 — Implementation (Tasks 1–5)
**Agent:** implementer
- Implement each component following the plan from 4.1b.
- For each component: `.ts`, `.html`, `.scss`, `.spec.ts`, update `index.ts` barrel.
- Export all components from `src/public-api.ts`.
- Run `npm run build` and `npm test` after all components are added.
- Commit incrementally per component or in logical groups.

### 4.3 — Code Review & Simplification (Tasks 1–5)
**Agent:** code-reviewer + code-simplifier (concurrent)
- Review all 5 components for:
  - Correctness vs. TODO spec
  - Token usage (no hard-coded values)
  - Accessibility (focus rings, native elements)
  - Code complexity and duplication across components
- Simplify where possible (extract shared SCSS patterns, reduce duplication).
- Save fix/simplification plan to `.kilo/plans/20260730-phase4-components-review.md`.

### 4.3-fix — Apply Fixes (Tasks 1–5)
**Agent:** implementer
- Apply fixes and simplifications.
- Re-run build and tests.
- Commit.

### 4.4 — Documentation (Tasks 1–5)
**Agent:** docs-specialist
- Add JSDoc to all public members of each component.
- Create per-component docs under `/docs/` (`CBA_BUTTON.md`, `CBA_CARD.md`, `CBA_BADGE.md`, `CBA_EMPTY_STATE.md`, `CBA_SKELETON.md`).
- Update `README.md` Component Inventory with implementation status.
- Update `USAGE.md` with real code examples for each component.
- Update `docs/THEME.md` if new mixins or token usage patterns were introduced.

### 4.5a — Front-end Implementation Verification (Tasks 1–5)
**Agent:** frontend-specialist
- Verify each component against the front-end spec from 4.1a.
- Report any diffs between spec and implementation.
- Report front-end quality issues (a11y, visual consistency, token usage).

### 4.5b — Overall Plan Adherence (Tasks 1–5)
**Agent:** architector
- Read the front-end verification report from 4.5a.
- Check implementation plan adherence for all 5 components.
- Verify all acceptance criteria from the TODO file are met.
- Report diffs. If deviations are unacceptable, propose a new TODO file.

### 4.6 — Task Completion (Tasks 1–5)
**Agent:** implementer
- Mark Tasks 1–5 as `[DONE]` in the TODO file.
- Mark all acceptance criteria sub-items as done (`[x]`).
- Commit with meaningful message.

---

## Step 5 — TODO File Completion
**Agent:** implementer
- Rename TODO file to `20260730-todo-2-DONE.md`.
- Ensure all files are committed in `feat/phase4-core-components`.
- Switch to `main`, merge feature branch.
- On success: delete feature branch.
- Push `main` to `origin` only.

---

## Step 6 — Continuation

After completion, the user should proceed with the next undone TODO file in a new chat:

```text
full read @AGENTS.md & follow /critical-workflow
do @.agent/todos/<next-undone-file>
```

---

## Acceptance Criteria (from TODO)

| # | Criterion |
|---|-----------|
| 1 | `CbaButton`, `CbaCard`, `CbaBadge`, `CbaEmptyState`, `CbaSkeleton` exist as standalone components and compile. |
| 2 | Each component API matches the TODO document. |
| 3 | Styles use only theme tokens. |
| 4 | Content projection works for Card and EmptyState (and Button icons if implemented via projection). |
| 5 | Skeleton variants include `text`, `avatar`, `card`, `table-row`, `generic`. |
| 6 | All five components are exported from `public-api.ts`. |
| 7 | Library build succeeds. |
| 8 | Docs + minimal unit tests for this phase are present. |
