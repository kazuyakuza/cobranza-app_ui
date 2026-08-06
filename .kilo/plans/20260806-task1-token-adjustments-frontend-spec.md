# Task 1 — Theme Token Adjustments Front-end Specification

## 1. Problem Statement

Two related visual issues in the current Minimal Yet Warm surface hierarchy:

1. **Panel (`--cba-bg-secondary` `#F2F0E8`) is too light and too neutral.**
   - It reads as a near-white wash rather than a warm cream card surface.
   - The user requested it be "a little more darker" and "adding more color, maybe" — i.e. lower the lightness and raise the warm chroma, not just add black.

2. **Elevated (`--cba-bg-elevated` `#FDFCF8`) is not identifiable against surrounding surfaces.**
   - The current panel→elevated gap is only ~4.2 L* and the two surfaces are both low-chroma, so module headers and secondary buttons disappear into the panel.
   - In the Shell, `CbaButtonComponent` `secondary` variant uses `--cba-bg-elevated` as its normal background; when an active/pressed state also resolves to a very similar light value, the normal and active states are visually indistinguishable.

The four-level hierarchy (canvas → panel → elevated → inset) must remain obvious, and every intended text token must still pass WCAG AA on the new surfaces.

## 2. Design Constraints

- Stay inside the **Minimal Yet Warm** palette: warm sand / cream / taupe + controlled coral.
- **Do not rename** any `--cba-*` token.
- **Do not change** canvas (`--cba-bg-primary` `#C5BFAE`) or inset (`--cba-bg-tertiary` `#D8C3A5`) unless required for hierarchy; the brief explicitly locks them.
- **Do not change** text or accent tokens unless contrast calculations demand it.
- Coral remains **accent-only** (warning, danger, focus).
- Desktop-only scope.
- All intended text/background pairs must meet WCAG AA 4.5:1.

## 3. Proposed Token Values

| Token | Role | Current value | Proposed value | Rationale |
|-------|------|---------------|----------------|-----------|
| `--cba-bg-secondary` (panel) | Module body / cards / section pills | `#F2F0E8` | `#E6DDC6` | Darker and visibly warmer; adds chroma without drifting into sand or taupe. |
| `--cba-bg-elevated` | Module header / dropdowns / secondary buttons | `#FDFCF8` | `#FBF7ED` | Slightly darker and warmer than before, with a stronger cream tint so it no longer reads as "almost white". |

All other tokens keep their current value, including:

- `--cba-bg-primary`: `#C5BFAE` (canvas)
- `--cba-bg-tertiary`: `#D8C3A5` (inset)
- `--cba-text-primary`: `#2B2620`
- `--cba-text-secondary`: `#4A4640`
- `--cba-text-muted`: `#625C55`
- `--cba-text-inverse`: `#FDFCF8`
- `--cba-accent-primary`: `#6B5B4F`
- `--cba-border-subtle`: `#DAD7CA`
- `--cba-border-default`: `#A7A6A2`
- `--cba-border-strong`: `#8E8D8A`

## 4. Colorimetric Analysis

Values computed in CIELAB D65 (sRGB with standard gamma correction).

### 4.1 Old vs new L\*, a\*, b\*

| Surface | Hex | L\* | a\* | b\* | Relative luminance |
|---------|-----|-----|-----|-----|--------------------|
| Old panel (`--cba-bg-secondary`) | `#F2F0E8` | 94.75 | −0.72 | 4.10 | 0.8702 |
| **New panel** | `#E6DDC6` | **88.26** | **−0.73** | **12.39** | **0.7416** |
| Old elevated (`--cba-bg-elevated`) | `#FDFCF8` | 98.94 | −0.36 | 2.03 | 0.9728 |
| **New elevated** | `#FBF7ED` | **97.29** | **−0.37** | **5.27** | **0.9321** |
| Canvas (`--cba-bg-primary`, unchanged) | `#C5BFAE` | 77.39 | −0.83 | 9.33 | 0.5219 |
| Inset (`--cba-bg-tertiary`, unchanged) | `#D8C3A5` | 79.81 | 2.73 | 17.79 | 0.5635 |

**Observations**

- Panel lightness drops **−6.5 L\*** while warm chroma (b\*) rises from 4.10 to 12.39 — the surface becomes darker **and** more colored, not just grayed.
- Elevated lightness drops only **−1.65 L\*** but warm chroma more than doubles (b\* 2.03 → 5.27), giving it a visible cream identity.

