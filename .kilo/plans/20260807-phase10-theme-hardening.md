# Global Plan — Phase 10 Theme Hardening (pre–real MFEs)

**TODO source:** `.agent/todos/20260807/20260807-todo-1.md`  
**Branch:** `feat/phase10-theme-hardening`  
**Version bump:** `0.11.2` → `0.12.0` (minor — additive tokens + visual breaking surface shift)  
**Front-end related:** Yes (all clusters)

---

## Pre-Analysis

**Current baseline:**
- `_variables.scss` has backgrounds, text, borders, accents, interactive states, layout, radius, shadows, spacing.
- Missing: selected-state tokens, form-state tokens, typography scale tokens, radius/shadow documentation.
- `theme-preview.html` has shell mockup, swatches, button matrix, text-on-surfaces.
- Missing preview sections: multi-module density, border scale swatches, selected samples, form state samples, type scale sample.
- `ModuleHeader` uses `faCompress`/`faExpand` for size toggle and fullscreen; missing drag handle; icon order is not per spec.
- `CbaFieldComponent` has basic disabled/error styling; missing readonly, valid, explicit invalid tokens.
- `CbaDropdown` has hover/active styling for items; missing selected styling.
- Docs (`THEME.md`, `CONSUMER_GUIDE.md`) have surface hierarchy, button guide, text rules; missing selected semantics, form state matrix, type scale, radius/shadow rules, table/nav/status patterns.

**Technical decisions:**
- Additive tokens only (preserve existing `--cba-*` names).
- New tokens: `--cba-selected-*`, `--cba-state-*`, `--cba-font-size-*`, `--cba-line-height-*`.
- Update `_utilities.scss` to generate new utility classes for typography scale.
- `ModuleHeader` will import new Font Awesome icons (`faUpDownLeftRight`, `faArrowsLeftRightToLine`, `faArrowsLeftRight`, `faWindowMaximize`).
- Form wiring: use existing host classes (`cba-input--disabled`, `cba-input--error`) and add `readonly`, `valid` equivalents in `CbaFieldComponent` + child components.
- No validation engine — purely visual state wiring via inputs/CSS classes.

---

## Step 2 — Git Feature Branch Setup

**Agent:** implementer  
**Scope:**
1. `git status` — commit any unstaged if needed.
2. Switch to `main`, ensure clean.
3. Create `feat/phase10-theme-hardening`.
4. Switch to new branch.

---

## Step 3 — Version Update

**Agent:** implementer  
**Scope:**
1. Bump `package.json` version to `0.12.0`.
2. Add `[0.12.0] — 2026-08-07` header to `CHANGELOG.md` with placeholder entries.
3. Commit as `chore: bump version to 0.12.0`.

---

## Task Cluster 1: Token & Foundation Hardening

**Tasks covered:** 1 (Surface), 2 (Border), 3 (Selected), 4 (Form states), 6 (Typography), 7 (Radius), 8 (Shadow), Work A (Tokens)

### 4.1a — Front-end Technical Specification
**Agent:** frontend-specialist  
**Inputs:** TODO tasks 1–4, 6–8, Work A.  
**Output:** `.kilo/plans/20260807-phase10-cluster1-frontend-spec.md`  
**Key items to spec:**
- Exact new hex values for surfaces (canvas darker, panel clearer, elevated near-white cream, inset distinct).
- Border hex retuning (subtle vs default vs strong on cream/sand).
- Selected token semantics and color derivation.
- Form state token colors (invalid/valid border+text, disabled bg+text, readonly treatment).
- Typography scale values (display 20/24, heading-lg 18/22, heading-md 16/20, body 14/21, small 13/18, caption 12/16).
- Focus ring verification criteria per surface.

### 4.1b — Implementation Plan
**Agent:** architector  
**Inputs:** frontend spec from 4.1a.  
**Output:** `.kilo/plans/20260807-phase10-cluster1.md`  
**Steps:**
1. Update `src/theme/_variables.scss`:
   - Retune surface colors (task 1).
   - Retune border colors (task 2).
   - Add `--cba-selected-bg`, `--cba-selected-border`, `--cba-selected-text`, `--cba-selected-hover` (task 3).
   - Add `--cba-state-invalid-border`, `--cba-state-invalid-text`, `--cba-state-valid-border`, `--cba-state-valid-text`, `--cba-state-disabled-bg`, `--cba-state-disabled-text` (task 4).
   - Add `--cba-font-size-*` and `--cba-line-height-*` (task 6).
   - Update header comments with surface roles, border roles, selected≠active, accent discipline.
2. Update `src/theme/_utilities.scss`:
   - Add typography utility classes (`.cba-text-display`, `.cba-text-heading-lg`, etc.).
   - Add selected/state utility classes if applicable.
