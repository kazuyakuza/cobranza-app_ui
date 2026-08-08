# Code Simplification Suggestions — `docs/theme-preview.html`

**Scope:** Step 4.3 review of `docs/theme-preview.html` after the implementation in `.kilo/plans/20260808-fix-preview-accuracy-task1.md`.

**Goal:** Reduce duplication, use existing `.cba-*` utilities, and shorten the file without:

- Breaking the `preview-html.spec.ts` exact-substring contract (see plan §0.2).
- Changing `TOKEN_ROLES`, `REQUIRED_IDS`, data fixtures, or any `src/` file.
- Reducing visual/structural accuracy relative to the real components.

These are suggestions only; no code edits were made.

---

## S1. Merge identical `:focus-visible` declarations

**Current code**

- Line 126: `.pv-btn:focus-visible{outline:none;box-shadow:var(--cba-focus-ring)}`
- Lines 292-295:

```css
    .cba-module-header__action:focus-visible {
      outline: none;
      box-shadow: var(--cba-focus-ring);
    }
```

**Simplified alternative**

```css
.pv-btn:focus-visible,
.cba-module-header__action:focus-visible {
  outline: none;
  box-shadow: var(--cba-focus-ring);
}
```

**Benefit**

Removes a 3-line duplication while keeping the same computed output.

**Risk**

Low. If the two components ever need different focus rings, the selector would have to be split again. Currently the values are identical.

---

## S2. Unify `.section-pill` and `.demo-pill` base styles

**Current code**

- Line 100:

```css
.section-pill{padding:8px 16px;border-radius:999px;border:1px solid var(--cba-border-strong);background:var(--cba-bg-secondary);color:var(--cba-text-secondary);font-size:13px;font-weight:700}
```

- Line 178:

```css
.demo-pill{padding:8px 16px;border-radius:999px;border:1px solid var(--cba-border-strong);background:var(--cba-bg-secondary);color:var(--cba-text-secondary);font-size:13px;font-weight:700}
```

**Simplified alternative**

```css
.section-pill,
.demo-pill{padding:8px 16px;border-radius:999px;border:1px solid var(--cba-border-strong);background:var(--cba-bg-secondary);color:var(--cba-text-secondary);font-size:13px;font-weight:700}
.section-pill.active{border-color:var(--cba-accent-primary);color:var(--cba-text-primary)}
```

**Benefit**

Eliminates an exact duplicate 7-property rule.

**Risk**

Low. The two pill types happen to be identical today; if they are intentionally diverged later, the shared block must be split.

---

## S3. Replace the density-strip inline muted color with `.cba-text-muted`

**Current code**

- Line 805:

```html
<span class="cba-text-small" style="color:var(--cba-text-muted)">${m.meta}</span>
```

**Simplified alternative**

```html
<span class="cba-text-small cba-text-muted">${m.meta}</span>
```

**Benefit**

Uses the existing `.cba-text-muted` utility (defined in `src/theme/_utilities.scss`) instead of an inline style.

**Risk**

Low. The utility sets only `color: var(--cba-text-muted)`, so the rendered output is identical. The only dependency is that the utility stays in the compiled `theme-preview.css`.

---

## S4. Replace `renderTypeScale` inline styles with typography utilities

**Current code**

- Lines 744-751 (`TYPE_SCALE`):

```javascript
const TYPE_SCALE=[
  ['display','--cba-font-size-display','--cba-line-height-display','Clientes'],
  ['heading-lg','--cba-font-size-heading-lg','--cba-line-height-heading-lg','Lista de clientes'],
  // ...
];
```

- Lines 840-843 (`renderTypeScale`):

```javascript
function renderTypeScale(host){
  host.innerHTML=TYPE_SCALE.map(([step,sizeTok,lhTok,sample])=>{
    return `<div class="type-row"><span class="label">${step} · ${sizeTok}</span><span class="sample" style="font-size:var(${sizeTok});line-height:var(${lhTok})">${sample}</span></div>`;
  }).join('');
}
```

