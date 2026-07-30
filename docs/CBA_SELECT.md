# CbaSelect

Theme-aligned native `<select>` field with projected `<option>` elements and
`ControlValueAccessor` integration. No custom dropdown logic — the browser's
native `<select>` handles the dropdown, keyboard navigation, and option
rendering.

## Table of Contents

- [Selector](#selector)
- [Import](#import)
- [Basic usage](#basic-usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Content projection](#content-projection)
- [Forms integration](#forms-integration)
- [Accessibility](#accessibility)
- [Theming](#theming)
- [Related docs](#related-docs)

## Selector

`<cba-select>` — standalone component exported from `@cobranza-apps/ui`.

## Import

```ts
import { CbaSelectComponent } from '@cobranza-apps/ui';
```

## Basic usage

```html
<cba-select label="Status">
  <option value="">Choose...</option>
  <option value="active">Active</option>
  <option value="inactive">Inactive</option>
</cba-select>
```

## Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string \| undefined` | `undefined` | Visible label text above the select. |
| `hint` | `string \| undefined` | `undefined` | Helper text below the select. |
| `error` | `string \| undefined` | `undefined` | Error message below the select. Presentational only — no validation logic. |
| `disabled` | `boolean` | `false` | Disabled state. Combined with Angular forms' disabled state. |

All inputs are inherited from `CbaFieldControlValueAccessor`. See
[CBA_FORM_FIELD](./CBA_FORM_FIELD.md) for the shared conventions.

## Outputs

None. Use `ngModelChange` or `formControl.valueChanges` to observe value changes.

## Content projection

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| Options | `option` | Yes | Project `<option>` elements — they are forwarded into the inner `<select>` via `<ng-content select="option">`. |

```html
<cba-select label="Priority">
  <option value="">Select priority...</option>
  @for (p of priorities; track p.id) {
    <option [value]="p.id">{{ p.name }}</option>
  }
</cba-select>
```

## Forms integration

`CbaSelectComponent` provides `NG_VALUE_ACCESSOR` and implements
`ControlValueAccessor<string>`. It works with both template-driven and reactive
forms.

### Template-driven (`ngModel`)

```html
<cba-select label="Country" [(ngModel)]="country">
  <option value="">Choose...</option>
  <option value="ar">Argentina</option>
  <option value="br">Brazil</option>
</cba-select>
```

### Reactive forms (`formControlName`)

```ts
readonly form = new FormGroup({
  status: new FormControl('', Validators.required),
});
```

```html
<form [formGroup]="form">
  <cba-select
    label="Status"
    formControlName="status"
    [error]="form.get('status')?.invalid && form.get('status')?.touched
      ? 'Status is required'
      : undefined">
    <option value="">Choose...</option>
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </cba-select>
</form>
```

### Disabled state

The `disabled` input and Angular forms' `setDisabledState` are merged. Either
source disables the control.

## Accessibility

- `<label for>` is automatically wired to the native `<select>` via the shared
  `controlId`.
- `aria-describedby` lists the hint and/or error element ids when present.
- `aria-invalid="true"` is set when `error` is truthy.
- Native `<select>` is keyboard-operable by default (Arrow keys, Enter, Space).
- `:focus-visible` uses the `--cba-focus-ring` token.
- `prefers-reduced-motion: reduce` disables the focus transition.
- Disabled state sets `cursor: not-allowed` and reduces opacity.

## Theming

The native `<select>` is reset to transparent / borderless via the
`%cba-native-control` SCSS placeholder. The visible border, background, and
focus ring come from the parent `CbaFieldComponent` wrapper.

| Aspect | Token |
| --- | --- |
| Control background | `--cba-bg-secondary` |
| Control border | `--cba-border-default` |
| Focus border | `--cba-accent-primary` |
| Focus ring | `--cba-focus-ring` |
| Error border | `--cba-accent-danger` |
| Disabled background | `--cba-bg-tertiary` |
| Label colour | `--cba-text-secondary` |
| Hint colour | `--cba-text-muted` |
| Error colour | `--cba-accent-danger` |
| Border radius | `--cba-radius-sm` |
| Padding | `--cba-space-2` (vertical), `--cba-space-3` (horizontal) |

Host classes: `cba-select`, `cba-select--disabled`, `cba-select--error`.

## Related docs

- [CBA_FORM_FIELD](./CBA_FORM_FIELD.md) — shared label / hint / error conventions.
- [CBA_INPUT](./CBA_INPUT.md)
- [CBA_DATEPICKER](./CBA_DATEPICKER.md)
- [THEME](./THEME.md)
- [README](../README.md)
