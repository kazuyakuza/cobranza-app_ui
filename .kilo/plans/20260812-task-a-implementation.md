# Task A — Implementation Plan (Tasks 1–4)

**Date:** 2026-08-12
**Branch:** `feat/project-audit-and-fixes` (created by Step 2 of critical workflow)
**Source version:** `0.15.0` (already bumped in Step 3; `CHANGELOG.md` dated header `## [0.15.0] — 2026-08-12` already present — entries go directly under it, no new header, no `[Unreleased]` section per `.kilo/rules/changelog-versioning.md`).
**Parent plan:** [`.kilo/plans/20260812-project-audit-and-fixes.md`](./20260812-project-audit-and-fixes.md) (Tasks 1–4 scope).
**Front-end spec:** none required by global plan for Task A (Tasks 1–4 are audited from existing source; no new UI surface). Front-end flag is `Yes` but no new design — implementer proceeds directly from this plan.

---

## 0. Pre-Analysis & Technical Decisions

### 0.1 State verified at planning time

| Item | File | Verified state |
|------|------|----------------|
| `package.json` version | `package.json:3` | `0.15.0` ✓ (Step 3 done) |
| `exports["./theme"]` | `package.json:8-12` | Only `"sass": "./theme/theme.scss"` — missing `"default"`/`"style"` ❌ |
| `"sideEffects"` | `package.json:7` | `false` — risky for SCSS-emitting lib ❌ |
| `ng-package.json` assets | `ng-package.json:4-9` | Glob `**/*.scss` ships all partials (required for Sass `@use` resolution downstream) — keep as-is |
| `theme.scss` mixins line | `src/theme/theme.scss:15` | `@use 'mixins';` — does NOT re-export mixins, so `docs/THEME.md` mixin example `@include cba.cba-elevated-surface` would fail to resolve ❌ |
| `docs/USAGE.md` theme.css ref | `docs/USAGE.md:143` | `@import '@cobranza-apps/ui/theme.css';` — no artifact shipped ❌ |
| `docs/THEME.md` theme.css ref | `docs/THEME.md:47` | Same non-existent `theme.css` import ❌ |
| `docs/CONSUMER_GUIDE.md` theme | `docs/CONSUMER_GUIDE.md:73,83` | Already uses `@use '@cobranza-apps/ui/theme';` — no theme.css ref ✓ (no change) |
| `--cba-module-footer-height` | `_variables.scss` | Not defined; consumed at `module-footer.component.scss:8` with `, 40px` fallback ❌ |
| `--cba-icon-size-md` | `_variables.scss` | Not defined; `empty-state.component.scss:21` hard-codes `1.75rem` ❌ |
| `--cba-dropdown-min-width` | `_variables.scss` | Not defined; `dropdown.component.scss:16` hard-codes `12rem` ❌ |
| Dead tokens | `_variables.scss:82,92` | `--cba-selected-border`, `--cba-state-valid-text` defined but unused by component SCSS |
| `cba-field.component.scss` | `:49-55,64` | Uses `--cba-state-valid-border` (border) but NOT `--cba-state-valid-text` (text) |
| `Theme-fixtures EXPECTED_TOKENS` | `src/components/testing/theme-fixtures.ts` | Lock-step equals `_variables.scss` keys (enforced by `tokens.spec.ts:27-29`) — new tokens MUST be added here |
| `preview-html.spec.ts:122-126` | Asserts `docs/theme-preview.css` `:root` matches every `EXPECTED_TOKENS` value — `_variables.scss` changes REQUIRE `npm run build:preview` regeneration |
| `docs/USAGE.md` stale hex | lines 663,671,686,692,693,694 | `#C5BFAE` / `#DAD7CA` / `#A7A6A2` / `#8E8D8A` vs source `#BCB5A4` / `#E8E5DB` / `#A29D94` / `#6B665E` |
| `CBA_TYPEAHEAD.md:209` | claims `--cba-bg-primary`; `CbaFieldComponent` uses `--cba-bg-secondary` (via form-field host) |
| `CBA_MODULE_FOOTER.md:117` | `var(--cba-module-footer-height, 40px)` — token missing (Task 1 will DEFINE it, reconciling this) |
| `CBA_FORM_FIELD.md:132-138` ASCII tree comment | "adds label/hint/error/disabled inputs" — omits `readonly` and `valid` |
| `CBA_INPUT.md:177`, `CBA_SELECT.md:176`, `CBA_DATEPICKER.md:224` | Host-class lists omit `--invalid`; source binds both `--error` and `--invalid` to `error()` |
| `CBA_EMPTY_STATE.md:110` | "Icon has `aria-hidden`" reads as component-applied; consumer must add it |
| `CBA_BUTTON.md` ToC (lines 5-19) | Ends at "Accessibility"; missing "Non-goals" (line 152) and "Related docs" (line 157) |
| `ModuleFooterComponent` references | `module-footer/index.ts:10`, `module-footer.component.ts:73`, `module-footer.component.spec.ts:3,23,31,32,36,40,41`, `docs/CBA_MODULE_FOOTER.md:34`, `README.md:168` |
| `ModuleHeaderComponent` host | `module-header.component.ts:116` | `host: {}` empty |
| `ModuleFooterComponent` host | `module-footer.component.ts:65-72` | No `host` block |
| `module-header.component.scss:87,93` | `.cba-module-header--fullscreen` selectors target the inner `<header>` element |
| `module-header.component.html:1` | `<header class="cba-module-header" [class.cba-module-header--fullscreen]="isFullscreen()">` |

### 0.2 Decisions (binding for the implementer)

