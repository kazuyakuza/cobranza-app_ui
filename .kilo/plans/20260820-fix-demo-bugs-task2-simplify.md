# Task 2 Simplification Review — Header Search Input Centering

File reviewed: `projects/demo/src/app/app.component.scss`

## Suggestions

### 1. Remove redundant `width` from `.shell-header__center`

The `.shell-header__center` block already controls its width via flex and max-width:

```scss
.shell-header__center {
  flex: 0 1 $search-max-width;
  width: 50%;                 // redundant
  max-width: $search-max-width;
}
```

`width: 50%` is overridden by the explicit `flex-basis` (`$search-max-width`) inside the flex container and adds no effect. Remove it:

```scss
.shell-header__center {
  flex: 0 1 $search-max-width;
  max-width: $search-max-width;
}
```

### 2. Merge duplicated grid declarations

`.demo-input-grid` and `.demo-form-grid` share identical declarations:

```scss
.demo-input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax($input-grid-min, 1fr));
  gap: var(--cba-space-3);
}

.demo-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax($input-grid-min, 1fr));
  gap: var(--cba-space-3);
}
```

Combine them into a single rule to remove duplication:

```scss
.demo-input-grid,
.demo-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax($input-grid-min, 1fr));
  gap: var(--cba-space-3);
}
```

## Out of Scope

- No structural or architectural changes recommended.
- The `justify-content: flex-start` on `.shell-header__left` is redundant but kept as a style preference for symmetry with `.shell-header__right`.
