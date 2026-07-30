# Front-end Technical Specification — Phase 1, Task 3: Theme Mixins

**Project:** `@cobranza-apps/ui`  
**File:** `src/lib/theme/_mixins.scss`  
**Date:** 2026-07-30  
**Related:** [Project Brief §5](.agent/project-info/brief.md#5-design-tokens-theme), [TODO](../.agent/todos/20260729/20260729-todo-2.md)

## 1. Objective

Replace the placeholder `src/lib/theme/_mixins.scss` with a small, reusable set of SCSS mixins for the intermediate gray design system. All mixins must consume only `--cba-*` CSS custom properties defined in `src/lib/theme/_variables.scss`.

## 2. Target Technology

- **Language:** SCSS (Dart Sass)
- **Build:** Angular library build via `ng-packagr`
- **Import model:** Modern `@use` / `@forward`; `theme.scss` already imports the partial with `@use 'mixins';`
- **Encapsulation:** Mixins are opt-in; they do not emit any CSS on their own until invoked by a component or utility.

## 3. Required Mixins

### 3.1 `cba-focus-ring`

**Purpose:** Apply the standard keyboard-focus outline replacement used by all focusable controls.

**Required tokens:** `--cba-focus-ring`

**Exact SCSS:**

```scss
@mixin cba-focus-ring {
  outline: none;
  box-shadow: var(--cba-focus-ring);
}
```

**Notes:**

- `outline: none` removes the browser default; `box-shadow` replaces it with the theme's focus indicator.
- Consumers must ensure the element has sufficient contrast when focused.

### 3.2 `cba-elevated-surface`

**Purpose:** Style a raised surface (card, module, floating panel) using the elevated background, subtle border, medium radius and module shadow.

**Required tokens:** `--cba-bg-elevated`, `--cba-border-subtle`, `--cba-radius-md`, `--cba-shadow-module`

**Exact SCSS:**

```scss
@mixin cba-elevated-surface {
  background-color: var(--cba-bg-elevated);
  border: 1px solid var(--cba-border-subtle);
  border-radius: var(--cba-radius-md);
  box-shadow: var(--cba-shadow-module);
}
```

**Notes:**

- The `1px solid` border is intentional and matches the design token usage in `ModuleContainer` and `CbaCard`.
- Fullscreen modules should not use this mixin because they must drop the shadow and radius per the brief.

### 3.3 `cba-hover-surface`

**Purpose:** Add a uniform hover overlay to interactive surfaces (buttons, list rows, menu items).

**Required tokens:** `--cba-hover`

**Exact SCSS:**

```scss
@mixin cba-hover-surface {
  &:hover {
    background-color: var(--cba-hover);
  }
}
```

**Notes:**

- The mixin wraps the `:hover` pseudo-class so the consumer writes a single `@include` on the base selector.
- `--cba-hover` is a translucent white overlay (`rgba(255, 255, 255, 0.06)`); it is expected to layer over the element's own background.

## 4. Optional / Additional Mixins

No additional mixins are required for this task. Add new mixins only when a repeated pattern emerges across multiple components and the pattern clearly reduces duplication. Candidates for future extraction (not in scope now):

- `cba-active-surface` — uses `--cba-active`
- `cba-transition` — uses `--cba-*` motion tokens once defined

## 5. Constraints

- All declarations inside mixins must reference `var(--cba-*)` tokens.
- Do not hard-code colors, border widths, radii or shadows.
- Keep the file small; do not recreate Bootstrap utilities or component styles.
- Do not emit global CSS from this partial.

## 6. Acceptance Criteria

| # | Criterion |
| --- | --- |
| 1 | `src/lib/theme/_mixins.scss` exists and replaces the placeholder content. |
| 2 | The file defines `cba-focus-ring`, `cba-elevated-surface` and `cba-hover-surface` exactly as specified in §3. |
| 3 | Every property value uses a `var(--cba-*)` token from `_variables.scss`. |
| 4 | The file emits no CSS on its own; only `@mixin` declarations are present. |
| 5 | `theme.scss` continues to compile without errors after the partial is updated. |
| 6 | Library build (`npm run build`) succeeds with the updated SCSS. |

## 7. Verification Hints for 4.5a

- Confirm the file contains exactly the three mixins in §3 (plus optional future mixins only if explicitly justified).
- Search for any hard-coded hex/rgb/rgba values inside `_mixins.scss`; there should be none.
- Run `npm run build` and ensure no Sass compilation errors are reported.
- Confirm the file is imported via `@use 'mixins';` in `theme.scss`.
