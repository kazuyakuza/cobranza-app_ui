# Phase 5 Form Controls — Front-end Technical Specification

**Scope:** Tasks 2–5 of `20260730-todo-3.md` (shared form-field structure, `CbaInput`, `CbaSelect`, `CbaDatepicker`).

**Important path note:** The project uses `src/components/` as the source root per `.agent/project-structure.md`. Implementation must follow that layout, not the older `src/lib/components/` reference in the TODO file.

---

## 1. Scope & Goals

Deliver three thin, theme-aligned form-control wrappers (`CbaInput`, `CbaSelect`, `CbaDatepicker`) plus a single internal shared form-field layout (`CbaFieldComponent`).

- All controls implement `ControlValueAccessor` so they work with `ngModel` and `formControlName`.
- The datepicker delegates popup/calendar behavior to `@ng-bootstrap/ng-bootstrap` (`NgbInputDatepicker`).
- No validation framework is added; `error` is visual only.
- Desktop-only; no mobile breakpoints.

---

## 2. Target Framework & Conventions

| Area | Choice |
|------|--------|
| Framework | Angular 22 standalone components |
| Change detection | `OnPush` |
| State | Angular signals (`input()`, `output()`, `computed()`, `signal()`) |
| Forms | `ControlValueAccessor` + `NG_VALUE_ACCESSOR` provider |
| Date picker | `NgbInputDatepicker` from `@ng-bootstrap/ng-bootstrap` v21 |
| Styling | SCSS with BEM-ish naming; only `--cba-*` tokens |
| Public API | Barrel `index.ts` per component; re-exported from `src/public-api.ts` alphabetically |
| Docs | One `docs/CBA_*.md` per public component + `docs/CBA_FORM_FIELD.md` |
| Tests | Jest + `jest-preset-angular` + `TestBed`; helpers in `src/components/testing/test-helpers.ts` |

---

## 3. Shared Form-Field Structure

### 3.1 Location

All shared form-field code lives under `src/components/form-field/` and is **not** exported from `src/public-api.ts`.

```text
src/components/form-field/
  cba-field.component.ts
  cba-field.component.html
  cba-field.component.scss
  cba-control-value-accessor.ts
  index.ts
```

### 3.2 `CbaFieldComponent` contract

**Selector:** `cba-field` (internal use only)

**Responsibilities:** render a consistent label / control / hint / error layout and generate stable IDs for accessibility.

**Inputs**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string \| undefined` | `undefined` | Visible label text |
| `hint` | `string \| undefined` | `undefined` | Helper text rendered below the control |
| `error` | `string \| undefined` | `undefined` | Error message rendered below the control |
| `disabled` | `boolean` | `false` | Visual disabled state (passed through from parent) |
| `controlId` | `string` | generated UID | ID used for `label[for]`, `input[id]`, and hint/error IDs |

**Generated IDs**

- `controlId`: `cba-field-control-{uid}`
- `hintId`: `{controlId}-hint`
- `errorId`: `{controlId}-error`

**Template structure**

```html
<div class="cba-field" [class.cba-field--disabled]="disabled()" [class.cba-field--error]="error()">
  @if (label()) {
    <label class="cba-field__label" [for]="controlId()">{{ label() }}</label>
  }

  <div class="cba-field__control">
    <ng-content></ng-content>
  </div>

  @if (hint()) {
    <div class="cba-field__hint" [id]="hintId">{{ hint() }}</div>
  }

  @if (error()) {
    <div class="cba-field__error" [id]="errorId">{{ error() }}</div>
  }
