# Global Plan — Phase 5: Modal & Form Control Wrappers

> **Source TODO:** `.agent/todos/20260730/20260730-todo-3.md`
> **Branch:** `feat/phase5-modal-form-wrappers`
> **Version bump:** `0.5.0 → 0.6.0` (minor — new components)

---

## 1. Pre-Analysis

### Current State

- Library `@cobranza-apps/ui` at `v0.5.0` on `main`, build/tests/lint passing.
- Existing components: `CbaBadge`, `CbaButton`, `CbaCard`, `CbaEmptyState`, `CbaSkeleton`, `ModuleHeader`, `ModuleContainer`.
- `src/components/modal/` exists with empty barrel (`export {}`); no `input/`, `select/`, or `datepicker/` folders.
- `public-api.ts` exports components alphabetically.
- Theme tokens (`--cba-*`) fully defined in `src/theme/_variables.scss`.
- ng-bootstrap v21 and Bootstrap 5.3 are peer/dev dependencies.
- Testing setup: Jest + `jest-preset-angular`, test helpers in `src/components/testing/test-helpers.ts`.
- Code style: standalone components only, signals (`input` / `output`), barrel files, JSDoc, SCSS with BEM-ish naming.

### Technical Decisions

| Decision | Rationale |
|----------|-----------|
| **CbaModal pattern** | A `CbaModalComponent` (template with projected slots) opened via `NgbModal.open()` from ng-bootstrap. A thin `CbaModalService` provides ergonomic `open()` with size/centered options and returns the `NgbModalRef`. |
| **Shared form-field structure** | Internal `CbaFieldComponent` (selector `cba-field`, **not exported publicly**) wraps label + control + hint + error. `CbaInput`, `CbaSelect`, `CbaDatepicker` compose it internally. This keeps visual consistency without exposing an extra public API. |
| **Forms compatibility** | All three form controls implement `ControlValueAccessor` so they work with `ngModel` and `formControlName`. |
| **CbaSelect options** | Projected `<option>` elements via `<ng-content select="option">` — zero custom dropdown logic. |
| **CbaDatepicker** | Wraps `NgbDatepicker` directive on an input + calendar toggle button. ng-bootstrap owns popup/calendar behaviour. |
| **Folder placement** | `src/components/modal/`, `src/components/input/`, `src/components/select/`, `src/components/datepicker/`. `CbaFieldComponent` lives in `src/components/_field/` (internal, no barrel in public-api). |

---

## 2. Task Breakdown & Execution Order

### Step 2 — Git Feature Branch Setup
- Commit any unstaged files → `implementer`
- Create and switch to `feat/phase5-modal-form-wrappers`

### Step 3 — Version Update
- Bump `package.json` version to `0.6.0`
- Commit: `chore: bump version to 0.6.0` → `implementer`

---

### Task 1 — CbaModal

**Front-end related:** Yes

#### 4.1a — Front-end Technical Specification
- **Sub-agent:** `frontend-specialist`
- Analyze ng-bootstrap modal API (`NgbModal`, `NgbModalRef`, `NgbModalOptions`, `NgbModalConfig`).
- Define exact consumer API: `CbaModalService.open(CbaModalComponent, options)` vs direct `NgbModal` usage.
- Produce spec: `.kilo/plans/20260730-phase5-modal-frontend-spec.md`

#### 4.1b — Implementation Plan
- **Sub-agent:** `architector`
- Read front-end spec.
- Plan files:
  - `src/components/modal/cba-modal.component.ts` — modal content shell with projected header/body/footer + title input
  - `src/components/modal/cba-modal.service.ts` — thin service wrapping `NgbModal.open()`
  - `src/components/modal/cba-modal.types.ts` — `CbaModalSize`, `CbaModalOptions`
  - `src/components/modal/cba-modal.component.scss` — theme styling
  - `src/components/modal/index.ts` — barrel
  - Update `src/public-api.ts`
- Plan docs:
  - `docs/CBA_MODAL.md`
