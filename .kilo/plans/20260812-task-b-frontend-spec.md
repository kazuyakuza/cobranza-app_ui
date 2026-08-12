# Task B — theme-preview.html overhaul

**Date:** 2026-08-12  
**Scope:** `docs/theme-preview.html` consumer-reference overhaul (captions, missing button states, WCAG contrast, accessibility, Radius & Shadow showcase).  
**Depends on:** Tasks 1–4 (tokens, component SCSS, docs) so that reproduction paths reference the real, corrected API.

---

## 1. Context & constraints

- `docs/theme-preview.html` is a **static, file://-friendly consumer reference**. It copies a subset of component CSS into an inline `<style>` block so the preview renders without the Angular runtime.
- Every visual pattern in the preview must now tell consumers how to reproduce it with the **real library API** (`<cba-*>` components, `.cba-*` utility classes, or `--cba-*` tokens).
- The preview's own chrome (dark sidebar, shell header/footer) is **preview-only** and intentionally uses hard-coded px values; this must be documented in a comment so future audits do not flag it.
- No implementation work is part of this spec; it only defines what must change.

---

## 2. New `.section-caption` element

### 2.1 CSS rule

Add to the inline `<style>` block (near the `.extras h2` rules):

```css
.section-caption {
  color: var(--cba-text-secondary);
  font-size: var(--cba-font-size-caption);
  font-style: italic;
  line-height: var(--cba-line-height-caption);
  margin: 0 0 var(--cba-space-2) 0;
}
```

### 2.2 Placement rule

Insert one `<p class="section-caption">` **directly beneath every top-level `<h2>` section heading** in the preview panel (i.e., sections that describe a reproducible pattern). Do not add captions to sub-section headings such as the per-surface `<h3>` titles inside the button matrix or pattern cards.

---

## 3. Per-section reproduction mapping

