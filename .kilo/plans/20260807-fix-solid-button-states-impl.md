# Implementation Plan — Fix Solid Button Hover/Active State Visibility

**Date:** 2026-08-07
**Branch:** `feat/fix-solid-button-states` (created in Step 2 — DONE)
**Version:** `0.11.1 → 0.11.2` (bumped in Step 3 — DONE, `package.json` already at `0.11.2`)
**Task (4.1b):** Detailed implementation plan for the single TODO task "Fix solid button hover/active state visibility".
**Source documents:**
- Global plan: [`.kilo/plans/20260807-fix-solid-button-states.md`](20260807-fix-solid-button-states.md)
- Front-end spec: [`.kilo/plans/20260807-fix-solid-button-states-frontend-spec.md`](20260807-fix-solid-button-states-frontend-spec.md)
- TODO: `.agent/todos/20260807/20260807-todo-0.md`
- Source of truth for tokens: `src/theme/_variables.scss` ↔ `.agent/project-info/brief.md` §5

---

## 1. High-Level Approach

The hover/active invisibility on `primary`/`danger`/`success` solid buttons is caused by applying dark overlays (`--cba-hover`, `--cba-active`) to already-dark accent backgrounds. The fix adds two **inverse (light) overlay tokens** and reroutes only the **solid** button variants to them, leaving `secondary` and `ghost` (which sit on light surfaces) untouched.

Implementation sequence (one logical change set, applied in 4.2):

1. **Tokens** — add `--cba-hover-inverse`/`--cba-active-inverse` to `src/theme/_variables.scss` under the existing "Interactive states" group (after `--cba-active`, before `--cba-focus-ring`).
2. **Tests fixtures (source of truth for token tests)** — add the same two keys to `EXPECTED_TOKENS` in `src/components/testing/theme-fixtures.ts`. The `tokens.spec.ts` "exactly the expected tokens" equality check will fail until tokens are mirrored, so the fixture is updated in lockstep with `_variables.scss`.
3. **Component SCSS** — split the solid variant state selectors in `src/components/button/cba-button.component.scss` so `primary`/`danger`/`success` reference the inverse tokens, while `secondary` keeps the dark overlays and `ghost` keeps `background-color`.
4. **Preview HTML** — mirror the same selector split in the inline `<style>` of `docs/theme-preview.html` (the `.pv-btn--*` rules), updating the comment block lines 114 and 223–227 references so the preview stays in sync with the component.
5. **Regenerate compiled CSS** — run `npm run build:preview` to recompile `src/theme/theme.scss` → `docs/theme-preview.css`. This is required because the preview CSS `:root` test asserts every expected token is present in the compiled file, and the two new tokens are added to `:root`.
6. **Docs** — update the "State overlays" table in `docs/CONSUMER_GUIDE.md` to document the variant split (solid → inverse tokens, secondary/ghost → dark overlays), and add the new tokens to the canonical table in `.agent/project-info/brief.md` §5.
7. **Tests** — add focused assertions for the inverse tokens and the component SCSS selector split in `src/theme/preview-html.spec.ts` and `src/theme/tokens.spec.ts`.
8. **Changelog** — add a `## [0.11.2] — 2026-08-07` dated header per [`.kilo/rules/changelog-versioning.md`](../rules/changelog-versioning.md) (no `[Unreleased]` section).

After implementation: run `npm run lint`, `npm test`, `npm run build`, `npm run build:preview` (verification gates that the implementer must execute before 4.3 Code Review). No new unit-test framework additions are required — the existing Jest config covers the spec files. The implementer commits each logical group with a meaningful message.

### Constraints respected

- **No new dependencies** — only SCSS tokens and CSS variables.
- **No TypeScript contract change** — `CbaButton` inputs/outputs unchanged.
- **No per-variant hard-coded hex shifts** — both inverse tokens reuse the existing `--cba-text-inverse` hue (`#FDFCF8`), preserving token-based design.
- **No regression for secondary/ghost** — their selectors and token references are untouched.
- **Max-depth / max-lines / max-args / single-section-boolean rules** — all current files stay within limits; the changes are one-for-one token-title swaps, not new logic.
- **PowerShell not used** — all commands are single npm scripts invoked via `bash`.

---

## 2. Pre-Implementation Notes (Git)

- Branch `feat/fix-solid-button-states` already checked out (Step 2 completed).
- `package.json` already at `"version": "0.11.2"` (Step 3 completed); no further version action needed in 4.1b/4.2.
- Before the first edit, the implementer should run `git status` to confirm a clean working tree (only the existing `0.11.2` bump commit on top of `main`). If `package.json` or `CHANGELOG.md` are already modified-but-uncommitted, the implementer MUST stop and return a question to the Plan Agent (this is the version-bump commit produced in Step 3 and should already be committed).
- All subsequent commits land on `feat/fix-solid-button-states`. No `git push` is performed until Step 5 of the Critical Workflow.

---

## 3. Detailed Steps

### Step 3.1 — Add inverse overlay tokens to `src/theme/_variables.scss`

