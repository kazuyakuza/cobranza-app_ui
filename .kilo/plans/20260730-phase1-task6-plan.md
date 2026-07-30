# Phase 1 — Task 6 Implementation Plan: Make the Theme Consumable

> Source todo: `.agent/todos/20260729/20260729-todo-2.md` (Task 6)
> Front-end spec: `.kilo/plans/20260730-phase1-task6-frontend-spec.md`
> Scope boundary: This plan covers **only** Task 6 (theme consumption). It does NOT touch Task 7 (public API/TS exports) or Task 9 (full `/docs` documentation). A minimal README note is included because TODO Task 6 explicitly requires documenting the consumer import path; the full `docs/THEME.md` is deferred to Task 9.

---

## 1. High-Level Approach

Make the `theme.scss` bundle consumable by downstream apps (Shell + MFEs) after the `ng-packagr` build, without changing any SCSS source or any TypeScript public API:

1. **Copy theme SCSS into `dist/`** via the `ng-packagr` `assets` config so consumers can import the published SCSS.
2. **Register a Sass load path** via `lib.styleIncludePaths` so component styles *inside* the library can resolve `@use 'variables'` / `@use 'mixins'` regardless of relative depth.
3. **Expose a package subpath** `./theme` via the `package.json` `exports` field so Sass resolvers (dart-sass, modern bundlers) find `@use '@cobranza-apps/ui/theme'`.
4. **Confirm the import path** in `README.md` by removing the "tentative" caveat now that the build configuration makes it authoritative.
5. **Build + verify** the `dist/theme/` output and that the public API build still succeeds.

No code (TS) changes. No SCSS changes. `public-api.ts` remains untouched (Task 7 scope).

---

## 2. Pre-Analysis (Technical & Architecture Decisions)

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | Use `ng-packagr` top-level `assets` array (not `lib.assets`) | The `assets` field lives at the root of `ng-package.json`, sibling to `lib`. The front-end spec confirms this placement. |
| D2 | `assets` glob = `**/*.scss` with `input: "src/lib/theme"`, `output: "theme"` | Copies `theme.scss` **and** all `_*.scss` partials into `dist/theme/`. The partials must be co-located because `theme.scss` uses relative `@use 'variables'` etc., which only resolve when the partials sit next to `theme.scss` in the published package. |
| D3 | Add `lib.styleIncludePaths: ["src/lib/theme"]` | Lets future component stylesheets do `@use 'mixins';` / `@use 'variables';` without fragile relative paths. Affects library build only — does **not** change the consumer import path. |
| D4 | Add `exports["./theme"]` with a `sass` condition key | dart-sass honors a custom `sass` condition in package `exports` (community convention). Keeps the root `.` export owned by `ng-packagr` (auto-generated). |
| D5 | Do **not** add other subpath exports | Adding an `exports` field restricts subpath access. Only `./theme` is needed for Phase 1; all Angular symbols stay reachable through the root entry ng-packagr generates. |
| D6 | Minimal README edit only | TODO Task 6 requires "Document (in README or a short theme section)". README already contains a Quick Start snippet with a "tentative" note (line 80). Task 6 makes it authoritative → update that note. The full `/docs/THEME.md` reference file is Task 9. |
| D7 | No unit tests | Pure build-config + SCSS-asset change; no logic to test. `npm run build` is the verification gate (TODO acceptance criterion 6). |

### Git state (assumed by the time 4.2 runs)
- Step 2 (feature branch) and Step 3 (version bump) of the Critical Workflow are executed before 4.2. Branch is `feat/<phase1-theme>` (name chosen by implementer in Step 2), checked out from `main`. `package.json` version was already bumped (Step 3) — the plan does **not** touch the version field; the `exports` field is inserted relative to whatever the current version is.
- Working tree: only the files listed in §3 below will be modified; no unrelated staging.

### Files affected (exact)
| File | Change |
|------|--------|
| `ng-package.json` | Add top-level `assets`; add `lib.styleIncludePaths` |
| `package.json` | Add `exports` field with `./theme` subpath |
| `README.md` | Replace the "tentative import path" caveat (line 80) with an authoritative note |

No new files. No `dist/` commits (gitignored).

---

## 3. Detailed Steps (atomic & verifiable)

### Step 0 — Pre-flight checks (implementer, read-only)
- Run `git status` from project root. Confirm current branch is the Phase 1 feature branch. Confirm no `.gitignore`-matching files are staged.
- Confirm `src/lib/theme/` contains exactly: `theme.scss`, `_variables.scss`, `_base.scss`, `_mixins.scss`, `_utilities.scss`. (If any partial is missing, STOP — it belongs to Tasks 1–5, not Task 6.)
- Confirm `dist/` is **not** tracked (run `git check-ignore dist` → expect `dist`).

