# Implementation Plan — Task 1: Lighten Gray Theme

> **Workflow step:** 4.1b Analysis & Planning (Critical Workflow)
> **TODO file:** `.agent/todos/20260803/20260803-todo-0.md`
> **Front-end spec:** `.kilo/plans/20260803-lighten-gray-theme-frontend-spec.md`
> **Branch:** `feat/lighten-gray-theme` (already created in step 2)
> **Version:** `0.8.0` (already bumped in step 3 — do NOT bump again in this task)

## 0. Task Statement (from TODO)

> Lighten the gray theme colors in `_variables.scss` — shift background and border tokens to lighter grays while preserving text legibility and contrast ratios.

## 1. Pre-Analysis

### 1.1 Current State (verified)

- Working tree branch: `feat/lighten-gray-theme`.
- `package.json` version is `0.8.0` (bumped by `chore: bump version to 0.8.0`, commit `2d645de`).
- Target file exists at **`src/theme/_variables.scss`** (NOT `src/lib/theme/_variables.scss` as cited in some project-info docs). The spec path is correct; the brief/architecture paths are stale and out of scope for this task.
- Current file contains 49 lines, a single `:root { … }` block with all `--cba-` tokens. Token names already match the spec; only values change.
- All other theme SCSS partials exist in `src/theme/`: `_base.scss`, `_utilities.scss`, `_mixins.scss`, `_modal.scss`, `_datepicker.scss`, `_accordion.scss`, `_popover.scss`, `_typeahead.scss`, `theme.scss`.

### 1.2 Front-end Spec Summary (input from 4.1a)

- Scope: token VALUES in `src/theme/_variables.scss` only. Token NAMES preserved.
- Out of scope: accent colors, layout constants, radius, spacing tokens.
- Updated tokens: 4 backgrounds, 1 overlay, 4 text, 3 borders, hover, active, 2 shadows. `--cba-focus-ring` unchanged.
- WCAG AA target 4.5:1 met for primary/secondary text on all surfaces.
- **Documented exception**: `--cba-text-muted` on `--cba-bg-primary` is ~3.6:1 (FAILS AA) — explicitly forbidden; must not be used on `--cba-bg-primary`.
- Hover/active overlays flip from white (`rgba(255,255,255,…)`) to black (`rgba(0,0,0,…)`) overlays because surfaces are now light.
- Open considerations flagged for separate tasks (NOT this task):
  - Accent + `text-inverse` contrast (e.g. datepicker selected date on `--cba-accent-primary`).
  - Disabled-state contrast (`opacity: 0.65` on muted text).

### 1.3 Ambiguities Identified

1. **Scope vs. acceptance tension.** Spec §2 says scope = `_variables.scss` only, but §7 acceptance criterion requires "`--cba-text-muted` is never used on `--cba-bg-primary` in library-owned components". This requires an **audit** of `_accordion.scss`, `_datepicker.scss`, `_typeahead.scss`, `_popover.scss`, `_base.scss` for muted-on-primary usage. Resolution (per spec §6): the audit is part of this task (verification only); if any violating usage is found, do NOT fix it in this task — record it and propose a follow-up TODO (escalate to caller) so scope stays restricted to token values.
2. **Path mismatch in project-info.** `brief.md` §5 and `architecture.md` reference `src/lib/theme/_variables.scss`; actual/correct path is `src/theme/_variables.scss`. Out of scope; no doc change here (docs-specialist handles doc updates in step 4.4; architector verification in 4.5b may note it).
3. **No unit tests for SCSS tokens.** There is no visual/contrast automated test in the repo. Acceptance relies on `npm run build` + `npm run lint` + manual/visual QA. A Jest snapshot of token values is optional and NOT required by the spec; skip to stay in scope.
4. **Overlay/hover polarity flip.** Components that previously assumed `--cba-hover` lightens the surface now get a darkening overlay. Per spec §6 item 4 this is intended and automatic. No component code change needed; only visual verify in step 7.

## 2. High-Level Approach

