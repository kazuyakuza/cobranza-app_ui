# Implementation Plan — Task 5 (Phase 1: Base Typography & Defaults)

**Library:** `@cobranza-apps/ui`
**Project path:** `C:\projects\cobranza-app\front\ui`
**TODO file:** `.agent/todos/20260729/20260729-todo-2.md` — Task 5 (§"Base typography & defaults")
**Front-end spec:** `.kilo/plans/20260730-phase1-task5-frontend-spec.md`
**Plan date:** 2026-07-30
**Plan file:** `.kilo/plans/20260730-phase1-task5-plan.md`

---

## 0. Pre-analysis

### 0.1 Scope of this task

Implement the global base typography and sensible default styles for the design system by creating a new partial `src/lib/theme/_base.scss`. The file is imported by `theme.scss` (already wired in Task 4) between `_variables.scss` and `_mixins.scss` / `_utilities.scss`.

### 0.2 Current state verification (already confirmed)

- `src/lib/theme/theme.scss` currently contains:
  ```scss
  // Main theme entry point for @cobranza-apps/ui.
  // Imports variables, base typography, mixins, and utility classes in the correct order.
  @use 'variables';
  @use 'base';
  @use 'mixins';
  @use 'utilities';
  ```
  → `@use 'base';` is present and correctly ordered. **No modification to `theme.scss` is required.**
- `src/lib/theme/_variables.scss` defines every token referenced by the spec:
  `--cba-text-primary`, `--cba-text-secondary`, `--cba-accent-primary`, `--cba-accent-info`, `--cba-focus-ring`, `--cba-radius-sm`, `--cba-space-3`. Token cross-check: **all references resoluble, no missing tokens.**
- `src/lib/theme/_base.scss` does not yet exist (it is the object of this task).
- Build pipeline uses `ng-packagr -p ng-package.json -c tsconfig.lib.json` (`npm run build`).

### 0.3 Technical & architecture decisions

1. **New file only**: This task is additive; no existing source file needs editing. The `theme.scss` import was wired in Task 4.
2. **Use modern `@use` module system**: `_base.scss` consumes plain CSS custom properties (global `:root`) and emits plain CSS rule blocks. It does not need to `@use` any other partial because custom properties are global; SCSS variables are not required here.
3. **Bootstrap 5 coexistence (per spec §5)**: All selectors are low-specificity type/attribute selectors (`:root`, `body`, `h1`–`h6`, `p`, `small`, `a`, `button`, `input`, `textarea`, `select`, `[tabindex]`, `code`, `kbd`, `pre`). No `!important`. No `.btn` / `.form-control` override. Bootstrap utility classes (`.link-*`, `.text-decoration-*`, `.mb-*`) keep winning via higher specificity.
4. **Background decision**: `body` uses `background-color: transparent` to leave page background to the consumer/Bootstrap (spec §3.2 rationale).
5. **Naming**: The `.cba-text-small` helper is intentionally namespaced with the `cba-` prefix to avoid clashing with Bootstrap's `.text-*` utilities.
6. **Rule compliance**:
   - File will be ~75–90 lines including comments → under 200-line `src/` limit (rule `max-lines-per-file.md`).
   - Longest logic block (link focus chain) is shallow (≤2 nesting levels) → within `max-depth.md` (max 2).
   - No method/function params (SCSS file) → `max-arguments-per-method.md` N/A.
   - Self-documenting selectors + section banners; minimal comments → complies with `self-documenting-code.md` and `no-commented-code.md`.
   - File header banner explains responsibility → acceptable under `self-documenting-code.md`.

---

## 1. High-level approach

1. Create the new file `src/lib/theme/_base.scss` with the exact content from spec §3.8 (authoritative complete-file block).
2. Verify the file compiles by running the library build (`npm run build`).
3. Verify the compiled `theme.scss` output (under `dist/`) includes the base typography rules.
4. Commit with a meaningful message.
5. No edits to `theme.scss`, `_variables.scss`, `_mixins.scss`, or `_utilities.scss`.

---

## 2. Atomic implementation steps

