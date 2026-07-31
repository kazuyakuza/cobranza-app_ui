# CbaTypeahead — Implementation Plan (Task 3, Phase 6)

> **Scope:** Implement `CbaTypeahead` only. No other Phase 6 task.
> **Input spec:** `.kilo/plans/20260731-task3-typeahead-frontend-spec.md`
> **Base repo:** `@cobranza-apps/ui` — Angular 22 standalone, ng-bootstrap v21, Bootstrap 5 SCSS peer dep, gray theme tokens (`--cba-*`).

## 0. High-level approach

`CbaTypeaheadComponent` is a thin form-control wrapper around ng-bootstrap's `NgbTypeahead` directive, placed directly on the internal `<input>` (no `hostDirectives`, no manual DI wiring — unlike `CbaDropdown`/`CbaPopover`). It:

1. Extends `CbaFieldControlValueAccessor<string>` → reuses label/hint/error/disabled/aria wiring and `NG_VALUE_ACCESSOR` scaffolding.
2. Projects a single native `<input>` into `CbaFieldComponent` and applies `ngbTypeahead` via template syntax (`[ngbTypeahead]="search()"`).
3. Bridges the inner input `<ngModel>` and the outer `ControlValueAccessor` via the existing `value` signal — same pattern as `CbaDatepicker`.
4. Themes the **popup** globally via a new `src/theme/_typeahead.scss` partial scoped by `popupClass="cba-typeahead-window"` (popup is appended to `<body>` because `container="body"`, so component-emulated SCSS cannot reach it).
5. Themes the **input surface** identically to `CbaInput` (`@extend %cba-native-control`).

Mirror files for reference: `src/components/input/*` (CVA/field pattern), `src/components/datepicker/*` (inner `ngModel` bridge), `src/theme/_popover.scss` + `src/theme/_datepicker.scss` (global popup theming), `src/components/dropdown/cba-dropdown.component.scss` (elevated menu surface language).

## 1. Files to create / modify

### Create
| # | Path | Purpose |
|---|------|---------|
| 1 | `src/components/typeahead/cba-typeahead.component.ts` | Standalone component (TS) |
| 2 | `src/components/typeahead/cba-typeahead.component.html` | Template |
| 3 | `src/components/typeahead/cba-typeahead.component.scss` | Component-emulated input surface theming |
| 4 | `src/components/typeahead/cba-typeahead.component.spec.ts` | Minimal wrapper tests |
| 5 | `src/components/typeahead/cba-typeahead.types.ts` | Type aliases for inputs/outputs |
| 6 | `src/components/typeahead/index.ts` | Barrel re-export |
| 7 | `src/theme/_typeahead.scss` | **Global** popup theming (popup appended to `<body>`) |

### Modify
| # | Path | Change |
|----|------|--------|
| 8 | `src/public-api.ts` | Add `export * from './components/typeahead';` alphabetically after the `skeleton` line (line 30). |
| 9 | `.agent/project-structure.md` | Add `- src/components/typeahead/ - CbaTypeahead component: thin ng-bootstrap NgbTypeahead wrapper with shared field layout and ControlValueAccessor` after the `src/components/select/` line (line 22). |
| 10 | `src/theme/theme.scss` | Add `@use 'typeahead';` after `@use 'popover';` (line 7), before `@use 'mixins';`. |

No new dependencies, no Angular CLI schematics, no changes to `package.json`/`ng-package.json`/`tsconfig`.

## 2. Code snippets

### 2.1 `src/components/typeahead/cba-typeahead.types.ts`

```ts
import { OperatorFunction } from 'rxjs';
import { NgbTypeaheadSelectItemEvent, PlacementArray } from '@ng-bootstrap/ng-bootstrap';

/**
 * Search function passed to `NgbTypeahead`. Maps a stream of typed terms to a
 * stream of result arrays. The engine (debounce/filter/popup) is ng-bootstrap.
 */
export type CbaTypeaheadSearchFn = OperatorFunction<string, readonly any[]>;

/**
 * Formats a popup result item (or a selected item back into the input).
 * Mirrors `NgbTypeahead`'s `resultFormatter` / `inputFormatter` signatures.
 */
export type CbaTypeaheadFormatter = (item: any) => string;

/**
 * Preferred popup placement(s). Mirrors `PlacementArray` from ng-bootstrap.
 */
export type CbaTypeaheadPlacement = PlacementArray;

/**
 * Selection event re-emitted by `itemSelected`. Mirrors
 * `NgbTypeaheadSelectItemEvent` from ng-bootstrap.
 */
export type CbaTypeaheadItemSelectedEvent = NgbTypeaheadSelectItemEvent;
```