</div>
```

**Host classes**

- `cba-field` (always)
- `cba-field--disabled` when `disabled()`
- `cba-field--error` when `error()`

**Styling tokens**

- Label: `--cba-text-secondary`, `font-weight: 500`, `font-size: 0.875rem`
- Control wrapper: `--cba-bg-secondary`, `border: 1px solid var(--cba-border-default)`, `--cba-radius-sm`
- Control wrapper focus: `:focus-within` → `border-color: var(--cba-accent-primary)`, `box-shadow: var(--cba-focus-ring)`
- Error wrapper: `border-color: var(--cba-accent-danger)`
- Disabled wrapper: `opacity: 0.6`, `background: var(--cba-bg-tertiary)`, `cursor: not-allowed`
- Hint: `--cba-text-muted`, `font-size: 0.8125rem`
- Error text: `--cba-accent-danger`, `font-size: 0.8125rem`
- Spacing: `var(--cba-space-2)` between label and control, `var(--cba-space-2)` between control and hint/error

### 3.3 `CbaControlValueAccessor` base class

Internal abstract base to avoid duplicating CVA boilerplate across the three controls.

```text
src/components/form-field/cba-control-value-accessor.ts
```

**Contract**

```ts
export abstract class CbaControlValueAccessor<T> implements ControlValueAccessor {
  protected readonly value = signal<T | null>(null);
  protected readonly disabledFromCva = signal(false);

  writeValue(value: T | null): void;
  registerOnChange(fn: (value: T | null) => void): void;
  registerOnTouched(fn: () => void): void;
  setDisabledState(isDisabled: boolean): void;

  protected updateValue(value: T | null): void;
  protected markAsTouched(): void;
}
```

**Rules**

- `value` is a signal so templates can bind `[value]="value()"`.
- `disabledFromCva` is updated only by Angular forms via `setDisabledState`.
- Public controls combine their own `disabled` input with `disabledFromCva()` via a computed `isDisabled()`.
- `updateValue` sets the signal and calls the registered change callback.
- `markAsTouched` calls the registered touched callback.

---

## 4. `CbaInput`

### 4.1 Location

```text
src/components/input/
  cba-input.component.ts
  cba-input.component.html
  cba-input.component.scss
  cba-input.component.spec.ts
  index.ts
```

### 4.2 API

**Selector:** `cba-input`

**Inputs**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string \| undefined` | `undefined` | Visible label |
| `placeholder` | `string \| undefined` | `undefined` | Native input placeholder |
| `type` | `CbaInputType` | `'text'` | Native input type; allowed: `'text' \| 'email' \| 'password' \| 'number' \| 'url' \| 'tel'` |
| `disabled` | `boolean` | `false` | Input disabled state |
| `hint` | `string \| undefined` | `undefined` | Helper text |
| `error` | `string \| undefined` | `undefined` | Visual error message |

**Value type** `string | null` (ControlValueAccessor)

### 4.3 Template

```html
<cba-field
  [label]="label()"
  [hint]="hint()"
  [error]="error()"
  [disabled]="isDisabled()"
  [controlId]="controlId()">
  <input
    [id]="controlId()"
    [type]="type()"
    [placeholder]="placeholder() ?? ''"
    [disabled]="isDisabled()"
    [value]="value() ?? ''"
    [attr.aria-describedby]="describedBy()"
    [attr.aria-invalid]="error() ? 'true' : null"
    (input)="onInput($event)"
    (blur)="onBlur()"
    class="cba-input__control" />
</cba-field>
```

### 4.4 Component class

```ts
export class CbaInputComponent extends CbaControlValueAccessor<string> {
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly type = input<CbaInputType>('text');
  readonly disabled = input<boolean>(false);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | undefined>(undefined);

  protected readonly controlId = `cba-input-control-${++cbaInputUid}`;
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledFromCva());
  protected readonly describedBy = computed(() => describedByIds(this.controlId, this.hint(), this.error()));

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.updateValue(target.value);
  }

  protected onBlur(): void {
    this.markAsTouched();
  }
}
```

### 4.5 Styling

- `:host { display: block; }`
- `.cba-input__control`: full width, transparent background, no border, inherit color, `outline: none`
- Host modifiers: `cba-input--disabled`, `cba-input--error`

---

## 5. `CbaSelect`

### 5.1 Location

```text
src/components/select/
  cba-select.component.ts
  cba-select.component.html
  cba-select.component.scss
  cba-select.component.spec.ts
  index.ts
```

### 5.2 API

**Selector:** `cba-select`

