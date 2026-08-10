# Global Plan — Phase 11: ModuleHeader Optional Drag-Handle Projection Slot

**TODO file:** `.agent/todos/20260809/20260809-todo-0.md`  
**Library:** `@cobranza-apps/ui`  
**Current version:** `0.12.2` → **bump to `0.13.0`** (additive minor feature)  
**Task type:** Front-end related (Angular component template, SCSS, tests, docs)

---

## Global Pre-Analysis

### Technical & Architecture Decisions

1. **Template change:** Replace the hardcoded built-in drag handle `<button>` with `<ng-content select="[cbaModuleDragHandle]"></ng-content>` placed **before** the built-in action buttons in the actions `<nav>`. This makes the drag handle opt-in via content projection — when the Shell (or any consumer) projects nothing, the slot renders nothing and the flex `gap` on the actions container keeps the layout identical to today.

2. **Fullscreen rule preserved:** The actions `<nav>` (and therefore the new projection slot) lives inside the `@else` branch of `@if (isFullscreen())`; when `isFullscreen === true`, only the title `<div>` is rendered. No extra logic needed.

3. **No CDK dependency:** The library does not import `DragDropModule`, does not add `@angular/cdk` to peer/dev deps, and does not emit drag outputs. The consumer applies `cdkDragHandle` (or any other DnD directive) on the **projected** element, which lives outside the library's ownership.

4. **CSS class retention:** Keep `.cba-module-header__action--drag` in the stylesheet so consumers can apply it to their projected button and get the `cursor: grab` + `cursor: grabbing` styling. All other `.cba-module-header__action` base styles (size, radius, hover, focus) apply naturally because the projected element sits inside the same flex actions container.

5. **i18n cleanup:** Remove `drag: 'Arrastrar módulo'` from `CBA_UI_MESSAGES.moduleHeader.aria` because the library no longer renders a drag button. The projected handle's accessible name is the **consumer's** responsibility (per TODO constraints).

6. **Component class cleanup:** Remove `protected readonly faDrag = faUpDownLeftRight;` import and property since the library no longer renders a built-in drag icon.

7. **Icon order update:** The documented action order changes from:
   - `drag → collapse → size → fullscreen → remove` (built-in drag handle)
   to:
   - `projected drag handle (optional) → collapse → size → fullscreen → remove` (built-in actions)

8. **Unit-test focus:** Three new tests only:
   - Empty slot: built-in buttons render exactly as before.
   - Projected handle: element with `cbaModuleDragHandle` appears inside `nav`.
   - Fullscreen: projected handle is not rendered (same as other actions).
   No CDK behaviour tested.

9. **Docs updates:**
   - `docs/MODULE_HEADER.md` — new projection slot section, Shell wiring example with `cdkDrag`/`cdkDragHandle`, ownership note, fullscreen rule.
   - `docs/CONSUMER_GUIDE.md` — Shell section: how to wire the handle, anti-pattern note.
   - `docs/USAGE.md` — ModuleHeader pattern updated with optional slot example.

10. **Changelog:** Add `### Added` entry under dated `[0.13.0] — 2026-08-09` per changelog-versioning rule.

---

## Steps Summary

| Step | Sub-agent | Description |
|------|-----------|-------------|
| 2 | implementer | Git Feature Branch Setup |
| 3 | implementer | Version Update (0.12.2 → 0.13.0) |
| 4.1a | frontend-specialist | Front-end Technical Specification |
| 4.1b | architector | Implementation Plan |
| 4.2 | implementer | Implementation (template, SCSS, TS, tests, docs, changelog) |
| 4.3 | code-reviewer + code-simplifier | Code Review & Simplification |
| 4.3-fix | implementer | Apply fixes & simplifications |
| 4.4 | docs-specialist | Documentation updates |
| 4.5a | frontend-specialist | Front-end Verification |
| 4.5b | architector | Overall Plan Adherence |
| 4.6 | implementer | Task Completion (mark [DONE], commit) |
| 5 | implementer | TODO File Completion (rename, merge, push) |

---

## Per-Task Plan

### Task: Phase 11 — ModuleHeader optional drag-handle projection slot

#### 4.1a. Front-end Technical Specification

**Input:** TODO file constraints, current `ModuleHeader` template/SCSS/TS/spec, docs.
**Output:** `.kilo/plans/20260809-phase11-drag-handle-frontend-spec.md`

