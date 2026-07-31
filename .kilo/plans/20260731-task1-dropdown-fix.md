# CbaDropdown — Code Review & Fix Plan

**Project:** `@cobranza-apps/ui`
**Task:** Phase 6 / Task 1 — `CbaDropdown` code review & simplification
**Source TODO:** `.agent/todos/20260730/20260730-todo-4.md`, section "### 1. Implement CbaDropdown"
**Implementation plan:** `.kilo/plans/20260731-task1-dropdown-impl.md`
**Front-end spec:** `.kilo/plans/20260731-task1-dropdown-frontend-spec.md`
**Related simplification plan:** `.kilo/plans/20260731-task1-dropdown-simplify.md`
**Date:** 2026-07-31

---

## 1. Verification status

| Check | Result |
| ----- | ------ |
| `npm run build` | Passed |
| `npm test -- cba-dropdown` | Passed (7/7) |
| `npm test` | Passed (89/89) |
| `npm run lint` | Passed (no errors/warnings) |

The implementation is functionally correct, but it deviates from the approved plan and contains avoidable complexity and a rule compliance issue.

---

## 2. Issues found

### 2.1 Plan adherence — architecture deviation (high)

The implementation uses `hostDirectives: [NgbDropdown]` on the host element and then manually links the menu by writing to ng-bootstrap's private `_menu` property. The approved implementation plan (§0.2) explicitly **rejected** `hostDirectives` (Option A) and chose an inner `<div ngbDropdown>` root (Option B).

**Consequences of the current approach:**
- Reaches into a private ng-bootstrap API (`_menu`) through an unsafe `unknown` cast.
- Adds unnecessary lifecycle, state, and subscription complexity:
  - `AfterViewInit`
  - `ViewChild(NgbDropdownMenu)`
  - `inject(NgbDropdown)`
  - `effect(() => { this.ngbDropdown.placement = this.placement(); })`
  - `this.ngbDropdown.openChange.subscribe(...)` in the constructor
  - Private `NgbDropdownWithMenu` type alias
- Diverges from the wrapper pattern used by `CbaDatepicker` and `CbaModal`.
- Increases fragility: future ng-bootstrap updates can rename/remove `_menu` and break the wrapper even though the public API is unchanged.

**Fix:** Revert to Option B — move `ngbDropdown` into the template, bind `[placement]` and `(openChange)` declaratively, and remove all host-directive workarounds.

### 2.2 Default `placement` is hardcoded (medium)

The spec and implementation plan specify that `placement` should default to `undefined` so ng-bootstrap applies its own default placement order. The implementation hardcodes:

```ts
readonly placement = input<CbaDropdownPlacement>(['bottom-start', 'bottom-end', 'top-start', 'top-end']);
```

This duplicates ng-bootstrap internals inside the wrapper and adds a test that asserts the exact array.

**Fix:** Change the default to `undefined`.

### 2.3 SCSS nesting depth violates `max-depth.md` (medium)

The stylesheet nests three levels:

```scss
.cba-dropdown__menu {           // level 1
  [ngbDropdownItem] {            // level 2
    &:hover {                    // level 3
      ...
    }
  }
}
```

`.kilo/rules/max-depth.md` limits nested blocks to 2 levels. The implementation plan incorrectly stated the SCSS was within depth limits; it is not.

**Fix:** Flatten item and pseudo-state selectors to top-level blocks. This keeps the same emitted selectors while complying with the depth rule.

### 2.4 Test asserts an implementation detail (low)

`it('applies the ng-bootstrap default placement order when unset')` asserts that the unset `placement` equals the hardcoded array `['bottom-start', 'bottom-end', 'top-start', 'top-end']`. The implementation plan §4.3 lists ng-bootstrap's internal default placement order as out-of-scope internals that must not be tested.

**Fix:** Delete this test after restoring the `undefined` default. The existing "forwards placement" test already covers wrapper forwarding.

