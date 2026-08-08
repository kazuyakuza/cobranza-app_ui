# Task 1 — Implementation Plan: Fix `docs/theme-preview.html` Module Header/Container Mockup Accuracy

**Task:** `.agent/todos/20260808/20260808-todo-1.md` — single task (Pattern C: `## Tasks` → `### Heading`).
**Critical-workflow step:** 4.1b (Analysis & Planning).
**Front-end spec (4.1a input):** `.kilo/plans/20260808-fix-preview-accuracy-frontend-spec.md`.
**Scope:** `docs/theme-preview.html` only. `docs/theme-preview.css` regenerated as a verification no-op.
**Plan output:** this file.

---

## 0. Pre-flight (execution context)

### 0.1 Working tree & branch

This plan executes inside the Critical Workflow on the feature branch already created in Step 2
(`fix/preview-accuracy` or equivalent). The implementer MUST:

1. Confirm branch: `git status` (branch name should NOT be `main`; if it is, STOP and return to caller).
2. Confirm clean tree: if unstaged files exist from prior steps, leave them; do not stage unrelated work.
3. Re-read `.kilo/rules/gitignore-compliance.md` before any commit. Run `git status` after staging to ensure
   no `node_modules/`, `dist/`, `.cache/`, etc. are staged.

### 0.2 Files NOT to touch (test-stability contract)

`src/theme/preview-html.spec.ts` reads `docs/theme-preview.html` as raw text and uses `html.toContain(...)`
on several EXACT minified CSS substrings. The implementer MUST NOT alter any of these exact substrings:

| Spec line | Exact substring that MUST remain byte-identical |
|---|---|
| 108 | `.t-row .tok{font-family:ui-monospace,monospace;font-size:11px;color:var(--cba-text-secondary)}` |
| 112 | `.t-row{font-size:13px;font-weight:500;margin-bottom:4px}` |
| 118 | `.t-callout{` |
| 116-117 | `background:var(--cba-accent-warning)` and `color:var(--cba-text-inverse)` (inside `.t-callout`) |
| 123 | `.accent-pill{padding:6px 12px;border-radius:999px;font-size:12px;font-weight:700;border:1px solid transparent;color:var(--cba-text-inverse)}` |
| 127 | `.shell-footer{height:var(--cba-footer-height);display:flex;align-items:center;justify-content:center;gap:10px;border-top:1px solid var(--cba-border-default);background:var(--cba-bg-elevated)}` |
| 128 | `.preview{display:flex;flex-direction:column;min-height:100vh;background:var(--cba-bg-primary)` |
| 160 | `.pv-btn--primary.is-hover,.pv-btn--danger.is-hover,.pv-btn--success.is-hover{background-image:linear-gradient(var(--cba-hover-inverse),var(--cba-hover-inverse))}` |
| 162 | `.pv-btn--primary.is-active,.pv-btn--danger.is-active,.pv-btn--success.is-active{background-image:linear-gradient(var(--cba-active-inverse),var(--cba-active-inverse))}` |
| 169 | `.pv-btn--secondary.is-hover{background-image:linear-gradient(var(--cba-hover),var(--cba-hover))}` |
| 171 | `.pv-btn--secondary.is-active{background-image:linear-gradient(var(--cba-active),var(--cba-active))}` |

All edits in this plan are in DIFFERENT regions (header mockup markup, lines 81-87/90/92/97 rules, new
appended CSS block before `</style>`, and the `renderDensityStrip` JS function). None of the edits above
touch the tested substrings listed here.

### 0.3 Data fixtures NOT to touch

- `TOKEN_ROLES` array (line 435-445): must stay length 9 with the exact `[role, token, hex]` triples.
  `preview-html.spec.ts` asserts `roles.length === Object.keys(SWATCH_ROLE_TOKEN).length` (9) and that each
  hex matches `EXPECTED_TOKENS`. DO NOT add/remove/reorder entries.
- `theme.source` array (line 432): required by tests (`renderSourceHex`/`renderRawStrip`). Leave as-is.
- `REQUIRED_IDS` (`swatchGrid`, `buttonMatrix`, `textGrid`, `accentRow`, `rawStrip`): must remain present
  with those exact `id` values. None of these elements are edited by this plan.
- `TEXT_SAMPLES` muted markers (`mutedNote:true`, `muted:false`, `--cba-text-muted restringido`): untouched.

### 0.4 Versioning & changelog state (already handled in Step 3)

