# Simplification Plan — Task B: Fix failing tests (module-header)

> TODO: `.agent/todos/20260820/20260820-todo-1.md` → section "Fix failing tests (module-header)"  
> Critical Workflow step 4.3 (Code Simplification) for Task B.  
> Target implementer: JUNIOR developer under 50% restriction.

## Scope

File under review: `src/components/module-header/module-header.component.spec.ts`

The implementation (commit `aa106841`) updated two `toHaveLength` assertions and one test name to reflect the new built-in drag button. The changes are correct, but the fixed counts are still magic numbers. This plan proposes small, safe simplifications that make the counts self-documenting and reduce duplication.

## Simplifications

### 1. Derive the built-in button count from `ACTION_CASES`

**Why:** The number `5` (and therefore `6`) is derived from `ACTION_CASES.length` (4 output-emitting buttons) plus the built-in drag button (1 non-emitting button). Encoding this relationship removes magic numbers and keeps the count correct if `ACTION_CASES` changes.

**Change:** Add a constant immediately after `ACTION_CASES`:

```ts
const BUILT_IN_BUTTON_COUNT = ACTION_CASES.length + 1;
```

The `+ 1` represents the built-in drag button, which intentionally does not emit an Angular output and is therefore excluded from `ACTION_CASES`.

**Then update the first test (lines 112-116):**

```ts
  it(`renders the ${BUILT_IN_BUTTON_COUNT} built-in action buttons when no drag handle is projected (empty slot)`, () => {
    setup();
    const navButtons = fixture.nativeElement.querySelectorAll('nav button');
    expect(navButtons).toHaveLength(BUILT_IN_BUTTON_COUNT);
  });
```

**And update the second test count (line 142):**

```ts
    expect(navButtons).toHaveLength(BUILT_IN_BUTTON_COUNT + 1);
```

The `+ 1` in the second assertion represents the projected drag handle rendered before the built-in buttons.

### 2. Extract the drag handle `aria-label` into a shared constant

**Why:** The label `"Arrastrar módulo"` is used in the `TestHostComponent` template and in two query selectors. A single constant prevents drift if the label ever changes.

**Change:** Add a constant near `ACTION_CASES`:

```ts
const DRAG_HANDLE_LABEL = 'Arrastrar módulo';
```

**Update the test host template (lines 22-31):**

```ts
  template: `
    <cba-module-header title="Host Module" [isFullscreen]="isFullscreen">
      <button
        type="button"
        cbaModuleDragHandle
        class="cba-module-header__action cba-module-header__action--drag"
        [attr.aria-label]="'${DRAG_HANDLE_LABEL}'">
      </button>
    </cba-module-header>
  `,
```

**Note:** Use `[attr.aria-label]` binding only if Angular evaluates the template expression in the test host context. If property binding inside a test host template string is awkward, keep the literal label in the template and use the constant only in the queries. The minimum acceptable simplification is to use `DRAG_HANDLE_LABEL` in the two `querySelector` calls.

**Update the projection queries (lines 138 and 150):**

```ts
const dragHandle = nav.querySelector(`button[aria-label="${DRAG_HANDLE_LABEL}"]`);
```

```ts
const dragHandle = hostFixture.nativeElement.querySelector(`button[aria-label="${DRAG_HANDLE_LABEL}"]`);
```

### 3. (Optional) Add a small helper for `nav button` queries

**Why:** The selector `'nav button'` is used in two different `describe` blocks. A helper removes duplication and gives the selector a name.

**Change:** Add a module-scoped helper after `queryButton`:

```ts
function queryNavButtons(nativeElement: HTMLElement): NodeListOf<HTMLButtonElement> {
  return nativeElement.querySelectorAll('nav button');
}
```

**Update the first test:**

```ts
    const navButtons = queryNavButtons(fixture.nativeElement);
```

**Update the second test:**

```ts
    const navButtons = queryNavButtons(nav);
```

This is optional because the selector is short and already readable. Apply only if the team prefers DRY test helpers.

## Files touched

| File | Change |
|------|--------|
| `src/components/module-header/module-header.component.spec.ts` | Add `BUILT_IN_BUTTON_COUNT` and optionally `DRAG_HANDLE_LABEL` / `queryNavButtons`; update two `toHaveLength` assertions and test names to use them. |

## Files NOT touched (out of scope)

- Component template, TS, or styles.
- `ACTION_CASES` content (only a derived count is added).
- Any other TODO task.

## Acceptance

- `npm run test` still passes with zero failures.
- `npm run lint` still passes with zero errors.
- No behavioral change; only readability/maintainability improvements.
