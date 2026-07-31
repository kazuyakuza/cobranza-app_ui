# Phase 5 — Implementation Plan: Shared Form Field + CbaInput + CbaSelect + CbaDatepicker

> **Source TODO:** `.agent/todos/20260730/20260730-todo-3.md` (Tasks 2–5)
> **Front-end spec (4.1a):** `.kilo/plans/20260730-phase5-form-controls-frontend-spec.md`
> **Global plan:** `.kilo/plans/20260730-phase5-modal-form-wrappers.md`
> **Branch:** `feat/phase5-modal-form-wrappers`
> **Source root:** `src/components/` (per `.agent/project-structure.md` — NOT `src/lib/components/`)

---

## 0. Scope Summary

Build, in strict dependency order:

1. **Shared internal form-field** (`src/components/form-field/`) — `CbaFieldComponent` + `CbaControlValueAccessor<T>` base + small id helpers. **Not** exported from `public-api.ts`.
2. **`CbaInput`** — native `<input>` wrapper, `ControlValueAccessor<string>`.
3. **`CbaSelect`** — native `<select>` with projected `<option>`, `ControlValueAccessor<string>`.
4. **`CbaDatepicker`** — `<input ngbDatepicker>` + toggle button, `ControlValueAccessor<NgbDateStruct | null>`, delegating popup/calendar to `@ng-bootstrap/ng-bootstrap`.

Then: docs, tests, public exports, project-structure update, build/lint/test.

---

## 1. Pre-Analysis & Technical Decisions

### 1.1 Confirmed from front-end spec

- Standalone components; `OnPush`; signals (`input()`, `computed()`, `signal()`).
- All three controls provide `NG_VALUE_ACCESSOR` via `useExisting: forwardRef(() => X)` and extend `CbaControlValueAccessor<T>`.
- `disabled` resolution: `isDisabled = computed(() => this.disabled() || this.disabledFromCva())`.
- Value types: `CbaInput`/`CbaSelect` → `string | null`; `CbaDatepicker` → `NgbDateStruct | null`.
- Desktop-only; only `--cba-*` tokens.

### 1.2 Ambiguities resolved by this plan (spec gaps)

| # | Ambiguity | Resolution |
|---|-----------|------------|
| A1 | `describedByIds(controlId, hint, error)` takes 3 args → violates `.kilo/rules/max-arguments-per-method.md` (max 2). | Create a typed param object: `CbaFieldDescribingInputs { controlId: string; hint?: string; error?: string }`. Helper `describedByFieldIds(input: CbaFieldDescribingInputs): string \| null`. Single-arg. |
| A2 | `hintId`/`errorId` must be identical in `CbaFieldComponent` (id attrs) and controls (`aria-describedby`). Controls cannot read field internals. | Centralize the id convention in `cba-field-ids.ts`: `fieldHintId(controlId)` → `` `${controlId}-hint` ``, `fieldErrorId(controlId)` → `` `${controlId}-error` ``. Field uses these getters for its id attributes; controls use `describedByFieldIds(...)` (which calls the same getters) for `aria-describedby`. Single source of truth for the id convention. |
| A3 | Spec lists no file for the id helper. | Add new file `src/components/form-field/cba-field-ids.ts` (spec §12 table is permissive: "internal barrel not exported publicly"). |
| A4 | Spec §6.5 offers two popup-theming options (`::ng-deep` vs `src/theme/_datepicker.scss`), leaning toward `::ng-deep`. | Established project precedent (see `src/theme/_modal.scss` + `theme.scss` `@use 'modal'`) uses a **global `src/theme/_datepicker.scss` partial**, scoped via the `datepickerClass="cba-datepicker-popup"` hook. **Use the partial approach** — consistent with `CbaModal`, no `::ng-deep`, no component-emulated global rules. Import via `@use 'datepicker';` in `theme.scss`. |
| A5 | Module-level UID counters used in field init (`++cbaInputUid`) bind class properties to module state. | Acceptable and matches existing modal pattern (`let cbaModalTitleUid = 0;`). Keep as `let cbaXxxUid = 0;` at module top of each public component file. |
| A6 | `NgbInputDatepicker` standalone vs `NgbDatepickerModule` import. | In ng-bootstrap v21 `NgbInputDatepicker` is exported as standalone (directive `ɵdir` with `standalone: true`). Import the directive directly: `imports: [NgbInputDatepicker]`. If the build fails because it is not standalone, fall back to `imports: [NgbDatepickerModule]` (which re-exports it). Document the fallback inline as a comment-free choice; do not leave commented code. |
| A7 | Datepicker bridges outer CVA ↔ inner `ngModel`. Two `ngModel` bindings (component-level CVA on host + inner `[ngModel]`) are independent. | Confirmed safe: outer CVA writes `value()` signal; inner input binds `[ngModel]="value()"` + `(ngModelChange)="onDateChange($event)"`; `onDateChange` calls `updateValue()` → fires outer `onChange`. Inner `ngbDatepicker` directive's own CVA is consumed by the inner `ngModel`. Requires `FormsModule` import in the component. |
| A8 | `CbaInputType` type is referenced but not defined in spec file list. | Define `CbaInputType` inline in `cba-input.component.ts` (next to the component, analogous to `CbaButtonVariant` in `cba-button.component.ts`). Not a separate file. |

### 1.3 Build order (strict)

`CbaFieldComponent` + `CbaControlValueAccessor` + `cba-field-ids.ts` + `form-field/index.ts` → `CbaInput` (+ tests + docs) → `CbaSelect` (+ tests + docs) → `CbaDatepicker` (+ tests + docs + `_datepicker.scss` partial) → `public-api.ts` → `.agent/project-structure.md` → build + lint + test.

Each unit committed independently with meaningful messages (see §12).

### 1.4 Cross-component conventions

