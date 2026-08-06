# Phase 9 — Task A (Tasks 1–4) Implementation Plan

**Scope owner:** architector (step 4.1b).
**Input spec:** `.kilo/plans/20260805-phase9-frontend-spec.md`.
**TODO source:** `.agent/todos/20260805/20260805-todo-0.md` — Tasks 1, 2, 3, 4 only.
**Out of scope for this plan:** Task 5 (user confirmation checkpoint — runtime step, no code), Task 6 (`docs/CONSUMER_GUIDE.md`), Task 7 (docs sync: README/INDEX/THEME/CHANGELOG/brief.md token table). Those are handled by later Critical Workflow steps.

## 1. High-Level Approach

The Shell looks flat because (a) the four surface tokens sit in the same luminance band, (b) `--cba-border-subtle` nearly matches the panel, and (c) shadows are too transparent on warm light surfaces. The front-end spec (`20260805-phase9-frontend-spec.md`) computed target L* gaps and proposes new hex/shadow values that keep the Minimal Yet Warm family, keep coral accent-only, and rename no tokens.

This plan applies **value-only changes** to three file groups:

1. `src/theme/_variables.scss` — bump 4 surface tokens + 1 border token + 2 shadow tokens, plus the in-file header comment that documents those values.
2. `src/components/module-container`, `module-header`, `module-footer` SCSS — **no selector or token-reference changes**. Per spec §8 the existing wiring (`bg-secondary` + `border-subtle` + `shadow-module` on container; `bg-elevated` + `border-bottom: border-subtle` on header; `bg-tertiary` on footer) is already correct; the new token values make that wiring read as layered. Only a header JSDoc reference in `_variables.scss` is refreshed. No component file is edited for chrome logic.
3. `docs/theme-preview.html` — mirror the new token values in the inline `.preview` CSS custom properties and in the `themes[0]` script object; bump the page comment and `<h1>`/`.hint` to Phase 9.

Acceptance is visual hierarchy (canvas ≠ panel ≠ elevated ≠ inset, visible borders, lifted modules) verified in the static preview plus build + lint.

## 2. Pre-Analysis — Technical & Architecture Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | Value-only token edits; **no token renames**, **no new tokens** | TODO constraint + spec §2. Public API of the theme stays identical; consumers (Shell/MFE) pick up the new hierarchy automatically. |
| D2 | Keep `--cba-bg-tertiary` `#D8C3A5` unchanged | Spec §3; inset sand already ~13.6 L* below the proposed panel — distinct at a glance. |
| D3 | Keep `--cba-border-default` `#A7A6A2` and `--cba-border-strong` `#8E8D8A` unchanged | Spec §3/§5; both already visible on cream/sand. |
| D4 | Keep `--cba-hover` / `--cba-active` unchanged | Spec §7; 6%/10% warm overlays still read on the new lighter surfaces. |
| D5 | Do **not** switch `ModuleContainer` to `border-default` | Spec §5 component table: new `border-subtle` `#DAD7CA` is visible on panel (`~7.4 L*` gap) and on elevated (`~11.5 L*`). Switching would over-darken chrome. Contingency: only if post-build visual still flat, escalate via Task 5. |
| D6 | Do **not** edit component SCSS selectors or token references | `ModuleContainer`, `ModuleHeader`, `ModuleFooter` already reference `bg-secondary`/`border-subtle`/`shadow-module`, `bg-elevated`/`border-bottom: border-subtle`, `bg-tertiary` respectively — exactly the spec §8 wiring. |
| D7 | Update in-file header JSDoc in `_variables.scss` to reflect new hex values | The block at lines 7–10 and 25–27 documents specific hexes; leaving stale hexes in the source-of-truth token file would mislead agents and consumers. This is a comment update tied to the value change, not a new comment. |
| D8 | Update `docs/theme-preview.html` `.preview` rule + `themes[0]` object in lockstep | Spec §9.1/§9.2. The inline `--preview` vars and the JS theme object must match `_variables.scss` so the static preview is an accurate reference. |
| D9 | Mark brief.md token-table sync as **deferred to Task 7** | TODO Task 1 explicitly scopes only `_variables.scss`. brief.md §5 (lines 101, 106–109, 119, 146) duplicates the same hex values and is the documented source of truth; it should be synced by the docs-sync step (Task 7) to avoid scope bleed here. Flagged for caller. |
| D10 | Desktop-only, no new components, public APIs untouched | TODO constraints. |

