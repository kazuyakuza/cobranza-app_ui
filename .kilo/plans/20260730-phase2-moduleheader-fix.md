# Code Review Fix Plan — Phase 2 ModuleHeader

- **TODO**: `.agent/todos/20260730/20260730-todo-0.md`
- **Implementation plan**: `.kilo/plans/20260730-phase2-moduleheader.md`
- **Front-end spec**: `.kilo/plans/20260730-phase2-moduleheader-frontend-spec.md`
- **Branch**: `feat/phase2-module-header`
- **Review date**: 2026-07-30

## Summary

Implementation matches the API, layout, exports, and most of the spec/plan. The following issues were found and should be fixed before marking the task complete.

| # | Issue | Severity | File(s) |
|---|-------|----------|---------|
| 1 | `loaded` status icon uses `faCircleCheck` instead of spec `faCheck` | Medium | `module-header.component.ts` |
| 2 | Fullscreen action icon diverges from the spec (`faExpand`) | Low | `module-header.component.ts` |
| 3 | Fullscreen modifier class is bound to the host but styles target the inner header, so background/border are not removed in fullscreen | High | `module-header.component.ts`, `module-header.component.scss` |
| 4 | Reduced-motion spinner rule may not reach the Font Awesome SVG due to emulated view encapsulation | Low | `module-header.component.scss` |
| 5 | Usage example has a duplicate `size` attribute | Medium | `docs/MODULE_HEADER.md` |
| 6 | README/USAGE import examples use `ModuleHeader` but the library exports `ModuleHeaderComponent` | Medium | `README.md`, `docs/USAGE.md` |
| 7 | Unit tests do not cover `remove` and `fullscreenToggle` outputs | Low-Medium | `module-header.component.spec.ts` |

---

## 1. Status `loaded` icon does not match the front-end spec

**File**: `src/lib/components/module-header/module-header.component.ts`  
**Lines**: 13 (import), 38 (mapping)

The front-end spec §4 and the TODO status semantics require `loaded` to render a plain check (`faCheck`) and `success` to render a stronger check (`faCircleCheck`). The implementation uses `faCircleCheck` for both.

### Suggested correction

Add `faCheck` to the Font Awesome import and use it for `loaded`:

```ts
import {
  faCheck,
  faChevronDown,
  faChevronUp,
  faCircleCheck,
  faCircleXmark,
  faCompress,
  faExpand,
  faPen,
  faSpinner,
  faTriangleExclamation,
  faUpRightAndDownLeftFromCenter,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
```

```ts
const STATUS_VISUALS: Readonly<Record<Exclude<ModuleHeaderStatus, null>, StatusVisual>> = {
  loading: { icon: faSpinner, animation: 'spin', modifierClass: 'cba-module-header__status--loading' },
  loaded: { icon: faCheck, animation: undefined, modifierClass: 'cba-module-header__status--loaded' },
  success: { icon: faCircleCheck, animation: undefined, modifierClass: 'cba-module-header__status--success' },
  warning: { icon: faTriangleExclamation, animation: undefined, modifierClass: 'cba-module-header__status--warning' },
  error: { icon: faCircleXmark, animation: undefined, modifierClass: 'cba-module-header__status--error' },
  dirty: { icon: faPen, animation: undefined, modifierClass: 'cba-module-header__status--dirty' },
};
```

---

## 2. Fullscreen action icon diverges from the spec

**File**: `src/lib/components/module-header/module-header.component.ts`  
**Lines**: 20 (import), 148 (field)

The front-end spec §2.5 specifies the fullscreen button icon as `faExpand`. The implementation uses `faUpRightAndDownLeftFromCenter`. The plan's preferred `faUpRightAndDownLeftFromSquare` is not available in `@fortawesome/free-solid-svg-icons`, but `faExpand` is available and matches the spec.

### Suggested correction

Replace the fullscreen icon with `faExpand`:

```ts
import {
  faCheck,
  faChevronDown,
  faChevronUp,
  faCircleCheck,
  faCircleXmark,
  faCompress,
  faExpand,
  faPen,
  faSpinner,
  faTriangleExclamation,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
```

Remove `faUpRightAndDownLeftFromCenter` from the import list and update the field:

```ts
  /** Icon definition bound to the fullscreen button (template-referenced constant). */
  readonly faFullscreenIcon = faExpand;
```

---

## 3. Fullscreen modifier class is applied to the wrong element

**File**: `src/lib/components/module-header/module-header.component.ts`  
**Line**: 63  
**File**: `src/lib/components/module-header/module-header.component.scss`  
**Lines**: 77–85

