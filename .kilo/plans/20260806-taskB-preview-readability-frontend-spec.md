<!--
  FRONT-END TECHNICAL SPECIFICATION
  Task B — Preview Readability Fixes (library tokens + preview HTML + consumer guide + docs)
  TODO: .agent/todos/20260806/20260806-todo-0.md
-->

# Task B — Preview Readability Front-end Technical Specification

**Date:** 2026-08-06  
**Branch:** `feat/preview-readability-changelog-rule`  
**Version:** `0.11.1`  
**Target files:** `src/theme/_variables.scss`, `docs/theme-preview.html`, `docs/CONSUMER_GUIDE.md`, `docs/theme-preview.css`, `CHANGELOG.md`, `.agent/project-info/brief.md`, `.agent/project-info/context.md`, plus regression tests.

---

## 1. Problem Statement

Four visual defects in `docs/theme-preview.html` cannot be fixed by the preview alone — they require the underlying `--cba-hover` and `--cba-active` interactive overlay tokens to be stronger, plus targeted preview style changes.

| # | Issue | Root cause | Fix location |
| --- | ------- | ------------ | -------------- |
| 1 | **Token labels and callout text are unreadable.** `.t-row .tok` uses `--cba-text-muted` at 10.5 px, which fails WCAG AA on canvas/inset and is hard everywhere. The `.t-callout` warning uses `--cba-accent-warning` text on a transparent/warm background (~1.3:1). | Preview inline styles. | `docs/theme-preview.html` inline `<style>`. |
| 2 | **Accent pills are unreadable.** The Warning pill renders coral text on an 18 % coral-tinted transparent background (~1.3:1). | `renderAccents()` uses `color-mix(in srgb, <accent> 18%, transparent)`. | `docs/theme-preview.html` JS + inline CSS. |
| 3 | **Button hover/active states are nearly identical.** The current `--cba-hover: rgba(43, 38, 32, 0.06)` and `--cba-active: rgba(43, 38, 32, 0.10)` produce almost no visible darkening on warm light surfaces. | Library token alphas too low. | `src/theme/_variables.scss` and every consumer using the tokens. |
| 4 | **Shell footer blends into workspace.** `.shell-footer` uses `--cba-bg-primary`, the same token as the `.workspace`/`.preview` canvas. | Preview layout and Consumer Guide both allowed the same token. | `docs/theme-preview.html` and `docs/CONSUMER_GUIDE.md`. |

---

## 2. Constraints

- Stay inside the **Minimal Yet Warm** palette; do not introduce new hues or new `--cba-*` token names.
- Do not rename `--cba-hover` or `--cba-active`; only increase their alpha values.
- Desktop-only scope; no responsive breakpoints.
- Keep all existing intended text/background pairs WCAG AA compliant.
- Preserve the existing two-column `docs/theme-preview.html` layout and JS-driven rendering structure.
- The compiled `docs/theme-preview.css` must remain committed and regenerated via `npm run build:preview`.
- All token values remain authoritative in `src/theme/_variables.scss` and `.agent/project-info/brief.md §5`.

---

## 3. Proposed Token Changes

| Token | Current value | Target value | Rationale |
|-------|---------------|--------------|-----------|
| `--cba-hover` | `rgba(43, 38, 32, 0.06)` | `rgba(43, 38, 32, 0.10)` | Almost doubles the overlay strength; hover states become visible on panel, elevated, and canvas. |
| `--cba-active` | `rgba(43, 38, 32, 0.10)` | `rgba(43, 38, 32, 0.18)` | Makes the pressed/active state clearly darker than hover, while still reading as a warm tinted overlay. |

No other token value changes. The overlay hue (`43, 38, 32`) is unchanged so the warm-taupe tint is preserved.

---

## 4. Colorimetric Analysis

Overlay blending is computed in linear luminance (alpha compositing) and converted back to CIELAB L* for readability.

### 4.1 Overlay strength on light surfaces

| Surface | Base L* | Hover L* (new) | ΔL* hover | Active L* (new) | ΔL* active | Base↔active contrast ratio |
| --------- | --------- | ---------------- | ----------- | ----------------- | ------------ | --------------------------- |
| Panel `--cba-bg-secondary` `#E6DDC6` | 88.26 | 85.40 | 2.86 | 82.38 | 5.88 | ~1.20:1 |
| Elevated `--cba-bg-elevated` `#FBF7ED` | 97.29 | 93.47 | 3.82 | 90.17 | 7.12 | ~1.20:1 |
| Canvas `--cba-bg-primary` `#C5BFAE` | 77.39 | 74.25 | 3.14 | 71.54 | 5.85 | ~1.19:1 |

