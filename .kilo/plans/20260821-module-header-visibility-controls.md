# Global Plan — Module Header Visibility & Action Controls

**TODO source:** `.agent/todos/20260821/20260821-todo-0.md`
**Date:** 2026-08-21
**Target version:** 0.19.0 (minor bump — new inputs, backward-compatible)
**Branch:** `feat/module-header-visibility-controls`

---

## Pre-Analysis

This batch adds consumer-level visibility and enablement controls to `ModuleContainer` and `ModuleHeader`. All changes are additive (new inputs defaulting to `true`) and backward-compatible. No existing API is removed or renamed.

- **Front-end related:** Yes — all tasks touch Angular component inputs, templates, SCSS, and docs.
- **Key design decision:** `showHeader` on `ModuleContainer` is a **visual-only** hide (CSS `display: none` or similar), keeping the header in the DOM — distinct from the structural removal of `isCollapsed` on the body/footer.
- **Key design decision:** `showStatus` / `showTitle` on `ModuleHeader` replace the implicit `status = null` workaround with explicit boolean flags. Backward compatibility is preserved: when `showStatus` is not bound, `status = null` still hides the icon.
- **Key design decision:** Per-action `showXxx` / `enableXxx` flags on `ModuleHeader` need a clean config shape to respect the max-arguments-per-method rule (≤2 params). A single `ModuleHeaderActionsConfig` object input is preferable over 8 separate boolean inputs.
- **No theme token changes** are required, so the Token Change Checklist (brief.md §8.1) does not apply.

---

## Task Breakdown

### Task 1 — Add visual show/hide input for module header in container

**Scope:** `ModuleContainerComponent`

- Add `showHeader` boolean input (default `true`).
- Add host binding `cba-module-container--header-hidden` when `showHeader === false`.
- Add SCSS rule `:host(.cba-module-container--header-hidden) .cba-module-container__header { display: none; }` (visual-only, header stays in DOM).
- Add unit tests in `module-container.component.spec.ts`.
- Update `docs/CBA_MODULE_CONTAINER.md` with input table entry and behaviour note.

### Task 2 — Add explicit show/hide inputs for status icon and title in module header

**Scope:** `ModuleHeaderComponent`

- Add `showStatus` boolean input (default `true`).
- Add `showTitle` boolean input (default `true`).
- Update template: status icon section respects `showStatus`; title section respects `showTitle`.
- Preserve backward compatibility: `status = null` still hides the status icon when `showStatus` is not explicitly bound. Implementation: status icon is shown only when `showStatus() && statusVisual() !== null`.
- Add unit tests in `module-header.component.spec.ts`.
- Update `docs/CBA_MODULE_HEADER.md` with input table entries and behaviour notes.

### Task 3 — Add per-action visibility and enabled/disabled controls in module header

**Scope:** `ModuleHeaderComponent`

- Define `ModuleHeaderActionKey = 'collapse' | 'sizeToggle' | 'fullscreen' | 'remove'`.
- Define `ModuleHeaderActionsConfig` interface with `showXxx` and `enableXxx` boolean flags for each action.
- Add `actionsConfig` input of type `ModuleHeaderActionsConfig` (default: all `true`).
- Update template: each action button is wrapped in `@if (isActionVisible('xxx'))` and receives `[disabled]="!isActionEnabled('xxx')"`.
- Add unit tests covering each action's visibility and disabled state.
- Update `docs/CBA_MODULE_HEADER.md` with the config shape, input table entry, and examples.

### Task 4 — Acknowledge drag handle consumer control

**Scope:** Documentation only

- Update `docs/CBA_MODULE_HEADER.md` §Drag handle slot to explicitly state:
  - Show/hide/enable of the drag handle is owned by the Shell consumer.
  - The library provides only the projection slot; the consumer decides whether to project a handle, and can add `[disabled]` or `*ngIf` on the projected element.
- No code changes.

### Task 5 — Update Changelog and related documentation

**Scope:** `CHANGELOG.md`, `context.md`

- Bump `package.json` version to `0.19.0`.
- Add dated `[0.19.0] — 2026-08-21` header in `CHANGELOG.md` under `### Added`.
- Summarize: `ModuleContainer.showHeader`, `ModuleHeader.showStatus`, `ModuleHeader.showTitle`, `ModuleHeader.actionsConfig`.
- Update `context.md` "Recent Changes" and "Current Work Focus".

