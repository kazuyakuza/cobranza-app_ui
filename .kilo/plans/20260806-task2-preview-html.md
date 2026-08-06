# Implementation Plan — Task 2: Theme Preview HTML Overhaul

**TODO:** `.agent/todos/20260805/20260805-todo-1.md` (lines 1, 4, color list)
**Global Plan:** `.kilo/plans/20260806-theme-tokens-preview-guide.md`
**Front-end Spec:** `.kilo/plans/20260806-task2-preview-html-frontend-spec.md`
**Branch:** `feat/theme-refinement-tokens-preview-guide`
**Date:** 2026-08-06

---

## 0. Pre-Analysis & Technical Decisions

### 0.1 Current state (verified)
- `docs/theme-preview.html` (241 lines) **mirrors** the `--cba-*` tokens as inline custom properties named `--canvas`, `--panel`, `--elevated`, `--inset`, `--text`, `--text-2`, `--text-3`, `--border`, `--border-2`, `--accent`, `--success`, `--warning`, `--danger`, `--info`, `--shadow`, `--hover`, `--on-accent` inside a `.preview { ... }` block (lines 34–40). The JS `applyTheme()` then re-applies those same mirrored values as inline styles on the `.preview` element (lines 196–199, 219). This is the **drift source** the TODO complains about.
- `package.json` has **no** `build:preview` script and **no** direct `sass` dev dependency (verified: `node_modules/sass`, `node_modules/sass-embedded`, `node_modules/node-sass`, `node_modules/.bin/sass.cmd` all absent).
- `src/theme/theme.scss` imports `variables`, `base`, `modal`, `datepicker`, `popover`, `typeahead`, `accordion`, `mixins`, `utilities` — all pure SCSS using `var(--cba-*)`, **no external `@use` of bootstrap/ng-bootstrap/angular** (verified via grep). So a standalone `sass` CLI compile of `src/theme/theme.scss` will succeed with no `--load-path` / node_modules resolution needed.
- `src/theme/_base.scss` emits `:root { font-family... }` and `body { color: var(--cba-text-primary); background-color: transparent; }`. The preview's own dark-tool-chrome `body { background:#111; color:#eee }` must win — solved by placing the `<link>` to the compiled CSS **before** the inline `<style>` (equal specificity → later source wins).
- `src/theme/_utilities.scss` emits `.cba-bg-primary`, `.cba-bg-secondary`, `.cba-bg-tertiary`, `.cba-bg-elevated`, `.cba-text-*`, `.cba-border-*` classes — these will be available in the preview once the compiled CSS is linked, so swatch chips can use them directly.
- `src/components/button/cba-button.component.scss` defines the authoritative variant/state rules — mirrored exactly in the preview as `.pv-btn--*` classes (spec §6.4).
- Final token values (locked by Task 1, current `src/theme/_variables.scss`): canvas `#C5BFAE`, panel `#E6DDC6`, elevated `#FBF7ED`, inset `#D8C3A5`, text `#2B2620`, secondary `#4A4640`, muted `#625C55`, inverse `#FDFCF8`, border-subtle `#DAD7CA`, border-default `#A7A6A2`, border-strong `#8E8D8A`, accent-primary `#6B5B4F`, success `#3E6B4F`, warning `#E98074`, danger `#B93E36`, info `#56717E`, hover `rgba(43,38,32,.06)`, active `rgba(43,38,32,.10)`, focus-ring `0 0 0 3px rgba(232,90,79,.45)`.

### 0.2 Key decisions
1. **Compile `src/theme/theme.scss` → `docs/theme-preview.css`** via a new `build:preview` npm script using the `sass` package, pinned as a direct devDependency (it is NOT currently present, not even transitively).
2. **Link the compiled CSS** from `docs/theme-preview.html` with a relative `<link>` (works on `file://`). Tokens resolve from `:root` exactly as in the Shell — zero drift.
3. **Rewrite the inline `<style>`** to reference `var(--cba-*)` directly; **delete the mirrored `.preview` token block**. Preserve the dark controls-sidebar chrome (non-theme grays) unchanged except the one hard-coded theme color `#B93E36` in `.theme-btn.active` → `var(--cba-accent-danger)` (+ `color-mix` background) to satisfy "no hard-coded hex for theme colors".
4. **Remove JS token application**: `applyTheme()` no longer sets inline custom properties; tokens come from the linked stylesheet. The single-theme list/JS infrastructure is **kept** (spec §2) but reduced to informational display (source hex, role map, accent pills, raw strip) + active-button highlight.
5. **Add 3 new sections** inside `.extras`: Token Swatches (static HTML, 9 rows), Button States matrix (JS-generated: 5 variants × 4 states × 3 surfaces = 60 buttons), Text on Surfaces (static HTML, 4 surfaces with muted-restriction callouts on canvas/inset).
6. **Muted restriction**: `--cba-text-muted` is rendered only on panel/elevated samples; on canvas/inset a warning callout explains the restriction and `--cba-text-secondary` is shown instead (matches Consumer Guide).
7. **Accessibility**: add `aria-label` to the 4 icon-only module-header buttons; rely on `--cba-focus-ring` for `:focus-visible` (already global via compiled `_base.scss`, plus a local `.pv-btn:focus-visible` rule).
8. **File-length rules**: `docs/theme-preview.html` is in `docs/`, not `src/`, so `max-lines-per-file.md` (src-only) does **not** apply. `max-lines-per-method.md` and `max-arguments-per-method` (≤2) and `max-depth` (≤2) DO apply to the inline `<script>` — all new JS functions are kept ≤50 lines, ≤2 params, ≤2 nesting levels.
9. **Do NOT** modify `.gitignore` (spec §3.2 — generated CSS must be tracked). Current `.gitignore` does not exclude `docs/*.css`.
10. Token renames touch every theme-color reference; to make the implementer's edit deterministic, the full new `<style>` block is provided verbatim below.

