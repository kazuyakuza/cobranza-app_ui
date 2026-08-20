# Global Plan — Fix remaining demo app issues — Round 2

**TODO source:** `.agent/todos/20260820/20260820-todo-0.md`
**Date:** 2026-08-20
**Version bump target:** 0.18.2 → 0.18.3 (patch — demo fixes + layout corrections)
**Branch:** `feat/fix-demo-issues-round2`

---

## Global Pre-Analysis

All six tasks are **front-end related** (Angular library components + demo app). The work is split into two logical groups:

- **Task Group A (Tasks 1–4): Library & Demo Bug Fixes** — small, targeted fixes to `ModuleContainer`, `ModuleHeader`, `CbaModuleFooter`, and demo workspace grid. No new public API surface; purely corrective.
- **Task Group B (Tasks 5–6): Demo Example Modules Redesign** — two new demo-only components (`demo-customer-form`, `demo-payment-schedule`) to replace placeholder content in the demo workspace.

**Technical decisions:**
- Standalone components only (Angular 22).
- Theme tokens per `brief.md` §5; no new tokens needed.
- All changes confined to `src/components/` (library) and `projects/demo/src/app/components/` (demo-only).

---

## Step 2: Git Feature Branch Setup

- Sub-agent: `implementer`
- Commit any unstaged work; switch to `main`; create `feat/fix-demo-issues-round2`.

## Step 3: Version Update

- Sub-agent: `implementer`
- Bump `package.json` version from `0.18.2` to `0.18.3`.
- Commit: `chore: bump version to 0.18.3`

---

## Task Group A — Library & Demo Bug Fixes (Tasks 1–4)

### A.4.1a Front-end Technical Specification
- Sub-agent: `frontend-specialist`
- Spec file: `.kilo/plans/20260820-fix-demo-bugs-taskA-frontend-spec.md`
- Scope: footer slot placement, drag icon visibility, footer status alignment, 50% grid parity.

### A.4.1b Analysis & Planning
- Sub-agent: `architector`
- Plan file: `.kilo/plans/20260820-fix-demo-bugs-taskA.md`
- Inputs: frontend spec from A.4.1a.
- Produce detailed implementation plan for Tasks 1–4.

### A.4.2 Implementation
- Sub-agent: `implementer`
- Execute plan from A.4.1b.
- Files touched (expected):
  - `src/components/module-container/module-container.component.html`
  - `src/components/module-container/module-container.component.scss`
  - `src/components/module-footer/module-footer.component.scss`
  - `src/components/module-header/module-header.component.ts`
  - `src/components/module-header/module-header.component.scss`
  - `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts`
  - `projects/demo/src/app/components/demo-workspace/demo-workspace.component.scss`
  - `docs/CBA_MODULE_CONTAINER.md`

### A.4.3 Code Review & Simplification
- Sub-agents: `code-reviewer` + `code-simplifier`
- Fix/simplification plan: `.kilo/plans/20260820-fix-demo-bugs-taskA-review.md`
- Planner assigns fixes to implementer.

### A.4.4 Documentation
- Sub-agent: `docs-specialist`
- Update `docs/CBA_MODULE_CONTAINER.md` with footer slot usage.
- JSDoc / code comments as needed.

### A.4.5a Front-end Implementation Verification
- Sub-agent: `frontend-specialist`
- Verify against A.4.1a spec; report diffs.

### A.4.5b Overall Plan Adherence
- Sub-agent: `architector`
- Check plan adherence; report deviations.

### A.4.6 Task Completion
- Sub-agent: `implementer`
- Mark Tasks 1–4 `[DONE]` in TODO file; commit.

---

## Task Group B — Demo Example Modules Redesign (Tasks 5–6)

### B.4.1a Front-end Technical Specification
- Sub-agent: `frontend-specialist`
- Spec file: `.kilo/plans/20260820-redesign-demo-modules-taskB-frontend-spec.md`
- Scope: `demo-customer-form` and `demo-payment-schedule` visual design, token usage, layout.

### B.4.1b Analysis & Planning
- Sub-agent: `architector`
- Plan file: `.kilo/plans/20260820-redesign-demo-modules-taskB.md`
- Inputs: frontend spec from B.4.1a.
- Produce detailed implementation plan for Tasks 5–6.

### B.4.2 Implementation
- Sub-agent: `implementer`
- Execute plan from B.4.1b.
- Files touched (expected):
  - `projects/demo/src/app/components/demo-customer-form/` (new folder + 3 files)
  - `projects/demo/src/app/components/demo-payment-schedule/` (new folder + 3 files)
  - `projects/demo/src/app/components/demo-workspace/demo-workspace.component.html`
  - `projects/demo/src/app/components/demo-workspace/demo-workspace.component.ts`

### B.4.3 Code Review & Simplification
- Sub-agents: `code-reviewer` + `code-simplifier`
- Fix/simplification plan: `.kilo/plans/20260820-redesign-demo-modules-taskB-review.md`
- Planner assigns fixes to implementer.

### B.4.4 Documentation
- Sub-agent: `docs-specialist`
- Add code comments guiding future AI agents on demo component patterns.

### B.4.5a Front-end Implementation Verification
- Sub-agent: `frontend-specialist`
- Verify against B.4.1a spec; report diffs.

### B.4.5b Overall Plan Adherence
- Sub-agent: `architector`
- Check plan adherence; report deviations.

### B.4.6 Task Completion
- Sub-agent: `implementer`
- Mark Tasks 5–6 `[DONE]` in TODO file; commit.

---

## Step 5: TODO File Completion

- Sub-agent: `implementer`
- Rename TODO file to `20260820-todo-0-DONE.md`.
- Remove any tmp files/folders.
- Merge `feat/fix-demo-issues-round2` into `main`.
- Push `main` to `origin`.

## Step 6: Finish

- Resume summary.
- Provide next TODO instruction.