### 2.2 `src/components/typeahead/cba-typeahead.component.ts`

Key points:
- `imports: [CbaFieldComponent, FormsModule, NgbTypeahead]`.
- `providers` `NG_VALUE_ACCESSOR` `forwardRef`.
- `host` classes mirror `CbaInput`.
- Inputs come from the base class (`label`, `disabled`, `hint`, `error`) plus typeahead-specific inputs.
- `protected override controlId = \`cba-typeahead-control-${cbaTypeaheadUid++}\`` (UID pattern identical to input/datepicker).
- Methods `onValueChange` / `onBlur` / `onItemSelected` are tiny and delegate to `updateValue` / `markAsTouched` / `itemSelected.emit` — keep each ≤ 50 lines (they are 1–3 lines).

```ts
import { ChangeDetectionStrategy, Component, forwardRef, input, output } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { CbaFieldControlValueAccessor } from '../form-field/cba-field-control-value-accessor';
import { CbaFieldComponent } from '../form-field/cba-field.component';
import {
  CbaTypeaheadFormatter,
  CbaTypeaheadPlacement,
  CbaTypeaheadSearchFn,
} from './cba-typeahead.types';

let cbaTypeaheadUid = 0;

/**
 * Thin, token-styled wrapper around `@ng-bootstrap/ng-bootstrap` `NgbTypeahead`.
 *
 * **Responsibility split:**
 * - ng-bootstrap owns the popup list, filtering via the `search` function,
 *   keyboard navigation, selection, highlight rendering, and Popper positioning.
 * - This component owns the shared field layout (label / hint / error), theme
 *   alignment of the input surface (like `CbaInput`) and of the elevated popup
 *   (via the global `src/theme/_typeahead.scss` scoped by `popupClass`), and
 *   bridges the inner `ngModel` to an outer `ControlValueAccessor<string>`.
 *
 * The control value is the **string currently in the input**. To react to a
 * selected object, listen to the `itemSelected` output.
 *
 * `NgbTypeahead` is applied directly to the internal `<input>` via the
 * `[ngbTypeahead]` template binding — no `hostDirectives` and no manual DI
 * forwarding is needed (unlike `CbaDropdown` / `CbaPopover`).
 *
 * @remarks
 * The autocomplete engine is exclusively `@ng-bootstrap/ng-bootstrap`; no
 * additional autocomplete dependency is introduced.
 *
 * @usageNotes
 * ```html
 * <cba-typeahead
 *   label="State"
 *   placeholder="Start typing..."
 *   [search]="searchStates"
 *   [(ngModel)]="selectedState"
 *   (itemSelected)="onState($event)" />
 * ```
 *
 * @see [CBA_TYPEAHEAD.md](/docs/CBA_TYPEAHEAD.md)
 */
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

  /** Required search function forwarded to `NgbTypeahead`. Owns debounce/filter. */
  readonly search = input.required<CbaTypeaheadSearchFn>();

  /** Native input placeholder. */
  readonly placeholder = input<string | undefined>(undefined);

  /** Formats each popup result. Mirrors `NgbTypeahead#resultFormatter`. */
  readonly resultFormatter = input<CbaTypeaheadFormatter | undefined>(undefined);

  /** Formats a selected item back into the input. Mirrors `NgbTypeahead#inputFormatter`. */
  readonly inputFormatter = input<CbaTypeaheadFormatter | undefined>(undefined);

  /** When `true`, allows free-text values not selected from the popup. */
  readonly editable = input<boolean>(true);

  /** Auto-focuses the first popup result while typing. */
  readonly focusFirst = input<boolean>(true);

  /** Shows the matching result as a hint inside the input. */
  readonly showHint = input<boolean>(false);

  /** Auto-selects when only one exact match exists. */
  readonly selectOnExact = input<boolean>(false);

  /** Preferred popup placement(s). */
  readonly placement = input<CbaTypeaheadPlacement>([
    'bottom-start',
    'bottom-end',
    'top-start',
    'top-end',
  ]);

  /** CSS class added to the popup window for theming. Defaults to `"cba-typeahead-window"`. */
  readonly popupClass = input<string>('cba-typeahead-window');

  /** Emitted when the user selects a popup item. Mirrors `NgbTypeahead#selectItem`. */
  readonly itemSelected = output<NgbTypeaheadSelectItemEvent>();

  /** Propagates inner input changes to the Angular forms layer. */
  protected onValueChange(value: string | null): void {
    this.updateValue(value);
  }

  /** Marks the control as touched on blur. */
  protected onBlur(): void {
    this.markAsTouched();
  }

  /** Re-emits `NgbTypeahead#selectItem` through the wrapper output. */
  protected onItemSelected(event: NgbTypeaheadSelectItemEvent): void {
    this.itemSelected.emit(event);
  }
}
```

> Method bodies each < 50 lines (3 lines max). File ≈ 130 lines incl. JSDoc — under 200-line source limit (this IS a `src/` file; verify post-write with `wc -l`). Counts exclude blank/comment/import lines per rule. If over, split nothing — JSDoc-heavy is acceptable but trim inline JSDoc on formatter inputs if needed.

### 2.3 `src/components/typeahead/cba-typeahead.component.html`

Identical structure to `CbaInput` + `NgbTypeahead` bindings. `container="body"` static so the popup is global-themed; `popupClass` forwarded to global SCSS.

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

> No `ViewChild`, no template ref — pure template directive usage, per spec §3.2. `aria-*` attributes set by us; `NgbTypeahead` adds combobox/aria-autocomplete/aria-expanded itself — do not override.

### 2.4 `src/components/typeahead/cba-typeahead.component.scss`

Mirror `CbaInput` exactly for the input surface; no popup rules here (global partial handles it).

```scss
@use '../../theme/mixins' as *;

