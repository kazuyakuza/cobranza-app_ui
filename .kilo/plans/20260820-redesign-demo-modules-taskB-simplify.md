# Task B — Code Simplification Plan

## Scope

Review the newly created demo-only components for the "New customer" and "Payment schedule" example modules:

- `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.{ts,html,scss}`
- `projects/demo/src/app/components/demo-payment-schedule/demo-payment-schedule.component.{ts,html,scss}`

## Simplification Opportunities

### 1. Redundant `type="text"` attributes in customer form

`CbaInputComponent` already defaults `type` to `'text'`. The `Name` and `Document` fields explicitly repeat `type="text"`, adding noise without changing behavior.

**Action:** Remove `type="text"` from the `Name` and `Document` inputs. Keep `type="email"` on the Email input.

**Files:**
- `demo-customer-form.component.html`

---

### 2. Overly complex `@switch` block for badge variants

The payment schedule template uses a 6-line `@switch` to map `payment.status` to a badge variant. This logic can live in the component model, reducing template branching to a single property binding.

**Action:**
1. Import `CbaBadgeVariant` from `@cobranza-apps/ui` in `demo-payment-schedule.component.ts`.
2. Add `readonly variant: CbaBadgeVariant` to the `DemoPayment` interface.
3. Populate the variant directly in the static `payments` array (`pending` -> `warning`, `paid` -> `success`).
4. Replace the `@switch` block in the template with:
   ```html
   <cba-badge [variant]="payment.variant" appearance="outline">
     {{ payment.status | titlecase }}
   </cba-badge>
   ```

**Files:**
- `demo-payment-schedule.component.ts`
- `demo-payment-schedule.component.html`

---

### 3. Magic number `15` for selected day

The selected day (`15`) is hard-coded in the template (`day === 15`), SCSS comment, and aria-label string. Extract it to a component constant so the selection logic is centralized and easier to adjust.

**Action:**
1. Add `protected readonly selectedDay = 15;` in `demo-payment-schedule.component.ts`.
2. Replace `day === 15` with `day === selectedDay` in the template.
3. Update the `aria-label` to reference `selectedDay` dynamically (or keep the static string in sync via the constant).
4. Update the file-level JSDoc comment from "with the 15th highlighted" to reference `selectedDay` if practical, or leave as-is.

**Files:**
- `demo-payment-schedule.component.ts`
- `demo-payment-schedule.component.html`

---

### 4. Custom text classes that duplicate utility classes

`.demo-payment-list__customer` and `.demo-payment-list__amount` both set `font-size: var(--cba-font-size-body)`, which is exactly what the `.cba-text-body` utility class provides. The customer name also applies `--cba-text-secondary`, which has a matching `.cba-text-secondary` utility.

**Action:**
1. Apply `class="cba-text-body cba-text-secondary"` to the customer `<span>` and remove `.demo-payment-list__customer` from SCSS.
2. Apply `class="cba-text-body demo-payment-list__amount"` to the amount `<span>` and remove `font-size` from `.demo-payment-list__amount` in SCSS.
3. Keep `.demo-payment-list__amount` only for `font-weight: 500` and `color: var(--cba-text-primary)`.

**Files:**
- `demo-payment-schedule.component.html`
- `demo-payment-schedule.component.scss`

---

### 5. Duplicated `:host { display: block; }` reset

Both new components declare `:host { display: block; }`. While correct, the repetition is a candidate for a shared base pattern. For now, this is acceptable because standalone demo components should not depend on a shared base class just for one rule.

**Action:** No change unless the project introduces a demo-only base component or shared mixin. Document as accepted duplication.

---

### 6. Calendar semantics can be lighter

The calendar grid uses `role="img"` with a static `aria-label`. A decorative calendar mockup does not need rich semantics, but the current label hardcodes the selected day.

**Action:** If Opportunity 3 is applied, build the `aria-label` from `monthYear` and `selectedDay` so the label stays consistent when either value changes.

**Files:**
- `demo-payment-schedule.component.html`

---

## Recommended Implementation Order

1. Apply Opportunity 3 (extract `selectedDay` constant).
2. Apply Opportunity 2 (move badge variant into model, drop `@switch`).
3. Apply Opportunity 4 (replace custom text classes with utilities).
4. Apply Opportunity 6 (dynamic aria-label, depends on 3).
5. Apply Opportunity 1 (remove redundant `type="text"`).
6. Run `npm run lint` and `npm run build:demo` to verify.

## What Is NOT Recommended

- Do **not** replace the static `days` array with a template-only `Array` constructor call — the component-level array keeps the template declarative and allows `readonly` typing.
- Do **not** introduce a shared demo base class or SCSS mixin solely to deduplicate `:host { display: block; }` — the indirection would cost more than the duplication.
- Do **not** remove the `novalidate` attribute from the form; it prevents native validation UI from appearing on the no-op submit button.

## Verification

After implementation, confirm:

- `npm run lint` passes with zero errors.
- `npm run build:demo` passes with zero errors.
- The rendered output matches the original design:
  - Customer form shows three inputs and a primary Add button.
  - Payment schedule shows a 7-column calendar with day 15 highlighted and a list of payments with status badges.