### 2.5 Minor: redundant test-host import (low)

`DropdownHost` imports `NgbDropdownModule` even though `CbaDropdownComponent` already imports it. Removing it reduces noise.

**Fix:** Remove `NgbDropdownModule` from `DropdownHost.imports` and from `TestBed.configureTestingModule` imports; keep it only if the host template directly needs it (it does not).

### 2.6 Minor: subscription in constructor is not explicitly torn down (low)

`this.ngbDropdown.openChange.subscribe(...)` in the constructor has no unsubscribe logic. While `NgbDropdown` is a host directive with the same lifecycle, this pattern is unnecessary once the output is bridged through the template and should be removed.

**Fix:** Eliminated by the Option B refactor.

---

## 3. Fix plan

### 3.1 `src/components/dropdown/cba-dropdown.component.ts`

1. Remove `hostDirectives: [NgbDropdown]` from `@Component`.
2. Remove `AfterViewInit`, `effect`, `inject`, and `ViewChild` from the Angular imports.
3. Remove `NgbDropdown` and `NgbDropdownMenu` from the ng-bootstrap imports (keep `NgbDropdownModule` and `PlacementArray`).
4. Remove the private `NgbDropdownWithMenu` type alias.
5. Remove `private readonly ngbDropdown = inject(NgbDropdown);`.
6. Remove `@ViewChild(NgbDropdownMenu) private readonly menu?: NgbDropdownMenu;`.
7. Remove the `constructor()` subscription and the placement `effect()`.
8. Remove `ngAfterViewInit()` and `linkMenuToDropdown()`.
9. Change `placement` default to `undefined`:
   ```ts
   readonly placement = input<CbaDropdownPlacement>(undefined);
   ```
10. Add the `onOpenChange` bridge used by the template:
    ```ts
    protected onOpenChange(open: boolean): void {
      this.openChange.emit(open);
    }
    ```
11. Update the `@remarks` JSDoc paragraph to describe the inner `<div ngbDropdown>` architecture instead of `hostDirectives` and `_menu` linking.

**Target skeleton:**

