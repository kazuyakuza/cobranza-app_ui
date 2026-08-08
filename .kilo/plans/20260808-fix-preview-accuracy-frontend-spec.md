# Front-end Technical Specification — Fix `docs/theme-preview.html` Module Header/Container Mockup Accuracy

**Date:** 2026-08-08
**Scope:** `docs/theme-preview.html` only (standalone `file://` preview).
**Goal:** Align the preview's module header and container mockup 100% with the actual Angular components `ModuleHeaderComponent` and `ModuleContainerComponent`.
**Output file:** `.kilo/plans/20260808-fix-preview-accuracy-frontend-spec.md`

---

## 1. Font Awesome CDN strategy

The Angular component imports Font Awesome icons via `@fortawesome/angular-fontawesome` and renders them as SVG. Because the preview is a static `file://` HTML page, it cannot use the Angular Font Awesome directive. Use the Font Awesome 6.7.2 CSS CDN so the same icon glyphs render with identical class names.

### CDN link

Insert the following `<link>` in `<head>`, immediately after `theme-preview.css`:

```html
<link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
      integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer" />
```

### Rationale

- **Version:** 6.7.2 matches the FA6 major line referenced in `package.json` peer dependencies (`^6.0.0 || ^7.0.0`). The currently installed dev dependency is `7.3.x`, but FA6 CDN is stable and supplies every icon used by `ModuleHeaderComponent`.
- **Placement:** After `theme-preview.css` so icon font faces do not override token styles.
- **Crossorigin:** `crossorigin="anonymous"` is required when an `integrity` attribute is present and the resource is served from a CDN.
- **Offline note:** Add an HTML comment above the link noting that the preview requires network access for the header icons; this is acceptable because the preview is a development/CI artifact, not a production UI.

---

## 2. HTML structure mapping

Replace the current mockup block (lines ~239-246 in `docs/theme-preview.html`):

```html
<section class="module">
  <div class="module-header">
    <div class="status">✓</div>
    <div class="module-title">Clientes List</div>
    <div class="module-actions">
      <button type="button" aria-label="Expandir">⌃</button><button type="button" aria-label="Pantalla completa">⛶</button>
      <button type="button" aria-label="Cerrar">✕</button><button type="button" aria-label="Desacoplar">⧉</button>
    </div>
  </div>
```

with the exact component-equivalent markup below.

### Required markup

```html
<section class="module cba-module-container">
  <header class="cba-module-header">
    <div class="cba-module-header__section cba-module-header__section--status cba-module-header__status--loaded">
      <i class="fa-solid fa-check" aria-hidden="true"></i>
    </div>
    <div class="cba-module-header__section cba-module-header__section--title cba-text-heading-md">
      Clientes List
    </div>
    <nav class="cba-module-header__section cba-module-header__section--actions">
      <button type="button"
              class="cba-module-header__action cba-module-header__action--drag"
              aria-label="Arrastrar módulo"
              title="Arrastrar módulo">
        <i class="fa-solid fa-up-down-left-right" aria-hidden="true"></i>
      </button>
      <button type="button"
              class="cba-module-header__action"
              aria-label="Colapsar módulo"
              title="Colapsar módulo">
        <i class="fa-solid fa-chevron-up" aria-hidden="true"></i>
      </button>
      <button type="button"
              class="cba-module-header__action"
              aria-label="Reducir módulo a 50%"
              title="Reducir módulo a 50%">
        <i class="fa-solid fa-arrows-left-right-to-line" aria-hidden="true"></i>
      </button>
      <button type="button"
              class="cba-module-header__action"
              aria-label="Pantalla completa"
              title="Pantalla completa">
        <i class="fa-solid fa-window-maximize" aria-hidden="true"></i>
      </button>
      <button type="button"
              class="cba-module-header__action"
              aria-label="Quitar módulo"
              title="Quitar módulo">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </nav>
  </header>
```

### Mapping rules

