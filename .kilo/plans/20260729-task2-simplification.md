# Task 2 — Code Simplification Plan: Theme Folder Skeleton

## Files Reviewed

- `src/lib/theme/_variables.scss`
- `src/lib/theme/_utilities.scss`
- `src/lib/theme/_mixins.scss`
- `src/lib/theme/theme.scss`

## Findings

### 1. `@use` order in `theme.scss` can be more dependency-aware

`utilities` may depend on both `variables` and `mixins`. Loading `utilities` before `mixins` is functionally valid for empty placeholders, but establishes a load order that does not reflect the dependency chain. A clearer order is:

1. `variables` (base tokens)
2. `mixins` (token consumers)
3. `utilities` (token/mixin consumers)

### 2. Placeholder comments are verbose and repetitive

Each partial repeats the same structure:

- Header comment naming the file.
- "Placeholder for Phase 0..." sentence.
- "No X are introduced in this phase." sentence.

These three sentences can be collapsed into one concise sentence without losing intent.

### 3. `theme.scss` header comment can be tightened

The entry-point comment explains what `@use` already communicates. It can be reduced to a single sentence stating the file's purpose.

## Proposed Changes

### `src/lib/theme/_variables.scss`

Replace the two placeholder sentences with one concise sentence.

```scss
//
// _variables.scss — design tokens for @cobranza-apps/ui.
//
// Phase 0 placeholder: tokens will be defined here in Phase 1.
//
```

### `src/lib/theme/_mixins.scss`

Replace the two placeholder sentences with one concise sentence.

```scss
//
// _mixins.scss — reusable SCSS mixins for @cobranza-apps/ui.
//
// Phase 0 placeholder: mixins will be defined here in Phase 1.
//
```

### `src/lib/theme/_utilities.scss`

Replace the two placeholder sentences with one concise sentence.

```scss
//
// _utilities.scss — theme utility classes and helpers for @cobranza-apps/ui.
//
// Phase 0 placeholder: utilities will be defined here in Phase 1.
//
```

### `src/lib/theme/theme.scss`

Tighten the header and reorder `@use` statements to reflect dependencies.

```scss
//
// theme.scss — @cobranza-apps/ui theme entry point.
//
@use 'variables';
@use 'mixins';
@use 'utilities';
```

## Files to Modify

- `src/lib/theme/_variables.scss`
- `src/lib/theme/_mixins.scss`
- `src/lib/theme/_utilities.scss`
- `src/lib/theme/theme.scss`

## What Was NOT Reviewed

- No logic, functions, or actual token values exist yet to simplify.
- No build/test verification performed; this is a planning-only review.
