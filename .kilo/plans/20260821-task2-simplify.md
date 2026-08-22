# Task 2 Code Simplification Report — ModuleHeader

## Scope

Review `src/components/module-header/module-header.component.{ts,html,spec.ts}` and `docs/CBA_MODULE_HEADER.md` for simplification opportunities after the Task 2 implementation.

## Findings

### 1. Compound boolean conditions in the template (high)

**File:** `src/components/module-header/module-header.component.html`

The template uses multi-section boolean conditions, which violates the project's `single-section-boolean-conditions` rule and makes the template harder to scan.

- Line 2: `@if (!isFullscreen() && showStatus())`
- Line 21: `@if (!isFullscreen())`

**Suggestion:** introduce two computed signals in the component and replace the compound expressions.

```ts
// In ModuleHeaderComponent
readonly showStatusSection = computed<boolean>(() => !this.isFullscreen() && this.showStatus());
readonly showActionsSection = computed<boolean>(() => !this.isFullscreen());
```

```html
<!-- After -->
@if (showStatusSection()) { ... }
...
@if (showActionsSection()) { ... }
```

### 2. Null-coalescing in class binding (medium)

**File:** `src/components/module-header/module-header.component.html`, line 5

```html
[class]="statusClass() ?? ''"
```

The `?? ''` is noise. `statusClass()` can return an empty string when no modifier is needed.

**Suggestion:** update `statusClass()` to return `''` instead of `null`.

```ts
readonly statusClass = computed<string>(() => {
  const current = this.status();
  return current === null ? '' : `cba-module-header__status--${current}`;
});
```

```html
<!-- After -->
[class]="statusClass()"
```

### 3. Component file exceeds the 200-line limit (high)

**File:** `src/components/module-header/module-header.component.ts` — 217 lines.

The class-level JSDoc block duplicates content already present in `docs/CBA_MODULE_HEADER.md`. Trimming the redundant usage examples brings the file under the `max-lines-per-file` threshold without removing API information.

**Suggestion:** keep the summary paragraph, the i18n note, and the `@see` links; remove the two large `@usageNotes` code examples (basic usage and Shell wiring). Those examples are already covered in the docs, and the shorter JSDoc still links to them.

Approximately 30–35 lines can be removed this way.

### 4. Spec file exceeds the 200-line limit and contains redundant hide/show tests (high)

**File:** `src/components/module-header/module-header.component.spec.ts` — 233 lines.

Several tests come in hide/show pairs that differ only by the input value and the expectation. They can be collapsed into parameterized `it.each` cases.

**Affected areas:**

- Lines 118–143: `showStatus` false/true tests.
- Lines 154–178: `showTitle` false/true tests.
- Lines 145–152: status-null test is closely related to the `showStatus` matrix and can be merged.

**Suggestion A:** add small query helpers to remove repeated selectors.

```ts
function queryStatusSection(): HTMLElement | null {
  return fixture.nativeElement.querySelector('.cba-module-header__section--status');
}

function queryTitleSection(): HTMLElement | null {
  return fixture.nativeElement.querySelector('.cba-module-header__section--title');
}
```

**Suggestion B:** replace the paired tests with matrices.

```ts
interface VisibilityCase {
  readonly input: 'showStatus' | 'showTitle';
  readonly selector: '.cba-module-header__section--status' | '.cba-module-header__section--title';
  readonly value: boolean;
  readonly expectPresent: boolean;
}

const VISIBILITY_CASES: readonly VisibilityCase[] = [
  { input: 'showStatus', selector: '.cba-module-header__section--status', value: false, expectPresent: false },
  { input: 'showStatus', selector: '.cba-module-header__section--status', value: true, expectPresent: true },
  { input: 'showTitle', selector: '.cba-module-header__section--title', value: false, expectPresent: false },
  { input: 'showTitle', selector: '.cba-module-header__section--title', value: true, expectPresent: true },
];

it.each(VISIBILITY_CASES)(
  'sets $input=$value and $expectPresent ? "shows" : "hides" the section',
  ({ input, selector, value, expectPresent }) => {
    setup();
    if (input === 'showStatus') {
      fixture.componentRef.setInput('status', 'success');
    }
    fixture.componentRef.setInput(input, value);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector(selector);
    expect(section !== null).toBe(expectPresent);
  },
);
```

This removes roughly 40–50 lines and makes future visibility regressions easier to extend.

### 5. Status icon presence tests can be parameterized (medium)

**File:** `src/components/module-header/module-header.component.spec.ts`, lines 100–110 and 145–152.

Both tests verify that the status icon is rendered only when `status` is non-null. They can be merged into a single parameterized test.

**Suggestion:**

```ts
it.each([{ status: null as ModuleHeaderStatus | null, hasIcon: false }, { status: 'loading' as ModuleHeaderStatus, hasIcon: true }])(
  'renders status icon only when status is non-null (status=$status)',
  ({ status, hasIcon }) => {
    setup();
    fixture.componentRef.setInput('status', status);
    fixture.detectChanges();

    const icon = queryStatusSection()?.querySelector('fa-icon');
    expect(icon !== null).toBe(hasIcon);
  },
);
```

### 6. Drag-handle HTML comment duplicates docs (low)

**File:** `src/components/module-header/module-header.component.html`, lines 23–28.

The multi-line comment repeats the drag-handle contract already documented in `docs/CBA_MODULE_HEADER.md#drag-handle-slot`.

**Suggestion:** replace it with a one-line pointer comment.

```html
<!-- Projected drag handle; see docs/CBA_MODULE_HEADER.md#drag-handle-slot -->
<ng-content select="[cbaModuleDragHandle]"></ng-content>
```

### 7. Keep as-is (no action recommended)

- The five computed signals for collapse/size UI state (`collapseLabel`, `collapseIcon`, `sizeToggleLabel`, `sizeToggleIcon`, `sizeToggleTarget`) are small, named well, and make the template declarative. Inlining them would not improve readability.
- The `STATUS_VISUALS` mapping and `StatusVisual` interface are clear and self-documenting.
- `docs/CBA_MODULE_HEADER.md` is exempt from the 200-line source-code limit and reads well; do not shorten it.

## Recommended execution order

1. Add `showStatusSection()` and `showActionsSection()` computed signals and update the template.
2. Simplify `statusClass()` to return `''` and remove `?? ''` from the template.
3. Reduce the HTML drag-handle comment to one line.
4. Trim redundant JSDoc usage examples in `module-header.component.ts` to bring the file under 200 lines.
5. Add spec query helpers, then parameterize visibility and status-icon tests to bring the spec file under 200 lines.

## Expected outcome

- Both `module-header.component.ts` and `module-header.component.spec.ts` comply with the 200-line source-file rule.
- The template follows the single-section boolean condition rule.
- Test duplication is reduced without losing coverage.
- Documentation remains intact and references remain valid.
