# Front-end Technical Specification — Redesign Demo Modules (Task Group B)

## Scope

Replace the placeholder content in the demo workspace's **"New customer"** and **"Payment schedule"** 50 % modules with two new demo-only components:

- `demo-customer-form` — a small, read-only 3-field form with an Add button.
- `demo-payment-schedule` — a visual September 2026 calendar with the 15th highlighted, plus a list of 2–3 upcoming payments.

Both components live only in `projects/demo/` and are **not** exported from `@cobranza-apps/ui`.

- **TODO reference**: `.agent/todos/20260820/20260820-todo-0.md` — Tasks 5 and 6.
- **Affected files**:
  - `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.ts`
  - `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.html`
  - `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.scss`
  - `projects/demo/src/app/components/demo-payment-schedule/demo-payment-schedule.component.ts`
  - `projects/demo/src/app/components/demo-payment-schedule/demo-payment-schedule.component.html`
  - `projects/demo/src/app/components/demo-payment-schedule/demo-payment-schedule.component.scss`
  - `projects/demo/src/app/components/demo-workspace/demo-workspace.component.html`
  - `projects/demo/src/app/components/demo-workspace/demo-workspace.component.ts`
  - `projects/demo/src/app/components/demo-workspace/demo-workspace.component.scss`

## Target Framework

- Angular 22 standalone demo app (`projects/demo/`).
- Standalone components, `ChangeDetectionStrategy.OnPush`.
- SCSS with existing `--cba-*` design tokens only.
- Library components consumed from `@cobranza-apps/ui`:
  - `CbaInputComponent`
  - `CbaButtonComponent`
  - `CbaBadgeComponent`
- Font Awesome Free solid icons via `@fortawesome/free-solid-svg-icons`.

## Component Structure

### `demo-customer-form`

| Aspect | Value |
| --- | --- |
| Selector | `demo-customer-form` |
| Files | `.ts`, `.html`, `.scss` |
| Imports | `CbaInputComponent`, `CbaButtonComponent` |
| Icon | `faPlus` |
| State | No internal state; no real submit logic. |
| Outputs | None. |

### `demo-payment-schedule`

| Aspect | Value |
| --- | --- |
| Selector | `demo-payment-schedule` |
| Files | `.ts`, `.html`, `.scss` |
| Imports | `CbaBadgeComponent` |
| State | Static arrays: `days` (1–30) and `payments` (3 rows). |
| Outputs | None. |

### `demo-workspace` updates

- Replace the old placeholder content in the two target modules with the new selectors.
- Remove now-unused imports and dead CSS.

## Exact Changes

### 1. Create `projects/demo/src/app/components/demo-customer-form/`

#### `demo-customer-form.component.ts`

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { CbaButtonComponent, CbaInputComponent } from '@cobranza-apps/ui';

/**
 * Demo-only "New customer" form. Renders three library input fields and a
 * primary Add button. No validation or submit logic — purely visual.
 *
 * **NOT part of the public library API.**
 */
