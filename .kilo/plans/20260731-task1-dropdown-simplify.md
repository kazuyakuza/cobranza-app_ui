# CbaDropdown — Simplification Plan

**Project:** `@cobranza-apps/ui`
**Task:** Phase 6 / Task 1 — Simplify `CbaDropdown` implementation
**Source TODO:** `.agent/todos/20260730/20260730-todo-4.md`, section "### 1. Implement CbaDropdown"
**Source implementation plan:** `.kilo/plans/20260731-task1-dropdown-impl.md`
**Date:** 2026-07-31

---

## 1. Executive summary

The current implementation of `CbaDropdown` works, but it is unnecessarily complex: it uses `hostDirectives: [NgbDropdown]` and then reaches into ng-bootstrap's private `_menu` reference to wire the menu surface manually. This adds lifecycle hooks, a private type cast, a subscription in `constructor`, an `effect` for placement synchronization, and a `ViewChild` query that are all avoidable.

The original implementation plan (§0.2) explicitly rejected `hostDirectives` in favor of an inner `<div ngbDropdown>` root. Reverting to that design removes the fragility of depending on private ng-bootstrap internals and aligns `CbaDropdown` with the established wrapper pattern used by `CbaDatepicker`.

This document lists the concrete simplifications to apply. **Do not apply them yet** — this is the review output for the implementer in the next Critical Workflow step.

---

## 2. Simplifications by file

### 2.1 `src/components/dropdown/cba-dropdown.component.ts`

#### 2.1.1 Revert from `hostDirectives` to inner `<div ngbDropdown>`

**Current complexity:**
- `hostDirectives: [NgbDropdown]` on the host.
- `inject(NgbDropdown)` to access the host-directive instance.
- `AfterViewInit` + `ViewChild(NgbDropdownMenu)` + private type `NgbDropdownWithMenu` + `linkMenuToDropdown()` to assign `this.menu` to `(this.ngbDropdown as any)._menu`.
- `effect(() => { this.ngbDropdown.placement = this.placement(); })` to keep placement in sync.
- `this.ngbDropdown.openChange.subscribe(...)` in the constructor to re-emit `openChange`.

**Simplification:**
Move `ngbDropdown` into the template, bind `[placement]` and `(openChange)` declaratively, and drop all of the above. The component then only owns signal inputs, the output, and host bindings.

**Rationale:**
- Matches the approved architecture in `.kilo/plans/20260731-task1-dropdown-impl.md` §0.2, Option B.
- Matches the existing `CbaDatepicker` wrapper pattern (`ngbDatepicker` in the template).
- Avoids touching private ng-bootstrap API (`_menu`), which is not part of the semver contract.
- Removes a lifecycle hook, a `ViewChild`, an `effect`, a constructor subscription, and a type cast.

#### 2.1.2 Default `placement` should be `undefined`, not a hardcoded array

**Current:**
```ts
readonly placement = input<CbaDropdownPlacement>(['bottom-start', 'bottom-end', 'top-start', 'top-end']);
```

**Simplification:**
```ts
readonly placement = input<CbaDropdownPlacement>(undefined);
```

**Rationale:**
- The implementation plan (§2.1, §4.2 test 5) explicitly chose `undefined` so ng-bootstrap applies its own default placement order.
- Hardcoding the array duplicates ng-bootstrap internals inside the wrapper and adds a test that asserts that default.

#### 2.1.3 Re-introduce a small `onOpenChange` handler

**Simplification:**
```ts
protected onOpenChange(open: boolean): void {
  this.openChange.emit(open);
}
```

**Rationale:**
- Keeps the template binding declarative (`(openChange)="onOpenChange($event)"`) instead of an inline arrow.
- Consistent with the implementation plan §2.1.
- No private API access required.

#### 2.1.4 Remove `AfterViewInit` and `ViewChild`

No longer needed once the inner `<div ngbDropdown>` owns the directive and the menu is a child element in the same view.

#### 2.1.5 Remove the private `NgbDropdownWithMenu` type alias

