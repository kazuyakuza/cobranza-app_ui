# CbaTypeahead — Code Review Fix Plan

## Review summary

- **Build:** `npm run build` succeeds.
- **Lint:** `npm run lint` succeeds.
- **Tests:** `npx jest src/components/typeahead/cba-typeahead.component.spec.ts` passes (13/13).
- **Plan adherence:** The component architecture matches the front-end spec and implementation plan: standalone, extends `CbaFieldControlValueAccessor<string>`, provides `NG_VALUE_ACCESSOR`, applies `NgbTypeahead` directly to the internal `<input>`, uses `container="body"` + `popupClass="cba-typeahead-window"`, and reuses the global popup theme.
- **Rule compliance:** File/method line counts, depth, param counts, private members, and self-documenting style are within limits.
- **Remaining issues:** Four required deviations need correction before final acceptance; two optional improvements are noted below.

## Required fixes

### 1. Missing public documentation file

- **Files:** `src/components/typeahead/cba-typeahead.component.ts` and `docs/CBA_TYPEAHEAD.md`
- **Issue:** The component JSDoc contains `@see [CBA_TYPEAHEAD.md](/docs/CBA_TYPEAHEAD.md)`, but `docs/CBA_TYPEAHEAD.md` does not exist. This leaves a broken reference and a gap in the public docs required by the front-end spec (Section 10).
- **Fix:** Create `docs/CBA_TYPEAHEAD.md` mirroring the structure of `CBA_INPUT.md` / `CBA_DATEPICKER.md`, with sections covering selector, import, basic usage, all inputs/outputs, a local search example, forms integration, accessibility, and theming. Include the explicit note that the engine is `@ng-bootstrap/ng-bootstrap` and no extra autocomplete dependency is used.
- **Verification:** `docs/CBA_TYPEAHEAD.md` exists; `npm run build` still passes.

### 2. Template non-null assertions deviate from the plan

- **File:** `src/components/typeahead/cba-typeahead.component.html`
- **Issue:** The template uses `[inputFormatter]="inputFormatter()!"` and `[resultFormatter]="resultFormatter()!"`. The implementation plan and front-end spec show these bindings without the non-null assertion (`[inputFormatter]="inputFormatter()"`, `[resultFormatter]="resultFormatter()"`). The `!` operator bypasses the type system without an explanatory comment and is not self-documenting.
- **Fix:** Remove the `!` assertions and align the bindings with the plan. If TypeScript strict template checking then rejects the `undefined` union, adjust the public input types in `cba-typeahead.types.ts` (or provide a sensible default formatter) instead of using `!`.
- **Verification:** `npm run build` passes; bindings match the implementation plan.

### 3. Incomplete JSDoc on public inputs/outputs

- **File:** `src/components/typeahead/cba-typeahead.component.ts`
- **Issue:** The implementation plan acceptance criteria state: *"JSDoc on the component class and every public input/output includes usage notes and the explicit 'engine is ng-bootstrap; no extra autocomplete dependency' note."* Currently only `search`, `resultFormatter`, and `inputFormatter` carry that note; `placeholder`, `editable`, `focusFirst`, `showHint`, `selectOnExact`, `placement`, `popupClass`, and `itemSelected` either have no JSDoc or only a one-line comment.
- **Fix:** Add concise JSDoc to each public input/output. Where the input is a passthrough to `NgbTypeahead`, include the explicit ng-bootstrap note. Keep the file raw line count under 200 and the code-body line count under 125 (comments do not count toward the code-body target).
- **Verification:** `npm run lint` passes; JSDoc covers every public input/output.

### 4. Test does not verify end-to-end typing through the inner ngModel bridge

- **File:** `src/components/typeahead/cba-typeahead.component.spec.ts`
- **Issue:** The CVA propagation test calls the protected `onValueChange` handler directly. The implementation plan test #9 explicitly requires dispatching a real `input` event on the native input to prove the inner `[ngModel]` → `(ngModelChange)` bridge works.
- **Fix:** Add a test that queries the native input, sets its value, dispatches `new Event('input')`, calls `fixture.detectChanges()`, and asserts that the registered `onChange` callback is called with the typed string and that the component's `value()` signal updates. Keep the existing direct-handler test if it is useful, or replace it with the end-to-end version.
- **Verification:** `npx jest src/components/typeahead/cba-typeahead.component.spec.ts` passes.

## Optional improvements

### 5. Hardcoded popup dimensions and typography

- **File:** `src/theme/_typeahead.scss`
- **Issue:** `min-width: 12rem` and `font-size: 0.875rem` are hardcoded. They are consistent with `CbaDropdown`, but the code guidelines prefer named constants / tokens.
- **Fix:** If the theme already exposes tokens for minimum menu width and body font size (or if they can be added without breaking other components), replace the hardcoded values. If no such tokens exist, keep the values for consistency and document them in `docs/THEME.md`.
- **Verification:** Visual regression check (or at least `npm run build` and a quick CSS inspection).

### 6. Additional edge-case tests for `aria-describedby`

- **File:** `src/components/typeahead/cba-typeahead.component.spec.ts`
- **Issue:** The current test only covers the case where both `hint` and `error` are present. Edge cases with only `hint`, only `error`, or neither are not exercised.
- **Fix:** Add focused tests for `aria-describedby` when only `hint` is provided, only `error` is provided, and when neither is provided (expecting `null`).
- **Verification:** `npx jest src/components/typeahead/cba-typeahead.component.spec.ts` passes.

## Verification commands

Run after applying fixes:

```bash
npm run build
npm run lint
npx jest src/components/typeahead/cba-typeahead.component.spec.ts
```

All three must pass before the fix sub-task is considered complete.