### 0.3 Out of scope (do NOT do)
- Touch any token value in `src/theme/_variables.scss` (Task 1 lock).
- Add regression tests (Task 4).
- Modify real Angular components or `docs/CONSUMER_GUIDE.md` (Task 3).
- Add mobile breakpoints.

---

## 1. Affected Files

| File | Action |
|---|---|
| `package.json` | Edit: add `build:preview` script; add `sass` devDependency. |
| `docs/theme-preview.css` | **New generated file** (created by `npm run build:preview`, then committed). |
| `docs/theme-preview.html` | Overhaul: link CSS, replace inline `<style>`, rewrite body extras, rewrite `<script>`. |
| `.gitignore` | **No change.** |
| `src/theme/**` | **No change.** |

---

## Step 1 — Add `sass` devDependency and `build:preview` script

**File:** `package.json`

### 1.1 Add script
**Anchor:** the `scripts` block (lines 19–24).
**Old:**
```json
  "scripts": {
    "build": "ng-packagr -p ng-package.json -c tsconfig.lib.json",
    "test": "jest --passWithNoTests",
    "lint": "eslint \"src/**/*.ts\"",
    "format": "prettier --write \"src/**/*.{ts,scss,css,json,md}\""
  },
```
**New:**
```json
  "scripts": {
    "build": "ng-packagr -p ng-package.json -c tsconfig.lib.json",
    "build:preview": "sass src/theme/theme.scss docs/theme-preview.css --no-source-map --style=compressed",
    "test": "jest --passWithNoTests",
    "lint": "eslint \"src/**/*.ts\"",
    "format": "prettier --write \"src/**/*.{ts,scss,css,json,md}\""
  },
```

### 1.2 Add `sass` devDependency
**Anchor:** `devDependencies` block (lines 36–66). Insert alphabetically after `"rxjs": "^7.8.1",` (between `rxjs` and `tslib`) — `sass` sorts after `rxjs`.
**Old:**
```json
    "rxjs": "^7.8.1",
    "tslib": "^2.3.0",
```
**New:**
```json
    "rxjs": "^7.8.1",
    "sass": "^1.83.0",
    "tslib": "^2.3.0",
```
> Note: `^1.83.0` is compatible with the declared Node engines (`^22.22.3 || ^24.15.0 || >=26`). If `npm install` resolves a higher 1.x, that is acceptable.

### 1.3 Install
Run (single command, no chaining):
```
npm install
```
This installs `sass` and writes `package-lock.json`. Verify `sass` is now present; do NOT stage `node_modules/`.

### 1.4 Commit
```
git add package.json package-lock.json
git commit -m "chore(preview): add build:preview script and sass devDependency"
```

---

## Step 2 — Generate `docs/theme-preview.css`

Run the new script:
```
npm run build:preview
```
- Expected: creates `docs/theme-preview.css` (compressed, no source map) containing the `:root { --cba-*: ... }` block, `.cba-bg-*` / `.cba-text-*` / `.cba-border-*` / `.cba-radius-*` / `.cba-shadow-*` / `.cba-p-*` / `.cba-m-*` utilities, base typography, and the ng-bootstrap-scoped component rules (`_modal`, `_datepicker`, etc.).
- Verify the file exists and contains `--cba-bg-primary:#C5BFAE` (compressed form) and `.cba-bg-primary{background-color:var(--cba-bg-primary)}`.

> Do NOT commit yet — the HTML overhaul (Step 3) must reference it; commit together in Step 4.

---

## Step 3 — Overhaul `docs/theme-preview.html`

**File:** `docs/theme-preview.html` — near-total rewrite (preserve the two-column layout shell and dark controls sidebar).

