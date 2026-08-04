# Code Simplification Plan — Task 1: Lighten Gray Theme

> **Workflow step:** 4.3 Code Review & Simplification (Critical Workflow)
> **TODO file:** `.agent/todos/20260803/20260803-todo-0.md`
> **Target file:** `src/theme/_variables.scss` (15 token values already updated)
> **Related files reviewed:** `src/theme/_base.scss`, `_mixins.scss`, `_utilities.scss`, `theme.scss`, `_modal.scss`, `_datepicker.scss`, `_accordion.scss`, `_popover.scss`, `_typeahead.scss`

## Findings

The token value update in `_variables.scss` is correct and minimal. However, the theme files contain a few small duplication/structure issues that can be cleaned up without changing any public token names or component behavior.

## Proposed Simplifications

### 1. Link `--cba-border-subtle` to the elevated surface color

**File:** `src/theme/_variables.scss`

Both `--cba-bg-elevated` and `--cba-border-subtle` are currently set to the identical hex `#aeb6bf`. This is a real duplication that makes future palette changes error-prone.

**Change:**

```scss
/* Before */
--cba-bg-elevated: #aeb6bf;
/* ... */
--cba-border-subtle: #aeb6bf;

/* After */
--cba-bg-elevated: #aeb6bf;
/* ... */
--cba-border-subtle: var(--cba-bg-elevated);
```

**Rationale:**

- Removes duplicate hex value.
- Documents the intentional relationship: "subtle borders share the elevated surface color".
- Keeps the token name unchanged, so the public API is unaffected.

### 2. Add section comments to `_variables.scss`

**File:** `src/theme/_variables.scss`

The current file is a flat list of 37 tokens. The project brief already shows grouped sections (Backgrounds, Text, Borders, Accents, Interactive states, Layout, Radius, Shadows, Spacing). Adding those section comments to the actual file improves self-documentation and makes future edits safer.

**Change:** Add concise section comments inside the `:root` block, e.g.:

```scss
:root {
  /* Backgrounds */
  --cba-bg-primary: #7a838d;
  --cba-bg-secondary: #8c95a0;
  --cba-bg-tertiary: #9da6b0;
  --cba-bg-elevated: #aeb6bf;
  --cba-bg-overlay: rgba(0, 0, 0, 0.32);

  /* Text */
  --cba-text-primary: #0f1115;
  --cba-text-secondary: #1e2329;
  --cba-text-muted: #2a2e35;
  --cba-text-inverse: #e8eaed;

  /* Borders */
  --cba-border-subtle: var(--cba-bg-elevated);
  --cba-border-default: #707880;
  --cba-border-strong: #4a5059;

  /* Accents */
  --cba-accent-primary: #3b82f6;
  --cba-accent-success: #22c55e;
  --cba-accent-warning: #f59e0b;
  --cba-accent-danger: #ef4444;
  --cba-accent-info: #06b6d4;

  /* Interactive states */
  --cba-hover: rgba(0, 0, 0, 0.06);
  --cba-active: rgba(0, 0, 0, 0.1);
  --cba-focus-ring: 0 0 0 3px rgba(59, 130, 246, 0.45);

  /* Layout constants */
  --cba-header-height: 56px;
  --cba-footer-height: 64px;
  --cba-module-header-min-height: 40px;

  /* Radius */
  --cba-radius-sm: 6px;
  --cba-radius-md: 10px;
  --cba-radius-lg: 14px;

  /* Shadows */
  --cba-shadow-module: 0 4px 16px rgba(0, 0, 0, 0.18);
  --cba-shadow-elevated: 0 8px 24px rgba(0, 0, 0, 0.25);

  /* Spacing scale */
  --cba-space-1: 4px;
  --cba-space-2: 8px;
  --cba-space-3: 12px;
  --cba-space-4: 16px;
  --cba-space-5: 20px;
  --cba-space-6: 24px;
  --cba-space-8: 32px;
}
```

**Rationale:**

- Matches the grouping already documented in the project brief.
- Makes it faster to locate and update related tokens.
- No token names or values change.

