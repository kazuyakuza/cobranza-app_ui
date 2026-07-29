# Task 1 — Initialize Project Info — 4.1 Analysis & Planning

> **TODO:** `.agent/todos/20260729/20260729-todo-0.md` — Task 1: "initialize project info"
> **Branch:** `feat/ui-library-setup`
> **Date:** 2026-07-29
> **Agent (this step):** architector (analysis & planning only)

---

## Pre-Analysis

### Repository State (verified)

- `feat/ui-library-setup` already created and checked out; working tree clean (Step 2 done).
- `src/` contains only `.gitkeep`.
- `.agent/project-info/` currently has: `brief.md` (rich, 312 lines), `instructions.md`, `.initialized`.
- No `package.json` / `ng-package.json` at repo root (`.kilo/package.json` is a Kilo internal file — unrelated).
- `README.md` is still the base-project template (replaced in Task 2, not here).
- `.agent/project-structure.md` lists no `src/` folders yet.

### Ambiguities Identified

1. **`product.md` audience:** The brief states "desktop-only, internal back-office". Product.md must reflect that consumers of this **library** are *developers* (Shell + MFE teams), while the *end users* are back-office operators. The plan will document both layers to avoid confusion.
2. **Exact Angular/Bootstrap/FA minor versions:** The brief pins majors only (Angular 22, Bootstrap 5, ng-bootstrap v21). tech.md will record majors + "latest compatible minor as of July 2026" rather than guessing a specific patch, and explicitly flag that exact pinning happens at Task 4 (`package.json`).
3. **`mfe-events` package not yet published:** brief notes `@cobranza-apps/mfe-events` is "not available yet". architecture.md must state this as an open dependency and not invent integration details.
4. **Drag & Drop ownership:** Brieft says D&D is owned by the Shell + `mfe-events`, NOT this library. architecture.md must not place any D&D contract here.

### Technical & Architecture Decisions (carried from brief + global plan)

- Angular **22**, **standalone components only** (no NgModules).
- Library build via **`ng-packagr`**, single public entry point (`src/lib/public-api.ts`) initially.
- Theme = SCSS + CSS Variables under `--cba-` prefix; encapsulated per consumer.
- Bootstrap 5 + `@ng-bootstrap/ng-bootstrap` v21; **never jQuery**.
- Font Awesome Free (solid + regular) via `@fortawesome/angular-fontawesome`.
- Jest for unit tests "where useful"; no Storybook.
- Desktop-only; WCAG AA readability target.
- Peer dependencies only for runtime libs; devDependencies for build/test tooling.

---

## What This Task Produces (Scope)

Create **4** new core project-info files and remove **1** marker file:

| Action | Path | Owner outside this plan |
| --- | --- | --- |
| Create | `.agent/project-info/product.md` | implementer (4.2) |
| Create | `.agent/project-info/context.md` | implementer (4.2) |
| Create | `.agent/project-info/architecture.md` | implementer (4.2) |
| Create | `.agent/project-info/tech.md` | implementer (4.2) |
| Delete | `.agent/project-info/.initialized` | implementer (4.2) |

`brief.md` (already authored, source of truth) is **not modified** in this task.

---

## Detailed Implementation Plan (for 4.2 implementer)

### Step 0 — Git Hygiene

- Run `git status`; confirm clean tree on `feat/ui-library-setup`. Nothing to commit yet (no code files in this task).
- `.agent/project-info/*.md` files are tracked content (not gitignored) — safe to add.

### Step 1 — Create `.agent/project-info/product.md`

**Purpose:** product goals, UX focus, problem definition, target consumers.

**Required sections & content (from brief):**

1. **Title + one-line summary:** `# @cobranza-apps/ui — Product Info`.
2. **Problem Definition**
   - Multiple Shell + MFE teams duplicate visual components and theme tokens.
   - Inconsistent intermediate-gray theme across back-office modules.
   - Need a single source of truth for shared UI primitives to keep UX coherent.
3. **Product Goals**
   - Provide a coherent, calm, professional gray design system (`--cba-` tokens).
   - Ship reusable layout primitives (`ModuleHeader`, `ModuleContainer`) for the floating workspace.
   - Thin, low-coupling wrappers around Bootstrap/ng-bootstrap to avoid business logic bleeding.
   - Keep theme encapsulated so each consumer controls its own import.
4. **Target Consumers** (two layers — must distinguish)
   - *Library consumers:* Company Back-office **Shell** team + every **MFE** team.
   - *End users:* Back-office operators (desktop-only, desktop-first).
5. **In Scope / Out of Scope** — mirror brief sections 2.1 & 2.2 verbatim in summary form (no business logic, no BFF comms, no advanced tables, no D&D, no workspace state, no mobile).
6. **UX Focus** — brief section 3: "modern professional, calm, friendly"; order & clarity; balanced spacing; high readability; desktop-only; encapsulated theme; thin wrappers first.
7. **Accessibility Goals** — WCAG AA readability target; visible focus rings (`--cba-focus-ring`); `aria-*` on interactive `ModuleHeader` controls; keyboard-operable buttons.
8. **Cross-reference:** link to `brief.md` (source of truth), `architecture.md`, `tech.md`.