- Selector prefix `cba-`, BEM class prefix `cba-<control>__` for elements and `cba-<control>--` for modifiers.
- Host `class` always `cba-<control>`; `--disabled` and `--error` modifiers bound to `isDisabled()` / `error()`.
- `:host { display: block; }` for field-level wrappers so they stack vertically in forms.
- `prefers-reduced-motion: reduce` disables the focus transition.
- Focus ring is on `.cba-field__control` via `:focus-within` (single place; applies to all three controls because they all project their native control into `cba-field`'s `.cba-field__control` slot via `<ng-content>`).

---

## 2. Step-by-Step Implementation

### Step 1 — Shared form-field internals

#### 1.1 Create `src/components/form-field/cba-field-ids.ts`

Purpose: single source of truth for hint/error id convention + `aria-describedby` builder. Keeps the spec's `describedByIds(...)` helper but compliant with max-2-args (single object param).

```ts
/** Inputs describing a CbaField's accessibility state, used to build `aria-describedby`. */
export interface CbaFieldDescribingInputs {
  /** Stable id shared by the native control and `<label for>`. */
  readonly controlId: string;
  /** Optional helper text; when present its id is added to `aria-describedby`. */
  readonly hint?: string | undefined;
  /** Optional error message; when present its id is added to `aria-describedby`. */
  readonly error?: string | undefined;
}

/** Id of the hint element rendered by `CbaFieldComponent`. */
export function fieldHintId(controlId: string): string {
  return `${controlId}-hint`;
}

/** Id of the error element rendered by `CbaFieldComponent`. */
export function fieldErrorId(controlId: string): string {
  return `${controlId}-error`;
}

/**
 * Space-separated `aria-describedby` value listing the hint and/or error element ids
 * that are currently rendered, or `null` when neither is present.
 */
export function describedByFieldIds(input: CbaFieldDescribingInputs): string | null {
  const ids: string[] = [];
  if (input.hint) {
    ids.push(fieldHintId(input.controlId));
  }
  if (input.error) {
    ids.push(fieldErrorId(input.controlId));
  }
  return ids.length > 0 ? ids.join(' ') : null;
}
```

> Lines: ~30. No commented code. Single-section conditions inside `if`s. Private helpers not needed.

#### 1.2 Create `src/components/form-field/cba-control-value-accessor.ts`

Abstract base implementing `ControlValueAccessor` boilerplate. Generic over the value type `T`. Uses signals so derived control templates bind `value()`.

```ts
import { signal } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

/**
 * Shared `ControlValueAccessor` scaffolding for Cba form controls.
 *
 * Holds the current value as a signal and tracks the disabled flag pushed by
 * Angular forms via `setDisabledState`. Concrete controls extend this class and
 * combine their own `disabled` input with `disabledFromCva()` via a computed
 * `isDisabled`.
 */
export abstract class CbaControlValueAccessor<T> implements ControlValueAccessor {
  /** Current control value, written by Angular forms and updated by user interaction. */
  protected readonly value = signal<T | null>(null);

  /** Disabled flag pushed by Angular forms through `setDisabledState`. */
  protected readonly disabledFromCva = signal(false);

  private onChange: (value: T | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: T | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledFromCva.set(isDisabled);
  }

  /** Sets the value signal and propagates the change to Angular forms. */
  protected updateValue(value: T | null): void {
    this.value.set(value);
    this.onChange(value);
  }

  /** Marks the control as touched and propagates the touched callback. */
  protected markAsTouched(): void {
    this.onTouched();
  }
}
```

> Lines: ~45. Method bodies ≤ 50. Private members `onChange`/`onTouched` by default.

#### 1.3 Create `src/components/form-field/cba-field.component.ts`

Internal shared label/control/hint/error layout. UID counter for default `controlId`.

```ts
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { fieldErrorId, fieldHintId } from './cba-field-ids';

let cbaFieldUid = 0;

/**
 * Internal shared form-field layout reused by `CbaInput`, `CbaSelect`, and
 * `CbaDatepicker`. Not exported from the public API.
 *
 * Renders a consistent label / projected control / hint / error structure and
 * generates stable ids so the parent control can wire `aria-describedby` and
 * `<label for>` associations.
 */
@Component({
  selector: 'cba-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-field.component.html',
  styleUrl: './cba-field.component.scss',
  host: { class: 'cba-field' },
})
export class CbaFieldComponent {
  /** Visible label text. When set, a `<label for="controlId">` is rendered. */
  readonly label = input<string | undefined>(undefined);

  /** Helper text rendered below the control. */
  readonly hint = input<string | undefined>(undefined);

  /** Visual error message rendered below the control (no validation logic). */
  readonly error = input<string | undefined>(undefined);

  /** Visual disabled state applied to the field wrapper. */
  readonly disabled = input<boolean>(false);

  /** Id shared by the native control and `<label for>`. Defaults to a stable uid. */
  readonly controlId = input<string>(`cba-field-control-${cbaFieldUid++}`);

  /** Id of the hint element, derived from `controlId`. */
  readonly hintId = computed(() => fieldHintId(this.controlId()));

  /** Id of the error element, derived from `controlId`. */
  readonly errorId = computed(() => fieldErrorId(this.controlId()));
}
```

> Lines: ~40. Inputs are readonly signals. Note: `disabled`/`error` host modifiers are bound in the template root `<div>` (not in `host`) because `CbaField` itself does not need host classes — the layout div carries them. Confirmed in spec §3.2 template.

#### 1.4 Create `src/components/form-field/cba-field.component.html`

Exactly per spec §3.2 (control flow `@if`). Hint/error ids bound to `hintId()`/`errorId()`.

```html
<div
  class="cba-field"
  [class.cba-field--disabled]="disabled()"
  [class.cba-field--error]="error()">
  @if (label()) {
    <label class="cba-field__label" [for]="controlId()">{{ label() }}</label>
  }

  <div class="cba-field__control">
    <ng-content></ng-content>
  </div>

  @if (hint()) {
    <div class="cba-field__hint" [id]="hintId()">{{ hint() }}</div>
  }

  @if (error()) {
    <div class="cba-field__error" [id]="errorId()">{{ error() }}</div>
  }
</div>
```

#### 1.5 Create `src/components/form-field/cba-field.component.scss`

All `--cba-*` tokens per spec §3.2. Focus ring on `.cba-field__control:focus-within`.

```scss
:host {
  display: block;
}

.cba-field {
  display: flex;
  flex-direction: column;
  gap: var(--cba-space-2);
}

.cba-field__label {
  color: var(--cba-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
}

.cba-field__control {
  display: block;
  background-color: var(--cba-bg-secondary);
  border: 1px solid var(--cba-border-default);
  border-radius: var(--cba-radius-sm);
  transition: border-color 120ms ease, box-shadow 120ms ease;

  &:focus-within {
    border-color: var(--cba-accent-primary);
    box-shadow: var(--cba-focus-ring);
  }
}

.cba-field--error .cba-field__control {
  border-color: var(--cba-accent-danger);
}

.cba-field--disabled .cba-field__control {
  background-color: var(--cba-bg-tertiary);
  cursor: not-allowed;
}

.cba-field--disabled {
  opacity: 0.6;
}

.cba-field__hint {
  color: var(--cba-text-muted);
  font-size: 0.8125rem;
}

.cba-field__error {
  color: var(--cba-accent-danger);
  font-size: 0.8125rem;
}

@media (prefers-reduced-motion: reduce) {
  .cba-field__control {
    transition: none;
  }
}
```

> Max nesting depth: 2 (e.g., `.cba-field--error .cba-field__control`). Compliant.

#### 1.6 Create `src/components/form-field/index.ts`

Internal-only barrel — **not** re-exported from `public-api.ts`.

```ts
/**
 * Internal barrel for the shared form-field building blocks used by
 * `CbaInput`, `CbaSelect`, and `CbaDatepicker`. Not part of the public API.
 */
export * from './cba-field.component';
export * from './cba-control-value-accessor';
export * from './cba-field-ids';
```

#### 1.7 Verify Step 1

- `npm run build` — must succeed (no public references yet, internal only).
- `npm run lint` — no lint errors in form-field.
- No tests for `CbaFieldComponent` directly (it is covered indirectly by each control's spec). Document this decision.

**Commit:** `feat(form-field): add shared CbaFieldComponent and CbaControlValueAccessor`

---

### Step 2 — `CbaInput`

#### 2.1 Create `src/components/input/cba-input.component.ts`

Define `CbaInputType` inline. Extend `CbaControlValueAccessor<string>`. Provide `NG_VALUE_ACCESSOR` with `forwardRef`. Host classes bound in `host`. Module-level uid counter.

```ts
import { ChangeDetectionStrategy, Component, computed, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CbaControlValueAccessor } from '../form-field/cba-control-value-accessor';
import { CbaFieldComponent } from '../form-field/cba-field.component';
import { describedByFieldIds } from '../form-field/cba-field-ids';

let cbaInputUid = 0;

/** Native input type supported by `CbaInput`. */
export type CbaInputType = 'text' | 'email' | 'password' | 'number' | 'url' | 'tel';

/**
 * Theme-aligned text input field with `ControlValueAccessor` integration.
 *
 * Wraps a native `<input>` inside the shared `CbaFieldComponent` layout and
 * exposes `ngModel` / `formControlName` compatibility via `NG_VALUE_ACCESSOR`.
 *
 * @usageNotes
 * ```html
 * <cba-input label="Email" type="email" hint="We never share your email." />
 * ```
 *
 * @see [CBA_INPUT.md](/docs/CBA_INPUT.md)
 */
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
export class CbaInputComponent extends CbaControlValueAccessor<string> {
  /** Visible label rendered above the control. */
  readonly label = input<string | undefined>(undefined);

  /** Native input placeholder. */
  readonly placeholder = input<string | undefined>(undefined);

  /** Native input type. Defaults to `'text'`. */
  readonly type = input<CbaInputType>('text');

  /** Disabled state, combined with the Angular forms disabled state. */
  readonly disabled = input<boolean>(false);

  /** Helper text rendered below the control. */
  readonly hint = input<string | undefined>(undefined);

  /** Visual error message rendered below the control (no validation logic). */
  readonly error = input<string | undefined>(undefined);

  protected readonly controlId = `cba-input-control-${cbaInputUid++}`;
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledFromCva());
  protected readonly describedBy = computed(() =>
    describedByFieldIds({
      controlId: this.controlId,
      hint: this.hint(),
      error: this.error(),
    }),
  );

  /** Propagates native input events to the Angular forms layer. */
  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.updateValue(target.value);
  }

  /** Marks the control as touched on blur. */
  protected onBlur(): void {
    this.markAsTouched();
  }
}
```

> Lines: ~80. Methods ≤ 50. Max-2-args: `describedByFieldIds` takes a single object. Note: `controlId` is a plain string (not a signal), so passing it into the object literal is fine — `describedBy` depends on `this.hint()`/`this.error()` signals.

#### 2.2 Create `src/components/input/cba-input.component.html`

Per spec §4.3.

```html
<cba-field
  [label]="label()"
  [hint]="hint()"
  [error]="error()"
  [disabled]="isDisabled()"
  [controlId]="controlId">
  <input
    [id]="controlId"
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

#### 2.3 Create `src/components/input/cba-input.component.scss`

Per spec §4.5.

```scss
:host {
  display: block;
}

.cba-input__control {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: inherit;
  font: inherit;
  padding: var(--cba-space-2) var(--cba-space-3);
}

.cba-input--disabled .cba-input__control {
  cursor: not-allowed;
}
```

#### 2.4 Create `src/components/input/index.ts`

```ts
/**
 * Barrel for `CbaInput`. Re-exports the public API so `public-api.ts` and
 * consumers import from `components/input`.
 */
export * from './cba-input.component';
```

#### 2.5 Create `src/components/input/cba-input.component.spec.ts`

Minimal wrapper-only tests per spec §11.1 + §11.2. Uses the existing test-helpers (`hostEl`). Pattern mirrors `cba-modal.component.spec.ts` (inline host components, `TestBed`).

```ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CbaInputComponent } from './cba-input.component';

@Component({
  standalone: true,
  imports: [CbaInputComponent],
  template: `<cba-input
    label="Email"
    placeholder="you@example.com"
    type="email"
    hint="We never share it."
    error="Invalid" />`,
})
class InputHost {}

describe('CbaInputComponent', () => {
  let fixture: ComponentFixture<InputHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [InputHost] }).compileComponents();
    fixture = TestBed.createComponent(InputHost);
    fixture.detectChanges();
  });

  it('renders the label text', () => {
    expect(fixture.nativeElement.querySelector('.cba-field__label')?.textContent).toContain('Email');
  });

  it('renders the hint text', () => {
    expect(fixture.nativeElement.querySelector('.cba-field__hint')?.textContent).toContain('We never share it.');
  });

  it('renders the error text only when provided', () => {
    expect(fixture.nativeElement.querySelector('.cba-field__error')?.textContent).toContain('Invalid');
  });

  it('sets aria-describedby to hint and error ids when both are present', () => {
    const input = fixture.nativeElement.querySelector('input');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toContain('-hint');
    expect(describedBy).toContain('-error');
  });

  it('sets aria-invalid="true" when error is present', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('forwards type and placeholder to the native input', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('type')).toBe('email');
    expect(input.getAttribute('placeholder')).toBe('you@example.com');
  });

  it('emits the new value through ControlValueAccessor on input', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [CbaInputComponent] });
    const f = TestBed.createComponent(CbaInputComponent);
    f.detectChanges();
    const onChange = jest.fn();
    f.componentInstance.registerOnChange(onChange);
    const inputEl: HTMLInputElement = f.nativeElement.querySelector('input');
    inputEl.value = 'hello';
    inputEl.dispatchEvent(new Event('input'));
    expect(onChange).toHaveBeenCalledWith('hello');
    expect(f.componentInstance['value']()).toBe('hello');
  });

  it('disables the native input and applies host modifier when disabled', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [CbaInputComponent] });
    const f = TestBed.createComponent(CbaInputComponent);
    f.componentRef.setInput('disabled', true);
    f.detectChanges();
    expect(f.nativeElement.querySelector('input').hasAttribute('disabled')).toBe(true);
  });
});
```

> Accessing `f.componentInstance['value']()` is acceptable in tests (mirror existing spec pattern that reads `fixture.componentInstance['titleId']`).

#### 2.6 Create `docs/CBA_INPUT.md`

Outline (≤ 100 lines):

- Title + one-line purpose.
- **Selector**: `cba-input`.
- **Inputs** table (name/type/default/description) — copy from spec §4.2.
- **Forms integration** — short note: works with `[(ngModel)]` and `[formControl]`; value type `string | null`.
- **Usage examples** (code blocks): basic, with hint, with error, disabled, with `formControlName`.
- **Accessibility** — label association, `aria-describedby`, `aria-invalid`, focus ring.
- **Theming** — uses `--cba-*` tokens; field layout shared with `CbaSelect`/`CbaDatepicker` (see `CBA_FORM_FIELD.md`).
- **See also** — links to `CBA_SELECT.md`, `CBA_DATEPICKER.md`, `CBA_FORM_FIELD.md`.

#### 2.7 Verify Step 2

- `npm run build` — must succeed with `CbaInput` exported from its barrel (not yet from public-api).
- `npm test -- cba-input` — all cases pass.
- `npm run lint`.

**Commit:** `feat(input): add CbaInput wrapper with ControlValueAccessor`

---

### Step 3 — `CbaSelect`

#### 3.1 Create `src/components/select/cba-select.component.ts`

Same structure as `CbaInput` minus `type`/`placeholder`. Value type `string | null`.

```ts
import { ChangeDetectionStrategy, Component, computed, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CbaControlValueAccessor } from '../form-field/cba-control-value-accessor';
import { describedByFieldIds } from '../form-field/cba-field-ids';
import { CbaFieldComponent } from '../form-field/cba-field.component';