**File:** `src/theme/_variables.scss`
**Edit:** insert two new tokens immediately after `--cba-active` (line 52) and before `--cba-focus-ring` (line 53), keeping the "Interactive states" group together.

**Current (lines 50–53):**
```scss
  /* Interactive states — warm taupe overlays + warm coral focus ring */
  --cba-hover: rgba(43, 38, 32, 0.10);
  --cba-active: rgba(43, 38, 32, 0.18);
  --cba-focus-ring: 0 0 0 3px rgba(232, 90, 79, 0.45);
```

**New:**
```scss
  /* Interactive states — warm taupe overlays + warm coral focus ring */
  --cba-hover: rgba(43, 38, 32, 0.10);
  --cba-active: rgba(43, 38, 32, 0.18);
  --cba-hover-inverse: rgba(253, 252, 248, 0.12);
  --cba-active-inverse: rgba(253, 252, 248, 0.22);
  --cba-focus-ring: 0 0 0 3px rgba(232, 90, 79, 0.45);
```

**Rationale (mirrors front-end spec §4.1):**
- Hue matches `--cba-text-inverse` (`#FDFCF8` = `rgba(253, 252, 248, 1)`) for system consistency.
- 12% hover / 22% active opacity lightens solid accent backgrounds (`#6B5B4F`, `#B93E36`, `#3E6B4F`) enough to be perceptually distinct, while staying below a "washout" threshold.
- The two tokens are grouped directly after the existing dark overlays so the inverse relationship is visually obvious.

**Verification gate:** after this edit, `npm test -- src/theme/tokens.spec.ts` MUST still fail (because `EXPECTED_TOKENS` does not yet list the new tokens and the equality check `new Set(tokens.keys())` vs `EXPECTED_TOKENS` will mismatch). This is expected — Step 3.2 fixes the fixture. Re-ordering these two edits is not allowed: the fixture MUST be updated in the same commit as the token change to keep CI green on the single commit.

---

### Step 3.2 — Mirror the new tokens in `src/components/testing/theme-fixtures.ts`

**File:** `src/components/testing/theme-fixtures.ts`
**Edit:** add the two new keys to `EXPECTED_TOKENS` directly after `--cba-active` (line 20) and before `--cba-focus-ring` (line 21), preserving key ordering identical to `_variables.scss` so diff review is trivial.

**Current (lines 19–21):**
```ts
  '--cba-hover': 'rgba(43, 38, 32, 0.10)',
  '--cba-active': 'rgba(43, 38, 32, 0.18)',
  '--cba-focus-ring': '0 0 0 3px rgba(232, 90, 79, 0.45)',
```

**New:**
```ts
  '--cba-hover': 'rgba(43, 38, 32, 0.10)',
  '--cba-active': 'rgba(43, 38, 32, 0.18)',
  '--cba-hover-inverse': 'rgba(253, 252, 248, 0.12)',
  '--cba-active-inverse': 'rgba(253, 252, 248, 0.22)',
  '--cba-focus-ring': '0 0 0 3px rgba(232, 90, 79, 0.45)',
```

**Notes:**
- `EXPECTED_TOKENS` is reused by `tokens.spec.ts` (exact key-set equality) and `preview-html.spec.ts` (every expected key present in compiled CSS). Mirroring the new tokens there is what makes both suites pass after `npm run build:preview` regenerates `docs/theme-preview.css` (Step 3.5).
- The `scss-tokens.ts` parser regex `(--cba-[a-z0-9-]+)\s*:\s*([^;}]+)[;}]\s*` already accepts multi-component `rgba(...)` values, so no parser change is required.
- `CONTRAST_PAIRS` and `SURFACE_GAPS` do not need new entries — the inverse tokens are overlays, not text/surface pairs, and never affect WCAG ratios directly (they are applied via `background-image` gradients layered over the base accent fill; text remains `--cba-text-inverse`).

**Verification gate:** after this edit (and before Step 3.5), `npm test -- src/theme/tokens.spec.ts` will pass for key equality, but `preview-html.spec.ts` still fails until the compiled CSS is regenerated. Sequence is enforced below.

**Commit (Steps 3.1 + 3.2 together):**
```
feat(theme): add --cba-hover-inverse/--cba-active-inverse tokens for solid buttons
```

---

### Step 3.3 — Split solid variant state selectors in `src/components/button/cba-button.component.scss`

**File:** `src/components/button/cba-button.component.scss`
**Edits:** three independent replacements — one per solid variant (`primary`, `danger`, `success`). The `secondary` and `ghost` blocks are intentionally left unchanged.

**3.3.a — `primary` (lines 36–47):**

Current:
```scss
.cba-button--primary .cba-button__control {
  background-color: var(--cba-accent-primary);
  color: var(--cba-text-inverse);

  &:hover {
    background-image: linear-gradient(var(--cba-hover), var(--cba-hover));
  }

  &:active {
    background-image: linear-gradient(var(--cba-active), var(--cba-active));
  }
}
```

