# Global Plan — Phase 7: Accordion, Spanish UI copy & Delivery Polish

**Source TODO:** `.agent/todos/20260730/20260730-todo-5.md`  
**Branch:** `feat/phase7-accordion-spanish-delivery` (to be created from `main`)  
**Version bump:** `0.6.1` → `0.7.0` (minor — new component + delivery polish)

---

## Pre-Analysis

### Technical context
- Angular 22 standalone components, Bootstrap 5 + ng-bootstrap 21, ng-packagr build.
- All previous Phases 0–6 components exist under `src/components/` and compile/tests pass.
- `public-api.ts` currently exports 12 component barrels (no accordion, no i18n constants).
- English default strings exist in:
  - `module-footer.component.ts` (`STATUS_TEXTS`)
  - `module-header.component.html` (aria-labels / titles)
  - `cba-modal.component.html` (`aria-label="Close"`)
  - `cba-datepicker.component.html` (`aria-label="Open date picker"`)
- Tests assert English strings; they must be updated to assert Spanish strings.
- Docs/USAGE.md documents English status text mapping and English aria-label concepts.

### Architecture decisions
- **Centralized defaults file:** `src/i18n/ui-messages.ts` — single `as const` object with Spanish defaults. Not a translation framework; consumers override via inputs/projection only.
- **Accordion placement:** `src/components/accordion/` following existing component folder convention.
- **ng-bootstrap wrapper pattern:** Reuse the same thin-wrapper approach used for Modal, Dropdown, Popover, etc. — import `NgbAccordionModule` / `NgbAccordionItem`, theme via SCSS, stable selector API.
- **No `src/lib/` folder exists in the actual project; all source lives under `src/components/`, `src/theme/`, `src/directives/`.** The i18n constants file will live under `src/i18n/` (new folder) to keep it centralized and clearly not a component.

---

## Step 2 — Git Feature Branch Setup

**Agent:** implementer  
- Commit any unstaged changes (clean working tree expected).  
- Create and switch to `feat/phase7-accordion-spanish-delivery` from `main`.

## Step 3 — Version Update

**Agent:** implementer  
- Bump `package.json` version to `0.7.0`.  
- Commit: `chore: bump version to 0.7.0`.

---

## Task 1 — Implement `CbaAccordion`

**Scope:** Thin ng-bootstrap accordion wrapper with theme styling, stable public API, tests, and docs.
**Front-end related:** Yes.

### 4.1a — Front-end Technical Specification
**Agent:** frontend-specialist  
- Produce spec covering: selector naming (`cba-accordion`, `cba-accordion-item`), projected content API (title/body), inputs (`closeOthers`), SCSS theming strategy (tokens for header, body, borders, radius), ng-bootstrap dependencies, accessibility notes, test strategy.
- Save to `.kilo/plans/20260731-phase7-task1-frontend-spec.md`.

### 4.1b — Analysis & Implementation Plan
**Agent:** architector  
- Read the frontend spec from 4.1a.  
- Produce detailed plan: folder/files, SCSS tokens to use, ng-bootstrap imports, component structure, test cases, doc updates, build verification.
- Save to `.kilo/plans/20260731-phase7-task1-plan.md`.

### 4.2 — Implementation
**Agent:** implementer  
- Follow the plan from 4.1b exactly.
- Create `src/components/accordion/` with `.ts`, `.html`, `.scss`, `.spec.ts`, `index.ts`.
- Theme accordion surfaces using `--cba-*` tokens (header bg/hover, body spacing, border/radius).
- Export from `src/public-api.ts`.
- Commit with meaningful messages.

### 4.3 — Code Review & Simplification
**Agents:** code-reviewer + code-simplifier (concurrent)  
- Review for plan deviations, errors, style issues, and simplification opportunities.
- Save fix/simplification plans to `.kilo/plans/20260731-phase7-task1-review.md`.
- **Plan Agent** assigns fixes to implementer if needed (max 3 cycles).

