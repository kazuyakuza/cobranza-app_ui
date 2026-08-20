<!--
  FILE: 20260820-fix-demo-issues-round3-taskC-frontend-spec.md
  PURPOSE: Front-end Technical Specification for Task C — Demo/UI styling fixes round 3.
  SCOPE: Sub-task 1 form overflow, Sub-task 2 input field styling, Sub-task 3 cancel button + button variant contrast, Sub-task 4 typography scale bump.
  AUDIENCE: Implementer (Junior, 50% restriction), Code Reviewer, Architector.
-->

# Task C — Front-end Technical Specification

## Overview

This spec groups four styling sub-tasks for the `@cobranza-apps/ui` Angular library and its demo app:

1. Fix "New customer" form overflow / horizontal scrolling in 50% modules.
2. Redesign input field styling (elevated background, slate-blue focus border, thicker valid/invalid borders).
3. Add a cancel button to the "New customer" form and fix secondary/ghost button contrast on demo surfaces.
4. Increase the typography scale by one step and sync every downstream reference.

All changes are visual-only; no component TypeScript contracts, selectors, or public APIs change.

---

## 1. Sub-task 1 — Form overflow / scrolling

### Problem

The demo "New customer" form renders inside a 50% width module body with 8 px horizontal padding. The form and field control currently rely on default `box-sizing: content-box`, so `width: 100%` plus padding/border can exceed the available width and trigger a horizontal scrollbar.

### Required changes

#### 1.1 Demo form — `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.scss`

Add to `.demo-customer-form`:

```scss
.demo-customer-form {
  display: flex;
  flex-direction: column;
  gap: var(--cba-space-3);
  max-width: 100%;
  box-sizing: border-box;
}
```

Current state (lines 7–11):

```scss
.demo-customer-form {
  display: flex;
  flex-direction: column;
  gap: var(--cba-space-3);
}
```

#### 1.2 Shared field control — `src/components/form-field/cba-field.component.scss`

Add `box-sizing: border-box` to `.cba-field__control` (line 17).

Current state:

```scss
.cba-field__control {
  display: block;
  background-color: var(--cba-bg-secondary);
  border: 1px solid var(--cba-border-default);
  border-radius: var(--cba-radius-sm);
  transition: border-color 120ms ease, box-shadow 120ms ease;
}
```

Proposed state (background change is captured in Sub-task 2):

```scss
.cba-field__control {
  display: block;
  box-sizing: border-box;
  background-color: var(--cba-bg-elevated);
  border: 1px solid var(--cba-border-default);
  border-radius: var(--cba-radius-sm);
  transition: border-color 120ms ease, box-shadow 120ms ease;
}
```

#### 1.3 Native control reset — `src/theme/_mixins.scss`

Add `box-sizing: border-box` to `%cba-native-control` (line 16).

Current state:

```scss
%cba-native-control {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: inherit;
  font: inherit;
  padding: var(--cba-space-2) var(--cba-space-3);
}
```

Proposed state:

```scss
%cba-native-control {
  width: 100%;
  box-sizing: border-box;
  background: transparent;
  border: none;
  outline: none;
  color: inherit;
  font: inherit;
  padding: var(--cba-space-2) var(--cba-space-3);
}
```

### Verification target

- A 50% module with `padding: 8px` on the body renders the form at exactly the available width.
- No horizontal scrollbar appears at any demo viewport width.
- Inputs fill the control width without exceeding the module boundaries.

---

## 2. Sub-task 2 — Input field styling

### Required changes

#### 2.1 Library — `src/components/form-field/cba-field.component.scss`

Change `.cba-field__control` background:

- From: `background-color: var(--cba-bg-secondary);`
- To: `background-color: var(--cba-bg-elevated);`

Change `:focus-within` border color:

- From: `border-color: var(--cba-accent-primary);`
- To: `border-color: var(--cba-accent-info);` (`#56717E`, slate blue)

Increase valid/invalid border thickness:

- `.cba-field--valid .cba-field__control`:
  - From: `border-color: var(--cba-state-valid-border);`
  - To: `border: 2px solid var(--cba-state-valid-border);`
