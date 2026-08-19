# Phase 12 — Part A: Host Encapsulation Audit & Fix — Front-end Technical Specification

## 1. Scope

Audit every component under `src/components/` for Angular emulated `ViewEncapsulation` selector mismatches. A modifier class bound to the component host receives the `_nghost-*` attribute at runtime, while internal elements receive `_ngcontent-*`. SCSS written as a plain descendant selector (`.modifier .child`) compiles to `.modifier[_ngcontent-*] .child[_ngcontent-*]`, which never matches the host.

This spec documents the inventory, the exact fix pattern, chained-host-class handling, and regression checks for the implementation step.

## 2. Root-cause pattern

| Runtime DOM | Attribute |
|-------------|-----------|
| `<cba-button class="cba-button cba-button--primary">` | `_nghost-*` |
| Inner `<button class="cba-button__control">` | `_ngcontent-*` |

| Bad selector (broken) | Compiled by Angular (emulated) | Result |
|-----------------------|--------------------------------|--------|
| `.cba-button--primary .cba-button__control { }` | `.cba-button--primary[_ngcontent-*] .cba-button__control[_ngcontent-*]` | Never matches because `cba-button--primary` is on `_nghost-*` |
| `:host(.cba-button--primary) .cba-button__control { }` | `.cba-button--primary[_nghost-*] .cba-button__control[_ngcontent-*]` | Matches host + internal child correctly |

Keep `ViewEncapsulation.Emulated`. Do **not** switch the library to `ViewEncapsulation.None`.

## 3. Component inventory

### 3.1 `CbaButton` — `src/components/button/`

**Host-bound classes** (`cba-button.component.ts`):

- `cba-button` (base)
- `cba-button--primary`, `cba-button--secondary`, `cba-button--ghost`, `cba-button--danger`, `cba-button--success`
- `cba-button--sm`, `cba-button--md`
- `cba-button--loading`, `cba-button--disabled`
- `cba-button--truncate`, `cba-button--icon-only`, `cba-button--block`

**SCSS selectors that target host modifiers** (`cba-button.component.scss`):

| Current selector | Status | Fixed selector |
|------------------|--------|----------------|
| `.cba-button--sm .cba-button__control` | Broken | `:host(.cba-button--sm) .cba-button__control` |
| `.cba-button--md .cba-button__control` | Broken | `:host(.cba-button--md) .cba-button__control` |
| `.cba-button--primary .cba-button__control` | Broken | `:host(.cba-button--primary) .cba-button__control` |
| `.cba-button--secondary .cba-button__control` | Broken | `:host(.cba-button--secondary) .cba-button__control` |
| `.cba-button--ghost .cba-button__control` | Broken | `:host(.cba-button--ghost) .cba-button__control` |
| `.cba-button--danger .cba-button__control` | Broken | `:host(.cba-button--danger) .cba-button__control` |
| `.cba-button--success .cba-button__control` | Broken | `:host(.cba-button--success) .cba-button__control` |
| `.cba-button--disabled .cba-button__control, .cba-button--loading .cba-button__control` | Broken | `:host(.cba-button--disabled) .cba-button__control, :host(.cba-button--loading) .cba-button__control` |
| `.cba-button--truncate .cba-button__control` | Broken | `:host(.cba-button--truncate) .cba-button__control` |
| `.cba-button--truncate .cba-button__label` | Broken | `:host(.cba-button--truncate) .cba-button__label` |
| `.cba-button--icon-only .cba-button__control` | Broken | `:host(.cba-button--icon-only) .cba-button__control` |
| `.cba-button--icon-only .cba-button__label` | Broken | `:host(.cba-button--icon-only) .cba-button__label` |
| `.cba-button--icon-only.cba-button--sm .cba-button__control` | Broken | `:host(.cba-button--icon-only.cba-button--sm) .cba-button__control` |
| `.cba-button--icon-only.cba-button--md .cba-button__control` | Broken | `:host(.cba-button--icon-only.cba-button--md) .cba-button__control` |
| `.cba-button--block .cba-button__control` | Broken | `:host(.cba-button--block) .cba-button__control` |
| `.cba-button--block.cba-button--ghost .cba-button__control` | Broken | `:host(.cba-button--block.cba-button--ghost) .cba-button__control` |
| `:host(.cba-button--block)` | Correct | Keep |

### 3.2 `CbaInput` — `src/components/input/`

**Host-bound classes** (`cba-input.component.ts`):

- `cba-input` (base)
- `cba-input--disabled`, `cba-input--readonly`, `cba-input--valid`, `cba-input--error`, `cba-input--invalid`

**SCSS selectors** (`cba-input.component.scss`):

| Current selector | Status | Fixed selector |
|------------------|--------|----------------|
| `.cba-input--disabled .cba-input__control` | Broken | `:host(.cba-input--disabled) .cba-input__control` |
| `.cba-input--readonly .cba-input__control` | Broken | `:host(.cba-input--readonly) .cba-input__control` |

