# Phase 4 — Front-end Technical Specification

## Scope

This specification covers the implementation of the five core presentational components for `@cobranza-apps/ui`:

1. `CbaButton`
2. `CbaCard`
3. `CbaBadge`
4. `CbaEmptyState`
5. `CbaSkeleton`

All components are presentational, standalone, use `ChangeDetectionStrategy.OnPush`, and consume only the `--cba-*` design tokens defined in `src/theme/_variables.scss`.

## Project context

- The source was moved from `src/lib/` to `src/` in the previous phase. Existing components (`module-header`, `module-container`) already live under `src/components/` and use barrel `index.ts` files.
- Therefore, every new component in this phase must be placed under `src/components/<component-name>/`, **not** the old `src/lib/components/` path.
- Component file naming follows the existing pattern:
  - `cba-<name>.component.ts`
  - `cba-<name>.component.html`
  - `cba-<name>.component.scss`
  - `cba-<name>.component.spec.ts`
  - `<name>.types.ts` (for variant/size union types)
  - `index.ts` (barrel, already present as a placeholder for the five components)
- The public API is exported from `src/public-api.ts` via the barrel folders.

## Common patterns

Every component must follow these patterns:

- **Standalone component**: `standalone: true` in the `@Component` decorator.
- **OnPush change detection**: `changeDetection: ChangeDetectionStrategy.OnPush`.
- **Signal inputs**: use `input<T>()` and `input.required<T>()` for all `@Input` properties.
- **Signal outputs**: use `output<T>()` for all `@Output` properties.
- **External templates**: prefer `templateUrl` over inline templates.
- **Host bindings**: use the `host` object for stable class names and modifier classes. Avoid manual `HostBinding`.
- **Token-only styling**: all color, spacing, radius, shadow, and focus values must reference `--cba-*` tokens. No hard-coded colors, especially no grays outside tokens.
- **Reduced motion**: animations must respect `prefers-reduced-motion: reduce`.
- **JSDoc**: every public input, output, and the component class must have JSDoc with `@usageNotes`, defaults, and an example.
- **Unit tests**: one `.spec.ts` per component with focused behaviour assertions (render, projection, event emission, class binding, disabled/loading states).

---

## 1. CbaButton

### Selector

```text
cba-button
```

### Files

- `src/components/button/cba-button.component.ts`
- `src/components/button/cba-button.component.html`
- `src/components/button/cba-button.component.scss`
- `src/components/button/cba-button.component.spec.ts`
- `src/components/button/button.types.ts`
- `src/components/button/index.ts`

### TypeScript types

```ts
export type CbaButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type CbaButtonSize = 'sm' | 'md';
export type CbaButtonType = 'button' | 'submit' | 'reset';
export type CbaButtonIconPosition = 'leading' | 'trailing';
```

### Component class signature

```ts
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'cba-button',
  standalone: true,
  imports: [FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-button.component.html',
  styleUrl: './cba-button.component.scss',
  host: {
    'class': 'cba-button',
    '[class.cba-button--primary]': "variant() === 'primary'",
    '[class.cba-button--secondary]': "variant() === 'secondary'",
    '[class.cba-button--ghost]': "variant() === 'ghost'",
    '[class.cba-button--danger]': "variant() === 'danger'",
    '[class.cba-button--success]': "variant() === 'success'",
    '[class.cba-button--sm]': "size() === 'sm'",
    '[class.cba-button--md]': "size() === 'md'",
    '[class.cba-button--loading]': 'loading()',
    '[class.cba-button--disabled]': 'isDisabled()',
  },
})
export class CbaButtonComponent {
  /** Visual style of the button. */
  readonly variant = input<CbaButtonVariant>('primary');

  /** Control size. */
  readonly size = input<CbaButtonSize>('md');

  /** Shows a spinner and disables interaction while keeping the button layout stable. */
  readonly loading = input<boolean>(false);

  /** Standard disabled state. */
  readonly disabled = input<boolean>(false);

  /** Native button type. */
  readonly type = input<CbaButtonType>('button');

  /** Optional leading/trailing icon. */
  readonly icon = input<IconDefinition | null>(null);

  /** Position of the optional icon. */
  readonly iconPosition = input<CbaButtonIconPosition>('leading');

  /** Emitted when the user clicks the internal native button. */
  readonly click = output<void>();

  /** Whether the button must be considered non-interactive. */
  protected readonly isDisabled = () => this.disabled() || this.loading();

  /** Spinner icon used in the loading state. */
  protected readonly faSpinner = faSpinner;
}
```