### Step 1 — Modify `ng-package.json`

**Current content (exact):**
```json
{
  "$schema": "./node_modules/ng-packagr/ng-package.schema.json",
  "dest": "./dist",
  "lib": {
    "entryFile": "src/lib/public-api.ts"
  }
}
```

**Target content (exact):**
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

Verification:
- `assets` is a sibling of `lib` (root level), **not** inside `lib`.
- `styleIncludePaths` is inside `lib`.
- Paths are relative to project root (where `ng-package.json` lives).
- Run `npm run format` (Prettier covers JSON) to guarantee formatting compliance, OR verify with `npx prettier --check ng-package.json`.

### Step 2 — Modify `package.json`

Add an `exports` field. Insert it **after** `"sideEffects": false,` and **before** `"publishConfig"`. The version field is owned by Step 3 (version bump) — do **not** edit it here; the insertion is positional, not value-based.

**Insertion (exact block):**
```json
  "exports": {
    "./theme": {
      "sass": "./theme/theme.scss"
    }
  },
```

Resulting relevant fragment (whatever the bumped version is, e.g. `0.3.0`):
```json
  "sideEffects": false,
  "exports": {
    "./theme": {
      "sass": "./theme/theme.scss"
    }
  },
  "publishConfig": {
    "access": "public"
  },
```

Verification:
- `.` root export is **not** present in `exports` (ng-packagr generates it during build into `dist/package.json`, not the source `package.json`). Only `./theme` is declared.
- The `sass` condition value `./theme/theme.scss` is a valid path **relative to the published package root** (`dist/`). After the asset copy (Step 1) the file will exist at `dist/theme/theme.scss`. Correct.
- Validate JSON parses: `node -e "require('./package.json')"` (PowerShell: `node -e "require('./package.json')"`).
- Run `npx prettier --check package.json`.

### Step 3 — Update `README.md` (minimal, authoritative note)

The README Quick Start (lines 73–80) already documents the intended import. Task 6 makes the path real. Replace the tentative caveat line (line 80) so the note states the path is now the supported one.

**Current (line 80, exact):**
```markdown
> The exact import path is tentative until the library build is finalized (see `package.json`). This is the canonical intended form.
```

**Replace with (exact):**
```markdown
> The theme is published as SCSS via the `./theme` package subpath (see `package.json` `exports`). `@use '@cobranza-apps/ui/theme'` is the supported global import; a fallback explicit path `@use '@cobranza-apps/ui/theme/theme'` is also available. Loading the theme emits the `--cba-*` variables on `:root` and the opt-in `.cba-*` utility classes.
```

No other README edits. (Full token reference / utility class list → Task 9 `docs/THEME.md`.)

Verification:
- The TOC anchor `[Design Tokens (Theme)](#design-tokens-theme)` still resolves (header unchanged).
- `npx prettier --check README.md` passes.

### Step 4 — Build verification

From project root (single command — do not chain):
```
npm run build
```

Expected:
- Build exits `0`.
- Console shows ng-packagr copying assets + compiling the Angular bundle into `dist/`.

If the build fails with a Sass error referencing `@use 'variables'` / `@use 'mixins'`:
- Confirm `styleIncludePaths` was written inside `lib` (Step 1).
- Confirm no partial filename has a typo (`_variables.scss`, `_base.scss`, `_mixins.scss`, `_utilities.scss`).
- Do NOT edit the SCSS files — that is Tasks 1–5 scope. Report the blocker upward.

### Step 5 — Verify `dist/theme/` output

Expected directory tree under `dist/`:
```
dist/
  theme/
    theme.scss
    _variables.scss
    _base.scss
    _mixins.scss
    _utilities.scss
  ... (Angular bundle + ng-packagr auto-generated package.json)
```

Verification commands (run each separately — do not chain):
1. `Test-Path dist\theme\theme.scss` → `True`
2. `Test-Path dist\theme\_variables.scss` → `True`
3. `Test-Path dist\theme\_base.scss` → `True`
4. `Test-Path dist\theme\_mixins.scss` → `True`
5. `Test-Path dist\theme\_utilities.scss` → `True`

Equivalent with glob tool: pattern `dist/theme/*.scss` should return all five files. (Use the `glob` tool, not `Get-ChildItem`.)

