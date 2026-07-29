# Global Plan — UI Library Initial Setup

> **Date:** 2026-07-29
> **TODO:** `.agent/todos/20260729/20260729-todo-0.md`
> **Branch:** `feat/ui-library-setup`

---

## Pre-Analysis

**Project:** `@cobranza-apps/ui` — Shared Angular component library & design system for the Cobranza App Company Back-office.

**Current State:**
- Repository is on `main` with unstaged changes (`brief.md` modified, several base-project files deleted).
- `src/` exists but only contains `.gitkeep`.
- `.agent/project-info/.initialized` exists, indicating project info was never formally initialized.
- No `package.json`, `ng-package.json`, or build configuration.
- README still contains base-project template text.

**Technical & Architecture Decisions:**
- Angular **22**, standalone components only (no NgModules).
- Bootstrap 5 + `@ng-bootstrap/ng-bootstrap` v21 for forms/overlays.
- Font Awesome Free via `@fortawesome/angular-fontawesome`.
- Theme delivered as SCSS + CSS variables; encapsulated per consumer.
- Build via `ng-packagr` with single public entry point (`public-api.ts`).
- Testing: Jest where useful; no Storybook for now.
- Peer dependencies: `@angular/*`, `bootstrap`, `@ng-bootstrap/ng-bootstrap`, `@fortawesome/*`.
- Desktop-only; no mobile considerations.

---

## Step 2: Git Feature Branch Setup

**Agent:** implementer

1. Commit current unstaged changes with a meaningful message.
2. Create and switch to feature branch `feat/ui-library-setup`.

---

## Step 3: Version Update

**Agent:** implementer

- Skipped: no `package.json` exists yet. Initial version (`0.1.0`) will be defined in Task 4.

---

## Task 1: Initialize Project Info

### 4.1 Analysis & Planning
**Agent:** architector

- Analyze existing `brief.md` to extract product goals, architecture, and tech stack.
- Generate per-task plan: create `product.md`, `context.md`, `architecture.md`, `tech.md`.
- Save plan to `.kilo/plans/20260729-task1-init-project-info.md`.

### 4.2 Implementation
**Agent:** implementer

- Create `.agent/project-info/product.md` — UX goals, problem definition, product scope.
- Create `.agent/project-info/context.md` — current focus (library bootstrap), recent changes, next steps.
- Create `.agent/project-info/architecture.md` — Angular library patterns, standalone components, ng-packagr, theme encapsulation, public API strategy.
- Create `.agent/project-info/tech.md` — exact versions, tooling (Angular CLI, ng-packagr, Jest, SCSS), peer/dev dependencies, constraints.
- Remove `.agent/project-info/.initialized`.
- Commit changes.

### 4.3 Code Review & Simplification
**Agents:** code-reviewer + code-simplifier  
**4.3-fix:** implementer

- Review for consistency with `brief.md`, accuracy of versions, and clarity.
- Simplify where possible.

### 4.4 Documentation
**Agent:** docs-specialist

- Ensure all project-info files have clear headers, cross-links, and AI-agent guidance.
- Update `AGENTS.md` references if needed.

### 4.5 Verification
**Agent:** architector

- Verify all 5 core project-info files exist and are consistent.
- Confirm `.initialized` is removed.

### 4.6 Task Completion
**Agent:** implementer

- Append `[DONE]` to Task 1 line in TODO file.
- Commit.

---

## Task 2: Update README File

### 4.1 Analysis & Planning
**Agent:** architector

- Plan a README tailored to `@cobranza-apps/ui` consumers (Shell + MFE developers).
- Include: description, install, theme import quick-start, component list, peer deps, links to `/docs/USAGE.md`.
- Save plan to `.kilo/plans/20260729-task2-update-readme.md`.

### 4.2 Implementation
**Agent:** implementer

- Replace base-project README with new content.
- Commit.

### 4.3 Code Review & Simplification
**Agents:** code-reviewer + code-simplifier  
**4.3-fix:** implementer

### 4.4 Documentation
**Agent:** docs-specialist

- Polish formatting, add TOC if > 100 lines, ensure all links are valid.

### 4.5 Verification
**Agent:** architector

- Check README matches project scope and brief.

### 4.6 Task Completion
**Agent:** implementer

- Append `[DONE]` to Task 2 line in TODO file.
- Commit.

---

## Task 3: Define Project Structure

### 4.1 Analysis & Planning
**Agent:** architector

