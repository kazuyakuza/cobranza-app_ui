# Cluster 3 Front-end Technical Specification — Phase 10 Theme Hardening

**Scope:** Theme preview HTML updates, table/nav/status pattern documentation.

---

## 9. Table State Patterns

### Pattern definition

Document (and preview if easy) the following row states using existing tokens:

| State | Background | Text | Border | Notes |
|-------|------------|------|--------|-------|
| row default | `--cba-bg-secondary` | `--cba-text-primary` | `--cba-border-subtle` | Standard data row. |
| row hover | `--cba-hover` overlay | `--cba-text-primary` | `--cba-border-subtle` | Interactive overlay on default bg. |
| row selected | `--cba-selected-bg` | `--cba-selected-text` | `--cba-selected-border` | Active choice in table. |
| row disabled (optional) | `--cba-state-disabled-bg` | `--cba-state-disabled-text` | `--cba-border-subtle` | Non-interactive row. |

### Consumer guidance
- `thead` = inset (`--cba-bg-tertiary`, `--cba-text-secondary`).
- `tbody` rows = panel (`--cba-bg-secondary`).
- Selected row = selected tokens.
- Hover = `--cba-hover` (dark overlay) on panel.

### Preview implementation
Add a "Table states" section to `docs/theme-preview.html` with a 4-row mini table demonstrating:
- Header row (inset bg, secondary text)
- Default row
- Hover row (apply `.is-hover` class for preview purposes)
- Selected row (apply `.is-selected` class)

---

## 10. Navigation / Footer State Patterns

### Pattern definition

Document normal / hover / selected / disabled for footer section pills and similar nav chips.

| State | Background | Border | Text | Notes |
|-------|------------|--------|------|-------|
| normal | `--cba-bg-secondary` | `--cba-border-strong` | `--cba-text-secondary` | Inactive pill. |
| hover | `--cba-hover` overlay | `--cba-border-strong` | `--cba-text-primary` | Pointer hover. |
| selected | `--cba-selected-bg` | `--cba-selected-border` | `--cba-selected-text` | Active section. |
| disabled | `--cba-state-disabled-bg` | `--cba-border-subtle` | `--cba-state-disabled-text` | Non-interactive. |

### Preview implementation
Add a "Selected states" section to `docs/theme-preview.html` that includes:
- A footer pill in normal, hover, selected, and disabled states.
- A fake nav item (similar styling).
- A fake filter chip (similar styling).

Use inline `.is-hover`, `.is-selected`, `.is-disabled` classes for static demo purposes.

---

## 11. Semantic Status Patterns

### Pattern definition

Document badge/inline status recipes:

| Status | Background | Border | Text | Icon color |
|--------|------------|--------|------|------------|
| success | `--cba-accent-success` | transparent | `--cba-text-inverse` | — |
| warning | `--cba-accent-warning` | transparent | `--cba-text-inverse` | — |
| danger | `--cba-accent-danger` | transparent | `--cba-text-inverse` | — |
| info | `--cba-accent-info` | transparent | `--cba-text-inverse` | — |
| neutral | `--cba-bg-tertiary` | `--cba-border-default` | `--cba-text-secondary` | — |

### Warning vs danger distinction
- Warning = soft coral (`--cba-accent-warning`, #E98074). Used for soft validation, incomplete data.
- Danger = deeper red (`--cba-accent-danger`, #B93E36). Used for hard errors, destructive actions.
- Keep them distinguishable by color + label/icon guidance.

### Preview implementation
Add an "Accent pills" expansion showing each semantic status as a badge pill.

---

## C. Preview Updates

### Sections to add to `docs/theme-preview.html`

1. **Multi-module density strip**
   - Show 2 modules side by side (or stacked if narrow) demonstrating canvas→panel→elevated→inset hierarchy under density.
   - Each module should have header (elevated), body (panel), table header (inset), footer (inset or elevated per choice).

2. **Border scale swatches**
   - Three large swatch cards showing subtle, default, strong borders on the panel surface.
   - Label with role: "Internal separators", "Structural edges", "Important chrome".

3. **Selected samples**
   - Footer pill selected (using `.section-pill.active` updated to use `--cba-selected-*`).
   - Fake table row selected.
   - Fake nav item selected.

4. **Form state samples**
   - Show 5 input-like boxes: default, focus, disabled, readonly, invalid.
   - Each labeled with its state name.
   - Use the compiled CSS tokens directly; no Angular components needed.

5. **Type scale sample**
   - Show each typography step (display, heading-lg, heading-md, body, small, caption) with sample text.
   - Label with token name and computed size.

### JS data arrays to update

- `TOKEN_ROLES` — add new token swatches for selected, form state, and typography tokens (at minimum, add representative chips so the sidebar role map stays accurate).
- `ACCENTS` — already has the 5 accent colors; add inline status badges if not already present.

### Technical notes
- The preview resolves `--cba-*` tokens from `docs/theme-preview.css` (compiled from `src/theme/theme.scss`).
- All new sections must use `var(--cba-*)` in inline styles or class names.
- Regenerate `docs/theme-preview.css` via `npm run build:preview` after any SCSS changes.
- Keep the preview HTML under 600 lines if possible (it's currently ~396 lines; adding sections may push it over, which is acceptable for a preview file).

---

## D. Documentation

### Files to update

1. **`docs/THEME.md`**
   - Add sections for Table State Patterns, Navigation/Footer State Patterns, Semantic Status Patterns.
   - Cross-reference the form state matrix and selected tokens.

2. **`docs/CONSUMER_GUIDE.md`**
   - Add Table State Patterns consumer guidance (thead inset, tbody panel, selected row tokens).
   - Add Navigation/Footer Pill State Patterns with the state table.
   - Add Semantic Status Patterns with badge recipes.
   - Update quick verify checklist to include:
     - Selected state is demoed (pill + row)
     - Form states are shown in preview or components
     - Type scale tokens exist with usage guidance

3. **`README.md`**
   - Brief mention that theme includes table/nav/status patterns.
   - Point to THEME.md and CONSUMER_GUIDE.md.

4. **`CHANGELOG.md`**
   - Finalize `[0.12.0]` entries if not already complete.
   - Ensure all Cluster 3 changes are documented.

---

## Acceptance Criteria for Cluster 3

1. `docs/theme-preview.html` contains:
   - Multi-module density strip (2 modules).
   - Border scale swatches (subtle / default / strong).
   - Selected samples (pill + table row + nav item).
   - Form state samples (default / focus / disabled / readonly / invalid).
   - Type scale sample.
2. `docs/THEME.md` documents table, nav, and status patterns.
3. `docs/CONSUMER_GUIDE.md` has consumer guidance for table, nav, and status patterns.
4. `README.md` mentions pattern readiness.
5. `npm test` and `npm run lint` pass.
6. `docs/theme-preview.css` is regenerated and committed.
7. Visual hierarchy meets acceptance: canvas↔panel obvious, border levels distinct, selected state demoed, form states shown.
