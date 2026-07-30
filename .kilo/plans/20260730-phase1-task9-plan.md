<!--
  FILE: 20260730-phase1-task9-plan.md
  PURPOSE: Implementation plan for Task 9 — theme documentation + SCSS partial comments (Phase 1, step 9).
  PROJECT: @cobranza-apps/ui
  SOURCE SPEC: .kilo/plans/20260730-phase1-task9-frontend-spec.md
  TODO: .agent/todos/20260729/20260729-todo-2.md (Task 9, Section "### 9. Documentation & tests for this phase")
-->

# Task 9 — Implementation Plan: Theme Documentation

## 0. Scope Boundaries

- This plan covers ONLY Task 9 from the Phase 1 TODO file:
  1. Create `docs/THEME.md` and link it from `README.md`.
  2. Ensure each SCSS partial under `src/lib/theme/` has a brief top-level comment.
  3. No unit tests for pure SCSS tokens.
- **Verified finding**: All five SCSS partials already have a top-level AI-agent-friendly comment (see §3). Therefore NO SCSS files are modified.
- **Verified finding**: No `stylelint` is configured (no `.stylelintrc*`, no `stylelint` in `package.json`). The "keep stylelint green" acceptance item is N/A.

## 1. High-Level Approach

1. Create the new file `docs/THEME.md` containing the Theme Reference per the front-end spec §4.3, using `brief.md §5` and `src/lib/theme/*.scss` as the authoritative sources (values reproduced as token examples only, not duplicated as exhaustive copies).
2. Append two minimal link additions to `README.md` (Documentation section + Design Tokens cross-reference), per spec §4.2.
3. Verify the SCSS partials already carry top headers (pre-confirmed — no edits).
4. Verify build + lint still pass.
5. Commit with a meaningful message on the current feature branch.

## 2. Pre-Analysis & Technical Decisions

### Token groups to reproduce (from `_variables.scss` / brief §5)
- Backgrounds: `--cba-bg-primary`, `--cba-bg-secondary`, `--cba-bg-tertiary`, `--cba-bg-elevated`, `--cba-bg-overlay`
- Text: `--cba-text-primary`, `--cba-text-secondary`, `--cba-text-muted`, `--cba-text-inverse`
- Borders: `--cba-border-subtle`, `--cba-border-default`, `--cba-border-strong`
- Accents: `--cba-accent-primary`, `--cba-accent-success`, `--cba-accent-warning`, `--cba-accent-danger`, `--cba-accent-info`
- Interactive states: `--cba-hover`, `--cba-active`, `--cba-focus-ring`
- Layout constants: `--cba-header-height`, `--cba-footer-height`, `--cba-module-header-min-height`
- Radius: `--cba-radius-sm` (6px), `--cba-radius-md` (10px), `--cba-radius-lg` (14px)
- Shadows: `--cba-shadow-module`, `--cba-shadow-elevated`
- Spacing scale: `--cba-space-1` … `--cba-space-8` (4px–32px)
- Typography: Inter / system-ui fallback, base 14px, line-height 1.5, headings 500–600

### Import paths (from README §Quick Start + USAGE.md §Theme Import)
- SCSS (recommended): `@use '@cobranza-apps/ui/theme';`
- CSS-only fallback: `@import '@cobranza-apps/ui/theme.css';`
- Bootstrap is a CSS-only peer dependency (no jQuery).

### Utility classes (from `_utilities.scss`)
- Backgrounds: `.cba-bg-primary/secondary/tertiary/elevated`
- Text: `.cba-text-primary/secondary/muted/inverse`
- Borders (color-only): `.cba-border-subtle/default/strong`
- Radius: `.cba-radius-sm/md/lg`
- Shadows: `.cba-shadow-module/elevated`
- Spacing: `.cba-p-1…8`, `.cba-m-1…8` (scales 1,2,3,4,5,6,8)
- Border utilities are color-only → pair with Bootstrap `.border` / `.border-1`.

### Mixins (from `_mixins.scss`)
- `cba-focus-ring`, `cba-elevated-surface`, `cba-hover-surface`

### Cross-reference anchors
- brief §5 anchor: `#5-design-tokens-theme-proposal` (confirmed at brief.md line 97: `## 5. Design Tokens (Theme) (Proposal)`)

### Decision: NO SCSS edits
Spec §5.3 confirms all partials already have headers. Verified in §3 below. The "Add brief comments" sub-task in TODO §9 is effectively satisfied by the existing headers; this plan records that finding instead of making edits.