New:
```scss
.cba-button--primary .cba-button__control {
  background-color: var(--cba-accent-primary);
  color: var(--cba-text-inverse);

  &:hover {
    background-image: linear-gradient(var(--cba-hover-inverse), var(--cba-hover-inverse));
  }

  &:active {
    background-image: linear-gradient(var(--cba-active-inverse), var(--cba-active-inverse));
  }
}
```

**3.3.b — `danger` (lines 76–87):**

Current:
```scss
.cba-button--danger .cba-button__control {
  background-color: var(--cba-accent-danger);
  color: var(--cba-text-inverse);

  &:hover {
    background-image: linear-gradient(var(--cba-hover), var(--cba-hover));
  }

  &:active {
    background-image: linear-gradient(var(--cba-active), var(--cba-active));
  }
}
```

New:
```scss
.cba-button--danger .cba-button__control {
  background-color: var(--cba-accent-danger);
  color: var(--cba-text-inverse);

  &:hover {
    background-image: linear-gradient(var(--cba-hover-inverse), var(--cba-hover-inverse));
  }

  &:active {
    background-image: linear-gradient(var(--cba-active-inverse), var(--cba-active-inverse));
  }
}
```

**3.3.c — `success` (lines 89–100):**

Current:
```scss
.cba-button--success .cba-button__control {
  background-color: var(--cba-accent-success);
  color: var(--cba-text-inverse);

  &:hover {
    background-image: linear-gradient(var(--cba-hover), var(--cba-hover));
  }

  &:active {
    background-image: linear-gradient(var(--cba-active), var(--cba-active));
  }
}
```

New:
```scss
.cba-button--success .cba-button__control {
  background-color: var(--cba-accent-success);
  color: var(--cba-text-inverse);

  &:hover {
    background-image: linear-gradient(var(--cba-hover-inverse), var(--cba-hover-inverse));
  }

  &:active {
    background-image: linear-gradient(var(--cba-active-inverse), var(--cba-active-inverse));
  }
}
```

**Unchanged:** `secondary` (lines 49–61) keeps `var(--cba-hover)` / `var(--cba-active)`; `ghost` (lines 63–74) keeps `background-color: var(--cba-hover)` / `var(--cba-active)`; the disabled/loading block (lines 103–107), the reduced-motion block, and the `.cba-button__icon` / `.cba-button__label` blocks stay exactly as-is.

**Why `background-image` and not `background-color` for solid variants:** the spec (§4.3 note) requires the overlay sit on top of the base accent fill without replacing it. Using `background-image: linear-gradient(token, token)` composites a translucent overlay over the existing `background-color`, exactly mirroring the existing pattern used by `secondary`. Changing this mechanism is out of scope and would risk contrast regressions.

**Commit:**
```
fix(button): use light inverse overlays for primary/danger/success hover & active
```

---

### Step 3.4 — Mirror the selector split in `docs/theme-preview.html`

**File:** `docs/theme-preview.html`
**Edit:** replace the four preview button-state CSS rules (lines 131–134) so solid variants reference the inverse tokens, while `secondary` keeps dark overlays and `ghost` keeps `background`.

**Current (lines 131–134):**
```css
    .pv-btn--primary.is-hover,.pv-btn--secondary.is-hover,.pv-btn--danger.is-hover,.pv-btn--success.is-hover{background-image:linear-gradient(var(--cba-hover),var(--cba-hover))}
    .pv-btn--ghost.is-hover{background:var(--cba-hover)}
    .pv-btn--primary.is-active,.pv-btn--secondary.is-active,.pv-btn--danger.is-active,.pv-btn--success.is-active{background-image:linear-gradient(var(--cba-active),var(--cba-active))}
    .pv-btn--ghost.is-active{background:var(--cba-active)}
```

**New:**
```css
    .pv-btn--primary.is-hover,.pv-btn--danger.is-hover,.pv-btn--success.is-hover{background-image:linear-gradient(var(--cba-hover-inverse),var(--cba-hover-inverse))}
    .pv-btn--secondary.is-hover{background-image:linear-gradient(var(--cba-hover),var(--cba-hover))}
    .pv-btn--ghost.is-hover{background:var(--cba-hover)}
    .pv-btn--primary.is-active,.pv-btn--danger.is-active,.pv-btn--success.is-active{background-image:linear-gradient(var(--cba-active-inverse),var(--cba-active-inverse))}
    .pv-btn--secondary.is-active{background-image:linear-gradient(var(--cba-active),var(--cba-active))}
    .pv-btn--ghost.is-active{background:var(--cba-active)}
```

**Adjacent comment updates (optional but recommended for spec adherence):**
- Line 114 comment currently reads `/* Button states matrix (spec §6) — mirrors src/components/button/cba-button.component.scss */`. No content change required; the "mirrors" statement remains accurate after the split. No edit needed.
- Lines 223–227 comment block describes the matrix as 60 buttons across 3 surfaces × 5 variants × 4 states; this count is unchanged by the token swap. No edit needed.

**Effect:** the static preview will now visibly lighten solid buttons on hover/active across the panel, elevated, and canvas surface blocks, satisfying front-end spec acceptance criterion "button matrix visually distinguishes hover/active states for solid variants".

