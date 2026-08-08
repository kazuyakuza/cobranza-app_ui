# Fix Preview HTML Accuracy — Module Header Mockup

**Scope:** `docs/theme-preview.html` module header and container mockup must match the actual library component definitions 100%.

**Trigger:** User identified that the preview's module header still shows old Unicode icons in wrong order, and the preview uses ad-hoc inline styles instead of the library's actual compiled CSS classes.

---

## Problem Statement

The `docs/theme-preview.html` Shell mockup section (`.module` / `.module-header` / `.module-actions`) was written early and uses:
- **Wrong icon order** and **wrong icon glyphs** (Unicode `⌃⛶✕⧉` instead of the actual Font Awesome icons).
- **Ad-hoc CSS classes** (`.module-header`, `.module-actions`, `.module-title`) with inline `<style>` rules that may drift from the actual component SCSS.
- **Hardcoded values** (`border-radius: 12px`, `min-height: 42px`, `font-size: 15px`) instead of library tokens.

The library now ships compiled `docs/theme-preview.css` which includes:
- All `--cba-*` CSS variables on `:root`
- All `.cba-*` utility classes (backgrounds, text, borders, radius, shadows, spacing, typography)

But the **module header and container classes are NOT emitted** in `theme-preview.css` because they live in Angular component SCSS files with `ViewEncapsulation.Emulated` — those styles are bundled into the Angular library, not the standalone preview CSS.

---

## Solution Approach

### Option A: Inline the exact component SCSS rules into preview `<style>`
Copy the relevant selectors from `module-header.component.scss` and `module-container.component.scss` into the preview's inline `<style>`, maintaining the exact class names (`cba-module-header`, `cba-module-header__action`, etc.).

**Pros:** 100% accurate to component; no duplication of token values; easy to verify.
**Cons:** Duplicate CSS between component files and preview; manual sync required if component SCSS changes.

### Option B: Load Font Awesome + use component classes
Add a Font Awesome CDN link to the preview HTML. Replace the mockup's custom `.module-header` structure with the actual component HTML structure (using `cba-module-header`, `cba-module-header__section`, etc.). Copy the component SCSS rules into the preview `<style>` block.

**Pros:** Truest to the actual component; icons match exactly; structure matches exactly.
**Cons:** Requires Font Awesome CDN; larger HTML file.

### Option C: Keep custom classes but fix tokens and icon order
Update the existing `.module-header` / `.module-actions` inline styles to use correct tokens and correct Unicode/emoji representations for icons, while keeping the simplified structure.

**Pros:** Minimal change; no external dependencies.
**Cons:** Still not 100% accurate to component structure.

---

## Recommended: Hybrid Approach (Option B with minimal scope)

