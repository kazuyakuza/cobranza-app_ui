# Global Plan — Phase 6: Dropdown, Popover, Typeahead & ModuleFooter

**Source TODO:** `.agent/todos/20260730/20260730-todo-4.md`  
**Date:** 2026-07-31  
**Front-end related:** Yes (Angular component library, thin ng-bootstrap wrappers)

---

## Pre-Analysis

### Project Status
- Library `@cobranza-apps/ui` is on `main`, build/test/lint passing.
- Prior phases implemented: `ModuleHeader`, `ModuleContainer`, `CbaButton`, `CbaCard`, `CbaBadge`, `CbaEmptyState`, `CbaSkeleton`, `CbaModal`, `CbaInput`, `CbaSelect`, `CbaDatepicker`, shared `CbaFieldComponent`.
- All components are standalone, use `--cba-*` tokens, and follow the thin-wrapper pattern.
- `public-api.ts` is a single barrel; new components must be added there.

### Technical Decisions
- **All 4 TODO tasks are executed as separate 4.1–4.6 cycles** per user instruction.
- `CbaDropdown`, `CbaPopover`, `CbaTypeahead` wrap `@ng-bootstrap/ng-bootstrap` primitives.
- `CbaTypeahead` reuses the existing `CbaFieldComponent` layout (label / control / hint / error) and extends `CbaFieldControlValueAccessor` for forms compatibility.
- `CbaModuleFooter` is plain HTML/CSS with status icon/text mapping mirroring `ModuleHeader` semantics; no new dependencies.
- New folders under `src/components/`: `dropdown/`, `popover/`, `typeahead/`, `module-footer/`.
- `project-structure.md` and `public-api.ts` must be updated after each component.

---

## Execution Steps

### Step 2 — Git Feature Branch Setup
- **Sub-agent:** `implementer`
- Ensure `main` is clean; create `feat/phase6-dropdown-popover-typeahead-footer`.

### Step 3 — Version Update
- **Sub-agent:** `implementer`
- Bump patch version in `package.json`; commit `chore: bump version`.

---

### Task 1 — CbaDropdown

#### 4.1a Front-end Technical Specification
- **Sub-agent:** `frontend-specialist`
- Spec for thin `NgbDropdown` wrapper: selector `cba-dropdown`, projected toggle + menu items, API (`placement`, `disabled`), token styling for menu surface and item states.
- Save to `.kilo/plans/20260731-task1-dropdown-frontend-spec.md`.

#### 4.1b Analysis & Planning
- **Sub-agent:** `architector`
- Read spec from 4.1a. Produce detailed implementation plan: exact files, code snippets, test strategy, docs outline.
- Save to `.kilo/plans/20260731-task1-dropdown-impl.md`.

#### 4.2 Implementation
- **Sub-agent:** `implementer`
- Build component, styles, tests, barrel `index.ts`. Update `public-api.ts` and `project-structure.md`. Commit.

#### 4.3 Code Review & Simplification
- **Sub-agent:** `code-reviewer` + `code-simplifier` (concurrent)
- Review against plan; generate fix plan → `.kilo/plans/20260731-task1-dropdown-fix.md`.
- **Sub-agent:** `implementer` applies fixes.

#### 4.4 Documentation
- **Sub-agent:** `docs-specialist`
- JSDoc + `docs/CBA_DROPDOWN.md` with AI-agent examples.

#### 4.5a Front-end Verification
- **Sub-agent:** `frontend-specialist`
- Verify against spec; report diffs.

#### 4.5b Overall Plan Adherence
- **Sub-agent:** `architector`
- Check implementation against plan; report deviations.

#### 4.6 Task Completion
- **Sub-agent:** `implementer`
- Add `[DONE]` to Task 1 in TODO file; commit.

---

### Task 2 — CbaPopover

#### 4.1a Front-end Technical Specification
- **Sub-agent:** `frontend-specialist`
- Spec for thin `NgbPopover` wrapper: API (`title`, `placement`, `triggers`), projected/string body, token styling.
- Save to `.kilo/plans/20260731-task2-popover-frontend-spec.md`.

#### 4.1b Analysis & Planning
- **Sub-agent:** `architector`
- Read spec; produce detailed plan.
- Save to `.kilo/plans/20260731-task2-popover-impl.md`.

#### 4.2 Implementation
- **Sub-agent:** `implementer`
- Build component, styles, tests, barrel. Update `public-api.ts` and `project-structure.md`. Commit.

#### 4.3 Code Review & Simplification
- **Sub-agent:** `code-reviewer` + `code-simplifier`
- Generate fix plan → `.kilo/plans/20260731-task2-popover-fix.md`.
- **Sub-agent:** `implementer` applies fixes.

