# Simplification Plan — Task B

**File:** `docs/theme-preview.html`  
**Branch:** `feat/project-audit-and-fixes`  
**Goal:** Reduce hard-coded HTML/CSS duplication and align generated sections with the existing data-driven rendering pattern.

## 1. Data-Driven Section Captions

Move the 14 `<h2>` + `<p class="section-caption">` blocks (currently hard-coded in HTML) into a `SECTIONS` array and render them with a single function.

### Proposed data structure

```js
const SECTIONS=[
  {id:'shell',title:'Shell mockup',caption:'Application shell — NOT a library component. Library exports <code>&lt;cba-module-container&gt;</code>, <code>&lt;cba-module-header&gt;</code>, <code>&lt;cba-module-footer&gt;</code> only.',target:'moduleHost'},
  {id:'modules',title:'Module examples',caption:'Real library components: ...',target:'moduleHost'},
  {id:'swatches',title:'Token swatches',caption:'Direct <code>--cba-*</code> tokens...',target:'swatchGrid'},
  {id:'buttons',title:'Button states',caption:'DEMO CSS ONLY...',target:'buttonMatrix'},
  {id:'labels',title:'Labels & pills',caption:'Labels: use...',target:'labelsPills'},
  {id:'icons',title:'Icons',caption:'Icons come from Font Awesome...',target:'iconsGrid'},
  {id:'text',title:'Text on surfaces',caption:'Use <code>.cba-text-primary</code>...',target:'textGrid'},
  {id:'accents',title:'Accent pills',caption:'Reproduction: ...',target:'accentRow'},
  {id:'type',title:'Typography scale',caption:'Use <code>.cba-text-display</code>...',target:'typeScale'},
  {id:'border',title:'Border scale',caption:'Use <code>.cba-border-subtle</code>...',target:'borderScale'},
  {id:'selected',title:'Selected states',caption:'Selected-state tokens...',target:'selectedSamples'},
  {id:'forms',title:'Form states',caption:'Reproduction: ...',target:'formStates'},
  {id:'status',title:'Semantic status',caption:'Reproduction: ...',target:'statusBadges'},
  {id:'radiusShadow',title:'Radius & Shadow',caption:'Utility classes: ...',target:'radiusShadowGrid'}
];
```

### Action

1. Add `SECTIONS` constant after the existing data arrays.
2. Replace every hard-coded `<h2>` + `<p class="section-caption">` pair in `docs/theme-preview.html` with a placeholder `<div id="<sectionId>-header"></div>` (or render the caption just before its target container).
3. Add `renderSectionHeaders()` that iterates over `SECTIONS`, finds the target or its header placeholder, and injects `<h2>` + `<p class="section-caption">`.
4. Call `renderSectionHeaders()` during initialization.

### Benefit

Eliminates ~28 lines of repeated HTML and keeps captions centralized for future edits.

## 2. Reuse `BUTTON_STATES` / `BUTTON_VARIANTS` for Extra States

The "Focus", "Loading" and "Sizes" blocks (lines 564–598) are hard-coded HTML and duplicate the `.btn-surface`, `.btn-variant`, `.btn-states`, and `.pv-btn--*` patterns already produced by `buildButtonMatrix()`.

### Proposed changes

1. Extend the state model so the extra section can consume the same helpers.
2. Introduce an `EXTRA_BUTTON_SHOWCASEES` array:

```js
const EXTRA_BUTTON_SHOWCASEES=[
  {title:'Focus',rows:[{variant:'primary',state:'is-focus',label:'Focused'}]},
  {title:'Loading',rows:[{variant:'primary',state:'is-loading',label:'Loading',icon:'fa-solid fa-spinner fa-spin',disabled:true}]},
  {title:'Sizes',rows:[
    {variant:'primary',size:'sm',label:'Small'},
    {variant:'primary',size:'md',label:'Medium'}
  ]}
];
```

3. Refactor `buildStateButtons(variant)` into a more flexible `buildButtonRow(variant, state, options)` or keep it and add `buildExtraButtonState(buttonConfig)` that emits:
   - `.pv-btn--${variant}`
   - modifier class (`is-focus`, `is-loading`, optional size class)
   - `disabled` when needed
   - optional inner icon
4. Generate the three extra `.btn-surface` blocks using the same markup structure as the matrix.

### Benefit

Removes ~35 lines of hard-coded button markup and ensures new variants/sizes automatically appear in the extra-states section.

## 3. Consolidate Duplicated CSS