| Preview element | Component class / attribute | Source |
|---|---|---|
| Outer wrapper | `.cba-module-container` added alongside existing `.module` | `ModuleContainerComponent` host binding |
| Header root | `<header class="cba-module-header">` | `module-header.component.html` |
| Status section | `.cba-module-header__section--status` + `.cba-module-header__status--loaded` | `statusClass()` for `status === 'loaded'` |
| Status icon | `fa-solid fa-check` | `STATUS_VISUALS.loaded.icon` (`faCheck`) |
| Title section | `.cba-module-header__section--title` + `.cba-text-heading-md` | `module-header.component.html` |
| Actions wrapper | `<nav class="cba-module-header__section--actions">` | `module-header.component.html` |
| Drag button | `.cba-module-header__action--drag` | First action in component template |
| Collapse button | `aria-label="Colapsar módulo"` | `CBA_UI_MESSAGES.moduleHeader.aria.collapse.collapse` |
| Size toggle button | `aria-label="Reducir módulo a 50%"` | `CBA_UI_MESSAGES.moduleHeader.aria.size.shrink` (current size 100%) |
| Fullscreen button | `aria-label="Pantalla completa"` | `CBA_UI_MESSAGES.moduleHeader.aria.fullscreen` |
| Remove button | `aria-label="Quitar módulo"` | `CBA_UI_MESSAGES.moduleHeader.aria.remove` |

### Icon order

The component renders actions in this exact order; the preview must preserve it:

1. Drag — `fa-up-down-left-right`
2. Collapse — `fa-chevron-up`
3. Size toggle — `fa-arrows-left-right-to-line`
4. Fullscreen — `fa-window-maximize`
5. Remove — `fa-xmark`

### Aria rules

- Every `<i>` icon must carry `aria-hidden="true"`.
- Every action `<button>` must carry `aria-label` and `title` matching the Spanish strings from `CBA_UI_MESSAGES.moduleHeader.aria`.
- Do not reuse the old Unicode glyphs (`⌃`, `⛶`, `✕`, `⧉`) or old labels (`Expandir`, `Cerrar`, `Desacoplar`).

---

## 3. CSS selector mapping

The preview's inline `<style>` must contain the component SCSS rules because `ViewEncapsulation.Emulated` keeps them out of `theme-preview.css`. Copy selectors from the two component SCSS files, adapting only `:host` rules to plain class selectors.

### 3.1 Selectors to copy from `module-header.component.scss`

Add the following block to the preview's inline `<style>` (after existing rules, before `</style>`). Keep class names identical to the component source.

```css
/* Copied from src/components/module-header/module-header.component.scss — keep in sync */
.cba-module-header {
  display: flex;
  align-items: flex-start;
  min-height: var(--cba-module-header-min-height, 40px);
  padding: var(--cba-space-2) var(--cba-space-3);
  gap: var(--cba-space-2);
  background-color: var(--cba-bg-elevated);
  color: var(--cba-text-primary);
  border-bottom: 1px solid var(--cba-border-default);
  box-sizing: border-box;
}

.cba-module-header__section {
  display: flex;
  align-items: center;
  min-height: var(--cba-module-header-min-height, 40px);
}

.cba-module-header__section--status {
  flex: 0 0 auto;
  justify-content: center;
  width: var(--cba-space-8);
}

.cba-module-header__section--title {
  flex: 1 1 auto;
  justify-content: center;
  text-align: center;
  min-width: 0;
  word-break: break-word;
  overflow-wrap: anywhere;
  font-weight: 600;
}

.cba-module-header__section--actions {
  flex: 0 0 auto;
  justify-content: flex-end;
  gap: var(--cba-space-1);
}

.cba-module-header__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--cba-space-8);
  height: var(--cba-space-8);
  padding: 0;
  color: var(--cba-text-secondary);
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: var(--cba-radius-sm);
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;
}

.cba-module-header__action:hover {
  background-color: var(--cba-hover);
  color: var(--cba-text-primary);
}

.cba-module-header__action:active {
  background-color: var(--cba-active);
}

.cba-module-header__action--drag {
  cursor: grab;
}

.cba-module-header__action--drag:active {
  cursor: grabbing;
  background-color: transparent;
}

.cba-module-header__action:focus-visible {
  outline: none;
  box-shadow: var(--cba-focus-ring);
}

.cba-module-header--fullscreen {
  background-color: transparent;
  border-bottom: none;
  justify-content: center;
}

.cba-module-header--fullscreen .cba-module-header__section--title {
  flex: 0 1 auto;
}

.cba-module-header__status--loading {
  color: var(--cba-accent-info);
}

.cba-module-header__status--loaded,
.cba-module-header__status--success {
  color: var(--cba-accent-success);
}

.cba-module-header__status--warning {
  color: var(--cba-accent-warning);
}

.cba-module-header__status--error {
  color: var(--cba-accent-danger);
}

.cba-module-header__status--dirty {
  color: var(--cba-text-muted);
}

@media (prefers-reduced-motion: reduce) {
  .cba-module-header__action {
    transition: none;
  }
}
```

