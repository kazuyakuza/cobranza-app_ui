# CbaModal

Themed modal wrapper around @ng-bootstrap/ng-bootstrap. ng-bootstrap owns open/close,
backdrop, ESC, and focus management; CbaModal owns the token-styled structure, an
optional convenience title, and a themed close button.

## Table of Contents

- [Selector](#selector)
- [Import](#import)
- [How it works](#how-it-works)
- [Inputs](#inputs)
- [Content projection slots](#content-projection-slots)
- [Opening a modal](#opening-a-modal)
- [Projection example](#projection-example)
- [Size options](#size-options)
- [Dismissing](#dismissing)
- [Accessibility](#accessibility)
- [Theming notes](#theming-notes)
- [Related docs](#related-docs)

## Selector

`<cba-modal>` — standalone, exported from `@cobranza-apps/ui`.

## Import

```ts
import { CbaModalComponent, CbaModalService } from '@cobranza-apps/ui';
```

## How it works

- `CbaModalComponent` is the modal **content shell** (header/body/footer + title + close).
- `CbaModalService.open(content, options)` delegates to `NgbModal.open` and returns `NgbModalRef`.
- Behaviour (backdrop, ESC, focus trap, sizing classes) comes from ng-bootstrap + Bootstrap CSS.
- Requires Bootstrap 5 CSS (peer dep) for `.modal-dialog` sizing classes.

## Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string \| undefined` | `undefined` | Optional convenience title. Do not set when projecting `[cbaModalHeader]`. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Host modifier; dialog width driven by `CbaModalService` size option. |
| `centered` | `boolean` | `false` | Host modifier; centering driven by `CbaModalService` centered option. |
| `dismissible` | `boolean` | `true` | Renders the close (×) button; dismisses the modal. |

## Content projection slots

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| Header | `[cbaModalHeader]` | No | Custom header; takes over the header region. |
| Body | default (or `[cbaModalBody]`) | Yes | Modal body content. |
| Footer | `[cbaModalFooter]` | No | Action buttons (typically `cba-button`). |

## Opening a modal

Create a host component that uses `<cba-modal>` and injects `NgbActiveModal`.
Call `CbaModalService.open(HostComponent, options)`.
Read `ref.closed` / `ref.dismissed`; set inputs via host template.

```ts
import { Component, inject } from '@angular/core';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CbaModalComponent, CbaModalService } from '@cobranza-apps/ui';

@Component({
  standalone: true,
  imports: [CbaModalComponent],
  template: `
    <cba-modal title="Confirm deletion">
      <ng-container cbaModalBody>
        This action cannot be undone.
      </ng-container>
      <ng-container cbaModalFooter>
        <button (click)="activeModal.dismiss()">Cancel</button>
        <button (click)="activeModal.close(true)">Delete</button>
      </ng-container>
    </cba-modal>
  `,
})
export class ConfirmationModalComponent {
  readonly activeModal = inject(NgbActiveModal);
}

// In parent component:
// const ref = inject(CbaModalService).open(ConfirmationModalComponent, { size: 'sm' });
// ref.closed.subscribe(result => console.log(result));
```

## Projection example

```html
<cba-modal title="Settings" size="lg" centered>
  <div cbaModalHeader>
    <h3>Custom Header</h3>
  </div>
  <ng-container cbaModalBody>
    <p>Modal body content goes here.</p>
  </ng-container>
  <ng-container cbaModalFooter>
    <cba-button variant="secondary" (cbaClick)="activeModal.dismiss()">Cancel</cba-button>
    <cba-button variant="primary" (cbaClick)="activeModal.close('saved')">Save</cba-button>
  </ng-container>
</cba-modal>
```

## Size options

| size | ng-bootstrap class | effect |
| --- | --- | --- |
| `'lg'` | `modal-lg` | Wider dialog |
| `'sm'` | `modal-sm` | Narrower dialog |
| `'md'` (default) | (none) | Default Bootstrap width |

## Dismissing

- Close (×) button calls `NgbActiveModal.dismiss('close')`.
- Footer buttons call `activeModal.close(result)` / `activeModal.dismiss(reason)`.
- backdrop/ESC are owned by ng-bootstrap; control via `CbaModalService` `dismissible` option.
- `dismissible: false` -> `backdrop: 'static'`, `keyboard: false` (no backdrop-click/ESC dismiss).

## Accessibility

- `role=dialog`, `aria-modal`, focus trap, focus restore come from ng-bootstrap.
- When `title` is set, `CbaModalComponent` auto-wires `aria-labelledby` to the title element via `NgbActiveModal.update`.
- When projecting `[cbaModalHeader]`, pass `ariaLabelledBy` via `CbaModalOptions`.
- Close button uses `aria-label="Close"`.

## Theming notes

- Surface: `--cba-bg-elevated`, `--cba-border-subtle`, `--cba-radius-lg`, `--cba-shadow-elevated`.
- Backdrop: `--cba-bg-overlay` (global `theme/_modal.scss`).
- Title: `--cba-text-primary`; body: `--cba-text-secondary`; focus ring: `--cba-focus-ring`.
- Applies because `CbaModalService` sets `windowClass 'cba-modal-window'` / `backdropClass 'cba-modal-backdrop'`.

## Related docs

- [README](/README.md)
- [USAGE](/docs/USAGE.md)
- [THEME](/docs/THEME.md)
- [CBA_BUTTON](/docs/CBA_BUTTON.md)
- [ng-bootstrap modal docs](https://ng-bootstrap.github.io/#/components/modal)