#### 4.4 Documentation
- **Sub-agent:** `docs-specialist`
- JSDoc + `docs/CBA_POPOVER.md`.

#### 4.5a Front-end Verification
- **Sub-agent:** `frontend-specialist`
- Verify against spec.

#### 4.5b Overall Plan Adherence
- **Sub-agent:** `architector`
- Check against plan.

#### 4.6 Task Completion
- **Sub-agent:** `implementer`
- Add `[DONE]` to Task 2 in TODO file; commit.

---

### Task 3 — CbaTypeahead

#### 4.1a Front-end Technical Specification
- **Sub-agent:** `frontend-specialist`
- Spec for thin `NgbTypeahead` wrapper: reuse `CbaFieldComponent`, `ControlValueAccessor`, consumer-provided search function, themed suggestions popup.
- Save to `.kilo/plans/20260731-task3-typeahead-frontend-spec.md`.

#### 4.1b Analysis & Planning
- **Sub-agent:** `architector`
- Read spec; produce detailed plan.
- Save to `.kilo/plans/20260731-task3-typeahead-impl.md`.

#### 4.2 Implementation
- **Sub-agent:** `implementer`
- Build component, styles, tests, barrel. Update `public-api.ts` and `project-structure.md`. Commit.

#### 4.3 Code Review & Simplification
- **Sub-agent:** `code-reviewer` + `code-simplifier`
- Generate fix plan → `.kilo/plans/20260731-task3-typeahead-fix.md`.
- **Sub-agent:** `implementer` applies fixes.

#### 4.4 Documentation
- **Sub-agent:** `docs-specialist`
- JSDoc + `docs/CBA_TYPEAHEAD.md`.

#### 4.5a Front-end Verification
- **Sub-agent:** `frontend-specialist`
- Verify against spec.

#### 4.5b Overall Plan Adherence
- **Sub-agent:** `architector`
- Check against plan.

#### 4.6 Task Completion
- **Sub-agent:** `implementer`
- Add `[DONE]` to Task 3 in TODO file; commit.

---

### Task 4 — CbaModuleFooter

#### 4.1a Front-end Technical Specification
- **Sub-agent:** `frontend-specialist`
- Spec for plain module footer: `status`/`statusText` inputs aligned with `ModuleHeaderStatus`, token styling, projected content slot.
- Save to `.kilo/plans/20260731-task4-module-footer-frontend-spec.md`.

#### 4.1b Analysis & Planning
- **Sub-agent:** `architector`
- Read spec; produce detailed plan.
- Save to `.kilo/plans/20260731-task4-module-footer-impl.md`.

#### 4.2 Implementation
- **Sub-agent:** `implementer`
- Build component, styles, tests, barrel. Update `public-api.ts` and `project-structure.md`. Commit.

#### 4.3 Code Review & Simplification
- **Sub-agent:** `code-reviewer` + `code-simplifier`
- Generate fix plan → `.kilo/plans/20260731-task4-module-footer-fix.md`.
- **Sub-agent:** `implementer` applies fixes.

#### 4.4 Documentation
- **Sub-agent:** `docs-specialist`
- JSDoc + `docs/CBA_MODULE_FOOTER.md`.

#### 4.5a Front-end Verification
- **Sub-agent:** `frontend-specialist`
- Verify against spec.

#### 4.5b Overall Plan Adherence
- **Sub-agent:** `architector`
- Check against plan.

#### 4.6 Task Completion
- **Sub-agent:** `implementer`
- Add `[DONE]` to Task 4 in TODO file; commit.

---

### Step 5 — TODO File Completion
- **Sub-agent:** `implementer`
- Rename TODO file to `20260730-todo-4-DONE.md`.
- Merge `feat/phase6-dropdown-popover-typeahead-footer` into `main`.
- Push to `origin/main`.

---

## Constraints Summary

- Desktop-only.
- No custom dropdown/popover/typeahead engines — strictly ng-bootstrap wrappers.
- No business logic, no BFF calls, no validation framework.
- All visuals use `--cba-*` tokens.
- Components must be standalone.
- Max lines/methods/depth, private members, and other `.kilo/rules/` apply.
- JSDoc required on all public API.
- Minimal tests covering wrapper concerns only.

---

## Risk & Notes

- `NgbTypeahead` API may require careful binding to keep the wrapper thin while supporting Angular forms (`NG_VALUE_ACCESSOR`).
- `CbaPopover` API shape (component vs directive) should be chosen to stay as thin as possible; the spec will decide.
- `CbaModuleFooter` status mapping must stay aligned with `ModuleHeader` to avoid semantic drift.
