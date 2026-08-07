# Global Plan — Preview Readability Fixes & Changelog Versioning Rule

**Date:** 2026-08-06
**Branch:** `feat/preview-readability-changelog-rule`
**Version:** `0.11.0 → 0.11.1` (patch — fixes + process rule)

---

## Global Pre-Analysis

The user identified four visual issues in `docs/theme-preview.html` plus a process issue with `[Unreleased]` changelog sections. The critical constraint: **preview fixes must be coupled with library token changes**, not isolated to the preview file.

### Issues to fix

1. **Token labels unreadable**: `.tok` labels in the preview use `--cba-text-muted` at 10.5 px, which fails WCAG AA on canvas and inset and is hard to read everywhere. `.t-callout` warning text uses `--cba-accent-warning` (coral) on transparent/warm background (~1.3:1 contrast).
2. **Accent pills unreadable**: The "Warning" pill renders coral text on an 18 % coral-tinted transparent background, giving ~1.3:1 contrast.
3. **Button states indistinguishable**: `.is-hover` and `.is-active` in the preview matrix use `--cba-hover` (`rgba(43,38,32,0.06)`) and `--cba-active` (`rgba(43,38,32,0.10)`). On warm light surfaces these overlays are nearly invisible. The real `cba-button.component.scss` uses the same tokens, so the Shell will have the same problem.
4. **Footer blends into workspace**: `.shell-footer` uses `--cba-bg-primary` (canvas), identical to `.workspace` (canvas).
5. **Changelog process**: Every push to `origin/main` publishes the library. The user wants to stop using `[Unreleased]` sections. Every change must be documented under a dated version header before merge.

### Technical decisions

- **Token change (global impact):** Increase `--cba-hover` to `rgba(43, 38, 32, 0.10)` and `--cba-active` to `rgba(43, 38, 32, 0.18)`. This makes hover/active states clearly visible across all surfaces while keeping the warm-tinted overlay approach. Affects `src/theme/_variables.scss`, `src/components/testing/theme-fixtures.ts`, `docs/theme-preview.css` (regenerate), and all docs referencing the old values.
- **Preview HTML fixes:**
  - `.t-row`: increase `font-size` to `13px`, add `font-weight: 500`.
  - `.t-row .tok`: change `color` to `var(--cba-text-secondary)`, increase `font-size` to `11px`.
  - `.t-callout`: change to `background: var(--cba-accent-warning); color: var(--cba-text-inverse); border-color: transparent;` (solid warning badge).
  - `.accent-pill` / JS `renderAccents`: change to `background: var(--cba-accent-*)` and `color: var(--cba-text-inverse)` for all pills.
  - `.shell-footer`: change `background` to `var(--cba-bg-elevated)`.
- **Consumer Guide update:** Bar and Chrome Guide currently says Shell footer can use `--cba-bg-primary` or `--cba-bg-elevated`. Update to recommend `--cba-bg-elevated` and explain why (must differ from workspace canvas).
- **Changelog rule:** Create `.kilo/rules/changelog-versioning.md` prohibiting `[Unreleased]` sections. Reference it from `.agent/RULES.md`. Update `CHANGELOG.md` header comment.
- **Regression tests:** Expand test suite to assert preview element contrast (AA for `.tok`, `.t-callout`, `.accent-pill`), button state CSS distinctness, footer/workspace background difference, and changelog rule compliance.

### Front-end flag

Task B is front-end related (token changes + preview HTML + CSS regeneration). Tasks A and C are not front-end related (process/docs and tests).

---

## Step 2 — Git Feature Branch Setup

**Assigned to:** implementer

- Commit existing unstaged `CHANGELOG.md` changes with a meaningful message.
- Switch to `main`, create branch `feat/preview-readability-changelog-rule`.
- All subsequent work happens on this branch.

---

## Step 3 — Version Update

**Assigned to:** implementer

- Bump `package.json` version from `0.11.0` to `0.11.1`.
- Commit as `chore: bump version to 0.11.1`.

---

## Task A — Changelog Versioning Rule

**Goal:** Establish a project rule that `CHANGELOG.md` must never contain `[Unreleased]` sections, because every push to `origin` publishes the library.

**Pre-analysis:**
- Current `CHANGELOG.md` header comment (lines 6–12) instructs maintainers to add entries under `[Unreleased]`. This contradicts the user's publishing workflow.
- `.agent/RULES.md` is an index of rule files. The new rule needs a dedicated `.kilo/rules/` file and a reference in the index.
- No token or code changes. Pure process/docs task.

**Files to update:**
- `.kilo/rules/changelog-versioning.md` (new)
- `.agent/RULES.md`
- `CHANGELOG.md` (header comment only)
- `.agent/project-info/context.md` (optional, to mention the new rule)

**Plan file:** `.kilo/plans/20260806-taskA-changelog-rule.md`

### Task A Execution Steps
- **4.1b:** Analysis & Planning → architector
- **4.2:** Implementation → implementer
- **4.3:** Code Review & Simplification → code-reviewer + code-simplifier; 4.3-fix → implementer
- **4.4:** Documentation → docs-specialist
- **4.5b:** Overall Plan Adherence → architector
- **4.6:** Task Completion → implementer

---

## Task B — Theme Token & Preview Readability Fixes

**Goal:** Fix all four visual issues in `docs/theme-preview.html` by updating the underlying library tokens (`--cba-hover`, `--cba-active`) and the preview's inline styles. Update the Consumer Guide and regenerate compiled preview CSS.

