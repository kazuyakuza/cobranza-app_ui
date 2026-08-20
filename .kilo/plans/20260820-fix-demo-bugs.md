# Global Plan — Fix Angular Project Demo Bugs

**TODO source**: `.agent/todos/20260819/20260819-todo-1.md`
**Date**: 2026-08-20
**Type**: Front-end (Angular demo app `projects/demo/`)
**Version bump**: 0.18.1 → 0.18.2 (patch — bug fixes only)

---

## Overview

The demo app has multiple visual/layout bugs across module components and showcase sections. All fixes are confined to `projects/demo/src/app/` and `src/components/` (if library-side bugs are confirmed). The work is split into 4 task groups.

## Global Pre-analysis

- **Scope**: Demo app UI fixes only; no new library components or public API changes.
- **Library impact**: Some bugs (module footer at 50%, collapsed footer visibility) may require fixes in `src/components/module-footer/` or `src/components/module-container/`.
- **Branch**: `feat/fix-demo-bugs-20260820`
- **Build verification**: `npm run build` must pass after each task group.

---

## Task 1: Module Layout Fixes

**Covers TODO sections**: `modules footer`, `modules at 50% mode all wrong`, `modules header btns`

### Pre-analysis
- Module footer visual issues likely span both demo CSS and possibly library component SCSS.
- 50% width mode issues likely in demo workspace layout or `module-container.component.scss`.
- Header drag icon missing is a demo template issue.

### 4.1a Front-end Technical Specification → `frontend-specialist`
### 4.1b Implementation Plan → `architector`
- Fix module footer: rounded & integrated look at 100%, right-aligned status `[text][icon]`, correct width at 50%, hidden when collapsed.
- Fix module 50% width: exact half minus gutters.
- Add drag icon (`faUpDownLeftRight`) at 1st position in header, no functionality.
### 4.2 Implementation → `implementer`
### 4.3 Code Review & Simplification → `code-reviewer` + `code-simplifier`; fix → `implementer`
### 4.4 Documentation → `docs-specialist`
### 4.5a Front-end Verification → `frontend-specialist`
### 4.5b Overall Plan Adherence → `architector`
### 4.6 Task Completion → `implementer`

---

## Task 2: Header Search Input Centering

**Covers TODO section**: `header search input`

### Pre-analysis
- Single SCSS fix in `projects/demo/src/app/app.component.scss` (or equivalent header component).

### 4.1a Front-end Technical Specification → `frontend-specialist` *(may be combined with Task 1 spec if trivial)*
### 4.1b Implementation Plan → `architector`
### 4.2 Implementation → `implementer`
### 4.3 Code Review & Simplification → `code-reviewer` + `code-simplifier`; fix → `implementer`
### 4.4 Documentation → `docs-specialist`
### 4.5a Front-end Verification → `frontend-specialist`
### 4.5b Overall Plan Adherence → `architector`
### 4.6 Task Completion → `implementer`

---

## Task 3: Button & Pill Showcase Fixes

**Covers TODO sections**: `Buttons and Pills sections bugs`, `Footer bar btns`, `Button and pill sizes`

### Pre-analysis
- Reorganize button/pill matrices into status × variant tables with token/style info rows.
- Add borders to `bg-primary` groups.
- Restore footer pills / use Navigation items with section names (Clientes, Deudas, Pagos, Reportes).
- Add normal/bigger size variants to size section.

### 4.1a Front-end Technical Specification → `frontend-specialist`
### 4.1b Implementation Plan → `architector`
### 4.2 Implementation → `implementer`
### 4.3 Code Review & Simplification → `code-reviewer` + `code-simplifier`; fix → `implementer`
### 4.4 Documentation → `docs-specialist`
### 4.5a Front-end Verification → `frontend-specialist`
### 4.5b Overall Plan Adherence → `architector`
### 4.6 Task Completion → `implementer`

---

## Task 4: Demo Showcase Minor Fixes

**Covers TODO sections**: `minor bug in "Color tokens" section`, `Predefined icons section`, `minimal style in "Texts, fonts, labels" section`

### Pre-analysis
- Color tokens "selected-text" example text not visible → fix demo CSS contrast.
- Predefined icons section missing module header icons.
- Texts/fonts/labels `bg-primary` group needs border.

### 4.1a Front-end Technical Specification → `frontend-specialist` *(may be combined with Task 3 spec if trivial)*
### 4.1b Implementation Plan → `architector`
### 4.2 Implementation → `implementer`
### 4.3 Code Review & Simplification → `code-reviewer` + `code-simplifier`; fix → `implementer`
### 4.4 Documentation → `docs-specialist`
### 4.5a Front-end Verification → `frontend-specialist`
### 4.5b Overall Plan Adherence → `architector`
### 4.6 Task Completion → `implementer`

---

## Step 5: TODO File Completion

- Rename TODO file with `-DONE` suffix.
- Merge feature branch to `main`.
- Push `main` to `origin` only.

---

## Sub-agent Assignment Summary

| Step | Sub-agent |
|------|-----------|
| 2. Git Feature Branch Setup | `implementer` |
| 3. Version Update | `implementer` |
| Task 1: 4.1a Front-end Spec | `frontend-specialist` |
| Task 1: 4.1b Plan | `architector` |
| Task 1: 4.2 Implementation | `implementer` |
| Task 1: 4.3 Review + Fix | `code-reviewer` + `code-simplifier` → `implementer` |
| Task 1: 4.4 Documentation | `docs-specialist` |
| Task 1: 4.5a Front-end Verification | `frontend-specialist` |
| Task 1: 4.5b Adherence | `architector` |
| Task 1: 4.6 Completion | `implementer` |
| Task 2: 4.1a–4.6 | (same pattern) |
| Task 3: 4.1a–4.6 | (same pattern) |
| Task 4: 4.1a–4.6 | (same pattern) |
| 5. TODO File Completion | `implementer` |
