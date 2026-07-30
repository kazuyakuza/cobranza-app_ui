# Phase 1 — Task 2 Simplification Plan

## Scope

Review `src/lib/theme/_utilities.scss` for redundancy and readability improvements after initial implementation.

## Current State

- File length: **89 lines** (within 200-line limit).
- Already uses one SCSS loop for spacing utilities (`$spacing-scales`).
- Background, text, border, radius, and shadow utilities are hand-written one class per line.
- No commented-out code.
- File header explains Bootstrap 5 peer-dependency expectation for border width.

## Findings

### 1. Duplicated Property Patterns

The following groups repeat the same CSS property with only the token suffix changing:

- **Backgrounds**: 4 classes, all `background-color: var(--cba-bg-<name>)`.
- **Text**: 4 classes, all `color: var(--cba-text-<name>)`.
- **Borders**: 3 classes, all `border-color: var(--cba-border-<name>)`.
- **Radius**: 3 classes, all `border-radius: var(--cba-radius-<name>)`.
- **Shadows**: 2 classes, all `box-shadow: var(--cba-shadow-<name>)`.

These can be collapsed into SCSS maps + `@each` loops without losing clarity.

### 2. Spacing Loop Already Follows Best Practice

The `$spacing-scales` list and `@each` block is a good, concise pattern. Keep it as-is.

### 3. Naming and Token Coupling

Each map key must match the token suffix exactly. This coupling is acceptable because the utility class name is intentionally derived from the token name (e.g. `.cba-bg-primary` ↔ `--cba-bg-primary`).

## Proposed Refactor

Replace hand-written blocks with five small SCSS maps and one loop per map:

```scss
$background-utilities: (
  primary: background-color,
  secondary: background-color,
  tertiary: background-color,
  elevated: background-color,
);

$text-utilities: (
  primary: color,
  secondary: color,
  muted: color,
  inverse: color,
);

// etc.
```

Then generate classes:

```scss
@each $name, $property in $background-utilities {
  .cba-bg-#{$name} {
    #{$property}: var(--cba-bg-#{$name});
  }
}
```

A more compact option groups token suffixes by property/prefix:

```scss
$utility-groups: (
  bg: (property: background-color, names: (primary, secondary, tertiary, elevated)),
  text: (property: color, names: (primary, secondary, muted, inverse)),
  border: (property: border-color, names: (subtle, default, strong)),
  radius: (property: border-radius, names: (sm, md, lg)),
  shadow: (property: box-shadow, names: (module, elevated)),
);

@each $prefix, $group in $utility-groups {
  $property: map-get($group, property);
  @each $name in map-get($group, names) {
    .cba-#{$prefix}-#{$name} {
      #{$property}: var(--cba-#{$prefix}-#{$name});
    }
  }
}
```

### Preferred Option

Use the **single nested map** approach. It:

- Reduces line count from ~70 hand-written declarations to ~20 lines of maps + one loop.
- Keeps all token suffixes visible in one place.
- Makes future additions (e.g. a new background token) a one-line change.
- Preserves generated class names and CSS output exactly.

## Trade-offs

| Concern | Impact |
|--------|--------|
| Readability | Slightly more abstract; the map structure must be self-documenting. |
| Generated output | Identical; no runtime change for consumers. |
| Maintainability | Better; new tokens require editing only the map entry. |
| Map nesting depth | Two levels (`$utility-groups` → `names` list); stays within max-depth rules if the loop body is extracted if needed. |

## Recommendation

1. Introduce `$utility-groups` map.
2. Replace background/text/border/radius/shadow blocks with the single nested `@each` loop.
3. Keep the spacing loop unchanged.
4. Keep the file header comment.
5. Verify the compiled CSS matches the current output.

## Not in Scope

- Changing token names or values (owned by `_variables.scss` and the project brief).
- Adding new utility categories (e.g. accent colors, hover states) — defer to component work.
- Modifying `_variables.scss` or `theme.scss`.