- `package.json` is already at `"version": "0.12.1"` (verified).
- `CHANGELOG.md` already contains `## [0.12.1] — 2026-08-08` with `### Fixed` entries describing this exact
  change (verified, lines 33-40).

Therefore: **do not re-bump the version** and **do not create a second `[0.12.1]` header** or an
`[Unreleased]` section (forbidden by `.kilo/rules/changelog-versioning.md`). The implementer only verifies
in Step 9 that the existing changelog entries remain accurate after the implementation; if a described
detail is NOT actually implemented, the implementer returns to caller (do not silently edit the changelog
to mismatch reality).

---

## 1. High-level approach

**Decision: Hybrid (spec Option B) — copy component SCSS into the preview inline `<style>`, add the
Font Awesome CSS CDN, and replace the mockup markup with the exact component markup.**

### Why copy SCSS vs. other approaches

| Approach | Verdict | Reason |
|---|---|---|
| **Copy component SCSS into preview `<style>`** (chosen) | ✅ Adopted | `module-header.component.scss` & `module-container.component.scss` are Angular `ViewEncapsulation.Emulated` styles — they are bundled into the Angular library, **never** emitted into `docs/theme-preview.css`. The standalone `file://` preview has no Angular runtime, so the `cba-module-header` / `cba-module-container` selectors are otherwise unstyled. Inlining them with identical class names yields 100% visual parity. |
| Import compiled library CSS into preview | ❌ Rejected | The library CSS ships component styles only inside the Angular bundle (emulated attribute selectors `[_ngcontent-...]`). The compiled `theme-preview.css` deliberately excludes component styles. Importing would either pull in Angular-attribute-scoped rules (won't match plain HTML) or require a separate build artifact that does not exist. |
| Re-derive values from tokens and hand-write preview CSS | ❌ Rejected | Violates "match the actual library component definitions 100%" (TODO criterion 3). Would drift silently from component SCSS. |
| Add Font Awesome via `@fortawesome/angular-fontawesome` | ❌ Rejected | Requires Angular runtime; preview is static HTML. Use the FA 6.7.2 CSS CDN instead (spec §1). |

**Accepted documented divergence (spec §5):** the container radius. The component SCSS uses
`border-radius: var(--cba-radius-md)` (10px) at `module-container.component.scss:38`. The design-token
intent for module containers is `--cba-radius-lg` (14px) (the old preview hardcoded `12px`, closer to `lg`).
The front-end spec (4.1a, authoritative input) decided the preview uses `--cba-radius-lg` and flags the
component SCSS radius as a follow-up. **This plan follows the spec**: the preview's copied container rule
uses `var(--cba-radius-lg)`, NOT `var(--cba-radius-md)`. This is a single-line intentional divergence,
documented inline with a comment, and recorded in §11 follow-ups. The implementer MUST follow this decision
and NOT "fix" it back to `md`.

### Icon-source verification (done during planning)

Cross-checked the spec's icon names against `src/components/module-header/module-header.component.ts`:

| Action | Spec icon | Component source | Confirmed |
|---|---|---|---|
| Drag | `fa-up-down-left-right` | `faDrag = faUpDownLeftRight` (line 136) | ✅ |
| Collapse (not collapsed) | `fa-chevron-up` | `collapseIcon() = faChevronUp` (lines 130, 161-163) | ✅ |
| Size toggle (current 100%) | `fa-arrows-left-right-to-line` | `faShrink = faArrowsLeftRightToLine` (line 142, `sizeToggleIcon()` line 173-175) | ✅ |
| Fullscreen | `fa-window-maximize` | `faFullscreen = faWindowMaximize` (line 139) | ✅ |
| Remove | `fa-xmark` | `faXmark = faXmark` (line 148) | ✅ |
| Status `loaded` | `fa-check` | `STATUS_VISUALS.loaded.icon = faCheck` (line 40) | ✅ |

Aria strings cross-checked against `src/i18n/ui-messages.ts` `CBA_UI_MESSAGES.moduleHeader.aria` (lines 21-34):
`drag='Arrastrar módulo'`, `collapse.collapse='Colapsar módulo'`, `size.shrink='Reducir módulo a 50%'`,
`fullscreen='Pantalla completa'`, `remove='Quitar módulo'`. All match spec §2.

> Note: a prior CHANGELOG line (0.12.0) says "up-down for collapse" — that is a misstatement in the
> changelog; the actual component uses `fa-chevron-up` for the expanded (non-collapsed) state and
> `fa-chevron-down` for the collapsed state. **The spec is correct**; the preview must use `fa-chevron-up`
> (the preview mockup depicts an expanded module). Do NOT use `fa-up-down`.

---

## 2. Step-by-step implementation

All line numbers refer to the CURRENT state of `docs/theme-preview.html` (verified during planning, 659
lines total). Each step is independently committable (commit messages in §3).

### Step A — Add Font Awesome 6.7.2 CDN link in `<head>`

**Target:** insert immediately AFTER the existing `<link rel="stylesheet" href="theme-preview.css" />`
(currently line 48), so icon font-faces load after token styles and do not override them.

**Old (line 48):**
```html
  <link rel="stylesheet" href="theme-preview.css" />
  <style>
```

**New:**
```html
  <link rel="stylesheet" href="theme-preview.css" />
  <!-- Preview renders the library's Font Awesome icons. Requires network access (dev/CI artifact only). -->
  <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer" />
  <style>
```

**Verification after Step A:** open the file; FA link must appear between the `theme-preview.css` link and
`<style>`. `crossorigin="anonymous"` MUST be present because `integrity` is set. Do NOT add the link inside
`<style>` or after `<body>`.

**Risk:** offline preview won't show icons. Accepted per spec §1 — the preview is a dev/CI artifact. The
HTML comment above the link documents this. Mitigation: no fallback needed; do not inline SVG (out of scope).

---

### Step B — Append copied component SCSS into the inline `<style>`

**Target:** insert a new CSS block AFTER the last existing rule (line 215
`.status-badge--neutral{...}`) and BEFORE the `  </style>` closing tag (line 216).

Use the `vscode-mcp-server_replace_lines_code` tool with `startLine=216`, `endLine=216`, `originalCode` =
the literal `  </style>` of line 216, and `content` = the new blocks + `  </style>`. (Use `read_file_code`
on lines 214-217 first to capture the exact current text for `originalCode`.)

**New content to insert (verbatim from front-end spec §3.1 + §3.2, multi-line for "keep in sync"
readability):**

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

    /* Copied from src/components/module-container/module-container.component.scss — keep in sync.
       NOTE: :host rules mapped to .cba-module-container (preview has no Shadow DOM).
       NOTE: radius uses --cba-radius-lg per design-token intent (see .kilo/plans/20260808-fix-preview-accuracy-frontend-spec.md §5),
       diverging from the component's current --cba-radius-md; flagged as follow-up. */
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
  </style>
```

**Notes on the copied block:**
- `:host { display:block }` (header SCSS line 3-5) is OMITTED — the preview `<header>` element is
  naturally block; `:host` has no meaning in static HTML.
- The component's `@include cba-focus-ring` (header SCSS line 83-85) is expanded to
  `outline:none;box-shadow:var(--cba-focus-ring)` matching the mixin's output (the same form used elsewhere
  in the preview, e.g. `.pv-btn:focus-visible` line 125).
- The header SCSS media-query rule `:host ::ng-deep .fa-spin{animation:none}` is OMITTED — the preview has
  no `fa-spin` element.
- The container `:host(.cba-module-container--padding-*)` selectors are mapped to plain
  `.cba-module-container--padding-*` class selectors (no `:host` in static HTML).

**Verification after Step B:** `grep` the file for `.cba-module-header {` and
`.cba-module-container:not(.cba-module-container--fullscreen)` — both must appear exactly once, inside the
`<style>` block. No `:host` token must remain in the pasted block.

---

### Step C — Remove obsolete mockup selectors; reduce `.module` to layout-only

**Target:** replace the visual mockup selectors at lines 81-87 so the component classes added in Step B own
all visual chrome. Keep `.module` as a layout wrapper (max-width only) because the JS renderers
(`renderDensityStrip`) reference `<div class="module">` and the main mockup keeps the same element.

**Old (lines 81-87, current):**
```css
    .module{max-width:900px;background:var(--cba-bg-secondary);border:1px solid var(--cba-border-default);border-radius:12px;box-shadow:var(--cba-shadow-module);overflow:hidden}
    .module-header{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;background:var(--cba-bg-elevated);border-bottom:1px solid var(--cba-border-default);min-height:42px}
    .status{color:var(--cba-accent-success);font-weight:700;width:18px;text-align:center}
    .module-title{flex:1;font-weight:700}
    .module-actions{display:flex;gap:4px}
    .module-actions button{width:28px;height:28px;border:none;border-radius:6px;background:transparent;color:var(--cba-text-secondary)}
    .module-actions button:hover{background:var(--cba-hover);color:var(--cba-text-primary)}
```

**New (replace lines 81-87 with):**
```css
    /* .module kept as a layout wrapper only (used by JS renderers). All visuals owned by .cba-module-container. */
    .module{max-width:900px}
```

**Why remove each:**
| Removed selector | Reason (replaced by) |
|---|---|
| `.module` background/border/radius:12px/shadow/overflow | `.cba-module-container:not(--fullscreen)` (Step B); radius now `--cba-radius-lg` |
| `.module-header` | `.cba-module-header` (Step B) |
| `.status` | `.cba-module-header__section--status` + `.cba-module-header__status--loaded` (Step B) |
| `.module-title` | `.cba-module-header__section--title` + `.cba-text-heading-md` (Step D markup) |
| `.module-actions` | `.cba-module-header__section--actions` (Step B) |
| `.module-actions button` / `:hover` | `.cba-module-header__action` / `:hover` (Step B) |

**Verification after Step C:** `grep` the file for `\.module-header`, `\.module-actions`, `\.module-title\b`
(standalone), and `\.status\b` — none must remain as CSS rule selectors. Confirm `.module{max-width:900px}`
is the only `.module` rule.

**Risk:** none of the removed selectors are asserted by `preview-html.spec.ts` exact-string checks (verified
in §0.2). The minified substrings `.t-row`, `.t-callout`, `.shell-footer`, `.preview`, button overlay rules
are all in untouched regions.

---

### Step D — Replace the main mockup markup with the actual component structure

**Target:** replace the `<section class="module">` header block at lines 238-246. The `.module-body`,
table, `.panel-title-row`, and `.module-footer` (lines 247-262) stay unchanged in this step EXCEPT the
`.cba-module-container__body` wrapper is NOT introduced (the preview's `.module-body` is a standalone mockup
region, not the component body slot). Keep the existing `.module-body { padding:14px }` rule.

> Decision: do NOT wrap the body/footer in `.cba-module-container__body` / `.cba-module-container__header`.
> The component's `__header`/`__body` are projection slots rendered by `<ng-content>`; the preview only needs
> the header visual chrome to match. Wrapping the body would pull scrollbar styling onto a static table that
> is shorter than the viewport, producing an unintended scroll region. The TODO scope is "module header and
> container mockup must match … 100%"; the header chrome + container host class satisfy that.

**Old (lines 238-246, current):**
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

**New (replace lines 238-246 with):**
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

**Mapping checklist (acceptance criteria 1-5):**
1. Icon order: drag → collapse → size-toggle → fullscreen → remove. ✅
2. FA icons: `fa-up-down-left-right`, `fa-chevron-up`, `fa-arrows-left-right-to-line`,
   `fa-window-maximize`, `fa-xmark`; status `fa-check`. ✅
3. Class names match `module-header.component.scss` exactly. ✅
4. Container host class `.cba-module-container` on the `<section>`. ✅
5. Aria `title` + `aria-label` are the Spanish `CBA_UI_MESSAGES.moduleHeader.aria` strings, `aria-hidden`
   on every `<i>`. ✅

**Verification after Step D:**
- The `<section class="module">` opener must now read `<section class="module cba-module-container">`.
- The opening header tag must be `<header class="cba-module-header">` (NOT `<div class="module-header">`).
- Exactly 5 action `<button>` elements in the prescribed order.
- No leftover Unicode glyphs (`✓`, `⌃`, `⛶`, `✕`, `⧉`) inside the header block.

---

### Step E — Replace hardcoded px font-sizes with `--cba-*` tokens

Apply the front-end spec §4 token substitution table. These three rules carry hardcoded px values for
which a `--cba-*` token exists. Each is a small one-line `replace_lines` edit. None are asserted by exact
`toContain` checks (verified §0.2).

#### E.1 — `.panel-title` (line 90)

**Old (line 90):**
```css
    .panel-title{font-weight:700;font-size:15px}
```
**New:**
```css
    .panel-title{font-weight:700;font-size:var(--cba-font-size-heading-md)}
```

#### E.2 — `table` (line 92)

**Old (line 92):**
```css
    table{width:100%;border-collapse:collapse;font-size:13.5px}
```
**New:**
```css
    table{width:100%;border-collapse:collapse;font-size:var(--cba-font-size-small)}
```

#### E.3 — `.module-footer` (line 97)

**Old (line 92):**
```css
    .module-footer{padding:9px 12px;background:var(--cba-bg-tertiary);border-top:1px solid var(--cba-border-default);font-size:12.5px;font-weight:700;color:var(--cba-accent-success)}
```
**New:**
```css
    .module-footer{padding:9px 12px;background:var(--cba-bg-tertiary);border-top:1px solid var(--cba-border-default);font-size:var(--cba-font-size-small);font-weight:700;color:var(--cba-accent-success)}
```

> The remaining `padding:9px 12px` and `padding:14px` (`.module-body`) are spacing values without a single
> matching `--cba-space-*` token gap (the design scale uses `--cba-space-2`=8px, `--cba-space-3`=12px,
> `--cba-space-4`=16px). Substituting approximations would change visual rhythm and is OUT OF SCOPE per the
> spec table, which lists only the four font-size / radius / min-height items. Leave padding as-is.

**Verification after Step E:** `grep` the inline `<style>` for `font-size:15px`, `font-size:13.5px`,
`font-size:12.5px`, `border-radius:12px`, `min-height:42px` — none must remain in the mockup CSS region
(lines 81-100). (The earlier lines 71-80 toolbar chrome and the later sections use tokens already.)

---

### Step F — Palette-hex clean-up verification (no edits expected)

Per spec §4 "Additional token clean-up": confirm NO palette hex (`#BCB5A4`, `#F2F0E8`, `#FDFCF8`, `#D8C3A5`,
`#2B2620`, `#A29D94`, `#6B665E`, `#E98074`, `#B93E36`, `#6B5B4F`) appears in the inline `<style>`. During
planning I grep-verified the inline `<style>` already uses `var(--cba-*)` for every palette role; the only
hex literals in the file are:
- the dark tool-chrome of `.controls`/`.app` (`#111`, `#1a1a1a`, `#333`, `#222`, `#555`, `#9aa`, `#8a9099`,
  `#888`, `#bbb`, `#9ab`, `rgba(255,255,255,.15)`, `rgba(0,0,0,.2)`) — these are NOT `--cba-*` tokens (no
  matching design token exists for the dark sidebar chrome), so they stay;
- `theme.source` array and `TOKEN_ROLES` fixtures (permitted by spec/tests).

**Action:** the implementer runs `grep -nE '#(BCB5A4|F2F0E8|FDFCF8|D8C3A5|2B2620|A29D94|6B665E|E98074|B93E36|6B5B4F)' docs/theme-preview.html`.
Expected matches: ONLY inside `const theme = { source: [...] }` (line 431-432), `const TOKEN_ROLES=[...]`
(lines 435-445), and any `id="srcHex"`/roleMap JS string building (these read hexes from the data arrays, not
hardcode them — the literals live in the data arrays). If a palette hex appears inside the `<style>` block,
return to caller (would be an unexpected regression). No edits are planned here.

---

### Step G — Update `renderDensityStrip()` to emit the new component structure

**Target:** the `renderDensityStrip` function (current lines 567-573). It must emit the same
`<header class="cba-module-header">` structure as Step D, wrapped in
`<div class="module cba-module-container">`, preserving the title and the `meta` ("50%") text.

The `meta` metadata must be rendered INSIDE the title section (per spec §6) as a `<span class="cba-text-small">`
with `color: var(--cba-text-muted)`, so the three-section header layout is preserved.

**Old (lines 567-573, current):**
```javascript
function renderDensityStrip(host){
  const modules=DENSITY_MODULES.map(m=>{
    const rows=DENSITY_ROWS.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('');
    return `<div class="module"><div class="module-header"><div class="status">✓</div><div class="module-title">${m.title}</div><div class="module-meta" style="font-size:12px;color:var(--cba-text-muted);font-weight:600">${m.meta}</div></div><div class="module-body"><table class="demo-table"><thead><tr><th>Documento</th><th>Nombre</th><th>Deuda</th></tr></thead><tbody>${rows}</tbody></table></div><div class="module-footer">Listo</div></div>`;
  }).join('');
  host.innerHTML=modules;
}
```

**New (replace lines 567-573 with):**
```javascript
function renderDensityStrip(host){
  const modules=DENSITY_MODULES.map(m=>{
    const rows=DENSITY_ROWS.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('');
    return `<div class="module cba-module-container">
  <header class="cba-module-header">
    <div class="cba-module-header__section cba-module-header__section--status cba-module-header__status--loaded"><i class="fa-solid fa-check" aria-hidden="true"></i></div>
    <div class="cba-module-header__section cba-module-header__section--title cba-text-heading-md">${m.title} <span class="cba-text-small" style="color:var(--cba-text-muted)">${m.meta}</span></div>
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
  }).join('');
  host.innerHTML=modules;
}
```

**Verification after Step G:** `grep` for `module-header` (old class) must return ZERO hits in the
`renderDensityStrip` template. `grep` for `cba-module-header__action--drag` must appear at least twice in
the file (main mockup Step D + density strip Step G). `.module-meta` class is removed (no CSS rule references
it — `grep` confirms `.module-meta` is not defined as a selector anywhere; it was only inline-styled).

---

### Step H — Regenerate the compiled preview CSS

**Command (single, no chaining):**
```
npm run build:preview
```
This compiles `src/theme/theme.scss` → `docs/theme-preview.css`. Since this task changes NO `src/theme/*`
SCSS (only `docs/theme-preview.html`), the regenerated `docs/theme-preview.css` is expected to be a no-op
(zero diff). Run `git status docs/theme-preview.css` and `git diff docs/theme-preview.css` afterwards.

**Decision:** if `git diff` shows changes, do NOT commit them silently — return to caller. A diff would
mean an unrelated SCSS change is staged or the build is non-deterministic; either must be surfaced, not
hidden. If zero diff (expected), proceed; nothing to commit for the CSS.

---

### Step I — Run the test suite and linter

Run each command individually (no chaining; per `.kilo/rules/tool-selection-priority.md`):

```
npm test -- src/theme/preview-html.spec.ts
```
```
npm test
```
```
npm run lint
```

**Expected:** all green.
- `preview-html.spec.ts`: `TOKEN_ROLES.length` stays 9 (we did not touch the array); all `REQUIRED_IDS`
  present; exact-string `toContain` checks pass (tested substrings untouched per §0.2); `var(--cba-bg-primary)`
  still present (`.preview` rule line 71 untouched).
- Full `npm test`: no other test reads the preview HTML markup structure, so no collateral breakage.
- `npm run lint`: `docs/theme-preview.html` is NOT linted by the TS ESLint config (`eslint "src/**/*.ts"`)
  and `docs/` is outside `src/`, so no lint impact. Lint must remain clean.