**Inputs**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string \| undefined` | `undefined` | Visible label |
| `disabled` | `boolean` | `false` | Select disabled state |
| `hint` | `string \| undefined` | `undefined` | Helper text |
| `error` | `string \| undefined` | `undefined` | Visual error message |

**Content projection:** `<option>` elements (native). No custom dropdown, no multi-select, no virtual scroll.

**Value type** `string | null` (ControlValueAccessor)

### 5.3 Template

```html
<cba-field
  [label]="label()"
  [hint]="hint()"
  [error]="error()"
  [disabled]="isDisabled()"
  [controlId]="controlId()">
  <select
    [id]="controlId()"
    [disabled]="isDisabled()"
    [attr.aria-describedby]="describedBy()"
    [attr.aria-invalid]="error() ? 'true' : null"
    (change)="onChange($event)"
    (blur)="onBlur()"
    class="cba-select__control">
    <ng-content select="option"></ng-content>
  </select>
</cba-field>
```

### 5.4 Component class

```ts
export class CbaSelectComponent extends CbaControlValueAccessor<string> {
  readonly label = input<string | undefined>(undefined);
  readonly disabled = input<boolean>(false);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | undefined>(undefined);

  protected readonly controlId = `cba-select-control-${++cbaSelectUid}`;
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledFromCva());
  protected readonly describedBy = computed(() => describedByIds(this.controlId, this.hint(), this.error()));

  protected onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.updateValue(target.value);
  }

  protected onBlur(): void {
    this.markAsTouched();
  }
}
```

### 5.5 Styling

- Same host/modifier pattern as `CbaInput`.
- `.cba-select__control`: full width, transparent background, no border, inherit color, `outline: none`.
- Optional chevron icon can be added via `appearance: none` + a background SVG icon, but it is optional; default native styling is acceptable if it keeps the bundle minimal.

---

## 6. `CbaDatepicker`

### 6.1 Location

```text
src/components/datepicker/
  cba-datepicker.component.ts
  cba-datepicker.component.html
  cba-datepicker.component.scss
  cba-datepicker.component.spec.ts
  index.ts
```

### 6.2 API

**Selector:** `cba-datepicker`

**Inputs**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string \| undefined` | `undefined` | Visible label |
| `placeholder` | `string \| undefined` | `undefined` | Input placeholder |
| `disabled` | `boolean` | `false` | Disabled state |
| `hint` | `string \| undefined` | `undefined` | Helper text |
| `error` | `string \| undefined` | `undefined` | Visual error message |

**Value type** `NgbDateStruct | null` (ControlValueAccessor)

**Dependencies:** import `NgbInputDatepicker`, `FormsModule`, and `FaIconComponent`.

### 6.3 Template

```html
<cba-field
  [label]="label()"
  [hint]="hint()"
  [error]="error()"
  [disabled]="isDisabled()"
  [controlId]="controlId()">
  <div class="cba-datepicker__input-wrapper">
    <input
      [id]="controlId()"
      [placeholder]="placeholder() ?? ''"
      [disabled]="isDisabled()"
      [ngModel]="value()"
      (ngModelChange)="onDateChange($event)"
      (blur)="onBlur()"
      ngbDatepicker
      #dp="ngbDatepicker"
      [datepickerClass]="'cba-datepicker-popup'"
      [attr.aria-describedby]="describedBy()"
      [attr.aria-invalid]="error() ? 'true' : null"
      class="cba-datepicker__control" />

    <button
      type="button"
      class="cba-datepicker__toggle"
      [attr.aria-label]="'Open date picker'"
      [disabled]="isDisabled()"
      (click)="dp.toggle()">
      <fa-icon [icon]="faCalendar" aria-hidden="true" />
    </button>
  </div>
</cba-field>
```

### 6.4 Component class

```ts
export class CbaDatepickerComponent extends CbaControlValueAccessor<NgbDateStruct | null> {
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly disabled = input<boolean>(false);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | undefined>(undefined);

  protected readonly controlId = `cba-datepicker-control-${++cbaDatepickerUid}`;
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledFromCva());
  protected readonly describedBy = computed(() => describedByIds(this.controlId, this.hint(), this.error()));
  protected readonly faCalendar = faCalendar;

  protected onDateChange(value: NgbDateStruct | null): void {
    this.updateValue(value);
  }

  protected onBlur(): void {
    this.markAsTouched();
  }
}
```