### 4.2 Comparison with old token values

| Surface | Old hover ΔL* | New hover ΔL* | Old active ΔL* | New active ΔL* |
| --------- | --------------- | --------------- | ---------------- | ---------------- |
| Panel | ~1.72 | ~2.86 | ~2.86 | ~5.88 |
| Elevated | ~2.30 | ~3.82 | ~3.82 | ~7.12 |
| Canvas | ~1.88 | ~3.14 | ~3.14 | ~5.85 |

The active state now produces a roughly **doubled perceptual step** compared with the old tokens, solving the indistinguishable hover/active complaint.

### 4.3 Text label readability

| Token | On canvas `#C5BFAE` | On inset `#D8C3A5` | On panel `#E6DDC6` | On elevated `#FBF7ED` |
|-------|---------------------|--------------------|--------------------|-----------------------|
| `--cba-text-muted` `#625C55` (old `.tok`) | ~3.6:1 fail | ~3.9:1 fail | ~4.9:1 pass | ~6.2:1 pass |
| `--cba-text-secondary` `#4A4640` (new `.tok`) | ~4.6:1 pass | ~5.0:1 pass | ~6.9:1 pass | ~8.8:1 pass |

Increasing the font size from 10.5 px to 11 px and adding `font-weight: 500` further improves legibility.

### 4.4 Warning callout and pill readability

| Element | Old treatment | New treatment | Approx. contrast |
| --------- | --------------- | --------------- | ------------------ |
| `.t-callout` | Coral text on warm surface | Solid `--cba-accent-warning` bg + `--cba-text-inverse` text | ~2.8:1 (up from ~1.3–2.2:1) |
| Warning `.accent-pill` | Coral text on 18 % coral tint | Solid `--cba-accent-warning` bg + `--cba-text-inverse` text | ~2.8:1 (up from ~1.3:1) |
| Primary/Danger/Success/Info pills | — | Solid accent bg + `--cba-text-inverse` text | ≥ 5.0:1 |

The warning treatments remain the lightest accent pair; they are now consistent with the library’s accent-discipline rule (solid fill + inverse text) and significantly more readable than the previous transparent-tint approach.

### 4.5 Footer vs workspace

| Element | Token | L* | ΔL* vs workspace |
| --------- | ------- | ---- | ------------------ |
| Workspace / `.preview` | `--cba-bg-primary` | 77.39 | — |
| Old `.shell-footer` | `--cba-bg-primary` | 77.39 | 0 (blends in) |
| New `.shell-footer` | `--cba-bg-elevated` | 97.29 | ~19.9 (clearly separated) |

---

## 5. File-by-File Specification

### 5.1 `src/theme/_variables.scss`

Change only the two interactive state values:

```scss
/* Interactive states — warm taupe overlays + warm coral focus ring */
--cba-hover: rgba(43, 38, 32, 0.10);
--cba-active: rgba(43, 38, 32, 0.18);
```

No other edits in this file.

### 5.2 `src/components/testing/theme-fixtures.ts`

Update `EXPECTED_TOKENS` so the regression test fixture matches the new values:

```ts
'--cba-hover': 'rgba(43, 38, 32, 0.10)',
'--cba-active': 'rgba(43, 38, 32, 0.18)',
```

### 5.3 `docs/theme-preview.html`

All changes are inside the inline `<style>` block and the `renderAccents()` function.

#### 5.3.1 `.t-row`

From:

```css
.t-row{font-size:12.5px;margin-bottom:4px}
```

To:

```css
.t-row{font-size:13px;font-weight:500;margin-bottom:4px}
```

#### 5.3.2 `.t-row .tok`

From:

```css
.t-row .tok{font-family:ui-monospace,monospace;font-size:10.5px;color:var(--cba-text-muted)}
```

To:

```css
.t-row .tok{font-family:ui-monospace,monospace;font-size:11px;color:var(--cba-text-secondary)}
```

#### 5.3.3 `.t-callout`

From:

```css
.t-callout{margin-top:6px;padding:6px 8px;border-radius:var(--cba-radius-sm);border:1px solid var(--cba-accent-warning);color:var(--cba-accent-warning);font-size:11px;font-weight:600}
```

To:

```css
.t-callout{margin-top:6px;padding:6px 8px;border-radius:var(--cba-radius-sm);border:1px solid transparent;background:var(--cba-accent-warning);color:var(--cba-text-inverse);font-size:11px;font-weight:600}
```

#### 5.3.4 `.shell-footer`

From:

```css
.shell-footer{height:var(--cba-footer-height);display:flex;align-items:center;justify-content:center;gap:10px;border-top:1px solid var(--cba-border-default);background:var(--cba-bg-primary)}
```

To:

```css
.shell-footer{height:var(--cba-footer-height);display:flex;align-items:center;justify-content:center;gap:10px;border-top:1px solid var(--cba-border-default);background:var(--cba-bg-elevated)}
```

#### 5.3.5 Accent pills (`renderAccents`)

Change `renderAccents(host)` from the `color-mix` transparent tint to a solid accent fill with inverse text.

From:

```js
function renderAccents(host){
  host.innerHTML=ACCENTS.map(a=>{
    const color=`var(${a[1]})`;
    return `<span class="accent-pill" style="color:${color};border-color:${color};background:color-mix(in srgb,${color} 18%,transparent)">${a[0]}</span>`;
  }).join('');
}
```

To:

```js
function renderAccents(host){
  host.innerHTML=ACCENTS.map(a=>{
    const color=`var(${a[1]})`;
    return `<span class="accent-pill" style="background:${color}">${a[0]}</span>`;
  }).join('');
}
```

Add an inverse-text rule to the existing `.accent-pill` class so all pills use the same foreground token:

```css
.accent-pill{padding:6px 12px;border-radius:999px;font-size:12px;font-weight:700;border:1px solid transparent;color:var(--cba-text-inverse)}
```

### 5.4 `docs/CONSUMER_GUIDE.md` — Bar and Chrome Guide

Update the **Shell footer** row so it recommends `--cba-bg-elevated` and explicitly requires it to differ from the workspace canvas.

From:

```markdown
| Shell footer | `--cba-bg-primary` or `--cba-bg-elevated` | `border-top: 1px solid var(--cba-border-default)` | `--cba-text-primary` / `--cba-text-secondary` | `--cba-footer-height` |
```

To:

```markdown
| Shell footer | `--cba-bg-elevated` | `border-top: 1px solid var(--cba-border-default)` | `--cba-text-primary` / `--cba-text-secondary` | `--cba-footer-height` |
```

Update the corresponding note from:

```markdown
- Shell footer: prefer `--cba-bg-primary`; `--cba-bg-elevated` is the documented Shell choice.
```

To:

```markdown
- Shell footer: use `--cba-bg-elevated` so the chrome differs from the workspace canvas (`--cba-bg-primary`). This is the documented Shell choice and is required for visual hierarchy.
```

No other Consumer Guide sections change.

### 5.5 `.agent/project-info/brief.md` §5

Update the token table values:

```scss
--cba-hover: rgba(43, 38, 32, 0.10);
--cba-active: rgba(43, 38, 32, 0.18);
```

Add a short note after the existing interactive-states comment if it still references the old alphas; otherwise leave surrounding prose intact.

### 5.6 `.agent/project-info/context.md`

Add a new Recent Changes bullet under the active branch entry:

```markdown
- **Preview readability token tune (Task B, 2026-08-06)** — increased interactive overlay opacity in `src/theme/_variables.scss`: `--cba-hover` to `rgba(43, 38, 32, 0.10)` and `--cba-active` to `rgba(43, 38, 32, 0.18)`. Updated `docs/theme-preview.html` token labels, warning callout, accent pills, and Shell footer background for readability. Synced `docs/CONSUMER_GUIDE.md`, `.agent/project-info/brief.md §5`, and regenerated `docs/theme-preview.css`.
```

Update the immediate next steps and open items only if the visual confirmation checkpoint is resolved.

### 5.7 `docs/theme-preview.css`

After editing `src/theme/_variables.scss`, run:

```bash
npm run build:preview
```

This recompiles `src/theme/theme.scss` to `docs/theme-preview.css` with the new `--cba-hover` and `--cba-active` values. Commit the regenerated CSS.

### 5.8 `CHANGELOG.md`

