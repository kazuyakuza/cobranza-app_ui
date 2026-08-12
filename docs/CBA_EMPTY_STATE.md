# CbaEmptyState

Centered empty-state placeholder with icon, title, description, and action slots.

## Table of Contents

- [Selector](#selector)
- [Import](#import)
- [Inputs](#inputs)
- [Content projection slots](#content-projection-slots)
- [Basic usage](#basic-usage)
- [Full example with all 4 slots](#full-example-with-all-4-slots)
- [Styling notes](#styling-notes)
- [Accessibility](#accessibility)
- [Related docs](#related-docs)

## Selector

`<cba-empty-state>` — standalone component exported from `@cobranza-apps/ui`.

## Import

```ts
import { CbaEmptyStateComponent } from '@cobranza-apps/ui';
```

## Inputs

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | — | **yes** | Primary message of the empty state. Rendered as an `<h3>`. |
| `description` | `string` | `''` | No | Optional secondary explanatory text below the title. Not rendered when empty. |

## Content projection slots

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| Icon | `[cbaEmptyStateIcon]` attribute | No | Optional icon element (e.g. `<fa-icon>`). Hidden when empty. |
| Action | `[cbaEmptyStateAction]` attribute | No | Optional primary action (usually a `<cba-button>`). Hidden when empty. |

## Basic usage

```html
<cba-empty-state title="No items found">
</cba-empty-state>
```

### With description

```html
<cba-empty-state
  title="No items found"
  description="Try adjusting your filters to see more results.">
</cba-empty-state>
```

## Full example with all 4 slots

```html
<cba-empty-state
  title="No customers match your search"
  description="Try broadening your filters or create a new customer manually.">

  <fa-icon
    cbaEmptyStateIcon
    [icon]="['fas', 'inbox']"
    aria-hidden="true">
  </fa-icon>

  <cba-button cbaEmptyStateAction variant="primary" (cbaClick)="onReset()">
    Reset Filters
  </cba-button>
</cba-empty-state>
```

### Host component

```ts
import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faInbox } from '@fortawesome/free-solid-svg-icons';
import { CbaEmptyStateComponent, CbaButtonComponent } from '@cobranza-apps/ui';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [FaIconComponent, CbaEmptyStateComponent, CbaButtonComponent],
  templateUrl: './customer-list.component.html',
})
export class CustomerListComponent {
  readonly faInbox = faInbox;

  onReset(): void {
    // Reset filter logic
  }
}
```

## Styling notes

- Layout is centered vertically and horizontally within the host.
- Clear visual hierarchy: icon → title → description → action.
- Description uses `--cba-text-muted` for secondary text.
- Spacing between elements uses `--cba-space-*` tokens for balanced proportions.
- No heavy illustration system — a simple Font Awesome icon is sufficient.

## Accessibility

- Title is rendered as `<h3>` for proper heading hierarchy.
- Consumer must add `aria-hidden="true"` on the projected icon element — it is decorative; meaning is conveyed by the title. (See the usage example above.)
- Action slot content (e.g. button) retains its own keyboard accessibility.
- Empty slots (icon, action) are hidden from the DOM when not projected.

## Non-goals

- **No async handling** — the component does not manage loading, error, or retry state; it is purely presentational.
- **No layout responsibilities** — centering and spacing within a parent layout are owned by the consumer.

## Related docs

- [README.md](../README.md)
- [USAGE.md](./USAGE.md)
- [THEME.md](./THEME.md)
