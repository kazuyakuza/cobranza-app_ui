# Per-Task Plan — Phase 0 / Task 2: Theme Folder Skeleton

> **Date:** 2026-07-29
> **TODO:** `.agent/todos/20260729/20260729-todo-1.md` → Task 4 (SCSS support and theme folder skeleton)
> **Global plan:** `.kilo/plans/20260729-phase0-library-scaffolding.md`
> **Branch:** `feat/phase0-library-scaffolding`
> **Agent (4.2):** implementer

---

## Pre-Analysis

### TODO Task 4 requirements

> - Confirm the library uses **SCSS** (`.scss` files).
> - Ensure the build can process SCSS (needed for the theme in Phase 1).
> - Create the theme folder structure with placeholder files only:
>   ```
>   src/lib/theme/
>   ├── _variables.scss      # placeholder – tokens come in Phase 1
>   ├── _utilities.scss      # placeholder
>   ├── _mixins.scss         # placeholder
>   └── theme.scss           # imports the partials (even if empty)
>   ```
> Example minimal `theme.scss`:
> ```scss
> @use 'variables';
> @use 'utilities';
> @use 'mixins';
> ```
> Do **not** implement design tokens or utility classes yet.

### Current state investigation

| Check | Finding |
| --- | --- |
| `package.json` `scripts.build` | `ng-packagr -p ng-package.json -c tsconfig.lib.json` → ng-packagr is the SCSS-capable build tool. |
| `ng-package.json` | `{ lib: { entryFile: "src/lib/public-api.ts" } }`, `dest: "./dist"`. Entry point is TS, not SCSS; theme SCSS is not part of the public API at this phase. |
| `package.json` direct Sass dep | **Not present** as a direct `dependency`/`devDependency`. |
| `node_modules/sass/package.json` | **Present**, version `1.102.0` (dart-sass, pure JS impl). |
| sass relationship to ng-packagr | `node_modules/ng-packagr/package.json` declares `"sass": "^1.81.0"` under `optionalDependencies`. Sass is therefore installed and resolvable by ng-packagr; the build **can** process SCSS. |
| `package.json` `scripts.format` | `prettier --write "src/**/*.{ts,scss,css,json,md}"` → SCSS is a first-class file type in this repo. |
| `src/lib/theme/` | Contains only `.gitkeep` (no SCSS files). |
| `.agent/project-structure.md` | Already lists `src/lib/theme/ - SCSS theme variables, utilities, mixins and entry file` → description already accurate, no structural-doc update needed. |
| `public-api.ts` | Minimal barrel; does not (and should not, in Phase 0) reference `theme.scss`. |

### Technical & architecture decisions

1. **SCSS support is confirmed working.** ng-packagr v22 + the transitively-installed `sass` (dart-sass `1.102.0`) satisfy `>=1.81.0`. No new dependency install is required for this task. sass being transitive (via ng-packagr `optionalDependencies`) is acceptable for Phase 0; if Phase 1 needs a pinned direct sass version it can be promoted to an explicit `devDependency` then. **Out of scope for this task.**
2. **No component references `theme.scss` yet.** ng-packagr only compiles SCSS reachable via component `styleUrls`/`styles` or the configured style include paths; an unreferenced standalone `theme.scss` is therefore **not** compiled by the library build. This keeps the build valid while the skeleton files establish structure for Phase 1. No `styleIncludePaths`/`ng-package.json` change is needed in this phase.
3. **Use modern Sass `@use` (not `@import`).** `@import` is deprecated by dart-sass. The TODO example already uses `@use`; this plan follows it. With dart-sass, `@use 'variables';` on a file that contains only comments is valid and compiles to no output.
4. **Placeholder content = comments only.** Per the TODO, partials carry placeholder comments and **no** tokens, utilities, or mixins. This avoids inventing design tokens (explicitly forbidden for Phase 0) and keeps partials build-cheap.
5. **Remove `.gitkeep`.** Once real files exist in `src/lib/theme/`, `.gitkeep` loses its purpose (it existed only so git tracked an empty directory). It will be removed with `git rm`. This keeps the folder clean ahead of Phase 1.
6. **No unit tests.** Phase 0 has no testable behaviour (header comment in `context.md` notes Phase 0 tests only what it delivers; SCSS placeholders deliver no logic). Build verification belongs to TODO Task 7, not this task.
7. **No `public-api.ts` change.** The theme entry is intentionally internal during Phase 0; it is not exported. Exporting theme helpers is a later-phase concern.

