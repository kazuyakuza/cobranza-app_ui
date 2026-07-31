# Plan — Task 0: Move Source Code from `src/lib/` to `src/`

**Source TODO:** `.agent/todos/20260730/20260730-todo-2.md` (Task 0)
**Source Global Plan:** `.kilo/plans/20260730-phase4-core-components.md`
**Step:** Critical Workflow — Task 0, sub-step 4.1b (Analysis & Planning)
**Agent:** architector
**Branch:** `feat/phase4-core-components` (already checked out — verified)
**Date:** 2026-07-30

---

## 1. Goal

Flatten the source tree one level: move every file currently under `src/lib/` directly under `src/`, then delete the now-empty `src/lib/` directory. This is the only Angular library project, so the extra `/lib` nesting adds no value. All build, test, and lint tooling that points at `src/lib/...` must be repointed at `src/...` so `npm run build`, `npm test`, and `npm run lint` continue to pass.

**Constraints (from caller):**
- Move only — preserve every file's content byte-for-byte; do **not** edit component logic.
- Target structure: `src/components/`, `src/theme/`, `src/directives/`, `src/public-api.ts`.
- Delete the empty `src/lib/` directory after the move.
- `npm run build`, `npm test`, `npm run lint` must all pass after the move.

---

## 2. Current State (verified)

### 2.1 Entries currently under `src/lib/`

```
src/lib/
  components/
    badge/index.ts                      (placeholder barrel, exports {})
    button/index.ts                     (placeholder barrel, exports {})
    card/index.ts                       (placeholder barrel, exports {})
    empty-state/index.ts                (placeholder barrel, exports {})
    modal/index.ts                      (placeholder barrel, exports {})
    module-container/
      index.ts
      module-container.component.html
      module-container.component.scss
      module-container.component.spec.ts
      module-container.component.ts
      module-container.types.ts
    module-header/
      index.ts
      module-header.component.html
      module-header.component.scss
      module-header.component.spec.ts
      module-header.component.ts
      module-header.types.ts
    skeleton/index.ts                   (placeholder barrel, exports {})
  directives/
    .gitkeep
  theme/
    _base.scss
    _mixins.scss
    _utilities.scss
    _variables.scss
    theme.scss
  public-api.ts
```

Total: 3 top-level items under `src/lib/` (`components/`, `directives/`, `theme/`) plus `public-api.ts`.

### 2.2 Internal relative paths analysis (verified — all invariant under the move)

All intra-source imports are **relative to the file's own location** and the folder tree moves as a unit, so no source-file import needs to change:

- `src/lib/public-api.ts` → uses `./components/module-header` and `./components/module-container`. After move this file is `src/public-api.ts` and `components/` is at `src/components/`, so `./components/...` still resolves. **No change.**
- Component `.ts` files → `./module-header.types`, `./module-container.types`, `templateUrl: './module-header.component.html'`, `styleUrl: './module-header.component.scss'`. All sibling-relative. **No change.**
- Component barrel `index.ts` files → `export * from './module-header.types'` etc. Sibling-relative. **No change.**
- Spec files → `import { ModuleHeaderComponent } from './module-header.component'`. Sibling-relative. **No change.**
- Theme `theme.scss` → `@use 'variables'`, `@use 'base'`, `@use 'mixins'`, `@use 'utilities'`. Sibling-relative. **No change.**
- Component `.scss` files use only runtime CSS custom properties (`var(--cba-*)`); no `@use` of theme partials. **No change.**

> Conclusion: **zero source-file edits are required for the move itself.** Only config files point at absolute `src/lib/...` paths and need updating.

### 2.3 Source files containing `src/lib` in *comments* (out of scope for 4.2)

These are documentation comments, not code paths — they do not affect build/test/lint. Per the move-only constraint, they are left untouched in step 4.2 and deferred to step 4.4 (Documentation):

- `src/lib/public-api.ts` line 9: ` * 1. Implement the component, directive, pipe, or service inside \`src/lib/\`.`
- `src/lib/components/module-container/module-container.component.ts` line 34: ` * Exported from \`@cobranza-apps/ui\` via \`src/lib/public-api.ts\`.`
- `src/lib/components/module-container/module-container.component.scss` line 15: ` * All values come from \`--cba-*\` tokens (see src/lib/theme/_variables.scss).`

The same applies to repo-level docs (`README.md`, `docs/MODULE_CONTAINER.md`, etc.) that mention `src/lib/...`. These are tracked in step 4.4 and **must not** be edited in 4.2.

---

## 3. Configuration Files Requiring Changes

### 3.1 `ng-package.json` (MODIFY — 3 values)

```diff
   "assets": [
     {
       "glob": "**/*.scss",
-      "input": "src/lib/theme",
+      "input": "src/theme",
       "output": "theme"
     }
   ],
   "lib": {
-    "entryFile": "src/lib/public-api.ts",
-    "styleIncludePaths": ["src/lib/theme"]
+    "entryFile": "src/public-api.ts",
+    "styleIncludePaths": ["src/theme"]
   }
```

