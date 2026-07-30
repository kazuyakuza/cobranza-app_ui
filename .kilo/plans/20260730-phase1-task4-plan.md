# Phase 1, Task 4 — Implementation Plan: Theme Entry Point (`theme.scss`)

> Front-end spec: `.kilo/plans/20260730-phase1-task4-frontend-spec.md`
> TODO: `.agent/todos/20260729/20260729-todo-2.md` (Task 4)

---

## 1. Objective

Align `src/lib/theme/theme.scss` with the approved front-end spec so it becomes the canonical theme entry point for `@cobranza-apps/ui`. The file must import the four theme partials in the exact order required by downstream partials and include the spec-mandated header comment.

---

## 2. Current state vs target state

| Aspect | Current (`theme.scss`) | Target |
| --- | --- | --- |
| Header comment | `// Theme entry point. Aggregates partials; tokens, mixins and utilities in Phase 1.` | Two-line spec comment |
| Imports | `variables`, `mixins`, `utilities` (3 imports) | `variables`, `base`, `mixins`, `utilities` (4 imports) |
| `base` import | Missing | Added (between `variables` and `mixins`) |
| Import syntax | `@use` (correct) | `@use` (unchanged) |

Key change: add `@use 'base';` after `@use 'variables';` and replace the header comment with the spec-required text.

---

## 3. Pre-analysis & technical decisions

### 3.1 `_base.scss` absence

The spec explicitly states `_base.scss` does not exist yet (created by Task 5). Adding `@use 'base';` now declares the dependency correctly. This will cause `npm run build` to fail until Task 5 lands.

### 3.2 Decision: add import now vs postpone

Per spec section 2 Notes: "The entry point must include the `@use 'base';` line so the dependency is declared correctly." Decision: **add the import now** and accept that the build will fail Sass compilation until Task 5 creates `_base.scss`. The verification step (section 7) must account for this expected failure.

### 3.3 Sass `@use` ordering rationale

- `variables` first: defines `--cba-*` custom properties on `:root` consumed by all other partials.
- `base` second: provides baseline typography/element defaults that may reference variables.
- `mixins` third: reusable mixins depend on variables (and may reference base).
- `utilities` last: opt-in utility classes depend on variables and mixins.

Sass loads each `@use` module once; no `@forward` needed at this top-level entry point.

### 3.4 No `@import`

Spec requires modern `@use` syntax. No `@import` directives permitted.

### 3.5 Header comment rule compliance

- Comment placed at the very top of the file.
- No commented-out code follows (satisfies `.kilo/rules/no-commented-code.md`).
- Concise, describes file role and import order (satisfies `self-documenting-code.md`).

---

## 4. Target file contents (exact)

```scss
// Main theme entry point for @cobranza-apps/ui.
// Imports variables, base typography, mixins, and utility classes in the correct order.
@use 'variables';
@use 'base';
@use 'mixins';
@use 'utilities';
```

---

## 5. Atomic implementation steps

### Step 5.1 — Replace `src/lib/theme/theme.scss` contents

Replace the entire current file content with the exact target contents from section 4.

**File:** `src/lib/theme/theme.scss`

**Action:** Overwrite file with the exact content below (2-line header comment + 4 imports = 6 lines total). The import order is fixed: `variables` → `base` → `mixins` → `utilities`.

```scss
// Main theme entry point for @cobranza-apps/ui.
// Imports variables, base typography, mixins, and utility classes in the correct order.
@use 'variables';
@use 'base';
@use 'mixins';
@use 'utilities';
```

Use `vscode-mcp-server_create_file_code` with `overwrite=true` (preferred per `tool-selection-priority.md`) or `write` as fallback.

#### Verification of Step 5.1

Read the file back and assert:
1. Line 1 equals `// Main theme entry point for @cobranza-apps/ui.`
2. Line 2 equals `// Imports variables, base typography, mixins, and utility classes in the correct order.`
3. Line 3 equals `@use 'variables';`
4. Line 4 equals `@use 'base';`
5. Line 5 equals `@use 'mixins';`
6. Line 6 equals `@use 'utilities';`
7. Total file length is 6 lines.
8. No `@import` substring present anywhere in the file.

### Step 5.2 — Run diagnostics on the edited file

