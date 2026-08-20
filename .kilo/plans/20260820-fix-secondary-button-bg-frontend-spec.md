# Front-end Technical Specification — Fix `cba-button--secondary` background color

## 1. Overview

| Item | Value |
|------|-------|
| Component | `CbaButtonComponent` (`src/components/button/cba-button.component.scss`) |
| Variant | `.cba-button--secondary` |
| Changed token | `background-color` on `.cba-button--secondary .cba-button__control` |
| Old value | `var(--cba-bg-secondary)` |
| New value | `var(--cba-bg-elevated)` |
| File path | `src/components/button/cba-button.component.scss`, line 67 |

## 2. Token change and rationale

### 2.1 Change

```scss
// src/components/button/cba-button.component.scss
:host(.cba-button--secondary) .cba-button__control {
  background-color: var(--cba-bg-elevated); // was var(--cba-bg-secondary)
  border-color: var(--cba-border-default);
  color: var(--cba-text-primary);
  // ...
}
```

### 2.2 Rationale

The `cba-module-container` body uses `--cba-bg-secondary` (`#F2F0E8`) as its panel surface. The secondary button previously used the same token for its fill, which made it visually merge with the module body and effectively invisible. The Minimal Yet Warm surface hierarchy defines:

| Token | Hex | Role |
|-------|-----|------|
| `--cba-bg-primary` | `#BCB5A4` | Darker canvas / workspace floor |
| `--cba-bg-secondary` | `#F2F0E8` | Panel / module body |
| `--cba-bg-elevated` | `#FDFCF8` | Elevated cards and controls |

`--cba-bg-elevated` is the correct semantic token for a control that needs to lift slightly above a panel surface. It is ~5 L\* lighter than `--cba-bg-secondary`, producing a visible but soft contrast.

## 3. Expected visual appearance per demo surface

The demo app renders the button matrix on three surfaces:

### 3.1 `bg-secondary` (`--cba-bg-secondary`, `#F2F0E8`)

- **Background fill:** `#FDFCF8` (near-white cream).
- **Border:** `#A29D94` (`--cba-border-default`).
- **Text:** `#2B2620` (`--cba-text-primary`).
- **Result:** The secondary button must be clearly visible as a light cream button with a warm gray border, distinctly lighter than the panel background.

### 3.2 `bg-elevated` (`--cba-bg-elevated`, `#FDFCF8`)

- **Background fill:** `#FDFCF8` — same as the surface.
- **Border:** `#A29D94` (`--cba-border-default`).
- **Text:** `#2B2620` (`--cba-text-primary`).
- **Result:** The button background blends into the elevated surface. The button must still be identifiable by its structural border. This is acceptable because the surface itself is already elevated; the button relies on its border rather than a fill contrast.

### 3.3 `bg-primary` (`--cba-bg-primary`, `#BCB5A4`)

- **Background fill:** `#FDFCF8`.
- **Border:** `#A29D94` (`--cba-border-default`).
- **Text:** `#2B2620` (`--cba-text-primary`).
- **Result:** The light cream button must stand out clearly against the darker warm-sand canvas.

### 3.4 Interaction states

- **Hover:** `background-image: linear-gradient(var(--cba-hover), var(--cba-hover))` darkens the elevated fill.
- **Active:** `background-image: linear-gradient(var(--cba-active), var(--cba-active))` darkens further.
- **Disabled / loading:** `opacity: 0.6` applied to the control; the button remains visually present.

## 4. Border color consideration

### 4.1 Current mismatch

- **Demo matrix caption** (`projects/demo/src/app/components/demo-button-matrix/demo-button-matrix.component.ts`, line 51) documents:
  `.cba-button--secondary · var(--cba-bg-elevated) · var(--cba-border-subtle)`
- **Component SCSS** (`src/components/button/cba-button.component.scss`, line 68) actually uses:
  `border-color: var(--cba-border-default);`

### 4.2 Analysis

The design token definitions state:

- `--cba-border-subtle` (`#E8E5DB`) = internal separators.
- `--cba-border-default` (`#A29D94`) = structural edges.
- `--cba-border-strong` (`#6B665E`) = chrome / outlines.

A button is a structural interactive control; `--cba-border-default` is the semantically correct token. It also provides sufficient edge contrast on both `--cba-bg-secondary` and `--cba-bg-elevated`, whereas `--cba-border-subtle` would be too faint on the near-white elevated surface.

### 4.3 Decision

**Keep the SCSS using `var(--cba-border-default)`.** The fix required is documentation alignment: update the demo matrix caption from `var(--cba-border-subtle)` to `var(--cba-border-default)` so the demo documentation matches the component source of truth.

## 5. Verification steps

### 5.1 Build

1. Run `npm run build` (library build via ng-packagr).
2. Run `npm run build:demo` to build the demo app.
3. Confirm both complete without SCSS or TypeScript errors.

### 5.2 Demo — Buttons matrix

1. Serve the demo (`npm run start:demo` or open `dist/demo/browser/index.html` after build).
2. Scroll to the **Buttons** section.
3. Verify the secondary button on the `bg-secondary` block:
   - Visible cream fill distinct from the `#F2F0E8` background.
   - Warm gray border visible.
   - Text readable.
4. Verify the secondary button on the `bg-elevated` block:
   - Fill blends with surface (expected).
   - Border provides the button edge.
5. Verify the secondary button on the `bg-primary` block:
   - Light button clearly visible against the darker canvas.
6. Verify hover, active, disabled, and loading states for the secondary variant on each surface.
7. Verify the caption under each secondary button reads `.cba-button--secondary · var(--cba-bg-elevated) · var(--cba-border-default)`.

### 5.3 Demo — New Customer form Cancel button

1. In the workspace mockup, locate the **New customer** module (50 % width, expanded, success status).
2. Verify the **Cancel** button (`variant="secondary"`) inside `demo-customer-form` is visible against the module body background (`--cba-bg-secondary`).
3. Confirm it uses the elevated cream fill and default border.

### 5.4 No regressions

1. Verify primary, ghost, danger, and success buttons are unchanged visually.
2. Verify button sizes (`sm`, `md`), truncation, icon-only, and block inputs remain unaffected.

## 6. Acceptance criteria

- [ ] `src/components/button/cba-button.component.scss` line 67 uses `var(--cba-bg-elevated)` for `.cba-button--secondary`.
- [ ] Secondary button is visible on `--cba-bg-secondary` module/panel surfaces.
- [ ] Secondary button remains identifiable on `--cba-bg-elevated` surfaces via its border.
- [ ] Demo matrix caption is aligned to the actual border token (`var(--cba-border-default)`).
- [ ] `npm run build` passes.
- [ ] `npm run build:demo` passes.
- [ ] Visual verification in the demo app confirms expected appearance on all three matrix surfaces and in the New Customer form.

## 7. Related files

- `src/components/button/cba-button.component.scss`
- `src/theme/_variables.scss`
- `projects/demo/src/app/components/demo-button-matrix/demo-button-matrix.component.ts`
- `projects/demo/src/app/components/demo-button-matrix/demo-button-matrix.component.scss`
- `projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.html`
- `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts`
- `src/components/module-container/module-container.component.scss`
