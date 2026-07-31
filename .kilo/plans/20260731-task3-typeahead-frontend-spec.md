# CbaTypeahead — Front-end Technical Specification

## 1. Goal

Provide a thin, theme-aligned `cba-typeahead` form control that wraps `@ng-bootstrap/ng-bootstrap` `NgbTypeahead`. The wrapper reuses the existing `CbaFieldComponent` layout and `CbaFieldControlValueAccessor` base, delegates filtering/popup/keyboard behaviour to ng-bootstrap, and does not introduce any additional autocomplete library.

## 2. Folder & Files

Use the project's existing source root `src/components/` (not `src/lib/components/`):

- `src/components/typeahead/cba-typeahead.component.ts`
- `src/components/typeahead/cba-typeahead.component.html`
- `src/components/typeahead/cba-typeahead.component.scss`
- `src/components/typeahead/cba-typeahead.component.spec.ts`
- `src/components/typeahead/cba-typeahead.types.ts`
- `src/components/typeahead/index.ts`
- `src/theme/_typeahead.scss` (global popup theming)
- Update `src/theme/theme.scss` to `@use 'typeahead';`
- Update `src/public-api.ts` to `export * from './components/typeahead';` (alphabetically after `skeleton`).

## 3. Component Architecture

### 3.1 Selector & Inheritance

- **Selector:** `cba-typeahead`
- **Class:** `CbaTypeaheadComponent extends CbaFieldControlValueAccessor<string>`
- **Change detection:** `OnPush`
- **Standalone:** yes
- **Provider:** `NG_VALUE_ACCESSOR` using `forwardRef(() => CbaTypeaheadComponent)`

### 3.2 Why no `hostDirectives`

`NgbTypeahead` selector is `input[ngbTypeahead]`. The natural and thinnest integration is to place the directive directly on the internal `<input>` inside `CbaFieldComponent`. This avoids the Angular 22 host-directive input/output mapping problems encountered in `CbaDropdown`/`CbaPopover`, keeps the wrapper's public API explicit, and still lets the wrapper set defaults such as `container="body"` and `popupClass`.

### 3.3 Internal wiring

The component projects a single native `<input>` into `CbaFieldComponent` and binds `NgbTypeahead` inputs/outputs through template syntax. An inner `ngModel` bridges the input's text value to the outer `ControlValueAccessor` value signal, mirroring the pattern used by `CbaDatepicker`.

Template outline:

```html
<cba-field
  [label]="label()"
  [hint]="hint()"
  [error]="error()"
  [disabled]="isDisabled()"
  [controlId]="controlId">
  <input
    [id]="controlId"
    type="text"
    class="cba-typeahead__control"
    [placeholder]="placeholder() ?? ''"
    [disabled]="isDisabled()"
    [ngbTypeahead]="search()"
    [inputFormatter]="inputFormatter()"
    [resultFormatter]="resultFormatter()"
    [editable]="editable()"
    [focusFirst]="focusFirst()"
    [showHint]="showHint()"
    [selectOnExact]="selectOnExact()"
    [placement]="placement()"
    [popupClass]="popupClass()"
    container="body"
    [ngModel]="value()"
    (ngModelChange)="onValueChange($event)"
    (blur)="onBlur()"
    (selectItem)="onItemSelected($event)"
    [attr.aria-describedby]="describedBy()"
    [attr.aria-invalid]="error() ? 'true' : null" />
</cba-field>
```

Component outline:

```ts
@Component({
  selector: 'cba-typeahead',
  standalone: true,
  imports: [CbaFieldComponent, FormsModule, NgbTypeahead],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-typeahead.component.html',
  styleUrl: './cba-typeahead.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CbaTypeaheadComponent),
      multi: true,
    },
  ],
  host: {
    class: 'cba-typeahead',
    '[class.cba-typeahead--disabled]': 'isDisabled()',
    '[class.cba-typeahead--error]': 'error()',
  },
})
export class CbaTypeaheadComponent extends CbaFieldControlValueAccessor<string> {
  protected override controlId = `cba-typeahead-control-${cbaTypeaheadUid++}`;

  readonly search = input.required<CbaTypeaheadSearchFn>();
  readonly placeholder = input<string | undefined>(undefined);
  readonly resultFormatter = input<CbaTypeaheadFormatter | undefined>(undefined);
  readonly inputFormatter = input<CbaTypeaheadFormatter | undefined>(undefined);
  readonly editable = input<boolean>(true);
  readonly focusFirst = input<boolean>(true);
  readonly showHint = input<boolean>(false);
  readonly selectOnExact = input<boolean>(false);
  readonly placement = input<CbaTypeaheadPlacement>([
    'bottom-start', 'bottom-end', 'top-start', 'top-end',
  ]);
  readonly popupClass = input<string>('cba-typeahead-window');

  readonly itemSelected = output<NgbTypeaheadSelectItemEvent>();

  protected onValueChange(value: string | null): void {
    this.updateValue(value);
  }

  protected onBlur(): void {
    this.markAsTouched();
  }

  protected onItemSelected(event: NgbTypeaheadSelectItemEvent): void {
    this.itemSelected.emit(event);
  }
}
```

