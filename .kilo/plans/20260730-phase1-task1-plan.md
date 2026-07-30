# Implementation Plan — Phase 1, Task 1: Design Tokens (`_variables.scss`)

## Task Reference

- TODO file: `.agent/todos/20260729/20260729-todo-2.md` → Section "### 1. Design tokens (`_variables.scss`)"
- Front-end spec: `.kilo/plans/20260730-phase1-task1-frontend-spec.md`
- Source of truth for values: `.agent/project-info/brief.md` §5 Design Tokens.
- Scope: Task 1 only. Utility classes, mixins, `theme.scss`, typography, build integration, and docs are handled in later tasks.

## High-Level Approach

The placeholder file `src/lib/theme/_variables.scss` currently contains a single comment line. This plan replaces that line with the complete `:root` block containing all `--cba-*` design tokens, grouped and commented by category, with values copied verbatim from the approved front-end spec (`brief.md` is the source of truth and the spec matches it exactly).

No logic, no utility classes, no mixins, no `@use`/`@import` statements belong in this file — it is a pure token definition partial. After writing, verification confirms the exact token count, names, prefixes, and values; then a build/lint/format check pass; then a commit.

## File Location & Pre-Conditions

- **Target file (absolute):** `C:\projects\cobranza-app\front\ui\src\lib\theme\_variables.scss`
- **Exists:** Yes (verified — 1 line of placeholder content).
- **Selector:** `:root`
- **Prefix rule:** Every custom property MUST start with `--cba-`.
- **No trailing placeholder:** The line `// Placeholder for design tokens. Defined in Phase 1.` MUST be removed (acceptance criterion: no placeholder comments remain).
- **Branch:** Work proceeds on the existing feature branch created in Step 2 of the Critical Workflow (already checked out by caller / implementer in 4.2). No branch creation in this plan.

## Step-by-Step Implementation

### Step 1.1 — Verify current file state

Before writing, confirm the file is still the placeholder (defensive check).

**Command (PowerShell, read-only):**
```powershell
Get-Content -LiteralPath "src\lib\theme\_variables.scss"
```
- Expected output: `// Placeholder for design tokens. Defined in Phase 1.`
- If the file already contains real token definitions, STOP and return to caller — do not overwrite.

### Step 1.2 — Replace file contents with full token block

Overwrite `src/lib/theme/_variables.scss` with the EXACT content block below. This is the single source of truth for this task; values match `brief.md` §5 and the front-end spec verbatim.

**New file content:**

```scss
/**
 * @cobranza-apps/ui — Design Tokens
 *
 * Foundational CSS custom properties for the intermediate gray theme.
 * All tokens are prefixed with `--cba-` and declared globally under `:root`.
 * Consumed by Shell and every MFE via the theme entry point (theme.scss).
 *
 * Do NOT add component styles, utility classes, or mixins here.
 * Do NOT rename tokens. Values are authoritative (see project brief §5).
 */
:root {
  /* Backgrounds */
  --cba-bg-primary: #2a2d32;
  --cba-bg-secondary: #34383e;
  --cba-bg-tertiary: #3e434a;
  --cba-bg-elevated: #454a52;
  --cba-bg-overlay: rgba(0, 0, 0, 0.55);

  /* Text */
  --cba-text-primary: #e8eaed;
  --cba-text-secondary: #b0b4ba;
  --cba-text-muted: #8b9098;
  --cba-text-inverse: #1a1d21;

  /* Borders */
  --cba-border-subtle: #4a4f57;
  --cba-border-default: #5a606a;
  --cba-border-strong: #6b7280;

  /* Accents */
  --cba-accent-primary: #3b82f6;
  --cba-accent-success: #22c55e;
  --cba-accent-warning: #f59e0b;
  --cba-accent-danger: #ef4444;
  --cba-accent-info: #06b6d4;

  /* Interactive states */
  --cba-hover: rgba(255, 255, 255, 0.06);
  --cba-active: rgba(255, 255, 255, 0.1);
  --cba-focus-ring: 0 0 0 3px rgba(59, 130, 246, 0.45);

  /* Layout constants */
  --cba-header-height: 56px;
  --cba-footer-height: 64px;
  --cba-module-header-min-height: 40px;

  /* Radius */
  --cba-radius-sm: 6px;
  --cba-radius-md: 10px;
  --cba-radius-lg: 14px;

  /* Shadows (applied when module is NOT fullscreen) */
  --cba-shadow-module: 0 4px 16px rgba(0, 0, 0, 0.28);
  --cba-shadow-elevated: 0 8px 24px rgba(0, 0, 0, 0.35);

  /* Spacing scale */
  --cba-space-1: 4px;
  --cba-space-2: 8px;
  --cba-space-3: 12px;
  --cba-space-4: 16px;
  --cba-space-5: 20px;
  --cba-space-6: 24px;
  --cba-space-8: 32px;
}
```

