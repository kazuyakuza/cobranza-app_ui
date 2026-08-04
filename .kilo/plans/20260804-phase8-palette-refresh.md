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
|---|-----------|
| 1 | Theme is recognizably **Minimal Yet Warm** (warm sand/cream/taupe + coral accents), not the old mid-gray fog. |
| 2 | At least four surface levels are distinguishable in the Shell. |
| 3 | Module separates clearly from workspace canvas. |
| 4 | Text primary/secondary/muted is clearly readable. |
| 5 | Borders and footer/header chrome remain visible. |
| 6 | Coral accents are controlled (not accidental large backgrounds). |
| 7 | Token names remain stable; build succeeds. |
| 8 | Docs record the final palette values. |
