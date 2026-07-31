# CbaDropdown — Front-end Technical Specification

**Project:** `@cobranza-apps/ui`  
**Task:** Phase 6 / Task 1 — Implement `CbaDropdown`  
**Date:** 2026-07-31  
**Status:** Technical specification for 4.1a

---

## 1. Component API

### 1.1 Selector

`cba-dropdown`

### 1.2 Base

`@ng-bootstrap/ng-bootstrap` `NgbDropdown` family (`NgbDropdown`, `NgbDropdownToggle`, `NgbDropdownMenu`, `NgbDropdownItem`).  
**Behavior (open/close, keyboard navigation, positioning, focus management) is owned entirely by ng-bootstrap.** `CbaDropdown` only provides the themed surface, a stable selector/projection contract, and thin passthrough inputs.

### 1.3 Public types

```ts
import { PlacementArray } from '@ng-bootstrap/ng-bootstrap';

/** Placement alias used by CbaDropdown. Kept as a passthrough to ng-bootstrap. */
export type CbaDropdownPlacement = PlacementArray;
```

### 1.4 Inputs

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `placement` | `CbaDropdownPlacement` | `undefined` | Preferred menu placement passed through to `NgbDropdown#placement`. Follows ng-bootstrap positioning semantics. |
| `disabled` | `boolean` | `false` | When `true`, the wrapper applies a disabled host state (`cba-dropdown--disabled`) and `aria-disabled`. Consumers projecting a `cba-button` toggle **must also bind** `[disabled]="dropdown.disabled()"` (or equivalent) so the native button is fully disabled. |

### 1.5 Outputs

| Name | Payload | Description |
| ---- | ------- | ----------- |
| `openChange` | `boolean` | Passthrough for `NgbDropdown#openChange`. Emits `true` on open, `false` on close. |

### 1.6 Content projection slots

| Slot selector | Purpose | Required marker |
| ------------- | ------- | --------------- |
| `[cbaDropdownToggle]` | The toggle element that opens/closes the menu. Usually a `cba-button` or an icon button. | Must also carry `ngbDropdownToggle` so ng-bootstrap wires click handling. |
| default (`<ng-content></ng-content>`) | Menu items / arbitrary menu content projected inside `ngbDropdownMenu`. | Items should use `ngbDropdownItem` for keyboard navigation. |

### 1.7 Folder / files

Actual project structure places components directly under `src/components/`, not `src/lib/components/`:

```text
src/components/dropdown/
  cba-dropdown.component.ts
  cba-dropdown.component.html
  cba-dropdown.component.scss
  cba-dropdown.component.spec.ts
  index.ts
```

Barrel `index.ts` re-exports `CbaDropdownComponent` and `CbaDropdownPlacement`.  
Add `export * from './components/dropdown';` to `src/public-api.ts` (alphabetical order in the components group).  
Update `.agent/project-structure.md` to add `src/components/dropdown/ - CbaDropdown component: thin ng-bootstrap dropdown wrapper with projected toggle and menu items`.

---

## 2. Styling Rules

### 2.1 Architecture

- `ViewEncapsulation.Emulated` (default).
- BEM naming inside the component: block `cba-dropdown`, elements `cba-dropdown__menu`, etc.
- Host-level modifiers: `cba-dropdown--disabled`.
- All values reference `--cba-*` CSS custom properties defined in `brief.md` §5.

### 2.2 Host

```scss
:host {
  display: inline-block;
}

:host(.cba-dropdown--disabled) {
  pointer-events: none;
  opacity: 0.6;
}
```

### 2.3 Menu surface

```scss
.cba-dropdown__menu {
  background-color: var(--cba-bg-elevated);
  border: 1px solid var(--cba-border-subtle);
  border-radius: var(--cba-radius-md);
  box-shadow: var(--cba-shadow-elevated);
  padding: var(--cba-space-1) 0;
  min-width: 12rem; // consider tokenizing as --cba-dropdown-min-width if reused
}
```

### 2.4 Menu items

Style the `ngbDropdownItem` attribute directly so consumers do **not** need to add a custom class.

