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

How to integrate the **Minimal Yet Warm** theme so the four-level surface hierarchy
(canvas → panel → elevated → inset) reads correctly in the running Shell. This guide is
normative for **Shell** and **MFE** authors (and AI agents generating those apps).

Authoritative token values live in [`brief.md §5`](../.agent/project-info/brief.md#5-design-tokens-theme)
and [`src/theme/_variables.scss`](../src/theme/_variables.scss). This guide only states
*who applies which token where*; it never re-declares hex values.

## Table of Contents

- [Theme load (once)](#theme-load-once)
- [Surface ownership map](#surface-ownership-map)
- [Shell checklist](#shell-checklist)
- [MFE checklist](#mfe-checklist)
- [Anti-patterns](#anti-patterns)
- [Quick verify](#quick-verify)
- [Cross-References](#cross-references)

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
- Expecting ModuleContainer to style the Shell workspace (it only styles the module card).

## Quick verify

After integration, confirm:

1. Canvas darker/more sand than module body.
2. Module has visible edge (border and/or shadow).
3. Header band ≠ body.
4. Table header sand inset.
5. Footer pills readable.

## Cross-References

- [Theme Reference](THEME.md) — token groups, utility class catalog, mixins.
- [Usage Guide](USAGE.md) — install, peer deps, per-component usage patterns.
- [Project Brief §5](../.agent/project-info/brief.md#5-design-tokens-theme) — authoritative token values.
- [Project Brief §8](../.agent/project-info/brief.md#8-integration-notes) — Shell ↔ MFE integration notes.
- [`src/theme/_variables.scss`](../src/theme/_variables.scss) — token source of truth.
