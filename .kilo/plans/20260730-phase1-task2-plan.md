# Implementation Plan — Phase 1, Task 2: Utility Classes

## Reference

- TODO: `.agent/todos/20260729/20260729-todo-2.md` → Task 2 (Utility classes `_utilities.scss`)
- Front-end spec: `.kilo/plans/20260730-phase1-task2-frontend-spec.md`
- Brief tokens: `.agent/project-info/brief.md` §5
- Dependency (done): `src/lib/theme/_variables.scss` defines all `--cba-*` tokens under `:root`

---

## 1. High-level approach

Replace the single-line placeholder in `src/lib/theme/_utilities.scss` with the full, minimal utility-class set: backgrounds, text, borders, radius, shadows, and a numeric spacing scale (padding + margin). Every value is expressed as `var(--cba-*)`; no literal colors or pixel values are introduced. The file is a pure partial; tokens are already exposed globally via `_variables.scss` under `:root`, so no `@use` import of variables is needed inside `_utilities.scss` (variables are not SCSS variables, they are CSS custom properties resolved at runtime in the browser). `theme.scss` already contains `@use 'utilities';` in the correct order — no change required there.

Spacing helpers use a SCSS `@each` loop over the scale keys `1, 2, 3, 4, 5, 6, 8` (matching `--cba-space-*`), emitting `.cba-p-#{$scale}` and `.cba-m-#{$scale}`. No directional spacing helpers (`mt-*`, `pr-*`) are added — out of scope for this task.

---

## 2. Target file

- **Path:** `src/lib/theme/_utilities.scss`
- **Action:** overwrite (currently a 1-line placeholder).
- **Tool:** `vscode-mcp-server_create_file_code` with `overwrite: true` (file is small, complete rewrite).

---

## 3. SCSS code to write

```scss
/**
 * Utility classes for @cobranza-apps/ui (Phase 1).
 * All values reference --cba-* tokens defined in _variables.scss (:root).
 * No hard-coded colors or pixel values live here.
 * Border utilities are color-only; pair with Bootstrap's .border / .border-1
 * to render the line (Bootstrap 5 is an expected peer dependency).
 */

/* Backgrounds */
.cba-bg-primary {
  background-color: var(--cba-bg-primary);
}

.cba-bg-secondary {
  background-color: var(--cba-bg-secondary);
}

.cba-bg-tertiary {
  background-color: var(--cba-bg-tertiary);
}

.cba-bg-elevated {
  background-color: var(--cba-bg-elevated);
}

/* Text */
.cba-text-primary {
  color: var(--cba-text-primary);
}

.cba-text-secondary {
  color: var(--cba-text-secondary);
}

.cba-text-muted {
  color: var(--cba-text-muted);
}

.cba-text-inverse {
  color: var(--cba-text-inverse);
}

/* Borders (color-only) */
.cba-border-subtle {
  border-color: var(--cba-border-subtle);
}

.cba-border-default {
  border-color: var(--cba-border-default);
}

.cba-border-strong {
  border-color: var(--cba-border-strong);
}

/* Radius */
.cba-radius-sm {
  border-radius: var(--cba-radius-sm);
}

.cba-radius-md {
  border-radius: var(--cba-radius-md);
}

.cba-radius-lg {
  border-radius: var(--cba-radius-lg);
}

/* Shadows */
.cba-shadow-module {
  box-shadow: var(--cba-shadow-module);
}

.cba-shadow-elevated {
  box-shadow: var(--cba-shadow-elevated);
}

/* Spacing helpers — numeric scale matching --cba-space-* */
$spacing-scales: 1, 2, 3, 4, 5, 6, 8;

@each $scale in $spacing-scales {
  .cba-p-#{$scale} {
    padding: var(--cba-space-#{$scale});
  }

  .cba-m-#{$scale} {
    margin: var(--cba-space-#{$scale});
  }
}
```

### Resulting class inventory (16 + 14 = 30 classes)

- Backgrounds (4): `.cba-bg-primary`, `.cba-bg-secondary`, `.cba-bg-tertiary`, `.cba-bg-elevated`
- Text (4): `.cba-text-primary`, `.cba-text-secondary`, `.cba-text-muted`, `.cba-text-inverse`
- Borders (3): `.cba-border-subtle`, `.cba-border-default`, `.cba-border-strong`
- Radius (3): `.cba-radius-sm`, `.cba-radius-md`, `.cba-radius-lg`
- Shadows (2): `.cba-shadow-module`, `.cba-shadow-elevated`
- Padding (7): `.cba-p-1` … `.cba-p-6`, `.cba-p-8`
- Margin (7): `.cba-m-1` … `.cba-m-6`, `.cba-m-8`