### Step 2.1 — Create `src/lib/theme/_base.scss`

**Action:** Create a new file at `C:\projects\cobranza-app\front\ui\src\lib\theme\_base.scss`.

**Tool preference:** Use `vscode-mcp-server_create_file_code` (semantic file-creation tool) with `overwrite=false`, `ignoreIfExists=true`. Fall back to `write` only if the MCP tool is unavailable.

**Exact content to write** (verbatim from front-end spec §3.8 — no deviation, no extra rules, no reordering):

```scss
/**
 * Base typography and global defaults for @cobranza-apps/ui.
 * Imported by theme.scss after variables and before mixins/utilities.
 * This file intentionally does not fight Bootstrap 5; it only adds
 * complementary defaults that use the --cba-* token set.
 */

// ---------------------------------------------------------------------------
// Root typography
// ---------------------------------------------------------------------------
:root {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
  font-size: 14px;
  line-height: 1.5;
  color: var(--cba-text-primary);
}

body {
  color: var(--cba-text-primary);
  background-color: transparent;
}

// ---------------------------------------------------------------------------
// Headings
// ---------------------------------------------------------------------------
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 600;
  line-height: 1.25;
  color: var(--cba-text-primary);
}

h3,
h4,
h5,
h6 {
  font-weight: 500;
}

// ---------------------------------------------------------------------------
// Body text
// ---------------------------------------------------------------------------
p {
  margin-bottom: var(--cba-space-3);
}

small,
.cba-text-small {
  font-size: 0.857rem;
  color: var(--cba-text-secondary);
}

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------
a {
  color: var(--cba-accent-primary);
  text-decoration: none;

  &:hover {
    color: var(--cba-accent-info);
    text-decoration: underline;
  }

  &:focus-visible {
    outline: none;
    border-radius: var(--cba-radius-sm);
    box-shadow: var(--cba-focus-ring);
  }
}

// ---------------------------------------------------------------------------
// Focusable elements
// ---------------------------------------------------------------------------
button,
input,
textarea,
select,
a,
[tabindex]:not([tabindex='-1']) {
  &:focus-visible {
    outline: none;
    box-shadow: var(--cba-focus-ring);
  }
}

// ---------------------------------------------------------------------------
// Monospace text
// ---------------------------------------------------------------------------
code,
kbd,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
  font-size: 0.928em;
}
```

**Max-depth verification:**
- `a` nested `&:hover` / `&:focus-visible` → nesting level 1 (one level inside the `a` block).
- Focusable-elements group nested `&:focus-visible` → nesting level 1.
- All other blocks are flat (level 0).
→ Compliant with `max-depth.md` (max 2).

**Token usage verification (must all exist in `_variables.scss`):**
- `--cba-text-primary` ✓
- `--cba-text-secondary` ✓
- `--cba-accent-primary` ✓
- `--cba-accent-info` ✓
- `--cba-radius-sm` ✓
- `--cba-focus-ring` ✓
- `--cba-space-3` ✓

**Deviation note vs spec §3.3:** The spec's §3.3 inline listing shows a redundant `h1, h2 { font-weight: 600 }` block separately. The authoritative §3.8 "Complete file content" block omits that redundancy (the shared `h1–h6 { font-weight: 600 }` already covers it). This plan follows **§3.8 verbatim** because §3.8 is explicitly designated "The final `_base.scss` must contain exactly the following sections in this order" and §6 acceptance criteria reference §3.8. No deviation from the authoritative block.

### Step 2.2 — Verify file creation

**Action:** Confirm the file exists and content matches.

**Commands:**
1. `Test-Path -LiteralPath "src/lib/theme/_base.scss"` (PowerShell via `bash` tool) → must return `True`.
2. Read back the file with `read` tool to confirm it matches the snippet above exactly (no `\n` literals, real newlines only — `newline-prevention.md`).

**Verification target:** The file path `C:\projects\cobranza-app\front\ui\src\lib\theme\_base.scss` exists with the exact content from Step 2.1.

### Step 2.3 — Run diagnostics (lint/format)

**Action:** Run the linter / formatter on the new file to surface any SCSS issues before the build.

