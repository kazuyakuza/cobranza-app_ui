# Task A — Code Simplification Plan

**Date:** 2026-08-12  
**Branch:** `feat/project-audit-and-fixes`  
**Scope:** Source files modified by Task A (commits C1–C6). Documentation files are out of scope for this simplification pass.  
**Goal:** Reduce duplication, improve token grouping, and standardize SCSS patterns without changing behaviour.

---

## 1. SCSS — Consolidate duplicated status colour rules

**Observation:**  
`src/components/module-header/module-header.component.scss` and `src/components/module-footer/module-footer.component.scss` both define status modifier colours with near-identical mappings:

```scss
.cba-module-header__status--loading { color: var(--cba-accent-info); }
.cba-module-header__status--loaded,
.cba-module-header__status--success { color: var(--cba-accent-success); }
.cba-module-header__status--warning { color: var(--cba-accent-warning); }
.cba-module-header__status--error { color: var(--cba-accent-danger); }
.cba-module-header__status--dirty { color: var(--cba-text-muted); }
```

```scss
.cba-module-footer__status--loading { color: var(--cba-accent-info); }
.cba-module-footer__status--loaded,
.cba-module-footer__status--success { color: var(--cba-accent-success); }
.cba-module-footer__status--warning { color: var(--cba-accent-warning); }
.cba-module-footer__status--error { color: var(--cba-accent-danger); }
.cba-module-footer__status--dirty { color: var(--cba-text-secondary); }
```

Only the `--dirty` colour differs (`text-muted` vs `text-secondary`).

**Recommendation:**  
Add a shared mixin or placeholder in `src/theme/_mixins.scss` that emits status colour rules for a given BEM block prefix and an optional dirty colour override. Example:

```scss
@mixin cba-status-colours($prefix, $dirty-color: var(--cba-text-muted)) {
  #{$prefix}--loading { color: var(--cba-accent-info); }
  #{$prefix}--loaded,
  #{$prefix}--success { color: var(--cba-accent-success); }
  #{$prefix}--warning { color: var(--cba-accent-warning); }
  #{$prefix}--error { color: var(--cba-accent-danger); }
  #{$prefix}--dirty { color: #{$dirty-color}; }
}
```

Then replace the duplicated blocks with:

```scss
// module-header
@include cba-status-colours('.cba-module-header__status');

// module-footer
@include cba-status-colours('.cba-module-footer__status', var(--cba-text-secondary));
```

**Benefit:** Eliminates ~10 lines of duplicated token references and guarantees the two components stay aligned when new status values are added.

---

## 2. SCSS — Nest `:host(.cba-module-header--fullscreen)` selectors

**Observation:**  
`src/components/module-header/module-header.component.scss` repeats the host selector:

```scss
:host(.cba-module-header--fullscreen) .cba-module-header {
  background-color: transparent;
  border-bottom: none;
  justify-content: center;
}

:host(.cba-module-header--fullscreen) .cba-module-header__section--title {
  flex: 0 1 auto;
}
```

**Recommendation:**  
Nest both rule sets under a single `:host(.cba-module-header--fullscreen)` block:

```scss
:host(.cba-module-header--fullscreen) {
  .cba-module-header {
    background-color: transparent;
    border-bottom: none;
    justify-content: center;
  }

  .cba-module-header__section--title {
    flex: 0 1 auto;
  }
}
```

**Benefit:** Removes redundant `:host(...)` prefixes and makes the fullscreen override read as one cohesive block.

---

## 3. SCSS — Standardize focus-visible on the existing mixin

**Observation:**  
Several components inline the focus-ring declaration:

- `src/components/button/cba-button.component.scss:19-22`
- `src/components/dropdown/cba-dropdown.component.scss:78-81`
- `src/components/modal/cba-modal.component.scss:55-58`
- `src/components/datepicker/cba-datepicker.component.scss:38-41`

Each repeats:

```scss
&:focus-visible {
  outline: none;
  box-shadow: var(--cba-focus-ring);
}
```

`src/components/module-header/module-header.component.scss` already uses `@include cba-focus-ring;` from the theme mixins.

**Recommendation:**  
Replace the inline declarations in the components above with `@include cba-focus-ring;`. This requires the files to `@use '../../theme/mixins' as *;` (button and dropdown currently do not import the mixins file).

**Benefit:** Single source of truth for the focus-ring treatment; future changes (e.g. offset, colour) happen in one place.

---

## 4. SCSS — Extract a shared transition timing token/mixin

**Observation:**  
The transition timing `120ms ease` is repeated:

- `src/components/button/cba-button.component.scss:16`
- `src/components/dropdown/cba-dropdown.component.scss:31`
- `src/components/module-header/module-header.component.scss:53`

**Recommendation:**  
Add a motion token and/or mixin to `src/theme/_variables.scss` or `src/theme/_mixins.scss`. Two equivalent options:

**Option A — token:**

```scss
--cba-transition-fast: 120ms ease;
```

Used as:

```scss
transition: background-color var(--cba-transition-fast), border-color var(--cba-transition-fast), color var(--cba-transition-fast);
```

**Option B — mixin:**

```scss
@mixin cba-transition($properties...) {
  $transitions: ();
  @each $property in $properties {
    $transitions: append($transitions, #{$property} 120ms ease, comma);
  }
  transition: $transitions;
}
```

Used as:

```scss
@include cba-transition(background-color, border-color, color);
```

**Benefit:** Enforces consistent micro-interaction timing across the library and makes motion-reduction overrides easier.

> **Deferral note:** If adding a new token, `src/components/testing/theme-fixtures.ts` and `docs/theme-preview.css` must be regenerated. Option A is preferred because it is simpler and does not require Sass logic.

---

## 5. SCSS / Tokens — Re-group new tokens in `_variables.scss`

**Observation:**  
In `src/theme/_variables.scss`:

1. `--cba-icon-size-md` is placed inside the Typography block but is not a typography step; it is an iconography size.
2. The `/* Layout (unchanged) */` comment is stale — the block now contains two new tokens (`--cba-module-footer-height`, `--cba-dropdown-min-width`).
3. `--cba-dropdown-min-width` is a component-specific sizing token sitting in the Layout group.

**Recommendation:**  

- Move `--cba-icon-size-md` into a dedicated `/* Iconography */` group immediately after the Typography block:

```scss
  /* Iconography — distinct from typography scale; used for decorative icon sizing. */
  --cba-icon-size-md: 1.75rem;
```

- Update the Layout group comment from `/* Layout (unchanged) */` to `/* Layout & component-specific sizing */`:

```scss
  /* Layout & component-specific sizing */
  --cba-header-height: 56px;
  --cba-footer-height: 64px;
  --cba-module-header-min-height: 40px;
  --cba-module-footer-height: 40px;
  --cba-dropdown-min-width: 12rem;
```

**Benefit:** Improves discoverability and keeps the token file honest about recent additions.

---

## 6. TypeScript — Host-class bindings are already minimal

**Observation:**  
`ModuleHeaderComponent` uses:

```ts
host: {
  class: 'cba-module-header',
  '[class.cba-module-header--fullscreen]': 'isFullscreen()',
},
```

`CbaModuleFooterComponent` uses:

```ts
host: {
  class: 'cba-module-footer',
},
```

**Recommendation:**  
No change. The host metadata is concise and idiomatic for Angular 17+. Introducing a shared host-class helper would add indirection without meaningful savings.

---

## 7. package.json / ng-package.json — Exports are appropriately explicit

**Observation:**  
`package.json` currently exposes `./theme` with three conditional exports:

```json
"exports": {
  "./theme": {
    "sass": "./theme/theme.scss",
    "style": "./theme/theme.scss",
    "default": "./theme/theme.scss"
  }
}
```

**Recommendation:**  
No change. A single `"./theme": "./theme/theme.scss"` entry would be shorter but would remove the conditional resolution that Sass-aware bundlers rely on. The explicit conditions are correct and self-documenting.

`ng-package.json` assets glob (`**/*.scss`) is also correct and should remain unchanged; narrowing it would break downstream Sass resolution of partials.

---

## 8. Optional — Auto-generate `EXPECTED_TOKENS` from `_variables.scss`

**Observation:**  
`src/components/testing/theme-fixtures.ts` maintains a hand-written `EXPECTED_TOKENS` record that must be kept in lock-step with `src/theme/_variables.scss`. The current Task A added three tokens and updated the fixture manually.

**Recommendation:**  
Defer. Auto-generating the fixture from `_variables.scss` (e.g. via a small Node script run at build/test time) would eliminate the manual step, but it is a tooling change that deserves its own task and test coverage. It is not a quick simplification.

---

## 9. Summary of recommended changes

| Priority | File(s) | Change |
|----------|---------|--------|
| High | `src/theme/_mixins.scss` | Add `cba-status-colours` mixin. |
| High | `src/components/module-header/module-header.component.scss` | Use shared status-colour mixin; nest `:host(--fullscreen)` rules. |
| High | `src/components/module-footer/module-footer.component.scss` | Use shared status-colour mixin. |
| Medium | `src/components/button/cba-button.component.scss` | Use `@include cba-focus-ring;` and add `@use '../../theme/mixins'`. |
| Medium | `src/components/dropdown/cba-dropdown.component.scss` | Use `@include cba-focus-ring;` and add `@use '../../theme/mixins'`. |
| Medium | `src/components/modal/cba-modal.component.scss` | Use `@include cba-focus-ring;` and add `@use '../../theme/mixins'`. |
| Medium | `src/components/datepicker/cba-datepicker.component.scss` | Use `@include cba-focus-ring;` (mixins already imported). |
| Low | `src/theme/_variables.scss` | Add `--cba-transition-fast` token (or defer to a motion-token task). |
| Low | `src/components/button/dropdown/module-header/*.scss` | Replace `120ms ease` with the transition token/mixin. |
| Low | `src/theme/_variables.scss` | Move `--cba-icon-size-md` to an `/* Iconography */` group and update Layout comment. |
| None | `package.json`, `ng-package.json` | Leave as-is. |
| None | `src/components/module-header/module-header.component.ts`, `src/components/module-footer/module-footer.component.ts` | Host bindings are already minimal; leave as-is. |

---

## 10. Verification steps (to run after implementation)

1. `npm run lint` — no SCSS/TSLint regressions.
2. `npm test -- src/components/module-header` — fullscreen and status tests pass.
3. `npm test -- src/components/module-footer` — status tests pass.
4. `npm run build:preview` and `npm test -- src/theme` — token/preview tests pass.
5. Visual regression sanity check: header/footer status colours and fullscreen header layout are unchanged.
