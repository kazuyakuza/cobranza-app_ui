# Implementation Plan — Fix `cba-button--secondary` background color (Task 1, Step 4.2)

## 0. Context & Scope

- **TODO file:** `.agent/todos/20260820/20260820-todo-2.md`
- **Front-end spec:** `.kilo/plans/20260820-fix-secondary-button-bg-frontend-spec.md`
- **Branch:** `fix/secondary-button-bg` (already created and checked out — DO NOT create/switch branches; branch handling is restricted to Critical Workflow step 2, already done).
- **Current version:** `0.18.5` (already bumped in `package.json` — DO NOT bump again; version update is restricted to Critical Workflow step 3, already done).
- **Already committed:**
  - `0efb445` — `fix(button): use --cba-bg-elevated for secondary variant` (SCSS change in `src/components/button/cba-button.component.scss` line 67).
  - `2e79063` — `chore: bump version to 0.18.5`.
- **Remaining work (this plan):**
  1. Align demo matrix caption token (documentation drift fix per spec §4.3).
  2. Build library → reinstall local dep → build demo.
  3. Visual verification in served demo.
  4. Update `CHANGELOG.md` with dated `[0.18.5] — 2026-08-20` header.
  5. Commit changes (NO push — push is restricted to Critical Workflow step 5).
- **Implementer restriction:** JUNIOR developer, 50% restriction. Follow every step verbatim. Do NOT modify unrelated files, expand scope, or make architectural decisions. If a step is ambiguous, STOP and ask the caller.

## 1. Pre-flight checks

### 1.1 Confirm working tree state
- Run: `git status`
- Expected: branch `fix/secondary-button-bg`; untracked files only (`.agent/todos/20260820/20260820-todo-2.md`, `.kilo/plans/20260820-fix-secondary-button-bg*.md`, possibly `.playwright-mcp/*.png`). No staged or modified tracked files.
- If tracked files appear modified unexpectedly, STOP and ask the caller. Do NOT discard or stash.

### 1.2 Confirm the SCSS fix is present (verification only, no edit)
- Read `src/components/button/cba-button.component.scss` line 67.
- Expected: `background-color: var(--cba-bg-elevated);` inside `:host(.cba-button--secondary) .cba-button__control { ... }`.
- If line 67 still shows `var(--cba-bg-secondary)`, STOP — the committed fix is missing; ask the caller.

### 1.3 Confirm current version
- Read `package.json` line 3.
- Expected: `"version": "0.18.5"`.
- If different, STOP and ask the caller.

## 2. Code change — demo matrix caption alignment (spec §4.3)

### 2.1 File
- `projects/demo/src/app/components/demo-button-matrix/demo-button-matrix.component.ts`, line 51.

### 2.2 Current content (line 51)
```text
      return '.cba-button--secondary · var(--cba-bg-elevated) · var(--cba-border-subtle)';
```

### 2.3 Target content (line 51)
```text
      return '.cba-button--secondary · var(--cba-bg-elevated) · var(--cba-border-default)';
```

### 2.4 Exact edit
- Use `vscode-mcp-server_replace_lines_code` with:
  - `path`: `projects/demo/src/app/components/demo-button-matrix/demo-button-matrix.component.ts`
  - `startLine`: 51
  - `endLine`: 51
  - `originalCode`: `      return '.cba-button--secondary · var(--cba-bg-elevated) · var(--cba-border-subtle)';`
  - `content`: `      return '.cba-button--secondary · var(--cba-bg-elevated) · var(--cba-border-default)';`
- Rationale (per spec §4.2–§4.3): a button is a structural interactive control; `--cba-border-default` (`#A29D94`) is the semantically correct border token and provides sufficient edge contrast on both `--cba-bg-secondary` and `--cba-bg-elevated`. `--cba-border-subtle` (`#E8E5DB`) is for internal separators only and would be too faint on the near-white elevated surface. The component SCSS already uses `var(--cba-border-default)` (line 68); this edit aligns the demo documentation to the source of truth.
- Do NOT change any other line in this file. Do NOT touch the SCSS. Do NOT change other variant captions.

### 2.5 Verify the edit
- Re-read lines 46–58 of the file.
- Confirm line 51 now reads `var(--cba-border-default)` and the middle dot separators (`·`) and surrounding quotes are unchanged.

