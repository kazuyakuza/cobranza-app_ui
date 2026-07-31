# CbaTypeahead — Code Simplification Plan (Task 3, Phase 6)

> **Scope:** Review `src/components/typeahead/*`, `src/theme/_typeahead.scss`, and related files for simplification opportunities. Do **not** modify other Phase 6 tasks.
> **Current branch:** `feat/phase6-dropdown-popover-typeahead-footer`
> **Verification status:** `npm run build` succeeds; `npx jest src/components/typeahead` passes (13/13).

## 1. Executive summary

The implementation is already thin and aligned with the spec. The main simplification opportunities are:

1. Remove or consume the unused `CbaTypeaheadItemSelectedEvent` type alias.
2. Inline trivial one-line handler methods into the template using base-class methods.
3. Extract the duplicated elevated menu/item styling into a shared SCSS mixin/placeholder so `CbaDropdown` and the typeahead popup stay consistent.
4. Rewrite the spec to use host components and real DOM events, reducing protected-member access and ng-bootstrap internals assertions.
5. Fix minor consistency issues (hardcoded `0.875rem`, stale `@see` reference to a missing docs file).

## 2. Detailed simplification opportunities

### 2.1 TypeScript types — remove/consume unused alias

**File:** `src/components/typeahead/cba-typeahead.types.ts`

`CbaTypeaheadItemSelectedEvent` is exported but never used in `cba-typeahead.component.ts`. The component imports and types `itemSelected` directly with `NgbTypeaheadSelectItemEvent`.

**Recommended:**
- **Option A (preferred):** Use the alias in the component:
  ```ts
  readonly itemSelected = output<CbaTypeaheadItemSelectedEvent>();
  ```
  This keeps the public API surface importable from `components/typeahead`.
- **Option B:** Remove `CbaTypeaheadItemSelectedEvent` from `types.ts` and the barrel, shrinking the public API.

**Avoid** keeping the unused alias — it is dead code and contradicts the thin-wrapper goal.

### 2.2 Component handlers — inline trivial delegates

**File:** `src/components/typeahead/cba-typeahead.component.ts`

`onValueChange` and `onBlur` are single-line wrappers around `updateValue` and `markAsTouched`, which already exist on `CbaControlValueAccessor`. They add no logic and require extra JSDoc/testing surface.

`onItemSelected` is also a single-line emitter, but it converts the directive event shape to the component output; keeping it is reasonable for naming clarity.

**Recommended:**
- Inline the two trivial handlers in the template:
  ```html
  (ngModelChange)="updateValue($event)"
  (blur)="markAsTouched()"
  ```
  The base class methods are `protected`, which is accessible from the template.
- Keep `onItemSelected` (or rename to `onSelectItem` for consistency with `selectItem` event name).

**Result:** Remove ~6 lines of TS + two JSDoc blocks; no behaviour change.

### 2.3 Template attribute ordering

**File:** `src/components/typeahead/cba-typeahead.component.html`

The input binds `[inputFormatter]="inputFormatter()!"` and `[resultFormatter]="resultFormatter()!"` with non-null assertions. These are required because the directive inputs do not accept `undefined`.

**Recommended:**
- Keep the `!` assertions — they are the minimal fix.
- Reorder attributes for readability: static attributes (`type`, `class`, `container`) first, then Angular inputs, then outputs, then aria. This is a cosmetic-only change.

### 2.4 SCSS — eliminate duplication with `CbaDropdown`

**Files:**
- `src/theme/_typeahead.scss`
- `src/components/dropdown/cba-dropdown.component.scss`
- `src/theme/_mixins.scss`

The typeahead popup and the dropdown menu share nearly identical styling: elevated surface, item padding/hover/active/focus/disabled states, transition, reduced-motion media query. The duplicated rules will drift over time.

**Recommended:**
1. Add shared placeholders/mixins to `src/theme/_mixins.scss`:
   - `%cba-elevated-menu` — surface background, border, radius, shadow, padding, min-width.
   - `%cba-elevated-menu-item` — base item layout/typography.
   - `%cba-elevated-menu-item-hover`, `%cba-elevated-menu-item-active`, `%cba-elevated-menu-item-focus`, `%cba-elevated-menu-item-disabled` — state variants.
2. Replace the duplicate blocks in `_typeahead.scss` and `cba-dropdown.component.scss` with `@extend` or `@include` calls.
3. Replace the hardcoded `font-size: 0.875rem` with a SCSS variable or token. If no font-size token exists, add `--cba-text-sm: 0.875rem` to `_variables.scss` and use it in both places.

**Note:** `_typeahead.scss` must remain a global partial (popup is appended to `<body>`), while `cba-dropdown.component.scss` remains component-emulated. The shared mixins live in `_mixins.scss`, which is `@use`d by both.

### 2.5 Tests — align with `CbaInput` style

**File:** `src/components/typeahead/cba-typeahead.component.spec.ts`

Current spec:
- Tests the component directly rather than through host components.
- Accesses protected members (`['onValueChange']`, `['value']`, `['onItemSelected']`) via index access.
- Asserts `role="combobox"` to prove `ngbTypeahead` is applied — this tests ng-bootstrap internals.
- Splits error presence/absence and `aria-invalid` presence/absence into separate tests with duplicated setup.

