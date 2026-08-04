# Front-end Technical Specification: Lighten Gray Theme

## 1. Objective

Shift the `@cobranza-apps/ui` theme from a near-dark gray palette to a lighter, medium-gray palette while keeping the `--cba-` token names unchanged. The new palette must satisfy WCAG AA 4.5:1 contrast minimum for text on the backgrounds it is intended to be used on.

## 2. Scope

- **In scope**: `src/theme/_variables.scss` token values only. Token names are preserved.
- **Out of scope**: Accent colors (`--cba-accent-*`), layout constants (`--cba-header-height`, etc.), radius, and spacing tokens are unchanged.
- **Guidance**: Hover, active, shadow, and overlay tokens are updated because the lighter background changes the perceptual impact of white vs. dark overlays and black shadows.

## 3. Current vs. Proposed Values

| Token | Current Value | Proposed Value | Rationale |
| --- | --- | --- | --- |
| `--cba-bg-primary` | `#2a2d32` | `#7a838d` | Main surface; noticeably lighter medium gray, still clearly gray. |
| `--cba-bg-secondary` | `#34383e` | `#8c95a0` | Secondary surface; one step lighter than primary. |
| `--cba-bg-tertiary` | `#3e434a` | `#9da6b0` | Tertiary surface; lighter still. |
| `--cba-bg-elevated` | `#454a52` | `#aeb6bf` | Elevated/popover surfaces; lightest gray, not white. |
| `--cba-bg-overlay` | `rgba(0, 0, 0, 0.55)` | `rgba(0, 0, 0, 0.32)` | Lighter overlay because the underlying surfaces are already lighter. |
| `--cba-text-primary` | `#e8eaed` | `#0f1115` | Near-black text for strong contrast on light gray backgrounds. |
| `--cba-text-secondary` | `#b0b4ba` | `#15181c` | Dark gray text; passes AA on all proposed backgrounds. |
| `--cba-text-muted` | `#8b9098` | `#212429` | Lower-emphasis text; passes AA on secondary, tertiary, and elevated surfaces. |
| `--cba-text-inverse` | `#1a1d21` | `#e8eaed` | Light text for dark surfaces / overlays (logical inverse of new primary text). |
| `--cba-border-subtle` | `#4a4f57` | `#aeb6bf` | Subtle border; light gray visible on primary/secondary. |
| `--cba-border-default` | `#5a606a` | `#707880` | Default border; mid-gray visible on lighter surfaces. |
| `--cba-border-strong` | `#6b7280` | `#4a5059` | Strong border; dark gray for clear separation. |
| `--cba-hover` | `rgba(255, 255, 255, 0.06)` | `rgba(0, 0, 0, 0.06)` | Dark hover overlay suitable for light gray surfaces. |
| `--cba-active` | `rgba(255, 255, 255, 0.10)` | `rgba(0, 0, 0, 0.10)` | Dark active overlay suitable for light gray surfaces. |
| `--cba-focus-ring` | `0 0 0 3px rgba(59, 130, 246, 0.45)` | `0 0 0 3px rgba(59, 130, 246, 0.45)` | Unchanged; works on both dark and light gray surfaces. |
| `--cba-shadow-module` | `0 4px 16px rgba(0, 0, 0, 0.28)` | `0 4px 16px rgba(0, 0, 0, 0.18)` | Reduced opacity because the lighter surfaces make the same shadow appear heavier. |
| `--cba-shadow-elevated` | `0 8px 24px rgba(0, 0, 0, 0.35)` | `0 8px 24px rgba(0, 0, 0, 0.25)` | Reduced opacity for the same reason. |

## 4. Contrast Rationale (WCAG AA)

Relative luminance and contrast ratios are approximated against the sRGB WCAG formula. The target is a minimum 4.5:1 for normal text.