:host {
  display: block;
}

.cba-typeahead__control {
  @extend %cba-native-control;
}

.cba-typeahead--disabled .cba-typeahead__control {
  cursor: not-allowed;
}
```

### 2.5 `src/theme/_typeahead.scss`

Global (not component-emulated) because `container="body"` appends the popup outside the host. Scoped via `.cba-typeahead-window` `popupClass`. Matches `CbaDropdown` elevated menu language (spec §7.2).

```scss
/**
 * Global theming for ng-bootstrap typeahead popups driven by
 * @cobranza-apps/ui tokens. Reaches the popup window rendered by ng-bootstrap
 * OUTSIDE any CbaTypeaheadComponent host (container="body"), which
 * component-emulated SCSS cannot target. Scoped to Cba typeaheads via the
 * `popupClass="cba-typeahead-window"` hook set in cba-typeahead.component.html.
 *
 * Requires Bootstrap 5 CSS (peer dependency) for `.dropdown-menu` /
 * `.dropdown-item` base structure and `.ngb-highlight` highlighting.
 */
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
}

.cba-typeahead-window .dropdown-item:hover {
  background-color: var(--cba-hover);
}

.cba-typeahead-window .dropdown-item:active,
.cba-typeahead-window .dropdown-item.active {
  background-color: var(--cba-active);
}

.cba-typeahead-window .dropdown-item:focus-visible {
  outline: none;
  box-shadow: inset var(--cba-focus-ring);
}

.cba-typeahead-window .dropdown-item[disabled] {
  color: var(--cba-text-muted);
  cursor: not-allowed;
  opacity: 0.65;
}

.cba-typeahead-window .ngb-highlight {
  color: var(--cba-accent-primary);
  font-weight: 700;
}

@media (prefers-reduced-motion: reduce) {
  .cobra-typeahead-window .dropdown-item,
  .cba-typeahead-window .dropdown-item {
    transition: none;
  }
}
```

> Note: write only `.cba-typeahead-window` selector in the `prefers-reduced-motion` block (remove the typo'd `.cobra-...` line above when authoring — it is shown only as a reminder that only one class is needed). Final file must contain only `.cba-typeahead-window`.

### 2.6 `src/components/typeahead/index.ts`

```ts
/**
 * Barrel for `CbaTypeahead`. Re-exports the public API so `public-api.ts` and
 * consumers import from `components/typeahead`.
 */
