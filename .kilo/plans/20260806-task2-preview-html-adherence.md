# Overall Plan Adherence — Task 2: Theme Preview HTML Overhaul

**Date:** 2026-08-06
**Branch:** `feat/theme-refinement-tokens-preview-guide`
**Implementation Plan:** `.kilo/plans/20260806-task2-preview-html.md`
**Front-end Verification Report:** `.kilo/plans/20260806-task2-preview-html-verification.md`
**Global Plan:** `.kilo/plans/20260806-theme-tokens-preview-guide.md`
**Verifier:** architector (step 4.5b)

---

## 1. Scope of review

This report checks whether the implementation plan (`.kilo/plans/20260806-task2-preview-html.md`)
was executed fully and correctly for Task 2 ("Theme Preview HTML Overhaul"). It cross-references:

- The plan's steps (1–5) and sub-steps (3.1–3.8).
- The final state of `package.json`, `docs/theme-preview.html`, `docs/theme-preview.css`.
- The git commits belonging to Task 2.
- The front-end verification report.
- The out-of-scope constraints in plan §0.3 and §8.

Step 4.5b is the *Overall Plan Adherence* check; it does not duplicate the front-end spec
verification (4.5a) — it consumes that report and evaluates plan-vs-implementation fidelity.

---

## 2. Task 2 commits (in order)

| # | SHA | Message | Files | Plan step |
|---|---|---|---|---|
| 1 | `075e3b2` | `chore(preview): add build:preview script and sass devDependency` | `package.json`, `package-lock.json` | Step 1 |
| 2 | `90dbfc6` | `feat(preview): link compiled theme CSS, add swatches, button matrix, text-on-surfaces` | `docs/theme-preview.css`, `docs/theme-preview.html` | Steps 2 + 3 + 4 |
| 3 | `e07eff1` | `refactor(preview): generate swatches and text cards from data arrays` | `docs/theme-preview.html` | 4.3 simplify fix |
| 4 | `eb8bee7` | `docs(preview): add AI-agent comments, CHANGELOG entries, and doc index references for theme preview overhaul` | `docs/theme-preview.html`, `CHANGELOG.md`, `README.md`, `docs/INDEX.md` | 4.4 docs |

All four commit messages are meaningful, scoped (`chore|feat|refactor|docs(preview)`), and
narrow to the changes they contain. Combined diff stat across Task 2:
`package.json`(+2), `package-lock.json`(+5/-2), `docs/theme-preview.css`(+1),
`docs/theme-preview.html`(+225/-132), `CHANGELOG.md`, `README.md`, `docs/INDEX.md` (doc cross-refs).
No `node_modules/`, no `_variables.scss`, no `CONSUMER_GUIDE.md` touched.

---

## 3. Step-by-step adherence

### Plan Step 1 — `package.json` `build:preview` + `sass` devDependency — **PASS**

| Item | Plan | Actual | Status |
|---|---|---|---|
| `build:preview` script | `sass src/theme/theme.scss docs/theme-preview.css --no-source-map --style=compressed` | `package.json` line 21 — exact match | PASS |
| `sass` version pin | `^1.83.0` | `package.json` line 63 — `^1.83.0` | PASS |
| alphabetical position | after `rxjs`, before `tslib` | `rxjs` (line 62) → `sass` (line 63) → `tslib` (line 64) | PASS |
| `package-lock.json` updated | yes | commit `075e3b2` updates it | PASS |
| `npm install` clean | yes | `node_modules` not staged, `git status` clean | PASS |
| commit message | `chore(preview): add build:preview script and sass devDependency` | identical | PASS |

### Plan Step 2 — Generate `docs/theme-preview.css` — **PASS**

| Item | Plan | Actual | Status |
|---|---|---|---|
| File exists, committed | yes | `docs/theme-preview.css` committed in `90dbfc6` | PASS |
| Contains `:root --cba-bg-primary: #C5BFAE` | yes | `:root{--cba-bg-primary: #C5BFAE;…}` (line 1) | PASS |
| Contains `.cba-bg-primary{background…var(--cba-bg-primary)}` | yes | utility rule present (grep confirmed) | PASS |
| idempotent regeneration | yes | verification report §build-step: byte-identical, `git status` clean | PASS |

