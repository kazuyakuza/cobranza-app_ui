# Global Plan — Phase 8: Palette Refresh (Minimal Yet Warm)

**Source TODO:** `.agent/todos/20260804/20260804-todo-0.md`  
**Current version:** `0.8.2` → **Target version:** `0.9.0` (minor — palette refresh)  
**Branch:** `feat/palette-refresh-minimal-yet-warm`

---

## Pre-Analysis

### Scope

Replace the current medium-gray palette with a **warm, calm, professional** system based on the "Minimal Yet Warm" direction. This is **tokens + theme application only** — no new components, no API changes.

### Technical & Architecture Decisions

- **Token stability:** All existing `--cba-*` token names must remain unchanged. Only values change.
- **Surface model:** Need at least 4 distinguishable surface levels (canvas, panel, elevated, inset) derived from the 5 source hexes (`#EAE7DC`, `#D8C3A5`, `#8E8D8A`, `#E98074`, `#E85A4F`) plus derived tints/shades.
- **Text contrast:** WCAG AA 4.5:1 target for primary/secondary text on all surfaces. Muted text may have documented restrictions.
- **Accent discipline:** Coral (`#E85A4F` / `#E98074`) should be reserved for accents, CTAs, status, badges — not large background fills. For a back-office context, the primary button accent may need to be a deeper warm neutral rather than aggressive coral.
- **Success green:** Not in the source palette; must derive a calm green that harmonizes with warm neutrals.
- **Shadows:** Shift from cool black to warm-tinted shadows.
- **Preview HTML:** `docs/theme-preview.html` currently shows ~25 themes. Reduce to only "Minimal Yet Warm" (keep the theme list UI for future expansion). Update its CSS to use the actual `--cba-*` tokens or align conceptually with them.
- **Docs updates:** `docs/THEME.md`, `.agent/project-info/brief.md` §5, `CHANGELOG.md`.

### Front-end Related: Yes

This task involves theme tokens, SCSS, HTML preview, and visual design decisions. Sub-steps **4.1a** and **4.5a** are required.

---

## Execution Steps

### Step 2: Git Feature Branch Setup

- **Agent:** `implementer`
- Commit untracked files (TODO, theme-preview.html) if needed.
- Create and switch to `feat/palette-refresh-minimal-yet-warm`.

### Step 3: Version Update

- **Agent:** `implementer`
- Bump `package.json` version from `0.8.2` to `0.9.0`.
- Commit as `chore: bump version to 0.9.0`.

---

## Task: Phase 8 — Palette Refresh

### 4.1a. Front-end Technical Specification

- **Agent:** `frontend-specialist`
- **Goal:** Produce a detailed front-end spec with the final token values.
- **Deliverables:**
  1. Final surface model: canvas, panel, elevated, inset hex values (with derivation rationale).
  2. Final text colors: primary, secondary, muted, inverse (with contrast ratios).
  3. Final border colors: subtle, default, strong.
  4. Final accent colors: primary, success, warning, danger, info (with rationale for primary accent choice).
  5. Final interactive states: hover, active, focus-ring.
  6. Final shadows: module, elevated (warm-tinted).
  7. Mapping of each `--cba-*` token to its new value.
  8. Guidance on accent discipline (where coral may/may not be used).
- **Output:** `.kilo/plans/20260804-phase8-frontend-spec.md`

### 4.1b. Analysis & Planning

- **Agent:** `architector`
- **Goal:** Read the front-end spec and produce a detailed implementation plan.
- **Key analysis points:**
  - Which files to edit and in what order.
  - How to update `docs/theme-preview.html` (strip other themes, update CSS, keep list UI).
  - How to validate contrast (manual or tool-assisted).
  - How to audit coral usage across components.
  - How to update docs consistently.
- **Output:** `.kilo/plans/20260804-phase8-palette-refresh.md`

### 4.2. Implementation

- **Agent:** `implementer`
- **Goal:** Execute the architector's plan step by step.
- **Key work areas:**
  1. **Task 0:** Modify `docs/theme-preview.html` — remove all themes except "Minimal Yet Warm", update preview CSS to reflect final tokens.
  2. **Task 1:** Establish surface model — decide final canvas/panel/elevated/inset values, present visual confirmation via preview.
  3. **Task 2:** Update `src/theme/_variables.scss` — replace all color-related `--cba-*` values with the Minimal Yet Warm system. Keep layout/radius/spacing tokens. Recalibrate hover/active/focus-ring/shadows.
  4. **Task 3:** Text & border pass — ensure primary/secondary/muted text readability on panel and elevated. Ensure borders are visible on cream/sand.
  5. **Task 4:** Accent discipline — audit component SCSS for coral usage; ensure no large coral backgrounds. Decide primary button color.
  6. **Task 5:** Documentation — update `docs/THEME.md`, `.agent/project-info/brief.md` §5, `CHANGELOG.md`.
- **Commits:** Meaningful commits per sub-task.

### 4.3. Code Review & Simplification

- **Agents:** `code-reviewer` + `code-simplifier` (concurrent)
- **Goal:** Review implementation for errors, deviations, and simplification opportunities.
- **Focus areas:**
  - Token name stability (no renames).
  - Contrast and hierarchy correctness.
  - No hardcoded colors introduced in components.
  - Preview HTML correctness.
  - Docs accuracy.
- **Output:** Fix/simplification plan saved to `.kilo/plans/20260804-phase8-palette-refresh.md`.
- **Fix application:** `implementer` applies fixes (max 3 cycles).

### 4.4. Documentation

- **Agent:** `docs-specialist`
- **Goal:** Update all relevant documentation.
- **Files:**
  - `src/theme/_variables.scss` — update JSDoc/header comments to describe the new palette.
  - `docs/THEME.md` — update token descriptions and values.
  - `.agent/project-info/brief.md` §5 — update the authoritative token table.
  - `CHANGELOG.md` — add `[0.9.0]` section with changes.
  - `docs/theme-preview.html` — ensure inline docs/comments are accurate.

### 4.5a. Front-end Implementation Verification

- **Agent:** `frontend-specialist`
- **Goal:** Verify implementation matches the front-end spec from 4.1a.
- **Checks:**
  - All `--cba-*` values match the spec.
  - 4+ surface levels are visually distinct in the preview.
  - Text contrast meets WCAG AA on intended pairs.
  - Coral accents are controlled (no accidental large backgrounds).
  - Preview HTML renders correctly.
- **Output:** Verification report passed to Plan Agent.

### 4.5b. Overall Plan Adherence

- **Agent:** `architector`
- **Goal:** Check that the implementation follows the plan from 4.1b.
- **Checks:**
  - All planned files were modified.
  - No unintended files were changed.
  - Docs are consistent with code.
  - Build succeeds (`npm run build`, `npm run lint`).
- **Output:** Adherence report.

### 4.6. Task Completion

- **Agent:** `implementer`
- **Goal:** Mark task as done in the TODO file.
- **Actions:**
  - Append `[DONE]` to the task title and mark all sub-items.
  - Commit with meaningful message.

---

## Step 5: TODO File Completion

- **Agent:** `implementer`
- **Actions:**
  1. Rename `.agent/todos/20260804/20260804-todo-0.md` to `.agent/todos/20260804/20260804-todo-0-DONE.md`.
  2. Ensure all files are committed in the feature branch.
  3. Switch to `main`, merge `feat/palette-refresh-minimal-yet-warm`.
  4. On success, delete the feature branch.
  5. Push `main` to `origin` only.

---

## Acceptance Criteria (from TODO)

| # | Criterion |
| --- | ----------- |
| 1 | Theme is recognizably **Minimal Yet Warm** (warm sand/cream/taupe + coral accents), not the old mid-gray fog. |
| 2 | At least four surface levels are distinguishable in the Shell. |
| 3 | Module separates clearly from workspace canvas. |
| 4 | Text primary/secondary/muted is clearly readable. |
| 5 | Borders and footer/header chrome remain visible. |
| 6 | Coral accents are controlled (not accidental large backgrounds). |
| 7 | Token names remain stable; build succeeds. |
| 8 | Docs record the final palette values. |

---

# Phase 8 Task — Implementation Plan (4.1b)

**Source TODO:** `.agent/todos/20260804/20260804-todo-0.md`
**Front-end spec (authoritative):** `.kilo/plans/20260804-phase8-frontend-spec.md`
**Target version:** `0.9.0` (already set in `package.json` — Step 3 done)
**Branch:** `feat/palette-refresh-minimal-yet-warm` (already checked out — Step 2 done)
**Scope:** Tokens + theme application ONLY. No new components. No token renames. Desktop-only.

> The front-end spec is the single source of truth for every final value below.
> All hard-coded hex lives ONLY in `src/theme/_variables.scss` (verified: no component
> `.scss` under `src/components/**` contains hex/rgba — components reference `--cba-*`
> tokens). Therefore Tasks 2, 3, 4 are largely value swaps in `_variables.scss` plus a
> handful of surface-role token swaps inside the two module-chrome components.

---

## 0. Pre-flight (read-only verification — implementer runs first)

1. Re-read this plan + the front-end spec end-to-end. Re-read TODO task list.
2. Confirm branch: `git branch --show-current` → must print `feat/palette-refresh-minimal-yet-warm`.
3. Confirm working tree is clean (Step 2/3 already committed): `git status --short` → empty or only docs/plans TODO entries (those are tracked). If anything unexpected is staged, STOP and escalate.
4. Confirm `package.json` version is `0.9.0` (already verified). If not, escalate — version bump is a prior step, not part of this task.
5. Re-confirm the contrast claims in spec §4.1 hold by manually recomputing one pair with a WCAG tool (optional; spec author already did). Do NOT change any spec value without escalating to the Plan Agent / frontend-specialist.
6. Audit: `rg -n "#[0-9A-Fa-f]{3,8}|rgba?\(" src/components` returns nothing (already verified empty). This proves no component has hard-coded colors, so the only coral/accent risk is from token values and the surface-role swaps in Tasks 3–4. Record this fact in the commit body of Task 4.

---

## High-level approach