| Text Token | Background | Proposed Pair | Contrast Ratio | Pass AA |
| --- | --- | --- | --- | --- |
| `--cba-text-primary` (#0f1115, L~0.005) | `--cba-bg-primary` (#7a838d, L~0.224) | `#0f1115` on `#7a838d` | ~5.0:1 | Yes |
| `--cba-text-primary` (#0f1115) | `--cba-bg-secondary` (#8c95a0, L~0.296) | `#0f1115` on `#8c95a0` | ~6.3:1 | Yes |
| `--cba-text-primary` (#0f1115) | `--cba-bg-tertiary` (#9da6b0, L~0.375) | `#0f1115` on `#9da6b0` | ~7.7:1 | Yes |
| `--cba-text-primary` (#0f1115) | `--cba-bg-elevated` (#aeb6bf, L~0.463) | `#0f1115` on `#aeb6bf` | ~9.3:1 | Yes |
| `--cba-text-secondary` (#15181c, L~0.009) | `--cba-bg-primary` (#7a838d, L~0.224) | `#15181c` on `#7a838d` | ~4.6:1 | Yes |
| `--cba-text-secondary` (#15181c) | `--cba-bg-secondary` (#8c95a0) | `#15181c` on `#8c95a0` | ~5.9:1 | Yes |
| `--cba-text-secondary` (#15181c) | `--cba-bg-tertiary` (#9da6b0) | `#15181c` on `#9da6b0` | ~7.2:1 | Yes |
| `--cba-text-secondary` (#15181c) | `--cba-bg-elevated` (#aeb6bf) | `#15181c` on `#aeb6bf` | ~8.7:1 | Yes |
| `--cba-text-muted` (#212429, L~0.017) | `--cba-bg-primary` (#7a838d) | `#212429` on `#7a838d` | ~4.0:1 | **No** |
| `--cba-text-muted` (#212429) | `--cba-bg-secondary` (#8c95a0) | `#212429` on `#8c95a0` | ~5.1:1 | Yes |
| `--cba-text-muted` (#212429) | `--cba-bg-tertiary` (#9da6b0) | `#212429` on `#9da6b0` | ~6.3:1 | Yes |
| `--cba-text-muted` (#212429) | `--cba-bg-elevated` (#aeb6bf) | `#212429` on `#aeb6bf` | ~7.6:1 | Yes |
| `--cba-text-inverse` (#e8eaed) | `--cba-bg-overlay` (blended) | light text on dark overlay | >7:1 | Yes |

### Usage guidance for `--cba-text-muted`

`--cba-text-muted` **must not** be used on `--cba-bg-primary`. It is approved for use on `--cba-bg-secondary`, `--cba-bg-tertiary`, and `--cba-bg-elevated`. Consumers should prefer `--cba-text-secondary` on `--cba-bg-primary` when lower-emphasis text is required, or move the muted content to a lighter surface.

## 5. Additional Files to Review

A workspace grep found no hard-coded hex/RGBA colors in other theme files. All color references already use `--cba-*` tokens. However, the following files consume the updated tokens and should be visually verified after the change:

- `src/theme/_base.scss` — uses `var(--cba-text-primary)` for body/heading text; `var(--cba-accent-primary)` for links; `var(--cba-text-secondary)` for small text; `var(--cba-focus-ring)` for focus. No hard-coded colors.
- `src/theme/_utilities.scss` — generated classes map directly to variables; no hard-coded colors.
- `src/theme/_mixins.scss` — uses `var(--cba-bg-elevated)`, `var(--cba-border-subtle)`, `var(--cba-hover)`, `var(--cba-shadow-module)`, `var(--cba-focus-ring)`. No hard-coded colors.
- `src/theme/_modal.scss` — uses `--cba-bg-overlay`, `--cba-bg-elevated`, `--cba-border-subtle`, `--cba-shadow-elevated`, `--cba-text-primary`. No hard-coded colors.
- `src/theme/_datepicker.scss` — uses `--cba-bg-elevated`, `--cba-bg-tertiary`, `--cba-border-subtle`, `--cba-border-default`, `--cba-text-primary`, `--cba-text-muted`, `--cba-text-inverse`, `--cba-accent-primary`, `--cba-focus-ring`. No hard-coded colors.
- `src/theme/_accordion.scss` — uses `--cba-bg-secondary`, `--cba-bg-tertiary`, `--cba-border-subtle`, `--cba-text-primary`, `--cba-text-muted`, `--cba-hover`, `--cba-active`, `--cba-focus-ring`. No hard-coded colors.
- `src/theme/_popover.scss` — uses `--cba-bg-elevated`, `--cba-border-subtle`, `--cba-shadow-elevated`, `--cba-text-primary`, `--cba-text-secondary`. No hard-coded colors.
- `src/theme/_typeahead.scss` — uses `--cba-bg-elevated`, `--cba-border-subtle`, `--cba-shadow-elevated`, `--cba-text-primary`, `--cba-text-muted`, `--cba-hover`, `--cba-active`, `--cba-focus-ring`, `--cba-accent-primary`. No hard-coded colors.
- Component SCSS files that consume `--cba-hover`, `--cba-active`, `--cba-text-inverse`, or `--cba-text-muted` should be checked for assumptions about the old dark palette (e.g., expecting `--cba-hover` to lighten the surface).

## 6. Open Considerations for Implementation

1. **Accent colors**: The accent palette (`--cba-accent-primary`, `--cba-accent-success`, `--cba-accent-warning`, `--cba-accent-danger`, `--cba-accent-info`) is unchanged. With the new light `--cba-text-inverse` (#e8eaed), text placed on these bright accent colors will have lower contrast than the old dark text-inverse. Components that put text-inverse on accent colors (e.g., the selected date in the datepicker) should be verified; if the contrast is insufficient, a separate task to adjust accent colors or their text color should be created.
2. **Disabled states**: The existing disabled styles apply `opacity: 0.65` to `--cba-text-muted`. On `--cba-bg-secondary`, the effective contrast of muted text at 65% opacity is below 4.5:1. This is acceptable for non-interactive disabled elements, but the usage should be validated.
3. **Bootstrap overrides**: Bootstrap's default light theme may conflict with the new medium-gray theme. Consumers should import the `theme.scss` entry globally to ensure `--cba-*` variables are present and override Bootstrap defaults where needed.
4. **Hover/active overlays**: The change from white to black overlays (`rgba(255,255,255,0.06)` -> `rgba(0,0,0,0.06)`) is required for visibility on light gray surfaces. All components relying on `--cba-hover`/`--cba-active` will automatically adopt the correct behavior.

## 7. Acceptance Criteria

- [ ] `src/theme/_variables.scss` contains only the proposed values; all `--cba-` names are preserved.
- [ ] All text/background pairs used in the library (primary, secondary, elevated surfaces) meet WCAG AA 4.5:1, except documented intentional low-contrast disabled states.
- [ ] `--cba-text-muted` is never used on `--cba-bg-primary` in library-owned components.
- [ ] `npm run build` and `npm run lint` pass after the change.
- [ ] A visual/manual QA pass confirms the new palette is noticeably lighter while remaining gray and professional.