```ts
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NgbDropdownModule, PlacementArray } from '@ng-bootstrap/ng-bootstrap';

/** Placement alias used by `CbaDropdown`. Passthrough to ng-bootstrap's `PlacementArray`. */
export type CbaDropdownPlacement = PlacementArray;

/**
 * Thin, token-styled wrapper around `@ng-bootstrap/ng-bootstrap` dropdown.
 *
 * **Responsibility split:**
 * - ng-bootstrap owns menu open/close, keyboard navigation, focus management,
 *   auto-close, and Popper positioning.
 * - This component owns the Cobranza gray-theme surface, a stable `cba-dropdown`
 *   selector, and two thin passthrough inputs (`placement`, `disabled`) plus an
 *   `openChange` output.
 *
 * Project the toggle marked with both `cbaDropdownToggle` **and** `ngbDropdownToggle`
 * (the latter wires ng-bootstrap click handling). Project menu items inside the
 * default slot, each decorated with `ngbDropdownItem` so keyboard navigation works.
 *
 * @usageNotes
 * ```html
 * <cba-dropdown [disabled]="isDisabled" (openChange)="onOpen($event)">
 *   <cba-button cbaDropdownToggle ngbDropdownToggle variant="secondary"
 *              [disabled]="isDisabled">Options</cba-button>
 *   <button ngbDropdownItem (click)="onEdit()">Edit</button>
 *   <button ngbDropdownItem (click)="onDuplicate()">Duplicate</button>
 *   <div class="dropdown-divider"></div>
 *   <button ngbDropdownItem [disabled]="true">Delete</button>
 * </cba-dropdown>
 * ```
 *
 * @remarks
 * Behavior (open/close, positioning, keyboard) comes from `@ng-bootstrap/ng-bootstrap`.
 * `CbaDropdown` only adds theming and a stable projection API. The ng-bootstrap
 * dropdown directive is instantiated on an inner root element in the template, so
 * projected content (toggle and menu items) naturally wires to it without reaching
 * into private ng-bootstrap internals.
 *
 * @see [CBA_DROPDOWN.md](/docs/CBA_DROPDOWN.md)
 */
@Component({
  selector: 'cba-dropdown',
  standalone: true,
  imports: [NgbDropdownModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-dropdown.component.html',
  styleUrl: './cba-dropdown.component.scss',
  host: {
    class: 'cba-dropdown',
    '[class.cba-dropdown--disabled]': 'disabled()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
  },
})
export class CbaDropdownComponent {
  /**
   * Preferred menu placement, forwarded to `NgbDropdown#placement`.
   * Follows ng-bootstrap positioning semantics
   * (e.g. `'bottom-start'`, `'top-end'`, or an array of fallbacks).
   * Defaults to ng-bootstrap's own placement order.
   */
  readonly placement = input<CbaDropdownPlacement>(undefined);

  /**
   * Wrapper-level disabled state. When `true`, applies the `cba-dropdown--disabled`
   * host modifier (blocks pointer events, dims the host) and sets `aria-disabled`.
   * The projected toggle (e.g. `cba-button`) **must** mirror this value on its own
   * `[disabled]` binding so the native button is fully disabled.
   */
  readonly disabled = input<boolean>(false);

  /** Passthrough for `NgbDropdown#openChange`. Emits `true` on open, `false` on close. */
  readonly openChange = output<boolean>();

  /** Bridges `NgbDropdown#openChange` to the wrapper output. */
  protected onOpenChange(open: boolean): void {
    this.openChange.emit(open);
  }
}
```

### 3.2 `src/components/dropdown/cba-dropdown.component.html`

Replace the current template with the inner-root structure:

```html
<div class="cba-dropdown__root"
     ngbDropdown
     [placement]="placement()"
     (openChange)="onOpenChange($event)">
  <ng-content select="[cbaDropdownToggle]"></ng-content>
  <div class="cba-dropdown__menu" ngbDropdownMenu>
    <ng-content></ng-content>
  </div>
</div>
```

`NgbDropdown` will add Bootstrap's `.dropdown` class to `.cba-dropdown__root`, providing `position: relative` for menu anchoring, and the `ngbDropdownMenu` content query will find the menu automatically because both directives now live in the same view.

### 3.3 `src/components/dropdown/cba-dropdown.component.scss`

Flatten nested selectors so no block exceeds depth 2. Keep all existing token values and visual behavior.

```scss
:host {
  display: inline-block;
}

:host(.cba-dropdown--disabled) {
  pointer-events: none;
  opacity: 0.6;
}

.cba-dropdown__menu {
  background-color: var(--cba-bg-elevated);
  border: 1px solid var(--cba-border-subtle);
  border-radius: var(--cba-radius-md);
  box-shadow: var(--cba-shadow-elevated);
  padding: var(--cba-space-1) 0;
  min-width: 12rem;
}