## 3. Build library

### 3.1 Command
- Run (single command, no chaining): `npm run build:lib`
- Working directory: repo root (`C:\projects\cobranza-app\front\ui`).
- This runs `ng-packagr -p ng-package.json -c tsconfig.lib.json` and outputs to `dist/`.

### 3.2 Expected outcome
- Build completes with exit code 0.
- No SCSS or TypeScript errors.
- `dist/` directory is regenerated (contains `package.json`, `fesm2022/`, `types/`, `theme/`, etc.).

### 3.3 On failure
- If the build fails, read the error output. Common causes: stale `.angular/cache` (not applicable to ng-packagr), SCSS compile error in `src/`. Do NOT attempt to fix SCSS errors beyond the single edit in step 2 — STOP and ask the caller, pasting the error.

## 4. Reinstall local dependency

### 4.1 Why
- The demo app consumes the library via the `file:./dist` devDependency (`package.json` line 62: `"@cobranza-apps/ui": "file:./dist"`). After rebuilding `dist/`, the installed copy in `node_modules/@cobranza-apps/ui` must be refreshed so the demo build picks up the new compiled output.

### 4.2 Command
- Run (single command): `npm install`
- Working directory: repo root.

### 4.3 Expected outcome
- npm resolves `file:./dist`, copies the freshly built package into `node_modules/@cobranza-apps/ui`.
- Exit code 0. No vulnerabilities blocking.

### 4.4 Verify refresh
- After install, confirm `node_modules/@cobranza-apps/ui` exists and is non-empty (it is a symlink/copy of `dist/`). A quick check: read `node_modules/@cobranza-apps/ui/package.json` and confirm `"version"` is `0.18.5`.
- Gitignore compliance: `node_modules/` and `dist/` are gitignored (`.gitignore` lines 31, 53). Run `git status` and confirm neither `node_modules/` nor `dist/` appears as staged. If they do, unstage them (`git restore --staged <path>`); if they are merely untracked, leave them.

## 5. Build demo

### 5.1 Command
- Run (single command): `npm run build:demo`
- This runs `ng build demo` and outputs to `dist/demo/browser/`.

### 5.2 Expected outcome
- Build completes with exit code 0.
- No Angular compiler, SCSS, or template errors.
- `dist/demo/browser/index.html` exists.

### 5.3 On failure
- If the build fails on the demo matrix component (e.g., TypeScript error from the edited caption string), re-check step 2.4 — the only change is `subtle` → `default`; the string structure is identical. If a different error appears, STOP and ask the caller, pasting the error. Do NOT modify other demo files.

## 6. Visual verification

### 6.1 Serve the demo
- Preferred (static build verification): open `dist/demo/browser/index.html` directly in a browser, OR serve the folder with any static server.
- Preferred (dev server, live): Run as a background process: `npm run start:demo` (this clears `.angular/cache` and runs `ng serve demo`). Wait for the `Local: http://localhost:42xx/` line, then open the URL in a browser.
- If using `background_process` tool to start `npm run start:demo`, set `ready.pattern` to `Local:` and a reasonable timeout.

### 6.2 Buttons matrix section — three surfaces
Navigate to the **Buttons** section of the demo. Locate the button matrix, which renders the secondary variant on three surface blocks. For each block, verify:

| Surface block | Expected secondary button appearance |
|---|---|
| `bg-secondary` (`#F2F0E8`) | Cream fill `#FDFCF8` clearly lighter than the panel; warm gray border `#A29D94` visible; text `#2B2620` readable. **This is the primary fix — the button must be visibly distinct from the panel.** |
| `bg-elevated` (`#FDFCF8`) | Fill blends with surface (expected); border provides the button edge; button still identifiable by its structural border. |
| `bg-primary` (`#BCB5A4`) | Light cream button stands out clearly against the darker warm-sand canvas. |

- Verify the caption directly under each secondary button reads exactly:
  `.cba-button--secondary · var(--cba-bg-elevated) · var(--cba-border-default)`
  (i.e., it no longer says `var(--cba-border-subtle)`).
- Verify hover, active, disabled, and loading states for the secondary variant on each surface render without errors (hover darkens via `--cba-hover` overlay; active darkens via `--cba-active`; disabled/loading apply `opacity: 0.6`).