**On failure:** do NOT modify `preview-html.spec.ts` to force a pass. A failure means an exact substring
listed in §0.2 was accidentally altered — restore it from `git diff` and re-run. If the failure is a
legitimate spec contradiction, return to caller.

---

### Step J — Acceptance-criteria reconciliation & changelog verification

Walk the TODO acceptance criteria:

| # | Criterion | How verified |
|---|---|---|
| 1 | Icon order: drag, collapse, size toggle, fullscreen, remove | Step D markup checklist |
| 2 | FA icons matching Angular component | Step §1 verification table (planning) + Step D markup |
| 3 | Exact CSS class names/selectors from `module-header.component.scss` | Step B block (copied verbatim) + grep checks |
| 4 | No hardcoded px where a `--cba-*` token exists | Step E + Step F verification greps |
| 5 | `npm test` and `npm run lint` pass | Step I |
| 6 | `preview-html.spec.ts` does not break (TOKEN_ROLES=9, required IDs) | Step I (first command) |
| 7 | `renderDensityStrip` uses updated component structure | Step G verification |
| 8 | CHANGELOG updated with dated `[x.y.z]` header | Already present (`## [0.12.1] — 2026-08-08`); verify no `[Unreleased]` section exists |

For criterion 8: run `grep -n 'Unreleased' CHANGELOG.md` (must return nothing) and
`grep -n '## \[0.12.1\] — 2026-08-08' CHANGELOG.md` (must return exactly one line). Confirm the four
`### Fixed` bullets (lines 35-40) accurately describe the implemented change. They do:

- "Preview module header accuracy … uses the actual component CSS classes (`cba-module-header`,
  `cba-module-header__action`, etc.) instead of ad-hoc inline styles, matching `module-header.component.scss`
  100%." ✅ (Steps B-D)
- "Added Font Awesome CDN to `docs/theme-preview.html` so the preview renders the library's Font Awesome
  icons accurately, mirroring the Angular component's icon set and order." ✅ (Steps A, D, G)
- "Replaced hardcoded px values in the preview mockup with `--cba-*` CSS variables." ✅ (Step E)
- "Aligned the module container mockup with `module-container.component.scss`." ✅ (Steps B, D)

No changelog edit is needed. If any bullet is INACCURATE vs. the implemented result, return to caller
(do not silently rewrite the changelog).

---

## 3. Git commit strategy

Three logical chunks, committed in order. Follow `.kilo/rules/gitignore-compliance.md` before each commit:
read `.gitignore`, run `git status`, stage ONLY `docs/theme-preview.html`, confirm no
`node_modules/`/`dist/`/`.cache/ is staged.

> The `docs/theme-preview.css` is NOT commit 1's target unless Step H produced a genuine diff (unlikely).

### Commit 1 — CDN + copied component SCSS (Steps A, B, C)
```
fix(theme-preview): inline module header/container component scss and add font awesome cdn