### Template strategy

Use an external template (`cba-button.component.html`) that renders a single native `<button>`.

```html
<button
  type="button"
  class="cba-button__control"
  [attr.type]="type()"
  [disabled]="isDisabled()"
  [attr.aria-busy]="loading() || null"
  [attr.aria-disabled]="isDisabled() || null"
  (click)="click.emit()">
  @if (loading()) {
    <fa-icon class="cba-button__icon cba-button__icon--spinner" [icon]="faSpinner" animation="spin" aria-hidden="true" />
  }
  @if (!loading() && icon() && iconPosition() === 'leading') {
    <fa-icon class="cba-button__icon cba-button__icon--leading" [icon]="icon()" aria-hidden="true" />
  }
  <span class="cba-button__label">
    <ng-content></ng-content>
  </span>
  @if (!loading() && icon() && iconPosition() === 'trailing') {
    <fa-icon class="cba-button__icon cba-button__icon--trailing" [icon]="icon()" aria-hidden="true" />
  }
</button>
```

- The default content slot is the button label.
- The loading spinner replaces the leading icon slot, but the label remains visible so layout does not collapse.
- Clicks are emitted from the native `<button>` element.
- The `[attr.type]` is bound to `type()` while the static `type="button"` prevents accidental form submission during hydration.

### SCSS strategy

```scss
:host {
  display: inline-block;
}

.cba-button__control {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--cba-space-2);
  border: 1px solid transparent;
  border-radius: var(--cba-radius-sm);
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  line-height: 1.5;
  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;

  &:focus-visible {
    outline: none;
    box-shadow: var(--cba-focus-ring);
  }
}

// Size modifiers
.cba-button--sm .cba-button__control {
  padding: var(--cba-space-1) var(--cba-space-3);
  font-size: 0.8125rem;
}

.cba-button--md .cba-button__control {
  padding: var(--cba-space-2) var(--cba-space-4);
  font-size: 0.875rem;
}

// Variants
.cba-button--primary .cba-button__control {
  background-color: var(--cba-accent-primary);
  color: var(--cba-text-inverse);

  &:hover {
    background-image: linear-gradient(var(--cba-hover), var(--cba-hover));
  }

  &:active {
    background-image: linear-gradient(var(--cba-active), var(--cba-active));
  }
}

.cba-button--secondary .cba-button__control {
  background-color: var(--cba-bg-elevated);
  border-color: var(--cba-border-subtle);
  color: var(--cba-text-primary);

  &:hover {
    background-image: linear-gradient(var(--cba-hover), var(--cba-hover));
  }

  &:active {
    background-image: linear-gradient(var(--cba-active), var(--cba-active));
  }
}

.cba-button--ghost .cba-button__control {
  background-color: transparent;
  color: var(--cba-text-primary);

  &:hover {
    background-color: var(--cba-hover);
  }

  &:active {
    background-color: var(--cba-active);
  }
}

.cba-button--danger .cba-button__control {
  background-color: var(--cba-accent-danger);
  color: var(--cba-text-inverse);

  &:hover {
    background-image: linear-gradient(var(--cba-hover), var(--cba-hover));
  }

  &:active {
    background-image: linear-gradient(var(--cba-active), var(--cba-active));
  }
}

.cba-button--success .cba-button__control {
  background-color: var(--cba-accent-success);
  color: var(--cba-text-inverse);

  &:hover {
    background-image: linear-gradient(var(--cba-hover), var(--cba-hover));
  }

  &:active {
    background-image: linear-gradient(var(--cba-active), var(--cba-active));
  }
}

// Disabled / loading state
.cba-button--disabled .cba-button__control,
.cba-button--loading .cba-button__control {
  cursor: not-allowed;
  opacity: 0.6;
}

.cba-button__icon {
  display: inline-flex;
  flex: 0 0 auto;
}

.cba-button__label {
  flex: 0 1 auto;
  min-width: 0;
}

@media (prefers-reduced-motion: reduce) {
  .cba-button__control {
    transition: none;
  }

  :host ::ng-deep .fa-spin {
    animation: none;
  }
}
```

