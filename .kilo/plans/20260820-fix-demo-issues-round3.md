# Global Plan: Fix remaining demo app issues — Round 3

**Source TODO:** `.agent/todos/20260820/20260820-todo-1.md`  
**Branch:** `fix/demo-issues-round3`  
**Version bump:** `0.18.3` → `0.18.4`

## Pre-analysis

### Technical & architecture decisions
- `main` is the master branch; create a feature branch for this work.
- Version bump to `0.18.4` because Round 3 introduces additional visual changes (typography scale, input styling, button additions) beyond what was already released in `0.18.3`.
- Tasks are processed in TODO file order.
- **Front-end related:** Only Task C (styling fixes) requires a full front-end spec and front-end verification. Tasks A, B, and D are build/test/audit tasks.

### Task A — Rebuild library and verify dist contains all changes
- **Type:** Build / verification (not front-end UI).
- **Root cause:** `dist/` is stale and missing `cbaModuleContainerFooter` and `faUpDownLeftRight`.
- **Approach:** Run `npm run build:lib`, grep `.mjs` for symbols, run `npm run build:demo`, serve/inspect to confirm footer and drag icon render.

### Task B — Fix failing tests (module-header)
- **Type:** Test fix (not front-end UI).
- **Root cause:** Built-in drag button added to template but `module-header.component.spec.ts` expectations not updated.
- **Approach:** Update button count assertions; handle built-in drag button in `ACTION_CASES` (skip or separate test).

### Task C — Styling fixes (form overflow, input fields, cancel button, typography)
- **Type:** Front-end UI. Grouped because all are small SCSS / HTML / token changes that touch the same files.
- **Sub-tasks:**
  1. Form overflow: add `max-width: 100%` and `box-sizing: border-box` to demo form and library field control.
  2. Input field styling: change background, focus border color, valid/invalid border thickness.
  3. Cancel button: add secondary button to demo form; review secondary variant contrast.
  4. Typography scale: increase font-size tokens in `_variables.scss`; audit demo SCSS for hard-coded sizes.
- **Approach:** Update component SCSS, demo HTML/SCSS, theme variables, and docs in one implementation pass.

### Task D — Verify demo app uses library tokens/components exclusively
- **Type:** Audit / compliance (not front-end UI).
- **Approach:** Audit demo SCSS/TS for hard-coded values; replace with token equivalents; add compliance test if feasible.

---

## Execution Steps

### Step 2: Git Feature Branch Setup
- Commit any unstaged files from previous tasks (only untracked `.agent/.logs/` and plan files).
- Create and switch to branch `fix/demo-issues-round3`.

### Step 3: Version Update
- Bump `package.json` version to `0.18.4`.
- Add `[0.18.4] — 2026-08-20` header to `CHANGELOG.md` (move any entries that were mistakenly added under `[0.18.3]` after its release).

### Task A: Rebuild library and verify dist

#### 4.1b Analysis & Planning
- Assign to **architector**.
- Produce plan: exact build commands, grep patterns, verification steps.
- Save plan to `.kilo/plans/20260820-fix-demo-issues-round3-taskA.md`.

#### 4.2 Implementation
- Assign to **implementer**.
- Run `npm run build:lib`, verify `.mjs` contains symbols, run `npm run build:demo`, verify visually.

#### 4.3 Code Review & Simplification
- Assign to **code-reviewer** and **code-simplifier** concurrently.
- Review build artifacts and verification results.

#### 4.4 Documentation
- N/A for build verification.

#### 4.5 Verification
- Assign to **architector**.
- Confirm footer slot and drag icon render in built demo.

#### 4.6 Task Completion
- Assign to **implementer**.
- Append `[DONE]` to Task A in TODO file.

---

### Task B: Fix failing tests (module-header)

#### 4.1b Analysis & Planning
- Assign to **architector**.
- Plan exact line changes in `module-header.component.spec.ts`.
- Save plan to `.kilo/plans/20260820-fix-demo-issues-round3-taskB.md`.

#### 4.2 Implementation
- Assign to **implementer**.
- Update test expectations and `ACTION_CASES` handling.

#### 4.3 Code Review & Simplification
- Assign to **code-reviewer** and **code-simplifier** concurrently.

#### 4.4 Documentation
- N/A.

#### 4.5 Verification
- Assign to **architector**.
- Confirm `npm run test` passes with zero failures.