### 6.3 New Customer form — Cancel button
- Navigate to the workspace mockup section containing the **New customer** module (50% width, expanded, success status).
- Locate the **Cancel** button (`variant="secondary"`) inside `demo-customer-form` (`projects/demo/src/app/components/demo-customer-form/demo-customer-form.component.html` lines 14–18).
- Verify: the Cancel button is now clearly visible against the module body background (`--cba-bg-secondary`, `#F2F0E8`) — it has a light cream fill (`#FDFCF8`) and a warm gray border. Before the fix it was invisible (same color as the panel).

### 6.4 No regressions
- Verify the **primary**, **ghost**, **danger**, and **success** button variants are visually unchanged in the matrix.
- Verify button sizes (`sm`, `md`), truncation, icon-only, and block layouts are unaffected.

### 6.5 Optional screenshot capture
- If a browser automation tool is available, capture screenshots of (a) the Buttons matrix section and (b) the New Customer form for the verification record. Save them under `.playwright-mcp/` (already used for this purpose). These are transient artifacts — do NOT commit them (see step 7.4).

### 6.6 Verification outcome
- If any of the three surfaces, the New Customer Cancel button, or a regression check fails, STOP and report the discrepancy to the caller. Do NOT attempt code fixes beyond the single caption edit in step 2.
- If all checks pass, proceed to step 7.

## 7. Changelog update

### 7.1 File
- `CHANGELOG.md` (repo root).

### 7.2 Locate insertion point
- Read the first ~40 lines of `CHANGELOG.md`.
- The current top dated header is `## [0.18.4] — 2026-08-20` (line 33).
- The new header `## [0.18.5] — 2026-08-20` must be inserted **above** `## [0.18.4] — 2026-08-20` and **below** the introductory block (the line `> Releases prior to 0.8.1 predate this changelog and are not reconstructed retroactively.` at line 31, followed by a blank line).

### 7.3 Exact insertion
- Insert the following block between line 31 (the `> Releases prior...` line) and the `## [0.18.4]` header. Use `vscode-mcp-server_replace_lines_code` targeting the blank line 32 + the `## [0.18.4]` header line 33, replacing them with: new `## [0.18.5]` block + blank line + `## [0.18.4]` header.
- `originalCode` (lines 32–33, exactly):
```text

## [0.18.4] — 2026-08-20
```
- `content` (new):
```text

## [0.18.5] — 2026-08-20

### Fixed

- `cba-button--secondary` variant background changed from `var(--cba-bg-secondary)` to `var(--cba-bg-elevated)` so the button is visibly distinct from `--cba-bg-secondary` panel/module-body surfaces (previously invisible inside `cba-module-container` bodies such as the demo New Customer form Cancel button). Spec: `.kilo/plans/20260820-fix-secondary-button-bg-frontend-spec.md` §2.
- Demo button matrix caption for `cba-button--secondary` aligned to the actual border token (`var(--cba-border-default)` instead of the stale `var(--cba-border-subtle)`) so the demo documentation matches the component SCSS source of truth. Spec §4.3.

### Changed

- (none)

## [0.18.4] — 2026-08-20
```
- Use real newline characters (per `.kilo/rules/newline-prevention.md`); no literal `\n` escapes.

### 7.4 Changelog rule compliance
- Per `.kilo/rules/changelog-versioning.md`: NO `[Unreleased]` section may be introduced. Confirm the inserted block uses a dated header `## [0.18.5] — 2026-08-20`.
- Confirm the version in `package.json` (line 3) is `0.18.5` — it matches the new changelog header (already bumped in step 3 of the Critical Workflow).
- Re-read the top of `CHANGELOG.md` to confirm ordering: `## [0.18.5] — 2026-08-20` immediately precedes `## [0.18.4] — 2026-08-20`.

## 8. Final pre-commit checks

### 8.1 Gitignore compliance
- Run: `git status`
- Confirm the only newly modified/staged files are:
  - `projects/demo/src/app/components/demo-button-matrix/demo-button-matrix.component.ts`
  - `CHANGELOG.md`
