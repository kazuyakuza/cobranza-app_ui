# Task B — Front-end Technical Specification: Reimplement `docs/theme-preview.html`

**Project:** `@cobranza-apps/ui` `^0.14.0`  
**Branch:** `feat/shell-ui-bug-fixes-round-2`  
**Scope:** Task 6 from `.agent/todos/20260811/20260811-todo-0.md`  
**Target file:** `docs/theme-preview.html` (static HTML, no Angular runtime)  
**Theme CSS:** `docs/theme-preview.css` (compiled from `src/theme/theme.scss` via `npm run build:preview`)

---

## 1. Purpose

Rewrite `docs/theme-preview.html` so it becomes a faithful, interactive reference of the `@cobranza-apps/ui` design system. The preview must model the Cobranza back-office shell (header + workspace + footer), host realistic module cards using the exact CSS class names from the Angular components, and include an exhaustive style showcase driven by the `--cba-*` token set.

---

## 2. High-level Layout

### 2.1 Two-panel chrome

| Region | Class | Behavior |
|--------|-------|----------|
| Sidebar | `.controls` | Fixed 340 px width, sticky top, dark tool chrome. Contains theme name, hint, source-hex chips, role map. |
| Preview | `.preview` | Flexible width, full-height column. Contains preview bar, shell header, workspace, shell footer. |

The root container uses CSS Grid:

```css
.app {
  display: grid;
  grid-template-columns: 340px 1fr;
  min-height: 100vh;
}
```

When the sidebar is hidden, the grid collapses to a single column:

```css
.app.is-sidebar-hidden {
  grid-template-columns: 1fr;
}
```

### 2.2 Sidebar minimization

- Add an "X" close button at the top of `.controls`.
- On click:
  - Toggle the `.is-sidebar-hidden` class on `.app`.
  - Persist the boolean state in `localStorage` under the key `cba-theme-preview-sidebar-visible`.
- When hidden:
  - The `.controls` element is removed from the layout via `display: none`.
  - A "Show sidebar" button appears inside `.preview-bar` (top-left of the preview area).
- On page load, read `localStorage.getItem('cba-theme-preview-sidebar-visible')` and apply the saved state. Default to `true` when no value is stored.
- The close/reopen buttons must be keyboard-focusable `<button type="button">` elements with `aria-label` and `:focus-visible` using `--cba-focus-ring`.

### 2.3 Preview bar

`.preview-bar` stays at the top of `.preview` and shows:

- Left: theme label and active theme name.
- Right (when sidebar is hidden): "Show sidebar" button.

Background: `--cba-bg-elevated`. Border-bottom: `1px solid var(--cba-border-default)`. Text: `--cba-text-muted`; strong name: `--cba-text-secondary`.

---

## 3. Shell Mockup

### 3.1 Header (`.shell-header`)

Keep the current structural elements. Verify every declaration uses a library token.

```html
<header class="shell-header">
  <div class="logo" aria-hidden="true"></div>
  <div class="brand">Cobranza</div>
  <div class="spacer"></div>
  <div class="search"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i> Ctrl + K</div>
  <button type="button" class="icon-btn" aria-label="Notificaciones"><i class="fa-regular fa-bell" aria-hidden="true"></i></button>
  <button type="button" class="icon-btn" aria-label="Usuario">U</button>
</header>
```

Required CSS:

```css
.shell-header {
  height: var(--cba-header-height);
  display: flex;
  align-items: center;
  gap: var(--cba-space-3);
  padding: 0 var(--cba-space-4);
  background: var(--cba-bg-elevated);
  border-bottom: 1px solid var(--cba-border-default);
}
```

`.logo`: `--cba-bg-tertiary` fill, `--cba-border-strong` border, `--cba-radius-md` radius.  
`.brand`: `font-weight: 700`, inherits `--cba-text-primary`.  
`.search`: `--cba-bg-tertiary` background, `--cba-border-strong` border, `--cba-text-secondary` text, `--cba-radius-pill` (999px) border-radius.  
`.icon-btn`: 32 × 32 px, `--cba-bg-secondary`, `--cba-border-strong` border, `--cba-text-secondary` icon, `--cba-radius-pill`, hover/active using `--cba-hover` / `--cba-active`.

### 3.2 Footer (`.shell-footer`)

Keep the current footer pills. Verify token usage.

```html
<footer class="shell-footer">
  <div class="section-pill active">Clientes</div>
  <div class="section-pill">Deudas</div>
  <div class="section-pill">Pagos</div>
  <div class="section-pill">Reportes</div>
</footer>
```

