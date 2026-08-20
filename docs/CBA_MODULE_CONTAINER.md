# ModuleContainer

Wrapper that hosts a projected module header and the MFE body inside the Company Back-office Shell workspace. Provides consistent chrome (border, radius, shadow), size mode, collapse, fullscreen, and internal scrolling.

## Table of Contents

- [Selector](#selector)
- [Basic usage](#basic-usage)
- [Content projection](#content-projection)
- [Inputs](#inputs)
- [Size behaviour](#size-behaviour)
- [Collapsed behaviour](#collapsed-behaviour)
- [Fullscreen behaviour](#fullscreen-behaviour)
- [Padding options](#padding-options)
- [Scroll behaviour](#scroll-behaviour)
- [Accessibility](#accessibility)
- [Related docs](#related-docs)

## Selector

`<cba-module-container>` — standalone component exported from `@cobranza-apps/ui`.

## Basic usage

### Template (HTML)

```html
<cba-module-container
  [size]="size"
  [isCollapsed]="isCollapsed"
  [isFullscreen]="isFullscreen"
  [padding]="padding">

  <cba-module-header
    cbaModuleContainerHeader
    title="Customer Module"
    [size]="size"
    [isCollapsed]="isCollapsed"
    [isFullscreen]="isFullscreen"
    status="loaded"
    (collapseToggle)="onCollapse()"
    (sizeToggle)="onSizeChange($event)"
    (fullscreenToggle)="onFullscreen()"
    (remove)="onRemove()">
  </cba-module-header>

  <!-- Projected MFE body content -->
  <app-customers-mfe></app-customers-mfe>

  <!-- Optional footer band; removed from the DOM when the module is collapsed. -->
  <cba-module-footer
    cbaModuleContainerFooter
    status="loaded"
    statusText="3 customers · total debt $ 1,730,000">
  </cba-module-footer>
</cba-module-container>
```

### Host component (TypeScript)

```ts
import { Component } from '@angular/core';
import {
  ModuleHeaderComponent,
  ModuleContainerComponent,
  ModuleContainerSize,
  ModuleContainerPadding,
} from '@cobranza-apps/ui';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [ModuleHeaderComponent, ModuleContainerComponent],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  size: ModuleContainerSize = '100%';
  isCollapsed = false;
  isFullscreen = false;
  padding: ModuleContainerPadding = 'sm';

  onCollapse(): void { this.isCollapsed = !this.isCollapsed; }
  onSizeChange(target: ModuleContainerSize): void { this.size = target; }
  onFullscreen(): void { this.isFullscreen = !this.isFullscreen; }
  onRemove(): void { /* Shell handles removal */ }
}
```

## Content projection

| Slot | Selector | Purpose |
| --- | --- | --- |
| Header | `[cbaModuleContainerHeader]` attribute | Projects the module header (typically `<cba-module-header>`). Rendered in a fixed, non-scrollable flex band. |
| Body | default `<ng-content>` | Projects the MFE content. This region is the internal scroll container while expanded. |
| Footer | `[cbaModuleContainerFooter]` attribute | Projects an optional footer band (typically `<cba-module-footer>`). Rendered below the body, inside the same `@if (!isCollapsed())` block, so it is removed together with the body when collapsed. Non-scrollable, never shrinks. |

## Inputs

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| size | `'50%' \| '100%'` | `'100%'` | no | Workspace width mode. Drives the `cba-module-container--size-50` / `cba-module-container--size-100` host modifier. |
| isCollapsed | `boolean` | `false` | no | When `true` the body region is removed from the DOM (no layout box, no scroll). Adds the `cba-module-container--collapsed` host modifier. |
| isFullscreen | `boolean` | `false` | no | When `true` module chrome (border-radius, shadow) is suppressed; the Shell fullscreen view owns the outer chrome. Adds the `cba-module-container--fullscreen` host modifier. |
| padding | `'none' \| 'sm' \| 'md'` | `'sm'` | no | Internal padding of the body region. Drives the `cba-module-container--padding-none` / `cba-module-container--padding-sm` / `cba-module-container--padding-md` host modifiers. |
| scrollChaining | `boolean` | `false` | no | When `true`, wheel events chain to the workspace once the module body reaches its scroll edge (sets `overscroll-behavior: auto` on `.cba-module-container__body`). Default `false` keeps scroll contained inside the module body. Drives the `cba-module-container--scroll-chaining` host modifier. |

The container never mutates these values — the Shell owns the source of truth and re-binds state on every change.

## Size behaviour

| Value | Host modifier | Layout |
| --- | --- | --- |
| `'100%'` (default) | `cba-module-container--size-100` | Container takes the full available width of its parent row/cell. |
| `'50%'` | `cba-module-container--size-50` | Container takes half of the available width (Shell row handles the other half). |

Size is applied via CSS classes on the host element so the Shell layout can rely on a stable contract.

## Collapsed behaviour

When `isCollapsed === true`:

- The body region (`.cba-module-container__body`) is removed from the DOM via Angular `@if` control flow.
- No layout box is rendered and no scroll area exists while collapsed.
- The host receives the `cba-module-container--collapsed` modifier.
- The header band remains rendered and never scrolls.
- The footer region (`.cba-module-container__footer`) is removed from the DOM together with the body via the same `@if` control flow; no footer band is rendered while collapsed.

## Fullscreen behaviour

When `isFullscreen === true`:

- The host receives the `cba-module-container--fullscreen` modifier.
- **Border, border-radius, module shadow, and overflow clipping are suppressed** — these chrome properties are declared under `:host(:not(.cba-module-container--fullscreen))` only.
- **`background-color` (`--cba-bg-secondary`) is retained** so the panel keeps its cream surface in fullscreen mode; only the chrome (border, radius, shadow, `overflow: hidden`) is removed, letting the Shell fullscreen view own the outer shape.
- The container still hosts both the projected header and the body.

## Padding options

Padding applies to the **body region only** (the header band is unaffected).

| Value | Suggested padding | Host modifier |
| --- | --- | --- |
| `none` | `0` | `cba-module-container--padding-none` |
| `sm` (default) | `var(--cba-space-2)` | `cba-module-container--padding-sm` |
| `md` | `var(--cba-space-4)` | `cba-module-container--padding-md` |

All values come from `--cba-*` spacing tokens (see `src/theme/_variables.scss`).

## Scroll behaviour

- Scroll exists **only** while the module is expanded (`isCollapsed === false`).
- The body region (`.cba-module-container__body`) is the scroll container: `overflow-y: auto`, `flex: 1 1 auto`, `min-height: 0`, and `overscroll-behavior: contain` (default).
- By default scroll is contained inside the body — wheel events stop at the module's edge and the Shell workspace scrolls independently. Set `[scrollChaining]="true"` to switch the body to `overscroll-behavior: auto` so wheel events chain to the workspace once the module body reaches its scroll boundary.
- Scrollbar styling is CSS-only and thin by default; the WebKit thumb widens on hover. Optional top/bottom jump buttons are out of scope for this phase.

## Accessibility

- The container itself introduces no interactive controls; interactive elements live in the projected `cba-module-header`.
- `:focus-visible` indicators (via `--cba-focus-ring`) come from the projected header buttons.
- `prefers-reduced-motion: reduce` keeps the hover scrollbar at its default (thin) width.

## Non-goals

- **No drag-and-drop** — moving or reordering modules is owned by the Shell and `@cobranza-apps/mfe-events`.
- **No persistence** — size / collapse / fullscreen / padding state is never stored by the container.
- **Never mutates state** — the container only reflects its inputs; the Shell owns the source of truth and re-binds state on every change.

## Related docs

- [README.md](../README.md)
- [USAGE.md](./USAGE.md)
- [THEME.md](./THEME.md)
- [CBA_MODULE_HEADER.md](./CBA_MODULE_HEADER.md)
- [CBA_MODULE_FOOTER.md](./CBA_MODULE_FOOTER.md) — footer component typically projected into the `[cbaModuleContainerFooter]` slot.
