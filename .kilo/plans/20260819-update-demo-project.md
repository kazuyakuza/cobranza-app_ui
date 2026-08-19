# Global Plan — Update Demo Project

**TODO file:** `.agent/todos/20260819/20260819-todo-0.md`
**Date:** 2026-08-19
**Current version:** 0.18.0
**Target version:** 0.18.1 (patch — demo content update, no API changes)

---

## Task Summary

Update the Angular demo app at `projects/demo/` so its visual examples match the exact specification in the TODO file. The demo must use **English only** and showcase all library components and theme tokens in the prescribed order.

**Front-end related:** Yes.

---

## Pre-Analysis

### Current State
- The demo app (`projects/demo/`) exists and consumes the built `@cobranza-apps/ui` library.
- Current demo has Spanish text ("Buscar cliente…", "Nuevo cliente", etc.) and a subset of the required sections.
- Missing sections: pills over different backgrounds, button/pill size variants, predefined icons grid, complete table, navigation items, inputs over different backgrounds, form example.
- Module examples do not follow the exact order/specification from the TODO.
- Token swatches do not show hex values or tag-style pills.
- Header lacks a back button; search bar is not centered at ~50% width.
- Footer nav is left-aligned, not centered.

### Technical Decisions
- Continue using existing demo-only components (`demo-section`, `demo-swatch`, `demo-button-matrix`, `demo-module-card`) where appropriate; extend or create new demo-only components for the new sections.
- Use real library components (`cba-button`, `cba-badge`, `cba-input`, `cba-select`, `cba-module-container`, `cba-module-header`, `cba-module-footer`, `cba-card`, `cba-empty-state`, `cba-skeleton`) throughout.
- All new demo-only components are **not** part of the public library API.
- Text content must be entirely in English per TODO note.
- No library source code changes; only `projects/demo/` files are modified.

---

## Steps

### Step 2: Git Feature Branch Setup
- Ensure working tree is clean; commit any unstaged changes.
- Switch to `main`; create `feat/update-demo-project` branch.

### Step 3: Version Update
- Bump `package.json` version from `0.18.0` → `0.18.1`.
- Add `[0.18.1] — 2026-08-19` header to `CHANGELOG.md` with "Changed" entry describing the demo update.
- Commit: `chore: bump version to 0.18.1`.

### Task 1: Update Demo Project Content

#### 4.1a. Front-end Technical Specification
- Generate a detailed front-end spec covering every section from the TODO.
- Define exact module example order, header/footer layout, and each showcase section.
- Save to `.kilo/plans/20260819-update-demo-frontend-spec.md`.

#### 4.1b. Analysis & Planning
- Analyze existing demo files; identify reusable vs. new components.
- Plan file changes: `app.component.ts`, `app.component.html`, `app.component.scss`, and new demo-only components.
- Save detailed implementation plan to `.kilo/plans/20260819-update-demo-task1-plan.md`.

#### 4.2. Implementation
- Update `projects/demo/src/index.html` lang to `en`.
- Update `app.component.html` / `.ts` / `.scss` to match the spec:
  1. **Header bar**: back btn (primary style, "Back" text), label "Cobranza - Back Office", centered search bar (~50% width), notifications + profile icons.
  2. **Workspace modules** in exact order:
     - Expanded 100% with header + footer (table content).
     - Collapsed 100%.
     - Two expanded 50% with header + footer.
     - Two collapsed 50% with header + footer.
     - Expanded 50% with header + footer + empty right space.
     - Collapsed 50% with header + footer + empty right space.
  3. **Token color grid**: color swatch, name, tag-style badge, hex value.
  4. **Button section**: all variants × all backgrounds × status variants (normal, disabled, loading). Labels: btn name, tag style, status name, bkg name.
  5. **Pills section**: same matrix as buttons (status, variants, over diff backgrounds).
  6. **Size variants section**: sm/md sizes for buttons and pills.
  7. **Icons section**: grid of predefined Font Awesome icons used by the library.
  8. **Texts section**: font/label variants over different backgrounds and statuses.
  9. **Complete table example**: multi-column table with badges, actions, etc.
  10. **Navigation items section**: complete example of defined navigation items.
  11. **Inputs over backgrounds**: input variants on different `cba-bg-*` surfaces.
  12. **Form example**: full form using inputs, selects, labels, hints, errors.
  13. **Footer bar**: centered buttons/nav pills.
- All text in English.
- Create new demo-only components as needed (e.g., `demo-pill-matrix`, `demo-size-variants`, `demo-icon-grid`, `demo-nav-items`, `demo-form-example`).
- Commit changes with meaningful messages.

#### 4.3. Code Review & Simplification
- Code-reviewer checks for plan adherence, English text compliance, and correct component usage.
- Code-simplifier looks for redundant code, oversized methods, and style consolidation.
- Generate fix/simplification plans; assign to implementer for fixes.

#### 4.4. Documentation
- Add/update JSDoc on new demo-only components.
- Update `projects/demo/README.md` if it exists to reflect the new sections.

#### 4.5a. Front-end Verification
- Verify the demo app renders every section in the correct order.
- Verify English-only text.
- Verify real library components are used (no fake CSS buttons).
- Run `npm run build:demo` and confirm it passes.

#### 4.5b. Overall Plan Adherence
- Architector confirms all TODO requirements are met.
- Report any deviations.

#### 4.6. Task Completion
- Mark task as `[DONE]` in TODO file.
- Commit.

### Step 5: TODO File Completion
- Rename TODO file to `20260819-todo-0-DONE.md`.
- Merge `feat/update-demo-project` into `main`.
- Push `main` to `origin`.

### Step 6: Finish
- Provide a short resume.
