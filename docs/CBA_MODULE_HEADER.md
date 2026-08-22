# ModuleHeader

Shell-injected header rendered above each MFE module in the Company Back-office Shell.

## Table of Contents

- [Selector](#selector)
- [Basic usage](#basic-usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Status values](#status-values)
- [Fullscreen behaviour](#fullscreen-behaviour)
- [Icon order](#icon-order)
- [Drag handle slot](#drag-handle-slot)
- [Spinner animation](#spinner-animation)
- [Title typography](#title-typography)
- [Accessibility](#accessibility)
- [Related docs](#related-docs)

## Selector

`<cba-module-header>` — standalone component exported from `@cobranza-apps/ui`.

## Basic usage

### Template (HTML)

```html
<cba-module-header
  title="Customer Module"
  [size]="size"
  [isCollapsed]="isCollapsed"
  [isFullscreen]="isFullscreen"
  [status]="status"
  (collapseToggle)="onCollapse()"
  (sizeToggle)="onSizeChange($event)"
  (remove)="onRemove()"
  (fullscreenToggle)="onFullscreen()">
</cba-module-header>
```

### Host component (TypeScript)

```ts
import { Component } from '@angular/core';
import { ModuleHeaderComponent, ModuleHeaderSize, ModuleHeaderStatus } from '@cobranza-apps/ui';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [ModuleHeaderComponent],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  size: ModuleHeaderSize = '100%';
  isCollapsed = false;
  isFullscreen = false;
  status: ModuleHeaderStatus = 'loaded';

  onCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  onSizeChange(targetSize: ModuleHeaderSize): void {
    this.size = targetSize;
  }

  onRemove(): void {
    // Handle module removal
  }

  onFullscreen(): void {
    this.isFullscreen = !this.isFullscreen;
  }
}
```

## Inputs

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| title | string | — | yes | Module title (provided by Shell / MFE). |
| size | '50%' \| '100%' | '100%' | no | Current width mode. |
| isCollapsed | boolean | false | no | Whether the module body is collapsed. Drives collapse/expand icon. |
| isFullscreen | boolean | false | no | When true, only the title is shown. |
| status | 'loading' \| 'loaded' \| 'success' \| 'warning' \| 'error' \| 'dirty' \| null | null | no | Optional status indicator. |
| showStatus | boolean | true | no | When `false`, the status icon section is hidden. |
| showTitle | boolean | true | no | When `false`, the title section is hidden. |

### Visibility inputs

`showStatus` and `showTitle` are boolean inputs (default `true`) that remove their
respective sections from the DOM when bound to `false`. They are independent of the
status value and of each other.

- `showStatus = false` removes the left `.cba-module-header__section--status` `<div>`.
  The `status` input itself is unaffected; binding `status` while `showStatus` is
  `false` simply has no visible effect.
- `showTitle = false` removes the center `.cba-module-header__section--title` `<div>`.
- `status = null` continues to render an **empty** status `<div>` (no icon) when
  `showStatus` is not bound — this is the pre-existing behaviour and is still respected.
  To remove the section entirely, bind `showStatus = false`.
- `isFullscreen` takes precedence over `showStatus` for the status section: in
  fullscreen the status section is hidden regardless of `showStatus`. `showTitle` is
  **not** gated by `isFullscreen`, so `[isFullscreen]="true"` + `[showTitle]="false"`
  renders no header content.

## Outputs

| Name | Payload | Description |
| --- | --- | --- |
| collapseToggle | void | User clicked collapse / expand. |
| sizeToggle | '50%' \| '100%' | User requested the target size (opposite of current). |
| remove | void | User requested to remove the module. |
| fullscreenToggle | void | User requested fullscreen. |

## Status values

| Value | Visual | Typical use |
| --- | --- | --- |
| `loading` | Spinner (spin animation) | Data loading / ongoing operation. |
| `loaded` | Check icon | Data ready (no explicit save). |
| `success` | Stronger success check icon | Explicit save / submit succeeded. |
| `warning` | Warning triangle icon | Soft validation / incomplete data. |
| `error` | Error icon | Load failure / hard validation. |
| `dirty` | Pencil icon | Unsaved changes present. |
| `null` | Nothing rendered | Normal state. Same as before and still respected when `showStatus` is not bound (the status `<div>` renders empty). |

## Fullscreen behaviour

When `isFullscreen === true`, the component renders **only** the title; status
and action buttons are removed from the DOM. The host element receives the
`cba-module-header--fullscreen` CSS class, which removes the background and
border-bottom so the header blends into the Shell's fullscreen chrome.

`isFullscreen` hides the status section and the actions nav **independently** of
`showStatus` — the status section is removed in fullscreen even when `showStatus`
is explicitly `true`. `showTitle` is **not** affected by fullscreen mode, so
binding `[isFullscreen]="true"` together with `[showTitle]="false"` renders no
header content at all. Do not add cross-guards between `isFullscreen` and
`showTitle`; the two inputs are intentionally orthogonal.

Back navigation and the "Workbench" action are owned by the Shell header/footer,
not by this component.

## Icon order

The built-in action icons are rendered left-to-right in the following fixed order:

| Position | Action | Font Awesome icon | Output |
| --- | --- | --- | --- |
| 0 (optional, projected) | Drag handle (Shell-owned) | Shell-provided | — |
| 0 / 1 | Collapse / expand | `chevron-up` / `chevron-down` | `collapseToggle` |
| 1 / 2 | Size toggle (50% ↔ 100%) | `arrows-left-right-to-line` / `arrows-left-right` | `sizeToggle` |
| 2 / 3 | Fullscreen | `window-maximize` | `fullscreenToggle` |
| 3 / 4 | Remove | `xmark` | `remove` |

> The dual position notation means: when a drag handle is projected it occupies position 0 and the built-ins shift right; otherwise the built-ins start at position 0.

The order is hard-coded in the template and must not be rearranged by consumers.

> **Optional drag handle:** When the Shell projects a `[cbaModuleDragHandle]`
> element (see [Drag handle slot](#drag-handle-slot)), it is rendered before the
> built-in action buttons. The library renders nothing at that position when the
> slot is empty; only the four built-in action buttons are shown.

## Drag handle slot

`ModuleHeader` exposes an **optional** content-projection slot so the Shell can
inject its own drag handle (typically a `cdkDragHandle`-wired element from
`@angular/cdk/drag-drop`). The library does **not** depend on `@angular/cdk`,
does not render a default handle when the slot is empty, and emits no drag
outputs. Drag-and-drop contracts live in `@cobranza-apps/mfe-events` and the
Shell; the header only provides a stable place to paint the handle.

> **Important:** The library does **not** render a built-in drag button under any
> circumstance. The `[cbaModuleDragHandle]` projection slot is the **only**
> source of a drag handle. If consumers need a drag handle, they must project
> one through this slot.

### Slot contract

| Selector | Required | Placement | Notes |
|----------|----------|-----------|-------|
| `[cbaModuleDragHandle]` | No | First child of the actions `<nav>` | Attribute marker on the projected element; no directive is required. |

Rules:

- The projected element is rendered **before** the built-in action buttons.
- The slot is hidden in fullscreen mode (title-only), exactly like the other actions.
- When nothing is projected, no empty gap is left; only the four built-in action buttons are rendered.
- Apply `class="cba-module-header__action cba-module-header__action--drag"` on the
  projected element to inherit the library's 32 × 32 px hit target, hover/active
  states, focus ring, and `grab`/`grabbing` cursor without any `::ng-deep` piercing.

### Shell wiring example

```html
<div cdkDrag>
  <cba-module-container [size]="size">
    <cba-module-header
      [title]="title"
      [status]="status"
      [size]="size"
      [isCollapsed]="isCollapsed"
      [isFullscreen]="false"
      (collapseToggle)="..."
      (sizeToggle)="..."
      (remove)="..."
      (fullscreenToggle)="...">
      <button
        type="button"
        cbaModuleDragHandle
        cdkDragHandle
        class="cba-module-header__action cba-module-header__action--drag"
        aria-label="Arrastrar módulo">
        <!-- Shell-provided icon, e.g. Font Awesome grip -->
      </button>
    </cba-module-header>
  </cba-module-container>
</div>
```

### Ownership

- `cdkDrag` goes on an **ancestor the Shell controls** (typically the wrapper
  `<div>` around `cba-module-container`).
- `cdkDragHandle` goes on the **projected element** so dragging is initiated
  only from the header handle.
- The library owns the visual styling contract (`.cba-module-header__action*`
  classes); the Shell owns the drag behaviour and the accessible name.
- **Anti-pattern:** asking the UI library to implement drag behaviour or to add
  `@angular/cdk` as a dependency. See `docs/CONSUMER_GUIDE.md` §Shell checklist.

## Spinner animation

The `loading` spinner relies on the Font Awesome stylesheet
(`@fortawesome/fontawesome-svg-core/styles.css` or the Font Awesome CSS bundle)
loaded by the consuming Shell. The component only sets the `.fa-spin` class; the
keyframes are provided by Font Awesome.

## Title typography

The module title uses the `.cba-text-heading-md` utility class (font-size:
`--cba-font-size-heading-md`, line-height: `--cba-line-height-heading-md`) with
`font-weight: 600` (semibold). Consumers should not override the title typography
unless absolutely necessary; if a different weight is required, use the
`.cba-text-heading-lg` utility on a custom title element instead of the
`title` input.

## Accessibility

- All action buttons are native `<button type="button">` elements and are keyboard-operable.
- Each button has a dynamic `aria-label` and `title` attribute describing the action (e.g., "Collapse module", "Shrink module to 50%").
- The optional projected drag handle's accessible name is provided by the **Shell**
  (e.g. `aria-label="Arrastrar módulo"`); the library does not supply the
  accessible name for the projected element.
- Status icons use `aria-hidden="true"` — they are decorative; the status meaning is conveyed to assistive technology via the host component's own semantics.
- `:focus-visible` uses the `--cba-focus-ring` token for a visible focus indicator.
- The `prefers-reduced-motion: reduce` media query disables all transitions and the spin animation.

## Related docs

- [README.md](../README.md)
- [USAGE.md](./USAGE.md)
- [THEME.md](./THEME.md)
