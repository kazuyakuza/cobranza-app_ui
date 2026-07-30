# Global Plan — Phase 3: ModuleContainer (3-Block Structure)

**Source TODO:** `.agent/todos/20260730/20260730-todo-1.md`
**Date:** 2026-07-30

---

## Pre-Analysis

### Technical Context
- Angular 22 standalone library (`@cobranza-apps/ui`).
- `ModuleHeader` (Phase 2) already implemented in `src/lib/components/module-header/` using `ChangeDetectionStrategy.OnPush`, `input()` signals, SCSS with `--cba-*` tokens.
- Theme tokens are live in `src/lib/theme/_variables.scss`.
- Testing: Jest + `TestBed`, pattern established by `module-header.component.spec.ts`.
- Docs pattern: `docs/MODULE_HEADER.md` exists; README links to docs.
- Component barrel: each component folder exports via `index.ts`; `public-api.ts` re-exports.
- Project structure: `src/lib/components/module-container/` is already listed in `.agent/project-structure.md`.

### Architecture Decisions (Global)
- **Standalone component**, no NgModule.
- **Content projection** via `<ng-content select="[cbaModuleContainerHeader]">` and `<ng-content>` default for body.
- **Host bindings** for size classes (`cba-module-container--size-50`, `cba-module-container--size-100`) and fullscreen/collapsed state.
- **SCSS** uses only `--cba-*` tokens.
- **ChangeDetection: OnPush** — component has no outputs, only input-driven visual changes; signals (`input()`) fit cleanly.
- **Padding mapping**: `none` → `0`, `sm` → `var(--cba-space-2)`, `md` → `var(--cba-space-4)`.
- **Scrollbar styling**: CSS-only thin scrollbar with hover enlargement.

### Front-end Task Marker
This task is **front-end related** — sub-steps 4.1a and 4.5a are required.

---

## Global Workflow Steps

### Step 2: Git Feature Branch Setup
- **Sub-agent:** implementer
- Ensure `main` is clean; create `feat/phase3-module-container`.

### Step 3: Version Update
- **Sub-agent:** implementer
- Bump `package.json` version: `0.3.0` → `0.4.0` (new component = minor semver bump).
- Commit: `chore: bump version to 0.4.0`.

---

## Block A: Component + Template (Tasks 1–2)

**Scope:** Create the standalone component, declare all inputs, add JSDoc, set up content projection for header and body, implement collapsed/fullscreen template logic.

### A.1a Front-end Technical Specification
- **Sub-agent:** frontend-spec
- Produce `20260730-phase3-blocka-frontend-spec.md` with:
  - Selector, inputs, content projection API (exact attribute selectors)
  - Host bindings & CSS class strategy
  - Template structure and conditional rendering logic

### A.1b Implementation Plan
- **Sub-agent:** architector
- Read A.1a spec; produce `20260730-phase3-blocka.md` with:
  - File list: `.ts`, `.html`, `.scss`, `index.ts`, `types.ts`
  - Exact code snippets for component class, template, types
  - Step-by-step creation order
- Return plan path; present to user for approval.

### A.2 Implementation
- **Sub-agent:** implementer
- Follow A.1b plan; commit incrementally.
- Create files under `src/lib/components/module-container/`.
- Update `src/lib/public-api.ts`.

### A.3 Code Review & Simplification
- **Sub-agents:** code-reviewer + code-simplifier (concurrent)
- Save review plan to `20260730-phase3-blocka-review.md`.
- Plan Agent assigns fixes to implementer.

### A.4 Documentation
- **Sub-agent:** docs-specialist
- Verify JSDoc on component class and every public `@Input()`.

### A.5a Front-end Implementation Verification
- **Sub-agent:** frontend-specialist
- Compare against A.1a spec; report diffs.

### A.5b Overall Plan Adherence
- **Sub-agent:** architector
- Check A.1b plan adherence.

