# CbaAccordion

Thin, token-styled wrapper around `@ng-bootstrap/ng-bootstrap` accordion. ng-bootstrap owns
expand/collapse, keyboard navigation, focus management, `aria-*` wiring, animation, and the
`closeOthers`/`destroyOnHide` semantics. `CbaAccordion` owns the Cobranza gray-theme surface,
a stable `cba-accordion` selector, and thin passthroughs for three inputs and four outputs.

## Table of Contents

- [Selector](#selector)
- [Import](#import)
- [How it works](#how-it-works)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Basic usage](#basic-usage)
- [Theming notes](#theming-notes)
- [Accessibility](#accessibility)
- [Important non-goals](#important-non-goals)
- [Related docs](#related-docs)

## Selector

`<cba-accordion>` — standalone, exported from `@cobranza-apps/ui`.

## Import

```ts
import { CbaAccordionComponent } from '@cobranza-apps/ui';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
```

## How it works

- `CbaAccordionComponent` is the **wrapper shell**. It hosts `NgbAccordionDirective` as a
  `hostDirective` so projected ng-bootstrap item markup can inject the directive and be
  discovered by its `ContentChildren` query.
- Behaviour (expand/collapse, keyboard, focus, `aria-*`, animation, id generation) comes from
  ng-bootstrap + Bootstrap CSS.
- `CbaAccordion` only adds theming (token-styled surface, focus ring, disabled state) and a
  stable projection API.
- Consumers author the full ng-bootstrap item markup (`ngbAccordionItem`, `ngbAccordionHeader`,
  `ngbAccordionButton`, `ngbAccordionCollapse`, `ngbAccordionBody`) directly as projected content.
- Requires Bootstrap 5 CSS (peer dep) and `@ng-bootstrap/ng-bootstrap` ^21 (peer dep).

## Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `closeOthers` | `boolean` | `false` | When `true`, only one item can be expanded at a time; expanding another item collapses the open one. Thin passthrough to `NgbAccordionDirective.closeOthers`. |
| `destroyOnHide` | `boolean` | `true` | When `true`, an item's body content is removed from the DOM when collapsed. Thin passthrough to `NgbAccordionDirective.destroyOnHide`. |
| `animation` | `boolean` | `true` | When `true`, expand/collapse transitions are animated. Thin passthrough to `NgbAccordionDirective.animation`. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `show` | `EventEmitter<string>` | Emitted before an item expanding animation starts. Payload is the item id. |
| `shown` | `EventEmitter<string>` | Emitted when an item expanding animation finishes. Payload is the item id. |
| `hide` | `EventEmitter<string>` | Emitted before an item collapsing animation starts. Payload is the item id. |
| `hidden` | `EventEmitter<string>` | Emitted when an item collapsing animation finishes. Payload is the item id. |

## Basic usage

### Template (HTML)

```html
<cba-accordion [closeOthers]="true" (shown)="onShown($event)">
  <div ngbAccordionItem>
    <div ngbAccordionHeader>
      <button ngbAccordionButton>Detalles del cliente</button>
    </div>
    <div ngbAccordionCollapse>
      <div ngbAccordionBody>
        <ng-template><p>Contenido del primer panel.</p></ng-template>
      </div>
    </div>
  </div>

  <div ngbAccordionItem [disabled]="true">
    <div ngbAccordionHeader>
      <button ngbAccordionButton>Histórico de pagos</button>
    </div>
    <div ngbAccordionCollapse>
      <div ngbAccordionBody>
        <ng-template><p>Contenido deshabilitado.</p></ng-template>
      </div>
    </div>
  </div>

  <div ngbAccordionItem>
    <div ngbAccordionHeader>
      <button ngbAccordionButton>Documentación</button>
    </div>
    <div ngbAccordionCollapse>
      <div ngbAccordionBody>
        <ng-template><p>Contenido del tercer panel.</p></ng-template>
      </div>
    </div>
  </div>
</cba-accordion>
```

### Host component (TypeScript)

```ts
import { Component } from '@angular/core';
import { CbaAccordionComponent } from '@cobranza-apps/ui';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CbaAccordionComponent, NgbAccordionModule],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  onShown(itemId: string): void {
    console.log('Item expanded:', itemId);
  }
}
```

## Theming notes

- Container surface: `--cba-bg-secondary`, `--cba-border-subtle`, `--cba-radius-md`.
- Item separator: `--cba-border-subtle` (last item has no bottom border).
- Button background: `--cba-bg-tertiary`; expanded: `--cba-active`.
- Button text: `--cba-text-primary`; disabled text: `--cba-text-muted`.
- Button hover: `--cba-hover`.
- Button focus: `--cba-focus-ring` (inset box-shadow).
- Disabled button: `opacity: 0.65`, `cursor: not-allowed`.
- Body: `--cba-bg-secondary`, `--cba-text-primary`, `--cba-space-4` padding.
- Reduced motion: transitions disabled under `@media (prefers-reduced-motion: reduce)`.

## Accessibility

- `aria-expanded`, `aria-controls`, `id` generation, and `aria-labelledby` come from ng-bootstrap.
- The wrapper does not override any `aria-*` attributes.
- The toggle button is a native `<button>`, so it is keyboard focusable and operable with Enter/Space.
- The `disabled` attribute on `ngbAccordionItem` disables the native button automatically.
- No additional `role` is needed on the host container.

## Important non-goals

- **No custom item component.** There is no `CbaAccordionItemComponent`. Consumers author the
  ng-bootstrap item markup directly inside `<cba-accordion>` because ng-bootstrap's static
  `@ContentChild` queries cannot cross component view boundaries.
- **No drag-and-drop.** Reordering accordion items is not supported.
- **Behaviour owned by ng-bootstrap.** `CbaAccordion` does not reimplement expand/collapse,
  keyboard navigation, focus management, or `aria-*` wiring. It only adds theming, a stable
  selector, and thin passthroughs for three inputs and four outputs.
- **No custom chevron.** The chevron indicator uses Bootstrap's default SVG via
  `.accordion-button::after`.

## Related docs

- [README](/README.md)
- [USAGE](/docs/USAGE.md)
- [THEME](/docs/THEME.md)
- [CBA_DROPDOWN](/docs/CBA_DROPDOWN.md)
- [CBA_MODAL](/docs/CBA_MODAL.md)
- [ng-bootstrap accordion docs](https://ng-bootstrap.github.io/#/components/accordion)