### Accessibility

- Native `<button>` element provides full keyboard support.
- `disabled` attribute is set when `loading` or `disabled` is true.
- `aria-busy="true"` is set when loading.
- `aria-disabled` is added for non-disabled loading states if they are ever allowed.
- Focus ring uses `--cba-focus-ring` via `box-shadow` on `:focus-visible`.

### Testing strategy

- Render the component with a label and assert the label is inside the native `<button>`.
- Assert that clicking the button emits the `click` output.
- Assert that `loading` and `disabled` states prevent the `click` output.
- Assert each variant applies the expected host class (`cba-button--primary`, `cba-button--secondary`, etc.).
- Assert each size applies the expected host class.
- Assert a leading icon is rendered when `icon` is provided, and the spinner replaces the leading icon when `loading` is true.

---

## 2. CbaCard

### Selector

```text
cba-card
```

### Files

- `src/components/card/cba-card.component.ts`
- `src/components/card/cba-card.component.html`
- `src/components/card/cba-card.component.scss`
- `src/components/card/cba-card.component.spec.ts`
- `src/components/card/index.ts`

### Component class signature

```ts
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

/**
 * A simple surface container with optional header, body, and footer slots.
 *
 * @usageNotes
 * ```html
 * <cba-card>
 *   <div cbaCardHeader>Card header</div>
 *   <p>Card body content.</p>
 *   <div cbaCardFooter>Card footer</div>
 * </cba-card>
 * ```
 */
@Component({
  selector: 'cba-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-card.component.html',
  styleUrl: './cba-card.component.scss',
  host: {
    'class': 'cba-card',
  },
})
export class CbaCardComponent {}
```

No inputs or outputs are required for this component. Header and footer presence are driven entirely by content projection.

### Template strategy

```html
<article class="cba-card__surface">
  <div class="cba-card__header">
    <ng-content select="[cbaCardHeader]"></ng-content>
  </div>
  <div class="cba-card__body">
    <ng-content></ng-content>
  </div>
  <div class="cba-card__footer">
    <ng-content select="[cbaCardFooter]"></ng-content>
  </div>
</article>
```

- Header and footer are rendered only when content is projected. Empty regions are hidden via the `:empty` CSS selector.
- The default slot is the body and is always present.
- The projected header/footer can be any element or component carrying the `cbaCardHeader` / `cbaCardFooter` attribute.

### SCSS strategy

```scss
:host {
  display: block;
}

.cba-card__surface {
  display: flex;
  flex-direction: column;
  background-color: var(--cba-bg-secondary);
  border: 1px solid var(--cba-border-subtle);
  border-radius: var(--cba-radius-md);
  overflow: hidden;
}

.cba-card__header {
  padding: var(--cba-space-3) var(--cba-space-4);
  border-bottom: 1px solid var(--cba-border-subtle);

  &:empty {
    display: none;
  }
}

.cba-card__body {
  flex: 1 1 auto;
  padding: var(--cba-space-4);
}

.cba-card__footer {
  padding: var(--cba-space-3) var(--cba-space-4);
  border-top: 1px solid var(--cba-border-subtle);

  &:empty {
    display: none;
  }
}
```

