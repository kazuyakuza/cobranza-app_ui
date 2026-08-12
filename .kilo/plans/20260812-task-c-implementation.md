# Task C — Implementation Plan: Update project-info to prevent future cross-file drift

**Date:** 2026-08-12
**Branch:** `feat/project-audit-and-fixes`
**Source global plan:** `.kilo/plans/20260812-project-audit-and-fixes.md` (Task 7)
**Sub-agent step:** 4.1b — Analysis & Planning (architector)
**Front-end:** Yes (docs/process, no component code)

---

## High-Level Approach

Task 7 of the global audit addresses a **process gap**, not a code bug: prior sprints updated tokens, docs, and the preview HTML independently, so they drifted out of sync. The remediation is to encode four durable guardrails into the project-info files so future changes are validated against a checklist before commit:

1. **Authoritative source note** in `brief.md` §5 — declares `_variables.scss` as the single token source of truth.
2. **Token Change Checklist** in `brief.md` §8.1 — a mandatory verification list authors must run when any `--cba-*` token is added/removed/changed.
3. **Audit record + open risk** in `context.md` — registers the 2026-08-12 audit as completed risk remediation and records the residual procedural risk.
4. **AI agent cross-file sync instruction** in `instructions.md` — mandates a cross-file grep before committing any change that touches `src/theme/`, `src/components/**/*.scss`, or `docs/theme-preview.html`.

A single CHANGELOG entry is appended to the existing `## [0.15.0] — 2026-08-12` block recording these project-info guardrails (per `changelog-versioning.md`: same dated header, no `[Unreleased]`).

All changes are documentation/process files only — no source code, no SCSS, no build/test step required. Verification reduces to a manual proofread + `git status` review.

---

## Pre-Analysis: Technical & Architecture Decisions

- **Why project-info and not rules/.kilo:** `.agent/project-info/` is the project-wide onboarding funnel that AGENTS.md mandates every agent read at task start (see `instructions.md` §"Initial Instruction"). Rules under `.kilo/rules/` are also read, but the cross-file drift problem spans tokens ↔ docs ↔ preview, which is a *project-brief scope concern* (brief.md §5 is the token source of truth + §8 integration notes). Placing the checklist in brief.md §8.1 keeps it adjacent to the integration contract it protects.
- **Why instructions.md gets the grep mandate:** `instructions.md` already defines the "before starting any task" read protocol and a "Critical Closing Step" for context updates. The cross-file sync check is a natural sibling: a pre-commit verification step performed by AI agents. It belongs with the other AI-agent behaviour rules there, not in `brief.md` (which is a spec, not a behaviour file).
- **Why context.md records the audit:** `instructions.md` §"Critical Closing Step" mandates context.md be updated with recent changes and current state. Recording the audit + open risk satisfies that obligation and gives the next session a starting point.
- **No version bump:** version is already `0.15.0` (Task 1 of the audit bumped it). This task appends to the existing `0.15.0` CHANGELOG block per `changelog-versioning.md` (no new dated header, no `[Unreleased]`).
- **Insertion strategy:** every edit is an *append* to an existing section (no deletion, no rewrite). This honours the `overwrite-todo-file-prevention`/preserve-existing-code spirit and keeps the diff minimal and reviewable.
- **File-line anchors verified against current file contents** (read during planning). Implementer MUST re-read each target file's anchor lines immediately before editing to confirm the anchors have not shifted (Tasks 1–6 may have touched these files first in the same audit cycle).

---

## Step-by-Step Implementation

### Step 1 — Git: confirm clean working state on the feature branch

Responsible: implementer (4.2). No code change in this step — confirms branch context.

1. From the repo root run `git status` (single command, PowerShell-safe).
2. Confirm the current branch is `feat/project-audit-and-fixes`. If not, do NOT switch branches — return a question to the caller (branch setup is step 2 of the critical workflow, already done).
3. Confirm no untracked files are staged that match `.gitignore` (per `gitignore-compliance.md`).
4. If there are unstaged changes from prior audit tasks, commit them first with a meaningful message (`feat(audit): <task N> <short summary>`) before starting this task's edits. This task MUST land in its own commit.