1. **Task 0 — Preview**: reduce `docs/theme-preview.html` `themes=[]` to the single `mw` entry with explicit `roles`+`accents` matching spec §6; replace the `.preview` default CSS custom properties with the final Minimal Yet Warm values; refresh the sidebar copy + roleMap; keep theme-list UI for future themes.
2. **Task 1 — Surface model**: confirm 4-level hierarchy in the updated preview, present to user before continuing (via Plan Agent question). Surface-role swap inside module chrome is staged under Task 3.
3. **Task 2 — `_variables.scss`**: replace every color `--cba-*` value with spec §3 values; update the file header comment block (lines 1–35) to describe Minimal Yet Warm and the new muted-on-inset restriction; keep layout/radius/spacing tokens untouched.
4. **Task 3 — Text & border pass + surface roles**: swap `--cba-bg-secondary → --cba-bg-elevated` in `module-header.component.scss`; swap `--cba-bg-secondary → --cba-bg-tertiary` in `module-footer.component.scss`; verify text/border token choices per spec §4 on each surface; no hard-coded color introductions.
5. **Task 4 — Accent discipline**: confirm no component SCSS introduces coral backgrounds (already true); add an inline accent-discipline comment block in `_variables.scss` Accents section.
6. **Task 5 — Documentation**: update `.agent/project-info/brief.md` §5 table + restriction note; update `docs/THEME.md` intro; add `[0.9.0] - 2026-08-04` section to `CHANGELOG.md`; update `docs/theme-preview.html` inline comments.
7. **Verify**: `npm run lint`, `npm run build`, `npm run format`; open `docs/theme-preview.html` in the browser for the implementer/Plan Agent to confirm visually.
8. **Commit**: one logical commit per task as listed below.

---

## 1. Task 0 — Modify `docs/theme-preview.html`

**Goal:** preview renders ONLY Minimal Yet Warm, with the role/preview-var mapping from spec §6.

### 1.1 Files touched

- `docs/theme-preview.html`

### 1.2 Sidebar `<head>` copy updates

- Change `<title>` from `Cobranza UI — Theme picker v3` to `Cobranza UI — Minimal Yet Warm preview`.
- `.app` / `.controls` dark chrome: keep as-is (spec §6 item 5 says keep neutral OR shift to warm dark; choose NEUTRAL dark — it does not clash, and it is not part of the token system). No change required here; do not spend time.
- Inside `<aside class="controls">`:
  - `<h1>` text → `Minimal Yet Warm preview`.
  - `<p class="hint">` text → `Palette preview for @cobranza-apps/ui — Minimal Yet Warm (Phase 8). Canvas ≠ panel ≠ elevated ≠ inset, coral reserved for accents.`.

### 1.3 Replace `.preview` default CSS custom properties (block lines ~27–33)

Replace the `--canvas/--panel/--elevated/--inset/--text/--text-2/--text-3/--border/--border-2/--accent/--success/--warning/--danger/--info/--shadow/--hover/--on-accent` block with EXACTLY these values (spec §6 mapping):

```css
.preview{
  --canvas:#EAE7DC;--panel:#F3F1E9;--elevated:#FCFBF6;--inset:#D8C3A5;
  --text:#2B2620;--text-2:#4A4640;--text-3:#625C55;--border:#A7A6A2;--border-2:#8E8D8A;
  --accent:#6B5B4F;--success:#3E6B4F;--warning:#E98074;--danger:#B93E36;--info:#56717E;
  --shadow:0 4px 16px rgba(43,34,28,.12);--hover:rgba(43,38,32,.06);--on-accent:#FDFCF8;
  display:flex;flex-direction:column;min-height:100vh;background:var(--canvas);color:var(--text)
}
```

Notes:

- `--shadow` now reads `0 4px 16px rgba(43,34,28,.12)` to mirror `--cba-shadow-module`.
- `--hover` is `rgba(43,38,32,.06)` to mirror `--cba-hover`.
- `--on-accent` is `#FDFCF8` to mirror `--cba-text-inverse`.

### 1.4 Reduce `themes=[]` to a single entry

Replace the entire `const themes=[ ... ];` array (currently ~28 theme objects across Figma/Extra groups) with:

```js
const themes=[
  {
    id:'mw',
    group:'Extra',
    name:'Minimal Yet Warm',
    note:'Canvas cálido + coral reservado a acentos',
    source:['#EAE7DC','#D8C3A5','#8E8D8A','#E98074','#E85A4F'],
    roles:{
      canvas:'#EAE7DC',
      panel:'#F3F1E9',
      elevated:'#FCFBF6',
      inset:'#D8C3A5',
      accent:'#6B5B4F'
    },
    accents:{
      primary:'#6B5B4F',
      success:'#3E6B4F',
      warning:'#E98074',
      danger:'#B93E36',
      info:'#56717E'
    }
  }
];
```

Keep the group-label rendering code (lines ~436–452) unchanged so the “Extra” group label and the single button still render (future themes can be appended to this array).

### 1.5 Expand `roleMap` output (lines ~429–430)

Replace the 5-line roleMap string with an expanded map that mirrors the spec §6 token mapping (helps the user confirm text/border/accent at a glance):

```js
roleMap.innerHTML=
  'canvas   '+tokens['--canvas']+'   (--cba-bg-primary)\n'+
  'panel    '+tokens['--panel']+'    (--cba-bg-secondary)\n'+
  'elevated '+tokens['--elevated']+' (--cba-bg-elevated)\n'+
  'inset    '+tokens['--inset']+'    (--cba-bg-tertiary)\n'+
  'text     '+tokens['--text']+'     (--cba-text-primary)\n'+
  'border   '+tokens['--border']+'   (--cba-border-default)\n'+
  'accent   '+tokens['--accent']+'   (--cba-accent-primary)\n'+
  'warning  '+tokens['--warning']+'  (--cba-accent-warning)\n'+
  'danger   '+tokens['--danger']+'   (--cba-accent-danger)';
```

(The `.map` CSS already uses `white-space`-free monospace lines via `<br>` — keep using `<br>` if preferred. If you adopt `\n`, also add `white-space:pre` to `.map` in the `<style>`. Safer choice: keep `<br>` separators exactly as today but emit the 9 lines above with `<br>` instead of `\n`.)

### 1.6 Footer note / inline doc comment

Add a top-of-file HTML comment immediately after `<!DOCTYPE html>` documenting the single-theme policy:

```html
<!--
  docs/theme-preview.html
  Single-theme preview for @cobranza-apps/ui (Phase 8 — Minimal Yet Warm).
  Other themes were removed; the theme-list UI is kept so future themes can be
  appended to the `themes` array below. Preview CSS custom properties mirror the
  `--cba-*` tokens defined in src/theme/_variables.scss (see brief.md §5).
-->
```

### 1.7 Acceptance for Task 0

- Open `docs/theme-preview.html` in a desktop browser → only one theme button (“Minimal Yet Warm”) is listed and it is auto-applied.
- The four surface chips in the preview (workspace, module body, module header, module footer / table header / search) are visibly distinct (verified visually, then handed to user in Task 1).

### 1.8 Commit

`docs(preview): reduce theme-preview to Minimal Yet Warm`

---

## 2. Task 1 — Establish the surface model (user confirmation gate)

This is a DECISION + PRESENTATION step; the values are already decided in spec §2. No file edits in this task beyond what Task 0 produced.

### 2.1 Implementer actions

1. With `docs/theme-preview.html` updated (Task 0 committed), open it in the default browser (do not modify the file).
2. Visually verify, on the running preview:
   - Workspace canvas (`--canvas` `#EAE7DC`) is distinct from module body panel (`#F3F1E9`).
   - Module header (`--elevated` `#FCFBF6`) is distinct from module body.
   - Table header / input wells / module footer (`--inset` `#D8C3A5`) are visibly recessed vs. rows/panel.
3. Take a screenshot `docs/_phase8-preview-confirm.png` is OPTIONAL — only if the Plan Agent asks. Do not commit a screenshot into the repo (gitignore compliance). Instead, report the visual confirmation in the sub-task signal and let the Plan Agent ask the user to confirm by opening the file.

### 2.2 Signal back to Plan Agent (do NOT proceed to Task 2 until Plan Agent relays user confirmation)

Return a short message:

- Task 0 done; preview updated to Minimal Yet Warm only.
- Four surface levels visually distinct in the preview (list the four chips observed).
- Suggested next action: ask the user to open `docs/theme-preview.html` and confirm before touching `_variables.scss`.

> The Plan Agent will present this to the user with a `question`. Do not edit `_variables.scss` until the implementer is re-invoked for Task 2.

---

## 3. Task 2 — Update `src/theme/_variables.scss`

**Goal:** apply spec §3 token values; update the file header comment; preserve layout/radius/spacing; recalibrate hover/active/focus-ring/shadows.

### 3.1 File touched

- `src/theme/_variables.scss`

### 3.2 Replace the header comment block (lines 1–35) with the Minimal Yet Warm header

New header (preserve JSDoc style) — replace the entire `/** ... */` block before `:root {`:

```scss
/**
 * Design tokens — `:root` / `--cba-` prefix.
 *
 * SOURCE OF TRUTH: .agent/project-info/brief.md §5
 * FRONT-END SPEC:  .kilo/plans/20260804-phase8-frontend-spec.md
 *
 * Theme name: Minimal Yet Warm — warm sand / cream / taupe + controlled coral.
 * Canvas is a light warm gray (EAE7DC); panels step lighter (F3F1E9), elevated
 * surfaces are a near-white cream (FCFBF6), insets use warm sand (D8C3A5) for
 * table headers / input wells / module footers. Four distinguishable surfaces.
 *
 * Text tokens are warm near-black/taupe; primary/secondary pass WCAG AA on every
 * surface; muted passes AA on canvas, panel, elevated and is RESTRICTED on
 * `--cba-bg-tertiary` (inset sand: ~3.86:1) — use `--cba-text-secondary` on inset.
 *
 * TOKEN GROUPS:
 *   Backgrounds  — canvas (primary), panel (secondary), inset (tertiary),
 *                  elevated (cream, highest). Use primary for workspace, secondary
 *                  for module body / cards, tertiary for recessed regions (table
 *                  headers / wells / module footer), elevated for module header,
 *                  dropdowns, popovers.
 *   Text         — primary (#2B2620) body, secondary (#4A4640) lower emphasis,
 *                  muted (#625C55) de-emphasized (NOT on bg-tertiary), inverse
 *                  (#FDFCF8) on dark accents/overlays.
 *   Borders      — subtle (#E7E5DE) thin separators, default (#A7A6A2) input
 *                  borders / chrome, strong (#8E8D8A) focus / footer pills / header
 *                  icon-button outlines so they do not disappear on cream/sand.
 *   Accents      — primary warm taupe (#6B5B4F, NOT coral); success calm green
 *                  (#3E6B4F); warning soft coral (#E98074); danger deeper coral-red
 *                  (#B93E36); info muted steel (#56717E). See accent-discipline note.
 *   Interactive  — hover/active use warm taupe overlays (rgba(43,38,32,...)) so they
 *                  read on cream/sand. focus-ring is a warm coral ring so it is visible
 *                  on light warm surfaces.
 *   Layout       — Fixed dimensions for Shell header / footer / module header.
 *   Radius       — sm (6px), md (10px), lg (14px).
 *   Shadows      — Warm-tinted (rgba(43,34,28,...)) so modules lift off canvas
 *                  without harsh black bloom.
 *   Spacing      — 4px-based scale 4px…32px.
 *
 * ACCENT DISCIPLINE — coral (#E98074 soft / #E85A4F strong) is RESERVED for:
 *   - warning states and badges/borders,
 *   - danger / error states and badges,
 *   - focus-ring emphasis,
 *   - small emphasis accents (icons, links, dots).
 * Coral MUST NOT be used as a large background fill for panels, modules, or primary
 * CTAs. Primary CTAs use the warm taupe `--cba-accent-primary`.
 *
 * Do NOT rename tokens. Do NOT hard-code color values in components — always
 * reference var(--cba-*). When adding new tokens, update brief.md §5 first.
 */
```

