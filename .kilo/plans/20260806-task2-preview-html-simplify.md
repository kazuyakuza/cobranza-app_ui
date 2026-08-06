# Simplification Plan — Task 2 Theme Preview HTML

**Reviewed files:** `docs/theme-preview.html`, `docs/theme-preview.css`, `package.json`  
**Implementation plan:** `.kilo/plans/20260806-task2-preview-html.md`  
**Front-end spec:** `.kilo/plans/20260806-task2-preview-html-frontend-spec.md`  
**Verdict:** SIMPLIFICATIONS PROPOSED

---

## 1. Findings

### 1.1 Inline JS is within rule limits
- All functions are ≤8 lines (well under the 50-line method limit).
- All functions take ≤2 parameters.
- Nesting depth never exceeds 2 block levels.
- Button-matrix logic is already compact and readable.

### 1.2 Generated CSS bloat is architectural, not manual
- `docs/theme-preview.css` is a build artifact from `src/theme/theme.scss`.
- It contains scoped ng-bootstrap component rules (`_modal`, `_datepicker`, etc.) that do not match any DOM in the preview.
- Per the implementation plan §0.2.4, this is an intentional trade-off to keep the preview a faithful subset of the real bundle.
- **No manual stripping recommended** — doing so would break the “regenerate from source” workflow and drift-prevention goal.

### 1.3 HTML/JS simplifications available
| # | Issue | Location | Impact |
|---|---|---|---|
| A | 9 swatch rows are hand-written with mixed markup (`cba-bg-*` classes vs inline `style`) | `theme-preview.html` lines 176–184 | Repetition; source of drift if token hex/role changes |
| B | 4 text-on-surface cards repeat the same row pattern | `theme-preview.html` lines 192–216 | Verbose; easy to generate from data |
| C | Dead CSS selector `.btn-row` is never used in the markup | `theme-preview.html` line 121 | Minor bloat |
| D | String concatenation with `+` makes template construction harder to scan | `<script>` render helpers | Readability only |

---

## 2. Proposed simplifications

### 2.1 Generate swatches from `TOKEN_ROLES`
`TOKEN_ROLES` already carries `[semanticName, tokenName, hex]`. Reuse it to render the 9 swatches.

**Remove** the static `.swatch-grid` contents (lines 176–184) and replace with an empty mount:

```html
<div class="swatch-grid" id="swatchGrid"></div>
```

**Add** a helper and call it:

```js
function renderSwatches(host){
  host.innerHTML=TOKEN_ROLES.map(([name,token,hex])=>{
    const bgClass=token.startsWith('--cba-bg-')?'swatch-chip '+token.slice(2):'swatch-chip';
    const bgStyle=bgClass.includes(' ')?'':' style="background:var('+token+')"';
    return '<div class="swatch"><div class="'+bgClass+'"'+bgStyle+'></div><div class="swatch-meta"><b>'+name+'</b>'+hex+'<br>'+token+'</div></div>';
  }).join('');
}

renderSwatches(document.getElementById('swatchGrid'));
```

> Keeps all 9 swatches, hex labels, and token names. Removes mixed inline/class chip markup.

### 2.2 Generate text-on-surfaces cards from data
Define a small data array and render the 4 cards.

**Replace** the static `.text-grid` contents (lines 192–216) with:

```html
<div class="text-grid" id="textGrid"></div>
```

**Add** a helper and call it:

```js
const TEXT_SAMPLES=[
  {name:'canvas',token:'--cba-bg-primary',mutedNote:true,showInverse:true},
  {name:'panel',token:'--cba-bg-secondary',muted:false},
  {name:'elevated',token:'--cba-bg-elevated',muted:false},
  {name:'inset',token:'--cba-bg-tertiary',mutedNote:true}
];

function renderTextSamples(host){
  host.innerHTML=TEXT_SAMPLES.map(s=>{
    const mutedRow=s.mutedNote
      ?'<div class="t-callout">--cba-text-muted restringido aquí (WCAG AA). Usar --cba-text-secondary.</div>'
      :'<div class="t-row t-muted">Muted text <span class="tok">--cba-text-muted</span></div>';
    const inverseRow=s.showInverse
      ?'<div class="t-row" style="margin-top:6px"><span class="t-inverse">Inverse on accent · --cba-text-inverse</span></div>'
      :'';
    return '<div class="text-sample text-sample--'+s.name+'"><h3>'+s.name+' · '+s.token+'</h3>'+
      '<div class="t-row t-primary">Primary text <span class="tok">--cba-text-primary</span></div>'+
      '<div class="t-row t-secondary">Secondary text <span class="tok">--cba-text-secondary</span></div>'+
      mutedRow+inverseRow+'</div>';
  }).join('');
}

renderTextSamples(document.getElementById('textGrid'));
```

> Preserves muted-restriction callouts and inverse sample exactly where spec §7.3 requires.

### 2.3 Remove dead CSS
**Change** line 121 from:

```css
.accent-row,.btn-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
```

To:

```css
.accent-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
```

> `.btn-row` has no matching markup after the overhaul.

### 2.4 Optionally adopt template literals in render helpers
The existing string concatenation is functional, but template literals make the helpers easier to scan. Example for `buildStateButtons`:

```js
function buildStateButtons(variant){
  return BUTTON_STATES.map(([label,cls])=>{
    const disabled=cls==='is-disabled'?'disabled':'';
    return `<button type="button" class="pv-btn pv-btn--${variant} ${cls}" ${disabled}>${label}</button>`;
  }).join('');
}
```

Apply the same style to `renderAccents`, `renderSwatches`, and `renderTextSamples` for consistency.

---

## 3. Out of scope

- Do **not** change the number of swatches (9), button variants (5), states (4), or surfaces (3).
- Do **not** change `src/theme/theme.scss` or the `build:preview` target.
- Do **not** manually edit the generated `docs/theme-preview.css`.
- Do **not** add mobile breakpoints or new sections.

---

## 4. Compliance notes

- `max-lines-per-file.md` does **not** apply to `docs/` files.
- New helpers stay ≤50 lines, ≤2 params, and ≤2 nesting depth.
- No new dependencies or npm scripts are required.
- No spec requirements are altered.

---

## 5. Verification after implementation

1. Open `docs/theme-preview.html` from disk.
2. Confirm 9 swatches, 60 buttons, and 4 text samples render identically.
3. Run `npm run build:preview` — no errors.
4. Run `npm run build` and `npm run lint` — still pass.
