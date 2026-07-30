# Front-end Technical Specification — Phase 1, Task 1: Design Tokens

## Scope

Create the foundational theme file for `@cobranza-apps/ui` that defines the entire design token surface as CSS custom properties under the `:root` selector.

## Target File

- **Path:** `src/lib/theme/_variables.scss`
- **Selector scope:** `:root`
- **Prefix:** All tokens use the `--cba-` prefix.

## Token Catalogue

The file must contain the following CSS custom properties exactly as listed below. Values must not be renamed or changed unless explicitly requested by the design owner.

```scss
:root {
  /* Backgrounds */
  --cba-bg-primary: #2a2d32;
  --cba-bg-secondary: #34383e;
  --cba-bg-tertiary: #3e434a;
  --cba-bg-elevated: #454a52;
  --cba-bg-overlay: rgba(0, 0, 0, 0.55);

  /* Text */
  --cba-text-primary: #e8eaed;
  --cba-text-secondary: #b0b4ba;
  --cba-text-muted: #8b9098;
  --cba-text-inverse: #1a1d21;

  /* Borders */
  --cba-border-subtle: #4a4f57;
  --cba-border-default: #5a606a;
  --cba-border-strong: #6b7280;

  /* Accents */
  --cba-accent-primary: #3b82f6;
  --cba-accent-success: #22c55e;
  --cba-accent-warning: #f59e0b;
  --cba-accent-danger: #ef4444;
  --cba-accent-info: #06b6d4;

  /* Interactive states */
  --cba-hover: rgba(255, 255, 255, 0.06);
  --cba-active: rgba(255, 255, 255, 0.10);
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
  --cba-shadow-module: 0 4px 16px rgba(0, 0, 0, 0.28);
  --cba-shadow-elevated: 0 8px 24px rgba(0, 0, 0, 0.35);

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

## Typography Contract

- **Primary font stack:** `Inter, system-ui, sans-serif`
- **Base font size:** `14px`
- **Base line height:** `1.5`
- **Headings font weight:** `500–600`

Typography is a specification for consumers (Shell/MFEs) and future `_utilities.scss` / `theme.scss`; it is not represented as CSS custom properties in this file.

## Constraints & Rules

- All tokens must live under the `:root` selector.
- Every token name must begin with `--cba-`.
- No renaming, no additional tokens, and no mobile breakpoints are required for this task.
- The file is an SCSS partial (`_variables.scss`) and will be imported by `theme.scss` in a later task.
- The file must remain free of business logic, component styles, and utility classes.

## Acceptance Criteria

- `src/lib/theme/_variables.scss` exists and contains exactly the tokens above.
- Tokens are defined under the `:root` selector.
- All token names use the `--cba-` prefix.
- No placeholder comments remain.
- File passes project lint/build checks (e.g., `ng lint`, `ng build`) and Prettier/stylelint formatting if applicable.
