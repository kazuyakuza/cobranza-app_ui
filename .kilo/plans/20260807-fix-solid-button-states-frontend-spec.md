# Front-end Technical Specification — Fix Solid Button Hover/Active State Visibility

**Date:** 2026-08-07
**Task:** Fix solid button (`primary`, `danger`, `success`) hover/active state visibility
**Scope:** Design tokens, `CbaButton` component, theme preview, consumer guide

---

## 1. Summary

Solid button variants (`primary`, `danger`, `success`) use dark state overlays (`--cba-hover`, `--cba-active`) that are nearly imperceptible on their already-dark accent backgrounds. This specification defines two new inverse overlay tokens and updates the button state styling so solid variants receive light overlays while non-solid variants (`secondary`, `ghost`) continue using the existing dark overlays.

---

## 2. Target Framework & Technology

| Item | Value |
|------|-------|
| Framework | Angular 22 (standalone components) |
| Component library | `@cobranza-apps/ui` |
| Styling | SCSS + CSS custom properties (`--cba-*`) |
| Build | `ng-packagr` |
| Preview | Static HTML + compiled `docs/theme-preview.css` |

No new dependencies are required.

---

## 3. Component Boundaries

### 3.1 Affected components

| Component / File | Responsibility |
|------------------|----------------|
| `src/theme/_variables.scss` | Source of truth for `--cba-hover-inverse` and `--cba-active-inverse` tokens |
| `src/components/button/cba-button.component.scss` | Applies correct overlay token per variant |
| `docs/theme-preview.html` | Reflects the split in the 60-button state matrix |
| `docs/theme-preview.css` | Compiled output of `src/theme/theme.scss`; regenerate after token changes |
| `docs/CONSUMER_GUIDE.md` | Documents which variants use which overlay tokens |
| `.agent/project-info/brief.md` §5 | Authoritative design-token table |
| `CHANGELOG.md` | Dated release note for the visual fix |

### 3.2 Unchanged

- `CbaButton` TypeScript component (`cba-button.component.ts`) — no input/output contract changes.
- Routing, navigation, service injections — not affected.
- `secondary` and `ghost` variant styling logic remains the same; only the overlay token source differs.

---

## 4. Styling Architecture & Tokens

### 4.1 New tokens

Add the following tokens to `:root` in `src/theme/_variables.scss`, grouped under **Interactive states**:

```scss
--cba-hover-inverse: rgba(253, 252, 248, 0.12);
--cba-active-inverse: rgba(253, 252, 248, 0.22);
```

**Rationale:**

- Hue matches `--cba-text-inverse` (`#FDFCF8`) for system consistency.
- 12 % hover / 22 % active opacity provides visible lightening on all solid accent backgrounds.
- Keeps the overlay approach (no per-variant hard-coded hover colors).

### 4.2 Existing tokens (unchanged values)

```scss
--cba-hover: rgba(43, 38, 32, 0.10);
--cba-active: rgba(43, 38, 32, 0.18);
```

These remain correct for light surfaces used by `secondary` and `ghost`.

### 4.3 Token application matrix

| Variant | Background | Text | Hover overlay | Active overlay |
|---------|------------|------|---------------|----------------|
| `primary` | `--cba-accent-primary` | `--cba-text-inverse` | `linear-gradient(var(--cba-hover-inverse), var(--cba-hover-inverse))` | `linear-gradient(var(--cba-active-inverse), var(--cba-active-inverse))` |
| `danger` | `--cba-accent-danger` | `--cba-text-inverse` | same inverse | same inverse |
| `success` | `--cba-accent-success` | `--cba-text-inverse` | same inverse | same inverse |
| `secondary` | `--cba-bg-elevated` / surface-specific | `--cba-text-primary` | `linear-gradient(var(--cba-hover), var(--cba-hover))` | `linear-gradient(var(--cba-active), var(--cba-active))` |
| `ghost` | transparent | `--cba-text-primary` | `background-color: var(--cba-hover)` | `background-color: var(--cba-active)` |

