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
- [Shell checklist](#shell-checklist)
- [MFE checklist](#mfe-checklist)
- [Anti-patterns](#anti-patterns)
- [Quick verify](#quick-verify)
- [Cross-References](#cross-references)

## Token Compliance Mandate

AI agents generating Shell or MFE code MUST use `--cba-*` tokens for at least 90 % of all
color and style declarations.

- Prefer `var(--cba-*)` or the opt-in `.cba-*` utility classes.
- Hard-coded hex values, RGB/RGBA literals, or Bootstrap default colors are not allowed
  except for one-off edge cases.
- Every edge-case hard-coded value MUST be documented with a `TODO` comment explaining why
  the token cannot be used and linking to this guide.
- If a needed color does not exist as a token, do not invent a new hex value — open a task
  to extend the theme.

Token values are authoritative in
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
base tokens plus an overlay (`--cba-hover` or `--cba-active`). Disabled and loading
states share one treatment: `opacity: 0.6` and `cursor: not-allowed`.

### Variant × surface base mapping

| Variant | Surface | Background | Border | Text |
|---------|---------|------------|--------|------|
| `primary` | panel | `--cba-accent-primary` | transparent | `--cba-text-inverse` |
| `primary` | elevated | `--cba-accent-primary` | transparent | `--cba-text-inverse` |
| `primary` | canvas | `--cba-accent-primary` | transparent | `--cba-text-inverse` |
| `secondary` | panel | `--cba-bg-elevated` | `--cba-border-subtle` | `--cba-text-primary` |
| `secondary` | elevated | `--cba-bg-secondary` | `--cba-border-default` | `--cba-text-primary` |
| `secondary` | canvas | `--cba-bg-elevated` | `--cba-border-subtle` | `--cba-text-primary` |
| `ghost` | panel | transparent | transparent | `--cba-text-primary` |
| `ghost` | elevated | transparent | transparent | `--cba-text-primary` |
| `ghost` | canvas | transparent | transparent | `--cba-text-primary` |
| `danger` | panel | `--cba-accent-danger` | transparent | `--cba-text-inverse` |
| `danger` | elevated | `--cba-accent-danger` | transparent | `--cba-text-inverse` |
| `danger` | canvas | `--cba-accent-danger` | transparent | `--cba-text-inverse` |
| `success` | panel | `--cba-accent-success` | transparent | `--cba-text-inverse` |
| `success` | elevated | `--cba-accent-success` | transparent | `--cba-text-inverse` |
| `success` | canvas | `--cba-accent-success` | transparent | `--cba-text-inverse` |

**Rationale for `secondary` on elevated:** the component's default secondary fill is
`--cba-bg-elevated`. When the button sits on an already-elevated surface, swap the fill
to `--cba-bg-secondary` and strengthen the border to `--cba-border-default` so the button
remains visible.

### State overlays

| State | Solid variants (`primary`, `danger`, `success`) | `secondary` | `ghost` |
|-------|--------------------------------------------------|-------------|---------|
| normal | base tokens only | base tokens only | transparent bg, `--cba-text-primary` |
| hover | `background-image: linear-gradient(var(--cba-hover), var(--cba-hover))` over base bg | same as solid variants | `background-color: var(--cba-hover)` |
| active | `background-image: linear-gradient(var(--cba-active), var(--cba-active))` over base bg | same as solid variants | `background-color: var(--cba-active)` |
| disabled / loading | `opacity: 0.6`, `cursor: not-allowed`, preserve base tokens | same as solid variants | same as solid variants |

### Focus ring

All button variants MUST use
`:focus-visible { outline: none; box-shadow: var(--cba-focus-ring); }`.

## Surface Decision Tree

| You are styling... | Use this background token | Semantic name |
|--------------------|---------------------------|---------------|
| Shell workspace / workbench floor / page body behind modules | `--cba-bg-primary` | canvas |
| Module card body / floating panel / dialog body | `--cba-bg-secondary` | panel |
| Module header / Shell header / dropdown menu / popover / modal surface / active/selected control fill | `--cba-bg-elevated` | elevated |
| Table header (`thead th`) / recessed well / module footer / status band | `--cba-bg-tertiary` | inset |
| Modal/dropdown backdrop | `--cba-bg-overlay` | overlay |

**Decision rule:**

1. Is the element the lowest visible layer behind modules? → **canvas**.
2. Is it a module card, floating panel, or dialog body? → **panel**.
3. Is it a header band, dropdown, popover, modal, or selected/active fill that must read
   lighter than its container? → **elevated**.
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
- On canvas and inset, do not use `--cba-text-muted`. Use `--cba-text-secondary` for
  lower-emphasis text instead.

## Bar and Chrome Guide

| Chrome element | Background | Border | Text | Height / min-height | Notes |
|----------------|------------|--------|------|---------------------|-------|
| Shell header | `--cba-bg-elevated` | `border-bottom: 1px solid var(--cba-border-default)` | `--cba-text-primary` for brand, `--cba-text-secondary` for muted items | `--cba-header-height` (56px) | Use `--cba-focus-ring` for focusable items. |
| Shell footer | `--cba-bg-primary` (recommended) OR `--cba-bg-elevated` (documented Shell choice) | `border-top: 1px solid var(--cba-border-default)` | `--cba-text-primary` / `--cba-text-secondary` | `--cba-footer-height` (64px) | Footer section pills: bg `--cba-bg-secondary`, border `--cba-border-strong`, active pill border `--cba-accent-primary`. |
| Module header | `--cba-bg-elevated` | `border-bottom: 1px solid var(--cba-border-default)` | `--cba-text-primary` for title, `--cba-text-secondary` for actions | `--cba-module-header-min-height` (40px) | Implemented by `cba-module-header`; do not recreate with custom CSS. |
| Module footer | `--cba-bg-tertiary` | `border-top: 1px solid var(--cba-border-default)` | `--cba-text-secondary` or status accent | auto | Implemented by `cba-module-footer` if used; otherwise apply same tokens. |
| Footer section pill | `--cba-bg-secondary` | `border: 1px solid var(--cba-border-strong)` | `--cba-text-secondary` | auto | Active pill: `border-color: var(--cba-accent-primary)`, `color: var(--cba-text-primary)`. |

## Shell checklist

- [ ] Workbench/workspace element uses `background: var(--cba-bg-primary)` (not raw
  `#fff` / Bootstrap gray).
- [ ] Modules are wrapped with `cba-module-container` (so border + shadow + panel bg apply).
- [ ] Module headers use `cba-module-header` (not a custom bar that ignores elevated).
- [ ] No global CSS that sets `background: #fff` on `.card`, `main`, or module wrappers.
- [ ] Footer pills use visible border (`--cba-border-strong` or default) against canvas.
- [ ] Avoid painting the entire shell with `--cba-bg-secondary` (kills canvas/module
  contrast).

## MFE checklist

- [ ] Prefer lib components (`cba-button`, `cba-card`, form wrappers) over unthemed Bootstrap.
- [ ] Tables: thead/th use `--cba-bg-tertiary` + `--cba-text-secondary` (muted is
  restricted on inset).
- [ ] Do not hard-code hex; use `var(--cba-*)` or `.cba-*` utilities.
- [ ] Do not import a second design system that overrides `:root`.

## Anti-patterns

- Same background on workspace and module body.
- Using only `--cba-border-subtle` for important chrome on cream/sand.
- Large coral backgrounds.
- Hard-coded colors that fight tokens.
- Secondary buttons that collapse into their panel or active state. Keep the elevated/panel
  separation visible and use a distinct token/overlay for active.
- Expecting ModuleContainer to style the Shell workspace (it only styles the module card).

## Quick verify

After integration, confirm:

1. Canvas darker/more sand than module body.
2. Module has visible edge (border and/or shadow).
3. Header band ≠ body.
4. Table header sand inset.
5. Footer pills readable.
6. Secondary buttons differ from their panel and from their active/pressed state.

## Cross-References

- [Theme Reference](THEME.md) — token groups, utility class catalog, mixins.
- [Usage Guide](USAGE.md) — install, peer deps, per-component usage patterns.
- [Project Brief §5](../.agent/project-info/brief.md#5-design-tokens-theme) — authoritative token values.
- [Project Brief §8](../.agent/project-info/brief.md#8-integration-notes) — Shell ↔ MFE integration notes.
- [`src/theme/_variables.scss`](../src/theme/_variables.scss) — token source of truth.
