# CbaDatepicker

Theme-aligned datepicker wrapper around `@ng-bootstrap/ng-bootstrap`. Provides
the shared field layout (label / hint / error), a calendar toggle button, and
bridges the inner ng-bootstrap `ngModel` to an outer
`ControlValueAccessor<NgbDateStruct | null>`.

> **Important:** The calendar popup, keyboard navigation, date parsing, and
> backdrop behaviour all come from **ng-bootstrap** (`NgbInputDatepicker`).
> `CbaDatepicker` does not implement any calendar logic — it is a thin themed
> wrapper.

## Table of Contents

- [Selector](#selector)
- [Import](#import)
- [Basic usage](#basic-usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Content projection](#content-projection)
- [Forms integration](#forms-integration)
- [Value type](#value-type)
- [ng-bootstrap behaviour](#ng-bootstrap-behaviour)
- [Accessibility](#accessibility)
- [Theming](#theming)
- [Related docs](#related-docs)

## Selector

`<cba-datepicker>` — standalone component exported from `@cobranza-apps/ui`.

## Import

```ts
import { CbaDatepickerComponent } from '@cobranza-apps/ui';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
```

## Basic usage

```html
<cba-datepicker label="Due date" hint="YYYY-MM-DD" [(ngModel)]="dueDate" />
```

## Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string \| undefined` | `undefined` | Visible label text above the datepicker. |
| `hint` | `string \| undefined` | `undefined` | Helper text below the datepicker. |
| `error` | `string \| undefined` | `undefined` | Error message below the datepicker. **Visual only** — no validation logic. |
| `valid` | `boolean` | `false` | When `true`, applies the valid visual state (green border). **Visual only** — no validation logic. |
| `disabled` | `boolean` | `false` | Disabled state. Combined with Angular forms' disabled state. |
| `readonly` | `boolean` | `false` | Readonly state. Applies the readonly visual state and sets the native `readonly` attribute. |
| `placeholder` | `string \| undefined` | `undefined` | Native input placeholder text. |

`label`, `hint`, `error`, `valid`, `disabled`, and `readonly` are inherited from
`CbaFieldControlValueAccessor`. See [CBA_FORM_FIELD](./CBA_FORM_FIELD.md) for
the shared conventions.

> **Note:** `error` and `valid` are **visual inputs only**. The component does not
> run any validation engine — consumers drive these from their own `FormGroup` /
> `FormControl` state.

## Outputs

None. Use `ngModelChange` or `formControl.valueChanges` to observe value changes.

## Content projection

None. The native `<input>` and calendar toggle button are rendered internally.

## Forms integration

`CbaDatepickerComponent` provides `NG_VALUE_ACCESSOR` and implements
`ControlValueAccessor<NgbDateStruct | null>`. It works with both template-driven
and reactive forms.

### Template-driven (`ngModel`)

```html
<cba-datepicker label="Start date" [(ngModel)]="startDate" />
```

### Reactive forms (`formControlName`)

```ts
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

readonly form = new FormGroup({
  dueDate: new FormControl<NgbDateStruct | null>(null, Validators.required),
});
```

```html
<form [formGroup]="form">
  <cba-datepicker
    label="Due date"
    formControlName="dueDate"
    [error]="form.get('dueDate')?.invalid && form.get('dueDate')?.touched
      ? 'Due date is required'
      : undefined" />
</form>
```

### Disabled state

The `disabled` input and Angular forms' `setDisabledState` are merged. Either
source disables the control. When disabled, the input is read-only and the
calendar toggle button is also disabled.

## Value type

The control value is `NgbDateStruct | null`:

```ts
interface NgbDateStruct {
  year: number;
  month: number;  // 1-12
  day: number;    // 1-31
}
```

Import `NgbDateStruct` from `@ng-bootstrap/ng-bootstrap`. The value is `null`
when no date is selected.

### Converting to / from `Date`

ng-bootstrap provides `NgbDateAdapter` and `NgbCalendar` for custom date
adapters. The default adapter uses `NgbDateStruct` (plain object). To convert:

```ts
// NgbDateStruct -> Date
const date = new Date(struct.year, struct.month - 1, struct.day);

// Date -> NgbDateStruct
const struct = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
```

## ng-bootstrap behaviour

The following behaviours are **owned by ng-bootstrap**, not by `CbaDatepicker`:

| Behaviour | Source |
| --- | --- |
| Calendar popup rendering | `NgbInputDatepicker` |
| Keyboard navigation (arrow keys in popup) | `NgbInputDatepicker` |
| Date parsing from input text | `NgbInputDatepicker` |
| Focus management inside popup | `NgbInputDatepicker` |
| Backdrop / overlay | `NgbInputDatepicker` |
| `datepickerClass` styling hook | `NgbInputDatepicker` — set to `'cba-datepicker-popup'` |

The calendar toggle button calls `dp.toggle()` on the `NgbInputDatepicker`
template reference (`#dp="ngbDatepicker"`).

To customise ng-bootstrap datepicker behaviour (min/max dates, first day of
week, navigation, etc.), you would need to extend the wrapper or use ng-bootstrap's
configuration APIs directly. The current wrapper does not expose these as inputs.

## Visual state matrix

The datepicker renders one of seven visual states. The state is determined by the
combination of inputs and pseudo-classes:

| State | Trigger | Border | Background | Text |
| --- | --- | --- | --- | --- |
| default | No interaction | `--cba-border-default` | `--cba-bg-secondary` | `--cba-text-primary` |
| hover | `:hover` | `--cba-border-default` | `--cba-bg-secondary` | `--cba-text-primary` |
| focus-visible | `:focus-visible` | `--cba-accent-primary` + `--cba-focus-ring` | `--cba-bg-secondary` | `--cba-text-primary` |
| disabled | `disabled` input or `setDisabledState` | `--cba-border-default` | `--cba-state-disabled-bg` | `--cba-state-disabled-text` |
| readonly | `readonly` input | `--cba-border-default` | `--cba-bg-tertiary` | `--cba-text-primary` |
| invalid | `error` input truthy | `--cba-state-invalid-border` | `--cba-bg-secondary` | `--cba-text-primary` |
| valid | `valid` input `true` (and no `error`) | `--cba-state-valid-border` | `--cba-bg-secondary` | `--cba-text-primary` |

Priority order (highest first): disabled > invalid > valid > readonly > focus-visible > hover > default.

## Accessibility

- `<label for>` is automatically wired to the native input via the shared
  `controlId`.
- `aria-describedby` lists the hint and/or error element ids when present.
- `aria-invalid="true"` is set when `error` is truthy.
- Calendar toggle button has `aria-label="Abrir selector de fecha"` (Spanish-only default, sourced from `CBA_UI_MESSAGES`).
- The calendar icon uses `aria-hidden="true"` (decorative).
- `:focus-visible` uses the `--cba-focus-ring` token on both the input and the
  toggle button.
- `prefers-reduced-motion: reduce` disables the focus transition.
- Disabled state sets `cursor: not-allowed` and reduces opacity on both the
  input and the toggle button.
- Readonly state sets `cursor: default` and uses the inset background; the
  calendar toggle button is also disabled in readonly mode.

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
| Toggle button size | `--cba-space-6` (width and height) |
| Toggle button hover | `--cba-hover` background, `--cba-text-primary` colour |
| Toggle button radius | `--cba-radius-sm` |

The calendar popup uses the `cba-datepicker-popup` CSS class (set via
`datepickerClass`) for ng-bootstrap theme integration.

Host classes: `cba-datepicker`, `cba-datepicker--disabled`, `cba-datepicker--readonly`, `cba-datepicker--error`, `cba-datepicker--invalid`, `cba-datepicker--valid`.
These modifier classes are bound on the host element; the component SCSS targets
them with `:host(.cba-datepicker--disabled) { … }` (not plain descendant
selectors). See `AGENTS.md` §Component authoring: host modifiers.

## Non-goals

- **No calendar logic** — popup rendering, keyboard navigation, and date parsing are owned by ng-bootstrap (`NgbInputDatepicker`).
- **No date-range / min / max inputs** — the wrapper does not expose ng-bootstrap's date configuration; extend the wrapper or use ng-bootstrap APIs directly.
- **No validation logic** — `error` and `valid` are presentational only.

## Related docs

- [CBA_FORM_FIELD](./CBA_FORM_FIELD.md) — shared label / hint / error conventions.
- [CBA_INPUT](./CBA_INPUT.md)
- [CBA_SELECT](./CBA_SELECT.md)
- [CBA_MODAL](./CBA_MODAL.md) — also wraps ng-bootstrap.
- [THEME](./THEME.md)
- [README](../README.md)
- [ng-bootstrap datepicker docs](https://ng-bootstrap.github.io/#/components/datepicker)
