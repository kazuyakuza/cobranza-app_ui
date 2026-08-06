# Phase 9 — Minimal Yet Warm Surface Hierarchy Front-end Specification

## 1. Problem Statement

The running Shell looks flat because the four surface levels (canvas → panel → elevated → inset) do not have large enough luminance gaps, and the borders/shadows that provide depth are too weak on warm light surfaces.

Specific gaps in the current theme:

- **Canvas vs panel** (`--cba-bg-primary` `#EAE7DC` vs `--cba-bg-secondary` `#F3F1E9`) is only ~3.9 L* apart, so the module body does not read as a card sitting on the workspace floor.
- **Panel vs elevated** (`--cba-bg-secondary` `#F3F1E9` vs `--cba-bg-elevated` `#FCFBF6`) is only ~3.5 L* apart, so the module header band does not lift from the module body.
- **`--cba-border-subtle` `#E7E5DE`** is nearly invisible on the panel surface, making module outlines and header separators disappear.
- **Shadows** (`--cba-shadow-module`, `--cba-shadow-elevated`) are too transparent to create a sense of elevation.
- The result is that the Shell reads as one large, undifferentiated cream rectangle.

## 2. Design Constraints

- Stay inside the **Minimal Yet Warm** palette: warm sand / cream / taupe + controlled coral.
- **Do not rename** any `--cba-*` token.
- Coral remains **accent-only** (warning, danger, focus).
- Desktop-only scope.
- Acceptance is visual hierarchy, not a fixed hex table.

## 3. Proposed Token Values

| Token | Current value | Proposed value | Role |
|-------|---------------|----------------|------|
| `--cba-bg-primary` (canvas) | `#EAE7DC` | `#D8D4C4` | Workspace floor / shell footer |
| `--cba-bg-secondary` (panel) | `#F3F1E9` | `#EFEDE4` | Module body / cards / section pills |
| `--cba-bg-elevated` | `#FCFBF6` | `#FAF9F4` | Module header / shell header / dropdowns / popovers |
| `--cba-bg-tertiary` (inset) | `#D8C3A5` | `#D8C3A5` | Table headers / input wells / module footer |
| `--cba-border-subtle` | `#E7E5DE` | `#DAD7CA` | Module outlines / header separators / thin dividers |
| `--cba-border-default` | `#A7A6A2` | `#A7A6A2` | Input borders / chrome |
| `--cba-border-strong` | `#8E8D8A` | `#8E8D8A` | Focus / footer pills / icon-button outlines |
| `--cba-shadow-module` | `0 4px 16px rgba(43,34,28,.12)` | `0 4px 20px rgba(43,34,28,.14)` | Module lift shadow |
| `--cba-shadow-elevated` | `0 8px 24px rgba(43,34,28,.18)` | `0 8px 28px rgba(43,34,28,.20)` | Dropdown / modal / elevated popover shadow |
| `--cba-hover` | `rgba(43,38,32,.06)` | `rgba(43,38,32,.06)` | Hover overlay (unchanged) |
| `--cba-active` | `rgba(43,38,32,.10)` | `rgba(43,38,32,.10)` | Active overlay (unchanged) |

All other tokens keep their current value.

## 4. Luminance Calculations (Approximate)

Approximate CIELAB L* values were computed from sRGB with gamma correction and the standard luminance coefficients.

| Surface | Current | Proposed | Current L* | Proposed L* | Change |
|---------|---------|----------|------------|-------------|--------|
| Canvas (`--cba-bg-primary`) | `#EAE7DC` | `#D8D4C4` | ~91.2 | ~84.9 | -6.3 |
| Panel (`--cba-bg-secondary`) | `#F3F1E9` | `#EFEDE4` | ~95.1 | ~93.7 | -1.4 |
| Elevated (`--cba-bg-elevated`) | `#FCFBF6` | `#FAF9F4` | ~98.6 | ~97.8 | -0.8 |
| Inset (`--cba-bg-tertiary`) | `#D8C3A5` | `#D8C3A5` | ~80.1 | ~80.1 | 0.0 |
| Border-subtle | `#E7E5DE` | `#DAD7CA` | ~94.3 | ~86.3 | -8.0 |

### Target gaps vs proposed gaps

