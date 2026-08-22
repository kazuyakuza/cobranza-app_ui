# Overall Plan Adherence Report — Task 3

- **Task**: Add per-action visibility and enabled/disabled controls in module header
- **TODO**: `.agent/todos/20260821/20260821-todo-0.md` (section *Add per-action visibility and enabled/disabled controls in module header*)
- **Plan**: `.kilo/plans/20260821-task3-plan.md`
- **Commit**: `fa4ed3a feat(module-header): add per-action visibility and disabled controls`
- **Date**: 2026-08-21

## Verification Method

- Read the implementation plan in full.
- Read all six implementation files at their current committed state.
- Inspected commit `fa4ed3a` with `git show --stat` and `git show` diffs.
- Ran `git status --porcelain` to confirm no uncommitted tracked-file changes remain.

## Files Modified (commit `fa4ed3a`)

Exactly the six files specified by plan Step 8, no out-of-scope files:

| File | Plan step | Status |
| --- | --- | --- |
| `src/components/module-header/module-header.types.ts` | Step 1 | ✅ matches |
| `src/components/module-header/module-header.component.ts` | Step 2 | ✅ matches |
| `src/components/module-header/module-header.component.html` | Step 3 | ✅ matches |
| `src/components/module-header/module-header.component.scss` | Step 4 | ✅ matches |
| `src/components/module-header/module-header.component.spec.ts` | Step 5 | ✅ matches |
| `docs/CBA_MODULE_HEADER.md` | Step 7 | ✅ matches |

Commit stat: 6 files changed, 267 insertions(+), 33 deletions(-). No `package.json`, `CHANGELOG.md`, `public-api.ts`, `index.ts` barrel, `ui-messages.ts`, or demo-app changes — consistent with plan *Out of Scope*.

## Step-by-Step Adherence

### Step 1 — types file ✅
- `ModuleHeaderActionsConfig` interface appended after `ModuleHeaderStatus` (lines 33-57). All eight optional flags present with JSDoc.
- `DEFAULT_MODULE_HEADER_ACTIONS_CONFIG` constant appended (lines 59-69). All eight flags set to `true`, typed `Required<ModuleHeaderActionsConfig>`.
- File total 69 lines (< 200). Exports flow through existing barrel (`index.ts` `export * from './module-header.types'`) — no barrel change needed.

### Step 2 — component.ts ✅
- **2a** Import block (lines 25-30) updated to import `DEFAULT_MODULE_HEADER_ACTIONS_CONFIG` and `ModuleHeaderActionsConfig` alongside existing `ModuleHeaderSize`, `ModuleHeaderStatus`. Order matches plan exactly.
- **2b** `actionsConfig` input (lines 160-162) inserted immediately after `showTitle` input and before `collapseToggle` output. Uses `DEFAULT_MODULE_HEADER_ACTIONS_CONFIG` as default. JSDoc matches plan.
- `effectiveActionsConfig` computed (lines 165-167) is `protected`, merges via object spread `{ ...DEFAULT_MODULE_HEADER_ACTIONS_CONFIG, ...this.actionsConfig() }`. Matches plan verbatim.
- `input`/`computed` already imported (lines 4-6) — no new Angular imports, as planned.
- File is now 236 lines (was 220). Pre-existing over-limit condition noted in plan; additions kept minimal (~16 lines). No refactor performed, per plan *Pre-Existing Condition Notes*.

### Step 3 — template ✅
- All four built-in buttons wrapped in `@if (effectiveActionsConfig().showXxx)` blocks (lines 31-77).
- Each `<button>` binds `[disabled]="!effectiveActionsConfig().enableXxx"`.
- Collapse (31-41), size toggle (43-53), fullscreen (55-65), remove (67-77) — content matches plan snippets exactly.
- Surrounding `<nav>` (line 22, 78), drag-handle comment block (23-29), `@if (!isFullscreen())` guard (21, 79), and `<ng-content select="[cbaModuleDragHandle]">` (line 29) unchanged. Drag handle NOT wrapped by any `@if`.
- Indentation: `@if` at 6 spaces, inner `<button>` at 8 spaces — consistent with existing `@if (showStatusSection())` style.