1. **`--cba-selected-border` & `--cba-state-valid-text`** — keep defined; add a comment marking each as a *reserved* consumer-styling token (do NOT wire into components). Wiring would change visual behaviour of selected items / valid-state field text and is out of scope for this audit pass. Aligns with `.kilo/rules/code-guidelines.md` §5 (preserve existing code) and the global plan's per-issue wording ("or add a comment explaining it's reserved").
2. **`--cba-module-footer-height: 40px;`** — add to `_variables.scss` in the Layout group. The SCSS fallback `var(--cba-module-footer-height, 40px)` at `module-footer.component.scss:8` stays (graceful degradation for consumers that don't load the theme — consistent with `module-header.component.scss:10` which keeps `var(--cba-module-header-min-height, 40px)`).
3. **`--cba-icon-size-md: 1.75rem;`** — add to `_variables.scss` Typography scale group; preserves the current `empty-state__icon` size (28px @ 16px root).
4. **`--cba-dropdown-min-width: 12rem;`** — add to `_variables.scss` Layout group; preserves current dropdown width.
5. **`theme.scss` mixins re-export** — change `@use 'mixins';` → `@forward 'mixins';` so consumers can `@include cba.cba-elevated-surface` from `@use '@cobranza-apps/ui/theme' as cba;` (makes the documented example in `docs/THEME.md:261-267` actually compile). Keep all other `@use` lines (`@use 'base' … 'utilities'`) — those partials emit CSS rules and must stay `@use`.
6. **`package.json` `exports["./theme"]`** — add `"style"` and `"default"` conditions resolving to `./theme/theme.scss`. Order: `sass` first (most specific), then `style`, then `default` (resolution fallback).
7. **`package.json` `"sideEffects": false`** — replace with `"sideEffects": ["**/*.scss"]` so bundlers correctly keep the SCSS entry tree-shake-safe for TS but not for SCSS.
8. **`ng-package.json` assets glob** — keep `**/*.scss` (consumers' `@use '@cobranza-apps/ui/theme'` needs `_variables.scss`, `_mixins.scss`, `_utilities.scss`, … resolvable from `dist/theme/`). Add no field-name change. (Decision: do not narrow — narrowing to `theme.scss` only would break downstream Sass resolution of the partials.)
9. **`docs/USAGE.md` & `docs/THEME.md` theme.css blocks** — delete the CSS-only fallback snippet and its note. Mark theme as Sass-only with a single `@use` example.
10. **`packages.json` exports already point at `./theme/theme.scss`** — confirm against built `dist/` after `npm run build`.
11. **Modal title `font-size`** — replace `var(--cba-space-5)` (spacing, 20px) with `var(--cba-font-size-display)` (typography, 1.25rem = 20px @ 16px root). Visual-equivalent; uses the correct token family.
12. **Component SCSS token fixes** — replace each hard-coded `font-size`/`line-height`/`min-width` with the matching token per the table in §2.1.
13. **`ModuleFooterComponent` → `CbaModuleFooterComponent`** — class rename + spec import/describe/fixture types + barrel export + `docs/CBA_MODULE_FOOTER.md` import line + `README.md` inventory row. The HTML selector `cba-module-footer` and `.cba-module-footer` CSS class are unchanged (no consumer-template breakage).
14. **`ModuleHeaderComponent`/`ModuleContainerComponent`** — per global plan Task 3, do NOT rename (the global plan only renames the footer). Header + Container keep their existing class names; only `host` blocks are added. **Noted gap** (do not act on it): the asymmetry leaves 2 of 3 module components unprefixed. Out of Task A scope — leave a note in the plan closeout summary for the caller.
15. **`host` blocks**:
    - `ModuleHeaderComponent`: `host: { 'class': 'cba-module-header', '[class.cba-module-header--fullscreen]': 'isFullscreen()' }`. Move `--fullscreen` modifier off the inner `<header>` (keep `class="cba-module-header"` on the inner element so existing `.cba-module-header { … }` SCSS rules still match). Update SCSS lines 87, 93 to `:host(.cba-module-header--fullscreen) { … }` and `:host(.cba-module-header--fullscreen) .cba-module-header__section--title { … }`. Remove the `[class.cba-module-header--fullscreen]` binding from `module-header.component.html:1`.
    - `CbaModuleFooterComponent`: `host: { 'class': 'cba-module-footer' }` (no SCSS change needed; `.cba-module-footer` inner rule remains).
16. **Doc file renames** — `MODULE_HEADER.md` → `CBA_MODULE_HEADER.md`, `MODULE_CONTAINER.md` → `CBA_MODULE_CONTAINER.md`. Update `docs/INDEX.md` (lines 21-22), `README.md` (lines 231-232), `docs/CBA_MODULE_FOOTER.md` related-docs links (lines 149-150), and the two `@see [MODULE_HEADER.md]` / `@see [MODULE_CONTAINER.md]` JSDoc links at `module-header.component.ts:107` and `module-container.component.ts:64`. No spec asserts these filenames (verified by grep over `src/`).
17. **Task 4 vs Task 1 reconciliation for `CBA_MODULE_FOOTER.md:117`** — after Task 1 defines `--cba-module-footer-height`, the doc reference is no longer "non-existent". Plan: simplify `Height: var(--cba-module-footer-height, 40px)` → `Height: var(--cba-module-footer-height)` (resolve = 40px) AND add a parenthetical "(40px)" so consumers see the resolved value. Do NOT delete the reference (Task 1 makes it valid).
18. **`docs/CONSUMER_GUIDE.md`** — already has no `theme.css` reference and no `ModuleFooterComponent` import. The only Task-A-relevant touch is the renamed `CBA_MODULE_HEADER.md`/`CBA_MODULE_CONTAINER.md` link at line 353 + 377 (`MODULE_HEADER.md §Drag handle slot`). Update those two link paths.
19. **CHANGELOG** — single appended block under the existing `## [0.15.0] — 2026-08-12` header, grouped by Keep-a-Changelog categories (`### Fixed`, `### Changed`, `### Added`). No `[Unreleased]` section. No historical-entry edits.
20. **Test re-run** — after token additions, regenerate `docs/theme-preview.css` via `npm run build:preview` (required by `preview-html.spec.ts`). Run full `npm test` after every commit.

### 0.3 Git commit boundaries (recommended — implementer may merge adjacent logical edits)

| # | Scope | Commit message |
|---|-------|----------------|
| C1 | `package.json` exports + sideEffects; `theme.scss` `@forward 'mixins'` | `fix(package): expose theme.scss via style/default exports, forward mixins, declare scss side-effects` |
| C2 | `_variables.scss` 3 new tokens + reserved-token comments + `theme-fixtures.ts` + regenerated `docs/theme-preview.css` | `feat(theme): add module-footer-height, icon-size-md, dropdown-min-width tokens` |
| C3 | `docs/USAGE.md` + `docs/THEME.md` theme.css removal | `docs(theme): remove non-existent theme.css import; mark theme as sass-only` |
| C4 | Component SCSS token compliance (modal, button, dropdown, module-footer, empty-state, badge) | `fix(components): replace hard-coded sizes with --cba-* tokens in component scss` |
| C5 | `ModuleFooterComponent` → `CbaModuleFooterComponent` rename + `host` block on footer | `refactor(module-footer): rename to CbaModuleFooterComponent and add host class` |
| C6 | `ModuleHeaderComponent` `host` block + SCSS `:host(--fullscreen)` retarget + template tweak | `refactor(module-header): add host class and move --fullscreen modifier to :host` |
| C7 | Doc file renames `MODULE_HEADER.md`/`MODULE_CONTAINER.md` → `CBA_*` + cross-ref updates (INDEX, README, CBA_MODULE_FOOTER, JSDoc @see) | `docs: rename MODULE_HEADER/CONTAINER docs to CBA_* prefix and update cross-refs` |
| C8 | Task 4 doc fixes (USAGE stale hex, CBA_TYPEAHEAD, CBA_MODULE_FOOTER height, CBA_FORM_FIELD tree, CBA_INPUT/SELECT/DATEPICKER --invalid, CBA_EMPTY_STATE aria, CBA_BUTTON ToC) | `docs: fix stale token values, missing host classes, and aria attribution` |
| C9 | `docs/CONSUMER_GUIDE.md` cross-ref path updates for renamed CBA_MODULE_HEADER.md | `docs(consumer-guide): update cross-refs to renamed CBA_MODULE_HEADER doc` |
| C10 | `CHANGELOG.md` single appended block under existing 0.15.0 header | `docs(changelog): document task-a audit fixes under 0.15.0 header` |
| C11 | (End-of-task verification) run `npm run build` + `npm test` + `npm run lint`; only commit if any auto-fix (e.g., prettier) artefacts remain | `chore: rebuild and verify after task-a audit fixes` (optional) |

> Each commit ends with `npm test` green BEFORE moving to the next. The implementer MUST run `npm run build:preview` whenever `_variables.scss` changes (C2).

---

## 1. Task 1 — Package Exports, Build Pipeline & Theme Tokens

### 1.1 `package.json` — exports + sideEffects (commit C1)

**File:** `package.json`

**Edit A — `exports["./theme"]` (lines 8-12):**

Old:
```json
  "exports": {
    "./theme": {
      "sass": "./theme/theme.scss"
    }
  },
```

New:
```json
  "exports": {
    "./theme": {
      "sass": "./theme/theme.scss",
      "style": "./theme/theme.scss",
      "default": "./theme/theme.scss"
    }
  },
```

**Edit B — `sideEffects` (line 7):**

Old: `"sideEffects": false,`
New: `"sideEffects": ["**/*.scss"],`

**Verify (no commit yet):** run `npm run build`. Then inspect `dist/package.json`:

- `version` field equals `0.15.0`.
- `exports["./theme"]` contains `sass`, `style`, `default` (ng-packagr copies `package.json` and strips `"private"` only).

### 1.2 `src/theme/theme.scss` — forward mixins (commit C1)

**File:** `src/theme/theme.scss`

**Edit — line 15:**

Old: `@use 'mixins';`
New: `@forward 'mixins';`

Rationale: makes `@use '@cobranza-apps/ui/theme' as cba; @include cba.cba-elevated-surface;` (documented in `docs/THEME.md:261-267`) actually resolve. All other `@use 'base' … 'utilities'` lines unchanged (those partials emit CSS and must stay `@use`).

### 1.3 `src/theme/_variables.scss` — new tokens + reserved-token comments (commit C2)

**File:** `src/theme/_variables.scss`

**Edit A — Layout group (after line 99 `--cba-module-header-min-height: 40px;`):**

Insert:
```scss
  --cba-module-footer-height: 40px;
  --cba-dropdown-min-width: 12rem;
```

**Edit B — Typography group (after line 126 `--cba-font-size-caption: 0.75rem;`):**

Insert (after the font-size block, before the `--cba-line-height-*` block, or grouped visually — implementer may place it in the Typography scale block):
```scss
  /* Iconography — distinct from typography scale; used for decorative icon sizing. */
  --cba-icon-size-md: 1.75rem;
```

**Edit C — `--cba-selected-border` (line 82) — reserved comment:**

Old line 82: `  --cba-selected-border: var(--cba-accent-primary);`
New (add an inline trailing comment on the line above the declaration OR a block comment above the `--cba-selected-*` group at line 81-84). Recommended: extend the existing comment block at lines 77-80 by appending one bullet:

```scss
   /* Reserved tokens: --cba-selected-border is available for consumers that wish to
      draw an explicit border on selected items; library components currently use only
      --cba-selected-bg / --cba-selected-text / --cba-selected-hover. */
```

No value change. The line `--cba-selected-border: var(--cba-accent-primary);` stays literally identical.

**Edit D — `--cba-state-valid-text` (line 92) — reserved comment:**

Above the Form-states comment block (lines 86-88) append:

```scss
   /* Reserved token: --cba-state-valid-text is available for consumers / future
      components that want a green-tinted valid-state text colour. The current
      CbaFieldComponent valid state styles only the control border
      (--cba-state-valid-border); the text colour stays --cba-text-primary. */
```

No value change.

### 1.4 `src/components/testing/theme-fixtures.ts` — register the 3 new tokens (commit C2)

**File:** `src/components/testing/theme-fixtures.ts`

**Edit A — Layout block (after line 26 `--cba-module-header-min-height: '40px',`):**

Insert:
```ts
  '--cba-module-footer-height': '40px',
  '--cba-dropdown-min-width': '12rem',
```

**Edit B — Typography block (after line 57 `--cba-font-size-caption: '0.75rem',`):**

Insert:
```ts
  '--cba-icon-size-md': '1.75rem',
```

> Order is not enforced by `tokens.spec.ts` (uses `Set` equality), so placement is free; grouping by semantic area keeps the fixture human-readable.

### 1.5 Regenerate `docs/theme-preview.css` (commit C2)

**Console command (single cmd):**
```
npm run build:preview
```

This recompiles `src/theme/theme.scss` → `docs/theme-preview.css` (compressed, no source map) so `:root` includes the three new tokens. Commit the regenerated `docs/theme-preview.css` together with the `_variables.scss` + `theme-fixtures.ts` edits.

**Verify:** run `npm test -- src/theme/tokens.spec.ts` and `npm test -- src/theme/preview-html.spec.ts` — both green.

### 1.6 `docs/USAGE.md` — remove theme.css fallback (commit C3)

**File:** `docs/USAGE.md`

**Edit — lines 139-146 (CSS-only fallback + note):**

Old:
```markdown
**CSS variables only (if not using SCSS):**

​```css
/* global-styles.css */
@import '@cobranza-apps/ui/theme.css';
​```

> **Note:** Exact import paths are tentative until the library build is finalized. The canonical form is `@cobranza-apps/ui/theme`.
```

New (replace the entire block with a Sass-only clarification):
```markdown
> **Note:** The theme is shipped as Sass only — no compiled `theme.css` artifact is published. Import via `@use '@cobranza-apps/ui/theme';`. Custom CSS properties (`--cba-*`) and opt-in `.cba-*` utility classes emit on `:root` after the `@use`.
```

### 1.7 `docs/THEME.md` — remove theme.css fallback (commit C3)

**File:** `docs/THEME.md`

**Edit — lines 43-54 (CSS-only fallback + notes block):**

Old:
```markdown
**CSS-only fallback (no SCSS toolchain):**

​```css
/* global-styles.css */
@import '@cobranza-apps/ui/theme.css';
​```

Notes:

- `bootstrap` is a CSS-only peer dependency (`bootstrap@^5`). Never require jQuery.
- CSS variables are global once the theme is loaded (`:root`); utility classes remain opt-in (apply only where added).
- Exact import paths are tentative until the library build is finalized; the canonical form is `@cobranza-apps/ui/theme`.
```

New:
```markdown
Notes:

- The theme is Sass-only — no compiled `theme.css` artifact is published. Load via `@use '@cobranza-apps/ui/theme';` (or `@use '@cobranza-apps/ui/theme' as cba;` when also using mixins — mixins are forwarded by `theme.scss`).
- `bootstrap` is a CSS-only peer dependency (`bootstrap@^5`). Never require jQuery.
- CSS variables are global once the theme is loaded (`:root`); utility classes remain opt-in (apply only where added).
```

### 1.8 Verify Task 1 acceptance

- `npm run build` → `dist/package.json` `version` is `0.15.0`; `dist/theme/theme.scss` exists; `dist/theme/_mixins.scss`, `_variables.scss`, `_utilities.scss` exist (consumers can `@use`).
- `npm test -- src/theme/tokens.spec.ts` green.
- `npm test -- src/theme/preview-html.spec.ts` green (preview CSS regenerated).
- Manual grep: `rg "theme\.css" docs/USAGE.md docs/THEME.md` returns nothing.
- Manual grep: `rg "@use 'mixins'" src/theme/theme.scss` returns nothing; `rg "@forward 'mixins'" src/theme/theme.scss` returns one match.

---

## 2. Task 2 — Component SCSS Token Non-Compliance (commit C4)

All edits below are SCSS-only. No HTML/TS changes.

### 2.1 Atomic edits

#### 2.1.1 `src/components/modal/cba-modal.component.scss` — line 25

**Old (line 25):** `  font-size: var(--cba-space-5);`
**New:** `  font-size: var(--cba-font-size-display);`

(`--cba-space-5` = 20px spacing token misused as font-size. `--cba-font-size-display` = 1.25rem = 20px @ 16px root — visual-equivalent, correct token family.)

#### 2.1.2 `src/components/button/cba-button.component.scss`

**Edit A — line 15 (line-height):**
Old: `  line-height: 1.5;`
New: `  line-height: var(--cba-line-height-body);`

**Edit B — line 46 (`--sm` font-size):**
Old: `  font-size: 0.8125rem;`
New: `  font-size: var(--cba-font-size-small);`

**Edit C — line 51 (`--md` font-size):**
Old: `  font-size: 0.875rem;`
New: `  font-size: var(--cba-font-size-body);`

#### 2.1.3 `src/components/dropdown/cba-dropdown.component.scss`

**Edit A — line 16 (min-width):**
Old: `  min-width: 12rem;`
New: `  min-width: var(--cba-dropdown-min-width);`

**Edit B — line 27 (font-size):**
Old: `    font-size: 0.875rem;`
New: `    font-size: var(--cba-font-size-body);`

**Edit C — line 28 (line-height):**
Old: `    line-height: 1.5;`
New: `    line-height: var(--cba-line-height-body);`

#### 2.1.4 `src/components/module-footer/module-footer.component.scss` — lines 20-21

**Old:**
```
  font-size: 14px;
  line-height: 1.5;
```
**New:**
```
  font-size: var(--cba-font-size-body);
  line-height: var(--cba-line-height-body);
```

(`--cba-font-size-body` = 0.875rem = 14px @ 16px root — visual-equivalent.)

#### 2.1.5 `src/components/empty-state/cba-empty-state.component.scss`

**Edit A — line 21 (`__icon` font-size):**
Old: `  font-size: 1.75rem;`
New: `  font-size: var(--cba-icon-size-md);`

**Edit B — lines 32-34 (`__title`):**
Old:
```
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
```
New:
```
  font-size: var(--cba-font-size-heading-md);
  font-weight: 500;
  line-height: var(--cba-line-height-body);
```
(`--cba-font-size-heading-md` = 1rem ✓; `--cba-line-height-body` = 1.5 ✓.)

Note: the `__title` styling does not use the matching `--cba-line-height-heading-md` (1.25); the existing value `1.5` was authoring intent, so the equivalent body line-height token is used to preserve visuals. (Implementer may instead choose `--cba-line-height-heading-md` if the design tokens rule-of-thumb demands pairing — but that would shrink line-height from 1.5 → 1.25, a visual change. Stick with `--cba-line-height-body` to preserve behaviour.)

**Edit C — lines 40-41 (`__description`):**
Old:
```
  font-size: 0.875rem;
  line-height: 1.5;
```
New:
```
  font-size: var(--cba-font-size-body);
  line-height: var(--cba-line-height-body);
```

#### 2.1.6 `src/components/badge/cba-badge.component.scss` — line 67

**Old:** `  font-size: 0.75rem;`
**New:** `  font-size: var(--cba-font-size-caption);`

> Note: line 69 keeps `line-height: 1;` — that is a deliberate badge-specific value (no token exists for "tight" line-height; `--cba-line-height-caption` is 1.333, too loose). Leave `1` untouched (it is a structural value, not a typography-scale concern).

### 2.2 Verify Task 2 acceptance

- `npm run lint` green.
- `npm test` green (no component spec Depend on the replaced values — only DOM class/structure assertions; values are visual-equivalent).
- Manual grep in `src/components/**/*.scss`:
  - `rg "font-size:\s*0\.[0-9]+rem" src/components` — only matches inside `__icon .fa-*` em-relative rules (allowed).
  - `rg "font-size:\s*[0-9]+px" src/components` — none.
  - `rg "line-height:\s*1\.5" src/components` — none (all replaced).
  - `rg "min-width:\s*12rem" src/components` — none.

---

## 3. Task 3 — Component Architecture & Doc Naming

### 3.1 Rename `ModuleFooterComponent` → `CbaModuleFooterComponent` (commit C5)

#### 3.1.1 `src/components/module-footer/module-footer.component.ts`

**Edit A — host block (lines 65-72):** Add a `host` field. The component decorator currently ends at `styleUrl: './module-footer.component.scss',` followed by `})`. Insert the `host` block between `styleUrl` and the closing `}`:

Old:
```ts
  templateUrl: './module-footer.component.html',
  styleUrl: './module-footer.component.scss',
})
export class ModuleFooterComponent {
```
New:
```ts
  templateUrl: './module-footer.component.html',
  styleUrl: './module-footer.component.scss',
  host: {
    class: 'cba-module-footer',
  },
})
export class CbaModuleFooterComponent {
```

**Edit B — JSDoc references (lines 26, 40, 63):** The JSDoc refers to `ModuleHeaderComponent` (different component — leave those literal mentions intact, they describe the header, not the footer). No JSDoc edit needed for those.

The class rename at line 73 is the only required symbol change.

#### 3.1.2 `src/components/module-footer/module-footer.component.spec.ts`

Replace every occurrence of `ModuleFooterComponent` → `CbaModuleFooterComponent`:

- Line 3: import statement
- Line 23: `imports: [ModuleFooterComponent]` (inside the `@Component` of `FooterHost`)
- Line 31: `describe('ModuleFooterComponent', …)`
- Line 32: `let fixture: ComponentFixture<ModuleFooterComponent>;`
- Line 36: `imports: [ModuleFooterComponent]` (TestBed config)
- Line 40: `function render(): ComponentFixture<ModuleFooterComponent> {`
- Line 41: `TestBed.createComponent(ModuleFooterComponent);`

No selector/HTML change (`<cba-module-footer …>` at line 24 unchanged).

#### 3.1.3 `src/components/module-footer/index.ts`

**Edit — line 10:**
Old: `export { ModuleFooterComponent } from './module-footer.component';`
New: `export { CbaModuleFooterComponent } from './module-footer.component';`

Update the JSDoc header (lines 1-9) wording "Barrel file for ModuleFooter." → "Barrel file for CbaModuleFooter." (cosmetic; recommended for self-documenting-code rule).

#### 3.1.4 `docs/CBA_MODULE_FOOTER.md` — line 34

**Old:** `import { ModuleFooterComponent } from '@cobranza-apps/ui';`
**New:** `import { CbaModuleFooterComponent } from '@cobranza-apps/ui';`

Doc title (line 1 `# CbaModuleFooter`) and prose already use the prefixed noun — leave alone.

#### 3.1.5 `README.md` — line 168

**Old:** `| \`ModuleFooterComponent\` | Optional plain footer bar for a module; status text aligned with \`ModuleHeaderStatus\` plus a default projection slot. |`
**New:** `| \`CbaModuleFooterComponent\` | Optional plain footer bar for a module; status text aligned with \`ModuleHeaderStatus\` plus a default projection slot. |`

### 3.2 `ModuleHeaderComponent` host block + SCSS `--fullscreen` retarget (commit C6)

#### 3.2.1 `src/components/module-header/module-header.component.ts` — lines 109-117

**Old (lines 109-117):**
```ts
@Component({
  selector: 'cba-module-header',
  standalone: true,
  imports: [FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './module-header.component.html',
  styleUrl: './module-header.component.scss',
  host: {},
})
```
**New:**
```ts
@Component({
  selector: 'cba-module-header',
  standalone: true,
  imports: [FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './module-header.component.html',
  styleUrl: './module-header.component.scss',
  host: {
    class: 'cba-module-header',
    '[class.cba-module-header--fullscreen]': 'isFullscreen()',
  },
})
```

#### 3.2.2 `src/components/module-header/module-header.component.html` — line 1

Remove the dynamic `--fullscreen` binding from the inner `<header>`; keep the static `class="cba-module-header"` so existing `.cba-module-header { … }` SCSS rules still match the inner element.

**Old (line 1, opening tag):**
```html
<header class="cba-module-header" [class.cba-module-header--fullscreen]="isFullscreen()"> @if (isFullscreen()) { …
```
**New (line 1, opening tag):**
```html
<header class="cba-module-header"> @if (isFullscreen()) { …
```

(Only the `[class.cba-module-header--fullscreen]="isFullscreen()"` attribute is deleted. The rest of the template is unchanged — implementer must take care to preserve the rest of the long single-line template exactly.)

#### 3.2.3 `src/components/module-header/module-header.component.scss` — lines 87, 93

**Edit A — line 87:**
Old:
```scss
.cba-module-header--fullscreen {
  background-color: transparent;
  border-bottom: none;
  justify-content: center;
}
```
New:
```scss
:host(.cba-module-header--fullscreen) .cba-module-header {
  background-color: transparent;
  border-bottom: none;
  justify-content: center;
}
```
> Selector rationale: the modifier now lives on the host; the inner `.cba-module-header` element is the visible surface so the visual overrides still target it via descendant combinator. Equivalent visual result.

**Edit B — line 93:**
Old:
```scss
.cba-module-header--fullscreen .cba-module-header__section--title {
  flex: 0 1 auto;
}
```
New:
```scss
:host(.cba-module-header--fullscreen) .cba-module-header__section--title {
  flex: 0 1 auto;
}
```

#### 3.2.4 Verify header tests

Run `npm test -- src/components/module-header`. Specs at `module-header.component.spec.ts:85-98` (fullscreen hides nav + status icon) and `:146-154` (drag handle hidden in fullscreen) assert DOM structure only — they pass under the host-class refactor (the `@if (isFullscreen())` template branch continues to render only the title; `nav` and `fa-icon` are absent, the host modifier is now applied but not asserted by the specs).

> If `npm test` shows any regression in the header specs, fallback is to KEEP the inner `[class.cba-module-header--fullscreen]` binding AND add the host binding (both apply). The plan prefers host-only to remove the duplication; but correctness beats minimalism.

### 3.3 Doc file renames (commit C7)

#### 3.3.1 Rename files

Use `git mv` so history is preserved:

```
git mv docs/MODULE_HEADER.md docs/CBA_MODULE_HEADER.md
git mv docs/MODULE_CONTAINER.md docs/CBA_MODULE_CONTAINER.md
```

(File system rename via `git mv` only — no shell redirection.)

#### 3.3.2 Update `docs/INDEX.md` — lines 21-22

**Old:**
```markdown
- [MODULE_HEADER.md](./MODULE_HEADER.md)
- [MODULE_CONTAINER.md](./MODULE_CONTAINER.md)
```
**New:**
```markdown
- [CBA_MODULE_HEADER.md](./CBA_MODULE_HEADER.md)
- [CBA_MODULE_CONTAINER.md](./CBA_MODULE_CONTAINER.md)
```

#### 3.3.3 Update `README.md` — lines 231-232

**Old:**
```markdown
- [`./docs/MODULE_HEADER.md`](./docs/MODULE_HEADER.md) — `ModuleHeader` selector, API, status values, fullscreen & drag notes.
- [`./docs/MODULE_CONTAINER.md`](./docs/MODULE_CONTAINER.md) — `ModuleContainer` selector, API, size/collapse/fullscreen/padding behaviour, scroll & chrome notes.
```
**New:**
```markdown
- [`./docs/CBA_MODULE_HEADER.md`](./docs/CBA_MODULE_HEADER.md) — `ModuleHeader` selector, API, status values, fullscreen & drag notes.
- [`./docs/CBA_MODULE_CONTAINER.md`](./docs/CBA_MODULE_CONTAINER.md) — `ModuleContainer` selector, API, size/collapse/fullscreen/padding behaviour, scroll & chrome notes.
```

#### 3.3.4 Update `docs/CBA_MODULE_FOOTER.md` related-docs — lines 149-150

**Old:**
```markdown
- [`MODULE_HEADER.md`](./MODULE_HEADER.md) — `ModuleHeader` selector, API, status values.
- [`MODULE_CONTAINER.md`](./MODULE_CONTAINER.md) — `ModuleContainer` layout wrapper.
```
**New:**
```markdown
- [`CBA_MODULE_HEADER.md`](./CBA_MODULE_HEADER.md) — `ModuleHeader` selector, API, status values.
- [`CBA_MODULE_CONTAINER.md`](./CBA_MODULE_CONTAINER.md) — `ModuleContainer` layout wrapper.
```

#### 3.3.5 Update JSDoc `@see` paths in component sources

**`src/components/module-header/module-header.component.ts:107`:**
Old: ` * @see [MODULE_HEADER.md](/docs/MODULE_HEADER.md) — full API, status values, fullscreen & drag notes.`
New: ` * @see [CBA_MODULE_HEADER.md](/docs/CBA_MODULE_HEADER.md) — full API, status values, fullscreen & drag notes.`

**`src/components/module-container/module-container.component.ts:64`:**
Old: ` * @see [MODULE_CONTAINER.md](/docs/MODULE_CONTAINER.md) — full API docs.`
New: ` * @see [CBA_MODULE_CONTAINER.md](/docs/CBA_MODULE_CONTAINER.md) — full API docs.`

#### 3.3.6 Update doc-internal cross-refs inside renamed files

**`docs/CBA_MODULE_CONTAINER.md` (line 164):** Links to `MODULE_HEADER.md` — update to `CBA_MODULE_HEADER.md`.

Run `rg "MODULE_HEADER\.md|MODULE_CONTAINER\.md" docs src README.md` after the renames — expected matches: only inside the renamed file body's cross-link (the single `CBA_MODULE_HEADER.md` link inside `CBA_MODULE_CONTAINER.md`), the JSDoc `@see` lines (now updated to `CBA_*`), and historical `.kilo/plans/*` (out of scope — those are immutable historical plan records).

> The `markdown-generation-rule.md` allows Plan Agent to modify markdown; the implementer is delegated under critical-workflow 4.2 and may apply these doc edits. Do NOT edit `.kilo/plans/*` historical files.

### 3.4 Verify Task 3 acceptance

- `npm test -- src/components/module-footer` green.
- `npm test -- src/components/module-header` green.
- `npm run build` green (compiles the renamed `CbaModuleFooterComponent`).
- `rg "ModuleFooterComponent" src docs README.md` returns nothing.
- `rg "MODULE_HEADER\.md|MODULE_CONTAINER\.md" docs src README.md docs/INDEX.md` returns nothing (historical `.kilo/plans/*` excluded from the scan).

---

## 4. Task 4 — Documentation Stale Values & Inaccuracies (commit C8)

### 4.1 `docs/USAGE.md` — replace 6 stale hex values

All values sourced from `src/theme/_variables.scss` (authoritative). The stale→corrected mapping:

| Line | Stale | Corrected |
|------|-------|-----------|
| 663 | `#C5BFAE` (canvas) | `#BCB5A4` |
| 671 | `#C5BFAE` (`--cba-bg-primary` row) | `#BCB5A4` |
| 686 | `#C5BFAE` (muted-restriction note) | `#BCB5A4` |
| 692 | `#DAD7CA` (`--cba-border-subtle`) | `#E8E5DB` |
| 693 | `#A7A6A2` (`--cba-border-default`) | `#A29D94` |
| 694 | `#8E8D8A` (`--cba-border-strong`) | `#6B665E` |

(The `#D8C3A5` (inset/background-tertiary) entries at lines 663,673,686 are CORRECT — leave alone.)

Use `replaceAll` for the `#C5BFAE` → `#BCB5A4` substitution since it occurs 3× in identical form; for the border tokens apply targeted replace (one occurrence each) using the table-row context as the unique-key.

### 4.2 `docs/CBA_TYPEAHEAD.md` — line 209

**Old:**
```
- Input surface: same as `CbaInput` — `--cba-bg-primary`, `--cba-border-subtle`,
```
**New:**
```
- Input surface: same as `CbaInput` — `--cba-bg-secondary`, `--cba-border-subtle`,
```

### 4.3 `docs/CBA_MODULE_FOOTER.md` — line 117

Per decision §0.2 #17: keep the `--cba-module-footer-height` reference (Task 1 defines it now) but drop the fallback.

**Old:** `- Height: \`var(--cba-module-footer-height, 40px)\``
**New:** `- Height: \`var(--cba-module-footer-height)\` (40px)`

### 4.4 `docs/CBA_FORM_FIELD.md` — lines 132-138 (ASCII tree comment)

**Old (line 133):**
```
  +- CbaFieldControlValueAccessor<T>    <- abstract; adds label/hint/error/disabled inputs,
```
**New:**
```
  +- CbaFieldControlValueAccessor<T>    <- abstract; adds label/hint/error/disabled/readonly/valid inputs,
```

### 4.5 `docs/CBA_INPUT.md` — line 177; `docs/CBA_SELECT.md` — line 176; `docs/CBA_DATEPICKER.md` — line 224

Add `--invalid` to the host-classes list (each component binds both `--error` and `--invalid` to `error()` per `cba-input.component.ts:47-48`; the same pattern is in select/datepicker).

**`CBA_INPUT.md:177`:**
Old: `Host classes: \`cba-input\`, \`cba-input--disabled\`, \`cba-input--readonly\`, \`cba-input--error\`, \`cba-input--valid\`.`
New: `Host classes: \`cba-input\`, \`cba-input--disabled\`, \`cba-input--readonly\`, \`cba-input--error\`, \`cba-input--invalid\`, \`cba-input--valid\`.`

**`CBA_SELECT.md:176`:**
Old: `Host classes: \`cba-select\`, \`cba-select--disabled\`, \`cba-select--readonly\`, \`cba-select--error\`, \`cba-select--valid\`.`
New: `Host classes: \`cba-select\`, \`cba-select--disabled\`, \`cba-select--readonly\`, \`cba-select--error\`, \`cba-select--invalid\`, \`cba-select--valid\`.`

**`CBA_DATEPICKER.md:224`:**
Old: `Host classes: \`cba-datepicker\`, \`cba-datepicker--disabled\`, \`cba-datepicker--readonly\`, \`cba-datepicker--error\`, \`cba-datepicker--valid\`.`
New: `Host classes: \`cba-datepicker\`, \`cba-datepicker--disabled\`, \`cba-datepicker--readonly\`, \`cba-datepicker--error\`, \`cba-datepicker--invalid\`, \`cba-datepicker--valid\`.`

### 4.6 `docs/CBA_EMPTY_STATE.md` — line 110

Reformulate to attribute `aria-hidden` to the consumer (verified: the example at line 67 has the consumer write `aria-hidden="true"` on the projected `<fa-icon>`). The component itself does NOT add `aria-hidden`.

**Old:** `- Icon has \`aria-hidden="true"\` — it is decorative; meaning is conveyed by the title.`
**New:** `- Consumer must add \`aria-hidden="true"\` on the projected icon element — it is decorative; meaning is conveyed by the title. (See the usage example above.)`

### 4.7 `docs/CBA_BUTTON.md` — ToC lines 5-19

Add the missing anchor entries for `Non-goals` (line 152) and `Related docs` (line 157).

**Old (lines 14-18 of ToC, ending the list):**
```markdown
- [State overlays (hover / active)](#state-overlays-hover--active)
- [Loading & disabled behaviour](#loading--disabled-behaviour)
- [Accessibility](#accessibility)
- [Related docs](#related-docs)
```
**New (append after "Accessibility"):**
```markdown
- [State overlays (hover / active)](#state-overlays-hover--active)
- [Loading & disabled behaviour](#loading--disabled-behaviour)
- [Accessibility](#accessibility)
- [Non-goals](#non-goals)
- [Related docs](#related-docs)
```

> Confirm via grep that the ToC currently does NOT end at `Related docs` (it does end at `Accessibility` per the lines 5-19 already inspected). The `Related docs` line must be ADDED too if it's missing — verified yes, it is missing; add both.

### 4.8 Verify Task 4 acceptance

- `rg "#C5BFAE|#DAD7CA|#A7A6A2|#8E8D8A" docs` returns nothing.
- `rg "theme\.css" docs/USAGE.md docs/THEME.md` returns nothing (already done at §1.6/§1.7 — re-check after Task 4).
- `npm test` green (no spec locks the doc strings above; `npm test -- src/theme/docs-compliance.spec.ts` only checks CHANGELOG compliance).

---

## 5. `docs/CONSUMER_GUIDE.md` — rename cross-refs (commit C9)

**File:** `docs/CONSUMER_GUIDE.md`

Two references to `MODULE_HEADER.md` must move to the renamed file:

**Line 353:**
Old: `- Full example: see [\`MODULE_HEADER.md\` §Drag handle slot](./MODULE_HEADER.md#drag-handle-slot).`
New: `- Full example: see [\`CBA_MODULE_HEADER.md\` §Drag handle slot](./CBA_MODULE_HEADER.md#drag-handle-slot).`

**Line 377:**
Old: `- Asking \`@cobranza-apps/ui\` to implement drag-and-drop or to depend on \`@angular/cdk\`. The Library exposes the \`[cbaModuleDragHandle]\` projection slot; the Shell owns DnD. See [\`MODULE_HEADER.md\` §Drag handle slot](./MODULE_HEADER.md#drag-handle-slot).`
New: `- Asking \`@cobranza-apps/ui\` to implement drag-and-drop or to depend on \`@angular/cdk\`. The Library exposes the \`[cbaModuleDragHandle]\` projection slot; the Shell owns DnD. See [\`CBA_MODULE_HEADER.md\` §Drag handle slot](./CBA_MODULE_HEADER.md#drag-handle-slot).`

No other CONSUMER_GUIDE edits needed for Task A (the guide already documents the Sass-only theme load, the surface ownership map, the §Button Color Guide — these don't mention `theme.css` or `ModuleFooterComponent`).

> Verify `npm test -- src/theme/consumer-guide.spec.ts` still green (it asserts mandated sections, not the renamed link paths).

---

## 6. `CHANGELOG.md` — append a single block under the 0.15.0 header (commit C10)

**File:** `CHANGELOG.md`

The header `## [0.15.0] — 2026-08-12` already exists at line 33 (verified; audit-date header created during Step 3 of critical workflow). Per `.kilo/rules/changelog-versioning.md`:

- NO new `[Unreleased]` section.
- NO new dated header.
- Append a categorized block directly beneath line 35 (the existing single-line description) and before the next release header `## [0.14.0] — 2026-08-11` at line 37.

**Insert after line 35:**
```markdown
### Added
- New layout/typography tokens: `--cba-module-footer-height` (40px), `--cba-icon-size-md` (1.75rem), `--cba-dropdown-min-width` (12rem). Registered in `src/components/testing/theme-fixtures.ts`; `docs/theme-preview.css` regenerated. See `docs/THEME.md` and `src/theme/_variables.scss`.
- `package.json` `exports["./theme"]` now resolves under `sass`, `style`, and `default` conditions (previously `sass`-only).
- `src/theme/theme.scss` now `@forward`s `_mixins.scss` so `@use '@cobranza-apps/ui/theme' as cba; @include cba.cba-elevated-surface;` works as documented in `docs/THEME.md`.

### Changed
- `package.json` `sideEffects` changed from `false` to `["**/*.scss"]` so SCSS is not tree-shaken away from consumers' bundles.
- **BREAKING:** `ModuleFooterComponent` renamed to `CbaModuleFooterComponent` (class, barrel export, spec describe block, README inventory, `CBA_MODULE_FOOTER.md` import). The `<cba-module-footer>` selector and `.cba-module-footer` CSS class are unchanged — consumer templates need no edit; only TS imports of the class symbol require updating.
- `ModuleHeaderComponent` gains `host: { class: 'cba-module-header', '[class.cba-module-header--fullscreen]': 'isFullscreen()' }`; the inner `<header>` no longer carries the `--fullscreen` modifier. SCSS `--fullscreen` rules now use `:host(.cba-module-header--fullscreen)`. Visual behaviour unchanged.
- `CbaModuleFooterComponent` gains `host: { class: 'cba-module-footer' }` (was host-less).
- Component SCSS now uses `--cba-*` tokens in place of hard-coded sizes: `CbaModalComponent` title (was `--cba-space-5` → `--cba-font-size-display`), `CbaButtonComponent` sm/md line-height & font-size, `CbaDropdownComponent` menu min-width + item typography, `ModuleFooterComponent` status typography, `CbaEmptyStateComponent` icon/title/description typography (adds `--cba-icon-size-md`), `CbaBadgeComponent` caption font-size.
- Doc file renames: `MODULE_HEADER.md` → `CBA_MODULE_HEADER.md`, `MODULE_CONTAINER.md` → `CBA_MODULE_CONTAINER.md`. Cross-refs updated in `docs/INDEX.md`, `README.md`, `docs/CBA_MODULE_FOOTER.md`, `docs/CONSUMER_GUIDE.md`, and the `@see` JSDoc of `ModuleHeaderComponent` / `ModuleContainerComponent`.

### Fixed
- `docs/USAGE.md` no longer documents a non-existent `@import '@cobranza-apps/ui/theme.css';` fallback (Sass-only import is the only supported path); same removal in `docs/THEME.md`.
- 6 stale hex values in `docs/USAGE.md` (borders and canvas) corrected against `src/theme/_variables.scss`: `--cba-bg-primary` `#C5BFAE` → `#BCB5A4`, `--cba-border-subtle` `#DAD7CA` → `#E8E5DB`, `--cba-border-default` `#A7A6A2` → `#A29D94`, `--cba-border-strong` `#8E8D8A` → `#6B665E`.
- `docs/CBA_TYPEAHEAD.md` correctly reports the input surface token as `--cba-bg-secondary` (was `--cba-bg-primary`).
- `docs/CBA_MODULE_FOOTER.md` height token reference kept and simplified after `--cba-module-footer-height` was added to `_variables.scss`.
- `docs/CBA_FORM_FIELD.md` ASCII tree now lists `readonly` and `valid` inputs.
- `docs/CBA_INPUT.md`, `docs/CBA_SELECT.md`, `docs/CBA_DATEPICKER.md` host-class lists now include `--invalid` (each component binds both `--error` and `--invalid` to `error()`).
- `docs/CBA_EMPTY_STATE.md` clarifies that the consumer must add `aria-hidden="true"` on the projected icon (component does not add it).
- `docs/CBA_BUTTON.md` Table of Contents now lists `Non-goals` and `Related docs`.
```

> Length note: this is a CHANGELOG file (rule `max-lines-per-file.md` excludes config/docs files; no line-count limit). Keep entries dated under the existing header; do NOT back-fill historical entries (per `changelog-versioning.md`: "Historical entries predating this rule are NOT retroactively edited").

---

## 7. Final verification (run after C10, before Step 4.3)

Sequential single commands (no chaining):

1. `npm run build` — green; verify `dist/package.json` `version` = `0.15.0`, `dist/theme/theme.scss` + partials present.
2. `npm run build:preview` — green; `docs/theme-preview.css` re-emits `:root` (already done at C2 — re-run as a sanity check; committing regenerate only required after token edits).
3. `npm test` — all suites green:
   - `src/theme/tokens.spec.ts` (token set equality after 3 additions)
   - `src/theme/preview-html.spec.ts` (preview CSS `:root` matches every `EXPECTED_TOKENS`)
   - `src/theme/docs-compliance.spec.ts` (CHANGELOG has dated 0.15.0 header, no `[Unreleased]`)
   - `src/theme/consumer-guide.spec.ts` (mandated sections still present)
   - `src/components/module-footer/*.spec.ts` (renamed class still resolves)
   - `src/components/module-header/*.spec.ts` (fullscreen behaviour preserved)
4. `npm run lint` — green.
5. Manual grep gates:
   - `rg "theme\.css" docs/USAGE.md docs/THEME.md docs/CONSUMER_GUIDE.md` — no matches.
   - `rg "ModuleFooterComponent" src docs README.md` — no matches.
   - `rg "MODULE_HEADER\.md|MODULE_CONTAINER\.md" docs README.md src` — no matches (historical `.kilo/plans/*` outside this scan).
   - `rg "font-size:\s*(14px|0\.8[0-9]+rem|1\.[0-9]+rem)" src/components` — only `__icon .fa-*` em-relative icon rules remain.
   - `rg "line-height:\s*1\.5" src/components` — no matches.
   - `rg "#C5BFAE|#DAD7CA|#A7A6A2|#8E8D8A" docs` — no matches.
   - `rg "@use 'mixins'" src/theme/theme.scss` — no matches; `rg "@forward 'mixins'" src/theme/theme.scss` — one match.

On any failure: revert the last logical commit (`git revert HEAD` or `git reset --hard HEAD~1`) and escalate to the caller with the failing command + stderr excerpt.

---

## 8. Out-of-Scope / Noted Gaps (escalate in closeout summary)

1. **`ModuleHeaderComponent` & `ModuleContainerComponent` not renamed to `Cba*`.** The global plan Task 3 only explicitly renames `ModuleFooterComponent`. After Task A, the lib will have 1 (footer) prefixed component and 2 (header, container) unprefixed — an asymmetry flagged in the global plan issue list but not actionable in Task 3's implementation steps. Documented for the caller; do NOT extend scope.
2. **`--cba-selected-border` & `--cba-state-valid-text` left as reserved comments, not wired.** Aligns with rule "preserve existing code" and the global plan's "or add a comment" option. A follow-up TODO could wire them if design needs the green selected border / valid text colour.
3. **`README.md` documentation-list inventory** — after the doc renames, `CBA_MODULE_FOOTER.md` bullet at `README.md:246` is unchanged (already in `CBA_*` form). No edit needed.
4. **Project-info files (brief.md §8, context.md)** — out of Task A scope; covered by Task 7 in the global plan.
5. **`docs/theme-preview.html` captions** — out of Task A scope; covered by Tasks 5–6.

---

## 9. Plan closure check (against the global plan Tasks 1–4)

| Global-plan bullet | Addressed at |
|--------------------|--------------|
| T1: exports default/style conditions | §1.1 Edit A |
| T1: USAGE.md & THEME.md theme.css removal | §1.6, §1.7 |
| T1: `--cba-module-footer-height` undefined | §1.3 Edit A |
| T1: dist/package.json stale version | §1.1 verify (regenerated by `npm run build`, source already 0.15.0) |
| T1: `"sideEffects": false` risky | §1.1 Edit B |
| T1: dead `--cba-selected-border`, `--cba-state-valid-text` | §1.3 Edit C-D (reserved-comment decision §0.2 #1) |
| T1: ng-package.json assets glob | §0.2 #8 (decision to keep) |
| T1: theme.scss `@use 'mixins'` no-op | §1.2 (`@forward 'mixins'`) |
| T1: rebuild + verify | §1.8 |
| T1: CHANGELOG entry | §6 |
| T1: CONSUMER_GUIDE theme-load update | §0.2 #18 (no change needed; already sass-only) |
| T2: modal font-size spacing misuse | §2.1.1 |
| T2: button sm/md font-size + line-height hard-coded | §2.1.2 |
| T2: dropdown font-size/line-height + min-width | §2.1.3 |
| T2: module-footer status typography | §2.1.4 |
| T2: empty-state icon/title/desc hard-coded rem | §2.1.5 (+ `--cba-icon-size-md` token) |
| T2: badge caption font-size | §2.1.6 |
| T2: `npm run lint` + spot-check | §2.2 |
| T2: CHANGELOG entry (icon-size-md) | §6 |
| T2: CONSUMER_GUIDE §Button/§Form (if tokens changed) | §0.2 #18 (no consumer-facing token mapping changed; valid-text not wired) |
| T3: rename `ModuleFooterComponent` | §3.1 |
| T3: header host block + SCSS retarget | §3.2 |
| T3: footer host block | §3.1.1 Edit A |
| T3: rename doc files | §3.3.1 |
| T3: INDEX.md cross-refs | §3.3.2 |
| T3: public-api.ts barrel | unchanged (`export *` — no edit needed) |
| T3: run specs | §3.4 |
| T3: CHANGELOG entry | §6 |
| T3: CONSUMER_GUIDE + INDEX reflect rename | §3.3.2 (INDEX), §5 (CONSUMER_GUIDE) |
| T4: 6 stale hex in USAGE.md | §4.1 |
| T4: CBA_TYPEAHEAD bg-primary → bg-secondary | §4.2 |
| T4: CBA_MODULE_FOOTER non-existent height ref | §4.3 (reconciled with T1) |
| T4: CBA_FORM_FIELD ASCII tree | §4.4 |
| T4: CBA_INPUT/SELECT/DATEPICKER --invalid | §4.5 |
| T4: CBA_EMPTY_STATE aria-hidden | §4.6 |
| T4: CBA_BUTTON ToC Non-goals | §4.7 |
| T4: lint + manual cross-check | §4.8 |
| T4: CHANGELOG entry | §6 |
| T4: CONSUMER_GUIDE update | §5 |

All bullets covered. Plan is internally consistent; no questions to escalate.