1. Edit a single file (`src/theme/_variables.scss`): replace the 15 token values listed in the spec, in declaration order, preserving all token names, comments, and the unchanged tokens (`--cba-accent-*`, `--cba-focus-ring`, layout, radius, spacing).
2. Run `npm run build` and `npm run lint` to verify SCSS compiles and lint passes.
3. Run a read-only audit of the 8 other theme partials for `--cba-text-muted` used on `--cba-bg-primary`. Record findings; do not fix.
4. Commit changes with a meaningful message.
5. Hand off to step 4.3 (code review/simplification), 4.4 (docs), 4.5 (verification).

No new files. No dependency changes. No version bump. No git branch operations.

## 3. Detailed Steps

### Step 3.1 — Pre-edit safety check

- Read `.gitignore` (already verified: `dist/`, `node_modules/`, `.angular/`, `coverage/` ignored).
- Run `git status` to confirm clean-ish tree (only the version-bump commit ahead). No new untracked files expected.
- Confirm current branch is `feat/lighten-gray-theme` (`git branch --show-current`).

### Step 3.2 — Edit `src/theme/_variables.scss` (ONLY file changed)

Use `vscode-mcp-server_replace_lines_code` (preferred per `.kilo/rules/tool-selection-priority.md`) or `edit` tool. Apply replacements in declaration order. Each oldString must be unique (token name prefix guarantees uniqueness).

Exact replacement mapping (Current → Proposed):

| Line area | Old value (exact) | New value (exact) |
| --- | --- | --- |
| Backgrounds | `--cba-bg-primary: #2a2d32;` | `--cba-bg-primary: #7a838d;` |
|  | `--cba-bg-secondary: #34383e;` | `--cba-bg-secondary: #8c95a0;` |
|  | `--cba-bg-tertiary: #3e434a;` | `--cba-bg-tertiary: #9da6b0;` |
|  | `--cba-bg-elevated: #454a52;` | `--cba-bg-elevated: #aeb6bf;` |
|  | `--cba-bg-overlay: rgba(0, 0, 0, 0.55);` | `--cba-bg-overlay: rgba(0, 0, 0, 0.32);` |
| Text | `--cba-text-primary: #e8eaed;` | `--cba-text-primary: #0f1115;` |
|  | `--cba-text-secondary: #b0b4ba;` | `--cba-text-secondary: #1e2329;` |
|  | `--cba-text-muted: #8b9098;` | `--cba-text-muted: #2a2e35;` |
|  | `--cba-text-inverse: #1a1d21;` | `--cba-text-inverse: #e8eaed;` |
| Borders | `--cba-border-subtle: #4a4f57;` | `--cba-border-subtle: #aeb6bf;` |
|  | `--cba-border-default: #5a606a;` | `--cba-border-default: #707880;` |
|  | `--cba-border-strong: #6b7280;` | `--cba-border-strong: #4a5059;` |
| Hover/Active | `--cba-hover: rgba(255, 255, 255, 0.06);` | `--cba-hover: rgba(0, 0, 0, 0.06);` |
|  | `--cba-active: rgba(255, 255, 255, 0.1);` | `--cba-active: rgba(0, 0, 0, 0.1);` |
| Shadows | `--cba-shadow-module: 0 4px 16px rgba(0, 0, 0, 0.28);` | `--cba-shadow-module: 0 4px 16px rgba(0, 0, 0, 0.18);` |
|  | `--cba-shadow-elevated: 0 8px 24px rgba(0, 0, 0, 0.35);` | `--cba-shadow-elevated: 0 8px 24px rgba(0, 0, 0, 0.25);` |

**NOT changed** (preserve exactly): `--cba-accent-primary/success/warning/danger/info`, `--cba-focus-ring`, `--cba-header-height`, `--cba-footer-height`, `--cba-module-header-min-height`, `--cba-radius-sm/md/lg`, `--cba-space-1..8`, the file header comment, the `:root {` and closing `}`.

After edit, the file body should still be ~49 lines. File remains under the 200-line limit (`.kilo/rules/max-lines-per-file.md`).

