# Phase 1 — Task 7: Public API / Exports — Implementation Plan

- **Date:** 20260730
- **Project:** `@cobranza-apps/ui` (`C:\projects\cobranza-app\front\ui`)
- **TODO file:** `.agent/todos/20260729/20260729-todo-2.md` → Task 7 (lines 199–202)
- **Plan path:** `.kilo/plans/20260730-phase1-task7-plan.md`
- **Scope:** Single discrete step (Critical Workflow 4.1b). Plan only — no code changes.
- **Front-end task:** No (no SCSS authored here; build verification only).

## 1. Task 7 — Original Requirement (verbatim)

> **7. Public API / exports**
>
> - [ ] If the library exposes any theme-related TypeScript helpers later they will be exported from `public-api.ts`; for now the public API can remain without new TS exports.
> - [ ] Confirm `public-api.ts` still builds cleanly.

## 2. Current State Analysis

### 2.1 `src/lib/public-api.ts`

- Already exists at `C:\projects\cobranza-app\front\ui\src\lib\public-api.ts`.
- Body: `export {};` (a single empty-export statement, lines 1–17 include the JSDoc header).
- File header documents how to add exports and explicitly warns not to export internal helpers.
- The empty aggregate export is intentional and semver-safe: it keeps ng-packagr's `entryFile` valid while no components/helpers exist yet.

### 2.2 Build configuration referencing `public-api.ts`

- `ng-package.json` → `lib.entryFile = "src/lib/public-api.ts"`.
- `package.json` → `scripts.build = "ng-packagr -p ng-package.json -c tsconfig.lib.json"`.
- Theme SCSS is shipped as static assets (glob `**/*.scss` from `src/lib/theme` → `theme/`), decoupled from the TS public API. No TS symbol needs to be exported for the theme to be consumable.

### 2.3 Theme tokens / helpers

- Tokens are CSS custom properties (`--cba-*`) and SCSS partials (`_variables.scss`, `_mixins.scss`, `_utilities.scss`, `theme.scss`). These are not TypeScript symbols, so nothing needs to leak through `public-api.ts` in Phase 1.
- The TODO explicitly allows the public TS API to remain unchanged.

### 2.4 Acceptance criteria mapping

- TODO acceptance for this task: "Confirm `public-api.ts` still builds cleanly." → satisfied by a successful `npm run build`.
- Phase 1 acceptance criterion #6 ("Library build succeeds") is shared with Task 8; here we only verify the public API file contributes nothing that breaks the build.

## 3. High-Level Approach

1. Verify current `public-api.ts` is unchanged and valid (`export {};`).
2. Run the library build (`npm run build`) against the existing file.
3. If the build succeeds → no code changes, no commit, task complete.
4. If the build fails on `public-api.ts` (or anywhere else surfaced by it):
   - Diagnose root cause.
   - Apply the smallest fix that restores a clean build (incidental fix only).
   - Commit with a meaningful message scoped to Task 7.
5. Report build result and any incidental actions.

No new TS exports are introduced. No new files. No SCSS work.

## 4. Detailed, Atomic Steps

### Step 4.1 — Verify `public-api.ts` content (read-only)

- **Tool:** `vscode-mcp-server_read_file_code` (or `read`).
- **Target:** `src/lib/public-api.ts`.
- **Expected:** JSDoc header + `export {};` (17 lines).
- **Pass condition:** File ends with `export {};` and contains no `export *` or symbol exports.
- **Action if mismatch:** Do NOT modify content; surface to caller (out of scope for this plan). The only allowed content is the documented empty export.

### Step 4.2 — Verify build toolchain prerequisites

- **Tool:** `bash`.
- **Command:** `npm --version`
- **Purpose:** Confirm npm CLI is available (build runs via npm script).
- **No action required on failure:** escalate to caller (environment issue, not in scope).

### Step 4.3 — Run the library build

- **Command:** `npm run build`
- **Workdir:** `C:\projects\cobranza-app\front\ui`
- **Timeout:** extend to ~300000 ms (ng-packagr first-cold build can exceed the default 2-minute limit). Use a single non-chained command (per tool-selection-priority rule).
- **Capture:** full stdout/stderr. If output is truncated, the harness writes it to a file — use `read`/`grep` on that file to inspect errors.

### Step 4.4 — Evaluate build outcome (branch)

#### 4.4a — Build SUCCEEDS (expected path)

