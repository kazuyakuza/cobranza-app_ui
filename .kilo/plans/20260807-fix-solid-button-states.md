# Global Plan — Fix Solid Button Hover/Active State Visibility

**Date:** 2026-08-07
**Branch:** `feat/fix-solid-button-states`
**Version:** `0.11.1 → 0.11.2` (patch — visual fix)

---

## Task Origin

User reported in chat that `primary`, `danger`, and `success` buttons (solid dark backgrounds) look almost identical across normal, hover, and active states on panel, elevated, and canvas surfaces.

---

## Global Pre-Analysis

### Root Cause

The current `--cba-hover` (`rgba(43, 38, 32, 0.10)`) and `--cba-active` (`rgba(43, 38, 32, 0.18)`) tokens are **dark overlays** designed for light surfaces. When applied to already-dark solid backgrounds:

| Variant | Base Background | Overlay | Result |
|---------|----------------|---------|--------|
| `primary` | `#6B5B4F` (dark taupe) | `rgba(43,38,32,0.10)` | Nearly imperceptible darkening |
| `danger` | `#B93E36` (dark coral) | `rgba(43,38,32,0.10)` | Barely visible shift |
| `success` | `#3E6B4F` (dark green) | `rgba(43,38,32,0.10)` | Minimal contrast change |

The delta between normal→hover (0.10) and hover→active (0.08 additional) is too small on dark backgrounds to be perceptible.

### Technical Decision

**Add inverse overlay tokens** for solid-button states:

- `--cba-hover-inverse: rgba(253, 252, 248, 0.12)` — lightens solid buttons on hover
- `--cba-active-inverse: rgba(253, 252, 248, 0.22)` — lightens more on active

Rationale:
- Uses existing `--cba-text-inverse` hue (`#FDFCF8`) for consistency
- 12% hover / 22% active provides clear perceptual distinction on all solid backgrounds
- Maintains token-based design system (no hard-coded hex shifts per variant)
- Same approach as `--cba-hover`/`--cba-active` but inverted direction

**Component split:**
- Non-solid variants (`secondary`, `ghost`) → keep dark overlays (work on light surfaces)
- Solid variants (`primary`, `danger`, `success`) → use new inverse overlays

### Front-end flag

Yes — this task modifies component SCSS, preview HTML, and design tokens.

---

## Task — Fix Solid Button State Visibility

**Goal:** Make hover and active states on `primary`, `danger`, and `success` buttons clearly distinguishable from normal state across all surfaces.

**Files to update:**

| File | Change |
|------|--------|
| `src/theme/_variables.scss` | Add `--cba-hover-inverse` and `--cba-active-inverse` tokens |
| `src/components/testing/theme-fixtures.ts` | Add new tokens to `EXPECTED_TOKENS` |
| `src/components/button/cba-button.component.scss` | Solid variants use inverse overlays; non-solid keep dark overlays |
| `docs/theme-preview.html` | Preview button matrix: solid variants use `--cba-hover-inverse`/`--cba-active-inverse`; secondary/ghost keep `--cba-hover`/`--cba-active` |
| `docs/theme-preview.css` | Regenerate via `npm run build:preview` |
| `docs/CONSUMER_GUIDE.md` | Update Button Color Guide state overlays table |
| `.agent/project-info/brief.md` §5 | Add new token values to token table |
| `CHANGELOG.md` | Add `0.11.2` dated entry documenting the fix |
| `src/theme/preview-html.spec.ts` | Add assertions for inverse overlay token presence and button CSS |
| `src/theme/tokens.spec.ts` | Add assertions for new tokens |

**Plan file:** `.kilo/plans/20260807-fix-solid-button-states.md`

### Execution Steps
- **Step 2:** Git Feature Branch Setup → implementer
- **Step 3:** Version Update → implementer (`0.11.1 → 0.11.2`)
- **4.1a:** Front-end Technical Specification → frontend-specialist
- **4.1b:** Analysis & Planning → architector
- **4.2:** Implementation → implementer
- **4.3:** Code Review & Simplification → code-reviewer + code-simplifier; 4.3-fix → implementer
- **4.4:** Documentation → docs-specialist
- **4.5a:** Front-end Verification → frontend-specialist
- **4.5b:** Overall Plan Adherence → architector
- **4.6:** Task Completion → implementer
- **Step 5:** TODO File Completion → implementer

