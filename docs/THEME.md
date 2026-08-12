<!--
  AI Agent Note: This file is the QUICK REFERENCE for the @cobranza-apps/ui theme
  (tokens, import paths, utility classes, mixins). Do NOT maintain authoritative
  token values here — they live in brief.md §5 and src/theme/*.scss.
  When tokens or utilities change, update the authoritative sources first, then
  reflect structural/signature changes here only.
-->

# @cobranza-apps/ui — Theme Reference

Quick reference for the Minimal Yet Warm design system: how to import the theme, the token groups emitted on `:root`, and the opt-in utility-class catalog.

## Table of Contents

- [Importing the Theme](#importing-the-theme)
- [Token Prefix](#token-prefix)
- [Main Token Groups](#main-token-groups)
- [Surface Hierarchy](#surface-hierarchy)
- [Border Roles](#border-roles)
- [Selected State](#selected-state)
- [Form State Matrix](#form-state-matrix)
- [Typography Scale](#typography-scale)
- [Table State Patterns](#table-state-patterns)
- [Navigation / Footer Pill State Patterns](#navigation--footer-pill-state-patterns)
- [Semantic Status Patterns](#semantic-status-patterns)
- [Radius Rules](#radius-rules)
- [Shadow Rules](#shadow-rules)
- [Utility Class Prefix](#utility-class-prefix)
- [Mixins](#mixins)
- [Cross-References](#cross-references)

## Importing the Theme

Load the theme once in a global styles file. It emits `--cba-*` CSS variables on `:root` and the opt-in `.cba-*` utility classes.

**SCSS (recommended):**

```scss
/* global-styles.scss */
@use '@cobranza-apps/ui/theme';
```

Notes:

- The theme is Sass-only — no compiled `theme.css` artifact is published. Load via `@use '@cobranza-apps/ui/theme';` (or `@use '@cobranza-apps/ui/theme' as cba;` when also using mixins — mixins are forwarded by `theme.scss`).
- `bootstrap` is a CSS-only peer dependency (`bootstrap@^5`). Never require jQuery.
- CSS variables are global once the theme is loaded (`:root`); utility classes remain opt-in (apply only where added).

## Token Prefix

All theme CSS custom properties use the `--cba-` prefix.

Example: `--cba-bg-primary`, `--cba-text-secondary`, `--cba-accent-primary`.

Do not rename tokens. Authoritative values live in [brief.md §5](../.agent/project-info/brief.md#5-design-tokens-theme) and [`src/theme/_variables.scss`](../src/theme/_variables.scss).

## Main Token Groups

Example variables per group (not an exhaustive list of values — see `_variables.scss` for the full set).

- **Backgrounds** — `--cba-bg-primary`, `--cba-bg-secondary`, `--cba-bg-tertiary`, `--cba-bg-elevated`, `--cba-bg-overlay`
- **Text** — `--cba-text-primary`, `--cba-text-secondary`, `--cba-text-muted`, `--cba-text-inverse`
- **Borders** — `--cba-border-subtle`, `--cba-border-default`, `--cba-border-strong`
- **Accents** — `--cba-accent-primary`, `--cba-accent-success`, `--cba-accent-warning`, `--cba-accent-danger`, `--cba-accent-info`
- **Interactive states** — `--cba-hover`, `--cba-active`, `--cba-hover-inverse`, `--cba-active-inverse`, `--cba-focus-ring`
- **Layout constants** — `--cba-header-height`, `--cba-footer-height`, `--cba-module-header-min-height`
- **Radius** — `--cba-radius-sm` (6px), `--cba-radius-md` (10px), `--cba-radius-lg` (14px)
- **Shadows** — `--cba-shadow-module`, `--cba-shadow-elevated` (applied only when not fullscreen)
- **Spacing scale** — `--cba-space-1` (4px) … `--cba-space-8` (32px)
- **Typography** — Inter (system-ui fallback), base `14px`, line-height `1.5`, headings weight 500–600
- **Selected state** — `--cba-selected-bg`, `--cba-selected-border`, `--cba-selected-text`, `--cba-selected-hover`
- **Form states** — `--cba-state-invalid-border`, `--cba-state-invalid-text`, `--cba-state-valid-border`, `--cba-state-valid-text`, `--cba-state-disabled-bg`, `--cba-state-disabled-text`
- **Typography scale** — `--cba-font-size-{display,heading-lg,heading-md,body,small,caption}` + matching `--cba-line-height-*`

## Surface Hierarchy

Minimal Yet Warm is a **four-level surface system** retuned for multi-module density. Values live in [`src/theme/_variables.scss`](../src/theme/_variables.scss); do not hard-code hex in components.

| Token | Role | L* (approx.) |
|-------|------|--------------|
| `--cba-bg-primary` | **canvas** — Shell workspace floor (darkest warm sand) | ~74 |
| `--cba-bg-secondary` | **panel** — module card body (clearer cream) | ~94 |
| `--cba-bg-elevated` | **elevated** — module header, dropdowns, floating chrome (near-white cream) | ~99 |
| `--cba-bg-tertiary` | **inset** — table headers, module footer, wells (recessed sand) | ~81 |

**L\* gaps after retuning:**

```text
canvas→panel  ≈ 20 L*   (modules lift off the workspace)
panel→elevated ≈  5 L*   (header chrome subtly lighter than body)
panel→inset   ≈ 13 L*   (table headers clearly recessed)
inset→canvas  ≈  7 L*   (inset still warmer/darker than canvas)
```

The hierarchy survives only if **each surface is painted by its owner** (Shell / Lib / MFE). See the [Consumer Guide](CONSUMER_GUIDE.md) for the token compliance mandate, surface ownership map, button color guide, surface decision tree, text color rules, and bar/chrome guide.

## Border Roles

Three border tokens are deliberately distinct on cream/sand. **Border is the primary separator; shadow is secondary depth.**

| Token | Role | Use for | Do NOT use for |
|-------|------|---------|----------------|
| `--cba-border-subtle` | Internal separators | Row lines, soft dividers inside a panel | Module frames, input borders, footer pills |
| `--cba-border-default` | Structural edges | Module frame, card borders, input/select borders | Row dividers (too heavy), footer pills (too light) |
| `--cba-border-strong` | Important chrome | Footer pills, icon-button outlines, emphasis borders | Row dividers (too heavy), internal separators |

Under multi-module density, prefer clearer borders over heavier shadows. Only escalate to shadow if the canvas↔panel step still fails after the border pass.

## Selected State

`--cba-selected-*` tokens express that an item is **actively chosen in a set**. Selected ≠ active(pressed) ≠ focus:

| State | Visual meaning | Token(s) |
|-------|---------------|----------|
| **selected** | Item is actively chosen in a set (footer pill, nav tab, table row, dropdown option, filter chip) | `--cba-selected-bg`, `--cba-selected-border`, `--cba-selected-text`, `--cba-selected-hover` |
| **active / pressed** | Momentary pointer-down state | `--cba-active` overlay |
| **focus** | Keyboard focus ring | `--cba-focus-ring` |

Selected is a **fill + border + text** combination, not an outline. Apply all three tokens together for a fully specified selected state.

## Form State Matrix

Form-state tokens reuse warmed accent hues (no parallel reds/greens invented). `readonly` is not a token set — it reuses `--cba-bg-tertiary` + `--cba-text-secondary` (distinct from disabled).

| State | Background | Border | Text | Cursor |
|-------|-----------|--------|------|--------|
| default | `--cba-bg-secondary` | `--cba-border-default` | `--cba-text-primary` | default |
| hover | `--cba-bg-secondary` | `--cba-border-strong` | `--cba-text-primary` | pointer |
| focus-visible | `--cba-bg-secondary` | `--cba-accent-primary` + `--cba-focus-ring` | `--cba-text-primary` | default |
| disabled | `--cba-state-disabled-bg` | `--cba-border-subtle` | `--cba-state-disabled-text` | not-allowed |
| readonly | `--cba-bg-tertiary` | `--cba-border-subtle` | `--cba-text-secondary` | default |
| invalid | `--cba-bg-secondary` | `--cba-state-invalid-border` | `--cba-state-invalid-text` | default |
| valid | `--cba-bg-secondary` | `--cba-state-valid-border` | `--cba-state-valid-text` | default |

See the [Consumer Guide §Form State Matrix](CONSUMER_GUIDE.md#form-state-matrix) for Shell/MFE wiring guidance.

## Typography Scale

Six-step scale exposed as `--cba-font-size-*` + `--cba-line-height-*` tokens. Base stays Inter / 14px / 1.5.

| Step | Font size | Line height | Weight | Context |
|------|-----------|-------------|--------|---------|
| display | `--cba-font-size-display` (1.25rem / 20px) | `--cba-line-height-display` (1.2) | 600 | Rare — large page titles |
| heading-lg | `--cba-font-size-heading-lg` (1.125rem / 18px) | `--cba-line-height-heading-lg` (1.222) | 600 | Module title (prominent) |
| heading-md | `--cba-font-size-heading-md` (1rem / 16px) | `--cba-line-height-heading-md` (1.25) | 600 | Module title, section title |
| body | `--cba-font-size-body` (0.875rem / 14px) | `--cba-line-height-body` (1.5) | 400 | Default body text |
| small | `--cba-font-size-small` (0.8125rem / 13px) | `--cba-line-height-small` (1.385) | 400–600 | Table header (semibold), metadata |
| caption | `--cba-font-size-caption` (0.75rem / 12px) | `--cba-line-height-caption` (1.333) | 400 | Hints, tertiary metadata |

Utility classes: `.cba-text-display`, `.cba-text-heading-lg`, `.cba-text-heading-md`, `.cba-text-body`, `.cba-text-small`, `.cba-text-caption`. Generated in [`src/theme/_utilities.scss`](../src/theme/_utilities.scss).

## Table State Patterns

<!-- AI agent: Token values for surfaces, borders, selected, hover, and disabled states
     are defined in src/theme/_variables.scss. This section shows how to compose them
     for table row states. For Shell/MFE wiring recipes, see CONSUMER_GUIDE.md §Table State Patterns. -->

Tables reuse the surface hierarchy plus selected/hover tokens. Full table component is out of scope; these are token-level patterns for Shell/MFE authors. Authoritative token values live in [`src/theme/_variables.scss`](../src/theme/_variables.scss).

| Row state | Background | Border | Text |
|-----------|-----------|--------|------|
| default (body row) | `--cba-bg-secondary` (panel) | none | `--cba-text-primary` |
| hover | `--cba-hover` overlay on panel bg | none | `--cba-text-primary` |
| selected | `--cba-selected-bg` | none (or `--cba-selected-border` left accent) | `--cba-selected-text` |
| header (`thead th`) | `--cba-bg-tertiary` (inset) | bottom: `--cba-border-subtle` | `--cba-text-secondary` + semibold |
| disabled (optional) | `--cba-state-disabled-bg` | none | `--cba-state-disabled-text` |

- `thead` = inset surface; body rows = panel surface.
- Selected row uses `--cba-selected-bg`; do not substitute `--cba-hover` for selected.
- See the [Consumer Guide §Table State Patterns](CONSUMER_GUIDE.md#table-state-patterns) for Shell/MFE wiring.

## Navigation / Footer Pill State Patterns

<!-- AI agent: Token values for selected, hover, disabled, and border states are defined
     in src/theme/_variables.scss. This section shows how to compose them for nav/pill
     states. For Shell/MFE wiring recipes, see CONSUMER_GUIDE.md §Navigation / Footer Pill State Patterns. -->

Footer section pills and similar nav chips follow a four-state pattern. Authoritative token values live in [`src/theme/_variables.scss`](../src/theme/_variables.scss).

| State | Background | Border | Text |
|-------|-----------|--------|------|
| normal | `--cba-bg-secondary` | `--cba-border-strong` | `--cba-text-secondary` |
| hover | `--cba-bg-secondary` + `--cba-hover` overlay | `--cba-border-strong` | `--cba-text-primary` |
| selected | `--cba-selected-bg` | `--cba-selected-border` | `--cba-selected-text` |
| disabled | `--cba-state-disabled-bg` | `--cba-border-subtle` | `--cba-state-disabled-text` |

- Selected is visually stronger than hover: border shifts to `--cba-selected-border` (warm taupe) and fill shifts to `--cba-selected-bg`.
- Do not use `--cba-accent-primary` fill for selected pills; the selected token set provides sufficient distinction.
- See the [Consumer Guide §Navigation / Footer Pill State Patterns](CONSUMER_GUIDE.md#navigation--footer-pill-state-patterns).

## Semantic Status Patterns

<!-- AI agent: Accent tokens (--cba-accent-success/warning/danger/info) and form-state
     text tokens are defined in src/theme/_variables.scss. This section shows how to
     compose them for badge/inline status. For Shell/MFE wiring recipes, see
     CONSUMER_GUIDE.md §Semantic Status Patterns. -->

Badge and inline status recipes for success / warning / danger / info / neutral. Authoritative token values live in [`src/theme/_variables.scss`](../src/theme/_variables.scss).

| Status | Accent token | Solid badge | Outline badge | Inline text |
|--------|-------------|-------------|---------------|-------------|
| success | `--cba-accent-success` | bg `--cba-accent-success`, text `--cba-text-inverse` | border + text `--cba-accent-success`, bg transparent | `--cba-state-valid-text` |
| warning | `--cba-accent-warning` | bg `--cba-accent-warning`, text `--cba-text-inverse` | border + text `--cba-accent-warning`, bg transparent | `--cba-accent-warning` (panel/elevated only) |
| danger | `--cba-accent-danger` | bg `--cba-accent-danger`, text `--cba-text-inverse` | border + text `--cba-accent-danger`, bg transparent | `--cba-state-invalid-text` |
| info | `--cba-accent-info` | bg `--cba-accent-info`, text `--cba-text-inverse` | border + text `--cba-accent-info`, bg transparent | `--cba-accent-info` |
| neutral | `--cba-accent-primary` (taupe) | bg `--cba-accent-primary`, text `--cba-text-inverse` | border + text `--cba-accent-primary`, bg transparent | `--cba-text-secondary` |

- **Warning vs danger:** warning is soft coral (`--cba-accent-warning`); danger is deeper red (`--cba-accent-danger`). Always pair color with an icon or label — do not rely on color alone.
- See the [Consumer Guide §Semantic Status Patterns](CONSUMER_GUIDE.md#semantic-status-patterns).

## Radius Rules

| Token | Use for | Do NOT use for |
|-------|---------|----------------|
| `--cba-radius-lg` (14px) | Modules, large containers, dialogs | Small buttons, badges |
| `--cba-radius-md` (10px) | Cards, form controls, dropdown menus | Modules (too small), badges |
| `--cba-radius-sm` (6px) | Badges, small controls, pills, input fields | Large containers |
| `999px` (pill) | Nav pills, tags, section pills only | Anything else |

Avoid arbitrary new radii in components. The four values above cover all cases.

## Shadow Rules

| Token | Use for | Guidance |
|-------|---------|----------|
| `--cba-shadow-module` | Module cards when not fullscreen | Secondary depth; primary separation is border |
| `--cba-shadow-elevated` | Dropdowns, popovers, modals, toasts | Higher elevation; still warm-tinted |

**Rule:** Border is the primary separator; shadow is secondary depth. Under multi-module density, prefer clearer borders over heavier shadows. Only increase shadow if canvas↔panel still fails after the border/surface pass.

## Utility Class Prefix

All theme utility classes use the `.cba-` prefix and reference `var(--cba-*)` tokens. Generated by [`src/theme/_utilities.scss`](../src/theme/_utilities.scss).

- **Backgrounds** — `.cba-bg-primary`, `.cba-bg-secondary`, `.cba-bg-tertiary`, `.cba-bg-elevated`
- **Text** — `.cba-text-primary`, `.cba-text-secondary`, `.cba-text-muted`, `.cba-text-inverse`
- **Borders** (color-only) — `.cba-border-subtle`, `.cba-border-default`, `.cba-border-strong`
  - Pair with Bootstrap's `.border` / `.border-1` to actually render the line (Bootstrap 5 is the expected peer dependency).
- **Radius** — `.cba-radius-sm`, `.cba-radius-md`, `.cba-radius-lg`
- **Shadows** — `.cba-shadow-module`, `.cba-shadow-elevated`
- **Spacing** — `.cba-p-{1,2,3,4,5,6,8}` and `.cba-m-{1,2,3,4,5,6,8}` (numeric scale matching `--cba-space-*`)
- **Typography** — `.cba-text-display`, `.cba-text-heading-lg`, `.cba-text-heading-md`, `.cba-text-body`, `.cba-text-small`, `.cba-text-caption` (each sets `font-size` + `line-height` from the matching `--cba-font-size-*` / `--cba-line-height-*` token pair)

## Mixins

Reusable SCSS mixins in [`src/theme/_mixins.scss`](../src/theme/_mixins.scss). They emit no CSS until included via `@include`.

- `@include cba-focus-ring;` — `outline: none` + `box-shadow: var(--cba-focus-ring)`.
- `@include cba-elevated-surface;` — elevated background, subtle border, `radius-md`, `shadow-module`.
- `@include cba-hover-surface;` — applies `--cba-hover` background on `:hover`.

Usage example:

```scss
@use '@cobranza-apps/ui/theme' as cba;

.card {
  @include cba.cba-elevated-surface;
  @include cba.cba-hover-surface;
}
```

## Cross-References

- [README.md](../README.md) — library overview, component inventory, integration notes.
- [docs/USAGE.md](USAGE.md) — usage patterns and component examples.
- [brief.md §5](../.agent/project-info/brief.md#5-design-tokens-theme) — authoritative design tokens.
- [`src/theme/`](../src/theme/) — SCSS source files (`_variables.scss`, `_base.scss`, `_mixins.scss`, `_utilities.scss`, `theme.scss`).
