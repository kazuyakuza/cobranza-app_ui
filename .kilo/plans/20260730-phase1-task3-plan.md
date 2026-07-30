# Implementation Plan — Phase 1, Task 3: Theme Mixins (`_mixins.scss`)

**Project:** `@cobranza-apps/ui`
**File:** `src/lib/theme/_mixins.scss`
**Date:** 2026-07-30
**Related:**
- Front-end spec: `.kilo/plans/20260730-phase1-task3-frontend-spec.md`
- TODO: `.agent/todos/20260729/20260729-todo-2.md` (Task 3, §132–156)
- Tokens: `src/lib/theme/_variables.scss`
- Entry: `src/lib/theme/theme.scss`

## 1. Objective

Replace the placeholder content of `src/lib/theme/_mixins.scss` with the three required SCSS mixins defined in the front-end spec §3. Mixins must consume only `--cba-*` tokens defined in `_variables.scss`, and must emit no CSS on their own.

## 2. Current State

- `src/lib/theme/_mixins.scss` currently contains a single placeholder comment:
  ```scss
  // Placeholder for SCSS mixins. Defined in Phase 1.
  ```
- `src/lib/theme/theme.scss` already imports the partial:
  ```scss
  @use 'variables';
  @use 'mixins';
  @use 'utilities';
  ```
- All tokens referenced by the mixins exist in `_variables.scss`:
  - `--cba-focus-ring`
  - `--cba-bg-elevated`, `--cba-border-subtle`, `--cba-radius-md`, `--cba-shadow-module`
  - `--cba-hover`

## 3. Technical Decisions

- **Language:** SCSS (Dart Sass), modern `@use` model — no `@import`.
- **Encapsulation:** Only `@mixin` declarations in the file. No `:root`, no selectors, no emitted CSS. Mixins become usable by `theme.scss` consumers via namespaced `@use` (e.g., `@use 'mixins' as *;` then `@include cba-focus-ring;`).
- **No hard-coded values:** Every property value uses `var(--cba-*)`. The `1px solid` border width is a literal structural value per spec §3.2; color/radius/shadow all come from tokens.
- **File header comment:** A short JSDoc-style comment documenting the partial's responsibility (per TODO §217: "Add brief comments at the top of each SCSS partial describing its responsibility").
- **Scope:** Exactly the three mixins from spec §3. No additional mixins (spec §4 explicitly defers `cba-active-surface` and `cba-transition` to the future).

## 4. Atomic Steps

### Step 4.1 — Replace the placeholder file content

**File:** `src/lib/theme/_mixins.scss`

Replace the entire current content (the single placeholder comment line) with the exact content below.

**Exact SCSS to write:**

```scss
/**
 * Theme mixins — reusable SCSS mixins consuming `--cba-*` tokens.
 * Mixins emit no CSS until invoked by a component or utility via @include.
 * Tokens are defined in `_variables.scss`.
 */

@mixin cba-focus-ring {
  outline: none;
  box-shadow: var(--cba-focus-ring);
}

@mixin cba-elevated-surface {
  background-color: var(--cba-bg-elevated);
  border: 1px solid var(--cba-border-subtle);
  border-radius: var(--cba-radius-md);
  box-shadow: var(--cba-shadow-module);
}

@mixin cba-hover-surface {
  &:hover {
    background-color: var(--cba-hover);
  }
}
```

**Implementation tool preference:** `vscode-mcp-server_create_file_code` with `overwrite: true` (full file rewrite, small file — fits structured editor).

### Step 4.2 — Verify acceptance criteria (local checks, no commit)

Perform the following read-only verifications:

1. **Mixin presence — spec §6 criterion #2:**
   - `grep` `_mixins.scss` for `@mixin cba-focus-ring`, `@mixin cba-elevated-surface`, `@mixin cba-hover-surface`. All three must match exactly once.
2. **No hard-coded values — spec §6 criterion #3 / §7 hint:**
   - `grep` `_mixins.scss` for `#[0-9a-fA-F]{3,8}` and `rgb` / `rgba` literals. Expect zero matches (other than inside the header comment, which contains none).
3. **No emitted CSS — spec §6 criterion #4:**
   - Confirm via `vscode-mcp-server_get_document_symbols_code` or read that the file contains only `@mixin` declarations plus the header comment. No bare selectors, no `:root`.
