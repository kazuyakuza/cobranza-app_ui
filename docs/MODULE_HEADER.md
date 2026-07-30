# ModuleHeader

Shell-injected header rendered above each MFE module in the Company Back-office Shell.

## Table of Contents

- [Selector](#selector)
- [Basic usage](#basic-usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Status values](#status-values)
- [Fullscreen behaviour](#fullscreen-behaviour)
- [Drag note](#drag-note)
- [Spinner animation](#spinner-animation)
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
| `null` | Nothing rendered | Normal state. |

## Fullscreen behaviour

When `isFullscreen === true`, the component renders **only** the title; status
and action buttons are removed from the DOM. The host element receives the
`cba-module-header--fullscreen` CSS class, which removes the background and
border-bottom so the header blends into the Shell's fullscreen chrome.

Back navigation and the "Workbench" action are owned by the Shell header/footer,
not by this component.

## Drag note

Drag-and-drop and a `dragStart` output are intentionally NOT implemented here.
Drag contracts live in `@cobranza-apps/mfe-events` and the Shell.

## Spinner animation

The `loading` spinner relies on the Font Awesome stylesheet
(`@fortawesome/fontawesome-svg-core/styles.css` or the Font Awesome CSS bundle)
loaded by the consuming Shell. The component only sets the `.fa-spin` class; the
keyframes are provided by Font Awesome.

## Accessibility

- All action buttons are native `<button type="button">` elements and are keyboard-operable.
- Each button has a dynamic `aria-label` and `title` attribute describing the action (e.g., "Collapse module", "Shrink module to 50%").
- Status icons use `aria-hidden="true"` — they are decorative; the status meaning is conveyed to assistive technology via the host component's own semantics.
- `:focus-visible` uses the `--cba-focus-ring` token for a visible focus indicator.
- The `prefers-reduced-motion: reduce` media query disables all transitions and the spin animation.

## Related docs

- [README.md](../README.md)
- [USAGE.md](./USAGE.md)
- [THEME.md](./THEME.md)