### 3.1 Update header comment + add stylesheet link
**Old (lines 1–14):**
```html
<!DOCTYPE html>
<!--
  docs/theme-preview.html
  Single-theme preview for @cobranza-apps/ui — Minimal Yet Warm (refined 2026-08-06).
  Preview CSS custom properties mirror `--cba-*` tokens from src/theme/_variables.scss.
  Update both the `.preview` CSS block and the JS `themes` array when tokens change.
  Verify: canvas ≠ panel ≠ elevated ≠ inset; borders visible; coral only on accents.
-->
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Cobranza UI — Minimal Yet Warm preview</title>
  <style>
```
**New:**
```html
<!DOCTYPE html>
<!--
  docs/theme-preview.html
  Single-theme preview for @cobranza-apps/ui — Minimal Yet Warm (refined 2026-08-06).
  Theme tokens are linked from docs/theme-preview.css, compiled from src/theme/theme.scss
  via `npm run build:preview`. Do NOT mirror token values inline; regenerate the CSS after
  any token change. Verify: canvas ≠ panel ≠ elevated ≠ inset; borders visible; coral only
  on accents. See docs/CONSUMER_GUIDE.md for surface ownership rules demonstrated below.
-->
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Cobranza UI — Minimal Yet Warm preview</title>
  <link rel="stylesheet" href="theme-preview.css" />
  <style>
```
> The `<link>` is placed **before** the inline `<style>` so the inline dark-chrome `body` rule overrides the linked `_base.scss` `body` rule (equal specificity, later source wins).

### 3.2 Replace the entire inline `<style>` block (lines 15–85)
Replace the whole block from `<style>` through `</style>` with the verbatim new block below. Token references are all `var(--cba-*)`; the dark tool-chrome grays are preserved; the only hard-coded theme hex (`#B93E36`) in `.theme-btn.active` is replaced with `var(--cba-accent-danger)`.