### 4.2 Surface-gap comparison

| Gap | Current | Proposed | Change | Status |
|-----|---------|----------|--------|--------|
| Canvas → Panel | 17.36 L\* | 10.87 L\* | −6.49 L\* | Still well above the 8–10 L\* target; hierarchy preserved. |
| Panel → Elevated | 4.19 L\* | **9.02 L\*** | **+4.83 L\*** | **More than doubled; solves the indistinguishability issue.** |
| Panel → Inset | 14.94 L\* | 8.45 L\* | −6.49 L\* | Still clearly distinct (inset remains darker and more saturated). |
| Elevated → Inset | 19.13 L\* | 17.48 L\* | −1.65 L\* | Unchanged large gap. |

### 4.3 Perceptual distance (ΔE)

| Pair | ΔE (current) | ΔE (proposed) | Interpretation |
|------|--------------|---------------|----------------|
| Panel ↔ Elevated | 4.69 | **11.50** | Humans easily perceive ≥3 ΔE; the new gap is unmistakable. |
| Old panel → New panel | — | 10.53 | Substantial but still within the same warm-cream family. |
| Old elevated → New elevated | — | 3.64 | Just-noticeable shift; keeps elevated feeling light. |

## 5. Contrast Verification (WCAG AA)

| Text token | Background | New contrast ratio | AA 4.5:1? |
|------------|------------|--------------------|-----------|
| `--cba-text-primary` `#2B2620` | New panel `#E6DDC6` | **11.08:1** | Pass |
| `--cba-text-primary` `#2B2620` | New elevated `#FBF7ED` | **14.01:1** | Pass |
| `--cba-text-secondary` `#4A4640` | New panel `#E6DDC6` | **6.93:1** | Pass |
| `--cba-text-secondary` `#4A4640` | New elevated `#FBF7ED` | **8.76:1** | Pass |
| `--cba-text-muted` `#625C55` | New panel `#E6DDC6` | **4.88:1** | Pass |
| `--cba-text-muted` `#625C55` | New elevated `#FBF7ED` | **6.17:1** | Pass |
| `--cba-text-inverse` `#FDFCF8` | `--cba-accent-primary` `#6B5B4F` (unchanged) | **6.32:1** | Pass |

**Restricted pairs (unchanged, still documented)**

- `--cba-text-muted` on canvas `#C5BFAE`: 3.60:1 — still fails AA; keep existing restriction.
- `--cba-text-muted` on inset `#D8C3A5`: 3.86:1 — still fails AA; keep existing restriction.

No text or accent token needs to change.

## 6. Rationale

### Why `#E6DDC6` for the panel?

- **Dark enough:** L\* drops from 94.75 to 88.26, so modules finally read as physical cards sitting on the canvas instead of white sheets.
- **More colored, not more gray:** b\* rises from 4.10 to 12.39, shifting the panel from a neutral off-white to a warm cream. This satisfies the "adding more color" request without introducing a new hue family.
- **Safe distance from inset:** The panel (L\* 88.26) is still ~8.5 L\* lighter than inset (L\* 79.81), so the "recessed" semantics of `--cba-bg-tertiary` are preserved.
- **Contrast headroom:** Even the lowest-passing pair (`--cba-text-muted` on panel) is at 4.88:1, comfortably above the 4.5:1 AA threshold.

### Why `#FBF7ED` for the elevated?

- **Identifiable against panel:** The panel→elevated gap grows from 4.19 L\* to 9.02 L\*, and the warm-tint shift (b\* 2.03 → 5.27) adds a second visual cue beyond lightness.
- **Still reads as elevated:** At L\* 97.29 it remains the lightest intentional surface; module headers and dropdowns still lift off the panel.
- **Solves the secondary-button problem:** A `secondary` `CbaButtonComponent` on the new panel now has a ~9 L\* and ~11.5 ΔE separation from its surroundings, making the button visible even if the active/pressed state is implemented with a similar light value. (If the Shell still maps normal and active states to the same token, that should be treated as a component-state bug in a follow-up task.)

### Why not darker/more saturated?

- Pushing panel below L\* ~86 (e.g. `#E2D7BE`) shrinks the panel→inset gap toward 6 L\*, risking confusion between "card surface" and "recessed well".
- Pushing elevated below L\* ~97 would make it compete with panel instead of reading as the top surface.
- The chosen values keep all four surfaces (canvas 77.4, inset 79.8, panel 88.3, elevated 97.3) in a clear stepped order with no inversions.