The component binds the fullscreen modifier to the host (`<cba-module-header>`):

```ts
host: { '[class.cba-module-header--fullscreen]': 'isFullscreen()' },
```

But the visible header is the inner `<header class="cba-module-header">`. The SCSS rules for `.cba-module-header--fullscreen` therefore style the host, not the inner header. As a result, the inner header still keeps `--cba-bg-secondary` and `--cba-border-subtle` in fullscreen mode, which violates the spec §3.5 and the TODO rule that fullscreen should show only the title.

### Suggested correction

Remove the host binding and apply the modifier class to the inner header in the template.

`module-header.component.ts`:

```ts
  host: {},
```

`module-header.component.html`:

```html
<header class="cba-module-header" [class.cba-module-header--fullscreen]="isFullscreen()">
  ...
</header>
```

The existing SCSS selectors `.cba-module-header--fullscreen` and `.cba-module-header--fullscreen .cba-module-header__section--title` will then match the inner header correctly.

---

## 4. Reduced-motion spinner rule may not reach the Font Awesome SVG

**File**: `src/lib/components/module-header/module-header.component.scss`  
**Lines**: 111–119

The spinner is rendered inside `<fa-icon>`, a child component. With emulated view encapsulation, the component-scoped `.fa-spin` selector may not match the `<svg>` generated inside `<fa-icon>`, so the reduced-motion media query may fail to disable the spin animation.

### Suggested correction

Use `::ng-deep` to pierce the child component encapsulation, scoped to this component:

```scss
@media (prefers-reduced-motion: reduce) {
  .cba-module-header__action {
    transition: none;
  }

  :host ::ng-deep .fa-spin {
    animation: none;
  }
}
```

---

## 5. Duplicate `size` attribute in the usage example

**File**: `docs/MODULE_HEADER.md`  
**Lines**: 12–15

The basic usage example declares `size` twice:

```html
<cba-module-header
  title="Customer Module"
  size="100%"
  [size]="size"
  ...
```

A single property binding is enough.

### Suggested correction

```html
<cba-module-header
  title="Customer Module"
  [size]="size"
  [isCollapsed]="isCollapsed"
  [isFullscreen]="isFullscreen"
  status="loaded"
  (collapseToggle)="onCollapse()"
  (sizeToggle)="onSizeChange($event)"
  (remove)="onRemove()"
  (fullscreenToggle)="onFullscreen()">
</cba-module-header>
```

---

## 6. README/USAGE imports use `ModuleHeader` instead of the exported class name

**Files**: `README.md` (lines 85, 149, 154, 184), `docs/USAGE.md` (lines 149, 154, 228, 252)

The public API exports `ModuleHeaderComponent` (the class name in `module-header.component.ts`). The README and USAGE examples import `ModuleHeader`, which will fail at compile time.

### Suggested correction

Update import and `imports` array examples to use the actual exported class name:

```ts
import { ModuleHeaderComponent } from '@cobranza-apps/ui';
```

```ts
@Component({
  ...,
  imports: [ModuleHeaderComponent, ModuleContainer],
  ...
})
```

Also update the README Component Inventory row for `ModuleHeader` to `ModuleHeaderComponent` if it is meant to represent the real import symbol.

---

## 7. Missing unit tests for `remove` and `fullscreenToggle` outputs

**File**: `src/lib/components/module-header/module-header.component.spec.ts`  
**Lines**: after line 74

The existing tests cover `collapseToggle`, `sizeToggle`, fullscreen rendering, and status rendering. The `remove` and `fullscreenToggle` outputs are not tested, leaving a small gap in the acceptance criterion that all action buttons emit the correct outputs.

### Suggested correction

Add the following tests:

```ts
  it('emits remove when the remove button is clicked', () => {
    const component = setup();
    let emitted = 0;
    component.remove.subscribe(() => (emitted += 1));

    queryButton('Remove module').click();

    expect(emitted).toBe(1);
  });

  it('emits fullscreenToggle when the fullscreen button is clicked', () => {
    const component = setup();
    let emitted = 0;
    component.fullscreenToggle.subscribe(() => (emitted += 1));

    queryButton('Enter fullscreen').click();

    expect(emitted).toBe(1);
  });
```

If the fullscreen action icon is changed to `faExpand` per issue 2, the `aria-label` remains `"Enter fullscreen"`, so the test above still works.

---

## Verification steps after fixes

1. `npm run lint`
2. `npm run build`
3. `npm test` — expect the original 4 tests plus the 2 new tests to pass (6 total).

No source files were modified during this review; only this fix plan was created.