### Step 2 — Create `.agent/project-info/context.md`

**Purpose:** factual log of current focus, recent changes, immediate next steps.

**Required sections & content:**

1. **Title:** `# @cobranza-apps/ui — Context`.
2. **[Project Info: Active]** marker note (per instructions.md).
3. **Current Work Focus**
   - Bootstrapping the library: project info initialization (this TODO Task 1).
   - Repository is pre-`package.json`; `src/` empty except `.gitkeep`.
4. **Recent Changes** (factual, from git + global plan)
   - Cleaned up base-project template files.
   - Created `feat/ui-library-setup` branch.
   - Authored `brief.md`.
5. **Immediate Next Steps** (the remaining TODO tasks, in order)
   - Task 2: Update README for `@cobranza-apps/ui` consumers.
   - Task 3: Define project structure (folders under `src/lib/`).
   - Task 4: Create `package.json` + `ng-package.json`, install dependencies.
6. **Open Items / Risks**
   - `@cobranza-apps/mfe-events` not yet published — workspace event contracts deferred.
   - Exact minor/patch versions of Angular 22 / Bootstrap 5 / ng-bootstrap v21 to be finalized in Task 4.
7. **Cross-reference:** link to `brief.md`, `architecture.md`, `tech.md`, TODO file, global plan.

### Step 3 — Create `.agent/project-info/architecture.md`

**Purpose:** Angular library architecture, standalone, ng-packagr, theme encapsulation, public API strategy, Shell/MFE integration patterns.

**Required sections & content:**

1. **Title:** `# @cobranza-apps/ui — Architecture`.
2. **High-Level Architecture**
   - Single publishable Angular library (`@cobranza-apps/ui`) consumed by Shell + MFEs.
   - No NgModules — **standalone components only**.
   - One public entry point (`src/lib/public-api.ts`) re-exporting components, theme, directives.
3. **Folder/Layout (from brief section 7)**
   ```
   src/lib/
     components/   (module-header, module-container, button, card, badge, empty-state, skeleton, modal, ...)
     theme/        (_variables.scss, _utilities.scss, _mixins.scss, theme.scss)
     directives/   (autofocus, click-outside, ...)
     public-api.ts
   ```
   Detailed folder creation happens in Task 3; this file documents intent.
4. **Build Strategy**
   - `ng-packagr` → `dist/`. `ng-package.json` points to `src/lib/public-api.ts`.
   - Concrete config created in Task 4.
5. **Public API Strategy**
   - Now: single barrel `public-api.ts`.
   - Later: secondary entry points (`@cobranza-apps/ui/button`, `.../theme`) if bundle size becomes an issue.
6. **Theme Encapsulation**
   - Theme = SCSS + CSS variables under `--cba-` prefix.
   - Published as importable SCSS; consumers import explicitly.
   - Prefer `ViewEncapsulation.Emulated` per component; global styles only when strictly necessary.
   - Tokens catalog: backgrounds, text, borders, accents, interactive states, layout constants, radius, shadows, spacing scale (reference brief section 5 — do NOT redefine values in this file; point to brief).
7. **Integration Patterns (Shell ↔ MFE)**
   - Shell imports library; uses `ModuleHeader` + `ModuleContainer` to host each remote MFE.
   - Each MFE also imports the encapsulated theme and may use basic components.
   - Resize/collapse/fullscreen state:
     - Inputs (Shell → MFE) via component `@Input()`.
     - MFE → Shell via custom events defined in `@cobranza-apps/mfe-events` (not yet published — open dependency).
   - This library emits **only pure UI events** from `ModuleHeader` (`collapseToggle`, `sizeToggle`, `remove`, `fullscreenToggle`); never dispatches workspace/routing events.
   - **Drag & Drop does NOT belong here** — owned by Shell + `mfe-events`.
8. **Component Contracts (summary)**
   - `ModuleHeader`: inputs `title`, `size`, `isCollapsed`, `isFullscreen`, `status`; outputs `collapseToggle`, `sizeToggle`, `remove`, `fullscreenToggle`; min height 40px; visual behaviour per brief 6.1.
   - `ModuleContainer`: inputs `size`, `isCollapsed`, `isFullscreen`, `padding`; manages size classes, collapsed body, radius+shadow when not fullscreen, internal scroll.
   - Other components (brief 6.3): `CbaButton`, `CbaCard`, `CbaBadge`, `CbaEmptyState`, `CbaSkeleton`, `CbaModal`, form control wrappers.
9. **Related Libraries**
   - `@cobranza-apps/entities` (shared domain models — already on npm).
   - `@cobranza-apps/mfe-events` (event contracts — not yet published, fetch-only expectation).
10. **Cross-reference:** link to `brief.md` (tokens + component specs source of truth), `tech.md`, `product.md`.

### Step 4 — Create `.agent/project-info/tech.md`

**Purpose:** exact stack versions, dev setup, peer/dev dependencies, tooling constraints.

