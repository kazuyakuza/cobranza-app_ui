# Front-end Technical Specification — Task 1

## Add visual show/hide input for module header in container

### 1. Component input contract

Add a new signal input to `ModuleContainerComponent` (`src/components/module-container/module-container.component.ts`).

| Property | Name | Type | Default | JSDoc |
| --- | --- | --- | --- | --- |
| Signal input | `showHeader` | `boolean` | `true` | Visually hides the projected header band when `false`. The header element remains in the DOM; hiding is achieved through CSS via the `cba-module-container--header-hidden` host modifier. |

Implementation:

```ts
/**
 * Visually hides the projected header band when `false`.
 *
 * The header element (`.cba-module-container__header`) remains in the DOM;
 * hiding is achieved purely through CSS via the
 * `cba-module-container--header-hidden` host modifier. This keeps the
 * component's flex layout stable and avoids remounting the projected
 * `cba-module-header` when visibility toggles.
 *
 * @default true
 */
readonly showHeader = input<boolean>(true);
```

### 2. Host binding strategy

Add the host binding inside the existing `host` map, after the `scrollChaining` entry, using the same pattern as the other boolean modifiers.

```ts
host: {
  // ... existing bindings
  '[class.cba-module-container--header-hidden]': '!showHeader()',
},
```

Class name: `cba-module-container--header-hidden`.

### 3. SCSS selector and rule

In `src/components/module-container/module-container.component.scss`, append a new rule after the scroll-chaining block (line 113-115).

```scss
/* Task 1 — visual header visibility toggle (header stays in the DOM). */
:host(.cba-module-container--header-hidden) .cba-module-container__header {
  display: none;
}
```

Use the `:host(.modifier) .child` pattern per the AGENTS.md host-modifiers note. Do **not** use a plain descendant selector such as `.cba-module-container--header-hidden .cba-module-container__header`.

No template change is required; the header must stay in the DOM.

### 4. Unit tests

In `src/components/module-container/module-container.component.spec.ts` add a helper and one test case.

Add helper after the existing helpers:

```ts
function headerRegion(): Element | null {
  return fixture.nativeElement.querySelector('.cba-module-container__header');
}
```

Add test case after the scroll-chaining test:

```ts
it('renders the header by default and visually hides it when showHeader is false', () => {
  setup();
  expect(headerRegion()).not.toBeNull();
  expect(hostHasClass('cba-module-container--header-hidden')).toBe(false);

  fixture.componentRef.setInput('showHeader', false);
  fixture.detectChanges();

  // The header band must remain in the DOM; visibility is CSS-driven only.
  expect(headerRegion()).not.toBeNull();
  expect(hostHasClass('cba-module-container--header-hidden')).toBe(true);
});
```

### 5. Documentation update

Update `docs/CBA_MODULE_CONTAINER.md`.

#### Inputs table

Add a new row in the **Inputs** table after the `scrollChaining` row:

```markdown
| showHeader | `boolean` | `true` | no | When `false`, the header band is visually hidden via CSS (`display: none`). The header remains in the DOM. Adds the `cba-module-container--header-hidden` host modifier. |
```

#### New behaviour section

Add a new section after **Scroll behaviour** and before **Accessibility**:

```markdown
## Header visibility

By default the projected header band is visible.

When `showHeader === false`:

- The host receives the `cba-module-container--header-hidden` modifier.
- The header region (`.cba-module-container__header`) is hidden with `display: none` through the `:host(.cba-module-container--header-hidden) .cba-module-container__header` selector.
- The header element **remains in the DOM** — this is a visual toggle only, unlike the footer slot which is removed from the DOM when the module is collapsed.
```

#### Table of contents

Add `- [Header visibility](#header-visibility)` to the table of contents, after the **Scroll behaviour** entry.

### 6. Backward-compatibility note

The new input defaults to `true`, so existing consumers that do not bind `showHeader` will continue to render the projected header unchanged. No existing host class, template structure, or CSS rule is modified. The change is strictly additive.

### 7. Acceptance criteria

- `showHeader` input exists with default `true` and correct JSDoc.
- Host receives `cba-module-container--header-hidden` when `showHeader === false`.
- Header element stays in the DOM when `showHeader === false`.
- New SCSS rule uses `:host(.cba-module-container--header-hidden) .cba-module-container__header`.
- Unit test verifies default visibility, class toggle, and DOM retention.
- `docs/CBA_MODULE_CONTAINER.md` input table, TOC, and behaviour section are updated.
- `npm run test` and `npm run lint` remain passing.