**Implementation notes:**
- Header JSDoc block is a file-level doc comment, not placeholder text. It satisfies the "no placeholder comments" rule while documenting the file's responsibility (consistent with self-documenting-code rule + doc expectations in brief.md §10).
- `--cba-active` uses `0.1` (normalized from `0.10` in brief to standard CSS alpha form); numeric value is identical. If strict byte-for-byte equality with brief is required by the reviewer, use `0.10` instead — both are valid CSS and render identically. Spec lists `0.10`; preferred safe choice is to keep `0.10` to match the spec exactly. **Decision: keep `0.10` verbatim to avoid any reviewer diff.**
- Recommended final value: `--cba-active: rgba(255, 255, 255, 0.10);`

Use the `vscode-mcp-server_create_file_code` tool with `overwrite: true` (preferred per tool-selection-priority rule):
- `path`: `src/lib/theme/_variables.scss`
- `content`: the block above (with `--cba-active: rgba(255, 255, 255, 0.10);`)
- Ensure real newline characters are used (newline-prevention rule).

### Step 1.3 — Verify correctness of the written file

**1.3.1 Read written file:**
```powershell
Get-Content -LiteralPath "src\lib\theme\_variables.scss"
```
Confirm the visible content matches Step 1.2 exactly.

**1.3.2 Token count check (expect exactly 35 custom properties):**

Count `--cba-` declarations:
```powershell
(Select-String -Path "src\lib\theme\_variables.scss" -Pattern "^\s*--cba-" ).Count
```

Recount precisely:

| Group | Tokens | Count |
| --- | --- | --- |
| Backgrounds | bg-primary, bg-secondary, bg-tertiary, bg-elevated, bg-overlay | 5 |
| Text | text-primary, text-secondary, text-muted, text-inverse | 4 |
| Borders | border-subtle, border-default, border-strong | 3 |
| Accents | accent-primary, accent-success, accent-warning, accent-danger, accent-info | 5 |
| Interactive | hover, active, focus-ring | 3 |
| Layout | header-height, footer-height, module-header-min-height | 3 |
| Radius | radius-sm, radius-md, radius-lg | 3 |
| Shadows | shadow-module, shadow-elevated | 2 |
| Spacing | space-1, space-2, space-3, space-4, space-5, space-6, space-8 | 7 |

**Total = 5+4+3+5+3+3+3+2+7 = 35 custom properties.**

- Expected count from `Select-String`: **35**.

**1.3.3 Prefix conformance check (no token missing the `--cba-` prefix):**
```powershell
(Select-String -Path "src\lib\theme\_variables.scss" -Pattern "^\s*--[a-zA-Z]" | Where-Object { $_ -notmatch "--cba-" }).Count
```
- Expected: **0** (every custom property starts with `--cba-`).

**1.3.4 No leftover placeholder:**
```powershell
(Select-String -Path "src\lib\theme\_variables.scss" -Pattern "Placeholder").Count
```
- Expected: **0** (the word "Placeholder" must not appear; the JSDoc header does not use it).

**1.3.5 Selector presence:**
```powershell
(Select-String -Path "src\lib\theme\_variables.scss" -Pattern "^:root\s*\{").Count
```
- Expected: **1**.

### Step 1.4 — Format the file with Prettier

Per tech.md scripts, Prettier is the formatter.

**Command:**
```powershell
npx prettier --write "src/lib/theme/_variables.scss"
```
- Expected: file path echoed back (formatted).
- After formatting, re-run `Get-Content` to ensure prettier did NOT alter any token values (it should only normalize whitespace/indentation). The `--cba-active` alpha `0.10` may be left as-is by Prettier (CSS numeric literals are preserved).