**Required sections & content:**

1. **Title:** `# @cobranza-apps/ui — Tech Stack`.
2. **Stack (versions)**
   | Technology | Version / Choice | Notes |
   | --- | --- | --- |
   | Angular | 22 (latest compatible minor, to pin in Task 4) | Standalone only |
   | Bootstrap | 5.x | CSS-only; never jQuery |
   | @ng-bootstrap/ng-bootstrap | v21 | Forms/overlays |
   | @fortawesome/angular-fontawesome | latest compatible w/ Angular 22 | solid + regular packs |
   | ng-packagr | latest compatible w/ Angular 22 | library build |
   | TypeScript | ~5.x (aligned to Angular 22) | |
   | SCSS | built-in | theme + optional mixins |
   | Jest | latest | unit tests where useful |
   | Node | LTS compatible with Angular 22 | |
3. **Peer Dependencies (runtime, expected by consumers)**
   - `@angular/core`, `@angular/common`, `@angular/forms`
   - `bootstrap` (CSS)
   - `@ng-bootstrap/ng-bootstrap`
   - `@fortawesome/angular-fontawesome` (+ `free-solid-svg-icons`, `free-regular-svg-icons`)
4. **Dev Dependencies (build/test tooling)**
   - Angular CLI, `ng-packagr`, TypeScript, `@types/*`
   - Jest (+ preset/config for Angular)
   - SCSS tooling (provided by Angular/ng-packagr)
   - Exact pins set in Task 4 (`package.json`).
5. **Scripts (planned, finalized in Task 4)**
   - `build` (ng-packagr), `test` (Jest), `lint`, `format`.
6. **Development Setup**
   - Clone → `npm install` (after Task 4 creates `package.json`).
   - `npm run build` outputs `dist/` via `ng-package.json`.
   - Local consumption: `npm link` or `npm pack` for Shell/MFE integration (documented later in `/docs/USAGE.md`).
7. **Tooling Constraints**
   - Desktop-only; no mobile/responsive test matrix.
   - No jQuery; no ngx-bootstrap.
   - No Storybook for now.
   - Manual QA first; Playwright later.
   - JSDoc on every public `@Input()` / `@Output()` / component.
   - File/line rules from `.kilo/rules/` (max 200 lines per `src/` file, max 50 lines per method, max 2 params, max depth 2, private members by default) — reference the rules, do not re-list every rule body.
8. **Cross-reference:** link to `brief.md`, `architecture.md`.

### Step 5 — Remove `.agent/project-info/.initialized`

- Delete file `.agent/project-info/.initialized` (signals formal initialization complete).
- Verify the 5 core files now exist: `brief.md`, `product.md`, `context.md`, `architecture.md`, `tech.md`.

### Step 6 — Verify Consistency (implementer self-check before commit)

- All 5 core files present; `.initialized` absent.
- No file contradicts `brief.md` (brief is source of truth — instructions.md).
- All files cross-reference siblings and `brief.md`.
- No invented version numbers (majors only; exact pinning deferred to Task 4).
- No mention of building `package.json` / folders in `src/` (those are Tasks 2–4).

### Step 7 — Commit

- Single meaningful commit on `feat/ui-library-setup`, e.g.:
  `docs(project-info): initialize product/context/architecture/tech files`
- Follow gitignore compliance: ensure no `node_modules/` / lock files staged (none exist yet, but verify).

---

## Out of Scope for This Task (explicit, to prevent scope creep)

- ❌ Do NOT create or modify `package.json`, `ng-package.json`, or any `src/` file/folder (Tasks 3–4).
- ❌ Do NOT modify `README.md` (Task 2).
- ❌ Do NOT modify `brief.md` (source of truth — already authored).
- ❌ Do NOT modify `instructions.md`.
- ❌ Do NOT modify `.agent/project-structure.md` (Task 3).
- ❌ Do NOT append `[DONE]` to the TODO line (that is step 4.6).
- ❌ Do NOT call `plan_exit`.

## Acceptance Criteria (for 4.5 verification later)

1. `.agent/project-info/product.md` exists with product goals, UX focus, target consumers, problem definition.
2. `.agent/project-info/context.md` exists with current focus, recent changes, next steps referencing the remaining TODO tasks.
3. `.agent/project-info/architecture.md` exists covering standalone, ng-packagr, theme encapsulation, public API strategy, Shell/MFE integration patterns.
4. `.agent/project-info/tech.md` exists with stack versions, peer/dev deps, tooling constraints (majors only; pinning deferred to Task 4).
5. `.agent/project-info/.initialized` is removed.
6. All files cross-reference `brief.md` and each other; no contradictions with `brief.md`.
7. No `src/`, `package.json`, or `README.md` changes in this task's commits.
8. Single meaningful commit on `feat/ui-library-setup`.
9. Output is plain Markdown with real newlines (no literal `\n`).

---

## Summary

This step (4.1) only generates this plan file. The implementing agent (4.2) will follow Steps 0–7 above to create the four core project-info files and delete `.initialized`, then commit on `feat/ui-library-setup`.