# Project Audit & Fixes — Global Plan

**Date:** 2026-08-12
**Trigger:** User requested a comprehensive audit after discovering 2 package/docs discrepancies (`theme.css` non-existent, `exports["./theme"]` only `sass` condition) while investigating why `<cba-button variant="primary">` rendered as a pill in a consuming project.
**Scope:** Package/build config, theme tokens, component SCSS, documentation, and `docs/theme-preview.html` consumer reference.

---

## Global Pre-Analysis

### Root Cause
The library has grown incrementally through multiple sprints (latest `0.14.1`) without a systematic cross-file audit. The reimplemented `docs/theme-preview.html` (v0.14.0) added 31 swatches, a button matrix, form states, and module mockups, but these were built as **demo-only** CSS classes (`.pv-btn`, `.demo-pill`, `.form-field`, etc.) without captions telling consumers which real library API to use. Meanwhile, component SCSS drifted from the token source of truth (`_variables.scss`), and documentation files retained stale hex values from an earlier palette revision. The `package.json` `exports` map and `ng-package.json` config were not updated to reflect the SCSS-only reality.

### Categories of Issues Found

| Category | Count (Critical/High/Medium/Low) |
|----------|-----------------------------------|
| Package / build / exports | 3 / 4 / 6 / 8 |
| Theme tokens (`_variables.scss`) | 0 / 3 / 1 / 2 |
| Component SCSS compliance | 2 / 9 / 3 / 4 |
| Component architecture | 0 / 0 / 4 / 0 |
| Documentation accuracy | 6 / 1 / 4 / 14 |
| `theme-preview.html` (consumer reference) | 8 / 19 / 28 / 13 |

### Technical Decisions
1. **Fix order:** Package/build first (affects every consumer), then tokens, then component SCSS, then docs, then preview HTML. The preview HTML is last because it depends on correct token/component definitions.
2. **Breaking changes:** Renaming `ModuleFooterComponent` → `CbaModuleFooterComponent` and adding `host` blocks to `module-header`/`module-footer` are breaking for consumers. These are acceptable because the library is pre-1.0 and the inconsistency is a bug.
3. **Token additions:** Add `--cba-module-footer-height` and `--cba-icon-size-md` (or similar) rather than removing dead tokens, because the dead tokens (`--cba-selected-border`, `--cba-state-valid-text`) represent intentional design decisions that should be wired into components instead.
4. **Preview strategy:** Every section in `theme-preview.html` will get a `<p class="section-caption">` explaining the reproduction path: either a real `<cba-*>` component, a `.cba-*` utility class, or direct `var(--cba-*)` token usage.
5. **Front-end flag:** All tasks are front-end related (SCSS, HTML, Angular components, docs).
6. **Cross-cutting requirements (per approval conditions):**
   - Every task that changes code, tokens, or public API **must** update `CHANGELOG.md` per `.kilo/rules/changelog-versioning.md` (dated version header, no `[Unreleased]`).
   - `docs/CONSUMER_GUIDE.md` must be updated wherever the task affects consumer-facing behaviour (theme import, component API, preview reproduction paths).
   - A new Task 7 will update `.agent/project-info/` (brief.md §8 integration notes, context.md) to document prevention measures so future updates don't cause the same cross-file drift.
7. **Workflow:** Full read `@AGENTS.md` and follow `/critical-workflow` for all delegated work.

---

## Tasks

### Task 1: Fix Package Exports, Build Pipeline & Theme Tokens
**Priority:** Critical | **Front-end:** Yes

#### Issues addressed
- **[CRITICAL]** `package.json` `exports["./theme"]` only has `"sass"` condition; no `"default"` / `"style"` for non-Sass resolvers.
- **[CRITICAL]** `docs/USAGE.md` and `docs/THEME.md` document `@import '@cobranza-apps/ui/theme.css';` but **no `.css` file is shipped** in `dist/`.
- **[CRITICAL]** `src/components/module-footer/module-footer.component.scss:8` references undefined `--cba-module-footer-height` (falls back to `40px`).
- **[HIGH]** `dist/package.json` version is stale (`0.14.0` vs source `0.14.1`).
- **[HIGH]** `"sideEffects": false` in `package.json` is risky for a CSS-emitting library.
- **[HIGH]** `--cba-selected-border` (line 82) and `--cba-state-valid-text` (line 92) are dead tokens in `_variables.scss`.
- **[MEDIUM]** `ng-package.json` `assets` glob ships all 10 underscored partials + `theme.scss` to consumers.
- **[MEDIUM]** `theme.scss` `@use 'mixins';` is a no-op at top-level (mixins only emit when included).