Type aliases (`cba-typeahead.types.ts`):

```ts
import { OperatorFunction } from 'rxjs';
import { PlacementArray, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

export type CbaTypeaheadSearchFn = OperatorFunction<string, readonly any[]>;
export type CbaTypeaheadFormatter = (item: any) => string;
export type CbaTypeaheadPlacement = PlacementArray;
export type CbaTypeaheadItemSelectedEvent = NgbTypeaheadSelectItemEvent;
```

## 4. API Surface

| Kind | Name | Type | Default | Description |
|------|------|------|---------|-------------|
| Input | `label` | `string \| undefined` | `undefined` | Visible label text. |
| Input | `placeholder` | `string \| undefined` | `undefined` | Native input placeholder. |
| Input | `disabled` | `boolean` | `false` | Visual + native disabled state; combined with forms disabled state. |
| Input | `hint` | `string \| undefined` | `undefined` | Helper text below the field. |
| Input | `error` | `string \| undefined` | `undefined` | Visual error text below the field. |
| Input | `search` | `CbaTypeaheadSearchFn` | required | Search function passed to `NgbTypeahead`. |
| Input | `resultFormatter` | `CbaTypeaheadFormatter \| undefined` | `undefined` | Formats each result in the popup. |
| Input | `inputFormatter` | `CbaTypeaheadFormatter \| undefined` | `undefined` | Formats a selected item back into the input. If omitted, `resultFormatter` is used. |
| Input | `editable` | `boolean` | `true` | Allows free-text values not selected from the popup. |
| Input | `focusFirst` | `boolean` | `true` | Auto-focuses the first popup result while typing. |
| Input | `showHint` | `boolean` | `false` | Shows the matching result as a hint inside the input. |
| Input | `selectOnExact` | `boolean` | `false` | Auto-selects when only one exact match exists. |
| Input | `placement` | `CbaTypeaheadPlacement` | `['bottom-start','bottom-end','top-start','top-end']` | Preferred popup placement. |
| Input | `popupClass` | `string` | `'cba-typeahead-window'` | CSS class added to the popup for theming. |
| Output | `itemSelected` | `NgbTypeaheadSelectItemEvent` | — | Emitted when the user selects a popup item. |

The control value exposed through `NG_VALUE_ACCESSOR` is the **string currently in the input**. Consumers that need the underlying selected object can listen to `itemSelected`.

## 5. Forms Integration

- Provide `NG_VALUE_ACCESSOR` on the component so `<cba-typeahead [(ngModel)]="model">` and `formControlName` work.
- Extend `CbaFieldControlValueAccessor<string>` to inherit:
  - `value` signal
  - `disabledFromCva()` from `setDisabledState`
  - `updateValue` / `markAsTouched`
  - `isDisabled` computed from the `disabled` input and the forms disabled state
  - `describedBy` computed for `aria-describedby`
- The inner `ngModel` on the native input uses `NgbTypeahead` as its `ControlValueAccessor`. It is bound to the same `value()` signal:
  - Outer `writeValue` → sets `value()` → inner `[ngModel]` updates the input.
  - User types or selects → inner `(ngModelChange)` → `onValueChange` → `updateValue` → outer `onChange`.
- `onBlur` calls `markAsTouched()` so Angular forms marks the control touched.

## 6. Interaction Patterns

| User action | Behaviour |
|-------------|-----------|
| Type in input | `NgbTypeahead` debounces/filters via the `search` function and opens the popup when results are emitted. |
| ArrowDown / ArrowUp | `NgbTypeahead` moves the active item. |
| Enter | Selects the active item, closes the popup, and writes the formatted value to the input. |
| Escape | Closes the popup. |
| Click a popup item | Selects the item. |
| Blur | Closes the popup and marks the control touched. |

The wrapper does not implement its own filtering, debounce, or keyboard navigation.

## 7. Styling & Theme

### 7.1 Input surface

Reuse the same pattern as `CbaInput`:

- The visual border, background, radius, and focus ring come from `CbaFieldComponent` (`.cba-field__control`).
- The inner `<input>` extends `%cba-native-control` from `src/theme/_mixins.scss` so it is transparent and borderless.
- Host class `cba-typeahead--disabled` reduces opacity and sets `cursor: not-allowed` on the control.
- Host class `cba-typeahead--error` is available for any extra error styling; the red border is already applied by `CbaFieldComponent`.

### 7.2 Suggestions popup

`NgbTypeahead` appends the popup to `<body>` when `container="body"` is set, so component-emulated styles cannot reach it. Add a global theme partial `src/theme/_typeahead.scss` and import it in `src/theme/theme.scss`.

The popup uses class `cba-typeahead-window` (via `popupClass`). Target:

```scss
.cba-typeahead-window {
  background-color: var(--cba-bg-elevated);
  border: 1px solid var(--cba-border-subtle);
  border-radius: var(--cba-radius-md);
  box-shadow: var(--cba-shadow-elevated);
  color: var(--cba-text-primary);
  padding: var(--cba-space-1) 0;
  min-width: 12rem;
}

.cba-typeahead-window .dropdown-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--cba-space-2) var(--cba-space-4);
  border: none;
  background: transparent;
  color: var(--cba-text-primary);
  font-size: 0.875rem;
  line-height: 1.5;
  text-align: left;
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease;

  &:hover {
    background-color: var(--cba-hover);
  }

  &:active,
  &.active {
    background-color: var(--cba-active);
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset var(--cba-focus-ring);
  }

  &[disabled] {
    color: var(--cba-text-muted);
    cursor: not-allowed;
    opacity: 0.65;
  }
}

.cba-typeahead-window .ngb-highlight {
  color: var(--cba-accent-primary);
  font-weight: 700;
}

@media (prefers-reduced-motion: reduce) {
  .cba-typeahead-window .dropdown-item {
    transition: none;
  }
}
```

This matches the visual language of `CbaDropdown`: elevated background, subtle border, radius token, elevated shadow, hover/active states, and primary accent for highlighted text.

## 8. Accessibility

- `NgbTypeahead` adds `role="combobox"`, `aria-autocomplete="list"` (or `"both"` when `showHint` is true), `aria-expanded`, `aria-controls`, and `aria-activedescendant` to the input. Do not override these.
- The wrapper adds:
  - `<label for="controlId">` from `CbaFieldComponent`.
  - `aria-describedby` pointing to hint/error elements when present.
  - `aria-invalid="true"` when an `error` string is provided.
- The input is focusable and keyboard navigable via `NgbTypeahead`.
- Focus ring is provided by `CbaFieldComponent` through `--cba-focus-ring`.

## 9. Test Strategy

Create `cba-typeahead.component.spec.ts` using `ComponentFixture` and a host component.

**Test:**

- Renders label, hint, and error text via `CbaFieldComponent`.
- Sets `aria-describedby` to hint and/or error ids when present.
- Sets `aria-invalid="true"` when `error` is provided.
- Forwards `placeholder` to the native input.
- Applies host class `cba-typeahead--disabled` and sets the input `disabled` attribute when disabled.
- Updates the outer `ControlValueAccessor` value when the user types (dispatch `input` and/or rely on inner `ngModel`).
- Updates the native input after `writeValue`.
- Re-emits the `NgbTypeahead` `selectItem` event through the wrapper `itemSelected` output (can be triggered by dispatching a custom `selectItem` event on the input or by asserting the output binding exists).

**Do NOT test:**

- ng-bootstrap typeahead filtering, debounce, popup positioning, or highlight rendering.
- Advanced features such as `resultTemplate`, multi-select, tagging, or virtual scroll.

## 10. Example Usage

```ts
import { Component } from '@angular/core';
import { Observable, of, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', /* ... */
];

@Component({
  standalone: true,
  imports: [CbaTypeaheadComponent],
  template: `
    <cba-typeahead
      label="State"
      placeholder="Start typing a state..."
      hint="Choose from the list or type freely."
      [search]="searchStates"
      [(ngModel)]="selectedState"
      (itemSelected)="onStateSelected($event)" />
  `,
})
export class StatePickerComponent {
  selectedState: string | null = null;

  searchStates: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>,
  ) =>
    text$.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : US_STATES.filter((state) =>
              state.toLowerCase().includes(term.toLowerCase()),
            ),
      ),
    );

  onStateSelected(event: NgbTypeaheadSelectItemEvent): void {
    console.log('Selected item:', event.item);
  }
}
```

> The behaviour engine is `@ng-bootstrap/ng-bootstrap` `NgbTypeahead`. No additional autocomplete library is used.

## 11. Acceptance Criteria

- [ ] `CbaTypeaheadComponent` exists as a standalone component under `src/components/typeahead/`.
- [ ] It reuses `CbaFieldComponent` for label/hint/error layout and `CbaFieldControlValueAccessor` for forms wiring.
- [ ] It uses `NgbTypeahead` as the only autocomplete/typeahead engine.
- [ ] All API inputs/outputs from Section 4 are implemented and typed.
- [ ] Input theming matches `CbaInput` and popup theming matches the elevated menu surface of `CbaDropdown`.
- [ ] Global popup styles are added in `src/theme/_typeahead.scss` and imported by `src/theme/theme.scss`.
- [ ] Component is exported from `src/components/typeahead/index.ts` and re-exported from `src/public-api.ts`.
- [ ] JSDoc on the component and every public input/output includes usage notes and the explicit ng-bootstrap note.
- [ ] Minimal tests cover field rendering, disabled/error states, forms value propagation, and `itemSelected` emission.
- [ ] `npm run build` succeeds.
