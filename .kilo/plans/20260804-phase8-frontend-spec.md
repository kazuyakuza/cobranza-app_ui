# Phase 8 — Front-end Technical Specification
## Palette Refresh: Minimal Yet Warm

**Source TODO:** `.agent/todos/20260804/20260804-todo-0.md`  
**Global plan:** `.kilo/plans/20260804-phase8-palette-refresh.md`  
**Date:** 2026-08-04  
**Target version:** `0.9.0`  
**Branch:** `feat/palette-refresh-minimal-yet-warm`

---

## 1. Design direction

Replace the current flat medium-gray palette with a **warm, calm, professional** system rooted in the *Minimal Yet Warm* source palette:

| Source hex | Role hint |
|------------|-----------|
| `#EAE7DC` | Light warm canvas / page background |
| `#D8C3A5` | Warm sand — inset / table headers / input wells |
| `#8E8D8A` | Warm gray — borders, muted chrome |
| `#E98074` | Soft coral — warning / emphasis |
| `#E85A4F` | Strong coral-red — danger / focus / small accents |

All existing `--cba-*` token names stay unchanged. Only values change. The mapping below reassigns source hexes and adds derived warm tints/shades where the raw five colors are insufficient for four surface levels plus readable text.

---

## 2. Surface model (Task 1)

| Token | Final value | Derivation / rationale |
|-------|-------------|------------------------|
| `--cba-bg-primary` (canvas) | `#EAE7DC` | Source light warm canvas. Darkest light surface; workspace background. |
| `--cba-bg-secondary` (panel) | `#F3F1E9` | 50 % mix of `#EAE7DC` → `#FCFBF6`. Lighter than canvas so modules read as cards. |
| `--cba-bg-tertiary` (inset) | `#D8C3A5` | Source warm sand. Table headers, input wells, module footer — visibly recessed. |
| `--cba-bg-elevated` (elevated) | `#FCFBF6` | Near-white warm cream. Module header, dropdowns, popovers — highest surface. |
| `--cba-bg-overlay` | `rgba(43, 38, 32, 0.45)` | Warm dark taupe overlay for modals/backdrops. |

**Hierarchy check (relative luminance):**

- canvas `#EAE7DC` → panel `#F3F1E9` → elevated `#FCFBF6` each step lighter.
- inset `#D8C3A5` is darker than panel and clearly distinct from canvas.
- This gives **four distinguishable surface levels** in the Shell.

---

## 3. Complete `--cba-*` token table (Task 2)

```scss
:root {
  /* Backgrounds */
  --cba-bg-primary: #EAE7DC;
  --cba-bg-secondary: #F3F1E9;
  --cba-bg-tertiary: #D8C3A5;
  --cba-bg-elevated: #FCFBF6;
  --cba-bg-overlay: rgba(43, 38, 32, 0.45);

  /* Text */
  --cba-text-primary: #2B2620;
  --cba-text-secondary: #4A4640;
  --cba-text-muted: #625C55;
  --cba-text-inverse: #FDFCF8;

  /* Borders */
  --cba-border-subtle: #E7E5DE;
  --cba-border-default: #A7A6A2;
  --cba-border-strong: #8E8D8A;

  /* Accents */
  --cba-accent-primary: #6B5B4F;
  --cba-accent-success: #3E6B4F;
  --cba-accent-warning: #E98074;
  --cba-accent-danger: #B93E36;
  --cba-accent-info: #56717E;

  /* Interactive states */
  --cba-hover: rgba(43, 38, 32, 0.06);
  --cba-active: rgba(43, 38, 32, 0.10);
  --cba-focus-ring: 0 0 0 3px rgba(232, 90, 79, 0.45);

  /* Layout (unchanged) */
  --cba-header-height: 56px;
  --cba-footer-height: 64px;
  --cba-module-header-min-height: 40px;

  /* Radius (unchanged) */
  --cba-radius-sm: 6px;
  --cba-radius-md: 10px;
  --cba-radius-lg: 14px;

  /* Shadows — warm-tinted, softer than black */
  --cba-shadow-module: 0 4px 16px rgba(43, 34, 28, 0.12);
  --cba-shadow-elevated: 0 8px 24px rgba(43, 34, 28, 0.18);

  /* Spacing (unchanged) */
  --cba-space-1: 4px;
  --cba-space-2: 8px;
  --cba-space-3: 12px;
  --cba-space-4: 16px;
  --cba-space-5: 20px;
  --cba-space-6: 24px;
  --cba-space-8: 32px;
}
```

**Token changes of note:**

