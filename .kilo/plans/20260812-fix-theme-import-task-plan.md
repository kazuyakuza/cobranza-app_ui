# Plan — Fix `@cobranza-apps/ui` theme import for Angular dev-server (v0.15.1)

> **Scope**: Single discrete step 4.1b of the Critical Workflow for `.agent/todos/20260812/20260812-todo-1.md`.
> **Branch**: `fix/theme-import-dev-server` (already created; version already bumped to `0.15.1`).
> **Fix option**: Option A — root-level `theme.scss` re-export resolvable by Angular's bare-bones Sass importer.

---

## 1. Pre-Analysis & Technical Decisions

### 1.1 Root cause recap (from TODO, verified)

Angular's internal Sass importer (`@angular/build/src/tools/esbuild/stylesheets/sass-language.js`) resolves a package import like `@cobranza-apps/ui/theme` by:

1. Literal file resolution (`<pkgRoot>/theme.scss`, `<pkgRoot>/_theme.scss`).
2. `<pkgRoot>/theme/index.scss` / `_index.scss`.
3. It parses `package.json` to find the package root, then joins `<pkgRoot>/<rest>` — but it does **NOT** honor the `exports` map conditions (`sass`/`style`/`default`).

Consequence: `@use '@cobranza-apps/ui/theme'` fails in `ng serve` because `dist/theme.scss` does not exist; the real entry lives at `dist/theme/theme.scss` and is only reachable via the `exports` map Angular ignores.

### 1.2 Why a re-export file (Option A) is the only robust fix