### 3.3 Replace the `:root { ... }` color-related tokens (lines 37–79)

Use the exact spec §3 values. Keep Layout / Radius / Spacing blocks verbatim. The new `:root` body:

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
  --cba-header-height: 56px;
  --cba-footer-height: 64px;
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

### 3.4 Value-by-value delta (verification checklist)

| Token | Old | New (spec §3) | Notes |
| ------- | ----- | --------------- | ------- |
| `--cba-bg-primary` | `#7a838d` | `#EAE7DC` | canvas, darkest light surface |
| `--cba-bg-secondary` | `#8c95a0` | `#F3F1E9` | panel, lighter than canvas |
| `--cba-bg-tertiary` | `#9da6b0` | `#D8C3A5` | inset sand, recessed |
| `--cba-bg-elevated` | `#aeb6bf` | `#FCFBF6` | cream, highest surface |
| `--cba-bg-overlay` | `rgba(0,0,0,.32)` | `rgba(43,38,32,.45)` | warm backdrop |
| `--cba-text-primary` | `#0f1115` | `#2B2620` | warm near-black |
| `--cba-text-secondary` | `#15181c` | `#4A4640` | warm taupe |
| `--cba-text-muted` | `#212429` | `#625C55` | warm gray-taupe |
| `--cba-text-inverse` | `#e8eaed` | `#FDFCF8` | cream-white |
| `--cba-border-subtle` | `var(--cba-bg-elevated)` | `#E7E5DE` | dedicated separator |
| `--cba-border-default` | `#707880` | `#A7A6A2` | warm gray |
| `--cba-border-strong` | `#4a5059` | `#8E8D8A` | source warm gray |
| `--cba-accent-primary` | `#3b82f6` | `#6B5B4F` | warm taupe (NOT coral) |
| `--cba-accent-success` | `#22c55e` | `#3E6B4F` | calm warm green |
| `--cba-accent-warning` | `#f59e0b` | `#E98074` | soft coral |
| `--cba-accent-danger` | `#ef4444` | `#B93E36` | deeper coral-red |
| `--cba-accent-info` | `#06b6d4` | `#56717E` | muted steel |
| `--cba-hover` | `rgba(0,0,0,.06)` | `rgba(43,38,32,.06)` | warm overlay |
| `--cba-active` | `rgba(0,0,0,.10)` | `rgba(43,38,32,.10)` | warm overlay |
| `--cba-focus-ring` | `0 0 0 3px rgba(59,130,246,.45)` | `0 0 0 3px rgba(232,90,79,.45)` | warm coral ring |
| `--cba-shadow-module` | `0 4px 16px rgba(0,0,0,.18)` | `0 4px 16px rgba(43,34,28,.12)` | warm-tinted |
| `--cba-shadow-elevated` | `0 8px 24px rgba(0,0,0,.25)` | `0 8px 24px rgba(43,34,28,.18)` | warm-tinted |

Layout / Radius / Spacing — UNCHANGED.

### 3.5 Acceptance for Task 2

- File still ≤ 200 lines (target ≤ 125 excl. blanks/comments). After edits header is ~46 lines, `:root` ~40 lines ⇒ ~90 total ⇒ well within limits.
- No token NAMES added/removed/renamed (only values + comment text changed). Diff MUST only show value columns and comment changes; no `--cba-*` identifier is newly created or removed.
- `npm run build` succeeds; SCSS still parses (no syntax issues).

### 3.6 Commit

`feat(theme): adopt Minimal Yet Warm palette in _variables.scss`

---

## 4. Task 3 — Text & border pass + surface-role swaps

**Goal:** implement the surface model inside the module chrome so the 4 levels read in the running Shell, and confirm text/border tokens are correct on each surface.

### 4.1 Files touched

- `src/components/module-header/module-header.component.scss`
- `src/components/module-footer/module-footer.component.scss`

### 4.2 Surface-role swaps (token references only — NO hard-coded colors)

**`module-header.component.scss` — line 11:**
Change

```scss
  background-color: var(--cba-bg-secondary);
```

to

```scss
  background-color: var(--cba-bg-elevated);
```

Rationale (spec §2): the module header sits on the highest surface (cream `#FCFBF6`), distinct from the module body panel (`#F3F1E9`). Existing `border-bottom: 1px solid var(--cba-border-subtle)` (`#E7E5DE`) remains visible on cream.

**`module-footer.component.scss` — line 11:**
Change

```scss
  background-color: var(--cba-bg-secondary);
```

to

```scss
  background-color: var(--cba-bg-tertiary);
```

Rationale (spec §2): module footer is the inset/recessed surface (warm sand `#D8C3A5`). Remove the literal `border-top: none;` only if the sand↔panel seam needs a separator; spec does not require it, so KEEP `border-top: none;` and rely on the luminance step between panel (`#F3F1E9`) and inset (`#D8C3A5`). Do not introduce a hard-coded border color.

### 4.3 No-change list (explicit — do not modify)

- `module-container.component.scss`: keeps `--cba-bg-secondary` for the module body panel surface. KEEP AS-IS.
- `card/cba-card.component.scss`: keeps `--cba-bg-secondary` for card surface. KEEP AS-IS.
- `button/cba-button.component.scss`: all variants reference tokens. The `--primary` variant becomes warm taupe automatically via `--cba-accent-primary`. KEEP AS-IS.
- `module-header.component.scss` status color classes (loading→info, loaded/success→success, warning→warning, error→danger, dirty→muted): KEEP AS-IS. These now resolve to warm-coral / green / muted taupe. Muted on header (now elevated `#FCFBF6`) = `625C55` ⇒ 6.37:1 (spec §4.1) ⇒ passes AA.
- `module-footer.component.scss` status classes: KEEP AS-IS. The `--dirty` already uses `--cba-text-secondary` (`#4A4640`) which on the new inset sand (`#D8C3A5`) yields 5.47:1 (spec §4.1) ⇒ passes AA. Good — no muted-on-inset violation here.

### 4.4 Text correctness audit (per spec §4.1)

Confirm there are NO component usages that place `--cba-text-muted` directly on a `--cba-bg-tertiary` surface, since spec says muted-on-inset is 3.86:1 (below AA).

- `rg -n "cba-text-muted" src/components` → list every hit; for each, inspect the enclosing rule's `background-color`:
  - If background is `--cba-bg-tertiary` (or sand token) ⇒ replace that one usage with `--cba-text-secondary` and note the change in the commit body.
  - Otherwise (current header is now `--cba-bg-elevated`) ⇒ leave as-is.
- Already-known hit: `module-header.component.scss` `.cba-module-header__status--dirty { color: var(--cba-text-muted); }` on the header whose background is now `--cba-bg-elevated` ⇒ PASSES (6.37:1) ⇒ no change.
- If the audit finds no muted-on-inset usage, record that fact in the commit body. Expected outcome: NO additional edits beyond the two surface-role swaps in §4.2.

### 4.5 Border visibility audit (per spec §4.2)

- `rg -n "cba-border-subtle|cba-border-default|cba-border-strong" src/components` — sanity scan that footer pills / header icon buttons resolve to `--cba-border-strong` where they currently do. From the loaded SCSS:
  - module-header action button has `border: 1px solid transparent;` (no token border) and uses `--cba-text-secondary`. On cream elevated that reads fine; KEEP.
  - shell-footer / preview section-pill uses `--cba-border-2` in preview HTML only (not in library components).
- No component edits required for borders. Record the audit result in the commit body.

### 4.6 Acceptance for Task 3

- Only two `.scss` lines changed (one token per file); diff size = 2 lines.
- `npm run build` succeeds.
- Four surface levels visible in the preview/editor: canvas (workspace), panel (module body/card), elevated (module header), inset (module footer / table header / input wells).
- No `--cba-text-muted` placed on a `--cba-bg-tertiary` surface anywhere in `src/`.

### 4.7 Commit

`feat(theme): apply warm surface model to module chrome (header→elevated, footer→inset)`

---

## 5. Task 4 — Accent discipline

**Goal:** ensure coral is reserved for accents/status/focus, not large fills; document the rule.

### 5.1 Files touched

- (Header comment update already done in Task 2; the accent-discipline paragraph is included in the new `_variables.scss` header.) No further source edits expected.

### 5.2 Audit (read-only)

1. `rg -n "#E98074|#E85A4F" src/` → must return ZERO hits (coral lives only in `--cba-accent-warning`/`--cba-accent-danger` tokens, which are named tokens, not literals). Expected: zero.
2. `rg -n "cba-accent-(primary|success|warning|danger|info)" src/components` → list all hits; confirm:
   - `--cba-accent-primary` (warm taupe `#6B5B4F`) is used for primary buttons / active nav (button.scss `.cba-button--primary`, plus any nav if present) — correct.
   - `--cba-accent-warning` / `--cba-accent-danger` are used for status icons / badges / danger buttons, NOT for large surface fills — confirm via each hit's `background-color` context. Expected: no `background-color: var(--cba-accent-warning)` anywhere except dedicated warning badges/button fills. If a large warning fill appears, escalate via the Plan Agent (do not silently change component contracts).
3. `--cba-focus-ring` is the warm coral ring (`rgba(232,90,79,.45)`); reused by all focusable components via the `cba-focus-ring` mixin / `box-shadow: var(--cba-focus-ring)` — correct, KEEP.

### 5.3 Documentation reinforcement (optional, only inside `_variables.scss`)

The accent-discipline paragraph added in Task 2 §3.2 already documents where coral may/may not be used. No additional file edits required.

### 5.4 Acceptance for Task 4