**No commit yet** — the compiled CSS must be regenerated (Step 3.5) before the preview is servable, and `preview-html.spec.ts` will fail until then. Commit in Step 3.5 together with `docs/theme-preview.css`.

---

### Step 3.5 — Regenerate `docs/theme-preview.css` via `npm run build:preview`

**Command (run from the project root via `bash`, single command, no chaining):**
```
npm run build:preview
```

This script (`package.json` line 21) compiles `src/theme/theme.scss` → `docs/theme-preview.css` with `--no-source-map --style=compressed`. By design `theme.scss` `@import`s `_variables.scss`, so the two new tokens are emitted into the compiled `:root`.

**Expected diff in `docs/theme-preview.css`:** the single-line `:root{...}` declaration block will gain two new declarations (ordering matches `_variables.scss`):
```css
--cba-hover-inverse:rgba(253,252,248,.12);
--cba-active-inverse:rgba(252,252,248,.22);
```
Note: the sass compressed formatter rewrites `rgba(253, 252, 248, 0.12)` → `rgba(253,252,248,.12)` (drops spaces and leading zero). The `preview-html.spec.ts` "matches canonical values for every expected token" assertion compares parsed values against `EXPECTED_TOKENS` (which uses `rgba(253, 252, 248, 0.12)`). 

**This is a known compatibility point and requires verification:** the `parseScssVariables` regex `(--cba-[a-z0-9-]+)\s*:\s*([^;}]+)[;}]\s*` captures the value text verbatim after `.trim()`. The compiled form `rgba(253,252,248,.12)` will NOT string-equal `rgba(253, 252, 248, 0.12)`. 

**Decision:** the implementer MUST verify whether the existing `--cba-hover` / `--cba-active` assertions already pass with the compiled compressed form. The current compiled `docs/theme-preview.css` (pre-change) already stores those tokens in compressed form, and `EXPECTED_TOKENS['--cba-hover']` is `rgba(43, 38, 32, 0.10)` (spaces + leading zero). 

**Pre-check action (BEFORE editing Step 3.2):** the implementer MUST run `npm test -- src/theme/preview-html.spec.ts` against the current `main` baseline to confirm the existing "matches canonical values" test currently passes. Two possible states:

- **State A — test currently passes on `main`:** this means `parseScssVariables` already normalizes whitespace + leading-zero (unlikely given the regex, but possible if `_variables.scss` is parsed by `loadScssVariables()` which reads the SCSS source directly — note `tokens.spec.ts` uses `loadScssVariables()` reading `src/theme/_variables.scss`, NOT the compiled CSS). **However**, `preview-html.spec.ts` reads `docs/theme-preview.css` via `parseScssVariables(css)`. If the current test passes, then either the compiled CSS already preserves the spaced `rgba()` form, or the test was previously adjusted. The implementer MUST inspect the actual current `docs/theme-preview.css` `:root` block for `--cba-hover` to determine the canonical emitted form, then set `EXPECTED_TOKENS` values (Step 3.2) to **match the emitted compiled form character-for-character** (spaces, leading zeros) so the preview CSS test passes. The `tokens.spec.ts` test compares against the SCSS source (`loadScssVariables()` reading `src/theme/_variables.scss`), where the spaced form (`rgba(253, 252, 248, 0.12)`) is what we wrote — so `EXPECTED_TOKENS` values MUST satisfy BOTH the SCSS-source test (spaced form) AND the compiled-CSS test (whatever form sass emits).

  **Resolution if forms diverge:** If `'rgba(253, 252, 248, 0.12)' !== '<compiled form for --cba-hover-inverse>'`, the implementer MUST NOT loosen the assertions to allow whitespace variation (out of scope). Instead, the implementer MUST verify the existing `--cba-hover` token currently passes both tests and conclude that sass must be emitting the same-spaced form. If sass indeed compresses (spaces removed, leading zeros removed), the existing `--cba-hover` test would already be failing on `main` — which contradicts the green baseline. Therefore the reasonable conclusion is that the sass version configured here preserves the rgba form verbatim. The implementer MUST run the test suite once on the clean branch first to establish ground truth before adding tokens.

  **Mandatory pre-edit command (run once, no edits yet):**
  ```
  npm test -- src/theme/preview-html.spec.ts
  ```
  If green, proceed assuming compiled-CSS values equal the spaced `EXPECTED_TOKENS` form. If red, STOP and return a question to the Plan Agent — a normalization helper may already be needed, and that is out of scope for this single task.

- **State B — test currently red on `main`:** STOP — this indicates an existing broken baseline unrelated to this task. Return a question to the Plan Agent; do NOT proceed.

**After regeneration:** verify `docs/theme-preview.css` contains `--cba-hover-inverse` and `--cba-active-inverse` in its `:root` block (use `grep` for `--cba-hover-inverse` in `docs/theme-preview.css`). Then run `npm test -- src/theme/preview-html.spec.ts` to confirm the new compiled tokens are detected and value-matched.

**Commit (Steps 3.4 + 3.5 together):**
```
docs(preview): split solid button state overlays and regenerate theme-preview.css
```

---

### Step 3.6 — Update `docs/CONSUMER_GUIDE.md` "State overlays" table

