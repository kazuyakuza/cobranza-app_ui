# Code Simplification Plan — Task C (Round 3)

**Scope:** Review commit `b57c7c0` (`fix(theme): update token values and canonical fixtures for typography scale`) for SCSS simplification opportunities. No file modifications in this step.

**Files reviewed:**
- `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.scss`
- `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.html`
- `src/components/button/cba-button.component.scss`
- `src/components/form-field/cba-field.component.scss`
- `src/theme/_mixins.scss`
- `src/theme/_variables.scss`
- Documentation/markdown files and `src/components/testing/theme-fixtures.ts` (token-only updates, no SCSS logic changes).

---

## Simplification 1 — Extract shared button overlay behavior into a mixin

**File:** `src/components/button/cba-button.component.scss`

**Observation:** The secondary variant re-implements the same gradient-overlay hover/active pattern that already exists inside `cba-solid-button`, only with the light-surface overlay tokens (`--cba-hover`, `--cba-active`) instead of the inverse tokens.

**Current code:**

```scss
@mixin cba-solid-button($accent-color) {
  background-color: $accent-color;
  color: var(--cba-text-inverse);

  &:hover {
    background-image: linear-gradient(var(--cba-hover-inverse), var(--cba-hover-inverse));
  }

  &:active {
    background-image: linear-gradient(var(--cba-active-inverse), var(--cba-active-inverse));
  }
}

:host(.cba-button--secondary) .cba-button__control {
  background-color: var(--cba-bg-secondary);
  border-color: var(--cba-border-default);
  color: var(--cba-text-primary);

  &:hover {
    background-image: linear-gradient(var(--cba-hover), var(--cba-hover));
  }

  &:active {
    background-image: linear-gradient(var(--cba-active), var(--cba-active));
  }
}
```

**Suggested change:** Introduce a `cba-button-overlay` mixin that receives the hover and active overlay tokens, then use it in both `cba-solid-button` and the secondary variant. This removes the inline duplication and makes the overlay pattern consistent across all variants.

**Target code:**

```scss
@mixin cba-button-overlay($hover-overlay, $active-overlay) {
  &:hover {
    background-image: linear-gradient(var($hover-overlay), var($hover-overlay));
  }

  &:active {
    background-image: linear-gradient(var($active-overlay), var($active-overlay));
  }
}

@mixin cba-solid-button($accent-color) {
  background-color: $accent-color;
  color: var(--cba-text-inverse);
  @include cba-button-overlay(--cba-hover-inverse, --cba-active-inverse);
}

:host(.cba-button--secondary) .cba-button__control {
  background-color: var(--cba-bg-secondary);
  border-color: var(--cba-border-default);
  color: var(--cba-text-primary);
  @include cba-button-overlay(--cba-hover, --cba-active);
}
```

**Impact:** Removes duplicated gradient declarations, centralizes the overlay technique, and makes future variants follow the same pattern without re-typing the gradient.

---

## Simplification 2 — Centralize the 2px state-border pattern in `cba-field`

**File:** `src/components/form-field/cba-field.component.scss`

**Observation:** The valid and invalid/error state selectors both declare `border: 2px solid var(--cba-state-*-border)`. The intent — "state borders are 2px solid" — is implicit and repeated.

**Current code:**

```scss
.cba-field--valid .cba-field__control {
  border: 2px solid var(--cba-state-valid-border);
}

.cba-field--error .cba-field__control,
.cba-field--invalid .cba-field__control {
  border: 2px solid var(--cba-state-invalid-border);
}
```

**Suggested change:** Introduce a small local mixin `cba-field-state-border($token)` that documents the 2px-solid state convention and reuse it for both states.

**Target code:**

```scss
@mixin cba-field-state-border($token) {
  border: 2px solid var($token);
}

.cba-field--valid .cba-field__control {
  @include cba-field-state-border(--cba-state-valid-border);
}

.cba-field--error .cba-field__control,
.cba-field--invalid .cba-field__control {
  @include cba-field-state-border(--cba-state-invalid-border);
}
```

**Impact:** Makes the "2px solid state border" rule explicit and reusable; future states (e.g., warning) can reuse the mixin instead of duplicating the declaration.

---

## Simplification 3 — Clarify the focus-state transition

**File:** `src/components/form-field/cba-field.component.scss`

**Observation:** The control transition currently reads:

```scss
transition: border-color 120ms ease, box-shadow 120ms ease;
```

After the change to 2px solid borders for valid/invalid, the border width now changes between states, but `border-width` is not listed in the transition. The shorthand `border` in the state rules does change `border-color` too, so the color transition still runs, yet the width change is abrupt.

**Suggested change:** Expand the transition to include `border-width` so the visual change is consistent with what the CSS now animates:

```scss
transition: border-color 120ms ease, border-width 120ms ease, box-shadow 120ms ease;
```

**Impact:** Aligns the transition declaration with the actual properties that change across states, producing a smoother state change and clearer intent.

---

## Simplification 4 — Keep demo form SCSS minimal

**File:** `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.scss`

**Observation:** The form and actions blocks already use theme tokens exclusively and are already concise. No structural duplication or redundant rules were found.

**Suggested change:** None. Leave the file unchanged.

---

## Implementation order

1. Apply **Simplification 1** in `cba-button.component.scss`.
2. Apply **Simplification 2** and **Simplification 3** in `cba-field.component.scss`.
3. Leave the demo form, mixins, variables, docs, and fixture files unchanged.
4. Run `npm run lint` and `npm run test` to verify the SCSS still compiles and no selectors broke.
