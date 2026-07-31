# CbaSkeleton

Skeleton placeholder for content that is still loading. Renders an animated shimmer surface in one of five preset shapes.

## Table of Contents

- [Selector](#selector)
- [Import](#import)
- [Basic usage](#basic-usage)
- [Inputs](#inputs)
- [Variant descriptions](#variant-descriptions)
- [Default dimensions](#default-dimensions)
- [Usage examples](#usage-examples)
- [Accessibility](#accessibility)
- [Related docs](#related-docs)

## Selector

`<cba-skeleton>` — standalone component exported from `@cobranza-apps/ui`.

## Import

```ts
import { CbaSkeletonComponent } from '@cobranza-apps/ui';
```

## Basic usage

```html
<cba-skeleton variant="generic"></cba-skeleton>
```

## Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'text' \| 'avatar' \| 'card' \| 'table-row' \| 'generic'` | `'generic'` | Preset skeleton shape. |
| `width` | `string \| null` | `null` | Optional width override (e.g. `'100%'`, `'12rem'`). Falls back to variant default. |
| `height` | `string \| null` | `null` | Optional height override (e.g. `'1rem'`, `'4rem'`). Falls back to variant default. |

## Variant descriptions

| Variant | Visual | Typical use |
| --- | --- | --- |
| `text` | Single horizontal line placeholder | Text content loading (paragraphs, labels). |
| `avatar` | Circular placeholder | User avatar / profile image loading. |
| `card` | Block placeholder resembling a card surface | Card or panel loading. |
| `table-row` | Multi-cell horizontal row placeholder | Table row loading (4 cells: 3 regular + 1 shrink). |
| `generic` | Simple rectangular block | Fallback / custom shapes. |

## Default dimensions

| Variant | Width | Height |
| --- | --- | --- |
| `text` | `100%` | `0.875rem` |
| `avatar` | `2.5rem` | `2.5rem` |
| `card` | `100%` | `6rem` |
| `table-row` | `100%` | `1rem` |
| `generic` | `100%` | `1rem` |

Override any dimension via the `width` and `height` inputs.

## Usage examples

### Text loading (multiple lines)

```html
<div class="text-loading">
  <cba-skeleton variant="text"></cba-skeleton>
  <cba-skeleton variant="text" [width]="'80%'"></cba-skeleton>
  <cba-skeleton variant="text" [width]="'60%'"></cba-skeleton>
</div>
```

### Avatar loading

```html
<cba-skeleton variant="avatar"></cba-skeleton>
```

### Custom-sized avatar

```html
<cba-skeleton variant="avatar" [width]="'3rem'" [height]="'3rem'"></cba-skeleton>
```

### Card loading

```html
<cba-skeleton variant="card"></cba-skeleton>
```

### Table row loading

```html
<cba-skeleton variant="table-row"></cba-skeleton>
```

### Generic block with custom dimensions

```html
<cba-skeleton variant="generic" [width]="'200px'" [height]="'100px'"></cba-skeleton>
```

### Full list loading pattern

```html
@if (isLoading) {
  <div class="list-skeleton">
    @for (item of placeholderItems; track $index) {
      <cba-card>
        <div cbaCardHeader>
          <cba-skeleton variant="avatar" [width]="'2rem'" [height]="'2rem'"></cba-skeleton>
          <cba-skeleton variant="text" [width]="'40%'"></cba-skeleton>
        </div>
        <cba-skeleton variant="text"></cba-skeleton>
        <cba-skeleton variant="text" [width]="'70%'"></cba-skeleton>
      </cba-card>
    }
  </div>
} @else {
  <!-- Real content -->
}
```

## Accessibility

- The component sets `aria-hidden="true"` and `role="presentation"` — it is invisible to assistive technology.
- The parent container should communicate loading state separately (e.g. `aria-busy="true"` on the content region).
- The shimmer animation uses `prefers-reduced-motion: reduce` to disable animation for users who prefer reduced motion.

## Non-goals

- **No shimmer configuration** — animation timing, gradient colours, and delay are fixed and not exposed as inputs.
- **No async integration** — the component does not know when loading ends; the parent controls visibility.

## Related docs

- [README.md](../README.md)
- [USAGE.md](./USAGE.md)
- [THEME.md](./THEME.md)
