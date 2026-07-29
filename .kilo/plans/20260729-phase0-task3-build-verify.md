# Phase 0 — Task 3: Clean-up & Build Verification (Implementation Plan)

> **TODO:** `.agent/todos/20260729/20260729-todo-1.md` — Task 7
> **Global plan:** `.kilo/plans/20260729-phase0-library-scaffolding.md`
> **Branch:** `feat/phase0-library-scaffolding`
> **Scope:** TODO Task 7 only (clean-up + build/test verification). Do NOT touch other tasks.

---

## Pre-Analysis (Architector findings)

### Codebase state inspected

- **No leftover demo/placeholder components or NgModules.** Grep across `src/` found:
  - Zero `@NgModule` usages.
  - Zero `@Component` usages.
  - Zero `.component.ts` / `.module.ts` / `.service.ts` files.
  - Zero `.html` template files.
  - Zero `.spec.ts` test files.
- All 8 component barrels exist as pure `export {};` with doc comments:
  `button`, `card`, `badge`, `empty-state`, `skeleton`, `modal`, `module-header`, `module-container`.
- `src/lib/public-api.ts` is `export {};` with clear "how to add exports" documentation.
- Theme folder has 4 real SCSS files (`_variables.scss`, `_utilities.scss`, `_mixins.scss`, `theme.scss`).
- `src/lib/directives/.gitkeep` is an **intentional** placeholder for an still-empty folder — NOT CLI boilerplate. **Keep it.**

### No CLI-application boilerplate at project root

Glob confirmed absence of: `angular.json`, `karma.conf.js`, `main.ts`, `.browserslistrc`.
The project is a pure `ng-packagr` library — there is no Angular CLI application host, so there
are no demo `app/` components, no `main.ts` bootstrap, and no `karma` config to remove.

### Build configuration

- Build script (`package.json`): `ng-packagr -p ng-package.json -c tsconfig.lib.json`.
- There is **no** `angular.json` workspace, so `ng build ui` is **not** the command to use.
  The correct build command is `npm run build`.
- `ng-package.json`: entry `src/lib/public-api.ts`, dest `./dist`.
- `dist/` already contains a prior build (gitignored): `fesm2022/`, `package.json`, `README.md`, `types/`.
- `.gitignore` covers: `dist/`, `node_modules/`, `package-lock.json`, `.git-credentials`,
  `.kilo/agent-manager.json`.

### Conclusion

Clean-up is a **no-op verification** — nothing needs deletion. Task 3 is confirmatory:
re-run the build, inspect `dist/`, re-run tests, and confirm no regressions.

### Technical & architecture decisions

- Build via `npm run build` (ng-packagr direct), not `ng build`.
- A clean `dist/` rebuild is recommended so the inspection reflects the current source, not a stale
  prior build. The implementer will delete `dist/` before rebuilding. `dist/` is gitignored, so this
  is safe and creates no tracked changes.
- `npm test` uses `jest --passWithNoTests`; with zero spec files it exits 0 ("No tests found"). This
  is the expected pass condition for Phase 0.
- `npm run lint` is included as an additional gate (consistent with `context.md` which states lint
  passes). Not strictly required by TODO Task 7, but cheap and ensures a clean baseline.
- Only commit if the clean-up scan actually deletes files (expected: none). If nothing is deleted,
  there are no tracked changes from this step; the `[DONE]` mark + commit happens in step 4.6.

---

## Implementation Plan (for Implementer — step 4.2)

### Step 0 — Pre-flight gitignore compliance

**Goal:** Confirm working tree is clean before starting and nothing unwanted is staged.

1. Run: `git status`
2. Confirm:
   - On branch `feat/phase0-library-scaffolding`.
   - No `dist/`, `node_modules/`, `package-lock.json`, or `.git-credentials` files staged.
   - (If any gitignored file is staged, unstage it per `.kilo/rules/gitignore-compliance.md`.)

### Step 1 — Clean-up scan (verification, expected no-op)

**Goal:** Verify there are no unused CLI-generated files to delete. Document the finding.

1. Run a grep for any leftover Angular CLI artifacts in `src/`:
   - `grep -r "\.component\.ts\|\.module\.ts\|\.service\.ts" src/` (include `*.ts`)
   - Expected: **No files found.**
2. Run a grep for NgModule/Component decorators:
   - `grep -r "NgModule\|@Component" src/`
   - Expected: **No files found.**
3. Glob for any stray template/spec files:
   - `glob src/**/*.html` → Expected: none.
   - `glob src/**/*.spec.ts` → Expected: none.
4. Glob for root-level CLI app boilerplate:
   - `glob {angular.json,karma.conf.js,main.ts,.browserslistrc}` → Expected: none.
5. **Decision gate:**
   - If any of the above returned results → delete the offending files/folders and proceed.
   - If all are empty (expected) → no deletion. Proceed to Step 2. **Do NOT delete**
     `src/lib/directives/.gitkeep` (intentional placeholder for an empty folder).

### Step 2 — Clean dist rebuild

**Goal:** Produce a fresh build from current source for accurate inspection.