> Note: plan text 5.1 specifies compressed form `--cba-bg-primary:#C5BFAE` (no space). Sass
> `--style=compressed` keeps a single space after the colon for custom-property declarations,
> so the actual output is `: #C5BFAE`. This is a cosmetic regex illustrative mismatch in the
> plan text, not a functional deviation — the token value and utilities resolve correctly.

### Plan Step 3 — Overhaul `docs/theme-preview.html` — **PASS (with acceptable deviations)**

#### 3.1 Header comment + stylesheet `<link>` — **PASS**
- `<link rel="stylesheet" href="theme-preview.css" />` present at `docs/theme-preview.html:48`,
  placed **before** the inline `<style>` (line 49) exactly as the plan requires for the dark
  chrome `body` rule to win.
- **Deviation (acceptable):** the header comment was expanded from the plan's short 9-line form
  into a structured multi-section comment (lines 2–42: "HOW TO REGENERATE", "TOKEN SYNC CONTRACT",
  "STRUCTURE", "SURFACE OWNERSHIP", "CONSTRAINTS"). This was added in the 4.4 docs step
  (commit `eb8bee7`) and preserves every piece of information the plan required (regeneration
  via `npm run build:preview`, no-mirror directive, verification hint). Documentation enrichment,
  not a functional change.

#### 3.2 Replace inline `<style>` block — **PASS**
- All themed surface, button, text, and swatch rules use `var(--cba-*)` (lines 71–151).
- Dark tool-chrome grays (`#111`, `#1a1a1a`, `#222`, `#333`, `#555`, `#888`, `#8a9099`,
  `#9aa`, `#9ab`, `#bbb`) preserved unchanged — they are not `--cba-*` tokens.
- `.theme-btn.active` (line 59) uses `var(--cba-accent-danger)` + `color-mix(in srgb,…)`
  exactly as the plan dictates — the only previously-hard-coded theme hex `#B93E36` was removed.
- **Deviation (acceptable):** the "Preserved informational rows" rule was written in the plan
  as `.accent-row,.btn-row{…}`. The actual file (line 154) contains only `.accent-row{…}` because
  the `.btn-row` body section was already removed by plan §3.5 (the new "Button states" matrix
  supersedes the simple `.btn-row` demo). The narrowing is consistent with §3.5.

#### 3.3 Controls sidebar hint — **PASS**
- `docs/theme-preview.html:163–164` contains the exact updated hint text from the plan
  (`"Minimal Yet Warm — preview"` heading + `"Preview enlazado a docs/theme-preview.css…"`
  paragraph).

#### 3.4 `aria-label`s on module-header icon buttons — **PASS**
- All four `aria-label` attributes present (lines 185–186): `Expandir`, `Pantalla completa`,
  `Cerrar`, `Desacoplar`. Order and glyphs match the plan.

#### 3.5 `.extras` body content — **PASS (with acceptable refactor)**
- The 3 expected sections (Token swatches / Button states / Text on surfaces) plus the
  preserved `Accent pills` + `raw-strip` are all present (lines 219–245).
- **Deviation (acceptable):** the plan specified **static HTML** for the swatch grid
  (9 hardcoded `<div class="swatch">` rows) and text-on-surfaces cards. The actual
  implementation (after the 4.3 code-simplifier cycle, commit `e07eff1`) uses
  **data-driven JS rendering**:
  - `<div class="swatch-grid" id="swatchGrid"></div>` mount point + `renderSwatches()`
    driven by `TOKEN_ROLES`.
  - `<div class="text-grid" id="textGrid"></div>` mount point + `renderTextSamples()`
    driven by a new `TEXT_SAMPLES` array.
  - This is a legitimate product of the 4.3 code-simplifier sub-step (Critical Workflow 4.3
    explicitly allows "review sources to simplify code where possible"). It reduces
    duplication — adding a token becomes a single `TOKEN_ROLES` row edit instead of an HTML
    row + a CSS swatch chip — and the rendered output is functionally identical: the same 9
    swatches (canvas/panel/elevated/inset/text/border/accent/warning/danger) and the same 4
    text-on-surfaces cards (canvas/inset show the muted-restriction callout + canvas shows
    the inverse-on-accent chip), confirmed by the front-end verification report (PASS).