**File:** `docs/CONSUMER_GUIDE.md`
**Edit:** replace the "State overlays" table (lines 129–134) with a four-column table that separates solid variants from `secondary`/`ghost`.

**Current (lines 127–134):**
```markdown
### State overlays

| State | Solid variants & `secondary` | `ghost` |
|-------|------------------------------|---------|
| normal | base tokens only | transparent bg, `--cba-text-primary` |
| hover | `linear-gradient(var(--cba-hover), var(--cba-hover))` over base bg | `background-color: var(--cba-hover)` |
| active | `linear-gradient(var(--cba-active), var(--cba-active))` over base bg | `background-color: var(--cba-active)` |
| disabled / loading | `opacity: 0.6`, `cursor: not-allowed`, preserve base tokens | same |
```

**New:**
```markdown
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
```

**Also update the paragraph immediately above the table (lines 104–106) which currently asserts "Hover and active states use the same base tokens plus an overlay (`--cba-hover` or `--cba-active`)":**

Current (lines 104–106):
```markdown
Use `CbaButton` from `@cobranza-apps/ui` whenever possible. When custom buttons are
unavoidable, map every state to the tokens below. Hover and active states use the same
base tokens plus an overlay (`--cba-hover` or `--cba-active`). Disabled and loading
states share one treatment: `opacity: 0.6` and `cursor: not-allowed`.
```

New:
```markdown
Use `CbaButton` from `@cobranza-apps/ui` whenever possible. When custom buttons are
unavoidable, map every state to the tokens below. Hover and active states use the same
base tokens plus an overlay; solid variants (`primary`/`danger`/`success`) use the light
inverse overlays (`--cba-hover-inverse` / `--cba-active-inverse`), while `secondary` and
`ghost` use the dark overlays (`--cba-hover` / `--cba-active`). Disabled and loading
states share one treatment: `opacity: 0.6` and `cursor: not-allowed`.
```

**No other section** of `CONSUMER_GUIDE.md` is changed. The "Focus ring" and "Variant × surface base mapping" tables remain accurate.

**Verification gate:** none automated for markdown; visual review by docs-specialist in 4.4.

**Commit:**
```
docs(consumer-guide): document solid vs secondary/ghost button state overlay split
```

---

### Step 3.7 — Update `.agent/project-info/brief.md` §5 token table

**File:** `.agent/project-info/brief.md`
**Edit:** mirror the two new tokens into the SCSS `:root` code block, immediately after `--cba-active` (brief.md line 132) and before `--cba-focus-ring` (brief.md line 133).

**Current (brief.md lines 130–133):**
```scss
  /* Interactive states — warm taupe overlays + warm coral focus ring */
  --cba-hover: rgba(43, 38, 32, 0.10);
  --cba-active: rgba(43, 38, 32, 0.18);
  --cba-focus-ring: 0 0 0 3px rgba(232, 90, 79, 0.45);
```

**New:**
```scss
  /* Interactive states — warm taupe overlays + warm coral focus ring */
  --cba-hover: rgba(43, 38, 32, 0.10);
  --cba-active: rgba(43, 38, 32, 0.18);
  --cba-hover-inverse: rgba(253, 252, 248, 0.12);
  --cba-active-inverse: rgba(253, 252, 248, 0.22);
  --cba-focus-ring: 0 0 0 3px rgba(232, 90, 79, 0.45);
```