**Verification:** `git status` shows a clean tree (or only this task's new edits) before proceeding to Step 2.

---

### Step 2 — Append the authoritative token source note to `brief.md` §5

**File:** `.agent/project-info/brief.md`
**Anchor:** line 209 — `Theme is published as SCSS and can be imported by Shell and every MFE. Prefer encapsulation; global styles only when strictly necessary.`
**Action:** insert a new paragraph immediately AFTER line 209 (before the blank line that precedes `## 6. Core Components (Proposal)`).

**Exact text to insert** (real newlines, single blank line above and below):

```markdown

> **Authoritative token source:** Token values live ONLY in `src/theme/_variables.scss`. The `docs/USAGE.md` per-token table and `docs/THEME.md` are convenience views, NOT sources of truth. `docs/theme-preview.html` swatches are a visual view, NOT a source of truth. If any value diverges, `_variables.scss` wins and the docs/preview MUST be corrected in the same change. See §8.1 Token Change Checklist.
```

**Verification:** after edit, `brief.md` line 210 is the new `> **Authoritative token source:**` paragraph; the `## 6.` heading still follows after a blank line.

---

### Step 3 — Insert §8.1 Token Change Checklist in `brief.md`

**File:** `.agent/project-info/brief.md`
**Anchor:** line 342 — the last bullet of §8: `- This library never dispatches workspace or routing events itself; it only emits pure UI events from ModuleHeader.`
**Action:** insert a new `### 8.1` subsection immediately AFTER line 342 (before the blank line that precedes `## 9. Accessibility & Quality` at line 344).

**Exact text to insert** (real newlines, single blank line above and below):

```markdown

### 8.1 Token Change Checklist

Whenever a `--cba-*` token is **added, removed, renamed, or value-changed** in `src/theme/_variables.scss`, the author (human or AI agent) MUST verify every item below in the same change:

1. **`docs/THEME.md`** reflects the token name and value.
2. **`docs/CONSUMER_GUIDE.md`** reflects the token wherever it is referenced as a consumer-facing contract.
3. **`docs/USAGE.md`** per-token table is updated — or, if it duplicates `docs/THEME.md`, removed in favour of the single source.
4. **Every component SCSS file** that references the token (`src/components/**/*.scss`) still compiles (`npm run build`).
5. **`docs/theme-preview.html`** swatches / section captions for the token are updated, then `npm run build:preview` regenerates `docs/theme-preview.css`.
6. **`CHANGELOG.md`** records the token change under the current dated `[x.y.z] — YYYY-MM-DD` header (never under `[Unreleased]`).
7. **`context.md`** "Recent Changes" entry mentions the token name that changed.

If any item cannot be satisfied, the change is NOT ready to merge.
```

**Verification:** after edit, `### 8.1 Token Change Checklist` appears between the §8 bullet list and `## 9.`; numbering of §9, §10, §11 is unchanged.

---

### Step 4 — Append AI agent cross-file sync instruction to `instructions.md`

**File:** `.agent/project-info/instructions.md`
**Anchor:** line 68 — the "Critical Closing Step" paragraph: `**Critical Closing Step**: Before emitting the final completion signal or stopping execution, the agent MUST explicitly update .agent/project-info/context.md with the recent changes, current state, and next steps.`
**Action:** insert a new subsection immediately AFTER line 68 (before the blank line at line 69 that precedes `## Context Window Management`).

**Exact text to insert** (real newlines, single blank line above and below):

```markdown

### Pre-Commit Cross-File Sync Verification

Before committing any change that touches `src/theme/_variables.scss`, `src/theme/theme.scss`, any `src/components/**/*.scss` file, or `docs/theme-preview.html`, the AI agent MUST run a cross-file grep for every changed token name (`--cba-*`) and CSS class name (`cba-*`) to confirm the docs and preview are in sync:

1. `rg --no-heading "<token-or-class-name>" docs/ src/` against each changed `--cba-*` token and `.cba-*` class.
2. For each match in `docs/` or `docs/theme-preview.html`, confirm the value/caption reflects the new token (per `brief.md` §8.1 Token Change Checklist).
3. Any mismatch MUST be reconciled in the same commit before pushing to `origin`.

This verification is mandatory even when the change is AI- or docs-only; it is the operational counterpart of the authoritative-token-source rule in `brief.md` §5.
```

**Verification:** after edit, the new `### Pre-Commit Cross-File Sync Verification` subsection sits between the "Critical Closing Step" paragraph and `## Context Window Management`; the rest of the file is unchanged.

---

### Step 5 — Record audit completion + open risk in `context.md`

**File:** `.agent/project-info/context.md`

This file has two distinct insertions.

#### 5a — Append audit entry to "Recent Changes"

**Anchor:** line 27 — the first bullet under `## Recent Changes` (the `**Shell UI Bug Fixes Round 2 (2026-08-11, v0.14.0)**` entry).
**Action:** insert a NEW bullet as the FIRST item of the "Recent Changes" list, i.e. immediately AFTER the `## Recent Changes` heading line (line 25) and BEFORE the existing line 27. This keeps the list in reverse-chronological order (newest first), matching the existing convention.

**Exact text to insert** (real newlines, single blank line above and below):

```markdown
- **Project-wide audit & cross-file drift remediation (2026-08-12, v0.15.0)** — comprehensive audit of package/build config, theme tokens, component SCSS compliance, documentation accuracy, and `docs/theme-preview.html` consumer reference. Added `--cba-module-footer-height`, `--cba-icon-size-md`, `--cba-dropdown-min-width` tokens; fixed `package.json` `exports["./theme"]` (`sass` + `style` + `default`), `sideEffects`, and stale `dist/package.json` version; replaced hard-coded `font-size`/`line-height` in component SCSS with `--cba-*` tokens; renamed `ModuleFooterComponent` → `CbaModuleFooterComponent` and added `host` blocks to module-header/module-footer; corrected 6 stale hex values and token mis-references in `docs/USAGE.md` / `docs/CBA_TYPEAHEAD.md` / `docs/CBA_MODULE_FOOTER.md` / `docs/CBA_FORM_FIELD.md` / `docs/CBA_INPUT.md` / `docs/CBA_SELECT.md` / `docs/CBA_DATEPICKER.md` / `docs/CBA_EMPTY_STATE.md`; added `<p class="section-caption">` to every preview section mapping demo CSS to the real library API; preview accessibility fixes (`.t-callout` WCAG AA, focusable `.search`, `--cba-*` base font-size). **Process guardrails added** to prevent recurrence: `brief.md` §5 authoritative token source note, `brief.md` §8.1 Token Change Checklist, `instructions.md` pre-commit cross-file sync verification (grep mandate), `context.md` audit record + open risk. See `.kilo/plans/20260812-project-audit-and-fixes.md`.
```

#### 5b — Append open risk to "Open Items / Risks"

**Anchor:** line 63 — the last bullet of "Open Items / Risks": `- \`@cobranza-apps/mfe-events\` not yet published — workspace event contracts deferred.`
**Action:** append a new bullet immediately AFTER line 63 (before the blank line that precedes `## Cross-Reference` at line 65).

**Exact text to insert** (real newlines, single blank line above and below):

```markdown

- **Cross-file drift recurrence risk (procedural)** — the 2026-08-12 audit found tokens, component SCSS, docs, and `docs/theme-preview.html` had drifted apart sprint-by-sprint. Remediation encoded process guardrails in `brief.md` §5/§8.1 and `instructions.md` (pre-commit cross-file grep). The guardrails are only effective if every future token/class change runs the Token Change Checklist; a change that skips the checklist reintroduces drift. Mitigation: review the checklist at every `src/theme/_variables.scss` change and at every docs/preview PR.
```

**Verification:** after edit, "Recent Changes" leads with the 2026-08-12 audit entry; "Open Items / Risks" ends with the new cross-file drift risk bullet; `## Cross-Reference` and the rest of the file are unchanged.

---

### Step 6 — Append CHANGELOG entry to the existing 0.15.0 block

**File:** `CHANGELOG.md`
**Anchor:** line 67 — the last bullet of the `### Fixed` subsection within `## [0.15.0] — 2026-08-12`: `- \`docs/CONSUMER_GUIDE.md\` now references the preview captions as the canonical visual reproduction map ...`
**Action:** append a new bullet AND a new `### Changed` entry is NOT introduced (this task's nature is process/docs, so it goes under `### Changed` to match the existing 0.15.0 block which already has `### Changed`). Decision: append under the existing `### Changed` subsection, after its last bullet (line 54 — the `.preview-module-table...` line). 

Re-reading the file: the existing 0.15.0 block order is `### Added` → `### Changed` → `### Fixed`. The natural placement for "process guardrails added" is `### Added` (these are new project-info sections/instructions, additive) — OR `### Changed` (the project-info files themselves changed). The closest Keep-a-Changelog fit is `### Changed` (the audit remediation changed existing project-info files and is process documentation). 

**Decision:** append a new bullet at the END of the existing `### Changed` list (after line 54), keeping the block's existing `### Fixed` subsection intact after it.

Wait — re-checking: block order on disk is `### Added` (line 37) → `### Changed` (line 44) → `### Fixed` (line 56). Appending to `### Changed` after its last bullet (line 54) means inserting BEFORE the `### Fixed` heading at line 56. That preserves the existing structure.

Let me re-verify line 54 content — line 54 is the `.preview-module-table` bullet; line 55 is blank; line 56 is `### Fixed`. So insertion goes after line 54 (the last Changed bullet), before the blank line at 55.

**Exact text to insert** (one new bullet, real newline):

```markdown
- `.agent/project-info/brief.md` §5 now declares `src/theme/_variables.scss` the sole authoritative token source (docs/USAGE.md and docs/THEME.md are convenience views; preview swatches are a visual view). New `brief.md` §8.1 "Token Change Checklist" mandates a 7-item verification (docs/THEME.md, docs/CONSUMER_GUIDE.md, docs/USAGE.md, component SCSS compile, docs/theme-preview.html + build:preview, CHANGELOG, context.md) for every `--cba-*` add/remove/rename/value-change. New `.agent/project-info/instructions.md` "Pre-Commit Cross-File Sync Verification" requires AI agents to `rg` each changed `--cba-*` token and `.cba-*` class across `docs/` and `src/` before committing changes to `src/theme/`, `src/components/**/*.scss`, or `docs/theme-preview.html`. `.agent/project-info/context.md` records the 2026-08-12 audit as completed remediation and adds the cross-file drift recurrence risk to "Open Items / Risks".
```

**Verification:** after edit, the new bullet is the last item in the `### Changed` subsection of `## [0.15.0] — 2026-08-12`; `### Fixed` still follows; no `[Unreleased]` section is introduced anywhere (per `changelog-versioning.md`).

---

### Step 7 — Verification (no build/test; docs-only)

Responsible: implementer (4.2 self-check) + 4.3 code-reviewer / 4.5 architector.

1. `git status` — confirm exactly 4 modified files:
   - `.agent/project-info/brief.md`
   - `.agent/project-info/instructions.md`
   - `.agent/project-info/context.md`
   - `CHANGELOG.md`
2. `git diff --stat` — confirm each file has only appended lines (no deletions in `brief.md` / `instructions.md` / `context.md`; `CHANGELOG.md` adds one bullet).
3. Manual proofread each insertion against this plan's "Exact text to insert" blocks — character-for-character match (the implementer re-reads the plan between edits per critical-workflow 4.2).
4. Confirm `CHANGELOG.md` contains no `[Unreleased]` substring (per `changelog-versioning.md`):
   `rg -n "Unreleased" CHANGELOG.md` → expected: no matches.
5. Confirm no source files (`src/**`) were modified by this task.

**Verification commands** (run singly, not chained):

- `git status`
- `git diff --stat`
- `rg -n "Unreleased" CHANGELOG.md`
- `rg -n "Token Change Checklist" .agent/project-info/brief.md`
- `rg -n "Pre-Commit Cross-File Sync" .agent/project-info/instructions.md`
- `rg -n "cross-file drift recurrence risk" .agent/project-info/context.md`

Each of the last three MUST return exactly one match line.

---

### Step 8 — Commit

Responsible: implementer (4.2 commit checkpoint).

1. Stage the 4 modified files (and only those): `git add .agent/project-info/brief.md .agent/project-info/instructions.md .agent/project-info/context.md CHANGELOG.md`
2. Commit with message:
   `docs(project-info): add token-change checklist, authoritative-source note, pre-commit grep mandate, audit record`
   
   (Multi-line body optional; if used, summarize the four guardrails and reference `.kilo/plans/20260812-task-c-implementation.md`.)

**Verification:** `git log -1 --stat` shows the commit with exactly the 4 files.

---

## Deliverables Checklist (for the 4.5b adherence check)

- [ ] `brief.md` §5 has the authoritative token source note (1 new paragraph after line 209).
- [ ] `brief.md` §8.1 "Token Change Checklist" subsection exists (inserted after the last §8 bullet).
- [ ] `instructions.md` has the "Pre-Commit Cross-File Sync Verification" subsection (after the Critical Closing Step paragraph).
- [ ] `context.md` "Recent Changes" leads with the 2026-08-12 audit entry.
- [ ] `context.md` "Open Items / Risks" ends with the cross-file drift recurrence risk bullet.
- [ ] `CHANGELOG.md` `## [0.15.0] — 2026-08-12` `### Changed` subsection has the new process-guardrails bullet; no `[Unreleased]` introduced.
- [ ] Exactly 4 files modified; no `src/` files touched.
- [ ] Single commit on `feat/project-audit-and-fixes`.

---

## Out of Scope (NOT done by this task)

- No edits to `docs/*.md` (those were Tasks 1–4 of the audit).
- No edits to `src/theme/_variables.scss` or `src/components/**/*.scss` (Task 1–2).
- No `package.json` version bump (already 0.15.0 from Task 1).
- No new `dist/` regeneration (`npm run build`) — docs-only change.
- No step 5 (TODO completion / branch merge) — that is the next critical-workflow step after 4.6.