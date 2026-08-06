# Global Plan — Phase 9: Surface Hierarchy Fix + Consumer Guide

**TODO source:** `.agent/todos/20260805/20260805-todo-0.md`  
**Library:** `@cobranza-apps/ui`  
**Theme:** Minimal Yet Warm  
**Current version:** `0.9.1`  
**Target version:** `0.10.0` (minor — visual hierarchy improvement)  
**Branch:** `feat/phase9-surface-hierarchy`

---

## Pre-Analysis

### Problem
The running Shell looks flat: modules barely separate from the workspace canvas. Borders and chrome disappear into the cream background. The root cause is insufficient luminance gaps between the four surface levels (canvas → panel → elevated → inset) and borders that are nearly invisible on warm light surfaces.

### Current Token Values (lib)

| Token | Value | Role | Issue |
|-------|-------|------|-------|
| `--cba-bg-primary` | `#EAE7DC` | Canvas / workspace | OK as warm base, but too close to panel |
| `--cba-bg-secondary` | `#F3F1E9` | Panel / module body | **Only ~6 luminance units from canvas** |
| `--cba-bg-elevated` | `#FCFBF6` | Header / dropdowns | Only a hair lighter than panel |
| `--cba-bg-tertiary` | `#D8C3A5` | Inset / table headers | Good contrast, but consumers often don't use it |
| `--cba-border-subtle` | `#E7E5DE` | Thin separators | **Nearly invisible** on cream/canvas |
| `--cba-shadow-module` | `0 4px 16px rgba(43,34,28,0.12)` | Module lift | Soft; may need more presence |

### Component Wiring (correct, but tokens are weak)

- `ModuleContainer` (non-fullscreen): `bg-secondary` + `border-subtle` + `shadow-module`
- `ModuleHeader`: `bg-elevated` + `border-bottom: border-subtle`
- `ModuleFooter`: `bg-tertiary`

### Technical Decisions

1. **Stay in Minimal Yet Warm** — warm sand/cream/taupe + controlled coral. No new theme families.
2. **Do not rename tokens** — only values change. This is a drop-in visual update.
3. **Coral remains accent-only** — warning/danger/focus. Primary CTA stays warm taupe.
4. **Desktop-only** — no responsive work.
5. **Acceptance is visual hierarchy**, not a fixed hex table. Agent may iterate exact values after preview.

### Files That Will Change

- `src/theme/_variables.scss` — token values (backgrounds, borders, shadows)
- `src/components/module-container/module-container.component.scss` — possibly switch to `border-default`
- `docs/theme-preview.html` — update preview CSS custom properties and inline tokens
- `docs/CONSUMER_GUIDE.md` — new file (Shell + MFE surface ownership guide)
- `docs/INDEX.md` — link consumer guide
- `docs/THEME.md` — add surface hierarchy note
- `README.md` — update theme name mention, link consumer guide
- `CHANGELOG.md` — entry for 0.10.0
- `.agent/project-info/brief.md` — update token value table §5
- `.agent/project-info/context.md` — update current work focus

---

## Global Execution Map

| Step | Description | Sub-agent | Notes |
|------|-------------|-----------|-------|
| **2** | Git Feature Branch Setup | implementer | Create `feat/phase9-surface-hierarchy`, switch, commit any safe changes |
| **3** | Version Update | implementer | Bump `package.json` to `0.10.0`, commit as `chore: bump version to 0.10.0` |
| **Task A** | **Token & Component Tuning** (Tasks 1–4 from TODO) | | Front-end related |
| A-4.1a | Front-end Technical Specification | frontend-specialist | Analyze visual hierarchy requirements, produce spec with proposed hex values, border strategy, shadow strategy |
| A-4.1b | Analysis & Planning | architector | Read front-end spec, produce detailed implementation plan with exact file paths, code snippets, preview update steps |
| A-4.2 | Implementation | implementer | Apply token changes, component chrome updates, theme preview HTML update |
| A-4.3 | Code Review & Simplification | code-reviewer + code-simplifier | Review for errors, plan deviations, simplification opportunities |
| A-4.3-fix | Fix & Simplify | implementer | Apply review findings (max 3 cycles) |
| A-4.4 | Documentation (code comments) | docs-specialist | JSDoc updates if needed, inline token documentation updates |
| A-4.5a | Front-end Verification | frontend-specialist | Verify implementation matches front-end spec, report diffs |
| A-4.5b | Overall Plan Adherence | architector | Check implementation plan adherence, report deviations |
| A-4.6 | Task Completion | implementer | Mark Tasks 1–4 as `[DONE]` in TODO, commit |
| **Checkpoint** | **User Visual Confirmation** | | STOP for human review of theme-preview.html and/or Shell screenshot |
| **Task B** | **Consumer Guide & Docs Sync** (Tasks 6–7 from TODO) | | Documentation-heavy |
| B-4.1b | Analysis & Planning | architector | Plan `CONSUMER_GUIDE.md` structure, docs sync tasks, changelog entry |
| B-4.2 | Implementation | implementer | Write `docs/CONSUMER_GUIDE.md`, update `docs/INDEX.md`, `docs/THEME.md`, `README.md`, `CHANGELOG.md`, `brief.md`, `context.md` |
| B-4.3 | Code Review | code-reviewer | Review docs for accuracy, completeness, broken links |
| B-4.3-fix | Fix | implementer | Apply doc review findings |
| B-4.4 | Documentation | docs-specialist | Ensure all docs have proper cross-references, TOC, consistent formatting |
| B-4.5b | Overall Plan Adherence | architector | Verify all docs updated, links valid, changelog correct |
| B-4.6 | Task Completion | implementer | Mark Tasks 6–7 as `[DONE]`, commit |
| **5** | TODO File Completion | implementer | Rename TODO to `-DONE`, merge branch to `main`, push to `origin` |