**Simplified alternative**

```javascript
const TYPE_SCALE=[
  ['display','Clientes'],
  ['heading-lg','Lista de clientes'],
  ['heading-md','Sección de pagos'],
  ['body','Ferretería El Tornillo — deuda 87.500'],
  ['small','Header de tabla / metadata'],
  ['caption','Pista terciaria o nota corta']
];

function renderTypeScale(host){
  host.innerHTML=TYPE_SCALE.map(([step,sample])=>{
    return `<div class="type-row"><span class="label">${step} · --cba-font-size-${step}</span><span class="sample cba-text-${step}">${sample}</span></div>`;
  }).join('');
}
```

**Benefit**

Shorter data array, fewer inline styles, and reuses the existing `.cba-text-*` utilities that mirror the same token pairs.

**Risk**

Low. The rendered font sizes and line heights are identical. The label text changes from `--cba-font-size-display` to `--cba-font-size-display` (same string), so the visual is unchanged.

---

## S5. DRY up `renderDensityStrip()` header actions

**Current code**

- Lines 799-819: the full module header template is repeated inline, including the five action buttons with hardcoded labels and icons.

**Simplified alternative**

Add a small data array and a helper:

```javascript
const HEADER_ACTIONS=[
  ['drag','Arrastrar módulo','fa-up-down-left-right'],
  ['collapse','Colapsar módulo','fa-chevron-up'],
  ['size','Reducir módulo a 50%','fa-arrows-left-right-to-line'],
  ['fullscreen','Pantalla completa','fa-window-maximize'],
  ['remove','Quitar módulo','fa-xmark']
];

function renderHeaderActions(){
  return HEADER_ACTIONS.map(([name,label,icon])=>`<button type="button" class="cba-module-header__action${name==='drag'?' cba-module-header__action--drag':''}" aria-label="${label}" title="${label}"><i class="fa-solid ${icon}" aria-hidden="true"></i></button>`).join('');
}

function renderDensityStrip(host){
  const actions=renderHeaderActions();
  host.innerHTML=DENSITY_MODULES.map(m=>{
    const rows=DENSITY_ROWS.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('');
    return `<div class="module cba-module-container">
  <header class="cba-module-header">
    <div class="cba-module-header__section cba-module-header__section--status cba-module-header__status--loaded"><i class="fa-solid fa-check" aria-hidden="true"></i></div>
    <div class="cba-module-header__section cba-module-header__section--title cba-text-heading-md">${m.title} <span class="cba-text-small cba-text-muted">${m.meta}</span></div>
    <nav class="cba-module-header__section cba-module-header__section--actions">${actions}</nav>
  </header>
  <div class="module-body"><table class="demo-table"><thead><tr><th>Documento</th><th>Nombre</th><th>Deuda</th></tr></thead><tbody>${rows}</tbody></table></div>
  <div class="module-footer">Listo</div>
</div>`;
  }).join('');
}
```

**Benefit**

Removes the repeated 5-button blob; icon order/labels live in one place, making future component icon updates trivial.

**Risk**

Low. The generated markup is the same; only whitespace/newlines may shift, which does not affect rendering or tests.

---

## S6. Use `.cba-text-heading-md` for `.panel-title`

**Current code**

- Line 91: `.panel-title{font-weight:700;font-size:var(--cba-font-size-heading-md)}`
- Line 481: `<div class="panel-title">Lista de clientes</div>`

**Simplified alternative**

```html
<div class="panel-title cba-text-heading-md">Lista de clientes</div>
```

```css
.panel-title{font-weight:700}
```

**Benefit**

Uses the existing typography utility for the size token and removes a duplicate `var(--cba-font-size-heading-md)` reference.

**Risk**

Very low. `.cba-text-heading-md` also adds `line-height: var(--cba-line-height-heading-md)`, which is a sensible heading line height; the visual difference is negligible.

