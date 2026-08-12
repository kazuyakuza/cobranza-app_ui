# CbaModuleFooter

Optional plain footer bar for a module. Renders a finite-height surface with module status
text aligned to the same `ModuleHeaderStatus` semantics used by `ModuleHeader`, plus an
optional default projection slot for auxiliary content. v1 is intentionally plain: background
only, no heavy borders/shadows, no toolbar.

The footer is never mandatory — modules omit it entirely when not needed.

## Table of Contents

- [Selector](#selector)
- [Import](#import)
- [Inputs](#inputs)
- [Content projection](#content-projection)
- [Status text mapping](#status-text-mapping)
- [Usage examples](#usage-examples)
  - [Footer with status and default text](#footer-with-status-and-default-text)
  - [Footer with statusText override](#footer-with-statustext-override)
  - [Footer with projected content](#footer-with-projected-content)
  - [Footer with no status (plain bar)](#footer-with-no-status-plain-bar)
- [Theming notes](#theming-notes)
- [Accessibility](#accessibility)
- [Relationship with ModuleHeader](#relationship-with-moduleheader)
- [Related docs](#related-docs)

## Selector

`<cba-module-footer>` — standalone, exported from `@cobranza-apps/ui`.

## Import

```ts
import { CbaModuleFooterComponent } from '@cobranza-apps/ui';
```

## Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `status` | `ModuleHeaderStatus` | `null` | Module status aligned with `ModuleHeaderStatus`. `null` renders no status region. |
| `statusText` | `string \| undefined` | `undefined` | Explicit status text override. When provided, wins over the default `CBA_UI_MESSAGES.moduleFooter.status` mapping. |

## Content projection

A single default `<ng-content>` slot renders auxiliary content after the status region.

```html
<cba-module-footer status="dirty">
  <span>Last saved 3 min ago</span>
</cba-module-footer>
```

## Status text mapping

When `statusText` is not provided, the component uses the following default texts per status:

| Status | Default text | Icon | Color token |
| --- | --- | --- | --- |
| `loading` | `Cargando…` | `faSpinner` (spin) | `--cba-accent-info` |
| `loaded` | `Listo` | `faCheck` | `--cba-accent-success` |
| `success` | `Guardado` | `faCircleCheck` | `--cba-accent-success` |
| `warning` | `Requiere atención` | `faTriangleExclamation` | `--cba-accent-warning` |
| `error` | `Error` | `faCircleXmark` | `--cba-accent-danger` |
| `dirty` | `Cambios sin guardar` | `faPen` | `--cba-text-secondary` |
| `null` | _(no status region)_ | _(none)_ | _(none)_ |

Defaults are Spanish-only and centralized in `CBA_UI_MESSAGES` (`src/i18n/ui-messages.ts`). There is no i18n framework or locale switcher; override via the `statusText` input.

## Usage examples

### Footer with status and default text

```html
<cba-module-container [size]="'100%'" [isCollapsed]="false">
  <cba-module-header title="Invoice Editor" [status]="headerStatus"></cba-module-header>
  <div class="module-body"><!-- MFE content --></div>
  <cba-module-footer [status]="'dirty'"></cba-module-footer>
</cba-module-container>
```

Renders the footer bar with the `faPen` icon and the text "Cambios sin guardar".

### Footer with statusText override

```html
<cba-module-footer [status]="'error'" statusText="Connection lost — retrying…"></cba-module-footer>
```

The explicit `statusText` wins over the default "Error" text. The icon and color still come
from the `error` status.

### Footer with projected content

```html
<cba-module-footer [status]="'success'">
  <span class="aux">Last saved 3 min ago</span>
</cba-module-footer>
```

Projected content is rendered after the status region inside the same flex row.

### Footer with no status (plain bar)

```html
<cba-module-footer>
  <span>v1.2.0</span>
</cba-module-footer>
```

When `status` is `null` and `statusText` is `undefined`, no status region is rendered. The
footer acts as a plain bar for projected content only.

## Theming notes

- Background: `var(--cba-bg-secondary)`
- Height: `var(--cba-module-footer-height, 40px)`
- Padding: `0 var(--cba-space-4)`
- Gap between status icon/text and projected content: `var(--cba-space-2)`
- Status colors follow the accent tokens (`--cba-accent-info`, `--cba-accent-success`,
  `--cba-accent-warning`, `--cba-accent-danger`) plus `--cba-text-secondary` for `dirty`.
- No border-top or box-shadow (v1 plain surface).
- `prefers-reduced-motion: reduce` disables the spinner animation.

## Accessibility

- The status region uses `role="status"` with `aria-live="polite"` and `aria-atomic="true"`
  so screen readers announce status changes.
- The status icon is decorative (`aria-hidden="true"`).
- When no status is set, no live region is rendered.

## Relationship with ModuleHeader

`CbaModuleFooter` reuses the same `ModuleHeaderStatus` type from `ModuleHeader`. This means:

- The Shell can bind the same `status` signal to both `<cba-module-header>` and
  `<cba-module-footer>` to keep them in sync.
- Default status texts mirror the semantics of `ModuleHeader` (e.g., `loading` means the
  module is fetching data, `dirty` means there are unsaved changes).
- The footer adds a plain content projection slot that the header does not provide.

## Non-goals

- **Not a toolbar** — the footer is a plain status bar with an optional content slot; it hosts no actions, buttons, or navigation.
- **v1 is intentionally plain** — background only; no heavy borders, shadows, or toolbar-style layout.

## Related docs

- [`CBA_MODULE_HEADER.md`](./CBA_MODULE_HEADER.md) — `ModuleHeader` selector, API, status values.
- [`CBA_MODULE_CONTAINER.md`](./CBA_MODULE_CONTAINER.md) — `ModuleContainer` layout wrapper.
- [Project brief](../.agent/project-info/brief.md) — Source of truth for scope and contracts.