**Notes**

- `ngbDatepicker` directive owns popup open/close, calendar keyboard navigation, focus, and backdrop behavior.
- The wrapper bridges the internal `ngModel` (driven by `ngbDatepicker`) to the outer `ControlValueAccessor`.
- The toggle button only triggers `dp.toggle()`; it does not reimplement calendar logic.

### 6.5 Popup theming

Use the `datepickerClass="cba-datepicker-popup"` hook and override `ngb-datepicker` surface colors with `--cba-*` tokens. The popup is appended outside the component, so the override must be a global rule. Acceptable options:

- Add `.cba-datepicker-popup` overrides in the component SCSS using `::ng-deep` (deprecated but still functional in Angular 22).
- Or add a dedicated `_datepicker.scss` partial under `src/theme/` and import it from `theme.scss` if the team prefers avoiding `::ng-deep`.

The spec recommends keeping the override inside the component file for now so it travels with the wrapper. Use the following tokens where practical:

- Background: `--cba-bg-elevated`
- Border: `--cba-border-default`
- Text: `--cba-text-primary`
- Muted text: `--cba-text-muted`
- Selected day: `--cba-accent-primary`
- Focus: `--cba-focus-ring`

---

## 7. ControlValueAccessor Pattern

Each public control provides `NG_VALUE_ACCESSOR` and extends `CbaControlValueAccessor<T>`.

```ts
@Component({
  selector: 'cba-input',
  standalone: true,
  imports: [CbaFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-input.component.html',
  styleUrl: './cba-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CbaInputComponent),
      multi: true,
    },
  ],
  host: {
    class: 'cba-input',
    '[class.cba-input--disabled]': 'isDisabled()',
    '[class.cba-input--error]': 'error()',
  },
})
export class CbaInputComponent extends CbaControlValueAccessor<string> { ... }
```

**Disabled state resolution**

```ts
protected readonly isDisabled = computed(() => this.disabled() || this.disabledFromCva());
```

This ensures both the public `disabled` input and Angular forms' `setDisabledState` are respected.

---

## 8. Styling Architecture

- Each public component has its own SCSS file.
- Common field layout rules belong to `cba-field.component.scss`.
- Control-specific styling (e.g., datepicker toggle placement) belongs to the component SCSS.
- No component-specific CSS variables; all values come from `src/theme/_variables.scss`.
- Use `prefers-reduced-motion: reduce` to disable transitions.
- Focus ring is visible via `:focus-within` on `.cba-field__control` so it applies to input, select, and datepicker input.

---

## 9. Accessibility

- **Label association:** `<label [for]="controlId()">` matches the native control `[id]="controlId()"`.
- **Describedby:** compute a space-separated list of `hintId` and `errorId` when present, and bind it to `aria-describedby` on the native control.
- **Invalid state:** `aria-invalid="true"` when `error()` is truthy.
- **Disabled state:** native `disabled` attribute on the control; `aria-disabled` is not required when native `disabled` is present.
- **Focus:** visible `--cba-focus-ring` on the field wrapper via `:focus-within`.
- **Datepicker toggle:** `aria-label="Open date picker"` and `aria-hidden` on the icon.

---

## 10. API Integration

- No backend calls.
- No validation engine.
- `CbaDatepicker` uses `NgbDateStruct` as its value type. Consumers that need native `Date` can inject a custom `NgbDateAdapter` from `@ng-bootstrap/ng-bootstrap` in their application code; the wrapper does not provide one.

---

## 11. Testing Strategy

### 11.1 Shared test expectations

For each public control, verify:

1. Renders the label when provided.
2. Renders the hint when provided.
3. Renders the error only when provided.
4. Applies `aria-describedby` correctly when hint/error are present.
5. Applies `aria-invalid="true"` when error is present.
6. Disabled state: native control is disabled, host class is applied, and interaction is prevented.
7. CVA flow: `writeValue` updates the view, user interaction emits the new value via the registered change callback.