**New `<style>` content:**
```html
    *{box-sizing:border-box}
    body{margin:0;font-family:Inter,system-ui,sans-serif;font-size:14px;line-height:1.45;background:#111;color:#eee}
    .app{display:grid;grid-template-columns:340px 1fr;min-height:100vh}
    .controls{background:#1a1a1a;border-right:1px solid #333;padding:12px 10px;overflow:auto;height:100vh;position:sticky;top:0}
    .controls h1{margin:0 0 2px;font-size:13px}
    .hint{font-size:11px;color:#9aa;margin:0 0 10px;line-height:1.35}
    .theme-list{display:flex;flex-direction:column;gap:4px}
    .theme-btn{text-align:left;border:1px solid #333;background:#222;border-radius:9px;padding:7px 9px;cursor:pointer;font:inherit;color:#ddd}
    .theme-btn:hover{border-color:#555}
    .theme-btn.active{border-color:var(--cba-accent-danger);background:color-mix(in srgb,var(--cba-accent-danger) 22%,#1a1a1a)}
    .t-name{font-weight:700;font-size:12px;display:block}
    .t-note{font-size:10.5px;color:#8a9099;display:block;margin-top:1px}
    .t-dots{display:flex;gap:3px;margin-top:6px;flex-wrap:wrap}
    .t-dots span{width:12px;height:12px;border-radius:3px;border:1px solid rgba(255,255,255,.15)}
    .src-hex{margin-top:12px;padding-top:10px;border-top:1px solid #333}
    .src-hex h2{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#888;margin:0 0 6px}
    .src-hex .row{display:flex;align-items:center;gap:7px;margin-bottom:4px;font-size:10.5px;color:#bbb;font-family:ui-monospace,monospace}
    .src-hex .row i{width:20px;height:12px;border-radius:3px;border:1px solid rgba(255,255,255,.12);display:block}
    .map{margin-top:8px;font-size:10.5px;color:#9ab;font-family:ui-monospace,monospace;line-height:1.5}

    /* Preview surface — tokens resolve from linked theme-preview.css (:root --cba-*) */
    .preview{display:flex;flex-direction:column;min-height:100vh;background:var(--cba-bg-primary);color:var(--cba-text-primary)}
    .preview-bar{padding:8px 14px;font-size:12px;color:var(--cba-text-muted);border-bottom:1px solid var(--cba-border-default);background:var(--cba-bg-elevated)}
    .preview-bar strong{color:var(--cba-text-secondary)}
    .shell-header{height:var(--cba-header-height);display:flex;align-items:center;gap:12px;padding:0 14px;background:var(--cba-bg-elevated);border-bottom:1px solid var(--cba-border-default)}
    .logo{width:28px;height:28px;border-radius:8px;background:var(--cba-bg-tertiary);border:1px solid var(--cba-border-strong)}
    .brand{font-weight:700}
    .spacer{flex:1}
    .search{display:flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;border:1px solid var(--cba-border-strong);background:var(--cba-bg-tertiary);color:var(--cba-text-secondary);font-size:12px;min-width:140px}
    .icon-btn{width:32px;height:32px;border-radius:999px;border:1px solid var(--cba-border-strong);background:var(--cba-bg-secondary);color:var(--cba-text-secondary);display:inline-flex;align-items:center;justify-content:center}
    .workspace{flex:1;padding:16px;overflow-y:auto}
    .module{max-width:900px;background:var(--cba-bg-secondary);border:1px solid var(--cba-border-default);border-radius:12px;box-shadow:var(--cba-shadow-module);overflow:hidden}
    .module-header{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;background:var(--cba-bg-elevated);border-bottom:1px solid var(--cba-border-default);min-height:42px}
    .status{color:var(--cba-accent-success);font-weight:700;width:18px;text-align:center}
    .module-title{flex:1;font-weight:700}
    .module-actions{display:flex;gap:4px}
    .module-actions button{width:28px;height:28px;border:none;border-radius:6px;background:transparent;color:var(--cba-text-secondary)}
    .module-actions button:hover{background:var(--cba-hover);color:var(--cba-text-primary)}
    .module-body{padding:14px}
    .panel-title-row{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px}
    .panel-title{font-weight:700;font-size:15px}
    .panel-meta{font-size:12px;color:var(--cba-text-muted);font-weight:600}
    table{width:100%;border-collapse:collapse;font-size:13.5px}
    thead th{text-align:left;padding:11px 12px;background:var(--cba-bg-tertiary);color:var(--cba-text-secondary);font-weight:700;border-bottom:1px solid var(--cba-border-default)}
    tbody td{padding:11px 12px;border-bottom:1px solid var(--cba-border-default);font-weight:500}
    tbody tr:hover td{background:var(--cba-hover)}
    tbody tr:last-child td{border-bottom:none}
    .module-footer{padding:9px 12px;background:var(--cba-bg-tertiary);border-top:1px solid var(--cba-border-default);font-size:12.5px;font-weight:700;color:var(--cba-accent-success)}
    .shell-footer{height:var(--cba-footer-height);display:flex;align-items:center;justify-content:center;gap:10px;border-top:1px solid var(--cba-border-default);background:var(--cba-bg-primary)}
    .section-pill{padding:8px 16px;border-radius:999px;border:1px solid var(--cba-border-strong);background:var(--cba-bg-secondary);color:var(--cba-text-secondary);font-size:13px;font-weight:700}
    .section-pill.active{border-color:var(--cba-accent-primary);color:var(--cba-text-primary)}

    /* Extras: swatches, button matrix, text-on-surfaces */
    .extras{max-width:900px;margin-top:14px}
    .extras h2{font-size:14px;margin:14px 0 6px}
    .extras h2:first-child{margin-top:0}

    /* Token swatches (spec §5) */
    .swatch-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px}
    .swatch{display:flex;align-items:center;gap:8px;padding:6px;border:1px solid var(--cba-border-default);border-radius:var(--cba-radius-md);background:var(--cba-bg-secondary)}
    .swatch-chip{width:48px;height:36px;border-radius:var(--cba-radius-sm);border:1px solid var(--cba-border-default);flex:0 0 auto}
    .swatch-meta{font-size:11px;line-height:1.3;font-family:ui-monospace,monospace}
    .swatch-meta b{display:block;font-family:Inter,system-ui,sans-serif;font-size:12px;font-weight:700}

    /* Button states matrix (spec §6) — mirrors src/components/button/cba-button.component.scss */
    .btn-matrix{display:flex;flex-direction:column;gap:12px}
    .btn-surface{padding:12px;border:1px solid var(--cba-border-default);border-radius:var(--cba-radius-md)}
    .btn-surface--panel{background:var(--cba-bg-secondary)}
    .btn-surface--elevated{background:var(--cba-bg-elevated)}
    .btn-surface--canvas{background:var(--cba-bg-primary)}
    .btn-surface h3{margin:0 0 8px;font-size:12px;font-weight:700;font-family:ui-monospace,monospace;color:var(--cba-text-secondary)}
    .btn-variant{display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap}
    .btn-variant__label{width:90px;flex:0 0 auto;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--cba-text-secondary)}
    .btn-states{display:flex;gap:6px;flex-wrap:wrap}
    .pv-btn{display:inline-flex;align-items:center;justify-content:center;padding:8px 14px;border-radius:var(--cba-radius-sm);border:1px solid transparent;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer}
    .pv-btn:focus-visible{outline:none;box-shadow:var(--cba-focus-ring)}
    .pv-btn--primary{background:var(--cba-accent-primary);color:var(--cba-text-inverse)}
    .pv-btn--secondary{background:var(--cba-bg-elevated);border-color:var(--cba-border-subtle);color:var(--cba-text-primary)}
    .pv-btn--ghost{background:transparent;color:var(--cba-text-primary)}
    .pv-btn--danger{background:var(--cba-accent-danger);color:var(--cba-text-inverse)}
    .pv-btn--success{background:var(--cba-accent-success);color:var(--cba-text-inverse)}
    .pv-btn--primary.is-hover,.pv-btn--secondary.is-hover,.pv-btn--danger.is-hover,.pv-btn--success.is-hover{background-image:linear-gradient(var(--cba-hover),var(--cba-hover))}
    .pv-btn--ghost.is-hover{background:var(--cba-hover)}
    .pv-btn--primary.is-active,.pv-btn--secondary.is-active,.pv-btn--danger.is-active,.pv-btn--success.is-active{background-image:linear-gradient(var(--cba-active),var(--cba-active))}
    .pv-btn--ghost.is-active{background:var(--cba-active)}
    .pv-btn.is-disabled,.pv-btn:disabled{cursor:not-allowed;opacity:.6}

    /* Text on surfaces (spec §7) */
    .text-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
    .text-sample{padding:12px;border:1px solid var(--cba-border-default);border-radius:var(--cba-radius-md)}
    .text-sample--canvas{background:var(--cba-bg-primary)}
    .text-sample--panel{background:var(--cba-bg-secondary)}
    .text-sample--elevated{background:var(--cba-bg-elevated)}
    .text-sample--inset{background:var(--cba-bg-tertiary)}
    .text-sample h3{margin:0 0 6px;font-size:12px;font-family:ui-monospace,monospace;color:var(--cba-text-secondary);font-weight:700}
    .t-row{font-size:12.5px;margin-bottom:4px}
    .t-row .tok{font-family:ui-monospace,monospace;font-size:10.5px;color:var(--cba-text-muted)}
    .t-primary{color:var(--cba-text-primary)}
    .t-secondary{color:var(--cba-text-secondary)}
    .t-muted{color:var(--cba-text-muted)}
    .t-inverse{color:var(--cba-text-inverse);background:var(--cba-accent-primary);padding:2px 6px;border-radius:var(--cba-radius-sm)}
    .t-callout{margin-top:6px;padding:6px 8px;border-radius:var(--cba-radius-sm);border:1px solid var(--cba-accent-warning);color:var(--cba-accent-warning);font-size:11px;font-weight:600}

    /* Preserved informational rows */
    .accent-row,.btn-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
    .accent-pill{padding:6px 12px;border-radius:999px;font-size:12px;font-weight:700;border:1px solid transparent}
    .raw-strip{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px;max-width:900px}
    .raw-strip .chip{width:48px;height:36px;border-radius:8px;border:1px solid rgba(0,0,0,.2);box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}
  </style>
```

