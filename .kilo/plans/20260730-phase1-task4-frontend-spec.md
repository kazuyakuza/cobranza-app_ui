# Phase 1, Task 4 — Front-end Technical Specification

## Theme Entry Point: `src/lib/theme/theme.scss`

**Scope:** Define the exact contents of the main theme entry point for `@cobranza-apps/ui`. This file aggregates the theme partials and makes the design-system consumable by the Shell and every MFE.

---

## 1. File path

```text
src/lib/theme/theme.scss
```

---

## 2. Import contract

The file **must** import the four theme partials in this exact order so that downstream partials can use tokens and mixins defined earlier:

1. `variables` — CSS custom properties (`--cba-*`).
2. `base` — baseline typography and element defaults (Task 5 creates `_base.scss`).
3. `mixins` — reusable Sass mixins that depend on variables.
4. `utilities` — opt-in utility classes that depend on variables and may use mixins.

### Required import block

```scss
@use 'variables';
@use 'base';
@use 'mixins';
@use 'utilities';
```

### Notes

- Use modern Sass `@use` syntax, **not** `@import`.
- Each partial is referenced without leading underscore or file extension.
- Sass loads the partials once; no explicit `@forward` is required for this top-level entry point.
- `_base.scss` does not exist yet at the time of this task; it will be created by Task 5. The entry point must include the `@use 'base';` line so the dependency is declared correctly.

---

## 3. Header comment

The file **must** begin with a short comment that explains the entry point and its consumer-facing purpose.

### Required comment text

```scss
// Main theme entry point for @cobranza-apps/ui.
// Imports variables, base typography, mixins, and utility classes in the correct order.
```

### Acceptance criteria

- Comment appears at the very top of the file.
- No commented-out code follows the comment.
- Comment is concise and describes the file's role and import order.

---

## 4. Full expected file contents

```scss
// Main theme entry point for @cobranza-apps/ui.
// Imports variables, base typography, mixins, and utility classes in the correct order.
@use 'variables';
@use 'base';
@use 'mixins';
@use 'utilities';
```

---

## 5. Consumer contract

- The Shell and each MFE import the theme by loading `src/lib/theme/theme.scss` (or the built package path).
- Loading this file once globally makes all `--cba-*` custom properties available on `:root`.
- Utility classes remain opt-in by applying the relevant `.cba-*` classes to elements.
- Mixins are consumed only by Sass consumers via `@use '@cobranza-apps/ui/theme' as theme;` or by importing the `_mixins` partial directly.

---

## 6. Verification checklist

| # | Check |
| --- | --- |
| 1 | File exists at `src/lib/theme/theme.scss`. |
| 2 | File starts with the required header comment. |
| 3 | File uses `@use` for all four partials. |
| 4 | Import order is `variables` → `base` → `mixins` → `utilities`. |
| 5 | No `@import` directives are present. |
| 6 | No unrelated global styles are added. |
| 7 | `npm run build` compiles the library without Sass errors. |

---

## 7. Dependencies on other Phase 1 tasks

| Partial | Created by | Dependency reason |
| --- | --- | --- |
| `_variables.scss` | Task 1 | Provides `--cba-*` tokens used by base, mixins, and utilities. |
| `_utilities.scss` | Task 2 | Uses variables. |
| `_mixins.scss` | Task 3 | Uses variables. |
| `_base.scss` | Task 5 | Provides baseline typography and element defaults. |

---

## 8. Related files

- `src/lib/theme/_variables.scss`
- `src/lib/theme/_base.scss`
- `src/lib/theme/_mixins.scss`
- `src/lib/theme/_utilities.scss`
- `ng-package.json` — ensures SCSS files are included in the library output.
- `README.md` / `docs/USAGE.md` — documents how consumers import the theme.
