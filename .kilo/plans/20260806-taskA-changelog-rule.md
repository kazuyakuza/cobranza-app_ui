# Task A — Changelog Versioning Rule: Implementation Plan

**Step:** 4.1b (Analysis & Planning)
**Architector sub-agent output — Plan only. No code execution.**
**Date:** 2026-08-06
**TODO:** `.agent/todos/20260806/20260806-todo-0.md` (line 1)
**Global plan:** `.kilo/plans/20260806-preview-readability-changelog-rule.md`
**Branch:** `feat/preview-readability-changelog-rule` (created at Step 2; version bumped to `0.11.1` at Step 3)
**Version:** `0.11.1`

---

## 1. Task Summary

Establish a project rule that `CHANGELOG.md` MUST NOT contain `[Unreleased]` sections. Rationale: every push to remote `origin` publishes the library, so there is no "queued-but-unpublished" state. Every change must be written directly under a dated `[x.y.z] — YYYY-MM-DD` header that is created in the same change as the version bump.

Scope is pure process/docs — no token, build, source, or test changes. No front-end work (Task A is NOT front-end related, per global pre-analysis); step 4.1a is skipped.

---

## 2. Ambiguities / Out-of-Scope (flagged to caller — do NOT silently expand)

1. **Existing historical `[Unreleased]` references in `CHANGELOG.md`:** The current header comment (lines 6–12) is the only place that mentions `[Unreleased]`. The body of `CHANGELOG.md` contains no `[Unreleased]` section (latest is `## [0.11.0] — 2026-08-06`, dated). The rule therefore only needs to (a) replace the header "HOW TO UPDATE" instructions and (b) add a rule file. No historical `[x.y.z]` entries are edited (keep-a-changelog best practice + "preserve existing content" guideline).
2. **`package.json` version bump:** Step 3 of the global workflow already bumps to `0.11.1`. Task A does NOT re-bump. The plan assumes `package.json` is already at `0.11.1` when the implementer runs 4.2. If Step 3 was skipped, the implementer must return the discrepancy to the caller rather than bumping inside Task A.
3. **New `CHANGELOG.md` version entry:** The global plan assigns the `## [0.11.1] — 2026-08-06` dated entry to **Task C** (Regression Tests & Changelog Entry). Task A only edits the **header comment** of `CHANGELOG.md`; it does NOT add a body entry. Adding one here would collide with Task C scope. Caller-confirmed: out-of-scope.
4. **CI/CD publication trigger:** The rule states "every push to `origin` publishes the lib". `context.md` Immediate Next Step 5 says "CI/CD pipeline for automated build and publish (version auto-bumps on push to origin) — version auto-bumps on push to origin)" is *planned*, not yet implemented. The rule is worded to be correct under both the current manual-publish and the future auto-publish workflow; the implementer must NOT add CI/CD configuration or pipeline files.
5. **`.agent/project-info/context.md` update is optional** per the task prompt. The plan includes a minimal, optional edit (§4.4) but marks it clearly optional — implementer may skip step 4.4 entirely if the caller prefers to keep `context.md` untouched until Task C.

---

## 3. Files to Modify (authoritative list)

| # | File | Type of change | Required? |
|---|------|----------------|-----------|
| 1 | `.kilo/rules/changelog-versioning.md` | NEW rule file | **Required** |
| 2 | `.agent/RULES.md` | Add one index bullet referencing the new rule | **Required** |
| 3 | `CHANGELOG.md` | Replace header comment "HOW TO UPDATE" block (lines 6–12) only | **Required** |
| 4 | `.agent/project-info/context.md` | Add one "Recent Changes" bullet mentioning the new rule | Optional |

**Files explicitly NOT touched:**
- `CHANGELOG.md` body (any `## [x.y.z]` section) — historical + Task C scope.
- `package.json` — Step 3 already bumped it.
- `src/**`, `docs/**` — no code or consumer docs in scope.
- Any CI/CD, workflow, or pipeline files.
- `.kilo/commands/**`, other `.kilo/rules/**` files.

