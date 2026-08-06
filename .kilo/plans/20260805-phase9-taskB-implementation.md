# Phase 9 — Task B (Tasks 6–7) Implementation Plan

**Scope:** Consumer guide creation + docs sync for `@cobranza-apps/ui` Phase 9.
**Authoritative token source:** `src/theme/_variables.scss` (read 2026-08-05; values below).
**Depends on:** Task A (token tuning + theme preview) already complete & verified.
**Out of scope (other tasks):** token value edits, `theme-preview.html`, component wiring, build runs, lint, git. This plan covers **docs only** (Tasks 6 & 7).
**No console commands required** for this plan (docs edits only). Implementer commits at the end per critical-workflow step 4.2.

---

## 0. Pre-flight (implementer, before first edit)

1. Read `.kilo/rules/gitignore-compliance.md`, then run `git status`. Confirm clean tree (or that pending changes belong to Task A and are committed). Do NOT stage `.gitignore`-matching files.
2. Confirm working on the Phase 9 feature branch created in step 4.2 of the global plan (e.g. `feat/phase9-hierarchy-consumer-guide`). Do not create a new branch here.
3. Re-read authoritative token values from `src/theme/_variables.scss` —_do NOT trust brief.md §5 (it still has OLD values; this plan fixes that).

### 0.1 Authoritative token values (from `src/theme/_variables.scss`, read 2026-08-05)

| Token | Value (authoritative) |
| ----- | --------------------- |
| `--cba-bg-primary` (canvas) | `#C5BFAE` |
| `--cba-bg-secondary` (panel) | `#F2F0E8` |
| `--cba-bg-tertiary` (inset) | `#D8C3A5` |
| `--cba-bg-elevated` | `#FDFCF8` |
| `--cba-bg-overlay` | `rgba(43, 38, 32, 0.45)` |
| `--cba-text-primary` | `#2B2620` |
| `--cba-text-secondary` | `#4A4640` |
| `--cba-text-muted` | `#625C55` |
| `--cba-text-inverse` | `#FDFCF8` |
| `--cba-border-subtle` | `#DAD7CA` |
| `--cba-border-default` | `#A7A6A2` |
| `--cba-border-strong` | `#8E8D8A` |
| `--cba-accent-primary` | `#6B5B4F` |
| `--cba-accent-success` | `#3E6B4F` |
| `--cba-accent-warning` | `#E98074` |
| `--cba-accent-danger` | `#B93E36` |
| `--cba-accent-info` | `#56717E` |
| `--cba-hover` | `rgba(43, 38, 32, 0.06)` |
| `--cba-active` | `rgba(43, 38, 32, 0.10)` |
| `--cba-focus-ring` | `0 0 0 3px rgba(232, 90, 79, 0.45)` |
| `--cba-shadow-module` | `0 6px 24px rgba(43, 34, 28, 0.18)` |
| `--cba-shadow-elevated` | `0 10px 32px rgba(43, 34, 28, 0.26)` |

Hierarchy notes for docs (already in `_variables.scss` header): canvas → panel step ≈ 17 L\*; panel → elevated ≈ 4 L\*; inset sits ≈ 15 L\* below panel. Muted text is RESTRICTED on the darker canvas (`#C5BFAE`, ~3.6:1) AND on `--cba-bg-tertiary` (inset sand, ~3.86:1); use `--cba-text-secondary` on those surfaces.

---

## Task 6 — Create `docs/CONSUMER_GUIDE.md`

### Step 6.1 — Create the file

**Action:** Create new file `docs/CONSUMER_GUIDE.md` (does not exist). Use `vscode-mcp-server_create_file_code` (new file >10 lines).

**Full content to write** (use real newlines, per newline-prevention rule):

````markdown
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
````

### Step 6.2 — Verify created file