- Copying the full `src/theme/theme.scss` to `dist/theme.scss` would break: that file's body is `@use 'variables'; @use 'base'; ...` (relative imports of its siblings), which would not resolve when placed at `dist/` root (siblings live in `dist/theme/`).
- A `@forward './theme/theme.scss'` shim at `dist/` root resolves to `dist/theme/theme.scss`, whose own relative imports (`variables`, `base`, ...) resolve inside `dist/theme/`. This is the only placement that keeps both the shim and the real theme's internal imports valid.
- It works for ALL Angular build modes (dev-server, esbuild, webpack) and requires no consumer changes. The existing `exports["./theme"]` map stays untouched (backward compatible; honorer resolvers like Sass's native importer keep working).

### 1.3 Where to put the source shim

Decision: create the re-export as **`src/theme.scss`** (at the `src/` root, sibling of the `src/theme/` directory). Rationale:

- Project rule `.kilo/rules/project-structure.md` mandates source files live under `src/`. The shim is a build asset/source, so `src/` is the compliant location.
- It mirrors the published layout: `dist/theme.scss` (shim) sits beside `dist/theme/` (real theme dir), exactly as `src/theme.scss` sits beside `src/theme/`.
- `@forward './theme/theme.scss'` resolves identically in both source (`src/theme.scss` → `src/theme/theme.scss`) and published (`dist/theme.scss` → `dist/theme/theme.scss`) trees, since asset copy is verbatim (no path rewrite).
- The existing asset glob `**/*.scss` with `input: "src/theme"` only scans inside `src/theme/`, so `src/theme.scss` is NOT double-copied into `dist/theme/`.

### 1.4 ng-package.json asset configuration

Add a second asset entry that copies `src/theme.scss` to the `dist/` root. The `assets` array becomes:

```json
"assets": [
  { "glob": "**/*.scss", "input": "src/theme", "output": "theme" },
  { "glob": "theme.scss",   "input": "src",      "output": "" }
]
```

`output: ""` is the ng-packagr convention for the destination root (`dist/`). Verified against `ng-packagr` asset semantics: `glob` selects files within `input`, copied to `dest/<output>/`.

### 1.5 package.json exports — no change

The `exports["./theme"]` map stays as-is (`sass`/`style`/`default` → `./theme/theme.scss`). Do NOT remove it (constraint). Do NOT add a `"./theme.scss"` direct entry — Angular ignores `exports` for Sass anyway, so it adds noise without benefit. The shim file existing at `dist/theme.scss` is what unblocks Angular.

### 1.6 Constraints checklist (from task prompt)

- [x] Do NOT remove existing `exports["./theme"]` map. → untouched.
- [x] `.kilo/rules/changelog-versioning.md`: no `[Unreleased]` section. → new dated `[0.15.1] — 2026-08-12` header added above `[0.15.0]`; no `[Unreleased]` text introduced.
- [x] `npm run build` must pass. → step 4 verifies.
- [x] New root `theme.scss` must be a simple `@forward './theme/theme.scss'`. → exact content.
- [x] No PowerShell commands. All commands are `npm`/`git`.

---

## 2. High-Level Approach

1. Add the re-export source file `src/theme.scss`.
2. Extend `ng-package.json` `assets` to copy it to `dist/` root.
3. Build the library and verify `dist/theme.scss` exists, contains the `@forward`, and resolves to `dist/theme/theme.scss`.
4. Add the `[0.15.1] — 2026-08-12` section to `CHANGELOG.md` (above `[0.15.0]`) under `Fixed`.
5. Append a `Recent Changes` entry to `.agent/project-info/context.md`.
6. Commit each logical group with a meaningful message. Do NOT push (caller/step 5 handles push to `origin` only).

---

## 3. Detailed Atomic Steps

### Step 3.1 — Verify current branch and clean tree

- Confirm on branch `fix/theme-import-dev-server` and version is `0.15.1`.
- Command: `git branch --show-current` (expect `fix/theme-import-dev-server`).
- Command: `git status --short` (expect clean, or only the version-bump commit present).
- If dirty unexpected files: STOP and return to caller (do not invent).

### Step 3.2 — Create the re-export source file

- **New file**: `src/theme.scss`
- **Exact content** (no trailing extra lines beyond final newline):

```scss
// Package-root theme re-export for Angular's Sass importer.
//
// Angular's dev-server Sass resolver does NOT honor package.json `exports`
// conditions; it resolves `@use '@cobranza-apps/ui/theme'` to a literal
// `<pkgRoot>/theme.scss` file. This shim exists so that literal resolution
// succeeds and forwards to the real entry at `src/theme/theme.scss`
// (published to `dist/theme/theme.scss`).
//
// SOURCE OF TRUTH: .agent/project-info/brief.md §5
// REAL ENTRY: ./theme/theme.scss  (sibling `theme/` directory)
//
// Copied verbatim to `dist/theme.scss` by the ng-package.json asset entry
// { "glob": "theme.scss", "input": "src", "output": "" }.
@forward './theme/theme.scss';
```

- Create with `vscode-mcp-server_create_file_code` (path `src/theme.scss`, `overwrite: false` so a wrong rerun fails loudly).
- Verify: read it back; confirm the only executable line is `@forward './theme/theme.scss';` and there is no `[Unreleased]`-style text (n/a).

### Step 3.3 — Extend `ng-package.json` assets

- **File**: `ng-package.json`
- **Change**: replace the `assets` array (lines 4–10) with the two-entry version. Keep `dest`, `lib.entryFile`, `lib.styleIncludePaths` unchanged.

- **Before** (current):
```json
  "assets": [
    {
      "glob": "**/*.scss",
      "input": "src/theme",
      "output": "theme"
    }
  ],
```

- **After**:
```json
  "assets": [
    {
      "glob": "**/*.scss",
      "input": "src/theme",
      "output": "theme"
    },
    {
      "glob": "theme.scss",
      "input": "src",
      "output": ""
    }
  ],
```

- Use `vscode-mcp-server_replace_lines_code` with `startLine=4`, `endLine=10`, `originalCode` = the before block, `content` = the after block.
- Verify: read `ng-package.json` back; confirm valid JSON (no trailing commas; second entry ends with `}` then `]`).

### Step 3.4 — Update `CHANGELOG.md`

- **File**: `CHANGELOG.md`
- **Action**: insert a new section directly below the line `## [0.15.0] — 2026-08-12` ... NO — insert **ABOVE** `## [0.15.0] — 2026-08-12` (newest version first). The header comment block (lines 1–22) and the `# Changelog` / intro lines (24–31) are untouched. Insert the new section immediately before line 33 (`## [0.15.0] — 2026-08-12`).

- **Exact inserted block** (single blank line separating from `[0.15.0]` header below):

```markdown
## [0.15.1] — 2026-08-12

### Fixed

- **Theme import works in Angular dev-server** — `@use '@cobranza-apps/ui/theme'` now resolves under `ng serve` (dev-server via `@angular/build:dev-server` + native-federation) as well as production `ng build`. The Angular Sass importer ignores `package.json` `exports` conditions and resolves package imports to a literal file, so it looked for `node_modules/@cobranza-apps/ui/theme.scss` (which did not exist) instead of the `exports["./theme"]`-mapped `./theme/theme.scss`. Added a package-root re-export shim `src/theme.scss` (→ published to `dist/theme.scss`) containing `@forward './theme/theme.scss'`, and a second `ng-package.json` asset entry to copy it to `dist/` root. The existing `exports["./theme"]` map (`sass`/`style`/`default`) is unchanged and remains the canonical entry for resolvers that honor it. Consumer projects can now drop the `stylePreprocessorOptions.includePaths` workaround and use the canonical import. See `.agent/todos/20260812/20260812-todo-1.md`, [docs/THEME.md](docs/THEME.md), and [docs/CONSUMER_GUIDE.md](docs/CONSUMER_GUIDE.md).

```

- Verify after insert:
  - `CHANGELOG.md` still contains no `[Unreleased]` (case-insensitive) — run the same regex the spec uses: `rg -i '##\s*\[unreleased\]' CHANGELOG.md` must return nothing.
  - `## [0.15.1] — 2026-08-12` appears exactly once and is the first version section after the intro.
  - `## [0.15.0] — 2026-08-12` still follows it.

### Step 3.5 — Update `.agent/project-info/context.md`

- **File**: `.agent/project-info/context.md`
- **Action**: prepend a new bullet to the `## Recent Changes` section (immediately below the `## Recent Changes` header line, before the existing `v0.15.0` audit bullet). Also update the `Active branch` line under `## Current Work Focus` to mention `fix/theme-import-dev-server` / v0.15.1 (only if the existing line still says `main`/`v0.14.0`; otherwise leave it).

- **Inserted bullet** (at top of Recent Changes list):

```markdown
- **Theme dev-server import fix (2026-08-12, v0.15.1)** — patched `@use '@cobranza-apps/ui/theme'` so it resolves under Angular's dev-server Sass importer (which ignores `package.json` `exports` conditions). Added package-root shim `src/theme.scss` containing `@forward './theme/theme.scss'` and a second `ng-package.json` asset entry (`{ "glob": "theme.scss", "input": "src", "output": "" }`) so it is published to `dist/theme.scss`; Angular's literal resolver now finds it and the `@forward` reaches the real `dist/theme/theme.scss`. Existing `exports["./theme"]` map (`sass`/`style`/`default`) kept for resolvers that honor it. Shell can now drop its `stylePreprocessorOptions.includePaths` workaround and use the canonical import. See `.agent/todos/20260812/20260812-todo-1.md`.
```

- Use `vscode-mcp-server_replace_lines_code`: target the `## Recent Changes\n\n- **Project-wide audit ...` location — match the first existing bullet's opening `- **Project-wide audit` and insert the new bullet + blank line before it. Keep all other content byte-identical (per `.kilo/rules/overwrite-todo-file-prevention.md` spirit; here it's context.md, not a TODO, but preserve-existing still applies per code-guidelines rule #5).
- Verify: read `context.md` back; new bullet is first under `## Recent Changes`; the `v0.15.0` audit bullet follows unchanged.

### Step 3.6 — Build the library

- Command: `npm run build`
- Expected: ng-packagr succeeds; `dist/` is regenerated.
- If the build fails: capture full output, do NOT proceed; return failure to caller (do not attempt to "fix" the build by altering non-plan files).

### Step 3.7 — Verify the published shim

Perform these checks (read-only):

1. `dist/theme.scss` exists at the package root.
   - Verify: glob `dist/theme.scss` (or `vscode-mcp-server_list_files_code` on `dist` non-recursive) → must list `theme.scss`.
2. `dist/theme.scss` content is exactly the `@forward './theme/theme.scss';` shim (plus the comment header), copied verbatim from `src/theme.scss`.
   - Verify: read `dist/theme.scss`; assert it contains `@forward './theme/theme.scss';` and does NOT contain `@use 'variables';`.
3. `dist/theme/theme.scss` exists (unchanged by this change; the existing asset entry still copies it).
   - Verify: read dir `dist/theme/` → contains `theme.scss`.
4. `@forward` target resolvable from `dist/theme.scss`:
   - The forward points to `./theme/theme.scss`; from `dist/theme.scss` that is `dist/theme/theme.scss` which exists (check 3). No further relative imports break, because the forward hands off to the real entry whose own `@use 'variables'` etc. resolve in `dist/theme/`.
5. `dist/package.json` `exports["./theme"]` still maps to `./theme/theme.scss` and version is `0.15.1`.
   - Verify: read `dist/package.json`; confirm `version` is `0.15.1` and `exports["./theme"]` is unchanged (sass/style/default → `./theme/theme.scss`).

### Step 3.8 — Sanity-compile the shim with the project's Sass

- Command: `npx sass src/theme.scss --no-source-map --stdin` is not valid; instead compile to a temp file inside the workspace (per `.kilo/rules/no-play-in-external-paths.md` use an in-workspace path; do NOT create `tmp/` outside).
- Recommended: write the compiled output to a throwaway in-workspace path and delete it right after. Simpler: rely on the build in 3.6 (ng-packagr already runs sass over assets? No — assets are copied, not compiled). To actually exercise the `@forward`, use:
  - `npx sass --stdin --no-source-map < src/theme.scss > .sass-check.out` then delete `.sass-check.out`.
    - If Sass resolves, exit code 0 and `.sass-check.out` contains the variables/utilities output (proves `@forward './theme/theme.scss'` resolves from `src/`).
    - This compiles from source, confirming the shim's relativeTarget. The dist copy uses the same content, and the relative layout is mirrored, so dist resolution is implied.
- `.sass-check.out` MUST be deleted before any commit (it is not gitignored by name; ensure `git status` shows it gone). Do NOT add it to `.gitignore` (out of scope).
- If Sass emits `Can't find stylesheet`, STOP and return to caller.

### Step 3.9 — Run the docs-compliance regression test

- Command: `npm test -- src/theme/docs-compliance.spec.ts`
- Expected: passes (no `[Unreleased]` section; rule referenced). This guards the CHANGELOG change.
- Optionally run full `npm test` if time permits; not required by this plan. (Full suite is the 4.5 verification step's job.)

### Step 3.10 — Gitignore compliance check (per `.kilo/rules/gitignore-compliance.md`)

- Read `.gitignore` (already done; known patterns: `dist/`, `node_modules/`, `*.tsbuildinfo`, `.eslintcache`, `.kilo/agent-manager.json`).
- Run `git status --short`.
- Ensure NONE of these are staged/added: `dist/` anything, `node_modules/`, `.sass-check.out`, `*.tsbuildinfo`, `.eslintcache`.
- Only intended files must be staged: `src/theme.scss`, `ng-package.json`, `CHANGELOG.md`, `.agent/project-info/context.md`.

### Step 3.11 — Commit strategy (logical groups)

Stage and commit in this order. Each commit is a single `git` command (no chaining). Run `git status` between commits to confirm clean staging.

**Commit 1 — the fix (source shim + ng-package asset config):**
- Stage: `git add src/theme.scss ng-package.json`
- Message body — use a HEREDOC via `git commit -F-` is PowerShell-unfriendly; instead use multiple `-m` flags:
  - `git commit -m "fix(theme): add package-root re-export shim for Angular dev-server Sass import" -m "Angular's dev-server Sass importer ignores package.json exports conditions, so @use '@cobranza-apps/ui/theme' resolved to a non-existent node_modules/@cobranza-apps/ui/theme.scss. Added src/theme.scss (@forward './theme/theme.scss') and a second ng-package.json asset entry copying it to dist/ root. Existing exports[\"./theme\"] map (sass/style/default) is unchanged."`
- Verify: `git show --stat HEAD`.

**Commit 2 — docs (changelog + context):**
- Stage: `git add CHANGELOG.md .agent/project-info/context.md`
- Message:
  - `git commit -m "docs(changelog): document theme dev-server import fix in 0.15.1" -m "Added [0.15.1] -- 2026-08-12 Fixed entry to CHANGELOG.md (per .kilo/rules/changelog-versioning.md; no [Unreleased] section). Appended a Recent Changes bullet to .agent/project-info/context.md describing the shim, the ng-package.json asset entry, and the unchanged exports map."`
- Verify: `git show --stat HEAD`.

### Step 3.12 — Final verification & summary

- `git log --oneline -5` → top two commits are the fix and docs commits on `fix/theme-import-dev-server`.
- `git status --short` → clean tree (no `dist/`, no `.sass-check.out`).
- `git diff --stat HEAD~2..HEAD` → only `src/theme.scss` (added), `ng-package.json`, `CHANGELOG.md`, `.agent/project-info/context.md`.
- Re-confirm `dist/theme.scss` exists (from 3.7) and the `@forward` target resolves.
- Report a concise summary (what was done / not done) to the caller, including the plan file path.

---

## 4. Verification Matrix

| Check | Command / Action | Expected |
|---|---|---|
| Branch | `git branch --show-current` | `fix/theme-import-dev-server` |
| Version | `package.json` `version` | `0.15.1` (already bumped; no edit) |
| Shim exists | read `src/theme.scss` | contains `@forward './theme/theme.scss';` |
| Asset config | read `ng-package.json` | two entries; second is `theme.scss`/`src`/`""` |
| Build | `npm run build` | exit 0 |
| Published shim | read `dist/theme.scss` | `@forward './theme/theme.scss';` present |
| Published real entry | list `dist/theme/` | contains `theme.scss` |
| Exports untouched | read `dist/package.json` | `exports["./theme"]` = sass/style/default → `./theme/theme.scss` |
| Sass resolution | `npx sass --stdin --no-source-map < src/theme.scss > .sass-check.out` | exit 0; output non-empty; file deleted after |
| Changelog rule | `rg -i '##\s*\[unreleased\]' CHANGELOG.md` | no matches |
| Changelog header | `rg '## \[0.15.1\] — 2026-08-12' CHANGELOG.md` | exactly 1 match |
| Compliance spec | `npm test -- src/theme/docs-compliance.spec.ts` | pass |
| Gitignore | `git status --short` before commit | no `dist/`, `node_modules/`, `.sass-check.out` staged |
| Commits | `git log --oneline -5` | two new commits: fix + docs |

---

## 5. Files Touched

| Path | Action | Rule check |
|---|---|---|
| `src/theme.scss` | CREATE | project-structure ✓ (under `src/`); max-lines-per-file ✓ (<200); self-documenting ✓ |
| `ng-package.json` | EDIT (assets array) | config file, not subject to src rules |
| `CHANGELOG.md` | EDIT (new `[0.15.1]` section) | changelog-versioning ✓ (no `[Unreleased]`; dated header) |
| `.agent/project-info/context.md` | EDIT (Recent Changes bullet) | context maintenance ✓ |

Not touched (deliberate): `package.json` (version already bumped; `exports` unchanged), `src/theme/theme.scss`, `docs/*`, `.agent/RULES.md`, `.gitignore`.

---

## 6. Risks & Edge Cases

- **ng-packagr `output: ""` semantics**: if ng-packagr rejects an empty-string output, fall back to `"."` (some versions accept `.` for dest root). Mitigation: step 3.6 build will surface this; if it errors with an asset-path message, retry with `"output": "."` and re-run the build. Do NOT touch anything else.
- **Sass shim compiled from source vs dist**: source `@forward './theme/theme.scss'` and dist copy have identical content and mirrored layout, so resolution parity holds. Step 3.8 confirms source-side; dist-side confirmed structurally in 3.7.
- **Token Change Checklist (brief.md §8.1)**: this change introduces NO new/renamed/value-changed `--cba-*` tokens and NO `.cba-*` class changes. The checklist does not apply; no grep cross-file sync needed. (Noted to avoid an unnecessary grep sweep by downstream steps.)
- **`docs-compliance.spec.ts`**: only checks CHANGELOG `[Unreleased]` absence + rule file presence. The new `[0.15.1]` header satisfies both. No spec change needed.
- **`preview-html.spec.ts` / `tokens.spec.ts`**: do not scan `src/*.scss` glob; adding `src/theme.scss` does not affect them. If any spec fails unexpectedly in 3.9 (only running docs-compliance) that is out of scope here — flag to caller.
- **Do NOT push** in this step (per Critical Workflow, step 5 handles merge + push to `origin` only).

---

## 7. What This Step Does NOT Do (Boundaries)

- Does NOT modify `package.json` `exports` (kept intact).
- Does NOT add a `"./theme.scss"` export entry (no benefit; Angular ignores exports for Sass).
- Does NOT touch consumer (`shell`) repo or its `stylePreprocessorOptions` workaround (separate Shell PR; TODO §"Context for consumer projects").
- Does NOT run `npm test` full suite (only docs-compliance spec); full verification is step 4.5.
- Does NOT run `npm run lint` (no TS touched; lint scope is `src/**/*.ts` — unchanged). Optional; not required by this plan.
- Does NOT push or merge (step 5 of Critical Workflow).
- Does NOT regenerate `docs/theme-preview.css` (no token/SCSS-source value change).
- Does NOT run code review / simplification (that is step 4.3).