- `--cba-border-subtle` changes from an alias of `--cba-bg-elevated` to a dedicated `#E7E5DE` separator color.
- `--cba-focus-ring` switches from blue to a warm coral tint so it is visible on cream/sand surfaces.
- `--cba-hover` / `--cba-active` switch from pure black overlays to warm taupe overlays.

---

## 4. Text & border contrast rationale (Task 3)

### 4.1 Text contrast matrix (WCAG AA target 4.5:1)

| Text token | on `--cba-bg-primary` | on `--cba-bg-secondary` | on `--cba-bg-tertiary` | on `--cba-bg-elevated` |
|------------|----------------------:|------------------------:|-----------------------:|-----------------------:|
| `--cba-text-primary`   | 12.11 | 13.26 | 8.76 | 14.47 |
| `--cba-text-secondary` | 7.57  | 8.29  | 5.47 | 9.04  |
| `--cba-text-muted`     | 5.33  | 5.84  | 3.86 | 6.37  |

**Rationale:**

- Primary and secondary text pass WCAG AA on every surface.
- Muted text passes AA on canvas, panel, and elevated.
- Muted text on inset (`--cba-bg-tertiary`) is 3.86:1 — **intentionally restricted**. Use `--cba-text-secondary` on inset surfaces.

### 4.2 Border visibility matrix

| Border token | on `--cba-bg-primary` | on `--cba-bg-secondary` | on `--cba-bg-tertiary` | on `--cba-bg-elevated` |
|--------------|----------------------:|------------------------:|-----------------------:|-----------------------:|
| `--cba-border-subtle`  | 1.02 | 1.11 | 1.36 | 1.22 |
| `--cba-border-default` | 1.97 | 2.15 | 1.42 | 2.35 |
| `--cba-border-strong`  | 2.68 | 2.93 | 1.94 | 3.20 |

**Rationale:**

- `--cba-border-subtle` is for 1 px separators only; it is intentionally low-contrast.
- `--cba-border-default` is visible on panel/canvas/elevated without looking dirty.
- `--cba-border-strong` keeps footer pills, header icon buttons, and active outlines from disappearing into the background.
- On inset (`--cba-bg-tertiary`) borders are naturally lower contrast because the surface is darker; rely on `--cba-border-strong` or text contrast for separation.

---

## 5. Accent discipline (Task 4)

### 5.1 Primary button / main CTA decision

**Decision:** Use a deep warm neutral `#6B5B4F` for `--cba-accent-primary`, not coral.

**Why:**

- Coral CTAs feel too aggressive for a collections back-office.
- Keeping coral reserved for status, warnings, danger, focus, and small badges makes the UI calmer and prevents "coral wallpaper".
- `#6B5B4F` is a warm taupe that harmonizes with sand/cream surfaces and provides 6.32:1 contrast with inverse text.

### 5.2 Accent contrast & text-on-accent rules

| Accent token | Value | Inverse text (`--cba-text-inverse`) | Primary text (`--cba-text-primary`) | Usage rule |
|--------------|-------|------------------------------------:|------------------------------------:|------------|
| `--cba-accent-primary` | `#6B5B4F` | 6.32 | 2.31 | Solid primary buttons, active nav — use inverse text. |
| `--cba-accent-success` | `#3E6B4F` | 5.98 | 2.44 | Success buttons/badges — use inverse text. |
| `--cba-accent-warning` | `#E98074` | 2.62 | 5.57 | Warning icons/borders/badges. **If used as a solid fill, pair with `--cba-text-primary`**, not inverse. |
| `--cba-accent-danger`  | `#B93E36` | 5.38 | 2.72 | Danger buttons/error badges — use inverse text. |
| `--cba-accent-info`    | `#56717E` | 5.04 | 2.90 | Info badges/borders. Solid fills may use inverse text. |

### 5.3 Coral usage rules

- `#E85A4F` (strong coral) is allowed **only** for:
  - focus rings (`--cba-focus-ring`),
  - danger hover/active states,
  - error/danger status icons and small badges,
  - small accent emphasis (never large backgrounds).
- `#E98074` (soft coral) is allowed **only** for:
  - warning states,
  - warning badges/borders,
  - subtle warm emphasis.
- Neither coral may be used as a module, panel, or large button background unless deliberately reviewed.

---

## 6. Theme preview update (Task 0)

`docs/theme-preview.html` must be updated to show only the *Minimal Yet Warm* theme.

### Required changes

1. **Theme list:** remove every theme object except `{ id:'mw', group:'Extra', name:'Minimal Yet Warm', ... }`. Keep the list UI so future themes can be added.
2. **Source hex display:** keep the five source hexes (`#EAE7DC`, `#D8C3A5`, `#8E8D8A`, `#E98074`, `#E85A4F`).
3. **Role map:** update to show the final roles:
   - canvas `#EAE7DC`
   - panel `#F3F1E9`
   - elevated `#FCFBF6`
   - inset `#D8C3A5`
   - accent `#6B5B4F`
