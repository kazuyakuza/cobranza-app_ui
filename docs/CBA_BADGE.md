# CbaBadge

Compact status indicator that renders a pill-shaped label with semantic colour.

## Table of Contents

- [Selector](#selector)
- [Import](#import)
- [Basic usage](#basic-usage)
- [Inputs](#inputs)
- [Variant colours](#variant-colours)
- [Solid vs outline](#solid-vs-outline)
- [Usage examples](#usage-examples)
- [Accessibility](#accessibility)
- [Related docs](#related-docs)

## Selector

`<cba-badge>` — standalone component exported from `@cobranza-apps/ui`.

## Import

```ts
import { CbaBadgeComponent } from '@cobranza-apps/ui';
```

## Basic usage

```html
<cba-badge variant="success">Active</cba-badge>
```

## Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'neutral'` | `'neutral'` | Semantic colour of the badge. |
| `appearance` | `'solid' \| 'outline'` | `'solid'` | Fill style — solid background or transparent with border. |

## Variant colours

| Variant | Semantic meaning | Typical use |
| --- | --- | --- |
| `primary` | Primary accent | Default / highlighted state. |
| `success` | Positive outcome | Active, completed, approved. |
| `warning` | Caution | Pending, review needed. |
| `danger` | Error / critical | Failed, rejected, overdue. |
| `info` | Informational | New, updated, in-progress. |
| `neutral` | Muted / default | Draft, archived, unknown. |

All colours map to `--cba-accent-*` tokens.

## Solid vs outline

| Appearance | Visual | Use case |
| --- | --- | --- |
| `solid` (default) | Filled background with contrasting text | Prominent status indicators. |
| `outline` | Transparent background with coloured border and text | Subtle / secondary indicators. |

## Usage examples

### Status badges in a table row

```html
<td>
  @if (customer.status === 'active') {
    <cba-badge variant="success">Active</cba-badge>
  } @else if (customer.status === 'pending') {
    <cba-badge variant="warning" appearance="outline">Pending</cba-badge>
  } @else {
    <cba-badge variant="neutral">Draft</cba-badge>
  }
</td>
```

### Badge with card header

```html
<cba-card>
  <div cbaCardHeader>
    <h3>Invoice #4567</h3>
    <cba-badge variant="danger">Overdue</cba-badge>
  </div>
  <p>Invoice details here.</p>
</cba-card>
```

### All variants

```html
<cba-badge variant="primary">Primary</cba-badge>
<cba-badge variant="success">Success</cba-badge>
<cba-badge variant="warning">Warning</cba-badge>
<cba-badge variant="danger">Danger</cba-badge>
<cba-badge variant="info">Info</cba-badge>
<cba-badge variant="neutral">Neutral</cba-badge>
```

## Accessibility

- Inner content element has `role="status"` for assistive technology.
- The component is non-interactive — no keyboard focus or click handling.
- Colour is not the sole differentiator — badge text conveys the meaning.

## Related docs

- [README.md](../README.md)
- [USAGE.md](./USAGE.md)
- [THEME.md](./THEME.md)