- Plan tests:
  - `src/components/modal/cba-modal.component.spec.ts` — wrapper-only tests (projected regions, size mapping, service open/close)
- Save plan: `.kilo/plans/20260730-phase5-modal.md`

#### 4.2 — Implementation
- **Sub-agent:** `implementer`
- Follow the plan from 4.1b exactly.
- Commit incrementally with meaningful messages.

#### 4.3 — Code Review & Simplification
- **Sub-agents:** `code-reviewer` + `code-simplifier` (concurrent)
- Review for deviations from plan; simplify where possible.
- Save fix/simplification plan; assign to `implementer` for fixes.
- Max 3 review cycles.

#### 4.4 — Documentation
- **Sub-agent:** `docs-specialist`
- JSDoc on public API (`CbaModalService`, `CbaModalComponent`, types).
- `docs/CBA_MODAL.md` with open/dismiss examples, projection, size options, explicit ng-bootstrap note.

#### 4.5a — Front-end Verification
- **Sub-agent:** `frontend-specialist`
- Verify implementation matches front-end spec.
- Report diffs and quality issues.

#### 4.5b — Overall Plan Adherence
- **Sub-agent:** `architector`
- Check implementation against plan; report deviations.

#### 4.6 — Task Completion
- **Sub-agent:** `implementer`
- Append `[DONE]` to Task 1 section in TODO file.
- Commit: `feat: complete CbaModal component`

---

### Task 2-5 — Shared Form Field + CbaInput + CbaSelect + CbaDatepicker

**Front-end related:** Yes

These tasks are grouped because Task 2 (shared field structure) is a strict prerequisite for Tasks 3–5, and the three controls are thin wrappers with nearly identical APIs.

#### 4.1a — Front-end Technical Specification
- **Sub-agent:** `frontend-specialist`
- Define `CbaFieldComponent` internal contract (label, hint, error slots).
- Define `ControlValueAccessor` pattern for the three controls.
- Document ng-bootstrap datepicker integration boundaries.
- Produce spec: `.kilo/plans/20260730-phase5-form-controls-frontend-spec.md`

#### 4.1b — Implementation Plan
- **Sub-agent:** `architector`
- Read front-end spec.
- Plan files:
  - Internal:
    - `src/components/_field/cba-field.component.ts` — label + projected control + hint + error
    - `src/components/_field/cba-field.component.scss` — shared field styling
  - Input:
    - `src/components/input/cba-input.component.ts` — native `<input>` with `ControlValueAccessor`
    - `src/components/input/cba-input.component.scss`
    - `src/components/input/index.ts`
  - Select:
    - `src/components/select/cba-select.component.ts` — native `<select>` with projected `<option>`
    - `src/components/select/cba-select.component.scss`
    - `src/components/select/index.ts`
  - Datepicker:
    - `src/components/datepicker/cba-datepicker.component.ts` — `NgbDatepicker` directive wrapper
    - `src/components/datepicker/cba-datepicker.component.scss`
    - `src/components/datepicker/index.ts`
  - Update `src/public-api.ts`
  - Update `.agent/project-structure.md` if needed
- Plan docs:
  - `docs/CBA_INPUT.md`, `docs/CBA_SELECT.md`, `docs/CBA_DATEPICKER.md`
  - Add form-field conventions note in `docs/USAGE.md` or a new `docs/FORM_CONTROLS.md`
- Plan tests:
  - `src/components/input/cba-input.component.spec.ts`
  - `src/components/select/cba-select.component.spec.ts`
  - `src/components/datepicker/cba-datepicker.component.spec.ts`
  - Minimal tests per TODO: label rendering, error display, disabled state, options projection (select), wrapper-only (datepicker).
- Save plan: `.kilo/plans/20260730-phase5-form-controls.md`

#### 4.2 — Implementation
- **Sub-agent:** `implementer`
- Follow the plan from 4.1b exactly.
- Build order: `CbaFieldComponent` → `CbaInput` → `CbaSelect` → `CbaDatepicker`.
- Commit incrementally.