Effect: `ng-packagr` reads the public entry from `src/public-api.ts` and copies every `*.scss` under `src/theme/` into `dist/theme/` (same published shape, so `package.json` `exports["./theme"].sass` stays valid).

### 3.2 `tsconfig.lib.json` (MODIFY — 2 values)

```diff
-  "include": ["src/lib/**/*.ts"],
-  "exclude": ["src/lib/**/*.spec.ts"]
+  "include": ["src/**/*.ts"],
+  "exclude": ["src/**/*.spec.ts"]
```

`compilerOptions.outDir` (`./dist/out-tsc/lib`) is an **output directory name only** — it is unrelated to the `src/lib` input path and is intentionally left unchanged to minimize churn.

### 3.3 `tsconfig.json` (MODIFY — 1 value)

```diff
     "paths": {
-      "@cobranza-apps/ui": ["src/lib/public-api.ts"]
+      "@cobranza-apps/ui": ["src/public-api.ts"]
     }
```

### 3.4 `jest.config.js` (NO CHANGE — verify only)

`testMatch` is already `['<rootDir>/src/**/*.spec.ts']`, which already matches `src/lib/**/*.spec.ts` and will continue to match `src/components/**/*.spec.ts` after the move. No edit required. The implementer should **not** touch this file.

### 3.5 `package.json` (NO CHANGE — verify only)

`exports["./theme"].sass` is `"./theme/theme.scss"`, a path **relative to the published package root** (`dist/`), not to `src/`. `ng-packagr` still emits `dist/theme/theme.scss` (see §3.1). No edit required. The implementer should **not** touch this file.

### 3.6 `tsconfig.spec.json` (NO CHANGE — verify only)

`include` is `["src/**/*.spec.ts", "src/**/*.d.ts", "setup-jest.ts"]`, already broad enough. No edit required.

### 3.7 `eslint.config.js` (NO CHANGE — verify only)

`files: ['src/**/*.ts']` and the lint script `eslint "src/**/*.ts"` already cover the new layout. No edit required.

---

## 4. Step-by-Step Implementation (for step 4.2 / implementer)

> Working directory: `C:\projects\cobranza-app\front\ui`. Shell: PowerShell. All moves use `git mv` to preserve history. Commands are single (not chained).

### 4.1 Pre-checks

1. Run: `git status`
   - Verify clean tree (or commit any prior work first). Expected: on branch `feat/phase4-core-components`.
2. Run: `git rev-parse --abbrev-ref HEAD`
   - Confirm output: `feat/phase4-core-components`.

### 4.2 Move the four top-level entries out of `src/lib/`

Each command is a single `git mv` (run separately, per tool-selection-priority rule "single cmds only"):

3. `git mv src/lib/components src/components`
4. `git mv src/lib/theme src/theme`
5. `git mv src/lib/directives src/directives`
6. `git mv src/lib/public-api.ts src/public-api.ts`

> Order matters: move the three directories first, then the file. This avoids any name clash and leaves `src/lib/` empty.

### 4.3 Remove the now-empty `src/lib/` directory

7. `Remove-Item -LiteralPath "src/lib" -Force`
   - If Git tracks the now-empty folder, also remove its entry; empty dirs are not tracked by Git, so this is a filesystem-only cleanup. (Git already drops it once its last tracked child moves away; the explicit `Remove-Item` is a safety net if any untracked residue remains.)
8. Run: `Test-Path -LiteralPath "src/lib"`
   - Expect: `False`. If `True`, list remaining contents and remove them, then re-test.

### 4.4 Apply the config edits

Use structured editors (`vscode-mcp-server_replace_lines_code` or `edit`) — exact content validated against the file reads in §3.

9. Edit `ng-package.json`:
   - `"input": "src/lib/theme",` → `"input": "src/theme",`
   - `"entryFile": "src/lib/public-api.ts",` → `"entryFile": "src/public-api.ts",`
   - `"styleIncludePaths": ["src/lib/theme"]` → `"styleIncludePaths": ["src/theme"]`
10. Edit `tsconfig.lib.json`:
    - `"include": ["src/lib/**/*.ts"],` → `"include": ["src/**/*.ts"],`
    - `"exclude": ["src/lib/**/*.spec.ts"]` → `"exclude": ["src/**/*.spec.ts"]`
11. Edit `tsconfig.json`:
    - `"@cobranza-apps/ui": ["src/lib/public-api.ts"]` → `"@cobranza-apps/ui": ["src/public-api.ts"]`

**Do not** edit `jest.config.js`, `package.json`, `tsconfig.spec.json`, or `eslint.config.js` (see §3.4–3.7).

### 4.5 Sanity check the new tree