### 3.2 Selectors to copy from `module-container.component.scss`

Map `:host` rules to `.cba-module-container` because the preview has no Shadow DOM.

```css
/* Copied from src/components/module-container/module-container.component.scss — keep in sync */
.cba-module-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}

.cba-module-container--size-50 {
  width: 50%;
}

.cba-module-container--size-100 {
  width: 100%;
}

.cba-module-container:not(.cba-module-container--fullscreen) {
  background-color: var(--cba-bg-secondary);
  border: 1px solid var(--cba-border-default);
  border-radius: var(--cba-radius-lg);
  box-shadow: var(--cba-shadow-module);
  overflow: hidden;
}

.cba-module-container__header {
  flex: 0 0 auto;
  min-width: 0;
}

.cba-module-container__body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--cba-border-default) transparent;
}

.cba-module-container__body::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.cba-module-container__body:hover::-webkit-scrollbar {
  width: 9px;
  height: 9px;
}

.cba-module-container__body::-webkit-scrollbar-track {
  background: transparent;
}

.cba-module-container__body::-webkit-scrollbar-thumb {
  background-color: var(--cba-border-default);
  border-radius: var(--cba-radius-sm);
}

.cba-module-container__body:hover::-webkit-scrollbar-thumb {
  background-color: var(--cba-border-strong);
}

.cba-module-container--padding-none .cba-module-container__body {
  padding: 0;
}

.cba-module-container--padding-sm .cba-module-container__body {
  padding: var(--cba-space-2);
}

.cba-module-container--padding-md .cba-module-container__body {
  padding: var(--cba-space-4);
}

@media (prefers-reduced-motion: reduce) {
  .cba-module-container__body:hover::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
}
```

### 3.3 Selectors to remove / deprecate

After adding the blocks above, remove the following obsolete selectors from the preview's inline `<style>`:

| Selector to remove | Reason |
|---|---|
| `.module { ... border-radius:12px ... }` | Replaced by `.cba-module-container:not(.cba-module-container--fullscreen)` |
| `.module-header` | Replaced by `.cba-module-header` |
| `.module-header .status` | Replaced by `.cba-module-header__section--status` |
| `.module-title` | Replaced by `.cba-module-header__section--title` |
| `.module-actions` | Replaced by `.cba-module-header__section--actions` |
| `.module-actions button` | Replaced by `.cba-module-header__action` |

The `.module` class may be kept as a local layout wrapper (it is used by JS renderers), but it must no longer define border, radius, shadow, or overflow. If `.module` is retained only for JS selectors, ensure it carries no visual styles.

---

## 4. Token substitution table

Replace every hardcoded value listed below in the preview's inline `<style>` and markup with the corresponding `--cba-*` token.