1. Delete the stale build output so inspection reflects current source:
   - PowerShell: `Remove-Item -LiteralPath dist -Recurse -Force`
   - (Safe: `dist/` is gitignored.)
2. Run the build:
   - `npm run build`
3. **Verify build success:**
   - Exit code is `0`.
   - Output contains no `ERROR` / `error TS` / `Compilation failed` lines.
   - ng-packagr finishes with the "Building Angular Package" → "Built Angular Package" sequence
     (or equivalent success message) for entry `src/lib/public-api.ts`.

### Step 3 — dist inspection (verification checklist)

**Goal:** Confirm the built package manifest and entry points are correct.

1. List dist contents:
   - PowerShell: `Get-ChildItem dist -Recurse -Name` (use bash tool, single command)
2. Read the generated manifest:
   - `Get-Content dist\package.json` (bash tool)
3. Verify each item on this checklist (mark pass/fail in the completion summary):

   | # | Check | Expected |
   |---|-------|----------|
   | a | Package name | `dist/package.json` `"name"` equals `"@cobranza-apps/ui"` |
   | b | Version | equals `"0.1.0"` (matches root `package.json`) |
   | c | Entry point exists | `dist/fesm2022/` directory present with a `*.mjs` bundle |
   | d | Type declarations | `dist/types/` directory present with `.d.ts` files |
   | e | README copied | `dist/README.md` present |
   | f | Single entry point only | No secondary entry-point subfolders like `dist/button/`, `dist/theme/`, `dist/modal/` (Phase 0 uses one entry only) |
   | g | Peer deps match | `dist/package.json` `peerDependencies` matches root `package.json` peer deps (Angular 22, ng-bootstrap ^21, bootstrap ^5.3, Font Awesome packs with `^6.0.0 \|\| ^7.0.0` ranges) |
   | h | No unwanted files | No `*.spec.*`, no `*.html` templates, no `node_modules/`, no source `.ts` (only `.d.ts`) inside `dist/` |

### Step 4 — Test verification

**Goal:** Confirm the test suite still passes.

1. Run: `npm test`
2. **Verify:**
   - Exit code is `0`.
   - Jest reports "No tests found" (expected for Phase 0, since `--passWithNoTests` and no
     `*.spec.ts` exist) OR runs 0 tests with success.
   - No test failures, no TypeScript compilation errors from `tsconfig.spec.json`.

### Step 5 — Lint gate (additional, cheap)

**Goal:** Confirm lint baseline is clean.

1. Run: `npm run lint`
2. **Verify:** Exit code `0`, no errors. (Info/unused-var warnings on empty `export {};` barrels are
   acceptable; errors are not.)

### Step 6 — Gitignore compliance re-check + commit decision

**Goal:** Ensure no gitignored artifacts got staged and commit only real changes.

1. Run: `git status`
2. Confirm `dist/` and `node_modules/` are NOT staged (gitignored). `package-lock.json` is also
   gitignored per `.gitignore` line 41 — verify it is not staged.
3. **Commit decision:**
   - If Step 1 deleted files → stage only those deletions and commit:
     - Message: `chore(phase0): remove leftover CLI-generated boilerplate`
     - (Use a message reflecting the actual deletions if different.)
   - If Step 1 deleted nothing (expected) → no source changes were made by this step.
     Do **NOT** create an empty commit. The `[DONE]` mark and its commit occur in step 4.6.

### Step 7 — Completion summary

Produce a clear summary for the caller containing:

- Clean-up scan result (files found / deleted; expected "nothing to delete").
- Build result (exit code, success message presence).
- dist inspection checklist results (a–h, all pass/fail).
- Test result (exit code).
- Lint result (exit code).
- Git status at end (branch, staged/unstaged).
- Whether a commit was made (and its message) or "no commit needed".

---

## Verification Criteria (for step 4.5 — Architector verification)

The 4.5 verification agent must confirm ALL of the following:

1. Clean-up scan was performed and the result documented (no leftover NgModules/components/boilerplate).
2. `npm run build` exits 0 with no errors.
3. `dist/package.json` `name` === `@cobranza-apps/ui`.
4. `dist/` contains exactly the expected ng-packagr output (fesm2022, types, package.json, README.md)
   and NO secondary entry-point subfolders.
5. `npm test` exits 0.
6. `npm run lint` exits 0 (or only acceptable warnings).
7. `git status` shows no gitignored files staged.
8. TODO Task 7 requirements are fully met by the build/test evidence above.

---

## Out of scope (do NOT do)

- Do NOT remove `src/lib/directives/.gitkeep`.
- Do NOT implement any component, directive, or design token (Phase 1+).
- Do NOT modify `package.json` peer deps, `ng-package.json`, or `tsconfig*.json` (handled in Task 1).
- Do NOT run `ng build ui` (no `angular.json` exists; this is a pure ng-packagr library).
- Do NOT commit `dist/`, `node_modules/`, or `package-lock.json`.
- Do NOT mark TODO Task 7 as `[DONE]` (that is step 4.6).
- Do NOT touch other TODO tasks.