Spec must cover:
- Exact template diff: replace built-in drag `<button>` with `<ng-content select="[cbaModuleDragHandle]"></ng-content>` inside the actions `<nav>`, before built-in buttons.
- SCSS changes: keep `.cba-module-header__action--drag` for consumer use; no new wrapper elements needed (flex gap handles empty slot).
- TypeScript cleanup: remove `faUpDownLeftRight` import and `faDrag` property.
- i18n cleanup: remove `drag` key from `CBA_UI_MESSAGES.moduleHeader.aria`.
- Unit-test plan: 3 focused tests (empty slot, projected handle present, fullscreen hides slot).
- Docs changes: MODULE_HEADER.md, CONSUMER_GUIDE.md, USAGE.md.
- Changelog entry.

#### 4.1b. Implementation Plan

**Input:** Front-end spec from 4.1a, current project state.
**Output:** `.kilo/plans/20260809-phase11-drag-handle.md`

Plan must detail:
1. Git branch: `feat/module-header-drag-handle-slot`
2. Version bump in `package.json`: `0.12.2` → `0.13.0`
3. `module-header.component.html`: remove built-in drag button, add `ng-content` slot.
4. `module-header.component.ts`: remove `faUpDownLeftRight` import and `faDrag` property.
5. `module-header.component.scss`: no structural changes (`.cba-module-header__action--drag` stays).
6. `src/i18n/ui-messages.ts`: remove `drag` entry.
7. `module-header.component.spec.ts`: add 3 projection tests; verify existing tests still pass.
8. `docs/MODULE_HEADER.md`: update icon order table, add projection slot section, add Shell wiring example, add drag ownership note.
9. `docs/CONSUMER_GUIDE.md`: add Shell wiring subsection under Shell checklist.
10. `docs/USAGE.md`: update ModuleHeader pattern with optional slot example.
11. `CHANGELOG.md`: add `[0.13.0] — 2026-08-09` with Added entry.
12. Build & test: `npm run build`, `npm test`, `npm run lint`.

#### 4.2. Implementation

Follow 4.1b plan step by step. Commit incrementally with meaningful messages.

#### 4.3. Code Review & Simplification

- **Code-reviewer:** Verify no CDK imports added, no drag outputs added, fullscreen logic correct, tests focused, docs accurate.
- **Code-simplifier:** Check for unnecessary wrapper elements, redundant CSS, overcomplicated test setups.
- Both produce fix/simplification plans saved to `.kilo/plans/20260809-phase11-drag-handle.md` (append).

#### 4.3-fix. Apply Fixes

Implementer applies review feedback. Max 3 cycles.

#### 4.4. Documentation

Docs-specialist adds JSDoc comments where needed and updates all consumer-facing docs.

#### 4.5a. Front-end Verification

Frontend-specialist verifies:
- Template matches spec exactly.
- No built-in drag button rendered.
- Projected element with `cbaModuleDragHandle` appears in actions area.
- Fullscreen mode hides slot.
- No CDK dependency added.
- Docs include Shell wiring example and ownership note.

#### 4.5b. Overall Plan Adherence

Architector checks implementation against 4.1b plan and front-end spec from 4.1a. Reports deviations if any.

#### 4.6. Task Completion

Implementer:
- Appends `[DONE]` to the task heading in `.agent/todos/20260809/20260809-todo-0.md`.
- Commits with meaningful message.

---

## Step 5: TODO File Completion

After 4.6:
1. Rename TODO file to `.agent/todos/20260809/20260809-todo-0-DONE.md`.
2. Merge `feat/module-header-drag-handle-slot` → `main`.
3. Push `main` to `origin` only.

---

## Acceptance Criteria (from TODO)

| # | Criterion | Plan Step |
|---|-----------|-----------|
| 1 | Optional `[cbaModuleDragHandle]` projection slot exists in `ModuleHeader` actions area. | 4.2 |
| 2 | Empty slot does not break layout or add a default handle. | 4.2, 4.5a |
| 3 | Slot is omitted in fullscreen (title-only) mode. | 4.2, 4.5a |
| 4 | No CDK dependency added to the library. | 4.3, 4.5a |
| 5 | No drag outputs added on `ModuleHeader`. | 4.3, 4.5a |
| 6 | Docs include Shell wiring example and ownership note. | 4.4, 4.5a |
| 7 | Minimal unit tests for projection present / absent / fullscreen. | 4.2, 4.5a |
| 8 | Library build succeeds. | 4.2, 4.5b |