### Files touched summary

| Action | Path |
| --- | --- |
| Create | `src/lib/theme/_variables.scss` |
| Create | `src/lib/theme/_utilities.scss` |
| Create | `src/lib/theme/_mixins.scss` |
| Create | `src/lib/theme/theme.scss` |
| Delete | `src/lib/theme/.gitkeep` (via `git rm`) |

No changes to `package.json`, `ng-package.json`, `tsconfig*.json`, `public-api.ts`, or `.agent/project-structure.md`.

---

## High-Level Approach

The implementer will, on branch `feat/phase0-library-scaffolding`, create four placeholder SCSS files under `src/lib/theme/` with the exact content specified below, remove the now-redundant `.gitkeep`, verify the files exist and `theme.scss` uses `@use` correctly, then commit with a meaningful message. No design tokens, utilities, or mixins are authored. No dependency install, no build run, and no test run are required for this task (build verification is TODO Task 7).

---

## Detailed Implementation Steps (for 4.2)

> Blocked on the previous Critical Workflow steps being committed already. Working directory: `C:\projects\cobranza-app\front\ui`. Branch: `feat/phase0-library-scaffolding` (must be current).

### Step 1 — Confirm clean working state

- Run `git status` (allowed read-only). Confirm the only expected uncommitted state, if any, relates to upstream tasks; this task’s plan assumes TODO Task 4 is the active work and the theme dir still only contains `.gitkeep`.
- If unexpected staged files exist, return a question to the caller — do not commit unrelated work.

### Step 2 — Create `src/lib/theme/_variables.scss`

Use the structured file-creation tool (`write`) with **exactly** this content (placeholder comment only, no tokens):

```scss
//
// _variables.scss — design tokens for @cobranza-apps/ui.
//
// Placeholder for Phase 0: colours, spacing, typography, radii, shadows and
// z-index scales will be defined here in Phase 1. No tokens are introduced
// in this phase.
//
```

### Step 3 — Create `src/lib/theme/_utilities.scss`

Use the `write` tool with **exactly** this content:

```scss
//
// _utilities.scss — theme utility classes and helpers.
//
// Placeholder for Phase 0: reusable utility classes (and any SCSS helpers
// that are not full mixins) will be defined here in Phase 1. No utilities
// are introduced in this phase.
//
```

### Step 4 — Create `src/lib/theme/_mixins.scss`

Use the `write` tool with **exactly** this content:

```scss
//
// _mixins.scss — reusable SCSS mixins.
//
// Placeholder for Phase 0: parameterised mixins (e.g. responsive breakpoints,
// theme-aware colour accessors) will be defined here in Phase 1. No mixins
// are introduced in this phase.
//
```

### Step 5 — Create `src/lib/theme/theme.scss`

Use the `write` tool with **exactly** this content. This matches the TODO example minimal `theme.scss`, extended with a short header comment:

```scss
//
// theme.scss — @cobranza-apps/ui theme entry point.
//
// Aggregates the theme partials so consumers can load the whole theme by
// importing this single file. Tokens, utilities and mixins arrive in
// Phase 1; for now the partials are empty placeholders that establish the
// folder structure the build expects.
//
@use 'variables';
@use 'utilities';
@use 'mixins';
```

> Notes for the implementer:
> - Use `@use` (dart-sass), **not** the deprecated `@import`.
> - Do **not** add `as *` namespaces, `with:` configuration, or `forward` — the partials are empty; bare `@use` is the minimal valid form matching the TODO example.
> - Keep the three `@use` lines in this order (variables → utilities → mixins); it mirrors the TODO file list and is dependency-sound (utilities/mixins may later depend on variables).

### Step 6 — Remove `.gitkeep`

- `.gitkeep` is currently tracked. Remove it via git so the deletion is staged:
  - `git rm src/lib/theme/.gitkeep`
- Do **not** delete it by hand via filesystem tools only — using `git rm` ensures the deletion is recorded in the upcoming commit.