4. **Entry import intact — spec §6 criterion #5:**
   - `read` `src/lib/theme/theme.scss`; confirm it still has `@use 'mixins';` (untouched by this task).

### Step 4.3 — Build verification

Run the library build to confirm no Sass compilation errors (spec §6 criterion #6):

```bash
npm run build
```

- Expected: build succeeds; no Sass/Dart Sass errors referencing `_mixins.scss` or `theme.scss`.
- If a compilation error is reported referencing this partial: stop and report to caller (do not invent fixes outside the spec).

> Note: `npm run build` is the documented build script per tech stack. Only this single command is run; no chained commands.

### Step 4.4 — Diagnostics check

Run VS Code diagnostics on the modified file to catch any lint warnings:

- `vscode-mcp-server_get_diagnostics_code` with `path: "src/lib/theme/_mixins.scss"`, severities `[0, 1]`.
- Expected: no errors/warnings. If warnings appear, stop and report.

### Step 4.5 — Commit

Stage only the modified file and commit. Follow Gitignore Compliance Rule: run `git status` first, ensure only `src/lib/theme/_mixins.scss` is staged (no `node_modules/`, etc.).

```bash
git status
```

Review staged set, then:

```bash
git add src/lib/theme/_mixins.scss
```

Verify staged content:

```bash
git status
```

Commit with message:

```
feat(theme): add cba focus-ring, elevated-surface and hover-surface mixins
```

- Single `feat` commit, conventional commit style consistent with repo.
- Do NOT push (push is a later orchestration step in the Critical Workflow; push target is `origin` only per git-remote-safety rule).

## 5. File Structure Impact

No new files or folders created. `.agent/project-structure.md` does not need updating — `src/lib/theme/` already exists and is documented as the theme partials location.

## 6. Verification Summary Table

| Acceptance Criterion (spec §6) | Verification step |
| --- | --- |
| 1. `_mixins.scss` exists and replaces placeholder | Step 4.1 overwrite + read |
| 2. Three mixins defined exactly per §3 | Step 4.2.1 grep |
| 3. All values are `var(--cba-*)` tokens | Step 4.2.2 grep (no literals) |
| 4. No emitted CSS, only `@mixin` | Step 4.2.3 read/symbols |
| 5. `theme.scss` compiles (import intact) | Step 4.2.4 read + Step 4.3 build |
| 6. Library build succeeds | Step 4.3 `npm run build` |

## 7. Out of Scope

- Additional mixins (`cba-active-surface`, `cba-transition`) — deferred per spec §4.
- Modifying `theme.scss`, `_variables.scss`, or `_utilities.scss` — not required; entry already imports `mixins`.
- Documentation files (`/docs`, README theme section) — handled in TODO Task 9 by docs-specialist.
- Public API / TS exports — no change this task (TODO §201).
- Push to remote — out of scope for this sub-step.

## 8. Risks / Edge Cases

- **`@use` namespace usage:** Mixins are namespaced under `mixins.*` when consumed via `@use 'mixins';`. Consumers in later phases must either `@use 'mixins' as *;` or call `mixins.cba-focus-ring`. This is a documentation concern (Task 9), not a code change here.
- **`box-shadow` as focus ring vs. `outline`:** `outline: none` may reduce accessibility if consumers rely on default outlines. The spec explicitly accepts this trade-off; `--cba-focus-ring` provides a replacement visible indicator. No change needed.
- **`cba-hover-surface` nesting depth:** The `&:hover` block is the only nesting inside a mixin; max-depth rule (≤2) is satisfied (depth 1). No extraction needed.
- **Build pre-existing failures:** If `npm run build` was already failing before this task due to another partial, report to caller rather than editing other files.

## 9. Commit

Single commit on the current feature branch:

- Message: `feat(theme): add cba focus-ring, elevated-surface and hover-surface mixins`
- Files staged: `src/lib/theme/_mixins.scss` only.

## 10. Definition of Done for This Plan

- `src/lib/theme/_mixins.scss` contains exactly the three mixins from spec §3 plus the header comment.
- All verifications in §4 pass (greps, build, diagnostics).
- Single feat commit created on the feature branch.
- No files outside scope were modified.
- Plan file saved at `.kilo/plans/20260730-phase1-task3-plan.md`.