| Section heading | Demo CSS classes used today | Real library reproduction path | Caption text (verbatim) |
|-----------------|----------------------------|--------------------------------|-------------------------|
| **Token swatches** | `.swatch-chip` with inline `var(--cba-*)` | Direct tokens / `.cba-bg-*` utilities. No component equivalent. | `Direct --cba-* tokens and .cba-bg-* utility classes. No component equivalent; consume via var(--cba-bg-primary) or .cba-bg-primary. See docs/THEME.md.` |
| **Button states** | `.pv-btn`, `.pv-btn--primary`, `.is-hover`, `.is-active`, `.is-disabled` | `<cba-button variant="primary" size="md">Primary</cba-button>` | `DEMO CSS ONLY. Reproduction: <cba-button variant="primary" size="md">Primary</cba-button>. Focus, loading and sizes are also component inputs. See docs/CBA_BUTTON.md.` |
| **Labels & pills** | `.cba-text-caption`, `.cba-text-small`, `.cba-text-body`, `.demo-pill` | Labels: typography utilities `.cba-text-caption` / `.cba-text-small` / `.cba-text-body`. Pills: no library component; apply `--cba-selected-*` tokens directly. | `Labels: use .cba-text-caption / .cba-text-small / .cba-text-body. Pills: no library component; apply --cba-selected-* tokens directly.` |
| **Icons** | Font Awesome `<i>` classes | Font Awesome via `@fortawesome/angular-fontawesome` (`<fa-icon>`) or plain `<i>` classes. No library icon component. | `Icons come from Font Awesome. Use <fa-icon [icon]="..."> or plain <i class="fa-solid fa-...">. See docs/INDEX.md for the icon list.` |
| **Text on surfaces** | `.t-primary`, `.t-secondary`, `.t-muted`, `.t-inverse` | `.cba-text-primary`, `.cba-text-secondary`, `.cba-text-muted`, `.cba-text-inverse` utilities. | `Use .cba-text-primary, .cba-text-secondary, .cba-text-muted and .cba-text-inverse utilities. --cba-text-muted is restricted on canvas and inset sand.` |
| **Accent pills** | `.accent-pill` | `<cba-badge appearance="solid" variant="success">success</cba-badge>` | `Reproduction: <cba-badge appearance="solid" variant="success">success</cba-badge>. See docs/CBA_BADGE.md.` |
| **Typography scale** | `.type-row .sample` with inline tokens | Typography utilities `.cba-text-display`, `.cba-text-heading-lg`, `.cba-text-heading-md`, `.cba-text-body`, `.cba-text-small`, `.cba-text-caption`. | `Use .cba-text-display / .cba-text-heading-lg / .cba-text-heading-md / .cba-text-body / .cba-text-small / .cba-text-caption utilities.` |
| **Border scale** | `.border-swatch--subtle/default/strong` | Border-color utilities `.cba-border-subtle`, `.cba-border-default`, `.cba-border-strong`; pair with Bootstrap's `.border`. | `Use .cba-border-subtle / .cba-border-default / .cba-border-strong utilities; pair with Bootstrap .border / .border-1.` |
| **Selected states** | `.demo-pill.is-selected`, `.demo-nav__item.is-selected`, `.demo-table tr.is-selected` | No dedicated component; apply `--cba-selected-bg`, `--cba-selected-border`, `--cba-selected-text`, `--cba-selected-hover` directly. | `Selected-state tokens: --cba-selected-bg, --cba-selected-border, --cba-selected-text, --cba-selected-hover. No dedicated component; apply directly.` |
| **Form states** | `.form-field--default`, `.form-field--hover`, `.form-field--focus`, `.form-field--disabled`, `.form-field--readonly`, `.form-field--invalid`, `.form-field--valid` | Real selector is `<cba-field>` (internal wrapper used by CbaInput / CbaSelect / CbaDatepicker). Host modifiers: `.cba-field--disabled`, `.cba-field--readonly`, `.cba-field--valid`, `.cba-field--error`, `.cba-field--invalid`. | `Reproduction: <cba-field [disabled]="true" [readonly]="true" [valid]="true" [error]="'...'">. Host modifiers: .cba-field--disabled, .cba-field--readonly, .cba-field--valid, .cba-field--error (and .cba-field--invalid). See docs/CBA_FORM_FIELD.md.` |
| **Semantic status** | `.status-badge`, `.status-badge--outline`, `.status-badge--neutral` | `<cba-badge appearance="solid|outline" variant="success|warning|danger|info|neutral">` | `Reproduction: <cba-badge appearance="solid" variant="success">success</cba-badge> or appearance="outline". See docs/CBA_BADGE.md.` |
| **Module examples** | `.cba-module-container`, `.cba-module-header`, `.cba-module-footer`, `.panel-meta`, `.panel-title-row` | Real components: `<cba-module-container>`, `<cba-module-header>`, `<cba-module-footer>`. Exported classes: `.cba-module-container--size-100`, `.cba-module-header__action`, `.cba-module-footer__status--*`. | `Real library components: <cba-module-container>, <cba-module-header>, <cba-module-footer>. Exported classes: .cba-module-container--size-100, .cba-module-header__action, .cba-module-footer__status--*. Preview-only helpers (.panel-meta, .panel-title-row) are not exported. See docs/CBA_MODULE_CONTAINER.md, docs/CBA_MODULE_HEADER.md, docs/CBA_MODULE_FOOTER.md.` |
| **Shell mockup** (header + footer) | `.shell-header`, `.shell-footer`, `.section-pill`, `.icon-btn`, `.search` | **Not a library component.** The library exports module components only. | `Application shell — NOT a library component. Library exports <cba-module-container>, <cba-module-header>, <cba-module-footer> only.` |
| **Radius & Shadow** (new) | (none today) | Utility classes `.cba-radius-sm`, `.cba-radius-md`, `.cba-radius-lg`, `.cba-shadow-module`, `.cba-shadow-elevated`. | `Utility classes: .cba-radius-sm, .cba-radius-md, .cba-radius-lg, .cba-shadow-module, .cba-shadow-elevated. No component; apply directly.` |

### 3.1 API details verified from source