### A.6 Task Completion
- **Sub-agent:** implementer
- Mark Block A tasks `[DONE]` in TODO file; commit.

---

## Block B: Styling + Behaviour (Tasks 3–9)

**Scope:** Size classes (50%/100%), chrome (border/radius/shadow when not fullscreen), padding mapping, internal scroll, integration with ModuleHeader, SCSS token usage, public API export.

### B.1b Implementation Plan
- **Sub-agent:** architector
- Produce `20260730-phase3-blockb.md` with:
  - Host class bindings for size
  - Chrome logic (fullscreen suppresses border-radius/shadow)
  - Padding CSS classes and token mapping
  - Scroll container CSS (thin scrollbar, hover enlargement)
  - Export verification

### B.2 Implementation
- **Sub-agent:** implementer
- Follow B.1b plan; update `.scss`, `.ts`, `public-api.ts`.
- Commit incrementally.

### B.3 Code Review & Simplification
- **Sub-agents:** code-reviewer + code-simplifier (concurrent)
- Save review plan to `20260730-phase3-blockb-review.md`.
- Plan Agent assigns fixes to implementer.

### B.4 Documentation
- **Sub-agent:** docs-specialist
- Verify style documentation and token usage notes in code comments.

### B.5b Overall Plan Adherence
- **Sub-agent:** architector
- Check B.1b plan adherence.

### B.6 Task Completion
- **Sub-agent:** implementer
- Mark Block B tasks `[DONE]` in TODO file; commit.

---

## Block C: Documentation & Tests (Task 10)

**Scope:** Create `docs/MODULE_CONTAINER.md`, update README links, add focused unit tests (size class, collapsed body, fullscreen chrome, padding classes).

### C.1b Implementation Plan
- **Sub-agent:** architector
- Produce `20260730-phase3-blockc.md` with:
  - Doc file structure (TOC, usage example, inputs table, behaviour notes)
  - Test file structure (focused tests for size, collapse, fullscreen, padding)
  - README.md update steps

### C.2 Implementation
- **Sub-agent:** implementer
- Follow C.1b plan; create `docs/MODULE_CONTAINER.md`, update README, write spec file.
- Verify `npm run build` and `npm test` pass.
- Commit incrementally.

### C.3 Code Review & Simplification
- **Sub-agents:** code-reviewer + code-simplifier (concurrent)
- Save review plan to `20260730-phase3-blockc-review.md`.
- Plan Agent assigns fixes to implementer.

### C.4 Documentation
- **Sub-agent:** docs-specialist
- Verify `docs/MODULE_CONTAINER.md` completeness and README link.

### C.5b Overall Plan Adherence
- **Sub-agent:** architector
- Check C.1b plan adherence.

### C.6 Task Completion
- **Sub-agent:** implementer
- Mark Block C (Task 10) `[DONE]` in TODO file; commit.

---

## Step 5: TODO File Completion

- **Sub-agent:** implementer
- Rename TODO file to `20260730-todo-1-DONE.md`.
- Ensure all files committed in `feat/phase3-module-container`.
- Merge into `main`; on success, delete feature branch.
- Push `main` to `origin` only.

---

## Acceptance Criteria (from TODO)

| # | Criterion |
| --- | --- |
| 1 | `cba-module-container` standalone component exists and compiles. |
| 2 | All inputs match the API table (size, isCollapsed, isFullscreen, padding). |
| 3 | Header and body can be projected cleanly. |
| 4 | `size` switches between 50% and 100% layout behaviour. |
| 5 | Body is hidden / non-scrollable when `isCollapsed` is true. |
| 6 | Border-radius + module shadow apply only when not fullscreen. |
| 7 | Body is the internal scroll container when expanded. |
| 8 | `padding` input controls body padding with token-based values. |
| 9 | Styles use only theme tokens. |
| 10 | Component is exported from `public-api.ts`. |
| 11 | Library build succeeds. |
| 12 | Basic usage documentation and minimal unit tests are present. |