### 3.3 Update the controls sidebar hint (lines 90–91)
The hint text references the old mirrored approach. Update wording only.
**Old:**
```html
      <h1>Minimal Yet Warm — Phase 9 preview</h1>
      <p class="hint">Minimal Yet Warm preview (refined 2026-08-06). Panel and elevated are now clearly separated; coral is reserved for accents.</p>
```
**New:**
```html
      <h1>Minimal Yet Warm — preview</h1>
      <p class="hint">Preview enlazado a docs/theme-preview.css (compilado de src/theme/theme.scss). Regenera con `npm run build:preview` tras cambiar tokens. Coral reservado a acentos.</p>
```

### 3.4 Add `aria-label`s to module-header icon buttons (lines 111–114)
**Old:**
```html
            <div class="module-actions">
              <button type="button">⌃</button><button type="button">⛶</button>
              <button type="button">✕</button><button type="button">⧉</button>
            </div>
```
**New:**
```html
            <div class="module-actions">
              <button type="button" aria-label="Expandir">⌃</button><button type="button" aria-label="Pantalla completa">⛶</button>
              <button type="button" aria-label="Cerrar">✕</button><button type="button" aria-label="Desacoplar">⧉</button>
            </div>
```

### 3.5 Replace the `.extras` body content (lines 133–148)
The old `.extras` contained a simple `.text-samples`, `.accent-row`, `.btn-row`, and `.raw-strip`. Replace the whole inner content of `.extras` with: the new swatch grid, the button-matrix mount point, the text-on-surfaces grid, then the preserved `accent-row` and `raw-strip` (kept for backward compatibility).