@Component({
  selector: 'demo-customer-form',
  standalone: true,
  imports: [CbaButtonComponent, CbaInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demo-customer-form.component.html',
  styleUrl: './demo-customer-form.component.scss',
})
export class DemoCustomerFormComponent {
  protected readonly faPlus = faPlus;
}
```

#### `demo-customer-form.component.html`

```html
<form class="demo-customer-form" novalidate>
  <cba-input
    label="Name"
    type="text"
    placeholder="Juan Pérez" />
  <cba-input
    label="Document"
    type="text"
    placeholder="20-12345678-9" />
  <cba-input
    label="Email"
    type="email"
    placeholder="juan@example.com" />
  <p class="demo-customer-form__hint cba-text-small">All fields are required for new customers.</p>
  <cba-button
    variant="primary"
    type="button"
    [icon]="faPlus">
    Add customer
  </cba-button>
</form>
```

#### `demo-customer-form.component.scss`

```scss
// Demo-only new-customer form. Uses theme tokens only.

:host {
  display: block;
}

.demo-customer-form {
  display: flex;
  flex-direction: column;
  gap: var(--cba-space-3);
}

.demo-customer-form__hint {
  margin: 0;
  color: var(--cba-text-muted);
}
```

### 2. Create `projects/demo/src/app/components/demo-payment-schedule/`

#### `demo-payment-schedule.component.ts`

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CbaBadgeComponent } from '@cobranza-apps/ui';

/** One scheduled payment row shown under the calendar. */
interface DemoPayment {
  readonly customer: string;
  readonly amount: string;
  readonly status: 'pending' | 'paid';
}

/**
 * Demo-only payment schedule view. Shows a visual September 2026 calendar
 * with the 15th highlighted, plus a list of hard-coded payments for that day.
 *
 * **NOT part of the public library API.**
 */
@Component({
  selector: 'demo-payment-schedule',
  standalone: true,
  imports: [CbaBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demo-payment-schedule.component.html',
  styleUrl: './demo-payment-schedule.component.scss',
})
export class DemoPaymentScheduleComponent {
  protected readonly monthYear = 'September 2026';
  protected readonly selectedDate = '2026-09-15';
  protected readonly days: readonly number[] = Array.from({ length: 30 }, (_, index) => index + 1);
  protected readonly payments: readonly DemoPayment[] = [
    { customer: 'Comercial del Sur S.A.', amount: '$ 625,000', status: 'pending' },
    { customer: 'Distribuidora Norte', amount: '$ 480,000', status: 'pending' },
    { customer: 'Tecnología Andina', amount: '$ 0', status: 'paid' },
  ];
}
```

#### `demo-payment-schedule.component.html`

```html
<div class="demo-payment-schedule">
  <h3 class="demo-payment-schedule__month cba-text-heading-md">{{ monthYear }}</h3>

  <div
    class="demo-calendar"
    role="img"
    [attr.aria-label]="monthYear + ' calendar, day 15 selected'">
    @for (day of days; track day) {
      <div
        class="demo-calendar__day"
        [class.demo-calendar__day--selected]="day === 15"
        [attr.aria-current]="day === 15 ? 'date' : null">
        {{ day }}
      </div>
    }
  </div>

  <h3 class="demo-payment-schedule__heading cba-text-heading-md">Payments on {{ selectedDate }}</h3>

  <ul class="demo-payment-list">
    @for (payment of payments; track payment.customer) {
      <li class="demo-payment-list__item">
        <span class="demo-payment-list__customer">{{ payment.customer }}</span>
        <div class="demo-payment-list__meta">
          <span class="demo-payment-list__amount">{{ payment.amount }}</span>
          @switch (payment.status) {
            @case ('pending') {
              <cba-badge variant="warning" appearance="outline">Pending</cba-badge>
            }
            @case ('paid') {
              <cba-badge variant="success" appearance="outline">Paid</cba-badge>
            }
          }
        </div>
      </li>
    }
  </ul>
</div>
```

#### `demo-payment-schedule.component.scss`

```scss
// Demo-only payment schedule view. Uses theme tokens only.

:host {
  display: block;
}

.demo-payment-schedule {
  display: flex;
  flex-direction: column;
  gap: var(--cba-space-3);
}

.demo-payment-schedule__month,
.demo-payment-schedule__heading {
  margin: 0;
}

.demo-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--cba-space-1);
}

.demo-calendar__day {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  border-radius: var(--cba-radius-sm);
  font-size: var(--cba-font-size-small);
  color: var(--cba-text-primary);
}

.demo-calendar__day--selected {
  background-color: var(--cba-accent-primary);
  color: var(--cba-text-inverse);
  font-weight: 600;
}

.demo-payment-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.demo-payment-list__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--cba-space-2);
  padding: var(--cba-space-2) 0;
  border-bottom: 1px solid var(--cba-border-subtle);

  &:last-child {
    border-bottom: none;
  }
}

.demo-payment-list__meta {
  display: flex;
  align-items: center;
  gap: var(--cba-space-2);
}

.demo-payment-list__customer {
  font-size: var(--cba-font-size-body);
  color: var(--cba-text-secondary);
}

.demo-payment-list__amount {
  font-size: var(--cba-font-size-body);
  font-weight: 500;
  color: var(--cba-text-primary);
}
```

### 3. Update `demo-workspace.component.html`

In the **"New customer"** module, replace:

```html
<div class="demo-actions">
  <cba-button variant="primary" [icon]="faPlus">Add customer</cba-button>
  <cba-button variant="secondary" [icon]="faRefresh">Sync</cba-button>
</div>
```

with:

```html
<demo-customer-form />
```

In the **"Payment schedule"** module, replace:

```html
<p class="cba-text-body">Next payment: 2026-09-15</p>
```

with:

```html
<demo-payment-schedule />
```

### 4. Update `demo-workspace.component.ts`

- Add imports for the two new components.
- Remove `CbaButtonComponent` import (no longer used directly in this file).
- Remove `faPlus` and `faRefresh` imports (moved into `demo-customer-form`; `faDownload` remains for the **Export data** module).

Final file:

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { DemoCustomerFormComponent } from '../demo-customer-form/demo-customer-form.component';
import { DemoModuleCardComponent } from '../demo-module-card/demo-module-card.component';
import { DemoPaymentScheduleComponent } from '../demo-payment-schedule/demo-payment-schedule.component';
import { DemoTableComponent } from '../demo-table/demo-table.component';

/**
 * Demo-only workspace section rendering the module examples: six rows of
 * `demo-module-card` in 100% / 50% sizes, expanded / collapsed, with headers
 * and footers as described in the demo TODO.
 *
 * **NOT part of the public library API.** This component exists solely for
 * the `projects/demo/` mini-app and is not exported from `@cobranza-apps/ui`.
 */
@Component({
  selector: 'demo-workspace',
  standalone: true,
  imports: [
    DemoCustomerFormComponent,
    DemoModuleCardComponent,
    DemoPaymentScheduleComponent,
    DemoTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demo-workspace.component.html',
  styleUrl: './demo-workspace.component.scss',
})
export class DemoWorkspaceComponent {
  protected readonly faDownload = faDownload;
}
```

### 5. Update `demo-workspace.component.scss`

Remove the now-unused `.demo-actions` block. The remaining file:

```scss
// Demo-only workspace section — module examples rows. Uses theme tokens only.

:host {
  display: block;
}

.workspace {
  padding: var(--cba-space-3);
  display: flex;
  flex-direction: column;
  gap: var(--cba-space-3);
}

.workspace__row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--cba-space-3);
}
```

## Styling Architecture

- All colors, spacing, radius, shadows, and typography must use existing `--cba-*` tokens from `src/theme/_variables.scss`.
- Layouts are flexbox or CSS grid with token-based gaps and paddings.
- Demo-only class names are prefixed with `demo-` and scoped to the component SCSS.
- No new global utility classes or tokens are introduced.
- The `cba-text-heading-md` and `cba-text-small` utility classes are reused from the published theme utilities.

## Responsive / Layout Behavior

- Desktop-only, per `brief.md` §2.2 / §3.
- Both modules are 50 % width with `padding="sm"` (`--cba-space-2`).
- `cba-input` host is `display: block`, so each input fills the available width.
- Calendar grid uses 7 equal columns; day cells use `aspect-ratio: 1 / 1` to stay square.
- Payment rows use `justify-content: space-between` and wrap their right-side metadata in a flex container to keep amount + badge grouped.

## Accessibility

- `demo-customer-form`:
  - Uses a native `<form novalidate>`.
  - Each `cba-input` renders its own `<label for="id">` and `aria-describedby` wiring.
  - The submit button has visible text ("Add customer") and `type="button"` so it cannot accidentally submit.
  - No `(cbaClick)` handler is bound.
- `demo-payment-schedule`:
  - The calendar is a visual decoration, so it uses `role="img"` with a descriptive `aria-label`.
  - The selected day cell sets `aria-current="date"`.
  - Payments are rendered as an unordered list (`<ul>` / `<li>`) for screen-reader structure.
  - `cba-badge` renders `role="status"` and visible text, so status is not color-only.

## Performance

- Both new components use `OnPush`.
- No runtime subscriptions or heavy computations.
- Data is static arrays; Angular control-flow tracks by stable keys (`day` number and `payment.customer`).

## Acceptance Criteria

- [ ] `demo-customer-form` exists with the exact selector, imports, template, and SCSS specified above.
- [ ] `demo-payment-schedule` exists with the exact selector, imports, template, and SCSS specified above.
- [ ] `demo-workspace.component.html` projects `<demo-customer-form />` inside the "New customer" module and `<demo-payment-schedule />` inside the "Payment schedule" module.
- [ ] `demo-workspace.component.ts` no longer imports `CbaButtonComponent`, `faPlus`, or `faRefresh`, and imports the two new demo components.
- [ ] `demo-workspace.component.scss` no longer contains `.demo-actions`.
- [ ] All styling uses `--cba-*` tokens; no hard-coded colors or pixel values.
- [ ] `npm run build:lib` passes with zero errors.
- [ ] `npm run build:demo` passes with zero errors.
- [ ] `npm run lint` passes with zero errors.
- [ ] The "New customer" module renders a vertical 3-field form and an "Add customer" primary button with a plus icon.
- [ ] The "Payment schedule" module renders a September 2026 calendar with the 15th highlighted, the heading "Payments on 2026-09-15", and 2–3 payment rows with customer name, amount, and status badge.