## 3. Detailed Implementation Steps

The implementer must **edit only the files listed below**. Do not touch any other file. Preserve all surrounding code.

### Step 0 — Pre-flight

1. Confirm working branch is `feat/phase9-surface-hierarchy` (created in Critical Workflow step 2). No branch action in this sub-step.
2. Read `src/theme/_variables.scss`, the three component SCSS files, and `docs/theme-preview.html` to confirm current line numbers match this plan before editing (use `vscode-mcp-server_read_file_code`). If any line offset differs, re-locate by content using the `oldString` snippets below.
3. Run `npm run build` once before edits to confirm a clean baseline. If it fails, escalate to caller (do not attempt fixes — out of scope).

### Step 1 — Task 1: Widen surface steps in `src/theme/_variables.scss`

#### Step 1.1 — Header JSDoc surface description (lines 7–10)

**File:** `src/theme/_variables.scss`
**Lines:** 7–10

**Before (current):**
```
 * Theme name: Minimal Yet Warm — warm sand / cream / taupe + controlled coral.
 * Canvas is a light warm gray (EAE7DC); panels step lighter (F3F1E9), elevated
 * surfaces are a near-white cream (FCFBF6), insets use warm sand (D8C3A5) for
 * table headers / input wells / module footers. Four distinguishable surfaces.
```

**After:**
```
 * Theme name: Minimal Yet Warm — warm sand / cream / taupe + controlled coral.
 * Canvas is a warm sand (D8D4C4); panels are a clean cream (EFEDE4), elevated
 * surfaces are a warm near-white (FAF9F4), insets use warm sand (D8C3A5) for
 * table headers / input wells / module footers. Four distinguishable surfaces.
```

#### Step 1.2 — Background token values (lines 53–56)

**File:** `src/theme/_variables.scss`
**Lines:** 53–56

**Before (current):**
```scss
  --cba-bg-primary: #EAE7DC;
  --cba-bg-secondary: #F3F1E9;
  --cba-bg-tertiary: #D8C3A5;
  --cba-bg-elevated: #FCFBF6;
```

**After:**
```scss
  --cba-bg-primary: #D8D4C4;
  --cba-bg-secondary: #EFEDE4;
  --cba-bg-tertiary: #D8C3A5;
  --cba-bg-elevated: #FAF9F4;
```

Only three values change: `--cba-bg-primary`, `--cba-bg-secondary`, `--cba-bg-elevated`. `--cba-bg-tertiary` stays `#D8C3A5`. `--cba-bg-overlay` (line 57) is unchanged.

### Step 2 — Task 2: Strengthen borders & shadows in `src/theme/_variables.scss`

#### Step 2.1 — Border-subtle value (line 66)

**File:** `src/theme/_variables.scss`
**Line:** 66

**Before (current):**
```scss
  --cba-border-subtle: #E7E5DE;
```

**After:**
```scss
  --cba-border-subtle: #DAD7CA;
```

`--cba-border-default` (line 67) and `--cba-border-strong` (line 68) are unchanged. Update the header JSDoc border description that mentions the old subtle hex.

#### Step 2.2 — Header JSDoc borders description (lines 25–27)

**File:** `src/theme/_variables.scss`
**Lines:** 25–27

**Before (current):**
```
 *   Borders      — subtle (#E7E5DE) thin separators, default (#A7A6A2) input
 *                  borders / chrome, strong (#8E8D8A) focus / footer pills / header
 *                  icon-button outlines so they do not disappear on cream/sand.
```

**After:**
```
 *   Borders      — subtle (#DAD7CA) thin separators, default (#A7A6A2) input
 *                  borders / chrome, strong (#8E8D8A) focus / footer pills / header
 *                  icon-button outlines so they do not disappear on cream/sand.
```

#### Step 2.3 — Shadow tokens (lines 93–94)

**File:** `src/theme/_variables.scss`
**Lines:** 93–94

**Before (current):**
```scss
  --cba-shadow-module: 0 4px 16px rgba(43, 34, 28, 0.12);
  --cba-shadow-elevated: 0 8px 24px rgba(43, 34, 28, 0.18);
```