---

## 4. Detailed, Atomic Implementation Steps

> **Tooling note (for the implementer in 4.2):** Use `vscode-mcp-server_create_file_code` for the new rule file (overwrite=false, ignoreIfExists=true is acceptable) and `vscode-mcp-server_replace_lines_code` for the line-scoped edits in `.agent/RULES.md`, `CHANGELOG.md`, and (optionally) `context.md`. Re-read each target line immediately before editing — Task A edits are small and independent by file, so order across files is free; order within a file is top-to-bottom. All content uses real newline characters (per [Newline Prevention Rule](../.kilo/rules/newline-prevention.md)).

### Step 4.1 — Create `.kilo/rules/changelog-versioning.md` (NEW)

**Path:** `C:\projects\cobranza-app\front\ui\.kilo\rules\changelog-versioning.md`

**Exact content (single trailing newline at EOF):**

```
# Changelog Versioning Rule

- `CHANGELOG.md` MUST NOT contain an `[Unreleased]` section.
- Every push to remote `origin` publishes the library, so every change MUST be
  documented under a dated `[x.y.z] — YYYY-MM-DD` header before it lands on `main`.
- Bump `package.json` version and create the dated `CHANGELOG.md` header in the
  SAME commit/PR that introduces the change. Do not keep an empty
  `[Unreleased]` section above the latest release.
- New entries go directly under the current in-progress version header (e.g.
  `## [0.11.1] — 2026-08-06`).
