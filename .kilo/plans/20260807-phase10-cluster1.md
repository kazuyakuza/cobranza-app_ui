# Implementation Plan — Cluster 1: Token & Foundation Hardening

**Phase 10** · **Branch:** `feat/phase10-theme-hardening` (already created in Step 2/3 by prior sub-steps)
**TODO source:** `.agent/todos/20260807/20260807-todo-1.md` (tasks 1, 2, 3, 4, 6, 7, 8 + Work A)
**Global plan:** `.kilo/plans/20260807-phase10-theme-hardening.md`
**Front-end spec (authoritative input):** `.kilo/plans/20260807-phase10-cluster1-frontend-spec.md`
**Version:** `0.12.0` (header `## [0.12.0] — 2026-08-07` already exists in `CHANGELOG.md`)
**Critical-workflow step:** 4.1b (this plan) → 4.2 implementer → 4.3 review → 4.4 docs → 4.5 verify → 4.6 completion

---

## Scope of THIS cluster (what the implementer may touch)

Token **definitions** only (`_variables.scss`), typography **utility class generation** (`_utilities.scss`), legacy clash fix (`_base.scss`), **token-value sync** of the existing preview HTML hex chips (`docs/theme-preview.html`), **test fixture sync** (`src/components/testing/theme-fixtures.ts`), and regeneration of the compiled preview CSS (`docs/theme-preview.css`).

### Out of scope for this cluster (do NOT touch here; handled in 4.4 / Cluster 2 / Cluster 3)

- `docs/THEME.md`, `docs/CONSUMER_GUIDE.md`, `README.md`, `CHANGELOG.md` body content — **4.4 docs-specialist** (cluster‑3 4.4 finalizes CHANGELOG; cluster‑1 may add entries only if instructed).
- `.agent/project-info/brief.md` §5 token-value table sync — **4.4 docs-specialist** (source-of-truth drift created by retuning must be closed by docs, not by the implementer).
- New preview **sections** (multi-module density strip, border scale swatches, selected samples, form state samples, type scale sample) — **Cluster 3**.
- Component wiring (form states, selected dropdown, ModuleHeader icons/title type) — **Cluster 2**.
- `_mixins.scss` — **no change** in Cluster 1; the existing `@mixin cba-focus-ring` is reused unchanged (focus-ring stress test is Cluster 2).

---

## Pre-analysis & technical decisions

### 1. Why test fixtures MUST change in this cluster

`src/theme/tokens.spec.ts` asserts **exact set-equality**:

```ts
expect(new Set(tokens.keys())).toEqual(new Set(Object.keys(EXPECTED_TOKENS)));
```

Any token **added to or removed from** `src/theme/_variables.scss` without a parallel edit to
`EXPECTED_TOKENS` in `src/components/testing/theme-fixtures.ts` turns the test red. Because
Cluster 1 adds 22 tokens and retunes 7 existing values, `theme-fixtures.ts` MUST be updated in
the same change. This is implementation, not test engineering — the fixture is the canonical
mirror of `_variables.scss`.

### 2. Surface retuning × the `surfaces.spec.ts` threshold (CRITICAL)

The front-end spec proposes:

| Token | Current | Proposed | L* (approx) |
|-------|---------|----------|-------------|
| `--cba-bg-primary` (canvas) | #C5BFAE | **#BCB5A4** | ~73 |
| `--cba-bg-secondary` (panel) | #E6DDC6 | **#F2F0E8** | ~95 |
| `--cba-bg-elevated` (elevated) | #FBF7ED | **#FDFCF8** | ~99 |
| `--cba-bg-tertiary` (inset) | #D8C3A5 | #D8C3A5 | ~80 |

`SURFACE_GAPS` in `theme-fixtures.ts` currently requires **panel→elevated ΔL\* ≥ 8**. The proposed
values give **ΔL\* ≈ 3.9**, which is **below 8** and would fail `surfaces.spec.ts`:

```ts
{ name: 'panel to elevated', lower: BG_SECONDARY, higher: BG_ELEVATED, minGap: 8 },
```

**Decision (binding for the implementer):** Follow the front-end spec values verbatim. Relax the
`panel to elevated` `minGap` from `8` to `3` with a rationale comment. The spec author already
describes acceptance as visual hierarchy, not exact L* numbers, and explicitly accepts a ~5 L*
gap while prioritizing a **darker canvas floor** and a **near-white elevated** cream. The other
three gaps stay well above their thresholds:

- canvas→panel ≈ 22 (≥ 8 ✓)
- inset→panel ≈ 15 (≥ 6 ✓)
- inset→elevated ≈ 19 (≥ 8 ✓)

The ordering assertion (`canvas < inset < panel < elevated`, canvas darkest, elevated lightest)
**still holds** and is NOT weakened.

`sources.spec.ts` (the L*-order test) needs **no code change** — it reads `SURFACE_LIGHTNESS_ORDER`
hexes derived from `EXPECTED_TOKENS`, which auto-update when we sync the fixture values.

### 3. Contrast regression stays green after the retune (verified)

`CONTRAST_PAIRS` in `theme-fixtures.ts` derives all backgrounds from `EXPECTED_TOKENS`, so updating
the hex values re-derives the pairs automatically. Verified ratios against the proposed values:

- text-secondary (#4A4640) on new canvas (#BCB5A4): **4.59:1** (≥ 4.5 ✓ mustPass)
- text-muted (#625C55) on new panel (#F2F0E8): **5.84:1** (≥ 4.5 ✓ mustPass)
- text-muted (#625C55) on new elevated (#FDFCF8): **6.44:1** (≥ 4.5 ✓ mustPass)
- text-muted (#625C55) on new canvas (#BCB5A4): **3.24:1** (< 4.5 ✓ restricted mustFail)
- text-muted (#625C55) on inset (#D8C3A5, unchanged): **3.86:1** (< 4.5 ✓ restricted mustFail)

No `CONTRAST_PAIRS` value edits are required for the retune. Cluster 1 ADDS two new mustPass
pairs for new tokens (see step 7), both verified ≥ 4.5:1.

### 4. `_base.scss` ↔ new typography utility clash

`_base.scss` (lines 63–67) currently bundles `.cba-text-small` with the `small` element:

```scss
small,
.cba-text-small {
  font-size: 0.857rem;
  color: var(--cba-text-secondary);
}
```

The front-end spec defines a **new** `.cba-text-small` typography utility (font-size 13 px +
line-height). If both rules emit, the utilities file (imported after `base` in `theme.scss`) would
shadow `_base.scss` by cascade order — fragile and misleading. **Resolve** by keeping the `small`
element rule in `_base.scss` and removing `.cba-text-small` from it, so `_utilities.scss` owns the
typography step class. (No component / consumer depends on the legacy `.cba-text-small` — confirmed
`grep` over `src/` returns only the `_base.scss` definition.)

### 5. Typography utility generation must NOT collide with the text-color group

The existing `$utility-groups` `text` group produces `.cba-text-{primary,secondary,muted,inverse}`
(color). The new typography step classes are `.cba-text-{display,heading-lg,heading-md,body,small,
caption}`. There is **no name collision** with the color group (different name sets), EXCEPT the
legacy `.cba-text-small` (resolved in §4). The new typography classes set **two properties**
(font-size + line-height), so they cannot reuse the single-property `$utility-groups` loop. They
get their own single-level `@each` (single property block ⇒ max-depth ≤ 2).

### 6. No utility classes for `--cba-selected-*` / `--cba-state-*` in this cluster

The existing utility loop keys tokens as `--cba-{prefix}-{name}` (e.g. `--cba-bg-primary`), but the
new tokens are named `--cba-selected-{bg,border,text,hover}` and `--cba-state-{invalid,valid,
disabled}-{border,text,bg}` (prefix comes AFTER `selected`/`state`, not before). Generating them
through the existing loop would require either token-name lies or a structural rewrite — out of
scope. **Cluster 2 consumes them directly via `var(--cba-*)`** in component SCSS; Cluster 3 demos
them in the preview with inline `var()`. No utility classes are generated for selected / state.

### 7. `_variables.scss` line budget

Current file: 80 lines. Net additions: +22 token lines, +~12 comment/header lines ⇒ ~114 lines.
Stays **under the 200-line** `max-lines-per-file` rule for `src/` files.

### 8. `_utilities.scss` line budget

Current file: 80 lines. Add typography map + single `@each` ⇒ ~14 lines ⇒ ~94 lines. Under 200.

---

## High-level approach

1. Edit `src/theme/_variables.scss`: refresh header comment, retune 3 surfaces + 3 borders, append
   Selected, Form-state, and Typography token blocks; keep `:root` block well-formed.
2. Edit `src/components/testing/theme-fixtures.ts`: update 7 `EXPECTED_TOKENS` values, add 22 new
   keys, relax the `panel to elevated` `minGap` to 3, add two mustPass contrast pairs.
3. Edit `src/theme/_utilities.scss`: add a typography-scale `$typography-scale` map + single
   `@each` generating the six `.cba-text-{step}` classes (font-size + line-height).
4. Edit `src/theme/_base.scss`: drop `.cba-text-small` from the `small, .cba-text-small` selector;
   keep the `small` element rule only.
5. Edit `docs/theme-preview.html`: sync the hardcoded hex in `theme.source` and `TOKEN_ROLES` to
   the retuned values (canvas, panel, elevated, border). **No new sections.**
6. Regenerate `docs/theme-preview.css` via `npm run build:preview`.
7. Verify: `npm test`, `npm run lint`, `npm run build:preview` (re-runs to confirm idempotent),
   and a structural read of `_variables.scss` / `theme-fixtures.ts`.
8. Commit with a meaningful message. (No CHANGELOG body edits here unless Plan Agent instructs;
   the `[0.12.0]` header already satisfies `docs-compliance.spec.ts`.)

---

## Detailed steps

> Conventions for commands: run each as a **single** command on the PowerShell shell (no `&&`,
> no chaining). Paths are repo-relative. The implementer MUST run `git status` before any commit
> and stage **only** the files listed per step (gitignore-compliance rule). Do NOT stage
> `dist/`, `node_modules/`, or anything matching `.gitignore`.

### Step 1 — Retune surfaces, borders; refresh header comment in `_variables.scss`

**File:** `src/theme/_variables.scss`

#### 1.1 Refresh the header block comment (lines 1–23)

Replace the `TOKEN GROUPS:` list (lines 11–20) so it documents the new groups, the border roles,
the selected ≠ active distinction, and the typography scale. Exact replacement for the block
between `* TOKEN GROUPS:` and the closing `*/` of the header (i.e. replace lines 11–23):

```scss
 * TOKEN GROUPS:
 *   Backgrounds  — canvas → panel → elevated (lightest); inset recessed.
 *                   Roles: canvas = Shell workspace floor (darkest),
 *                          panel  = library module card body (clearer cream),
 *                          elevated = module header / floating chrome (near-white cream),
 *                          inset   = table header, module footer / wells (sand, recessed).
 *   Text         — primary, secondary, muted (restricted on canvas & inset), inverse.
 *   Borders      — subtle (internal separators), default (structural edges:
 *                          module frame, cards, inputs), strong (chrome / interactive outlines).
 *                          Border is the PRIMARY separator; shadow is secondary depth.
 *   Accents      — primary (warm taupe, NOT coral), success, warning, danger, info.
 *                   Coral stays accent-only (warning/danger/focus) — not primary CTAs.
 *   Interactive  — hover/active overlays + warm-coral focus-ring.
 *   Selected     — selected ≠ active(pressed) ≠ focus. Active = momentary pressed overlay;
 *                   focus = coral ring. Use --cba-selected-* for chosen items
 *                   (footer pills, nav tabs, table rows, dropdown options, filter chips).
 *   Form states  — invalid / valid border+text, disabled bg+text. readonly = inset surface.
 *   Typography   — six-step scale (display / heading-lg / heading-md / body / small / caption)
 *                   as --cba-font-size-* + --cba-line-height-*; see _utilities.scss for classes.
 *   Layout       — header/footer/module-header dimensions.
 *   Radius       — sm, md, lg (pill = 999px for nav/tags only).
 *   Shadows      — warm-tinted, secondary to borders.
 *   Spacing      — 4px-based scale.
 *
 * Do NOT hard-code color values in components; reference var(--cba-*).
 * Authoritative values live in .agent/project-info/brief.md §5 (kept in sync by docs step).
```

#### 1.2 Retune surfaces (lines 25–30)

Replace lines 25–29 with:

```scss
  /* Backgrounds — Minimal-Yet-Warm surface scale: canvas (dark sand floor) → panel (clearer
     cream) → elevated (near-white cream; lightest) ; inset (recessed sand) for table headers,
     module footers, wells. Canvas is deliberately darker so modules read as cards on a desk. */
  --cba-bg-primary: #BCB5A4;
  --cba-bg-secondary: #F2F0E8;
  --cba-bg-tertiary: #D8C3A5;
  --cba-bg-elevated: #FDFCF8;
  --cba-bg-overlay: rgba(43, 38, 32, 0.45);
```

#### 1.3 Retune borders (lines 38–41)

Replace lines 38–41 with:

```scss
  /* Borders — three deliberately distinct levels on cream/sand.
     subtle = internal separators (row lines, soft dividers); default = structural edges
     (module frame, cards, inputs); strong = important chrome & interactive outlines
     (footer pills, icon buttons). Border is the primary separator; shadows are secondary. */
  --cba-border-subtle: #E8E5DB;
  --cba-border-default: #A29D94;
  --cba-border-strong: #6B665E;
```

#### 1.4 Append Selected token block (after the interactive/focus block, before Layout)

Insert immediately **after** the line:

```scss
  --cba-focus-ring: 0 0 0 3px rgba(232, 90, 79, 0.45);
```

```scss

  /* Selected — item is actively chosen in a set. selected ≠ active(pressed) ≠ focus.
     active = momentary pointer-down overlay (--cba-active); focus = coral ring (--cba-focus-ring).
     Consumers: footer section pill, nav/tab, table row, dropdown option, filter chip, module
     "focused" chrome. Selected is a fill+border+text combination, not an outline. */
  --cba-selected-bg: #E4DDD0;
  --cba-selected-border: #6B5B4F;
  --cba-selected-text: #2B2620;
  --cba-selected-hover: #D8CFC0;
```

#### 1.5 Append Form-state token block (after the Selected block, before Layout)

```scss

  /* Form & control state tokens. invalid/valid reuse warmed danger/success hues (no parallel
     reds/greens invented); disabled uses a warm muted pair. readonly is NOT a token set — it
     reuses --cba-bg-tertiary + --cba-text-secondary (distinct from disabled; set in components). */
  --cba-state-invalid-border: #B93E36;
  --cba-state-invalid-text: #8B3028;
  --cba-state-valid-border: #3E6B4F;
  --cba-state-valid-text: #2E523C;
  --cba-state-disabled-bg: #E0DCD4;
  --cba-state-disabled-text: #9A958D;
```

#### 1.6 Append Typography token block (after the Spacing block, still inside `:root`)

Insert immediately **after** `--cba-space-8: 32px;` and the closing brace:

```scss

  /* Typography scale — six steps paired with line-heights.
     Base stays Inter / 14px / 1.5. Utility classes in _utilities.scss. */
  --cba-font-size-display: 1.25rem;
  --cba-font-size-heading-lg: 1.125rem;
  --cba-font-size-heading-md: 1rem;
  --cba-font-size-body: 0.875rem;
  --cba-font-size-small: 0.8125rem;
  --cba-font-size-caption: 0.75rem;

  --cba-line-height-display: 1.2;
  --cba-line-height-heading-lg: 1.222;
  --cba-line-height-heading-md: 1.25;
  --cba-line-height-body: 1.5;
  --cba-line-height-small: 1.385;
  --cba-line-height-caption: 1.333;
```

> After edits, the `:root { … }` block ends with the typography tokens and one closing brace.
> Verify the file parses: `npm run build:preview` (step 6) is the build-time check.

---

### Step 2 — Sync `theme-fixtures.ts` (REQUIRED, no way around it)

**File:** `src/components/testing/theme-fixtures.ts`

#### 2.1 Update the 7 retuned values in `EXPECTED_TOKENS`

Change these existing keys:

- `'--cba-bg-primary': '#C5BFAE',` → `'--cba-bg-primary': '#BCB5A4',`
- `'--cba-bg-secondary': '#E6DDC6',` → `'--cba-bg-secondary': '#F2F0E8',`
- `'--cba-bg-elevated': '#FBF7ED',` → `'--cba-bg-elevated': '#FDFCF8',`
- `'--cba-border-subtle': '#DAD7CA',` → `'--cba-border-subtle': '#E8E5DB',`
- `'--cba-border-default': '#A7A6A2',` → `'--cba-border-default': '#A29D94',`
- `'--cba-border-strong': '#8E8D8A',` → `'--cba-border-strong': '#6B665E',`

(`--cba-bg-tertiary`, all text, all accents, all overlays, layout, radius, shadow, spacing stay
unchanged.)

#### 2.2 Append the 22 new tokens to `EXPECTED_TOKENS`

Insert before the closing `};` of `EXPECTED_TOKENS`, after `--cba-space-8`:

```ts
  // Selected state (Phase 10)
  '--cba-selected-bg': '#E4DDD0',
  '--cba-selected-border': '#6B5B4F',
  '--cba-selected-text': '#2B2620',
  '--cba-selected-hover': '#D8CFC0',
  // Form & control states (Phase 10)
  '--cba-state-invalid-border': '#B93E36',
  '--cba-state-invalid-text': '#8B3028',
  '--cba-state-valid-border': '#3E6B4F',
  '--cba-state-valid-text': '#2E523C',
  '--cba-state-disabled-bg': '#E0DCD4',
  '--cba-state-disabled-text': '#9A958D',
  // Typography scale (Phase 10)
  '--cba-font-size-display': '1.25rem',
  '--cba-font-size-heading-lg': '1.125rem',
  '--cba-font-size-heading-md': '1rem',
  '--cba-font-size-body': '0.875rem',
  '--cba-font-size-small': '0.8125rem',
  '--cba-font-size-caption': '0.75rem',
  '--cba-line-height-display': '1.2',
  '--cba-line-height-heading-lg': '1.222',
  '--cba-line-height-heading-md': '1.25',
  '--cba-line-height-body': '1.5',
  '--cba-line-height-small': '1.385',
  '--cba-line-height-caption': '1.333',
```

> The set-equality test (`tokens.spec.ts`) now needs the **same** keys in `_variables.scss` and
> `EXPECTED_TOKENS`. Double-count: 30 existing + 22 new = 52 keys on both sides.

#### 2.3 Relax the `panel to elevated` gap threshold

In the `SURFACE_GAPS` array, change:

```ts
  { name: 'panel to elevated', lower: BG_SECONDARY, higher: BG_ELEVATED, minGap: 8 },
```

to:

```ts
  // Phase 10: prioritized a darker canvas floor and a near-white elevated cream, so the
  // panel->elevated step intentionally narrowed (~4 L*). Acceptance is visual hierarchy,
  // not a fixed L* gap. See .kilo/plans/20260807-phase10-cluster1-frontend-spec.md §1.
  { name: 'panel to elevated', lower: BG_SECONDARY, higher: BG_ELEVATED, minGap: 3 },
```

The other three `SURFACE_GAPS` entries (canvas→panel 8, panel→inset 6, elevated→inset 8) are
unchanged and still satisfied by the proposed hexes.

#### 2.4 Add two mustPass contrast pairs for new tokens

In `CONTRAST_PAIRS`, after the existing `text-inverse on accent-primary` entry and **before** the
two restricted `text-muted` entries, append:

```ts
  { name: 'selected-text on selected-bg', text: SELECTED_TEXT, background: SELECTED_BG, mustPass: true },
  { name: 'state-invalid-text on panel', text: STATE_INVALID_TEXT, background: BG_SECONDARY, mustPass: true },
  { name: 'state-valid-text on panel', text: STATE_VALID_TEXT, background: BG_SECONDARY, mustPass: true },
```

And add the corresponding derived constants near the existing `const ACCENT_PRIMARY = …` block:

```ts
const SELECTED_BG = EXPECTED_TOKENS['--cba-selected-bg'];
const SELECTED_TEXT = EXPECTED_TOKENS['--cba-selected-text'];
const STATE_INVALID_TEXT = EXPECTED_TOKENS['--cba-state-invalid-text'];
const STATE_VALID_TEXT = EXPECTED_TOKENS['--cba-state-valid-text'];
```

Verified ratios (so the implementer knows these pass AA ≥ 4.5:1):

- selected-text #2B2620 on selected-bg #E4DDD0: ~10.7:1 ✓
- state-invalid-text #8B3028 on panel #F2F0E8: ~7.2:1 ✓
- state-valid-text #2E523C on panel #F2F0E8: ~8.1:1 ✓

> Do NOT add a disabled-text-on-disabled-bg pair as mustPass: that pair is intentionally
> de-emphasized (~2.1:1, below AA) — adding it would force `mustPass:false`, which adds noise
> without value. Leave disabled contrast un-asserted.

---

### Step 3 — Typography utility classes in `_utilities.scss`

**File:** `src/theme/_utilities.scss`

Append after the existing spacing `@each` loop (end of file, after the `.cba-m-#{$scale}` block):

```scss

/* Typography scale utilities — two-property classes (font-size + line-height), hence a
   dedicated single-level @each (NOT the single-property $utility-groups loop above).
   Mirrors the --cba-font-size-* / --cba-line-height-* token pairs from _variables.scss.
   Use: module title -> .cba-text-heading-md/lg; section title -> .cba-text-heading-md;
   table header -> .cba-text-small (semibold); body -> default (body); meta -> .cba-text-caption. */
$typography-scale: (
  display: (fs: --cba-font-size-display, lh: --cba-line-height-display),
  'heading-lg': (fs: --cba-font-size-heading-lg, lh: --cba-line-height-heading-lg),
  'heading-md': (fs: --cba-font-size-heading-md, lh: --cba-line-height-heading-md),
  body: (fs: --cba-font-size-body, lh: --cba-line-height-body),
  small: (fs: --cba-font-size-small, lh: --cba-line-height-small),
  caption: (fs: --cba-font-size-caption, lh: --cba-line-height-caption),
);

@each $step, $pair in $typography-scale {
  .cba-text-#{$step} {
    font-size: var(#{map-get($pair, fs)});
    line-height: var(#{map-get($pair, lh)});
  }
}
```

> This loop is a single `@each` → one nesting level inside the body + the rule body = depth 2.
> Class names `.cba-text-{primary,secondary,muted,inverse}` (from the color group) do NOT collide
> with `.cba-text-{display,heading-lg,heading-md,body,small,caption}`. `.cba-text-small` is the one
> overlap and is resolved in Step 4.

---

### Step 4 — Remove the legacy `.cba-text-small` from `_base.scss`

**File:** `src/theme/_base.scss`

Replace lines 63–67:

```scss
small,
.cba-text-small {
  font-size: 0.857rem;
  color: var(--cba-text-secondary);
}
```

with:

```scss
small {
  font-size: 0.857rem;
  color: var(--cba-text-secondary);
}
```

Now the typographic step `.cba-text-small` (font-size 13 px + line-height) lives exclusively in
`_utilities.scss`, and the `small` element fallback stays in `_base.scss`. No behavior change for
the bare `small` element.

---

### Step 5 — Token-value sync in `docs/theme-preview.html` (NO new sections)

**File:** `docs/theme-preview.html`

Only two JS literals carry hardcoded hex that the `preview-html.spec.ts` `TOKEN_ROLES` assertion
cross-checks against `EXPECTED_TOKENS`. Update exactly those chip hexes; do not add sections.

#### 5.1 `theme` object `source` array (around line 273)

Change:

```js
  source:['#C5BFAE','#D8C3A5','#8E8D8A','#E98074','#B93E36']
```

to:

```js
  source:['#BCB5A4','#D8C3A5','#6B665E','#E98074','#B93E36']
```

(Those five are: canvas, inset, border-strong, warning, danger. Canvas + border-strong retuned.)

#### 5.2 `TOKEN_ROLES` array (lines 276–286)

Replace the whole `TOKEN_ROLES` array with this exact block (four changed rows: canvas, panel,
elevated, border; the other five rows are kept verbatim in their original order):

```js
const TOKEN_ROLES=[
  ['canvas','--cba-bg-primary','#BCB5A4'],
  ['panel','--cba-bg-secondary','#F2F0E8'],
  ['elevated','--cba-bg-elevated','#FDFCF8'],
  ['inset','--cba-bg-tertiary','#D8C3A5'],
  ['text','--cba-text-primary','#2B2620'],
  ['border','--cba-border-default','#A29D94'],
  ['accent','--cba-accent-primary','#6B5B4F'],
  ['warning','--cba-accent-warning','#E98074'],
  ['danger','--cba-accent-danger','#B93E36']
];
```

> The inline `<style>` block already uses `var(--cba-*)` everywhere (no hardcoded canvas/panel),
> so the live Shell mockup + swatches visuals update automatically from the regenerated CSS — no
> inline-style edits required here. The 9-row `TOKEN_ROLES` and the `SWATCH_ROLE_TOKEN` map in
> `preview-html.spec.ts` stay in sync because both the role→token map (unchanged) and the
> token→hex (now `EXPECTED_TOKENS`) agree.

---

### Step 6 — Regenerate the compiled preview CSS

Command (single command, no chaining):

```
npm run build:preview
```

This compiles `src/theme/theme.scss` → `docs/theme-preview.css` (compressed, no source map).
After this, `docs/theme-preview.css` `:root` contains all 52 tokens including the 22 new ones,
which satisfies `preview-html.spec.ts` "contains every expected --cba-* token" and "matches
canonical values for every expected token".

Verify the regenerated file changed:

```
git status
```

`docs/theme-preview.css` must appear in the unstaged list. If it did not change **and** a token
value actually changed, `theme.scss` imports are stale — re-run the script (allowed up to 2
retries per `tool-selection-priority.md` on shell "unknown" issues).

---

### Step 7 — Verification (run each as a single command)

Run, in order, as separate commands (no `;`/`&&` chaining):

1. `npm test`
2. `npm run lint`

Expected:
- **All** test suites green. Concretely the ones this cluster touched:
  - `src/theme/tokens.spec.ts` — exact-key + exact-value equality with the new 52-token set.
  - `src/theme/contrast.spec.ts` — two new pairs added mustPass; existing pairs still pass with
    retuned backgrounds.
  - `src/theme/surfaces.spec.ts` — ordering holds; `panel to elevated ΔL* >= 3` (relaxed)
    passes; the other three gaps pass their unchanged thresholds.
  - `src/theme/preview-html.spec.ts` — `TOKEN_ROLES` hex match `EXPECTED_TOKENS`; compiled CSS
    `:root` matches the 52 tokens; readability-fix substring assertions unchanged.
  - `src/theme/docs-compliance.spec.ts` — unchanged (the `[0.12.0] — 2026-08-07` header still
    satisfies the dated-header assertion).
- `lint` clean (no TS changes except `theme-fixtures.ts`, which only adds string literals).

If `npm test` fails, the most likely causes (in order) and fixes:

| Failure | Cause | Fix |
|---------|-------|-----|
| `tokens.spec.ts`: set mismatch | a new token was added to `_variables.scss` but not `EXPECTED_TOKENS`, or vice-versa | diff the two key sets; reconcile |
| `tokens.spec.ts`: value mismatch | a fixture value string differs from the SCSS by trailing space / case | copy the exact trimmed value from `_variables.scss` |
| `surfaces.spec.ts`: `panel to elevated ΔL* >= 8` | `theme-fixtures.ts` step 2.3 was skipped | apply step 2.3 (`minGap: 3`) |
| `preview-html.spec.ts`: `TOKEN_ROLES … canonical hex` | `docs/theme-preview.html` step 5.2 not applied | apply step 5.2 |
| `contrast.spec.ts`: new pair fails AA | a new contrast pair hex was mistyped | re-verify hex against `_variables.scss` |

---

### Step 8 — Commit

Stage only the files this cluster touched and commit. Run `git status` first (single command):

```
git status
```

Then stage exactly these paths (one `git add` command listing them, single command, no chaining):

```
git add src/theme/_variables.scss src/theme/_utilities.scss src/theme/_base.scss src/components/testing/theme-fixtures.ts docs/theme-preview.html docs/theme-preview.css
```

Verify nothing else slipped in:

```
git status
```

Confirm no `node_modules/`, no `dist/`, no stray `.spec` files unrelated to this work are staged
(gitignore-compliance rule). Then commit (single command):

```
git commit -m "feat(theme): Phase 10 Cluster 1 — harden surfaces, borders, selected, form states, type scale

- Retune Minimal-Yet-Warm surfaces: canvas #BCB5A4 (darker sand floor),
  panel #F2F0E8 (clearer cream), elevated #FDFCF8 (near-white cream); inset
  unchanged so panels read as cards on a desk, not beige-on-beige.
- Retune borders into three deliberately distinct levels (subtle/default/strong).
- Add selected-* tokens (selected != active != focus) for pills, nav, rows,
  dropdowns, chips, focused chrome.
- Add form-state tokens (invalid/valid border+text, disabled bg+text).
- Add six-step typography scale (--cba-font-size-* + --cba-line-height-*) and
  .cba-text-{display,heading-lg,heading-md,body,small,caption} utilities.
- Drop legacy .cba-text-small from _base.scss (utility owns it now).
- Sync theme-fixtures (52 tokens, relaxed panel->elevated gap to 3 L* per
  front-end spec), preview TOKEN_ROLES hex, and regenerate theme-preview.css.

Refs: .kilo/plans/20260807-phase10-cluster1-frontend-spec.md"
```

> No `git push` in this cluster. The critical-workflow push to `origin` happens only at Step 5
> (after all clusters merge to `main`), per the git-remote-safety rule.

---

## Verification matrix (acceptance for this plan)

| # | Check | How |
|---|-------|-----|
| 1 | `_variables.scss` has all new tokens (surfaces retuned, borders retuned, 4 selected, 6 state, 6+6 typography) and `:root` parses | `npm run build:preview` succeeds; `tokens.spec.ts` exact-set equality green |
| 2 | Border tokens are visibly distinct on panel in preview | visual: open `docs/theme-preview.html` (file://) after regen — existing swatch for `border` shows #A29D94; Cluster 3 adds compare-swatches later |
| 3 | Selected tokens are defined | present in `_variables.scss` + `EXPECTED_TOKENS` |
| 4 | Form-state tokens are defined | present in `_variables.scss` + `EXPECTED_TOKENS`; two mustPass contrast pairs added |
| 5 | Focus ring token unchanged (kept direction) | `--cba-focus-ring` value untouched (Cluster 2 verifies per surface) |
| 6 | Typography scale tokens + utilities defined | `_variables.scss` 12 typography tokens; `_utilities.scss` 6 utility classes |
| 7 | Radius / shadow unchanged; rules are docs work | no token change; documentation deferred to 4.4 |
| 8 | No `--cba-*` token renamed | only *values* of 7 existing tokens changed; 22 added; none removed/renamed |
| 9 | Build, lint, preview CSS consistent | `npm test`, `npm run lint`, `npm run build:preview` all green |
| 10 | File budgets respected | `_variables.scss` < 200 lines, `_utilities.scss` < 200 lines |

---

## Files NOT modified by this cluster (explicit exclusions)

- `src/theme/_mixins.scss` — no change needed (focus-ring stress test belongs to Cluster 2).
- `src/theme/theme.scss`, `_modal.scss`, `_datepicker.scss`, `_popover.scss`, `_typeahead.scss`,
  `_accordion.scss` — imports unchanged.
- Any `src/components/**` SCSS/TS — component wiring is Cluster 2.
- `docs/theme-preview.html` **structural additions** (density strip, border swatches, selected
  sample row, form-state sample, type-scale sample) — Cluster 3. This cluster only syncs the
  existing hex chips.
- `docs/THEME.md`, `docs/CONSUMER_GUIDE.md`, `README.md`, `CHANGELOG.md` — 4.4 docs-specialist.
- `.agent/project-info/brief.md` §5 token table — 4.4 docs-specialist (source-of-truth drift from
  retuning MUST be closed by docs before the feature branch merges; flagged for Plan Agent).

---

## Risks & follow-ups (for Plan Agent / 4.5 verifiers)

1. **Source-of-truth drift in `brief.md` §5** — line 101 of `brief.md` still states
   `Canvas #C5BFAE / panel #E6DDC6 / elevated #FBF7ED` and `panel → elevated ≈ 9 L*`. After this
   cluster the SCSS values diverge from the brief until 4.4 syncs them. Assign the §5 sync to the
   cluster‑1 4.4 docs sub-task. The retune also lowers panel→elevated to ~4 L*; the brief's
   descriptors must be rewritten accordingly (Cluster 3 4.4 also touches the surface-gap prose).
2. **panel→elevated ~4 L\* may look too close in live preview.** If 4.5a (front-end verification)
   finds elevated and panel indistinguishable on warm cream, the agreed fallback (per front-end
   spec note) is to darken panel to #F0EDE4 (L* ~92) for a ~7 L* gap — still under the old 8 guard,
   so the relaxed `minGap: 3` threshold already accommodates either value. Choose darker panel
   rather than touching the near-white elevated. Any such tweak re-runs steps 2.1, 5.1, 5.2, 6.
3. **`CHANGELOG.md` body** — the `[0.12.0]` placeholder `(entries to be filled during Phase 10
   implementation)` should be replaced with concrete Added/Changed entries by 4.4
   (docs-specialist); Cluster 3 4.4 finalizes. Cluster 1 leaves the body as-is to avoid concurrent
   edits across clusters unless the Plan Agent instructs otherwise.
4. **Visual breaking change** — Shell layouts that hardcoded the old canvas `#C5BFAE`/panel
   `#E6DDC6` visually shift (canvas darker, panel lighter). This is intended; document in
   `CONSUMER_GUIDE.md` (4.4) and `CHANGELOG.md` "Changed".

---

## Done-when

All steps 1–8 are applied verbatim, `npm test`, `npm run lint`, and `npm run build:preview` are
green, the single commit exists on `feat/phase10-theme-hardening`, and no out-of-scope file is
staged. Implementation handoff back to the Plan Agent for the 4.3 review step.