#### Implementation plan
1. In `package.json`:
   - Add `"default": "./theme/theme.scss"` (and `"style": "./theme/theme.scss"`) to `exports["./theme"]`.
   - Change `"sideEffects": false` → `"sideEffects": ["**/*.scss"]` (or remove the field).
2. In `docs/USAGE.md` and `docs/THEME.md`:
   - Remove the `@import '@cobranza-apps/ui/theme.css';` CSS-only fallback snippet (no artifact exists).
   - Clarify that the theme is Sass-only: `@use '@cobranza-apps/ui/theme';`.
3. In `src/theme/_variables.scss`:
   - Add `--cba-module-footer-height: 40px;` (or derive from `--cba-footer-height: 64px` per design intent).
   - Wire `--cba-selected-border` into a component (e.g., dropdown selected item border) or add a comment explaining it's reserved.
   - Wire `--cba-state-valid-text` into `cba-field.component.scss` valid state or add a comment.
4. In `ng-package.json`:
   - Narrow `assets` glob to `theme.scss` only (or keep all but add README note that entry is `theme.scss`).
5. Rebuild: `npm run build` to regenerate `dist/` with correct `0.14.1` version.
6. Verify: inspect `dist/package.json` version, `dist/theme/` contents, and run `npm pack --dry-run` to confirm exports resolve.
7. Update `CHANGELOG.md` under current dated header: note package export fixes, token additions, and removal of `theme.css` references.
8. Update `docs/CONSUMER_GUIDE.md` §Theme load (once) to remove any CSS-only fallback reference and clarify the Sass-only path.

---

### Task 2: Fix Component SCSS Token Non-Compliance
**Priority:** High | **Front-end:** Yes

#### Issues addressed
- **[CRITICAL]** `src/components/modal/cba-modal.component.scss:25` — `font-size: var(--cba-space-5);` (spacing token misused as font-size).
- **[HIGH]** `src/components/button/cba-button.component.scss:46,51` — hard-coded `0.8125rem` / `0.875rem` (should be `--cba-font-size-small` / `--cba-font-size-body`).
- **[HIGH]** `src/components/button/cba-button.component.scss:15` — `line-height: 1.5` (should be `--cba-line-height-body`).
- **[HIGH]** `src/components/dropdown/cba-dropdown.component.scss:27-28` — hard-coded `font-size: 0.875rem; line-height: 1.5`.
- **[HIGH]** `src/components/module-footer/module-footer.component.scss:20-21` — `font-size: 14px; line-height: 1.5`.
- **[HIGH]** `src/components/empty-state/cba-empty-state.component.scss:21` — `font-size: 1.75rem` (outside token scale).
- **[HIGH]** `src/components/empty-state/cba-empty-state.component.scss:32-41` — more hard-coded rem values.
- **[HIGH]** `src/components/badge/cba-badge.component.scss:67` — `font-size: 0.75rem` (should be `--cba-font-size-caption`).
- **[MEDIUM]** `src/components/dropdown/cba-dropdown.component.scss:16` — `min-width: 12rem` (magic number).

#### Implementation plan
1. Replace each hard-coded `font-size` / `line-height` with the matching `--cba-font-size-*` / `--cba-line-height-*` token.
2. For `empty-state__icon` `1.75rem`, either:
   - Add `--cba-icon-size-md: 1.75rem;` to `_variables.scss` and use it, OR
   - Use `--cba-font-size-display: 1.25rem` and accept the visual change (smaller icon).
   Decision: add `--cba-icon-size-md` to preserve the intended 1.75rem scale.
3. Fix `modal.scss:25` to use `var(--cba-font-size-heading-lg)` (or `display`).
4. Replace `dropdown.scss` `min-width: 12rem` with `var(--cba-space-12)` or a named constant (add `--cba-dropdown-min-width: 12rem` if needed).
5. Verify with `npm run lint` and spot-check compiled CSS.
6. Update `CHANGELOG.md` under current dated header: note token compliance fixes and new `--cba-icon-size-md` token.
7. Update `docs/CONSUMER_GUIDE.md` §Button Color Guide and §Form State Matrix if any token mappings changed (e.g., valid-text token now wired).