- `<cba-button>`: `variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'`, `size: 'sm' | 'md'`, `loading: boolean`, `disabled: boolean` (`src/components/button/cba-button.component.ts`).
- `<cba-badge>`: `variant: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'`, `appearance: 'solid' | 'outline'` (`src/components/badge/cba-badge.component.ts`).
- `<cba-module-header>`: selector `cba-module-header`, host class `cba-module-header`, inputs `title`, `size: '50%' | '100%'`, `isCollapsed`, `isFullscreen`, `status` (`src/components/module-header/module-header.component.ts`).
- `<cba-module-footer>`: selector `cba-module-footer`, host class `cba-module-footer`, inputs `status`, `statusText`; status classes `.cba-module-footer__status--loading|loaded|success|warning|error|dirty` (`src/components/module-footer/module-footer.component.ts`).
- `<cba-module-container>`: selector `cba-module-container`, host class `cba-module-container`, inputs `size: '50%' | '100%'`, `isCollapsed`, `isFullscreen`, `padding: 'none' | 'sm' | 'md'`, `scrollChaining` (`src/components/module-container/module-container.component.ts`).
- `<cba-field>`: selector `cba-field`, host class `cba-field`, inputs `disabled`, `readonly`, `valid`, `error`; host modifiers `.cba-field--disabled`, `.cba-field--readonly`, `.cba-field--valid`, `.cba-field--error`, `.cba-field--invalid` (`src/components/form-field/cba-field.component.ts`). **Note:** the global plan incorrectly references `<cba-form-field>`; the real selector is `<cba-field>`.

---

## 4. Missing button states

Add a new sub-section **"Button extra states"** immediately after the button matrix (`#buttonMatrix`). Use real component-equivalent markup with preview-only `.pv-btn` modifiers.

### 4.1 Focus state

HTML:

```html
<div class="btn-surface btn-surface--panel">
  <h3>Focus</h3>
  <div class="btn-variant">
    <span class="btn-variant__label">primary</span>
    <div class="btn-states">
      <button type="button" class="pv-btn pv-btn--primary is-focus">Focused</button>
    </div>
  </div>
</div>
```

CSS addition:

```css
.pv-btn.is-focus,
.pv-btn:focus-visible {
  outline: none;
  box-shadow: var(--cba-focus-ring);
}
```

### 4.2 Loading state

HTML:

```html
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
```

CSS addition:

```css
.pv-btn.is-loading {
  cursor: not-allowed;
  opacity: 0.6;
}
```

### 4.3 Size sm / md

HTML:

```html
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

CSS addition:

```css
.pv-btn--sm {
  padding: var(--cba-space-1) var(--cba-space-3);
  font-size: var(--cba-font-size-small);
}

.pv-btn--md {
  padding: var(--cba-space-2) var(--cba-space-4);
  font-size: var(--cba-font-size-body);
}
```

### 4.4 Component mapping for extra states

- Focus: native `:focus-visible` on `<cba-button>`; no input required.
- Loading: `<cba-button [loading]="true">`.
- Sizes: `<cba-button size="sm">` / `<cba-button size="md">`.

---

## 5. WCAG contrast fix for `.t-callout`

### 5.1 Current failure

Current rule (line ~202):

```css
.t-callout {
  background: var(--cba-accent-warning); /* #E98074 */
  color: var(--cba-text-inverse);        /* #FDFCF8 */
}
```

Contrast ratio is ~2.3:1, failing WCAG AA (4.5:1).

### 5.2 Specified fix

Change `.t-callout` to use dark text on the warning background:

```css
.t-callout {
  margin-top: var(--cba-space-2);
  padding: var(--cba-space-2) var(--cba-space-3);
  border-radius: var(--cba-radius-sm);
  border: 1px solid var(--cba-border-strong);
  background-color: var(--cba-accent-warning); /* #E98074 */
  color: var(--cba-text-primary);              /* #2B2620 */
  font-size: var(--cba-font-size-caption);
  font-weight: 600;
}
```

**Expected contrast:** `#E98074` on `#2B2620` ≈ 5.6:1, passing WCAG AA.