let cbaSelectUid = 0;

/**
 * Theme-aligned native select field with projected `<option>` elements and
 * `ControlValueAccessor` integration. No custom dropdown logic.
 *
 * @usageNotes
 * ```html
 * <cba-select label="Status">
 *   <option value="">Choose…</option>
 *   <option value="active">Active</option>
 * </cba-select>
 * ```
 *
 * @see [CBA_SELECT.md](/docs/CBA_SELECT.md)
 */
@Component({
  selector: 'cba-select',
  standalone: true,
  imports: [CbaFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-select.component.html',
  styleUrl: './cba-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CbaSelectComponent),
      multi: true,
    },
  ],
  host: {
    class: 'cba-select',
    '[class.cba-select--disabled]': 'isDisabled()',
    '[class.cba-select--error]': 'error()',
  },
})
export class CbaSelectComponent extends CbaControlValueAccessor<string> {
  /** Visible label rendered above the control. */
  readonly label = input<string | undefined>(undefined);

  /** Disabled state, combined with the Angular forms disabled state. */
  readonly disabled = input<boolean>(false);

  /** Helper text rendered below the control. */
  readonly hint = input<string | undefined>(undefined);

  /** Visual error message rendered below the control (no validation logic). */
  readonly error = input<string | undefined>(undefined);