**Commands (run sequentially, not chained):**
1. `npm run format -- "src/lib/theme/_base.scss"` (Prettier formatting; script exists per `tech.md`).
2. `npm run lint` (ESLint covers `src/**/*.ts`; SCSS is not linted by ESLint, but the command still must not error for the overall workspace state).

> Note: There is no stylelint configured (brief §9 says "If the project already has a stylelint or Sass check, keep it green." — none exists). Skip stylelint.

### Step 2.4 — Build the library

**Action:** Compile the library to verify the SCSS compiles cleanly into the `dist/` output.

**Command:** `npm run build`

**Expected outcome:**
- Exit code 0.
- `ng-packagr` builds to `dist/`.
- No Sass compilation errors (e.g., undefined variable, missing `@use`, duplicate `@use 'base'`).
- Since `theme.scss` already references `base` with `@use 'base';`, the build output should now include the base typography rules.

**On failure:** Re-read the file, compare with spec §3.8, fix discrepancies, re-run build. Do not proceed until build is green.

### Step 2.5 — Verify compiled output contains base rules

**Action:** Inspect the compiled SCSS output inside `dist/` to confirm the base rules are emitted.

**Commands:**
1. Locate the compiled theme CSS file(s) — typically under `dist/@cobranza-apps/ui/` or similar (depends on `ng-package.json`). Use `glob` with pattern `dist/**/theme*.css` (or `.scss`, depending on how ng-packagr emits theme assets).
2. Read the located file(s) and confirm presence of:
   - A `:root { ... font-family: 'Inter', system-ui ...; font-size: 14px; ... }` rule.
   - A `body { color: var(--cba-text-primary); background-color: transparent; }` rule.
   - `h1, h2, h3, h4, h5, h6 { ... }` rule with `font-weight: 600` and `line-height: 1.25`.
   - An `a { color: var(--cba-accent-primary); ... }` rule plus `:hover` and `:focus-visible`.
   - A `:focus-visible` rule on `button, input, textarea, select, a, [tabindex]:not([tabindex='-1'])` with `box-shadow: var(--cba-focus-ring)`.
   - A `code, kbd, pre { ... ui-monospace ...; font-size: 0.928em; }` rule.

If ng-packagr ships the theme as raw `.scss` assets (not compiled CSS) rather than bundling it, instead verify the `dist/` tree contains `_base.scss` (or a copy named `base.scss`/`_base.scss`) with the expected content; document which path consumers import from.

### Step 2.6 — Acceptance criteria self-check (spec §6)

Run the following self-audit before committing (each must be `true`):

- [ ] `src/lib/theme/_base.scss` exists.
- [ ] `:root` defines `font-family: 'Inter', system-ui, ...`, `font-size: 14px`, `line-height: 1.5`, `color: var(--cba-text-primary)`.
- [ ] `body` defines `color: var(--cba-text-primary)` and `background-color: transparent`.
- [ ] `h1`–`h6` use `font-weight: 600` (overridden to 500 for `h3`–`h6`) and `line-height: 1.25`.
- [ ] `a` uses `var(--cba-accent-primary)`, `:hover` uses `var(--cba-accent-info)`, `:focus-visible` sets `box-shadow: var(--cba-focus-ring)` and `border-radius: var(--cba-radius-sm)`.
- [ ] Focusable elements (`button, input, textarea, select, a, [tabindex]:not([tabindex='-1'])`) get `box-shadow: var(--cba-focus-ring)` on `:focus-visible`.
- [ ] No `!important` declarations present in the file.
- [ ] All color values use `--cba-*` tokens (no raw hex except inside the font-family string fallbacks, which contain no colors).
- [ ] `theme.scss` still imports in order: `variables`, `base`, `mixins`, `utilities`.
- [ ] `npm run build` passes.

### Step 2.7 — Git commit

**Action:** Stage and commit the new file.

**Pre-commit compliance:**
- Follow `gitignore-compliance.md`: read `.gitignore`, run `git status`, ensure no `node_modules/`, `dist/`, lockfile-excluded artifacts are staged.
- Follow `git-remote-safety.md`: do not push in this step (push happens at TODO file completion, step 5, to `origin` only).