---

### Task 3: Fix Component Architecture & Doc Naming
**Priority:** Medium | **Front-end:** Yes

#### Issues addressed
- **[MEDIUM]** `ModuleContainerComponent`, `ModuleHeaderComponent`, `ModuleFooterComponent` lack the `Cba` prefix used by all 14 other components.
- **[MEDIUM]** `module-header.component.ts` has empty `host: {}` block; `module-footer.component.ts` has **no** `host` block at all.
- **[MEDIUM]** Doc file naming inconsistency: `MODULE_CONTAINER.md` / `MODULE_HEADER.md` vs `CBA_MODULE_FOOTER.md` / 14 other `CBA_*.md` files.

#### Implementation plan
1. Rename `ModuleFooterComponent` → `CbaModuleFooterComponent` (class, file names, spec describe blocks, doc `CBA_MODULE_FOOTER.md` references).
2. Add `host: { class: 'cba-module-header' }` to `ModuleHeaderComponent` and update SCSS to target `:host(.cba-module-header--fullscreen)` instead of the inner element.
3. Add `host: { class: 'cba-module-footer' }` to `ModuleFooterComponent` (or `CbaModuleFooterComponent` if renamed).
4. Rename docs:
   - `MODULE_CONTAINER.md` → `CBA_MODULE_CONTAINER.md`
   - `MODULE_HEADER.md` → `CBA_MODULE_HEADER.md`
5. Update `docs/INDEX.md` cross-references to match new names.
6. Update `public-api.ts` if needed (barrel exports already work).
7. Run component specs to confirm no regressions.
8. Update `CHANGELOG.md` under current dated header: note breaking rename `ModuleFooterComponent` → `CbaModuleFooterComponent` and host-class additions.
9. Update `docs/CONSUMER_GUIDE.md` and `docs/INDEX.md` to reflect the renamed component class and doc file names.

---

### Task 4: Fix Documentation Stale Values & Inaccuracies
**Priority:** High | **Front-end:** Yes

#### Issues addressed
- **[CRITICAL]** `docs/USAGE.md:663,671,686,692,693,694` — 6 stale hex values (`#C5BFAE`, `#DAD7CA`, `#A7A6A2`, `#8E8D8A`).
- **[HIGH]** `docs/CBA_TYPEAHEAD.md:209` — claims `--cba-bg-primary` for input surface; actual component uses `--cba-bg-secondary` via `CbaFieldComponent`.
- **[MEDIUM]** `docs/CBA_MODULE_FOOTER.md:117` — references non-existent `--cba-module-footer-height`.
- **[MEDIUM]** `docs/CBA_FORM_FIELD.md:132` — ASCII tree omits `readonly` and `valid` inputs.
- **[MEDIUM]** `docs/CBA_INPUT.md:177`, `CBA_SELECT.md:176`, `CBA_DATEPICKER.md:224` — host class docs miss `--invalid` (all three components bind both `--error` and `--invalid` to `error()`).
- **[MEDIUM]** `docs/CBA_EMPTY_STATE.md:110` — implies component adds `aria-hidden` itself; consumer must add it.
- **[LOW]** `docs/CBA_BUTTON.md` — minor ToC omission.

#### Implementation plan
1. In `docs/USAGE.md`, replace all 6 stale hex values with authoritative values from `src/theme/_variables.scss`.
2. In `docs/CBA_TYPEAHEAD.md`, change `--cba-bg-primary` → `--cba-bg-secondary`.
3. In `docs/CBA_MODULE_FOOTER.md`, remove the `var(--cba-module-footer-height, 40px)` reference and point to the actual component height implementation.
4. In `docs/CBA_FORM_FIELD.md`, expand the ASCII tree comment to include `readonly` and `valid`.
5. In `docs/CBA_INPUT.md`, `CBA_SELECT.md`, `CBA_DATEPICKER.md`, add `--invalid` to the host classes list.
6. In `docs/CBA_EMPTY_STATE.md`, reword to say the consumer must add `aria-hidden`.
7. In `docs/CBA_BUTTON.md`, add `# Non-goals` to the ToC.
8. Verify all docs with `npm run lint` (markdown linter if available) or manual cross-check against source.
9. Update `CHANGELOG.md` under current dated header: note documentation fixes (stale hex values, token mis-references, missing host classes).
10. Update `docs/CONSUMER_GUIDE.md` if any consumer-facing integration notes changed (e.g., form-field host classes).

