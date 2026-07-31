# CbaInput

Theme-aligned text input field with `ControlValueAccessor` integration. Wraps a
native `<input>` inside the shared `CbaFieldComponent` layout for consistent
label, hint, and error rendering.

## Table of Contents

- [Selector](#selector)
- [Import](#import)
- [Basic usage](#basic-usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Content projection](#content-projection)
- [Forms integration](#forms-integration)
- [Input types](#input-types)
- [Accessibility](#accessibility)
- [Theming](#theming)
- [Related docs](#related-docs)

## Selector

`<cba-input>` — standalone component exported from `@cobranza-apps/ui`.

## Import

```ts
import { CbaInputComponent } from '@cobranza-apps/ui';
```

## Basic usage

```html
<cba-input label="Email" type="email" hint="We never share your email." />
```

## Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string \| undefined` | `undefined` | Visible label text above the input. |
| `hint` | `string \| undefined` | `undefined` | Helper text below the input. |
| `error` | `string \| undefined` | `undefined` | Error message below the input. Presentational only — no validation logic. |
| `disabled` | `boolean` | `false` | Disabled state. Combined with Angular forms' disabled state. |
| `placeholder` | `string \| undefined` | `undefined` | Native input placeholder text. |
| `type` | `CbaInputType` | `'text'` | Native input type. See [Input types](#input-types). |

`label`, `hint`, `error`, and `disabled` are inherited from
`CbaFieldControlValueAccessor`. See [CBA_FORM_FIELD](./CBA_FORM_FIELD.md) for
the shared conventions.

## Outputs

None. Use `ngModelChange` or `formControl.valueChanges` to observe value changes.

## Content projection

None. The native `<input>` is rendered internally.

## Forms integration

`CbaInputComponent` provides `NG_VALUE_ACCESSOR` and implements
`ControlValueAccessor<string>`. It works with both template-driven and reactive
forms.

### Template-driven (`ngModel`)

```html
<cba-input label="Name" [(ngModel)]="customerName" />
```

### Reactive forms (`formControlName`)

```ts
readonly form = new FormGroup({
  name: new FormControl('', Validators.required),
});
```

```html
<form [formGroup]="form">
  <cba-input
    label="Name"
    formControlName="name"
    [error]="form.get('name')?.invalid && form.get('name')?.touched
      ? 'Name is required'
      : undefined" />
</form>
```

### Disabled state

The `disabled` input and Angular forms' `setDisabledState` are merged. Either
source disables the control:

```html
<cba-input label="Read-only" [disabled]="true" />
<!-- or -->
<cba-input label="Read-only" formControlName="field" />
<!-- with field.disable() in the component -->
```

## Input types

| `type` | Native type | Use case |
| --- | --- | --- |
| `'text'` (default) | `text` | General text input. |
| `'email'` | `email` | Email addresses. |
| `'password'` | `password` | Passwords (masked). |
| `'number'` | `number` | Numeric input. |
| `'url'` | `url` | URL input. |
| `'tel'` | `tel` | Telephone numbers. |

```ts
export type CbaInputType = 'text' | 'email' | 'password' | 'number' | 'url' | 'tel';
```

## Accessibility

- `<label for>` is automatically wired to the native input via the shared
  `controlId`.
- `aria-describedby` lists the hint and/or error element ids when present.
- `aria-invalid="true"` is set when `error` is truthy.
- `:focus-visible` uses the `--cba-focus-ring` token.
- `prefers-reduced-motion: reduce` disables the focus transition.
- Disabled state sets `cursor: not-allowed` and reduces opacity.

## Theming

The native `<input>` is reset to transparent / borderless via the
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

Host classes: `cba-input`, `cba-input--disabled`, `cba-input--error`.

## Non-goals

- **No validation logic** — `error` is presentational only; validation lives in the consumer's form model.
- **No masking or formatting** — the component renders a plain native `<input>`.

## Related docs

- [CBA_FORM_FIELD](./CBA_FORM_FIELD.md) — shared label / hint / error conventions.
- [CBA_SELECT](./CBA_SELECT.md)
- [CBA_DATEPICKER](./CBA_DATEPICKER.md)
- [THEME](./THEME.md)
- [README](../README.md)
