# ModuleHeader

Shell-injected header rendered above each MFE module in the Company Back-office Shell.

## Selector

`<cba-module-header>` — standalone component exported from `@cobranza-apps/ui`.

## Basic usage

```html
<cba-module-header
  title="Customer Module"
  size="100%"
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
and action buttons are removed from the DOM. Back navigation and the
"Workbench" action are owned by the Shell header/footer, not by this component.

## Drag note

Drag-and-drop and a `dragStart` output are intentionally NOT implemented here.
Drag contracts live in `@cobranza-apps/mfe-events` and the Shell.

## Spinner animation

The `loading` spinner relies on the Font Awesome stylesheet
(`@fortawesome/fontawesome-svg-core/styles.css` or the Font Awesome CSS bundle)
loaded by the consuming Shell. The component only sets the `.fa-spin` class; the
keyframes are provided by Font Awesome.

## Related docs

- [README.md](../README.md)
- [USAGE.md](./USAGE.md)
- [THEME.md](./THEME.md)