### 11.2 CbaInput-specific

- Renders `type`, `placeholder` on the native input.
- Input event updates the value.

### 11.3 CbaSelect-specific

- Projects native `<option>` elements.
- Change event updates the value.

### 11.4 CbaDatepicker-specific

- `ngbDatepicker` directive is present on the input.
- Toggle button calls `toggle()` on the directive instance.
- Do not test calendar internals, date parsing, or keyboard navigation inside the popup.

---

## 12. Files to Create / Modify

### 12.1 New files

| File | Purpose |
|------|---------|
| `src/components/form-field/cba-field.component.ts` | Internal shared field layout |
| `src/components/form-field/cba-field.component.html` | Field template |
| `src/components/form-field/cba-field.component.scss` | Field styles |
| `src/components/form-field/cba-control-value-accessor.ts` | Reusable CVA base |
| `src/components/form-field/index.ts` | Internal barrel (not exported publicly) |
| `src/components/input/cba-input.component.ts` | `CbaInput` component |
| `src/components/input/cba-input.component.html` | Input template |
| `src/components/input/cba-input.component.scss` | Input styles |
| `src/components/input/cba-input.component.spec.ts` | Input tests |
| `src/components/input/index.ts` | Public barrel |
| `src/components/select/cba-select.component.ts` | `CbaSelect` component |
| `src/components/select/cba-select.component.html` | Select template |
| `src/components/select/cba-select.component.scss` | Select styles |
| `src/components/select/cba-select.component.spec.ts` | Select tests |
| `src/components/select/index.ts` | Public barrel |
| `src/components/datepicker/cba-datepicker.component.ts` | `CbaDatepicker` component |
| `src/components/datepicker/cba-datepicker.component.html` | Datepicker template |
| `src/components/datepicker/cba-datepicker.component.scss` | Datepicker + popup styles |
| `src/components/datepicker/cba-datepicker.component.spec.ts` | Datepicker tests |
| `src/components/datepicker/index.ts` | Public barrel |
| `docs/CBA_FORM_FIELD.md` | Internal field conventions |
| `docs/CBA_INPUT.md` | Usage docs |
| `docs/CBA_SELECT.md` | Usage docs |
| `docs/CBA_DATEPICKER.md` | Usage docs |

### 12.2 Modified files

| File | Change |
|------|--------|
| `src/public-api.ts` | Add alphabetical exports: `components/datepicker`, `components/input`, `components/select` |
| `src/theme/theme.scss` | Optionally import a datepicker popup override partial |
| `.agent/project-structure.md` | Add the four new folders under `src/components/` |

### 12.3 `src/public-api.ts` expected final order

```ts
export * from './components/badge';
export * from './components/button';
export * from './components/card';
export * from './components/datepicker';
export * from './components/empty-state';
export * from './components/input';
export * from './components/modal';
export * from './components/module-container';
export * from './components/module-header';
export * from './components/select';
export * from './components/skeleton';
```

---

## 13. Acceptance Criteria

1. `CbaFieldComponent` exists in `src/components/form-field/` and is reused by `CbaInput`, `CbaSelect`, and `CbaDatepicker`.
2. `CbaInput`, `CbaSelect`, and `CbaDatepicker` are standalone components exported from `src/public-api.ts`.
3. All three controls implement `ControlValueAccessor` and work with `ngModel` / `formControlName`.
4. `CbaDatepicker` uses `NgbInputDatepicker` for calendar popup behavior; no custom calendar engine.
5. Visuals use only `--cba-*` tokens and match the intermediate gray theme.
6. Label, hint, and error layout is consistent across all three controls.
7. Accessibility: label association, `aria-describedby`, `aria-invalid`, and visible focus ring.
8. Docs and minimal tests are present for each public component.
9. Library build (`npm run build`), tests (`npm test`), and lint (`npm run lint`) pass.

---

## 14. Out of Scope

- Validation framework or schema-based forms.
- Custom select dropdown, multi-select, tagging, virtual scroll, async search.
- Custom date parser/formatter or `NgbDateAdapter`.
- Mobile / responsive behavior.
- Business logic or BFF integration.