### 3.1 Shared focus-ring utility

The following rules repeat `outline:none; box-shadow:var(--cba-focus-ring);`:

- `.controls__close:focus-visible`
- `.preview-bar__show:focus-visible`
- `.pv-btn:focus-visible` (combined with `.cba-module-header__action:focus-visible`)
- `.pv-btn.is-focus,.pv-btn:focus-visible`

**Action:** Create a single utility class `.focus-ring`:

```css
.focus-ring{outline:none;box-shadow:var(--cba-focus-ring)}
```

Apply it to `.controls__close`, `.preview-bar__show`, `.pv-btn`, and `.cba-module-header__action` via the comma-grouped selector already used for `.pv-btn:focus-visible,.cba-module-header__action:focus-visible`, or add the class to HTML where those elements are generated.

### 3.2 Disabled / loading state

Both `.pv-btn.is-disabled,.pv-btn:disabled` and `.pv-btn.is-loading` set `cursor:not-allowed; opacity:.6`.

**Action:** Combine into:

```css
.pv-btn.is-disabled,.pv-btn:disabled,.pv-btn.is-loading{cursor:not-allowed;opacity:.6}
```

### 3.3 Button hover / active overlays

The overlay patterns for primary/danger/success vs secondary vs ghost are repeated. They can be expressed generically:

```css
.pv-btn--primary,.pv-btn--danger,.pv-btn--success{--btn-overlay-mode:inverse}
.pv-btn--secondary{--btn-overlay-mode:surface}
.pv-btn--ghost{--btn-overlay-mode:ghost}

.pv-btn.is-hover{background-image:linear-gradient(var(--btn-hover-overlay),var(--btn-hover-overlay))}
.pv-btn.is-active{background-image:linear-gradient(var(--btn-active-overlay),var(--btn-active-overlay))}
```

This requires token aliases. If adding tokens is out of scope, keep the current rules but at least merge the `.pv-btn--primary.is-hover,.pv-btn--danger.is-hover,.pv-btn--success.is-hover` and matching `.is-active` blocks.

### 3.4 Table chrome duplication

`.preview-module-table` and `.demo-table` share visual rules (header background, border colors, hover/selected/disabled row states). Consider extracting shared properties:

```css
.preview-module-table,.demo-table{... shared collapse, header, cell colors ...}
```

Keep only the divergent padding values separate.

## 4. Generate Radius & Shadow from an Array

The radius/shadow grid (lines 686–692) is static HTML.

### Proposed data structure

```js
const RADIUS_SHADOW_ITEMS=[
  {label:'radius-sm',radius:'sm'},
  {label:'radius-md',radius:'md'},
  {label:'radius-lg',radius:'lg'},
  {label:'shadow-module',radius:'md',shadow:'module'},
  {label:'shadow-elevated',radius:'md',shadow:'elevated'}
];
```

### Action

1. Add the array next to `BORDER_LEVELS` / `TYPE_SCALE`.
2. Replace the static `.radius-shadow-grid` contents with `<div class="radius-shadow-grid" id="radiusShadowGrid"></div>`.
3. Add `renderRadiusShadow(host)` that builds cards from `RADIUS_SHADOW_ITEMS`.
4. Call `renderRadiusShadow(document.getElementById('radiusShadowGrid'))` during initialization.

### Benefit

Aligns the section with every other showcase in the file and removes ~7 lines of hard-coded markup.

## 5. Optional Cleanups (do if low risk)

- Remove the unused third element in `PILL_STATES` entries.
- Normalize `TEXT_SAMPLES` properties: drop `muted:false` and rely on absence of `mutedNote`/`showInverse`.
- In `renderStatusBadges`, derive badge variant names from `STATUS_BADGES` labels instead of raw token strings.

## Files to Modify

- `docs/theme-preview.html` — apply all simplifications above.

## Out of Scope

- Do not change `src/theme/_variables.scss` or `docs/theme-preview.css`.
- Do not alter the visual output of the preview; simplification must be pixel-equivalent.
- Do not refactor module-header/container/footer copied SCSS blocks (they are intentionally mirrored from source components).

## Acceptance Criteria

1. All section captions are rendered from `SECTIONS` array.
2. Button extra states are generated by JS helpers reusing variant/state/size definitions.
3. No repeated `outline:none;box-shadow:var(--cba-focus-ring)` rules remain.
4. Radius & Shadow grid is rendered from `RADIUS_SHADOW_ITEMS` array.
5. `npm run build:preview` still succeeds and the preview renders identically.