**Old (lines 133–148):**
```html
        <div class="extras">
          <div class="text-samples">
            <div class="p">Texto primary — debe leerse nítido</div>
            <div class="s">Texto secondary — labels / meta</div>
            <div class="m">Texto muted — hints</div>
          </div>
          <div class="accent-row" id="accentRow"></div>
          <div class="btn-row">
            <button class="btn btn-primary" type="button">Primario</button>
            <button class="btn btn-secondary" type="button">Secundario</button>
            <button class="btn btn-ghost" type="button">Ghost</button>
            <button class="btn btn-success" type="button">Éxito</button>
            <button class="btn btn-danger" type="button">Peligro</button>
          </div>
          <div class="raw-strip" id="rawStrip"></div>
        </div>
```
**New:**
```html
        <div class="extras">
          <h2>Token swatches</h2>
          <div class="swatch-grid">
            <div class="swatch"><div class="swatch-chip cba-bg-primary"></div><div class="swatch-meta"><b>canvas</b>#C5BFAE<br>--cba-bg-primary</div></div>
            <div class="swatch"><div class="swatch-chip cba-bg-secondary"></div><div class="swatch-meta"><b>panel</b>#E6DDC6<br>--cba-bg-secondary</div></div>
            <div class="swatch"><div class="swatch-chip cba-bg-elevated"></div><div class="swatch-meta"><b>elevated</b>#FBF7ED<br>--cba-bg-elevated</div></div>
            <div class="swatch"><div class="swatch-chip cba-bg-tertiary"></div><div class="swatch-meta"><b>inset</b>#D8C3A5<br>--cba-bg-tertiary</div></div>
            <div class="swatch"><div class="swatch-chip" style="background:var(--cba-text-primary)"></div><div class="swatch-meta"><b>text</b>#2B2620<br>--cba-text-primary</div></div>
            <div class="swatch"><div class="swatch-chip" style="background:var(--cba-border-default)"></div><div class="swatch-meta"><b>border</b>#A7A6A2<br>--cba-border-default</div></div>
            <div class="swatch"><div class="swatch-chip" style="background:var(--cba-accent-primary)"></div><div class="swatch-meta"><b>accent</b>#6B5B4F<br>--cba-accent-primary</div></div>
            <div class="swatch"><div class="swatch-chip" style="background:var(--cba-accent-warning)"></div><div class="swatch-meta"><b>warning</b>#E98074<br>--cba-accent-warning</div></div>
            <div class="swatch"><div class="swatch-chip" style="background:var(--cba-accent-danger)"></div><div class="swatch-meta"><b>danger</b>#B93E36<br>--cba-accent-danger</div></div>
          </div>

          <h2>Button states</h2>
          <div class="btn-matrix" id="buttonMatrix"></div>

          <h2>Text on surfaces</h2>
          <div class="text-grid">
            <div class="text-sample text-sample--canvas">
              <h3>canvas · --cba-bg-primary</h3>
              <div class="t-row t-primary">Primary text <span class="tok">--cba-text-primary</span></div>
              <div class="t-row t-secondary">Secondary text <span class="tok">--cba-text-secondary</span></div>
              <div class="t-callout">--cba-text-muted restringido aquí (WCAG AA). Usar --cba-text-secondary.</div>
              <div class="t-row" style="margin-top:6px"><span class="t-inverse">Inverse on accent · --cba-text-inverse</span></div>
            </div>
            <div class="text-sample text-sample--panel">
              <h3>panel · --cba-bg-secondary</h3>
              <div class="t-row t-primary">Primary text <span class="tok">--cba-text-primary</span></div>
              <div class="t-row t-secondary">Secondary text <span class="tok">--cba-text-secondary</span></div>
              <div class="t-row t-muted">Muted text <span class="tok">--cba-text-muted</span></div>
            </div>
            <div class="text-sample text-sample--elevated">
              <h3>elevated · --cba-bg-elevated</h3>
              <div class="t-row t-primary">Primary text <span class="tok">--cba-text-primary</span></div>
              <div class="t-row t-secondary">Secondary text <span class="tok">--cba-text-secondary</span></div>
              <div class="t-row t-muted">Muted text <span class="tok">--cba-text-muted</span></div>
            </div>
            <div class="text-sample text-sample--inset">
              <h3>inset · --cba-bg-tertiary</h3>
              <div class="t-row t-primary">Primary text <span class="tok">--cba-text-primary</span></div>
              <div class="t-row t-secondary">Secondary text <span class="tok">--cba-text-secondary</span></div>
              <div class="t-callout">--cba-text-muted restringido aquí (WCAG AA). Usar --cba-text-secondary.</div>
            </div>
          </div>

          <h2>Accent pills</h2>
          <div class="accent-row" id="accentRow"></div>
          <div class="raw-strip" id="rawStrip"></div>
        </div>
```
> Hex values appear **only as text labels** (informational, required by spec §5.3) and as inline `var(--cba-*)` backgrounds — never as hard-coded CSS colors. The `.text-samples` and `.btn-row` simple demos are superseded by the structured `Text on surfaces` and `Button states` sections (spec §6/§7 mandate these).

### 3.6 Rewrite the `<script>` block (lines 158–239)
Replace the entire `<script>...</script>` with the new script. Key changes: tokens no longer applied as inline custom properties; single `theme` object (data only); `TOKEN_ROLES` carries the hex for display; button matrix generated by `buildButtonMatrix()`; all functions ≤2 params / ≤50 lines / depth ≤2.