## 3. SCSS Partial Header Verification (Pre-Confirmed)

Read operations were performed during planning. Confirmed top-level comments:

| File | Header present | Action |
| --- | --- | --- |
| `src/lib/theme/_variables.scss` | Lines 1–4 JSDoc-style block | None |
| `src/lib/theme/_base.scss` | Lines 1–6 JSDoc-style block | None |
| `src/lib/theme/_mixins.scss` | Lines 1–5 JSDoc-style block | None |
| `src/lib/theme/_utilities.scss` | Lines 1–7 JSDoc-style block | None |
| `src/lib/theme/theme.scss` | Lines 1–2 `//` comment | None |

No SCSS file is modified in this task.

## 4. Atomic Steps

### Step 4.1 — Create `docs/THEME.md`

**Action**: Create a NEW file at path `docs/THEME.md`.

**Tool preference**: `vscode-mcp-server_create_file_code` (semantic file creator).

**Exact file content** (use real newlines, not `\n`):

```markdown
<!--
  AI Agent Note: This file is the QUICK REFERENCE for the @cobranza-apps/ui theme
  (tokens, import paths, utility classes, mixins). Do NOT maintain authoritative
  token values here — they live in brief.md §5 and src/lib/theme/*.scss.
  When tokens or utilities change, update the authoritative sources first, then
  reflect structural/signature changes here only.
-->

# @cobranza-apps/ui — Theme Reference

Quick reference for the intermediate-gray design system: how to import the theme, the token groups emitted on `:root`, and the opt-in utility-class catalog.

## Table of Contents

- [Importing the Theme](#importing-the-theme)
- [Token Prefix](#token-prefix)
- [Main Token Groups](#main-token-groups)
- [Utility Class Prefix](#utility-class-prefix)
- [Mixins](#mixins)
- [Cross-References](#cross-references)

## Importing the Theme

Load the theme once in a global styles file. It emits `--cba-*` CSS variables on `:root` and the opt-in `.cba-*` utility classes.

**SCSS (recommended):**

```scss
/* global-styles.scss */
@use '@cobranza-apps/ui/theme';
```

**CSS-only fallback (no SCSS toolchain):**

```css
/* global-styles.css */
@import '@cobranza-apps/ui/theme.css';
```

Notes:

- `bootstrap` is a CSS-only peer dependency (`bootstrap@^5`). Never require jQuery.
- CSS variables are global once the theme is loaded (`:root`); utility classes remain opt-in (apply only where added).
- Exact import paths are tentative until the library build is finalized; the canonical form is `@cobranza-apps/ui/theme`.

## Token Prefix

All theme CSS custom properties use the `--cba-` prefix.

Example: `--cba-bg-primary`, `--cba-text-secondary`, `--cba-accent-primary`.

Do not rename tokens. Authoritative values live in [brief.md §5](../.agent/project-info/brief.md#5-design-tokens-theme-proposal) and [`src/lib/theme/_variables.scss`](../src/lib/theme/_variables.scss).

## Main Token Groups

Example variables per group (not an exhaustive list of values — see `_variables.scss` for the full set).

- **Backgrounds** — `--cba-bg-primary`, `--cba-bg-secondary`, `--cba-bg-tertiary`, `--cba-bg-elevated`, `--cba-bg-overlay`
- **Text** — `--cba-text-primary`, `--cba-text-secondary`, `--cba-text-muted`, `--cba-text-inverse`
- **Borders** — `--cba-border-subtle`, `--cba-border-default`, `--cba-border-strong`
- **Accents** — `--cba-accent-primary`, `--cba-accent-success`, `--cba-accent-warning`, `--cba-accent-danger`, `--cba-accent-info`
- **Interactive states** — `--cba-hover`, `--cba-active`, `--cba-focus-ring`
- **Layout constants** — `--cba-header-height`, `--cba-footer-height`, `--cba-module-header-min-height`
- **Radius** — `--cba-radius-sm` (6px), `--cba-radius-md` (10px), `--cba-radius-lg` (14px)
- **Shadows** — `--cba-shadow-module`, `--cba-shadow-elevated` (applied only when not fullscreen)
- **Spacing scale** — `--cba-space-1` (4px) … `--cba-space-8` (32px)
- **Typography** — Inter (system-ui fallback), base `14px`, line-height `1.5`, headings weight 500–600

## Utility Class Prefix

All theme utility classes use the `.cba-` prefix and reference `var(--cba-*)` tokens. Generated by [`src/lib/theme/_utilities.scss`](../src/lib/theme/_utilities.scss).

- **Backgrounds** — `.cba-bg-primary`, `.cba-bg-secondary`, `.cba-bg-tertiary`, `.cba-bg-elevated`
- **Text** — `.cba-text-primary`, `.cba-text-secondary`, `.cba-text-muted`, `.cba-text-inverse`
- **Borders** (color-only) — `.cba-border-subtle`, `.cba-border-default`, `.cba-border-strong`
  - Pair with Bootstrap's `.border` / `.border-1` to actually render the line (Bootstrap 5 is the expected peer dependency).
- **Radius** — `.cba-radius-sm`, `.cba-radius-md`, `.cba-radius-lg`
- **Shadows** — `.cba-shadow-module`, `.cba-shadow-elevated`
- **Spacing** — `.cba-p-{1,2,3,4,5,6,8}` and `.cba-m-{1,2,3,4,5,6,8}` (numeric scale matching `--cba-space-*`)

## Mixins

Reusable SCSS mixins in [`src/lib/theme/_mixins.scss`](../src/lib/theme/_mixins.scss). They emit no CSS until included via `@include`.

- `@include cba-focus-ring;` — `outline: none` + `box-shadow: var(--cba-focus-ring)`.
- `@include cba-elevated-surface;` — elevated background, subtle border, `radius-md`, `shadow-module`.
- `@include cba-hover-surface;` — applies `--cba-hover` background on `:hover`.

Usage example:

```scss
@use '@cobranza-apps/ui/theme' as cba;

