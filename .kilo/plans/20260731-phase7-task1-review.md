# Code Review — Task 1: `CbaAccordion` (Option A)

**Review scope:** Implementation of `CbaAccordion` per plan `.kilo/plans/20260731-phase7-task1-plan.md` and front-end spec `.kilo/plans/20260731-phase7-task1-frontend-spec.md`.

**Files reviewed:**
- `src/components/accordion/cba-accordion.component.ts`
- `src/components/accordion/cba-accordion.component.html`
- `src/components/accordion/cba-accordion.component.scss`
- `src/components/accordion/cba-accordion.component.spec.ts`
- `src/components/accordion/index.ts`
- `src/theme/_accordion.scss`
- `src/public-api.ts`
- `src/theme/theme.scss`
- `.agent/project-structure.md`

**Method:** Plan vs. source comparison, rule checks (max lines, max depth, max args, private members, no commented-out code, magic numbers), and `npm run lint`.

---

## Overall assessment

The implementation is **functionally correct** and closely follows the approved Option A plan. The component structure, host-directive wiring, signal inputs/outputs, `effect()` forwarding, SCSS token usage, barrel export, `public-api.ts` entry, `theme.scss` `@use`, and `project-structure.md` entry are all correct.

Linting passes with no errors.

Three minor issues/deviations were found and are detailed below. None of them are bugs, but the first two should be fixed to tighten plan adherence and test clarity.

---

## Findings

### 1. Minor deviation — component `imports` array is omitted

**Location:** `src/components/accordion/cba-accordion.component.ts`, `@Component` metadata.

**Plan requirement (section 2.1):** `imports: []` (explicitly empty) because the template only uses `<ng-content>` and projected directives are imported by the consumer.

**Implementation:** The `imports` property is omitted entirely.

**Impact:** Angular treats an omitted `imports` the same as `[]`, so the component compiles and works. However, it is a literal deviation from the plan and slightly less explicit for future maintainers.

**Recommendation:** Add `imports: []` to the `@Component` decorator.

---

### 2. Minor deviation — test host uses signals instead of plain values

**Location:** `src/components/accordion/cba-accordion.component.spec.ts`, `AccordionHost` class.

**Plan requirement (section 7.1):** The host fixture should use plain boolean fields:

```ts
class AccordionHost {
  closeOthers = false;
  destroyOnHide = true;
  animation = true;
  ...
}
```

**Implementation:** The host uses Angular signals and function calls in the template:

```ts
class AccordionHost {
  closeOthers = signal(false);
  destroyOnHide = signal(true);
  animation = signal(true);
  ...
}
```

with template bindings `[closeOthers]="closeOthers()"`, etc.

**Impact:** Functionally equivalent. The component's inputs are signal inputs and the test still correctly exercises reactive forwarding.

**Recommendation:** Either align the test host with the plan (plain values) or keep the signal-based version but document the deviation. Plain values are simpler and match the plan's intent that the consumer does not need to use signals.

---

### 3. Test assertion expands the disabled item and asserts it is expanded

**Location:** `src/components/accordion/cba-accordion.component.spec.ts`, last `it` block.

**Plan requirement (section 7.2, case 8):** The integration smoke test should:

1. Enable `closeOthers`.
2. Expand item 1.
3. Expand item 2's id.
4. Assert `isExpanded(<item1 id>) === false`.

The plan does **not** require asserting that item 2 is expanded.

**Implementation:** The fixture has the second item disabled (`[disabled]="true"`), and the test asserts:

```ts
expect(accordion.isExpanded(itemIds[1])).toBe(true);
```

where `itemIds[1]` is the disabled item.

**Impact:** This happens to pass because `NgbAccordionItem.expand()` does not check `disabled` (it only prevents user clicks), but the assertion is not in the plan and tests a non-obvious ng-bootstrap detail. It may confuse future maintainers who expect disabled items to stay collapsed.

**Recommendation:** Remove the `expect(accordion.isExpanded(itemIds[1])).toBe(true);` assertion to match the plan exactly, or restructure the fixture so that the second item is not disabled and the expansion assertion is self-explanatory.

---

## What is correct

- `selector: 'cba-accordion'`, `standalone: true`, `ChangeDetectionStrategy.OnPush`, `hostDirectives: [NgbAccordionDirective]`, and `host: { class: 'cba-accordion' }` match the plan.
- Signal inputs (`closeOthers`, `destroyOnHide`, `animation`) with correct defaults (`false`, `true`, `true`).
- Signal outputs (`show`, `shown`, `hide`, `hidden`) with `string` payloads.
- Constructor injects `NgbAccordionDirective` and calls `reemitAccordionEvents()` + `forwardInputsToNgbAccordion()`.
- `forwardInputsToNgbAccordion()` uses a single `effect()` that re-forwards all inputs reactively.
- `reemitAccordionEvents()` has flat, one-line subscriptions for all four events.
- Template is exactly `<ng-content></ng-content>`.
- Component SCSS is host-only (`:host { display: block; }`).
- Global `_accordion.scss` scopes all `.accordion-*` rules under `.cba-accordion` and uses the correct design tokens.
- `index.ts` barrel re-exports correctly.
- `public-api.ts` exports `components/accordion` in the correct alphabetical position.
- `theme.scss` loads `@use 'accordion';` in the correct order.
- `.agent/project-structure.md` entry is in the correct alphabetical position.
- JSDoc is comprehensive: responsibility split, host-directive rationale, no-item-component rationale, `@usageNotes` 3-item example, `@remarks`, and `@see` link.
- No commented-out code, no magic numbers, methods respect max lines/depth/args, and private members are preferred.

---

## Fix plan

1. `src/components/accordion/cba-accordion.component.ts` — add `imports: []` to `@Component` metadata.
2. `src/components/accordion/cba-accordion.component.spec.ts` — either:
   - (a) change `AccordionHost` to use plain boolean properties and template bindings without `()`; and
   - (b) remove the assertion that the disabled item is expanded, keeping only the plan-required `isExpanded(itemIds[0]) === false` assertion.

---

## Review conclusion

**No bugs or security issues found.** The implementation is a faithful, minimal wrapper around `ng-bootstrap` accordion. The three findings are small deviations from the plan's exact wording. Fixing them is recommended before the code-simplification and documentation steps.