---

### Task 5: Add Reproduction Captions to theme-preview.html
**Priority:** Critical | **Front-end:** Yes

#### Issues addressed
- **[CRITICAL]** Button matrix uses `.pv-btn` / `.pv-btn--primary` — consumers copy demo CSS instead of using `<cba-button>`.
- **[CRITICAL]** Status badges use `.status-badge` — not the real `<cba-badge>` API.
- **[CRITICAL]** Footer pills / nav items / table rows use `.is-hover`/`.is-selected`/`.is-disabled` — no lib equivalent; no guidance.
- **[CRITICAL]** Form states use `.form-field--*` — not the real `<cba-form-field>` modifiers.
- **[CRITICAL]** Shell mockup uses non-exported classes (`.shell-header`, `.shell-footer`, etc.).
- **[HIGH]** No captions explain how to reproduce any section with real lib API.

#### Implementation plan
1. For **every** section in `theme-preview.html`, add a `<p class="section-caption">` element directly beneath the `<h2>` or `<h3>` heading. The caption must state:
   - If a real component exists: `<cba-button variant="primary">Primary</cba-button>` with link to `docs/CBA_BUTTON.md`.
   - If only utility classes exist: `.cba-bg-primary`, `.cba-text-secondary`, etc.
   - If only tokens exist: `var(--cba-selected-bg)`, `var(--cba-selected-border)`, etc.
   - If preview-only: "Preview-only CSS — not exported. Reproduce with: ..."
2. Specific sections:
   - **Button matrix:** Caption "DEMO CSS ONLY. Reproduction: `<cba-button variant='primary'>Primary</cba-button>`. See docs/CBA_BUTTON.md."
   - **Labels & pills:** Caption "Pills: no library component. Apply `--cba-selected-*` tokens directly. Labels: use `.cba-text-caption` / `.cba-text-small` / `.cba-text-body`."
   - **Status badges:** Caption "Reproduction: `<cba-badge appearance='solid' variant='success'>success</cba-badge>`. See docs/CBA_BADGE.md."
   - **Form states:** Caption "Reproduction: `<cba-form-field>` host modifiers `.cba-field--disabled`, `.cba-field--readonly`, `.cba-field--valid`, `.cba-field--error`. See docs/CBA_FORM_FIELD.md."
   - **Selected states (pills, nav, table rows):** Caption "Selected-state tokens: `--cba-selected-bg`, `--cba-selected-border`, `--cba-selected-text`, `--cba-selected-hover`. No dedicated component; apply directly."
   - **Shell mockup:** Caption "Application shell — NOT a library component. Library exports `<cba-module-container>`, `<cba-module-header>`, `<cba-module-footer>` only."
   - **Module examples:** Caption "Real library classes: `.cba-module-container--size-100`, `.cba-module-header__action`, `.cba-module-footer__status--*`. Preview-only helpers (`.panel-meta`, `.panel-title-row`) are not exported."
3. Add CSS rule for `.section-caption` in the `<style>` block: small italic muted text (`color: var(--cba-text-secondary); font-size: var(--cba-font-size-caption); font-style: italic; margin-bottom: var(--cba-space-2)`).
4. Verify the file renders correctly by opening it in a browser (or at least checking HTML validity).
5. Update `CHANGELOG.md` under current dated header: note preview HTML caption overhaul and consumer-reference improvements.
6. Update `docs/CONSUMER_GUIDE.md` to reference the new preview captions as the canonical visual reference.

---

### Task 6: Fix Preview HTML Accessibility & Missing Component States
**Priority:** Medium | **Front-end:** Yes

#### Issues addressed
- **[HIGH]** Button matrix missing focus, loading, and size (`sm`/`md`) states.
- **[HIGH]** `.t-callout` (warning callout) fails WCAG AA contrast (~2.3:1).
- **[HIGH]** `body{font-size:14px}` and multiple hard-coded px values in preview CSS.
- **[MEDIUM]** Module body table styles (`.cba-module-container__body table`) are not part of the real component.
- **[MEDIUM]** `.search` div looks like an input but is not focusable.
- **[MEDIUM]** No `<h2>` heading before module examples.
- **[LOW]** `--cba-radius-*` utilities never demonstrated.
- **[LOW]** `--cba-shadow-elevated` never demonstrated.

