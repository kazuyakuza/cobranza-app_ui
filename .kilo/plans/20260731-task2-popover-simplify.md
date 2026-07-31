# CbaPopover — Code Simplification Plan

**Task:** Phase 6 — Task 2 — Code Simplification for `CbaPopover` (Critical Workflow step 4.3)  
**Source TODO:** `.agent/todos/20260730/20260730-todo-4.md` → Section "### 2. Implement CbaPopover"  
**Implementation plan:** `.kilo/plans/20260731-task2-popover-impl.md`  
**Date:** 2026-07-31  
**Author:** Code Simplifier (Critical Workflow 4.3)

---

## 1. Summary

The `CbaPopover` implementation works, but it is more complex than necessary. It manually wires every input and output to the host `NgbPopover` directive with `effect()` and subscriptions, even though the implementation plan's pre-analysis already verified that `hostDirectives` input/output forwarding is sufficient for `NgbPopover` (unlike `CbaDropdown`, which needs the `_menu` workaround).

**Primary simplification:** replace manual `effect()` + component-level `output()` forwarding with `hostDirectives` `inputs`/`outputs` mapping. This removes ~40 lines, two private methods, two imports, and an incorrect JSDoc claim.

---

## 2. Simplification Opportunities

### 2.1 Use `hostDirectives` input/output forwarding (high impact)

**Current state (component):**

- Imports `effect` and `output`.
- Declares component-level `shown` / `hidden` outputs.
- Contains three constructor calls and two private methods (`reemitPopoverEvents`, `forwardInputsToNgbPopover`) just to shuttle data to the host directive.
- JSDoc states that `hostDirectives` input/output forwarding "does not reliably react to later input changes" — this is not accurate for Angular signal inputs.

**Recommended state:**

Follow the implementation plan's §1.3 and §3.2:

```ts
@Component({
  selector: 'cba-popover',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: NgbPopover,
      inputs: [
        'ngbPopover: body',
        'popoverTitle: title',
        'placement',
        'triggers',
        'disablePopover: disabled',
      ],
      outputs: ['shown', 'hidden'],
    },
  ],
  templateUrl: './cba-popover.component.html',
  styleUrl: './cba-popover.component.scss',
  host: { class: 'cba-popover' },
})
export class CbaPopoverComponent {
  readonly body = input<string | TemplateRef<unknown> | null | undefined>(undefined);
  readonly title = input<string | TemplateRef<unknown> | null | undefined>(undefined);
  readonly placement = input<CbaPopoverPlacement>('auto');
  readonly triggers = input<string>('hover focus');
  readonly disabled = input<boolean>(false);

  private readonly ngbPopover = inject(NgbPopover);

  constructor() {
    this.ngbPopover.popoverClass = 'cba-popover-window';
    this.ngbPopover.container = 'body';
  }
}
```

**Why this is safe:**

- `NgbPopover` has no `@ContentChild` / `@ViewChild` queries that require manual linking (verified in implementation plan §1.1).
- Angular signal `input()` values forwarded through `hostDirectives` are reactive; `NgbPopover` reads its inputs reactively inside `ngOnChanges` and effects.
- `outputs: ['shown', 'hidden']` re-emits the directive events through the host component, so consumers still bind `(shown)` / `(hidden)` on `<cba-popover>`.

**Impact:**

- Removes `effect` and `output` imports.
- Removes `shown` / `hidden` component fields.
- Removes `reemitPopoverEvents()` and `forwardInputsToNgbPopover()`.
- Reduces `cba-popover.component.ts` from ~112 lines to ~60–70 lines.
- Fixes the misleading JSDoc paragraph.

### 2.2 Simplify tests with a helper (medium impact)

Most tests create the same fixture and resolve `NgbPopover` the same way:

```ts
const popover = fixture.debugElement.query(By.directive(CbaPopoverComponent)).injector.get(NgbPopover);
```

Extract a helper:

```ts
function getNgbPopover(fixture: ComponentFixture<unknown>): NgbPopover {
  return fixture.debugElement
    .query(By.directive(CbaPopoverComponent))
    .injector.get(NgbPopover);
}
```