- No file changes.
- No git commit (nothing to commit).
- Record evidence: exit code 0 + tail of build log showing `Built Angular Package` / ng-packagr success summary.
- Proceed to Step 4.6.

#### 4.4b — Build FAILS

- Inspect the captured error output.
- Classify the failure against this checklist (only failures attributable to Task 7 scope are fixable here):
  - **Class A — `public-api.ts` compile error** (e.g., stray non-empty export, syntax error, missing import). *Fixable in Task 7 scope.*
  - **Class B — `tsconfig.lib.json`/`ng-package.json` misconfiguration of `entryFile`.** *Fixable only if trivial and scoped to public-api; otherwise escalate.*
  - **Class C — unrelated compile error** (theme SCSS, dependency resolution, peer dep mismatch). *NOT in scope* → escalate to caller; do NOT attempt a fix.
- For Class A failures:
  - Read failing region of `public-api.ts`.
  - Restore the file to the canonical state: JSDoc header + `export {};`.
  - Re-run `npm run build` (Step 4.3) to confirm green.
  - Only after green: proceed to Step 4.5 (commit incidentral fix), then Step 4.6.
- For Class B/C: halt and return a question to the caller with the failure excerpt. Do not invent fixes outside Task 7 scope.

### Step 4.5 — Commit incidental fix (only if 4.4b Class A applied)

- **Pre-commit compliance (per `.kilo/rules/gitignore-compliance.md`):**
  1. Read `.gitignore`.
  2. Run `git status`.
  3. Ensure no `dist/`, `node_modules/`, or other ignored artifacts are staged. Unstage if found.
- Stage only `src/lib/public-api.ts` (the only file touched).
- **Commit message:** `fix(public-api): restore empty export to keep library build clean`
- Single non-chained git commands; do NOT push (Task 7 does not push — merges/pushes happen at Step 5 of the Critical Workflow, owned by the caller).

### Step 4.6 — Verification checklist (done by implementer sub-agent during 4.2)

- [ ] `public-api.ts` content is unchanged from start (or, if 4.4b applied, restored to canonical `export {};`).
- [ ] `npm run build` exits 0.
- [ ] Build output references `src/lib/public-api.ts` as entryFile without errors.
- [ ] No new TS exports were added.
- [ ] No changes to `ng-package.json`, `package.json`, `tsconfig.lib.json`.
- [ ] Working tree clean (or only the incidental fix committed).

## 5. Out of Scope (explicit)

- Adding any TS `export *` or symbol re-export (deferred until a theme TS helper actually exists; see TODO "later" wording).
- Touching theme SCSS partials (`_variables.scss`, `_mixins.scss`, `_utilities.scss`, `_base.scss`, `theme.scss`) — those are Tasks 1–6.
- Build verification beyond "is it clean?" — Sass errors / package spot-checks are Task 8's responsibility (`.agent/todos/20260729/20260729-todo-2.md` lines 204–208).
- Documentation updates (README / `/docs` theme page) — Task 9.
- Git feature branch creation, version bump, TODO `[DONE]` marking, TODO file rename, merge to `main`, push — all owned by the caller (Plan Agent / Critical Workflow Steps 2, 3, 5).

## 6. Risks & mitigations

| Risk | Likelihood | Mitigation |
| --- | ---------- | ---------- |
| `npm run build` first run downloads/caches aggressively and exceeds default 2-min `bash` timeout. | Medium | Use a 300000 ms timeout in Step 4.3. |
| Build fails on unrelated pre-existing issue (peer dep, SCSS from Tasks 1–6). | Low (Tasks 1–6 marked DONE) | Classify as Class C, escalate; do not fix. |
| Implementer is tempted to add placeholder exports "for later". | Low | Plan explicitly forbids new exports; single-section instruction above. |

## 7. Deliverables of this Plan

- This file (`.kilo/plans/20260730-phase1-task7-plan.md`) — saved.
- No code changes produced by the planning step.
- Returned to caller: plan file path.

## 8. Plan vs. Task Verification (self-check)

- TODO requires: "public API can remain without new TS exports" → plan forbids new exports. ✅
- TODO requires: "Confirm `public-api.ts` still builds cleanly" → Step 4.3 runs `npm run build`. ✅
- Scope limited to Task 7 only — no overlap with Task 8 (build error fixing / Sass) beyond the single `npm run build` invocation needed to "confirm ... builds cleanly". ✅
- Non-front-end task → no 4.1a / 4.5a sub-steps. ✅
- Plan is minimal and detailed; no invented symbols or assumptions. ✅