Copy the selectors from module-header.component.scss and
module-container.component.scss into the preview inline <style> so the
static file:// preview renders the emulated Angular component styles
verbatim. Add the Font Awesome 6.7.2 CSS CDN link to render the library
icons. Strip the obsolete .module-header/.module-actions/.status/.module-title
mockup selectors; reduce .module to a layout-only max-width wrapper.
```
Stage: `docs/theme-preview.html`.

### Commit 2 — Component markup + density strip (Steps D, G)
```
fix(theme-preview): replace module mockup markup with actual component structure

Rewrite the main module header mockup as <header class="cba-module-header">
with the three-section layout (status | title | actions) and five action
buttons in the component order (drag, collapse, size toggle, fullscreen,
remove), each with the Spanish aria-label/title strings from
CBA_UI_MESSAGES.moduleHeader.aria. Update renderDensityStrip() to emit the
same component structure. Add the .cba-module-container host class on the
<section>/<div> wrapper.
```
Stage: `docs/theme-preview.html`.

### Commit 3 — Token substitutions (Step E)
```
fix(theme-preview): replace hardcoded px values in mockup with --cba-* tokens

Substitute var(--cba-font-size-heading-md) for .panel-title, and
var(--cba-font-size-small) for the table and .module-footer font-sizes,
per the front-end spec token substitution table. Removes the last
hardcoded font-size px values in the mockup styles.
```
Stage: `docs/theme-preview.html`

> Alternative: if the implementer prefers a single commit, the combined message is:
> `fix(theme-preview): align module header mockup with actual component 100%`
> — but the chunked form above is preferred for review clarity (Critical Workflow 4.3 code review).

---

## 4. Tooling notes for the implementer

- Use `vscode-mcp-server_replace_lines_code` for every Step A-G edit (it validates `originalCode` against
  the current file, preventing accidental corruption of the exact-string test substrings in §0.2). Before
  each edit, run `vscode-mcp-server_read_file_code` on the target line range to capture the exact current
  text for `originalCode`.
- After all edits, run `vscode-mcp-server_get_diagnostics_code` with the workspace scope (severities
  `[0,1]`). Although `docs/*.html` is not a TS/SCSS lint target, this confirms no editor diagnostics
  regressed.
- Do NOT use `Set-Content`/`Out-File`/here-strings (per `.kilo/rules/newline-prevention.md`) — real newlines
  only, which the MCP editor tool guarantees.
- Do NOT introduce commented-out code (per `.kilo/rules/no-commented-code.md`). The old `.module-header`
  block is DELETED, not commented.
- The new CSS uses multi-line formatting on purpose (maintainability + the "keep in sync" comments). The
  max-lines-per-file rule applies ONLY to `src/` files, so a longer `docs/theme-preview.html` is allowed.

---

## 5. Risk mitigation summary

| Risk | Mitigation |
|---|---|
| Breaking exact-string `preview-html.spec.ts` assertions | §0.2 table + use `replace_lines_code` with `originalCode` validation; never edit the listed substrings. |
| `npm run build:preview` non-deterministic CSS diff | Step H: if diff appears, return to caller; do not commit an unexpected `theme-preview.css` change. |
| FA CDN unreachable offline | Accepted (spec §1); HTML comment added in Step A documents the network requirement. No SVG fallback (out of scope). |
| Container radius divergence (lg vs md) | Documented inline (Step B comment) + §11 follow-up; implementer must NOT silently change to md. |
| Manual SCSS→preview sync drift future | "keep in sync" comments added above both copied blocks (Step B). |
| Palette hex leaking into `<style>` | Step F grep verification; only data fixtures may carry palette hex. |
| Committing `node_modules/`/`dist/` | Pre-commit `git status` + `.gitignore` read per gitignore-compliance rule. |

---

## 6. Out of scope (do NOT do)

- Editing `src/components/module-header/module-header.component.scss` or
  `src/components/module-container/module-container.component.scss` (component radius reconciliation is a
  follow-up, NOT this task — see §11).
- Editing `src/theme/preview-html.spec.ts` or any fixture.
- Touching `.controls`/`.app` dark-chrome hex values (no matching `--cba-*` token).
- Introducing `.cba-module-container__body`/`__header` wrappers around the mockup body/footer (see Step D
  decision).
- Adding Storybook, Playwright, or SVG icon fallbacks.
- Re-running Step 3 version bump or creating a new CHANGELOG header (already done — see §0.4).
- Any action outside `docs/theme-preview.html` (and the Step H CSS regeneration).

---

## 7. Files modified

| File | Change | Steps |
|---|---|---|
| `docs/theme-preview.html` | FA CDN link; copied component SCSS blocks; obsolete selector removal; component markup for main mockup; token substitutions; `renderDensityStrip` rewrite | A, B, C, D, E, G |
| `docs/theme-preview.css` | Regenerate via `npm run build:preview` (expected zero diff; commit only if genuine diff and caller-approved) | H |

No `src/` file is modified.

---

## 8. Build/test/lint command sequence (run in this order, individually)

1. `npm run build:preview` → verify `docs/theme-preview.css` diff is empty (Step H).
2. `npm test -- src/theme/preview-html.spec.ts` → must pass (Step I).
3. `npm test` → must pass (Step I).
4. `npm run lint` → must pass (Step I).

---

## 9. Definition of done (for the Step 4.5b adherence check later)

- [ ] FA 6.7.2 CDN `<link>` present in `<head>` with `crossorigin="anonymous"`.
- [ ] `<style>` contains `.cba-module-header` and `.cba-module-container` rule blocks with "keep in sync"
      comments; no `:host` token; container radius is `var(--cba-radius-lg)`.
- [ ] Obsolete selectors (`.module-header`, `.module-actions`, `.module-actions button`(+`:hover`),
      `.module-title`, `.status`) removed from `<style>`; `.module` reduced to `max-width:900px` only.
- [ ] Main mockup uses `<section class="module cba-module-container">` + `<header class="cba-module-header">`
      + 5 action buttons in order drag/collapse/size/fullscreen/remove with FA icons + Spanish aria/title.
- [ ] `.panel-title`, `table`, `.module-footer` font-sizes use `--cba-*` tokens; no `15px`/`13.5px`/
      `12.5px`/`12px`(radius)/`42px`(min-height) remain in mockup CSS.
- [ ] `renderDensityStrip` emits the new component structure with `.cba-module-container` host class and
      metadata in the title section.
- [ ] `npm test`, `npm run lint` pass; `preview-html.spec.ts` unchanged; TOKEN_ROLES length 9; required IDs
      present.
- [ ] `CHANGELOG.md` has no `[Unreleased]` section; `[0.12.1] — 2026-08-08` present exactly once; bullets
      match the implemented change.

---

## 10. Open items / risks to surface to caller

(These are flagged notes, NOT actions for this task.)

1. **CHANGELOG `[0.12.1]` entries were pre-written before implementation.** This plan verified they are
   accurate against the intended implementation. If during execution any criterion is dropped or changed,
   the changelog must be reconciled — handled in Step 4.6 / 4.5b, not here.
2. **Container radius divergence** (`--cba-radius-lg` in preview vs `--cba-radius-md` in component SCSS) —
   see §11 follow-up; resolved for THIS file per the front-end spec's authoritative decision.
3. **A CHANGELOG 0.12.0 prose line ("up-down for collapse") contradicts the actual component icon
   (`fa-chevron-up`).** This is a pre-existing documentation bug, NOT in scope here. Flagged for a future
   docs correction.

---

## 11. Follow-ups (new TODO candidates — NOT this task)

The implementer/architector may propose these to the caller later (do NOT act on them now):

1. Reconcile `module-container.component.scss:38` `border-radius: var(--cba-radius-md)` with the
   design-token intent `--cba-radius-lg` (decide component vs. preview which is canonical).
2. Correct the 0.12.0 CHANGELOG "up-down for collapse" prose to "chevron-up / chevron-down" (documentation
   accuracy).
3. Consider a `npm run` guard (or a `preview-html.spec.ts` addition) that asserts the preview's copied
   component SCSS block stays byte-equal to the component source, to automate the "keep in sync" contract.

---

**Plan complete.** The implementer (Step 4.2) follows Steps A-J in order, committing per §3. No independent
decisions are required; every snippet, line number, and verification step is specified above.