- Coral literal audit returns zero hits in `src/`.
- No component `background-color` is bound to `--cba-accent-warning` for a large surface.
- Primary CTA uses warm taupe `--cba-accent-primary` (no coral primary buttons).

### 5.5 Commit

- If §5.2 finds no issues → NO separate commit; record audit result in the Task 3 commit body / sign-off summary.
- If an audit escalation forces a component change → separate commit `fix(theme): restrict coral usage in <component>`.

---

## 6. Task 5 — Documentation

### 6.1 Files touched

- `.agent/project-info/brief.md` (§5 token table + restriction note + palette descriptor)
- `docs/THEME.md` (intro line)
- `CHANGELOG.md` (new `[0.9.0]` section)
- `docs/theme-preview.html` (inline doc comment — done in Task 0 §1.6; verify present)

### 6.2 `brief.md` §5 edits

1. Replace the palette descriptor sentence (lines ~101–104):
   - From: `> **Note:** The palette was lightened from the original near-dark gray to a medium-gray palette ...`
   - To:
     > **Note:** The palette is **Minimal Yet Warm** (warm sand/cream/taupe + controlled coral). Canvas `#EAE7DC`, panel `#F3F1E9`, elevated `#FCFBF6`, inset `#D8C3A5`. Coral (`#E98074` soft, `#E85A4F` strong) is reserved for accent/status/focus — NOT for primary CTAs or large fills. Primary text on panel/elevated and primary/secondary text on every intended surface meet WCAG AA 4.5:1. Muted text on `--cba-bg-tertiary` (inset sand) is ~3.86:1 — use `--cba-text-secondary` on inset.
2. Replace the `:root { ... }` token block in §5 (lines ~107–161) with the SAME `:root` block defined in this plan §3.3 (copy verbatim, keeping section header `/* Backgrounds — warm Minimal-Yet-Warm surface scale ... */` etc.). Update in-block comments to use the brief-friendly phrasing (matches the spec, no contradictions).
3. Replace the `--cba-text-muted usage restriction` paragraph (line ~163):
   - To:
     > **`--cba-text-muted` usage restriction:** `#625C55` ≈ passes WCAG AA 4.5:1 on `--cba-bg-primary` (canvas, ~5.33:1), `--cba-bg-secondary` (panel, ~5.84:1) and `--cba-bg-elevated` (cream, ~6.37:1). It is RESTRICTED on `--cba-bg-tertiary` (inset sand, ~3.86:1 — fails AA). Prefer `--cba-text-secondary` on `--cba-bg-tertiary` for lower-emphasis text.
4. Update the `## 1. Purpose` “intermediate gray theme” phrasing (lines ~38–42): change `The intermediate gray theme` → `The Minimal Yet Warm theme (warm sand/cream/taupe + coral accents)`. Update the matching bullet in §2.1 Themes row (`Full intermediate gray design tokens ...`) → `Full Minimal Yet Warm design tokens ...`.

### 6.3 `docs/THEME.md` edits

- Line 11 intro: `Quick reference for the intermediate-gray design system:` → `Quick reference for the Minimal Yet Warm design system:`. Keep all structural token-group listings; they reference tokens by name (unchanged) — no value edits needed in THEME.md (per the file header note, authoritative values live in brief.md §5 and `_variables.scss`).

### 6.4 `CHANGELOG.md` edits

Add a new section above `## [0.8.1] - 2026-08-03` (Keep-a-Changelog ordering — newest on top). Insert:

```markdown
## [0.9.0] - 2026-08-04

### Changed

- Replaced the intermediate-gray palette with the **Minimal Yet Warm** system across
  `src/theme/_variables.scss`: warm sand/cream/taupe surfaces (canvas `#EAE7DC`,
  panel `#F3F1E9`, elevated `#FCFBF6`, inset `#D8C3A5`), warm near-black/taupe text,
  warm border steps, warm-tinted shadows and hover/active overlays.
- `--cba-accent-primary` is now a warm taupe `#6B5B4F` (was blue `#3b82f6`). Coral
  (`#E98074` / `#E85A4F`) is reserved for warning/danger/focus accents only.
- `--cba-focus-ring` is now a warm coral ring (`rgba(232,90,79,0.45)`) to stay visible
  on warm light surfaces.
- `--cba-border-subtle` is now a dedicated `#E7E5DE` separator (was an alias of
  `--cba-bg-elevated`).
- Module header surface switched to `--cba-bg-elevated`; module footer to
  `--cba-bg-tertiary` (inset) to expose the four-level surface hierarchy.
- `docs/theme-preview.html` reduced to a single Minimal Yet Warm theme (theme-list UI
  retained for future themes).

### Added

- Inline accent-discipline guidance in `src/theme/_variables.scss` (coral reserved for
  status/focus/small accents; primary CTAs use warm taupe).
- Muted-text restriction now documented against the warm inset surface
  (`--cba-bg-tertiary`, ~3.86:1).

### Notes

- **No token names were renamed, added, or removed** — only values, component
  surface-role token references, and documentation changed. Build/lint pass; this is
  not a breaking API change for consumers of `--cba-*` tokens.
- See `.agent/project-info/brief.md` §5 for the authoritative token table and
  `docs/THEME.md` for the theme quick reference.
```

### 6.5 `docs/theme-preview.html` inline comment verify

- Confirm the top-of-file HTML comment from §1.6 is present. No further edits.

### 6.6 Formatting compliance

- After all edits run `npm run format` so prettier normalizes the touched SCSS/MD files. Re-check git status and stage only intended files.

### 6.7 Acceptance for Task 5

- brief.md §5 token table == this plan §3.3 (no drift).
- THEME.md intro says “Minimal Yet Warm”.
- CHANGELOG.md has a dated `[0.9.0]` section with Changed/Added/Notes; ordering newest-first preserved.
- `npm run lint` and `npm run build` pass.

### 6.8 Commit

`docs: record Minimal Yet Warm palette across brief, THEME, and CHANGELOG`

---

## 7. Final verification (before sign-off to Plan Agent)

Run, each as a separate `bash` invocation (no chaining — rule: single cmds only):

1. `npm run lint`  → expect no errors.
2. `npm run build` → expect success (ng-packagr builds the SCSS).
3. `npm run format` → prettier write; commit any formatting changes as `style: prettier formatting`.
4. Open `docs/theme-preview.html` in a desktop browser; confirm only Minimal Yet Warm renders and surfaces are distinct.
5. `git status --short` → confirm only intended files touched:
   - `src/theme/_variables.scss`
   - `src/components/module-header/module-header.component.scss`
   - `src/components/module-footer/module-footer.component.scss`
   - `docs/theme-preview.html`
   - `.agent/project-info/brief.md`
   - `docs/THEME.md`
   - `CHANGELOG.md`

   - (any prettier-only formatting files flagged in step 3)
   If any other file shows up, escalate.

### Final commit-graph (per task)

- Step 4.2 Task 0: `docs(preview): reduce theme-preview to Minimal Yet Warm`
- Step 4.2 Task 2: `feat(theme): adopt Minimal Yet Warm palette in _variables.scss`
- Step 4.2 Task 3: `feat(theme): apply warm surface model to module chrome (header→elevated, footer→inset)`
- Step 4.2 Task 4: (audit-only — folded into Task 3 commit body unless escalation)
- Step 4.2 Task 5: `docs: record Minimal Yet Warm palette across brief, THEME, and CHANGELOG`
- Optional: `style: prettier formatting`

---

## 8. Acceptance-criteria traceability

| TODO # | Criterion | Satisfied by |
| -------- | ----------- | -------------- |
| 1 | Theme is recognizably Minimal Yet Warm | §3.2/§3.3 token values + preview (§1.3/§1.4) |
| 2 | ≥4 surface levels distinguishable | §3.3 bg tokens + §4.2 module-chrome role swaps + preview |
| 3 | Module separates from canvas | panel `#F3F1E9` > canvas `#EAE7DC` + `--cba-shadow-module` warm-tinted |
| 4 | Text primary/secondary/muted readable | spec §4.1 ratios via §3.3 values + §4.4 audit |
| 5 | Borders + footer/header chrome visible | §3.3 border tokens + §4.5 audit |
| 6 | Coral accents controlled (no large fills) | §3.3 accent tokens + §4.2 (no primary coral) + §5 audit |
| 7 | Token names stable; build succeeds | §3.4 (no renames) + §7 step 2 build |
| 8 | Docs record final palette | §6.2 brief §5 + §6.3 THEME.md + §6.4 CHANGELOG + §1.6 preview comment |

---

## 9. Explicitly NOT done by this task (deferred / out of scope)

- New components or component API changes (only token-value and surface-role token-reference edits in 2 `.scss` files).
- Multi-theme runtime switching.
- Mobile palette.
- One-off hex in MFEs.
- Publishing to npm / pushing `main` (handled by Step 5 of the Critical Workflow, not this step).
- New utility classes / mixins (file list scans showed `_utilities.scss` / `_mixins.scss` are unchanged; no new additions).
- Any reassignment of which TODO line maps to which source hex beyond the spec (the spec is authoritative).

---

## 10. Risk register

| Risk | Mitigation |
| ------ | ------------ |
| Coral primary button appears in some other module SCSS not yet scanned | `rg -n "cba-accent-primary" src/components` cross-check; expected only `button.scss`. Re-audit before Task 2 commit. |
| Muted text accidentally placed on new inset footer | §4.4 audit catches it; remediate by swapping to `--cba-text-secondary`. |
| `--cba-border-subtle` value change from alias→literal breaks a component relying on it matching bg-elevated | Re-scan `rg -n "cba-border-subtle" src/components`; if any component relied on the alias identity, escalate (do not silently change). |
| Preview `.map` `\n` rendering | Use `<br>` separators (current behavior) to avoid needing `white-space:pre`. |
| brief.md §5 block grows past comfortable length | Acceptable — docs files are exempt from the 200-line code limit. |
| User rejects surface model in Task 1 gate | Re-invoke frontend-specialist/architector; do NOT proceed to Task 2 without confirmation. |

- (any prettier-only formatting files flagged in step 3)
   If any other file shows up, escalate.

### Final commit-graph (per task)

- Step 4.2 Task 0: `docs(preview): reduce theme-preview to Minimal Yet Warm`
- Step 4.2 Task 2: `feat(theme): adopt Minimal Yet Warm palette in _variables.scss`
- Step 4.2 Task 3: `feat(theme): apply warm surface model to module chrome (header→elevated, footer→inset)`
- Step 4.2 Task 4: (audit-only — folded into Task 3 commit body unless escalation)
- Step 4.2 Task 5: `docs: record Minimal Yet Warm palette across brief, THEME, and CHANGELOG`
- Optional: `style: prettier formatting`