This type exists only to bypass privacy for `_menu`. Once the menu is wired through the template, the type is dead code.

#### 2.1.6 Updated component skeleton

```ts
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NgbDropdownModule, PlacementArray } from '@ng-bootstrap/ng-bootstrap';

export type CbaDropdownPlacement = PlacementArray;

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
  readonly placement = input<CbaDropdownPlacement>(undefined);
  readonly disabled = input<boolean>(false);
  readonly openChange = output<boolean>();

  protected onOpenChange(open: boolean): void {
    this.openChange.emit(open);
  }
}
```

**Notes:**
- Keep the existing JSDoc block but update the `@remarks` paragraph to describe the inner `<div ngbDropdown>` architecture instead of `hostDirectives`.
- The `@usageNotes` example already matches this simpler structure.

---

### 2.2 `src/components/dropdown/cba-dropdown.component.html`

#### 2.2.1 Wrap projected content in the ng-bootstrap dropdown root

**Current:**
```html
<ng-content select="[cbaDropdownToggle]"></ng-content>
<div class="cba-dropdown__menu" ngbDropdownMenu>
  <ng-content></ng-content>
</div>
```

**Simplification:**
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

**Rationale:**
- `NgbDropdown` is instantiated on this inner div; the menu directive is a natural child, so no manual `_menu` linking is required.
- `NgbDropdown` automatically adds Bootstrap's `.dropdown` class to the inner root, providing `position: relative` for menu anchoring.
- The host `<cba-dropdown>` remains `display: inline-block` and only carries theme/disabled state.

---

### 2.3 `src/components/dropdown/cba-dropdown.component.scss`

#### 2.3.1 No structural changes required

The stylesheet is already thin, token-only, and within line/depth limits. Minor optional polish (not required):

- `min-width: 12rem` is intentionally left as a raw value per the implementation plan; do not change it in this simplification pass.
- The `[ngbDropdownItem]` attribute selector continues to work with emulated encapsulation because the menu and its projected items live inside the component's view.

**Decision:** Leave SCSS as-is.

---

### 2.4 `src/components/dropdown/cba-dropdown.component.spec.ts`

#### 2.4.1 Remove the test that asserts ng-bootstrap's default placement array

**Current test:**
```ts
it('applies the ng-bootstrap default placement order when unset', () => {
  fixture = TestBed.createComponent(CbaDropdownComponent);
  fixture.detectChanges();
  const ngbDropdown = fixture.debugElement.injector.get(NgbDropdown);
  expect(ngbDropdown.placement).toEqual(['bottom-start', 'bottom-end', 'top-start', 'top-end']);
});
```

**Simplification:** Delete this test.

**Rationale:**
- The implementation plan §4.3 explicitly lists "ng-bootstrap Popper positioning / actual menu placement" as out-of-scope internals not to test.
- Asserting the exact default array ties the test to ng-bootstrap's internal default; if ng-bootstrap changes the order, the wrapper test breaks even though the wrapper is correct.
- Once `placement` defaults to `undefined`, the wrapper's job (forwarding) is already covered by the existing "forwards placement" test.

#### 2.4.2 Update host/standalone test imports

- Remove `NgbDropdownModule` from `DropdownHost`'s `imports` array; `CbaDropdownComponent` already imports `NgbDropdownModule`, so the host does not need to repeat it.
- Keep `NgbDropdownModule` in `TestBed.configureTestingModule({ imports: [...] })` only if `DropdownHost` relies on it directly. After the change, `DropdownHost` only needs `CbaDropdownComponent` and `CbaButtonComponent`.