- `vscode-mcp-server_list_files_code` on `docs/` → confirm `CONSUMER_GUIDE.md` is present.
- `vscode-mcp-server_get_diagnostics_code` on `docs/CONSUMER_GUIDE.md` (severity 0,1) → expect no issues (markdown).
- Confirm the markdown code fences inside the SCSS/CSS blocks are properly closed (` ``` ` pairs balance) by reading the file back.

---

## Task 7 — Docs sync

### Step 7.1 — `docs/INDEX.md`: add CONSUMER_GUIDE entry

**File:** `docs/INDEX.md`
**Section:** `## Getting started` (lines 5–8 currently).
**Change:** insert a new bullet for the consumer guide, keep alphabetical-style placement near THEME.

**Before (current lines 5–8):**
```markdown
## Getting started

- [USAGE.md](./USAGE.md) — Install, peer deps, theme import, quick start, per-component usage patterns.
- [THEME.md](./THEME.md) — Theme import, design tokens, utility classes.
```

**After:**
```markdown
## Getting started

- [USAGE.md](./USAGE.md) — Install, peer deps, theme import, quick start, per-component usage patterns.
- [THEME.md](./THEME.md) — Theme import, design tokens, utility classes.
- [CONSUMER_GUIDE.md](./CONSUMER_GUIDE.md) — Shell & MFE integration rules: theme load (once), surface ownership map, checklists, anti-patterns, quick verify.
```

Use `vscode-mcp-server_replace_lines_code` for lines 7–8 (the THEME.md line + insertion), with `originalCode` = the existing THEME.md bullet, `content` = THEME.md bullet + newline + CONSUMER_GUIDE bullet.

### Step 7.2 — `docs/THEME.md`: add surface hierarchy note + pointer

**File:** `docs/THEME.md`
**Section:** add a short note right after the `## Importing the Theme` section body and before `## Token Prefix`. To keep the diff minimal and the TOC stable, insert a new short subsection `### Surface hierarchy` under `## Importing the Theme` (the existing TOC entries anchor on `##` headings, so a `###` under an existing `##` does not break the TOC).

**Insertion point:** after the bullet list ending at line 44 (`... the canonical form is '@cobranza-apps/ui/theme'.`) and before `## Token Prefix` (line 46).

**Inserted block (new `### Surface hierarchy` subsection):**
```markdown

### Surface hierarchy

Minimal Yet Warm is a **four-level surface system**: canvas (`--cba-bg-primary`,
darker warm sand; workspace floor) → panel (`--cba-bg-secondary`, clean cream; module
body) → elevated (`--cba-bg-elevated`, warm near-white; module header / dropdowns) →
inset (`--cba-bg-tertiary`, warm sand; table headers / wells). The hierarchy only
survives in the running Shell if **each surface is painted by its owner** (Shell / Lib /
MFE). See the [Consumer Guide](CONSUMER_GUIDE.md) for the surface ownership map and the
Shell/MFE checklists.
```

Use `vscode-mcp-server_replace_lines_code` (or `create_file_code` rewrite only if replace fails) targeting the blank line at line 45 between the importing section and `## Token Prefix`. `originalCode` = `\n## Token Prefix` (the blank line plus the heading); `content` = the new `### Surface hierarchy` block + `\n## Token Prefix`.

### Step 7.3 — `README.md`: fix live theme name + add consumer guide link

The README still calls the system "intermediate-gray" in three places (lines 8, 27, 32). Replace each occurrence with **Minimal Yet Warm** and wire the consumer guide into the **Integration Notes** and **Documentation** sections.

**Three text replacements (`replaceAll=true` is NOT safe because surrounding context differs; do three targeted edits):**

#### 7.3a — Line 8 subtitle

**Before:**
```markdown
Shared Angular component library & intermediate-gray design system for the Cobranza App Company Back-office.
```
**After:**
```markdown
Shared Angular component library & Minimal Yet Warm design system for the Cobranza App Company Back-office.
```

#### 7.3b — Line 27 (Overview body)

**Before:**
```markdown
`@cobranza-apps/ui` is the shared visual foundation for the Company Back-office Shell and every MFE. It provides a single source of truth for the intermediate-gray design system and removes duplicated UI effort.
```
**After:**
```markdown
`@cobranza-apps/ui` is the shared visual foundation for the Company Back-office Shell and every MFE. It provides a single source of truth for the Minimal Yet Warm design system and removes duplicated UI effort.
```

#### 7.3c — Line 32 (Theme bullet)

**Before:**
```markdown
- **Theme** — Full intermediate-gray design tokens (CSS variables + utility classes + optional SCSS mixins).
```
**After:**
```markdown
- **Theme** — Full Minimal Yet Warm design tokens (CSS variables + utility classes + optional SCSS mixins).
```

#### 7.3d — Integration Notes section: add consumer guide pointer

**File:** `README.md`, section `## Integration Notes (Shell ↔ MFE)` (lines 204–212).
**Before (final bullet of that section, line 212):**
```markdown
- **Drag-and-drop is not part of this library** — it is owned by the Shell and `mfe-events`.
```
**After (append a new bullet after it):**
```markdown
- **Drag-and-drop is not part of this library** — it is owned by the Shell and `mfe-events`.
- **Surface hierarchy is a shared contract** — Shell, Lib, and MFE each own specific
  surfaces (canvas / panel / elevated / inset). Follow the
  [Consumer Guide](./docs/CONSUMER_GUIDE.md) so the four-level hierarchy reads in the
  running Shell.
```

#### 7.3e — Documentation section: add consumer guide entry

**File:** `README.md`, section `## Documentation` (starts line 217).
**Anchor:** add a new bullet for `CONSUMER_GUIDE.md` immediately after the THEME.md bullet (line 221).

**Before (line 221):**
```markdown
- [`./docs/THEME.md`](./docs/THEME.md) — Theme import, tokens, and utility classes.
```
**After:**
```markdown
- [`./docs/THEME.md`](./docs/THEME.md) — Theme import, tokens, and utility classes.
- [`./docs/CONSUMER_GUIDE.md`](./docs/CONSUMER_GUIDE.md) — Shell & MFE integration rules: theme load (once), surface ownership map, Shell/MFE checklists, anti-patterns, quick verify.
```

Use targeted `vscode-mcp-server_replace_lines_code` (or `edit`) for each of the five sub-edits. After edits, `vscode-mcp-server_get_diagnostics_code` on `README.md` → expect no errors.

### Step 7.4 — `CHANGELOG.md`: add 0.10.0 entry

**File:** `CHANGELOG.md`
**Insert location:** a new `## [0.10.0] - 2026-08-05` section **immediately above** the existing `## [0.9.0] - 2026-08-04` section (between line 30 `> Releases prior...` and line 31 `## [0.9.0] - 2026-08-04`).

Per TODO §7: do NOT use `[Unreleased]` / "unpublished" tags — version 0.10.0 ships on push to origin, dated today (2026-08-05).

**Insert block:**
```markdown
## [0.10.0] - 2026-08-05

### Changed

- Widened the **Minimal Yet Warm** surface hierarchy in `src/theme/_variables.scss` so
  all four surfaces are obviously distinct: canvas darkened to `#C5BFAE` (warm sand
  floor), panel refined to `#F2F0E8` (clean cream), elevated to `#FDFCF8` (warm
  near-white), inset kept at `#D8C3A5` (warm sand). Canvas → panel step ≈ 17 L*,
  panel → elevated ≈ 4 L*, inset sits ≈ 15 L* below panel.
