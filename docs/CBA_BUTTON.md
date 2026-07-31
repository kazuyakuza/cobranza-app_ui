# CbaButton

Primary action button for the Cobranza App design system. Renders a native `<button>` for full keyboard accessibility.

## Table of Contents

- [Selector](#selector)
- [Import](#import)
- [Basic usage](#basic-usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Variant mapping](#variant-mapping)
- [Size options](#size-options)
- [Icon support](#icon-support)
- [Loading & disabled behaviour](#loading--disabled-behaviour)
- [Accessibility](#accessibility)
- [Related docs](#related-docs)

## Selector

`<cba-button>` — standalone component exported from `@cobranza-apps/ui`.

## Import

```ts
import { CbaButtonComponent } from '@cobranza-apps/ui';
```

## Basic usage

```html
<cba-button (cbaClick)="onSave()">Save</cba-button>
```

## Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger' \| 'success'` | `'primary'` | Visual style of the button. |
| `size` | `'sm' \| 'md'` | `'md'` | Control size (padding and font-size). |
| `loading` | `boolean` | `false` | Shows a spinner and disables interaction while keeping layout stable. |
| `disabled` | `boolean` | `false` | Standard disabled state. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type forwarded to the inner `<button>`. |
| `icon` | `IconDefinition \| undefined` | `undefined` | Optional Font Awesome icon definition. |
| `iconPosition` | `'leading' \| 'trailing'` | `'leading'` | Position of the icon relative to the label. |

## Outputs

| Name | Payload | Description |
| --- | --- | --- |
| `cbaClick` | `void` | Emitted when the user clicks the internal native `<button>`. Not emitted when `disabled` or `loading`. |

## Variant mapping

| Variant | Token mapping | Use case |
| --- | --- | --- |
| `primary` | `--cba-accent-primary` | Default action (save, confirm). |
| `secondary` | Subtle elevated / bordered surface | Secondary actions (cancel, back). |
| `ghost` | Transparent with hover surface | Tertiary actions, inline toolbars. |
| `danger` | `--cba-accent-danger` | Destructive actions (delete, remove). |
| `success` | `--cba-accent-success` | Positive actions (approve, confirm success). |

## Size options

| Size | Effect |
| --- | --- |
| `md` (default) | Standard padding and font-size. |
| `sm` | Reduced padding and smaller font-size. |

Both sizes use `--cba-space-*` tokens internally.

## Icon support

Pass a Font Awesome `IconDefinition` via the `icon` input and control its position with `iconPosition`.

```html
<cba-button [icon]="faPlus" iconPosition="leading" (cbaClick)="onAdd()">
  Add item
</cba-button>

<cba-button [icon]="faTrash" iconPosition="trailing" variant="danger" (cbaClick)="onDelete()">
  Delete
</cba-button>
```

```ts
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

export class MyComponent {
  readonly faPlus = faPlus;
  readonly faTrash = faTrash;
}
```

When `loading` is `true`, the icon is replaced by a spinner regardless of `iconPosition`.

## Loading & disabled behaviour

- `loading === true` → spinner replaces the icon and label area, `aria-busy="true"` is set, clicks are suppressed, and the button is visually dimmed.
- `disabled === true` → standard `disabled` attribute on the inner `<button>`, `aria-disabled="true"` is set.
- Both states add the `cba-button--disabled` host class and prevent `cbaClick` emission.
- Layout dimensions are preserved during loading so surrounding content does not shift.

## Accessibility

- Native `<button>` element — keyboard-operable by default (Enter / Space).
- `aria-busy="true"` while loading.
- `aria-disabled="true"` when disabled or loading.
- `:focus-visible` uses the `--cba-focus-ring` token.
- `prefers-reduced-motion: reduce` disables transitions and the spin animation.

## Non-goals

- **No dropdown split** — the button does not render a caret or split menu; use `CbaDropdown` for menus.
- **No router / link integration** — the button always renders a native `<button>`, never an `<a>`.

## Related docs

- [README.md](../README.md)
- [USAGE.md](./USAGE.md)
- [THEME.md](./THEME.md)