### Step 7 — Verify local correctness (no build, no test)

Before committing, verify:
- `Test-Path src\lib\theme\_variables.scss`, `_utilities.scss`, `_mixins.scss`, `theme.scss` all return `True`.
- `Test-Path src\lib\theme\.gitkeep` returns `False`.
- `Select-String -Path src\lib\theme\theme.scss -Pattern "^@use '(variables|utilities|mixins)';$"` returns three matches and **no** `@import` line.
- `Select-String -Path src\lib\theme\_variables.scss,_utilities.scss,_mixins.scss -Pattern "^\$|^\s*\$|^[a-z-]+:"` returns **no** rule declarations (only comments should be present — ensures no tokens/utilities/mixins leaked in).

If any check fails, fix and re-verify before proceeding. Do **not** run the build — that is TODO Task 7’s scope.

### Step 8 — Gitignore compliance check (per `.kilo/rules/gitignore-compliance.md`)

- Confirm `src/lib/theme/` is not matched by any `.gitignore` pattern (SCSS under `src/` is tracked; `dist/` is the ignored output, not `src/`).
- Confirm no `node_modules/`, `dist/`, or other ignored paths are staged.

### Step 9 — Commit

- Stage only the four new SCSS files and the `.gitkeep` deletion:
  - `git add src/lib/theme/_variables.scss src/lib/theme/_utilities.scss src/lib/theme/_mixins.scss src/lib/theme/theme.scss`
  - (The `.gitkeep` deletion is already staged by `git rm`.)
- Commit with message:
  ```
  feat(theme): add SCSS theme folder skeleton (Phase 0 placeholders)
  ```
  - First-line ≤ ~72 chars; this is a `feat` because it establishes new theme structure, scoped to `theme`.
- Confirm `git status` is clean afterwards.

### Step 10 — Signal completion

- Report back: files created (paths), `.gitkeep` removed, commit hash, and that no build/test was run (delegated to Task 7).
- Explicitly state what was **not** done: no design tokens, no utilities, no mixins, no `public-api.ts` change, no install, no build, no tests.

---

## Acceptance criteria (for 4.5 verification)

- [ ] `src/lib/theme/_variables.scss` exists and contains only the placeholder comment.
- [ ] `src/lib/theme/_utilities.scss` exists and contains only the placeholder comment.
- [ ] `src/lib/theme/_mixins.scss` exists and contains only the placeholder comment.
- [ ] `src/lib/theme/theme.scss` exists and contains the header comment plus exactly `@use 'variables'; @use 'utilities'; @use 'mixins';` (order preserved, no `@import`).
- [ ] `src/lib/theme/.gitkeep` does **not** exist.
- [ ] No changes to `package.json`, `ng-package.json`, `tsconfig*.json`, `public-api.ts`, or `.agent/project-structure.md`.
- [ ] No design tokens, utilities, or mixins are present (Phase 0 constraint).
- [ ] A single meaningful commit covers the four creations and the `.gitkeep` deletion.

---

## Verification against TODO Task 4

| TODO requirement | How this plan satisfies it |
| --- | --- |
| Confirm the library uses SCSS (`.scss` files) | Confirmed in Pre-Analysis: `prettier` formats `.scss`, `sass` installed (v1.102.0), all new files use `.scss`. |
| Ensure the build can process SCSS | Confirmed: ng-packagr v22 build + dart-sass `1.102.0` (≥ ng-packagr’s `optionalDependencies.sass ^1.81.0`). No further action needed this task. |
| Create `src/lib/theme/` with `_variables.scss`, `_utilities.scss`, `_mixins.scss`, `theme.scss` | Steps 2–5 create these exact files at these exact paths. |
| `theme.scss` imports the partials (`@use 'variables'; @use 'utilities'; @use 'mixins';`) | Step 5 produces exactly this. |
| Placeholder files only — no tokens, no utility classes | Steps 2–4 emit comments only; Step 7 includes a negative grep to enforce no declarations; Acceptance criteria restate this. |
| Example minimal `theme.scss` followed | Step 5 follows the TODO example, augmented by a header comment (allowed; the TODO says “Example minimal”). |

The plan matches every sub-bullet of TODO Task 4. No scope creep into Tasks 1–3, 5–7.