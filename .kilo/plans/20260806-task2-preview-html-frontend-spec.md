<!--
  FRONT-END TECHNICAL SPECIFICATION
  Task 2 — Theme Preview HTML Overhaul
  TODO: .agent/todos/20260805/20260805-todo-1.md (lines 1, 4, and the color list)
  Global Plan: .kilo/plans/20260806-theme-tokens-preview-guide.md
-->

# Theme Preview HTML Overhaul — Front-end Technical Specification

**Date:** 2026-08-06  
**Branch:** `feat/theme-refinement-tokens-preview-guide`  
**Target file:** `docs/theme-preview.html`  
**Related sources:** `src/theme/_variables.scss`, `src/theme/_utilities.scss`, `src/theme/theme.scss`, `docs/CONSUMER_GUIDE.md`

---

## 1. Purpose

Replace the current mirrored/inline token values in `docs/theme-preview.html` with the **actual library theme** so the preview is visually identical to the Shell when it consumes `@cobranza-apps/ui/theme`. The preview must demonstrate the Consumer Guide surface ownership rules and expose clear swatch and state examples for the nine required colors.

---

## 2. Constraints (non-negotiable)

- Do **not** change any token value in `src/theme/_variables.scss`; Task 1 finalized them.
- The file must open directly in a browser (`file://` protocol, no server).
- Keep the existing theme-list UI infrastructure (single theme, JS-driven selection).
- Follow the project’s existing preview conventions and `docs/` documentation style.

---

## 3. Library style integration

### 3.1 Chosen approach

**Compile `src/theme/theme.scss` to `docs/theme-preview.css` and link it from `docs/theme-preview.html`.**

Rationale:
- Browsers cannot parse SCSS, so a plain `<link>` to the source SCSS files is impossible.
- `dist/` currently contains only the SCSS sources, not a compiled CSS file, so we cannot rely on a pre-existing compiled artifact.
- Compiling the theme entry file (`src/theme/theme.scss`) produces the exact `:root` block, utility classes, and component base styles that a real consumer receives, eliminating the drift that caused the Shell-vs-preview differences.
- The generated `docs/theme-preview.css` is committed alongside the HTML, so opening `docs/theme-preview.html` from disk still works without a server.

### 3.2 Build step

Add an npm script to `package.json`:

```json
"build:preview": "sass src/theme/theme.scss docs/theme-preview.css --no-source-map --style=compressed"
```

- Use the `sass` package. It is already available transitively through Angular CLI; pin it as a dev dependency if it is not directly present.
- The script must be run manually after token changes and as part of the verification step (see §8).
- Do **not** add the generated CSS to `.gitignore`; it must be tracked so the HTML stays standalone.

### 3.3 HTML linkage

In `<head>`, replace the current inline `.preview` token block with:

```html
<link rel="stylesheet" href="theme-preview.css" />
```

After this change, the preview page must resolve `--cba-*` tokens from the compiled CSS exactly as the Shell does.

### 3.4 Drift prevention

A regression test (owned by Task 4) will assert that every `--cba-*` value in `docs/theme-preview.css` matches the corresponding value in `src/theme/_variables.scss`. This spec does not implement the test; it only mandates that the implementation leaves the generated CSS in a testable, deterministic state.

---

## 4. Surface ownership demonstration

The preview layout must model the Consumer Guide ownership map so AI agents and reviewers can visually verify the Shell integration.

| Region | Visual element in preview | Token to apply | Consumer Guide owner |
|---|---|---|---|
| Shell workspace / workbench floor | `.preview` root background | `--cba-bg-primary` | Shell |
| Shell header chrome | `.shell-header` | `--cba-bg-elevated` | Shell |
| Module card surface | `.module` | `--cba-bg-secondary` | Lib (`ModuleContainer`) |
| Module header band | `.module-header` | `--cba-bg-elevated` | Lib (`ModuleHeader`) |
| Table header / recessed wells | `table thead th`, `.module-footer` | `--cba-bg-tertiary` | MFE / shared table styles |
| Footer section pills | `.section-pill` | `--cba-bg-secondary` + `--cba-border-strong` | Shell |

