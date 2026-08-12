# Task B — Code Review Fix Plan

**Date:** 2026-08-12  
**Branch:** `feat/project-audit-and-fixes`  
**Commit reviewed:** `cd25cca` — `docs(preview): add reproduction captions, extra button states, radius/shadow showcase, and a11y fixes`  
**Files reviewed:** `docs/theme-preview.html`, `src/theme/preview-html.spec.ts`, `CHANGELOG.md`, `docs/CONSUMER_GUIDE.md`, `docs/INDEX.md`

## Severity Summary

- **Required fixes:** none
- **Recommended fixes (low severity):** none
- **Informational observations:** 2

The implementation matches the approved plan (`.kilo/plans/20260812-task-b-implementation.md`) and the frontend spec (`.kilo/plans/20260812-task-b-frontend-spec.md`). All targeted tests pass and `npm run build:preview` succeeds.

---

## Verification Results

### 1. Section captions

- **Status:** pass
- 14 `<p class="section-caption">` elements are present in `docs/theme-preview.html`, one beneath every top-level `<h2>` in the preview panel:
  - Shell mockup
  - Module examples
  - Token swatches
  - Button states
  - Labels & pills
  - Icons
  - Text on surfaces
  - Accent pills
  - Typography scale
  - Border scale
  - Selected states
  - Form states
  - Semantic status
  - Radius & Shadow
- Each caption text matches the verbatim text required by the frontend spec §3.

### 2. Caption API mapping

- **Status:** pass
- Captions map demo CSS to the real library API:
  - `<cba-button>`, `<cba-badge>`, `<cba-field>`, `<cba-module-container/header/footer>` components.
  - `.cba-text-*`, `.cba-border-*`, `.cba-radius-*`, `.cba-shadow-*` utilities.
  - Direct `--cba-*` tokens.
- The form-states caption uses the real `<cba-field>` selector; `<cba-form-field>` is not referenced anywhere in the file.

### 3. HTML validity

- **Status:** pass
- `src/theme/preview-html.spec.ts` parses the document successfully.
- No mismatched tags or invalid attributes were found in the changed regions.
- The `.search` element was correctly changed from a `<div>` to a void `<input type="search">`.

### 4. WCAG-AA contrast fix for `.t-callout`

- **Status:** pass
- The rule now uses:
  - `background-color: var(--cba-accent-warning)` → `#E98074`
  - `color: var(--cba-text-primary)` → `#2B2620`
- Computed WCAG 2.1 relative luminance contrast: **≈ 6.3:1**, which exceeds the WCAG AA threshold of 4.5:1 and is slightly stronger than the spec's ≈ 5.6:1 estimate.
- The related test assertion in `src/theme/preview-html.spec.ts` was updated to pin the corrected behaviour.

### 5. Button extra states

- **Status:** pass
- Focus, Loading, and Sizes (`sm`/`md`) blocks are present immediately after `#buttonMatrix`.
- Matching CSS rules exist:
  - `.pv-btn.is-focus,.pv-btn:focus-visible{outline:none;box-shadow:var(--cba-focus-ring)}`
  - `.pv-btn.is-loading{cursor:not-allowed;opacity:.6}`
  - `.pv-btn--sm{...}` and `.pv-btn--md{...}`

### 6. Accessibility improvements

- **Status:** pass
- `.search` is now `<input type="search" class="search" value="Ctrl + K" disabled aria-label="Buscar (solo vista previa)" />`.
- New `<h2>Shell mockup</h2>` and `<h2>Module examples</h2>` headings create a correct heading hierarchy (sidebar `<h1>` → preview panel `<h2>` sections → card-level `<h3>` sub-sections) with no skipped levels.

### 7. Test assertions

- **Status:** pass
- `npm test -- src/theme/preview-html.spec.ts` → 29 passed.
- `npm test -- src/theme/contrast.spec.ts` → 16 passed.
- Updated `.t-callout` assertion checks `background-color:var(--cba-accent-warning)` and `color:var(--cba-text-primary)`.
- New assertion verifies the real `<cba-field>` selector and absence of `<cba-form-field>`.

### 8. Fake component table selectors

- **Status:** pass
- The `.cba-module-container__body table` selector block was renamed to `.preview-module-table` and prefixed with the comment `/* Preview-only table chrome; not exported by the library. */`.
- `buildModuleBody(cfg)` renders `<table class="preview-module-table">`.

### 9. Token compliance

- **Status:** pass
- `body{font-size:var(--cba-font-size-body)}` replaces the previous hard-coded `14px`.
- The `DEV-TOOL / PREVIEW CHROME EXEMPTION` comment block is placed immediately before `.app{...}`.

### 10. Radius & Shadow showcase

- **Status:** pass
- New `<h2>Radius &amp; Shadow</h2>` section appears after Semantic status.
- Five cards use `.cba-radius-sm`, `.cba-radius-md`, `.cba-radius-lg`, `.cba-shadow-module`, and `.cba-shadow-elevated`.
- CSS grid and card rules are present.

### 11. CHANGELOG and docs

- **Status:** pass
- Entries are appended under the existing dated `## [0.15.0] — 2026-08-12` header.
- No `[Unreleased]` section was introduced.
- Categories used: `Added`, `Changed`, `Fixed`.
- `docs/CONSUMER_GUIDE.md` and `docs/INDEX.md` reference the preview captions and new sections.

### 12. Build verification

- **Status:** pass
- `npm run build:preview` completes without errors.
- `docs/theme-preview.css` was not modified by this build (no `src/theme/*` files changed in Task B).

---

## Informational Observations

These are not defects and do not require fixes; they are recorded for completeness.

1. **Minor indentation inconsistency in `docs/theme-preview.html`.**
   - `<h2>Shell mockup</h2>` and its caption are indented 8 spaces, while the surrounding `.preview-bar` and `.shell-header` siblings are indented 6 spaces.
   - `<h2>Module examples</h2>` is indented 10 spaces, while the adjacent `<div id="moduleHost"></div>` is indented 8 spaces.
   - Severity: informational. No functional or accessibility impact.

2. **Hard-coded `font-size:14px` remains on `.extras h2`.**
   - The rule `.extras h2{font-size:14px;margin:14px 0 6px}` still uses a hard-coded pixel value.
   - The frontend spec §8.1 only mandated swapping the `body` font-size to `var(--cba-font-size-body)`, which was done. The `.extras h2` size is preview-only heading chrome and is not required to use a token.
   - Severity: informational. Aligning it with `--cba-font-size-body` would improve consistency but is out of scope for the spec.

---

## Recommended Action

No code changes are required. The commit is approved for the critical workflow.