**New `<script>` content:**
```html
<script>
const theme={
  id:'mw',
  group:'Extra',
  name:'Minimal Yet Warm',
  note:'Canvas arena + panel crema, coral reservado a acentos',
  source:['#C5BFAE','#D8C3A5','#8E8D8A','#E98074','#B93E36']
};

const TOKEN_ROLES=[
  ['canvas','--cba-bg-primary','#C5BFAE'],
  ['panel','--cba-bg-secondary','#E6DDC6'],
  ['elevated','--cba-bg-elevated','#FBF7ED'],
  ['inset','--cba-bg-tertiary','#D8C3A5'],
  ['text','--cba-text-primary','#2B2620'],
  ['border','--cba-border-default','#A7A6A2'],
  ['accent','--cba-accent-primary','#6B5B4F'],
  ['warning','--cba-accent-warning','#E98074'],
  ['danger','--cba-accent-danger','#B93E36']
];

const ACCENTS=[
  ['Primary','--cba-accent-primary'],
  ['Success','--cba-accent-success'],
  ['Warning','--cba-accent-warning'],
  ['Danger','--cba-accent-danger'],
  ['Info','--cba-accent-info']
];

const BUTTON_VARIANTS=['primary','secondary','ghost','danger','success'];
const BUTTON_STATES=[['Normal',''],['Hover','is-hover'],['Active','is-active'],['Disabled','is-disabled']];
const BUTTON_SURFACES=[
  ['Panel','btn-surface--panel','--cba-bg-secondary'],
  ['Elevated','btn-surface--elevated','--cba-bg-elevated'],
  ['Canvas','btn-surface--canvas','--cba-bg-primary']
];

function renderSourceHex(sourceColors, host){
  host.innerHTML=sourceColors.map(h=>'<div class="row"><i style="background:'+h+'"></i>'+h+'</div>').join('');
}

function renderRoleMap(host){
  host.innerHTML=TOKEN_ROLES.map(r=>r[0].padEnd(9)+' '+r[2].padEnd(7)+' ('+r[1]+')').join('<br>');
}

function renderAccents(host){
  host.innerHTML=ACCENTS.map(a=>{
    const color='var('+a[1]+')';
    return '<span class="accent-pill" style="color:'+color+';border-color:'+color+';background:color-mix(in srgb,'+color+' 18%,transparent)">'+a[0]+'</span>';
  }).join('');
}

function renderRawStrip(sourceColors, host){
  host.innerHTML=sourceColors.map(h=>'<div class="chip" style="background:'+h+'" title="'+h+'"></div>').join('');
}

function setActiveButton(id){
  document.querySelectorAll('.theme-btn').forEach(b=>b.classList.toggle('active',b.dataset.id===id));
}

function selectTheme(themeData){
  setActiveButton(themeData.id);
  document.getElementById('activeName').textContent=themeData.name;
  renderSourceHex(themeData.source, document.getElementById('srcHex'));
  renderRoleMap(document.getElementById('roleMap'));
  renderAccents(document.getElementById('accentRow'));
  renderRawStrip(themeData.source, document.getElementById('rawStrip'));
}

function buildStateButtons(variant){
  return BUTTON_STATES.map(state=>{
    const isDisabled=state[1]==='is-disabled';
    const disabledAttr=isDisabled?'disabled':'';
    return '<button type="button" class="pv-btn pv-btn--'+variant+' '+state[1]+'" '+disabledAttr+'>'+state[0]+'</button>';
  }).join('');
}

function buildButtonMatrix(host){
  const surfaces=BUTTON_SURFACES.map(surface=>{
    const variants=BUTTON_VARIANTS.map(variant=>{
      const states=buildStateButtons(variant);
      return '<div class="btn-variant"><span class="btn-variant__label">'+variant+'</span><div class="btn-states">'+states+'</div></div>';
    }).join('');
    return '<div class="btn-surface '+surface[1]+'"><h3>'+surface[0]+' · '+surface[2]+'</h3>'+variants+'</div>';
  }).join('');
  host.innerHTML=surfaces;
}

const themeList=document.getElementById('themeList');
const themeButton=document.createElement('button');
themeButton.type='button';
themeButton.className='theme-btn active';
themeButton.dataset.id=theme.id;
themeButton.innerHTML='<span class="t-name">'+theme.name+'</span><span class="t-note">'+theme.note+'</span><span class="t-dots">'+theme.source.map(c=>'<span style="background:'+c+'"></span>').join('')+'</span>';
themeButton.addEventListener('click',()=>selectTheme(theme));
themeList.appendChild(themeButton);

selectTheme(theme);
buildButtonMatrix(document.getElementById('buttonMatrix'));
</script>
</body>
</html>
```
> The `<script>` no longer sets `--canvas`/`--panel` etc. on `.preview`; tokens come solely from the linked `docs/theme-preview.css`. All functions take ≤2 params and are ≤50 lines; block-nesting depth stays ≤2 (arrow expressions returning template strings do not add block depth).

### 3.7 Preserve unchanged body regions
The following are **untouched**: `<aside class="controls">` structure (themeList + srcHex containers, lines 89–98), the `.preview-bar`, `.shell-header`, `.workspace` `.module` shell (header/body/table/footer), and the `.shell-footer` pills block. Only the parts listed in 3.1–3.6 change.

### 3.8 Regenerate the compiled CSS after the HTML edit
No theme source changed, so `docs/theme-preview.css` from Step 2 is still valid. Re-run once to be safe (idempotent):
```
npm run build:preview
```

---

## Step 4 — Commit the preview overhaul
First check that `node_modules/` is NOT staged (Gitignore Compliance Rule):
```
git status
```
Expected staged: `docs/theme-preview.html`, `docs/theme-preview.css`. (If `node_modules/` appears, unstage it.)
```
git add docs/theme-preview.html docs/theme-preview.css
git commit -m "feat(preview): link compiled theme CSS, add swatches, button matrix, text-on-surfaces"
```

---

## Step 5 — Verification

Run each command separately (no chaining):

### 5.1 Build preview regenerates the CSS
```
npm run build:preview
```
Expected: exit 0, `docs/theme-preview.css` rewritten, contains `--cba-bg-primary:#C5BFAE` and `.cba-bg-primary{background-color:var(--cba-bg-primary)}` (compressed). `git status` should show `docs/theme-preview.css` clean (identical) unless tokens changed.

### 5.2 Library build still passes
```
npm run build
```
Expected: exit 0 (`ng-packagr` builds `dist/`). The new `sass` devDependency and `build:preview` script do not affect `ng-packagr`.