- No forced hover elevation or shadow.
- Border, background, and radius come from tokens.

### Accessibility

- The card is rendered as an `<article>` element, which is a semantic container for self-contained content.
- Header and footer regions are `<div>` elements; consumers can use heading elements inside the projected header if a document outline is needed.

### Testing strategy

- Render a card with only body content and assert the body is projected.
- Render a card with header and footer and assert the projected header/footer are present.
- Assert that the card surface element has the expected class.
- Assert that the header/footer regions are empty and hidden when no content is projected.

---

## 3. CbaBadge

### Selector

```text
cba-badge
```

### Files

- `src/components/badge/cba-badge.component.ts`
- `src/components/badge/cba-badge.component.html`
- `src/components/badge/cba-badge.component.scss`
- `src/components/badge/cba-badge.component.spec.ts`
- `src/components/badge/badge.types.ts`
- `src/components/badge/index.ts`

### TypeScript types

```ts
export type CbaBadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type CbaBadgeAppearance = 'solid' | 'outline';
```

### Component class signature

```ts
import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'cba-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-badge.component.html',
  styleUrl: './cba-badge.component.scss',
  host: {
    'class': 'cba-badge',
    '[class.cba-badge--primary]': "variant() === 'primary'",
    '[class.cba-badge--success]': "variant() === 'success'",
    '[class.cba-badge--warning]': "variant() === 'warning'",
    '[class.cba-badge--danger]': "variant() === 'danger'",
    '[class.cba-badge--info]': "variant() === 'info'",
    '[class.cba-badge--neutral]': "variant() === 'neutral'",
    '[class.cba-badge--solid]': "appearance() === 'solid'",
    '[class.cba-badge--outline]': "appearance() === 'outline'",
  },
})
export class CbaBadgeComponent {
  /** Semantic colour of the badge. */
  readonly variant = input<CbaBadgeVariant>('neutral');

  /** Fill style. */
  readonly appearance = input<CbaBadgeAppearance>('solid');
}
```

### Template strategy

```html
<span class="cba-badge__content" role="status">
  <ng-content></ng-content>
</span>
```

- The default content slot is the badge text.
- `role="status"` marks the badge as a status message.

### SCSS strategy

```scss
:host {
  display: inline-flex;
}

.cba-badge__content {
  display: inline-flex;
  align-items: center;
  gap: var(--cba-space-1);
  padding: var(--cba-space-1) var(--cba-space-2);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  border: 1px solid transparent;
}

// Solid variants
.cba-badge--solid.cba-badge--primary .cba-badge__content {
  background-color: var(--cba-accent-primary);
  color: var(--cba-text-inverse);
}

.cba-badge--solid.cba-badge--success .cba-badge__content {
  background-color: var(--cba-accent-success);
  color: var(--cba-text-inverse);
}

.cba-badge--solid.cba-badge--warning .cba-badge__content {
  background-color: var(--cba-accent-warning);
  color: var(--cba-text-inverse);
}

.cba-badge--solid.cba-badge--danger .cba-badge__content {
  background-color: var(--cba-accent-danger);
  color: var(--cba-text-inverse);
}

.cba-badge--solid.cba-badge--info .cba-badge__content {
  background-color: var(--cba-accent-info);
  color: var(--cba-text-inverse);
}

.cba-badge--solid.cba-badge--neutral .cba-badge__content {
  background-color: var(--cba-bg-elevated);
  color: var(--cba-text-secondary);
}

// Outline variants
.cba-badge--outline.cba-badge--primary .cba-badge__content {
  border-color: var(--cba-accent-primary);
  color: var(--cba-accent-primary);
}

.cba-badge--outline.cba-badge--success .cba-badge__content {
  border-color: var(--cba-accent-success);
  color: var(--cba-accent-success);
}

.cba-badge--outline.cba-badge--warning .cba-badge__content {
  border-color: var(--cba-accent-warning);
  color: var(--cba-accent-warning);
}

.cba-badge--outline.cba-badge--danger .cba-badge__content {
  border-color: var(--cba-accent-danger);
  color: var(--cba-accent-danger);
}

.cba-badge--outline.cba-badge--info .cba-badge__content {
  border-color: var(--cba-accent-info);
  color: var(--cba-accent-info);
}

.cba-badge--outline.cba-badge--neutral .cba-badge__content {
  border-color: var(--cba-border-default);
  color: var(--cba-text-muted);
}
```