- Translate brief section 7 (Library Structure) into actual folders + `.agent/project-structure.md`.
- Proposed `src/` layout:
  ```
  src/lib/components/module-header/
  src/lib/components/module-container/
  src/lib/components/button/
  src/lib/components/card/
  src/lib/components/badge/
  src/lib/components/empty-state/
  src/lib/components/skeleton/
  src/lib/components/modal/
  src/lib/theme/
  src/lib/directives/
  src/lib/public-api.ts
  ```
- Save plan to `.kilo/plans/20260729-task3-define-structure.md`.

### 4.2 Implementation
**Agent:** implementer

- Create `.agent/project-structure.md` with folder descriptions.
- Create all folders inside `src/lib/`. Add minimal `index.ts` or `.gitkeep` where appropriate.
- Create `public-api.ts` as a single entry point re-exporting (initially empty or with placeholders).
- Commit.

### 4.3 Code Review & Simplification
**Agents:** code-reviewer + code-simplifier  
**4.3-fix:** implementer

### 4.4 Documentation
**Agent:** docs-specialist

- Document folder purpose in `project-structure.md` and add inline comments in `public-api.ts`.

### 4.5 Verification
**Agent:** architector

- Verify physical folders match `project-structure.md` and brief.

### 4.6 Task Completion
**Agent:** implementer

- Append `[DONE]` to Task 3 line in TODO file.
- Commit.

---

## Task 4: Set Up and Configure package.json. Add and Install Dependencies

### 4.1 Analysis & Planning
**Agent:** architector

- Define exact dependency versions aligned with brief:
  - Angular 22
  - `@ng-bootstrap/ng-bootstrap` v21
  - Bootstrap 5.x
  - `@fortawesome/angular-fontawesome` + free icon packs
  - `ng-packagr` for library build
  - Jest for unit testing
  - TypeScript ~5.x
- Plan file creation: `package.json`, `ng-package.json`, `tsconfig.lib.json`, `tsconfig.spec.json` (if needed by ng-packagr), `.npmignore` (if needed).
- Update `.gitignore` to include `node_modules/` and lock files.
- Save plan to `.kilo/plans/20260729-task4-setup-package-json.md`.

### 4.2 Implementation
**Agent:** implementer

- Create `package.json` with:
  - `name`: `@cobranza-apps/ui`
  - `version`: `0.1.0`
  - `peerDependencies`: `@angular/core`, `@angular/common`, `@angular/forms`, `bootstrap`, `@ng-bootstrap/ng-bootstrap`, `@fortawesome/angular-fontawesome`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-regular-svg-icons`
  - `devDependencies`: Angular CLI, `ng-packagr`, TypeScript, Jest, `@types/*`, SCSS tools
  - `scripts`: `build`, `test`, `lint`, `format`
- Create `ng-package.json` pointing to `src/lib/public-api.ts` and output `dist/`.
- Create minimal `tsconfig.lib.json` / `tsconfig.spec.json` if required.
- Add `node_modules/` and `package-lock.json` to `.gitignore`.
- Run `npm install` to validate and download dependencies.
- Commit.

### 4.3 Code Review & Simplification
**Agents:** code-reviewer + code-simplifier  
**4.3-fix:** implementer

- Review dependency ranges, script definitions, and ng-packagr config.

### 4.4 Documentation
**Agent:** docs-specialist

- Document install steps, peer dependency requirements, and build commands in README and/or `/docs/USAGE.md`.

### 4.5 Verification
**Agent:** architector

- Verify `npm install` succeeded, `node_modules/` created, and build config is valid.
- Check `.gitignore` compliance (no `node_modules/` staged).

### 4.6 Task Completion
**Agent:** implementer

- Append `[DONE]` to Task 4 line in TODO file.
- Commit.

---

## Step 5: TODO File Completion

**Agent:** implementer

1. Ensure all changes are committed in `feat/ui-library-setup`.
2. Rename TODO file to `20260729-todo-0-DONE.md`.
3. Switch to `main`, merge `feat/ui-library-setup`.
4. On success, delete feature branch.
5. Push `main` to `origin` only.

---

## Notes

- Each 4.x step is a **separate** `task` tool invocation.
- Sub-agents MUST read project context (`brief.md`, `AGENTS.md`, `.agent/project-info/instructions.md`) independently.
- All commits must use meaningful messages.
- Follow `.kilo/rules/gitignore-compliance.md` before every commit.