1. **Add Font Awesome CDN** to `<head>`:
   ```html
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
   ```
   (Or use a local copy if available. For a file:// preview, CDN is acceptable if network is available; otherwise use SVG/emoji fallbacks.)

2. **Replace module header mockup structure** to match `module-header.component.html` exactly:
   - Use `<header class="cba-module-header">`
   - Status section: `<div class="cba-module-header__section cba-module-header__section--status">` with checkmark icon (`<i class="fa-solid fa-check"></i>`)
   - Title: `<div class="cba-module-header__section cba-module-header__section--title cba-text-heading-md">Clientes List</div>`
   - Actions nav: 5 buttons in exact order with exact classes and Font Awesome icons:
     1. Drag: `<button class="cba-module-header__action cba-module-header__action--drag"><i class="fa-solid fa-up-down-left-right"></i></button>`
     2. Collapse: `<button class="cba-module-header__action"><i class="fa-solid fa-chevron-up"></i></button>`
     3. Size toggle: `<button class="cba-module-header__action"><i class="fa-solid fa-arrows-left-right-to-line"></i></button>`
     4. Fullscreen: `<button class="cba-module-header__action"><i class="fa-solid fa-window-maximize"></i></button>`
     5. Remove: `<button class="cba-module-header__action"><i class="fa-solid fa-xmark"></i></button>`

3. **Inline the component SCSS rules** into the preview `<style>` block for:
   - `.cba-module-header` and all child selectors (copied from `module-header.component.scss`)
   - `.cba-module-container` and child selectors (copied from `module-container.component.scss`)
   - This ensures the preview renders identically without needing the Angular runtime.

4. **Fix module container mockup**:
   - Replace `.module` with `.cba-module-container` (or keep `.module` as a wrapper but ensure border uses `--cba-border-default`)
   - Ensure `border-radius: var(--cba-radius-lg)` for large containers (currently hardcoded `12px`)
   - Ensure border is `var(--cba-border-default)` (already fixed in Cluster 2, but verify preview)

5. **Fix other hardcoded values** in the mockup:
   - `.panel-title { font-size: 15px }` → use `.cba-text-heading-md` or `var(--cba-font-size-heading-md)`
   - `.module-header { min-height: 42px }` → `var(--cba-module-header-min-height)` (40px)
   - `.module { border-radius: 12px }` → `var(--cba-radius-lg)` (14px) or `var(--cba-radius-md)` (10px) depending on intended size. Per radius rules: modules/containers use `--cba-radius-lg`.
   - `.module-actions button { border-radius: 6px }` → already matches `--cba-radius-sm` ✓

---

## Detailed Implementation Steps

### Step 1: Add Font Awesome CDN
- Insert `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />` in `<head>`, after `theme-preview.css`.

### Step 2: Copy component SCSS into preview `<style>`
- Copy selectors from `src/components/module-header/module-header.component.scss` into the preview `<style>` block (after existing rules, before `</style>`).
- Copy selectors from `src/components/module-container/module-container.component.scss` into the preview `<style>` block.
- Remove or deprecate the old `.module-header`, `.module-actions`, `.status`, `.module-title` selectors (or keep them only if needed for non-header parts of the mockup).

### Step 3: Replace mockup HTML structure
- Find the `<section class="module">` block.
- Replace the inner `<div class="module-header">` with the actual component structure using `<header class="cba-module-header">`.
- Use Font Awesome `<i>` tags for icons.
- Ensure all aria-labels are Spanish (match `CBA_UI_MESSAGES.moduleHeader.aria` values).

### Step 4: Fix remaining hardcoded values
- Search the inline `<style>` for any hardcoded px values that should be tokens:
  - `border-radius: 12px` → `var(--cba-radius-lg)`
  - `min-height: 42px` → `var(--cba-module-header-min-height)`
  - `font-size: 15px` → `var(--cba-font-size-heading-md)`
  - `font-size: 13.5px` → `var(--cba-font-size-small)` or `var(--cba-font-size-body)`
  - `font-size: 12.5px` → `var(--cba-font-size-small)`

### Step 5: Regenerate and verify
- Run `npm run build:preview` (should produce zero diff since no SCSS changed, but verify).
- Run `npm test` — all tests must pass (including `preview-html.spec.ts` which checks required IDs and TOKEN_ROLES).
- Run `npm run lint` — clean.
- Manually verify the preview renders correctly.

### Step 6: Commit
- Commit all changes with meaningful message: `fix(theme-preview): align module header mockup with actual component 100%`.

---

## Files to Modify

| File | Change |
|------|--------|
| `docs/theme-preview.html` | Add Font Awesome CDN; copy component SCSS rules; replace mockup HTML structure; fix hardcoded values |
| `docs/theme-preview.css` | Regenerate (should be no-op if no SCSS changed) |

---

## Acceptance Criteria

1. Preview module header shows icons in exact order: drag, collapse, size toggle, fullscreen, remove.
2. Preview module header uses Font Awesome icons matching the Angular component.
3. Preview module header uses the exact CSS class names and selectors from `module-header.component.scss`.
4. No hardcoded px values remain in the mockup styles where a `--cba-*` token exists.
5. `npm test` and `npm run lint` pass.
6. `preview-html.spec.ts` does not break (TOKEN_ROLES length stays 9, required IDs present).

---

## Risk

- **Font Awesome CDN dependency:** If the preview is opened offline, Font Awesome icons won't load. Mitigation: add a comment noting CDN requirement, or inline SVG icons as fallback. For the fix, CDN is acceptable since the preview is primarily for development/CI.
- **SCSS drift:** If `module-header.component.scss` changes in the future, the preview copy will drift. Mitigation: add a prominent HTML comment in the preview `<style>` block: `/* Copied from src/components/module-header/module-header.component.scss — keep in sync */`.