| Current value | Location in preview | Replacement token | Resolved value | Notes |
|---|---|---|---|---|
| `border-radius: 12px` | `.module` rule | `var(--cba-radius-lg)` | 14px | Container radius per design tokens. The component SCSS currently uses `--cba-radius-md`; see §5 discrepancy note. |
| `min-height: 42px` | `.module-header` rule | `var(--cba-module-header-min-height)` | 40px | Component source of truth. |
| `font-size: 15px` | `.panel-title` rule | `var(--cba-font-size-heading-md)` | 1rem | Use `.cba-text-heading-md` class instead. |
| `font-size: 13.5px` | `table` rule | `var(--cba-font-size-small)` | 0.8125rem | Table body text step. |
| `font-size: 12.5px` | `.module-footer` rule | `var(--cba-font-size-small)` | 0.8125rem | Footer status text step. |
| `border-radius: 6px` | `.module-actions button` rule | `var(--cba-radius-sm)` | 6px | Already correct; keep token form for consistency. |

### Additional token clean-up

- Replace any remaining literal `#BCB5A4`, `#F2F0E8`, `#FDFCF8`, `#D8C3A5`, `#2B2620`, etc., in the inline `<style>` with the matching `var(--cba-*)` token. The only permitted hex values in the HTML are inside the `theme.source` array and `TOKEN_ROLES` fixture data, which are required by `preview-html.spec.ts`.
- Do not introduce new hardcoded canvas hex values (e.g., do not replace `#BCB5A4` with another hex anywhere in CSS).

---

## 5. Container mockup fix

### Current state

The preview wraps the mock module in `<section class="module">` with these inline rules:

```css
.module {
  max-width: 900px;
  background: var(--cba-bg-secondary);
  border: 1px solid var(--cba-border-default);
  border-radius: 12px;
  box-shadow: var(--cba-shadow-module);
  overflow: hidden;
}
```

### Required state

Change the wrapper to:

```html
<section class="module cba-module-container">
```

and replace the `.module` visual rules with the `.cba-module-container` rules copied in §3.2.

### Discrepancy note

`module-container.component.scss` currently uses `border-radius: var(--cba-radius-md)` (10px). The design token intent for module containers is `--cba-radius-lg` (14px), and the existing preview hardcodes `12px` closer to `lg`. For this preview fix, use `--cba-radius-lg` and flag the component SCSS radius as a follow-up item for the implementer/architector to reconcile with the design system.

---

## 6. Density strip update

The `renderDensityStrip()` function (around lines 567-573) currently emits the old `.module-header` structure:

```javascript
return `<div class="module"><div class="module-header"><div class="status">✓</div><div class="module-title">${m.title}</div><div class="module-meta" ...>${m.meta}</div></div>...</div>`;
```

### Required update

Rewrite the returned template string to emit the same structure as §2, wrapped in `.cba-module-container`. Keep the status as `loaded` and use `fa-solid fa-check`. Preserve the `module-meta` text inside the title section or as adjacent content, but do not break the three-section header layout.

Example updated template:

```javascript
return `<div class="module cba-module-container">
  <header class="cba-module-header">
    <div class="cba-module-header__section cba-module-header__section--status cba-module-header__status--loaded">
      <i class="fa-solid fa-check" aria-hidden="true"></i>
    </div>
    <div class="cba-module-header__section cba-module-header__section--title cba-text-heading-md">
      ${m.title}
    </div>
    <nav class="cba-module-header__section cba-module-header__section--actions">
      <button type="button" class="cba-module-header__action cba-module-header__action--drag" aria-label="Arrastrar módulo" title="Arrastrar módulo"><i class="fa-solid fa-up-down-left-right" aria-hidden="true"></i></button>
      <button type="button" class="cba-module-header__action" aria-label="Colapsar módulo" title="Colapsar módulo"><i class="fa-solid fa-chevron-up" aria-hidden="true"></i></button>
      <button type="button" class="cba-module-header__action" aria-label="Reducir módulo a 50%" title="Reducir módulo a 50%"><i class="fa-solid fa-arrows-left-right-to-line" aria-hidden="true"></i></button>
      <button type="button" class="cba-module-header__action" aria-label="Pantalla completa" title="Pantalla completa"><i class="fa-solid fa-window-maximize" aria-hidden="true"></i></button>
      <button type="button" class="cba-module-header__action" aria-label="Quitar módulo" title="Quitar módulo"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
    </nav>
  </header>
  <div class="module-body"><table class="demo-table"><thead><tr><th>Documento</th><th>Nombre</th><th>Deuda</th></tr></thead><tbody>${rows}</tbody></table></div>
  <div class="module-footer">Listo</div>