---

## S7. Use `.cba-text-small` for `.module-footer`

**Current code**

- Line 98: `.module-footer{padding:9px 12px;background:var(--cba-bg-tertiary);border-top:1px solid var(--cba-border-default);font-size:var(--cba-font-size-small);font-weight:700;color:var(--cba-accent-success)}`
- Line 494 and density line 815: `<div class="module-footer">Listo</div>`

**Simplified alternative**

```html
<div class="module-footer cba-text-small">Listo</div>
```

```css
.module-footer{padding:9px 12px;background:var(--cba-bg-tertiary);border-top:1px solid var(--cba-border-default);font-weight:700;color:var(--cba-accent-success)}
```

**Benefit**

Reuses the `.cba-text-small` utility instead of an explicit token in the rule.

**Risk**

Very low. The utility adds `line-height: var(--cba-line-height-small)`, which is close to the inherited value.

---

## S8. Remove dead `.cba-module-container` child/modifier rules

**Current code**

- Lines 345-415: `.cba-module-container--size-50`, `--size-100`, `__header`, `__body`, scrollbar pseudo-elements, padding modifiers, and the reduced-motion media query for the scrollbar. None of these selectors are referenced anywhere in the preview HTML or JS.

**Simplified alternative**

Keep only:

```css
.cba-module-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}

.cba-module-container:not(.cba-module-container--fullscreen) {
  background-color: var(--cba-bg-secondary);
  border: 1px solid var(--cba-border-default);
  border-radius: var(--cba-radius-lg);
  box-shadow: var(--cba-shadow-module);
  overflow: hidden;
}
```

**Benefit**

Removes ~56 lines of unused CSS, reducing file size and noise.

**Risk**

Medium. These rules are "keep in sync" copies from `module-container.component.scss`. Removing them breaks the 1:1 copy contract and would require restoring them if the preview later adds body/header wrappers, size modifiers, or padding modifiers. Consider keeping them if strict parity is preferred over size.

---

## S9. Trim verbose HTML comments in the extras section

**Current code**

- Lines 496-638 contain 10 large block comments (each 8-20 lines) explaining every extras panel.

**Simplified alternative**

Replace each block with a one-line comment, e.g.

```html
<!-- Token swatches: 9 chips from TOKEN_ROLES -->
```

and move the detailed "HOW TO EXTEND" guidance to `docs/THEME.md` or `docs/CONSUMER_GUIDE.md`.

**Benefit**

Significantly shrinks `docs/theme-preview.html` and keeps the markup readable. The long prose is better suited to documentation than inline comments.

**Risk**

Low, but future AI agents that edit the preview would lose local context. Mitigate by keeping a short pointer comment such as `<!-- See docs/THEME.md §Token Swatches -->`.

---

## S10. Consider minifying the copied component SCSS blocks

**Current code**

- Lines 219-415 are formatted as multi-line, readable CSS blocks.
- The rest of the inline `<style>` block (lines 56-216) is minified to single-line rules.

**Simplified alternative**

Minify the copied header/container blocks to match the rest of the inline style, or move them to a separate `docs/theme-preview-components.css` file and link it.

**Benefit**

Consistency and a smaller HTML payload.

**Risk**

High for minification inside the HTML file: the "keep in sync" value of the copied blocks is their readability; minifying makes diffs against the source SCSS harder to review. Moving to a separate CSS file is cleaner but adds another request for the `file://` preview.

---

## Summary of recommended first actions

1. **S1** and **S2** are safe, low-risk CSS consolidations.
2. **S3**, **S6**, and **S7** replace inline styles with existing utilities.
3. **S5** removes the largest JS duplication in `renderDensityStrip()`.
4. **S8** is the biggest size win but trades strict "keep in sync" parity; apply only if parity can be relaxed for unused selectors.
5. **S9** is a documentation-hygiene win and can be done independently.