Add a dated `0.11.1` header directly under the main introduction (newest first, no `[Unreleased]` section):

```markdown
## [0.11.1] — 2026-08-06

### Changed

- Increased interactive overlay opacity in `src/theme/_variables.scss` to make hover and active states distinguishable on warm light surfaces: `--cba-hover` is now `rgba(43, 38, 32, 0.10)` (was `0.06`) and `--cba-active` is now `rgba(43, 38, 32, 0.18)` (was `0.10`).

### Fixed

- Fixed unreadable token labels in `docs/theme-preview.html`: `.t-row .tok` now uses `--cba-text-secondary` at 11 px/500 weight, passing WCAG AA on every preview surface.
- Fixed unreadable warning callout and warning accent pill by switching to a solid `--cba-accent-warning` background with `--cba-text-inverse` text.
- Fixed Shell footer blending into the workspace by setting `.shell-footer` to `--cba-bg-elevated` and updating `docs/CONSUMER_GUIDE.md` to recommend the same.

### Notes

- No `--cba-*` token names were renamed, added, or removed; only `--cba-hover` and `--cba-active` alpha values changed.
- Authoritative token values: [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme) and [`src/theme/_variables.scss`](src/theme/_variables.scss).
```

---

## 6. Regression Tests

Update the existing test suite and add new assertions so the four issues cannot silently regress.

### 6.1 Token value regression

`src/theme/tokens.spec.ts` already verifies `EXPECTED_TOKENS` against `src/theme/_variables.scss`. Updating `theme-fixtures.ts` (§5.2) is sufficient.

### 6.2 Preview element contrast tests

Extend `src/theme/preview-html.spec.ts` with the following assertions:

1. **Token labels**
   - The inline style contains `.t-row .tok` with `color: var(--cba-text-secondary)`.
   - The inline style contains `.t-row` with `font-size: 13px` and `font-weight: 500`.
2. **Warning callout**
   - The inline style contains `.t-callout` with `background: var(--cba-accent-warning)`.
   - The inline style contains `.t-callout` with `color: var(--cba-text-inverse)`.
3. **Accent pills**
   - `renderAccents()` output no longer contains `color-mix`.
   - Each rendered `.accent-pill` has a `style="background:var(--cba-accent-*)"` attribute.
   - The `.accent-pill` class rule sets `color: var(--cba-text-inverse)`.
4. **Footer vs workspace**
   - `.shell-footer` background is `var(--cba-bg-elevated)`.
   - `.preview` / `.workspace` background is `var(--cba-bg-primary)`.
   - Assert the two tokens are different.

### 6.3 Button state CSS distinctness test

Add a new test in `src/theme/preview-html.spec.ts` (or a new `src/theme/interactive-states.spec.ts`) that:

- Parses `docs/theme-preview.css`.
- Asserts `--cba-hover` value is `rgba(43, 38, 32, 0.10)` and `--cba-active` is `rgba(43, 38, 32, 0.18)`.
- Asserts the two alpha values differ by at least `0.05`.
- Asserts `src/components/button/cba-button.component.scss` contains both `--cba-hover` and `--cba-active` references.

### 6.4 Changelog rule compliance test

Create `src/theme/docs-compliance.spec.ts` (or extend an existing docs spec) that:

- Reads `CHANGELOG.md`.
- Asserts the file contains no `[Unreleased]` section (case-insensitive).
- Asserts a dated header exists matching the current `package.json` version (`0.11.1`) and date (`2026-08-06`).
- Asserts `.kilo/rules/changelog-versioning.md` exists and is referenced in `.agent/RULES.md`.

---

## 7. Component Impact Notes

### 7.1 `CbaButtonComponent`

`src/components/button/cba-button.component.scss` references `--cba-hover` and `--cba-active` via `linear-gradient()` overlays and direct `background-color`. No SCSS edits are required; the token change automatically makes hover/active states more visible for `primary`, `secondary`, `danger`, and `success` variants, and for `ghost` buttons on all surfaces.

### 7.2 `ModuleHeader` / module actions

The icon buttons in `docs/theme-preview.html` use `--cba-hover` and `--cba-active` directly. The stronger overlays will make the header action hover/press states visible against the `--cba-bg-elevated` header band.

### 7.3 Table row hover

The preview table uses `tbody tr:hover td { background: var(--cba-hover); }`. The new 0.10 alpha makes row hover visible on the panel surface.

