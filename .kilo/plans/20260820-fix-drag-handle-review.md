# Code Review — Fix: Remove incorrectly added built-in drag handle from ModuleHeader

**Plan:** `.kilo/plans/20260820-fix-drag-handle-task.md`  
**Reviewer step:** 4.3 (Code Review)  
**Branch:** `feat/fix-moduleheader-drag-handle`  
**Date:** 2026-08-20

## Scope

Review the implementation against the plan for the files changed:

1. `src/components/module-header/module-header.component.html`
2. `src/components/module-header/module-header.component.ts`
3. `src/components/module-header/module-header.component.spec.ts`
4. `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts`
5. `docs/CBA_MODULE_HEADER.md`
6. `CHANGELOG.md`

## Findings

No errors, deviations, or missing changes were found. The implementation matches the plan in every reviewed file.

### Per-file verification

| File | Plan requirement | Implementation status |
|------|------------------|----------------------|
| `module-header.component.html` | Remove built-in drag `<button>`; keep `<ng-content select="[cbaModuleDragHandle]"></ng-content>`; leave exactly 4 built-in buttons (collapse, size, fullscreen, remove). | Done. No drag button remains; projection slot and comment are intact; 4 built-in buttons remain. |
| `module-header.component.ts` | Remove `faUpDownLeftRight` import and `faDrag` property; keep `faFullscreen` and `faXmark`. | Done. Neither `faUpDownLeftRight` nor `faDrag` appears in the file. |
| `module-header.component.spec.ts` | Empty-slot test expects `4`; projected-handle test expects total `5`. | Done. Both assertions updated correctly; `ACTION_CASES` and other tests untouched. |
| `demo-module-card.component.ts` | Import `FaIconComponent` + `faUpDownLeftRight`; add `FaIconComponent` to `imports`; project `<button cbaModuleDragHandle>` with `<fa-icon [icon]="faUpDownLeftRight">`; declare `faUpDownLeftRight` field. | Done. All four changes present and paired-tag indentation preserved. |
| `docs/CBA_MODULE_HEADER.md` | Icon order table reduced to 5 rows with dual-position note; optional-drag-handle note updated; Drag handle slot rule updated; no `no-op`/`faUpDownLeftRight` references. | Done. All three text blocks match the plan; grep for `no-op` and `faUpDownLeftRight` returns zero matches. |
| `CHANGELOG.md` | Insert `## [0.18.6] — 2026-08-20` with Fixed entries before `## [0.18.5]`; no `[Unreleased]` section. | Done. New section present and correctly ordered; no `[Unreleased]` section. |

### Commits

The implementation produced six logical commits (from `git log --oneline`):

1. `b493c63` — `changelog: record v0.18.6 ModuleHeader drag-handle fix`
2. `8367082` — `docs(module-header): remove built-in no-op drag button references`
3. `2748c44` — `demo(module-card): project drag handle via cbaModuleDragHandle slot`
4. `9c71e11` — `test(module-header): expect 4 built-in buttons; 5 with projected drag handle`
5. `e8e8e5b` — `fix(module-header): drop faUpDownLeftRight import and faDrag property`
6. `9788336` — `fix(module-header): remove incorrectly re-added built-in drag button`

### Verification results

- `npm run lint` — passed (exit 0, no output).
- `npm run test` — passed (22 suites, 242 tests).
- `npm run build` — passed (`build:lib` and `build:demo` both succeeded; demo bundle generated).

## Fix plan

No fixes are required. The implementation fully adheres to the plan and all acceptance criteria.

## Deviations

None.