---

## 8. Acceptance-criteria traceability

| TODO # | Criterion | Satisfied by |
| -------- | ----------- | -------------- |
| 1 | Theme is recognizably Minimal Yet Warm | §3.2/§3.3 token values + preview (§1.3/§1.4) |
| 2 | ≥4 surface levels distinguishable | §3.3 bg tokens + §4.2 module-chrome role swaps + preview |
| 3 | Module separates from canvas | panel `#F3F1E9` > canvas `#EAE7DC` + `--cba-shadow-module` warm-tinted |
| 4 | Text primary/secondary/muted readable | spec §4.1 ratios via §3.3 values + §4.4 audit |
| 5 | Borders + footer/header chrome visible | §3.3 border tokens + §4.5 audit |
| 6 | Coral accents controlled (no large fills) | §3.3 accent tokens + §4.2 (no primary coral) + §5 audit |
| 7 | Token names stable; build succeeds | §3.4 (no renames) + §7 step 2 build |
| 8 | Docs record final palette | §6.2 brief §5 + §6.3 THEME.md + §6.4 CHANGELOG + §1.6 preview comment |

---

## 9. Explicitly NOT done by this task (deferred / out of scope)

- New components or component API changes (only token-value and surface-role token-reference edits in 2 `.scss` files).
- Multi-theme runtime switching.
- Mobile palette.
- One-off hex in MFEs.
- Publishing to npm / pushing `main` (handled by Step 5 of the Critical Workflow, not this step).
- New utility classes / mixins (file list scans showed `_utilities.scss` / `_mixins.scss` are unchanged; no new additions).
- Any reassignment of which TODO line maps to which source hex beyond the spec (the spec is authoritative).

---

## 10. Risk register

| Risk | Mitigation |
| ------ | ------------ |
| Coral primary button appears in some other module SCSS not yet scanned | `rg -n "cba-accent-primary" src/components` cross-check; expected only `button.scss`. Re-audit before Task 2 commit. |
| Muted text accidentally placed on new inset footer | §4.4 audit catches it; remediate by swapping to `--cba-text-secondary`. |
| `--cba-border-subtle` value change from alias→literal breaks a component relying on it matching bg-elevated | Re-scan `rg -n "cba-border-subtle" src/components`; if any component relied on the alias identity, escalate (do not silently change). |
| Preview `.map` `\n` rendering | Use `<br>` separators (current behavior) to avoid needing `white-space:pre`. |
| brief.md §5 block grows past comfortable length | Acceptable — docs files are exempt from the 200-line code limit. |
| User rejects surface model in Task 1 gate | Re-invoke frontend-specialist/architector; do NOT proceed to Task 2 without confirmation. |

---

## 4.5a Front-end Verification Report

**Agent:** frontend-specialist sub-agent  
**Date:** 2026-08-04  
**Branch:** `feat/palette-refresh-minimal-yet-warm`  
**Spec:** `.kilo/plans/20260804-phase8-frontend-spec.md`  

### Summary

| Check | Result |
|-------|--------|
| `--cba-*` token values match spec §3 | Pass |
| 4+ visually distinct warm surface levels | Pass |
| `module-header` uses `--cba-bg-elevated` | Pass |
| `module-footer` uses `--cba-bg-tertiary` | Pass |
| Primary/secondary text contrast on panel/elevated | Pass |
| Muted text restricted on `--cba-bg-tertiary` | Pass |
| `--cba-accent-primary` is warm taupe (not coral) | Pass |
| Coral literals only in `_variables.scss` + docs | Pass |
| No component uses coral as large background fill | Pass |
| `docs/theme-preview.html` only shows Minimal Yet Warm | Pass |
| Preview uses static token values | Pass |
| Preview `.search` chip does not demonstrate muted-on-inset | Pass |
| `npm run build` | Pass |
| `npm run lint` | Pass |

### 1. Token values vs. spec

`src/theme/_variables.scss` was compared token-by-token against spec §3. Every `--cba-*` value matches exactly, including:

- Backgrounds: `#EAE7DC`, `#F3F1E9`, `#D8C3A5`, `#FCFBF6`, `rgba(43, 38, 32, 0.45)`
- Text: `#2B2620`, `#4A4640`, `#625C55`, `#FDFCF8`
- Borders: `#E7E5DE`, `#A7A6A2`, `#8E8D8A`
- Accents: `#6B5B4F`, `#3E6B4F`, `#E98074`, `#B93E36`, `#56717E`
- Interactive: `rgba(43, 38, 32, 0.06)`, `rgba(43, 38, 32, 0.10)`, `0 0 0 3px rgba(232, 90, 79, 0.45)`
- Shadows: `0 4px 16px rgba(43, 34, 28, 0.12)`, `0 8px 24px rgba(43, 34, 28, 0.18)`
- Layout / radius / spacing: unchanged

No token names were added, removed, or renamed.

### 2. Surface levels

Four warm surfaces are defined and visually distinct:

1. `--cba-bg-primary` `#EAE7DC` — canvas (darkest light)
2. `--cba-bg-secondary` `#F3F1E9` — panel/card body
3. `--cba-bg-elevated` `#FCFBF6` — module header / dropdowns / popovers (lightest)
4. `--cba-bg-tertiary` `#D8C3A5` — inset / table headers / input wells / module footer

### 3. Module separation

- `src/components/module-header/module-header.component.scss` line 11: `background-color: var(--cba-bg-elevated);` ✓
- `src/components/module-footer/module-footer.component.scss` line 11: `background-color: var(--cba-bg-tertiary);` ✓

### 4. Text contrast / muted-on-inset restriction

All `var(--cba-text-muted)` usages in `src/` were audited against their enclosing background:

| File | Usage | Background | Pair |
|------|-------|------------|------|
| `src/theme/_variables.scss` | token definition | — | — |
| `src/theme/_typeahead.scss` | disabled dropdown item | `--cba-bg-elevated` | muted on elevated (passes AA) |
| `src/theme/_datepicker.scss` | weekday labels | `--cba-bg-elevated` | muted on elevated (passes AA) |
| `src/components/module-header/module-header.component.scss` | dirty status | `--cba-bg-elevated` | muted on elevated (passes AA) |
| `src/components/form-field/cba-field.component.scss` | hint text | inherits panel (not tertiary) | muted on panel/elevated (passes AA) |
| `src/components/empty-state/cba-empty-state.component.scss` | icon + description | inherits parent surface | no tertiary background |
| `src/components/dropdown/cba-dropdown.component.scss` | disabled item | `--cba-bg-elevated` | muted on elevated (passes AA) |
| `src/components/badge/cba-badge.component.scss` | default/outline neutral | transparent / elevated | no tertiary background |

No component pairs `--cba-text-muted` with `--cba-bg-tertiary`. The one previous violation in `src/theme/_accordion.scss` `.accordion-button[disabled]` was fixed during the 4.3 review cycle: it now uses `--cba-text-secondary` on `--cba-bg-tertiary`.

### 5. Accent discipline

- `--cba-accent-primary` is `#6B5B4F` warm taupe, not coral. ✓
- Coral literals (`#E98074`, `#E85A4F`) appear only in `src/theme/_variables.scss` (warning token, focus ring, comment) and in `docs/theme-preview.html` source-hex list. ✓
- `rg` search for `background-color: var(--cba-accent-warning)` returned zero large-surface fills. The only `accent-danger` background is `src/components/button/cba-button.component.scss` `.cba-button--danger`, which is an intentional small button fill. ✓

### 6. Theme preview HTML

`docs/theme-preview.html`:

- Contains a single theme object (`id:'mw'`, `name:'Minimal Yet Warm'`). ✓
- Uses a static `tokens` object with exact spec values; `resolve = theme => theme.tokens`. ✓
- `.search` chip now uses `color: var(--text-2)` (`--cba-text-secondary`), not `--text-3`. ✓
- Sidebar active button uses warm accent colors (`#B93E36` border / `#2A211D` background) instead of previous blue-tinted palette. ✓

### 7. Build & lint

- `npm run build` — succeeded, produced `dist/` with no errors. ✓
- `npm run lint` — succeeded, `eslint "src/**/*.ts"` returned no errors. ✓

### Diffs between spec and implementation

**No token-value diffs.** All `--cba-*` values in code match the front-end spec exactly.

**Accepted deviations / review-cycle improvements (not in original 4.1a spec but aligned with its intent):**

1. `src/theme/_accordion.scss` — disabled accordion button now uses `--cba-text-secondary` instead of `--cba-text-muted` on `--cba-bg-tertiary` to satisfy the documented muted-on-inset restriction.
2. `docs/theme-preview.html` — replaced dynamic `autoRoles`/`buildFromRoles` JavaScript with a static `tokens` object so preview values exactly match the library tokens. This also fixed the `.search` chip demonstrating the restricted muted-on-inset pair.
3. `docs/theme-preview.html` — `.theme-btn.active` colors updated to warm accent tones.
4. `CHANGELOG.md` includes a `### Fixed` subsection documenting the accordion and preview fixes above.

These changes were produced by the 4.3 code-review / simplification cycle and do not contradict the spec; they reinforce the spec's contrast and accent-discipline rules.

### Front-end quality issues

No blocking front-end quality issues found. Minor observations:

- `src/components/module-footer/module-footer.component.scss` still contains `border-top: none;` and `box-shadow: none;` resets. The 4.3 simplification report flagged these as potentially redundant, but they are harmless and do not affect the palette implementation. Removing them is optional.
- `docs/theme-preview.html` still includes ~40 lines of theme-list rendering code for a single theme. This is intentional per the spec (keep the list UI for future themes) and is not a quality defect.

### Recommendation

Implementation is verified and matches the front-end specification. No further front-end changes are required before 4.5b overall plan adherence.

---

## 4.3 Code Review Report

**Reviewer:** code-reviewer sub-agent  
**Date:** 2026-08-04  
**Branch:** `feat/palette-refresh-minimal-yet-warm`  
**Commits reviewed:** `dd36fa6`, `2e9b31a`, `676ff84`, `330c594`

### Verification summary

| Check | Result |
| ------- | -------- |
| Token names stable (no `--cba-*` renames) | Pass |
| `_variables.scss` color values match front-end spec §3 | Pass |
| No hard-coded hex/rgba in `src/components/**/*.scss` | Pass |
| `module-header` uses `--cba-bg-elevated` | Pass |
| `module-footer` uses `--cba-bg-tertiary` | Pass |
| Coral literals only in `_variables.scss` + docs | Pass |
| `npm run build` | Pass |
| `npm run lint` | Pass |
| `docs/theme-preview.html` shows only "Minimal Yet Warm" | Pass |