Required CSS:

```css
.shell-footer {
  height: var(--cba-footer-height);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--cba-space-2);
  border-top: 1px solid var(--cba-border-default);
  background: var(--cba-bg-elevated);
}
.section-pill {
  padding: var(--cba-space-2) var(--cba-space-4);
  border-radius: 999px;
  border: 1px solid var(--cba-border-strong);
  background: var(--cba-bg-secondary);
  color: var(--cba-text-secondary);
  font-size: var(--cba-font-size-small);
  font-weight: 700;
}
.section-pill.active {
  border-color: var(--cba-accent-primary);
  color: var(--cba-text-primary);
}
```

### 3.3 Workspace (`.workspace`)

The workspace must **not** scroll. It expands vertically to fit its content.

```css
.workspace {
  flex: 1 0 auto;
  padding: var(--cba-space-4);
  background: var(--cba-bg-primary);
}
```

No `overflow-y`, no `max-height`. The page itself may scroll if content is taller than the viewport.

---

## 4. Module Examples

Use the exact CSS class names from `module-header.component.scss`, `module-container.component.scss`, and `module-footer.component.scss`. Inline copy the component SCSS blocks with "keep in sync" comments.

### 4.1 Module container host mapping

Because the preview is static HTML without Angular Shadow DOM, map `:host` selectors to the outer `.cba-module-container` element:

```html
<section class="module cba-module-container cba-module-container--size-100">
  ...
</section>
```

Size modifiers:

- 100 % mode: `cba-module-container--size-100`
- 50 % mode: `cba-module-container--size-50`

Collapsed modules do **not** render `.cba-module-container__body` at all (the Angular component removes the body via `@if`). Only the header is present.

### 4.2 Module header (static mockup)

Every module header must include, in order:

1. Drag handle: `.cba-module-header__action.cba-module-header__action--drag`
2. Collapse button: uses `fa-chevron-up` when expanded, `fa-chevron-down` when collapsed
3. Size toggle button: uses `fa-arrows-left-right-to-line` when in 100 % mode (action = shrink to 50 %), `fa-arrows-left-right` when in 50 % mode (action = grow to 100 %)
4. Fullscreen button: `fa-window-maximize`
5. Remove button: `fa-xmark`

All buttons are static mockups (no actions required). Use `type="button"`, `aria-label`, and `title`.

```html
<header class="cba-module-header">
  <div class="cba-module-header__section cba-module-header__section--status cba-module-header__status--loaded">
    <i class="fa-solid fa-check" aria-hidden="true"></i>
  </div>
  <div class="cba-module-header__section cba-module-header__section--title cba-text-heading-md">
    Clientes List
  </div>
  <nav class="cba-module-header__section cba-module-header__section--actions">
    <button type="button" class="cba-module-header__action cba-module-header__action--drag" aria-label="Arrastrar módulo" title="Arrastrar módulo">
      <i class="fa-solid fa-up-down-left-right" aria-hidden="true"></i>
    </button>
    <button type="button" class="cba-module-header__action" aria-label="Colapsar módulo" title="Colapsar módulo">
      <i class="fa-solid fa-chevron-up" aria-hidden="true"></i>
    </button>
    <button type="button" class="cba-module-header__action" aria-label="Reducir módulo a 50%" title="Reducir módulo a 50%">
      <i class="fa-solid fa-arrows-left-right-to-line" aria-hidden="true"></i>
    </button>
    <button type="button" class="cba-module-header__action" aria-label="Pantalla completa" title="Pantalla completa">
      <i class="fa-solid fa-window-maximize" aria-hidden="true"></i>
    </button>
    <button type="button" class="cba-module-header__action" aria-label="Quitar módulo" title="Quitar módulo">
      <i class="fa-solid fa-xmark" aria-hidden="true"></i>
    </button>
  </nav>
</header>
```

### 4.3 Module body

Use `.cba-module-container__body` and the `.cba-module-container--padding-md` modifier (so padding is `var(--cba-space-4)`).

The 100 % expanded module must contain a table with **at least 5 rows** (e.g., a client list).