**Pre-analysis:**
- **Token change (global impact):** `--cba-hover: rgba(43, 38, 32, 0.06)` → `0.10`; `--cba-active: rgba(43, 38, 32, 0.10)` → `0.18`. This affects table row hover, module header actions, all buttons, and any component using these tokens. Contrast remains safe because these are dark overlays on light surfaces.
- **Preview CSS changes:**
  - `.t-row`: increase `font-size` to `13px`, add `font-weight: 500`.
  - `.t-row .tok`: change `color` to `var(--cba-text-secondary)`, increase `font-size` to `11px`.
  - `.t-callout`: change to solid warning badge (`background: var(--cba-accent-warning); color: var(--cba-text-inverse); border-color: transparent;`).
  - `.accent-pill` / JS `renderAccents()`: change to solid accent background + inverse text.
  - `.shell-footer`: change `background` to `var(--cba-bg-elevated)`.
- **Component impact:** `cba-button.component.scss` already uses `var(--cba-hover)` and `var(--cba-active)`, so it picks up the stronger overlays automatically. No component SCSS change needed.
- **Consumer Guide impact:** Bar and Chrome Guide must recommend `--cba-bg-elevated` for the Shell footer and explain it must differ from workspace canvas.
- **Docs impact:** `brief.md` §5, `context.md` need updates for the new hover/active values.
- **CSS regeneration:** Run `npm run build:preview` after `_variables.scss` change to update `docs/theme-preview.css`.

**Dependencies:** None (can start after Step 3).

**Plan file:** `.kilo/plans/20260806-taskB-preview-readability.md`

### Task B Execution Steps
- **4.1a:** Front-end Technical Specification → frontend-specialist
- **4.1b:** Analysis & Planning → architector
- **4.2:** Implementation → implementer
- **4.3:** Code Review & Simplification → code-reviewer + code-simplifier; 4.3-fix → implementer
- **4.4:** Documentation → docs-specialist
- **4.5a:** Front-end Verification → frontend-specialist
- **4.5b:** Overall Plan Adherence → architector
- **4.6:** Task Completion → implementer

---

## Task C — Regression Tests & Changelog Entry

**Goal:** Add tests for the new preview readability requirements, button state distinctness, footer color, and changelog rule. Update `CHANGELOG.md` with a dated version entry for these fixes.

**Pre-analysis:**
- Existing test suite: `preview-html.spec.ts`, `contrast.spec.ts`, `theme-fixtures.ts`, `color-math.ts`.
- New tests needed:
  1. **Preview text contrast:** Parse preview HTML, compute background of `.text-sample--*`, assert every `.t-row` and `.tok` inside it has contrast ≥ 4.5:1 against that background.
  2. **Preview callout contrast:** Assert `.t-callout` background vs text contrast ≥ 4.5:1.
  3. **Accent pill contrast:** Assert `.accent-pill` background vs text contrast ≥ 4.5:1.
  4. **Button state distinctness:** Assert that `.pv-btn--*.is-hover` and `.pv-btn--*.is-active` have different `background` declarations from the normal state.
  5. **Footer vs workspace:** Assert `.shell-footer` background token ≠ `.workspace` background token.
  6. **Changelog rule:** Assert `CHANGELOG.md` does not contain `[Unreleased]`.
  7. **Token values:** Update `theme-fixtures.ts` `--cba-hover` and `--cba-active` to match new values.
- **Changelog:** Under a new dated version header `[0.11.1] — 2026-08-06`, list the fixes: interactive state overlays strengthened, preview text/callout/pill readability improved, footer color fixed, Bar and Chrome Guide updated.

**Dependencies:** Task B (final token values and preview HTML structure must be known).

**Plan file:** `.kilo/plans/20260806-taskC-regression-tests.md`

### Task C Execution Steps
- **4.1b:** Analysis & Planning → architector
- **4.2:** Implementation → implementer
- **4.3:** Code Review & Simplification → code-reviewer + code-simplifier; 4.3-fix → implementer
- **4.4:** Documentation → docs-specialist
- **4.5b:** Overall Plan Adherence → architector
- **4.6:** Task Completion → implementer

---

## Step 5 — TODO File Completion

**Assigned to:** implementer

- Rename TODO file with `-DONE` suffix.
- Ensure all files committed in feature branch.
- Merge feature branch into `main`.
- Push `main` to `origin` ONLY.

---

## Order of Execution

1. Step 2: Git branch setup (commit existing unstaged changes first)
2. Step 3: Version bump to 0.11.1
3. Task A: Changelog rule (4.1b → 4.2 → 4.3 → 4.4 → 4.5b → 4.6)
4. Task B: Preview/token fixes (4.1a → 4.1b → 4.2 → 4.3 → 4.4 → 4.5a → 4.5b → 4.6)
5. Task C: Regression tests (4.1b → 4.2 → 4.3 → 4.4 → 4.5b → 4.6)
6. Step 5: TODO completion

**Note:** Tasks A, B, and C share the same feature branch `feat/preview-readability-changelog-rule`. Commits must be atomic per task.

---

## Error Handling

- On errors: log details, commit safe changes if possible, notify user, and pause.
- If endless loops or repeated failures occur, escalate to user immediately.
- If a sub-step (4.1–4.6) fails verification, reassign the sub-task or escalate to user.
