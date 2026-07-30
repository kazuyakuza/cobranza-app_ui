# Phase 1 — Task 8: Build Verification (Implementation Plan)

> **TODO:** `.agent/todos/20260729/20260729-todo-2.md` — Task 8 (Build verification)
> **TODO section:** `### 8. Build verification` (lines 204–208)
> **Branch context:** Phase 1 Theme Foundation branch (continuation of Tasks 1–7, all `[DONE]`).
> **Scope:** Task 8 only. Do NOT touch Task 9 (documentation/tests) or any other TODO task.

---

## Task 8 (verbatim, from TODO)

```text
### 8. Build verification

- [ ] Run the library build and confirm it succeeds with the new SCSS.
- [ ] Fix any Sass compilation errors (missing partials, wrong `@use` paths, etc.).
- [ ] Spot-check that the generated package contains the theme styles (or that the import path documented for consumers is valid).
```

---

## Pre-Analysis (Architector findings)

### Source state inspected

Phase 1 theme sources are all present in `src/lib/theme/`:

- `_variables.scss` — design tokens under `:root` (Task 1, DONE)
- `_utilities.scss` — utility classes mapped to `var(--cba-*)` (Task 2, DONE)
- `_mixins.scss` — `cba-focus-ring`, `cba-elevated-surface`, `cba-hover-surface` (Task 3, DONE)
- `_base.scss` — base typography & defaults (Task 5, DONE)
- `theme.scss` — entry point (`@use 'variables'; @use 'base'; @use 'mixins'; @use 'utilities';`) (Tasks 4 & 5, DONE)

### Build configuration

- `package.json` build script: `ng-packagr -p ng-package.json -c tsconfig.lib.json` (i.e. `npm run build`).
- No `angular.json` → do NOT use `ng build`; use `npm run build` only.
- `ng-package.json` (current, verbatim):
  ```json
  {
    "$schema": "./node_modules/ng-packagr/ng-package.schema.json",
    "dest": "./dist",
    "assets": [
      {
        "glob": "**/*.scss",
        "input": "src/lib/theme",
        "output": "theme"
      }
    ],
    "lib": {
      "entryFile": "src/lib/public-api.ts",
      "styleIncludePaths": ["src/lib/theme"]
    }
  }
  ```
  - The `assets` glob copies every `.scss` under `src/lib/theme/` into `dist/theme/`, preserving relative structure. This is the mechanism that makes the theme importable by consumers.
- `package.json` (current) exposes the theme subpath for consumers:
  ```json
  "exports": {
    "./theme": { "sass": "./theme/theme.scss" }
  }
  ```
  - This `exports` map must survive the build into `dist/package.json` so that `@use '@cobranza-apps/ui/theme';` resolves.

### dist state

- `dist/` does **not** currently exist (glob `dist/**` returned no files). This is expected — the Phase 1 SCSS will be compiled/copied on the next build. A clean build from current source will be run rather than inspecting stale output.

### Potential Sass compilation risk surfaces

The build runs ng-packagr, which uses `dart-sass` for inline component styles. `theme.scss` itself is **not** inlined into any TS entry (it is shipped as a raw asset); however, if any component style or `styleIncludePaths` resolution references the partials at build time, the `@use` paths must be correct. Current `theme.scss` uses unprefixed `@use 'variables'` / `'base'` / `'mixins'` / `'utilities'`, which resolves against the same folder and against `styleIncludePaths: ["src/lib/theme"]`. Risk is low; the build is the source of truth.

Likely error classes and their fix location (documented for the implementer, only applied if actually encountered):