- Confirm `dist/`, `node_modules/`, `.angular/`, `.playwright-mcp/`, and `*.tsbuildinfo` do NOT appear as staged. If any appear staged, unstage them (`git restore --staged <path>`).
- The untracked planning/TODO files (`.agent/todos/20260820/20260820-todo-2.md`, `.kilo/plans/20260820-*.md`) may be left untracked for now; they are handled by later Critical Workflow steps.

### 8.2 Lint (optional sanity check)
- Run (single command): `npm run lint`
- Expected: clean (no new errors). The caption edit is a string literal change; lint should be unaffected. If lint fails on the edited file, re-check step 2.4 for typos.

### 8.3 Build sanity (already done in steps 3 & 5)
- No additional build needed. If a re-verify is desired, `npm run build` runs both `build:lib` and `build:demo`.

## 9. Commit (NO push)

### 9.1 Stage only the intended files
- Stage exactly:
  - `git add projects/demo/src/app/components/demo-button-matrix/demo-button-matrix.component.ts`
  - `git add CHANGELOG.md`
- Do NOT use `git add .` or `git add -A`. Do NOT stage `.playwright-mcp/`, `dist/`, `node_modules/`, or planning/TODO files.

### 9.2 Commit message
- Use this exact message (matches repo `fix(scope): ...` + `docs:` conventions):
```text
fix(demo): align secondary button caption border token and changelog
```
- Body (optional, single paragraph):
```text
Align demo button matrix caption for cba-button--secondary to
var(--cba-border-default) per front-end spec §4.3, matching the
component SCSS source of truth. Add [0.18.5] — 2026-08-20 changelog
entry documenting the secondary background fix (--cba-bg-elevated).
```

### 9.3 Verify commit
- Run: `git log --oneline -3`
- Expected: new commit at HEAD, on top of `2e79063 chore: bump version to 0.18.5`.
- Run: `git status` — working tree clean except untracked planning/TODO files and `.playwright-mcp/` screenshots.

### 9.4 No push
- DO NOT run `git push`. Push to `origin` is restricted to Critical Workflow step 5 and is performed by the implementer in that later step only.

## 10. Edge cases & gotchas

- **Stale `node_modules/@cobranza-apps/ui`:** If step 4 `npm install` is skipped, the demo build will compile against the *previous* `dist/` snapshot and the visual fix will not appear. Always run `npm install` after `build:lib` and before `build:demo`.
- **Stale `.angular/cache`:** If `build:demo` reports stale results or template errors that don't match the source, the `start:demo` script already runs `rimraf .angular/cache`. For `build:demo` (no rimraf), manually delete `.angular/cache` (it is gitignored) and re-run `build:demo` if a stale-cache symptom appears.
- **Caption string exact match:** The caption uses middle-dot characters (`·`, U+00B7), not hyphens. Preserve them exactly; only `subtle` → `default` changes.
- **Two same-date headers:** `0.18.4` and `0.18.5` both carry `— 2026-08-20`. This is correct per Keep a Changelog (date is the release date, not a unique key).
- **No `[Unreleased]` section:** Per `.kilo/rules/changelog-versioning.md`, never add an `[Unreleased]` section. The `[0.18.5]` header is the release header.
- **`.playwright-mcp/` screenshots:** Transient verification artifacts. Do NOT commit. If they clutter the working tree, they may be left untracked or deleted manually; they are not gitignored but are not source files.
- **Scope discipline:** Do NOT edit `src/components/button/cba-button.component.scss` (already committed correctly), `src/theme/_variables.scss`, other variant captions, other demo components, or docs (`docs/CBA_BUTTON.md`, `README.md`). The only code/doc edits in this task are step 2 (caption) and step 7 (changelog).
- **Version discipline:** Do NOT bump `package.json` again. Version `0.18.5` is already set and matches the changelog header.
- **Branch discipline:** Do NOT create, switch, or merge branches. That is restricted to Critical Workflow steps 2 and 5.

## 11. Completion signal

When all steps are done, report to the caller:
- What was done: caption aligned; library built; local dep reinstalled; demo built; visual verification passed (list the surfaces checked); changelog updated; commit created (hash).
- What was NOT done: no push (deferred to step 5); TODO file not marked `[DONE]` (deferred to step 4.6); no merge to `main` (deferred to step 5).
- Plan path: `.kilo/plans/20260820-fix-secondary-button-bg-task1.md`.