### Accessibility

- Uses a `<span>` with `role="status"` so screen readers announce the badge as a status indicator.
- Badges are non-interactive; no focus ring is needed.

### Testing strategy

- Render the badge with content and assert the text is present.
- Assert each variant class (`cba-badge--primary`, `cba-badge--neutral`, etc.) is applied.
- Assert each appearance class (`cba-badge--solid`, `cba-badge--outline`) is applied.
- Assert `role="status"` is present.

---

## 4. CbaEmptyState

### Selector

```text
cba-empty-state
```

### Files

- `src/components/empty-state/cba-empty-state.component.ts`
- `src/components/empty-state/cba-empty-state.component.html`
- `src/components/empty-state/cba-empty-state.component.scss`
- `src/components/empty-state/cba-empty-state.component.spec.ts`
- `src/components/empty-state/index.ts`

### Component class signature

```ts
import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'cba-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-empty-state.component.html',
  styleUrl: './cba-empty-state.component.scss',
  host: {
    'class': 'cba-empty-state',
  },
})
export class CbaEmptyStateComponent {
  /** Primary message of the empty state. */
  readonly title = input.required<string>();

  /** Optional secondary explanatory text. */
  readonly description = input<string>('');
}
```

### Template strategy

```html
<div class="cba-empty-state__layout">
  <div class="cba-empty-state__icon">
    <ng-content select="[cbaEmptyStateIcon]"></ng-content>
  </div>
  <h3 class="cba-empty-state__title">{{ title() }}</h3>
  @if (description()) {
    <p class="cba-empty-state__description">{{ description() }}</p>
  }
  <div class="cba-empty-state__action">
    <ng-content select="[cbaEmptyStateAction]"></ng-content>
  </div>
</div>
```

- Icon and action are content slots.
- Title is a required string input rendered as an `<h3>`.
- Description is an optional string input rendered as a `<p>` when present.
- Empty icon and action regions are hidden via `:empty`.

### SCSS strategy

```scss
:host {
  display: block;
}

.cba-empty-state__layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: var(--cba-space-4);
  padding: var(--cba-space-8);
}

.cba-empty-state__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--cba-space-8);
  height: var(--cba-space-8);
  font-size: 1.75rem;
  color: var(--cba-text-muted);

  &:empty {
    display: none;
  }
}

.cba-empty-state__title {
  margin: 0;
  color: var(--cba-text-primary);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
}

.cba-empty-state__description {
  margin: 0;
  color: var(--cba-text-muted);
  font-size: 0.875rem;
  line-height: 1.5;
}

.cba-empty-state__action {
  display: flex;
  align-items: center;
  gap: var(--cba-space-2);
  margin-top: var(--cba-space-2);

  &:empty {
    display: none;
  }
}
```

### Accessibility

- Title is a semantic heading (`<h3>`).
- Description is a paragraph (`<p>`).
- The icon slot is decorative and should be marked `aria-hidden="true"` by the consumer.
- The action slot should contain the primary action, usually a `<cba-button>`.

### Testing strategy

- Render the component with a title and assert the title text is rendered.
- Render without a description and assert the description element is not present.
- Render with a description and assert the description text is present.
- Render with an icon and action projection and assert the projected content is present.
- Assert the icon/action regions are hidden when no content is projected.

---

## 5. CbaSkeleton

### Selector

```text
cba-skeleton
```

### Files

