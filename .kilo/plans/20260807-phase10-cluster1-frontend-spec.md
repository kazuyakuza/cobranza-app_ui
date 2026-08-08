# Cluster 1 Front-end Technical Specification — Phase 10 Theme Hardening

**Scope:** Surface differentiation, border system, selected language, form state matrix, typography scale, radius/shadow rules.

---

## 1. Surface Differentiation

### Current baseline (L* approximations)

| Token | Hex | L* | Role |
|-------|-----|----|------|
| `--cba-bg-primary` | #C5BFAE | ~77 | canvas |
| `--cba-bg-secondary` | #E6DDC6 | ~89 | panel |
| `--cba-bg-elevated` | #FBF7ED | ~97 | elevated |
| `--cba-bg-tertiary` | #D8C3A5 | ~81 | inset |

### Proposed retuning

| Token | Current | Proposed | L* | Rationale |
|-------|---------|----------|----|-----------|
| `--cba-bg-primary` | #C5BFAE | **#BCB5A4** | ~74 | Darker taupe-sand so modules read as cards on a desk. Keeps warm neutral family. Contrast with `--cba-text-secondary` (#4A4640) = 4.46:1 (passes WCAG AA). |
| `--cba-bg-secondary` | #E6DDC6 | **#F2F0E8** | ~94 | Cleaner cream, lighter than canvas. Contrast with `--cba-text-muted` (#625C55) = 5.9:1 (passes AA). |
| `--cba-bg-elevated` | #FBF7ED | **#FDFCF8** | ~99 | Almost white cream; module headers and floating chrome stay distinct from panel body. |
| `--cba-bg-tertiary` | #D8C3A5 | **#D8C3A5** | ~81 | Keep current sand family. Ensure Δ vs panel is obvious (panel is now ~13 L* lighter). |

### Surface hierarchy after retuning

```text
L* order: elevated (99) > panel (94) > inset (81) > canvas (74)
Gaps:   canvas→panel ≈ 20, panel→elevated ≈ 5, panel→inset ≈ 13, inset→canvas ≈ 7
```

> **Note:** The panel→elevated gap shrinks to ~5 L* with these values. If visual check shows elevated and panel are too close in the preview, adjust panel to #F0EDE4 (L* ~92) to restore ~7 L* gap. Acceptance is visual hierarchy, not exact L* numbers.

---

## 2. Border System

### Current vs proposed

| Token | Current | Proposed | Intended use |
|-------|---------|----------|--------------|
| `--cba-border-subtle` | #DAD7CA | **#E8E5DB** | Internal separators only (row lines, soft dividers). Lighter than panel so it recedes. |
| `--cba-border-default` | #A7A6A2 | **#A29D94** | Structural edges (module frame, cards, inputs). Visible on cream/sand without being heavy. |
| `--cba-border-strong` | #8E8D8A | **#6B665E** | Important chrome / interactive outlines (footer pills, icon buttons, emphasis). Dark enough to define shape. |

### Contrast checks