Additionally verify the **published** `package.json` (`dist/package.json`, generated by ng-packagr from the source `package.json`) exposes the subpath:
- Read `dist/package.json` and confirm it contains `"exports": { "./theme": { "sass": "./theme/theme.scss" }, ... }` plus an auto-generated root `.` export. (ng-packagr merges source `exports` with the auto-generated root export into `dist/package.json`.)

### Step 6 — Confirm public API still builds cleanly (no-op guard)

- `src/lib/public-api.ts` is unchanged (`export {};`).
- The build in Step 4 already compiles the library from this entry file; success ⇒ public API builds cleanly. (This is the extent of Task 7's overlap confirmed; Task 7 is closed by the same build gate.)

### Step 7 — Lint / format gate

From project root, run each separately:
- `npm run lint` → exits `0` (only checks `src/**/*.ts`; unaffected, but run to keep CI green per maintenance discipline).
- `npx prettier --check "src/**/*.scss" ng-package.json package.json README.md` → exits `0`.

### Step 8 — Commit

Stage **only** the three changed files:
```
git add ng-package.json package.json README.md
```
Then verify nothing unexpected is staged:
```
git status
```
Confirm `dist/` is **not** staged (it must be gitignored). If `dist/` appears staged, STOP and run `git reset HEAD dist` — do not commit build artifacts.

Commit message (exact):
```
feat(theme): publish theme.scss as consumable package subpath

- ng-package.json: copy theme SCSS to dist/theme via assets; add
  lib.styleIncludePaths for component-style token resolution.
- package.json: expose ./theme subpath (sass condition -> ./theme/theme.scss).
- README: mark the theme import path as supported (no longer tentative).

Refs: todos/20260729/20260729-todo-2.md Task 6
```
Commit:
```
git commit -m "<message above>"
```
Multi-line commit messages on PowerShell: use a here-string or `git commit -F` with a temp file under `C:\Users\ibej_\AppData\Local\Temp\kilo`. Do not commit the message file.

Do **not** push (push happens in Step 5 of the Critical Workflow, to `origin` only).

---

## 4. Acceptance Criteria Mapping

| Spec criterion | Verified by |
|----------------|-------------|
| 1. `dist/theme/theme.scss` exists + all partials present | Step 5 glob/checks |
| 2. `theme.scss` in `dist/theme/` is importable via `@use '@cobranza-apps/ui/theme'` | Step 2 (`exports` sass condition) + Step 5 (file present) |
| 3. Published package exposes documented import path | Step 5 `dist/package.json` exports check |
| 4. Utility classes remain opt-in (generated, not applied) | No change to `_utilities.scss` / `_base.scss`; behavior unchanged from Tasks 2 & 5 |
| 5. CSS vars emitted under `:root` once theme loaded | No change to `_variables.scss`; behavior unchanged from Task 1 |

| TODO Task 6 sub-item | Addressed |
|----------------------|-----------|
| Theme SCSS part of library build output | Step 1 (`assets`) |
| Document consumer import (README / short theme section) | Step 3 (README authoritative note; full `/docs` deferred to Task 9) |
| CSS vars global on load, utilities opt-in | Preserved — no SCSS edits (Spec §6) |

---

## 5. Out of Scope (explicit)

- Task 7: verifying/adding new TS exports from `public-api.ts` (only the no-op build guard in Step 6 touches it).
- Task 8: full build-error fixing beyond asset/path configuration; only the build gate in Step 4 is run.
- Task 9: full `/docs/THEME.md` token-group reference and utility-class enumeration.
- Any SCSS source edit (`_variables.scss`, `_base.scss`, `_mixins.scss`, `_utilities.scss`, `theme.scss`).
- `npm test`, Playwright, or component implementation.
- Push to any remote.

---

## 6. Risks / Notes

- **`exports` field restricts subpath access.** Only `./theme` is added; the root `.` export stays owned by ng-packagr in `dist/package.json`. Consumers importing bare `@cobranza-apps/ui` (Angular symbols) are unaffected.
- **`assets` rewrite is deterministic.** `dist/` is recreated each build; stale theme files won't accumulate.
- **Underscore-prefixed partials.** The glob `**/*.scss` matches `_variables.scss` etc. (glob does not treat a leading `_` specially). Co-location preserves relative `@use` resolution in the published package.
- **`styleIncludePaths` is build-only.** It does not influence how consumers resolve the theme import; the `exports` field does.
- **No version bump here.** Version is bumped in Critical Workflow Step 3 (already executed before 4.2). This plan inserts `exports` positionally and never reads/writes the `version` field.