| Error class | Example message | Fix location | Fix pattern |
|---|---|---|---|
| Missing partial | `Can't find stylesheet to import.` | `src/lib/theme/*.scss` `@use` path | Ensure the referenced partial file exists and the `@use` identifier matches the filename without leading `_` and `.scss`. |
| Wrong `@use` ordering | `@use rules must come before other rules.` | `src/lib/theme/theme.scss` | Move all `@use` to the very top of `theme.scss`, before any rules/comments-only are fine above but no `@use` after rules. |
| Undefined mixin/function used | `Undefined mixin cba-focus-ring.` | consumer/caller file | Not applicable here; build only compiles library TS entry. |
| Asset glob mismatch | ng-packagr asset error | `ng-package.json` | Confirm `input` dir exists and `output` is relative. Already verified. |

### Technical & architecture decisions

1. **Use `npm run build`, never `ng build`.** There is no `angular.json`; this is a pure ng-packagr library. (Same decision as Phase 0 Task 3 plan, reasserted for Phase 1.)
2. **Clean rebuild.** `dist/` is gitignored. Delete it before building so inspection reflects current Phase 1 source, not a stale prior build. Safe — no tracked changes.
3. **Theme is shipped as raw SCSS assets, not as compiled CSS.** The `ng-package.json` `assets` glob is the shipping mechanism; ng-packagr does **not** compile `theme.scss` to CSS. Verification must confirm that `dist/theme/` contains the **source SCSS** (partial files like `theme.scss`, `_variables.scss`, etc.), not a compiled `theme.css`.
4. **` exports` subpath is the consumer contract.** `dist/package.json` MUST preserve `"./theme": { "sass": "./theme/theme.scss" }`. ng-packagr copies the root `package.json` field-by-field into `dist/package.json`, so this should survive automatically; verification is still required because the spot-check is an explicit TODO requirement.
5. **No code changes are expected.** This task is primarily confirmatory ("Run the library build and confirm it succeeds"). The implementer will only modify `src/lib/theme/*.scss` or `ng-package.json` if the build actually fails with a Sass error, and only with the minimum change necessary. Any non-trivial fix must be reported back; scope creep into Task 9 (docs) is forbidden.
6. **Commit policy.** If a Sass fix is required, commit it with a focused message. If the build passes cleanly with no source edits, no commit is made by this step; the `[DONE]` mark + commit happens in step 4.6.

---

## Implementation Plan (for Implementer — step 4.2)

### Step 0 — Pre-flight gitignore compliance

**Goal:** Confirm clean working tree and no gitignored artifact staged.

1. Run: `git status`
2. Confirm:
   - On the Phase 1 feature branch (e.g. `feat/phase1-theme-foundation`).
   - Tasks 1–7 changes are already committed (clean tree, or only expected uncommitted work if any).
   - No `dist/`, `node_modules/`, `package-lock.json`, or `.git-credentials` files staged.
   - If any gitignored file is staged, unstage it per `.kilo/rules/gitignore-compliance.md`.

### Step 1 — Clean dist rebuild

**Goal:** Produce a fresh build from current Phase 1 source for accurate inspection.

1. Delete stale build output (safe; `dist/` is gitignored):
   - PowerShell: `Remove-Item -LiteralPath dist -Recurse -Force`
   - If `dist` does not exist, the command may error; treat as non-fatal and continue.
2. Run the build:
   - `npm run build`
3. **Verify build success:**
   - Exit code is `0`.
   - Output contains **no** `ERROR` / `error TS` / `Compilation failed` / Sass `Can't find stylesheet` lines.
   - ng-packagr prints the normal "Building Angular Package" → "Built Angular Package" sequence for entry `src/lib/public-api.ts`.

### Step 2 — Sass compilation error handling (conditional)

**Goal:** Fix errors ONLY if Step 1 failed.