- `--cba-border-strong` (#6B665E) on `--cba-bg-secondary` (#F2F0E8): 4.9:1 → visible edge.
- `--cba-border-default` (#A29D94) on `--cba-bg-secondary` (#F2F0E8): 3.1:1 → visible for structural edges, not for text.
- `--cba-border-subtle` (#E8E5DB) on `--cba-bg-secondary` (#F2F0E8): 1.3:1 → truly subtle, for internal dividers only.

---

## 3. Selected Language

### New tokens

```scss
--cba-selected-bg: #E4DDD0;
--cba-selected-border: #6B5B4F;
--cba-selected-text: #2B2620;
--cba-selected-hover: #D8CFC0;
```

### Semantics

| State | Visual meaning | Token usage |
|-------|---------------|-------------|
| `selected` | Item is actively chosen in a set (footer pill, nav tab, table row, dropdown option, filter chip, module focused chrome). | `--cba-selected-*` |
| `active` / `pressed` | Momentary pressed state while pointer is down. | `--cba-active` overlay |
| `focus` | Keyboard focus ring. | `--cba-focus-ring` |

### Expected consumer use

- Footer section pill selected: `border-color: var(--cba-selected-border); background: var(--cba-selected-bg); color: var(--cba-selected-text);`
- Nav / tab selected: same as pill, plus font-weight 600.
- Table row selected: `background: var(--cba-selected-bg);` (border usually not applicable on rows).
- Dropdown option selected: `background: var(--cba-selected-bg); color: var(--cba-selected-text);`
- Filter chip active: `border-color: var(--cba-selected-border); background: var(--cba-selected-bg);`
- Module “focused” chrome: `outline: none; box-shadow: var(--cba-focus-ring);` (focus ring is the primary indicator, not selected tokens).

---

## 4. Form & Control State Matrix

### New tokens

```scss
--cba-state-invalid-border: #B93E36;
--cba-state-invalid-text: #8B3028;
--cba-state-valid-border: #3E6B4F;
--cba-state-valid-text: #2E523C;
--cba-state-disabled-bg: #E0DCD4;
--cba-state-disabled-text: #9A958D;
```

### State matrix (visual semantics)

| State | Background | Border | Text | Cursor | Notes |
|-------|------------|--------|------|--------|-------|
| default | `--cba-bg-secondary` | `--cba-border-default` | `--cba-text-primary` | default | Base state from `CbaFieldComponent`. |
| hover | `--cba-bg-secondary` | `--cba-border-strong` | `--cba-text-primary` | pointer | Only where interactive (inputs, selects, datepicker toggles). |
| focus-visible | `--cba-bg-secondary` | `--cba-accent-primary` | `--cba-text-primary` | default | Uses `box-shadow: var(--cba-focus-ring);` in addition to border change. |
| disabled | `--cba-state-disabled-bg` | `--cba-border-subtle` | `--cba-state-disabled-text` | not-allowed | `opacity: 1` (do not fade; use token colors for distinction). |
| readonly | `--cba-bg-tertiary` | `--cba-border-subtle` | `--cba-text-secondary` | default | Distinct from disabled: no opacity, inset-like background. |
| invalid | `--cba-bg-secondary` | `--cba-state-invalid-border` | `--cba-state-invalid-text` | default | Error message uses same text token. |
| valid | `--cba-bg-secondary` | `--cba-state-valid-border` | `--cba-state-valid-text` | default | Optional visual confirmation. |

### Wiring plan

- `CbaFieldComponent` host classes:
  - `.cba-field--disabled` (exists) → use `--cba-state-disabled-bg` / `--cba-state-disabled-text`.
  - `.cba-field--error` (exists) → rename conceptually to `.cba-field--invalid` and use `--cba-state-invalid-border` / `--cba-state-invalid-text`.
  - Add `.cba-field--readonly` → use `--cba-bg-tertiary` / `--cba-text-secondary`.
  - Add `.cba-field--valid` → use `--cba-state-valid-border` / `--cba-state-valid-text`.
- `CbaInput`, `CbaSelect`, `CbaDatepicker` host bindings:
  - `[class.cba-input--readonly]`: bind to `readonly()` input.
  - `[class.cba-input--valid]`: bind to `valid()` input (or derive from `!error() && touched` — but no validation engine; just visual input).
- **No validation engine.** States are driven by component inputs and/or CSS classes already in the API.

---

## 6. Minimal Typography Scale

### New tokens

```scss
--cba-font-size-display: 1.25rem;      /* 20px */
--cba-font-size-heading-lg: 1.125rem;  /* 18px */
--cba-font-size-heading-md: 1rem;      /* 16px */
--cba-font-size-body: 0.875rem;        /* 14px */
--cba-font-size-small: 0.8125rem;      /* 13px */
--cba-font-size-caption: 0.75rem;       /* 12px */

--cba-line-height-display: 1.2;        /* ~24px */
--cba-line-height-heading-lg: 1.222;    /* ~22px */
--cba-line-height-heading-md: 1.25;     /* 20px */
--cba-line-height-body: 1.5;            /* 21px */
--cba-line-height-small: 1.385;         /* ~18px */
--cba-line-height-caption: 1.333;       /* 16px */
```

### Usage guidance

| Context | Font size token | Line height token | Weight |
|---------|----------------|-------------------|--------|
| Module title | `--cba-font-size-heading-md` or `--cba-font-size-heading-lg` | matching | 600 |
| Section title | `--cba-font-size-heading-md` | matching | 600 |
| Table header | `--cba-font-size-small` | matching | 600 (semibold) |
| Body text | `--cba-font-size-body` | `--cba-line-height-body` | 400 |
| Metadata / hints | `--cba-font-size-small` or `--cba-font-size-caption` | matching | 400 |
| Display (rare) | `--cba-font-size-display` | matching | 600 |

### Utility classes

Generate in `_utilities.scss`:

```scss
.cba-text-display { font-size: var(--cba-font-size-display); line-height: var(--cba-line-height-display); }
.cba-text-heading-lg { font-size: var(--cba-font-size-heading-lg); line-height: var(--cba-line-height-heading-lg); }
.cba-text-heading-md { font-size: var(--cba-font-size-heading-md); line-height: var(--cba-line-height-heading-md); }
.cba-text-body { font-size: var(--cba-font-size-body); line-height: var(--cba-line-height-body); }
.cba-text-small { font-size: var(--cba-font-size-small); line-height: var(--cba-line-height-small); }
.cba-text-caption { font-size: var(--cba-font-size-caption); line-height: var(--cba-line-height-caption); }
```

### Immediate component application

- `ModuleHeader` title: apply `.cba-text-heading-md` (or `font-size: var(--cba-font-size-heading-md); font-weight: 600;`).
- Do NOT redesign every component typography in this phase.

---

## 7. Radius Rules

No new tokens. Document usage of existing tokens:

| Token | Use for | Do NOT use for |
|-------|---------|---------------|
| `--cba-radius-lg` (14px) | Modules, large containers, dialogs | Small buttons, badges |
| `--cba-radius-md` (10px) | Cards, form controls, dropdown menus | Modules (too small), badges |
| `--cba-radius-sm` (6px) | Badges, small controls, pills, input fields | Large containers |
| `999px` (pill) | Nav pills, tags, section pills only | Anything else |

---

## 8. Shadow Rules

No new tokens. Document usage of existing tokens:

| Token | Use for | Guidance |
|-------|---------|----------|
| `--cba-shadow-module` | Module cards when not fullscreen | Secondary depth; primary separation is border. |
| `--cba-shadow-elevated` | Dropdowns, popovers, modals, toasts | Higher elevation; still warm-tinted. |

**Rule:** Border is the primary separator; shadow is secondary depth. Under multi-module density, prefer clearer borders over heavier shadows. Only increase shadow if canvas↔panel still fails after border/surface passes.

---

## 5. Focus Ring Stress Test (moved to Cluster 2 but values defined here)

The existing `--cba-focus-ring` (`0 0 0 3px rgba(232, 90, 79, 0.45)`) must be verified on:

| Surface / element | Expected result |
|-------------------|----------------|
| Canvas (#BCB5A4) | Coral ring visible against warm sand. |
| Panel (#F2F0E8) | Coral ring clearly visible. |
| Elevated (#FDFCF8) | Coral ring clearly visible. |
| Inset (#D8C3A5) | Coral ring visible; if not, increase alpha to 0.55. |
| Taupe primary button (#6B5B4F) | Use focus ring as-is; coral contrasts with taupe. |
| Danger button (#B93E36) | If ring fails, use inner white ring: `box-shadow: 0 0 0 2px var(--cba-text-inverse), 0 0 0 4px var(--cba-accent-danger);` |
| Success button (#3E6B4F) | Same as danger if needed. |
| Ghost button (transparent) | Ring visible on any background. |
| Icon button | Ring visible around the 32×32 square. |
| Text input | Ring visible on `--cba-bg-secondary`. |

> **Decision:** Keep `rgba(232, 90, 79, 0.45)` unless a specific failure is found during preview verification. Adjust alpha/spread only if failures appear.

---

## Acceptance Criteria for Cluster 1

1. `src/theme/_variables.scss` contains all new tokens above.
2. Surface colors pass visual hierarchy check in `docs/theme-preview.html` (canvas darker than panel, elevated lighter than panel, inset distinct).
3. Border tokens are visibly distinct on the panel surface in preview.
4. Selected tokens are defined and previewed.
5. Form state tokens are defined.
6. Typography scale tokens and utility classes are defined.
7. No existing `--cba-*` token names were renamed.
8. `_variables.scss` stays under 200 lines.
