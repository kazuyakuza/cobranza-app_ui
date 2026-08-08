# Cluster 2 Front-end Technical Specification — Phase 10 Theme Hardening

**Scope:** Focus ring stress test, ModuleHeader icons & order, component wiring (form controls, dropdown selected), ModuleContainer/ModuleHeader border audit.

---

## 5. Focus Ring Stress Test

### Existing token
`--cba-focus-ring: 0 0 0 3px rgba(232, 90, 79, 0.45)`

### Verification checklist

| Surface / element | Token | Expected visibility | Action if fails |
|-------------------|-------|---------------------|-----------------|
| Canvas | `--cba-bg-primary` (#BCB5A4) | Coral ring visible against warm sand. | Increase alpha to 0.55. |
| Panel | `--cba-bg-secondary` (#F2F0E8) | Coral ring clearly visible. | No change expected. |
| Elevated | `--cba-bg-elevated` (#FDFCF8) | Coral ring clearly visible. | No change expected. |
| Inset | `--cba-bg-tertiary` (#D8C3A5) | Coral ring visible; if not, increase alpha to 0.55. | Test and adjust only if failure. |
| Taupe primary button | `--cba-accent-primary` (#6B5B4F) | Use focus ring as-is; coral contrasts with taupe. | If fails, add inner white ring. |
| Danger button | `--cba-accent-danger` (#B93E36) | Coral may be hard to see on red. | Add inner white ring: `box-shadow: 0 0 0 2px var(--cba-text-inverse), 0 0 0 4px var(--cba-accent-danger);` |
| Success button | `--cba-accent-success` (#3E6B4F) | Coral may be hard to see on green. | Add inner white ring if needed. |
| Ghost button | transparent | Ring visible on any background. | No change expected. |
| Icon button | transparent on `--cba-bg-elevated` | Ring visible around the 32×32 square. | No change expected. |
| Text input | `--cba-bg-secondary` | Ring visible on cream panel. | No change expected. |

### Decision
Keep `rgba(232, 90, 79, 0.45)` unless a specific failure is found during preview verification. Adjust alpha/spread only if failures appear.

---

## 12. ModuleHeader Icons & Order

### Current icons (to replace)
- Collapse/expand: `faChevronUp` / `faChevronDown` — KEEP (correct icons)
- Size toggle (100%→50%): `faCompress` — REPLACE with `faArrowsLeftRightToLine`
- Size toggle (50%→100%): `faExpand` — REPLACE with `faArrowsLeftRight`
- Fullscreen: `faExpand` — REPLACE with `faWindowMaximize`
- Remove: `faXmark` — KEEP (correct icon)

### New icons to add
- Drag handle: `faUpDownLeftRight` (Font Awesome Free Solid)

### Icon order (left to right in actions nav)
1. Drag handle (`faUpDownLeftRight`) — visual only, no click handler (drag is Shell responsibility, but icon is present per spec)
2. Collapse/expand (`faChevronUp` / `faChevronDown`)
3. Size toggle (`faArrowsLeftRightToLine` / `faArrowsLeftRight`)
4. Fullscreen (`faWindowMaximize`)
5. Remove (`faXmark`)

### Technical details
- The drag handle button must be present in the template but does NOT emit any output. It is a visual placeholder. The Shell wires drag behavior externally.
- Add aria-label for drag handle from `CBA_UI_MESSAGES.moduleHeader.aria.drag`.
- Update `module-header.component.ts` imports:
  - Add `faUpDownLeftRight`, `faArrowsLeftRightToLine`, `faArrowsLeftRight`, `faWindowMaximize` from `@fortawesome/free-solid-svg-icons`.
  - Remove `faCompress` and `faExpand` imports (unused after replacement).
- Update template order in `module-header.component.html`.
- Update computed icons/labels in `module-header.component.ts`.

---

## B. Component / Style Wiring

### ModuleContainer / ModuleHeader border audit

**Current state:**
- `ModuleContainer` uses `border: 1px solid var(--cba-border-subtle)` when not fullscreen.
- `ModuleHeader` uses `border-bottom: 1px solid var(--cba-border-subtle)`.

**Required change:**
- `ModuleContainer` (not fullscreen) should use `border: 1px solid var(--cba-border-default)` for structural module edges. Keep `border-subtle` for internal dividers only.
- `ModuleHeader` should use `border-bottom: 1px solid var(--cba-border-default)` to separate the elevated header from the panel body.

### Form control state wiring

**`CbaFieldComponent` (`src/components/form-field/cba-field.component.ts` and `.scss`)**

Current host classes:
- `.cba-field--disabled` (exists)
- `.cba-field--error` (exists)

Add host classes and visual states:
- `.cba-field--readonly`:
  - Background: `--cba-bg-tertiary`
  - Border: `--cba-border-subtle`
  - Text: `--cba-text-secondary`
  - Cursor: default
  - Distinct from disabled (no opacity reduction).
- `.cba-field--valid`:
  - Border: `--cba-state-valid-border`
  - Text: `--cba-state-valid-text`
- `.cba-field--invalid`:
  - Rename concept from `.cba-field--error` to `.cba-field--invalid` (or keep both for backwards compatibility).
  - Border: `--cba-state-invalid-border`
  - Text: `--cba-state-invalid-text`
- `.cba-field--focused`:
  - Already handled by `:focus-within` on `.cba-field__control`.
  - Keep existing: `border-color: var(--cba-accent-primary); box-shadow: var(--cba-focus-ring);`

**`CbaInputComponent`**
- Add `readonly` input → bind to host class `.cba-input--readonly`.
- Add `valid` input → bind to host class `.cba-input--valid`.
- Ensure existing `.cba-input--disabled` and `.cba-input--error` still work.

**`CbaSelectComponent`**
- Same as CbaInput: add `readonly` and `valid` inputs + host classes.

**`CbaDatepickerComponent`**
- Same as CbaInput: add `readonly` and `valid` inputs + host classes.

**Note:** No validation engine. `valid` and `error` are purely visual inputs. Consumers set them based on their own validation logic.

### Dropdown selected option styling

**Current state:** `cba-dropdown.component.scss` styles `[ngbDropdownItem]:active` and `[ngbDropdownItem].active` with `background-color: var(--cba-active)`.

**Required change:**
- Add `[ngbDropdownItem].selected` or enhance `.active` to use selected tokens when an item is actively chosen (not just hovered/pressed).
- ng-bootstrap `NgbDropdownItem` adds `.active` class when the item is the active item in the menu (keyboard navigation), but this is NOT the same as "selected".
- Since the library is a thin wrapper, if ng-bootstrap does not expose a "selected" state easily, we should:
  - Document the pattern in `docs/CBA_DROPDOWN.md`: consumers should add a custom class (e.g., `.cba-dropdown__item--selected`) to the item they want to mark as selected, and style it with `--cba-selected-bg` / `--cba-selected-text`.
  - Add the CSS rule in `cba-dropdown.component.scss`:
    ```scss
    .cba-dropdown__menu .cba-dropdown__item--selected {
      background-color: var(--cba-selected-bg);
      color: var(--cba-selected-text);
    }
    ```
- This is a "documented pattern + minimal CSS" approach rather than full wiring, which respects the "thin wrapper" principle.

### ModuleHeader title typography

- Apply `.cba-text-heading-md` (or `font-size: var(--cba-font-size-heading-md); font-weight: 600;`) to `.cba-module-header__section--title`.
- Current title uses default font-size; it should use the defined type scale.

---

## Acceptance Criteria for Cluster 2

1. `ModuleHeader` icon order matches spec: drag, collapse, size toggle, fullscreen, remove.
2. `ModuleHeader` uses new Font Awesome icons per spec.
3. `ModuleContainer` and `ModuleHeader` use `border-default` for structural edges.
4. Form controls (`CbaInput`, `CbaSelect`, `CbaDatepicker`) have `readonly` and `valid` visual states wired.
5. `CbaFieldComponent` has `.cba-field--readonly`, `.cba-field--valid`, and `.cba-field--invalid` styles.
6. Dropdown has documented selected pattern + CSS rule.
7. ModuleHeader title uses a defined typography step.
8. Focus ring is verified on all major surfaces and button variants (document results; adjust only if failures).
9. `npm test` and `npm run lint` pass.