- `.cba-field--error .cba-field__control, .cba-field--invalid .cba-field__control`:
  - From: `border-color: var(--cba-state-invalid-border);`
  - To: `border: 2px solid var(--cba-state-invalid-border);`

The `:focus-within` `box-shadow: var(--cba-focus-ring)` remains unchanged.

Current affected lines (17–27 and 49–56):

```scss
.cba-field__control {
  display: block;
  background-color: var(--cba-bg-secondary);
  border: 1px solid var(--cba-border-default);
  border-radius: var(--cba-radius-sm);
  transition: border-color 120ms ease, box-shadow 120ms ease;

  &:focus-within {
    border-color: var(--cba-accent-primary);
    box-shadow: var(--cba-focus-ring);
  }
}
```

```scss
.cba-field--valid .cba-field__control {
  border-color: var(--cba-state-valid-border);
}

.cba-field--error .cba-field__control,
.cba-field--invalid .cba-field__control {
  border-color: var(--cba-state-invalid-border);
}
```

Proposed affected lines:

```scss
.cba-field__control {
  display: block;
  box-sizing: border-box;
  background-color: var(--cba-bg-elevated);
  border: 1px solid var(--cba-border-default);
  border-radius: var(--cba-radius-sm);
  transition: border-color 120ms ease, box-shadow 120ms ease;

  &:focus-within {
    border-color: var(--cba-accent-info);
    box-shadow: var(--cba-focus-ring);
  }
}
```

```scss
.cba-field--valid .cba-field__control {
  border: 2px solid var(--cba-state-valid-border);
}

.cba-field--error .cba-field__control,
.cba-field--invalid .cba-field__control {
  border: 2px solid var(--cba-state-invalid-border);
}
```

#### 2.2 Docs — `docs/CBA_INPUT.md`

Update rows that still describe the old background or focus border.

In **Visual state matrix** (lines 124–140):

| State | Change |
| --- | --- |
| default | Background `--cba-bg-secondary` → `--cba-bg-elevated` |
| hover | Background `--cba-bg-secondary` → `--cba-bg-elevated` |
| focus-visible | Background `--cba-bg-secondary` → `--cba-bg-elevated`; Border `--cba-accent-primary` → `--cba-accent-info` |
| invalid | Border now `2px solid --cba-state-invalid-border` |
| valid | Border now `2px solid --cba-state-valid-border` |

In **Theming** table (lines 158–175):

- Control background: `--cba-bg-secondary` → `--cba-bg-elevated`
- Focus border: `--cba-accent-primary` → `--cba-accent-info`

#### 2.3 Docs — `docs/CBA_FORM_FIELD.md`

In **Shared field state classes** table (lines 164–170):

- `.cba-field--invalid` background `--cba-bg-secondary` → `--cba-bg-elevated`
- `.cba-field--valid` background `--cba-bg-secondary` → `--cba-bg-elevated`
- `.cba-field--error` background `--cba-bg-secondary` → `--cba-bg-elevated`

In **Theming** table (lines 182–197):

- Control background: `--cba-bg-secondary` → `--cba-bg-elevated`
- Focus ring description: "`--cba-accent-primary` border" → "`--cba-accent-info` border"
- Invalid border: note "2 px solid `--cba-state-invalid-border`"
- Valid border: note "2 px solid `--cba-state-valid-border`"

### Visual impact

- Inputs lift visually because they now sit on `--cba-bg-elevated` (near-white cream) instead of blending into `--cba-bg-secondary` (panel cream).
- Focus state shifts from warm taupe to slate blue (`--cba-accent-info`), making focus visible without relying on coral.
- Valid/invalid borders become 2 px thick, matching the stronger form-state affordance requested in the demo QA round.

---

## 3. Sub-task 3 — Cancel button + button variant contrast

### Required changes

#### 3.1 Demo form — `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.html`

Current markup (lines 1–19):