</div>`;
```

If the density modules need to display metadata (e.g., `50%`), render it inside the title section after the title text, styled with `.cba-text-small` and `var(--cba-text-muted)`, so the three-section layout stays intact.

---

## 7. Test compliance

The following guards in `src/theme/preview-html.spec.ts` must remain satisfied:

| Guard | Requirement | How to satisfy |
|---|---|---|
| `TOKEN_ROLES.length === 9` | Do not add or remove swatch entries. | Leave the `TOKEN_ROLES` array unchanged. |
| Required IDs present | `#swatchGrid`, `#buttonMatrix`, `#textGrid`, `#accentRow`, `#rawStrip` must exist. | Do not remove these elements or change their `id` values. |
| No hardcoded canvas hex | Inline style must use `var(--cba-bg-primary)` for the canvas/workspace background. | Keep `.preview { background: var(--cba-bg-primary); }`; do not introduce a literal `#BCB5A4` in CSS. |
| Existing literal rule checks | Several rules are matched as exact strings (e.g., `.t-row .tok{...}`, `.t-row{font-size:13px...}`, solid hover/active button rules, `.shell-footer{...}`, `.preview{...}`). | Do not alter those CSS rule strings unless the test itself is updated. |
| `theme-preview.css` tokens | `:root` must still declare every token in `EXPECTED_TOKENS`. | No SCSS changes are required for this task; run `npm run build:preview` and verify zero diff if no tokens changed. |

### Verification commands

After implementation, run:

```bash
npm run build:preview
npm test -- src/theme/preview-html.spec.ts
npm test
npm run lint
```

All must pass.

---

## 8. Acceptance criteria

1. `docs/theme-preview.html` loads Font Awesome 6.7.2 from CDN in `<head>` with `crossorigin="anonymous"`.
2. The module header mockup uses `<header class="cba-module-header">` with the exact child class names from `module-header.component.scss`.
3. Action buttons appear in the exact order: drag, collapse, size toggle, fullscreen, remove.
4. All action icons use Font Awesome `<i class="fa-solid fa-*">` matching the Angular component icons.
5. All action `aria-label` and `title` values are Spanish strings from `CBA_UI_MESSAGES.moduleHeader.aria`.
6. The module container wrapper uses `.cba-module-container` and resolves border/radius/shadow/overflow from tokens.
7. The inline `<style>` contains the copied component SCSS selectors (adapted from `:host` to class selectors).
8. Old selectors `.module-header`, `.module-actions`, `.module-title`, and `.status` are removed from the inline CSS.
9. Hardcoded values from the token substitution table are replaced with `var(--cba-*)` tokens.
10. `renderDensityStrip()` emits the new component structure.
11. `npm test` and `npm run lint` pass without modifying `preview-html.spec.ts` expectations.

---

## 9. Files affected

| File | Change |
|---|---|
| `docs/theme-preview.html` | Add FA CDN; copy component SCSS selectors; replace header/container mockup markup; update `renderDensityStrip()`; substitute hardcoded tokens. |
| `docs/theme-preview.css` | Regenerate with `npm run build:preview` (expected no-op diff unless SCSS changed). |

---

## 10. Open items / risks

1. **Component SCSS radius mismatch:** `module-container.component.scss` uses `--cba-radius-md` (10px), but the preview fix specifies `--cba-radius-lg` (14px). Decide whether to update the component SCSS to match the design-token intent or accept the preview deviation.
2. **Font Awesome offline usage:** The preview requires network access for header icons. Document this limitation; do not block the fix.
3. **Manual sync burden:** Any future change to `module-header.component.scss` or `module-container.component.scss` must be mirrored in the preview's inline `<style>`. Add prominent "keep in sync" comments as specified in §3.