export * from './cba-typeahead.component';
export * from './cba-typeahead.types';
```

### 2.7 Modify `src/theme/theme.scss`

After line 7 (`@use 'popover';`) insert:

```scss
@use 'typeahead';
```

Resulting order: `variables`, `base`, `modal`, `datepicker`, `popover`, `typeahead`, `mixins`, `utilities`.

### 2.8 Modify `src/public-api.ts`

After the `skeleton` line (line 30) add:

```ts
export * from './components/typeahead';
```

Alphabetical: `s…` then `t…` — correct; `typeahead` is the last components export.

### 2.9 Modify `.agent/project-structure.md`

After the `src/components/select/` line (line 22) insert:

```text
- src/components/typeahead/ - CbaTypeahead component: thin ng-bootstrap NgbTypeahead wrapper reusing shared field layout and ControlValueAccessor
```

## 3. Styling plan

### Input surface
- Reuse `%cba-native-control` (transparent, borderless, inherits font/color) from `src/theme/_mixins.scss` — same as `CbaInput`.
- Visible border/background/focus ring provided by `CbaFieldComponent` (`.cba-field__control`). No changes to `CbaFieldComponent`.
- Disabled: host modifier `.cba-typeahead--disabled` sets `cursor: not-allowed` on `.cba-typeahead__control`; native `disabled` attribute set via `[disabled]="isDisabled()"`.

### Suggestions popup (global)
- Elevated background `--cba-bg-elevated`, subtle border `--cba-border-subtle`, radius `--cba-radius-md`, elevated shadow `--cba-shadow-elevated`.
- Item hover `--cba-hover`, active `--cba-active`, focus ring `--cba-focus-ring`, disabled text `--cba-text-muted`.
- Highlighted match `.ngb-highlight` uses `--cba-accent-primary` + bold.
- `min-width` 12rem matches `CbaDropdown` menu. Reduced-motion disables transitions.

### Tokens used (all confirmed present in `src/theme/_variables.scss`)
`--cba-bg-elevated`, `--cba-border-subtle`, `--cba-radius-md`, `--cba-shadow-elevated`, `--cba-text-primary`, `--cba-text-muted`, `--cba-space-1`, `--cba-space-2`, `--cba-space-4`, `--cba-hover`, `--cba-active`, `--cba-focus-ring`, `--cba-accent-primary`.

## 4. Test plan

`src/components/typeahead/cba-typeahead.component.spec.ts` using `ComponentFixture` + host component (mirror `CbaInput` spec style). Import `NgbModule` (or `NgbTypeahead`) so the directive's DI resolves.

**Configure:** `TestBed.configureTestingModule({ imports: [CbaTypeaheadComponent, NgbModule] })` (or rely on `NgbTypeahead` being imported by the component — but the popup needs `NgbModule` services; include `NgbModule` to be safe, mirroring datepicker spec which imports `NgbDatepickerModule`).

**Test cases (exact):**
1. Renders the label text via `.cba-field__label` — set `label="State"`, `search` to a stub `() => of([])`.
2. Renders the hint text via `.cba-field__hint`.
3. Renders the error text via `.cba-field__error` only when `error` is provided; absent when not.
4. `aria-describedby` on the native input lists the rendered hint and error element ids.
5. `aria-invalid="true"` on the native input when `error` is provided; `null` otherwise.
6. Forwards `placeholder` to the native input.
7. Applies host class `.cba-typeahead--disabled` and sets the input `disabled` attribute when `disabled` input is true.
8. After `writeValue('written')` + `detectChanges()`, the native input `value` equals `'written'` (proves inner `[ngModel]="value()"` bridge).
9. On inner input change (set value + dispatch `input`), the outer `onChange` is called with the typed string and the `value` signal updates (mirror `CbaInput` spec test 8). Use `registerOnChange`.
10. `itemSelected` output re-emits: dispatch a synthetic `selectItem` event on the native input OR assert the output binding is wired — simplest is to verify that after `writeValue` the control exposes the value via CVA, plus a focused test that calls `fixture.componentInstance['onItemSelected']({ item: 'x' })` directly and asserts the `itemSelected` emit (accessing protected via cast), mirroring how datepicker spec accesses `['value']()`. Preferred: subscribe to `itemSelected` and call the protected handler with a stubbed `NgbTypeaheadSelectItemEvent`-shaped object — assert emit received it.
11. Sets the `popupClass` attribute hint by asserting the input element exists with `ngbTypeahead` (querySelector `input` is non-null); popup rendering itself is NOT tested (it appends to body and needs Popper — out of scope).

**Do NOT test:**
- ng-bootstrap filter/debounce/popup positioning/highlight rendering.
- Keyboard navigation (Arrow/Enter/Escape) — owned by ng-bootstrap.
- `resultFormatter`/`inputFormatter` formatting output — owned by ng-bootstrap.
- `selectOnExact`, `showHint`, `focusFirst` behavioural effects — owned by ng-bootstrap.

Use `jest.fn()` (already used by `CbaInput` spec). Do not introduce a new test framework.

## 5. Integration steps (ordered, atomic)

1. **Create** `src/components/typeahead/cba-typeahead.types.ts` (Section 2.1).
2. **Create** `src/components/typeahead/cba-typeahead.component.ts` (Section 2.2).
3. **Create** `src/components/typeahead/cba-typeahead.component.html` (Section 2.3).
4. **Create** `src/components/typeahead/cba-typeahead.component.scss` (Section 2.4).
5. **Create** `src/components/typeahead/index.ts` (Section 2.6).
6. **Create** `src/theme/_typeahead.scss` (Section 2.5).
7. **Modify** `src/theme/theme.scss` — add `@use 'typeahead';` (Section 2.7).
8. **Modify** `src/public-api.ts` — add the typeahead export (Section 2.8).
9. **Modify** `.agent/project-structure.md` — add the folder line (Section 2.9).
10. **Create** `src/components/typeahead/cba-typeahead.component.spec.ts` (Section 4).
11. **Commit** all typeahead files with message: `feat(typeahead): add CbaTypeahead thin ng-bootstrap wrapper`.
   - Follow `.kilo/rules/gitignore-compliance.md`: verify `node_modules/`, `dist/` not staged.
12. **Build** verify: `npm run build`. Fix any type/template errors (e.g. `NgbTypeahead` import name, `popupClass` input name in this ng-bootstrap version). Do NOT proceed past build failure; loop fix → rebuild.
13. **Test** verify (if test runner configured): `npm run test` or `npx jest cba-typeahead`. If no test script, skip silently — note in completion summary.
14. **Code review** (separate Critical Workflow step 4.3) is NOT part of this plan step; do not execute it.

## 6. Verification / build commands

- `npm run build` — must succeed (ng-packagr build of `src/public-api.ts`).
- `npm run lint` — run if a lint script exists (`package.json`); fix reported issues; do not introduce `eslint-disable`.
- `npm run test` or `npx jest src/components/typeahead` — run if Jest is configured; otherwise note skipped.
- `wc -l src/components/typeahead/cba-typeahead.component.ts` — confirm ≤ 200 lines (count excludes blank/comment/imports per rule; raw count is informational).
- `git status` — confirm only intended files staged before commit.

## 7. Acceptance criteria checklist

- [ ] `CbaTypeaheadComponent` is a standalone component under `src/components/typeahead/`.
- [ ] Selector `cba-typeahead`; extends `CbaFieldControlValueAccessor<string>`; provides `NG_VALUE_ACCESSOR` via `forwardRef`.
- [ ] Reuses `CbaFieldComponent` for label/hint/error layout (projects an `<input>`).
- [ ] `NgbTypeahead` applied via `[ngbTypeahead]="search()"` template binding — no `hostDirectives`, no manual DI forwarding.
- [ ] All inputs from spec §4 implemented and typed: `label`, `placeholder`, `disabled`, `hint`, `error`, `search` (required), `resultFormatter`, `inputFormatter`, `editable`, `focusFirst`, `showHint`, `selectOnExact`, `placement`, `popupClass`.
- [ ] Output `itemSelected` re-emits `NgbTypeaheadSelectItemEvent`.
- [ ] Inner `[ngModel]="value()"` / `(ngModelChange)`, `container="body"`, `popupClass="cba-typeahead-window"` wired in template.
- [ ] `aria-describedby` and `aria-invalid` wired; ng-bootstrap's own combobox aria attributes not overridden.
- [ ] Input surface themed via `%cba-native-control` (identical to `CbaInput`).
- [ ] Global popup themes added in `src/theme/_typeahead.scss` using only `--cba-*` tokens, matching `CbaDropdown` elevated menu language.
- [ ] `src/theme/theme.scss` imports the `_typeahead` partial.
- [ ] Component exported from `src/components/typeahead/index.ts` and re-exported from `src/public-api.ts` (after `skeleton`).
- [ ] `.agent/project-structure.md` lists the new folder.
- [ ] JSDoc on the component class and every public input/output includes usage notes and the explicit "engine is ng-bootstrap; no extra autocomplete dependency" note.
- [ ] Minimal spec covers: label/hint/error rendering, aria-describedby, aria-invalid, placeholder forwarding, disabled host class + input attr, writeValue → input value, onChange on input, itemSelected re-emit.
- [ ] `npm run build` succeeds.
- [ ] No new runtime dependency added to `package.json`.
- [ ] No commented-out code, no magic numbers, no `console.log`, private/protected members preferred, methods ≤ 2 params (all handlers take a single event).