3. Update `src/theme/_mixins.scss`:
   - Add focus-ring verification helper mixin if needed.
4. Regenerate `docs/theme-preview.css` via `npm run build:preview`.
5. Commit.

### 4.2 — Implementation
**Agent:** implementer  
**Scope:** Execute steps from cluster 1 plan.

### 4.3 — Code Review & Simplification
**Agents:** code-reviewer + code-simplifier (concurrent)  
**Output:** Fix/simplification plan in `.kilo/plans/20260807-phase10-cluster1.md`.  
**Plan Agent reviews and assigns fixes to implementer.**

### 4.4 — Documentation
**Agent:** docs-specialist  
**Scope:**
- Update `docs/THEME.md` with surface gaps, border roles, selected semantics, form state tokens, type scale, radius/shadow rules.
- Update `docs/CONSUMER_GUIDE.md` with selected usage, table patterns, form state matrix, type scale usage, radius/shadow rules, anti-patterns.
- Update `README.md` to mention state/type scale readiness.
- Update `CHANGELOG.md` under `[0.12.0]` with additive tokens and visual breaking surface shifts.
- Add JSDoc/comments to `_variables.scss` and component files.

### 4.5a — Front-end Verification
**Agent:** frontend-specialist  
**Scope:** Verify token values, utility classes, and preview CSS against the frontend spec. Report diffs.

### 4.5b — Overall Plan Adherence
**Agent:** architector  
**Scope:** Check cluster 1 implementation against plan. Report deviations.

### 4.6 — Task Completion
**Agent:** implementer  
**Scope:** Mark cluster 1 TODO sub-tasks as `[DONE]`. Commit.

---

## Task Cluster 2: Component Wiring & Verification

**Tasks covered:** 5 (Focus ring), 12 (ModuleHeader icons), Work B (Component/style wiring)

### 4.1a — Front-end Technical Specification
**Agent:** frontend-specialist  
**Output:** `.kilo/plans/20260807-phase10-cluster2-frontend-spec.md`  
**Key items:**
- Icon mapping for ModuleHeader (drag, collapse, size toggle, fullscreen, remove) with exact Font Awesome icon names and order.
- Focus ring check criteria for each surface/button variant.
- Form control state wiring: disabled, readonly, invalid, valid, focus-visible.
- Dropdown selected option styling approach.
- ModuleHeader title typography step.

### 4.1b — Implementation Plan
**Agent:** architector  
**Output:** `.kilo/plans/20260807-phase10-cluster2.md`  
**Steps:**
1. `ModuleHeaderComponent`:
   - Replace icons: drag → `faUpDownLeftRight`, size toggle → `faArrowsLeftRightToLine`/`faArrowsLeftRight`, fullscreen → `faWindowMaximize`.
   - Reorder icons: drag, collapse/expand, size toggle, fullscreen, remove.
   - Apply heading-md/heading-lg type token to title.
   - Verify focus ring on action buttons.
2. `ModuleContainer` / `ModuleHeader`:
   - Audit structural edges: ensure module container uses `border-default` (not only `border-subtle` + tiny shadow).
3. Form controls (`CbaInput`, `CbaSelect`, `CbaDatepicker`, `CbaFieldComponent`):
   - Wire readonly state (new host class, distinct visual from disabled).
   - Wire valid state (new host class + token).
   - Ensure focus-visible uses focus-ring token.
   - Ensure disabled uses `--cba-state-disabled-*` tokens.
   - Ensure invalid uses `--cba-state-invalid-*` tokens.
4. `CbaDropdown`:
   - Wire selected option styling via `.active` or custom selected class if ng-bootstrap exposes it.
5. Commit.

### 4.2 — Implementation
**Agent:** implementer

### 4.3 — Code Review & Simplification
**Agents:** code-reviewer + code-simplifier (concurrent)

### 4.4 — Documentation
**Agent:** docs-specialist  
**Scope:**
- Update `docs/MODULE_HEADER.md` with new icon order and type scale.
- Update `docs/CBA_INPUT.md`, `CBA_SELECT.md`, `CBA_DATEPICKER.md` with state matrix.
- Update `docs/CBA_DROPDOWN.md` with selected option note.
- Add form-state matrix documentation.

### 4.5a — Front-end Verification
**Agent:** frontend-specialist  
**Scope:** Verify ModuleHeader icon order, focus rings on all variants, form state visuals.

### 4.5b — Overall Plan Adherence
**Agent:** architector

### 4.6 — Task Completion
**Agent:** implementer

---

## Task Cluster 3: Preview & Pattern Documentation

**Tasks covered:** 9 (Table states), 10 (Nav/footer states), 11 (Semantic status), Work C (Preview), Work D (Docs)

