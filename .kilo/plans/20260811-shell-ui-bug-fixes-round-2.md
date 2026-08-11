# Global Plan — Shell UI Bug Fixes Round 2 (UI Library)

**Source TODO:** `.agent/todos/20260811/20260811-todo-0.md`
**Date:** 2026-08-11
**Library:** `@cobranza-apps/ui` `^0.13.0`
**Target Version:** `0.14.0` (minor bump — new inputs + preview rewrite)

---

## Pre-Analysis

### Technical Decisions

- **ModuleContainer (Tasks 1–2):** Both are small SCSS-only fixes in `module-container.component.scss`. No new TypeScript inputs needed for Task 1 (we'll remove `overscroll-behavior: contain` entirely per Option A — simpler, no API surface change). Task 2 splits the `:host(:not(.cba-module-container--fullscreen))` selector into two rules.
- **CbaButton (Tasks 3–5):** All three require new `@Input()` signals plus host class bindings, template adjustments, and SCSS rules. Since they all touch the same component, they will be implemented together in one sub-task to avoid merge conflicts and repeated test/doc updates.
  - Task 3: `truncate = input<boolean>(false)` → host class `cba-button--truncate` → `.cba-button__label` gets `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`
  - Task 4: Detect icon-only state (icon present + empty ng-content) → host class `cba-button--icon-only` → minimal square padding (`padding: var(--cba-space-2)`) and no min-width.
  - Task 5: `block = input<boolean>(false)` → host class `cba-button--block` → `:host { display: block; }` and `.cba-button__control { width: 100%; }`
- **Theme Preview (Task 6):** Large front-end HTML rewrite. Marked as **front-end related**. Requires a dedicated front-end spec (step 4.1a) before the implementation plan (4.1b).

### Architecture Notes

- All changes stay within existing component contracts (brief.md §6).
- No new peer dependencies.
- Tasks 1–5 are non-breaking for existing consumers; new inputs have safe defaults (`false`).
- Task 6 is a docs-only file (`docs/theme-preview.html`) with no runtime impact.

---

## Step 2 — Git Feature Branch Setup

- **Sub-agent:** implementer
- **Branch name:** `feat/shell-ui-bug-fixes-round-2`
- Commit any unstaged changes, switch to `main`, create and switch to feature branch.

## Step 3 — Version Update

- **Sub-agent:** implementer
- Bump `package.json` version from `0.13.0` → `0.14.0`.
- Commit: `chore: bump version to 0.14.0`

---

## Task A — Component Bug Fixes (Tasks 1–5)

> Front-end related: **Yes** (CSS / visual behaviour changes)

### Task A — 4.1a Front-end Technical Specification
- **Sub-agent:** frontend-specialist
- Output: `.kilo/plans/20260811-task-a-frontend-spec.md`
- Scope: precise CSS rules, host class bindings, default values, visual behaviour for Tasks 1–5.

### Task A — 4.1b Analysis & Planning
- **Sub-agent:** architector
- Reads the front-end spec from 4.1a.
- Output: `.kilo/plans/20260811-task-a.md`
- Plan must cover: git branch already created, file edits, test updates, docs updates, changelog entry.

### Task A — 4.2 Implementation
- **Sub-agent:** implementer
- Files expected to change:
  - `src/components/module-container/module-container.component.scss` (Tasks 1, 2)
  - `src/components/button/cba-button.component.ts` (Tasks 3, 4, 5 — new inputs + host bindings)
  - `src/components/button/cba-button.component.html` (Tasks 3, 4, 5 — label truncation, icon-only detection)
  - `src/components/button/cba-button.component.scss` (Tasks 3, 4, 5 — truncate, icon-only, block styles)
  - `src/components/module-container/module-container.component.spec.ts` (Task 2 test — fullscreen bg-color still present)
  - `src/components/button/cba-button.component.spec.ts` (Tasks 3–5 — new input tests)
  - `docs/MODULE_CONTAINER.md` (update fullscreen and scroll sections)
  - `docs/CBA_BUTTON.md` (document new `truncate`, `block` inputs; icon-only behaviour)
  - `CHANGELOG.md` (dated `[0.14.0] — 2026-08-11` entries)
- Commit with meaningful messages per step.

### Task A — 4.3 Code Review & Simplification
- **Sub-agents:** code-reviewer + code-simplifier (concurrent)
- Output fix/simplification plan appended to `.kilo/plans/20260811-task-a.md`.
- Plan Agent reviews, then assigns 4.3-fix to implementer if needed.

### Task A — 4.4 Documentation
- **Sub-agent:** docs-specialist
- Update JSDoc in component source files.
- Update consumer docs (`docs/MODULE_CONTAINER.md`, `docs/CBA_BUTTON.md`).
- Update `CHANGELOG.md` under `[0.14.0]`.

### Task A — 4.5a Front-end Implementation Verification
- **Sub-agent:** frontend-specialist
- Verify spec from 4.1a against implementation.
- Report diffs and quality issues.

### Task A — 4.5b Overall Plan Adherence
- **Sub-agent:** architector
- Read front-end verification report from 4.5a.
- Check implementation plan adherence.
- Report deviations.

### Task A — 4.6 Task Completion
- **Sub-agent:** implementer
- Append `[DONE]` to Tasks 1–5 lines in TODO file.
- Preserve original content; only add marks.
- Commit changes.

---

## Task B — Reimplement HTML Preview File (Task 6)

> Front-end related: **Yes** (large static HTML / CSS / JS rewrite)

### Task B — 4.1a Front-end Technical Specification
- **Sub-agent:** frontend-specialist
- Output: `.kilo/plans/20260811-task-b-frontend-spec.md`
- Scope:
  - Minimizable sidebar with `localStorage` persistence.
  - Shell mockup (header + workspace + footer) using exact library CSS class names and tokens.
  - Module examples: 100% expanded, 100% collapsed, two 50% expanded in a row, two 50% collapsed in a row, one 50% collapsed.
  - Each module uses copied component SCSS from `module-header` and `module-container` (keep-in-sync comments).
  - Module header shows: drag handle, collapse, size toggle, fullscreen, remove (no real actions).
  - Module body shows a table with ≥5 rows.
  - Module footer shows status label at right.
  - Comprehensive style showcase below modules: color tokens, buttons, labels, pills, icons, text types on different backgrounds, form states, type scale, borders, selected states, status badges.
  - All values use `var(--cba-*)`; no hardcoded hexes.

### Task B — 4.1b Analysis & Planning
- **Sub-agent:** architector
- Reads the front-end spec from 4.1a.
- Output: `.kilo/plans/20260811-task-b.md`
- Plan must cover: file rewrite of `docs/theme-preview.html`, `npm run build:preview` verification, test run (`preview-html.spec.ts`), docs updates.

### Task B — 4.2 Implementation
- **Sub-agent:** implementer
- Primary file: `docs/theme-preview.html` (complete rewrite).
- Verify `npm run build:preview` still works and regenerates `docs/theme-preview.css`.
- Run `npm test` to ensure `preview-html.spec.ts` passes.
- Commit with meaningful messages.

### Task B — 4.3 Code Review & Simplification
- **Sub-agents:** code-reviewer + code-simplifier (concurrent)
- Output fix/simplification plan appended to `.kilo/plans/20260811-task-b.md`.
- Plan Agent reviews, then assigns 4.3-fix to implementer if needed.

### Task B — 4.4 Documentation
- **Sub-agent:** docs-specialist
- Update any docs referencing the preview file (README, INDEX.md, etc.).
- Update `CHANGELOG.md` under `[0.14.0]`.

### Task B — 4.5a Front-end Implementation Verification
- **Sub-agent:** frontend-specialist
- Verify spec from 4.1a against the rewritten preview.
- Check all module examples exist and render correctly.
- Check style showcase completeness.

### Task B — 4.5b Overall Plan Adherence
- **Sub-agent:** architector
- Read front-end verification report from 4.5a.
- Check plan adherence; report deviations.

### Task B — 4.6 Task Completion
- **Sub-agent:** implementer
- Append `[DONE]` to Task 6 line in TODO file.
- Preserve original content; only add mark.
- Commit changes.

---

## Step 5 — TODO File Completion

- **Sub-agent:** implementer
- Rename TODO file to `.agent/todos/20260811/20260811-todo-0-DONE.md`.
- Ensure all files committed in feature branch.
- Switch to `main`, merge feature branch.
- On success: delete feature branch.
- Push `main` to `origin` only.

## Step 6 — Finish

- Resume of realized work.
- Provide next-step instruction for any remaining TODO files.

---

## Plan Approval

Please review this global plan. Options:
- **Approve Global and Tasks Plans**: execute 4.1 per task, auto-approve per-task plans.
- **Approve Global Plan**: execute 4.1 per task, present per-task plans for your approval.
