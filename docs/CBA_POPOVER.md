# CbaPopover

Thin, token-styled wrapper around `@ng-bootstrap/ng-bootstrap` popover. ng-bootstrap owns
open/close, trigger listening, Popper positioning, animation, auto-close, and the rendered
`.popover` window appended to `<body>`. `CbaPopover` owns the Cobranza gray-theme surface
(via the `cba-popover-window` `popoverClass`), a stable `cba-popover` element selector,
trigger projection, and a small passthrough API.

## Table of Contents

- [Selector](#selector)
- [Import](#import)
- [How it works](#how-it-works)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Content projection slots](#content-projection-slots)
- [Basic usage](#basic-usage)
- [Hover trigger (Shell-footer pattern)](#hover-trigger-shell-footer-pattern)
- [TemplateRef body with title](#templateref-body-with-title)
- [Disabled state](#disabled-state)
- [Theming notes](#theming-notes)
- [Accessibility](#accessibility)
- [Important notes](#important-notes)
- [Related docs](#related-docs)

## Selector

`<cba-popover>` — standalone, exported from `@cobranza-apps/ui`.

## Import

```ts
import { CbaPopoverComponent, CbaPopoverPlacement } from '@cobranza-apps/ui';
```

## How it works

- `CbaPopoverComponent` is the **wrapper shell**. It hosts `NgbPopover` as a `hostDirective`
  so the directive lives on the `<cba-popover>` host element. Trigger events on the projected
  element bubble to the host and open/close the popover.
- Behaviour (open/close, positioning, keyboard, animation, auto-close) comes from ng-bootstrap.
- `CbaPopover` only adds theming (elevated surface, token-styled header/body, arrow matching)
  and a stable projection API.
- Inputs and outputs are wired to the host `NgbPopover` manually (reactive `effect()`
  forwarding and output subscriptions), because Angular's `hostDirectives` input/output
  mapping does not reliably propagate default values and later input changes.
- `popoverClass` (`'cba-popover-window'`) and `container` (`'body'`) are set by the wrapper
  in the constructor — they are **not** part of the public input API.
- Requires Bootstrap 5 CSS (peer dep) and `@ng-bootstrap/ng-bootstrap` ^21 (peer dep).

## Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `body` | `string \| TemplateRef<unknown> \| null \| undefined` | `undefined` | Popover body content. Plain text or an `ng-template` for rich HTML. If both `body` and `title` are falsy, the popover does not open. Forwarded to `NgbPopover#ngbPopover`. |
| `title` | `string \| TemplateRef<unknown> \| null \| undefined` | `undefined` | Optional popover title. Forwarded to `NgbPopover#popoverTitle`. |
| `placement` | `CbaPopoverPlacement` (`PlacementArray`) | `'auto'` | Preferred placement, forwarded to `NgbPopover#placement`. Accepts a single string (`'top'`, `'bottom'`, `'left'`, `'right'`, `'auto'`) or an array of fallbacks. |
| `triggers` | `string` | `'hover focus'` | Space-separated trigger events. `'hover focus'` opens on mouse hover and keyboard focus. Use `'click'` for click-only, or `'mouseenter:mouseleave focus:blur'` for precise hover-in/out control. |
| `disabled` | `boolean` | `false` | When `true`, the popover does not open. Forwarded to `NgbPopover#disablePopover`. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `shown` | `EventEmitter<void>` | Emitted after the popover opening animation finishes. |
| `hidden` | `EventEmitter<void>` | Emitted after the popover closing animation finishes and the window is removed from the DOM. |

## Content projection slots

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| Trigger | default `<ng-content>` | Yes | Any focusable element (button, link, icon button) that triggers the popover. Events bubble to the `<cba-popover>` host where `NgbPopover` listens. |

No dedicated body projection slot in v1. Body is passed through the `body` input, which accepts a `TemplateRef` for rich content.

## Basic usage

### String body popover

```html
<cba-popover body="This action opens the selected module." title="Hint">
  <cba-button variant="ghost" size="sm">?</cba-button>
</cba-popover>
```

### Host component (TypeScript)

```ts
import { Component } from '@angular/core';
import { CbaPopoverComponent, CbaButtonComponent } from '@cobranza-apps/ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CbaPopoverComponent, CbaButtonComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}
```

## Hover trigger (Shell-footer pattern)

Use `triggers="mouseenter:mouseleave focus:blur"` for hover-driven popover sub-sections
(e.g. Shell footer items that reveal module lists on hover):

```html
<cba-popover
  title="Module sections"
  placement="top"
  triggers="mouseenter:mouseleave focus:blur"
  [body]="footerSectionsTemplate">
  <button class="shell-footer__item">Modules</button>
</cba-popover>

<ng-template #footerSectionsTemplate>
  <ul class="shell-footer__popover-list">
    <li><a href="/modules/a">Section A</a></li>
    <li><a href="/modules/b">Section B</a></li>
  </ul>
</ng-template>
```

## TemplateRef body with title

```html
<cba-popover
  title="Account options"
  placement="bottom"
  triggers="click"
  [body]="accountMenuTemplate">
  <cba-button variant="secondary">Account</cba-button>
</cba-popover>

<ng-template #accountMenuTemplate>
  <div class="account-popover">
    <p><strong>User:</strong> admin</p>
    <p><strong>Role:</strong> Operator</p>
  </div>
</ng-template>
```

## Disabled state

Set `[disabled]="true"` to prevent the popover from opening:

```html
<cba-popover body="Unavailable right now." [disabled]="isLocked">
  <cba-button variant="ghost" [disabled]="isLocked">Info</cba-button>
</cba-popover>
```

When disabled:
- `NgbPopover#disablePopover` is set to `true`.
- The popover does not open regardless of trigger events.

## Theming notes

- Window surface: `--cba-bg-elevated`, `--cba-border-subtle`, `--cba-radius-md`, `--cba-shadow-elevated`.
- Title text: `--cba-text-primary`, font-weight 600.
- Body text: `--cba-text-secondary`.
- Arrow: border matches `--cba-border-subtle`, fill matches `--cba-bg-elevated`.
- Header padding: `--cba-space-3` vertical, `--cba-space-4` horizontal.
- Body padding: `--cba-space-4`.
- Reduced motion: transitions disabled under `@media (prefers-reduced-motion: reduce)`.
- Theming is global (scoped to `.cba-popover-window`) because the popover window is appended to `<body>` by ng-bootstrap and uses `ViewEncapsulation.None`.

## Accessibility

- The trigger element projected inside `<cba-popover>` must be focusable (`<button>`, `<a>`, or element with `tabindex="0"`).
- With default `'hover focus'` triggers, keyboard focus opens the popover, satisfying keyboard operability.
- `NgbPopover` manages `role="tooltip"`, `aria-describedby`, and focus behavior inside the popover window.
- When `[disabled]="true"`, the popover does not open.
- The wrapper does not add extra ARIA attributes in v1; it relies on ng-bootstrap.
- Ensure body content uses semantic markup (e.g. `<ul>` for lists of links) so screen-reader users can navigate projected content.

## Important notes

- **Behavior comes from ng-bootstrap.** `CbaPopover` does not reimplement open/close,
  positioning, or trigger logic. It only adds theming and a stable API.
- `NgbPopover` is wired as a `hostDirective` on the `<cba-popover>` host. No `ViewChild`/`_menu`
  linking is needed (unlike `CbaDropdown`), because `NgbPopover` has no projected-content
  content queries — the popover body comes from the `ngbPopover` input.
- Inputs and outputs are wired manually via reactive `effect()` forwarding and output
  subscriptions, because Angular's `hostDirectives` input/output mapping does not reliably
  propagate default values and later input changes.
- `popoverClass` (`'cba-popover-window'`) and `container` (`'body'`) are set by the wrapper
  in the constructor. The window is appended to `<body>` to avoid clipping by `overflow: hidden`
  ancestors (common inside `CbaModuleContainer` / Shell footer).
- The trigger element is projected inside the host; events bubble to the host where
  `NgbPopover` listens for the configured triggers.

## Related docs

- [README](/README.md)
- [USAGE](/docs/USAGE.md)
- [THEME](/docs/THEME.md)
- [CBA_BUTTON](/docs/CBA_BUTTON.md)
- [CBA_DROPDOWN](/docs/CBA_DROPDOWN.md)
- [ng-bootstrap popover docs](https://ng-bootstrap.github.io/#/components/popover)