All match the front-end spec sections 3–8 and TODO Task 2 lists. No extra classes added.

---

## 4. Rules compliance check

- **max-lines-per-file:** file ~90 lines, well under 200; effective code ~80 lines. OK.
- **newline-prevention:** real newlines only, no `\n` literals.
- **no-commented-code:** no commented-out code; only documentation header comments.
- **self-documenting-code:** class names are descriptive; header comment explains scope and the Bootstrap border pairing requirement.
- **max-arguments-per-method:** N/A (SCSS, no methods).
- **max-depth:** loop body is one level deep; OK.
- **prefer-private-members:** N/A (SCSS partial).
- **tool-selection-priority:** use mcp `create_file_code` (structured editor) for file creation/overwrite.

---

## 5. Verification steps

1. **Read back** the written file with `vscode-mcp-server_read_file_code` to confirm content matches §3 exactly (no escaped `\n`, no truncation).
2. **Diagnostics:** run `vscode-mcp-server_get_diagnostics_code` on `src/lib/theme/_utilities.scss` (severities 0,1) — expect no errors/warnings.
3. **Build:** run `npm run build` (`ng build` / ng-packagr) — must succeed with no Sass compilation errors. Single command, no chaining.
4. **Lint:** run `npm run lint` — must stay green (no unused/commented-code violations).
5. **Tests:** run `npm test` — must stay green (no SCSS unit tests expected, but suite must not break).
6. **Spot-check import order:** confirm `theme.scss` still lists `@use 'variables';` → `@use 'mixins';` → `@use 'utilities';` (already correct; not modified by this task).
7. **Token grep:** run a ripgrep search for literal hex/pixel patterns inside `_utilities.scss` to confirm none exist (no `#[0-9a-f]{3,6}`, no `[0-9]+px`); only `var(--cba-*)` references and the SCSS `$spacing-scales` list key integers.
8. **Class coverage grep:** confirm each expected class name from §3 appears exactly once as a selector (no duplicates, no missing).

---

## 6. Git actions

- **Pre-commit:** run `git status` and read `.gitignore`; ensure no `node_modules/`, `dist/`, or build artifacts are staged (gitignore-compliance rule). Only `src/lib/theme/_utilities.scss` should be modified.
- **Commit message:**
  ```
  feat(theme): add Phase 1 utility classes (bg, text, border, radius, shadow, spacing)
  ```
- **Branch:** stay on current feature branch (set by Step 2 of critical workflow, e.g. `feat/phase1-theme-foundation`). Do NOT switch branches or push in this sub-step — that is handled by later critical-workflow steps.

---

## 7. Out of scope (do NOT do)

- Do not modify `_variables.scss`, `theme.scss`, or `_mixins.scss` (Task 1 done; Tasks 3/4 handled separately).
- Do not add directional spacing utilities (`mt-*`, `pr-*`, `px-*`).
- Do not add accent / interactive-state / overlay utility classes (not requested).
- Do not add typography rules here (Task 5 handles base typography).
- Do not update README/docs in this sub-step (Task 9 handles docs).
- Do not run Step 4.6 (Task Completion / TODO `[DONE]` marking) — that is a separate sub-step.
- Do not push or merge branches.

---

## 8. Acceptance criteria mapping

| Spec §9 | This plan |
| --- | --- |
| 1. File exists & compiles in SCSS pipeline | §3 overwrites file; §5 verifies build |
| 2. Contains all classes §3–8 | §3 class inventory = 30 classes covering all sections |
| 3. Every class uses `--cba-*`; no literals | §3 code uses only `var(--cba-*)`; §5 step 7 grep-verifies |
| 4. Tokens available via `_variables.scss` / `theme.scss` | `_variables.scss` already exists (Task 1); `theme.scss` already imports utilities |
| 5. No extra classes beyond spec | §3 + §3 inventory; §7 out-of-scope list |
| 6. `ng build`, `npm test`, `npm run lint` pass | §5 steps 3–5 |

---

## 9. Deliverable

The single deliverable of this sub-step is the saved plan file (this document):
`.kilo/plans/20260730-phase1-task2-plan.md`

Implementation (4.2) will follow this plan in a separate sub-agent invocation.