### 4.4 — Documentation
**Agent:** docs-specialist  
- JSDoc on component class, all inputs, outputs, projected slots.
- Add usage example with 2–3 items to component doc comment.
- Explicit note: behaviour comes from ng-bootstrap.
- Create `/docs/CBA_ACCORDION.md` with selector, inputs/outputs/slots, minimal example, non-goals.
- Update `README.md` Component Inventory and `docs/USAGE.md` with accordion pattern.

### 4.5a — Front-end Implementation Verification
**Agent:** frontend-specialist  
- Verify implementation against the spec from 4.1a.
- Report diffs and front-end quality issues.

### 4.5b — Overall Plan Adherence
**Agent:** architector  
- Incorporate front-end verification report from 4.5a.
- Check implementation plan adherence; report acceptable deviations.

### 4.6 — Task Completion
**Agent:** implementer  
- Append `[DONE]` to Task 1 in the TODO file.  
- Commit TODO change.

---

## Task 2 — Spanish-only UI copy (no multi-language system)

**Scope:** Centralize library-owned default strings in Spanish; update all components/tests/docs that expose English defaults.  
**Front-end related:** No (string changes across existing components).

### 4.1b — Analysis & Implementation Plan
**Agent:** architector  
- Plan the exact file structure for `src/i18n/ui-messages.ts`.
- List every file to touch: `module-footer.component.ts`, `module-header.component.html`, `cba-modal.component.html`, `cba-datepicker.component.html`, plus their `.spec.ts`, plus `docs/USAGE.md`, `README.md`, `docs/CBA_MODULE_FOOTER.md`.
- Define the Spanish strings for each default:
  - `loading` → `'Cargando…'`
  - `loaded` → `'Listo'`
  - `success` → `'Guardado'`
  - `warning` → `'Requiere atención'`
  - `error` → `'Error'`
  - `dirty` → `'Cambios sin guardar'`
  - aria-labels / titles in ModuleHeader → Spanish equivalents
  - modal close → `'Cerrar'`
  - datepicker open → `'Abrir selector de fecha'`
- Save to `.kilo/plans/20260731-phase7-task2-plan.md`.

### 4.2 — Implementation
**Agent:** implementer  
- Create `src/i18n/ui-messages.ts` with `CBA_UI_MESSAGES` constants object.
- Refactor `module-footer.component.ts` to import defaults from `ui-messages.ts`.
- Update `module-header.component.html` aria-labels and titles to Spanish.
- Update `cba-modal.component.html` close button aria-label to Spanish.
- Update `cba-datepicker.component.html` open button aria-label to Spanish.
- Update `module-footer.component.spec.ts` and `module-header.component.spec.ts` assertions to Spanish strings.
- Update `docs/USAGE.md` status text mapping table to Spanish.
- Update `docs/CBA_MODULE_FOOTER.md` status text mapping to Spanish.
- Update `README.md` with Spanish-only note.
- Export `CBA_UI_MESSAGES` from `public-api.ts` only if it provides consumer value (to be decided during 4.1b; default is yes for transparency).
- Commit with meaningful messages.

### 4.3 — Code Review & Simplification
**Agents:** code-reviewer + code-simplifier (concurrent)  
- Review string changes for correctness, consistency, and adherence to the "no i18n framework" rule.
- Check tests still pass and assert the right strings.
- Save fix/simplification plans to `.kilo/plans/20260731-phase7-task2-review.md`.
- Plan Agent assigns fixes to implementer if needed (max 3 cycles).

### 4.4 — Documentation
**Agent:** docs-specialist  
- Add JSDoc reference to `CBA_UI_MESSAGES`.
- Update `/docs/USAGE.md` with a short "Spanish-only defaults" section.
- Update `README.md` to state: platform is Spanish-only, library default chrome strings are Spanish, overrides via inputs/projection only.
- Ensure all component docs that mention defaults reflect Spanish strings.