.cba-dropdown__menu [ngbDropdownItem] {
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

.cba-dropdown__menu [ngbDropdownItem]:hover {
  background-color: var(--cba-hover);
}

.cba-dropdown__menu [ngbDropdownItem]:active,
.cba-dropdown__menu [ngbDropdownItem].active {
  background-color: var(--cba-active);
}

.cba-dropdown__menu [ngbDropdownItem]:focus-visible {
  outline: none;
  box-shadow: inset var(--cba-focus-ring);
}

.cba-dropdown__menu [ngbDropdownItem][disabled] {
  color: var(--cba-text-muted);
  cursor: not-allowed;
  opacity: 0.65;
}

.cba-dropdown__menu .dropdown-divider {
  height: 0;
  margin: var(--cba-space-1) 0;
  border-top: 1px solid var(--cba-border-subtle);
}

@media (prefers-reduced-motion: reduce) {
  .cba-dropdown__menu [ngbDropdownItem] {
    transition: none;
  }
}
```

### 3.4 `src/components/dropdown/cba-dropdown.component.spec.ts`

1. Remove `NgbDropdownModule` from `DropdownHost.imports` and from `TestBed.configureTestingModule({ imports: [...] })`.
2. Delete the test `it('applies the ng-bootstrap default placement order when unset', ...)`.
3. Update the placement-forwarding test to query `NgbDropdown` on the inner root element:
   ```ts
   it('forwards placement to the NgbDropdown instance', () => {
     fixture = TestBed.createComponent(CbaDropdownComponent);
     fixture.componentRef.setInput('placement', 'top-start');
     fixture.detectChanges();
     const ngbDropdown = fixture.debugElement
       .query(By.directive(NgbDropdown))
       .injector.get(NgbDropdown);
     expect(ngbDropdown.placement).toEqual('top-start');
   });
   ```
4. Keep the remaining tests unchanged:
   - Host class and default state.
   - Disabled host state and `aria-disabled` toggling.
   - Toggle projection slot.
   - Menu item projection inside `.cba-dropdown__menu`.
   - `openChange` re-emission via `NgbDropdown#open()` / `close()`.

**Target `DropdownHost` and test-bed setup:**

```ts
@Component({
  standalone: true,
  imports: [CbaDropdownComponent, CbaButtonComponent],
  template: `<cba-dropdown [disabled]="disabled" (openChange)="onOpen($event)">
    <cba-button class="tg" cbaDropdownToggle ngbDropdownToggle>Options</cba-button>
    <button class="item" ngbDropdownItem>Edit</button>
    <button class="item-disabled" ngbDropdownItem [disabled]="true">Delete</button>
  </cba-dropdown>`,
})
class DropdownHost {
  disabled = false;
  onOpen = jest.fn();
}

function configureTestBed(): void {
  TestBed.configureTestingModule({
    imports: [CbaDropdownComponent, CbaButtonComponent, DropdownHost],
  });
}
```

---

## 4. Files requiring no changes

| Path | Reason |
| ---- | ------ |
| `src/components/dropdown/index.ts` | Barrel re-export is correct. |
| `src/public-api.ts` | `export * from './components/dropdown';` is present in alphabetical order. |
| `.agent/project-structure.md` | `src/components/dropdown/` line is present and correctly placed. |

---

## 5. Verification after fixes

Run the same checks already passing today:

1. `npm run build` — must succeed with no Angular/ng-packagr errors.
2. `npm run lint` — must report zero errors/warnings on modified files.
3. `npm test -- cba-dropdown` — must pass all dropdown tests.
4. `npm test` — must pass the full suite (89/89).

Additional static checks:
- Confirm no references to `_menu`, `NgbDropdownWithMenu`, `hostDirectives`, `AfterViewInit`, `ViewChild`, or `effect` remain in the dropdown source.
- Confirm SCSS has no selector block nested more than two levels deep.
- Confirm `placement` default is `undefined`.

---

## 6. Risk assessment

| Risk | Mitigation |
| ---- | ---------- |
| Inner `<div ngbDropdown>` changes internal DOM structure. | Public API (`<cba-dropdown>` selector, inputs, outputs, projection slots) is unchanged; the inner DOM is an implementation detail. |
| Existing tests that rely on `injector.get(NgbDropdown)` at the host break. | Updated to `query(By.directive(NgbDropdown))` in the fix plan. |
| SCSS flattening changes source order/specificity. | The emitted selectors are functionally identical; emulated encapsulation continues to scope them. |
| Removing the default-placement-array test reduces coverage. | Wrapper forwarding is still covered by the placement-forwarding test; ng-bootstrap internals remain out of scope. |

---

**End of code review & fix plan.**