| Gap | Target | Current gap | Proposed gap | Status |
|-----|--------|-------------|--------------|--------|
| Canvas → Panel | 8–10 L* | ~3.9 | ~8.8 | ✓ |
| Panel → Elevated | 4–6 L* | ~3.5 | ~4.1 | ✓ |
| Panel → Inset | distinguishable at a glance | ~15.0 | ~13.6 | ✓ |
| Elevated → Inset | distinguishable at a glance | ~18.5 | ~17.7 | ✓ |

The proposed canvas is darker/more sand, the panel is a cleaner cream, and the elevated surface is a controlled warm white with a clear separation from the panel.

## 5. Border Strategy

### Rationale

The current `--cba-border-subtle` is almost the same luminance as the panel, so module outlines and header separators are lost. The new `--cba-border-subtle` (`#DAD7CA`) is darker than both panel and elevated while remaining inside the warm taupe family, so it provides visible but non-harsh separation.

| Token | Proposed value | Expected visibility |
|-------|----------------|---------------------|
| `--cba-border-subtle` | `#DAD7CA` | Visible on panel and elevated (~7.4 and ~11.5 L* difference) |
| `--cba-border-default` | `#A7A6A2` | Retained for inputs and chrome; strong enough on all surfaces |
| `--cba-border-strong` | `#8E8D8A` | Retained for focus rings, footer pills, icon-button outlines |

### Component border decisions

| Component | Current border | Recommended border | Reason |
|-----------|----------------|--------------------|--------|
| `ModuleContainer` | `border-subtle` | `border-subtle` | New subtle is now visible on panel; keep the softer outline |
| `ModuleHeader` | `border-bottom: border-subtle` | `border-subtle` | New subtle is visible on elevated; keep the softer separator |
| `ShellHeader` | `border-bottom: border-default` | `border-default` | Already uses default; provides crisp separation against both canvas and elevated |
| `ShellFooter` | `border-top: border-default` | `border-default` | Already uses default; keeps the footer pill bar separated from canvas |
| Footer pills / icon buttons | `border-strong` | `border-strong` | Strong outline ensures they do not disappear on canvas or panel |

If, after visual testing, the new `border-subtle` still feels too weak on a specific surface, switch **only that component** to `border-default` and document the override in the component notes.

## 6. Shadow Strategy

Shadows must remain warm-tinted (base `rgba(43,34,28,...)`) and never switch to harsh black. The increase is small: larger blur and slightly higher alpha so modules lift off the canvas without producing a dark bloom.

| Token | Current | Proposed | Rationale |
|-------|---------|----------|-----------|
| `--cba-shadow-module` | `0 4px 16px rgba(43,34,28,.12)` | `0 4px 20px rgba(43,34,28,.14)` | Slightly larger blur and alpha; more presence on the darker canvas |
| `--cba-shadow-elevated` | `0 8px 24px rgba(43,34,28,.18)` | `0 8px 28px rgba(43,34,28,.20)` | Dropdowns/modals need a clear step above modules |

Both shadows keep the same warm base and soft falloff; they are **not** converted to dark neutral or black.

## 7. Hover / Active Overlay Verification

| Token | Value | Expected behaviour on new surfaces |
|-------|-------|-------------------------------------|
| `--cba-hover` | `rgba(43,38,32,.06)` | Warm dark overlay. Reads on canvas, panel, and elevated because the surfaces are light enough to show a 6% dark tint. |
| `--cba-active` | `rgba(43,38,32,.10)` | Slightly stronger overlay. Reads on all surfaces, including inset `#D8C3A5` where it darkens the warm sand. |

No change is required to hover/active tokens. The darker canvas and the more saturated panel do not break the overlay; the overlays are still warm and visible.

## 8. Component Chrome Recommendations

| Component | Recommended wiring | Notes |
|-----------|--------------------|-------|
| `ModuleContainer` (non-fullscreen) | `bg-secondary` + `border-subtle` + `shadow-module` | New panel + new subtle + new shadow should make the module read as a card. |
| `ModuleHeader` | `bg-elevated` + `border-bottom: border-subtle` | Elevated is now ~4.1 L* lighter than panel; subtle border is visible on elevated. |
| `ModuleFooter` | `bg-tertiary` | Keep the inset sand; it is now ~13.6 L* darker than panel, so it reads clearly as a recessed band. |
| `ShellHeader` | `bg-elevated` + `border-bottom: border-default` | Elevated header sits on darker canvas; default border keeps it crisp. |
| `ShellFooter` | `bg-primary` + `border-top: border-default` | Footer pills use `bg-secondary` + `border-strong`; they should be visible on the darker canvas. |
| Section pills / icon buttons | `bg-secondary` + `border-strong` | Strong outline ensures visibility on both canvas and panel. |
| Table header | `bg-tertiary` | Keep inset sand; distinct from row background (`bg-secondary`). |
| Table rows | `bg-secondary` | Hover row uses `--cba-hover` overlay. |

