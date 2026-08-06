# Global Plan — Theme Refinement: Tokens, Preview, Consumer Guide & Regression Tests

**TODO Source:** `.agent/todos/20260805/20260805-todo-1.md`
**Date:** 2026-08-06
**Branch:** `feat/theme-refinement-tokens-preview-guide`

---

## Global Pre-Analysis

The TODO identifies four related concerns with the current Minimal Yet Warm theme:
1. **Visual distinctness**: panel (`--cba-bg-secondary` #F2F0E8) is too close to elevated (`--cba-bg-elevated` #FDFCF8), making the surface hierarchy hard to read in the Shell.
2. **Preview fidelity**: `docs/theme-preview.html` uses mirrored inline CSS instead of the actual library SCSS, so it can drift from real component output.
3. **Consumer Guide clarity**: Shell/MFE AI agents need stricter, more explicit rules for applying tokens (buttons, surfaces, text) with the "follow ~90%" mandate.
4. **Test coverage**: token values, contrast ratios, and preview structure need regression tests.

**Technical decisions:**
- Adjust `--cba-bg-secondary` to a darker, more saturated warm cream (e.g. #E8E4D4) and `--cba-bg-elevated` to a warmer, more identifiable near-white (e.g. #FAF8F0), widening the L* gap between them while keeping all four surfaces distinct.
- Update `docs/theme-preview.html` to reference actual `--cba-*` CSS variables (importing the compiled theme CSS or mirroring `:root` exactly) and add dedicated swatch/example sections for canvas, panel, elevated, inset, text, border, accent, warning, danger.
- Expand `docs/CONSUMER_GUIDE.md` with explicit AI-agent directives, button-state tables, surface-decision rules, and the 90% compliance mandate.
- Add Jest-based regression tests for token values and contrast ratios; add structural checks for the preview HTML.

**Front-end flag:** All tasks are front-end related.

---

## Task 1 — Theme Token Adjustments

**Goal:** Make panel darker/more colored; make elevated clearly identifiable around/over other colors.

**Pre-analysis:**
- Current: canvas #C5BFAE (L*≈76) → panel #F2F0E8 (L*≈95) → elevated #FDFCF8 (L*≈99) → inset #D8C3A5 (L*≈80).
- Problem: panel→elevated step is only ~4 L* and both are near-white with very low chroma, so they read as identical on many displays.
- Fix: Shift panel down to ~L*≈90 and increase warm chroma (e.g. #E8E4D4). Shift elevated to a warmer, slightly more saturated cream (e.g. #FAF8F0, L*≈98, stronger yellow tint) so it pops against the new panel. Verify all four surfaces remain obviously distinct.
- Consequence: text contrast on the new panel must still pass WCAG AA; `--cba-text-primary` and `--cba-text-secondary` already pass on darker canvas, so they will pass on the new panel too. `--cba-text-muted` needs verification.

**Plan file:** `.kilo/plans/20260806-task1-token-adjustments.md`

### Task 1 Execution Steps
- **Step 2:** Git Feature Branch Setup → implementer
- **Step 3:** Version Update → implementer
- **4.1a:** Front-end Technical Specification → frontend-specialist
- **4.1b:** Analysis & Planning → architector
- **4.2:** Implementation → implementer
- **4.3:** Code Review & Simplification → code-reviewer + code-simplifier; 4.3-fix → implementer
- **4.4:** Documentation → docs-specialist
- **4.5a:** Front-end Verification → frontend-specialist
- **4.5b:** Overall Plan Adherence → architector
- **4.6:** Task Completion → implementer

---

## Task 2 — Theme Preview HTML Overhaul

**Goal:** Ensure `docs/theme-preview.html` uses actual library tokens (not mirrored values), and add clear examples for canvas, panel, elevated, inset, text, border, accent, warning, danger.

**Pre-analysis:**
- The preview currently hard-codes CSS custom properties in a `.preview` block. It should instead import/link to the compiled theme or at least copy-paste the exact `:root` block from `src/theme/_variables.scss` so there is zero drift.
- The preview lacks explicit swatch rows and interactive state examples (hover, active, disabled buttons on different surfaces).
- It should demonstrate the full surface hierarchy in a realistic layout (Shell header, module, workspace) so AI agents can visually verify their own implementations.

**Dependencies:** Task 1 (final token values must be known before the preview is updated).

**Plan file:** `.kilo/plans/20260806-task2-preview-html.md`

### Task 2 Execution Steps
- **4.1a:** Front-end Technical Specification → frontend-specialist
- **4.1b:** Analysis & Planning → architector
- **4.2:** Implementation → implementer
- **4.3:** Code Review & Simplification → code-reviewer + code-simplifier; 4.3-fix → implementer
- **4.4:** Documentation → docs-specialist
- **4.5a:** Front-end Verification → frontend-specialist
- **4.5b:** Overall Plan Adherence → architector
- **4.6:** Task Completion → implementer

---

## Task 3 — Consumer Guide Enhancement

**Goal:** Make the Consumer Guide explicitly mandate ~90% token compliance for AI agents, and add detailed usage tables for buttons, backgrounds, panels, bars, text.

**Pre-analysis:**
- Current guide is correct but too high-level for an AI agent that needs to generate concrete SCSS/CSS.
- Need a "Token Compliance Mandate" section stating: "AI agents generating Shell or MFE code must use `--cba-*` tokens for at least 90% of color/style declarations. Hard-coded hex is only allowed for one-off edge cases documented with a TODO."
- Need a "Button Color Guide" table: variant × surface → token mapping, plus hover/active/disabled states.
- Need a "Surface Decision Tree" diagram or table: "What background should I use for X?" → canvas/workspace, panel/card, elevated/header, inset/table-header.
- Need a "Text Color Rules" table: surface → allowed text tokens (primary, secondary, muted, inverse), with the muted-restriction callout.
- Update cross-references in `docs/THEME.md`, `docs/INDEX.md`, `README.md`.

**Dependencies:** Task 1 (final tokens), Task 2 (preview examples can be referenced from guide).
- Can start in parallel with Task 2 once Task 1 is done.

**Plan file:** `.kilo/plans/20260806-task3-consumer-guide.md`

### Task 3 Execution Steps
- **4.1b:** Analysis & Planning → architector (no front-end spec needed, this is docs)
- **4.2:** Implementation → implementer
- **4.3:** Code Review & Simplification → code-reviewer + code-simplifier; 4.3-fix → implementer
- **4.4:** Documentation → docs-specialist
- **4.5b:** Overall Plan Adherence → architector
- **4.6:** Task Completion → implementer

---

## Task 4 — Regression Tests

**Goal:** Where possible, implement regression tests for token values, contrast ratios, and preview HTML structure.

**Pre-analysis:**
- Jest is already configured. We can add a `theme.spec.ts` or `tokens.spec.ts` under `src/theme/` that:
  - Reads the compiled CSS or parses `_variables.scss` to assert token values.
  - Computes relative luminance and asserts WCAG AA for key pairs.
  - Asserts the four surfaces are distinct (ΔE or simple L* gap).
- For the preview HTML, a simple Node-based test can parse the HTML and assert that all listed swatch sections exist and that no inline hex values contradict the token file.
- Button component tests already exist; we can add computed-style assertions for variant classes if running in a browser-like environment (jsdom + `getComputedStyle`).

**Dependencies:** Tasks 1–3 (tests verify the final state).

**Plan file:** `.kilo/plans/20260806-task4-regression-tests.md`

### Task 4 Execution Steps
- **4.1b:** Analysis & Planning → architector
- **4.2:** Implementation → implementer
- **4.3:** Code Review & Simplification → code-reviewer + code-simplifier; 4.3-fix → implementer
- **4.4:** Documentation → docs-specialist
- **4.5b:** Overall Plan Adherence → architector
- **4.6:** Task Completion → implementer

---

## Step 5 — TODO File Completion

- Rename TODO file to `20260805-todo-1-DONE.md`.
- Merge feature branch into `main`.
- Push to `origin`.

**Assigned to:** implementer

---

## Order of Execution

1. Step 2: Git branch setup
2. Step 3: Version bump
3. Task 1: Token adjustments (4.1a → 4.1b → 4.2 → 4.3 → 4.4 → 4.5a → 4.5b → 4.6)
4. Task 2: Preview HTML (4.1a → 4.1b → 4.2 → 4.3 → 4.4 → 4.5a → 4.5b → 4.6)
5. Task 3: Consumer Guide (4.1b → 4.2 → 4.3 → 4.4 → 4.5b → 4.6) — can start after Task 1 finishes
6. Task 4: Regression tests (4.1b → 4.2 → 4.3 → 4.4 → 4.5b → 4.6)
7. Step 5: TODO completion