**Optional clarifying note (recommended, single sentence appended after the existing `> **Note:**` paragraph at line 101 or as a new short line below the SCSS block):** the implementer SHOULD add one self-documenting line directly under the SCSS `:root` block (after brief.md line 157, before line 158's closing ``` fence), or appended to the existing `--cba-text-muted usage restriction` paragraph at line 160. 

Appended paragraph (insert after the existing muted restriction paragraph, brief.md line 160, before line 161 blank):

```markdown
**`--cba-hover-inverse` / `--cba-active-inverse` usage:** light overlays (`rgba(253, 252, 248, 0.12)` and `0.22`, hue matching `--cba-text-inverse`) applied via `background-image: linear-gradient(token, token)` over solid accent fills (`--cba-accent-primary`, `--cba-accent-danger`, `--cba-accent-success`) to make hover/active perceptible on dark backgrounds. The dark overlays (`--cba-hover`, `--cba-active`) remain for `secondary`/`ghost` which sit on light surfaces.
```

This keeps `brief.md` §5 as the canonical single source (the `_variables.scss` header comment already references `brief.md §5` as the source of truth).

**Commit (Step 3.7 with Step 3.8 below):**
```
docs(brief): add inverse overlay tokens to §5 design-token table
```

---

### Step 3.8 — Add `## [0.11.2] — 2026-08-07` entry to `CHANGELOG.md`

**File:** `CHANGELOG.md`
**Edit:** insert a new dated header directly above the existing `## [0.11.1] — 2026-08-06` line (CHANGELOG.md line 33). Per `.kilo/rules/changelog-versioning.md`, there MUST be **no `[Unreleased]`** section; the new version header is dated and sits on top.

**New block to insert (between line 32 — the empty line after `> Releases prior...` — and the current line 33 `## [0.11.1] ...`):**
```markdown
## [0.11.2] — 2026-08-07

### Added

- New interactive-state tokens in `src/theme/_variables.scss` for solid accent buttons: `--cba-hover-inverse` (`rgba(253, 252, 248, 0.12)`) and `--cba-active-inverse` (`rgba(253, 252, 248, 0.22)`). Hue matches `--cba-text-inverse`; applied via `background-image: linear-gradient(token, token)` so the overlay composites over the base accent fill without replacing it. See `.agent/project-info/brief.md` §5 and `docs/CONSUMER_GUIDE.md` §Button Color Guide.

### Fixed

- Solid button variants (`primary`, `danger`, `success`) were nearly indistinguishable across normal/hover/active states because dark overlays (`--cba-hover`, `--cba-active`) on already-dark accent backgrounds produced imperceptible shifts. Solid variants now use the new light inverse overlays; `secondary` and `ghost` continue using the dark overlays (light surfaces). Mirrors the split in `docs/theme-preview.html` and regenerates `docs/theme-preview.css` via `npm run build:preview`. Token-key parity asserted by `src/theme/tokens.spec.ts` and `src/theme/preview-html.spec.ts`.

```

**Pre-check:** the implementer MUST read the current top of `CHANGELOG.md` to verify there is no existing `[Unreleased]` section to remove. (Initial read showed only `## [0.11.1] — 2026-08-06` at the top of dated entries; no `[Unreleased]` section exists, so no removal action is needed.)

**Verification gate:** after inserting, the implementer greps `CHANGELOG.md` for `[Unreleased]` (case-insensitive) and confirms zero matches. Any match means the changelog rule was violated — STOP and return a question to the Plan Agent.

**Commit (with Step 3.7):**
```
docs(brief): add inverse overlay tokens to §5 design-token table
```
(The CHANGELOG edit is staged in the same commit.)

---

### Step 3.9 — Add focused spec assertions in `src/theme/preview-html.spec.ts`

**File:** `src/theme/preview-html.spec.ts`
**Edit:** add a new `describe` block (or extend the existing `describe('docs/theme-preview.css interactive state overlay values', ...)`) near the bottom of the file (after line 145, before the closing of the file at line 146), asserting the inverse tokens are referenced by the button component SCSS and the preview button CSS uses the inverse tokens for solid variants.

**Append to the existing `describe('docs/theme-preview.css interactive state overlay values', ...)` block (insert AFTER the existing `button component scss references both interaction tokens` `it` at lines 141–145, before the closing `});` at line 146):**

```ts
  it('inverse hover and active alphas differ by at least 0.05', () => {
    const hoverAlpha = parseAlpha(EXPECTED_TOKENS['--cba-hover-inverse']);
    const activeAlpha = parseAlpha(EXPECTED_TOKENS['--cba-active-inverse']);
    expect(activeAlpha - hoverAlpha).toBeGreaterThanOrEqual(0.05);
  });

  it('button component scss references inverse tokens for solid variants', () => {
    const buttonScss = readProjectText('src/components/button/cba-button.component.scss');
    expect(buttonScss).toContain('var(--cba-hover-inverse)');
    expect(buttonScss).toContain('var(--cba-active-inverse)');
  });

  it('preview button CSS uses inverse overlay for solid variant hover/active', () => {
    const solidHoverRule =
      '.pv-btn--primary.is-hover,.pv-btn--danger.is-hover,.pv-btn--success.is-hover{background-image:linear-gradient(var(--cba-hover-inverse),var(--cba-hover-inverse))}';
    const solidActiveRule =
      '.pv-btn--primary.is-active,.pv-btn--danger.is-active,.pv-btn--success.is-active{background-image:linear-gradient(var(--cba-active-inverse),var(--cba-active-inverse))}';
    expect(html).toContain(solidHoverRule);
    expect(html).toContain(solidActiveRule);
  });

  it('preview button CSS keeps dark overlay for secondary hover/active', () => {
    const secondaryHoverRule =
      '.pv-btn--secondary.is-hover{background-image:linear-gradient(var(--cba-hover),var(--cba-hover))}';
    const secondaryActiveRule =
      '.pv-btn--secondary.is-active{background-image:linear-gradient(var(--cba-active),var(--cba-active))}';
    expect(html).toContain(secondaryHoverRule);
    expect(html).toContain(secondaryActiveRule);
  });

  it('compiled preview CSS declares the inverse tokens', () => {
    expect(css).toContain('--cba-hover-inverse');
    expect(css).toContain('--cba-active-inverse');
  });
```

**Notes:**
- `html` and `css` module-level consts (lines 33–35) are already in scope inside this `describe` block.
- `parseAlpha` (lines 28–31) already handles the `rgba(r, g, b, a)` form; the regex `rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)` correctly extracts `0.12` and `0.22` from the inverse token values. (Confirmed: r=`253`, g=`252`, b=`248`, a=`0.12`.)
- `EXPECTED_TOKENS` is imported at line 22–26 and will include the new inverse keys after Step 3.2.
- The string literals for `solidHoverRule` / `solidActiveRule` / `secondaryHoverRule` / `secondaryActiveRule` MUST match the exact text emitted in `docs/theme-preview.html` after Step 3.4 (single line, no inner spaces, the compressed inline-style form). The implementer MUST copy these exact strings; if Step 3.4 produces a different whitespace form, the test strings MUST be adjusted to match the actual emitted line. Re-running `npm test -- src/theme/preview-html.spec.ts` after Step 3.5 will surface any mismatch.
- `readProjectText` is already imported at line 19 and the existing test at lines 142–145 already uses it on the button SCSS path; no new imports required.

**Verification gate:** `npm test -- src/theme/preview-html.spec.ts` MUST be green after this step + Step 3.5.

**Commit:**
```
test(theme): assert inverse overlay tokens and solid/secondary selector split
```

---

### Step 3.10 — Add `tokens.spec.ts` assertion for new token presence (optional hardening)

**File:** `src/theme/tokens.spec.ts`
**Edit:** the existing "has exactly the expected --cba-* tokens" test (lines 27–29) already includes the two new tokens transitively, because of the `EXPECTED_TOKENS` update in Step 3.2 (Set equality uses the full key set). No new assertion is strictly required.

**Recommended hardening (optional but aligns with the spec's "Add assertions for new tokens" requirement):** append one focused `it` inside the existing `describe('theme tokens ...')` block, after the "keeps the file as a :root block" test (line 40), before the closing `});` (line 41):

```ts
  it('declares inverse overlay tokens for solid accent buttons', () => {
    expect(tokens.get('--cba-hover-inverse')).toBe(EXPECTED_TOKENS['--cba-hover-inverse']);
    expect(tokens.get('--cba-active-inverse')).toBe(EXPECTED_TOKENS['--cba-active-inverse']);
  });
```

**Rationale:** explicitly names the new tokens so future regressions are surfaced with a named failure rather than a generic set-mismatch message. The redundant equality test still passes; this is purely a clearer failure message.

**Verification gate:** `npm test -- src/theme/tokens.spec.ts` MUST be green.

**Commit (with Step 3.9):**
```
test(theme): assert inverse overlay tokens and solid/secondary selector split
```

---

### Step 3.11 — Lint, test, build, regenerate preview (full gate)

Run each command individually via `bash` (no chaining, no PowerShell, per `.kilo/rules/tool-selection-priority.md`):

1. `npm run lint` — ESLint over `src/**/*.ts`. The spec files edited in Steps 3.9/3.10 must pass; no new TS lint errors introduced. If any error originates from the new `it` blocks, fix string formatting (prefer double quotes consistent with surrounding tests).
2. `npm test` — runs the full Jest suite (configured via `jest --passWithNoTests`). Expected: all suites green, including `tokens.spec.ts`, `preview-html.spec.ts`, and any existing button component spec.
3. `npm run build` — `ng-packagr` library build; ensures SCSS compiles cleanly with the new tokens and the component SCSS changes. Must succeed with no compile warnings about unknown tokens.
4. `npm run build:preview` — final regeneration of `docs/theme-preview.css`. If it was already regenerated in Step 3.5, re-running confirms idempotency and that no Step 3.6–3.10 edit broke the compile. Re-run is mandatory to guarantee the committed `theme-preview.css` reflects the final `_variables.scss` + `theme.scss` state.

**On any failure:** STOP, do NOT commit a failing state, and return a question to the Plan Agent with the verbatim error tail. Do not amend previous commits to mask failures.

---

### Step 3.12 — Final git status check (manual, no commit)

Run `git status` to confirm the working tree contains only the expected modified files:

Expected modified files:
- `src/theme/_variables.scss`
- `src/components/testing/theme-fixtures.ts`
- `src/components/button/cba-button.component.scss`
- `docs/theme-preview.html`
- `docs/theme-preview.css`
- `docs/CONSUMER_GUIDE.md`
- `.agent/project-info/brief.md`
- `CHANGELOG.md`
- `src/theme/preview-html.spec.ts`
- `src/theme/tokens.spec.ts`

Expected UN-modified: `package.json` (already committed in Step 3's bump commit), `ng-package.json`, `public-api.ts`, any button `.ts` component file.

If `git status` shows untracked files such as `node_modules/`, lockfile changes, or `.kilo/` plan artifacts that should not be staged, follow `.kilo/rules/gitignore-compliance.md`: do NOT stage them. The implementation plan file `.kilo/plans/20260807-fix-solid-button-states-impl.md` is the only `.kilo/` artifact created by this plan step and is acceptable to leave untracked (markdown-generation-rule permits Plan Agent to create plan files).

**No additional commit at this step.** This is a verification gate before handing off to 4.3 (Code Review & Simplification).

---

## 4. Order of Execution Summary (for the implementer in 4.2)

1. Pre-check: `npm test -- src/theme/preview-html.spec.ts` on clean branch (establish ground truth for compiled-CSS string form). If red on clean baseline → STOP, return question.
2. Step 3.1 edit `_variables.scss`.
3. Step 3.2 edit `theme-fixtures.ts` `EXPECTED_TOKENS`.
4. Commit: `feat(theme): add --cba-hover-inverse/--cba-active-inverse tokens for solid buttons`.
5. Step 3.3 (a, b, c) edit `cba-button.component.scss` solid variants.
6. Commit: `fix(button): use light inverse overlays for primary/danger/success hover & active`.
7. Step 3.4 edit `docs/theme-preview.html` `.pv-btn--*` CSS rules.
8. Step 3.5 `npm run build:preview` (regenerate `docs/theme-preview.css`).
9. Verify compiled CSS contains the new tokens; verify `npm test -- src/theme/preview-html.spec.ts` value-match passes (adjust Step 3.9 string literals if compressed form differs).
10. Commit: `docs(preview): split solid button state overlays and regenerate theme-preview.css`.
11. Step 3.6 edit `docs/CONSUMER_GUIDE.md` table + intro paragraph.
12. Commit: `docs(consumer-guide): document solid vs secondary/ghost button state overlay split`.
13. Step 3.7 edit `.agent/project-info/brief.md` §5.
14. Step 3.8 insert `## [0.11.2] — 2026-08-07` block into `CHANGELOG.md`.
15. Verify no `[Unreleased]` section present.
16. Commit: `docs(brief): add inverse overlay tokens to §5 design-token table` (with CHANGELOG in same commit).
17. Step 3.9 + Step 3.10 extend spec files.
18. Commit: `test(theme): assert inverse overlay tokens and solid/secondary selector split`.
19. Step 3.11 full gate: `npm run lint`, `npm test`, `npm run build`, `npm run build:preview`.
20. Step 3.12 `git status` verification; handoff to 4.3.

---

## 5. Verification Against Original Task

Original TODO line:
> Fix solid button (primary, danger, success) hover/active state visibility: normal/hover/active states look almost identical on panel, elevated, and canvas surfaces. Add `--cba-hover-inverse` and `--cba-active-inverse` tokens (light overlays) so solid buttons lighten on hover/active. Update `_variables.scss`, button component SCSS, preview HTML/CSS, Consumer Guide, brief.md, tests, CHANGELOG. Bump to 0.11.2.

Coverage check:

| TODO requirement | Plan step |
|------------------|-----------|
| Add `--cba-hover-inverse` (light overlay) | 3.1 + 3.2 + 3.7 |
| Add `--cba-active-inverse` (light overlay) | 3.1 + 3.2 + 3.7 |
| Solid buttons lighten on hover/active | 3.3 (a, b, c) |
| Update `_variables.scss` | 3.1 |
| Update button component SCSS | 3.3 |
| Update preview HTML | 3.4 |
| Update preview CSS | 3.5 (regenerate) |
| Update Consumer Guide | 3.6 |
| Update brief.md | 3.7 |
| Update tests | 3.2 (fixture) + 3.9 + 3.10 |
| Update CHANGELOG | 3.8 |
| Bump to 0.11.2 | DONE in Step 3 (Critical Workflow); `package.json` confirmed at `0.11.2` |
| "primary, danger, success" specifically | 3.3 only touches those three; secondary/ghost left intact |
| "panel, elevated, and canvas surfaces" | Inherent — the tokens are surface-agnostic; preview matrix surfaces all three (Step 3.4) |
| "light overlays" so they "lighten" | Tokens use `#FDFCF8` (text-inverse hue) at 0.12/0.22 alpha, applied via `linear-gradient` to composite over the dark fill (per spec §4.3 note) |

All TODO sub-requirements are covered by atomic steps with exact file paths, line anchors, before/after snippets, and verification gates. The plan is **complete and correct**.

---

## 6. What Was Done

- Read TODO file, global plan, and front-end spec.
- Read current state of all 10 affected files (or the relevant sections) and the test helper utilities (`scss-tokens.ts`, `theme-fixtures.ts`, `preview-html.spec.ts`, `tokens.spec.ts`) to ground every edit in real line content.
- Read `package.json` to confirm version bump is already complete (Step 3 of Critical Workflow).
- Read `CHANGELOG.md` head to confirm no `[Unreleased]` section exists.
- Read `brief.md` §5 to confirm the canonical token table structure.
- Produced this implementation plan with 12 atomic steps, exact snippets, commit messages, verification gates, and order-of-execution summary.

## 7. What Was NOT Done

- No code files modified (4.1b is plan-only per the Critical Workflow and the Architector sub-agent boundaries).
- No git commands executed.
- No `npm` scripts executed (pre-check in Step 3.5/3.11 is for the implementer in 4.2).
- No code review (4.3), documentation pass (4.4), forward-verification (4.5), or task-close marking (4.6) — out of scope for 4.1b.
- The implementer MUST run the pre-check `npm test -- src/theme/preview-html.spec.ts` on a clean working tree first (Step 3.5 pre-check action) to resolve the compiled-CSS string-form ambiguity before adding new tokens; this is called out explicitly but not executed here.

---

**Plan file path:** `.kilo/plans/20260807-fix-solid-button-states-impl.md`