- Strengthened borders on cream/sand: `--cba-border-subtle` now `#DAD7CA` (was
  `#E7E5DE`); `--cba-border-default` `#A7A6A2` and `--cba-border-strong` `#8E8D8A`
  confirmed for inputs, footer pills, and header icon-button outlines.
- Increased warm-tinted module shadows: `--cba-shadow-module` now
  `0 6px 24px rgba(43, 34, 28, 0.18)` (was `0 4px 16px ... 0.12`);
  `--cba-shadow-elevated` now `0 10px 32px rgba(43, 34, 28, 0.26)` (was
  `0 8px 24px ... 0.18`). Modules visibly lift off the warm canvas without harsh black
  bloom.
- README now refers to the design system as **Minimal Yet Warm** (was
  "intermediate-gray"); no behavioral change.

### Added

- `docs/CONSUMER_GUIDE.md` — normative Shell & MFE integration guide: theme load
  (once), surface ownership map (Shell / Lib / MFE), Shell checklist (6 items), MFE
  checklist (4 items), anti-patterns (5), quick visual verify (5 steps).
- `docs/THEME.md` surface-hierarchy note pointing to the Consumer Guide.
- Cross-links from `docs/INDEX.md`, `README.md` (Integration Notes + Documentation), and
  `docs/THEME.md` to the new Consumer Guide.

### Notes