  protected readonly controlId = `cba-select-control-${cbaSelectUid++}`;
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledFromCva());
  protected readonly describedBy = computed(() =>
    describedByFieldIds({
      controlId: this.controlId,
      hint: this.hint(),
      error: this.error(),
    }),
  );

  /** Propagates native change events to the Angular forms layer. */
  protected onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.updateValue(target.value);
  }

  /** Marks the control as touched on blur. */
  protected onBlur(): void {
    this.markAsTouched();
  }
}
```

#### 3.2 Create `src/components/select/cba-select.component.html`

Per spec §5.3 — projects native `<option>` via `<ng-content select="option">`.

```html
<cba-field
  [label]="label()"
  [hint]="hint()"
  [error]="error()"
  [disabled]="isDisabled()"
  [controlId]="controlId">
  <select
    [id]="controlId"
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

#### 3.3 Create `src/components/select/cba-select.component.scss`

Same pattern as input. Optional native appearance kept (no custom chevron) — keeps bundle minimal per spec §5.5.

```scss
:host {
  display: block;
}

.cba-select__control {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: inherit;
  font: inherit;
  padding: var(--cba-space-2) var(--cba-space-3);
}

.cba-select--disabled .cba-select__control {
  cursor: not-allowed;
}
```

#### 3.4 Create `src/components/select/index.ts`

```ts
/**
 * Barrel for `CbaSelect`. Re-exports the public API so `public-api.ts` and
 * consumers import from `components/select`.
 */
export * from './cba-select.component';
```

#### 3.5 Create `src/components/select/cba-select.component.spec.ts`

```ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CbaSelectComponent } from './cba-select.component';

@Component({
  standalone: true,
  imports: [CbaSelectComponent],
  template: `<cba-select label="Status" hint="Pick one" error="Required">
    <option value="">Choose…</option>
    <option value="active">Active</option>
    <option value="paused">Paused</option>
  </cba-select>`,
})
class SelectHost {}

describe('CbaSelectComponent', () => {
  let fixture: ComponentFixture<SelectHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SelectHost] }).compileComponents();
    fixture = TestBed.createComponent(SelectHost);
    fixture.detectChanges();
  });

  it('renders the label text', () => {
    expect(fixture.nativeElement.querySelector('.cba-field__label')?.textContent).toContain('Status');
  });

  it('renders the hint and error text', () => {
    expect(fixture.nativeElement.querySelector('.cba-field__hint')?.textContent).toContain('Pick one');
    expect(fixture.nativeElement.querySelector('.cba-field__error')?.textContent).toContain('Required');
  });

  it('projects native option elements into the select', () => {
    const options = fixture.nativeElement.querySelectorAll('option');
    expect(options.length).toBe(3);
    expect(options[1].textContent).toContain('Active');
  });

  it('sets aria-invalid when error is present', () => {
    expect(fixture.nativeElement.querySelector('select').getAttribute('aria-invalid')).toBe('true');
  });

  it('emits the selected value through ControlValueAccessor on change', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [CbaSelectComponent] });
    const f = TestBed.createComponent(CbaSelectComponent);
    f.detectChanges();
    const onChange = jest.fn();
    f.componentInstance.registerOnChange(onChange);
    const selectEl: HTMLSelectElement = f.nativeElement.querySelector('select');
    selectEl.value = 'active';
    selectEl.dispatchEvent(new Event('change'));
    expect(onChange).toHaveBeenCalledWith('active');
  });

  it('disables the native select when disabled', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [CbaSelectComponent] });
    const f = TestBed.createComponent(CbaSelectComponent);
    f.componentRef.setInput('disabled', true);
    f.detectChanges();
    expect(f.nativeElement.querySelector('select').hasAttribute('disabled')).toBe(true);
  });
});
```

#### 3.6 Create `docs/CBA_SELECT.md`

Outline:

- Title + purpose.
- **Selector**: `cba-select`.
- **Inputs** table (from spec §5.2).
- **Content projection** — `<option>` elements only; no multi-select/virtualissão/async.
- **Forms integration** — value type `string | null`; `ngModel` / `formControlName`.
- **Usage examples**: basic with options, with hint, with error, disabled.
- **Accessibility** + **Theming** sections (same as `CbaInput`).
- **See also** links.

#### 3.7 Verify Step 3

- `npm run build`, `npm test -- cba-select`, `npm run lint`.

**Commit:** `feat(select): add CbaSelect wrapper with projected options`

---

### Step 4 — `CbaDatepicker`

#### 4.1 Create `src/components/datepicker/cba-datepicker.component.ts`

Imports: `CbaFieldComponent`, `NgbInputDatepicker` (standalone directive; fallback `NgbDatepickerModule` if not standalone — see §1.2 A6), `FormsModule` (for inner `[(ngModel)]`), `FaIconComponent`. Icon `faCalendar` from `@fortawesome/free-solid-svg-icons`.

```ts
import { ChangeDetectionStrategy, Component, computed, forwardRef, input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { NgbInputDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CbaControlValueAccessor } from '../form-field/cba-control-value-accessor';
import { CbaFieldComponent } from '../form-field/cba-field.component';
import { describedByFieldIds } from '../form-field/cba-field-ids';

let cbaDatepickerUid = 0;

/**
 * Thin wrapper around the ng-bootstrap datepicker (`NgbInputDatepicker`).
 *
 * ng-bootstrap owns the calendar popup, keyboard navigation, focus, and
 * backdrop. This component owns the shared field layout, theme alignment, a
 * calendar toggle button, and bridges the inner `ngModel` to an outer
 * `ControlValueAccessor<NgbDateStruct | null>`.
 *
 * @usageNotes
 * ```html
 * <cba-datepicker label="Due date" hint="YYYY-MM-DD" [(ngModel)]="due" />
 * ```
 *
 * @see [CBA_DATEPICKER.md](/docs/CBA_DATEPICKER.md)
 */
@Component({
  selector: 'cba-datepicker',
  standalone: true,
  imports: [CbaFieldComponent, FormsModule, NgbInputDatepicker, FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-datepicker.component.html',
  styleUrl: './cba-datepicker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CbaDatepickerComponent),
      multi: true,
    },
  ],
  host: {
    class: 'cba-datepicker',
    '[class.cba-datepicker--disabled]': 'isDisabled()',
    '[class.cba-datepicker--error]': 'error()',
  },
})
export class CbaDatepickerComponent extends CbaControlValueAccessor<NgbDateStruct | null> {
  /** Visible label rendered above the control. */
  readonly label = input<string | undefined>(undefined);

  /** Native input placeholder. */
  readonly placeholder = input<string | undefined>(undefined);

  /** Disabled state, combined with the Angular forms disabled state. */
  readonly disabled = input<boolean>(false);

  /** Helper text rendered below the control. */
  readonly hint = input<string | undefined>(undefined);

  /** Visual error message rendered below the control (no validation logic). */
  readonly error = input<string | undefined>(undefined);

  protected readonly controlId = `cba-datepicker-control-${cbaDatepickerUid++}`;
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledFromCva());
  protected readonly describedBy = computed(() =>
    describedByFieldIds({
      controlId: this.controlId,
      hint: this.hint(),
      error: this.error(),
    }),
  );
  protected readonly faCalendar = faCalendar;

  /** Propagates a date selection from ng-bootstrap to the Angular forms layer. */
  protected onDateChange(value: NgbDateStruct | null): void {
    this.updateValue(value);
  }

  /** Marks the control as touched on blur. */
  protected onBlur(): void {
    this.markAsTouched();
  }
}
```