`--valid`, `--error`, `--invalid` are bound on the host but have no matching selectors in this file (visual states are handled by the internal `cba-field` wrapper). No additional SCSS change required for those classes.

### 3.3 `CbaSelect` — `src/components/select/`

**Host-bound classes** (`cba-select.component.ts`):

- `cba-select` (base)
- `cba-select--disabled`, `cba-select--readonly`, `cba-select--valid`, `cba-select--error`, `cba-select--invalid`

**SCSS selectors** (`cba-select.component.scss`):

| Current selector | Status | Fixed selector |
|------------------|--------|----------------|
| `.cba-select--disabled .cba-select__control` | Broken | `:host(.cba-select--disabled) .cba-select__control` |
| `.cba-select--readonly .cba-select__control` | Broken | `:host(.cba-select--readonly) .cba-select__control` |

### 3.4 `CbaDatepicker` — `src/components/datepicker/`

**Host-bound classes** (`cba-datepicker.component.ts`):

- `cba-datepicker` (base)
- `cba-datepicker--disabled`, `cba-datepicker--readonly`, `cba-datepicker--valid`, `cba-datepicker--error`, `cba-datepicker--invalid`

**SCSS selectors** (`cba-datepicker.component.scss`):

| Current selector | Status | Fixed selector |
|------------------|--------|----------------|
| `.cba-datepicker--disabled .cba-datepicker__toggle, .cba-datepicker--disabled .cba-datepicker__control` | Broken | `:host(.cba-datepicker--disabled) .cba-datepicker__toggle, :host(.cba-datepicker--disabled) .cba-datepicker__control` |
| `.cba-datepicker--readonly .cba-datepicker__control` | Broken | `:host(.cba-datepicker--readonly) .cba-datepicker__control` |
| `.cba-datepicker--readonly .cba-datepicker__toggle` | Broken | `:host(.cba-datepicker--readonly) .cba-datepicker__toggle` |

### 3.5 `CbaTypeahead` — `src/components/typeahead/`

**Host-bound classes** (`cba-typeahead.component.ts`):

- `cba-typeahead` (base)
- `cba-typeahead--disabled`, `cba-typeahead--error`

**SCSS selectors** (`cba-typeahead.component.scss`):

| Current selector | Status | Fixed selector |
|------------------|--------|----------------|
| `.cba-typeahead--disabled .cba-typeahead__control` | Broken | `:host(.cba-typeahead--disabled) .cba-typeahead__control` |

`--error` is bound on the host but has no matching selector in this file.

## 4. Components with broken selectors (summary)

1. `CbaButton`
2. `CbaInput`
3. `CbaSelect`
4. `CbaDatepicker`
5. `CbaTypeahead`

## 5. Components already correct

| Component | Why it is correct |
|-----------|-------------------|
| `ModuleContainer` | All modifier selectors already use `:host(.cba-module-container--*)`. |
| `ModuleHeader` | The only host modifier (`--fullscreen`) already uses `:host(.cba-module-header--fullscreen)`. |
| `CbaBadge` | Variant/appearance styles are declared inside `:host { &.cba-badge--solid.cba-badge--primary { ... } }`, which compiles to the host attribute correctly. |
| `CbaDropdown` | Host disabled state already uses `:host(.cba-dropdown--disabled)`. |
| `CbaModuleFooter` | No host-bound modifier classes. Status classes live on internal elements. |
| `CbaCard` | No host-bound modifier classes. |
| `CbaEmptyState` | No host-bound modifier classes. |
| `CbaSkeleton` | Host-bound variant classes exist, but no SCSS selectors target them; styling uses internal element classes only. |
| `CbaModal` | Host-bound size/centered classes exist, but no SCSS selectors target them. |
| `CbaPopover` | No host-bound modifier classes. |
| `CbaAccordion` | No host-bound modifier classes. |
| `CbaFieldComponent` (`form-field`) | Modifier classes (`--disabled`, `--readonly`, `--valid`, `--error`, `--invalid`) are applied to the internal root `<div class="cba-field">`, not the host, so descendant selectors work. |

## 6. Chained host-class handling

Some selectors combine two host-bound modifiers. Keep both classes inside the `:host(...)` argument.

| Broken chained selector | Fixed chained selector |
|-------------------------|------------------------|
| `.cba-button--icon-only.cba-button--sm .cba-button__control` | `:host(.cba-button--icon-only.cba-button--sm) .cba-button__control` |
| `.cba-button--icon-only.cba-button--md .cba-button__control` | `:host(.cba-button--icon-only.cba-button--md) .cba-button__control` |
| `.cba-button--block.cba-button--ghost .cba-button__control` | `:host(.cba-button--block.cba-button--ghost) .cba-button__control` |

Equivalent nested SCSS form is also valid:

```scss
:host {
  &.cba-button--icon-only.cba-button--sm .cba-button__control {
    padding: var(--cba-space-1);
  }
}
```