#### 4.3 — Code Review & Simplification
- **Sub-agents:** `code-reviewer` + `code-simplifier` (concurrent)
- Review all four units; generate fix/simplification plan.
- Assign to `implementer` for fixes.
- Max 3 review cycles.

#### 4.4 — Documentation
- **Sub-agent:** `docs-specialist`
- JSDoc on all public APIs.
- Per-component docs files.
- Explicit note that calendar behaviour comes from ng-bootstrap in `CBA_DATEPICKER.md`.

#### 4.5a — Front-end Verification
- **Sub-agent:** `frontend-specialist`
- Verify all three controls + field structure match spec.
- Report diffs.

#### 4.5b — Overall Plan Adherence
- **Sub-agent:** `architector`
- Check implementation against plan.

#### 4.6 — Task Completion
- **Sub-agent:** `implementer`
- Append `[DONE]` to Tasks 2–5 sections in TODO file.
- Commit: `feat: complete form control wrappers (input, select, datepicker)`

---

### Step 5 — TODO File Completion
- **Sub-agent:** `implementer`
- Rename TODO file to `20260730-todo-3-DONE.md`.
- Ensure all files committed in feature branch.
- Switch to `main`, merge `feat/phase5-modal-form-wrappers`.
- On success: delete feature branch.
- Push `main` to `origin` only.

---

## 3. Step-to-Sub-Agent Mapping

| Step | Sub-agent Type | Notes |
|------|---------------|-------|
| 2 — Git branch setup | `implementer` | |
| 3 — Version bump | `implementer` | |
| Task 1 — 4.1a Front-end Spec | `frontend-specialist` | Save spec file |
| Task 1 — 4.1b Plan | `architector` | Read spec; save plan |
| Task 1 — 4.2 Implementation | `implementer` | Follow plan exactly |
| Task 1 — 4.3 Review + Simplify | `code-reviewer` + `code-simplifier` | Concurrent; then implementer fix |
| Task 1 — 4.4 Documentation | `docs-specialist` | |
| Task 1 — 4.5a Front-end Verification | `frontend-specialist` | |
| Task 1 — 4.5b Plan Adherence | `architector` | |
| Task 1 — 4.6 Completion | `implementer` | Mark [DONE]; commit |
| Task 2-5 — 4.1a Front-end Spec | `frontend-specialist` | Save spec file |
| Task 2-5 — 4.1b Plan | `architector` | Read spec; save plan |
| Task 2-5 — 4.2 Implementation | `implementer` | Follow plan exactly |
| Task 2-5 — 4.3 Review + Simplify | `code-reviewer` + `code-simplifier` | Concurrent; then implementer fix |
| Task 2-5 — 4.4 Documentation | `docs-specialist` | |
| Task 2-5 — 4.5a Front-end Verification | `frontend-specialist` | |
| Task 2-5 — 4.5b Plan Adherence | `architector` | |
| Task 2-5 — 4.6 Completion | `implementer` | Mark [DONE]; commit |
| 5 — TODO Completion | `implementer` | Merge branch; push origin |

---

## 4. Constraints & Reminders

- **DO NOT call `plan_exit`.**
- All components must be **standalone**.
- **Max lines per file:** 200 (`src/` only).
- **Max lines per method:** 50.
- **Max method args:** 2 (encapsulate in object if more).
- **Max depth:** 2 nested blocks; extract to method at 3.
- **Prefer private members** by default.
- **No commented-out code**.
- **Self-documenting code** preferred; minimal comments OK for complex logic.
- **Single-section boolean conditions** (extract complex conditions to named methods).
- Visuals must use only `--cba-*` tokens.
- Do **not** reimplement ng-bootstrap behaviour (modal engine, datepicker calendar, focus trap, backdrop).
- Export all new public components from `public-api.ts`.
- Ensure `npm run build` and `npm test` pass after each task.
- Follow `.kilo/rules/tool-selection-priority.md` for tool usage.
- Before any commit, read `.gitignore` and ensure no ignored files are staged.