### 5.3 Lint still passes
```
npm run lint
```
Expected: exit 0. No `src/**/*.ts` changed, so lint is unaffected. (If lint flags anything, it is pre-existing and out of scope.)

### 5.4 Test suite still passes (sanity)
```
npm test
```
Expected: pass. No `src/` test changed.

### 5.5 Visual check (manual, desktop browser)
Open `docs/theme-preview.html` directly from disk (`file://` protocol). Confirm against **front-end spec §10 acceptance criteria**:
- [ ] No 404s in DevTools Network (only `theme-preview.css` requested, resolves).
- [ ] `:root` computed on `html` shows `--cba-bg-primary: #C5BFAE` etc. (DevTools → Elements → `<html>` computed).
- [ ] No hard-coded hex for theme colors: search the inline `<style>` for `var(--cba-` — every theme color reference uses a token. The only hex literals in CSS are the dark tool-chrome grays (`#111`, `#1a1a1a`, `#222`, `#333`, `#9aa`, `#8a9099`, `#888`, `#bbb`, `#8a9099`, `#9ab`, `#555`, `#666`) which are NOT `--cba-*` tokens and are preserved preview-tool chrome.
- [ ] Surface ownership visible: workspace = canvas (sandy), module card = panel (cream) with border + shadow, module-header = elevated (lightest), table header / module-footer = inset (darker sand).
- [ ] Token swatches: 9 chips render with correct colors; chips for canvas/panel/elevated/inset use `.cba-bg-*` classes; chips for text/border/accent/warning/danger use inline `var(--cba-*)`; each row shows semantic name, hex, and token name.
- [ ] Button matrix: 3 surface blocks (Panel/Elevated/Canvas), each with 5 variant rows (primary/secondary/ghost/danger/success), each row with 4 buttons (Normal/Hover/Active/Disabled). Verify secondary buttons are distinguishable from their panel/elevated/canvas background and that `.is-active` ≠ Normal (the original user complaint about elevated).
- [ ] Text-on-surfaces: 4 samples; muted appears only on panel/elevated; canvas/inset show the warning callout (coral border) and `--cba-text-secondary` instead of muted; an inverse-on-accent chip appears on the canvas sample.
- [ ] Two-column layout preserved; left controls sticky + independently scrollable; right preview column scrolls independently (`.workspace { overflow-y:auto }` already present, ensure tall extras content scrolls).
- [ ] Keyboard: Tab through module-header icon buttons and matrix buttons — visible coral focus ring (`--cba-focus-ring`).
- [ ] `aria-label` present on the 4 module-header icon buttons.

---

## Step 6 — Acceptance criteria traceability (front-end spec §10)

| Spec criterion | Satisfied by |
|---|---|
| Links `docs/theme-preview.css` from `theme.scss` | 3.1 `<link>`, Step 2 `build:preview` |
| Opens from `file://` with no 404s | relative `<link href="theme-preview.css">`; CSS committed |
| Only `--cba-*` tokens, no hard-coded theme hex | 3.2 `<style>`; only `.theme-btn.active` coral via `var(--cba-accent-danger)` |
| Surface ownership demo | 3.2 layout rules map to spec §4 table |
| 9 swatches with hex + token | 3.5 swatch grid (9 rows) |
| 5 variants × 4 states × 3 surfaces | 3.5 `#buttonMatrix` + 3.6 `buildButtonMatrix` |
| Text-on-surfaces + muted restriction callout | 3.5 text samples (canvas/inset callouts) |
| Two-column layout preserved | 3.2 unchanged `.app` grid + `.workspace` overflow |
| `npm run build:preview` regenerates CSS | Step 5.1 |
| `npm run build` + `npm run lint` pass | Step 5.2, 5.3 |

---

## 7. Risks & Mitigations
- **`sass` version pin**: if `^1.83.0` fails to resolve on the CI Node, bump to the newest `1.x`. The CLI flags `--no-source-map --style=compressed` are supported on all `1.x`.
- **`_base.scss` body override**: link is placed before inline `<style>`; verified inline `body` rule wins (equal specificity, later source). If a future `_base.scss` raises specificity, add an explicit `body.app-host` guard — out of scope here.
- **`color-mix` support**: used in `.theme-btn.active` and accent pills; supported in all current evergreen browsers. Acceptable for a desktop preview tool.
- **Compiled CSS size**: `theme.scss` pulls `_modal`/`_datepicker`/`_popover`/`_typeahead`/`_accordion` scoped rules into the preview CSS; these are harmless (scoped selectors with no matching DOM) and make the preview a faithful subset of the real bundle. Acceptable.

---

## 8. Out of scope reminders
- Do NOT edit `src/theme/_variables.scss` (Task 1 lock).
- Do NOT add regression tests (Task 4).
- Do NOT modify `docs/CONSUMER_GUIDE.md` or real Angular components (Task 3).
- Do NOT update `.gitignore` (generated CSS must be tracked).

---

## 9. Deliverable
Implementation of Steps 1–4 produces a committed, working `docs/theme-preview.html` linked to a committed `docs/theme-preview.css`, with `build:preview` available. Steps 5 verifies. No code outside `docs/` and `package.json` is changed.