### 4.5b — Overall Plan Adherence
**Agent:** architector  
- Check all planned files were touched and strings are Spanish.
- Verify no translation infrastructure was introduced.
- Report deviations.

### 4.6 — Task Completion
**Agent:** implementer  
- Append `[DONE]` to Task 2 in the TODO file.  
- Commit TODO change.

---

## Task 3 — Public API finalization + Package metadata + README/docs completion

**Scope:** Clean exports, verify build output, finalize README and docs index.  
**Front-end related:** No.

### 4.1b — Analysis & Implementation Plan
**Agent:** architector  
- Plan exact `public-api.ts` export list (add accordion, add `CBA_UI_MESSAGES` if useful, remove nothing else unless dead/demo).
- Plan build verification steps (`npm run build`, inspect `dist/`).
- Plan README updates (install, quick start, Spanish-only note, deeper docs links).
- Plan docs index verification (ensure every public component has a `.md` under `/docs` and is linked from README).
- Save to `.kilo/plans/20260731-phase7-task3-plan.md`.

### 4.2 — Implementation
**Agent:** implementer  
- Update `src/public-api.ts`: add accordion export, add `CBA_UI_MESSAGES` export (if decided), remove any accidental/dead exports (audit existing list against intended surface).
- Verify all component class names and selectors are consistent (`Cba*` / `cba-*`).
- Run `npm run build`, inspect `dist/` for correct entry points and theme output.
- Run `npm test`, ensure all tests pass.
- Run `npm run lint`, ensure no new lint errors.
- Update `README.md` with Spanish-only note, install + peer deps, quick start with `ModuleContainer` + `ModuleHeader`, link to `/docs`.
- Ensure `/docs` has clear index or linked set of pages for all public components (including new accordion doc).
- Remove any leftover scaffold/demo code if found (e.g. unused CLI-generated boilerplate).
- Commit with meaningful messages.

### 4.3 — Code Review & Simplification
**Agents:** code-reviewer + code-simplifier (concurrent)  
- Review public-api for correctness and completeness.
- Review build output plan adherence.
- Simplify README/docs where possible.
- Save fix/simplification plans to `.kilo/plans/20260731-phase7-task3-review.md`.
- Plan Agent assigns fixes to implementer if needed (max 3 cycles).

### 4.4 — Documentation
**Agent:** docs-specialist  
- Final pass on README structure and links.
- Ensure `/docs` pages have TOC/index when >100 lines.
- Add AI-agent guidance where missing.

### 4.5b — Overall Plan Adherence
**Agent:** architector  
- Verify build succeeds, leftover scaffold removed, public API matches intended surface.
- Report deviations.

### 4.6 — Task Completion
**Agent:** implementer  
- Append `[DONE]` to Tasks 3, 4, and 5 in the TODO file (they are all within this task cycle).  
- Commit TODO change.

---

## Step 5 — TODO File Completion

**Agent:** implementer  
- Rename TODO file to `20260730-todo-5-DONE.md`.  
- Do not delete or change content other than the rename.
- Ensure all files are committed in the feature branch.
- Switch to `main`, merge `feat/phase7-accordion-spanish-delivery`.
- On success: delete feature branch.
- Push `main` to `origin` only.

---

## Acceptance Criteria Tracker

| # | Criterion | Owner Task |
|---|-----------|------------|
| 1 | `CbaAccordion` exists as thin ng-bootstrap wrapper and compiles. | Task 1 |
| 2 | Library-owned default on-screen strings are Spanish. | Task 2 |
| 3 | Defaults centralized in one constants module (no multi-language framework). | Task 2 |
| 4 | ModuleHeader aria-labels/tooltips and ModuleFooter status defaults are Spanish. | Task 2 |
| 5 | `public-api.ts` exports only intended stable surface. | Task 3 |
| 6 | Package metadata and build output correct for local consumption. | Task 3 |
| 7 | README + docs index/examples complete enough for Shell/MFE/AI usage. | Task 3 |
| 8 | Library build succeeds and leftover scaffold/demo code removed. | Task 3 |
