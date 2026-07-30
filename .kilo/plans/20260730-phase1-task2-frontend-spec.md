# Front-end Technical Specification — Phase 1, Task 2

## Utility Classes (`src/lib/theme/_utilities.scss`)

**Target project:** `@cobranza-apps/ui`  
**File path:** `src/lib/theme/_utilities.scss`  
**Scope:** Theme utility classes mapped to the `--cba-*` design tokens defined in `src/lib/theme/_variables.scss`.

---

## 1. Objective

Define the minimal, stable set of utility classes required to style the theme layer of the library. Every value must be expressed through the CSS custom properties from `_variables.scss` (`var(--cba-*)`) so that a single token update propagates to all utilities.

---

## 2. Constraints

- All CSS values must be authored as `var(--cba-<token>)`.
- No hard-coded hex, RGB, or pixel values are allowed inside the utility classes.
- Only utility classes that map to existing design tokens may be generated.
- Keep the set minimal and focused on the immediate needs of Phase 1 components; this is not a full Bootstrap-scale utility framework.

---

## 3. Background utilities

| Class | CSS property | Token variable |
| --- | --- | --- |
| `.cba-bg-primary` | `background-color` | `--cba-bg-primary` |
| `.cba-bg-secondary` | `background-color` | `--cba-bg-secondary` |
| `.cba-bg-tertiary` | `background-color` | `--cba-bg-tertiary` |
| `.cba-bg-elevated` | `background-color` | `--cba-bg-elevated` |

---

## 4. Text utilities

| Class | CSS property | Token variable |
| --- | --- | --- |
| `.cba-text-primary` | `color` | `--cba-text-primary` |
| `.cba-text-secondary` | `color` | `--cba-text-secondary` |
| `.cba-text-muted` | `color` | `--cba-text-muted` |
| `.cba-text-inverse` | `color` | `--cba-text-inverse` |

---

## 5. Border utilities

| Class | CSS property | Token variable |
| --- | --- | --- |
| `.cba-border-subtle` | `border-color` | `--cba-border-subtle` |
| `.cba-border-default` | `border-color` | `--cba-border-default` |
| `.cba-border-strong` | `border-color` | `--cba-border-strong` |

**Border width:** The border utilities are color-only and do not imply a border width. The library assumes Bootstrap 5 is present, so consumers combine these classes with Bootstrap helpers such as `.border` or `.border-1` to render the border line.

---

## 6. Radius utilities

| Class | CSS property | Token variable |
| --- | --- | --- |
| `.cba-radius-sm` | `border-radius` | `--cba-radius-sm` |
| `.cba-radius-md` | `border-radius` | `--cba-radius-md` |
| `.cba-radius-lg` | `border-radius` | `--cba-radius-lg` |

---

## 7. Shadow utilities

| Class | CSS property | Token variable |
| --- | --- | --- |
| `.cba-shadow-module` | `box-shadow` | `--cba-shadow-module` |
| `.cba-shadow-elevated` | `box-shadow` | `--cba-shadow-elevated` |

---

## 8. Spacing helpers

### 8.1 Strategy

Provide a minimal, numeric scale matching `--cba-space-*` tokens. The scale includes `1`, `2`, `3`, `4`, `5`, `6`, and `8` to align with the defined design-token scale.

Generate utilities for:

- Padding (`p`)
- Margin (`m`)

### 8.2 Generated class set

For each scale step `$scale` in `1, 2, 3, 4, 5, 6, 8`:

| Class | Property | Token variable |
| --- | --- | --- |
| `.cba-p-#{$scale}` | `padding` | `--cba-space-#{$scale}` |
| `.cba-m-#{$scale}` | `margin` | `--cba-space-#{$scale}` |

### 8.3 Implementation approach

Use a small SCSS loop over the allowed scale keys. The loop must emit the same token references as a hand-written class list:

```scss
$spacing-scales: 1, 2, 3, 4, 5, 6, 8;

@each $scale in $spacing-scales {
  .cba-p-#{$scale} {
    padding: var(--cba-space-#{$scale});
  }

  .cba-m-#{$scale} {
    margin: var(--cba-space-#{$scale});
  }
}
```

**No directional spacing helpers** (e.g., `mt-*`, `pr-*`) are included in this task. They can be added later when components explicitly require them.

---

## 9. Acceptance criteria

1. `src/lib/theme/_utilities.scss` exists and is compilable as part of the SCSS pipeline.
2. It contains all classes listed in Sections 3–8.
3. Every class references a `--cba-*` token variable; no literal colors or pixel values are present.
4. The file imports `_variables.scss` (or otherwise assumes it is loaded via `theme.scss`) so the custom properties are available.
5. No classes are added beyond the specified set unless a new task or TODO explicitly requests them.
6. `ng build`, `npm test`, and `npm run lint` continue to pass.

---

## 10. Dependencies

- `src/lib/theme/_variables.scss` must define the `--cba-*` tokens listed in the Project Brief, Section 5.
- `src/lib/theme/theme.scss` must import `_variables.scss` and `_utilities.scss` in the correct order.

---

## 11. Cross-references

- Project Brief — Section 5: Design Tokens (Theme) [`.agent/project-info/brief.md`].
- Phase 1, Task 1: Design tokens implementation in `_variables.scss`.
- Phase 1, Task 3: SCSS mixins in `_mixins.scss`.