- HTML comments were added inside `.extras` (lines 206–211, 213–218, 222–227, 231–238) and
  before `<script>` (lines 256–264) during 4.4 — acceptable AI-agent documentation.

#### 3.6 Rewrite `<script>` block — **PASS (with acceptable refactor)**
- `applyTheme()` no longer sets inline custom properties — the mirrored `--canvas`/`--panel`
  approach is gone. Tokens resolve solely from the linked `docs/theme-preview.css`.
  This is the core drift fix requested by TODO line 1.
- Single `theme` data object retained (lines 266–272).
- `TOKEN_ROLES` carries the hex for the swatch labels and the role map (lines 274–284).
- `buildButtonMatrix()` generates 3 surfaces × 5 variants × 4 states = 60 buttons
  (lines 368–377), called at line 389; the front-end verification report independently
  counted 60 buttons in the rendered DOM.
- All functions obey the project rules: each takes ≤2 params, body ≤50 lines, block-nesting
  depth ≤2 (arrow expressions returning template strings do not add block depth).
- **Cosmetic improvements (acceptable):** `renderSourceHex`, `renderRoleMap`, `renderAccents`,
  `renderRawStrip` were converted to ES template literals (plan used string concatenation);
  `buildStateButtons`/`buildButtonMatrix` use array destructuring instead of index access.
  Both produce identical output and are more idiomatic JS.
- **Added (acceptable, supports 3.5 refactor):** `renderSwatches()` (lines 328–334),
  `renderTextSamples()` (lines 336–346), and the `TEXT_SAMPLES` constant (lines 302–307).
  These functions back the data-driven swatch/text sections; they are ≤2 params, ≤50 lines,
  depth ≤2, and were themselves reviewed in 4.3.

#### 3.7 Preserve unchanged body regions — **PASS**
- `<aside class="controls">` structure (themeList + srcHex + roleMap containers) preserved.
- `.preview-bar`, `.shell-header`, `.workspace` `.module` shell (header/body/table/footer)
  preserved.
- `.shell-footer` pills block preserved (lines 248–253).

#### 3.8 Regenerate compiled CSS — **PASS**
- Verification report 5.1 confirms `npm run build:preview` rewrites `docs/theme-preview.css`
  byte-identically (only Sass deprecation warnings on pre-existing global `map-get` usage).

### Plan Step 4 — Commit preview overhaul — **PASS**
- `git status` confirmed `node_modules/` not staged (Gitignore Compliance Rule satisfied).
- Commit `90dbfc6` staged exactly `docs/theme-preview.html` + `docs/theme-preview.css`.
- Commit message matches plan §4 wording.

### Plan Step 5 — Verification — **PASS**
- The front-end verification report (4.5a) confirms all 10 spec acceptance criteria pass,
  including: `file://` load with zero 404s/console errors, computed-style RGB matches every
  expected token hex, 9 swatches / 4 text samples / 60 buttons in the DOM, two-column layout
  preserved, `npm run build:preview` idempotent, `npm run build` + `npm run lint` green.

---

## 4. Out-of-scope compliance (plan §0.3 / §8)

| Constraint | Status |
|---|---|
| Do NOT modify `src/theme/_variables.scss` | PASS — no Task 2 commit touches it |
| Do NOT add regression tests | PASS — none added (deferred to Task 4) |
| Do NOT modify `docs/CONSUMER_GUIDE.md` | PASS — untouched (Task 3 scope) |
| Do NOT modify real Angular components | PASS — no `src/components/**` touched |
| Do NOT update `.gitignore` | PASS — unchanged (compiled CSS stays tracked) |
| Do NOT stage `node_modules/` | PASS — `git status` clean |

---

## 5. Documentation step (4.4) extra files — in scope for 4.4, NOT a plan deviation

