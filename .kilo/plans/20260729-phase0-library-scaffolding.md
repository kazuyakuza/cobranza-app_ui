# Global Plan — Phase 0: Project Bootstrap & Library Scaffolding

> **Date:** 2026-07-29
> **TODO:** `.agent/todos/20260729/20260729-todo-1.md`
> **Branch:** `feat/phase0-library-scaffolding`

---

## Pre-Analysis

**Project:** `@cobranza-apps/ui` — Shared Angular component library & design system for the Cobranza App Company Back-office.

**Current State (as of main branch):**
- `package.json` exists with name `@cobranza-apps/ui`, version `0.1.0`, Angular 22 deps, ng-packagr build.
- `ng-package.json` points to `src/lib/public-api.ts`, outputs to `dist/`.
- `tsconfig.json`, `tsconfig.lib.json`, `tsconfig.spec.json` all exist and are correct.
- `node_modules/` installed; `npm run build` passes; `npm test` passes.
- `src/lib/public-api.ts` exists as minimal barrel (`export {};`).
- Component folders exist with placeholder `index.ts` files (button, module-header, card, badge, empty-state, skeleton, modal, module-container).
- Theme folder `src/lib/theme/` exists but only contains `.gitkeep`.
- `setup-jest.ts` exists.
- `.agent/project-structure.md` is accurate.

**Gaps vs TODO requirements:**
1. `peerDependencies` missing `@fortawesome/fontawesome-svg-core`; icon pack ranges are `^7.3.0` instead of `^6.0.0 || ^7.0.0`.
2. No TypeScript path mapping for `@cobranza-apps/ui` in `tsconfig.json`.
3. Theme folder lacks `_variables.scss`, `_utilities.scss`, `_mixins.scss`, `theme.scss`.
4. `public-api.ts` comment format could be aligned with TODO example.

**Technical & Architecture Decisions:**
- Angular 22, standalone components only (no NgModules).
- Bootstrap 5 + `@ng-bootstrap/ng-bootstrap` v21 for forms/overlays.
- Font Awesome Free via `@fortawesome/angular-fontawesome`.
- Theme delivered as SCSS + CSS variables; encapsulated per consumer.
- Build via `ng-packagr` with single public entry point (`src/lib/public-api.ts`).
- Desktop-only; no mobile considerations.

---

## Step 2: Git Feature Branch Setup

**Agent:** implementer

1. Commit current unstaged files (the TODO file and existing plan files) with a meaningful message.
2. Create and switch to feature branch `feat/phase0-library-scaffolding`.

---

## Step 3: Version Update

**Agent:** implementer

- Skipped: version `0.1.0` already set. No functional changes yet that require a bump.

---

## Task 1: Library Configuration Alignment

Covers TODO Tasks 1, 2, 3, 5, 6 (Angular library setup, peer deps, dependency install, public API, path mapping).

### 4.1 Analysis & Planning
**Agent:** architector

- Verify current `package.json`, `ng-package.json`, `tsconfig.json` align with Angular 22 library standards.
- Identify exact peer dependency gaps.
- Plan path mapping addition in `tsconfig.json`.
- Save plan to `.kilo/plans/20260729-phase0-task1-config-alignment.md`.

### 4.2 Implementation
**Agent:** implementer

1. **package.json peerDependencies fix:**
   - Add `"@fortawesome/fontawesome-svg-core": "^6.0.0 || ^7.0.0"` to `peerDependencies`.
   - Change `"@fortawesome/free-solid-svg-icons"` and `"@fortawesome/free-regular-svg-icons"` ranges to `"^6.0.0 || ^7.0.0"`.
2. **tsconfig.json path mapping:**
   - Add `"@cobranza-apps/ui": ["src/lib/public-api.ts"]` under `compilerOptions.paths`.
3. **public-api.ts:**
   - Update header comment to match TODO example style (minimal, referencing later phases).
4. Run `npm install` to regenerate lockfile consistency.
5. Commit changes.

### 4.3 Code Review & Simplification
**Agents:** code-reviewer + code-simplifier  
**4.3-fix:** implementer

- Review peer dep ranges, path mapping syntax, and public-api comment.
- Simplify where possible.

### 4.4 Documentation
**Agent:** docs-specialist

