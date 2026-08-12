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
| `error` | `string \| undefined` | `undefined` | Error message below the select. **Visual only** — no validation logic. |
| `valid` | `boolean` | `false` | When `true`, applies the valid visual state (green border). **Visual only** — no validation logic. |
| `disabled` | `boolean` | `false` | Disabled state. Combined with Angular forms' disabled state. |
| `readonly` | `boolean` | `false` | Readonly visual state. **Note:** The native `<select>` element does not support the `readonly` attribute meaningfully, so this input is **visual-only** for `<cba-select>` — it applies the readonly styling but does not prevent the dropdown from opening. Use `disabled` to fully prevent interaction. |

All inputs are inherited from `CbaFieldControlValueAccessor`. See
[CBA_FORM_FIELD](./CBA_FORM_FIELD.md) for the shared conventions.

> **Note:** `error` and `valid` are **visual inputs only**. The component does not
> run any validation engine — consumers drive these from their own `FormGroup` /
> `FormControl` state.

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

## Visual state matrix

The select renders one of seven visual states. The state is determined by the
combination of inputs and pseudo-classes:

| State | Trigger | Border | Background | Text |
| --- | --- | --- | --- | --- |
| default | No interaction | `--cba-border-default` | `--cba-bg-secondary` | `--cba-text-primary` |
| hover | `:hover` | `--cba-border-default` | `--cba-bg-secondary` | `--cba-text-primary` |
| focus-visible | `:focus-visible` | `--cba-accent-primary` + `--cba-focus-ring` | `--cba-bg-secondary` | `--cba-text-primary` |
| disabled | `disabled` input or `setDisabledState` | `--cba-border-default` | `--cba-state-disabled-bg` | `--cba-state-disabled-text` |
| readonly | `readonly` input (visual only) | `--cba-border-default` | `--cba-bg-tertiary` | `--cba-text-primary` |
| invalid | `error` input truthy | `--cba-state-invalid-border` | `--cba-bg-secondary` | `--cba-text-primary` |
| valid | `valid` input `true` (and no `error`) | `--cba-state-valid-border` | `--cba-bg-secondary` | `--cba-text-primary` |

Priority order (highest first): disabled > invalid > valid > readonly > focus-visible > hover > default.

## Accessibility

- `<label for>` is automatically wired to the native `<select>` via the shared
  `controlId`.
- `aria-describedby` lists the hint and/or error element ids when present.
- `aria-invalid="true"` is set when `error` is truthy.
- Native `<select>` is keyboard-operable by default (Arrow keys, Enter, Space).
- `:focus-visible` uses the `--cba-focus-ring` token.
- `prefers-reduced-motion: reduce` disables the focus transition.
- Disabled state sets `cursor: not-allowed` and reduces opacity.
- Readonly state applies visual styling but does not prevent dropdown interaction.

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
| Invalid border | `--cba-state-invalid-border` |
| Invalid text | `--cba-state-invalid-text` |
| Valid border | `--cba-state-valid-border` |
| Valid text | `--cba-state-valid-text` |
| Disabled background | `--cba-state-disabled-bg` |
| Disabled text | `--cba-state-disabled-text` |
| Readonly background | `--cba-bg-tertiary` |
| Label colour | `--cba-text-secondary` |
| Hint colour | `--cba-text-muted` |
| Error colour | `--cba-accent-danger` |
| Border radius | `--cba-radius-sm` |
| Padding | `--cba-space-2` (vertical), `--cba-space-3` (horizontal) |

Host classes: `cba-select`, `cba-select--disabled`, `cba-select--readonly`, `cba-select--error`, `cba-select--invalid`, `cba-select--valid`.

## Non-goals

- **No custom dropdown** — the component renders the browser's native `<select>`; there is no search, filtering, or virtual scrolling inside the list.
- **No validation logic** — `error` and `valid` are presentational only.
- **No true readonly** — the native `<select>` does not support `readonly`; the input is visual-only.

## Related docs

- [CBA_FORM_FIELD](./CBA_FORM_FIELD.md) — shared label / hint / error conventions.
- [CBA_INPUT](./CBA_INPUT.md)
- [CBA_DATEPICKER](./CBA_DATEPICKER.md)
- [THEME](./THEME.md)
- [README](../README.md)