### 3. Reuse the `cba-focus-ring` mixin in `_base.scss`

**Files:**

- `src/theme/theme.scss` — import order
- `src/theme/_base.scss` — focus rules

`_base.scss` currently defines the same focus ring twice:

```scss
a {
  /* ... */
  &:focus-visible {
    outline: none;
    border-radius: var(--cba-radius-sm);
    box-shadow: var(--cba-focus-ring);
  }
}

button,
input,
textarea,
select,
a,
[tabindex]:not([tabindex='-1']) {
  &:focus-visible {
    outline: none;
    box-shadow: var(--cba-focus-ring);
  }
}
```

A reusable mixin `cba-focus-ring` already exists in `_mixins.scss`, but it is imported after `_base.scss` in `theme.scss`, so it cannot be used in `_base.scss`.

**Change:**

1. In `theme.scss`, move `@use 'mixins';` before `@use 'base';`:

   ```scss
   @use 'variables';
   @use 'mixins';
   @use 'base';
   @use 'modal';
   @use 'datepicker';
   @use 'popover';
   @use 'typeahead';
   @use 'accordion';
   @use 'utilities';
   ```

2. In `_base.scss`, replace the duplicated focus declarations with the mixin:

   ```scss
   a {
     color: var(--cba-accent-primary);
     text-decoration: none;

     &:hover {
       color: var(--cba-accent-info);
       text-decoration: underline;
     }

     &:focus-visible {
       border-radius: var(--cba-radius-sm);
       @include mixins.cba-focus-ring;
     }
   }

   button,
   input,
   textarea,
   select,
   a,
   [tabindex]:not([tabindex='-1']) {
     &:focus-visible {
       @include mixins.cba-focus-ring;
     }
   }
   ```

   **Note:** `_base.scss` will need to reference the mixin via the `mixins` namespace because `@use` is used in `theme.scss`. If the mixin is referenced directly without a namespace, the file should use `@use 'mixins' as *;` at the top of `_base.scss`, or the mixin call should be `mixins.cba-focus-ring` depending on the project's SCSS module convention.

**Rationale:**

- Eliminates duplication of `outline: none; box-shadow: var(--cba-focus-ring);`.
- Centralizes focus-ring behavior; future changes only touch `_mixins.scss`.
- No visual change.

### 4. (Optional) Audit whether `_base.scss` should live after mixins

**File:** `src/theme/theme.scss`

Moving `mixins` before `base` is required for suggestion 3. After this change, the import order remains logical: variables → mixins → base → components → utilities.

No further reordering is needed.

## What is NOT proposed

- **No new SCSS variables/functions for the 15 updated hex values.** The brief explicitly states token values are authoritative; adding derivation functions would reduce clarity.
- **No new public tokens.** The task scope is limited to existing `--cba-*` tokens.
- **No changes to component SCSS files beyond the focus-ring cleanup.** Other component files (`_modal.scss`, `_datepicker.scss`, `_accordion.scss`, `_popover.scss`, `_typeahead.scss`) already use tokens exclusively and have no redundant or unnecessary code that can be safely simplified without risking visual regression.
- **No structural rename of the theme folder.** The path mismatch between `src/theme/` (actual) and `src/lib/theme/` (brief/architecture) is a documentation/structure issue, not a simplification opportunity for this task.

## Verification steps after implementation

1. Run `npm run build` to ensure SCSS compiles cleanly.
2. Run `npm run lint` to confirm no lint errors.
3. Run `npm test` to confirm tests still pass.
4. Re-run the `--cba-text-muted` on `--cba-bg-primary` audit (grep across `src/theme/*.scss`) to confirm no new violations were introduced.
5. Visually confirm the focus ring and border-subtle appearance remain unchanged.

## Summary

- **1 duplication fix** in `_variables.scss`: link `--cba-border-subtle` to `--cba-bg-elevated`.
- **1 structure improvement** in `_variables.scss`: add section comments.
- **1 deduplication** across `theme.scss` + `_base.scss`: move `mixins` import earlier and use the existing `cba-focus-ring` mixin.
- **No token renames, no value changes, no new public tokens.**
