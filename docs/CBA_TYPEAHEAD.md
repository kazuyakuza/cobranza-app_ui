# CbaTypeahead

Thin, token-styled wrapper around `@ng-bootstrap/ng-bootstrap` typeahead (`NgbTypeahead`).
ng-bootstrap owns the popup list, filtering via the `search` function, keyboard navigation,
selection, highlight rendering, and Popper positioning. `CbaTypeahead` owns the shared field
layout (label / hint / error), theme alignment of the input surface (like `CbaInput`) and of
the elevated popup, and bridges the inner `ngModel` to an outer `ControlValueAccessor<string>`.

## Table of Contents

- [Selector](#selector)
- [Import](#import)
- [How it works](#how-it-works)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Basic usage — local search](#basic-usage--local-search)
- [With resultFormatter and inputFormatter](#with-resultformatter-and-inputformatter)
- [With label, hint, error (form-field style)](#with-label-hint-error-form-field-style)
- [With itemSelected event](#with-itemselected-event)
- [Theming notes](#theming-notes)
- [Accessibility](#accessibility)
- [Important notes](#important-notes)
- [Related docs](#related-docs)

## Selector

`<cba-typeahead>` — standalone, exported from `@cobranza-apps/ui`.

## Import

```ts
import { CbaTypeaheadComponent, CbaTypeaheadSearchFn } from '@cobranza-apps/ui';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
```

## How it works

- `CbaTypeaheadComponent` is the **wrapper shell**. It extends `CbaFieldControlValueAccessor<string>`
  to inherit the shared field inputs (`label`, `disabled`, `hint`, `error`) and forms wiring
  (`ControlValueAccessor`, `isDisabled`, `describedBy`).
- `NgbTypeahead` is applied directly to the internal `<input>` via the `[ngbTypeahead]` template
  binding — no `hostDirectives` and no manual DI forwarding is needed.
- Behaviour (filtering popup, keyboard navigation, selection, highlight, positioning) comes
  from ng-bootstrap. `CbaTypeahead` only adds theming and a stable consumer API.
- The control value is the **string currently in the input**. To react to a selected object,
  listen to the `itemSelected` output.
- Requires Bootstrap 5 CSS (peer dep) and `@ng-bootstrap/ng-bootstrap` ^21 (peer dep).

## Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string \| undefined` | `undefined` | Visible label rendered above the control. Inherited from `CbaFieldControlValueAccessor`. |
| `placeholder` | `string \| undefined` | `undefined` | Placeholder text shown in the native input when it is empty. |
| `disabled` | `boolean` | `false` | Disabled state, combined with the Angular forms disabled state. Inherited from `CbaFieldControlValueAccessor`. |
| `hint` | `string \| undefined` | `undefined` | Helper text rendered below the control. Inherited from `CbaFieldControlValueAccessor`. |
| `error` | `string \| undefined` | `undefined` | Visual error message rendered below the control (no validation logic). Inherited from `CbaFieldControlValueAccessor`. |
| `search` | `CbaTypeaheadSearchFn` | **required** | Search function forwarded to `NgbTypeahead`. Maps a stream of typed terms to a stream of result arrays. Owns debounce and filtering. Engine is ng-bootstrap. |
| `resultFormatter` | `CbaTypeaheadFormatter` | `defaultCbaTypeaheadFormatter` | Formats each popup result for display. Passthrough to `NgbTypeahead#resultFormatter`. |
| `inputFormatter` | `CbaTypeaheadFormatter` | `defaultCbaTypeaheadFormatter` | Formats a selected item back into the input. Passthrough to `NgbTypeahead#inputFormatter`. |
| `editable` | `boolean` | `true` | When `true`, allows free-text values not selected from the popup. Passthrough to `NgbTypeahead#editable`. |
| `focusFirst` | `boolean` | `true` | When `true`, keeps the first popup result focused while typing. Passthrough to `NgbTypeahead#focusFirst`. |
| `showHint` | `boolean` | `false` | When `true`, shows the matching result as a hint inside the input. Passthrough to `NgbTypeahead#showHint`. |
| `selectOnExact` | `boolean` | `false` | When `true`, auto-selects when only one exact match exists. Passthrough to `NgbTypeahead#selectOnExact`. |
| `placement` | `CbaTypeaheadPlacement` (`PlacementArray`) | `['bottom-start', 'bottom-end', 'top-start', 'top-end']` | Preferred popup placement(s). Passthrough to `NgbTypeahead#placement`. |
| `popupClass` | `string` | `'cba-typeahead-window'` | CSS class added to the popup window for theming. Passthrough to `NgbTypeahead#popupClass`. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `itemSelected` | `CbaTypeaheadItemSelectedEvent` (`NgbTypeaheadSelectItemEvent`) | Emitted when the user selects a popup item. Mirrors `NgbTypeahead#selectItem`. Use `event.item` to access the selected object. |

## Basic usage — local search

Static array filtered locally. The consumer owns the `search` function (debounce, filter, map).

### Template (HTML)

```html
<cba-typeahead
  [search]="searchStates"
  [(ngModel)]="selectedState" />
```

### Host component (TypeScript)

```ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CbaTypeaheadComponent } from '@cobranza-apps/ui';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  // ...
];

@Component({
  selector: 'app-state-picker',
  standalone: true,
  imports: [FormsModule, CbaTypeaheadComponent],
  templateUrl: './state-picker.component.html',
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
          : US_STATES.filter((s) =>
              s.toLowerCase().includes(term.toLowerCase()),
            ),
      ),
    );
}
```

## With resultFormatter and inputFormatter

When search results are objects (not strings), provide formatters to control display.

```html
<cba-typeahead
  label="Customer"
  [search]="searchCustomers"
  [resultFormatter]="formatCustomerResult"
  [inputFormatter]="formatCustomerInput"
  [(ngModel)]="customerQuery"
  (itemSelected)="onCustomerSelected($event)" />
```

```ts
searchCustomers: OperatorFunction<string, readonly Customer[]> = (
  text$: Observable<string>,
) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map((term) =>
      term.length < 2
        ? []
        : this.customers.filter((c) =>
            c.name.toLowerCase().includes(term.toLowerCase()),
          ),
    ),
  );

formatCustomerResult = (customer: Customer): string =>
  `${customer.name} (${customer.id})`;

formatCustomerInput = (customer: Customer): string => customer.name;

onCustomerSelected(event: NgbTypeaheadSelectItemEvent): void {
  this.selectedCustomer = event.item as Customer;
}
```

## With label, hint, error (form-field style)

Reuses the shared form-field layout from Phase 5 (`CbaFieldComponent`).

```html
<cba-typeahead
  label="State"
  placeholder="Start typing a state..."
  hint="Choose from the list or type freely."
  [error]="formError"
  [search]="searchStates"
  [(ngModel)]="selectedState" />
```

The `label`, `hint`, and `error` inputs are rendered by `CbaFieldComponent` using the same
layout as `CbaInput`, `CbaSelect`, and `CbaDatepicker`. The `error` input is purely visual —
no validation logic is performed by the wrapper.

## With itemSelected event

React to the selected object (not just the string value):

```html
<cba-typeahead
  label="State"
  [search]="searchStates"
  [(ngModel)]="selectedState"
  (itemSelected)="onStateSelected($event)" />
```

```ts
onStateSelected(event: NgbTypeaheadSelectItemEvent): void {
  console.log('Selected:', event.item);
  // event.item is the full object/string from the search results
}
```

> **Note:** The control value (`ngModel` / `formControl`) is the **string in the input**.
> Use `itemSelected` to access the underlying selected object.

## Theming notes

- Input surface: same as `CbaInput` — `--cba-bg-secondary`, `--cba-border-subtle`,
  `--cba-radius-sm`, `--cba-focus-ring` (via `CbaFieldComponent`).
- Disabled host: `cba-typeahead--disabled` — `opacity: 0.6`, `cursor: not-allowed`.
- Error host: `cba-typeahead--error` — red border applied by `CbaFieldComponent`.
- Host modifier classes are bound on the host element; the component SCSS targets
  them with `:host(.cba-typeahead--disabled) .cba-typeahead__control { }` (not
  plain descendant selectors). See `AGENTS.md` §Component authoring: host modifiers.
- Popup surface: `--cba-bg-elevated`, `--cba-border-subtle`, `--cba-radius-md`,
  `--cba-shadow-elevated` (global `.cba-typeahead-window` class in `src/theme/_typeahead.scss`).
- Popup item hover: `--cba-hover`; active: `--cba-active`.
- Popup item text: `--cba-text-primary`; disabled item: `--cba-text-muted`.
- Popup highlight: `--cba-accent-primary` (bold, primary accent color).
- Reduced motion: popup item transitions disabled under `@media (prefers-reduced-motion: reduce)`.

## Accessibility

- `NgbTypeahead` adds `role="combobox"`, `aria-autocomplete`, `aria-expanded`, `aria-controls`,
  and `aria-activedescendant` to the input. Do not override these.
- The wrapper adds:
  - `<label for="controlId">` from `CbaFieldComponent`.
  - `aria-describedby` pointing to hint/error elements when present.
  - `aria-invalid="true"` when an `error` string is provided.
- Keyboard navigation (ArrowDown/Up, Enter, Escape) comes from `NgbTypeahead`.
- The input is focusable and keyboard navigable.
- Focus ring is provided by `CbaFieldComponent` through `--cba-focus-ring`.

## Important notes

- **Engine is ng-bootstrap typeahead; no extra autocomplete dependency.** `CbaTypeahead` does
  not reimplement filtering, debounce, popup positioning, keyboard navigation, or highlight
  rendering. It only adds theming and a stable API.
- `NgbTypeahead` is applied directly to the internal `<input>` via `[ngbTypeahead]` template
  binding. No `hostDirectives` or manual DI forwarding is needed.
- `container="body"` is set by the wrapper so the popup is appended to `<body>` and avoids
  clipping by `overflow: hidden` ancestors.
- The control value exposed through `NG_VALUE_ACCESSOR` is the **string currently in the input**.
  To access the selected object, use the `itemSelected` output.
- The `search` function is **required** and must be provided by the consumer. The wrapper does
  not include any data source or BFF logic.
- `resultFormatter` and `inputFormatter` default to `defaultCbaTypeaheadFormatter`
  (`String(item)` with `''` for `null`/`undefined`), matching ng-bootstrap's fallback.

## Related docs

- [README](../README.md)
- [USAGE](./USAGE.md)
- [THEME](./THEME.md)
- [CBA_DROPDOWN](./CBA_DROPDOWN.md)
- [CBA_POPOVER](./CBA_POPOVER.md)
- [ng-bootstrap typeahead docs](https://ng-bootstrap.github.io/#/components/typeahead)