```html
<div class="cba-module-container__body">
  <div class="panel-title-row">
    <div class="panel-title cba-text-heading-md">Lista de clientes</div>
    <div class="panel-meta">100% · expandido</div>
  </div>
  <table>
    <thead>
      <tr><th>Documento</th><th>Nombre</th><th>Deuda actual</th></tr>
    </thead>
    <tbody>
      <tr><td>12.345.678-9</td><td>Acme S.A.</td><td>1,200,000</td></tr>
      <tr><td>9.876.543-2</td><td>Comercial del Norte</td><td>540,000</td></tr>
      <tr><td>11.223.344-5</td><td>Distribuidora Sur</td><td>0</td></tr>
      <tr><td>45.678.901-3</td><td>Ferretería El Tornillo</td><td>87,500</td></tr>
      <tr><td>33.444.555-6</td><td>Inversiones Oriente</td><td>320,000</td></tr>
    </tbody>
  </table>
</div>
```

Table styles:

```css
.cba-module-container__body table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--cba-font-size-small);
}
.cba-module-container__body thead th {
  text-align: left;
  padding: var(--cba-space-3);
  background: var(--cba-bg-tertiary);
  color: var(--cba-text-secondary);
  font-weight: 700;
  border-bottom: 1px solid var(--cba-border-default);
}
.cba-module-container__body tbody td {
  padding: var(--cba-space-3);
  border-bottom: 1px solid var(--cba-border-default);
  font-weight: 500;
  color: var(--cba-text-primary);
}
.cba-module-container__body tbody tr:hover td {
  background: var(--cba-hover);
}
.cba-module-container__body tbody tr:last-child td {
  border-bottom: none;
}
```

### 4.4 Module footer

Use the library footer component classes. Since the preview is static HTML, copy the relevant rules from `module-footer.component.scss` inline and mark them "keep in sync".

```html
<footer class="cba-module-footer">
  <div class="cba-module-footer__status cba-module-footer__status--loaded" role="status" aria-live="polite" aria-atomic="true">
    <i class="fa-solid fa-check" aria-hidden="true"></i>
    <span class="cba-module-footer__text">Listo</span>
  </div>
</footer>
```

Footer CSS (copied inline):

```css
.cba-module-footer {
  display: flex;
  align-items: center;
  height: var(--cba-module-footer-height, 40px);
  padding: 0 var(--cba-space-4);
  gap: var(--cba-space-2);
  background-color: var(--cba-bg-tertiary);
  overflow: hidden;
  box-sizing: border-box;
}
.cba-module-footer__status {
  display: inline-flex;
  align-items: center;
  gap: var(--cba-space-2);
  font-size: var(--cba-font-size-body);
  line-height: var(--cba-line-height-body);
}
.cba-module-footer__status--loaded,
.cba-module-footer__status--success { color: var(--cba-accent-success); }
```

### 4.5 Required module instances

| # | Width | State | Body | Footer | Row placement |
|---|-------|-------|------|--------|---------------|
| 1 | 100 % | expanded | table with ≥5 rows | status label at right | single full-width row |
| 2 | 100 % | collapsed | none (header only) | none | single full-width row |
| 3 | 50 % | expanded | table | none | same row as #4 |
| 4 | 50 % | expanded | table | none | same row as #3 |
| 5 | 50 % | collapsed | none | none | same row as #6 |
| 6 | 50 % | collapsed | none | none | same row as #5 |
| 7 | 50 % | collapsed | none | none | single row (half-width) |

Rows of two 50 % modules must be wrapped in a flex container with `gap: var(--cba-space-4)` and `align-items: flex-start` so the modules sit side by side with visible separation.

```html
<div class="module-row">
  <section class="module cba-module-container cba-module-container--size-50">...</section>
  <section class="module cba-module-container cba-module-container--size-50">...</section>
</div>
```

```css
.module-row {
  display: flex;
  gap: var(--cba-space-4);
  align-items: flex-start;
}
```

---

## 5. Style Showcase Section

Place an `.extras` container below the modules. It must be `max-width: 900px` and contain the following sub-sections. Each sub-section is data-driven by JavaScript.

### 5.1 Color token swatches

Render one swatch for every background, text, and border token:

- Backgrounds: `--cba-bg-primary`, `--cba-bg-secondary`, `--cba-bg-tertiary`, `--cba-bg-elevated`, `--cba-bg-overlay`
- Text: `--cba-text-primary`, `--cba-text-secondary`, `--cba-text-muted`, `--cba-text-inverse`
- Borders: `--cba-border-subtle`, `--cba-border-default`, `--cba-border-strong`
- Accents: `--cba-accent-primary`, `--cba-accent-success`, `--cba-accent-warning`, `--cba-accent-danger`, `--cba-accent-info`
- Interactive: `--cba-hover`, `--cba-active`, `--cba-hover-inverse`, `--cba-active-inverse`
- Selected: `--cba-selected-bg`, `--cba-selected-border`, `--cba-selected-text`, `--cba-selected-hover`
- Form states: `--cba-state-invalid-border`, `--cba-state-invalid-text`, `--cba-state-valid-border`, `--cba-state-valid-text`, `--cba-state-disabled-bg`, `--cba-state-disabled-text`