Additional styling rules for the layout:
- Module card uses `border: 1px solid var(--cba-border-default)` and `box-shadow: var(--cba-shadow-module)`.
- Shell header and module header use `border-bottom: 1px solid var(--cba-border-default)`.
- Table header and module footer use `border-top`/`border-bottom: 1px solid var(--cba-border-default)`.
- No hard-coded hex values in the layout CSS; every color must come from `--cba-*`.

---

## 5. Clear color swatch examples

Add a dedicated **Token Swatches** section in the preview (inside the right-hand preview column, below the module demo). Each row must display:

1. A color chip (48 × 36 px, rounded with `--cba-radius-sm`, bordered with `--cba-border-default`).
2. The semantic name: `canvas`, `panel`, `elevated`, `inset`, `text`, `border`, `accent`, `warning`, `danger`.
3. The hex value.
4. The `--cba-*` token name.

Required swatches (exact values from `src/theme/_variables.scss`):

| Semantic | Hex | Token | Background class |
|---|---|---|---|
| canvas | `#C5BFAE` | `--cba-bg-primary` | `.cba-bg-primary` |
| panel | `#E6DDC6` | `--cba-bg-secondary` | `.cba-bg-secondary` |
| elevated | `#FBF7ED` | `--cba-bg-elevated` | `.cba-bg-elevated` |
| inset | `#D8C3A5` | `--cba-bg-tertiary` | `.cba-bg-tertiary` |
| text | `#2B2620` | `--cba-text-primary` | inline style |
| border | `#A7A6A2` | `--cba-border-default` | inline style |
| accent | `#6B5B4F` | `--cba-accent-primary` | inline style |
| warning | `#E98074` | `--cba-accent-warning` | inline style |
| danger | `#B93E36` | `--cba-accent-danger` | inline style |

For `text`, `border`, `accent`, `warning`, and `danger` swatches, the chip background is the color itself; label text uses `--cba-text-primary` on the surrounding panel surface.

The swatch section must be visible without scrolling past the module demo on a 1080p screen; use a compact grid (`display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr))`) inside `.extras`.

---

## 6. Button state examples

Add a **Button states** section that shows every `CbaButton` variant rendered with preview-only classes that mirror the real component styles in `src/components/button/cba-button.component.scss`.

### 6.1 Variants to display

- `primary`
- `secondary`
- `ghost`
- `danger`
- `success`

### 6.2 States to display per variant

Each variant must be shown in four states:

- **Normal**
- **Hover** (apply `.is-hover` class that mirrors `:hover`)
- **Active / pressed** (apply `.is-active` class that mirrors `:active`)
- **Disabled** (apply `disabled` attribute and `.is-disabled` styling)

### 6.3 Surfaces to display each variant on

Render the button matrix on three representative surfaces:

1. **Panel** (`--cba-bg-secondary`) — the most common module body background.
2. **Elevated** (`--cba-bg-elevated`) — header bands, dropdowns, active secondary buttons.
3. **Canvas** (`--cba-bg-primary`) — workspace floor (for footer pills / floating actions).

This makes it obvious whether secondary and ghost buttons remain visible on every surface and whether the active state is distinguishable from the normal state (the original user complaint about elevated).

### 6.4 Style rules for preview button classes

Preview classes must match the real component exactly:

| Variant | Normal | Hover overlay | Active overlay | Disabled |
|---|---|---|---|---|
| primary | `bg: var(--cba-accent-primary); color: var(--cba-text-inverse);` | `linear-gradient(var(--cba-hover), var(--cba-hover))` | `linear-gradient(var(--cba-active), var(--cba-active))` | `opacity: 0.6; cursor: not-allowed;` |
| secondary | `bg: var(--cba-bg-elevated); border: var(--cba-border-subtle); color: var(--cba-text-primary);` | `linear-gradient(var(--cba-hover), var(--cba-hover))` | `linear-gradient(var(--cba-active), var(--cba-active))` | `opacity: 0.6; cursor: not-allowed;` |
| ghost | `bg: transparent; color: var(--cba-text-primary);` | `bg: var(--cba-hover)` | `bg: var(--cba-active)` | `opacity: 0.6; cursor: not-allowed;` |
| danger | `bg: var(--cba-accent-danger); color: var(--cba-text-inverse);` | `linear-gradient(var(--cba-hover), var(--cba-hover))` | `linear-gradient(var(--cba-active), var(--cba-active))` | `opacity: 0.6; cursor: not-allowed;` |
| success | `bg: var(--cba-accent-success); color: var(--cba-text-inverse);` | `linear-gradient(var(--cba-hover), var(--cba-hover))` | `linear-gradient(var(--cba-active), var(--cba-active))` | `opacity: 0.6; cursor: not-allowed;` |

