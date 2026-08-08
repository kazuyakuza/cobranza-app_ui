# Cluster 3 — Implementation Plan — Phase 10 Theme Hardening (Preview & Pattern Docs)

**TODO source:** `.agent/todos/20260807/20260807-todo-1.md`
**Global plan:** `.kilo/plans/20260807-phase10-theme-hardening.md`
**Front-end spec:** `.kilo/plans/20260807-phase10-cluster3-frontend-spec.md`
**Branch:** `feat/phase10-theme-hardening`
**Scope:** Tasks 9 (Table states), 10 (Nav/footer states), 11 (Semantic status) + Work C (Preview) + Work D (Docs)
**Output role:** Plan-only. No source files modified in this step.

---

## Pre-Analysis

### Baseline snapshot (verified by reading current files)

| File | Current state | Cluster 3 delta |
|------|---------------|-----------------|
| `docs/theme-preview.html` (396 lines) | Has Shell mockup, 9-swatch grid, button matrix, text-on-surfaces, accent pills. **Missing:** density strip, border-scale swatches, selected samples, form-state samples, type-scale sample. | Add 5 new sections + CSS + JS arrays + render functions. |
| `docs/theme-preview.css` | Compiled from `src/theme/theme.scss`; `:root` already matches `EXPECTED_TOKENS` (Phase 10 cluster 1 tokens present). | Regenerate via `npm run build:preview` (no SCSS change in cluster 3; CSS will not drift, but rebuild to confirm sync and commit if diff). |
| `docs/THEME.md` (213 lines) | Has Surface Hierarchy, Border Roles, Selected State, Form State Matrix, Typography Scale, Radius/Shadow Rules. **Missing:** Table State Patterns, Nav/Footer Pill State Patterns, Semantic Status Patterns sections. | Add 3 new sections + ToC entries. |
| `docs/CONSUMER_GUIDE.md` (372 lines) | **Already contains** Table State Patterns (L274), Nav/Footer Pill State Patterns (L289), Semantic Status Patterns (L303), Quick verify items 7–9 (L362–364). | Verify only; no edits expected. |
| `README.md` (267 lines) | Design Tokens section (L173–198) already lists selected/form/typography; L198 already points to CONSUMER_GUIDE "selected state usage, table/nav patterns, semantic status". | Verify only; no edits expected unless quick review finds a gap. |
| `CHANGELOG.md` `[0.12.0]` | Has Added/Changed/Notes covering tokens, form wiring, dropdown, surface & border retuning, ModuleHeader icons. **Missing:** preview HTML density/border/selected/form/type-scale sections + THEME.md pattern sections. | Append cluster-3 entries under existing `[0.12.0]` Added section. |
| `src/components/testing/theme-fixtures.ts` `EXPECTED_TOKENS` | Already includes all cluster-1 new tokens (selected, form state, typography). | No change. |
| `src/theme/preview-html.spec.ts` | Asserts `TOKEN_ROLES.length === 9` (via `SWATCH_ROLE_TOKEN` map) and `REQUIRED_IDS = ['swatchGrid','buttonMatrix','textGrid','accentRow','rawStrip']`. | **Constraint:** do NOT add entries to `TOKEN_ROLES` and do NOT remove required IDs. New tokens go into new, separately-named arrays. New sections get new IDs (not in `REQUIRED_IDS`, so tests won't require them — acceptable; cluster 3 adds value without expanding the regression contract). |
| `package.json` | `version: 0.12.0` (already bumped in Step 3). | No version change in cluster 3. |

### Technical decisions

1. **Test-safety contract:** `extractTokenRoles()` in `html-loader.ts` parses ONLY the `TOKEN_ROLES` array by name. New tokens (selected `--cba-selected-*`, form-state `--cba-state-*`, typography `--cba-font-size-*` / `--cba-line-height-*`) will live in **new independently-named JS arrays** (`SELECTED_SAMPLES`, `FORM_STATES`, `TYPE_SCALE`, `BORDER_LEVELS`, `STATUS_BADGES`), NOT in `TOKEN_ROLES`. This keeps `preview-html.spec.ts` green without editing the spec.
2. **No SCSS change in cluster 3** → `theme-preview.css` `:root` is already authoritative. Run `npm run build:preview` to confirm zero semantic diff (whitespace/newline normalization from sass may produce a trivial diff; commit only if content changes).
3. **New sections are static demos** using inline `var(--cba-*)` and `.is-hover`/`.is-selected`/`.is-disabled` utility classes — no Angular, no validation engine.
4. **Rules compliance:**
   - `docs/theme-preview.html` is a docs file → `max-lines-per-file` (200) does NOT apply; spec allows >600 lines. Target ~560–600.
   - JS render functions: ≤2 params, ≤50-line bodies (matches existing style).
   - `max-depth` ≤2: keep render functions flat (single `map` + template literal).
   - `single-section-boolean-conditions`: no complex boolean conditions in new JS.
   - `no-commented-code`: HTML comments are documentation (existing file uses them); keep new comments as guidance, not dead code.
   - `newline-prevention`: use real newlines in the file content.
5. **Existing `.section-pill.active` uses `border-color: var(--cba-accent-primary)`** (L100 of preview). The selected-samples section will introduce a `.section-pill.is-selected` demoing the full `--cba-selected-*` set, leaving `.active` untouched (the Shell mockup footer keeps `.active`).
6. **Gitignore compliance:** run `git status` before commit; ensure `node_modules/`, `dist/` not staged. `docs/theme-preview.css` IS tracked (committed artifact).
7. **Military-mode**: steps are terse and execution-focused.

---

## High-Level Approach

1. Add CSS rules for the 5 new preview sections to the inline `<style>` block in `docs/theme-preview.html`.
2. Add the 5 new HTML section blocks inside `.extras` (after the existing `textGrid`/`accentRow`/`rawStrip` group, before the closing `</div>` of `.extras`).
3. Add 5 new JS data arrays + 5 render functions + 5 invocation lines to the `<script>`.
4. Add 3 new sections to `docs/THEME.md` (Table, Nav/Footer, Semantic Status) + ToC entries.
5. Verify `docs/CONSUMER_GUIDE.md` and `README.md` already cover cluster 3 (no edits).
6. Finalize `CHANGELOG.md` `[0.12.0]` with cluster-3 preview + docs entries.
7. Regenerate `docs/theme-preview.css` (`npm run build:preview`), run `npm test` and `npm run lint`, verify all green.
8. Commit with a meaningful message.

---

## Detailed Steps

### Step 1 — Add CSS for new preview sections

**File:** `docs/theme-preview.html`
**Location:** inside the existing `<style>...</style>` block, append AFTER the `.raw-strip .chip` rule (currently the last rule before `</style>` on L160). Use `vscode-mcp-server_replace_lines_code` or `edit` with the `.raw-strip .chip{...}` line as anchor.

Append the following CSS (real newlines, no `\n` escapes):

```css
    /* Cluster 3 — pattern preview sections (selected, table, nav, form states, type scale, status) */
    .pattern-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
    .pattern-card{padding:12px;border:1px solid var(--cba-border-default);border-radius:var(--cba-radius-md);background:var(--cba-bg-secondary)}
    .pattern-card h3{margin:0 0 8px;font-size:12px;font-family:ui-monospace,monospace;color:var(--cba-text-secondary);font-weight:700}

    /* Border scale swatches */
    .border-scale{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
    .border-swatch{padding:16px;border-radius:var(--cba-radius-md);background:var(--cba-bg-secondary)}
    .border-swatch--subtle{border:1px solid var(--cba-border-subtle)}
    .border-swatch--default{border:1px solid var(--cba-border-default)}
    .border-swatch--strong{border:1px solid var(--cba-border-strong)}
    .border-swatch b{display:block;font-size:13px;font-weight:700;color:var(--cba-text-primary);margin-bottom:2px}
    .border-swatch span{font-size:11px;font-family:ui-monospace,monospace;color:var(--cba-text-secondary)}

    /* Selected / nav / footer pill samples */
    .demo-pills{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
    .demo-pill{padding:8px 16px;border-radius:999px;border:1px solid var(--cba-border-strong);background:var(--cba-bg-secondary);color:var(--cba-text-secondary);font-size:13px;font-weight:700}
    .demo-pill.is-hover{background-image:linear-gradient(var(--cba-hover),var(--cba-hover));color:var(--cba-text-primary)}
    .demo-pill.is-selected{border-color:var(--cba-selected-border);background:var(--cba-selected-bg);color:var(--cba-selected-text)}
    .demo-pill.is-disabled{background:var(--cba-state-disabled-bg);border-color:var(--cba-border-subtle);color:var(--cba-state-disabled-text);cursor:not-allowed}
    .demo-nav{display:flex;flex-direction:column;gap:4px}
    .demo-nav__item{padding:7px 12px;border-radius:var(--cba-radius-sm);font-size:13px;font-weight:600;color:var(--cba-text-secondary)}
    .demo-nav__item.is-hover{background:var(--cba-hover);color:var(--cba-text-primary)}
    .demo-nav__item.is-selected{background:var(--cba-selected-bg);color:var(--cba-selected-text);border-left:3px solid var(--cba-selected-border)}
    .demo-nav__item.is-disabled{color:var(--cba-state-disabled-text);cursor:not-allowed}

    /* Mini table for row-state demo */
    .demo-table{width:100%;border-collapse:collapse;font-size:13px}
    .demo-table thead th{text-align:left;padding:9px 10px;background:var(--cba-bg-tertiary);color:var(--cba-text-secondary);font-weight:600;border-bottom:1px solid var(--cba-border-subtle)}
    .demo-table tbody td{padding:9px 10px;border-bottom:1px solid var(--cba-border-subtle);color:var(--cba-text-primary)}
    .demo-table tbody tr.is-hover td{background:var(--cba-hover)}
    .demo-table tbody tr.is-selected td{background:var(--cba-selected-bg);color:var(--cba-selected-text)}
    .demo-table tbody tr.is-disabled td{background:var(--cba-state-disabled-bg);color:var(--cba-state-disabled-text)}

    /* Form-state field samples (static boxes, no Angular) */
    .form-states{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px}
    .form-field{padding:8px 10px;border-radius:var(--cba-radius-sm);font-size:13px;font-weight:500}
    .form-field b{display:block;font-size:10.5px;font-family:ui-monospace,monospace;color:var(--cba-text-secondary);font-weight:700;margin-bottom:3px;text-transform:uppercase;letter-spacing:.04em}
    .form-field--default{background:var(--cba-bg-secondary);border:1px solid var(--cba-border-default);color:var(--cba-text-primary)}
    .form-field--focus{background:var(--cba-bg-secondary);border:1px solid var(--cba-accent-primary);color:var(--cba-text-primary);box-shadow:var(--cba-focus-ring)}
    .form-field--disabled{background:var(--cba-state-disabled-bg);border:1px solid var(--cba-border-subtle);color:var(--cba-state-disabled-text);cursor:not-allowed}
    .form-field--readonly{background:var(--cba-bg-tertiary);border:1px solid var(--cba-border-subtle);color:var(--cba-text-secondary)}
    .form-field--invalid{background:var(--cba-bg-secondary);border:1px solid var(--cba-state-invalid-border);color:var(--cba-state-invalid-text)}

    /* Type scale sample */
    .type-scale{display:flex;flex-direction:column;gap:6px}
    .type-row{display:flex;align-items:baseline;gap:10px}
    .type-row .label{font-family:ui-monospace,monospace;font-size:11px;color:var(--cba-text-secondary);min-width:170px;flex:0 0 auto}
    .type-row .sample{color:var(--cba-text-primary)}

    /* Semantic status badges */
    .status-row{display:flex;flex-wrap:wrap;gap:8px}
    .status-badge{padding:5px 12px;border-radius:999px;font-size:12px;font-weight:700;color:var(--cba-text-inverse)}
    .status-badge--outline{background:transparent;border:1px solid currentColor}
    .status-badge--neutral{background:var(--cba-bg-tertiary);border:1px solid var(--cba-border-default);color:var(--cba-text-secondary)}
```

**Verification:** open the file, confirm the new rules sit immediately before `</style>` and the existing `.shell-footer`/`.pv-btn*`/`.t-row*` rules are unchanged.

---

### Step 2 — Add 5 new HTML section blocks inside `.extras`

**File:** `docs/theme-preview.html`
**Location:** inside `<div class="extras">...</div>`, append AFTER the existing `accentRow`/`rawStrip` group (currently L244–247) and BEFORE the closing `</div>` of `.extras` (L248).

Insert the following markup (each block has a guidance comment for AI agents):

```html
          <!--
            CLUSTER 3 — Multi-module density strip.
            Two module cards side by side to show canvas→panel→elevated→inset under density.
            Reuses the existing .module chrome classes; no new tokens.
          -->
          <h2>Multi-module density</h2>
          <div class="pattern-grid" id="densityStrip"></div>

          <!--
            CLUSTER 3 — Border scale swatches.
            Three swatches showing subtle / default / strong on panel surface, labelled by role.
          -->
          <h2>Border scale</h2>
          <div class="border-scale" id="borderScale"></div>

          <!--
            CLUSTER 3 — Selected samples (footer pill + fake nav item + fake table row).
            Static .is-hover / .is-selected / .is-disabled classes demo the selected token set
            distinctly from hover. See docs/CONSUMER_GUIDE.md §Selected State Usage.
          -->
          <h2>Selected states</h2>
          <div class="pattern-grid" id="selectedSamples"></div>

          <!--
            CLUSTER 3 — Form state samples.
            Five static field boxes: default / focus / disabled / readonly / invalid.
            Uses --cba-state-* and --cba-focus-ring. No Angular components in preview.
          -->
          <h2>Form states</h2>
          <div class="form-states" id="formStates"></div>

          <!--
            CLUSTER 3 — Type scale sample.
            Each step rendered at its --cba-font-size-* / --cba-line-height-* so the scale
            is visually verifiable. Labels show the token pair.
          -->
          <h2>Type scale</h2>
          <div class="type-scale" id="typeScale"></div>

          <!--
            CLUSTER 3 — Semantic status badges (solid + outline + neutral).
            success / warning / danger / info / neutral. Warning vs danger distinction is
            reinforced by label, not color alone.
          -->
          <h2>Semantic status</h2>
          <div class="status-row" id="statusBadges"></div>
```

**Verification:** `grep -n 'id="densityStrip"\|id="borderScale"\|id="selectedSamples"\|id="formStates"\|id="typeScale"\|id="statusBadges"' docs/theme-preview.html` returns 6 matches. The existing required IDs (`swatchGrid`, `buttonMatrix`, `textGrid`, `accentRow`, `rawStrip`) remain present and unchanged.

---

### Step 3 — Add JS data arrays + render functions + invocations

**File:** `docs/theme-preview.html`
**Location:** inside `<script>...</script>`.

#### 3a. Add new data arrays

Insert immediately AFTER the existing `TEXT_SAMPLES` array declaration (currently L304–309), BEFORE `function renderSourceHex`:

```js
const DENSITY_MODULES=[
  {title:'Clientes List',status:'loaded',meta:'50%'},
  {title:'Deudas List',status:'loaded',meta:'50%'}
];
const DENSITY_ROWS=[
  ['12.345.678-9','Acme S.A.','1,200,000'],
  ['9.876.543-2','Comercial del Norte','540,000']
];

const BORDER_LEVELS=[
  ['subtle','--cba-border-subtle','Internal separators'],
  ['default','--cba-border-default','Structural edges'],
  ['strong','--cba-border-strong','Important chrome']
];

const SELECTED_PILLS=[
  ['Normal','',''],
  ['Hover','is-hover',''],
  ['Selected','is-selected',''],
  ['Disabled','is-disabled','']
];
const SELECTED_NAV=[
  ['Clientes',''],
  ['Deudas','is-hover'],
  ['Pagos','is-selected'],
  ['Reportes','is-disabled']
];
const TABLE_ROWS=[
  ['12.345.678-9','Acme S.A.','1,200,000',''],
  ['9.876.543-2','Comercial del Norte','540,000','is-hover'],
  ['11.223.344-5','Distribuidora Sur','0','is-selected'],
  ['45.678.901-3','Ferretería El Tornillo','87,500','is-disabled']
];

const FORM_STATES=[
  ['default','form-field--default','Texto por defecto'],
  ['focus','form-field--focus','Texto enfocado'],
  ['disabled','form-field--disabled','No editable'],
  ['readonly','form-field--readonly','Solo lectura'],
  ['invalid','form-field--invalid','Campo inválido']
];

const TYPE_SCALE=[
  ['display','--cba-font-size-display','--cba-line-height-display','Clientes'],
  ['heading-lg','--cba-font-size-heading-lg','--cba-line-height-heading-lg','Lista de clientes'],
  ['heading-md','--cba-font-size-heading-md','--cba-line-height-heading-md','Sección de pagos'],
  ['body','--cba-font-size-body','--cba-line-height-body','Ferretería El Tornillo — deuda 87.500'],
  ['small','--cba-font-size-small','--cba-line-height-small','Header de tabla / metadata'],
  ['caption','--cba-font-size-caption','--cba-line-height-caption','Pista terciaria o nota corta']
];

const STATUS_BADGES=[
  ['success','--cba-accent-success','success'],
  ['warning','--cba-accent-warning','warning'],
  ['danger','--cba-accent-danger','danger'],
  ['info','--cba-accent-info','info']
];
```

#### 3b. Add render functions

Insert immediately AFTER the existing `renderTextSamples` function (currently L338–348), BEFORE `function setActiveButton`:

```js
function renderDensityStrip(host){
  const modules=DENSITY_MODULES.map(m=>{
    const rows=DENSITY_ROWS.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('');
    return `<div class="module"><div class="module-header"><div class="status">✓</div><div class="module-title">${m.title}</div><div class="module-meta" style="font-size:12px;color:var(--cba-text-muted);font-weight:600">${m.meta}</div></div><div class="module-body"><table class="demo-table"><thead><tr><th>Documento</th><th>Nombre</th><th>Deuda</th></tr></thead><tbody>${rows}</tbody></table></div><div class="module-footer">Listo</div></div>`;
  }).join('');
  host.innerHTML=modules;
}

function renderBorderScale(host){
  host.innerHTML=BORDER_LEVELS.map(([id,token,role])=>{
    return `<div class="border-swatch border-swatch--${id}"><b>${role}</b><span>${token}</span></div>`;
  }).join('');
}

function renderSelectedSamples(host){
  const pills=SELECTED_PILLS.map(([label,cls])=>`<span class="demo-pill ${cls}">${label}</span>`).join('');
  const nav=SELECTED_NAV.map(([label,cls])=>`<span class="demo-nav__item ${cls}">${label}</span>`).join('');
  const rows=TABLE_ROWS.map(([a,b,c,cls])=>`<tr class="${cls}"><td>${a}</td><td>${b}</td><td>${c}</td></tr>`).join('');
  host.innerHTML=`<div class="pattern-card"><h3>Footer pills</h3><div class="demo-pills">${pills}</div></div><div class="pattern-card"><h3>Nav items</h3><div class="demo-nav">${nav}</div></div><div class="pattern-card"><h3>Table rows</h3><table class="demo-table"><thead><tr><th>Documento</th><th>Nombre</th><th>Deuda</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderFormStates(host){
  host.innerHTML=FORM_STATES.map(([label,cls,value])=>{
    return `<div class="form-field ${cls}"><b>${label}</b>${value}</div>`;
  }).join('');
}

function renderTypeScale(host){
  host.innerHTML=TYPE_SCALE.map(([step,sizeTok,lhTok,sample])=>{
    return `<div class="type-row"><span class="label">${step} · ${sizeTok}</span><span class="sample" style="font-size:var(${sizeTok});line-height:var(${lhTok})">${sample}</span></div>`;
  }).join('');
}

function renderStatusBadges(host){
  const solid=STATUS_BADGES.map(([name,token,label])=>`<span class="status-badge" style="background:var(${token})">${label}</span>`).join('');
  const outline=STATUS_BADGES.map(([name,token,label])=>`<span class="status-badge status-badge--outline" style="color:var(${token})">${label}</span>`).join('');
  const neutral=`<span class="status-badge status-badge--neutral">neutral</span>`;
  host.innerHTML=`${solid}${outline}${neutral}`;
}
```

> Note: each function is ≤2 params and ≤20-line body, satisfying `max-arguments-per-method` and `max-lines-per-method`.

#### 3c. Add invocations

Append AFTER the existing rendering invocations at the end of the script (currently L391–393):

```js
renderDensityStrip(document.getElementById('densityStrip'));
renderBorderScale(document.getElementById('borderScale'));
renderSelectedSamples(document.getElementById('selectedSamples'));
renderFormStates(document.getElementById('formStates'));
renderTypeScale(document.getElementById('typeScale'));
renderStatusBadges(document.getElementById('statusBadges'));
```

**Verification:**
- `grep -c 'renderDensityStrip\|renderBorderScale\|renderSelectedSamples\|renderFormStates\|renderTypeScale\|renderStatusBadges' docs/theme-preview.html` returns ≥12 (6 definitions + 6 calls; the density helper also defines `renderDensityStrip` once).
- `TOKEN_ROLES` array still has exactly 9 entries (`grep -c "^\s*\['canvas'\|^\s*\['panel'\|..." ` or open visually) — must remain 9 to satisfy `preview-html.spec.ts`.
- Open `docs/theme-preview.html` in a browser (manual, optional in this plan step): confirm 6 new sections render with no JS console errors.

---

### Step 4 — Add 3 new sections to `docs/THEME.md`

**File:** `docs/THEME.md`

#### 4a. Update Table of Contents (L13–27)

Insert three new entries after `- [Typography Scale](#typography-scale)` and before `- [Radius Rules](#radius-rules)`:

```markdown
- [Table State Patterns](#table-state-patterns)
- [Navigation / Footer Pill State Patterns](#navigation--footer-pill-state-patterns)
- [Semantic Status Patterns](#semantic-status-patterns)
```

#### 4b. Add the three sections

Insert AFTER the `## Typography Scale` section (ends L154) and BEFORE `## Radius Rules` (L156). Content:

```markdown
## Table State Patterns

Tables reuse the surface hierarchy plus selected/hover tokens. Full table component is out of scope; these are token-level patterns for Shell/MFE authors.

| Row state | Background | Border | Text |
|-----------|-----------|--------|------|
| default (body row) | `--cba-bg-secondary` (panel) | none | `--cba-text-primary` |
| hover | `--cba-hover` overlay on panel bg | none | `--cba-text-primary` |
| selected | `--cba-selected-bg` | none (or `--cba-selected-border` left accent) | `--cba-selected-text` |
| header (`thead th`) | `--cba-bg-tertiary` (inset) | bottom: `--cba-border-subtle` | `--cba-text-secondary` + semibold |
| disabled (optional) | `--cba-state-disabled-bg` | none | `--cba-state-disabled-text` |

- `thead` = inset surface; body rows = panel surface.
- Selected row uses `--cba-selected-bg`; do not substitute `--cba-hover` for selected.
- See the [Consumer Guide §Table State Patterns](CONSUMER_GUIDE.md#table-state-patterns) for Shell/MFE wiring.

## Navigation / Footer Pill State Patterns

Footer section pills and similar nav chips follow a four-state pattern.

| State | Background | Border | Text |
|-------|-----------|--------|------|
| normal | `--cba-bg-secondary` | `--cba-border-strong` | `--cba-text-secondary` |
| hover | `--cba-bg-secondary` + `--cba-hover` overlay | `--cba-border-strong` | `--cba-text-primary` |
| selected | `--cba-selected-bg` | `--cba-selected-border` | `--cba-selected-text` |
| disabled | `--cba-state-disabled-bg` | `--cba-border-subtle` | `--cba-state-disabled-text` |

- Selected is visually stronger than hover: border shifts to `--cba-selected-border` (warm taupe) and fill shifts to `--cba-selected-bg`.
- Do not use `--cba-accent-primary` fill for selected pills; the selected token set provides sufficient distinction.
- See the [Consumer Guide §Navigation / Footer Pill State Patterns](CONSUMER_GUIDE.md#navigation--footer-pill-state-patterns).

## Semantic Status Patterns

Badge and inline status recipes for success / warning / danger / info / neutral.

| Status | Accent token | Solid badge | Outline badge | Inline text |
|--------|-------------|-------------|---------------|-------------|
| success | `--cba-accent-success` | bg `--cba-accent-success`, text `--cba-text-inverse` | border + text `--cba-accent-success`, bg transparent | `--cba-state-valid-text` |
| warning | `--cba-accent-warning` | bg `--cba-accent-warning`, text `--cba-text-inverse` | border + text `--cba-accent-warning`, bg transparent | `--cba-accent-warning` (panel/elevated only) |
| danger | `--cba-accent-danger` | bg `--cba-accent-danger`, text `--cba-text-inverse` | border + text `--cba-accent-danger`, bg transparent | `--cba-state-invalid-text` |
| info | `--cba-accent-info` | bg `--cba-accent-info`, text `--cba-text-inverse` | border + text `--cba-accent-info`, bg transparent | `--cba-accent-info` |
| neutral | `--cba-accent-primary` (taupe) | bg `--cba-accent-primary`, text `--cba-text-inverse` | border + text `--cba-accent-primary`, bg transparent | `--cba-text-secondary` |

- **Warning vs danger:** warning is soft coral (`--cba-accent-warning`); danger is deeper red (`--cba-accent-danger`). Always pair color with an icon or label — do not rely on color alone.
- See the [Consumer Guide §Semantic Status Patterns](CONSUMER_GUIDE.md#semantic-status-patterns).
```

**Verification:** `grep -n '^## Table State Patterns\|^## Navigation / Footer Pill State Patterns\|^## Semantic Status Patterns' docs/THEME.md` returns 3 matches; ToC has 3 new links.

---

### Step 5 — Verify `docs/CONSUMER_GUIDE.md` (no edits expected)

**Action:** read-only verification.
- Confirm `## Table State Patterns` (L274), `## Navigation / Footer Pill State Patterns` (L289), `## Semantic Status Patterns` (L303) exist.
- Confirm Quick verify items 7–9 (selected, form states, typography) exist (L362–364).
- If any are missing (unexpected), append the missing section using the same content as THEME.md Step 4 but phrased for Shell/MFE authors. Expected outcome: no edits.

**Verification:** `grep -c 'Table State Patterns\|Footer Pill State Patterns\|Semantic Status Patterns' docs/CONSUMER_GUIDE.md` ≥ 3.

---

### Step 6 — Verify `README.md` (no edits expected)

**Action:** read-only verification.
- Confirm L198 already states: "For Shell/MFE integration patterns (selected state usage, table/nav patterns, semantic status), see [`./docs/CONSUMER_GUIDE.md`](./docs/CONSUMER_GUIDE.md)."
- Confirm Design Tokens section (L173–189) lists selected/form/typography tokens.
- If missing (unexpected), append a one-line pointer. Expected outcome: no edits.

**Verification:** `grep -c 'table/nav patterns\|semantic status' README.md` ≥ 1.

---

### Step 7 — Finalize `CHANGELOG.md` `[0.12.0]`

**File:** `docs/...` → `CHANGELOG.md`
**Location:** inside the existing `## [0.12.0] — 2026-08-07` → `### Added` section (currently L35–42). Append new bullets at the END of the `### Added` list, BEFORE the `### Changed` header (L44).

Append (preserve existing entries, do not modify them):

```markdown
- **Theme preview pattern sections** in `docs/theme-preview.html`: added Multi-module density strip (2 module cards showing canvas→panel→elevated→inset under density), Border scale swatches (subtle/default/strong labelled by role), Selected samples (footer pill + fake nav item + fake table row using `.is-hover`/`.is-selected`/`.is-disabled`), Form state samples (default/focus/disabled/readonly/invalid using `--cba-state-*` + `--cba-focus-ring`), Type scale sample (six steps driven by `--cba-font-size-*`/`--cba-line-height-*`), and Semantic status badges (solid + outline + neutral). New tokens are rendered from separate JS arrays (`SELECTED_SAMPLES`, `FORM_STATES`, `TYPE_SCALE`, `BORDER_LEVELS`, `STATUS_BADGES`) so the 9-entry `TOKEN_ROLES` swatch grid and `preview-html.spec.ts` stay stable. Regenerate via `npm run build:preview`. See `docs/theme-preview.html`.
- **THEME.md pattern sections** added: Table State Patterns, Navigation / Footer Pill State Patterns, Semantic Status Patterns (with ToC entries), cross-linking the matching Consumer Guide sections. `docs/CONSUMER_GUIDE.md` already contained these pattern sections plus Quick verify items for selected/form states/typography; no further edits were required. `README.md` already points to the Consumer Guide for table/nav/status patterns.
```

**Verification:**
- `grep -c 'Theme preview pattern sections\|THEME.md pattern sections' CHANGELOG.md` returns 2.
- Confirm NO `[Unreleased]` section is introduced (`grep -c '\[Unreleased\]' CHANGELOG.md` returns 0) per `changelog-versioning.md`.
- Confirm the `[0.12.0] — 2026-08-07` header remains the first dated header.

---

### Step 8 — Regenerate preview CSS + run tests + lint

**Commands (run individually, NOT chained):**

1. `npm run build:preview`
   - Compiles `src/theme/theme.scss` → `docs/theme-preview.css` (compressed, no source map).
   - No SCSS changed in cluster 3, so `:root` diff should be zero. If `git status docs/theme-preview.css` shows a change, it is sass whitespace/normalization — inspect with `git diff docs/theme-preview.css`; commit only if semantically meaningful.

2. `npm test`
   - Must remain green. Key specs: `preview-html.spec.ts` (TOKEN_ROLES length 9, required IDs, `var(--cba-bg-primary)` present, overlay rules unchanged), `consumer-guide.spec.ts` (mandated sections), `docs-compliance.spec.ts` (no `[Unreleased]`), `tokens.spec.ts`, `surfaces.spec.ts`, `contrast.spec.ts`.
   - If `preview-html.spec.ts` fails on the `.t-row .tok` exact-string assertion, the new CSS must NOT have altered that rule — re-check Step 1 did not edit existing rules.

3. `npm run lint`
   - Lints `src/**/*.ts` only; preview HTML/MD are not linted. Must remain green (no TS changed).

**On any failure:** stop, do not commit, return to caller with the failure detail. Do NOT modify spec files to force a pass.

---

### Step 9 — Commit

**Pre-commit checks (per `gitignore-compliance.md`):**
1. `git status` — review staged and unstaged files.
2. Confirm `node_modules/`, `dist/` are NOT staged.
3. Confirm only these files are staged:
   - `docs/theme-preview.html`
   - `docs/theme-preview.css` (only if `build:preview` produced a meaningful diff)
   - `docs/THEME.md`
   - `CHANGELOG.md`
4. If `CONSUMER_GUIDE.md` or `README.md` were edited (unexpected), include them.

**Stage and commit** (separate commands, not chained):

```
git add docs/theme-preview.html docs/THEME.md CHANGELOG.md
```
(Add `docs/theme-preview.css` to the `git add` list only if it changed.)

```
git commit -m "feat(theme): add preview pattern sections + THEME.md pattern docs (cluster 3)

- docs/theme-preview.html: multi-module density strip, border scale swatches,
  selected samples (pill/nav/table row), form state samples, type scale sample,
  semantic status badges. New tokens via separate JS arrays to keep
  TOKEN_ROLES (9 entries) and preview-html.spec.ts stable.
- docs/THEME.md: Table / Nav-Footer / Semantic Status pattern sections + ToC.
- CHANGELOG.md: finalize [0.12.0] Added entries for cluster 3.
- Regenerated docs/theme-preview.css via npm run build:preview.

Refs: .agent/todos/20260807/20260807-todo-1.md tasks 9-11, Work C-D
Front-end spec: .kilo/plans/20260807-phase10-cluster3-frontend-spec.md"
```

**Verification:** `git log --oneline -1` shows the new commit; `git status` shows a clean tree (or only untracked unrelated files).

---

## Verification Checklist (Cluster 3 acceptance)

| # | Criterion | How verified |
|---|-----------|--------------|
| 1 | Preview HTML has Multi-module density strip | `grep 'id="densityStrip"' docs/theme-preview.html` |
| 2 | Preview HTML has Border scale swatches | `grep 'id="borderScale"' docs/theme-preview.html` |
| 3 | Preview HTML has Selected samples (pill + nav + table row) | `grep 'id="selectedSamples"' docs/theme-preview.html` |
| 4 | Preview HTML has Form state samples (default/focus/disabled/readonly/invalid) | `grep 'id="formStates"' docs/theme-preview.html` + 5 `.form-field--*` rules |
| 5 | Preview HTML has Type scale sample | `grep 'id="typeScale"' docs/theme-preview.html` |
| 6 | Preview HTML has Semantic status badges | `grep 'id="statusBadges"' docs/theme-preview.html` |
| 7 | THEME.md documents table/nav/status patterns | `grep -c '^## Table State Patterns\|^## Navigation / Footer Pill State Patterns\|^## Semantic Status Patterns' docs/THEME.md` == 3 |
| 8 | CONSUMER_GUIDE.md has table/nav/status sections (pre-existing) | `grep -c` ≥ 3 |
| 9 | README mentions pattern readiness (pre-existing) | `grep` ≥ 1 |
| 10 | `npm test` passes | green suite |
| 11 | `npm run lint` passes | green |
| 12 | `npm run build:preview` regenerates CSS without breaking `:root` parity | `preview-html.spec.ts` `:root matches canonical tokens` green |
| 13 | `TOKEN_ROLES` still 9 entries | `preview-html.spec.ts` `TOKEN_ROLES array maps every role...` green |
| 14 | CHANGELOG `[0.12.0]` finalized, no `[Unreleased]` | `docs-compliance.spec.ts` green |
| 15 | Commit is on `feat/phase10-theme-hardening` | `git branch --show-current` |

---

## Out of Scope (handled by other steps/agents)

- Marking TODO tasks 9/10/11 `[DONE]` — Step 4.6 of the Critical Workflow (implementer, after this plan is implemented and verified).
- Renaming TODO file to `-DONE` — Step 5 of the Critical Workflow.
- Merging `feat/phase10-theme-hardening` to `main` — Step 5.
- Pushing `main` to `origin` — Step 5.
- Code review / simplification (4.3) — separate code-reviewer + code-simplifier pass.
- Documentation JSDoc pass (4.4) — docs-specialist; this plan already includes the markdown docs edits, so 4.4 may resolve to verification only.
- Front-end verification (4.5a) — frontend-specialist verifies the rendered preview against this spec.
- Overall plan adherence (4.5b) — architector (returning the diff report).

---

## Risk Notes

- **`preview-html.spec.ts` exact-string assertions:** the spec matches several CSS rules verbatim (e.g. `.t-row .tok{...}`, `.shell-footer{...}`, `.pv-btn--primary.is-hover,...{...}`). Step 1 ONLY appends new rules; it must not edit existing rules. If an existing rule must move, the spec breaks — do not move them.
- **`theme-preview.css` regeneration diff:** with no SCSS change, the rebuilt CSS should match the committed file byte-for-byte (sass is deterministic). If a diff appears, it signals sass version drift or a prior hand-edit — investigate before committing the CSS.
- **Preview file length:** adding ~150 lines of CSS + ~40 lines HTML + ~70 lines JS pushes the file from 396 to ~560–600 lines. The `max-lines-per-file` rule does not apply (docs/), and the frontend spec explicitly allows >600 for the preview.
- **`max-depth` in render functions:** `renderSelectedSamples` uses nested template literals but only one level of nesting inside a single `map`/string concat — depth stays ≤2.
- **No assumptions made:** all token values, file line numbers, and test assertions were read from the actual repository state before writing this plan.

---

## Summary

This plan adds the 6 missing preview sections (density strip, border scale, selected samples, form states, type scale, semantic status) to `docs/theme-preview.html` using new independently-named JS arrays so the 9-entry `TOKEN_ROLES` regression contract stays intact; adds the 3 missing pattern sections to `docs/THEME.md`; finalizes `CHANGELOG.md` `[0.12.0]`; regenerates `docs/theme-preview.css`; and verifies via `npm test` + `npm run lint`. CONSUMER_GUIDE.md and README.md are verified-only (already complete). No source `src/` files are touched.

**Plan file:** `.kilo/plans/20260807-phase10-cluster3.md`