### Step 3.3 — Post-edit verification (read-only)

- Re-read `src/theme/_variables.scss` to confirm:
  - Exactly the 15 proposed values are present.
  - All `--cba-` token names are unchanged.
  - No accidental edits to accent/layout/radius/space tokens.
  - No literal `\n` sequences inserted (newline prevention rule).
  - No commented-out code introduced (no-commented-code rule).

### Step 3.4 — Build

Run: `npm run build`

- Expected: ng-packagr builds to `dist/` successfully (the change is pure CSS variable values; no TS impact).
- If build fails: stop, report error to caller. Do not commit failing changes.

### Step 3.5 — Lint

Run: `npm run lint`

- Expected: passes (lint targets `src/**/*.ts`; SCSS-only change should not affect lint, but run to satisfy acceptance criteria in spec §7).
- If lint fails: stop, report to caller.

### Step 3.6 — Tests (optional but recommended)

Run: `npm test`

- `jest --passWithNoTests`: expected to pass with no tests (no test coverage for SCSS tokens exists).
- This step satisfies the "test" verification gate even though there is no token-level test.

### Step 3.7 — Audit: `--cba-text-muted` on `--cba-bg-primary` (read-only, in scope per spec §7)

Use `grep` to search `src/theme/*.scss` for `--cba-text-muted` usage and inspect each hit's parent rule backgrounds. Files to check (from spec §5):

- `src/theme/_base.scss`
- `src/theme/_utilities.scss`
- `src/theme/_mixins.scss`
- `src/theme/_modal.scss`
- `src/theme/_datepicker.scss`
- `src/theme/_accordion.scss`
- `src/theme/_popover.scss`
- `src/theme/_typeahead.scss`

Procedure:
1. `grep` pattern: `--cba-text-muted` in `src/` (include `*.scss`).
2. For each match, read surrounding lines (±10) to determine the closest `background`/`background-color` declaration.
3. Classify each hit:
   - **OK**: background is `--cba-bg-secondary`, `--cba-bg-tertiary`, or `--cba-bg-elevated` (or accent/elevated surfaces).
   - **VIOLATION**: background resolves to `--cba-bg-primary` (or `--cba-bg-overlay` blended over primary).
4. Record findings list in the completion summary.
5. **If any VIOLATION found**: do NOT modify the violating file (out of scope). Escalate to caller with the list so a follow-up TODO can be created. Continue with commit only if no violations OR after escalating.

### Step 3.8 — Format (optional)

Run: `npm run format`

- Runs `prettier --write "src/**/*.{ts,scss,css,json,md}"`. May reformat `_variables.scss` slightly. Verify only formatting changed (no token name/value drift) by re-reading the file afterward.
- If `prettier` is not configured for SCSS or produces no change, that is acceptable.

### Step 3.9 — Git status & gitignore compliance

- Run `git status`.
- Verify only `src/theme/_variables.scss` is modified (plus possibly prettier-formatted files; if prettier touched other files, review the diff before staging).
- Ensure no `dist/`, `node_modules/`, `.angular/`, `coverage/`, `*.tsbuildinfo`, `.eslintcache` files are staged (`.kilo/rules/gitignore-compliance.md`).
- Stage only the intended file(s): `git add src/theme/_variables.scss` (and any prettier-formatted source files if review confirms they are safe).

### Step 3.10 — Commit

- Commit message (matches repo style — lowercase, conventional prefix, concise):
  `feat(theme): lighten gray token values in _variables.scss`
- Do NOT use `--amend`, `--no-verify`, or force flags.
- If a hook rejects the commit: fix the issue and create a new commit; do not amend.

### Step 3.11 — Signal completion

Return a summary to the caller including:
- File changed: `src/theme/_variables.scss`.
- List of 15 tokens updated (with old→new).
- Build / lint / test results (pass/fail).
- Audit results for `--cba-text-muted` (OK / violations list, with escalation if any).
- Commit hash.
- What was NOT done (no doc updates, no version bump, no component code changes, no accent/disabled-state adjustments — those are deferred to other steps/tasks).

