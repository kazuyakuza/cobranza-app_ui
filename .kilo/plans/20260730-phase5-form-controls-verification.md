# Phase 5 Form Controls — Front-end Implementation Verification Report

**Task:** 4.5a verification for Tasks 2–5 of `20260730-todo-3.md`  
**Spec:** `.kilo/plans/20260730-phase5-form-controls-frontend-spec.md`  
**Branch:** `feat/phase5-modal-form-wrappers`  
**Date:** 2026-07-30

---

## 1. Verification Summary

All four units (shared `CbaFieldComponent`, `CbaInput`, `CbaSelect`, `CbaDatepicker`) were implemented, documented, and tested. The public API exports are correct, the project structure file is updated, and the build/test/lint pipeline passes.

| Check | Result |
| --- | --- |
| `npm run build` | Pass |
| `npm test` | Pass (11 suites, 82 tests) |
| `npm run lint` | Pass |
| `public-api.ts` exports | Correct alphabetical order |
| `.agent/project-structure.md` | Updated with four new folders |
| Docs | `CBA_FORM_FIELD.md`, `CBA_INPUT.md`, `CBA_SELECT.md`, `CBA_DATEPICKER.md` present |

---

## 2. Diffs Between Spec and Implementation

### 2.1 Shared `CbaFieldControlValueAccessor` base class (new, not in spec)

The implementation introduced an intermediate abstract directive `CbaFieldControlValueAccessor<T>` that consolidates the shared inputs (`label`, `disabled`, `hint`, `error`) and the `isDisabled`/`describedBy` computeds. The spec assumed each concrete control would declare these inputs individually.

- **Impact:** No functional or API change; the public inputs and behaviour are identical. It improves maintainability and reduces duplication.
- **Verdict:** Acceptable architectural refinement.

### 2.2 UID counters use post-increment

The spec examples use `++cbaInputUid` (pre-increment), while the implementation uses `cbaInputUid++` (post-increment). The first generated id is `0` instead of `1`, but ids remain unique and stable.

- **Files:** `cba-input.component.ts`, `cba-select.component.ts`, `cba-datepicker.component.ts`, `cba-field.component.ts`.
- **Verdict:** Cosmetic only; no functional impact.

### 2.3 `CbaSelect` change handler name

The spec names the handler `onChange`; the implementation uses `onSelectChange`. This avoids confusion with the `ControlValueAccessor` `registerOnChange` API.

- **Verdict:** Acceptable; self-documenting.

### 2.4 Datepicker popup theming location

Spec §6.5 recommends keeping the popup override inside the component SCSS using `::ng-deep`, but lists a global `_datepicker.scss` partial as an acceptable alternative. The implementation chose the global partial approach, consistent with the existing `_modal.scss` precedent.

- **Verdict:** Acceptable; both options were explicitly listed in the spec.

### 2.5 `CbaFieldComponent` host class modifiers

The spec lists host classes `cba-field`, `cba-field--disabled`, and `cba-field--error`. The implementation applies only `cba-field` to the host and applies the modifier classes to the inner root `<div class="cba-field">`. The visual state is identical.

- **Verdict:** Minor deviation; functionally equivalent.

---

## 3. Front-end Quality Findings

### 3.1 Datepicker disabled input redundancy

`CbaDatepicker` binds both `[disabled]="isDisabled()"` and `[readOnly]="isDisabled()"` on the native input. The spec only expects the native `disabled` attribute. The disabled test asserts `readOnly` but does not assert the `disabled` attribute.

- **Impact:** A disabled control is still visually and functionally disabled, but the extra `readonly` attribute is redundant and the test leaves a small coverage gap.
- **Recommendation:** Remove `[readOnly]="isDisabled()"` or add an assertion that the input has the `disabled` attribute.

### 3.2 Datepicker placeholder test coverage

The `placeholder` input is implemented and documented, but there is no explicit test asserting it is forwarded to the native input (unlike `CbaInput`, which does test it).

- **Impact:** Low; implementation is visibly correct.
- **Recommendation:** Add a placeholder assertion to `cba-datepicker.component.spec.ts` for parity.

### 3.3 `CbaDatepicker` placeholder `input()` declaration

The implementation declares `readonly placeholder = input<string | undefined>(undefined);` for `CbaDatepicker`, matching the spec.

### 3.4 `NgbInputDatepicker` import

The component imports `NgbInputDatepicker` directly as a standalone directive. The test imports `NgbDatepickerModule` to satisfy the directive's injected providers (`NgbDatepickerConfig`, `NgbDateAdapter`, etc.). This separation is correct.

### 3.5 Select disabled host class

`CbaSelect` tests separately verify the native `disabled` attribute and the `cba-select--disabled` host modifier. This is the most thorough disabled-state coverage among the three controls.

### 3.6 SCSS token usage

All new component styles use only `--cba-*` tokens and the shared `%cba-native-control` placeholder. The `_datepicker.scss` partial uses valid tokens that exist in `_variables.scss`.

### 3.7 Accessibility

- Label association via `[for]` and `[id]` is correct.
- `aria-describedby` is computed from `cba-field-ids.ts` and matches the rendered hint/error element ids.
- `aria-invalid="true"` is applied when `error` is truthy.
- Datepicker toggle has `aria-label="Open date picker"` and the icon is `aria-hidden`.
- Focus ring is visible via `:focus-within` on `.cba-field__control`.

### 3.8 CVA correctness

- All three controls provide `NG_VALUE_ACCESSOR` using `useExisting: forwardRef(() => ...)`.
- `writeValue` updates the signal; user interaction calls `updateValue`, which propagates to `onChange`.
- `onBlur` calls `markAsTouched`.
- `setDisabledState` updates the `disabledFromCva` signal; `isDisabled` merges it with the `disabled` input.

---

## 4. Overall Verdict

**PASS with minor notes.**

The implementation satisfies the front-end technical specification. All acceptance criteria are met, the build/test/lint pipeline is green, and the public API is correctly exported. The two noted quality items (datepicker disabled `readonly` redundancy and missing placeholder test) are small and should be addressed in the next review cycle or task completion, but they do not block verification.

---

## 5. Reported By

Front-end specialist verification step 4.5a.