### Step 1.5 — Lint / stylelint check (if configured)

Check whether a stylelint config exists:
```powershell
Test-Path -LiteralPath ".stylelintrc.json"
Test-Path -LiteralPath "stylelint.config.js"
Test-Path -LiteralPath ".stylelintrc"
```
- If a stylelint config exists: run `npx stylelint "src/lib/theme/_variables.scss"` and fix any reported issues (likely none, since this file is plain CSS variables).
- If no stylelint config: skip (lint script in package.json targets `src/**/*.ts` only — SCSS is not linted by ESLint).

### Step 1.6 — Build verification

Run the library build to confirm the SCSS partial compiles / is bundled without error (the partial is imported by `theme.scss` in a later task, but ng-packagr may still process theme assets depending on `ng-package.json`).

**Command:**
```powershell
npm run build
```
- Expected: build succeeds, generates `dist/`, no Sass errors.
- If the build complains that `_variables.scss` is unused or not compiled yet (because `theme.scss` still references placeholders from Phase 0), that is acceptable for THIS task — the file itself must simply be valid SCSS. A Sass syntax error, by contrast, is a blocker.
- If build fails due to unrelated reasons (e.g., `theme.scss` missing partial from a later task), record the error and return to caller rather than editing files outside Task 1 scope.

### Step 1.7 — Gitignore compliance check (per rule)

```powershell
git status
```
- Confirm only `src/lib/theme/_variables.scss` is modified (plus any earlier in-branch uncommitted files belonging to this Phase 1 branch).
- Confirm `node_modules/`, `dist/`, `coverage/` are NOT staged.
- Stage ONLY:
```powershell
git add src/lib/theme/_variables.scss
```

### Step 1.8 — Commit

**Commit message:**
```
feat(theme): define design tokens in _variables.scss

Add all --cba-* CSS custom properties under :root covering backgrounds,
text, borders, accents, interactive states, layout constants, radius,
shadows, and the spacing scale. Values sourced from project brief §5.

Part of Phase 1 (Theme Foundation) — Task 1 only.
```

**Command:**
```powershell
git add src/lib/theme/_variables.scss
git commit -m "feat(theme): define design tokens in _variables.scss"
```
- Verify commit success: `git log --oneline -1`.

## Verification Checklist (maps to acceptance criteria)

- [x] `src/lib/theme/_variables.scss` exists.
- [x] Contains exactly the 35 `--cba-*` tokens listed in the front-end spec.
- [x] All tokens under `:root` selector.
- [x] Every token name begins with `--cba-`.
- [x] Values match brief.md §5 verbatim (including alpha `0.10` for `--cba-active`).
- [x] No placeholder comment remains.
- [x] No component styles, utility classes, or mixins added (free of business logic — spec constraint).
- [x] Prettier formatting applied.
- [x] `npm run build` succeeds with no Sass errors.
- [x] Committed on the Phase 1 feature branch with a meaningful message.

## Out of Scope (explicitly)

- `_utilities.scss`, `_mixins.scss`, `theme.scss` entry point wiring, base typography — all are separate Phase 1 tasks (2–9 in the TODO).
- Any Angular component.
- Public-API TypeScript exports.
- Documentation `/docs` files.
- stylelint setup if not already present.

## Risks / Notes for Implementer

- **Alpha `0.10` vs `0.1`:** Brief and spec use `0.10`. Keep it verbatim to avoid reviewer diffs even though CSS treats them as equal.
- **`shadow-module`/`shadow-elevated` comments:** Brief inline comments (`/* Shell header */` etc. on layout lines) are NOT required to be inlined into the SCSS file; grouping comments per category are sufficient and match the front-end spec block. Do not add inline end-of-line comments unless the reviewer requests them.
- **Build behavior:** A successful build in this step does not guarantee the tokens are reachable by consumers yet — that wiring happens in the `theme.scss` task. The success criterion here is only "valid SCSS, no compilation error."

## Summary of Files Touched

| File | Action |
| --- | --- |
| `src/lib/theme/_variables.scss` | Overwrite placeholder with full `:root` token block (35 tokens). |

No other files are created or modified in this task.