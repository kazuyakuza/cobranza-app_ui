# CbaDropdown

Thin, token-styled wrapper around `@ng-bootstrap/ng-bootstrap` dropdown. ng-bootstrap owns
open/close, keyboard navigation, focus management, auto-close, and Popper positioning.
`CbaDropdown` owns the Cobranza gray-theme surface, a stable `cba-dropdown` selector, and
two thin passthrough inputs (`placement`, `disabled`) plus an `openChange` output.

## Table of Contents

- [Selector](#selector)
- [Import](#import)
- [How it works](#how-it-works)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Content projection slots](#content-projection-slots)
- [Basic usage](#basic-usage)
- [Disabled state](#disabled-state)
- [Placement](#placement)
- [Theming notes](#theming-notes)
- [Accessibility](#accessibility)
- [Important notes](#important-notes)
- [Related docs](#related-docs)

## Selector

`<cba-dropdown>` — standalone, exported from `@cobranza-apps/ui`.

## Import

```ts
import { CbaDropdownComponent, CbaDropdownPlacement } from '@cobranza-apps/ui';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
```

## How it works

- `CbaDropdownComponent` is the **wrapper shell**. It hosts `NgbDropdown` as a `hostDirective`
  so projected toggle and menu items can inject `NgbDropdown` for click/keyboard wiring.
- Behaviour (open/close, positioning, keyboard, auto-close) comes from ng-bootstrap + Bootstrap CSS.
- `CbaDropdown` only adds theming (elevated surface, token-styled items, focus ring) and a
  stable projection API.
- Requires Bootstrap 5 CSS (peer dep) and `@ng-bootstrap/ng-bootstrap` ^21 (peer dep).

## Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `placement` | `CbaDropdownPlacement` (`PlacementArray`) | `['bottom-start', 'bottom-end', 'top-start', 'top-end']` | Preferred menu placement, forwarded to `NgbDropdown#placement`. Follows ng-bootstrap positioning semantics (e.g. `'bottom-start'`, `'top-end'`, or an array of fallbacks). |
| `disabled` | `boolean` | `false` | Wrapper-level disabled state. Applies `cba-dropdown--disabled` host modifier (blocks pointer events, dims host) and sets `aria-disabled`. The projected toggle **must** mirror this value on its own `[disabled]` binding. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `openChange` | `EventEmitter<boolean>` | Passthrough for `NgbDropdown#openChange`. Emits `true` on open, `false` on close. |

## Content projection slots

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| Toggle | `[cbaDropdownToggle]` | Yes | Projected toggle element. Must also carry `ngbDropdownToggle` to wire ng-bootstrap click handling. Typically a `<cba-button>`. |
| Menu items | default `<ng-content>` | Yes | Projected dropdown items. Each must carry `ngbDropdownItem` so keyboard navigation works. May include `.dropdown-divider` elements. |

## Basic usage

### Template (HTML)

```html
<cba-dropdown (openChange)="onOpen($event)">
  <cba-button cbaDropdownToggle ngbDropdownToggle variant="secondary">
    Options
  </cba-button>
  <button ngbDropdownItem (click)="onEdit()">Edit</button>
  <button ngbDropdownItem (click)="onDuplicate()">Duplicate</button>
  <div class="dropdown-divider"></div>
  <button ngbDropdownItem [disabled]="true">Delete</button>
</cba-dropdown>
```

### Host component (TypeScript)

```ts
import { Component } from '@angular/core';
import { CbaDropdownComponent } from '@cobranza-apps/ui';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CbaDropdownComponent, NgbDropdownModule],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  onOpen(isOpen: boolean): void {
    console.log('Dropdown open:', isOpen);
  }

  onEdit(): void { /* ... */ }
  onDuplicate(): void { /* ... */ }
}
```

## Disabled state

Set `[disabled]="true"` on `<cba-dropdown>` to apply the wrapper-level disabled state.
The projected toggle must mirror this on its own `[disabled]` binding so the native
button is fully disabled.

```html
<cba-dropdown [disabled]="isDisabled">
  <cba-button cbaDropdownToggle ngbDropdownToggle
              variant="secondary" [disabled]="isDisabled">
    Options
  </cba-button>
  <button ngbDropdownItem (click)="onAction()">Action</button>
</cba-dropdown>
```

When disabled:

- Host receives `cba-dropdown--disabled` class (pointer-events: none, opacity: 0.6).
- Host receives `aria-disabled="true"`.
- ng-bootstrap will not open the menu (toggle click is blocked by pointer-events).

## Placement

Pass a `placement` value to control where the menu appears relative to the toggle.
Follows ng-bootstrap `PlacementArray` semantics.

```html
<cba-dropdown placement="top-start">
  <cba-button cbaDropdownToggle ngbDropdownToggle variant="secondary">
    Top-aligned
  </cba-button>
  <button ngbDropdownItem>Item 1</button>
  <button ngbDropdownItem>Item 2</button>
</cba-dropdown>
```

Placement accepts:

- A single string: `'top'`, `'bottom'`, `'start'`, `'end'`, `'top-start'`, etc.
- An array of fallbacks: `['bottom-start', 'top-start']` (ng-bootstrap tries each in order).

## Theming notes

- Menu surface: `--cba-bg-elevated`, `--cba-border-subtle`, `--cba-radius-md`, `--cba-shadow-elevated`.
- Item text: `--cba-text-primary`; disabled item text: `--cba-text-muted`.
- Item hover: `--cba-hover`; item active: `--cba-active`.
- Item focus: `--cba-focus-ring` (inset box-shadow).
- Divider: `--cba-border-subtle`.
- Disabled host: `opacity: 0.6`, `pointer-events: none` (no token needed for v1).
- Reduced motion: item transitions disabled under `@media (prefers-reduced-motion: reduce)`.

## Accessibility

- `aria-disabled` is set on the host when `disabled` is `true`.
- Keyboard navigation (arrows, Home/End, Esc), focus management, and auto-close come from ng-bootstrap.
- The toggle must be a focusable element (e.g. `<button>` or `<cba-button>`).
- Menu items must be `<button ngbDropdownItem>` or `<a ngbDropdownItem>` for keyboard access.
- `:focus-visible` ring on items uses `--cba-focus-ring`.

## Important notes

- **Behavior comes from ng-bootstrap.** `CbaDropdown` does not reimplement open/close,
  positioning, or keyboard logic. It only adds theming and a stable projection API.
- The toggle must carry **both** `cbaDropdownToggle` (for projection) **and** `ngbDropdownToggle`
  (for ng-bootstrap click wiring).
- Menu items must carry `ngbDropdownItem` for keyboard navigation.
- `CbaDropdown` uses `hostDirectives: [NgbDropdown]` so projected content can inject `NgbDropdown`.
  An inner `<div ngbDropdown>` was rejected because Angular DI does not cross component view
  boundaries for projected content.
- The menu is linked to `NgbDropdown` via a `ViewChild` + `_menu` assignment after view init.
  This is necessary because ng-bootstrap v21 resolves its menu through a `ContentChild` query
  that never crosses component view boundaries.

## Related docs

- [README](../README.md)
- [USAGE](./USAGE.md)
- [THEME](./THEME.md)
- [CBA_BUTTON](./CBA_BUTTON.md)
- [ng-bootstrap dropdown docs](https://ng-bootstrap.github.io/#/components/dropdown)