```scss
.cba-dropdown__menu {
  [ngbDropdownItem] {
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

    &:hover {
      background-color: var(--cba-hover);
    }

    &:active,
    &.active {
      background-color: var(--cba-active);
    }

    &:focus-visible {
      outline: none;
      box-shadow: inset var(--cba-focus-ring);
    }

    &[disabled] {
      color: var(--cba-text-muted);
      cursor: not-allowed;
      opacity: 0.65;
    }
  }
}
```

### 2.5 Divider

Optional divider support can be provided by styling `.dropdown-divider` (Bootstrap class) inside the menu, using `--cba-border-subtle`:

```scss
.cba-dropdown__menu .dropdown-divider {
  height: 0;
  margin: var(--cba-space-1) 0;
  border-top: 1px solid var(--cba-border-subtle);
}
```

### 2.6 Toggle focus

The projected toggle (usually `cba-button`) already renders a focus-visible ring via `--cba-focus-ring`. No extra toggle styling is required from `CbaDropdown`.

### 2.7 Reduced motion

```scss
@media (prefers-reduced-motion: reduce) {
  .cba-dropdown__menu [ngbDropdownItem] {
    transition: none;
  }
}
```

---

## 3. Interaction Patterns

### 3.1 Open / close

- `NgbDropdown` handles click on `[ngbDropdownToggle]` to toggle the menu.
- Default `autoClose` behavior (`true`) is kept: menu closes on item click, outside click, or `Esc`.
- `(openChange)` is bound directly to `NgbDropdown#openChange`.

### 3.2 Keyboard

ng-bootstrap provides:

- `Enter` / `Space` on toggle: open/close.
- `Esc`: close and return focus to toggle.
- Arrow keys: move focus between `[ngbDropdownItem]` elements.
- `Home` / `End`: first/last item (when supported by ng-bootstrap version).

`CbaDropdown` does not add custom keyboard handlers.

### 3.3 Focus

- Focus is managed by ng-bootstrap.
- `cba-button` toggle shows the standard `--cba-focus-ring`.
- Menu items show an inset focus ring (`inset var(--cba-focus-ring)`) so the border radius remains clean.

### 3.4 Disabled state

- Wrapper host class `cba-dropdown--disabled` blocks pointer events and lowers opacity.
- Projected `cba-button` toggle should mirror the same `disabled` value to disable the native `<button>`.
- Disabled menu items use `[disabled]` on `ngbDropdownItem`.

---

## 4. Accessibility Notes

- Rely on ng-bootstrap for `aria-haspopup`, `aria-expanded`, `aria-activedescendant`, and `role="menu"` semantics on the toggle and menu.
- Set `aria-disabled="true"` on the host when `disabled()` is `true`.
- Ensure projected toggle is a real `<button>` (`cba-button` satisfies this).
- Menu items should be `<button ngbDropdownItem>` for correct `role` and keyboard behavior; `<a ngbDropdownItem>` is acceptable for navigation links but must have a valid `href`.
- Visible focus rings must meet WCAG AA focus indication requirements via `--cba-focus-ring`.

---

## 5. Test Strategy

### 5.1 What to test (wrapper concerns only)

1. **Host class and default state**
   - Host has `cba-dropdown` class.
   - Default `disabled()` is `false`; setting it to `true` adds `cba-dropdown--disabled` and `aria-disabled="true"`.

2. **Content projection**
   - Projected `[cbaDropdownToggle]` element is rendered inside the dropdown host.
   - Projected default content is rendered inside `.cba-dropdown__menu`.

3. **Input forwarding**
   - `placement` input is forwarded to `NgbDropdown`. Verify by querying the `NgbDropdown` directive instance via `By.directive(NgbDropdown)` and checking `placement`.

4. **Output passthrough**
   - `openChange` emits when the dropdown opens/closes. Verify by subscribing to the component output and triggering `NgbDropdown#open()` / `close()` programmatically.

5. **Disabled pointer-events guard**
   - When `disabled()` is `true`, host CSS prevents interaction (verify class presence; actual `pointer-events` is a CSS concern and can be covered by the class check).

### 5.2 What NOT to test

