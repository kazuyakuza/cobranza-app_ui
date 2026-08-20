# Code Simplification Plan — Task Group A

## Scope

Review files touched by Task Group A (module container footer, footer status alignment, 50% width parity, demo card redesign):

1. `src/components/module-container/module-container.component.html`
2. `src/components/module-container/module-container.component.scss`
3. `src/components/module-footer/module-footer.component.scss`
4. `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts`
5. `projects/demo/src/app/components/demo-workspace/demo-workspace.component.scss`
6. `docs/CBA_MODULE_CONTAINER.md`

## Simplification Opportunities

### 1. `module-container.component.scss`

- **Redundant `min-width: 0` on fixed flex bands.**
  - `.cba-module-container__header` and `.cba-module-container__footer` both declare `flex: 0 0 auto`, which already prevents shrinking. `min-width: 0` only matters for flex items that shrink (`flex-shrink > 0`). Remove `min-width: 0` from both.
- **Footer vertical constraint should be `min-height: 0` (not `min-width`).**
  - Because the container is a vertical flex column, the relevant overflow safeguard for the footer band is `min-height: 0`. Replace `min-width: 0` with `min-height: 0` on `__footer`.
- **Use the subtle border token for internal separators.**
  - The footer top border is an internal separator, not a structural frame edge. Change `border-top: 1px solid var(--cba-border-default)` to `var(--cba-border-subtle)` to match the design-token semantics defined in `_variables.scss` and `THEME.md`.

### 2. `module-footer.component.scss`

- **Collapse repeated status modifiers with a SCSS map.**
  - The six status modifier classes (`--loading`, `--loaded`, `--success`, `--warning`, `--error`, `--dirty`) only differ by color. Replace the six explicit rules with a single `@each` loop over a local status map:
    ```scss
    $status-colors: (
      loading: var(--cba-accent-info),
      loaded: var(--cba-accent-success),
      success: var(--cba-accent-success),
      warning: var(--cba-accent-warning),
      error: var(--cba-accent-danger),
      dirty: var(--cba-text-secondary),
    );

    @each $status, $color in $status-colors {
      .cba-module-footer__status--#{$status} {
        color: $color;
      }
    }
    ```
- **Keep standalone `background-color` and `height`.**
  - Do **not** remove these. The footer must remain self-contained when used outside the container footer slot. The container slot adds matching chrome, so duplication is intentional and harmless.
- **Keep `::ng-deep` reduced-motion rule as-is.**
  - The selector is already the minimal Angular-encapsulated form for targeting FontAwesome spin animation. No simpler equivalent exists without changing component boundaries.

### 3. `demo-workspace.component.scss`

- **Remove the now-redundant `.workspace__row--single-50` modifier.**
  - After the Round 2 fix, `.workspace__row--single-50` declares the same `grid-template-columns: repeat(2, 1fr)` as `.workspace__row`. The modifier no longer carries unique styles.
  - Simplification steps:
    1. Delete the `.workspace__row--single-50` rule from the SCSS.
    2. Remove the `workspace__row--single-50` class from the two rows in `demo-workspace.component.html` (Payment schedule and Settings rows).
- **Keep `.demo-actions`.**
  - It is still used by the "Export data" module after the "New customer" module is replaced by `demo-customer-form`. Removing it now would break that row.

### 4. `demo-module-card.component.ts`

- **Template is already minimal.**
  - The `@if (hasFooter)` guard, the slot attribute `cbaModuleContainerFooter`, and the four `noop()` output bindings are clear and explicit.
- **Optionally remove the explicit `[isFullscreen]="false"` input.**
  - `ModuleHeaderComponent.isFullscreen` already defaults to `false`, so the binding is redundant. Removing it shortens the template without changing behavior. If the team prefers explicit inputs for readability, keep it.
- **Keep the `hasFooter` getter.**
  - A computed signal is not simpler here; the getter is deterministic and cheap under `OnPush`.

### 5. `module-container.component.html`

- **No simplification needed.**
  - The two named slots plus default `ng-content` inside a single `@if (!isCollapsed())` block are the minimal correct structure for the footer-slot feature.

### 6. `docs/CBA_MODULE_CONTAINER.md`

- **No structural simplification needed.**
  - The footer-slot documentation added in Round 2 is concise and consistent with the existing table format. The only required update is changing the border-color reference from `--cba-border-default` to `--cba-border-subtle` if the SCSS simplification above is applied.

## Proposed Edits

### `src/components/module-container/module-container.component.scss`

1. In `.cba-module-container__header`, delete `min-width: 0;`.
2. In `.cba-module-container__footer`:
   - Change `min-width: 0;` to `min-height: 0;`.
   - Change `border-top: 1px solid var(--cba-border-default);` to `border-top: 1px solid var(--cba-border-subtle);`.

### `src/components/module-footer/module-footer.component.scss`

1. Replace the six explicit `.cba-module-footer__status--*` rules with the SCSS map loop shown above.

### `projects/demo/src/app/components/demo-workspace/demo-workspace.component.scss`

1. Delete the `.workspace__row--single-50` block.

### `projects/demo/src/app/components/demo-workspace/demo-workspace.component.html`

1. Remove the `workspace__row--single-50` class from the Payment schedule row.
2. Remove the `workspace__row--single-50` class from the Settings row.

### `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts`

1. Optionally remove `[isFullscreen]="false"` from the `cba-module-header` template binding.

### `docs/CBA_MODULE_CONTAINER.md`

1. Update the footer-band styling description to reference `--cba-border-subtle` instead of `--cba-border-default` if the SCSS change is applied.

## What Was NOT Simplified

- **Scrollbar styling in `module-container.component.scss`**: The WebKit + Firefox scrollbar rules are verbose but required for the spec’d hover widening and reduced-motion behavior. No utility or mixin exists for this pattern.
- **Footer standalone `background-color` / `height`**: Kept intentionally so `CbaModuleFooterComponent` works outside the container slot.
- **Font size on `.cba-module-footer__status`**: Kept to guarantee the footer meta text uses `--cba-font-size-body` regardless of parent inheritance.
- **`demo-actions` CSS class**: Still consumed by the "Export data" module.
