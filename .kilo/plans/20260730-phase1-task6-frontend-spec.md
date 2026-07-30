# Phase 1 Task 6 — Theme Consumption Technical Specification

## 1. Objective

Make `src/lib/theme/theme.scss` available to consumers of `@cobranza-apps/ui` after the library is built with `ng-packagr`, while preserving the current design-token architecture:

- CSS variables (`--cba-*`) are emitted globally under `:root` when any theme file is loaded.
- Utility classes (`.cba-*`) are opt-in — they are generated only when the theme file is loaded, but they are not applied to elements automatically.
- Component styles inside the library can reuse the same token/mixin files.

## 2. Current State

- `ng-package.json` only declares the `dest` and the public API entry file:

  ```json
  {
    "$schema": "./node_modules/ng-packagr/ng-package.schema.json",
    "dest": "./dist",
    "lib": {
      "entryFile": "src/lib/public-api.ts"
    }
  }
  ```

- `package.json` has no `exports` field.
- Theme files are in `src/lib/theme/`:
  - `theme.scss` — entry point (`@use 'variables'; @use 'base'; @use 'mixins'; @use 'utilities';`)
  - `_variables.scss`, `_base.scss`, `_mixins.scss`, `_utilities.scss` — partials
- `theme.scss` is not copied to `dist/` because `ng-packagr` does not emit arbitrary SCSS files unless they are declared as assets.

## 3. Required `ng-package.json` Changes

Add two configuration items under the `lib` section:

1. **`assets`** — copy every theme SCSS file into the distributable package.
2. **`styleIncludePaths`** — make `src/lib/theme` a Sass load path so component styles can do `@use 'variables';` / `@use 'mixins';`.

```json
{
  "$schema": "./node_modules/ng-packagr/ng-package.schema.json",
  "dest": "./dist",
  "assets": [
    {
      "glob": "**/*.scss",
      "input": "src/lib/theme",
      "output": "theme"
    }
  ],
  "lib": {
    "entryFile": "src/lib/public-api.ts",
    "styleIncludePaths": ["src/lib/theme"]
  }
}
```

### Resulting `dist/` layout

```
dist/
  ... Angular bundle artifacts ...
  theme/
    theme.scss
    _variables.scss
    _base.scss
    _mixins.scss
    _utilities.scss
```

Because the partials are copied to the same directory as `theme.scss`, the relative `@use` statements inside `theme.scss` remain valid in the published package.

## 4. Required `package.json` Changes

Add an explicit subpath export for the theme so Node-based Sass resolution and modern bundlers can discover it. `ng-packagr` merges the `exports` field with the auto-generated root export.

```json
{
  "name": "@cobranza-apps/ui",
  "version": "0.2.0",
  ...
  "exports": {
    "./theme": {
      "sass": "./theme/theme.scss"
    }
  },
  ...
}
```

Do not change the root `.` export — `ng-packagr` owns that.

## 5. Consumer Import Path

### Recommended import

```scss
// In the Shell or any MFE global styles.scss
@use '@cobranza-apps/ui/theme';
```

This resolves to `node_modules/@cobranza-apps/ui/theme/theme.scss` (via package subpath resolution or the `exports` field). The file loads:

- `_variables.scss` → emits the global `:root` custom properties.
- `_base.scss` → emits global typography and focus defaults.
- `_mixins.scss` → emits no CSS until invoked.
- `_utilities.scss` → emits the opt-in `.cba-*` utility classes.

### Fallback / concrete path

If the consumer's Sass setup does not support package subpath imports, use the explicit file:

```scss
@use '@cobranza-apps/ui/theme/theme';
```

### Partial imports (advanced)

A consumer can import only the token/mixin files it needs:

```scss
@use '@cobranza-apps/ui/theme/variables'; // only CSS variables
@use '@cobranza-apps/ui/theme/mixins';    // only mixins, no emitted CSS
```

## 6. Encapsulation Rules

- **Global styles** are limited to:
  - `:root` custom properties (`_variables.scss`).
  - Root typography and sensible element defaults (`_base.scss`).
  - Focus-ring defaults for interactive elements (`_base.scss`).
- **Utility classes** (`_utilities.scss`) are generated but never applied to markup unless the consumer explicitly adds `.cba-*` classes.
- **Mixins** (`_mixins.scss`) emit no CSS by themselves; they are invoked by component styles or the consumer.

## 7. Documentation Snippet

Add the following section to `README.md` and/or a `docs/THEME.md` file:

```markdown
## Importing the theme

The `@cobranza-apps/ui` theme is published as SCSS. Import it once in your
application's global styles (usually `styles.scss`):

```scss
@use '@cobranza-apps/ui/theme';
```

This makes all `--cba-*` CSS variables available on `:root` and opt-in
`.cba-*` utility classes available.

### Utility classes

- Background: `.cba-bg-primary`, `.cba-bg-secondary`, `.cba-bg-tertiary`, `.cba-bg-elevated`
- Text: `.cba-text-primary`, `.cba-text-secondary`, `.cba-text-muted`, `.cba-text-inverse`
- Border: `.cba-border-subtle`, `.cba-border-default`, `.cba-border-strong`
- Radius: `.cba-radius-sm`, `.cba-radius-md`, `.cba-radius-lg`
- Shadow: `.cba-shadow-module`, `.cba-shadow-elevated`
- Spacing: `.cba-p-1` … `.cba-p-8`, `.cba-m-1` … `.cba-m-8`

### Mixins

```scss
@use '@cobranza-apps/ui/theme/mixins';

.my-button {
  @include mixins.cba-focus-ring;
}
```
```

## 8. Acceptance Criteria

1. After `npm run build`, `dist/theme/theme.scss` exists and all theme partials are present in `dist/theme/`.
2. `theme.scss` in `dist/theme/` compiles without errors when imported via `@use '@cobranza-apps/ui/theme';
3. The published package exposes the documented import path.
4. Utility classes remain opt-in (they are generated only as classes, not applied globally).
5. CSS variables are emitted under `:root` once the theme file is loaded.

## 9. Files Affected

- `ng-package.json` — add `assets` and `styleIncludePaths`.
- `package.json` — add `exports["./theme"]`.
- `README.md` / `docs/` — add consumer import documentation.

## 10. Risks / Notes

- `ng-packagr` will overwrite `dist/` on each build; the asset copy is deterministic.
- Adding `exports` to `package.json` restricts subpath access. Only add the `./theme` subpath; all Angular symbols remain reachable through the root entry generated by `ng-packagr`.
- `styleIncludePaths` only affects the library build; it does not change the consumer import path.