- ng-bootstrap positioning / Popper behavior.
- ng-bootstrap keyboard navigation internals.
- ng-bootstrap auto-close logic.
- Browser-native menu rendering in different viewports.

### 5.3 Test setup pattern

Follow the existing `CbaButtonComponent` spec style:

- Import `CbaDropdownComponent` directly.
- For projection tests, create a small test host component that projects a `cba-button` toggle and menu items.
- Use `TestBed.configureTestingModule({ imports: [CbaDropdownComponent, CbaButtonComponent, TestHost] })`.
- Use `fixture.componentRef.setInput()` for signal inputs.

---

## 6. Example Usage

### 6.1 Basic dropdown with `cba-button` toggle

```html
<cba-dropdown [disabled]="isDisabled" (openChange)="onDropdownOpen($event)">
  <cba-button
    cbaDropdownToggle
    ngbDropdownToggle
    variant="secondary"
    [disabled]="isDisabled">
    Options
  </cba-button>

  <button ngbDropdownItem (click)="onEdit()">Edit</button>
  <button ngbDropdownItem (click)="onDuplicate()">Duplicate</button>
  <div class="dropdown-divider"></div>
  <button ngbDropdownItem [disabled]="true">Delete</button>
</cba-dropdown>
```

### 6.2 With placement

```html
<cba-dropdown placement="bottom-start">
  <cba-button cbaDropdownToggle ngbDropdownToggle variant="ghost">
    <fa-icon [icon]="faEllipsisVertical"></fa-icon>
  </cba-button>

  <button ngbDropdownItem>View</button>
  <button ngbDropdownItem>Archive</button>
</cba-dropdown>
```

### 6.3 Consumer TypeScript

```ts
import { Component } from '@angular/core';
import { CbaDropdownComponent } from '@cobranza-apps/ui';
import { CbaButtonComponent } from '@cobranza-apps/ui';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [CbaDropdownComponent, CbaButtonComponent, NgbDropdownModule, FontAwesomeModule],
  templateUrl: './my-component.html',
})
export class MyComponent {
  protected readonly faEllipsisVertical = faEllipsisVertical;
  protected isDisabled = false;

  protected onDropdownOpen(open: boolean): void {
    console.log('dropdown open:', open);
  }

  protected onEdit(): void {
    // handle edit
  }
}
```

### 6.4 Important note for consumers

> The menu open/close logic, positioning, and keyboard navigation come from `@ng-bootstrap/ng-bootstrap`.  
> `CbaDropdown` only adds the Cobranza theme and a stable projection API. Always apply `ngbDropdownToggle` to the projected toggle element in addition to `cbaDropdownToggle`.

---

## 7. Acceptance Criteria

- [ ] Component compiles as a standalone Angular component.
- [ ] `NgbDropdownModule` directives are imported; behavior is delegated to ng-bootstrap.
- [ ] `cba-dropdown` selector, `[cbaDropdownToggle]` slot, and default menu projection work.
- [ ] `placement` and `disabled` inputs are exposed and forwarded/styled correctly.
- [ ] `openChange` output is forwarded.
- [ ] Menu surface uses `--cba-bg-elevated`, `--cba-border-subtle`, `--cba-radius-md`, `--cba-shadow-elevated`.
- [ ] Menu items use `--cba-hover` / `--cba-active` states and `--cba-text-primary` / `--cba-text-muted`.
- [ ] JSDoc on component, inputs, and output includes the example and the ng-bootstrap note.
- [ ] Tests cover host class, projection, input forwarding, and output passthrough only.
- [ ] `src/public-api.ts` exports the component.
- [ ] `npm run build`, `npm test`, and `npm run lint` pass.

---

## 8. References

- [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme-proposal) — design tokens.
- [TODO task source](.agent/todos/20260730/20260730-todo-4.md) — original requirements.
- `@ng-bootstrap/ng-bootstrap` dropdown API — `node_modules/@ng-bootstrap/ng-bootstrap/types/ng-bootstrap-ng-bootstrap-dropdown.d.ts`.
- Existing wrapper patterns: `src/components/modal/cba-modal.component.ts`, `src/components/button/cba-button.component.ts`.