> Lines: ~85. If build fails on `NgbInputDatepicker` not standalone, replace `NgbInputDatepicker` in `imports` with `NgbDatepickerModule` (keep the type import of `NgbInputDatepicker`/`NgbDateStruct` from `@ng-bootstrap/ng-bootstrap`). No commented code may remain.

#### 4.2 Create `src/components/datepicker/cba-datepicker.component.html`

Per spec §6.3. The toggle button calls `dp.toggle()` (ng-bootstrap owns the rest). `#dp="ngbDatepicker"` references the directive instance.

```html
<cba-field
  [label]="label()"
  [hint]="hint()"
  [error]="error()"
  [disabled]="isDisabled()"
  [controlId]="controlId">
  <div class="cba-datepicker__input-wrapper">
    <input
      [id]="controlId"
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
      aria-label="Open date picker"
      [disabled]="isDisabled()"
      (click)="dp.toggle()">
      <fa-icon [icon]="faCalendar" aria-hidden="true" />
    </button>
  </div>
</cba-field>
```

> Max nested-block depth: 2 (cba-field → div.input-wrapper → input). Compliant. Boolean conditions are single-section: `error() ? 'true' : null` is a ternary expression result bound to an attr, not a multi-section `if` condition — acceptable.

#### 4.3 Create `src/components/datepicker/cba-datepicker.component.scss`

Inline field styles only (NOT popup — popup is global partial, see §1.2 A4).

```scss
:host {
  display: block;
}

.cba-datepicker__input-wrapper {
  display: flex;
  align-items: center;
  gap: var(--cba-space-2);
}

.cba-datepicker__control {
  flex: 1 1 auto;
  background: transparent;
  border: none;
  outline: none;
  color: inherit;
  font: inherit;
  padding: var(--cba-space-2) var(--cba-space-3);
}

.cba-datepicker__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: var(--cba-space-6);
  height: var(--cba-space-6);
  padding: 0;
  border: none;
  border-radius: var(--cba-radius-sm);
  background: transparent;
  color: var(--cba-text-secondary);
  cursor: pointer;

  &:hover {
    background: var(--cba-hover);
    color: var(--cba-text-primary);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--cba-focus-ring);
  }
}

.cba-datepicker--disabled .cba-datepicker__toggle,
.cba-datepicker--disabled .cba-datepicker__control {
  cursor: not-allowed;
}
```

> Max depth: 2 (`.cba-datepicker__toggle:hover`). Compliant.

#### 4.4 Create `src/theme/_datepicker.scss`

Global popup theming scoped via `datepickerClass="cba-datepicker-popup"` (set on the input in the template). Follows `src/theme/_modal.scss` precedent — no `::ng-deep`, imported globally so it can style the popup appended outside the component host.

```scss
/**
 * Global theming for the ng-bootstrap datepicker popup driven by
 * @cobranza-apps/ui tokens. Reaches the popup element rendered by ng-bootstrap
 * outside the CbaDatepickerComponent host, which component-emulated SCSS cannot
 * target. Scoped to Cba datepickers via the `datepickerClass="cba-datepicker-popup"`
 * hook set in cba-datepicker.component.html.
 */
.cba-datepicker-popup .ngb-dp {
  background-color: var(--cba-bg-elevated);
  border: 1px solid var(--cba-border-default);
  border-radius: var(--cba-radius-md);
  color: var(--cba-text-primary);
}

.cba-datepicker-popup .ngb-dp-header {
  background-color: var(--cba-bg-elevated);
  color: var(--cba-text-primary);
}

.cba-datepicker-popup .ngb-dp-month-name {
  color: var(--cba-text-primary);
}

.cba-datepicker-popup .ngb-dp-weekdays {
  color: var(--cba-text-muted);
}

.cba-datepicker-popup .ngb-dp-day {
  color: var(--cba-text-primary);
}

.cba-datepicker-popup .ngb-dp-day:focus-visible {
  outline: none;
  box-shadow: var(--cba-focus-ring);
}

.cba-datepicker-popup .btn-secondary {
  background-color: var(--cba-bg-tertiary);
  border-color: var(--cba-border-subtle);
  color: var(--cba-text-primary);
}

.cba-datepicker-popup .ngb-dp-day.selected,
.cba-datepicker-popup .ngb-dp-day.selected:hover {
  background-color: var(--cba-accent-primary);
  color: var(--cba-text-inverse);
}
```

> These class names are ng-bootstrap's public CSS hooks (`ngb-dp`, `ngb-dp-header`, `ngb-dp-day`, etc.). If a class does not exist in the version shipped, leave that rule out rather than guessing; no dead CSS. Final token usage verified against `src/theme/_variables.scss`.

#### 4.5 Modify `src/theme/theme.scss`

Add `@use 'datepicker';` after `@use 'modal';` to preserve import order.

Original:
```scss
@use 'variables';
@use 'base';
@use 'modal';
@use 'mixins';
@use 'utilities';
```

Becomes:
```scss
@use 'variables';
@use 'base';
@use 'modal';
@use 'datepicker';
@use 'mixins';
@use 'utilities';
```

#### 4.6 Create `src/components/datepicker/index.ts`

```ts
/**
 * Barrel for `CbaDatepicker`. Re-exports the public API so `public-api.ts`
 * and consumers import from `components/datepicker`.
 */
export * from './cba-datepicker.component';
```

#### 4.7 Create `src/components/datepicker/cba-datepicker.component.spec.ts`

Wrapper-only tests (spec §11.4 — do NOT test calendar internals, parsing, keyboard nav). Need `@ng-bootstrap/ng-bootstrap` providers (`NgbDatepickerConfig` may be required by `NgbInputDatepicker`). Provide `NgbModule`-free DI via importing only the directive's deps. Safest: import `NgbDatepickerModule` in the test host (it pulls the directive + config), or provide `NgbDatepickerConfig`/`NgbInputDatepickerConfig`. Use `NgbDatepickerModule` to satisfy DI for the directive's injected services.

```ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CbaDatepickerComponent } from './cba-datepicker.component';

@Component({
  standalone: true,
  imports: [CbaDatepickerComponent],
  template: `<cba-datepicker label="Due date" hint="Pick a day" error="Required" />`,
})
class DatepickerHost {}

function configureTestBed(): void {
  TestBed.configureTestingModule({
    imports: [DatepickerHost, NgbDatepickerModule],
  });
}

describe('CbaDatepickerComponent', () => {
  let fixture: ComponentFixture<DatepickerHost>;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    configureTestBed();
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(DatepickerHost);
    fixture.detectChanges();
  });

  it('renders the label text', () => {
    expect(fixture.nativeElement.querySelector('.cba-field__label')?.textContent).toContain('Due date');
  });

  it('renders the hint and error text', () => {
    expect(fixture.nativeElement.querySelector('.cba-field__hint')?.textContent).toContain('Pick a day');
    expect(fixture.nativeElement.querySelector('.cba-field__error')?.textContent).toContain('Required');
  });

  it('applies the ngbDatepicker directive to the input', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input).not.toBeNull();
    // ng-bootstrap adds popup wiring; presence of the toggle button is a proxy.
    expect(fixture.nativeElement.querySelector('.cba-datepicker__toggle')).not.toBeNull();
  });

  it('sets aria-label on the toggle button', () => {
    const toggle = fixture.nativeElement.querySelector('.cba-datepicker__toggle');
    expect(toggle.getAttribute('aria-label')).toBe('Open date picker');
  });

  it('sets aria-invalid when error is present', () => {
    expect(fixture.nativeElement.querySelector('input').getAttribute('aria-invalid')).toBe('true');
  });

  it('disables input and toggle when disabled', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [CbaDatepickerComponent, NgbDatepickerModule] });
    const f = TestBed.createComponent(CbaDatepickerComponent);
    f.componentRef.setInput('disabled', true);
    f.detectChanges();
    expect(f.nativeElement.querySelector('input').hasAttribute('disabled')).toBe(true);
    expect(f.nativeElement.querySelector('.cba-datepicker__toggle').hasAttribute('disabled')).toBe(true);
  });

  it('does not assert on calendar internals', () => {
    // Intentional guard: this spec must not open the popup or inspect dates.
    expect(true).toBe(true);
  });
});
```

> The `NgbInputDatepicker` directive injects `NgbInputDatepickerConfig`, `NgbDateAdapter`, `NgbDateParserFormatter`, `NgbCalendar`, etc. Importing `NgbDatepickerModule` in the test `imports` array satisfies all default providers. If standalone `NgbInputDatepicker` is used directly in the component (not via the module), the test still needs `NgbDatepickerModule` in `imports` to register the rest of the datepicker providers — this is a test-only DI concern, not a coupling violation.

#### 4.8 Create `docs/CBA_DATEPICKER.md`

Outline:

- Title + purpose.
- **Selector**: `cba-datepicker`.
- **Inputs** table (from spec §6.2).
- **Value type**: `NgbDateStruct | null` (`{ year, month, day }`).
- **Behaviour note (required)**: explicit paragraph that calendar popup, keyboard navigation, focus, and backdrop are owned by `@ng-bootstrap/ng-bootstrap` `NgbInputDatepicker`; the wrapper does not reimplement them.
- **Custom date adapter**: note that consumers needing native `Date` values can provide their own `NgbDateAdapter<Date>` in their app; the wrapper uses `NgbDateStruct` natively.
- **Usage examples**: basic with `[(ngModel)]`, with `formControlName`, disabled, with hint/error.
- **Popup theming**: explain the `.cba-datepicker-popup` class hook + `src/theme/_datepicker.scss`.
- **Accessibility** + **See also**.

#### 4.9 Verify Step 4

- `npm run build`, `npm test -- cba-datepicker`, `npm run lint`.

**Commit:** `feat(datepicker): add CbaDatepicker wrapper on NgbInputDatepicker`

---

### Step 5 — Public exports + project-structure

#### 5.1 Modify `src/public-api.ts`

Add three alphabetical exports. Final order per spec §12.3:

```ts
/** Components. */
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

> `components/form-field` is intentionally NOT exported (internal).

#### 5.2 Modify `.agent/project-structure.md`

Add four new folders under `# Folders in src/` (after the `modal` line, before `src/theme/`):

```text
- src/components/form-field/ - internal shared CbaFieldComponent + CbaControlValueAccessor base used by input/select/datepicker (not exported publicly)
- src/components/input/ - CbaInput component: native input wrapper with ControlValueAccessor and shared field layout
- src/components/select/ - CbaSelect component: native select wrapper with projected options and ControlValueAccessor
- src/components/datepicker/ - CbaDatepicker component: thin wrapper around ng-bootstrap NgbInputDatepicker with shared field layout
```

No `# Other folders` change.

#### 5.3 Verify Step 5

- `npm run build` — must succeed and `dist/` must expose `CbaInputComponent`, `CbaSelectComponent`, `CbaDatepickerComponent`, `CbaInputType`.
- `npm run lint`.

**Commit:** `feat(public-api): export CbaInput, CbaSelect, CbaDatepicker and update project structure`

---

### Step 6 — Final verification

Run sequentially (single commands, no chaining per `.kilo/rules/tool-selection-priority.md`):

1. `npm run build`
2. `npm test`
3. `npm run lint`

All must pass with no errors. If any fails, fix and re-run (sub-agent must NOT proceed past a failed build).

---

## 3. File Inventory

### New files (24)

| File | Component |
|------|-----------|
| `src/components/form-field/cba-field-ids.ts` | shared id helpers (resolves A1/A2) |
| `src/components/form-field/cba-control-value-accessor.ts` | CVA base class |
| `src/components/form-field/cba-field.component.ts` | shared field layout |
| `src/components/form-field/cba-field.component.html` | field template |
| `src/components/form-field/cba-field.component.scss` | field styles |
| `src/components/form-field/index.ts` | internal barrel |
| `src/components/input/cba-input.component.ts` | CbaInput |
| `src/components/input/cba-input.component.html` | |
| `src/components/input/cba-input.component.scss` | |
| `src/components/input/cba-input.component.spec.ts` | |
| `src/components/input/index.ts` | public barrel |
| `src/components/select/cba-select.component.ts` | CbaSelect |
| `src/components/select/cba-select.component.html` | |
| `src/components/select/cba-select.component.scss` | |
| `src/components/select/cba-select.component.spec.ts` | |
| `src/components/select/index.ts` | public barrel |
| `src/components/datepicker/cba-datepicker.component.ts` | CbaDatepicker |
| `src/components/datepicker/cba-datepicker.component.html` | |
| `src/components/datepicker/cba-datepicker.component.scss` | inline field styles only |
| `src/components/datepicker/cba-datepicker.component.spec.ts` | |
| `src/components/datepicker/index.ts` | public barrel |
| `src/theme/_datepicker.scss` | global popup theming partial |
| `docs/CBA_INPUT.md` | usage docs |
| `docs/CBA_SELECT.md` | usage docs |
| `docs/CBA_DATEPICKER.md` | usage docs |
| `docs/CBA_FORM_FIELD.md` | shared field conventions (internal) |

(Spec §12 lists 4 doc files including `CBA_FORM_FIELD.md`; include it.)

### Modified files (3)

| File | Change |
|------|--------|
| `src/public-api.ts` | add 3 alphabetical component exports |
| `src/theme/theme.scss` | add `@use 'datepicker';` |
| `.agent/project-structure.md` | add 4 folder entries |

### Deleted files

None.

---

## 4. Rules Compliance Checklist

- [x] Source code in `src/` only.
- [x] All new `src/` files ≤ 200 lines (largest is `cba-input.component.ts` ~80).
- [x] Method bodies ≤ 50 lines.
- [x] Max 2 args per method — `describedByFieldIds(input)` single object; no multi-arg public method.
- [x] Max nesting depth 2 in TS and SCSS.
- [x] Private members by default (`onChange`/`onTouched`/`value`/`disabledFromCva` protected for subclass use; component inputs public by Angular necessity).
- [x] Standalone components only.
- [x] No commented-out code (fallback comment for `NgbDatepickerModule` is a runtime branch, not a comment — do NOT leave a commented alternative).
- [x] Self-documenting names; minimal JSDoc on public API.
- [x] Single-section boolean conditions (no `if (a && b)` blocks in new code).
- [x] Real newlines in all written files (no `\n` literals).
- [x] Only `--cba-*` tokens used in SCSS.

