# CbaFormField (shared layout)

Internal shared layout that renders a consistent label / control / hint / error
structure for every Cba form control (`CbaInput`, `CbaSelect`, `CbaDatepicker`).
Not exported from the public API — documented here so future controls stay
consistent.

## Table of Contents

- [Architecture](#architecture)
- [Shared inputs](#shared-inputs)
- [Content projection](#content-projection)
- [Label / hint / error conventions](#label--hint--error-conventions)
- [Accessibility wiring](#accessibility-wiring)
- [Id generation](#id-generation)
- [ControlValueAccessor base classes](#controlvalueaccessor-base-classes)
- [Theming](#theming)
- [Adding a new form control](#adding-a-new-form-control)
- [Related docs](#related-docs)

## Architecture

```
+------------------------------------------+
|  CbaInput / CbaSelect / CbaDatepicker    |
|  (extend CbaFieldControlValueAccessor)   |
|                                          |
|  +------------------------------------+  |
|  |  <cba-field>  (CbaFieldComponent)  |  |
|  |                                    |  |
|  |  <label for="controlId">          |  |
|  |  <ng-content> -> native control   |  |
|  |  <div id="...-hint">  hint text   |  |
|  |  <div id="...-error"> error text  |  |
|  +------------------------------------+  |
+------------------------------------------+
```

- `CbaFieldComponent` is the **layout shell** — it renders label, projected
  control, hint, and error. It is not exported from the public API.
- `CbaControlValueAccessor<T>` is the abstract `ControlValueAccessor` base
  class — holds `value` and `disabledFromCva` signals.
- `CbaFieldControlValueAccessor<T>` extends the CVA base and adds the common
  field inputs (`label`, `disabled`, `hint`, `error`) plus computed
  `isDisabled` and `describedBy`.
- Concrete controls (`CbaInput`, `CbaSelect`, `CbaDatepicker`) extend
  `CbaFieldControlValueAccessor`, assign a unique `controlId`, and project
  their native element into `<cba-field>`.

## Shared inputs

These inputs are declared on `CbaFieldControlValueAccessor` and inherited by
every concrete control. They are forwarded to `<cba-field>` in each control's
template.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string \| undefined` | `undefined` | Visible label text. When set, a `<label for="controlId">` is rendered. |
| `hint` | `string \| undefined` | `undefined` | Helper text rendered below the control. |
| `error` | `string \| undefined` | `undefined` | Visual error message rendered below the control. **Visual only** — no validation logic. |
| `valid` | `boolean` | `false` | When `true`, applies the valid visual state (green border). **Visual only** — no validation logic. |
| `disabled` | `boolean` | `false` | Disabled state. Combined with Angular forms' `setDisabledState` via `isDisabled()` computed. |
| `readonly` | `boolean` | `false` | Readonly state. Applies the readonly visual state. |

> **Note:** `error` and `valid` are **visual inputs only**. The field
> infrastructure does not run any validation engine — consumers drive these
> from their own `FormGroup` / `FormControl` state.

## Content projection

`<cba-field>` exposes a single default `<ng-content>` slot for the native
control element. Concrete controls project their `<input>`, `<select>`, or
datepicker wrapper into this slot.

## Label / hint / error conventions

All Cba form controls follow the same conventions so consumers get a
predictable API:

1. **Label** — optional. When provided, rendered as a `<label>` element with
   `for` pointing to the native control's `id`. When omitted, no `<label>` is
   rendered (useful for inline or icon-only controls).
2. **Hint** — optional helper text below the control. Rendered with
   `id="{controlId}-hint"` and included in `aria-describedby` when present.
3. **Error** — optional error message below the control. Rendered with
   `id="{controlId}-error"` and included in `aria-describedby` when present.
   Also sets `aria-invalid="true"` on the native control and applies the
   `cba-field--error` host class (red border).
4. **No built-in validation** — the `error` input is purely presentational.
   Consumers drive it from their own `FormGroup` / `FormControl` state:

```html
<cba-input
  label="Email"
  [error]="emailCtrl.invalid && emailCtrl.touched ? 'Enter a valid email' : undefined"
  [formControl]="emailCtrl" />
```

5. **Disabled** — the `disabled` input and Angular forms' `setDisabledState`
   are merged. Either source disables the control.

## Accessibility wiring

The field infrastructure handles `aria-describedby` and `<label for>`
automatically:

- `<label for="{controlId}">` links the label to the native control.
- `aria-describedby` on the native control lists the ids of the hint and/or
  error elements that are currently rendered. When neither is present,
  `aria-describedby` is `null` (attribute not rendered).
- `aria-invalid="true"` is set on the native control when `error` is truthy.

## Id generation

Each concrete control generates a stable unique id at construction time using
a module-level counter:

| Control | Id pattern |
| --- | --- |
| `CbaInput` | `cba-input-control-{n}` |
| `CbaSelect` | `cba-select-control-{n}` |
| `CbaDatepicker` | `cba-datepicker-control-{n}` |

The id is shared by the native control's `id` attribute and the `<label for>`
attribute. Hint and error ids are derived as `{controlId}-hint` and
`{controlId}-error` via `fieldHintId()` / `fieldErrorId()` in
`cba-field-ids.ts`.

## ControlValueAccessor base classes

```
CbaControlValueAccessor<T>              <- abstract; holds value signal, disabledFromCva signal
  +- CbaFieldControlValueAccessor<T>    <- abstract; adds label/hint/error/disabled/readonly/valid inputs,
  |                                       isDisabled computed, describedBy computed
  +- CbaInputComponent                  <- controlId = cba-input-control-{n}
  +- CbaSelectComponent                 <- controlId = cba-select-control-{n}
  +- CbaDatepickerComponent             <- controlId = cba-datepicker-control-{n}
```

### `CbaControlValueAccessor<T>`

- `protected readonly value: signal<T | null>` — current value, written by
  `writeValue` and updated by `updateValue()`.
- `protected readonly disabledFromCva: signal<boolean>` — disabled flag pushed
  by Angular forms via `setDisabledState`.
- `protected updateValue(value)` — sets the value signal and calls `onChange`.
- `protected markAsTouched()` — calls `onTouched`.

### `CbaFieldControlValueAccessor<T>`

- Inherits all of `CbaControlValueAccessor`.
- Adds `label`, `disabled`, `hint`, `error` inputs.
- `protected readonly isDisabled: computed<boolean>` — `disabled() || disabledFromCva()`.
- `protected readonly describedBy: computed<string | null>` — space-separated
  hint/error ids for `aria-describedby`.
- `protected controlId: string` — assigned by each concrete control.

## Shared field state classes

`<cba-field>` applies host classes based on the current state. These classes are
shared by all concrete controls (`CbaInput`, `CbaSelect`, `CbaDatepicker`) and
can be targeted by consumer CSS when needed:

| Class | Applied when | Border token | Background token | Text token |
| --- | --- | --- | --- | --- |
| `.cba-field--disabled` | `disabled` input `true` or `setDisabledState(true)` | `--cba-border-default` | `--cba-state-disabled-bg` | `--cba-state-disabled-text` |
| `.cba-field--readonly` | `readonly` input `true` | `--cba-border-default` | `--cba-bg-tertiary` | `--cba-text-primary` |
| `.cba-field--invalid` | `error` input truthy | `--cba-state-invalid-border` | `--cba-bg-secondary` | `--cba-text-primary` |
| `.cba-field--valid` | `valid` input `true` (and no `error`) | `--cba-state-valid-border` | `--cba-bg-secondary` | `--cba-text-primary` |
| `.cba-field--error` | `error` input truthy (legacy alias) | `--cba-state-invalid-border` | `--cba-bg-secondary` | `--cba-text-primary` |

Priority order (highest first): disabled > invalid > valid > readonly > default.

The `:hover` and `:focus-visible` pseudo-classes layer on top of the base state
using the standard interaction tokens (`--cba-hover`, `--cba-accent-primary`,
`--cba-focus-ring`).

## Theming

The field layout uses these tokens:

| Element | Tokens |
| --- | --- |
| Wrapper gap | `--cba-space-2` |
| Label | `--cba-text-secondary`, `0.875rem`, weight `500` |
| Control border | `--cba-border-default`, `--cba-radius-sm` |
| Control background | `--cba-bg-secondary` |
| Focus ring | `--cba-accent-primary` border, `--cba-focus-ring` shadow |
| Invalid border | `--cba-state-invalid-border` |
| Invalid text | `--cba-state-invalid-text` |
| Valid border | `--cba-state-valid-border` |
| Valid text | `--cba-state-valid-text` |
| Disabled background | `--cba-state-disabled-bg` |
| Disabled text | `--cba-state-disabled-text` |
| Readonly background | `--cba-bg-tertiary` |
| Hint text | `--cba-text-muted`, `0.8125rem` |
| Error text | `--cba-state-invalid-text`, `0.8125rem` |

The native control inside `<cba-field>` uses the `%cba-native-control` SCSS
placeholder (defined in `src/theme/_mixins.scss`) which resets background,
border, outline, and sets `padding: var(--cba-space-2) var(--cba-space-3)`.

Transitions respect `prefers-reduced-motion: reduce`.

## Adding a new form control

To create a new Cba form control that follows the same conventions:

1. Create a new folder under `src/components/<name>/`.
2. Create the component class extending `CbaFieldControlValueAccessor<YourType>`.
3. Assign a unique `controlId` in the class body:

   ```ts
   protected override controlId = `cba-<name>-control-${cbaNameUid++}`;
   ```

4. Register `NG_VALUE_ACCESSOR` with `forwardRef`.
5. In the template, wrap the native control in `<cba-field>` and forward
   `label()`, `hint()`, `error()`, `isDisabled()`, and `controlId`.
6. Bind `[attr.aria-describedby]="describedBy()"` and
   `[attr.aria-invalid]="error() ? 'true' : null"` on the native control.
7. Call `this.updateValue(...)` on input/change and `this.markAsTouched()` on
   blur.
8. Extend `%cba-native-control` in the component SCSS for the native element.
9. Add host classes for `--disabled` and `--error` states.
10. Export from the barrel `index.ts` and register in `public-api.ts`.

## Related docs

- [CBA_INPUT](./CBA_INPUT.md)
- [CBA_SELECT](./CBA_SELECT.md)
- [CBA_DATEPICKER](./CBA_DATEPICKER.md)
- [THEME](./THEME.md)
- [README](../README.md)