### Findings

#### 1. Muted text on inset surface — `src/theme/_accordion.scss` (must fix)

`.accordion-button[disabled]` sets both `background-color: var(--cba-bg-tertiary)` and `color: var(--cba-text-muted)`. This violates the documented restriction that `--cba-text-muted` must not be used on `--cba-bg-tertiary` (~3.86:1, fails WCAG AA).

**Fix:** change the disabled color to `--cba-text-secondary`:

```scss
.accordion-button[disabled] {
  color: var(--cba-text-secondary);
  cursor: not-allowed;
  opacity: 0.65;
  background-color: var(--cba-bg-tertiary);
}
```

This keeps the recessed disabled surface while meeting the contrast target.

#### 2. Preview demonstrates muted-on-inset — `docs/theme-preview.html` (should fix)

The `.search` placeholder chip uses:

```css
.search {
  background: var(--inset);
  color: var(--text-3);
}
```

`--text-3` maps to `--cba-text-muted` and `--inset` maps to `--cba-bg-tertiary`, so the preview itself displays the restricted pair.

**Fix:** use `--text-2` (`--cba-text-secondary`) for the search placeholder text:

```css
.search { color: var(--text-2); }
```

#### 3. Preview dynamically overrides the fixed token values (recommend fixing)

`applyTheme()` calls `resolve(theme)` → `buildFromRoles(...)`, which recomputes `--text`, `--text-2`, `--text-3`, `--border`, `--border-2`, `--shadow`, `--hover`, and `--on-accent` from the source colors rather than using the fixed token values declared in the `.preview` CSS block. This means the rendered preview and the `roleMap` values do not exactly match the `--cba-*` token values (e.g. shadow becomes `0 4px 20px rgba(20,16,12,0.12)` instead of `0 4px 16px rgba(43,34,28,0.12)`). Since the preview is intended to mirror the token system, the override weakens its accuracy.

**Fix options (choose one):**

- **A — Bypass computation for the single theme:** in `applyTheme`, when `theme.id === 'mw'`, return the exact fixed map matching `.preview` and the `--cba-*` tokens, then update `roleMap` to read from that same map.
- **B — Remove `applyTheme` override:** rely on the static `.preview` custom properties and only use `applyTheme` to update the active-name label. The theme-list UI is already reduced to one entry, so no runtime switching is required.

Option A is safer if future themes will be appended; Option B is the smallest change.

#### 4. Minor visual inconsistency in preview active button (optional)

`.theme-btn.active` still uses the blue-tinted leftovers from the previous theme (`border-color:#7aa2ff; background:#1e2430`). This is not a token-system surface, but it visually clashes with the warm palette. Consider changing it to a warm accent, e.g.:

```css
.theme-btn.active {
  border-color: #B93E36;
  background: #2A211D;
}
```

### Fix plan

1. **Fix finding 1** in `src/theme/_accordion.scss` — swap `--cba-text-muted` to `--cba-text-secondary` for disabled accordion buttons.
2. **Fix finding 2** in `docs/theme-preview.html` — change `.search` color from `--text-3` to `--text-2`.
3. **Address finding 3** in `docs/theme-preview.html` — either bypass `buildFromRoles` for the single Minimal Yet Warm theme or stop overriding the static token values in `.preview`.
4. (Optional) **Fix finding 4** — update `.theme-btn.active` colors to a warm accent.
5. Re-run `npm run lint` and `npm run build` after edits.
6. Re-audit `rg -n "cba-text-muted" src` to confirm no new muted-on-tertiary pairs are introduced.

### Files requiring changes

- `src/theme/_accordion.scss`
- `docs/theme-preview.html`

### Files verified as correct (no changes needed)

- `src/theme/_variables.scss`
- `src/components/module-header/module-header.component.scss`
- `src/components/module-footer/module-footer.component.scss`
- `.agent/project-info/brief.md` §5
- `docs/THEME.md`
- `CHANGELOG.md`

---

## 4.3 Code Simplification Report

**Reviewer:** code-simplifier sub-agent  
**Scope:** `src/theme/_variables.scss`, `src/components/module-header/module-header.component.scss`, `src/components/module-footer/module-footer.component.scss`, `docs/theme-preview.html`, `.agent/project-info/brief.md` §5, `docs/THEME.md`, `CHANGELOG.md`  
**Date:** 2026-08-04  

### Overall assessment

The implementation is clean, well-structured, and faithful to the front-end spec. Token names are stable, component SCSS contains **zero hard-coded colors**, and the surface-role swaps in the module chrome are minimal and correct. The main simplification opportunity is in `docs/theme-preview.html`, which still carries a large body of generalized multi-theme color-derivation logic even though it now renders a single known theme. The concurrent code-review report in this same plan file independently identified several related correctness issues (muted-on-inset in `_accordion.scss`, preview `.search` color, and dynamic preview overrides); this simplification report focuses on removing complexity while also aligning the preview with the exact token values.

---

### Finding 1 — `docs/theme-preview.html` contains unused generalized theme logic

**Severity:** Medium (simplicity + correctness)  
**Location:** `docs/theme-preview.html`, script block (dynamic helper functions)

#### Observation

The preview now supports only one theme (`Minimal Yet Warm`), yet it retains:

- `autoRoles()` — logic to infer canvas/panel/elevated/inset from an arbitrary source palette.
- `buildFromRoles()` — derives text, border, shadow, hover, and on-accent colors dynamically.
- Helper functions: `contrastText`, `contrastText2`, `contrastText3`, `borderOn`, `onAccent`, `chroma`, `sortByLum`, `isLight`, `luminance`, `mix`, `hexToRgb`, `rgbToHex`.

These are only needed for algorithmic derivation of themes that do not declare explicit values. The single `mw` theme already declares explicit `roles` and `accents`, so `resolve(theme)` recomputes values that are already known.

#### Why this matters

1. **Unnecessary complexity** — ~200 lines of JavaScript serve no purpose for one theme.
2. **Risk of drift from spec** — `buildFromRoles()` derives several preview properties from the panel color using its own mixing ratios, not the exact token values in the spec. The `.preview` CSS block hardcodes the correct values, but `applyTheme()` immediately overwrites them with computed values. This means the rendered preview may subtly diverge from the library tokens it is supposed to mirror. The code-review report in this same file also flagged this as a correctness issue.

#### Simplification plan

1. Add a complete `tokens` object directly to the single theme entry, mapping every preview CSS custom property to the exact spec value:

   ```js
   const themes=[
     {
       id:'mw',
       group:'Extra',
       name:'Minimal Yet Warm',
       note:'Canvas cálido + coral reservado a acentos',
       source:['#EAE7DC','#D8C3A5','#8E8D8A','#E98074','#E85A4F'],
       tokens:{
         '--canvas':'#EAE7DC',
         '--panel':'#F3F1E9',
         '--elevated':'#FCFBF6',
         '--inset':'#D8C3A5',
         '--text':'#2B2620',
         '--text-2':'#4A4640',
         '--text-3':'#625C55',
         '--border':'#A7A6A2',
         '--border-2':'#8E8D8A',
         '--accent':'#6B5B4F',
         '--success':'#3E6B4F',
         '--warning':'#E98074',
         '--danger':'#B93E36',
         '--info':'#56717E',
         '--shadow':'0 4px 16px rgba(43,34,28,.12)',
         '--hover':'rgba(43,38,32,.06)',
         '--on-accent':'#FDFCF8'
       }
     }
   ];
   ```

2. Replace `resolve(theme)` with a one-line accessor:

   ```js
   const resolve=theme=>theme.tokens;
   ```

3. Remove the following functions entirely:
   - `autoRoles`
   - `buildFromRoles`
   - `contrastText`, `contrastText2`, `contrastText3`
   - `borderOn`
   - `onAccent`
   - `chroma`
   - `sortByLum`
   - `isLight`
   - `luminance`
   - `mix`
   - `hexToRgb`
   - `rgbToHex`

   Keep only the minimal DOM helpers (`applyTheme`, theme-list rendering, source-hex rendering).

4. Update `applyTheme()` to apply `theme.tokens` directly and generate the same role-map/accent rows from the static map.

5. Keep the theme-list UI and group-label rendering intact so future themes can be appended with their own `tokens` objects.

6. While editing `docs/theme-preview.html`, also apply the code-review finding: change `.search { color: var(--text-3); }` to `.search { color: var(--text-2); }` so the preview does not demonstrate the restricted muted-on-inset pair.

7. (Optional, from code-review report) Update `.theme-btn.active` colors to warm accents instead of the leftover blue-tinted palette.

**Expected outcome:** `docs/theme-preview.html` shrinks by ~180–200 lines, the preview values exactly match the spec and `_variables.scss`, and the file is easier to maintain.

---

### Finding 2 — Minor redundant declarations in `module-footer.component.scss`

**Severity:** Low  
**Location:** `src/components/module-footer/module-footer.component.scss`, lines 12–13

#### Observation

```scss
.cba-module-footer {
  ...
  border-top: none;
  box-shadow: none;
  ...
}
```

Both declarations reset properties to their initial/browser-default values. There is no parent or inherited style inside this component that applies a border-top or box-shadow, so these declarations are defensive noise.

#### Simplification plan

Remove `border-top: none;` and `box-shadow: none;`. If a future parent or global style introduces unwanted borders/shadows on the footer, handle it then rather than pre-emptively resetting defaults.

**Expected outcome:** File is 2 lines shorter and the rule is limited to meaningful visual properties.

---

### Finding 3 — `_variables.scss`, `brief.md`, `THEME.md`, and `CHANGELOG.md` are already concise

**Assessment:** No simplification required.

- `_variables.scss` is 104 lines, grouped cleanly, and every value is a literal or simple `rgba()` — no nested SCSS, no aliases of aliases, no redundant comments.
- `brief.md` §5 holds the authoritative token block once; `_variables.scss` mirrors it; `THEME.md` only references tokens by name. This is intentional separation of concerns, not duplication.
- `CHANGELOG.md` is well-categorized (Changed / Added / Notes) and links to authoritative docs.
- No commented-out code was found in any reviewed file.

---

### Rules compliance check