Focus rings must use `var(--cba-focus-ring)` for keyboard-visible focus.

---

## 7. Text color examples

Add a **Text on surfaces** section that demonstrates the Consumer Guide text-color rules.

### 7.1 Surfaces to sample

- canvas (`--cba-bg-primary`)
- panel (`--cba-bg-secondary`)
- elevated (`--cba-bg-elevated`)
- inset (`--cba-bg-tertiary`)

### 7.2 Text tokens to show on each surface

- `--cba-text-primary`
- `--cba-text-secondary`
- `--cba-text-muted` (where allowed)
- `--cba-text-inverse` (where needed, e.g. on accent backgrounds)

### 7.3 Muted restriction callout

On the canvas and inset samples, add a small warning label explaining that `--cba-text-muted` is **restricted** on these surfaces because it fails WCAG AA. Show `--cba-text-secondary` as the preferred lower-emphasis token instead.

This section must visually prove that all allowed text/surface pairings meet the WCAG AA target and that the muted restriction is real.

---

## 8. Responsiveness and structure

- Keep the two-column layout: controls (left, 340 px fixed) and preview (right, flexible).
- The left column remains sticky and independently scrollable.
- The right preview column must be scrollable when content exceeds viewport height (`overflow-y: auto`).
- The new swatch, button-state, and text-on-surface sections live inside `.extras` in the right column.
- Maintain desktop-only scope; do not add mobile breakpoints.

---

## 9. Accessibility

- Use semantic HTML: `<header>`, `<main>`, `<footer>`, `<section>`, `<table>`.
- All interactive buttons (theme selectors, preview buttons) must be reachable by keyboard and show visible focus rings using `--cba-focus-ring`.
- Ensure text samples use allowed token combinations so contrast remains WCAG AA compliant.
- Add `aria-label` to icon-only buttons in the module header demo.

---

## 10. Acceptance criteria

- [ ] `docs/theme-preview.html` links to `docs/theme-preview.css` generated from `src/theme/theme.scss`.
- [ ] Opening `docs/theme-preview.html` from disk (`file://`) renders correctly with no 404s.
- [ ] The preview uses only `--cba-*` tokens; no hard-coded hex values for theme colors.
- [ ] The layout demonstrates surface ownership: canvas workspace, panel module, elevated header, inset table header/footer.
- [ ] All nine required color swatches are present with hex and token name.
- [ ] All five button variants are shown in normal, hover, active, and disabled states on panel, elevated, and canvas surfaces.
- [ ] Text-on-surfaces section shows primary/secondary/muted/inverse text and includes the muted restriction callout for canvas and inset.
- [ ] Two-column layout is preserved; preview column scrolls independently.
- [ ] `npm run build:preview` successfully regenerates `docs/theme-preview.css`.
- [ ] `npm run build` and `npm run lint` still pass after the change.

---

## 11. Files affected

| File | Change |
|---|---|
| `docs/theme-preview.html` | Overhaul: link theme CSS, add swatch/ button/ text sections, remove mirrored inline token block. |
| `docs/theme-preview.css` | New generated file from `src/theme/theme.scss`. |
| `package.json` | Add `build:preview` script and `sass` dev dependency if missing. |

---

## 12. Out of scope

- Changing token values (Task 1).
- Implementing regression tests (Task 4 will add them).
- Modifying actual Angular components (only the preview mimics them).
- Updating the Consumer Guide (Task 3).