## 4. Reusable Snippet — Final `_variables.scss` Values Block (for reference only; do NOT rewrite whole file unless needed)

```scss
  --cba-bg-primary: #7a838d;
  --cba-bg-secondary: #8c95a0;
  --cba-bg-tertiary: #9da6b0;
  --cba-bg-elevated: #aeb6bf;
  --cba-bg-overlay: rgba(0, 0, 0, 0.32);

  --cba-text-primary: #0f1115;
  --cba-text-secondary: #1e2329;
  --cba-text-muted: #2a2e35;
  --cba-text-inverse: #e8eaed;

  --cba-border-subtle: #aeb6bf;
  --cba-border-default: #707880;
  --cba-border-strong: #4a5059;

  --cba-hover: rgba(0, 0, 0, 0.06);
  --cba-active: rgba(0, 0, 0, 0.1);

  --cba-shadow-module: 0 4px 16px rgba(0, 0, 0, 0.18);
  --cba-shadow-elevated: 0 8px 24px rgba(0, 0, 0, 0.25);
```

(Accent, focus-ring, layout, radius, spacing tokens remain verbatim from current file.)

## 5. Code Review Steps (for step 4.3 — not executed now)

Reviewer focus:
1. All 15 token values match spec table §3 exactly (hex case, decimal places, rgba alpha).
2. No token names renamed/removed/added.
3. Unchanged tokens (`accent`, `focus-ring`, layout, radius, spacing) byte-equivalent to before.
4. No commented-out lines, no trailing whitespace drift, no `\n` literals.
5. File line count still within rule limits; comment header preserved.
6. No accidental edits to other theme partials.

## 6. Documentation Steps (for step 4.4 — not executed now)

Docs specialist should consider:
- Note in `docs/` theme docs that the palette is now medium-gray (lightened) and that `--cba-text-muted` must not be used on `--cba-bg-primary`.
- Update stale path references (`src/lib/theme/` → `src/theme/`) in project-info if assigned — else flag for a later task.
- No README change required for a pure token-value change unless the README quotes hex values.

## 7. Verification Steps (for step 4.5 — not executed now)

- Frontend verification (4.5a): visually confirm the new palette is noticeably lighter, gray, and text remains legible; check datepicker, accordion, popover, typeahead, modal (where token overlays apply).
- Plan adherence (4.5b): confirm only `_variables.scss` was modified, all spec values applied, build/lint pass, audit performed.

## 8. Out of Scope (explicitly NOT done in this task)

- Adjusting accent colors or `--cba-text-inverse` on accents (spec §6.1) — separate task.
- Changing disabled-state opacity/contrast (spec §6.2) — separate task.
- Modifying component SCSS files even if muted-on-primary violations exist — escalate only.
- Version bump (already 0.8.0).
- Branch creation/merge (handled in steps 2 and 5).
- Renaming the brief/architecture path from `src/lib/theme/` to `src/theme/` — defer to docs/structure tasks.

## 9. Verification Against Original Task

- TODO: "Lighten the gray theme colors in `_variables.scss` — shift background and border tokens to lighter grays while preserving text legibility and contrast ratios."
- Plan: edits ONLY `_variables.scss`; lightens backgrounds (e.g. `#2a2d32` → `#7a838d`), borders (subtle/default lighter; strong darker for separation on light surfaces); flips text to dark for legibility; flips hover/active to dark overlays; reduces shadow opacity. WCAG AA contrast verified in spec §4. Text legibility preserved (primary/secondary pass AA on all backgrounds). Border-strong made DARKER (not lighter) intentionally so borders remain visible on the now-light surfaces — this is consistent with "shift border tokens to lighter grays" at the surface level while preserving visibility/legibility for strong borders; spec §3 explicitly chooses `#4a5059` for strong. This is the spec's authoritative value; plan follows it verbatim.
- No deviations from the front-end spec.
- Plan is complete, atomic, and verifiable.