Also consider a second helper for standalone `CbaPopoverComponent` fixtures:

```ts
function getStandaloneNgbPopover(fixture: ComponentFixture<CbaPopoverComponent>): NgbPopover {
  return fixture.debugElement.injector.get(NgbPopover);
}
```

**Impact:**

- Removes ~10 repeated resolution expressions.
- Makes tests shorter and easier to read.
- No coverage loss.

### 2.3 Re-evaluate the `CbaPopoverPlacement` alias (low impact)

`cba-popover.types.ts` is a one-line alias of `PlacementArray`. It mirrors `CbaDropdownPlacement`, so keeping it preserves project-wide consistency. Deleting it and using `PlacementArray` directly would remove one file but break the alias pattern already used by dropdown and modal.

**Recommendation:** keep the alias file for API consistency.

### 2.4 SCSS arrow rules (low impact)

`src/theme/_popover.scss` repeats arrow-color overrides for each placement. The repetition is required because Bootstrap uses different `border-*-color` properties per placement, but the file could be tightened:

- Use CSS custom properties for arrow fill/border colors to reduce the 16 selector blocks.
- Group the `prefers-reduced-motion` block into a single `.cba-popover-window, .cba-popover-window.fade` selector.

Example sketch (optional):

```scss
.cba-popover-window {
  --cba-popover-arrow-fill: var(--cba-bg-elevated);
  --cba-popover-arrow-border: var(--cba-border-subtle);

  .popover-arrow::before { border-color: var(--cba-popover-arrow-border); }
  .popover-arrow::after { border-color: var(--cba-popover-arrow-fill); }

  &.bs-popover-top .popover-arrow::after,
  &.bs-popover-bottom .popover-arrow::before { border-top-color: var(--cba-popover-arrow-fill); }

  &.bs-popover-bottom .popover-arrow::after,
  &.bs-popover-top .popover-arrow::before { border-bottom-color: var(--cba-popover-arrow-fill); }

  &.bs-popover-start .popover-arrow::after,
  &.bs-popover-end .popover-arrow::before { border-left-color: var(--cba-popover-arrow-fill); }

  &.bs-popover-end .popover-arrow::after,
  &.bs-popover-start .popover-arrow::before { border-right-color: var(--cba-popover-arrow-fill); }
}
```

**Recommendation:** apply only if the project prefers custom-property-driven SCSS; otherwise leave as-is because the current version is explicit and easy to audit.

### 2.5 Template and component SCSS

- `cba-popover.component.html` is already minimal (`<ng-content></ng-content>`) — no change.
- `cba-popover.component.scss` is already minimal (`:host { display: inline-block; }`) — no change.

---

## 3. Proposed Changes (exact files)

| # | File | Change |
| --- | --- | --- |
| 1 | `src/components/popover/cba-popover.component.ts` | Switch to `hostDirectives` `inputs`/`outputs`; remove manual `effect()` and `output()` forwarding; simplify constructor; fix JSDoc. |
| 2 | `src/components/popover/cba-popover.component.spec.ts` | Add `getNgbPopover` / `getStandaloneNgbPopover` helpers; replace repeated `injector.get(NgbPopover)` calls. |
| 3 | `src/theme/_popover.scss` | Optional: consolidate arrow rules with CSS custom properties and group reduced-motion selectors. |

No changes needed for:

- `cba-popover.component.html`
- `cba-popover.component.scss`
- `cba-popover.types.ts`
- `index.ts`
- `src/public-api.ts`
- `src/theme/theme.scss`
- `.agent/project-structure.md`

---

## 4. Verification After Simplification

| Step | Command | Expected |
| --- | --- | --- |
| Unit tests (popover) | `npx jest src/components/popover` | All tests pass; output forwarding still covered. |
| Full test suite | `npm test` | No regressions. |
| Lint | `npm run lint` | No new errors. |
| Library build | `npm run build` | Build succeeds; `CbaPopoverComponent` + `CbaPopoverPlacement` exported. |

---

## 5. What Was NOT Done

No source files were modified. This document is a simplification plan only, to be consumed by the implementer in the next Critical Workflow step (4.3-fix).
