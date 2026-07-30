# Global Plan — Phase 2: ModuleHeader Implementation

## Task Origin

- **TODO file**: `.agent/todos/20260730/20260730-todo-0.md`
- **Goal**: Implement the fully working `ModuleHeader` standalone Angular component.

## Global Pre-Analysis

The TODO file lists 8 sub-tasks under a single `## Tasks` section. These are sequential implementation steps for one component (`Generate`, `Template`, `Status icons`, `Action buttons`, `Visual rules`, `Styles`, `Export`, `Docs & tests`). They are tightly coupled and do not represent independent deliverables. They will be executed within **a single 4.1–4.6 cycle** to avoid redundant branch/commits/reviews.

- **Front-end related**: Yes.
- **Key technical decisions**:
  - Standalone Angular component with `ChangeDetectionStrategy.OnPush`.
  - SCSS styles using only `--cba-*` CSS custom properties.
  - Font Awesome icons via `@fortawesome/angular-fontawesome` (`fa-icon` component).
  - Selector: `cba-module-header`.
  - Location: `src/lib/components/module-header/`.
  - Barrel export via `index.ts`; re-exported from `src/lib/public-api.ts`.
- **Architecture decisions**:
  - No drag handle / `dragStart` (out of scope per brief).
  - Title is never editable from the header.
  - Fullscreen mode renders **only** the title (no status, no actions).
  - Desktop-only; no responsive considerations.
- **Dependencies already present**: `@fortawesome/angular-fontawesome`, free-solid/regular packs.
- **Current state**: `module-header/` folder exists with empty `index.ts`; `public-api.ts` is empty; no tests exist yet.

---

## Step 2: Git Feature Branch Setup

**Sub-agent**: `implementer`

- `main` is master branch.
- Run `git status`: commit unstaged files with meaningful message (follow Gitignore Compliance Rule).
- Switch to `main` (already there per current state).
- Create branch: `feat/phase2-module-header`.
- Switch to new branch.

---

## Step 3: Version Update

**Sub-agent**: `implementer`

- Version exists in `package.json` (`0.2.0`).
- Increment per semver: **minor** (new feature — `ModuleHeader` component).
- New version: `0.3.0`.
- Commit as `chore: bump version to 0.3.0`.

---

## Task: Phase 2 — ModuleHeader

### 4.1a. Front-end Technical Specification

**Sub-agent**: `frontend-specialist`

- Analyze task requirements from TODO and brief.md.
- Produce **Front-end Technical Specification**.
- Save spec to `.kilo/plans/20260730-phase2-moduleheader-frontend-spec.md`.
- Return spec path to Plan Agent.

### 4.1b. Analysis & Planning

**Sub-agent**: `architector`

- Read front-end spec from 4.1a.
- Identify ambiguities; analyze project status; research required techs.
- Generate detailed implementation plan covering all 8 sub-tasks from the TODO:
  1. Generate component (`module-header.component.ts|html|scss`)
  2. Template structure (status | title | actions)
  3. Status icons (Font Awesome mapping, colors, spin animation)
  4. Action buttons (collapse, size, remove, fullscreen — outputs)
  5. Visual behaviour rules (collapsed, 50%/100%, fullscreen, min-height)
  6. Styles (theme tokens only, flexbox)
  7. Export (`index.ts`, `public-api.ts`)
  8. Documentation & tests (JSDoc, docs file, focused unit tests)
- Save plan to `.kilo/plans/20260730-phase2-moduleheader.md`.
- Return plan path.
- **Plan Agent will present plan to user for approval** (auto-approve only if TODO includes "Don't request me to approve plans" — it does not).

### 4.2. Implementation

**Sub-agent**: `implementer`

- Follow steps from the implementation plan generated in 4.1b.
- Create/modify files:
  - `src/lib/components/module-header/module-header.component.ts`
  - `src/lib/components/module-header/module-header.component.html`
  - `src/lib/components/module-header/module-header.component.scss`
  - `src/lib/components/module-header/index.ts` (update barrel)
  - `src/lib/public-api.ts` (add re-export)
  - `src/lib/components/module-header/module-header.component.spec.ts` (tests)
  - `docs/MODULE_HEADER.md` (usage docs)
  - Update `README.md` / `docs/USAGE.md` with link to new doc.
- Commit with meaningful messages between logical steps.

### 4.3. Code Review & Simplification

**Sub-agents**: `code-reviewer` + `code-simplifier` (concurrent)

- **Code-reviewer**: review for errors/deviations from the implementation plan.
- **Code-simplifier**: review sources to simplify code where possible or makes sense.
- Both generate a fix/simplification plan.
- Save in `.kilo/plans/20260730-phase2-moduleheader-fix.md` and/or `.kilo/plans/20260730-phase2-moduleheader-simplify.md`.
- Plan Agent reviews and assigns fix/simplification plans to implementer.

#### 4.3-fix

**Sub-agent**: `implementer`

- Apply fixes from code-reviewer and simplifications from code-simplifier.
- Max 3 review cycles; escalate to user if needed.

### 4.4. Documentation

**Sub-agent**: `docs-specialist`

- Add JSDoc comments in component source files (class, inputs, outputs).
- Create/update project documentation:
  - `docs/MODULE_HEADER.md` with usage, API table, status semantics, fullscreen note, drag note.
  - Link in `README.md` and `docs/USAGE.md`.
- Include guides and real examples for AI agents.

### 4.5a. Front-end Implementation Verification

**Sub-agent**: `frontend-specialist`

- Verify implementation against the spec file from 4.1a.
- Report diffs between spec and implementation, and front-end quality issues.
- Return report to Plan Agent.

### 4.5b. Overall Plan Adherence

**Sub-agent**: `architector`

- Read front-end verification report from 4.5a.
- Check implementation plan adherence.
- Report found diffs, if any.
- Report if deviations are acceptable. If not, propose changes in a new TODO file.

### 4.6. Task Completion

**Sub-agent**: `implementer`

- Add `[DONE]` to each `###` task heading in the TODO file (`20260730-todo-0.md`).
- Mark sub-items (`- [ ]`) as `[x]` where completed.
- Preserve original file content; only add `[DONE]` marks.
- Commit changes with meaningful message.

---

## Step 5: TODO File Completion

**Sub-agent**: `implementer`

- Rename TODO file to `20260730-todo-0-DONE.md`.
- Ensure all files are committed in feature branch.
- Merge feature branch:
  1. Switch to `main`.
  2. Merge `feat/phase2-module-header`:
     - On success: delete feature branch.
     - On failure: notify user.
- Push `main` to `origin` ONLY (per Git Remote Safety Rule). Notify user if push fails.

---

## Continuation

After Step 5, the user will be prompted to proceed with the next undone TODO file in a new chat.

## Approval

This plan requires user approval before execution. Please select an option below.