**Simplified host setup:**
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
```

```ts
function configureTestBed(): void {
  TestBed.configureTestingModule({
    imports: [CbaDropdownComponent, CbaButtonComponent, DropdownHost],
  });
}
```

**Rationale:**
- Fewer redundant imports make the test intent clearer.
- Aligns with the implementation plan §4.1.

#### 2.4.3 Update placement-forwarding test to query the inner `NgbDropdown`

Once the directive moves from the host to an inner `<div>`, `fixture.debugElement.injector.get(NgbDropdown)` will not resolve it from the host debug element. Query by directive instead:

```ts
it('forwards placement to the NgbDropdown instance', () => {
  fixture = TestBed.createComponent(CbaDropdownComponent);
  fixture.componentRef.setInput('placement', 'top-start');
  fixture.detectChanges();
  const ngbDropdown = fixture.debugElement.query(By.directive(NgbDropdown)).injector.get(NgbDropdown);
  expect(ngbDropdown.placement).toEqual('top-start');
});
```

The same `By.directive(NgbDropdown)` query is already used in the openChange test and remains valid.

#### 2.4.4 Keep the remaining tests unchanged

The following tests are already appropriate and should stay:
- Host class and default state.
- Disabled host state and `aria-disabled` toggling.
- Toggle projection slot.
- Menu item projection inside the menu surface.
- `openChange` re-emission.

---

### 2.5 `src/components/dropdown/index.ts`

No change required. The barrel continues to re-export `CbaDropdownComponent` and `CbaDropdownPlacement`.

---

## 3. What is explicitly NOT being simplified

To avoid scope creep, leave these items untouched:

| Item | Reason |
| ---- | ------ |
| `min-width: 12rem` in SCSS | Already documented in the implementation plan as a candidate for future tokenization; not a simplification issue. |
| JSDoc length | The block is required by the TODO and follows project conventions. Only the `@remarks` paragraph needs updating to match the new architecture. |
| Public API (inputs/output names) | `placement`, `disabled`, `openChange` are correct and match the spec. |
| Test host using `cba-button` | Matches the TODO requirement that the dropdown works naturally with `cba-button`. |
| SCSS token coverage | Already exclusively uses `--cba-*` tokens (plus the documented `12rem`). |

---

## 4. Files to modify

| # | Path | Change |
| - | ---- | ------ |
| 1 | `src/components/dropdown/cba-dropdown.component.ts` | Remove `hostDirectives`, `AfterViewInit`, `ViewChild`, `inject(NgbDropdown)`, private `_menu` type, constructor subscription, and placement `effect`. Add inner-root template bindings via `onOpenChange`. Default `placement` to `undefined`. Update `@remarks`. |
| 2 | `src/components/dropdown/cba-dropdown.component.html` | Wrap toggle + menu in `<div ngbDropdown [placement]="placement()" (openChange)="onOpenChange($event)">`. |
| 3 | `src/components/dropdown/cba-dropdown.component.spec.ts` | Drop the default-placement-array test; remove redundant `NgbDropdownModule` import from host; update `NgbDropdown` query in placement-forwarding test. |

`src/components/dropdown/cba-dropdown.component.scss` and `src/components/dropdown/index.ts` require no changes.

---

## 5. Verification after simplification

Run the same commands defined in the implementation plan §5.4–§5.6:

1. `npm run build` — library build must succeed.
2. `npm run lint` — zero errors/warnings on the modified files.
3. `npm test -- cba-dropdown` — all dropdown tests pass.

Additional checks:
- Confirm `CbaDropdownComponent` is still exported from `src/public-api.ts` via `src/components/dropdown/index.ts`.
- Confirm no references to `_menu`, `NgbDropdownWithMenu`, `AfterViewInit`, `ViewChild`, or `hostDirectives` remain in the dropdown source.

---

## 6. Risk assessment

| Risk | Mitigation |
| ---- | ---------- |
| Inner `<div ngbDropdown>` changes the host selector from `cba-dropdown[ngbDropdown]` to a child div. | This is the originally approved design and matches `CbaDatepicker`. Projected `ngbDropdownToggle`/`ngbDropdownItem` still resolve because they are children of the element carrying `ngbDropdown`. |
| Tests that previously relied on `injector.get(NgbDropdown)` on the host debug element break. | Update to `query(By.directive(NgbDropdown))` as described in §2.4.3. |
| Consumer markup that assumed `ngbDropdown` lives on the host may break. | The public API is unchanged; consumers still use `<cba-dropdown>`. The internal DOM structure is an implementation detail. |

---

**End of simplification plan.**