**Recommended rewrite:**
1. Add host components (mirror `CbaInput` spec):
   - `TypeaheadHost` with `label`, `hint`, `error`, `placeholder`, `disabled`, and an `itemSelected` spy.
   - `TypeaheadNoErrorHost` for the negative error case.
2. Drive CVA propagation through real DOM events:
   - Set `input.value = 'hello'` and dispatch an `input` event; assert the bound `ngModel`/host property updates and the registered `onChange` callback is called.
3. Drive `itemSelected` by dispatching a synthetic `selectItem` event on the native input or by calling the handler through a public test harness; avoid direct protected access if possible.
4. Replace the `role="combobox"` assertion with a simple `expect(input).not.toBeNull()` or remove it entirely. The presence of the directive is already covered by the component compiling and the popup-related tests.
5. Parameterize presence/absence pairs with `it.each` or `describe.each` to reduce duplication.

**Keep:**
- The `searchStub` and `NgbTypeaheadModule` import — required for the directive's DI.
- Tests for label/hint/error rendering, `aria-describedby`, placeholder forwarding, disabled state, and `writeValue`.

### 2.6 Documentation consistency

**File:** `src/components/typeahead/cba-typeahead.component.ts`

The JSDoc contains `@see [CBA_TYPEAHEAD.md](/docs/CBA_TYPEAHEAD.md)`, but the file does not exist (verified: `docs/CBA_TYPEAHEAD.md` not found).

**Recommended:**
- **Option A:** Create `docs/CBA_TYPEAHEAD.md` with a concise usage example and the ng-bootstrap engine note (consistent with other components that have `/docs/CBA_*.md`).
- **Option B:** Remove the `@see` line until the docs file is created.

Do not leave a broken link in the public JSDoc.

### 2.7 Minor cleanups

1. **Magic number in `_typeahead.scss`:** `min-width: 12rem` is also used in `cba-dropdown.component.scss`. Add a SCSS variable (e.g., `$cba-menu-min-width: 12rem`) in `_variables.scss` or `_mixins.scss` and share it.
2. **Transition duration:** `120ms` is repeated in multiple component SCSS files. Consider a SCSS variable `$cba-transition-fast: 120ms` in `_variables.scss`.
3. **Opacity literal:** `0.65` for disabled items is duplicated. Consider a token or SCSS variable.

## 3. What should stay unchanged

| Area | Reason |
|------|--------|
| `CbaFieldControlValueAccessor` base class | Already shared; no duplication introduced by typeahead. |
| `NG_VALUE_ACCESSOR` / `forwardRef` provider pattern | Matches `CbaInput`, `CbaSelect`, `CbaDatepicker`. |
| `container="body"` + global `_typeahead.scss` | Required because ng-bootstrap appends the popup outside the host. |
| Boolean pass-through inputs (`editable`, `focusFirst`, `showHint`, `selectOnExact`) | They expose ng-bootstrap behaviour without reimplementing it. |
| `popupClass` input with default `'cba-typeahead-window'` | Allows global theming hook; default is sensible. |
| `placement` default array | Reasonable fallback ordering. |
| `index.ts` barrel | Standard pattern for all components. |

## 4. Suggested implementation order

1. Add shared SCSS placeholders/variables to `src/theme/_mixins.scss` (and `src/theme/_variables.scss` if adding tokens).
2. Refactor `src/theme/_typeahead.scss` and `src/components/dropdown/cba-dropdown.component.scss` to share menu styling.
3. In `src/components/typeahead/cba-typeahead.component.ts`, inline `onValueChange`/`onBlur` and consume or remove `CbaTypeaheadItemSelectedEvent`.
4. Update `src/components/typeahead/cba-typeahead.component.html` attribute order if desired.
5. Rewrite `src/components/typeahead/cba-typeahead.component.spec.ts` to use host components and real events.
6. Create `docs/CBA_TYPEAHEAD.md` or remove the broken `@see` reference.
7. Re-run `npm run build` and `npx jest src/components/typeahead`.

## 5. Risks and considerations

- **Template access to protected methods:** Inlining `updateValue` and `markAsTouched` in the template relies on Angular template access rules for protected members. Verify this compiles in partial compilation mode (`npm run build`).
- **SCSS refactoring scope:** The shared menu mixins touch `cba-dropdown.component.scss`. Although this is outside the strict Task 3 scope, the duplication is between Task 2 and Task 3 output; consolidating it is a valid simplification. Ensure the dropdown tests still pass after the refactor.
- **Test rewrite risk:** Replacing protected-member access with DOM events is behaviour-preserving but changes test internals. Confirm coverage remains at least equivalent.
- **Public API surface:** If `CbaTypeaheadItemSelectedEvent` is removed, any consumer already importing it would break. Since this is an in-flight feature branch, breakage is acceptable; otherwise prefer Option A (consume the alias).

## 6. Acceptance criteria for the simplification pass

- [ ] Build succeeds: `npm run build`.
- [ ] Typeahead tests pass: `npx jest src/components/typeahead`.
- [ ] Dropdown tests still pass: `npx jest src/components/dropdown`.
- [ ] No `!` non-null assertions remain unless required by directive typing.
- [ ] No unused public type aliases remain in `cba-typeahead.types.ts`.
- [ ] No broken `@see` docs reference remains.
- [ ] Shared menu styling has no visual regressions when compared side-by-side.