**Implementation note:** Use `background-image: linear-gradient(...)` for solid and secondary variants so the overlay sits on top of the base `background-color` without replacing it. `ghost` continues to set `background-color` directly because its normal state is transparent.

---

## 5. Component Contracts

`CbaButton` inputs, outputs, and internal state are unchanged.

| Contract | Value | Notes |
|----------|-------|-------|
| Inputs | `variant`, `size`, `disabled`, `loading`, `icon`, `iconPosition`, `type` | No new inputs |
| Outputs | `clicked` | No new outputs |
| Encapsulation | `ViewEncapsulation.Emulated` | Existing |
| Variant set | `primary`, `secondary`, `ghost`, `danger`, `success` | No new variants |

The only change is the SCSS selector mapping from variant to overlay token.

---

## 6. Responsive Behavior

No responsive behavior changes. The library is desktop-only per the project brief.

- `prefers-reduced-motion` media query remains in place: `transition: none` on `.cba-button__control` and disabled spinner animation.

---

## 7. API Integration

No backend or BFF integration. This is a pure visual/token change.

---

## 8. Accessibility

- Focus ring remains `box-shadow: var(--cba-focus-ring)` on `:focus-visible` for all variants.
- No contrast regression: `--cba-text-inverse` on solid accent backgrounds already passes WCAG AA; light overlays only increase luminance.
- `disabled` and `loading` states keep `opacity: 0.6` and `cursor: not-allowed`.
- Keyboard operability is unchanged.

---

## 9. Performance

- Two additional CSS custom properties add negligible payload.
- No new selectors; existing selectors simply reference different tokens.
- No runtime JavaScript impact.
- `docs/theme-preview.css` must be regenerated with `npm run build:preview` so the static preview remains in sync.

---

## 10. Files to Modify

| File | Change |
|------|--------|
| `src/theme/_variables.scss` | Add `--cba-hover-inverse` and `--cba-active-inverse` under Interactive states |
| `src/components/button/cba-button.component.scss` | Solid variants use inverse overlays; non-solid keep dark overlays |
| `docs/theme-preview.html` | Update button matrix CSS (lines ~131–134) to match component split |
| `docs/theme-preview.css` | Regenerate via `npm run build:preview` |
| `docs/CONSUMER_GUIDE.md` | Update Button Color Guide state overlays table (lines ~127–134) |
| `.agent/project-info/brief.md` §5 | Add inverse tokens to the token table |
| `CHANGELOG.md` | Add dated `0.11.2` entry |
| Test fixtures / specs | Update `EXPECTED_TOKENS` and any token/button CSS assertions if present |

---

## 11. Acceptance Criteria

- [ ] `--cba-hover-inverse` and `--cba-active-inverse` exist in `src/theme/_variables.scss` and `.agent/project-info/brief.md` §5.
- [ ] `primary`, `danger`, and `success` buttons use `--cba-hover-inverse` on hover and `--cba-active-inverse` on active.
- [ ] `secondary` and `ghost` buttons continue using `--cba-hover` / `--cba-active`.
- [ ] `docs/theme-preview.html` button matrix visually distinguishes hover/active states for solid variants.
- [ ] `docs/CONSUMER_GUIDE.md` state overlays table documents the variant split.
- [ ] `npm run build` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run test` passes.
- [ ] `npm run build:preview` regenerates `docs/theme-preview.css` without errors.

---

## 12. References

- Global plan: `.kilo/plans/20260807-fix-solid-button-states.md`
- Token source of truth: `src/theme/_variables.scss`
- Project brief: `.agent/project-info/brief.md` §5
- Consumer guide: `docs/CONSUMER_GUIDE.md`
- Theme preview: `docs/theme-preview.html`
- Button component: `src/components/button/cba-button.component.scss`