- `src/components/skeleton/cba-skeleton.component.ts`
- `src/components/skeleton/cba-skeleton.component.html`
- `src/components/skeleton/cba-skeleton.component.scss`
- `src/components/skeleton/cba-skeleton.component.spec.ts`
- `src/components/skeleton/skeleton.types.ts`
- `src/components/skeleton/index.ts`

### TypeScript types

```ts
export type CbaSkeletonVariant = 'text' | 'avatar' | 'card' | 'table-row' | 'generic';
```

### Component class signature

```ts
import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'cba-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cba-skeleton.component.html',
  styleUrl: './cba-skeleton.component.scss',
  host: {
    'class': 'cba-skeleton',
    '[class.cba-skeleton--text]': "variant() === 'text'",
    '[class.cba-skeleton--avatar]': "variant() === 'avatar'",
    '[class.cba-skeleton--card]': "variant() === 'card'",
    '[class.cba-skeleton--table-row]': "variant() === 'table-row'",
    '[class.cba-skeleton--generic]': "variant() === 'generic'",
  },
})
export class CbaSkeletonComponent {
  /** Preset skeleton shape. */
  readonly variant = input<CbaSkeletonVariant>('generic');

  /** Optional width override (e.g. '100%', '12rem'). */
  readonly width = input<string | null>(null);

  /** Optional height override (e.g. '1rem', '4rem'). */
  readonly height = input<string | null>(null);
}
```

### Template strategy

```html
<div class="cba-skeleton__content" aria-hidden="true" role="presentation">
  @switch (variant()) {
    @case ('text') {
      <div class="cba-skeleton__group cba-skeleton__group--text">
        <div class="cba-skeleton__line" [style.width]="width() ?? '100%'" [style.height]="height() ?? '0.875rem'"></div>
        <div class="cba-skeleton__line" [style.width]="width() ?? '100%'" [style.height]="height() ?? '0.875rem'"></div>
        <div class="cba-skeleton__line cba-skeleton__line--short" [style.width]="width() ?? '60%'" [style.height]="height() ?? '0.875rem'"></div>
      </div>
    }
    @case ('avatar') {
      <div class="cba-skeleton__shape cba-skeleton__shape--avatar" [style.width]="width() ?? '2.5rem'" [style.height]="height() ?? '2.5rem'"></div>
    }
    @case ('card') {
      <div class="cba-skeleton__shape cba-skeleton__shape--card" [style.width]="width() ?? '100%'" [style.height]="height() ?? '6rem'"></div>
    }
    @case ('table-row') {
      <div class="cba-skeleton__group cba-skeleton__group--table-row">
        <div class="cba-skeleton__cell" [style.height]="height() ?? '1rem'"></div>
        <div class="cba-skeleton__cell" [style.height]="height() ?? '1rem'"></div>
        <div class="cba-skeleton__cell" [style.height]="height() ?? '1rem'"></div>
        <div class="cba-skeleton__cell cba-skeleton__cell--shrink" [style.height]="height() ?? '1rem'"></div>
      </div>
    }
    @default {
      <div class="cba-skeleton__shape cba-skeleton__shape--generic" [style.width]="width() ?? '100%'" [style.height]="height() ?? '1rem'"></div>
    }
  }
</div>
```

- `aria-hidden="true"` and `role="presentation"` ensure the skeleton is ignored by assistive technology.
- `width` and `height` are optional and override the default sizes per variant.
- `text` variant renders three lines with the last line shorter to mimic a paragraph.
- `table-row` variant renders a horizontal row of four cells, not a full table.

### SCSS strategy

