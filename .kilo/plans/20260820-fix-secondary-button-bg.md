# Global Plan — Fix Secondary Button Background Color

## Source

- TODO file: `.agent/todos/20260820/20260820-todo-2.md`

## Global Pre-Analysis

The `cba-button` component's `secondary` variant currently uses `background-color: var(--cba-bg-secondary)` (`#F2F0E8`), which makes it invisible when placed inside module bodies that also use `--cba-bg-secondary`. The fix changes the background to `var(--cba-bg-elevated)` (`#FDFCF8`).

The SCSS file already contains the corrected value (`var(--cba-bg-elevated)` on line 67) as an uncommitted change. The remaining work is: commit the change, branch, version bump, rebuild library, reinstall local dependency, rebuild demo, verify visually in the demo app, update changelog, and complete the task.

This is a **front-end related** task.

## Task 1: Fix Secondary Button Background Color

### Task Pre-Analysis

- **Scope**: Single SCSS property change in `cba-button.component.scss` (already modified), plus build/verification pipeline.
- **Risk**: Very low — one token swap within the same surface family.
- **Front-end**: Yes — visual token change requiring demo verification.
- **Version bump**: Patch (`0.18.4` → `0.18.5`) — fix to existing component styling.

### Execution Steps

1. **Step 2 — Git Feature Branch Setup** (implementer)
   - Commit the existing unstaged change to `cba-button.component.scss` with meaningful message.
   - Create and switch to branch `fix/secondary-button-bg`.

2. **Step 3 — Version Update** (implementer)
   - Bump `package.json` version from `0.18.4` to `0.18.5`.
   - Commit as `chore: bump version to 0.18.5`.

3. **Task 1 — 4.1a Front-end Technical Specification** (frontend-specialist)
   - Produce minimal spec confirming the token swap (`--cba-bg-secondary` → `--cba-bg-elevated`) and expected visual behavior on all three demo surfaces.
   - Save to `.kilo/plans/20260820-fix-secondary-button-bg-frontend-spec.md`.

4. **Task 1 — 4.1b Analysis & Planning** (architector)
   - Read the front-end spec and generate a detailed implementation plan for a junior developer.
   - Plan must cover: committing the SCSS change, build commands (`npm run build:lib`, `npm install`, `npm run build:demo`), visual verification steps in the demo app, and changelog update.
   - Save to `.kilo/plans/20260820-fix-secondary-button-bg-task1.md`.

5. **Task 1 — 4.2 Implementation** (implementer)
   - Follow the plan from 4.1b exactly.
   - Ensure the SCSS change is committed, builds pass, and the demo renders correctly.

6. **Task 1 — 4.3 Code Review & Simplification** (code-reviewer + code-simplifier)
   - Review the change for correctness and adherence to the plan.
   - Simplify if possible.
   - Save findings; assign fixes to implementer if needed.

7. **Task 1 — 4.4 Documentation** (docs-specialist)
   - Update `CHANGELOG.md` with a dated `[0.18.5] — 2026-08-20` entry describing the fix.
   - No other doc changes required.

8. **Task 1 — 4.5a Front-end Implementation Verification** (frontend-specialist)
   - Verify in the built demo that:
     - The Cancel button in the "New Customer" form is visible (lighter background against module body).
     - Secondary buttons in the Buttons demo matrix render correctly on `bg-secondary`, `bg-elevated`, and `bg-primary` surfaces.

9. **Task 1 — 4.5b Overall Plan Adherence** (architector)
   - Check that all plan steps were executed and all acceptance criteria are met.

10. **Task 1 — 4.6 Task Completion** (implementer)
    - Mark task as `[DONE]` in the TODO file.
    - Commit.

11. **Step 5 — TODO File Completion** (implementer)
    - Rename TODO file with `-DONE` suffix.
    - Merge `fix/secondary-button-bg` into `main`.
    - Push `main` to `origin`.