**Decision gate:**
- If Step 1 build exit code is `0` and there are no Sass-related warnings/errors → **skip this step entirely** and go to Step 3.
- If the build failed with a Sass compilation error → triage and apply the **minimum** fix:

  1. Read the exact error message(s). Identify the offending file and line.
  2. Map to a fix pattern from the risk table in Pre-Analysis. Common cases:
     - **Missing/partial path mismatch:** inspect `src/lib/theme/theme.scss` and each `_*.scss` partial. Confirm every `@use '<name>'` resolves to a file `<name>.scss` or `_<name>.scss` in the same directory (or in `styleIncludePaths`).
     - **`@use` ordering:** ensure all `@use` directives are at the top of `theme.scss`, before any non-`@use`/non-comment rules.
     - **Undefined variable/mixin:** ensure variables are declared in `_variables.scss` (under `:root` they are CSS custom properties; SCSS `$vars` are separate) before being referenced by mixins/utilities via `var(--cba-*)`.
  3. Apply the smallest possible edit using a structured editor (`vscode-mcp-server_replace_lines_code` or `edit`), preserving existing surrounding code (Rule: Preserve Existing Code).
  4. Re-run: `npm run build`
  5. **Loop limit:** maximum 3 triage iterations. If the error persists after 3 attempts, stop and return the raw error to the caller for escalation. Do NOT make speculative large rewrites.
- If the build failed with a **non-Sass** error (TypeScript, ng-packagr config, missing dependency) → do NOT attempt a fix. Stop and return the raw error to the caller, since this task's scope is Sass compilation only.

### Step 3 — Inspect `dist/theme/` contents

**Goal:** Spot-check that the generated package contains the theme styles (TODO Task 8, line 208).

1. List the shipped theme assets:
   - PowerShell: `Get-ChildItem -LiteralPath dist\theme -Recurse -Name`
   - If `dist\theme` does not exist → the `assets` glob in `ng-package.json` is not being applied; report failure and stop (this is a config/manifest issue, not in scope for a silent fix).
2. **Verify checklist:**

   | # | Check | Expected |
   |---|-------|----------|
   | a | Entry shipped | `dist/theme/theme.scss` present |
   | b | All partials shipped | `dist/theme/_variables.scss`, `dist/theme/_base.scss`, `dist/theme/_mixins.scss`, `dist/theme/_utilities.scss` all present |
   | c | No compiled CSS leakage | `dist/theme/` contains only `.scss` files (no `theme.css` or `*.css`) — theme is shipped as raw SCSS for `@use` by consumers |
   | d | Filename casing | Matches source casing exactly (Windows is case-insensitive at build time, but consumers on case-sensitive OSes need exact match) |

### Step 4 — Verify `dist/package.json` `./theme` export

**Goal:** Confirm the consumer import path documented in Task 6 is valid in the built package.

1. Read the generated manifest:
   - PowerShell: `Get-Content -LiteralPath dist\package.json`
2. **Verify checklist:**

   | # | Check | Expected |
   |---|-------|----------|
   | a | `name` field | `"@cobranza-apps/ui"` |
   | b | `version` field | equals root `package.json` version (`"0.2.0"` at time of planning — verify against current root value) |
   | c | `exports["./theme"]` present | key exists |
   | d | `exports["./theme"].sass` | equals `"./theme/theme.scss"` |
   | e | Path resolves | `dist/theme/theme.scss` actually exists (cross-check with Step 3a) — i.e. the `sass` export target is a real file inside the built package |

3. **Consumer path spot-check (validation):** Construct the consumer `@use` statement and confirm it resolves against the built package:
   - Resolved path: `dist` + `/theme/theme.scss` (the `sass` export) → must be the file from Step 3a.
   - Document in the summary that `@use '@cobranza-apps/ui/theme';` is valid because `dist/theme/theme.scss` exists and `exports["./theme"].sass` points to it.

### Step 5 — Confirm no regressions in TS entry

**Goal:** Ensure the TypeScript public API (unchanged by Phase 1) still builds cleanly alongside the new SCSS.

1. Confirm `dist/fesm2022/` exists with a `*.mjs` bundle for the library entry.
2. Confirm `dist/types/` exists with `.d.ts` files.
3. These were verified in Phase 0; re-confirm only as a smoke test. Do NOT expand scope into component implementation.