| Rule | Status | Notes |
| ------ | -------- | ------- |
| max-lines-per-file (src/ ≤ 200, ideally ≤ 125 excl. blanks/comments/imports) | Pass | `_variables.scss` 104 lines; `module-header.component.scss` 116 lines; `module-footer.component.scss` 55 lines. |
| max-lines-per-method | Pass | No method bodies exceed 50 lines in the reviewed SCSS. |
| max-depth (≤ 2 nested blocks) | Pass | Component SCSS has no deep nesting. Preview JS has deeper nesting but is a doc/preview file, not src/. |
| max-arguments-per-method (≤ 2) | Pass | SCSS functions/mixins not affected; preview JS helpers take ≤ 2 args. |
| no-commented-code | Pass | No commented-out code in any reviewed file. |
| self-documenting-code | Pass | Token names and section comments are descriptive. |
| single-section boolean conditions | Pass | No complex boolean conditions in reviewed SCSS. |
| prefer-private-members | N/A | Reviewed files are SCSS/CSS/HTML, not TypeScript classes. |

---

### Summary of recommended changes

| Priority | File | Change | Effort |
| ---------- | ------ | -------- | -------- |
| Medium | `docs/theme-preview.html` | Replace dynamic color-derivation JS with a static `tokens` object on the single theme; remove `autoRoles`, `buildFromRoles`, and helper functions. Also fix `.search` color to `--text-2` per code-review finding. | ~15 min |
| Low | `src/components/module-footer/module-footer.component.scss` | Remove redundant `border-top: none;` and `box-shadow: none;`. | ~2 min |
| — | `src/theme/_variables.scss`, `.agent/project-info/brief.md`, `docs/THEME.md`, `CHANGELOG.md` | No changes required. | — |

No functional or visual regressions are expected from these simplifications. If the preview-HTML simplification is applied, verify in a desktop browser that only *Minimal Yet Warm* renders and that the four surface chips remain distinct.

---

## 4.3 Code Simplification Report

**Reviewer:** code-simplifier sub-agent (current execution)  
**Date:** 2026-08-04  
**Scope:** `src/theme/_variables.scss`, `src/components/module-header/module-header.component.scss`, `src/components/module-footer/module-footer.component.scss`, `docs/theme-preview.html`, `.agent/project-info/brief.md` §5, `docs/THEME.md`, `CHANGELOG.md`  
**Branch:** `feat/palette-refresh-minimal-yet-warm`

### Overall assessment

The implementation is clean, token names are stable, and component SCSS contains no hard-coded colors. The main simplification opportunity remains in `docs/theme-preview.html`, which still carries generalized multi-theme derivation logic despite rendering only one theme. A minor redundant-declaration cleanup is possible in the module footer. All other reviewed files are concise and need no changes.

### Finding 1 — `docs/theme-preview.html` still derives colors dynamically instead of using the static Minimal Yet Warm token map

**Severity:** Medium (simplicity + correctness)  
**Location:** `docs/theme-preview.html`, script block

The file is reduced to a single theme (`mw`), but it still defines `autoRoles()`, `buildFromRoles()`, and ~12 color helpers (`hexToRgb`, `rgbToHex`, `mix`, `luminance`, `isLight`, `sortByLum`, `chroma`, `borderOn`, `contrastText`, `contrastText2`, `contrastText3`, `onAccent`). These functions recompute `--text`, `--text-2`, `--text-3`, `--border`, `--border-2`, `--shadow`, `--hover`, and `--on-accent` from the source palette, overwriting the exact values declared in the `.preview` CSS block and causing the rendered preview to drift slightly from the library tokens.

**Simplification plan:**

1. Attach a complete static `tokens` object to the single theme entry:

   ```js
   const themes = [
     {
       id: 'mw',
       group: 'Extra',
       name: 'Minimal Yet Warm',
       note: 'Canvas cálido + coral reservado a acentos',
       source: ['#EAE7DC', '#D8C3A5', '#8E8D8A', '#E98074', '#E85A4F'],
       tokens: {
         '--canvas': '#EAE7DC',
         '--panel': '#F3F1E9',
         '--elevated': '#FCFBF6',
         '--inset': '#D8C3A5',
         '--text': '#2B2620',
         '--text-2': '#4A4640',
         '--text-3': '#625C55',
         '--border': '#A7A6A2',
         '--border-2': '#8E8D8A',
         '--accent': '#6B5B4F',
         '--success': '#3E6B4F',
         '--warning': '#E98074',
         '--danger': '#B93E36',
         '--info': '#56717E',
         '--shadow': '0 4px 16px rgba(43,34,28,.12)',
         '--hover': 'rgba(43,38,32,.06)',
         '--on-accent': '#FDFCF8'
       }
     }
   ];
   ```

2. Replace `resolve(theme)` with a one-line accessor:

   ```js
   const resolve = theme => theme.tokens;
   ```

3. Delete all color-derivation helpers listed above. Keep only the DOM helpers needed to render the list, source hexes, role map, accent chips, and raw chips.

4. Update `applyTheme()` to apply `theme.tokens` directly and generate the role map/accent rows from the static map.

5. Keep the theme-list UI and group-label rendering so future themes can be appended with their own `tokens` objects.

6. While editing the file, also change `.search { color: var(--text-3); }` to `.search { color: var(--text-2); }` so the preview does not demonstrate the restricted muted-on-inset pair.

7. (Optional) Update `.theme-btn.active` colors to warm accents (e.g., `#B93E36` border / `#2A211D` background) instead of the leftover blue-tinted palette.

**Expected outcome:** `docs/theme-preview.html` shrinks by ~180–200 lines, preview values exactly match the spec and `_variables.scss`, and maintenance is simpler.

### Finding 2 — `module-footer.component.scss` contains defensive declarations that reset defaults

**Severity:** Low  
**Location:** `src/components/module-footer/module-footer.component.scss`, lines 12–13

```scss
.cba-module-footer {
  ...
  border-top: none;
  box-shadow: none;
  ...
}
```

Neither a parent selector nor a global style inside this component applies a `border-top` or `box-shadow`, so these are defensive noise.

**Simplification plan:** Remove `border-top: none;` and `box-shadow: none;`. If a future parent or global style introduces unwanted borders/shadows, handle it at that point.

**Expected outcome:** File is 2 lines shorter and the rule is limited to meaningful visual properties.

### Finding 3 — No simplification required for the remaining reviewed files

- `src/theme/_variables.scss` (104 lines): grouped cleanly, values are simple literals or `rgba()`, no alias chains, no redundant comments.
- `.agent/project-info/brief.md` §5: authoritative token block; intentional duplication with `_variables.scss` is a separation of concerns, not redundancy.
- `docs/THEME.md`: references tokens by name only; no value duplication.
- `CHANGELOG.md`: well-categorized, concise, and links to authoritative docs.
- `src/components/module-header/module-header.component.scss`: readable, token-only, no redundant declarations.

No commented-out code was found in any reviewed file.

### Rules compliance check

| Rule | Status | Notes |
|------|--------|-------|
| max-lines-per-file (src/ ≤ 200, ideally ≤ 125 excl. blanks/comments/imports) | Pass | `_variables.scss` 104 lines; `module-header.component.scss` 116 lines; `module-footer.component.scss` 55 lines. |
| max-lines-per-method | Pass | SCSS files have no long method bodies; preview JS helpers are in a doc/preview file, not src/. |
| max-depth (≤ 2 nested blocks) | Pass | Component SCSS has no deep nesting. |
| max-arguments-per-method (≤ 2) | Pass | SCSS not affected; preview JS helpers take ≤ 2 args. |
| no-commented-code | Pass | No commented-out code in any reviewed file. |
| self-documenting-code | Pass | Token names and comments are descriptive. |
| single-section boolean conditions | Pass | No complex boolean conditions in reviewed SCSS. |
| prefer-private-members | N/A | Reviewed files are SCSS/CSS/HTML, not TypeScript classes. |

### Summary of recommended changes

| Priority | File | Change | Effort |
|----------|------|--------|--------|
| Medium | `docs/theme-preview.html` | Replace dynamic color-derivation JS with a static `tokens` object; remove helper functions; fix `.search` color to `--text-2`; optional warm `.theme-btn.active` colors. | ~15 min |
| Low | `src/components/module-footer/module-footer.component.scss` | Remove redundant `border-top: none;` and `box-shadow: none;`. | ~2 min |
| — | `src/theme/_variables.scss`, `.agent/project-info/brief.md`, `docs/THEME.md`, `CHANGELOG.md`, `src/components/module-header/module-header.component.scss` | No changes required. | — |

If the preview-HTML simplification is applied, verify in a desktop browser that only *Minimal Yet Warm* renders and that the four surface chips (canvas, panel, elevated, inset) remain visually distinct.

---

## 4.5b Overall Plan Adherence Report

**Agent:** architector sub-agent  
**Date:** 2026-08-04  
**Branch:** `feat/palette-refresh-minimal-yet-warm`  
**Plan checked:** `.kilo/plans/20260804-phase8-palette-refresh.md` (4.1b Implementation Plan)  
**Front-end spec checked:** `.kilo/plans/20260804-phase8-frontend-spec.md` (4.1a)  
**Front-end verification (4.5a) incorporated:** yes — located earlier in this same file under `## 4.5a Front-end Verification Report`.

### Summary verdict

**ADHERENT.** The implementation follows the 4.1b plan and the 4.1a front-end spec. All eight TODO acceptance criteria are satisfied. A small number of deviations exist; every one of them was produced by the sanctioned 4.3 code-review / code-simplification cycle, is fully documented in this file (§4.3 reports + §4.5a report), and reinforces — rather than contradicts — the spec and the TODO. No new TODO file is required.

### Verification inputs (commands actually run in this step)

| Command | Result |
| ------- | ------ |
| `git status --short` | `M .kilo/plans/20260804-phase8-palette-refresh.md`; `?? .kilo/plans/20260804-phase8-frontend-spec.md`; `?? .playwright-mcp/` — no implementation file dirty/untracked. |
| `git log --oneline -15` | 9 implementation commits on the feature branch (bump version → preview → variables → module chrome → docs → 4.3 fixes → footer simplify → changelog Fixed). Matches the planned commit graph (plan §7). |
| `git diff --name-only main...HEAD` | 9 files changed vs `main` (see file list below). |
| `npm run lint` | Passed — `eslint "src/**/*.ts"` returned no errors. |
| `npm run build` | Passed — `ng-packagr` built `dist/` with no errors (3188 ms). |
| `Grep` `#[0-9A-Fa-f]{3,8}\|rgba?\(` in `src/components` (`.scss`) | **No files found** — zero hard-coded colors in components. |
| `Grep` `#E98074\|#E85A4F` in `src/` | 3 matches, all in `src/theme/_variables.scss` (the `--cba-accent-warning` token value + 2 comment lines in the header). **Zero in components.** |
| `Grep` `cba-text-muted` in `src/` | 10 matches across `_variables.scss`, `_typeahead.scss`, `_datepicker.scss`, `module-header`, `form-field`, `empty-state`, `dropdown`, `badge`. **`_accordion.scss` is NOT among them** — confirms the 4.3 fix (disabled accordion now uses `--cba-text-secondary`). |
| `Grep` `background-color:\s*var\(--cba-accent-warning\)` in `src/` | **No files found** — no large warning fills. |