- Update `tech.md` peer dependencies list if it diverges from `package.json`.
- Ensure `public-api.ts` header is clear for AI agents.

### 4.5 Verification
**Agent:** architector

- Verify `package.json` peer deps match the TODO spec exactly.
- Verify path mapping resolves `@cobranza-apps/ui` correctly.
- Confirm `npm install` succeeded and lockfile is consistent.

### 4.6 Task Completion
**Agent:** implementer

- Append `[DONE]` to TODO Tasks 1, 2, 3, 5, 6 lines.
- Commit.

---

## Task 2: Theme Folder Skeleton

Covers TODO Task 4 (SCSS support and theme folder skeleton).

### 4.1 Analysis & Planning
**Agent:** architector

- Confirm SCSS is configured for ng-packagr build.
- Plan exact file names and minimal content for theme placeholders.
- Save plan to `.kilo/plans/20260729-phase0-task2-theme-skeleton.md`.

### 4.2 Implementation
**Agent:** implementer

1. Create `src/lib/theme/_variables.scss` with placeholder comment.
2. Create `src/lib/theme/_utilities.scss` with placeholder comment.
3. Create `src/lib/theme/_mixins.scss` with placeholder comment.
4. Create `src/lib/theme/theme.scss` that `@use`s the three partials.
5. Remove `src/lib/theme/.gitkeep` (no longer needed).
6. Commit changes.

### 4.3 Code Review & Simplification
**Agents:** code-reviewer + code-simplifier  
**4.3-fix:** implementer

- Review SCSS syntax (`@use` vs `@import`), file naming, and comments.

### 4.4 Documentation
**Agent:** docs-specialist

- Add inline comments in each SCSS file explaining its future purpose.
- Update `.agent/project-structure.md` if needed.

### 4.5 Verification
**Agent:** architector

- Verify all 4 theme files exist and `theme.scss` compiles syntactically.
- Confirm `.gitkeep` is removed.

### 4.6 Task Completion
**Agent:** implementer

- Append `[DONE]` to TODO Task 4 line.
- Commit.

---

## Task 3: Clean-up & Build Verification

Covers TODO Task 7 (clean-up and build verification).

### 4.1 Analysis & Planning
**Agent:** architector

- Identify any leftover demo/placeholder files to remove.
- Plan build verification steps and dist inspection checklist.
- Save plan to `.kilo/plans/20260729-phase0-task3-build-verify.md`.

### 4.2 Implementation
**Agent:** implementer

1. Check for and remove any unused CLI-generated demo components or NgModules (none expected).
2. Run `npm run build`.
3. Inspect `dist/` output:
   - Confirm package name is `@cobranza-apps/ui`.
   - Confirm entry point exists.
   - Confirm no unwanted files are bundled.
4. Run `npm test` to ensure tests still pass.
5. Commit.

### 4.3 Code Review & Simplification
**Agents:** code-reviewer + code-simplifier  
**4.3-fix:** implementer

- Review dist output for correctness.
- Simplify any leftover boilerplate if found.

### 4.4 Documentation
**Agent:** docs-specialist

- Update `context.md` to reflect Phase 0 completion status.
- Update `README.md` if build instructions need adjustment.

### 4.5 Verification
**Agent:** architector

- Verify build finishes with zero errors.
- Verify dist package manifest and entry points are correct.
- Verify no `.gitignore`-matching files are staged.

### 4.6 Task Completion
**Agent:** implementer

- Append `[DONE]` to TODO Task 7 line.
- Commit.

---

## Step 5: TODO File Completion

**Agent:** implementer

1. Ensure all changes are committed in `feat/phase0-library-scaffolding`.
2. Rename TODO file to `20260729-todo-1-DONE.md`.
3. Switch to `main`, merge `feat/phase0-library-scaffolding`.
4. On success, delete feature branch.
5. Push `main` to `origin` only.

---

## Notes

- Each 4.x step is a **separate** `task` tool invocation.
- Sub-agents MUST read project context (`brief.md`, `AGENTS.md`, `.agent/project-info/instructions.md`) independently.
- All commits must use meaningful messages.
- Follow `.kilo/rules/gitignore-compliance.md` before every commit.
- No UI components or design tokens are implemented in this phase.