4. **Preview CSS variables:** set the fixed CSS custom properties in `.preview` to the final values. Mapping to `--cba-*` tokens:

| Preview var | Final value | Maps to `--cba-*` |
|-------------|-------------|-------------------|
| `--canvas`   | `#EAE7DC` | `--cba-bg-primary` |
| `--panel`    | `#F3F1E9` | `--cba-bg-secondary` |
| `--elevated` | `#FCFBF6` | `--cba-bg-elevated` |
| `--inset`    | `#D8C3A5` | `--cba-bg-tertiary` |
| `--text`     | `#2B2620` | `--cba-text-primary` |
| `--text-2`   | `#4A4640` | `--cba-text-secondary` |
| `--text-3`   | `#625C55` | `--cba-text-muted` |
| `--border`   | `#A7A6A2` | `--cba-border-default` |
| `--border-2` | `#8E8D8A` | `--cba-border-strong` |
| `--accent`   | `#6B5B4F` | `--cba-accent-primary` |
| `--success`  | `#3E6B4F` | `--cba-accent-success` |
| `--warning`  | `#E98074` | `--cba-accent-warning` |
| `--danger`   | `#B93E36` | `--cba-accent-danger` |
| `--info`     | `#56717E` | `--cba-accent-info` |
| `--shadow`   | `0 4px 20px rgba(20, 16, 12, 0.12)` | `--cba-shadow-module` (conceptually) |
| `--hover`    | `rgba(43, 38, 32, 0.06)` | `--cba-hover` |
| `--on-accent`| `#FDFCF8` | `--cba-text-inverse` |

5. **Controls chrome:** update the dark sidebar to a warm dark tone or keep it neutral; it is not part of the token system, but should not clash with the warm preview.

---

## 7. Documentation updates (Task 5)

Update the following files so the final palette is recorded consistently.

| File | What to update |
|------|----------------|
| `.agent/project-info/brief.md` §5 | Replace the token table with the values in §3 of this spec. Update the palette description from "intermediate-gray" to "Minimal Yet Warm". Update the `--cba-text-muted` usage restriction to reflect the new restricted pair (on `--cba-bg-tertiary`). |
| `docs/THEME.md` | Update the intro from "intermediate-gray" to "Minimal Yet Warm". Keep the structural token-group list unchanged, but ensure the description matches the warm palette. |
| `CHANGELOG.md` | Add `[0.9.0] - 2026-08-04` section. Under **Changed**, list: palette refresh to Minimal Yet Warm, all color token value updates, preview HTML reduced to single theme, docs updates. Explicitly state **no token names were renamed** (not a breaking API change). |
| `docs/theme-preview.html` | Update inline comments and the theme object note to describe the single Minimal Yet Warm theme and the final role mapping. |

`docs/ui-library-overview.md` does not currently exist; no update is required unless the docs-specialist chooses to create it.

---

## 8. Acceptance criteria mapping

| # | Criterion | How this spec satisfies it |
|---|-----------|----------------------------|
| 1 | Theme is recognizably *Minimal Yet Warm* | Warm canvas `#EAE7DC`, panel `#F3F1E9`, sand inset `#D8C3A5`, coral accents used only as accents. |
| 2 | At least four surface levels distinguishable | canvas / panel / elevated / inset are separate luminance steps. |
| 3 | Module separates clearly from workspace canvas | Panel `#F3F1E9` is lighter than canvas `#EAE7DC`; module shadow lifts it further. |
| 4 | Text primary/secondary/muted clearly readable | All pass AA on intended surfaces; muted restricted on inset. |
| 5 | Borders and footer/header chrome remain visible | `--cba-border-default` and `--cba-border-strong` chosen for visibility on cream/sand. |
| 6 | Coral accents controlled | Coral reserved for focus, status, badges, danger/warning; primary CTA is warm taupe. |
| 7 | Token names stable; build succeeds | No `--cba-*` name changes. Layout/radius/spacing untouched. |
| 8 | Docs record final palette values | brief.md §5, docs/THEME.md, CHANGELOG.md, and theme-preview.html updated. |

---

## 9. Verification notes for 4.5a

During verification, confirm:

1. `src/theme/_variables.scss` contains exactly the values in §3.
2. `docs/theme-preview.html` renders only *Minimal Yet Warm* and the preview matches the mapping in §6.
3. No component introduces hardcoded colors that contradict the accent-discipline rules.
4. Text and border contrast numbers still match §4 within rounding; if values are adjusted, the new pairs must still meet AA on intended surfaces.
5. `npm run build` and `npm run lint` pass without errors.