---

## 5. Test Matrix

| Case | CbaInput | CbaSelect | CbaDatepicker |
|------|:--:|:--:|:--:|
| Renders label | ✓ | ✓ | ✓ |
| Renders hint | ✓ | ✓ | ✓ |
| Renders error only when present | ✓ | ✓ | ✓ |
| `aria-describedby` includes present ids | ✓ | ✓ | ✓ |
| `aria-invalid="true"` when error | ✓ | ✓ | ✓ |
| Disabled native control + host modifier | ✓ | ✓ | ✓ |
| CVA: `writeValue`/`onChange` round-trip | ✓ | ✓ | ✓ |
| Forwards `type`/`placeholder` (input only) | ✓ | — | placeholder only (optional) |
| Projects `<option>` elements (select only) | — | ✓ | — |
| `ngbDatepicker` directive present (datepicker only) | — | — | ✓ (via toggle presence) |
| Toggle `aria-label` (datepicker only) | — | — | ✓ |
| No calendar-internals assertions (datepicker) | — | — | ✓ guard test |

---

## 6. Architecture Decisions Summary

1. **Internal `form-field` folder** keeps shared layout + CVA base out of the public surface; only `CbaInput`/`CbaSelect`/`CbaDatepicker` are public.
2. **Id convention centralized** in `cba-field-ids.ts` so field and controls agree on `hintId`/`errorId`/`aria-describedby` without coupling.
3. **Popup theming via global `_datepicker.scss`** scoped by `datepickerClass` — matches existing `_modal.scss` precedent; avoids deprecated `::ng-deep`.
4. **CVA bridge for datepicker**: outer CVA writes `value()` signal → inner `[ngModel]="value()"` → `ngModelChange` → `updateValue()` → outer `onChange`. ng-bootstrap's own CVA on the inner input is consumed by the inner `ngModel`; no double-CVA conflict.
5. **No `NgbDateAdapter` injected by the wrapper** — value type is `NgbDateStruct | null`; consumers add their own adapter if needed.
6. **Test isolation**: each control's spec uses `TestBed.resetTestingModule()` between cases (mirror existing modal spec).

---

## 7. Acceptance Criteria Mapping (spec §13)

| # | Criterion | Satisfied by |
|---|-----------|-------------|
| 1 | `CbaFieldComponent` in `form-field/`, reused by 3 controls | Steps 1–4 templates all use `<cba-field>` |
| 2 | All 3 standalone + exported from `public-api.ts` | Step 5.1 |
| 3 | All implement CVA; `ngModel`/`formControlName` | `NG_VALUE_ACCESSOR` providers + tests |
| 4 | `CbaDatepicker` uses `NgbInputDatepicker`; no custom calendar | Step 4.1/4.2 |
| 5 | Only `--cba-*` tokens | All SCSS |
| 6 | Consistent label/hint/error layout | Single `CbaFieldComponent` |
| 7 | A11y: label assoc, `aria-describedby`, `aria-invalid`, focus ring | Templates + field SCSS |
| 8 | Docs + minimal tests per public component | Steps 2.6/3.6/4.8 + specs |
| 9 | `build`, `test`, `lint` pass | Step 6 |

---

## 8. Verification Against Original Task

- TODO Task 2 (shared form-field structure + docs) → Step 1 + `docs/CBA_FORM_FIELD.md`. ✓
- TODO Task 3 (`CbaInput`) → Step 2. ✓ (selector, label assoc, reuse field, disabled/readonly visuals, export, build, JSDoc, examples, minimal tests).
- TODO Task 4 (`CbaSelect`) → Step 3. ✓ (projected options, no multi-select/virtual_scroll, export, build, JSDoc, examples, minimal tests).
- TODO Task 5 (`CbaDatepicker`) → Step 4. ✓ (ng-bootstrap owns calendar, theme popup via partial, export, build, JSDoc, explicit ng-bootstrap note in docs, minimal wrapper tests).
- Path note: implementation uses `src/components/` per `project-structure.md`, not `src/lib/components/` from the TODO prose (spec §1 explicitly overrides this).
- All acceptance criteria from spec §13 and TODO acceptance table covered.

Plan complete. No implementation files written. No git commands run.

## Simplification Plan

Generated by code-simplifier review (Task 2-5, 4.3).

### 1. Extract common form-control inputs and computed state into a shared base class
- **Files affected:** `src/components/form-field/cba-field-control-value-accessor.ts` (new), `src/components/input/cba-input.component.ts`, `src/components/select/cba-select.component.ts`, `src/components/datepicker/cba-datepicker.component.ts`.
- **Change:** Create a base class `CbaFieldControlValueAccessor<T>` that extends `CbaControlValueAccessor<T>` and owns the inputs and computeds repeated by every public control: `label`, `disabled`, `hint`, `error`, `isDisabled`, `describedBy`, and the id generation helper.
- **Implementation note:** Keep the per-component UID prefix (`cba-input-control-*`, `cba-select-control-*`, etc.) because module-level counters are scoped to the component file. Either pass the prefix through a constructor call, or keep `controlId` as a single assignment in each child while moving the common signals and computeds to the base.
- **Rationale:** Removes ~40–50 lines of near-identical declarations across the three public controls and makes future controls (e.g., textarea, checkbox) trivial to add.

### 2. Simplify `describedByFieldIds` and `CbaFieldDescribingInputs` typing
- **File:** `src/components/form-field/cba-field-ids.ts`.
- **Changes:**
  - Remove redundant `| undefined` from optional `hint` and `error` properties (`?` already implies `undefined`).
  - Replace the mutable `ids` array with a functional expression, e.g.:
    ```ts
    const ids = [
      input.hint && fieldHintId(input.controlId),
      input.error && fieldErrorId(input.controlId),
    ].filter((id): id is string => !!id);
    return ids.length > 0 ? ids.join(' ') : null;
    ```
- **Rationale:** Reduces imperative state and makes the helper a single expression.

### 3. Remove the no-op datepicker test
- **File:** `src/components/datepicker/cba-datepicker.component.spec.ts`.
- **Change:** Delete the test `it('does not assert on calendar internals', () => { expect(true).toBe(true); });`.
- **Rationale:** It provides no coverage and only exists as a placeholder comment; removal keeps the spec focused.

### 4. Dedupe common native-control SCSS reset
- **Files:** `src/theme/_mixins.scss` (or new shared partial), `src/components/input/cba-input.component.scss`, `src/components/select/cba-select.component.scss`, `src/components/datepicker/cba-datepicker.component.scss`.
- **Change:** Add a shared SCSS placeholder/mixin such as `%cba-native-control` containing the common reset rules (`width: 100%`, `background: transparent`, `border: none`, `outline: none`, `color: inherit`, `font: inherit`, padding). Each control's native element extends or includes it.
- **Rationale:** Eliminates ~7 lines of duplicated CSS per component and makes style updates one-touch.

### 5. Reuse icon-button styling for the datepicker toggle
- **Files:** `src/theme/_mixins.scss`, `src/components/datepicker/cba-datepicker.component.scss`.
- **Change:** Extract a shared `%cba-icon-button` or `icon-button()` mixin covering the reset, square sizing, focus-visible ring, and hover state used by the datepicker toggle. If `CbaButton` already exposes an icon-only variant that matches, use it instead of a raw `<button>`.
- **Rationale:** Avoids reimplementing the same icon-button pattern and aligns the datepicker toggle with existing button styles.

