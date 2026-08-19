# Global Plan — Phase 12: Host Encapsulation Audit + Angular Demo App

**Source TODO:** `.agent/todos/20260818/20260818-todo-0.md`
**Date:** 2026-08-18
**Library:** `@cobranza-apps/ui`

---

## Pre-Analysis

### Problem Statement
Under Angular emulated `ViewEncapsulation`, host-bound modifier classes (e.g. `cba-button--primary`) receive `_nghost-*` attribute, while internal elements receive `_ngcontent-*`. Component SCSS written as descendant selectors (`.cba-button--primary .cba-button__control`) compiles to `.cba-button--primary[_ngcontent-*] .cba-button__control[_ngcontent-*]`, which never matches the host. This causes variant styles to silently fail in consumer apps (confirmed in Shell runtime).

### Technical Decisions
- **Fix strategy:** Replace broken descendant selectors with `:host(.modifier) .child` so emulated encapsulation matches the DOM.
- **Do NOT use `ViewEncapsulation.None`** as a blanket fix (explicit constraint in TODO).
- **Do NOT introduce new `::ng-deep`** — fix host selectors instead.
- **Demo app:** Minimal standalone Angular 22 app in `projects/demo/` consuming the built library from `dist/` via tsconfig path mapping. Replicates all major preview sections from `docs/theme-preview.html` using real components.
- **Theme:** Minimal Yet Warm unchanged; demo imports `@cobranza-apps/ui/theme` via published subpath.

### Front-End Classification
- **Task 1 (Part A):** Front-end related — SCSS encapsulation fixes.
- **Task 2 (Part B):** Front-end related — Angular demo application.
- **Task 3 (Part C):** Not front-end related — build integration, docs cleanup, changelog.

---

## Step 2: Git Feature Branch Setup

- **Agent:** implementer
- **Branch:** `feat/phase12-host-encapsulation-audit`
- Switch to `main`, create feature branch.

---

## Step 3: Version Update

- **Agent:** implementer
- Bump `package.json` from `0.15.3b` → `0.16.0` (minor: new demo app + visual fixes).
- Commit: `chore: bump version to 0.16.0`

---

## Task 1: Part A — Encapsulation Audit & Fix

### 4.1a. Front-end Technical Specification (front-end tasks only)
- **Agent:** frontend-specialist
- Analyze all `src/components/**/*.scss` for host modifier selector bugs.
- Produce spec: `.kilo/plans/20260818-phase12-frontend-spec-partA.md`

### 4.1b. Implementation Plan
- **Agent:** architector
- Read frontend spec from 4.1a.
- Inventory: list every host-bound class per component, list every broken SCSS selector.
- Plan: file-by-file fixes for CbaButton, CbaInput, CbaSelect, CbaDatepicker, CbaTypeahead.
- Regression tests: assert host modifier class present; manual compiled-CSS review.
- Save plan: `.kilo/plans/20260818-phase12-partA-plan.md`
- **Planner approval required.**

### 4.2. Implementation
- **Agent:** implementer
- Fix selectors per approved plan.
- Run `npm run build` and `npm run lint` after each batch.
- Commit with meaningful messages.

### 4.3. Code Review & Simplification
- **Agents:** code-reviewer + code-simplifier (concurrent)
- Review for plan adherence, SCSS correctness, no `::ng-deep` introduced.
- Simplify where possible.
- Save fix/simplify plan; assign to implementer for fixes (max 3 cycles).

### 4.4. Documentation
- **Agent:** docs-specialist
- Add short note in `AGENTS.md` or contributing doc: host modifiers → `:host(.class)` in SCSS.
- Update `CHANGELOG.md` under `[0.16.0]` header.

### 4.5a. Front-end Implementation Verification (front-end tasks only)
- **Agent:** frontend-specialist
- Verify compiled CSS contains `:host(.cba-button--primary)` etc.
- Report any remaining descendant-only selectors for host-bound classes.

### 4.5b. Overall Plan Adherence
- **Agent:** architector
- Incorporate front-end verification report.
- Check all listed components were audited.
- Report diffs / deviations.

### 4.6. Task Completion
- **Agent:** implementer
- Mark Part A tasks in TODO file with `[DONE]`.
- Commit.

---

## Task 2: Part B — Angular Demo Mini-App

### 4.1a. Front-end Technical Specification (front-end tasks only)
- **Agent:** frontend-specialist
- Define demo app architecture: standalone Angular 22 app, component usage matrix, theme import path, build wiring.
- Produce spec: `.kilo/plans/20260818-phase12-frontend-spec-partB.md`