#### 4.6 Task Completion
- Assign to **implementer**.
- Append `[DONE]` to Task B in TODO file.

---

### Task C: Styling fixes (form overflow, input fields, cancel button, typography)

#### 4.1a Front-end Technical Specification
- Assign to **frontend-specialist**.
- Produce spec covering all four sub-tasks (form overflow, input styling, cancel button, typography).
- Save spec to `.kilo/plans/20260820-fix-demo-issues-round3-taskC-frontend-spec.md`.

#### 4.1b Analysis & Planning
- Assign to **architector**.
- Read frontend spec; produce detailed implementation plan with exact file paths, token values, and code snippets.
- Save plan to `.kilo/plans/20260820-fix-demo-issues-round3-taskC.md`.

#### 4.2 Implementation
- Assign to **implementer**.
- Apply all SCSS / HTML / token changes per the plan.

#### 4.3 Code Review & Simplification
- Assign to **code-reviewer** and **code-simplifier** concurrently.
- Generate fix/simplification plans; save to `.kilo/plans/20260820-fix-demo-issues-round3-taskC.md`.
- Re-assign fixes to **implementer**.

#### 4.4 Documentation
- Assign to **docs-specialist**.
- Update `docs/THEME.md`, `brief.md` §5, `docs/CBA_INPUT.md`, `docs/CBA_FORM_FIELD.md` with new token values and styling.

#### 4.5a Front-end Verification
- Assign to **frontend-specialist**.
- Compare implementation against spec; report diffs.

#### 4.5b Overall Plan Adherence
- Assign to **architector**.
- Incorporate front-end verification report; check plan adherence.

#### 4.6 Task Completion
- Assign to **implementer**.
- Append `[DONE]` to Task C in TODO file.

---

### Task D: Verify demo app uses library tokens/components exclusively

#### 4.1b Analysis & Planning
- Assign to **architector**.
- Plan audit of `projects/demo/src/app/components/**/*.scss` and `.ts` files.
- Decide feasibility of `demo-token-compliance.spec.ts`.
- Save plan to `.kilo/plans/20260820-fix-demo-issues-round3-taskD.md`.

#### 4.2 Implementation
- Assign to **implementer**.
- Replace hard-coded values with token references; create compliance test if feasible.

#### 4.3 Code Review & Simplification
- Assign to **code-reviewer** and **code-simplifier** concurrently.

#### 4.4 Documentation
- N/A (audit task).

#### 4.5 Verification
- Assign to **architector**.
- Confirm demo contains no hard-coded colors, font sizes, or spacing values.

#### 4.6 Task Completion
- Assign to **implementer**.
- Append `[DONE]` to Task D in TODO file.

---

### Step 5: TODO File Completion
- Assign to **implementer**.
- Rename TODO file to `20260820-todo-1-DONE.md`.
- Remove any temp files created during the workflow.
- Ensure all changes are committed in `fix/demo-issues-round3`.
- Merge to `main`:
  1. Switch to `main`.
  2. Merge `fix/demo-issues-round3`.
  3. On success: delete feature branch.
  4. On failure: notify user.
- Push `main` to `origin` only.

---

## Acceptance Criteria (from TODO)

- [ ] `npm run test` passes with zero failures.
- [ ] `npm run build:lib` passes with zero errors.
- [ ] `npm run build:demo` passes with zero errors.
- [ ] `npm run lint` passes with zero errors.
- [ ] Built library `.mjs` contains `cbaModuleContainerFooter` and `faUpDownLeftRight`.
- [ ] Module footer is visually distinct from body, pinned at bottom, and hidden on collapse.
- [ ] Drag icon is visible as the first button in every module header in the demo app.
- [ ] "New customer" form fits within the module without horizontal scrolling.
- [ ] Input fields have a distinct background (`--cba-bg-elevated`) against the module body.
- [ ] Input focus border uses `--cba-accent-info` (blue-gray), not brown/red.
- [ ] Valid/invalid input states have 2px colored borders.
- [ ] "New customer" form has both "Add customer" (primary) and "Cancel" (secondary) buttons.
- [ ] Secondary button is visually distinct from the module body background.
- [ ] All text is readable on 2240×1400 (body font ≥ 16px).
- [ ] Demo app contains no hard-coded colors, font sizes, or spacing values.