```scss
:host {
  display: block;
}

.cba-skeleton__content {
  width: 100%;
}

.cba-skeleton__shape,
.cba-skeleton__line,
.cba-skeleton__cell {
  background: linear-gradient(
    90deg,
    var(--cba-bg-secondary) 0%,
    var(--cba-bg-elevated) 50%,
    var(--cba-bg-secondary) 100%
  );
  background-size: 200% 100%;
  border-radius: var(--cba-radius-sm);
  animation: cba-skeleton-shimmer 1.6s infinite linear;
}

.cba-skeleton__group {
  display: flex;
  flex-direction: column;
  gap: var(--cba-space-2);
}

.cba-skeleton__group--table-row {
  flex-direction: row;
  align-items: center;
  gap: var(--cba-space-2);
}

.cba-skeleton__shape--avatar {
  border-radius: 50%;
}

.cba-skeleton__shape--card {
  border-radius: var(--cba-radius-md);
}

.cba-skeleton__line--short {
  width: 60%;
}

.cba-skeleton__cell {
  flex: 1 1 auto;
  min-width: var(--cba-space-8);
}

.cba-skeleton__cell--shrink {
  flex: 0 1 auto;
  width: 20%;
}

@keyframes cba-skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cba-skeleton__shape,
  .cba-skeleton__line,
  .cba-skeleton__cell {
    animation: none;
  }
}
```

- No hard-coded grays; only `--cba-bg-secondary` and `--cba-bg-elevated` from the token system.
- The shimmer animation is disabled for users who prefer reduced motion.

### Accessibility

- The skeleton is purely visual feedback; it is hidden from assistive technology with `aria-hidden="true"` and `role="presentation"`.
- The parent container that uses the skeleton should communicate loading state (e.g., `aria-busy="true"`, `aria-live="polite"`) if appropriate.

### Testing strategy

- Render the default variant and assert the skeleton surface is present.
- Assert each variant class (`cba-skeleton--text`, `cba-skeleton--avatar`, etc.) is applied when the input changes.
- Assert the `text` variant renders three lines and the `table-row` variant renders four cells.
- Assert `aria-hidden="true"` and `role="presentation"` are present.
- Assert `width` and `height` inputs override inline styles.

---

## Public API updates

The following exports must be added to `src/public-api.ts`, maintaining alphabetical order within the components section:

```ts
export * from './components/badge';
export * from './components/button';
export * from './components/card';
export * from './components/empty-state';
export * from './components/skeleton';
```

Each barrel `index.ts` must be updated to re-export the component class:

```ts
export * from './cba-button.component';
```

(replace `button` with the appropriate component name for each folder).

---

## Cross-component consistency summary

| Aspect | Requirement |
| --- | --- |
| Framework | Angular 22 standalone components |
| Change detection | `OnPush` on every component |
| Inputs | `input<T>()` / `input.required<T>()` |
| Outputs | `output<T>()` |
| Host classes | Use the `host` object in `@Component` |
| Templates | External `.html` files |
| Styles | External `.scss` files, only `--cba-*` tokens |
| Focus ring | `--cba-focus-ring` via `box-shadow` on `:focus-visible` |
| Reduced motion | `prefers-reduced-motion: reduce` disables animations |
| File location | `src/components/<name>/` |
| Public API | Re-export via barrel `index.ts` and `src/public-api.ts` |
| Tests | One `.spec.ts` per component, behaviour assertions |
| Docs | JSDoc on every public input/output and component class |

---

## Acceptance criteria mapped to this spec

| Criterion | How this spec addresses it |
| --- | --- |
| Standalone components compile | `standalone: true` and minimal imports declared |
| API matches this document | Each component's inputs, outputs, and slots are specified |
| Styles use only theme tokens | Every SCSS example uses `--cba-*` tokens |
| Content projection works | Card, EmptyState, and Button slots are defined |
| Skeleton variants include all five | `text`, `avatar`, `card`, `table-row`, `generic` are specified |
| Exported from `public-api.ts` | Explicit export lines listed |
| Library build succeeds | Components have no external dependencies beyond FontAwesome for Button |
| Docs + minimal tests | JSDoc and test assertions specified for each component |

---

## File location

This spec is saved at:

```text
.kilo/plans/20260730-phase4-components-frontend-spec.md
```