---

## Execution Order

| Step | Sub-agent | Description |
|------|-----------|-------------|
| 2 | implementer | Git feature branch setup (`feat/module-header-visibility-controls`) |
| 3 | implementer | Version bump to `0.19.0` in `package.json` |
| Task 1: 4.1a | frontend-specialist | Front-end technical specification for Task 1 |
| Task 1: 4.1b | architector | Implementation plan for Task 1 |
| Task 1: 4.2 | implementer | Implement Task 1 |
| Task 1: 4.3 | code-reviewer + code-simplifier | Review & simplify Task 1 |
| Task 1: 4.3-fix | implementer | Apply fixes from 4.3 |
| Task 1: 4.4 | docs-specialist | Documentation for Task 1 |
| Task 1: 4.5a | frontend-specialist | Front-end verification for Task 1 |
| Task 1: 4.5b | architector | Overall plan adherence for Task 1 |
| Task 1: 4.6 | implementer | Mark Task 1 `[DONE]` |
| Task 2: 4.1a | frontend-specialist | Front-end technical specification for Task 2 |
| Task 2: 4.1b | architector | Implementation plan for Task 2 |
| Task 2: 4.2 | implementer | Implement Task 2 |
| Task 2: 4.3 | code-reviewer + code-simplifier | Review & simplify Task 2 |
| Task 2: 4.3-fix | implementer | Apply fixes from 4.3 |
| Task 2: 4.4 | docs-specialist | Documentation for Task 2 |
| Task 2: 4.5a | frontend-specialist | Front-end verification for Task 2 |
| Task 2: 4.5b | architector | Overall plan adherence for Task 2 |
| Task 2: 4.6 | implementer | Mark Task 2 `[DONE]` |
| Task 3: 4.1a | frontend-specialist | Front-end technical specification for Task 3 |
| Task 3: 4.1b | architector | Implementation plan for Task 3 |
| Task 3: 4.2 | implementer | Implement Task 3 |
| Task 3: 4.3 | code-reviewer + code-simplifier | Review & simplify Task 3 |
| Task 3: 4.3-fix | implementer | Apply fixes from 4.3 |
| Task 3: 4.4 | docs-specialist | Documentation for Task 3 |
| Task 3: 4.5a | frontend-specialist | Front-end verification for Task 3 |
| Task 3: 4.5b | architector | Overall plan adherence for Task 3 |
| Task 3: 4.6 | implementer | Mark Task 3 `[DONE]` |
| Task 4: 4.1b | architector | Plan for Task 4 (no 4.1a needed — docs only) |
| Task 4: 4.2 | implementer | Implement Task 4 (docs edit) |
| Task 4: 4.3 | code-reviewer | Review Task 4 docs |
| Task 4: 4.4 | docs-specialist | Final docs polish for Task 4 |
| Task 4: 4.5b | architector | Adherence check for Task 4 |
| Task 4: 4.6 | implementer | Mark Task 4 `[DONE]` |
| Task 5: 4.1b | architector | Plan for Task 5 (changelog + context update) |
| Task 5: 4.2 | implementer | Implement Task 5 |
| Task 5: 4.3 | code-reviewer | Review changelog/context |
| Task 5: 4.5b | architector | Adherence check for Task 5 |
| Task 5: 4.6 | implementer | Mark Task 5 `[DONE]` |
| 5 | implementer | TODO file completion, merge branch, push to origin |

---

## Constraints & Notes

- All new inputs must use Angular `input()` signal API (consistent with existing codebase).
- All new public inputs require JSDoc.
- max-lines-per-file (200) and max-lines-per-method (50) rules apply.
- max-arguments-per-method rule: config object pattern for Task 3.
- No theme token changes → Token Change Checklist skipped.
- `docs/CBA_MODULE_HEADER.md` and `docs/CBA_MODULE_CONTAINER.md` are the primary consumer docs.
- No demo app changes required unless the demo uses these components directly (it uses `cba-module-header` and `cba-module-container`; demo updates are out of scope unless necessary for verification).