Both forms produce the same compiled output: the host element must carry **both** modifier classes for the selector to match.

## 7. Exact fix pattern

For every host-bound modifier class `M` and internal child class `C`:

```scss
// Bad
.M .C { ... }

// Good
:host(.M) .C { ... }
```

When a rule groups multiple host modifiers, expand each to its own `:host(...)`:

```scss
// Bad
.M1 .C,
.M2 .C { ... }

// Good
:host(.M1) .C,
:host(.M2) .C { ... }
```

Do **not** introduce `::ng-deep` to work around the problem; fix the selector scope instead.

## 8. Regression check strategy

### 8.1 Build / lint / test gates

Run after all SCSS edits:

- `npm run build` — must produce `dist/` without errors.
- `npm run lint` — must remain clean.
- `npm run test` — existing tests must pass; new assertions may be added (see 8.3).

### 8.2 Compiled CSS review

Inspect the emitted component CSS in `dist/` (or run a temporary consumer build) and verify:

- Every broken selector from Section 3 now starts with `:host(...)`.
- No top-level descendant selector targets a host modifier class (e.g. no `.cba-button--primary .cba-button__control` without `:host`).
- Chained host classes are kept inside `:host(...)`, not split across descendant combinators.

A quick grep check:

```text
# Should find only :host-wrapped rules for these patterns
grep -E ':host\(\.cba-button--(primary|secondary|ghost|danger|success|sm|md|disabled|loading|truncate|icon-only|block)' dist/*.css

# Should NOT find bare descendant host-modifier rules
grep -E '\.cba-button--(primary|secondary|ghost|danger|success|sm|md|disabled|loading|truncate|icon-only|block)\.?\s*\.cba-button__control' dist/*.css
```

### 8.3 Unit-test assertions

Add or extend component specs to assert that modifier classes are present on the host and that the intended visual state is reachable:

- For `CbaButton`:
  - `variant="primary"` adds `cba-button--primary` to the host.
  - `size="sm"` adds `cba-button--sm`.
  - `iconOnly="true"` + `size="sm"` adds both `cba-button--icon-only` and `cba-button--sm`.
  - `loading="true"` adds `cba-button--loading`.
- For `CbaInput`, `CbaSelect`, `CbaDatepicker`, `CbaTypeahead`:
  - `[disabled]="true"` adds the `--disabled` host class.
  - `[readonly]="true"` adds the `--readonly` host class (where applicable).

These assertions protect against future regressions where a host binding is accidentally moved to an internal element.

### 8.4 Manual / demo-app verification

After building the library and consuming it in a real Angular app (Shell or the planned Phase 12 demo app):

- A `<cba-button variant="primary">` renders with the solid `--cba-accent-primary` fill and inverse text.
- `<cba-button variant="danger">` and `<cba-button variant="success">` render with their respective solid fills.
- `size="sm"` and `size="md"` produce visibly different padding/font-size.
- `iconOnly="true"` renders a square button.
- Disabled/loading buttons show reduced opacity and `not-allowed` cursor.
- Disabled/readonly form controls show the correct cursor and surface colors.

## 9. Documentation note

Add a short authoring rule to `AGENTS.md` (or a component-authoring section) stating:

> When a modifier class is bound to the component host via `host: { '[class.foo--bar]': ... }`, style it with `:host(.foo--bar) .child { }`. Plain descendant selectors such as `.foo--bar .child { }` are broken under Angular emulated encapsulation.

## 10. Acceptance criteria for Part A

| # | Criterion |
|---|-----------|
| 1 | All components under `src/components/` are audited and documented. |
| 2 | Every broken host-modifier selector from Sections 3 and 4 is rewritten with `:host(...)`. |
| 3 | Chained host-class selectors keep both classes inside `:host(...)`. |
| 4 | No new `::ng-deep` usage is introduced. |
| 5 | `npm run build`, `npm run lint`, and `npm run test` pass. |
| 6 | Emitted CSS review confirms no bare host-modifier descendant selectors remain. |
| 7 | Unit tests assert host modifier class presence for the fixed components. |
| 8 | Visual verification in a consumer app confirms primary/danger/success button fills and form-control disabled/readonly states. |
| 9 | Component-authoring documentation is updated with the `:host(.modifier)` rule. |

## 11. Files affected by the implementation

- `src/components/button/cba-button.component.scss`
- `src/components/input/cba-input.component.scss`
- `src/components/select/cba-select.component.scss`
- `src/components/datepicker/cba-datepicker.component.scss`
- `src/components/typeahead/cba-typeahead.component.scss`
- `src/components/button/cba-button.component.spec.ts` (new assertions)
- `src/components/input/cba-input.component.spec.ts` (new assertions)
- `src/components/select/cba-select.component.spec.ts` (new assertions)
- `src/components/datepicker/cba-datepicker.component.spec.ts` (new assertions)
- `src/components/typeahead/cba-typeahead.component.spec.ts` (new assertions)
- `AGENTS.md` (authoring note)