```html
<form class="demo-customer-form" novalidate>
  <cba-input
    label="Name"
    placeholder="Juan Pérez" />
  <cba-input
    label="Document"
    placeholder="20-12345678-9" />
  <cba-input
    label="Email"
    type="email"
    placeholder="juan@example.com" />
  <p class="demo-customer-form__hint cba-text-small">All fields are required for new customers.</p>
  <cba-button
    variant="primary"
    type="button"
    [icon]="faPlus">
    Add customer
  </cba-button>
</form>
```

Proposed markup:

```html
<form class="demo-customer-form" novalidate>
  <cba-input
    label="Name"
    placeholder="Juan Pérez" />
  <cba-input
    label="Document"
    placeholder="20-12345678-9" />
  <cba-input
    label="Email"
    type="email"
    placeholder="juan@example.com" />
  <p class="demo-customer-form__hint cba-text-small">All fields are required for new customers.</p>
  <div class="demo-customer-form__actions">
    <cba-button
      variant="secondary"
      type="button">
      Cancel
    </cba-button>
    <cba-button
      variant="primary"
      type="button"
      [icon]="faPlus">
      Add customer
    </cba-button>
  </div>
</form>
```

Requirements for the new actions row:

- Container CSS class: `.demo-customer-form__actions`
- Layout: `display: flex; justify-content: flex-end; gap: var(--cba-space-3);`
- Left button: `variant="secondary"`, `type="button"`, label "Cancel"
- Right button: existing primary "Add customer" button (unchanged)
- Cancel button performs no operation (no click handler)

#### 3.2 Demo form SCSS — `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.scss`

Add the actions row style:

```scss
.demo-customer-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--cba-space-3);
}
```

#### 3.3 Library — `src/components/button/cba-button.component.scss`

Review and adjust the secondary variant (lines 66–78).

Current state:

```scss
:host(.cba-button--secondary) .cba-button__control {
  background-color: var(--cba-bg-elevated);
  border-color: var(--cba-border-subtle);
  color: var(--cba-text-primary);

  &:hover {
    background-image: linear-gradient(var(--cba-hover), var(--cba-hover));
  }

  &:active {
    background-image: linear-gradient(var(--cba-active), var(--cba-active));
  }
}
```

Proposed state:

```scss
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

Change summary:

- Background: `--cba-bg-elevated` → `--cba-bg-secondary`
- Border: `--cba-border-subtle` → `--cba-border-default`

The hover/active overlays remain `--cba-hover` / `--cba-active` because the secondary button now sits on the panel surface (`--cba-bg-secondary`).

#### 3.4 Ghost variant verification

No code change is required for the ghost variant unless visual verification shows it fails contrast on a demo surface. The ghost variant currently uses:

- `background-color: transparent`
- `color: var(--cba-text-primary)`
- Hover: `background-color: var(--cba-hover)`
- Active: `background-color: var(--cba-active)`

The implementer must visually verify ghost buttons on:

- `--cba-bg-secondary` (module body)
- `--cba-bg-elevated` (module header / dropdown surfaces)
- `--cba-bg-primary` (workspace canvas)

If `var(--cba-text-primary)` on `--cba-bg-primary` is not sufficiently distinct, report to the caller; do not change unilaterally.

### Visual impact

- The "New customer" form gains a right-aligned Cancel / Add customer button pair.
- The secondary button now reads as a filled panel-surface button with a structural border, making it distinct from both primary and ghost variants on every demo surface.

---

## 4. Sub-task 4 — Typography scale

### Required changes

#### 4.1 Library — `src/theme/_variables.scss`

Update the six typography tokens (lines 130–145):

| Token | Current value | New value |
| --- | --- | --- |
| `--cba-font-size-display` | `1.25rem` | `1.5rem` |
| `--cba-font-size-heading-lg` | `1.125rem` | `1.25rem` |
| `--cba-font-size-heading-md` | `1rem` | `1.125rem` |
| `--cba-font-size-body` | `0.875rem` | `1rem` |
| `--cba-font-size-small` | `0.8125rem` | `0.875rem` |
| `--cba-font-size-caption` | `0.75rem` | `0.8125rem` |

Keep line-heights proportionally the same; adjust only the caption line-height if needed for the new pixel size.

Current line-heights (lines 140–145):

```scss
--cba-line-height-display: 1.2;
--cba-line-height-heading-lg: 1.222;
--cba-line-height-heading-md: 1.25;
--cba-line-height-body: 1.5;
--cba-line-height-small: 1.385;
--cba-line-height-caption: 1.333;
```

Proposed line-heights:

```scss
--cba-line-height-display: 1.2;
--cba-line-height-heading-lg: 1.222;
--cba-line-height-heading-md: 1.25;
--cba-line-height-body: 1.5;
--cba-line-height-small: 1.385;
--cba-line-height-caption: 1.385;
```

Reasoning: caption moves from 12 px to 13 px; aligning its line-height with the small step (`1.385`) keeps the two smallest sizes visually consistent. All other line-heights remain unchanged because the pixel-size increase is exactly one CSS-rem step and the existing ratios already produce integer pixel heights.

#### 4.2 Library — `src/theme/_utilities.scss`

No code change is required. The utility classes already reference tokens directly:

```scss
.cba-text-#{$step} {
  font-size: var(--cba-font-size-#{$step});
  line-height: var(--cba-line-height-#{$step});
}
```

Verify that the `$typography-steps` list contains `display, heading-lg, heading-md, body, small, caption`. It does (line 88).

#### 4.3 Demo app — audit demo SCSS for hard-coded font sizes

Audit all `projects/demo/src/**/*.scss` files. Current grep result (2026-08-20) shows every `font-size` declaration already uses `--cba-font-size-*` tokens. No hard-coded `px` or `rem` font sizes were found.

Required action:

- Confirm the audit result during implementation.
- If any hard-coded font size is discovered, replace it with the appropriate `--cba-font-size-*` token and the matching `--cba-line-height-*` token when both are needed.

#### 4.4 Docs — `docs/THEME.md`

Update the **Typography Scale** table (lines 141–149) with the new computed pixel values:

| Step | Font size | Line height | Weight | Context |
| --- | --- | --- | --- | --- |
| display | `--cba-font-size-display` (1.5rem / 24px) | `--cba-line-height-display` (1.2) | 600 | Rare — large page titles |
| heading-lg | `--cba-font-size-heading-lg` (1.25rem / 20px) | `--cba-line-height-heading-lg` (1.222) | 600 | Module title (prominent) |
| heading-md | `--cba-font-size-heading-md` (1.125rem / 18px) | `--cba-line-height-heading-md` (1.25) | 600 | Module title, section title |
| body | `--cba-font-size-body` (1rem / 16px) | `--cba-line-height-body` (1.5) | 400 | Default body text |
| small | `--cba-font-size-small` (0.875rem / 14px) | `--cba-line-height-small` (1.385) | 400–600 | Table header (semibold), metadata |
| caption | `--cba-font-size-caption` (0.8125rem / 13px) | `--cba-line-height-caption` (1.385) | 400 | Hints, tertiary metadata |

Also update the **Main Token Groups** bullet (line 70):

- Keep "Typography — Inter (system-ui fallback), base `14px`, line-height `1.5`, headings weight 500–600"
- No change needed to that summary sentence.

#### 4.5 Project brief — `.agent/project-info/brief.md` §5

Update the token block (lines 175–188):

```scss
--cba-font-size-display: 1.5rem;
--cba-font-size-heading-lg: 1.25rem;
--cba-font-size-heading-md: 1.125rem;
--cba-font-size-body: 1rem;
--cba-font-size-small: 0.875rem;
--cba-font-size-caption: 0.8125rem;

--cba-line-height-display: 1.2;
--cba-line-height-heading-lg: 1.222;
--cba-line-height-heading-md: 1.25;
--cba-line-height-body: 1.5;
--cba-line-height-small: 1.385;
--cba-line-height-caption: 1.385;
```

Also update the inline **Typography** prose (lines 196–201). Keep the primary font and heading weight; only the base-size sentence needs adjustment:

- From: "Base size: 14px"
- To: "Base size: 16px (body step)"

#### 4.6 CHANGELOG — `CHANGELOG.md`

Add entries under the existing `[0.18.4] — 2026-08-20` header (currently empty).

```markdown
## [0.18.4] — 2026-08-20

### Changed

- Typography scale bumped by one step: `--cba-font-size-display` is now `1.5rem`, `--cba-font-size-heading-lg` `1.25rem`, `--cba-font-size-heading-md` `1.125rem`, `--cba-font-size-body` `1rem`, `--cba-font-size-small` `0.875rem`, `--cba-font-size-caption` `0.8125rem`. `--cba-line-height-caption` aligned to `1.385`. See `src/theme/_variables.scss`, `docs/THEME.md`, and `.agent/project-info/brief.md` §5.
- Input field visual refresh: control background is now `--cba-bg-elevated`, focus border is `--cba-accent-info`, and valid/invalid borders render at `2px solid`. See `src/components/form-field/cba-field.component.scss`, `docs/CBA_INPUT.md`, and `docs/CBA_FORM_FIELD.md`.
- Secondary button variant now uses `--cba-bg-secondary` background with `--cba-border-default` border for clearer distinction on panel surfaces. See `src/components/button/cba-button.component.scss`.

### Fixed

- "New customer" demo form no longer overflows in 50% modules: `.demo-customer-form`, `.cba-field__control`, and `%cba-native-control` all receive `box-sizing: border-box`, and the form receives `max-width: 100%`. See `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.scss`.
- Added Cancel button to the "New customer" demo form, right-aligned with the primary Add customer button. See `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.html`.
```

### Visual impact

- Base body text increases from 14 px to 16 px, improving readability in module bodies and forms.
- All headings and metadata shift up proportionally; the six-step hierarchy is preserved.
- No component SCSS needs individual font-size edits because every component already consumes `--cba-font-size-*` tokens.

---

## 5. Files affected summary

| File | Change type | Sub-task |
| --- | --- | --- |
| `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.scss` | Modify | 1, 3 |
| `src/components/form-field/cba-field.component.scss` | Modify | 1, 2 |
| `src/theme/_mixins.scss` | Modify | 1 |
| `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.html` | Modify | 3 |
| `src/components/button/cba-button.component.scss` | Modify | 3 |
| `src/theme/_variables.scss` | Modify | 4 |
| `src/theme/_utilities.scss` | Verify only | 4 |
| `docs/CBA_INPUT.md` | Modify | 2 |
| `docs/CBA_FORM_FIELD.md` | Modify | 2 |
| `docs/THEME.md` | Modify | 4 |
| `.agent/project-info/brief.md` §5 | Modify | 4 |
| `CHANGELOG.md` | Modify | 4 |

---

## 6. Acceptance criteria

- [ ] Form inside a 50% module has no horizontal scrollbar and inputs do not overflow.
- [ ] Input controls render with `--cba-bg-elevated` background.
- [ ] Input focus state uses `--cba-accent-info` border (`#56717E`) plus the existing `--cba-focus-ring` shadow.
- [ ] Valid/invalid input borders are `2px solid` of their respective state tokens.
- [ ] Secondary button has `--cba-bg-secondary` background and `--cba-border-default` border.
- [ ] Demo "New customer" form shows Cancel and Add customer buttons in a right-aligned flex row with `var(--cba-space-3)` gap.
- [ ] Typography tokens match the new scale; utility classes and docs reflect the new values.
- [ ] `npm run build:lib` and `npm run build:demo` succeed.
- [ ] `npm run lint` passes.
- [ ] No `[Unreleased]` section is introduced in `CHANGELOG.md`.

---

## 7. Out of scope / do not change

- Do not change any component TypeScript files, inputs, outputs, or selectors.
- Do not change form validation logic; `error` and `valid` remain visual-only.
- Do not change primary, danger, success, or ghost button variant colors, except for the ghost verification check described in 3.4.
- Do not rename or remove any `--cba-*` tokens.
- Do not modify unrelated demo components or docs.
