# Task B — `theme-preview.html` overhaul — Implementation Plan

**Date:** 2026-08-12
**Branch:** `feat/project-audit-and-fixes`
**Target file:** `docs/theme-preview.html` (1016 lines, single static HTML file)
**Frontend spec:** `.kilo/plans/20260812-task-b-frontend-spec.md`
**Global plan:** `.kilo/plans/20260812-project-audit-and-fixes.md` (Tasks 5 & 6)
**Scope:** Adds reproduction captions under every top-level `<h2>`, the missing button focus/loading/size states, the Radius & Shadow showcase, the `<h2>Module examples</h2>` heading, an accessible `.search` input, fixes the WCAG-AA contrast failure on `.t-callout`, moves fake component table styles to a preview-only selector, and uses the `--cba-font-size-body` token for `body`.

> **NOTE on a spec deviation already flagged by the frontend spec (§3.1):** the global plan inaccurately writes `<cba-form-field>`; the real selector is `<cba-field>`. Captions in this plan use the real `<cba-field>` selector (spec acceptance criterion #3).

> **NOTE on test impact:** `src/theme/preview-html.spec.ts` line 138–142 currently asserts `.t-callout` uses `color:var(--cba-text-inverse)`. The WCAG-AA fix changes this to `color:var(--cba-text-primary)`, so that test assertion MUST be updated in the same implementation step (or the test will fail). This is a known, intentional spec change. No other preview test asserts on the lines being modified.

---

## High-level approach

The implementation touches one source HTML file (`docs/theme-preview.html`), one spec file (`src/theme/preview-html.spec.ts`) for the contrast assertion, the existing `0.15.0` block in `CHANGELOG.md`, and a small addition to `docs/CONSUMER_GUIDE.md`. Because the preview's CSS lives inline in the `<style>` block (lines 86–474) and the markup in the `<body>` (lines 476–578) plus the data-driven script (lines 590–1014), every change is local to those regions. The plan groups changes by region to keep edits reviewable and to minimize risk:

1. **Inline `<style>` block edits** (CSS additions / fixes / renames / exemption comment).
2. **`<body>` markup edits** (search input, new `<h2>Module examples</h2>`, per-section captions, extra button states, Radius & Shadow section).
3. **`<script>` block edits** (none of the data arrays need new entries, but `BUTTON_STATES`/`BUTTON_VARIANTS` are reviewed and reused; the static extra-state HTML is inserted directly after `#buttonMatrix`).
4. **Spec test update** (preview-html.spec.ts `.t-callout` assertion).
5. **Build & verify** (`npm run build:preview`, `npm test -- src/theme/preview-html.spec.ts`, manual browser open).
6. **Docs sync** (CHANGELOG `0.15.0` block append, CONSUMER_GUIDE reference).
7. **Git commit** of all changes on the feature branch.

All steps are ordered so that inline CSS is added before the markup that references it (avoids transient broken rendering when regenerating the preview).

---

## Step 0 — Pre-flight checks (no edits)

0.1 Run `git status` and confirm clean working tree on `feat/project-audit-and-fixes`.
0.2 Confirm `docs/theme-preview.html` line count is 1016 and the anchor lines below match; if the file was modified upstream, re-locate each anchor by string match (the strings are unique enough).

Anchor strings (all unique in the file):

| Anchor | Line | Used for |
|--------|------|----------|
| `body{margin:0;...font-size:14px;line-height:1.45;background:#111;color:#eee}` | 88 | body font-size token swap |
| `.app{display:grid;grid-template-columns:340px 1fr;...}` | 89 | exemption comment insertion point (just before) |
| `.extras h2{font-size:14px;margin:14px 0 6px}` | 153 | `.section-caption` CSS insertion point (near) |
| `.t-callout{margin-top:6px;...background:var(--cba-accent-warning);color:var(--cba-text-inverse);...}` | 202 | WCAG fix |
| `.cba-module-container__body table{...}` | 141 | fake component table rename |
| `<div class="search"><i class="fa-solid fa-magnifying-glass"...>&nbsp;Ctrl + K</div>` | 502 | search input a11y fix |
| `<div id="moduleHost"></div>` | 508 | insert `<h2>Module examples</h2>` + caption before |
| `<h2>Token swatches</h2>` | 516 | caption after |
| `<h2>Button states</h2>` + `<div class="btn-matrix" id="buttonMatrix"></div>` | 525–526 | caption after + extra-state block after |
| `<h2>Labels &amp; pills</h2>` | 529 | caption after |
| `<h2>Icons</h2>` | 533 | caption after |
| `<h2>Text on surfaces</h2>` | 544 | caption after |
| `<h2>Accent pills</h2>` | 547 | caption after |
| `<h2>Typography scale</h2>` | 552 | caption after |
| `<h2>Border scale</h2>` | 556 | caption after |
| `<h2>Selected states</h2>` | 560 | caption after |
| `<h2>Form states</h2>` | 564 | caption after |
| `<h2>Semantic status</h2>` + `<div class="status-row" id="statusBadges"></div>` | 568–569 | caption after + insert "Radius & Shadow" section after `</div>` of `#statusBadges` |
| `<header class="shell-header">` ... `<footer class="shell-footer">` | 500–577 | Shell mockup caption (insert once near shell header) |

---

## Step 1 — Inline `<style>` block edits

> Order matters: insert the new CSS rules FIRST, then apply fixes/rename, so the markup added in Step 2 always has matching CSS available.

### 1.1 Add `.section-caption` rule

**Action:** Insert a new CSS rule immediately after the `.extras h2:first-child{margin-top:0}` line (line 154).

**Exact insertion (new block, preserve single-line compressed style of the file):**

```css
.section-caption{color:var(--cba-text-secondary);font-size:var(--cba-font-size-caption);font-style:italic;line-height:var(--cba-line-height-caption);margin:0 0 var(--cba-space-2) 0}
```

**Verification:** search the file for `.section-caption{color:var(--cba-text-secondary)` — exactly one match.

### 1.2 Add button extra-state CSS (`is-focus`, `is-loading`, `--sm`, `--md`)

**Action:** Append after the existing `.pv-btn.is-disabled,.pv-btn:disabled{cursor:not-allowed;opacity:.6}` rule (line 186). Keep the existing `:focus-visible` rule at line 174 untouched.

**Exact insertion:**

```css
.pv-btn.is-focus,.pv-btn:focus-visible{outline:none;box-shadow:var(--cba-focus-ring)}
.pv-btn.is-loading{cursor:not-allowed;opacity:.6}
.pv-btn--sm{padding:var(--cba-space-1) var(--cba-space-3);font-size:var(--cba-font-size-small)}
.pv-btn--md{padding:var(--cba-space-2) var(--cba-space-4);font-size:var(--cba-font-size-body)}
```

> The existing `.pv-btn:focus-visible` rule (line 174) already provides the focus ring for native keyboard focus; the new `.pv-btn.is-focus` is the static showcase equivalent used in the extra-state markup. Spec §4.1 allows combining the selectors.

**Verification:** search for `.pv-btn--sm{padding:var(--cba-space-1)` — exactly one match.

### 1.3 Add Radius & Shadow CSS

**Action:** Append after the new `.section-caption` rule (or, equivalently, anywhere inside the `.extras` group of CSS — recommended location: immediately after the `.extras h2:first-child{...}` follow-up block, before the `.swatch-grid` line 157). Place the new rules right after the `.section-caption` rule to keep the additions grouped.

**Exact insertion:**

```css
.radius-shadow-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:var(--cba-space-3)}
.radius-shadow-card{display:flex;align-items:center;justify-content:center;height:80px;background:var(--cba-bg-secondary);border:1px solid var(--cba-border-default);color:var(--cba-text-secondary);font-size:var(--cba-font-size-small);font-weight:600;text-align:center}
```

### 1.4 Fix `.t-callout` WCAG contrast (spec §5)

**Action:** Replace the single existing `.t-callout{...}` rule on line 202.

**Old (must match exactly):**

```css
.t-callout{margin-top:6px;padding:6px 8px;border-radius:var(--cba-radius-sm);border:1px solid transparent;background:var(--cba-accent-warning);color:var(--cba-text-inverse);font-size:11px;font-weight:600}
```

**New:**

```css
.t-callout{margin-top:var(--cba-space-2);padding:var(--cba-space-2) var(--cba-space-3);border-radius:var(--cba-radius-sm);border:1px solid var(--cba-border-strong);background-color:var(--cba-accent-warning);color:var(--cba-text-primary);font-size:var(--cba-font-size-caption);font-weight:600}
```

> Note: spec §5 expects ~5.6:1 contrast (`#E98074` background with `#2B2620` text), passing WCAG AA (≥4.5:1).

**Test impact:** `src/theme/preview-html.spec.ts` lines 138–142 currently assert `color:var(--cba-text-inverse)` in the `.t-callout` rule. That assertion will break and MUST be updated in Step 4 below.

### 1.5 Rename fake component table selectors to a preview-only class (spec §7.4)

**Action:** Replace the block on lines 141–145. There are 5 selectors sharing the `.cba-module-container__body` prefix. Rename all of them to `.preview-module-table` and prefix the block with the preview-only comment.

**Old (lines 141–145, must match exactly):**

```css
    .cba-module-container__body table{width:100%;border-collapse:collapse;font-size:var(--cba-font-size-small)}
    .cba-module-container__body thead th{text-align:left;padding:var(--cba-space-3);background:var(--cba-bg-tertiary);color:var(--cba-text-secondary);font-weight:700;border-bottom:1px solid var(--cba-border-default)}
    .cba-module-container__body tbody td{padding:var(--cba-space-3);border-bottom:1px solid var(--cba-border-default);font-weight:500;color:var(--cba-text-primary)}
    .cba-module-container__body tbody tr:hover td{background:var(--cba-hover)}
    .cba-module-container__body tbody tr:last-child td{border-bottom:none}
```

**New (prefix the comment on its own line, then the renamed block):**

```css
    /* Preview-only table chrome; not exported by the library. */
    .preview-module-table{width:100%;border-collapse:collapse;font-size:var(--cba-font-size-small)}
    .preview-module-table thead th{text-align:left;padding:var(--cba-space-3);background:var(--cba-bg-tertiary);color:var(--cba-text-secondary);font-weight:700;border-bottom:1px solid var(--cba-border-default)}
    .preview-module-table tbody td{padding:var(--cba-space-3);border-bottom:1px solid var(--cba-border-default);font-weight:500;color:var(--cba-text-primary)}
    .preview-module-table tbody tr:hover td{background:var(--cba-hover)}
    .preview-module-table tbody tr:last-child td{border-bottom:none}
```

> This change requires the `<table>` rendered by `buildModuleBody(cfg)` in the `<script>` block (Step 3.2) to add the `preview-module-table` class.

### 1.6 Swap `body` `font-size: 14px` → token (spec §8.1)

**Action:** Replace line 88.

**Old (must match exactly):**

```css
    body{margin:0;font-family:Inter,system-ui,sans-serif;font-size:14px;line-height:1.45;background:#111;color:#eee}
```

**New:**

```css
    body{margin:0;font-family:Inter,system-ui,sans-serif;font-size:var(--cba-font-size-body);line-height:1.45;background:#111;color:#eee}
```

> `--cba-font-size-body` resolves to `0.875rem` (= 14px at 16px root). Sidebar chrome font-sizes (`12px`, `13px`, etc.) remain hard-coded px per the exemption (Step 1.7).

**Verification:** search the file for `font-size:14px` — expected zero matches.

### 1.7 Add dev-tool chrome exemption comment (spec §8.2)

**Action:** Insert a multi-line CSS comment immediately before the `.app{...}` rule (line 89). Keep the surrounding single-line CSS rule formatting intact; the comment is a multi-line block.

**Exact insertion (place before line 89):**

```css
    /*
      DEV-TOOL / PREVIEW CHROME EXEMPTION:
      The rules below describe the dark sidebar, shell mockup, and preview controls.
      They are intentionally preview-only and use hard-coded px values for a stable
      dev-tool UI. They are NOT part of the published library theme and do not need
      to use --cba-* tokens.
    */
```

> The exemption applies to lines 89–117 (`.app`, `.controls`, sidebar chrome, etc.) and the `.shell-*` rules further down. It does NOT apply to `.section-caption`, `.pv-btn--*`, `.t-callout`, `.radius-shadow-card`, or other preview-content rules that already use tokens.

**Verification:** open the file and confirm the comment block sits directly above the `.app{display:grid;...}` line.

---

## Step 2 — `<body>` markup edits

### 2.1 Replace `.search` div with a disabled accessible `<input>` (spec §7.1)

**Action:** Replace line 502.

**Old (must match exactly):**

```html
        <div class="search"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>&nbsp;Ctrl + K</div>
```

**New:**

```html
        <input type="search" class="search" value="Ctrl + K" disabled aria-label="Buscar (solo vista previa)" />
```

> The existing `.search` CSS (line 127) still applies because the class is preserved; `display:flex;align-items:center;gap:8px` on an `<input>` is harmless (the magnifying-glass icon is removed since it cannot live inside a void `<input>`). The `disabled` attribute makes it a non-editable pill that remains keyboard-focusable and screen-reader-announced via `aria-label`. The `appearance: none` reset is optional; the existing `border-radius:999px` and `background:var(--cba-bg-tertiary)` already produce the pill look.

**Verification:** search the file for `<div class="search">` — expected zero matches. Search for `aria-label="Buscar (solo vista previa)"` — expected one match.

### 2.2 Insert `<h2>Module examples</h2>` + caption before `#moduleHost` (spec §7.2)

**Action:** Insert two new lines immediately before line 508 (`<div id="moduleHost"></div>`). The new heading must come AFTER the `<main class="workspace">` opening tag (line 506) and BEFORE `#moduleHost`. Place it directly before the existing comment `<!-- 7 module examples rendered by renderModuleExamples()... -->` (line 507) or after that comment — preferred: after the comment, so the comment stays attached to the `#moduleHost` element.

**Exact insertion (place between the existing inline comment on line 507 and `<div id="moduleHost"></div>` on line 508):**

```html
          <h2>Module examples</h2>
          <p class="section-caption">
            Real library components: <code>&lt;cba-module-container&gt;</code>, <code>&lt;cba-module-header&gt;</code>,
            <code>&lt;cba-module-footer&gt;</code>. Exported classes: <code>.cba-module-container--size-100</code>,
            <code>.cba-module-header__action</code>, <code>.cba-module-footer__status--*</code>.
            Preview-only helpers (<code>.panel-meta</code>, <code>.panel-title-row</code>) are not exported.
            See <code>docs/CBA_MODULE_CONTAINER.md</code>, <code>docs/CBA_MODULE_HEADER.md</code>, <code>docs/CBA_MODULE_FOOTER.md</code>.
          </p>
```

> Uses the verbatim caption text from spec §3 (row "Module examples"). The extra "Exported classes" and "See ..." sentences match the spec caption. Multi-line HTML is fine — the preview's HTML is already indented per block.

**Verification:** open the file and confirm `<h2>Module examples</h2>` appears exactly once, immediately preceding `#moduleHost`.

### 2.3 Insert `<h2>Shell mockup</h2>` + caption above the shell mockup

**Action:** The shell mockup section (header + footer) currently has no `<h2>` heading. Per spec §3 the shell mockup is one of the reproducible sections needing a caption. Insert the new heading + caption immediately BEFORE `<header class="shell-header">` (line 500), still inside `<div class="preview" id="preview">` (after `<div class="preview-bar">...</div>` on line 499).

**Exact insertion:**

```html
        <h2>Shell mockup</h2>
        <p class="section-caption">
          Application shell — NOT a library component. Library exports <code>&lt;cba-module-container&gt;</code>,
          <code>&lt;cba-module-header&gt;</code>, <code>&lt;cba-module-footer&gt;</code> only.
        </p>
```

> Acceptance criterion #9 requires heading hierarchy to have no skipped levels in the preview panel. Adding `<h2>Shell mockup</h2>` here makes the Shell mockup a level-2 peer of the other showcase sections.

**Verification:** search for `<h2>Shell mockup</h2>` — expected one match.

### 2.4 Insert per-section captions under the existing 11 `<h2>` headings (spec §3 mapping)

For each of the following `<h2>` headings, insert a `<p class="section-caption">...</p>` block immediately AFTER the heading line and BEFORE the section's content `<div>`. Use the verbatim caption text from spec §3.

#### 2.4.1 Token swatches (after line 516 `<h2>Token swatches</h2>`)

**Caption (verbatim from spec §3, row "Token swatches"):**

```html
          <p class="section-caption">
            Direct <code>--cba-*</code> tokens and <code>.cba-bg-*</code> utility classes. No component equivalent;
            consume via <code>var(--cba-bg-primary)</code> or <code>.cba-bg-primary</code>. See <code>docs/THEME.md</code>.
          </p>
```

#### 2.4.2 Button states (after line 525 `<h2>Button states</h2>`)

```html
          <p class="section-caption">
            DEMO CSS ONLY. Reproduction: <code>&lt;cba-button variant="primary" size="md"&gt;Primary&lt;/cba-button&gt;</code>.
            Focus, loading and sizes are also component inputs. See <code>docs/CBA_BUTTON.md</code>.
          </p>
```

#### 2.4.3 Labels & pills (after line 529 `<h2>Labels &amp; pills</h2>`)

```html
          <p class="section-caption">
            Labels: use <code>.cba-text-caption</code> / <code>.cba-text-small</code> / <code>.cba-text-body</code>.
            Pills: no library component; apply <code>--cba-selected-*</code> tokens directly.
          </p>
```

#### 2.4.4 Icons (after line 533 `<h2>Icons</h2>`)

```html
          <p class="section-caption">
            Icons come from Font Awesome. Use <code>&lt;fa-icon [icon]="..."&gt;</code> or plain <code>&lt;i class="fa-solid fa-..."&gt;</code>.
            See <code>docs/INDEX.md</code> for the icon list.
          </p>
```

#### 2.4.5 Text on surfaces (after line 543 `<h2>Text on surfaces</h2>`)

```html
          <p class="section-caption">
            Use <code>.cba-text-primary</code>, <code>.cba-text-secondary</code>, <code>.cba-text-muted</code> and
            <code>.cba-text-inverse</code> utilities. <code>--cba-text-muted</code> is restricted on canvas and inset sand.
          </p>
```

#### 2.4.6 Accent pills (after line 547 `<h2>Accent pills</h2>`)

```html
          <p class="section-caption">
            Reproduction: <code>&lt;cba-badge appearance="solid" variant="success"&gt;success&lt;/cba-badge&gt;</code>.
            See <code>docs/CBA_BADGE.md</code>.
          </p>
```

#### 2.4.7 Typography scale (after line 552 `<h2>Typography scale</h2>`)

```html
          <p class="section-caption">
            Use <code>.cba-text-display</code> / <code>.cba-text-heading-lg</code> / <code>.cba-text-heading-md</code> /
            <code>.cba-text-body</code> / <code>.cba-text-small</code> / <code>.cba-text-caption</code> utilities.
          </p>
```

#### 2.4.8 Border scale (after line 556 `<h2>Border scale</h2>`)

```html
          <p class="section-caption">
            Use <code>.cba-border-subtle</code> / <code>.cba-border-default</code> / <code>.cba-border-strong</code> utilities;
            pair with Bootstrap <code>.border</code> / <code>.border-1</code>.
          </p>
```

#### 2.4.9 Selected states (after line 560 `<h2>Selected states</h2>`)

```html
          <p class="section-caption">
            Selected-state tokens: <code>--cba-selected-bg</code>, <code>--cba-selected-border</code>,
            <code>--cba-selected-text</code>, <code>--cba-selected-hover</code>. No dedicated component; apply directly.
          </p>
```

#### 2.4.10 Form states (after line 564 `<h2>Form states</h2>`)

```html
          <p class="section-caption">
            Reproduction: <code>&lt;cba-field [disabled]="true" [readonly]="true" [valid]="true" [error]="'...'"&gt;</code>.
            Host modifiers: <code>.cba-field--disabled</code>, <code>.cba-field--readonly</code>, <code>.cba-field--valid</code>,
            <code>.cba-field--error</code> (and <code>.cba-field--invalid</code>). See <code>docs/CBA_FORM_FIELD.md</code>.
          </p>
```

> Confirms acceptance criterion #3: the real `<cba-field>` selector is used (NOT `<cba-form-field>`).

#### 2.4.11 Semantic status (after line 568 `<h2>Semantic status</h2>`)

```html
          <p class="section-caption">
            Reproduction: <code>&lt;cba-badge appearance="solid" variant="success"&gt;success&lt;/cba-badge&gt;</code>
            or <code>appearance="outline"</code>. See <code>docs/CBA_BADGE.md</code>.
          </p>
```

### 2.5 Insert Button extra states sub-section (spec §4)

**Action:** Insert immediately AFTER `<div class="btn-matrix" id="buttonMatrix"></div>` (line 526). The extra states are static HTML (no JS array needed) per spec §4 HTML listings.

**Exact insertion (combines spec §4.1 Focus, §4.2 Loading, §4.3 Sizes into one logical block; uses `.btn-surface--panel` surface and `.pv-btn--primary` variant):**

```html
          <h3>Button extra states</h3>
          <div class="btn-surface btn-surface--panel">
            <h3>Focus</h3>
            <div class="btn-variant">
              <span class="btn-variant__label">primary</span>
              <div class="btn-states">
                <button type="button" class="pv-btn pv-btn--primary is-focus">Focused</button>
              </div>
            </div>
          </div>
          <div class="btn-surface btn-surface--panel">
            <h3>Loading</h3>
            <div class="btn-variant">
              <span class="btn-variant__label">primary</span>
              <div class="btn-states">
                <button type="button" class="pv-btn pv-btn--primary is-loading" disabled>
                  <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Loading
                </button>
              </div>
            </div>
          </div>
          <div class="btn-surface btn-surface--panel">
            <h3>Sizes</h3>
            <div class="btn-variant">
              <span class="btn-variant__label">sm</span>
              <div class="btn-states">
                <button type="button" class="pv-btn pv-btn--primary pv-btn--sm">Small</button>
              </div>
            </div>
            <div class="btn-variant">
              <span class="btn-variant__label">md</span>
              <div class="btn-states">
                <button type="button" class="pv-btn pv-btn--primary pv-btn--md">Medium</button>
              </div>
            </div>
          </div>
```

> Note: the spec lists two `<h3>` semantic levels here — the outer "Button extra states" introduces the group and each inner `<h3>Focus|Loading|Sizes</h3>` is a per-card sub-section. Per spec §7.3, sub-sections inside cards may use `<h3>`. To avoid introducing a heading-level discrepancy at the section level, the outer line could be dropped in favor of a caption. Implementation choice per spec §4: keep all three spec blocks verbatim (one outer `<h3>Button extra states</h3>` is acceptable because the parent `Button states` `<h2>` is the section level — three nested `<h3>` cards under a single `<h3>` group label is a sibling relationship, not a skipped level). If a single-level hierarchy is preferred, drop the outer `<h3>Button extra states</h3>` and rely only on the three inner `<h3>` cards. **Recommendation: drop the outer `<h3>Button extra states</h3>` line** to keep the heading hierarchy flat (only one `<h3>` level per extra-state card). Implementer should choose this option and remove that single line.

**Final recommended markup (after dropping the outer group heading):**

```html
          <!-- Button extra states — focus / loading / sizes. Static markup; no JS array. -->
          <div class="btn-surface btn-surface--panel">
            <h3>Focus</h3>
            <div class="btn-variant">
              <span class="btn-variant__label">primary</span>
              <div class="btn-states">
                <button type="button" class="pv-btn pv-btn--primary is-focus" tabindex="0">Focused</button>
              </div>
            </div>
          </div>
          <div class="btn-surface btn-surface--panel">
            <h3>Loading</h3>
            <div class="btn-variant">
              <span class="btn-variant__label">primary</span>
              <div class="btn-states">
                <button type="button" class="pv-btn pv-btn--primary is-loading" disabled>
                  <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Loading
                </button>
              </div>
            </div>
          </div>
          <div class="btn-surface btn-surface--panel">
            <h3>Sizes</h3>
            <div class="btn-variant">
              <span class="btn-variant__label">sm</span>
              <div class="btn-states">
                <button type="button" class="pv-btn pv-btn--primary pv-btn--sm">Small</button>
              </div>
            </div>
            <div class="btn-variant">
              <span class="btn-variant__label">md</span>
              <div class="btn-states">
                <button type="button" class="pv-btn pv-btn--primary pv-btn--md">Medium</button>
              </div>
            </div>
          </div>
```

> `tabindex="0"` on the Focus button is optional (buttons are keyboard-focusable by default); the spec markup does not include it. Keep it omitted to match the spec verbatim:

Final Focus button markup (verbatim spec §4.1):

```html
<button type="button" class="pv-btn pv-btn--primary is-focus">Focused</button>
```

**Verification:** search for `pv-btn--primary is-loading` — expected one match. Search for `pv-btn--sm` — expected one match.

### 2.6 Insert Radius & Shadow section (spec §6)

**Action:** Insert after the closing `</div>` of `<div class="status-row" id="statusBadges">...</div>` (currently line 569) and before the outermost closing `</div>` of `.extras` (line 570). Spec §6.1 markup is verbatim.

**Exact insertion:**

```html
          <!-- Radius & Shadow showcase — utility classes, no component. -->
          <h2>Radius &amp; Shadow</h2>
          <p class="section-caption">
            Utility classes: <code>.cba-radius-sm</code>, <code>.cba-radius-md</code>, <code>.cba-radius-lg</code>,
            <code>.cba-shadow-module</code>, <code>.cba-shadow-elevated</code>. No component; apply directly.
          </p>
          <div class="radius-shadow-grid">
            <div class="radius-shadow-card cba-radius-sm"><span>radius-sm</span></div>
            <div class="radius-shadow-card cba-radius-md"><span>radius-md</span></div>
            <div class="radius-shadow-card cba-radius-lg"><span>radius-lg</span></div>
            <div class="radius-shadow-card cba-radius-md cba-shadow-module"><span>shadow-module</span></div>
            <div class="radius-shadow-card cba-radius-md cba-shadow-elevated"><span>shadow-elevated</span></div>
          </div>
```

**Verification:** search for `radius-shadow-grid` — expected two matches (one in `<style>`, one in markup). Search for `<h2>Radius &amp; Shadow</h2>` — expected one match.

---

## Step 3 — `<script>` block edits

### 3.1 No new JS data-array entries required

Reviewed: `BUTTON_STATES` (line 646) and `BUTTON_VARIANTS` (line 644) already drive the existing matrix. The Button extra states (Step 2.5) are static markup per spec §4 — they do NOT extend `BUTTON_STATES`. The Radius & Shadow section (Step 2.6) is static markup. The captions are static markup. No array changes.

### 3.2 Update `buildModuleBody(cfg)` to apply the `preview-module-table` class

**Action:** In the `<script>` block, locate `buildModuleBody(cfg)` (line 909). The function renders `<table>` without a class. Add `class="preview-module-table"` to the `<table>` tag so the renamed CSS rules (Step 1.5) apply.

**Old (line 912, must match exactly):**

```js
  return '<div class="cba-module-container__body"><div class="panel-title-row"><div class="panel-title cba-text-heading-md">'+cfg.title+'</div>'+meta+'</div><table><tbody>'+body+'</tbody></table></div>';
```

**New:**

```js
  return '<div class="cba-module-container__body"><div class="panel-title-row"><div class="panel-title cba-text-heading-md">'+cfg.title+'</div>'+meta+'</div><table class="preview-module-table"><tbody>'+body+'</tbody></table></div>';
```

> The CSS comment above the renamed rules (Step 1.5) and the new class together satisfy spec §7.4. No other `<table>` markup exists in the preview (`.demo-table` is a different selector used by the selected-state samples — it remains untouched).

**Verification:** search the file for `<table>` (without class) — expected zero matches. Search for `<table class="preview-module-table">` — expected one match.

---

## Step 4 — Update `src/theme/preview-html.spec.ts` (`.t-callout` assertion)

The existing test asserts that the `.t-callout` rule includes `color:var(--cba-text-inverse)` (lines 138–142). The WCAG fix in Step 1.4 changes that to `color:var(--cba-text-primary)`. The assertion MUST be updated in the same implementation commit, otherwise the test will fail.

### 4.1 Update the warning-callout assertion

**File:** `src/theme/preview-html.spec.ts`
**Lines:** 138–142

**Old (must match exactly):**

```ts
  it('warning callout uses solid accent bg with inverse text', () => {
    expect(html).toContain('background:var(--cba-accent-warning)');
    expect(html).toContain('color:var(--cba-text-inverse)');
    expect(html).toContain('.t-callout{');
  });
```

**New:**

```ts
  it('warning callout uses solid accent bg with WCAG-AA primary text', () => {
    expect(html).toContain('background-color:var(--cba-accent-warning)');
    expect(html).toContain('color:var(--cba-text-primary)');
    expect(html).toContain('.t-callout{');
  });
```

> The assertion text is updated to reflect the corrected contrast behavior. `background:var(--cba-accent-warning)` is replaced because the new rule uses `background-color:` (not `background:` shorthand).

### 4.2 Optional: assert section captions are present

To prevent regression, add one new assertion block to `preview-html.spec.ts` at the end of the existing `describe('docs/theme-preview.html structure', ...)` block (after line 110, before the closing `});`):

```ts
  it('uses the real <cba-field> selector (not <cba-form-field>) in captions', () => {
    expect(html).toContain('<cba-field');
    expect(html).not.toContain('<cba-form-field');
  });
```

> This is optional but recommended. It pins acceptance criterion #3. The implementer may add it inline after the muted-text assertion block.

### 4.3 Run `npm test -- src/theme/preview-html.spec.ts`

Expected: all tests pass. If the test update in 4.1 was missed or misapplied, the callout assertion will fail and the implementer must reconcile. The `EXPECTED_TOKENS` test set is unchanged (Task B adds no new tokens), so the canonical-values assertion (lines 122–126) is unaffected.

---

## Step 5 — Build & verification

### 5.1 Regenerate the compiled preview CSS

```bash
npm run build:preview
```

> This script (`sass src/theme/theme.scss docs/theme-preview.css`) recompiles the linked stylesheet. Task B's only CSS changes are inline in the HTML, but the contract documented in the file header (lines 7–11) requires `npm run build:preview` to succeed after any preview change. Because no `src/theme/` file is modified by Task B, the generated `docs/theme-preview.css` content is expected to be byte-identical; if it differs, abort and investigate — another task (1, 2, or 4) likely already updated the tokens.

### 5.2 Run the preview spec

```bash
npm test -- src/theme/preview-html.spec.ts
```

Expected: green. If a test other than the `.t-callout` assertion (handled in Step 4.1) fails, abort and report.

### 5.3 Manual browser open

Open `docs/theme-preview.html` directly in a browser (file://). Verify acceptance criteria from spec §9:

- Every top-level preview section has a visible `<p class="section-caption">` beneath its `<h2>`.
- Button showcase includes Focus / Loading / sm / md states.
- `.t-callout` text reads as dark on coral (not white-on-coral).
- The `.search` element is focusable via keyboard Tab (disabled input accepts focus).
- `<h2>Module examples</h2>` appears immediately above the module grid.
- A `<h2>Radius &amp; Shadow</h2>` section shows five cards (3 radius + 2 shadow).
- No skipped heading levels in the preview panel (Tab through headings to verify order: Sidebar h1 → Shell mockup h2 → Module examples h2 → Token swatches h2 → Button states h2 → … → Radius & Shadow h2).

### 5.4 Grep assertions (cheap self-check)

Confirm by `grep`:

| Search | Expected matches |
|--------|------------------|
| `font-size:14px` in `docs/theme-preview.html` | 0 |
| `.cba-module-container__body table` in `docs/theme-preview.html` | 0 |
| `.preview-module-table` in `docs/theme-preview.html` | ≥6 (1 CSS selector block of 5 lines + 1 markup `<table class=...">`) |
| `class="section-caption"` in `docs/theme-preview.html` | ≥13 (11 section captions + Module examples caption + Shell mockup caption + Radius & Shadow caption = 14) |
| `<cba-form-field` in `docs/theme-preview.html` | 0 |
| `<cba-field` in `docs/theme-preview.html` | ≥1 |

---

## Step 6 — Documentation sync

### 6.1 Append to the existing `0.15.0` block in `CHANGELOG.md`

**File:** `CHANGELOG.md`
**Anchor:** existing `## [0.15.0] — 2026-08-12` block (lines 33–61).

Per `.kilo/rules/changelog-versioning.md`: append new entries under the existing dated header — no new `[Unreleased]` section is allowed and no new version bump is needed (this task is part of the 0.15.0 audit). Insert the new bullets in the matching Keep a Changelog categories.

**Insert into the `### Added` block (after the last existing `Added` bullet, line 41):**

```markdown
- `docs/theme-preview.html` now wears a `<p class="section-caption">` beneath every top-level `<h2>` preview heading. Each caption maps the demo CSS to the real library API (`<cba-*>` component, `.cba-*` utility class, or `--cba-*` token) with a link to the relevant `docs/CBA_*.md`. New sections: `<h2>Shell mockup</h2>`, `<h2>Module examples</h2>`, `<h2>Radius &amp; Shadow</h2>` (shows `.cba-radius-sm/md/lg` and `.cba-shadow-module/elevated`). New Button sub-states: `Focus` (`.is-focus`), `Loading` (`.is-loading`), and `sm`/`md` sizes (`.pv-btn--sm/--md`). See `docs/theme-preview.html`.
```

**Insert into the `### Changed` block (after the last existing `Changed` bullet, line 50):**

```markdown
- `docs/theme-preview.html` `body` font-size now uses `var(--cba-font-size-body)` (was hard-coded `14px`). Inline dev-tool / preview-chrome CSS rules (dark sidebar, shell mockup, preview controls) are now explicitly segregated by a `DEV-TOOL / PREVIEW CHROME EXEMPTION` comment block that documents why those rules intentionally use hard-coded px values and are exempt from the `--cba-*` token mandate.
- `docs/theme-preview.html` `.search` element changed from a non-focusable `<div>` to a disabled native `<input type="search">` with `aria-label="Buscar (solo vista previa)"`. Visually unchanged (same pill); accessibility improved (now keyboard-focusable and screen-reader-announced).
- `docs/theme-preview.html` fake component-table selectors (`.cba-module-container__body table`, `thead th`, `tbody td`, `tr:hover`, `tr:last-child td`) renamed to the preview-only `.preview-module-table` class. The copied component SCSS block no longer claims table selectors the real `<cba-module-container>` does not export. The new block is prefixed with `/* Preview-only table chrome; not exported by the library. */`. `buildModuleBody(cfg)` in the preview script applies the new class to the rendered `<table>`.
```

**Insert into the `### Fixed` block (after the last existing `Fixed` bullet, line 61):**

```markdown
- `docs/theme-preview.html` `.t-callout` warning callout now uses `color: var(--cba-text-primary)` on `background-color: var(--cba-accent-warning)` (was `color: var(--cba-text-inverse)`). New contrast ratio ≈ 5.6:1, passing WCAG AA (≥4.5:1). Related assertion in `src/theme/preview-html.spec.ts` updated to pin the corrected contrast behavior.
- `docs/CONSUMER_GUIDE.md` now references the preview captions as the canonical visual reproduction map for the library (`<cba-button>`, `<cba-badge>`, `<cba-field>`, module components, and `.cba-*` utility classes).
```

> The references to `docs/CBA_BUTTON.md`, `docs/CBA_BADGE.md`, `docs/CBA_FORM_FIELD.md`, `docs/CBA_MODULE_CONTAINER.md`, `docs/CBA_MODULE_HEADER.md`, `docs/CBA_MODULE_FOOTER.md`, `docs/THEME.md`, `docs/INDEX.md`, and `docs/CONSUMER_GUIDE.md` must all point to real files. The renames in Task 3 (done prior to Task B ordering) already produced `CBA_MODULE_HEADER.md` and `CBA_MODULE_CONTAINER.md`.

### 6.2 Update `docs/CONSUMER_GUIDE.md`

**File:** `docs/CONSUMER_GUIDE.md`

The current file does not reference `theme-preview.html` (only line 78 mentions "standalone (dev/preview outside the Shell)"). Add a short subsection pointing consumers to the preview captions.

**Action:** Insert a new bullet under the existing integration section (place near the "standalone" line 78 or at the end of the document's "Quick verify" section if it exists — implementer to pick the most natural placement). Concrete insertion:

```markdown
- **Theme preview as canonical visual reference** — open `docs/theme-preview.html` in a browser (or via `file://`). Every top-level section (`<h2>`) now carries a `<p class="section-caption">` mapping the demo pattern to the real library API: `<cba-button>`, `<cba-badge>`, `<cba-field>`, `<cba-module-container/header/footer>`, `.cba-text-*`, `.cba-border-*`, `.cba-radius-*`, `.cba-shadow-*`, and direct `--cba-*` tokens. Shell mockup and module examples headings (`<h2>Shell mockup</h2>`, `<h2>Module examples</h2>`, `<h2>Radius &amp; Shadow</h2>`) delimit preview-only vs library-exported surfaces. Regenerate the preview stylesheet with `npm run build:preview`.
```

> If the file has a "Visual check" / "Quick verify" section already, prefer adding the bullet there. If none exists, append the bullet under the most relevant existing top-level section (likely `## Integration` or `## Theme load`). Do not create a new top-level section without checking the existing structure first.

### 6.3 No other docs need edits

`docs/INDEX.md` line 56 already advertises the showcase contents; updating that line to mention captions + Radius & Shadow section is OPTIONAL. If implemented, append to the existing paragraph: "Now with per-section reproduction captions (real `<cba-*>` / `.cba-*` / `--cba-*` mapping), a Radius & Shadow showcase, and accessibility fixes (`.search` is a disabled input, `.t-callout` passes WCAG AA)."

---

## Step 7 — Git commit

### 7.1 Stage only the intended files

Verify per `.kilo/rules/gitignore-compliance.md` — run `git status` and ensure `node_modules/`, `dist/`, and any other gitignored paths are NOT staged.

Files to stage (exact list):

- `docs/theme-preview.html`
- `src/theme/preview-html.spec.ts`
- `CHANGELOG.md`
- `docs/CONSUMER_GUIDE.md`
- `docs/INDEX.md` (only if Step 6.3 optional update was applied)
- `docs/theme-preview.css` (only if Step 5.1 regenerated content — verify diff is intentional; if byte-identical, skip staging)

### 7.2 Commit message

`docs(preview): add reproduction captions, extra button states, radius/shadow showcase, and a11y fixes`

Suggested commit body (multi-line):

```text
docs(preview): add reproduction captions, extra button states, radius/shadow showcase, and a11y fixes

- Add <p class="section-caption"> under every top-level <h2> mapping demo
  CSS to the real library API (<cba-button>, <cba-badge>, <cba-field>,
  <cba-module-*>, .cba-* utilities, --cba-* tokens).
- Insert <h2>Shell mockup</h2>, <h2>Module examples</h2>, <h2>Radius &
  Shadow</h2>; new showcase: .cba-radius-sm/md/lg and .cba-shadow-module/
  elevated.
- Add static Button extra states: is-focus, is-loading (with fa-spinner),
  pv-btn--sm/md sizes.
- Fix WCAG-AA contrast on .t-callout: var(--cba-text-primary) on
  var(--cba-accent-warning) (~5.6:1). Update preview-html.spec.ts assertion.
- Replace non-focusable .search <div> with disabled <input type="search">
  + aria-label.
- Rename fake component table selectors (.cba-module-container__body table)
  to preview-only .preview-module-table class; buildModuleBody() updated.
- body font-size: 14px -> var(--cba-font-size-body); add DEV-TOOL /
  PREVIEW CHROME EXEMPTION comment block.
- Append 0.15.0 CHANGELOG entries (Added/Changed/Fixed).
- CONSUMER_GUIDE.md points to the preview captions as canonical visual
  reproduction reference.

Refs: .kilo/plans/20260812-task-b-frontend-spec.md
      .kilo/plans/20260812-task-b-implementation.md
```

> Branch commitment: this is one of the 4.x critical-workflow commits on `feat/project-audit-and-fixes`. Do NOT push to remote in this sub-step (push happens only when the Plan Agent instructs via Step 5 of the critical workflow, and only to `origin` per `.kilo/rules/git-remote-safety.md`).

---

## Step 8 — Self-review against spec acceptance criteria (spec §9)

Before signalling completion, the implementer runs the checklist:

- [ ] Every top-level preview section has a visible `<p class="section-caption">` beneath its `<h2>` — checked by grep `class="section-caption"` ≥ 14 matches (11 captions + Shell mockup + Module examples + Radius & Shadow).
- [ ] Each caption correctly maps the demo CSS to the real component API, utility class, or token — captured verbatim from spec §3.
- [ ] `<cba-form-field>` is not referenced; `<cba-field>` is used in the form-states caption — checked by grep `<cba-form-field` (0) and `<cba-field` (≥1).
- [ ] Button showcase includes focus, loading, `sm`, and `md` states with matching CSS rules — Step 2.5 + Step 1.2.
- [ ] `.t-callout` uses `color: var(--cba-text-primary)` on `var(--cba-accent-warning)` and passes WCAG AA — Step 1.4 + Step 4.
- [ ] `.search` is a disabled `<input>` with a non-empty `aria-label` — Step 2.1.
- [ ] A `<h2>Module examples</h2>` heading precedes `#moduleHost` — Step 2.2.
- [ ] Heading hierarchy has no skipped levels in the preview panel — Step 2.2, 2.3, 2.4, 2.5, 2.6 all use `<h2>` for sections and `<h3>` for sub-cards; sidebar `<h1>` remains the page title.
- [ ] `.cba-module-container__body table` rules removed/renamed to a preview-only class — Step 1.5 + Step 3.2.
- [ ] `body` uses `font-size: var(--cba-font-size-body)` — Step 1.6.
- [ ] A "Radius & Shadow" section is present and uses `.cba-radius-*` / `.cba-shadow-*` utilities — Step 2.6.
- [ ] `npm run build:preview` regenerates `docs/theme-preview.css` without errors — Step 5.1.
- [ ] Opening `docs/theme-preview.html` in a browser shows every caption and the new states/showcase — Step 5.3 + implementer's manual open.

If any checkbox fails, the implementer re-edits before signalling completion.

---

## Out of scope for this plan

- Changing any `src/theme/*.scss` file (covered by Task 1 and Task 2).
- Renaming `ModuleFooterComponent` or doc files (Task 3).
- Fixing `docs/USAGE.md` stale hex values (Task 4).
- Updating `.agent/project-info/*` (Task 7).
- Pushing to `origin` or merging `feat/project-audit-and-fixes` into `main` (handled by the critical workflow Steps 5 and 6, not by this single-step sub-task).
- Running `npm test` for the full suite (only the targeted `preview-html.spec.ts` is required for this sub-step; the full suite belongs to the critical-workflow verification steps).
- Adding new tokens to `src/theme/_variables.scss` (the new `--cba-icon-size-md` and `--cba-dropdown-min-width` belonging to Task 1/Task 2 already shipped in earlier sub-tasks).
- Editing the bindings of `BUTTON_STATES` or `BUTTON_VARIANTS` (no JS array changes — see Step 3.1).

---

## Risks & mitigations

| Risk | Likelihood | Mitigation |
|------|-----------:|------------|
| The `preview-html.spec.ts` assertion update in Step 4 is missed → red test. | Medium | Step 4 is a required step; Step 5.2 runs the spec and would catch the omission before commit. |
| The `.cba-radius-*` / `.cba-shadow-*` utility classes are not defined in `docs/theme-preview.css`. | Low | These utilities are generated by `src/theme/_utilities.scss` and compiled into `docs/theme-preview.css` by `npm run build:preview`. If they are missing, Task 1 or Task 2 likely failed to land first — abort and report. |
| The `<input type="search" class="search">` loses the magnifying-glass icon visually. | High (cosmetic) | Acceptable per spec §7.1 — the spec explicitly drops the icon. The `aria-label` carries the search semantics. |
| Multi-line HTML captions break the file's compressed CSS-line aesthetic. | Low | These are markup lines, not CSS — multi-line markup already exists in the file (e.g., the `<!-- ... -->` comment block lines 510–515). Aesthetic mismatch is acceptable. |
| Caption count mismatch vs grep expectation. | Low | Step 5.4 grep checks both bounds (`class="section-caption"` ≥ 14). |
| Manual browser open is not feasible in the agent environment. | Medium | The implementer may skip the live browser check and rely on `npm test` + grep assertions. The orchestrator (Plan Agent) will ultimately route the file to the user for eyeball verification. |

---

## Return summary

- Plan saved to: `.kilo/plans/20260812-task-b-implementation.md`
- Source files touched by the implementer (when 4.2 runs):
  1. `docs/theme-preview.html` (CSS + markup + 1 JS line)
  2. `src/theme/preview-html.spec.ts` (1 assertion update + optional caption assertion)
  3. `CHANGELOG.md` (append to existing `0.15.0` block)
  4. `docs/CONSUMER_GUIDE.md` (1 new bullet)
  5. `docs/INDEX.md` (optional single-sentence append)
  6. `docs/theme-preview.css` (only if `npm run build:preview` produces a non-empty diff)
- Build command: `npm run build:preview`
- Test command: `npm test -- src/theme/preview-html.spec.ts`
- Git: single commit on `feat/project-audit-and-fixes`; no push.