No token renames and no semantic remapping are required. The changes are value-only in the token file.

## 9. Theme Preview Update Instructions

`docs/theme-preview.html` must be updated to mirror the new token values so the static preview is an accurate reference for the running theme.

### 9.1 Inline CSS custom properties

In the `.preview` rule, replace the warm surface variables:

```css
.preview {
  --canvas: #D8D4C4;
  --panel: #EFEDE4;
  --elevated: #FAF9F4;
  --inset: #D8C3A5;
  --text: #2B2620;
  --text-2: #4A4640;
  --text-3: #625C55;
  --border: #A7A6A2;
  --border-2: #8E8D8A;
  --accent: #6B5B4F;
  --success: #3E6B4F;
  --warning: #E98074;
  --danger: #B93E36;
  --info: #56717E;
  --shadow: 0 4px 20px rgba(43, 34, 28, .14);
  --hover: rgba(43, 38, 32, .06);
  --on-accent: #FDFCF8;
  /* ... */
}
```

### 9.2 Theme object in the script

Update the single `themes` entry (`id: 'mw'`) to reflect the new values:

```js
{
  id: 'mw',
  group: 'Extra',
  name: 'Minimal Yet Warm',
  note: 'Canvas cálido más arena + panel crema más limpio, coral reservado a acentos',
  source: ['#D8D4C4', '#D8C3A5', '#8E8D8A', '#E98074', '#E85A4F'],
  tokens: {
    '--canvas': '#D8D4C4',
    '--panel': '#EFEDE4',
    '--elevated': '#FAF9F4',
    '--inset': '#D8C3A5',
    '--text': '#2B2620',
    '--text-2': '#4A4640',
    '--text-3': '#625C55',
    '--border': '#A7A6A2',
    '--border-2': '#8E8D8A',
    '--accent': '#6B5B4F',
    '--success': '#3E6B4F',
    '--warning': '#E98074',
    '--danger': '#B93E36',
    '--info': '#56717E',
    '--shadow': '0 4px 20px rgba(43, 34, 28, .14)',
    '--hover': 'rgba(43, 38, 32, .06)',
    '--on-accent': '#FDFCF8'
  }
}
```

Also update the page comment and `<h1>`/`.hint` text to mention Phase 9.

### 9.3 Visual checks the preview must demonstrate

- **Canvas ≠ panel**: workspace background should be clearly darker than the module card.
- **Module header ≠ module body**: header band should be visibly lighter than the module body.
- **Table header inset ≠ row background**: table header sand should be darker than the cream row background.
- **Footer pills visible on canvas**: pills with panel fill + strong outline should stand out from the darker workspace floor.

## 10. Verification Checklist

Use this list before marking the task complete.

- [ ] `src/theme/_variables.scss` contains the new token values in the table above.
- [ ] No `--cba-*` token was renamed.
- [ ] Approximate L* gaps are: canvas→panel ≥8, panel→elevated ≥4.
- [ ] The four surfaces (canvas, panel, elevated, inset) are distinguishable at a glance in the browser preview.
- [ ] `ModuleContainer` uses `bg-secondary` + `border-subtle` + `shadow-module` and reads as a card.
- [ ] `ModuleHeader` uses `bg-elevated` + `border-bottom: border-subtle` and separates from the module body.
- [ ] `ModuleFooter` uses `bg-tertiary` and looks recessed.
- [ ] `border-subtle` is visible on both panel and elevated.
- [ ] `border-default` and `border-strong` remain visible on inputs, footer pills, and icon buttons.
- [ ] `shadow-module` and `shadow-elevated` feel warmer and slightly more present without dark bloom.
- [ ] `hover` and `active` overlays still read on all new surfaces.
- [ ] `docs/theme-preview.html` mirrors the new token values and the preview clearly shows the four hierarchy checks.
- [ ] Text contrast remains valid (`--cba-text-primary` on all surfaces, `--cba-text-muted` on canvas/panel/elevated only).
- [ ] No coral is used as a large surface fill.
- [ ] No hard-coded color values were introduced in components; only token values changed.