Each swatch displays:

- Color chip
- Semantic name
- Hex value (from a hard-coded reference array — allowed **only** here)
- Token name

Use the `.cba-bg-*` utility class for background tokens where available; otherwise apply `style="background: var(--token)"`.

### 5.2 Button styles matrix

Generate a matrix of:

- Variants: `primary`, `secondary`, `ghost`, `danger`, `success`
- States: normal, hover, active, disabled
- Surfaces: panel (`--cba-bg-secondary`), elevated (`--cba-bg-elevated`), canvas (`--cba-bg-primary`)

Use preview-only classes `.pv-btn`, `.pv-btn--<variant>`, `.is-hover`, `.is-active`, `.is-disabled`. Mirror the state logic from `cba-button.component.scss`.

### 5.3 Labels and pills

Add sub-sections that demonstrate:

- `.cba-text-caption`, `.cba-text-small`, `.cba-text-body` labels in normal/disabled/error states.
- Pill chips using `.demo-pill` with normal/hover/selected/disabled states.

### 5.4 Icons list

Render a grid showing every Font Awesome icon imported/used by the library. Based on current source, the list is:

- `fa-solid fa-arrows-left-right`
- `fa-solid fa-arrows-left-right-to-line`
- `fa-solid fa-check`
- `fa-solid fa-chevron-down`
- `fa-solid fa-chevron-up`
- `fa-solid fa-circle-check`
- `fa-solid fa-circle-xmark`
- `fa-solid fa-pen`
- `fa-solid fa-spinner`
- `fa-solid fa-triangle-exclamation`
- `fa-solid fa-window-maximize`
- `fa-solid fa-xmark`
- `fa-solid fa-calendar`
- `fa-regular fa-bell` (for shell header notification mockup)
- `fa-solid fa-magnifying-glass` (for shell header search mockup)

Each icon tile shows the icon, its class name, and the component(s) that use it.

### 5.5 Text types on different backgrounds

Render text samples on every surface where text may appear:

- canvas (`--cba-bg-primary`)
- panel (`--cba-bg-secondary`)
- elevated (`--cba-bg-elevated`)
- inset (`--cba-bg-tertiary`)
- form default (`--cba-bg-secondary` + `--cba-border-default`)
- form invalid (`--cba-bg-secondary` + `--cba-state-invalid-border`)

For each surface show `--cba-text-primary`, `--cba-text-secondary`, and `--cba-text-muted` where allowed by WCAG AA. On surfaces where muted is restricted (canvas, inset), show a warning callout. Show `--cba-text-inverse` on an accent chip.

### 5.6 Typography scale samples

Render all six type steps with their token pairs:

- `display`
- `heading-lg`
- `heading-md`
- `body`
- `small`
- `caption`

### 5.7 Border scale swatches

Render three boxes showing:

- `--cba-border-subtle`
- `--cba-border-default`
- `--cba-border-strong`

### 5.8 Selected state samples

Render:

- Footer pills: normal, hover, selected, disabled
- Nav items: normal, hover, selected, disabled
- Table rows: normal, hover, selected, disabled

### 5.9 Form state samples

Render static field boxes for:

- default
- hover
- focus
- disabled
- readonly
- invalid
- valid

### 5.10 Status badges

Render badges for success, warning, danger, info, neutral in three styles:

- solid
- outline
- neutral (inset background)

---

## 6. Token Compliance

- Every color value in the inline `<style>` and inline `style="..."` attributes must resolve through `var(--cba-*)`.
- Hard-coded hex values are allowed **only** in:
  - The sidebar source-hex chips.
  - The swatch reference array used to print hex labels.
- No hardcoded `px` values for spacing, radius, shadows, or font sizes; use `var(--cba-space-*)`, `var(--cba-radius-*)`, `var(--cba-shadow-*)`, `var(--cba-font-size-*)`, and `var(--cba-line-height-*)`.
- The `border-radius: 999px` / `9999px` pill shape is the documented exception for pills and badges.
- Copy the component SCSS for `.cba-module-header`, `.cba-module-container`, and `.cba-module-footer` inline with "keep in sync" comments referencing the source files.