---

## Task A — Token & Component Tuning (Detailed Plan)

### A-4.1a: Front-end Technical Specification

The frontend-specialist must produce a spec document at `.kilo/plans/20260805-phase9-frontend-spec.md` covering:

1. **Proposed surface values** with rationale:
   - Canvas: target darker/more sand than current `#EAE7DC` — e.g. shift toward `#DDD8CC` or `#D5D0C4` to create clear floor
   - Panel: target clearly lighter cream — e.g. `#F5F3EB` or `#F7F5EE` with more separation from canvas
   - Elevated: target warm white with visible edge — e.g. `#FDFCF7` or `#FCFBF6` (keep or slightly refine) + ensure border separation is visible
   - Inset: keep or refine `#D8C3A5` for table headers / wells
   
2. **Luminance gap targets**:
   - Canvas → panel: at least 8–10 L* units apart
   - Panel → elevated: at least 4–6 L* units apart
   - All four surfaces must be distinguishable at a glance in theme-preview.html

3. **Border strategy**:
   - `border-subtle`: raise from `#E7E5DE` to something visible on cream, e.g. `#D5D2CA` or `#CFCBC3`
   - `border-default`: verify it works for inputs, footer pills, icon buttons (should be OK)
   - `border-strong`: verify for focus/footer pills/header icon-button outlines

4. **Shadow strategy**:
   - `shadow-module`: slightly increase opacity or spread so modules lift off canvas, e.g. `0 4px 20px rgba(43,34,28,0.14)` or `0 6px 20px rgba(43,34,28,0.13)`
   - `shadow-elevated`: increase if needed for dropdowns/modals
   - Keep warm-tinted (rgba(43,34,...)) — never harsh black

5. **Hover/active overlay verification**: ensure `--cba-hover` (`rgba(43,38,32,0.06)`) and `--cba-active` (`rgba(43,38,32,0.10)`) still read correctly on the new cream surfaces.

6. **Module chrome specification**:
   - `ModuleContainer`: verify `border-subtle` → if still too weak after token bump, switch to `border-default`
   - `ModuleHeader`: ensure `border-bottom` is visible against panel body
   - `ModuleFooter`: keep `bg-tertiary`, verify separation from body

7. **Theme preview specification**:
   - Update CSS custom properties in `docs/theme-preview.html` to match new token values
   - Ensure preview clearly shows: canvas ≠ panel, module header ≠ module body, table header inset ≠ row background, footer pills visible on canvas

### A-4.1b: Analysis & Planning

The architector reads the front-end spec and produces a detailed implementation plan at `.kilo/plans/20260805-phase9-taskA-implementation.md` with:

- Exact file paths and line ranges to modify
- Before/after code snippets for each token change
- Specific values to change in `docs/theme-preview.html`
- Any SCSS selector changes in component files
- Preview verification steps (open `docs/theme-preview.html` in browser or describe expected visual)
- Test commands: `npm run build`, `npm run lint`

### A-4.2: Implementation Steps (Detailed)

#### Step 1: Update `src/theme/_variables.scss`

Update these token values (keep all others unchanged):

