# CbaCard

Surface container with optional header, body, and footer content-projection slots.

## Table of Contents

- [Selector](#selector)
- [Import](#import)
- [Content projection slots](#content-projection-slots)
- [Basic usage](#basic-usage)
- [Layout examples](#layout-examples)
- [Styling notes](#styling-notes)
- [Accessibility](#accessibility)
- [Related docs](#related-docs)

## Selector

`<cba-card>` — standalone component exported from `@cobranza-apps/ui`.

## Import

```ts
import { CbaCardComponent } from '@cobranza-apps/ui';
```

## Content projection slots

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| Header | `[cbaCardHeader]` attribute | No | Optional header region. Hidden when empty via `:empty` CSS. |
| Body | default `<ng-content>` | Yes | Card body — always rendered. |
| Footer | `[cbaCardFooter]` attribute | No | Optional footer region. Hidden when empty via `:empty` CSS. |

## Basic usage

### Body only

```html
<cba-card>
  <p>Card body content goes here.</p>
</cba-card>
```

### Header + body

```html
<cba-card>
  <div cbaCardHeader>
    <h3>Card Title</h3>
  </div>
  <p>Card body content.</p>
</cba-card>
```

### Header + body + footer

```html
<cba-card>
  <div cbaCardHeader>
    <h3>Customer Details</h3>
  </div>
  <p>Body content with customer information.</p>
  <div cbaCardFooter>
    <cba-button variant="primary" (cbaClick)="onSave()">Save</cba-button>
    <cba-button variant="ghost" (cbaClick)="onCancel()">Cancel</cba-button>
  </div>
</cba-card>
```

## Layout examples

### Card with badge and action

```html
<cba-card>
  <div cbaCardHeader>
    <cba-badge variant="success">Active</cba-badge>
    <span>Account #1234</span>
  </div>
  <p>Customer details and summary.</p>
  <div cbaCardFooter>
    <cba-button size="sm" (cbaClick)="onView()">View</cba-button>
  </div>
</cba-card>
```

### Nested cards

```html
<cba-card>
  <div cbaCardHeader>Outer card</div>
  <cba-card>
    <p>Inner card body.</p>
  </cba-card>
</cba-card>
```

## Styling notes

- Surface uses `--cba-bg-elevated` background with a subtle border (`--cba-border-subtle`).
- Border radius via `--cba-radius-md`.
- Padding uses `--cba-space-*` tokens for balanced spacing.
- **No forced hover elevation** — cards do not change appearance on hover.

## Accessibility

- The component renders an `<article>` element for semantic grouping.
- No interactive controls are introduced by the card itself — all interactive elements live in projected content.
- Header and footer regions are hidden from the accessibility tree when empty.

## Related docs

- [README.md](../README.md)
- [USAGE.md](./USAGE.md)
- [THEME.md](./THEME.md)
