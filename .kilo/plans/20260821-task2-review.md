# Code Review Report — Task 2: ModuleHeader show/hide inputs

**Review date:** 2026-08-21  
**Reviewer step:** 4.3 Code Review  
**Plan:** `.kilo/plans/20260821-task2-plan.md`  
**Front-end spec:** `.kilo/plans/20260821-task2-frontend-spec.md`

## Summary

The implementation follows the approved plan. All four changed files contain the expected edits, the new inputs and template guards behave as specified, the six new unit tests are present and well-formed, and the documentation updates are accurate. `npm run lint` passes with no errors.

No fix plan is required.

## File-by-file comparison

### 1. `src/components/module-header/module-header.component.ts`

| Plan requirement | Implementation | Status |
| --- | --- | --- |
| Add `showStatus` boolean input, default `true`, after `status` | Lines 138-144: `readonly showStatus = input<boolean>(true);` with JSDoc | ✅ |
| Add `showTitle` boolean input, default `true`, after `showStatus` | Lines 146-151: `readonly showTitle = input<boolean>(true);` with JSDoc | ✅ |
| Place inputs before first output (`collapseToggle`) | Both inputs precede `collapseToggle` at line 153 | ✅ |
| No new imports needed | `input` already imported (line 5) | ✅ |
| No new computed signals | `statusVisual`/`statusClass` unchanged | ✅ |

### 2. `src/components/module-header/module-header.component.html`

| Plan requirement | Implementation | Status |
| --- | --- | --- |
| Status outer `@if` requires `!isFullscreen() && showStatus()` | Line 2: `@if (!isFullscreen() && showStatus()) {` | ✅ |
| Inner `@if (statusVisual(); as visual)` unchanged | Lines 6-11 untouched | ✅ |
| Title `<div>` wrapped with `@if (showTitle()) { ... }` | Lines 15-19 wrapped correctly | ✅ |
| Actions nav block untouched | Lines 21-67 unchanged | ✅ |

### 3. `src/components/module-header/module-header.component.spec.ts`

| Plan requirement | Implementation | Status |
| --- | --- | --- |
| Six new `it(...)` blocks added inside main `describe` | Lines 118-194 | ✅ |
| Tests inserted before main `describe` closing | After existing tests, before line 196 | ✅ |
| Second `describe` and existing tests untouched | Drag-handle tests at lines 197-233 unchanged | ✅ |
| No unused `component` binding causing lint errors | Tests call `setup()` directly | ✅ |

The test cases cover:

1. `showStatus = false` removes the status section.
2. `showStatus = true` + non-null `status` shows the icon.
3. `status = null` hides the icon even with default `showStatus = true`.
4. `showTitle = false` removes the title section.
5. `showTitle = true` shows the title section.
6. `isFullscreen = true` hides status and actions regardless of `showStatus`.

### 4. `docs/CBA_MODULE_HEADER.md`

| Plan requirement | Implementation | Status |
| --- | --- | --- |
| Inputs table updated with `showStatus` and `showTitle` | Lines 87-88 | ✅ |
| New `### Visibility inputs` subsection added | Lines 90-106 | ✅ |
| `null` status row updated | Line 127 | ✅ |
| Fullscreen behaviour section updated | Lines 129-144 | ✅ |
| No ToC entry for `Visibility inputs` | ToC unchanged | ✅ |

## Rule compliance

| Rule | Finding | Status |
| --- | --- | --- |
| `max-lines-per-file` (200 lines) | `module-header.component.ts` is 217 lines; spec file is 233 lines. Lint passes. The plan explicitly anticipated spec growth and instructed to proceed if lint is clean. The TS file length is pre-existing, not introduced by Task 2. | ⚠️ Noted, no action |
| `max-depth` | No new TS/SCSS nesting; template nesting unchanged. | ✅ |
| `max-arguments-per-method` | No new methods. | ✅ |
| `prefer-private-members` | New inputs are public signal inputs as required by Angular; other members appropriately scoped. | ✅ |
| `no-commented-code` | No commented-out code introduced. | ✅ |
| `single-section-boolean-conditions` | Template `@if (!isFullscreen() && showStatus())` follows the plan exactly; no TS compound conditions added. | ✅ |

## Lint

```bash
npm run lint
```

Result: clean exit, no errors.

## Potential concerns (non-blocking)

1. **Spec vs. plan interpretation of status section rendering.**  
   The front-end spec §10 states the status section renders only when `!isFullscreen() && showStatus() && statusVisual() !== null`. The implementation renders the status `<div>` when `!isFullscreen() && showStatus()` and leaves the inner `statusVisual()` guard unchanged, so an empty `<div>` is rendered when `status = null`. This matches the plan's **Interpretation A** (plan §0 and §3.2.1) and is therefore the authoritative behaviour for this implementation. The existing test at spec lines 100-110 and the new test at lines 145-152 both validate this.

2. **File length.**  
   Both `module-header.component.ts` and `module-header.component.spec.ts` exceed the 200-line guideline. Because `npm run lint` passes and the plan explicitly authorized the spec growth, no remediation is required for Task 2. A future refactor may split the component or spec if the project chooses to enforce the guideline strictly.

## Fix plan

No fixes required. The implementation is compliant with the approved plan and passes lint.
