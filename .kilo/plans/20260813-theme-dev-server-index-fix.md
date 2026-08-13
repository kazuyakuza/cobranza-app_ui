# Global Plan — Fix Angular dev-server `@use '@cobranza-apps/ui/theme';` resolution

**TODO file:** `.agent/todos/20260812/20260812-todo-2.md`
**Plan file:** `.kilo/plans/20260813-theme-dev-server-index-fix.md`
**Branch naming:** `fix/theme-import-dev-server` (reuse existing concept; create fresh branch from `main`)
**Task count:** 1 (the TODO describes a single library fix with implementation + changelog/docs update)
**Front-end related:** No (this is a library packaging / Sass resolution fix; no UI components or visual changes)

---

## Pre-Analysis

**Problem:** `@use '@cobranza-apps/ui/theme';` fails in `ng serve` even after v0.15.1 added a package-root `src/theme.scss` shim.

**Root cause:** Angular's dev-server Sass importer (`@angular/build/src/tools/esbuild/stylesheets/sass-language.js`) resolves `@cobranza-apps/ui/theme` by joining `<packageRoot>/theme` and looking for that as a **file** without appending `.scss`. The 0.15.1 `theme.scss` at the package root is therefore never found. The importer then falls back to `loadPaths`.

**Fix:** Add `src/theme/_index.scss` (a Sass partial inside the existing `theme/` directory) containing `@forward './theme.scss';`. When Angular joins the specifier to `node_modules/@cobranza-apps/ui/theme`, the path now points at a **directory**, and the standard Sass compiler resolves it to `theme/_index.scss` via Sass's built-in directory-index resolution — no `.scss` suffix needed and no package-export conditions involved.

**Build config:** `ng-package.json` already has an asset entry `{ "glob": "**/*.scss", "input": "src/theme", "output": "theme" }`, which will automatically copy `src/theme/_index.scss` to `dist/theme/_index.scss`. No `ng-package.json` changes required.

**Version:** Bump `0.15.1` → `0.15.2` (patch; fix to a previous fix).

**Docs impact:**
- `CHANGELOG.md` — add dated `[0.15.2] — 2026-08-13` `Fixed` entry explaining the `_index.scss` mechanism and referencing this TODO.
- `.agent/project-info/context.md` — update Recent Changes with the new fix.
- `docs/THEME.md` — optionally update the `src/theme/` cross-reference list to include `_index.scss` (minor accuracy improvement).
- `docs/CONSUMER_GUIDE.md`, `README.md` — no changes needed; they already state the canonical import `@use '@cobranza-apps/ui/theme';` without explaining internal resolution.

---

## Step 2: Git Feature Branch Setup
- **Sub-agent:** implementer
- Ensure `main` is clean and up to date.
- Create and switch to `fix/theme-import-dev-server`.

## Step 3: Version Update
- **Sub-agent:** implementer
- Bump `package.json` version from `0.15.1` to `0.15.2`.
- Commit: `chore: bump version to 0.15.2`.

## Task 1: Theme dev-server import fix

### 4.1b Analysis & Planning
- **Sub-agent:** architector
- Research the exact Sass directory-index resolution rules and Angular importer behavior to confirm the `_index.scss` approach.
- Produce a detailed per-task implementation plan saved to `.kilo/plans/20260813-theme-dev-server-index-fix-task-plan.md`.
- Include steps for: file creation, build verification, changelog update, context update, optional THEME.md cross-reference update.
- Plan Agent presents to user for approval.

### 4.2 Implementation
- **Sub-agent:** implementer
- Follow the approved per-task plan.
- Key actions:
  1. Create `src/theme/_index.scss` with `@forward './theme.scss';` and a concise comment block explaining its purpose (Angular dev-server directory-index resolution).
  2. Bump `package.json` version to `0.15.2` (if not already done in Step 3).
  3. Update `CHANGELOG.md` with `[0.15.2] — 2026-08-13` under `Fixed`, describing the `_index.scss` fix.
  4. Update `.agent/project-info/context.md` Recent Changes with the fix.
  5. Optionally update `docs/THEME.md` cross-references to list `_index.scss`.
  6. Run `npm run build` and verify `dist/theme/_index.scss` exists.
  7. Run `npm run test` and `npm run lint`; ensure both pass.
- Commit with meaningful messages per step.

### 4.3 Code Review & Simplification
- **Sub-agent:** code-reviewer + code-simplifier (concurrent)
- Review the new `_index.scss`, version bump, changelog entry, and context update for correctness, clarity, and adherence to the plan.
- Simplifier checks if the `_index.scss` comment block can be made shorter while preserving necessary context.
- Both generate fix/simplification plans; Plan Agent assigns to implementer if needed.
- Max 3 review cycles.

### 4.4 Documentation
- **Sub-agent:** docs-specialist
- Verify `CHANGELOG.md` entry follows Keep a Changelog format and references relevant docs.
- Verify `context.md` entry is consistent with the changelog.
- Verify `docs/THEME.md` cross-reference list is accurate.
- Add JSDoc-style comment block in `src/theme/_index.scss` if not already present, with links to `docs/THEME.md` and this TODO.

### 4.5b Overall Plan Adherence
- **Sub-agent:** architector
- Check that:
  - `src/theme/_index.scss` was created with correct content.
  - `dist/theme/_index.scss` is produced by `npm run build`.
  - `package.json` version is `0.15.2`.
  - `CHANGELOG.md` has a dated `[0.15.2]` header under `Fixed`.
  - No `[Unreleased]` section was introduced.
  - Tests and lint pass.
- Report any deviations.

### 4.6 Task Completion
- **Sub-agent:** implementer
- Add `[DONE]` to the task in `.agent/todos/20260812/20260812-todo-2.md`.
- Mark any sub-items as done.
- Commit changes with meaningful message.

---

## Step 5: TODO File Completion
- **Sub-agent:** implementer
- Rename `.agent/todos/20260812/20260812-todo-2.md` to `.agent/todos/20260812/20260812-todo-2-DONE.md`.
- Ensure all files are committed in `fix/theme-import-dev-server`.
- Merge `fix/theme-import-dev-server` into `main`.
- On success, delete the feature branch.
- Push `main` to `origin` only.

---

## Cross-Reference
- [TODO file](../.agent/todos/20260812/20260812-todo-2.md)
- [Project Brief](../.agent/project-info/brief.md) — scope, tokens, integration notes.
- [Context](../.agent/project-info/context.md) — current status, recent changes.