Commit `eb8bee7` (4.4 docs step) additionally modified `CHANGELOG.md`, `README.md`, and
`docs/INDEX.md`. These files are **not** in Implementation Plan §1 "Affected Files", but
§1 only enumerates files touched by the 4.2 *implementation* step. Cross-reference and
changelog updates fall under the separate 4.4 *Documentation* workflow step
(docs-specialist), which is permitted to "update/create project documentation (e.g. README,
`/docs`)". The additions are:

- `CHANGELOG.md`: new 0.11.0 entries describing the preview overhaul + `build:preview`
  script + `sass` devDependency, plus a link to the Task 2 front-end spec.
- `README.md`: one new bulleted link to `docs/theme-preview.html`.
- `docs/INDEX.md`: new "Visual preview" section linking `theme-preview.html`.

None of these contradict the implementation plan; they document its result. **Not a deviation.**

---

## 6. Deviation summary

| # | Deviation | Source step | Impact | Acceptable? | Reason |
|---|---|---|---|---|---|
| D1 | Compressed CSS emits `: #C5BFAE` (space after colon) vs plan text `:#C5BFAE` | Step 2/5.1 | None — both are valid sass `--style=compressed` output; token resolves correctly | YES | Plan regex was illustrative; output is correct |
| D2 | Header comment expanded into structured multi-section block | 3.1 (enriched in 4.4) | None — preserves all plan-mandated info, adds navigability | YES | Documentation enrichment in 4.4 scope |
| D3 | Swatches + text-on-surfaces rendered via JS data arrays instead of static HTML | 3.5 (refactored in 4.3) | None — identical rendered output, less duplication | YES | Legitimate 4.3 code-simplifier result; verified PASS by 4.5a |
| D4 | `.accent-row,.btn-row` combined rule narrowed to `.accent-row` | 3.2 | None — `.btn-row` body removed by §3.5 already | YES | Consistent with §3.5 |
| D5 | Script uses template literals + array destructuring in render/build functions | 3.6 (cleaned in 4.3) | None — idiomatic JS, identical output | YES | Cosmetic simplification |
| D6 | Added `renderSwatches()`, `renderTextSamples()`, `TEXT_SAMPLES` constant | 3.6 (added in 4.3) | None — backs D3 refactor; obeys ≤2 params / ≤50 lines / ≤2 depth | YES | Supports D3 |
| D7 | `CHANGELOG.md`, `README.md`, `docs/INDEX.md` updated | 4.4 docs step | None — project documentation/cross-references | YES | Separate 4.4 workflow step scope |

All deviations are cosmetic, documentation-layer, or simplifier-cycle refactors that preserve
the plan's functional contract and were verified by the front-end report. **No deviation
requires a new TODO file.**

---

## 7. Cross-check against TODO source

TODO `.agent/todos/20260805/20260805-todo-1.md` lines relevant to Task 2:

| TODO line | Addressed by |
|---|---|
| Line 1 — "preview really uses the styles defined in the library… eliminate drift" | Plan Step 3.1 `<link>` + Step 2 compiled CSS; verified computed-styles match Shell |
| Line 4 — "add clear examples of {color list}" | Plan §3.5 swatches (9 chips: canvas/panel/elevated/inset/text/border/accent/warning/danger) — all present |
| Color list hex values | All 9 listed hex values appear as informational labels in `TOKEN_ROLES`; chips resolve via `var(--cba-*)` |

Task 2's TODO scope (lines 1 + 4) is fully covered.

---

## 8. Verdict

**PASS** — Plan Steps 1, 2, 3 (all sub-steps), 4, and 5 were executed correctly and in order.
All acceptance criteria from the implementation plan are met (`npm run build:preview`
regenerates byte-identical CSS; `npm run build` and `npm run lint` pass; preview renders from
`file://` resolving `:root` `--cba-*` tokens exactly as the Shell; swatches, button matrix,
and text-on-surfaces sections present and correct). Out-of-scope constraints respected.
Documentation step additions (CHANGELOG/README/INDEX) are in 4.4 scope and not plan deviations.
All seven deviations are acceptable (cosmetic / documentation / 4.3 simplifier refactor) and
do not require follow-up TODO entries.

Plan adherence: complete. Implementation ready for Task 2 completion (step 4.6).