### Step 6 — Gitignore compliance re-check + commit decision

**Goal:** Ensure no gitignored artifact got staged; commit only real fixes.

1. Run: `git status`
2. Confirm `dist/` and `node_modules/` are **not** staged (gitignored). `package-lock.json` and `.git-credentials` are also gitignored — verify none are staged.
3. **Commit decision:**
   - **If Step 2 applied a Sass fix** that touched `src/lib/theme/*.scss`:
     - Stage only those `src/lib/theme/*.scss` files (and `ng-package.json` ONLY if it was edited — unlikely).
     - Commit message: `fix(phase1-theme): correct SCSS @use paths so library build compiles`
       (adjust message to reflect the actual fix; keep it scoped to the real change.)
   - **If the build passed cleanly with no source edits:**
     - Do **NOT** create an empty commit. The `[DONE]` mark and its commit occur in step 4.6.
     - Do NOT mark TODO Task 8 lines as `[x]` here — that is step 4.6's responsibility.

### Step 7 — Completion summary

Produce a clear summary for the caller containing:

- Build result: `npm run build` exit code; success message present yes/no; full error text if Step 2 triaged (and what was changed, if anything).
- `dist/theme/` inspection results (checklist a–d, pass/fail).
- `dist/package.json` export results (checklist a–e, pass/fail) including the resolved consumer `@use` path validation.
- TS entry smoke test result (`dist/fesm2022/`, `dist/types/` present yes/no).
- Git status at end: branch, staged/unstaged; whether a commit was made (and its message) or "no commit needed".
- Explicit statement: "TODO Task 8 requirements: {met / partially met / not met}" with per-line status (line 206 run build, line 207 fix Sass errors, line 208 spot-check theme styles).

---

## Verification Criteria (for step 4.5 — Architector verification)

The 4.5 verification agent must confirm ALL of the following:

1. `npm run build` was run and exits `0` with no Sass/TypeScript compilation errors.
2. If a Sass error occurred, the implementer documented the error and the minimum fix applied (file, line, change); no out-of-scope edits were made.
3. `dist/theme/` exists and contains: `theme.scss`, `_variables.scss`, `_base.scss`, `_mixins.scss`, `_utilities.scss` (all as raw `.scss`).
4. `dist/theme/` contains no compiled `.css`.
5. `dist/package.json` preserves `"./theme": { "sass": "./theme/theme.scss" }` in its `exports` map.
6. The `sass` export target (`dist/theme/theme.scss`) is a real, existing file in the built package (consumer `@use '@cobranza-apps/ui/theme';` is valid).
7. `npm test` is **not** required by this task (Phase 1 has no SCSS unit tests; per TODO line 218 "No unit tests are required for pure SCSS tokens"); verification must not demand tests.
8. `git status` shows no gitignored files staged; any commit (if Sass fix was needed) is scoped to `src/lib/theme/` only.
9. TODO Task 8 sub-bullets (lines 206–208) are fully met by the build evidence above.

---

## Out of scope (do NOT do)

- Do NOT run `ng build` (no `angular.json`; pure ng-packagr library).
- Do NOT mark TODO Task 8 lines as `[x]` or append `[DONE]` — that is step 4.6's responsibility.
- Do NOT implement Task 9 (documentation, README theme section, comments at top of SCSS partials) — that is a separate task.
- Do NOT modify `package.json` peer deps, `tsconfig*.json`, or build configuration beyond the minimum needed to fix a Sass compilation error (and only if an error actually occurs).
- Do NOT compile `theme.scss` to CSS or add a compiled `.css` to the package — the theme ships as raw SCSS per Task 6 design.
- Do NOT add unit tests for SCSS tokens (TODO line 218 explicitly says none required).
- Do NOT touch other TODO tasks or other phases.
- Do NOT commit `dist/`, `node_modules/`, `package-lock.json`, or `.git-credentials`.