---

## Order of Execution

1. Step 2: Git branch setup (`feat/fix-solid-button-states`)
2. Step 3: Version bump to `0.11.2`
3. 4.1a: Front-end spec
4. 4.1b: Implementation plan
5. 4.2: Implementation
6. 4.3: Review & simplification
7. 4.3-fix: Apply fixes
8. 4.4: Documentation review
9. 4.5a: Front-end verification
10. 4.5b: Plan adherence
11. 4.6: Mark task done
12. Step 5: Merge and push

---

## Implementation Details

### `docs/theme-preview.html` — Button Matrix CSS Changes

Current CSS (lines 131–134):
```css
.pv-btn--primary.is-hover,.pv-btn--secondary.is-hover,.pv-btn--danger.is-hover,.pv-btn--success.is-hover{background-image:linear-gradient(var(--cba-hover),var(--cba-hover))}
.pv-btn--ghost.is-hover{background:var(--cba-hover)}
.pv-btn--primary.is-active,.pv-btn--secondary.is-active,.pv-btn--danger.is-active,.pv-btn--success.is-active{background-image:linear-gradient(var(--cba-active),var(--cba-active))}
.pv-btn--ghost.is-active{background:var(--cba-active)}
```

New CSS:
```css
.pv-btn--primary.is-hover,.pv-btn--danger.is-hover,.pv-btn--success.is-hover{background-image:linear-gradient(var(--cba-hover-inverse),var(--cba-hover-inverse))}
.pv-btn--secondary.is-hover{background-image:linear-gradient(var(--cba-hover),var(--cba-hover))}
.pv-btn--ghost.is-hover{background:var(--cba-hover)}
.pv-btn--primary.is-active,.pv-btn--danger.is-active,.pv-btn--success.is-active{background-image:linear-gradient(var(--cba-active-inverse),var(--cba-active-inverse))}
.pv-btn--secondary.is-active{background-image:linear-gradient(var(--cba-active),var(--cba-active))}
.pv-btn--ghost.is-active{background:var(--cba-active)}
```

### `src/components/button/cba-button.component.scss` — Same Split

Same split applies to the component SCSS:
- `primary`, `danger`, `success` → `linear-gradient(var(--cba-hover-inverse), var(--cba-hover-inverse))` on hover, `linear-gradient(var(--cba-active-inverse), var(--cba-active-inverse))` on active
- `secondary` → keeps `linear-gradient(var(--cba-hover), var(--cba-hover))` and `linear-gradient(var(--cba-active), var(--cba-active))`
- `ghost` → keeps `background-color: var(--cba-hover)` and `background-color: var(--cba-active)`

### `docs/CONSUMER_GUIDE.md` — State Overlays Table Update

Update the "State overlays" table (lines 127–134):

| State | Solid variants (`primary`/`danger`/`success`) | `secondary` | `ghost` |
|-------|----------------------------------------------|-------------|---------|
| normal | base tokens only | base tokens only | transparent bg, `--cba-text-primary` |
| hover | `linear-gradient(var(--cba-hover-inverse), var(--cba-hover-inverse))` over base bg | `linear-gradient(var(--cba-hover), var(--cba-hover))` over base bg | `background-color: var(--cba-hover)` |
| active | `linear-gradient(var(--cba-active-inverse), var(--cba-active-inverse))` over base bg | `linear-gradient(var(--cba-active), var(--cba-active))` over base bg | `background-color: var(--cba-active)` |
| disabled / loading | `opacity: 0.6`, `cursor: not-allowed`, preserve base tokens | same | same |

---

## Open Question for User

The proposed fix adds two new design-system tokens (`--cba-hover-inverse`, `--cba-active-inverse`). An alternative would be to manually shift each solid variant's background color (e.g., `#6B5B4F` → `#7A6A5E` on hover) without new tokens. **The token approach is cleaner and maintainable** — but requires expanding the token surface. Proceed with the token approach?