---

## 7. JavaScript Requirements

### 7.1 Constraints

- All functions must have ≤ 2 parameters.
- All function bodies must be ≤ 50 lines.
- Use data arrays (objects or arrays) to drive rendering.

### 7.2 Required functions

| Function | Purpose |
|----------|---------|
| `renderSourceHex(sourceColors, host)` | Render sidebar source-hex chips. |
| `renderRoleMap(host)` | Render sidebar token-role map. |
| `renderSwatches(host)` | Render color-token swatches. |
| `buildStateButtons(variant)` | Build the four state buttons for one variant. |
| `buildButtonMatrix(host)` | Build the full button matrix. |
| `renderTextSamples(host)` | Render text-on-surfaces cards. |
| `renderIcons(host)` | Render icon grid. |
| `renderTypeScale(host)` | Render typography scale samples. |
| `renderBorderScale(host)` | Render border swatches. |
| `renderSelectedSamples(host)` | Render selected-state samples. |
| `renderFormStates(host)` | Render form-state field boxes. |
| `renderStatusBadges(host)` | Render semantic status badges. |
| `renderModuleRow(container, modules)` | Helper to render a row of module mockups. |
| `loadSidebarState()` | Read `localStorage.getItem('cba-theme-preview-sidebar-visible')`. |
| `saveSidebarState(isVisible)` | Write `localStorage.setItem('cba-theme-preview-sidebar-visible', isVisible)`. |
| `applySidebarState(isVisible)` | Toggle `.is-sidebar-hidden` and button visibility. |
| `selectTheme(themeData)` | Keep current single-theme support; render theme name and source colors. |

### 7.3 Sidebar state lifecycle

```js
const STORAGE_KEY = 'cba-theme-preview-sidebar-visible';

function loadSidebarState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === null ? true : stored === 'true';
}

function saveSidebarState(isVisible) {
  localStorage.setItem(STORAGE_KEY, String(isVisible));
}
```

On `DOMContentLoaded`:

1. Call `applySidebarState(loadSidebarState())`.
2. Attach click handlers to the sidebar close button and the preview-bar reopen button.
3. Call all render functions.
4. Call `selectTheme(theme)`.

### 7.4 Theme selector

Keep the current single-theme support. The `theme` object remains:

```js
const theme = {
  id: 'mw',
  group: 'Extra',
  name: 'Minimal Yet Warm',
  note: 'Canvas arena + panel crema, coral reservado a acentos',
  source: ['#BCB5A4', '#D8C3A5', '#6B665E', '#E98074', '#B93E36']
};
```

`selectTheme(themeData)` sets the active name and source colors. It remains ready for multi-theme extension but only renders one button for now.

---

## 8. Accessibility

- All interactive controls are `<button type="button">` with `aria-label`.
- Focus-visible rings use `box-shadow: var(--cba-focus-ring)`.
- Decorative icons have `aria-hidden="true"`.
- Module status regions use `role="status"`, `aria-live="polite"`, `aria-atomic="true"`.
- Respect `prefers-reduced-motion` by disabling transitions where the source components do.

---

## 9. Acceptance Criteria

- [ ] `docs/theme-preview.html` opens in a browser and shows the two-panel layout.
- [ ] Sidebar can be closed via "X" and reopened via a button in `.preview-bar`; state persists across reloads using the documented `localStorage` key.
- [ ] Shell header, workspace, and footer render using only `--cba-*` tokens.
- [ ] All 7 module instances render with the exact library CSS class names and correct width/collapse states.
- [ ] The 100 % expanded module contains a table with at least 5 rows and a library-styled footer with a right-aligned status label.
- [ ] Style showcase includes swatches for all background/text/border/accent/state tokens, button matrix, labels/pills, icon list, text-on-surfaces, typography scale, border scale, selected states, form states, and status badges.
- [ ] No hardcoded hex values appear in the preview CSS except the sidebar source-hex chips and swatch hex labels.
- [ ] Component SCSS is copied inline with "keep in sync" comments.
- [ ] All JavaScript functions have ≤ 2 parameters and ≤ 50 line bodies.
- [ ] `npm run build:preview` regenerates `docs/theme-preview.css` without errors.

---

## 10. Out of Scope

- No Angular runtime behavior (the file is static HTML).
- No real drag-and-drop, collapse, resize, or remove actions for module header buttons.
- No new design tokens or component changes — this task only rewrites the preview file.
- No responsive/mobile layout; the preview remains desktop-only per the project brief.