**Commands (sequential, single commands only — not chained):**
1. `git status`
2. `git add src/lib/theme/_base.scss`
3. `git status` (verify only the intended file is staged)
4. `git commit -m "feat(theme): add base typography and global defaults"`

**Commit message rationale:** `feat(theme): ...` because this is a new SCSS partial adding functionality (base typography) to the theme module; conventional-commit style consistent with prior phase-1 commits (`feat(theme): ...`).

### Step 2.8 — (No-op) Confirm no other files changed

**Action:** `git status` after commit must show a clean working tree (excluding `dist/` which is gitignored, and any pre-existing untracked non-task files belonging to other sessions).

If `git status` shows any unexpected modified tracked file, do NOT stage it. Investigate; if it is unrelated, leave it untouched (`preserve existing code` rule) and report it in the completion summary.

---

## 3. Out of scope (must NOT be done in this task)

- Editing `theme.scss`, `_variables.scss`, `_mixins.scss`, or `_utilities.scss` (Task 4 already wired `@use 'base';`).
- Creating `/docs` files for the theme (belongs to Task 9: Documentation phase).
- Exposing TypeScript helpers in `public-api.ts` (belongs to Task 7).
- Building components (`ModuleHeader`, `CbaButton`, etc.).
- Adding scrollbar styles (Scrum deferred to `ModuleContainer`).
- Mobile breakpoints.
- Pushing to any remote (`git-remote-safety.md` — push happens later in step 5 of Critical Workflow, to `origin` only).

---

## 4. Verification summary (for the implementer)

After completing all steps, the implementer must report:

- **Files created:** `src/lib/theme/_base.scss` (≥1).
- **Files modified:** none.
- **Build result:** `npm run build` exit code 0 / build succeeded.
- **Compiled output verified:** `dist/.../theme*.css` (or `dist/.../_base.scss` if ng-packagr ships theme as SCSS assets) contains the base typography rules listed in Step 2.5.
- **Acceptance criteria (spec §6):** all checkboxes ticked in Step 2.6.
- **Commit hash:** `<sha>` (output of the commit on `feat/phase1-theme-foundation` branch).
- **What was NOT done:** everything listed in §3 (out of scope) plus step 5 / 6 of the Critical Workflow (TODO completion, merge, push).

---

## 5. Risk & rollback

| Risk | Mitigation |
| --- | --- |
| Build fails with "Can't find stylesheet to import: base" | `theme.scss` already declares `@use 'base';`; creating `_base.scss` resolves the previously unfulfilled import. Build should turn green, not red. |
| nx/Jest cache holds stale results | If build reports a previously-missing-partial error after creating the file, clear `.angular/cache` and `dist/`; rerun `npm run build`. |
| Prettier reformats the file differently from spec §3.8 | Run `npm run format -- "src/lib/theme/_base.scss"` and verify the diff is whitespace-only (e.g., trailing commas, indentation). Acceptable; the token values and structure are unchanged. |
| Commit fails due to pre-commit hooks | Inspect hook output, fix the reported issue (likely formatting), and create a new commit. Do not amend or use `--no-verify`. |
| Rollback | `git rm src/lib/theme/_base.scss` and revert the commit (`git revert <sha>`); `theme.scss` will then fail `@use 'base';` — only do this if the task is cancelled entirely. |

---

## 6. Cross-references

- Front-end spec: `.kilo/plans/20260730-phase1-task5-frontend-spec.md`
- TODO file: `.agent/todos/20260729/20260729-todo-2.md` (Task 5)
- Design tokens (authoritative): `.agent/project-info/brief.md` §5
- Tech / scripts: `.agent/project-info/tech.md`
- Architecture: `.agent/project-info/architecture.md` (Theme Encapsulation)
- Rules applied: `max-lines-per-file.md`, `max-depth.md`, `self-documenting-code.md`, `no-commented-code.md`, `newline-prevention.md`, `gitignore-compliance.md`, `git-remote-safety.md`, `tool-selection-priority.md`.