#### Implementation plan
1. Add a single focus-state button and a single loading-state button next to the button matrix (or in a separate row).
2. Add `size="sm"` and `size="md"` `<cba-button>` examples below the matrix.
3. Fix `.t-callout` to use a darker warning background or inverse text that passes WCAG AA.
4. Replace `body{font-size:14px}` with `font-size: var(--cba-font-size-body)` (base is 14px at 16px root, but use the token).
5. Add a comment block in the "preview chrome" CSS section explaining that hard-coded px values inside the dev-tool UI are intentional and exempt from the token rule.
6. Move module-body table styles to a preview-only helper comment or remove them.
7. Change `.search` div to a disabled `<input>` with proper `aria-label`.
8. Add `<h2>Module examples</h2>` before `#moduleHost`.
9. Add a small "Radius & Shadow" row showing `.cba-radius-sm`, `.cba-radius-md`, `.cba-radius-lg`, `.cba-shadow-module`, `.cba-shadow-elevated`.
10. Update `CHANGELOG.md` under current dated header: note preview accessibility improvements and missing state additions.
11. Update `docs/CONSUMER_GUIDE.md` if any new showcase patterns affect consumer guidance (e.g., radius/shadow utilities).

---

### Task 7: Update project-info to prevent future cross-file drift
**Priority:** Medium | **Front-end:** Yes

#### Issues addressed
- Root cause identified in global pre-analysis: previous updates were made sprint-by-sprint without systematic cross-file verification, causing docs, tokens, components, and preview to drift out of sync.
- `.agent/project-info/brief.md` §8 (integration notes) does not mandate that every token change must be mirrored in docs and preview.
- `.agent/project-info/context.md` does not record the audit findings as a risk.

#### Implementation plan
1. In `.agent/project-info/brief.md` §8 (or a new subsection §8.1):
   - Add a **Token Change Checklist**: whenever a `--cba-*` token is added/removed/changed in `_variables.scss`, the author must verify:
     a. `docs/THEME.md` and `docs/CONSUMER_GUIDE.md` reflect the change.
     b. `docs/USAGE.md` per-token table is updated (or removed if it becomes a duplicate source of truth).
     c. All component SCSS files that reference the token still compile.
     d. `docs/theme-preview.html` swatches are updated.
2. In `.agent/project-info/brief.md` §5 (Design Tokens):
   - Add a note: "Authoritative values live ONLY in `src/theme/_variables.scss`. `docs/USAGE.md` per-token table is a convenience view, not a source of truth. If values diverge, `_variables.scss` wins."
3. In `.agent/project-info/context.md`:
   - Record the 2026-08-12 audit as a completed risk remediation.
   - Add the open risk: "Future token/component changes must be validated against the Token Change Checklist to prevent recurrence."
4. In `.agent/project-info/instructions.md` (if it exists, or brief.md §8):
   - Add an AI agent instruction: "Before committing any change that touches `src/theme/`, `src/components/**/*.scss`, or `docs/theme-preview.html`, run a cross-file grep for the changed token/class name to confirm docs and preview are in sync."

---

## Verification Criteria

After all tasks:
1. `npm run build` succeeds and produces `dist/package.json` at `0.14.1`.
2. `npm run test` passes (all component specs green).
3. `npm run build:preview` succeeds and `docs/theme-preview.css` is regenerated.
4. `docs/theme-preview.html` opened in browser shows every section with a visible caption.
5. No stale hex values remain in `docs/USAGE.md`.
6. No hard-coded `font-size` / `line-height` in component SCSS (verified via `grep` for `font-size:` and `line-height:` in `src/components/**/*.scss`).
7. `package.json` `exports["./theme"]` resolves with both `sass` and `default` conditions.
8. `docs/THEME.md` and `docs/USAGE.md` no longer reference `@import ... theme.css`.

---

## Rollback Plan

If any task causes spec failures:
- Commit after each task (step 4.2 per critical workflow).
- On failure, revert the last commit and escalate to user with the failing spec name and error output.
- The `module-footer` token addition and `ModuleFooterComponent` rename are the riskiest changes; isolate them in their own commits.