### 4.1b. Implementation Plan
- **Agent:** architector
- Read frontend spec from 4.1a.
- Scaffold `projects/demo/` with minimal Angular app config.
- Configure `tsconfig.json` paths to resolve `@cobranza-apps/ui` from `../../dist`.
- Wire `styles.scss` to `@use '@cobranza-apps/ui/theme'`.
- Define npm scripts: `build:demo`, `start:demo`.
- Content parity plan: map each `theme-preview.html` section to real components/token swatches.
- Save plan: `.kilo/plans/20260818-phase12-partB-plan.md`
- **Planner approval required.**

### 4.2. Implementation
- **Agent:** implementer
- Scaffold app shell, components, routing (single page).
- Build demo content sections per plan.
- Ensure `npm run build` passes, then `npm run build:demo` works after lib build.
- Commit with meaningful messages.

### 4.3. Code Review & Simplification
- **Agents:** code-reviewer + code-simplifier (concurrent)
- Review demo app for plan adherence, component usage correctness, no deep src imports.
- Save fix/simplify plan; assign to implementer for fixes (max 3 cycles).

### 4.4. Documentation
- **Agent:** docs-specialist
- Update `README.md` with demo app instructions (`npm run start:demo`).
- Document build order: `build:lib` → `build:demo`.

### 4.5a. Front-end Implementation Verification (front-end tasks only)
- **Agent:** frontend-specialist
- Verify demo uses real library components (not fake `.pv-btn` CSS).
- Verify primary button renders solid accent fill + inverse text.
- Verify module chrome shows canvas/panel/elevated separation.

### 4.5b. Overall Plan Adherence
- **Agent:** architector
- Incorporate front-end verification report.
- Check all preview sections from `theme-preview.html` are covered.
- Report diffs / deviations.

### 4.6. Task Completion
- **Agent:** implementer
- Mark Part B tasks in TODO file with `[DONE]`.
- Commit.

---

## Task 3: Part C — Build, Publish, Remove HTML Preview

### 4.1b. Implementation Plan
- **Agent:** architector
- Plan: integrate demo build into library delivery pipeline.
- Define demo artifact output folder (`dist/demo/` or `docs/demo-dist/`).
- Plan static preview removal: delete `docs/theme-preview.html` + `docs/theme-preview.css`.
- Plan docs link updates: `README.md`, `THEME.md`, `CONSUMER_GUIDE.md`, `INDEX.md`, `AGENTS.md`.
- Plan changelog entry for demo replacement.
- Save plan: `.kilo/plans/20260818-phase12-partC-plan.md`
- **Planner approval required.**

### 4.2. Implementation
- **Agent:** implementer
- Add `build:demo` script and integrate with CI order (lib → demo).
- Emit demo artifacts to documented folder.
- Delete static preview files.
- Update all doc links.
- Update `CHANGELOG.md`.
- Commit with meaningful messages.

### 4.3. Code Review & Simplification
- **Agents:** code-reviewer + code-simplifier (concurrent)
- Review for broken links, missing references, build script correctness.
- Save fix/simplify plan; assign to implementer for fixes (max 3 cycles).

### 4.4. Documentation
- **Agent:** docs-specialist
- Ensure consumer messaging: demo app is the visual source of truth.
- Update any remaining references to old HTML preview.

### 4.5b. Overall Plan Adherence
- **Agent:** architector
- Verify all acceptance criteria met.
- Report diffs / deviations.

### 4.6. Task Completion
- **Agent:** implementer
- Mark Part C tasks in TODO file with `[DONE]`.
- Commit.

---

## Step 5: TODO File Completion

- **Agent:** implementer
- Rename TODO file to `20260818-todo-0-DONE.md`.
- Remove any tmp files created during workflow.
- Ensure all changes committed in feature branch.
- Merge feature branch to `main`.
- Push `main` to `origin`.

---

## Acceptance Criteria Summary

| # | Criterion | Owner Task |
|---|-----------|------------|
| 1 | Host-bound modifiers use `:host(.…)` so emulated encapsulation matches DOM. | Task 1 |
| 2 | `cba-button variant="primary"` renders solid accent + inverse text in a consumer app. | Task 1 |
| 3 | Same class of bugs audited/fixed across listed components. | Task 1 |
| 4 | Angular demo mini-app exists, consumes built lib + real theme. | Task 2 |
| 5 | Demo covers main sections previously in `theme-preview.html` without fake `.pv-btn`. | Task 2 |
| 6 | `build:lib` + `build:demo` documented and working. | Task 2 / 3 |
| 7 | Static `theme-preview.html` removed; docs point to demo. | Task 3 |
| 8 | Changelog records encapsulation fix + demo replacement. | Task 1 / 3 |