**After:**
```scss
  --cba-shadow-module: 0 4px 20px rgba(43, 34, 28, 0.14);
  --cba-shadow-elevated: 0 8px 28px rgba(43, 34, 28, 0.20);
```

Keep the warm `rgba(43, 34, 28, …)` base. Only blur radius and alpha change. The Shadows section JSDoc (lines 36–37) describes the family generally and stays accurate; no edit needed.

#### Step 2.4 — Commit

```
git add src/theme/_variables.scss
git commit -m "fix(theme): widen Minimal Yet Warm surface steps + borders + shadows (Phase 9 Task 1-2)"
```

(Commit message style matches repo; implementer may use the repo's conventional-commit prefix seen in `git log --oneline -5`.)

### Step 3 — Task 3: Module chrome pass (lib components) — verification only

**Files inspected (no edits expected):**
- `src/components/module-container/module-container.component.scss`
- `src/components/module-header/module-header.component.scss`
- `src/components/module-footer/module-footer.component.scss`

#### Step 3.1 — Verify `ModuleContainer` wiring

Open `src/components/module-container/module-container.component.scss`, lines 35–42. Confirm the non-fullscreen rule still reads:

```scss
:host(:not(.cba-module-container--fullscreen)) {
  background-color: var(--cba-bg-secondary);
  border: 1px solid var(--cba-border-subtle);
  border-radius: var(--cba-radius-md);
  box-shadow: var(--cba-shadow-module);
  overflow: hidden;
}
```

**Expected:** unchanged references to `--cba-bg-secondary`, `--cba-border-subtle`, `--cba-shadow-module`. After Step 1–2 the new token values flow in automatically — module now reads as a card on the darker canvas.

**Action:** NONE. Do not switch to `--cba-border-default` (decision D5).

#### Step 3.2 — Verify `ModuleHeader` wiring

Open `src/components/module-header/module-header.component.scss`, lines 5–15 (`.cba-module-header` rule). Confirm:

```scss
.cba-module-header {
  ...
  background-color: var(--cba-bg-elevated);
  color: var(--cba-text-primary);
  border-bottom: 1px solid var(--cba-border-subtle);
  box-sizing: border-box;
}
```

**Expected:** unchanged references to `--cba-bg-elevated` and `border-bottom: --cba-border-subtle`. New `bg-elevated` `#FAF9F4` is ~4.1 L* lighter than the new panel `#EFEDE4`, and `border-subtle` `#DAD7CA` is now visible on elevated — header band lifts from body.

**Action:** NONE.

#### Step 3.3 — Verify `ModuleFooter` wiring

Open `src/components/module-footer/module-footer.component.scss`, lines 5–14 (`.cba-module-footer` rule). Confirm:

```scss
.cba-module-footer {
  ...
  background-color: var(--cba-bg-tertiary);
  overflow: hidden;
  box-sizing: border-box;
}
```

**Expected:** unchanged reference to `--cba-bg-tertiary`. Inset sand stays ~13.6 L* below the new panel — footer reads as a recessed band.

**Action:** NONE.

#### Step 3.4 — No-commit note

No component file is modified in Task 3. If the implementer finds any divergence from the snippets above (e.g., a different token reference, an extra border, a stray hard-coded hex), **stop and return the question to the caller** — do not self-repair; that would exceed Task 3's scope.

### Step 4 — Task 4: Update `docs/theme-preview.html`

All edits in `docs/theme-preview.html`. Use exact `oldString` matching.

#### Step 4.1 — Page comment (lines 2–8)

**File:** `docs/theme-preview.html`
**Lines:** 2–8 (the leading HTML comment)

**Before (current):**
```html
<!--
  docs/theme-preview.html
  Single-theme preview for @cobranza-apps/ui (Phase 8 — Minimal Yet Warm).
  Other themes were removed; the theme-list UI is kept so future themes can be
  appended to the `themes` array below. Preview CSS custom properties mirror the
  `--cba-*` tokens defined in src/theme/_variables.scss (see brief.md §5).
-->
```

**After:**
```html
<!--
  docs/theme-preview.html
  Single-theme preview for @cobranza-apps/ui (Phase 9 — Minimal Yet Warm surface hierarchy).
  Other themes were removed; the theme-list UI is kept so future themes can be
  appended to the `themes` array below. Preview CSS custom properties mirror the
  `--cba-*` tokens defined in src/theme/_variables.scss (see brief.md §5).
-->
```

#### Step 4.2 — `.preview` inline custom properties (lines 34–40)

**File:** `docs/theme-preview.html`
**Lines:** 34–40 (the `.preview { ... }` rule, first three lines of the block)

**Before (current):**
```css
    .preview{
      --canvas:#EAE7DC;--panel:#F3F1E9;--elevated:#FCFBF6;--inset:#D8C3A5;
      --text:#2B2620;--text-2:#4A4640;--text-3:#625C55;--border:#A7A6A2;--border-2:#8E8D8A;
      --accent:#6B5B4F;--success:#3E6B4F;--warning:#E98074;--danger:#B93E36;--info:#56717E;
      --shadow:0 4px 16px rgba(43,34,28,.12);--hover:rgba(43,38,32,.06);--on-accent:#FDFCF8;
```

**After:**
```css
    .preview{
      --canvas:#D8D4C4;--panel:#EFEDE4;--elevated:#FAF9F4;--inset:#D8C3A5;
      --text:#2B2620;--text-2:#4A4640;--text-3:#625C55;--border:#A7A6A2;--border-2:#8E8D8A;
      --accent:#6B5B4F;--success:#3E6B4F;--warning:#E98074;--danger:#B93E36;--info:#56717E;
      --shadow:0 4px 20px rgba(43,34,28,.14);--hover:rgba(43,38,32,.06);--on-accent:#FDFCF8;
```

Changed: `--canvas`, `--panel`, `--elevated`, `--shadow`. Unchanged: `--inset`, `--text*`, `--border*`, `--accent*`, `--success/warning/danger/info`, `--hover`, `--on-accent`.

#### Step 4.3 — `<h1>` and `.hint` text (lines 90–91)

**File:** `docs/theme-preview.html`
**Lines:** 90–91

**Before (current):**
```html
      <h1>Minimal Yet Warm preview</h1>
      <p class="hint">Palette preview for @cobranza-apps/ui — Minimal Yet Warm (Phase 8). Canvas ≠ panel ≠ elevated ≠ inset, coral reserved for accents.</p>
```

**After:**
```html
      <h1>Minimal Yet Warm — Phase 9 preview</h1>
      <p class="hint">Palette preview for @cobranza-apps/ui — Minimal Yet Warm (Phase 9 surface hierarchy). Canvas ≠ panel ≠ elevated ≠ inset, coral reserved for accents.</p>
```

#### Step 4.4 — Theme script object (lines 159–186)

**File:** `docs/theme-preview.html`
**Lines:** 159–186 (the `themes` array single entry).

Replace the whole block. Use a single `vscode-mcp-server_replace_lines_code` call with `startLine=159`, `endLine=186`.

**Before (current):**
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

**After:**
```js
const themes=[
  {
    id:'mw',
    group:'Extra',
    name:'Minimal Yet Warm',
    note:'Canvas cálido más arena + panel crema más limpio, coral reservado a acentos',
    source:['#D8D4C4','#D8C3A5','#8E8D8A','#E98074','#E85A4F'],
    tokens:{
      '--canvas':'#D8D4C4',
      '--panel':'#EFEDE4',
      '--elevated':'#FAF9F4',
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
      '--shadow':'0 4px 20px rgba(43,34,28,.14)',
      '--hover':'rgba(43,38,32,.06)',
      '--on-accent':'#FDFCF8'
    }
  }
];
```

Changed fields: `note`, `source[0]`, `tokens['--canvas']`, `tokens['--panel']`, `tokens['--elevated']`, `tokens['--shadow']`. No new keys, no removed keys; the `id`, `group`, `name`, and the unstaged render in `applyTheme` (lines 198–217) need no change because the script iterates `theme.tokens` and re-derives `srcHex`/`roleMap`/`accentRow`/`rawStrip` from the object.

#### Step 4.5 — Commit

```
git add docs/theme-preview.html
git commit -m "docs(theme-preview): mirror Phase 9 surface hierarchy tokens"
```

## 4. Token value summary (verbatim from front-end spec)

| Token | Before | After |
|-------|--------|-------|
| `--cba-bg-primary` | `#EAE7DC` | `#D8D4C4` |
| `--cba-bg-secondary` | `#F3F1E9` | `#EFEDE4` |
| `--cba-bg-elevated` | `#FCFBF6` | `#FAF9F4` |
| `--cba-bg-tertiary` | `#D8C3A5` | `#D8C3A5` (unchanged) |
| `--cba-border-subtle` | `#E7E5DE` | `#DAD7CA` |
| `--cba-border-default` | `#A7A6A2` | unchanged |
| `--cba-border-strong` | `#8E8D8A` | unchanged |
| `--cba-shadow-module` | `0 4px 16px rgba(43, 34, 28, 0.12)` | `0 4px 20px rgba(43, 34, 28, 0.14)` |
| `--cba-shadow-elevated` | `0 8px 24px rgba(43, 34, 28, 0.18)` | `0 8px 28px rgba(43, 34, 28, 0.20)` |
| `--cba-hover` / `--cba-active` | `rgba(43,38,32,.06)` / `.10` | unchanged |

Target L* gaps (spec §4): canvas→panel ≈ 8.8 (target ≥8 ✓), panel→elevated ≈ 4.1 (target ≥4 ✓), panel→inset ≈ 13.6 (✓).

## 5. Verification Steps

### 5.1 Build

```
npm run build
```

Expected: `ng-packagr` build to `dist/` succeeds with no errors. The library exports `./theme` (see `package.json` exports) which includes `_variables.scss`; the new values compile cleanly.

### 5.2 Lint

```
npm run lint
```

Expected: ESLint over `src/**/*.ts` passes. (No TS files are touched by this task; lint is run as a regression gate.)

### 5.3 Static preview visual check

Open `docs/theme-preview.html` directly in a desktop browser (e.g. `file://.../docs/theme-preview.html`). Confirm spec §9.3 checks:

1. **Canvas ≠ panel** — the `.workspace` background (canvas `#D8D4C4`) is clearly darker than the `.module` body (panel `#EFEDE4`).
2. **Module header ≠ module body** — `.module-header` (elevated `#FAF9F4`) is visibly lighter than `.module-body` (panel `#EFEDE4`), with a visible `border-bottom`.
3. **Table header inset ≠ row background** — `thead th` (inset sand `#D8C3A5`) is darker than the row background (panel `#EFEDE4`).
4. **Footer pills visible on canvas** — `.section-pill` (panel fill + `--border-2` strong `#8E8D8A`) stands out from `.shell-footer` (canvas `#D8D4C4`).

Also confirm the `roleMap` panel in the left sidebar prints the new hexes:
`canvas #D8D4C4`, `panel #EFEDE4`, `elevated #FAF9F4`, `inset #D8C3A5`. The map is derived at runtime from `theme.tokens`, so a correct object (Step 4.4) yields the correct readout automatically.

### 5.4 Diagnostics

Run `vscode-mcp-server_get_diagnostics_code` over `src/theme/_variables.scss` and `docs/theme-preview.html` to confirm no editor warnings were introduced (e.g., unbalanced braces in the inline CSS/JS after the line replace). Resolve any diagnostic before declaring the step complete; if a diagnostic cannot be resolved within scope, escalate to caller.

## 6. Test Commands

| Command | Purpose | Expected |
|---------|---------|----------|
| `npm run build` | Compile library (`ng-packagr`) | Success, no errors |
| `npm run lint` | Lint TS sources | Success, no errors |
| `npm test` | Jest unit tests (regression) | Pass (no source TS touched; optional but recommended) |

`npm test` is optional for this task because no TypeScript/component logic changes; it is listed in case the caller wants a full regression gate. If run and it fails, escalate — do not modify specs.

## 7. Code Review Steps (hand-off to 4.3)

The code-reviewer sub-agent should verify:

- Only the files listed in §3 were modified (run `git diff --stat` against the feature branch base).
- No `--cba-*` token was renamed or removed; no new token was added.
- `--cba-bg-tertiary`, `--cba-border-default`, `--cba-border-strong`, `--cba-hover`, `--cba-active`, `--cba-bg-overlay`, `--cba-focus-ring`, layout, radius, and spacing tokens are byte-identical to the pre-change file.
- `_variables.scss` header JSDoc hex references (lines 8–9 and 26) match the new token values.
- `docs/theme-preview.html` `.preview` block and `themes[0].tokens` agree with `_variables.scss` token-for-token (the preview's `--canvas/--panel/--elevated/--inset/--border/--border-2/--shadow/--hover/--on-accent` mirror the lib's `--cba-bg-*/--cba-border-*/--cba-shadow-module/--cba-hover/--cba-text-inverse` respectively).
- No component SCSS file was edited (Task 3 verification-only).
- `npm run build` and `npm run lint` pass.

## 8. Documentation Updates

Inside this task's scope: only the in-file JSDoc of `_variables.scss` (Step 1.1, Step 2.2) and the in-file comments/labels of `docs/theme-preview.html` (Step 4.1, Step 4.3).

**Not in this task's scope** (handled by later Critical Workflow steps — flagged for caller):

- `.agent/project-info/brief.md` §5 token table (lines 101, 106–109, 119, 146) duplicates the old hexes and must be synced to keep "source of truth" accuracy. Recommend doing it in the docs-sync step (TODO Task 7).
- `docs/CONSUMER_GUIDE.md` — TODO Task 6.
- `docs/INDEX.md`, `docs/THEME.md`, `README.md`, `CHANGELOG.md` — TODO Task 7.

## 9. Comparison to Original Task Requirements (TODO Tasks 1–4)

| TODO requirement | Plan coverage |
|------------------|---------------|
| Task 1: increase canvas→panel→elevated→inset gap in `_variables.scss` | Step 1.2 changes 3 surface tokens; `--cba-bg-tertiary` kept per spec. Header JSDoc updated in Step 1.1. |
| Task 1: canvas "more sand/taupe so it is the floor"; panel cleaner cream; elevated warm-white with visible separation; inset sand kept | New values `#D8D4C4` (sand canvas), `#EFEDE4` (clean cream), `#FAF9F4` (warm near-white), `#D8C3A5` (kept). L* gaps verified in spec §4. |
| Task 1: target — four surfaces obvious at a glance in preview and Shell | Verification §5.3 check 1–3. |
| Task 2: raise contrast of `--cba-border-subtle` | Step 2.1 (`#E7E5DE` → `#DAD7CA`), Step 2.2 header JSDoc. |
| Task 2: confirm `border-default`/`border-strong` work for inputs, footer pills, icon buttons | Decision D3 — kept unchanged; preview §5.3 check 4 covers footer pills; spec §5 covers inputs/icon buttons. |
| Task 2: slightly increase `shadow-module`/`shadow-elevated` if needed, keep warm-tinted | Step 2.3 — warm base `rgba(43,34,28,..)` preserved; blur + alpha bumped. |
| Task 2: re-check hover/active on cream | Decision D4 — kept; spec §7 confirms overlays read on new surfaces. |
| Task 3: ModuleContainer verify chrome uses panel+border+shadow; consider `border-default` if subtle still weak | Step 3.1 verifies wiring; decision D5 keeps `border-subtle` (new value is visible). Contingency path: if still flat post-build, escalate via Task 5. |
| Task 3: ModuleHeader elevated bg + visible bottom edge | Step 3.2 verifies; new elevated + new subtle border give visible separation. |
| Task 3: ModuleFooter inset or clear separation | Step 3.3 verifies `bg-tertiary` recessed band. |
| Task 3: do not change public APIs | Decision D6 — no selector / token reference / TS input changes. |
| Task 4: update `docs/theme-preview.html` to reflect new values | Step 4.1–4.4 (page comment, `.preview` vars, h1/hint, theme object). |
| Task 4: preview shows canvas≠panel, header≠body, thead inset≠row, footer pills visible | Verification §5.3. |
| Task 4: keep single "Minimal Yet Warm" entry, extensible later | Step 4.4 keeps `themes` array shape and `id:'mw'` single entry. |
| Constraints: no token renames, stay in Minimal Yet Warm, coral accent-only, desktop-only, no new components, no public API changes | Decisions D1, D6, D10; no coral token touched; no new component; consumer-facing token names stable. |

## 10. Completion Signal

When all steps above are done, the implementer must report:

- Files changed: `src/theme/_variables.scss`, `docs/theme-preview.html`.
- Files inspected-but-unchanged: the three module chrome SCSS files.
- Commits created (hashes).
- Results of `npm run build` and `npm run lint`.
- Result of the §5.3 visual check (or note that visual confirmation is deferred to the human checkpoint in TODO Task 5).
- Any deviation from this plan and the reason (none expected).

Plan path returned to caller: `.kilo/plans/20260805-phase9-taskA-implementation.md`.