# Front-end Technical Specification — Task 1: Module Layout Fixes

## Scope

Covers the first three bugs from `.agent/todos/20260819/20260819-todo-1.md`:

1. **modules footer** — footer styling, width, visibility, status alignment
2. **modules at 50% mode all wrong** — module width in 50% mode
3. **modules header btns** — add drag icon at 1st position

The following TODO items are **out of scope** for this specification: header search input, color tokens, Buttons and Pills sections, predefined icons, Texts/fonts/labels, footer bar btns, button/pill sizes.

## Root causes

1. **Footer**: In `demo-module-card.component.ts`, `<cba-module-footer>` is rendered **outside** `<cba-module-container>`. Therefore it misses the container's `border-radius`, `box-shadow`, and `overflow: hidden`, looks like a detached bar below the module, and in 50% mode it is sized by the card wrapper instead of the module width. Additionally, `CbaModuleFooterComponent` renders the status icon before the text and left-aligns the status region.
2. **50% width**: `demo-workspace.component.scss` uses a flex row, but `demo-module-card` adds an intermediate wrapper between the row and `cba-module-container`. The library container's host rule `:host(.cba-module-container--size-50) { width: 50%; }` resolves to 50% of the card wrapper, not 50% of the workspace row. The existing `flex-basis` rule on `.demo-module-card--size-50` is applied to the inner `div` (not a flex item) and is therefore ignored.
3. **Header drag icon**: `ModuleHeaderComponent` only exposes an optional projected drag-handle slot. The demo does not project a handle, so no drag icon appears. A built-in no-op drag icon is required at position 1 of the built-in action list.

## Fix ownership

| Bug | Demo app | Library |
|-----|----------|---------|
| Footer placement | `demo-module-card.component.ts` | — |
| Footer alignment / order | — | `module-footer.component.html`, `module-footer.component.scss` |
| 50% width | `demo-workspace.component.scss`, `demo-module-card.component.scss` | — |
| Drag icon | — | `module-header.component.ts`, `module-header.component.html` |
| Docs update | — | `CBA_MODULE_HEADER.md` |

No changes are required to `app.component.html`, `app.component.scss`, `module-container.component.*`, `module-header.component.scss`, or `CBA_MODULE_FOOTER.md` / `CBA_MODULE_CONTAINER.md` for these three bugs.

## Bug 1: modules footer

### Changes

#### File: `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts`

Move the footer inside `<cba-module-container>` so it participates in the container chrome and is removed from the DOM when the module is collapsed.

Template after change:

```html
<div class="demo-module-card" [class.demo-module-card--size-50]="size === '50%'">
  <cba-module-container [size]="size" [padding]="padding" [isCollapsed]="isCollapsed">
    <cba-module-header
      cbaModuleContainerHeader
      [title]="title"
      [size]="size"
      [isCollapsed]="isCollapsed"
      [isFullscreen]="false"
      [status]="status"
      (collapseToggle)="noop()"
      (sizeToggle)="noop()"
      (fullscreenToggle)="noop()"
      (remove)="noop()"
    />
    <ng-content />
    @if (hasFooter) {
      <cba-module-footer [status]="footerStatus" [statusText]="footerText" />
    }
  </cba-module-container>
</div>
```

#### File: `src/components/module-footer/module-footer.component.html`

Reverse the children inside `.cba-module-footer__status` so the text renders before the icon.

Replace:

```html
@if (statusVisual(); as visual) {
  <fa-icon [icon]="visual.icon" [animation]="visual.animation" aria-hidden="true" />
}
@if (displayText()) {
  <span class="cba-module-footer__text">{{ displayText() }}</span>
}
```

with:

```html
@if (displayText()) {
  <span class="cba-module-footer__text">{{ displayText() }}</span>
}
@if (statusVisual(); as visual) {
  <fa-icon [icon]="visual.icon" [animation]="visual.animation" aria-hidden="true" />
}
```

#### File: `src/components/module-footer/module-footer.component.scss`

Right-align the status region by adding `justify-content: flex-end` to `.cba-module-footer`:

```scss
.cba-module-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: var(--cba-module-footer-height, 40px);
  padding: 0 var(--cba-space-4);
  gap: var(--cba-space-2);
  background-color: var(--cba-bg-tertiary);
  overflow: hidden;
  box-sizing: border-box;
}
```

### Visual result

- Footer sits at the bottom of the module body, inside the same rounded border and shadow chrome as the header.
- When the module is collapsed, the body (and therefore the footer) is removed from the DOM.
- In 50% mode the footer is constrained to the module container width.
- Status text appears first, status icon second, both aligned to the right edge of the footer bar.