```scss
/* Backgrounds — widened surface scale */
--cba-bg-primary: #DDD8CC;      /* canvas — darker sand, clearly the floor */
--cba-bg-secondary: #F5F3EB;    /* panel — lighter cream, clearly a card */
--cba-bg-tertiary: #D8C3A5;     /* inset — warm sand (keep or refine) */
--cba-bg-elevated: #FCFBF6;     /* elevated — warm white (keep or nudge) */

/* Borders — stronger contrast on cream */
--cba-border-subtle: #CFCBC3;   /* was #E7E5DE — now visible on cream */
--cba-border-default: #A7A6A2;   /* keep */
--cba-border-strong: #8E8D8A;    /* keep */

/* Shadows — slightly more presence */
--cba-shadow-module: 0 6px 20px rgba(43, 34, 28, 0.13);
--cba-shadow-elevated: 0 8px 28px rgba(43, 34, 28, 0.20);
```

> **Note:** Exact hex values may be tuned by the implementer after visual verification. The targets are: canvas darker sand, panel clearly lighter cream, elevated distinct, borders visible, shadows present. Do NOT rename tokens.

#### Step 2: Verify/update `src/components/module-container/module-container.component.scss`

Current: `border: 1px solid var(--cba-border-subtle);`

If `border-subtle` is still too weak on the new canvas after Step 1, switch to:
```scss
border: 1px solid var(--cba-border-default);
```

This is a fallback; the primary fix is in the token values.

#### Step 3: Verify `src/components/module-header/module-header.component.scss`

Current: `border-bottom: 1px solid var(--cba-border-subtle);`

If `border-subtle` is too weak after Step 1, consider switching to `border-default` for the header bottom edge.

#### Step 4: Verify `src/components/module-footer/module-footer.component.scss`

Current uses `bg-tertiary` which is the inset sand. This should already contrast well. No change expected unless the inset value is refined.

#### Step 5: Update `docs/theme-preview.html`

Update the inline CSS custom properties and the JS `tokens` object to match the new values from `_variables.scss`. Specifically update:

- `--canvas` value
- `--panel` value
- `--border` (if default changes) — actually the preview uses `--border` for `#A7A6A2` which is `border-default`
- `--shadow` value
- The JS `tokens` object inside the `themes` array

#### Step 6: Build & lint verification

```bash
npm run build
npm run lint
```

Both must pass with no errors.

### A-4.5a: Front-end Verification Checklist

The frontend-specialist verifies:

1. [ ] Canvas is clearly darker/more sand than panel in theme-preview
2. [ ] Panel is clearly lighter cream than canvas
3. [ ] Elevated is distinct from panel (header band visible)
4. [ ] Inset (table header) is clearly different from row background
5. [ ] Module container border is visible (not invisible)
6. [ ] Module header bottom border is visible against panel body
7. [ ] Footer pills are readable on canvas
8. [ ] Shadow gives modules visible lift
9. [ ] Hover states still read correctly on new surfaces
10. [ ] `npm run build` passes
11. [ ] `npm run lint` passes

### A-4.5b: Overall Plan Adherence

The architector checks:

1. All token names preserved (no renames)
2. Theme stays Minimal Yet Warm (no gray/blue intrusions)
3. Coral remains accent-only
4. Component APIs unchanged
5. Build succeeds
6. All acceptance criteria for Tasks 1–4 met

---

## Checkpoint — User Visual Confirmation

**After Task A completion, STOP.**

Present the user with:
1. The updated `docs/theme-preview.html` (open in browser or describe the visual)
2. A summary of token changes
3. Ask: "Does the surface hierarchy look correct? Are the four surfaces clearly distinguishable?"

If the user says the hierarchy is still flat, iterate tokens **once more** (still within Minimal Yet Warm) before proceeding to Task B.

---

## Task B — Consumer Guide & Docs Sync (Detailed Plan)

### B-4.1b: Analysis & Planning

Plan file: `.kilo/plans/20260805-phase9-taskB-implementation.md`

Produce a detailed plan for:

1. `docs/CONSUMER_GUIDE.md` creation — structure per TODO §6
2. `docs/INDEX.md` update — add link to consumer guide
3. `docs/THEME.md` update — add surface hierarchy note + pointer
4. `README.md` update — fix "intermediate-gray" mention to "Minimal Yet Warm", add link
5. `CHANGELOG.md` — add 0.10.0 entry
6. `.agent/project-info/brief.md` — update token value table §5
7. `.agent/project-info/context.md` — update current work focus

### B-4.2: Implementation Steps (Detailed)

#### Step 1: Create `docs/CONSUMER_GUIDE.md`

Structure (per TODO §6):

1. **Theme load (once)** — Shell must import `@use '@cobranza-apps/ui/theme';` globally; MFEs rely on Shell-loaded tokens when hosted, import once if standalone. Do not re-declare competing `:root` colors.

2. **Surface ownership map** — table showing UI region → token → who applies it (Shell / Lib / MFE)

3. **Shell checklist** — 6 bullet checklist with `[ ]` markers

4. **MFE checklist** — 4 bullet checklist with `[ ]` markers

