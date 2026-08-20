# Code Review — Task 3: Button & Pill Showcase Fixes

**Review date:** 2026-08-20  
**Reviewer:** code-reviewer sub-agent  
**Scope:** Demo app only (`projects/demo/src/app/...`). No library files touched.  
**Implementation plan:** `.kilo/plans/20260820-fix-demo-bugs-task3.md`  
**Front-end spec:** `.kilo/plans/20260820-fix-demo-bugs-task3-frontend-spec.md`

---

## Files reviewed

- `projects/demo/src/app/components/demo-button-matrix/demo-button-matrix.component.ts`
- `projects/demo/src/app/components/demo-button-matrix/demo-button-matrix.component.scss`
- `projects/demo/src/app/components/demo-pill-matrix/demo-pill-matrix.component.ts`
- `projects/demo/src/app/components/demo-pill-matrix/demo-pill-matrix.component.scss`
- `projects/demo/src/app/components/demo-nav-items/demo-nav-items.component.ts`
- `projects/demo/src/app/components/demo-nav-items/demo-nav-items.component.scss`
- `projects/demo/src/app/app.component.ts`
- `projects/demo/src/app/app.component.html`
- `projects/demo/src/app/app.component.scss`

---

## Verification executed

| Command | Result |
| --- | --- |
| `npm run lint` | Passed |
| `npm run build:demo` | Passed |

---

## Findings

### 1. Plan adherence — mostly exact

All required transformations from the implementation plan are present:

- Button matrix renders a semantic `<table>` with `status | primary | secondary | ghost | danger | success` headers and a token-info row after each control row.
- Pill matrix mirrors the same table structure.
- Both matrix SCSS files use `.demo-matrix-table*` styles and add `border: 1px solid var(--cba-border-strong)` to `.demo-surface--primary`.
- `demo-nav-items` exposes `items` as a signal input with `DEFAULT_ITEMS` fallback; `NavItem` is exported.
- Footer uses `<demo-nav-items>` with `footerItems` (`Clientes`, `Deudas`, `Pagos`, `Reportes`).
- Size section renders two tables (`sm`/`md` × five variants) for buttons and pills.
- Missing `.demo-pill--secondary`, `.demo-pill--ghost`, `.demo-pill--danger`, `.demo-pill--success` modifiers are added to `app.component.scss`.
- `$size-row-gap` was removed; no unused-variable warning.

### 2. Required deviation for signal input (acceptable)

The plan's C.1.4 snippet specified:

```ts
protected readonly items = input<readonly NavItem[]>(DEFAULT_ITEMS);
```

This cannot work: a signal input must be **public** for a parent template to bind `[items]`, and the template must call `items()` because it is an `InputSignal`.

The implementer added a fix commit (`e6c687c`) that:

1. Removed `protected` so the input is public.
2. Changed the template from `@for (item of items; ...)` to `@for (item of items(); ...)`.

Both changes are necessary for the build to pass. They are minor local corrections, not scope expansion or architectural changes. Under the 50% implementer restriction this is acceptable.

### 3. Accessibility issue — footer nav accessible name

`app.component.html` places `aria-label="Module sections"` on the host element:

```html
<demo-nav-items
  class="shell-footer__pills demo-nav--large"
  [items]="footerItems"
  aria-label="Module sections" />
```

However, `demo-nav-items.component.ts` renders an internal `<nav class="demo-nav" aria-label="Demo navigation">`. Because the host custom element has no implicit role, the `aria-label="Module sections"` on `<demo-nav-items>` is effectively ignored by assistive technologies. The footer navigation is therefore announced as **"Demo navigation"** instead of the intended **"Module sections"**.

**Impact:** Footer landmark label does not match the design intent.  
**Recommendation:** Make the nav label configurable. Two acceptable approaches:

- Add an `ariaLabel` input to `DemoNavItemsComponent` and bind it to the internal `<nav>`:

  ```ts
  readonly ariaLabel = input<string>('Demo navigation');
  ```

  ```html
  <nav class="demo-nav" [attr.aria-label]="ariaLabel()">
  ```

  Then call:

  ```html
  <demo-nav-items [items]="footerItems" [ariaLabel]="'Module sections'" ... />
  ```

- Or remove the hardcoded `aria-label` from the internal `<nav>` and rely on the host attribute (less robust because the host has no semantic role).

This issue is a side effect of following the plan literally; the plan did not specify updating the component's internal `aria-label`.

### 4. Other checks

- No commented-out code found.
- No library files modified.
- No hardcoded secrets or security issues.
- Table markup uses proper `scope="col"` / `scope="row"`.
- `buttonTokenInfo` and `pillTokenInfo` switches are exhaustive for the current union types and build successfully.
- Unused footer icon imports (`faPlus`, `faRefresh`, `faDownload`) remain as instructed by the plan; lint does not flag them.

---

## 50% restriction assessment

The implementer stayed within scope. The only deviation from the literal plan was the signal-input access modifier and template call syntax, which were required for the code to compile. No architectural decisions, scope expansion, or unrelated file changes occurred.

---

## Conclusion

Implementation matches the plan and passes lint/build. The one required deviation is technically necessary. The only material issue is the footer navigation accessible name, which should be fixed by making the internal `<nav>` label configurable.