- **No token names renamed, added, or removed** — only values and docs changed.
  Build/lint pass; consumers of `--cba-*` tokens get the new hierarchy by upgrading.
- **Potential visual breaking change for Shell layouts** that depended on near-identical
  surfaces (canvas vs panel both ~#EAE7DC/#F3F1E9). After upgrade the canvas is clearly
  sand and modules lift as cards; Shell authors should review the Consumer Guide and
  confirm the workspace uses `--cba-bg-primary`. See
  [docs/CONSUMER_GUIDE.md](docs/CONSUMER_GUIDE.md).
- Authoritative token values: [brief.md §5](.agent/project-info/brief.md#5-design-tokens-theme)
  and [`src/theme/_variables.scss`](src/theme/_variables.scss).
- `--cba-text-muted` is now RESTRICTED on the darker canvas (`#C5BFAE`, ~3.6:1) in
  addition to `--cba-bg-tertiary` (~3.86:1); use `--cba-text-secondary` on those
  surfaces.

```

**Important:** the inserted block must end with a single blank line so there is exactly one blank line between the new `### Notes` block and the existing `## [0.9.0] - 2026-08-04` heading. Use `vscode-mcp-server_replace_lines_code` with `originalCode` = `> Releases prior to 0.8.1 predate this changelog and are not reconstructed retroactively.\n\n## [0.9.0] - 2026-08-04` and `content` = same prefix + new `## [0.10.0]` block + `## [0.9.0] - 2026-08-04`.

### Step 7.5 — `.agent/project-info/brief.md` §5: update token values + muted restriction

The brief §5 codefence (lines 103–158) and the prose around it currently hold OLD values (`#EAE7DC` canvas, `#F3F1E9` panel, `#FCFBF6` elevated, `#E7E5DE` subtle, old shadow strings). Update to authoritative values.

**Two edits:**

#### 7.5a — Note prose (lines 100–101)

**Before (line 101):**
```markdown
> **Note:** The palette is **Minimal Yet Warm** (warm sand/cream/taupe + controlled coral). Canvas `#EAE7DC`, panel `#F3F1E9`, elevated `#FCFBF6`, inset `#D8C3A5`. Coral (`#E98074` soft, `#E85A4F` strong) is reserved for accent/status/focus — NOT for primary CTAs or large fills. Primary text on panel/elevated and primary/secondary text on every intended surface meet WCAG AA 4.5:1. Muted text on `--cba-bg-tertiary` (inset sand) is ~3.86:1 — use `--cba-text-secondary` on inset.
```

**After:**
```markdown
> **Note:** The palette is **Minimal Yet Warm** (warm sand/cream/taupe + controlled coral). Canvas `#C5BFAE` (warm sand floor), panel `#F2F0E8` (clean cream), elevated `#FDFCF8` (warm near-white), inset `#D8C3A5` (warm sand). Canvas → panel step ≈ 17 L\*, panel → elevated ≈ 4 L\*, inset sits ≈ 15 L\* below panel. Coral (`#E98074` soft, `#E85A4F` strong) is reserved for accent/status/focus — NOT for primary CTAs or large fills. Primary/secondary text pass WCAG AA on every intended surface. Muted text is RESTRICTED on the darker canvas (`#C5BFAE`, ~3.6:1) AND on `--cba-bg-tertiary` (inset sand, ~3.86:1) — use `--cba-text-secondary` on those surfaces.
```

#### 7.5b — Codefence values (lines 104–158)

Replace the `:root { ... }` block with the authoritative values. The section comment and order must match `src/theme/_variables.scss`. Use `vscode-mcp-server_replace_lines_code` over the whole codefence (lines 104–158) — easiest correct approach.

**Before (full codefence, lines 104–158):**
````markdown
```scss
:root {
  /* Backgrounds — warm Minimal-Yet-Warm surface scale (canvas → panel → elevated → inset) */
  --cba-bg-primary: #EAE7DC;
  --cba-bg-secondary: #F3F1E9;
  --cba-bg-tertiary: #D8C3A5;
  --cba-bg-elevated: #FCFBF6;
  --cba-bg-overlay: rgba(43, 38, 32, 0.45);

  /* Text — warm near-black/taupe; muted restricted on bg-tertiary (see header) */
  --cba-text-primary: #2B2620;
  --cba-text-secondary: #4A4640;
  --cba-text-muted: #625C55;
  --cba-text-inverse: #FDFCF8;

  /* Borders — visible on cream/sand */
  --cba-border-subtle: #E7E5DE;
  --cba-border-default: #A7A6A2;
  --cba-border-strong: #8E8D8A;

  /* Accents — primary is warm taupe (NOT coral); coral reserved for status/focus */
  --cba-accent-primary: #6B5B4F;
  --cba-accent-success: #3E6B4F;
  --cba-accent-warning: #E98074;
  --cba-accent-danger: #B93E36;
  --cba-accent-info: #56717E;

  /* Interactive states — warm taupe overlays + warm coral focus ring */
  --cba-hover: rgba(43, 38, 32, 0.06);
  --cba-active: rgba(43, 38, 32, 0.10);
  --cba-focus-ring: 0 0 0 3px rgba(232, 90, 79, 0.45);

  /* Layout (unchanged) */
  --cba-header-height: 56px;          /* Shell header */
  --cba-footer-height: 64px;          /* Shell footer */
  --cba-module-header-min-height: 40px;

  /* Radius (unchanged) */
  --cba-radius-sm: 6px;
  --cba-radius-md: 10px;
  --cba-radius-lg: 14px;

  /* Shadows — warm-tinted, softer than black */
  --cba-shadow-module: 0 4px 16px rgba(43, 34, 28, 0.12);
  --cba-shadow-elevated: 0 8px 24px rgba(43, 34, 28, 0.18);

  /* Spacing (unchanged) */
  --cba-space-1: 4px;
  --cba-space-2: 8px;
  --cba-space-3: 12px;
  --cba-space-4: 16px;
  --cba-space-5: 20px;
  --cba-space-6: 24px;
  --cba-space-8: 32px;
}
```
````

**After (authoritative values, matching `src/theme/_variables.scss`):**
````markdown
```scss
:root {
  /* Backgrounds — warm Minimal-Yet-Warm surface scale (canvas → panel → elevated → inset) */
  --cba-bg-primary: #C5BFAE;
  --cba-bg-secondary: #F2F0E8;
  --cba-bg-tertiary: #D8C3A5;
  --cba-bg-elevated: #FDFCF8;
  --cba-bg-overlay: rgba(43, 38, 32, 0.45);

  /* Text — warm near-black/taupe; muted restricted on darker canvas and bg-tertiary (see header) */
  --cba-text-primary: #2B2620;
  --cba-text-secondary: #4A4640;
  --cba-text-muted: #625C55;
  --cba-text-inverse: #FDFCF8;

  /* Borders — visible on cream/sand */
  --cba-border-subtle: #DAD7CA;
  --cba-border-default: #A7A6A2;
  --cba-border-strong: #8E8D8A;

  /* Accents — primary is warm taupe (NOT coral); coral reserved for status/focus */
  --cba-accent-primary: #6B5B4F;
  --cba-accent-success: #3E6B4F;
  --cba-accent-warning: #E98074;
  --cba-accent-danger: #B93E36;
  --cba-accent-info: #56717E;

  /* Interactive states — warm taupe overlays + warm coral focus ring */
  --cba-hover: rgba(43, 38, 32, 0.06);
  --cba-active: rgba(43, 38, 32, 0.10);
  --cba-focus-ring: 0 0 0 3px rgba(232, 90, 79, 0.45);

  /* Layout (unchanged) */
  --cba-header-height: 56px;          /* Shell header */
  --cba-footer-height: 64px;          /* Shell footer */
  --cba-module-header-min-height: 40px;

  /* Radius (unchanged) */
  --cba-radius-sm: 6px;
  --cba-radius-md: 10px;
  --cba-radius-lg: 14px;

  /* Shadows — warm-tinted, softer than black */
  --cba-shadow-module: 0 6px 24px rgba(43, 34, 28, 0.18);
  --cba-shadow-elevated: 0 10px 32px rgba(43, 34, 28, 0.26);

  /* Spacing (unchanged) */
  --cba-space-1: 4px;
  --cba-space-2: 8px;
  --cba-space-3: 12px;
  --cba-space-4: 16px;
  --cba-space-5: 20px;
  --cba-space-6: 24px;
  --cba-space-8: 32px;
}
```
````

#### 7.5c — Muted restriction paragraph (line 160)

**Before (line 160):**
```markdown
**`--cba-text-muted` usage restriction:** `#625C55` ≈ passes WCAG AA 4.5:1 on `--cba-bg-primary` (canvas, ~5.33:1), `--cba-bg-secondary` (panel, ~5.84:1) and `--cba-bg-elevated` (cream, ~6.37:1). It is RESTRICTED on `--cba-bg-tertiary` (inset sand, ~3.86:1 — fails AA). Prefer `--cba-text-secondary` on `--cba-bg-tertiary` for lower-emphasis text.
```

**After:**
```markdown
**`--cba-text-muted` usage restriction:** `#625C55` passes WCAG AA 4.5:1 on `--cba-bg-secondary` (panel) and `--cba-bg-elevated` (cream). It is RESTRICTED on the darker canvas `--cba-bg-primary` (`#C5BFAE`, ~3.6:1 — fails AA) AND on `--cba-bg-tertiary` (inset sand, ~3.86:1 — fails AA). Prefer `--cba-text-secondary` on canvas and inset sand for lower-emphasis text.
```

### Step 7.6 — `.agent/project-info/context.md`: Phase 9 status update

Update three areas: **Current Work Focus**, **Recent Changes** (prepend new bullet at top), and **Immediate Next Steps** + **Open Items/Risks**. Keep all existing content; only add/adjust.

#### 7.6a — Current Work Focus (replace lines 17–25 block content)

Replace the entire `## Current Work Focus` bullet list (lines 17–25) with a Phase 9-focused version (keep the heading and the `[Project Info: Active]` line above). The "Task 1 — Lighten gray theme complete" and "Branch `feat/lighten-gray-theme` ready for merge" bullets are stale (Task 1 merged long ago) — remove them in the rewrite; keep Phase 0 line.

**After (new `## Current Work Focus` body):**
```markdown
- **Phase 9 — Surface hierarchy fix + consumer guide**: widened the four-level Minimal Yet Warm surface scale in `src/theme/_variables.scss`, strengthened borders and module shadows, refreshed `docs/theme-preview.html` for visual verification, and published `docs/CONSUMER_GUIDE.md` for Shell/MFE authors.
- **Phase 0 — Library scaffolding complete**: all seven TODO tasks finished. Peer deps configured (Angular 22, Bootstrap 5, ng-bootstrap 21, Font Awesome); TypeScript path mapping for `@cobranza-apps/ui`; theme SCSS folder at `src/theme/`; build, Jest, ESLint all pass.
- Active branch: `feat/phase9-hierarchy-consumer-guide` (Tasks A + B).
```

#### 7.6b — Recent Changes (prepend two new bullets at the very top of the bullet list, line 29)

**Insertion target:** the first existing bullet starts with "- **Theme lightened from near-dark to medium-gray palette**". Insert two new bullets **above** it.

**New bullets to insert (top of Recent Changes):**
```markdown
- **Phase 9 token tuning (Task A)** — widened Minimal Yet Warm surface hierarchy in `src/theme/_variables.scss`: canvas `#C5BFAE`, panel `#F2F0E8`, elevated `#FDFCF8`, inset `#D8C3A5`; `--cba-border-subtle` `#DAD7CA`; `--cba-shadow-module` `0 6px 24px rgba(43,34,28,0.18)`; `--cba-shadow-elevated` `0 10px 32px rgba(43,34,28,0.26)`. `docs/theme-preview.html` refreshed; four surfaces visibly distinct. Token names unchanged.
- **Phase 9 consumer guide + docs sync (Task B)** — created `docs/CONSUMER_GUIDE.md` (theme load, surface ownership map, Shell checklist, MFE checklist, anti-patterns, quick verify). Linked from `docs/INDEX.md`, `README.md` (Integration Notes + Documentation), and `docs/THEME.md` (new `### Surface hierarchy` note). README "intermediate-gray" → "Minimal Yet Warm". `CHANGELOG.md` 0.10.0 entry added (dated 2026-08-05). `brief.md` §5 token values + muted-restriction prose updated; `context.md` status updated.
```

#### 7.6c — Immediate Next Steps (replace the section body, lines 46–52)

**After (new `## Immediate Next Steps` body):**
```markdown
1. **Phase 9 user visual confirmation** of `docs/theme-preview.html` (TODO §5 checkpoint); if still flat, iterate tokens once more inside Minimal Yet Warm.
2. **Shell apply the consumer guide** in the Shell repo (`docs/CONSUMER_GUIDE.md`); this library only publishes the guide — Shell implementation is its own PR.
3. **Continue component coverage**: remaining basic components and form-control hardening per brief.md §6.
4. Publish `@cobranza-apps/mfe-events` for Shell ↔ MFE event contracts.
5. Set up CI/CD pipeline for automated build and publish (version auto-bumps on push to origin).
```

#### 7.6d — Open Items / Risks (replace the section body, lines 54–58)

**After (new `## Open Items / Risks` body):**
```markdown
- `@cobranza-apps/mfe-events` not yet published — workspace event contracts deferred.
- `--cba-text-muted` is now restricted on the darker canvas (`#C5BFAE`, ~3.6:1) AND on `--cba-bg-tertiary` (~3.86:1) — both below WCAG AA; library components and Shell/MFE must use `--cba-text-secondary` on those surfaces.
- Visual breaking change for Shell layouts that depended on near-identical canvas/panel surfaces (previously both ~#EAE7DC/#F3F1E9); Shell authors should review `docs/CONSUMER_GUIDE.md` and confirm workspace uses `--cba-bg-primary`.
- Phase 9 TODO §5 human visual confirmation checkpoint still pending.
```

#### 7.6e — Cross-Reference (replace bottom block, lines 60–68)

Append a Phase 9 cross-ref entry; keep existing entries.

**After (new `## Cross-Reference` body):**
```markdown
- [Project Brief](brief.md) — scope, tokens, component specs, source of truth.
- [Product Info](product.md) — product goals, target consumers, UX focus.
- [Architecture](architecture.md) — standalone components, ng-packagr build, theme encapsulation, integration patterns.
- [Tech Stack](tech.md) — exact versions, dependencies, tooling constraints.
- [Phase 9 TODO](../todos/20260805/20260805-todo-0.md) — Surface hierarchy fix + consumer guide.
- [Phase 9 global plan](../../.kilo/plans/20260805-phase9.md) — overall workflow.
- [Consumer Guide](../../docs/CONSUMER_GUIDE.md) — Shell & MFE integration rules (surface ownership, checklists, anti-patterns).
- [Theme Reference](../../docs/THEME.md) — token quick reference.
- [CHANGELOG](../../CHANGELOG.md) — release changelog (Keep a Changelog format), latest 0.10.0.
```

> Note: confirm the actual Phase 9 global-plan filename with the Plan Agent before writing; if it differs from `20260805-phase9.md`, use the real path. (If the path is unknown, use the TODO file link only and drop the global-plan line.)

---

## 8. Verification (implementer, after all edits, pre-commit)

V0. Diagnostics (no build/lint run is mandated in this docs-only plan, but cheap structural checks):
- `vscode-mcp-server_get_diagnostics_code` on each edited file (`docs/CONSUMER_GUIDE.md`, `docs/INDEX.md`, `docs/THEME.md`, `README.md`, `CHANGELOG.md`, `.agent/project-info/brief.md`, `.agent/project-info/context.md`) → expect no errors. Markdown lint warnings (line length etc.) are acceptable; fix only if a hard error.

V1. Cross-reference audit (run `grep` for each link target to ensure bidirectional links):
- `grep "CONSUMER_GUIDE.md"` in `docs/INDEX.md`, `docs/THEME.md`, `README.md` → ≥ 1 hit in each.
- `grep "CONSUMER_GUIDE"` in `docs/CONSUMER_GUIDE.md` (self TOC) → ≥ 1 hit (in TOC anchor).
- `grep "surface hierarchy"` (case-insensitive) in `docs/THEME.md`, `docs/CONSUMER_GUIDE.md`, `README.md` → ≥ 1 hit in each.
- `grep "Minimal Yet Warm"` in `README.md` → at least 3 hits (subTitle, Overview, Theme bullet). Confirm **zero** remaining "intermediate-gray" occurrences in `README.md`.
- `grep "## \[0.10.0\] - 2026-08-05"` in `CHANGELOG.md` → exactly 1 hit, located above `## [0.9.0]`.
- `grep "C5BFAE"` in `.agent/project-info/brief.md` → at least 2 hits (note prose + codefence). Confirm **zero** `#EAE7DC`, `#F3F1E9`, `#FCFBF6`, `#E7E5DE` remnants in brief.md §5 codefence.
- `grep "0 6px 24px rgba(43, 34, 28, 0.18)"` in `.agent/project-info/brief.md` → 1 hit. Confirm no `0 4px 16px ... 0.12` remnant.
- `grep "Phase 9"` in `.agent/project-info/context.md` → ≥ 3 hits (focus / recent change / cross-ref).

V2. Token parity audit:
- For each of: `--cba-bg-primary`, `--cba-bg-secondary`, `--cba-bg-elevated`, `--cba-bg-tertiary`, `--cba-border-subtle`, `--cba-shadow-module`, `--cba-shadow-elevated` — visually confirm the value shown in `.agent/project-info/brief.md` §5 codefence matches `src/theme/_variables.scss` exactly. (Implementer should `read` both and diff.)

V3. File-set sanity:
- `git status` shows only the 6 expected edited/created files: `docs/CONSUMER_GUIDE.md` (new), `docs/INDEX.md`, `docs/THEME.md`, `README.md`, `CHANGELOG.md`, `.agent/project-info/brief.md`, `.agent/project-info/context.md`. (7 paths total.) No `node_modules/`, no `dist/`, no lockfile.

---

## 9. Commit (implementer, after V0–V3 pass)

Single commit on the Phase 9 feature branch, message:

```
docs(phase9): add consumer guide + sync docs for surface hierarchy

- create docs/CONSUMER_GUIDE.md (theme load, surface ownership map,
  Shell/MFE checklists, anti-patterns, quick verify)
- link it from docs/INDEX.md, README.md (Integration Notes + Documentation),
  docs/THEME.md (new Surface hierarchy subsection)
- README: "intermediate-gray" -> "Minimal Yet Warm"
- CHANGELOG: 0.10.0 entry (hierarchy token tuning + consumer guide)
- brief.md §5: token values + muted restriction prose updated to
  authoritative src/theme/_variables.scss values
- context.md: Phase 9 status, recent changes, next steps, risks

Refs: .agent/todos/20260805/20260805-todo-0.md (Tasks 6-7)
```

Do NOT push in this step (push happens at critical-workflow step 5, origin only).

---

## 10. Done-conditions checklist (return to caller)

- [ ] `docs/CONSUMER_GUIDE.md` exists and contains all six required sections in TODO §6 (theme load, surface ownership map, Shell checklist [6], MFE checklist [4], anti-patterns [5], quick verify [5]).
- [ ] `docs/INDEX.md` links CONSUMER_GUIDE in Getting started.
- [ ] `docs/THEME.md` has a Surface hierarchy note pointing to CONSUMER_GUIDE.
- [ ] `README.md` says "Minimal Yet Warm" (no "intermediate-gray"); Integration Notes + Documentation both link CONSUMER_GUIDE.
- [ ] `CHANGELOG.md` has a `## [0.10.0] - 2026-08-05` section above `## [0.9.0]`, no `[Unreleased]`/unpublished tags, mentions hierarchy token tuning + consumer guide + the visual breaking-change note.
- [ ] `.agent/project-info/brief.md` §5 codefence + prose match `src/theme/_variables.scss` exactly; muted restriction now covers canvas AND inset.
- [ ] `.agent/project-info/context.md` reflects Phase 9 (focus + recent changes + next steps + risks + cross-refs).
- [ ] All cross-links verified bidirectional (V1). All token values parity-verified (V2). Git status clean of unintended files (V3).
- [ ] Single commit on the feature branch; no push.

---

## 11. What this plan is NOT (boundaries)

- No edits to `src/**` (token values, components, preview HTML) — Task A owns those and they are already done.
- No new components, no theme families.
- No Shell implementation PRs (guide only; Shell applies the guide in its own repo).
- No mobile/responsive work (desktop-only).
- No `npm`/build/lint/run commands — this is a docs-only step; the existing build/lint status is unchanged.
- No git push in this step (deferred to critical-workflow step 5).
- No assumptions about token names (all `--cba-*` names preserved).