- Use [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) categories
  (Added, Changed, Fixed, Deprecated, Removed, Security) and
  [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
- Historical entries predating this rule are NOT retroactively edited.
- AI agents MUST verify before committing that `CHANGELOG.md` introduces no new
  `[Unreleased]` section; if one exists, remove it and move its entries under the
  current dated header.
- Reference related docs (brief.md §5, docs/THEME.md, etc.) when entries touch
  design tokens, components, or integration patterns.
```

**Verification of this step:**
- File exists at the path above and contains the literal text block above.
- File ends with a newline and uses real newlines (no `\n` literals).
- Line count is 16 (15 content lines + 1 trailing newline). File is well under the 200-line `src/` cap (rule file, so the cap does not apply, but it stays small for readability).

---

### Step 4.2 — Add index bullet to `.agent/RULES.md`

**Path:** `C:\projects\cobranza-app\front\ui\.agent\RULES.md`

**Edit:** Insert one bullet after line 19 (the `Markdown Generation Rule` bullet), so the markdown-related rules stay grouped.

**Current lines 19–20:**
```
- [Markdown Generation Rule](../.kilo/rules/markdown-generation-rule.md)
- [Important Paths Rule](../.kilo/rules/important-paths.md)
```

**New lines 19–21:**
```
- [Markdown Generation Rule](../.kilo/rules/markdown-generation-rule.md)
- [Changelog Versioning](../.kilo/rules/changelog-versioning.md)
- [Important Paths Rule](../.kilo/rules/important-paths.md)
```

> The relative path `../.kilo/rules/changelog-versioning.md` matches the convention used by every other bullet in the file (`.agent/` is one level below repo root; `.kilo/rules/` is also one level below root, so `../.kilo/...` is correct and consistent with the existing `Markdown Generation Rule` link on line 19).

**Verification of this step:**
- `grep` for `changelog-versioning` in `.agent/RULES.md` returns exactly one hit.
- The new bullet sits between `Markdown Generation Rule` and `Important Paths Rule`.
- No other line in `.agent/RULES.md` is modified.

---

### Step 4.3 — Replace `CHANGELOG.md` header comment "HOW TO UPDATE" block

**Path:** `C:\projects\cobranza-app\front\ui\CHANGELOG.md`

**Edit:** Replace lines 6–12 only. Lines 1–5 and 13–20 (the rest of the header comment, including `AUDIENCE`, `RELATIONSHIPS`, and the closing `-->`) are NOT modified.

**Old (lines 6–12, exact current content):**
```
  HOW TO UPDATE:
    1. Add entries under [Unreleased] as work lands on main.
    2. Before a release, rename [Unreleased] to [x.y.z] with the release date.
    3. Create a new empty [Unreleased] section above it.
    4. Use categories: Added, Changed, Fixed, Deprecated, Removed, Security.
    5. Reference related docs (brief.md §5, docs/THEME.md, etc.) when entries
       touch design tokens, components, or integration patterns.
```

**New (lines 6–13, replaces old 6–12 — adds one RULE line and renumbers):**
```
  HOW TO UPDATE:
    1. NEVER use an [Unreleased] section — every push to origin publishes the lib.
       Add entries directly under the current dated [x.y.z] — YYYY-MM-DD header.
    2. Bump package.json version and create the dated header in the same change.
    3. Use categories: Added, Changed, Fixed, Deprecated, Removed, Security.
    4. Reference related docs (brief.md §5, docs/THEME.md, etc.) when entries
       touch design tokens, components, or integration patterns.

  RULE: See .kilo/rules/changelog-versioning.md (no [Unreleased] sections).
```

> The replacement expands 7 lines (old 6–12) to 8 lines (new 6–13). The trailing blank line (new line 12) keeps visual separation in the comment block before `AUDIENCE:` (which was line 14, will shift to line 15). Implementer: use `vscode-mcp-server_replace_lines_code` with `startLine=6`, `endLine=12`, and the `originalCode` block above to guarantee exact match. Do NOT use a free-form `edit` because the surrounding lines must be preserved byte-for-byte.

**Verification of this step:**
- `grep -n "Unreleased" CHANGELOG.md` returns ZERO hits in the header comment. (Confirm there are no `[Unreleased]` mentions anywhere in `CHANGELOG.md` body either — there should be none, since the latest body entry is dated `## [0.11.0] — 2026-08-06`.)
- `grep -n "changelog-versioning" CHANGELOG.md` returns exactly one hit (the new `RULE:` line).
- Lines 1–5 (FILE/FORMAT/VERSIONING) and the `AUDIENCE`/`RELATIONSHIPS`/closing `-->` block (now lines 15–21) are byte-identical to before the edit.

---

### Step 4.4 — (OPTIONAL) Add "Recent Changes" bullet to `.agent/project-info/context.md`

**Path:** `C:\projects\cobranza-app\front\ui\.agent\project-info\context.md`

**Optional:** Skip this whole step 4.4 if the caller prefers to defer all `context.md` updates to Task C. Do NOT silently skip — if skipping, add `[skipped]` in the implementer summary.

If executing, insert one bullet at the TOP of the `## Recent Changes` list (before the current first bullet "Phase 9 token tuning (Task A) …" on line 25).

**Insert (new top bullet, before current line 25):**
```
- **Changelog versioning rule established (Task A, 2026-08-06)** — new rule `.kilo/rules/changelog-versioning.md` prohibits `[Unreleased]` sections in `CHANGELOG.md` (every push to `origin` publishes the lib). Index reference added to `.agent/RULES.md`; `CHANGELOG.md` header comment rewritten to drop `[Unreleased]` instructions and point to the rule file.
```

**Also update the active-branch line (line 21):**

Current:
```
- Active branch: `feat/phase9-surface-hierarchy` (Tasks A + B).
```

New:
```
- Active branch: `feat/preview-readability-changelog-rule` (Preview readability + changelog rule).
```

> The branch switch reflects the new TODO (`20260806-todo-0`). Changing it here is consistent with the "Current Work Focus" maintenance contract in `context.md`'s own header comment, and the global plan's chosen branch name. If the caller would rather keep `context.md` untouched until Task C, step 4.4 is skipped entirely and the branch line stays as-is until Task C.

**Verification of this step (only if executed):**
- `grep "changelog-versioning" .agent/project-info/context.md` returns exactly one hit (the new bullet).
- `grep "feat/preview-readability-changelog-rule" .agent/project-info/context.md` returns exactly one hit (line 21).
- No other line in `context.md` is modified; the `## Recent Changes` block remains otherwise intact.

---

## 5. Verification (Must Pass)

Run each command **separately** (no chaining; per [Tool Selection Priority](../.kilo/rules/tool-selection-priority.md) and bash-tool rules) from the project root (`C:\projects\cobranza-app\front\ui`). These are Task A's gates; do NOT mark the task done until all pass. Task A touches only markdown files, so build/lint/test are NOT gating — but run lint as a regression sanity check.

1. **No `[Unreleased]` left in `CHANGELOG.md`:**
   - Command: `git grep -n "\[Unreleased\]" -- CHANGELOG.md`
   - Expected: exit code 1 (no matches). If any match, the header edit is incomplete — fix before proceeding.

2. **New rule file exists and has correct heading:**
   - Command: `git grep -n "^# Changelog Versioning Rule" -- .kilo/rules/changelog-versioning.md`
   - Expected: exactly one hit on line 1.

3. **Index bullet is present in `.agent/RULES.md`:**
   - Command: `git grep -n "changelog-versioning" -- .agent/RULES.md`
   - Expected: exactly one hit (the new bullet line).

4. **Lint regression sanity (no source touched, but confirms toolchain):**
   - Command: `npm run lint`
   - Expected: `eslint "src/**/*.ts"` passes; zero new violations.

5. **(Optional, only if step 4.4 executed) `context.md` references the new rule:**
   - Command: `git grep -n "changelog-versioning" -- .agent/project-info/context.md`
   - Expected: exactly one hit.

6. **Markdown linting (if the project has a markdown linter configured):**
   - Check `package.json` `scripts` for an `md`/`markdownlint` script. If none exists, SKIP this gate (do not invent one). If it exists, run it; expected pass.

---

## 6. Git Commits (executed by implementer in 4.2; meaningful, atomic)

> Branch already exists: `feat/preview-readability-changelog-rule`. Version already bumped to `0.11.1` at Step 3 (separate commit). Before ANY commit, follow the [Gitignore Compliance Rule](../.kilo/rules/gitignore-compliance.md): read `.gitignore`, run `git status`, ensure no `node_modules/` / `dist/` / ignored files are staged.

Recommended **single** commit for Task A (all four edits form one coherent process change — the rule, its index entry, the header it replaces, and the context note all reference each other):

**Commit — changelog versioning rule:**
- Stage (only these; verify with `git status` before committing):
  - `.kilo/rules/changelog-versioning.md`
  - `.agent/RULES.md`
  - `CHANGELOG.md`
  - `.agent/project-info/context.md`  ← include ONLY if step 4.4 was executed
- Message:
  ```
  docs(process): forbid [Unreleased] in CHANGELOG; add changelog-versioning rule

  New rule .kilo/rules/changelog-versioning.md prohibits [Unreleased] sections
  because every push to origin publishes the lib. Entries go directly under a
  dated [x.y.z] — YYYY-MM-DD header created with the version bump.
  - .agent/RULES.md: index bullet added (after Markdown Generation Rule).
  - CHANGELOG.md: header "HOW TO UPDATE" rewritten; [Unreleased] instructions
    removed; pointer to the new rule added.
  - context.md: recent-change bullet + active branch updated (optional).

  Refs: .agent/todos/20260806/20260806-todo-0.md (line 1)
  ```

- **Push is NOT part of this step** (Step 5 merges to `main` and pushes to `origin` only). Per [Git Remote Safety Rule](../.kilo/rules/git-remote-safety.md), never push to remotes other than `origin`.
- If a pre-commit hook rejects the commit, fix the cause and create a NEW commit (do NOT `amend` per repo git-rule-of-thumb unless explicitly asked).

---

## 7. Constraints Reaffirmed (from task prompt + global pre-analysis)

- Task A is **not** front-end related → step 4.1a is SKIPPED. Only 4.1b → 4.2 → 4.3 → 4.4 → 4.5b → 4.6.
- No `src/**`, no JS/TS, no SCSS, no build config, no token, no test changes.
- Only the `CHANGELOG.md` **header comment** (lines 6–12) is edited; no `## [x.y.z]` body section is added or modified (that is Task C).
- `package.json` is NOT re-bumped (Step 3 owns the bump).
- Historical changelog entries are preserved unchanged.
- New rule file uses the same terse bullet style as the other `.kilo/rules/*.md` files (e.g. `gitignore-compliance.md`, `git-remote-safety.md`).

---

## 8. Verification Checklist

- [ ] `.kilo/rules/changelog-versioning.md` exists and starts with `# Changelog Versioning Rule`.
- [ ] The rule file contains the prohibition ("MUST NOT contain an `[Unreleased]` section"), the rationale ("every push to remote `origin` publishes the library"), and the dated-header requirement.
- [ ] `.agent/RULES.md` contains exactly one new bullet: `- [Changelog Versioning](../.kilo/rules/changelog-versioning.md)`.
- [ ] The new bullet sits between `Markdown Generation Rule` and `Important Paths Rule`.
- [ ] `CHANGELOG.md` header comment "HOW TO UPDATE" block is replaced; the word `[Unreleased]` no longer appears in `CHANGELOG.md`.
- [ ] `CHANGELOG.md` header comment now contains a `RULE:` line pointing to `.kilo/rules/changelog-versioning.md`.
- [ ] No `## [x.y.z]` body section of `CHANGELOG.md` was added or modified.
- [ ] (If 4.4 executed) `.agent/project-info/context.md` has the new Recent-Changes bullet and updated active-branch line.
- [ ] (If 4.4 skipped) `.agent/project-info/context.md` is byte-identical to its pre-task state.
- [ ] `npm run lint` passes (regression sanity).
- [ ] Commit message follows repo style and references the TODO line.
- [ ] No files outside the authoritative list (§3) were staged.

---

## 9. What This Plan Does NOT Do (boundaries)

- Does **not** write code or modify non-`.md` files (Architector step = plan only).
- Does **not** run git commands (commit belongs to implementer in 4.2; merge/push to Step 5).
- Does **not** add a `## [0.11.1]` dated entry to `CHANGELOG.md` body — that is **Task C** scope.
- Does **not** bump `package.json` — that is **Step 3** scope (already done).
- Does **not** add regression tests asserting "no `[Unreleased]`" — that is **Task C** scope (global pre-analysis item 6).
- Does **not** set up CI/CD auto-publish or auto-version-bump pipelines.
- Does **not** edit `docs/USAGE.md`, `docs/THEME.md`, `docs/CONSUMER_GUIDE.md`, or `brief.md`.
- Does **not** retroactively edit historical `CHANGELOG.md` entries.

---

## 10. Plan-vs-Task Cross-Check

| Task prompt requirement | Covered by | Match |
|--------------------------|-----------|-------|
| Read current `CHANGELOG.md`, `.agent/RULES.md`, `context.md` | Done during 4.1b (this plan). | Yes |
| Identify ambiguities / missing info | §2 (five flagged items). | Yes |
| Generate detailed implementation plan with tiny, explicit steps (file paths, content snippets, terminal commands) | §3, §4, §5, §6. | Yes |
| Save plan to `.kilo/plans/20260806-taskA-changelog-rule.md` | This file. | Yes |
| Files to update: `.kilo/rules/changelog-versioning.md` (new) | §4.1. | Yes |
| Files to update: `.agent/RULES.md` | §4.2. | Yes |
| Files to update: `CHANGELOG.md` (header comment only) | §4.3. | Yes |
| Files to update: `.agent/project-info/context.md` (optional) | §4.4 (marked optional). | Yes |
| Branch `feat/preview-readability-changelog-rule` | Used (not created — created at Step 2). | Yes |
| Version `0.11.1` | Referenced; not re-bumped. | Yes |

All task-prompt requirements covered. No token, code, or test scope leaked. **No rework needed.**

---

**End of plan. Path:** `.kilo/plans/20260806-taskA-changelog-rule.md`