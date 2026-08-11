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
- [State overlays (hover / active)](#state-overlays-hover--active)
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
| `truncate` | `boolean` | `false` | Truncates the label with an ellipsis when space is constrained (sets `overflow: hidden`, `text-overflow: ellipsis`, `white-space: nowrap` on `.cba-button__label`). Useful in constrained flex containers. |
| `iconOnly` | `boolean` | `false` | Renders a minimal square button for icon-only usage. Sets `aspect-ratio: 1 / 1`, `min-width: auto`, and per-size padding (`--cba-space-1` for `sm`, `--cba-space-2` for `md`) so the button collapses to the icon. The rendered icon is `aria-hidden`; consumers must provide an accessible label via `aria-label` on `<cba-button>`. |
| `block` | `boolean` | `false` | Makes the button fill the full width of its parent. The host becomes `display: block` at `width: 100%` and the internal control spans `100%`. When combined with `variant="ghost"`, the label is left-aligned via `justify-content: flex-start`. |

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

### Label truncation

Set `[truncate]="true"` to ellipsis-clamp long labels inside a constrained parent. The host modifier `cba-button--truncate` sets `min-width: 0` on the control and `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` on `.cba-button__label`.

```html
<cba-button [truncate]="true" style="max-width: 120px;">
  Very long action label that should ellipsis
</cba-button>
```

### Icon-only

Set `[iconOnly]="true"` to render a minimal square button when the button contains only an icon. The host modifier `cba-button--icon-only` sets `aspect-ratio: 1 / 1`, `min-width: auto`, and per-size padding (`--cba-space-1` for `sm`, `--cba-space-2` for `md`) so the button collapses to the icon. Pair with consumer-side `flex: 0 0 auto` to prevent stretching in a flex parent.

```html
<cba-button [icon]="faPlus" [iconOnly]="true" (cbaClick)="onAdd()"></cba-button>
```

> **Accessibility:** the rendered `<fa-icon>` is `aria-hidden`. When using `iconOnly`, supply an accessible label via `aria-label` on `<cba-button>` (e.g. `<cba-button [icon]="faPlus" [iconOnly]="true" aria-label="Add item">`) so the control remains announced by assistive technology.

### Block

Set `[block]="true"` to make the button host `display: block` at `width: 100%` so the internal control fills its parent. Ghost block buttons left-align their label.

```html
<cba-button variant="ghost" [block]="true" (cbaClick)="onFilter()">
  Filter results
</cba-button>
```

## State overlays (hover / active)

Solid variants (`primary`, `danger`, `success`) use **light inverse overlays** (`--cba-hover-inverse`, `--cba-active-inverse`) because they sit on dark accent backgrounds. `secondary` uses the **dark overlays** (`--cba-hover`, `--cba-active`) because it sits on light surfaces. `ghost` applies the overlay directly as `background-color`.

AI agents: the solid-variant styling is consolidated in the `cba-solid-button($accent-color)` SCSS mixin in `src/components/button/cba-button.component.scss`. When adding a new solid variant, always use this mixin — do not inline the overlay tokens. See [CONSUMER_GUIDE.md §Button Color Guide](CONSUMER_GUIDE.md#button-color-guide) for the full state-overlay matrix.

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