## 7. Visual Hierarchy Mock

ASCII cross-section of the new four-level stack (light → dark):

```text
  ┌─────────────────────────────────────┐  L* ≈ 97.3  #FBF7ED  ── ELEVATED
  │  Module header / dropdown /         │            --cba-bg-elevated
  │  secondary button normal state      │
  ├─────────────────────────────────────┤  L* ≈ 88.3  #E6DDC6  ── PANEL
  │                                     │            --cba-bg-secondary
  │  Module body / card / section pill  │
  │                                     │
  ├─────────────────────────────────────┤  L* ≈ 79.8  #D8C3A5  ── INSET
  │  Table header / well / module footer│            --cba-bg-tertiary
  └─────────────────────────────────────┘
  L* ≈ 77.4  #C5BFAE  ── CANVAS
             --cba-bg-primary
```

Each layer is visually separated by at least ~8 L\* from its neighbors, and the panel/elevated pair is now the clearest step in the upper half of the stack.

## 8. Files to Update

| File | What to change | Notes |
|------|----------------|-------|
| `src/theme/_variables.scss` | Replace `--cba-bg-secondary` with `#E6DDC6` and `--cba-bg-elevated` with `#FBF7ED`. | Source of truth for tokens. Update the header comment that documents the four-level L\* gaps. |
| `.agent/project-info/brief.md` §5 | Sync the two token values and update the prose note that describes the surface hierarchy and L\* gaps (currently "panel → elevated ≈ 4 L\*"). | Keep the existing restriction note for `--cba-text-muted` on canvas and inset; it remains valid. |
| `docs/theme-preview.html` | Update `--panel` / `--cba-bg-secondary` and `--elevated` / `--cba-bg-elevated` in both the `.preview` CSS block and the JS `themes` object. | Also update the page comment/hint text to mention the token adjustment. |
| `docs/CONSUMER_GUIDE.md` | No token value changes required, but add/emphasize a line stating secondary buttons must be visually distinct from their container (panel) and from their own active/pressed state. | This is a guidance clarification, not a value change. |
| `docs/THEME.md` | Update the surface-hierarchy prose to reflect the new panel/elevated relationship if it mentions specific L\* gaps or "warm near-white". | Keep the file as a quick reference; do not duplicate authoritative values. |

## 9. Component Impact Notes

### `CbaButtonComponent` secondary variant

- The spec change alone makes the secondary button clearly visible when placed on `--cba-bg-secondary`.
- If the Shell maps both normal and active states to `--cba-bg-elevated`, the spec does **not** fix that state collision; it only makes the normal state visible against the panel. The implementer should verify whether the active state needs a separate token (e.g. `--cba-active` overlay or `--cba-bg-tertiary`) and document the decision.

### `ModuleHeader` and `ModuleContainer`

- No structural changes. `ModuleHeader` (`bg-elevated`) will separate more strongly from `ModuleContainer` (`bg-secondary`).
- `--cba-border-subtle` `#DAD7CA` remains visible on both new surfaces:
  - On panel `#E6DDC6`: ΔL ≈ 9.6 L\* — visible.
  - On elevated `#FBF7ED`: ΔL ≈ 13.2 L\* — visible.

## 10. Verification Checklist

Use this list before marking the task complete:

- [ ] `src/theme/_variables.scss` contains `--cba-bg-secondary: #E6DDC6` and `--cba-bg-elevated: #FBF7ED`.
- [ ] No `--cba-*` token was renamed.
- [ ] Canvas (`#C5BFAE`) and inset (`#D8C3A5`) values are unchanged.
- [ ] Panel→elevated L\* gap is ≥ 8 L\* (target achieved: ~9 L\*).
- [ ] All four surfaces (canvas, panel, elevated, inset) are distinguishable at a glance in the browser preview.
- [ ] `--cba-text-primary`, `--cba-text-secondary`, and `--cba-text-muted` all pass WCAG AA 4.5:1 on both new panel and new elevated.
- [ ] `--cba-text-inverse` still passes AA on `--cba-accent-primary`.
- [ ] `docs/theme-preview.html` mirrors the new token values and the preview clearly shows panel vs elevated separation.
- [ ] `.agent/project-info/brief.md` §5 prose and token table are synchronized.
- [ ] No coral is introduced as a large surface fill.
- [ ] No hard-coded color values are introduced in components; only token values changed.