### Step 4 — SCSS ✅
- `.cba-module-header__action:disabled` rule (lines 74-78) inserted after `:active` (70-72) and before `--drag` (80).
- Uses only existing `--cba-state-disabled-text` token; `background-color: transparent; cursor: not-allowed;` — matches plan.
- Existing `:hover`, `:active`, `:focus-visible`, `--drag` rules untouched.

### Step 5 — spec.ts ✅
- Import updated (line 4): `import { ModuleHeaderActionsConfig, ModuleHeaderSize } from './module-header.types';` — matches plan 5f.
- 5a Visibility cases (lines 196-217): `VisibilityCase` interface, `VISIBILITY_CASES` table (4 entries), `it.each` asserting `queryButton(label)` is `null` when flag false.
- 5b Disabled cases (219-240): `DisabledCase`, `DISABLED_CASES`, asserts `button.disabled === true`.
- 5c Emission-guard cases (242-271): `EmissionCase`, `EMISSION_CASES`, subscribes to output, clicks disabled button, asserts `emitted.toHaveLength(0)`.
- 5d Default behaviour (273-281): asserts 4 nav buttons, all `disabled === false`.
- 5e Fullscreen precedence (283-295): sets all `showXxx: true` + `isFullscreen: true`, asserts `nav` is `null`.
- All new blocks inserted before closing `});` of first `describe` (line 296); second `describe` (drag handle, 298-334) untouched.
- Existing `ACTION_CASES`, `TestHostComponent`, `setup()`, `queryButton()` unchanged.
- `it.each` pattern reused (already established at line 59). `OutputEmitterRef` already imported (line 1).

### Step 7 — docs ✅
- 7a TOC: `- [Action controls](#action-controls)` added at line 11, after `- [Outputs](#outputs)` (line 10).
- 7b Inputs table: `actionsConfig` row added at line 90, after `showTitle` row (line 89). Type, default, required, description match plan.
- 7c "Action controls" section (lines 110-158) inserted after "Visibility inputs" subsection (ends line 108) and before "## Outputs" (line 160). Content matches plan: flag semantics, fullscreen precedence, drag-handle exclusion, partial config HTML example, `ModuleHeaderActionsConfig` TS snippet.
- 7d "Hidden actions" note (lines 214-217) added immediately after "must not be rearranged by consumers" line (212). Blockquote matches plan.
- 7e Accessibility bullet (lines 318-321) added after `prefers-reduced-motion` bullet (317). Wording matches plan.

## Acceptance Criteria Mapping

| Criterion | Plan step | Verified |
| --- | --- | --- |
| `ModuleHeaderActionsConfig` exported from types file | Step 1 | ✅ |
| `DEFAULT_MODULE_HEADER_ACTIONS_CONFIG` exported and used as input default | Step 1 + 2b | ✅ |
| `actionsConfig` input accepts partials, merges with defaults | Step 2b | ✅ |
| Each `showXxx` removes button via `@if` | Step 3 | ✅ |
| Each `enableXxx` binds `[disabled]` | Step 3 | ✅ |
| Unit tests: visibility + disabled for all four actions | Step 5a-5c | ✅ |
| Default + fullscreen precedence tests | Step 5d-5e | ✅ |
| `docs/CBA_MODULE_HEADER.md` updated | Step 7 | ✅ |
| No new `--cba-*` tokens | Step 4 | ✅ uses existing `--cba-state-disabled-text` |

## Deviations Found

**None.** The implementation is a verbatim match of the plan across all six files. No structural, architectural, or scope deviations were introduced. No out-of-scope files were touched.

## Out-of-Scope Compliance

- `package.json` / `CHANGELOG.md`: not touched (changelog is a separate TODO task). ✅
- `public-api.ts` / `index.ts` barrel: not touched (types already re-exported). ✅
- `ui-messages.ts` / demo app: not touched. ✅
- Drag-handle projection slot: not wrapped by `@if`; only the single docs note in Step 7d added. ✅
- No refactor of `module-header.component.ts` for line-count (pre-existing 236 lines). ✅
- No new outputs, inputs, or CSS classes beyond `actionsConfig`/`effectiveActionsConfig` and the `:disabled` rule. ✅
- No git push performed (restricted to CW step 5). ✅

## Verdict

**Adherent.** The Task 3 implementation fully conforms to the implementation plan. No corrective action required. No new TODO file needed.