### 1. Planned files modified as intended

File-by-file comparison of `git diff --name-only main...HEAD` against plan §7 step 5:

| File | Planned by | Status | Notes |
| ---- | ----------- | ------ | ----- |
| `package.json` | Step 3 (version bump 0.8.2 → 0.9.0) | ✅ Done (commit `c57d7b5`) | `chore: bump version to 0.9.0`. |
| `src/theme/_variables.scss` | Task 2 §3 | ✅ Done (commit `2e9b31a`) | Header + `:root` block match plan §3.2/§3.3 verbatim; token values match spec §3 exactly (see §4 below). 104 lines. |
| `src/components/module-header/module-header.component.scss` | Task 3 §4.2 | ✅ Done (commit `676ff84`) | Line 11 = `background-color: var(--cba-bg-elevated);`. Status classes untouched. |
| `src/components/module-footer/module-footer.component.scss` | Task 3 §4.2 | ✅ Done (commits `676ff84` + `a118c29`) | Line 11 = `background-color: var(--cba-bg-tertiary);`. See deviation B re removed resets. |
| `docs/theme-preview.html` | Task 0 §1 | ✅ Done (commits `dd36fa6` + `ee2ab0c`) | Single `mw` theme; static `tokens` object; `resolve = theme => theme.tokens`; expanded roleMap with `<br>`; top-of-file doc comment present; `.search` uses `--text-2`; `.theme-btn.active` uses warm `#B93E36`/`#2A211D`. |
| `.agent/project-info/brief.md` | Task 5 §6.2 | ✅ Done (commit `330c594`) | §5 token block == plan §3.3 == spec §3; palette note + muted restriction updated. |
| `docs/THEME.md` | Task 5 §6.3 | ✅ Done (commit `330c594`) | Intro line 11 now reads "Minimal Yet Warm design system". |
| `CHANGELOG.md` | Task 5 §6.4 | ✅ Done (commits `330c594` + `9e0ece8`) | `[0.9.0] - 2026-08-04` section with Changed/Added/Notes + Fixed subsection. |
| `src/theme/_accordion.scss` | **Not in original §7 list** | ⚠ Accepted deviation (commit `ee2ab0c`) | See deviation A. |

### 2. Unintended / extra files

- `src/theme/_accordion.scss` — modified by the 4.3 review cycle, not listed in plan §7 step 5. **Accepted deviation A** (see below). Tracked and committed.
- `.playwright-mcp/` — untracked tooling artifact (Playwright MCP session dir), **not part of the implementation**. Not gitignored, but **not staged**, so gitignore-compliance is satisfied (no gitignore-matching file is staged). Advisory only: this directory should not be committed and ideally should be added to `.gitignore`. No code deviation. Out of 4.5b scope to modify.
- `.kilo/plans/20260804-phase8-frontend-spec.md` — untracked 4.1a deliverable. Expected; should be committed alongside the plan file.
- `.kilo/plans/20260804-phase8-palette-refresh.md` — modified (this file; reports appended across 4.3, 4.5a, 4.5b). Expected.

No other implementation file is dirty or untracked. No production source file outside the planned set was changed.

### 3. Deviations from the 4.1b plan

**Deviation A — `src/theme/_accordion.scss` edited (disabled accordion button).**
- Plan §7 expected-AC: zero; §4.3 no-change list did not flag accordion; §4.4 audit expected "no additional edits beyond the two surface-role swaps".
- What happened: 4.3 code-review (Finding 1) found `.accordion-button[disabled]` paired `--cba-text-muted` with `--cba-bg-tertiary`, which is the spec-restricted ~3.86:1 pair (spec §4.1). Fix (committed in `ee2ab0c`) replaced the disabled color with `--cba-text-secondary`. Verified in code: line 62 now `color: var(--cba-text-secondary);`.
- Assessment: **Acceptable. Reinforces spec §4.1 and TODO acceptance criterion #4** (text readable). The new inset surface role is exactly what exposed the latent pair. Not committing the fix would have shipped a WCAG-AA-failure introduced by this phase. Documented in §4.3 and §4.5a.

**Deviation B — `module-footer.component.scss` removed `border-top: none;` and `box-shadow: none;`.**
- Plan §4.2 explicitly said "KEEP `border-top: none;` and rely on the luminance step".
- What happened: 4.3 simplification Finding 2 (Low severity) flagged the two declarations as defensive noise. Implementer applied the simplification in commit `a118c29` (`refactor(footer): remove redundant border-top and box-shadow resets`).
- Assessment: **Acceptable minor simplification.** No visual impact on the palette/surface model: the panel↔inset luminance step (`#F3F1E9` → `#D8C3A5`) already provides the separation the plan relied on. Does not affect any acceptance criterion. The simplification report explicitly rated this "Low" and optional; the implementer's choice to apply it is within tolerance.

**Deviation C — `docs/theme-preview.html` was simplified to a static `tokens` object (removed `autoRoles`/`buildFromRoles` and ~12 color-derivation helpers).**
- Plan §1.3–§1.5 described replacing the `themes[]` array and the `.preview` CSS block but did not mandate removing the dynamic derivation JS.
- What happened: 4.3 review (Finding 3) + simplification (Finding 1) recommended replacing dynamic derivation with a static `tokens` map so the preview exactly mirrors `_variables.scss`. Applied in `ee2ab0c`. Verified: `Grep` for `buildFromRoles`/`autoRoles` in `docs/theme-preview.html` → no matches; `resolve = theme => theme.tokens` now in place.
- Assessment: **Acceptable and beneficial.** Aligns the preview with spec §6's intent that the preview mirror the `--cba-*` tokens exactly. Exceeds the literal plan but advances its goal; documented in §4.3 and §4.5a.

**Deviation D — `CHANGELOG.md` gained a `### Fixed` subsection.**
- Plan §6.4 specified Changed / Added / Notes only.
- What happened: `9e0ece8` added a `### Fixed` block documenting the accordion contrast fix and the preview corrections from the 4.3 cycle.
- Assessment: **Acceptable.** Follows Keep a Changelog categories and records the 4.3 fixes transparently. Consistent with the spec's documentation requirements.

No deviation contradicts the spec or any TODO acceptance criterion. None introduces a token rename, a new component, or a hardcoded color in a component.

### 4. Token-name stability

`src/theme/_variables.scss` exposes the same 24 `--cba-*` identifiers as before (backgrounds ×5 including overlay, text ×4, borders ×3, accents ×5, interactive ×3, layout ×3, radius ×3, shadows ×2, spacing ×8). Diff vs `main` touches only **values and comments** — no `--cba-*` identifier was added, removed, or renamed. Component SCSS continues to reference tokens by name only (zero hardcoded hex/rgba in `src/components/**/*.scss`). Acceptance criterion #7 (token names stable) satisfied.

### 5. Token values vs. front-end spec §3

Spot-checked every group in `src/theme/_variables.scss` against spec §3:

- Backgrounds: `#EAE7DC`, `#F3F1E9`, `#D8C3A5`, `#FCFBF6`, `rgba(43, 38, 32, 0.45)` ✅
- Text: `#2B2620`, `#4A4640`, `#625C55`, `#FDFCF8` ✅
- Borders: `#E7E5DE`, `#A7A6A2`, `#8E8D8A` ✅
- Accents: `#6B5B4F`, `#3E6B4F`, `#E98074`, `#B93E36`, `#56717E` ✅
- Interactive: `rgba(43, 38, 32, 0.06)`, `rgba(43, 38, 32, 0.10)`, `0 0 0 3px rgba(232, 90, 79, 0.45)` ✅
- Shadows: `0 4px 16px rgba(43, 34, 28, 0.12)`, `0 8px 24px rgba(43, 34, 28, 0.18)` ✅
- Layout / radius / spacing: unchanged ✅

`brief.md` §5 token block is byte-identical to `_variables.scss` (modulo inline comment phrasing). `docs/THEME.md` references tokens by name only. Docs are consistent with code.

### 6. Build & lint

- `npm run lint` — passed (no errors).
- `npm run build` — passed (`ng-packagr` produced `dist/`, 3188 ms, no errors).

Acceptance criterion #7 (build succeeds) satisfied.

### 7. Acceptance-criteria traceability (final)

| TODO # | Criterion | Verdict | Evidence |
| -------- | ----------- | ------- | -------- |
| 1 | Theme recognizably Minimal Yet Warm | ✅ Pass | `_variables.scss` warm sand/cream/taupe + coral accents only; preview renders single `mw` theme. |
| 2 | ≥4 surface levels distinguishable | ✅ Pass | canvas `#EAE7DC` → panel `#F3F1E9` → elevated `#FCFBF6` → inset `#D8C3A5`; module-header→elevated, module-footer→inset. |
| 3 | Module separates from canvas | ✅ Pass | panel lighter than canvas + `--cba-shadow-module` warm-tinted; preview shows distinct module chip. |
| 4 | Text primary/secondary/muted readable | ✅ Pass | primary/secondary pass AA on all intended surfaces; muted restricted on inset and enforced (accordion fix; no `cba-text-muted` on `_accordion.scss` disabled). |
| 5 | Borders + footer/header chrome visible | ✅ Pass | `--cba-border-default` `#A7A6A2` / `--cba-border-strong` `#8E8D8A`; preview section-pill uses `--border-2`, icon-btn uses `--border-2`. |
| 6 | Coral accents controlled | ✅ Pass | `--cba-accent-primary` is warm taupe `#6B5B4F` (not coral); zero coral literals in `src/components`; zero `background-color: var(--cba-accent-warning)` large fills. |
| 7 | Token names stable; build succeeds | ✅ Pass | No `--cba-*` names added/removed/renamed; `npm run lint` + `npm run build` pass. |
| 8 | Docs record final palette | ✅ Pass | `brief.md` §5, `docs/THEME.md` intro, `CHANGELOG.md` `[0.9.0]`, `docs/theme-preview.html` all record Minimal Yet Warm final values. |

### 8. Recommendation

Proceed to step 4.6 (Task Completion). No corrective TODO file is needed — all deviations are accepted, documented, and spec-reinforcing. Advisory (non-blocking, out of 4.5b scope): consider adding `.playwright-mcp/` to `.gitignore` so the tooling artifact is not accidentally staged in a future step; this does not affect Phase 8 deliverables.