### 4.1a — Front-end Technical Specification
**Agent:** frontend-specialist  
**Output:** `.kilo/plans/20260807-phase10-cluster3-frontend-spec.md`  
**Key items:**
- Preview HTML sections: multi-module density strip, border scale swatches, selected samples (pill + fake table row + nav item), form state samples, type scale sample.
- Table state pattern visual design (row default/hover/selected/disabled).
- Nav/footer pill state pattern visual design.
- Semantic status badge/inline recipes.

### 4.1b — Implementation Plan
**Agent:** architector  
**Output:** `.kilo/plans/20260807-phase10-cluster3.md`  
**Steps:**
1. Update `docs/theme-preview.html`:
   - Add multi-module density strip (2 modules side by side).
   - Add border scale swatches (subtle / default / strong with role labels).
   - Add selected samples: footer pill selected, fake nav item selected, fake table row selected.
   - Add form state samples: input default / focus / disabled / readonly / invalid.
   - Add type scale sample showing each step.
   - Update TOKEN_ROLES array with new tokens.
   - Regenerate `docs/theme-preview.css`.
2. Update `docs/THEME.md`:
   - Add table state patterns section.
   - Add navigation/footer state patterns section.
   - Add semantic status patterns section.
3. Update `docs/CONSUMER_GUIDE.md`:
   - Add selected state usage rules.
   - Add table state pattern consumer guidance.
   - Add nav/footer pill state rules.
   - Add semantic status badge recipes.
   - Update anti-patterns.
4. Update `README.md`:
   - Mention state/type scale readiness in Design Tokens section.
5. Update `CHANGELOG.md`:
   - Finalize `[0.12.0]` entries.
6. Commit.

### 4.2 — Implementation
**Agent:** implementer

### 4.3 — Code Review & Simplification
**Agents:** code-reviewer + code-simplifier (concurrent)

### 4.4 — Documentation
**Agent:** docs-specialist  
**Scope:** Ensure all new preview sections and pattern docs have clear JSDoc-style comments for AI agents.

### 4.5a — Front-end Verification
**Agent:** frontend-specialist  
**Scope:** Verify preview HTML renders correctly, all new sections present, visual hierarchy meets acceptance criteria.

### 4.5b — Overall Plan Adherence
**Agent:** architector

### 4.6 — Task Completion
**Agent:** implementer

---

## Step 5 — TODO File Completion

**Agent:** implementer  
**Scope:**
1. Mark all TODO lines as `[DONE]`.
2. Rename TODO file to `20260807-todo-1-DONE.md`.
3. Ensure all files committed in feature branch.
4. Switch to `main`, merge `feat/phase10-theme-hardening`.
5. On success, delete feature branch.
6. Push `main` to `origin` only.

---

## Acceptance Criteria Mapping

| Criterion | Covered in cluster |
|-----------|-------------------|
| 1. Multi-module layout no longer reads as beige slab; canvas↔panel obvious | Cluster 1 (tokens), Cluster 3 (preview density strip) |
| 2. border-subtle/default/strong visibly distinct and documented | Cluster 1 (tokens), Cluster 3 (docs + preview swatches) |
| 3. Selected state tokens exist and demoed | Cluster 1 (tokens), Cluster 2 (dropdown/component wiring), Cluster 3 (preview) |
| 4. Form states defined and shown | Cluster 1 (tokens), Cluster 2 (form wiring), Cluster 3 (preview + docs) |
| 5. Focus ring verified on major surfaces/buttons | Cluster 2 (focus ring stress test) |
| 6. Typography scale tokens exist with usage guidance | Cluster 1 (tokens), Cluster 2 (ModuleHeader title), Cluster 3 (preview + docs) |
| 7. Radius + shadow rules documented; border primary | Cluster 1 (tokens), Cluster 3 (docs) |
| 8. Consumer guide updated; build succeeds; identity preserved | All clusters + step 5 |

---

## Risk Notes

- **Visual breaking change:** Canvas/panel surface retuning may shift L* gaps; must pass `src/theme/surfaces.spec.ts`.
- **Font Awesome icon availability:** Need to verify `faUpDownLeftRight`, `faArrowsLeftRightToLine`, `faArrowsLeftRight`, `faWindowMaximize` exist in free-solid-svg-icons v7.3.1.
- **Dropdown selected wiring:** ng-bootstrap `NgbDropdownItem` may not expose a selected state easily; if blocked, document pattern instead of wiring.
- **Max lines per file/method:** `_variables.scss` may exceed 200 lines after additions; consider if split needed (but it's a config file, rule says does NOT apply to config/docs files — `_variables.scss` is source code in `src/`, so rule applies. Currently 80 lines, adding ~30-40 new tokens should keep it under 200).