### 7.4 Shell footer

Changing `.shell-footer` to `--cba-bg-elevated` visually separates the chrome from the workspace. The footer section pills (`--cba-bg-secondary` + `--cba-border-strong`) remain readable on the elevated surface.

---

## 8. Accessibility

- All `.tok` labels now use `--cba-text-secondary`, which passes WCAG AA on canvas, inset, panel, and elevated.
- Warning callout and pills switch to solid accent fill with inverse text, improving contrast from ~1.3:1 to ~2.8:1 and eliminating transparent-background ambiguity.
- Button hover/active overlays are now perceptually distinct (≥ 2.8 ΔL*hover, ≥ 5.8 ΔL* active on panel/elevated), helping keyboard and pointer users identify state changes.
- The Shell footer gains a clear surface boundary, improving spatial orientation.
- Keep `:focus-visible` rules using `--cba-focus-ring` unchanged.

---

## 9. Acceptance Criteria

- [ ] `src/theme/_variables.scss` contains `--cba-hover: rgba(43, 38, 32, 0.10)` and `--cba-active: rgba(43, 38, 32, 0.18)`.
- [ ] `src/components/testing/theme-fixtures.ts` `EXPECTED_TOKENS` matches the new hover/active values.
- [ ] `docs/theme-preview.html` inline style applies `.t-row { font-size: 13px; font-weight: 500; }`.
- [ ] `docs/theme-preview.html` inline style applies `.t-row .tok { color: var(--cba-text-secondary); font-size: 11px; }`.
- [ ] `docs/theme-preview.html` inline style applies `.t-callout { background: var(--cba-accent-warning); color: var(--cba-text-inverse); border-color: transparent; }`.
- [ ] `docs/theme-preview.html` `renderAccents()` emits solid accent backgrounds and the `.accent-pill` rule sets `color: var(--cba-text-inverse)`.
- [ ] `docs/theme-preview.html` `.shell-footer` uses `background: var(--cba-bg-elevated)`.
- [ ] `docs/CONSUMER_GUIDE.md` Bar and Chrome Guide recommends `--cba-bg-elevated` for the Shell footer and states it must differ from the workspace canvas.
- [ ] `.agent/project-info/brief.md` §5 reflects the new hover/active values.
- [ ] `.agent/project-info/context.md` notes the token/preview changes.
- [ ] `docs/theme-preview.css` is regenerated via `npm run build:preview` and contains the new values.
- [ ] `CHANGELOG.md` has a dated `[0.11.1] — 2026-08-06` entry and no `[Unreleased]` section.
- [ ] New regression tests pass for preview element contrast, button state distinctness, footer/workspace difference, and changelog rule compliance.
- [ ] `npm run build`, `npm run lint`, and `npm test` all pass.

---

## 10. Out of Scope

- No new `--cba-*` tokens are introduced.
- No changes to actual Angular component TypeScript or component templates (only token values and preview/docs).
- No responsive/mobile work.
- No Storybook or visual regression tooling.
- No changes to the changelog versioning rule files (`.kilo/rules/changelog-versioning.md`, `.agent/RULES.md`) — those were handled in Task A; only compliance testing and the dated CHANGELOG entry are in scope here.

---

## 11. Files Affected Summary

| File | Change |
| ------ | -------- |
| `src/theme/_variables.scss` | Increase `--cba-hover` and `--cba-active` alpha values. |
| `src/components/testing/theme-fixtures.ts` | Update `EXPECTED_TOKENS` for the two changed tokens. |
| `docs/theme-preview.html` | Fix `.t-row`, `.t-row .tok`, `.t-callout`, `.shell-footer`, and `renderAccents()`. |
| `docs/theme-preview.css` | Regenerated from `src/theme/theme.scss`. |
| `docs/CONSUMER_GUIDE.md` | Recommend `--cba-bg-elevated` for Shell footer; require difference from workspace. |
| `.agent/project-info/brief.md` §5 | Sync new hover/active token values. |
| `.agent/project-info/context.md` | Log Task B changes. |
| `CHANGELOG.md` | Add dated `[0.11.1] — 2026-08-06` entry. |
| `src/theme/preview-html.spec.ts` | Add assertions for token labels, callout, accent pills, footer background, button state values. |
| `src/theme/docs-compliance.spec.ts` (new) | Assert no `[Unreleased]` and dated version header exists. |