Run `vscode-mcp-server_get_diagnostics_code` scoped to `src/lib/theme/theme.scss` to confirm no editor-level errors are flagged on the entry point itself.

**Expected:** No errors/warnings on `theme.scss`. (Sass build errors due to the missing `_base.scss` will surface only at `npm run build` time, not in editor diagnostics.)

### Step 5.3 — Gitignore compliance check

Before committing, follow `.kilo/rules/gitignore-compliance.md`:

1. Read `.gitignore`.
2. Run `git status`.
3. Confirm only `src/lib/theme/theme.scss` is modified; confirm no `.gitignore`-matching files (e.g., `node_modules/`, `dist/`, `.vscode/`) are staged.

### Step 5.4 — Commit the change

Stage only `src/lib/theme/theme.scss` and commit.

**Command (single cmd per `tool-selection-priority.md`):**

```
git add src/lib/theme/theme.scss
```

```
git commit -m "feat(theme): align theme entry point import order with phase1 spec"
```

Commit message rationale: `feat` scope bump per semver (Phase 1 feature); descriptive body matches the spec alignment.

### Step 5.5 — Build verification (expected failure documented)

Run the library build to confirm Sass compilation status.

**Command:**

```
npm run build
```

**Expected outcome:** Build **fails** with a Sass error indicating `_base.scss` cannot be found (e.g., `Can't find stylesheet to import.`). This is the documented, expected state until Task 5 creates `src/lib/theme/_base.scss`.

**Action on expected failure:** Record the exact error output in the completion summary. Do NOT attempt to fix by creating `_base.scss` — that is Task 5's scope. Do NOT revert the `@use 'base';` import.

**Action on unexpected failure:** If the error is unrelated to the missing `_base.scss` (e.g., a typo in the import, an unrelated TS compilation error), investigate and report to caller.

---

## 6. Verification checklist (mapped to spec section 6)

| # | Spec check | How verified in this plan |
| --- | --- | --- |
| 1 | File exists at `src/lib/theme/theme.scss`. | Pre-existing; Step 5.1 overwrites it. |
| 2 | File starts with the required header comment. | Step 5.1 verification line 1–2. |
| 3 | File uses `@use` for all four partials. | Step 5.1 verification lines 3–6. |
| 4 | Import order is `variables` → `base` → `mixins` → `utilities`. | Step 5.1 verification lines 3–6 order. |
| 5 | No `@import` directives present. | Step 5.1 verification check 8. |
| 6 | No unrelated global styles added. | File is exactly 6 lines; nothing else added. |
| 7 | `npm run build` compiles without Sass errors. | Step 5.5 — **expected to fail** until Task 5; documented. |

---

## 7. Expected build behavior (Task 5 dependency)

Because `@use 'base';` references `_base.scss` which does not yet exist, `npm run build` will fail with a Sass "stylesheet not found" error. This is intentional and approved by the spec (section 2 Notes). Implementation must:

- Keep `@use 'base';` in the file.
- NOT create `_base.scss` (out of scope for Task 4).
- NOT remove the import to make the build pass.
- Document the exact build error in the completion summary so Task 5 can confirm resolution.

---

## 8. Out of scope (handled by other tasks)

- `_base.scss` creation → Task 5.
- `_variables.scss`, `_mixins.scss`, `_utilities.scss` → Tasks 1, 3, 2 respectively (already created).
- `ng-package.json` inclusion of SCSS files → separate config task.
- README / `docs/USAGE.md` consumer documentation → Documentation step (4.4).
- Global styles beyond the entry point → not in scope.

---

## 9. Completion signal

The implementer must finish Step 5.5 and report:

- Confirmation of the new 6-line `theme.scss` content.
- Confirmation that diagnostics on `theme.scss` show no editor errors.
- The exact `git status` output before/after commit.
- The commit SHA and message.
- The exact `npm run build` error output (expected: missing `_base.scss`).
- Explicit statement: "Task 4 implementation plan executed. Build failure is expected until Task 5 lands `_base.scss`."

---

## 10. Rollback

If rollback is required, revert the commit:

```
git revert <commit-sha>
```

This restores the prior 3-import version (`variables`, `mixins`, `utilities`) and the old header comment.