5. **Anti-patterns** — 5 bullet list of common mistakes

6. **Quick verify** — 5-step visual verification after integration

#### Step 2: Update `docs/INDEX.md`

Add under "Getting started":
```markdown
- [CONSUMER_GUIDE.md](./CONSUMER_GUIDE.md) — Surface ownership, Shell/MFE checklists, anti-patterns, and quick-verify steps.
```

#### Step 3: Update `docs/THEME.md`

Add a short "Surface hierarchy" section near the top (after "Importing the Theme") with a note that tokens are layered (canvas → panel → elevated → inset) and a pointer to `CONSUMER_GUIDE.md` for consumer application rules.

#### Step 4: Update `README.md`

- Line 8: change "intermediate-gray design system" to "Minimal Yet Warm design system"
- Line 28: change "intermediate-gray design system" to "Minimal Yet Warm design system"
- In the Documentation section, add link to `CONSUMER_GUIDE.md`

#### Step 5: Update `CHANGELOG.md`

Add `[0.10.0]` section with:

```markdown
## [0.10.0] - 2026-08-05

### Changed

- Widened surface hierarchy in `src/theme/_variables.scss`: canvas darkened to sand `#DDD8CC`, panel lightened to cream `#F5F3EB`, creating clear visual separation between workspace floor and module cards. Elevated and inset surfaces refined for distinct header-band and recessed-region readability.
- `--cba-border-subtle` strengthened to `#CFCBC3` so separators on cream surfaces are visible (was `#E7E5DE`, nearly invisible).
- `--cba-shadow-module` increased to `0 6px 20px rgba(43,34,28,0.13)` and `--cba-shadow-elevated` to `0 8px 28px rgba(43,34,28,0.20)` for stronger module lift off canvas while keeping warm-tinted softness.
- `ModuleContainer` and `ModuleHeader` chrome re-verified; border-default used if subtle remains weak on new canvas.

### Added

- `docs/CONSUMER_GUIDE.md` — comprehensive guide for Shell and MFE developers covering theme load, surface ownership map, Shell/MFE checklists, anti-patterns, and quick-verify steps.
- Surface hierarchy note added to `docs/THEME.md` with cross-reference to consumer guide.

### Notes

- **No token names were renamed** — only values changed. This is a drop-in visual update.
- **Visual breaking change:** Shell layouts that relied on near-identical canvas/panel surfaces will now show stronger contrast. This is intentional and aligns with the hierarchy goal.
- Token authoritative values updated in `.agent/project-info/brief.md` §5.
```

#### Step 6: Update `.agent/project-info/brief.md` §5

Update the token value table to reflect the new hex values. Update the comment block at the top of §5 that mentions the palette values.

#### Step 7: Update `.agent/project-info/context.md`

Update "Current Work Focus" to reflect Phase 9 completion. Update "Recent Changes" with Phase 9 summary. Update "Immediate Next Steps" to next phase work.

### B-4.5b: Overall Plan Adherence

Verify:
1. `CONSUMER_GUIDE.md` exists with all 6 sections
2. `INDEX.md` links to it
3. `THEME.md` has surface hierarchy note
4. `README.md` says "Minimal Yet Warm" (not "intermediate-gray")
5. `CHANGELOG.md` has 0.10.0 entry
6. `brief.md` §5 updated
7. `context.md` updated

---

## Acceptance Criteria (from TODO)

| # | Criterion | Verification Method |
|---|-----------|---------------------|
| 1 | Canvas, panel, elevated, inset are **obviously different** in theme-preview and Shell. | Visual inspection of theme-preview.html |
| 2 | Module cards separate from workspace without squinting. | Visual inspection + border/shadow check |
| 3 | Module header band is distinct from module body. | Visual inspection (elevated vs secondary) |
| 4 | Borders on cream chrome are visible (pills, module edge, header divider). | Visual inspection of preview |
| 5 | `docs/CONSUMER_GUIDE.md` exists with Shell + MFE rules and anti-patterns. | File exists + content review |
| 6 | README/INDEX/THEME point to the consumer guide; theme name is Minimal Yet Warm. | Link check + text search |
| 7 | Token names unchanged; build succeeds. | `npm run build` + `npm run lint` pass |

---

## Explicitly Out of Scope

- New components
- New theme families
- Shell implementation PRs (guide only — Shell applies the guide in its own repo)
- Mobile layout work
- Renaming tokens
- Adding new token names

---

## After This Phase

Hierarchy is the lib baseline. Shell/MFE work follows `CONSUMER_GUIDE.md`. Further color tweaks stay on tokens first.

> **Next chat instruction:** `full read @AGENTS.md & follow /critical-workflow` then `do @.agent/todos/<next-todo-file>`