---

## 6. Radius & Shadow showcase

Insert a new section **after** "Semantic status".

### 6.1 HTML

```html
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

### 6.2 CSS

```css
.radius-shadow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--cba-space-3);
}

.radius-shadow-card {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  background: var(--cba-bg-secondary);
  border: 1px solid var(--cba-border-default);
  color: var(--cba-text-secondary);
  font-size: var(--cba-font-size-small);
  font-weight: 600;
  text-align: center;
}
```

---

## 7. Accessibility improvements

### 7.1 Search input

Replace the non-focusable `.search` div with a disabled `<input>`:

```html
<input type="search" class="search" value="Ctrl + K" disabled aria-label="Buscar (solo vista previa)" />
```

Ensure the existing `.search` CSS continues to render it as a pill-shaped chrome element. Because it is a disabled native input, it is keyboard-focusable and announced by screen readers with its accessible name.

### 7.2 Module examples heading

Insert before `#moduleHost`:

```html
<h2>Module examples</h2>
<p class="section-caption">
  Real library components: <code>&lt;cba-module-container&gt;</code>, <code>&lt;cba-module-header&gt;</code>,
  <code>&lt;cba-module-footer&gt;</code>. Preview-only helpers are not exported.
</p>
```

### 7.3 Heading hierarchy

- The sidebar `<h1>` remains the page title.
- The preview panel must contain only `<h2>` section headings (no skipped levels).
- Sub-sections inside cards may use `<h3>`.

### 7.4 Remove fake component table styles

Delete or move the block `.cba-module-container__body table`, `.cba-module-container__body thead th`, `.cba-module-container__body tbody td`, etc. from the copied component CSS. These selectors are **not part of the real component**. If module #1 still needs a styled table, replace the selector with a preview-only class (e.g., `.preview-module-table`) and prefix the block with:

```css
/* Preview-only table chrome; not exported by the library. */
```

---

## 8. Token compliance for preview chrome

### 8.1 `body` font-size

Replace:

```css
body { font-size: 14px; }
```

with:

```css
body { font-size: var(--cba-font-size-body); }
```

`--cba-font-size-body` resolves to `0.875rem`, which equals `14px` at a `16px` root.

### 8.2 Hard-coded px exemption comment

Add a comment immediately before the dev-tool/chrome rules (before `.app`):

```css
/*
  DEV-TOOL / PREVIEW CHROME EXEMPTION:
  The rules below describe the dark sidebar, shell mockup, and preview controls.
  They are intentionally preview-only and use hard-coded px values for a stable
  dev-tool UI. They are NOT part of the published library theme and do not need
  to use --cba-* tokens.
*/
```

---

## 9. Acceptance criteria

- [ ] Every top-level preview section has a visible `<p class="section-caption">` beneath its `<h2>`.
- [ ] Each caption correctly maps the demo CSS to the real component API, utility class, or token.
- [ ] `<cba-form-field>` is not referenced; the real `<cba-field>` selector is used in the form-states caption.
- [ ] Button showcase includes focus, loading, `sm`, and `md` states with matching CSS rules.
- [ ] `.t-callout` uses `color: var(--cba-text-primary)` on `var(--cba-accent-warning)` and passes WCAG AA (≥ 4.5:1).
- [ ] `.search` is a disabled `<input>` with a non-empty `aria-label`.
- [ ] A `<h2>Module examples</h2>` heading precedes `#moduleHost`.
- [ ] Heading hierarchy has no skipped levels in the preview panel.
- [ ] `.cba-module-container__body table` rules are removed or renamed to a preview-only class.
- [ ] `body` uses `font-size: var(--cba-font-size-body)`.
- [ ] A "Radius & Shadow" section is present and uses `.cba-radius-*` / `.cba-shadow-*` utilities.
- [ ] `npm run build:preview` regenerates `docs/theme-preview.css` without errors.
- [ ] Opening `docs/theme-preview.html` in a browser shows every caption and the new states/showcase.
