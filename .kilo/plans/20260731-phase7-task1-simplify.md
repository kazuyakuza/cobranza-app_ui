# Task 1 — Code Simplification Plan for `CbaAccordion`

## Findings

The `CbaAccordion` implementation is already thin and correct, but a few files can be simplified without changing behaviour.

### 1. `_accordion.scss` — nest under `.cba-accordion`

**File:** `src/theme/_accordion.scss`

Every selector repeats the `.cba-accordion` prefix. Use SCSS nesting to remove repetition and reduce line count.

- Wrap the whole block under `.cba-accordion`.
- Replace child selectors (e.g., `.cba-accordion .accordion-button:hover`) with nested pseudo-classes (`&:hover`).
- Group the reduced-motion media query children into a single block:
  ```scss
  @media (prefers-reduced-motion: reduce) {
    .accordion-button,
    .accordion-collapse {
      transition: none;
    }
  }
  ```

Expected result: ~89 lines → ~70 lines, lower selector duplication, easier maintenance.

### 2. `cba-accordion.component.spec.ts` — consolidate input-forwarding tests

**File:** `src/components/accordion/cba-accordion.component.spec.ts`

Three tests (`closeOthers`, `destroyOnHide`, `animation`) share identical structure. Convert them to one `it.each` parameterized test.

- Define a helper `createAccordionHostFixture()` that creates the host and calls `detectChanges()` so each test stops duplicating that boilerplate.
- Parameter matrix:
  | property | initial | updated |
  | --- | --- | --- |
  | `closeOthers` | `false` | `true` |
  | `destroyOnHide` | `true` | `false` |
  | `animation` | `true` | `false` |

Expected result: removes ~35–40 lines of duplicated setup/assertions.

### 3. `cba-accordion.component.html` — use self-closing tag

**File:** `src/components/accordion/cba-accordion.component.html`

`<ng-content></ng-content>` can be written as `<ng-content />`. Change is cosmetic but consistent with modern Angular templates.

### 4. Optional — inline component SCSS

**File:** `src/components/accordion/cba-accordion.component.scss`

The file only contains `:host { display: block; }`. Consider moving it into the component's `styles: [':host { display: block; }']` metadata and removing the SCSS file. Only do this if the project convention accepts inline host styles; otherwise keep the separate file.

## Files NOT changed

- `cba-accordion.component.ts`: the thin wrapper, host directive wiring, and input/output passthroughs are already minimal. The long JSDoc is justified because it explains the non-obvious host-directive design decision.
- `index.ts`: barrel re-export is already as simple as possible.
- `public-api.ts`: export line is correctly placed and minimal.
- `.agent/project-structure.md`: entry is minimal and accurate.

## Recommendation

Apply findings 1 and 2 first — they deliver the biggest readability/line-count improvement. Apply finding 3 only if the project prefers self-closing `<ng-content>`. Apply finding 4 only if inline host styles align with project conventions.
