# Phase 4 Components — Simplification Plan

Reviewed all five presentational components (`button`, `badge`, `card`, `empty-state`, `skeleton`) against the simplification checklist. Several low-risk, clarity-preserving simplifications were identified.

## 1. Extract SCSS overlay mixins for button hover/active states

**Location:** `src/theme/_mixins.scss`, `src/components/button/cba-button.component.scss`

**Issue:** The gradient overlay for `:hover` and `:active` is duplicated across four button variants (`primary`, `secondary`, `danger`, `success`).

**Simplification:**

```scss
// _mixins.scss
@mixin cba-overlay-hover {
  &:hover {
    background-image: linear-gradient(var(--cba-hover), var(--cba-hover));
  }
}

@mixin cba-overlay-active {
  &:active {
    background-image: linear-gradient(var(--cba-active), var(--cba-active));
  }
}
```

Then invoke in button styles:

```scss
.cba-button--primary .cba-button__control {
  @include cba-overlay-hover;
  @include cba-overlay-active;
}
```

**Rationale:** Removes ~24 lines of repeated CSS, keeps token usage centralized, and makes future overlay changes single-point.

---

## 2. Simplify badge variant styles with CSS custom properties

**Location:** `src/components/badge/cba-badge.component.scss`

**Issue:** 12 near-identical rules (6 variants × 2 appearances) repeat `background-color`, `color`, and `border-color`.

**Simplification:** Use scoped private CSS custom properties for the variant/appearance color tokens, then one rule for `.cba-badge__content`.

```scss
.cba-badge {
  --_badge-bg: transparent;
  --_badge-color: var(--cba-text-muted);
  --_badge-border: transparent;

  &.cba-badge--solid.cba-badge--primary { --_badge-bg: var(--cba-accent-primary); --_badge-color: var(--cba-text-inverse); }
  // ... remaining variants

  &.cba-badge--outline.cba-badge--primary { --_badge-border: var(--cba-accent-primary); --_badge-color: var(--cba-accent-primary); }
  // ... remaining variants
}

.cba-badge__content {
  background-color: var(--_badge-bg);
  color: var(--_badge-color);
  border-color: var(--_badge-border);
}
```

**Rationale:** Reduces ~48 lines of repetitive CSS to ~18 lines, preserves the exact public class names and rendered output, and makes adding a new variant a one-line change.

---

## 3. Inline tiny type files into their component files

**Locations:**

- `src/components/button/button.types.ts` → merge into `src/components/button/cba-button.component.ts`
- `src/components/badge/badge.types.ts` → merge into `src/components/badge/cba-badge.component.ts`
- `src/components/skeleton/skeleton.types.ts` → merge into `src/components/skeleton/cba-skeleton.component.ts`

**Issue:** Each types file is 10–20 lines and exports only unions consumed by a single component. Keeping them separate adds file overhead without improving discoverability.

**Simplification:** Move the type unions and JSDoc into the component file, immediately above the component class. Update `index.ts` to remove the now-redundant `export * from './<name>.types'` line.

**Rationale:**

- Reduces file count by 3.
- Component + API types are co-located, which is easier for AI agents and reviewers.
- All resulting component files remain well under the 200-line limit (projected ~63–121 lines).
- Public API is unchanged because the barrel still exports the same symbols.

---

## 4. Consolidate button icon template branches

**Location:** `src/components/button/cba-button.component.html`

**Issue:** Two separate `@if` blocks render the leading and trailing icon with duplicated guard logic (`!loading() && icon()`).

**Simplification:** Render one icon element and drive position via class bindings:

```html
@if (!loading() && icon()) {
  <fa-icon
    class="cba-button__icon"
    [class.cba-button__icon--leading]="iconPosition() === 'leading'"
    [class.cba-button__icon--trailing]="iconPosition() === 'trailing'"
    [icon]="icon()!"
    aria-hidden="true" />
}
```

**Rationale:** Removes duplicated conditional logic while preserving both icon positions and the loading-only spinner behavior.

---

## 5. Move skeleton default dimensions from template to component

**Location:** `src/components/skeleton/cba-skeleton.component.ts`, `src/components/skeleton/cba-skeleton.component.html`

**Issue:** The template repeats `width() ?? '...'` and `height() ?? '...'` with variant-specific defaults inline, making the template noisy and defaults hard to scan.

**Simplification:** Add a private readonly `defaultDimensions` map and expose computed style signals:

```ts
private readonly defaultDimensions: Record<CbaSkeletonVariant, { width: string; height: string }> = {
  text: { width: '100%', height: '0.875rem' },
  avatar: { width: '2.5rem', height: '2.5rem' },
  card: { width: '100%', height: '6rem' },
  'table-row': { width: '100%', height: '1rem' },
  generic: { width: '100%', height: '1rem' },
};

protected readonly resolvedWidth = computed(() => this.width() ?? this.defaultDimensions[this.variant()].width);
protected readonly resolvedHeight = computed(() => this.height() ?? this.defaultDimensions[this.variant()].height);
```