## Bug 2: modules header btns

### Changes

#### File: `src/components/module-header/module-header.component.ts`

Import `faUpDownLeftRight` and expose it as a template field.

Add to the Font Awesome import list:

```typescript
import { faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';
```

Add the class field after `faXmark`:

```typescript
/** Drag-handle icon shown as the first built-in action (no-op in this library). Template-referenced. */
protected readonly faDrag = faUpDownLeftRight;
```

#### File: `src/components/module-header/module-header.component.html`

Add a no-op drag button as the first built-in action, immediately after the projected drag-handle slot and before the collapse button.

```html
<nav class="cba-module-header__section cba-module-header__section--actions">
  <ng-content select="[cbaModuleDragHandle]"></ng-content>
  <button
    type="button"
    class="cba-module-header__action cba-module-header__action--drag"
    aria-label="Arrastrar módulo"
    title="Arrastrar módulo">
    <fa-icon [icon]="faDrag" aria-hidden="true" />
  </button>
  <!-- existing collapse, size toggle, fullscreen, remove buttons -->
</nav>
```

No `(click)` handler is attached; the button performs no action.

#### File: `docs/CBA_MODULE_HEADER.md`

Update the "Icon order" table. Keep the optional projected drag-handle slot at position 0; add the new built-in no-op drag at position 1; shift the previous built-in positions by one.

```markdown
| Position | Action | Font Awesome icon | Output |
| --- | --- | --- | --- |
| 0 | Drag handle (projected, Shell-owned) | Shell-provided | — |
| 1 | Drag (no-op) | `faUpDownLeftRight` | — |
| 2 | Collapse / expand | `chevron-up` / `chevron-down` | `collapseToggle` |
| 3 | Size toggle (50% ↔ 100%) | `arrows-left-right-to-line` / `arrows-left-right` | `sizeToggle` |
| 4 | Fullscreen | `window-maximize` | `fullscreenToggle` |
| 5 | Remove | `xmark` | `remove` |
```

### Visual result

- A four-arrow drag icon appears as the leftmost built-in icon in every module header.
- It uses the same 32 × 32 px hit target, hover/active states, focus ring, and grab cursor as the other action buttons.
- It performs no action when clicked.
- Existing collapse, size toggle, fullscreen, and remove icons shift one position to the right.

## Bug 3: modules at 50% mode all wrong

### Changes

#### File: `projects/demo/src/app/components/demo-workspace/demo-workspace.component.scss`

Replace the flex row layout with a two-column grid so each module card fills one cell. For single-50 rows, use a `50% / 1fr` split so the module occupies exactly half the workspace.

```scss
.workspace {
  padding: var(--cba-space-3);
  display: flex;
  flex-direction: column;
  gap: var(--cba-space-3);
}
.workspace__row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--cba-space-3);
}
.workspace__row--single-50 {
  grid-template-columns: 50% 1fr;
}
.demo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--cba-space-2);
}
```

Remove the old ineffective rule:

```scss
.workspace__row--single-50 .demo-module-card--size-50 {
  flex: 0 0 50%;
}
```

#### File: `projects/demo/src/app/components/demo-module-card/demo-module-card.component.scss`

Keep the host as a block-level grid item and override the library container's 50% host width so the container fills the entire card cell.

```scss
:host {
  display: block;
}
.demo-module-card {
  width: 100%;
}
.demo-module-card--size-50 > cba-module-container.cba-module-container--size-50 {
  width: 100%;
}
```

Remove the previous ineffective rule:

```scss
.demo-module-card--size-50 {
  flex: 0 0 calc(50% - var(--cba-space-3) / 2);
}
```

### Visual result

- Two 50% modules in the same row sit side by side, each occupying half the workspace content width minus half the gutter (`var(--cba-space-3)`).
- A single 50% module occupies exactly the left half of the workspace; the right half remains empty.
- The module container (with its header, body, and footer) fills the entire card cell; there is no internal empty space.
- 100% modules continue to span the full workspace width.

## Acceptance criteria

- [ ] Footer is visually inside the module rounded container in both 100% and 50% expanded modes.
- [ ] Footer is hidden when the module is collapsed.
- [ ] Footer status text renders before the status icon and is right-aligned within the footer.
- [ ] Drag icon is the first built-in action in the module header and is visually consistent with the other icons.
- [ ] 50% modules render at the correct width in both paired and single rows.
- [ ] `npm run build:lib` and `npm run build:demo` complete without errors.
- [ ] `npm run lint` passes.
