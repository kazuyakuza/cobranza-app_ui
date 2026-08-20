<!--
  AI Agent Note: This is the CONSUMER GUIDE for @cobranza-apps/ui.
  AUDIENCE: Shell developers, MFE developers, and AI agents integrating the library.
  PURPOSE: Tell Shell and MFE authors exactly which surfaces to paint, which tokens
           to use, and which anti-patterns to avoid so the four-level surface
           hierarchy (canvas → panel → elevated → inset) survives in the running Shell.
  RELATIONSHIPS:
    - docs/THEME.md — token quick reference (value tables live in brief.md §5
      and src/theme/_variables.scss, NOT here).
    - .agent/project-info/brief.md §8 — integration notes (high-level).
    - src/theme/_variables.scss — authoritative token values.
  MAINTENANCE: Update when surface ownership rules change. Never duplicate token
               values here — reference the authoritative sources.
-->

# @cobranza-apps/ui — Consumer Guide (Shell & MFE)

Integration rules for **Shell** and **MFE** authors so the four-level surface hierarchy
(canvas → panel → elevated → inset) reads correctly.

Token values live in [`brief.md §5`](../.agent/project-info/brief.md#5-design-tokens-theme)
and [`src/theme/_variables.scss`](../src/theme/_variables.scss). This guide states *who
applies which token where*.

## Table of Contents

- [Token Compliance Mandate](#token-compliance-mandate)
- [Theme load (once)](#theme-load-once)
- [Surface ownership map](#surface-ownership-map)
- [Button Color Guide](#button-color-guide)
- [Surface Decision Tree](#surface-decision-tree)
- [Text Color Rules](#text-color-rules)
- [Bar and Chrome Guide](#bar-and-chrome-guide)
- [Selected State Usage](#selected-state-usage)
- [Form State Matrix](#form-state-matrix)
- [Typography Scale Usage](#typography-scale-usage)
- [Table State Patterns](#table-state-patterns)
- [Navigation / Footer Pill State Patterns](#navigation--footer-pill-state-patterns)
- [Semantic Status Patterns](#semantic-status-patterns)
- [Shell checklist](#shell-checklist)
- [MFE checklist](#mfe-checklist)
- [Anti-patterns](#anti-patterns)
- [Quick verify](#quick-verify)
- [Cross-References](#cross-references)

## Token Compliance Mandate

AI agents generating Shell or MFE code MUST use `--cba-*` tokens for at least 90 % of all
color and style declarations.

- Prefer `var(--cba-*)` or the opt-in `.cba-*` utility classes.
- Do not use hard-coded hex values, RGB/RGBA literals, or Bootstrap default colors except
  for one-off edge cases.
- Every edge-case hard-coded value MUST be documented with a `TODO` comment explaining why
  the token cannot be used and linking to this guide.
- If a needed color does not exist as a token, do not invent a new hex value — open a task
  to extend the theme.

Token values live in
[`src/theme/_variables.scss`](../src/theme/_variables.scss) and
[`.agent/project-info/brief.md §5`](../.agent/project-info/brief.md#5-design-tokens-theme).
This guide references tokens only; it never re-declares hex values.

## Theme load (once)

The theme emits `--cba-*` CSS variables on `:root` and the opt-in `.cba-*` utility
classes. Load it **exactly once per running page**.

- **Shell** MUST import the theme globally:

```scss
/* shell global-styles.scss */
@use '@cobranza-apps/ui/theme';
```

- **MFEs** hosted inside the Shell rely on the Shell-loaded `:root` tokens. Do **not**
  re-import the theme inside hosted MFEs — that just emits the same `:root` twice.
- An MFE that runs **standalone** (dev/preview outside the Shell) MUST import the same
  theme once in its own global styles so tokens resolve:

```scss
/* mfe global-styles.scss (standalone dev only) */
@use '@cobranza-apps/ui/theme';
```

- Do **not** re-declare competing `:root` colors in Shell or MFE (no custom `--cba-*`
  overrides, no second design system on `:root`). The library is the single source of
  surface color.

## Surface ownership map

| UI region | Token | Who applies it |
| ----------- | -------- | ---------------- |
| Shell workspace / workbench background | `--cba-bg-primary` | **Shell** |
| Shell header / footer chrome | `--cba-bg-elevated` (or documented Shell choice) | **Shell** |
| Module card surface | `--cba-bg-secondary` via `cba-module-container` | **Lib** (ModuleContainer) |
| Module header band | `--cba-bg-elevated` via `cba-module-header` | **Lib** (ModuleHeader) |
| Table header / recessed wells | `--cba-bg-tertiary` | **MFE** (or shared table styles) |
| Dropdown / popover / modal surfaces | elevated tokens via wrappers | **Lib** components |
| Footer section pills | border-strong + panel/elevated | **Shell** |

Reading order on screen (light → dark, by intent): elevated (header band, dropdowns) →
panel (module body) → inset (table header, wells) → canvas (workspace floor). Module
cards lift off the canvas via `border-default` + `shadow-module` from the library; the
Shell does not need to add those.

## Button Color Guide

Use `CbaButton` from `@cobranza-apps/ui` whenever possible. When custom buttons are
unavoidable, map every state to the tokens below. Hover and active states use the same
base tokens plus an overlay; solid variants (`primary`/`danger`/`success`) use the light
inverse overlays (`--cba-hover-inverse` / `--cba-active-inverse`), while `secondary` and
`ghost` use the dark overlays (`--cba-hover` / `--cba-active`). Disabled and loading
states share one treatment: `opacity: 0.6` and `cursor: not-allowed`.

### Variant × surface base mapping

`primary`, `danger`, `success`, and `ghost` are surface-independent — use the same tokens
on panel, elevated, and canvas. Only `secondary` changes by surface.

| Variant | Surface | Background | Border | Text |
|---------|---------|------------|--------|------|
| `primary` | any | `--cba-accent-primary` | transparent | `--cba-text-inverse` |
| `danger` | any | `--cba-accent-danger` | transparent | `--cba-text-inverse` |
| `success` | any | `--cba-accent-success` | transparent | `--cba-text-inverse` |
| `secondary` | panel | `--cba-bg-elevated` | `--cba-border-default` | `--cba-text-primary` |
| `secondary` | elevated | `--cba-bg-secondary` | `--cba-border-default` | `--cba-text-primary` |
| `secondary` | canvas | `--cba-bg-elevated` | `--cba-border-default` | `--cba-text-primary` |
| `ghost` | any | transparent | transparent | `--cba-text-primary` |

**Rationale for `secondary` on elevated:** the default secondary fill is `--cba-bg-elevated`.
On an already-elevated surface, swap the fill to `--cba-bg-secondary` and the border to
`--cba-border-default` so the button remains visible.

### State overlays

Solid variants (`primary`, `danger`, `success`) sit on dark accent backgrounds and use
**light inverse overlays** (`--cba-hover-inverse`, `--cba-active-inverse`) so the state
shift is perceptible. `secondary` sits on a light surface and keeps the dark overlays
(`--cba-hover`, `--cba-active`). `ghost` is transparent in normal state and sets the
overlay directly as its `background-color`.

| State | Solid variants (`primary` / `danger` / `success`) | `secondary` | `ghost` |
|-------|---------------------------------------------------|-------------|---------|
| normal | base tokens only | base tokens only | transparent bg, `--cba-text-primary` |
| hover | `linear-gradient(var(--cba-hover-inverse), var(--cba-hover-inverse))` over base bg | `linear-gradient(var(--cba-hover), var(--cba-hover))` over base bg | `background-color: var(--cba-hover)` |
| active | `linear-gradient(var(--cba-active-inverse), var(--cba-active-inverse))` over base bg | `linear-gradient(var(--cba-active), var(--cba-active))` over base bg | `background-color: var(--cba-active)` |
| disabled / loading | `opacity: 0.6`, `cursor: not-allowed`, preserve base tokens | same | same |

> **AI agent note:** the solid-variant styling (primary/danger/success) is consolidated in the `cba-solid-button($accent-color)` SCSS mixin in `src/components/button/cba-button.component.scss`. When adding a new solid variant, always use this mixin rather than inlining overlay tokens.

### Focus ring

All button variants MUST use
`:focus-visible { outline: none; box-shadow: var(--cba-focus-ring); }`.

## Surface Decision Tree

| You are styling... | Use this background token | Semantic name |
|--------------------|---------------------------|---------------|
| Shell workspace / workbench floor / page body behind modules | `--cba-bg-primary` | canvas |
| Module card body / floating panel / dialog body | `--cba-bg-secondary` | panel |
| Module or Shell header / dropdown / popover / modal / active or selected control fill | `--cba-bg-elevated` | elevated |
| Table header (`thead th`) / recessed well / module footer / status band | `--cba-bg-tertiary` | inset |
| Modal or dropdown backdrop | `--cba-bg-overlay` | overlay |

**Decision rule:**

1. Is the element the lowest visible layer behind modules? → **canvas**.
2. Is it a module card, floating panel, or dialog body? → **panel**.
3. Is it a header band, dropdown, popover, modal, or selected/active fill? → **elevated**.
4. Is it recessed, a table header, or a footer/status bar inside a module? → **inset**.
5. Never use the same background token for two adjacent hierarchical layers (e.g. do not
   make the workspace canvas the same color as the module panel).

## Text Color Rules

### Allowed text tokens by surface

| Surface | `--cba-text-primary` | `--cba-text-secondary` | `--cba-text-muted` | `--cba-text-inverse` |
|---------|----------------------|------------------------|--------------------|----------------------|
| canvas (`--cba-bg-primary`) | allowed | allowed | **RESTRICTED** — fails WCAG AA | allowed on accent bg only |
| panel (`--cba-bg-secondary`) | allowed | allowed | allowed | allowed on accent bg only |
| elevated (`--cba-bg-elevated`) | allowed | allowed | allowed | allowed on accent bg only |
| inset (`--cba-bg-tertiary`) | allowed | allowed | **RESTRICTED** — fails WCAG AA | allowed on accent bg only |
| accent bg (`--cba-accent-*`) | not used | not used | not used | **required** |

### Usage guidance

- Default body text: `--cba-text-primary`.
- Labels, meta-data, placeholders: `--cba-text-secondary`.
- Disabled hints, captions, tertiary meta-data: `--cba-text-muted` **only on panel or
  elevated**.
- Text on top of `--cba-accent-primary`, `--cba-accent-danger`, or `--cba-accent-success`:
  `--cba-text-inverse`.

## Bar and Chrome Guide

| Chrome element | Background | Border | Text | Height / min-height |
|----------------|------------|--------|------|---------------------|
| Shell header | `--cba-bg-elevated` | `border-bottom: 1px solid var(--cba-border-default)` | `--cba-text-primary` / `--cba-text-secondary` | `--cba-header-height` |
| Shell footer | `--cba-bg-elevated` | `border-top: 1px solid var(--cba-border-default)` | `--cba-text-primary` / `--cba-text-secondary` | `--cba-footer-height` |
| Module header | `--cba-bg-elevated` | `border-bottom: 1px solid var(--cba-border-default)` | `--cba-text-primary` / `--cba-text-secondary` | `--cba-module-header-min-height` |
| Module footer | `--cba-bg-tertiary` | `border-top: 1px solid var(--cba-border-default)` | `--cba-text-secondary` or status accent | auto |
| Footer section pill | `--cba-bg-secondary` | `border: 1px solid var(--cba-border-strong)` | `--cba-text-secondary` | auto |

Notes:

- Shell header: use `--cba-focus-ring` for focusable items.
- Shell footer: use `--cba-bg-elevated` so the chrome differs from the workspace canvas (`--cba-bg-primary`). This is the documented Shell choice and is required for visual hierarchy.
  Footer section pills use bg `--cba-bg-secondary`, border `--cba-border-strong`, and active
  border `--cba-accent-primary`.
- Module header: implemented by `cba-module-header`; do not recreate with custom CSS.
- Module footer: implemented by `cba-module-footer` if used; otherwise apply the same tokens.
- Footer section pill: active state uses `border-color: var(--cba-accent-primary)` and
  `color: var(--cba-text-primary)`.

## Selected State Usage

`--cba-selected-*` tokens express that an item is **actively chosen in a set**. Selected ≠ active(pressed) ≠ focus:

| State | Meaning | When to use |
|-------|---------|-------------|
| **selected** | Item is actively chosen in a set | Footer pills, nav tabs, table rows, dropdown options, filter chips |
| **active / pressed** | Momentary pointer-down state | While the pointer is held down on an interactive element |
| **focus** | Keyboard focus ring | Any focusable element receiving keyboard focus |

### Consumer recipes

- **Footer section pill selected:** `border-color: var(--cba-selected-border); background: var(--cba-selected-bg); color: var(--cba-selected-text);`
- **Nav / tab selected:** Same as pill, plus `font-weight: 600`.
- **Table row selected:** `background: var(--cba-selected-bg);` (border usually not applicable on rows).
- **Dropdown option selected:** `background: var(--cba-selected-bg); color: var(--cba-selected-text);`
- **Filter chip active:** `border-color: var(--cba-selected-border); background: var(--cba-selected-bg);`
- **Module "focused" chrome:** `outline: none; box-shadow: var(--cba-focus-ring);` (focus ring is the primary indicator, not selected tokens).

> **Rule:** Do not use `--cba-hover` or `--cba-active` as a substitute for selected. Hover is transient; selected is persistent.

## Form State Matrix

For Shell/MFE authors wiring form controls (`CbaInput`, `CbaSelect`, `CbaDatepicker`, and custom fields). Token values live in [`src/theme/_variables.scss`](../src/theme/_variables.scss); this table states *which token goes where*.

| State | Background | Border | Text | Cursor | Notes |
|-------|-----------|--------|------|--------|-------|
| default | `--cba-bg-secondary` | `--cba-border-default` | `--cba-text-primary` | default | Base state |
| hover | `--cba-bg-secondary` | `--cba-border-strong` | `--cba-text-primary` | pointer | Only where interactive (inputs, selects, datepicker toggles) |
| focus-visible | `--cba-bg-secondary` | `--cba-accent-primary` + `box-shadow: var(--cba-focus-ring)` | `--cba-text-primary` | default | Border change plus focus ring |
| disabled | `--cba-state-disabled-bg` | `--cba-border-subtle` | `--cba-state-disabled-text` | not-allowed | `opacity: 1` — use token colors for distinction, do not fade |
| readonly | `--cba-bg-tertiary` | `--cba-border-subtle` | `--cba-text-secondary` | default | Distinct from disabled: inset background, no opacity change |
| invalid | `--cba-bg-secondary` | `--cba-state-invalid-border` | `--cba-state-invalid-text` | default | Error message uses same text token |
| valid | `--cba-bg-secondary` | `--cba-state-valid-border` | `--cba-state-valid-text` | default | Optional visual confirmation |

**Wiring guidance:**

- `CbaFieldComponent` host classes: `.cba-field--disabled` → disabled tokens; `.cba-field--error` → invalid tokens; `.cba-field--readonly` → readonly tokens; `.cba-field--valid` → valid tokens.
- No validation engine is provided. States are driven by component inputs and/or CSS classes already in the API.
- Invalid/valid tokens reuse warmed danger/success hues — do not invent parallel reds/greens.

## Typography Scale Usage

Map UI context to the six-step scale. Token values live in [`src/theme/_variables.scss`](../src/theme/_variables.scss); utility classes in [`src/theme/_utilities.scss`](../src/theme/_utilities.scss).

| Context | Font size token | Line height token | Weight | Utility class |
|---------|----------------|-------------------|--------|---------------|
| Module title (prominent) | `--cba-font-size-heading-lg` | `--cba-line-height-heading-lg` | 600 | `.cba-text-heading-lg` |
| Module title / section title | `--cba-font-size-heading-md` | `--cba-line-height-heading-md` | 600 | `.cba-text-heading-md` |
| Table header | `--cba-font-size-small` | `--cba-line-height-small` | 600 (semibold) | `.cba-text-small` |
| Body text | `--cba-font-size-body` | `--cba-line-height-body` | 400 | `.cba-text-body` |
| Metadata / hints | `--cba-font-size-small` or `--cba-font-size-caption` | matching | 400 | `.cba-text-small` or `.cba-text-caption` |
| Display (rare) | `--cba-font-size-display` | `--cba-line-height-display` | 600 | `.cba-text-display` |

> **Rule:** Do not hard-code `font-size` pixel values. Use the utility classes or the `--cba-font-size-*` tokens. The base body size stays 14px (0.875rem).

## Table State Patterns

<!-- AI agent: For token definitions and the full token-level reference table, see
     THEME.md §Table State Patterns. Token values live in src/theme/_variables.scss. -->

Tables use the surface hierarchy plus selected/hover tokens for row states. For token definitions, see [THEME.md §Table State Patterns](THEME.md#table-state-patterns).

| Row state | Background | Border | Text |
|-----------|-----------|--------|------|
| default (body row) | `--cba-bg-secondary` (panel) | none | `--cba-text-primary` |
| hover | `--cba-hover` overlay on panel bg | none | `--cba-text-primary` |
| selected | `--cba-selected-bg` | none (or `--cba-selected-border` left accent) | `--cba-selected-text` |
| header (`thead th`) | `--cba-bg-tertiary` (inset) | bottom: `--cba-border-subtle` | `--cba-text-secondary` + semibold |

- `thead` = inset surface; body rows = panel surface.
- Selected row uses `--cba-selected-bg`; do not use `--cba-hover` as a substitute for selected.
- Disabled row (optional): `--cba-state-disabled-bg` + `--cba-state-disabled-text` + `cursor: not-allowed`.

## Navigation / Footer Pill State Patterns

<!-- AI agent: For token definitions and the full token-level reference table, see
     THEME.md §Navigation / Footer Pill State Patterns. Token values live in
     src/theme/_variables.scss. -->

Footer section pills and similar nav chips follow a four-state pattern. For token definitions, see [THEME.md §Navigation / Footer Pill State Patterns](THEME.md#navigation--footer-pill-state-patterns).

| State | Background | Border | Text |
|-------|-----------|--------|------|
| normal | `--cba-bg-secondary` | `--cba-border-strong` | `--cba-text-secondary` |
| hover | `--cba-bg-secondary` + `--cba-hover` overlay | `--cba-border-strong` | `--cba-text-primary` |
| selected | `--cba-selected-bg` | `--cba-selected-border` | `--cba-selected-text` |
| disabled | `--cba-state-disabled-bg` | `--cba-border-subtle` | `--cba-state-disabled-text` |

- Selected is visually stronger than hover — the border changes to `--cba-selected-border` (warm taupe) and the fill shifts to `--cba-selected-bg`.
- Do not use `--cba-accent-primary` fill for selected pills; the selected token set provides sufficient distinction.

## Semantic Status Patterns

<!-- AI agent: For token definitions and the full badge recipe table, see
     THEME.md §Semantic Status Patterns. Token values live in src/theme/_variables.scss. -->

Badge and inline status recipes for success / warning / danger / info / neutral. For token definitions, see [THEME.md §Semantic Status Patterns](THEME.md#semantic-status-patterns).

| Status | Accent token | Badge (solid) | Badge (outline) | Inline text |
|--------|-------------|---------------|-----------------|-------------|
| success | `--cba-accent-success` | bg: `--cba-accent-success`, text: `--cba-text-inverse` | border + text: `--cba-accent-success`, bg: transparent | `--cba-state-valid-text` |
| warning | `--cba-accent-warning` | bg: `--cba-accent-warning`, text: `--cba-text-inverse` | border + text: `--cba-accent-warning`, bg: transparent | `--cba-accent-warning` (on panel/elevated only) |
| danger | `--cba-accent-danger` | bg: `--cba-accent-danger`, text: `--cba-text-inverse` | border + text: `--cba-accent-danger`, bg: transparent | `--cba-state-invalid-text` |
| info | `--cba-accent-info` | bg: `--cba-accent-info`, text: `--cba-text-inverse` | border + text: `--cba-accent-info`, bg: transparent | `--cba-accent-info` |
| neutral | `--cba-accent-primary` (taupe) | bg: `--cba-accent-primary`, text: `--cba-text-inverse` | border + text: `--cba-accent-primary`, bg: transparent | `--cba-text-secondary` |

- **Warning vs danger:** warning is soft coral (`--cba-accent-warning`); danger is deeper red (`--cba-accent-danger`). Always pair with an icon or label to reinforce the distinction — do not rely on color alone.
- Solid badges use `--cba-text-inverse` on accent backgrounds. Outline badges use the accent token for border and text with transparent background.

## Shell checklist

- [ ] Workbench/workspace element uses `background: var(--cba-bg-primary)` (not raw
  `#fff` / Bootstrap gray).
- [ ] Modules are wrapped with `cba-module-container` (so border + shadow + panel bg apply).
- [ ] Module headers use `cba-module-header` (not a custom bar that ignores elevated).
- [ ] No global CSS that sets `background: #fff` on `.card`, `main`, or module wrappers.
- [ ] Footer pills use visible border (`--cba-border-strong` or default) against canvas.
- [ ] Avoid painting the entire shell with `--cba-bg-secondary` (kills canvas/module
  contrast).

### ModuleHeader drag handle

The Shell can project an optional drag handle into `cba-module-header` via the
`[cbaModuleDragHandle]` attribute-projection slot:

- Project a native `<button type="button" cbaModuleDragHandle cdkDragHandle>` as a
  child of `<cba-module-header>`.
- Apply `cdkDrag` on an **ancestor the Shell controls** (the wrapper around
  `cba-module-container`) and `cdkDragHandle` on the projected element.
- Apply `class="cba-module-header__action cba-module-header__action--drag"` on the
  projected button to inherit the library's action-button sizing, hover/active
  states, focus ring, and grab cursor — no `::ng-deep` needed.
- The slot is hidden in fullscreen mode along with the other actions.
- The Shell **must** provide the accessible name (`aria-label="Arrastrar módulo"`).
- Full example: see [`CBA_MODULE_HEADER.md` §Drag handle slot](./CBA_MODULE_HEADER.md#drag-handle-slot).

## MFE checklist

- [ ] Prefer lib components (`cba-button`, `cba-card`, form wrappers) over unthemed Bootstrap.
- [ ] Tables: thead/th use `--cba-bg-tertiary` + `--cba-text-secondary` (muted is
  restricted on inset).
- [ ] Do not hard-code hex; use `var(--cba-*)` or `.cba-*` utilities.
- [ ] Do not import a second design system that overrides `:root`.

## Anti-patterns

- Same background on workspace and module body.
- Using only `--cba-border-subtle` for important chrome on cream/sand. Use `--cba-border-default` for structural edges and `--cba-border-strong` for interactive outlines.
- Large coral backgrounds.
- Hard-coded colors that fight tokens.
- Secondary buttons that collapse into their panel or active state. Keep the elevated/panel
  separation visible and use a distinct token/overlay for active.
- Expecting ModuleContainer to style the Shell workspace (it only styles the module card).
- Using `--cba-hover` or `--cba-active` as a substitute for `--cba-selected-*`. Hover is transient; selected is persistent.
- Using `--cba-text-muted` on canvas (`--cba-bg-primary`) or inset (`--cba-bg-tertiary`). Both fail WCAG AA. Use `--cba-text-secondary` on those surfaces.
- Inventing parallel reds/greens for form validation. Reuse `--cba-state-invalid-*` and `--cba-state-valid-*` tokens which reuse warmed accent hues.
- Hard-coding `font-size` pixel values instead of using the typography scale tokens or `.cba-text-*` utility classes.
- Using `border-radius` values other than `sm`/`md`/`lg`/`pill` (999px). The four values cover all cases.
- Asking `@cobranza-apps/ui` to implement drag-and-drop or to depend on `@angular/cdk`. The Library exposes the `[cbaModuleDragHandle]` projection slot; the Shell owns DnD. See [`CBA_MODULE_HEADER.md` §Drag handle slot](./CBA_MODULE_HEADER.md#drag-handle-slot).

## Quick verify

After integration, confirm:

1. Canvas darker/more sand than module body (canvas→panel ≈ 20 L\*).
2. Module has visible edge (border and/or shadow). Border is the primary separator.
3. Header band ≠ body (elevated ≈ 5 L\* lighter than panel).
4. Table header sand inset (inset ≈ 13 L\* darker than panel).
5. Footer pills readable with `--cba-border-strong` outline.
6. Secondary buttons differ from their panel and from their active/pressed state.
7. Selected state (pill, nav tab, table row) uses `--cba-selected-*` tokens — distinct from hover.
8. Form controls show distinct disabled / readonly / invalid states.
9. Typography uses the scale (`.cba-text-*` utilities or `--cba-font-size-*` tokens), not hard-coded pixel sizes.
10. **Demo app as canonical visual reference** — the Angular mini-app at `projects/demo/` is the visual source of truth for components and tokens. It consumes the **built** library (`dist/`), never deep `src/` imports, so it renders exactly what Shell sees. Order of commands: `npm run build:lib` (emits `dist/`) → `npm install` (materializes `node_modules/@cobranza-apps/ui` from `file:./dist`) → `npm run start:demo` (dev server at `http://localhost:4200/`) or `npm run build:demo` → serve `dist/demo/browser/`. `start:demo` does **not** rebuild the library — re-run `build:lib` after library changes, then refresh. Compare Shell rendering against this demo app, not against outdated screenshots of the deleted static HTML preview.

## Cross-References

- [Theme Reference](THEME.md) — token groups, utility class catalog, mixins.
- [Usage Guide](USAGE.md) — install, peer deps, per-component usage patterns.
- [Project Brief §5](../.agent/project-info/brief.md#5-design-tokens-theme) — authoritative token values.
- [Project Brief §8](../.agent/project-info/brief.md#8-integration-notes) — Shell ↔ MFE integration notes.
- [`src/theme/_variables.scss`](../src/theme/_variables.scss) — token source of truth.