12. Run: `git status`
    - Expect: renames staged under `src/` for every moved file, plus modifications to the three config files. No deletions of content.
13. (Optional) `Get-ChildItem -LiteralPath "src" -Recurse -File | Measure-Object | Select-Object -ExpandProperty Count`
    - Confirm file count matches the pre-move count (same files, just relocated).

---

## 5. Verification Steps (must all pass before commit)

Run each as a single command, in order. Stop and report on the first failure.

14. `npm run build`
    - Builds via `ng-packagr -p ng-package.json -c tsconfig.lib.json`.
    - Success criteria: completes with no errors; `dist/` contains `public-api.*`, `theme/theme.scss`, and component folders; no warnings about missing `src/lib` paths.
15. `npm test`
    - Runs `jest --passWithNoTests`.
    - Success criteria: existing `module-header` and `module-container` specs pass (filesystem layout changed but Jest `testMatch` still resolves them). No "no tests found" regression (the two existing spec files must be discovered and pass).
16. `npm run lint`
    - Runs `eslint "src/**/*.ts"`.
    - Success criteria: zero errors, zero warnings.

If any of the three fails, see §6 (Rollback).

### 5.1 Post-verification residual reference scan

17. Run (ripgrep) for any remaining `src/lib` reference in tracked *source/config* files (excluding `.kilo/plans/`, `.agent/todos/`, and other historical markdown):
    `rg -n "src/lib" --glob "!**/.kilo/**" --glob "!**/.agent/todos/**"`
    - Acceptable remaining hits: documentation markdown (`README.md`, `docs/*.md`) and the three in-code comment lines listed in §2.3 — all to be handled in step 4.4 (Documentation).
    - Unacceptable hits: any non-comment `src/lib` path inside `.json`/`.ts`/`.js` config or source.
18. Run diagnostics on edited config files:
    `vscode-mcp-server_get_diagnostics_code` (path = each of the three edited files). Expect zero errors.
19. Run: `vscode-mcp-server_get_diagnostics_code` (workspace scope). Expect zero errors/warnings introduced by the move.

---

## 6. Commit

20. Stage only the intended changes per [Gitignore Compliance](../.kilo/rules/gitignore-compliance.md):
    - Run `git status`. Confirm nothing matching `.gitignore` (`node_modules/`, `dist/`, etc.) is staged.
    - `git add -A` is acceptable **only** after verifying the status output shows only moved files + the three config files (plus `dist/` is gitignored, so it will not be staged).
21. Commit (single command):
    `git commit -m "refactor: move source from src/lib to src (flatten library root)"`
    - Body optional. Keep one-line message in the repo's established style.

---

## 7. Rollback Plan (if verification in §5 fails)

If `npm run build`, `npm test`, or `npm run lint` fails after the move:

1. Do **not** commit. Keep the working tree as-is for diagnosis.
2. Capture the failure output (build/test/lint) for the reviewer.
3. Hard revert to last good commit (drops all move work):
   `git restore --staged . ; git restore . ; git clean -fd src`
   - This unstages renames, restores config edits, and removes any untracked files created under `src/` (e.g. stray generated files). Re-run `git status` to confirm a clean tree back on `feat/phase4-core-components` at the pre-move commit.
4. Alternatively, if only a single config value is wrong, fix just that value with a targeted edit and re-run §5 from step 14.
5. If the failure is non-obvious (e.g. `ng-packagr` resolves an unexpected path), stop and return the failure to the caller with the exact command and stderr — do not attempt further speculative edits.

---

## 8. Expected Deliverables (proof of completion for step 4.2)

- `src/components/`, `src/theme/`, `src/directives/`, `src/public-api.ts` exist with the original contents.
- `src/lib/` no longer exists.
- `ng-package.json`, `tsconfig.lib.json`, `tsconfig.json` updated per §3.
- `jest.config.js`, `package.json`, `tsconfig.spec.json`, `eslint.config.js` **unchanged** (verify `git diff` shows no edits to them).
- `npm run build`, `npm test`, `npm run lint` all pass.
- One commit on `feat/phase4-core-components` with the message in §6.
- No component `.ts`/`.html`/`.scss`/`.spec.ts` content edits (only path relocation via `git mv`).

---

## 9. Out of Scope (explicitly deferred — handled by other Critical Workflow steps)

- Updating `src/lib` references inside code comments and markdown docs (`README.md`, `docs/MODULE_CONTAINER.md`, `docs/MODULE_HEADER.md`, `docs/THEME.md`, etc.) → **step 4.4 (Documentation)**.
- Code review / simplification of the move → **step 4.3**.
- Marking Task 0 `[DONE]` in the TODO file → **step 4.6**.
- Tasks 1–5 (component implementations) → separate tasks, not this plan.
- Version bump → already handled in Critical Workflow step 3 (`0.5.0` already set per `package.json`).