Then bind `[style.width]="resolvedWidth()"` and `[style.height]="resolvedHeight()"` on the shared shape/line/cell elements. The `text` variant's short third line can keep its local `60%` override.

**Rationale:** Centralizes defaults in TypeScript, reduces template duplication, and makes the variant dimensions explicit and testable.

---

## 6. Extract shared test helpers

**Location:** New file `src/components/testing/test-helpers.ts` (or similar), used by specs.

**Issue:** `hostEl()` and class-list assertions are repeated across `cba-button.component.spec.ts`, `cba-badge.component.spec.ts`, and `cba-skeleton.component.spec.ts`. Variant-loop tests are structurally identical.

**Simplification:** Export small helpers:

```ts
export function hostEl(fixture: ComponentFixture<unknown>): HTMLElement {
  return fixture.nativeElement as HTMLElement;
}

export function queryByClass(fixture: ComponentFixture<unknown>, className: string): HTMLElement | null {
  return fixture.nativeElement.querySelector(`.${className}`);
}

export function expectVariantClass(
  fixture: ComponentFixture<{ variant?: string }>,
  variants: readonly string[],
  inputName: string,
): void {
  for (const v of variants) {
    fixture.componentRef.setInput(inputName, v);
    fixture.detectChanges();
    expect(hostEl(fixture).classList.contains(`${inputName.replace(/[A-Z]/g, '-$&').toLowerCase()}--${v}`)).toBe(true);
  }
}
```

Use them in the affected specs.

**Rationale:** Removes ~15–20 lines of duplicated boilerplate per spec and makes future component tests consistent.

---

## 7. Fix badge projection test to use real Angular projection

**Location:** `src/components/badge/cba-badge.component.spec.ts`

**Issue:** The "renders the projected badge content" test manually appends a DOM node to `fixture.nativeElement`, so it does not actually exercise `<ng-content>` projection.

**Simplification:** Add a host component:

```ts
@Component({
  standalone: true,
  imports: [CbaBadgeComponent],
  template: '<cba-badge><span class="badge-txt">Active</span></cba-badge>',
})
class BadgeWithContentHost {}
```

Then test projection through that host.

**Rationale:** Keeps the test honest and aligned with the other components' projection tests.

---

## 8. Optional: hard-coded typography values

**Location:** `src/components/button/cba-button.component.scss`, `src/components/badge/cba-badge.component.scss`, `src/components/empty-state/cba-empty-state.component.scss`

**Observation:** Several `font-size` values are hard-coded in rem (e.g., `0.8125rem`, `0.875rem`, `0.75rem`, `1rem`, `1.75rem`). The project constraints say not to introduce new tokens unless strictly necessary, and no typography scale tokens currently exist. Therefore **no action is recommended** for this phase, but the values should be converted to tokens if a typography scale is added later.

---

## Files expected to change

| File | Change |
|------|--------|
| `src/theme/_mixins.scss` | Add `cba-overlay-hover` and `cba-overlay-active` mixins |
| `src/components/button/cba-button.component.scss` | Use overlay mixins |
| `src/components/button/cba-button.component.html` | Consolidate icon branches |
| `src/components/button/cba-button.component.ts` | Inline `button.types.ts` |
| `src/components/button/index.ts` | Remove `button.types` export |
| `src/components/button/button.types.ts` | Delete |
| `src/components/badge/cba-badge.component.scss` | Use CSS custom properties for variants |
| `src/components/badge/cba-badge.component.ts` | Inline `badge.types.ts` |
| `src/components/badge/index.ts` | Remove `badge.types` export |
| `src/components/badge/badge.types.ts` | Delete |
| `src/components/badge/cba-badge.component.spec.ts` | Fix projection test |
| `src/components/skeleton/cba-skeleton.component.ts` | Inline `skeleton.types.ts`; add dimension helpers |
| `src/components/skeleton/cba-skeleton.component.html` | Use resolved width/height |
| `src/components/skeleton/index.ts` | Remove `skeleton.types` export |
| `src/components/skeleton/skeleton.types.ts` | Delete |
| `src/components/testing/test-helpers.ts` | New shared helpers |
| `src/components/button/cba-button.component.spec.ts` | Use shared helpers |
| `src/components/skeleton/cba-skeleton.component.spec.ts` | Use shared helpers |

## What is intentionally unchanged

- Public component selectors, inputs, outputs, and exported type names.
- Host class binding strategy for variants/sizes/appearances.
- Barrel files (`index.ts`) for each component.
- Standalone component architecture.
- All tests (except the one bug fix); none are redundant.