.card {
  @include cba.cba-elevated-surface;
  @include cba.cba-hover-surface;
}
```

## Cross-References

- [README.md](../README.md) — library overview, component inventory, integration notes.
- [docs/USAGE.md](USAGE.md) — usage patterns and component examples.
- [brief.md §5](../.agent/project-info/brief.md#5-design-tokens-theme-proposal) — authoritative design tokens.
- [`src/lib/theme/`](../src/lib/theme/) — SCSS source files (`_variables.scss`, `_base.scss`, `_mixins.scss`, `_utilities.scss`, `theme.scss`).
```

**Verification of the created file** (single command):

```powershell
Get-Content -LiteralPath "docs/THEME.md" -TotalCount 5
```

Expected: the AI Agent Note comment block + the `# @cobranza-apps/ui — Theme Reference` title.

### Step 4.2 — Edit `README.md` (Documentation section)

**Action**: Add a new bullet entry to the `## Documentation` section, directly after the existing `/docs/USAGE.md` line (current README.md line 180).

**Tool preference**: `vscode-mcp-server_replace_lines_code` (structured line editor) OR `edit` with unique surrounding context.

**Current lines 179–181**:

```markdown
## Documentation

- [`/docs/USAGE.md`](/docs/USAGE.md) — Patterns and examples for consuming the library.
```

**Replace with** (insert one new bullet between USAGE.md and the brief line):

```markdown
## Documentation

- [`/docs/USAGE.md`](/docs/USAGE.md) — Patterns and examples for consuming the library.
- [`/docs/THEME.md`](/docs/THEME.md) — Theme import, tokens, and utility classes.
```

**Exact match strings for the edit tool**:

- `oldString`:
  ```
  - [`/docs/USAGE.md`](/docs/USAGE.md) — Patterns and examples for consuming the library.
  - [Project brief](.agent/project-info/brief.md) — Source of truth for scope, design tokens, and component contracts.
  ```
- `newString`:
  ```
  - [`/docs/USAGE.md`](/docs/USAGE.md) — Patterns and examples for consuming the library.
  - [`/docs/THEME.md`](/docs/THEME.md) — Theme import, tokens, and utility classes.
  - [Project brief](.agent/project-info/brief.md) — Source of truth for scope, design tokens, and component contracts.
  ```

### Step 4.3 — Edit `README.md` (Design Tokens cross-reference)

**Action**: Add a quick-reference line at the end of the `## Design Tokens (Theme)` section, directly after the existing "full token reference" closing line (current README.md line 155).

**Current line 155**:

```markdown
For the full token reference, see [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme-proposal) and the SCSS source files under `src/lib/theme/`.
```

**Replace with**:

```markdown
For the full token reference, see [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme-proposal) and the SCSS source files under `src/lib/theme/`.

For a quick reference, see [`/docs/THEME.md`](/docs/THEME.md).
```

**Exact match strings for the edit tool**:

- `oldString`:
  ```
  For the full token reference, see [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme-proposal) and the SCSS source files under `src/lib/theme/`.

  ## Related Libraries
  ```
- `newString`:
  ```
  For the full token reference, see [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme-proposal) and the SCSS source files under `src/lib/theme/`.

  For a quick reference, see [`/docs/THEME.md`](/docs/THEME.md).

  ## Related Libraries
  ```

> Using the `## Related Libraries` line as the trailing anchor guarantees uniqueness (this heading appears once in README.md).

### Step 4.4 — Verify SCSS partials (read-only, no edits)

Confirm headers still present. Run five parallel read operations `read` on lines 1–6 of each file; confirm a top comment exists. No write actions. Records acceptance criterion "All SCSS partials … have a brief top-level comment" as PASS (already satisfied — see §3).

### Step 4.5 — Build + lint verification

Run from project root (`C:\projects\cobranza-app\front\ui`):

1. `npm run build` — library build must succeed (SCSS unaffected; only docs + README changed, but build still must pass).
2. `npm run lint` — ESLint on `src/**/*.ts` must pass (no TS changed; sanity check).
3. `npm run format` — optional sanity run (Prettier covers `.md`; if it reformats THEME.md/README.md, let it and stage the result).

> No `stylelint` exists in this project; the spec acceptance item "keep stylelint green" is N/A.

### Step 4.6 — Commit on current feature branch

Verify clean state then commit. Each separate single command:

1. `git status` — confirm only `docs/THEME.md` (new) and `README.md` (modified) are staged; no `node_modules/` etc.
2. `git add docs/THEME.md README.md`
3. `git commit -m "docs(theme): add docs/THEME.md quick reference and link from README"`

Do NOT push (push happens in the Critical Workflow Step 5 completion handled by another sub-agent). Do NOT modify the TODO file (Task 9 `[DONE]` marking is a separate 4.6 step).

## 5. Acceptance Criteria Mapping

| Spec §6 criterion | How satisfied |
| --- | --- |
| `docs/THEME.md` exists with all sections §4.3 | Step 4.1 creates the file with all 9 required sections (AI Agent Note comment, Title, TOC, Importing, Token Prefix, Main Token Groups, Utility Class Prefix, Mixins, Cross-References). |
| README.md links to `docs/THEME.md` from Documentation section | Step 4.2 inserts the bullet after `/docs/USAGE.md`. |
| README.md Design Tokens section references `docs/THEME.md` | Step 4.3 appends the quick-reference line. |
| All SCSS partials have a top header | Pre-confirmed in §3; Step 4.4 re-verifies (read-only). |
| stylelint green | N/A — no stylelint configured. |
| No unit tests added for SCSS tokens | No test files touched. |

## 6. Deliverables

- NEW: `docs/THEME.md`
- MODIFIED: `README.md` (two link additions only)
- NOT MODIFIED: any `src/lib/theme/*.scss` (headers already present)
- NOT MODIFIED: `.agent/todos/20260729/20260729-todo-2.md` (marking `[DONE]` is a later 4.6 sub-step outside this plan)

## 7. Constraints Honored

- No hardcoded duplicate of every token value (example variables only; authoritative source remains `brief.md §5` / `_variables.scss`).
- Doc is a quick reference, not a replacement for `USAGE.md` or `brief.md`.
- `npm` build/lint must pass before commit.
- No push, no TODO mutation, no scope creep into other TODO tasks.
- Military-mode: plan is concise and focused on execution.

## 8. Plan Verification Against Original Task

TODO Task 9 (Section "### 9. Documentation & tests for this phase") requires:

- [ ] Create new /docs file linked to README covering import, `--cba-` prefix, token groups, `.cba-` utility classes → ✅ covered by Step 4.1 (THEME.md) + Steps 4.2/4.3 (README links).
- [ ] Add brief comments at top of each SCSS partial → ✅ already satisfied (verified §3); Step 4.4 records the finding. No code change required; if a reviewer insists on an edit, none is justified since headers exist.
- [ ] No unit tests for SCSS tokens; keep stylelint green if present → ✅ no tests added; stylelint absent (N/A).

Plan matches the task. No deviations.

## 9. Spec Path

This implementation plan saved at `.kilo/plans/20260730-phase1-task9-plan.md`.