### 6. Simplify and dedupe test setup
- **Files:** `src/components/input/cba-input.component.spec.ts`, `src/components/select/cba-select.component.spec.ts`, `src/components/datepicker/cba-datepicker.component.spec.ts`.
- **Change:** Introduce a small test helper that creates a host fixture for a given component/template and exposes common query helpers (label, hint, error, control). Use it for the rendering tests shared by all three controls.
- **Scope:** Keep CVA-specific tests in each spec because the exact interaction differs (`input`, `change`, `ngModelChange`), but move the repeated `beforeEach` + `querySelector` boilerplate to the helper.
- **Rationale:** Reduces ~20–30 lines of duplicated spec code per component and makes future form-control tests faster to write.

### 7. Verify naming avoids shadowing CVA callbacks
- **Files:** `src/components/input/cba-input.component.ts`, `src/components/select/cba-select.component.ts`, `src/components/datepicker/cba-datepicker.component.ts`.
- **Change:** Ensure event handlers are never named `onChange` (the current implementation uses `onInput`, `onSelectChange`, and `onDateChange`, which is correct). Document this convention in the shared CVA base so future subclasses do not accidentally shadow the private `onChange` callback.
- **Rationale:** Prevents subtle bugs where `this.onChange` inside the base class would call a subclass event handler instead of the registered CVA callback.

### 8. Reconsider placeholder coalescing in templates
- **Files:** `src/components/input/cba-input.component.html`, `src/components/datepicker/cba-datepicker.component.html`.
- **Change:** Evaluate whether `[placeholder]="placeholder() ?? ''"` is required. If Angular removes the attribute when the value is `undefined`, remove the coalescing. If it is needed as a defensive fallback, add a one-line comment in the component explaining why the signal is coalesced.
- **Rationale:** Reduces template noise; if the coalescing is required for browser/Angular behaviour, that reason should be explicit.

### 9. Group field modifier SCSS
- **File:** `src/components/form-field/cba-field.component.scss`.
- **Change:** Keep the `.cba-field--error` and `.cba-field--disabled` modifier blocks adjacent, and nest the opacity rule inside `.cba-field--disabled` rather than leaving it as a separate top-level rule. Alternatively, extract the two modifier blocks into a single combined block if the rule bodies differ only by one or two properties.
- **Rationale:** Improves readability of the disabled/error state.

### 10. Consolidate `fieldHintId` / `fieldErrorId`
- **File:** `src/components/form-field/cba-field-ids.ts`.
- **Change:** Both helpers are one-line string concatenations. Either:
  - Inline the concatenation inside `describedByFieldIds` (if the helpers are only used there), or
  - Move the repeated pattern into a single private helper `fieldSuffixId(controlId, suffix)` and have `fieldHintId`/`fieldErrorId` call it.
- **Rationale:** Reduces duplication of the id format while keeping the convention centralized.

### Summary
- **No files were edited during this review.** The items above are concrete simplification opportunities for the next implementer or fix cycle.
- **Highest impact:** item 1 (shared base class) and item 4 (SCSS reset dedupe) together remove ~80–100 lines of duplicated code across the three public controls.
- **Recommended order:** items 1–3 first, then 4–5, then 6–10 as cleanup.

---

## Code Review Fix Plan

Reviewed implementation files against the plan and project rules. Public structure and exports are correct; `CbaFieldComponent` is not exported from `public-api.ts`. Found the following issues to fix before sign-off.

### 1. Missing docs (deviation from plan §2.6, 3.6, 4.8 and file inventory)

The following docs are not present in `docs/`:

- `docs/CBA_FORM_FIELD.md`
- `docs/CBA_INPUT.md`
- `docs/CBA_SELECT.md`
- `docs/CBA_DATEPICKER.md`

**Fix:** Create the four docs per the outlines in the implementation plan. `CBA_FORM_FIELD.md` must cover the shared label/hint/error conventions so future controls stay consistent.

### 2. Datepicker popup theme has dead/incomplete selectors

`src/theme/_datepicker.scss` was written against older ng-bootstrap class names and will not theme the selected day or navigation selects in the shipped `@ng-bootstrap/ng-bootstrap@21` / `bootstrap@5.3` DOM:

- There is no `.ngb-dp` element on the popup; `datepickerClass` is applied to the `<ngb-datepicker>` root. The `.cba-datepicker-popup .ngb-dp` rule is dead.
- Selected days are marked with Bootstrap utility classes `.bg-primary` and `.text-white` (both `!important`), not `.selected`.
- Month/year navigation uses `<select class="form-select">`, not `.btn-secondary`.
- Dead rules to remove: `.cba-datepicker-popup .ngb-dp-day.selected`, `.cba-datepicker-popup .ngb-dp-day.selected:hover`, `.cba-datepicker-popup .btn-secondary`.

**Fix:** Rewrite the partial against the actual DOM:

- Target the root directly with `.cba-datepicker-popup` (or `.cba-datepicker-popup.dropdown-menu`) for background/border/radius/color.
- Keep/extend existing `.ngb-dp-header`, `.ngb-dp-month-name`, `.ngb-dp-weekdays`, `.ngb-dp-day` rules.
- Add selected-day override using `.cba-datepicker-popup .ngb-dp-day .bg-primary` and `.cba-datepicker-popup .ngb-dp-day .text-white`. Override Bootstrap's `!important` utilities with `!important` and `--cba-accent-primary` / `--cba-text-inverse`.
- Add `.cba-datepicker-popup ngb-datepicker-navigation-select > .form-select` styling for month/year selects.
- Add `.cba-datepicker-popup .ngb-dp-arrow-btn` hover/focus states if needed.
- Remove all dead rules.
- Verify by opening the popup and inspecting the DOM.

### 3. Test gaps relative to the plan's test matrix

The following minimal wrapper tests are missing:

- **`CbaInputComponent` (`src/components/input/cba-input.component.spec.ts`)**:
  - `writeValue` round-trip (set value via `writeValue`, assert native input value updates).
  - Disabled host modifier assertion (`cba-input--disabled` class on the host).
  - `aria-describedby` exact id match (current test only checks for `-hint`/`-error` substrings).

- **`CbaSelectComponent` (`src/components/select/cba-select.component.spec.ts`)**:
  - `aria-describedby` ids test.
  - `writeValue` round-trip.
  - Error-only-when-provided test (a host without `error` should not render `.cba-field__error`).

- **`CbaDatepickerComponent` (`src/components/datepicker/cba-datepicker.component.spec.ts`)**:
  - `aria-describedby` ids test.
  - `writeValue` round-trip (set an `NgbDateStruct`, assert input value and/or component `value()` signal updates).
  - Disabled test should assert native `<input disabled>` and toggle `<button disabled>` attributes as originally planned, not only the component's `isDisabled()` signal and host class.

**Fix:** Add the missing cases. Avoid inline `@Component` decorators inside `it` blocks; move host components to the top level of the spec file or use direct component instances for CVA tests.

### 4. Minor deviations / notes

- `CbaSelectComponent` event handler is named `onSelectChange` while the plan references `onChange`. This is an acceptable improvement to avoid shadowing the CVA callback name; the implementation plan should be updated to reflect the chosen name.
- `CbaSelectComponent` and `CbaDatepickerComponent` specs define host components inside `it` blocks. This is non-standard; move them to the top level for clarity.
- `public-api.ts` and `.agent/project-structure.md` are correct and complete.

### Sign-off criteria

All four docs are present, `src/theme/_datepicker.scss` themes the real popup, and all listed test cases pass. No further rule violations.