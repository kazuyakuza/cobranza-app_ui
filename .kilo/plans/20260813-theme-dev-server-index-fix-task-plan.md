# Per-Task Implementation Plan — Theme dev-server `@use '@cobranza-apps/ui/theme';` fix

**TODO file:** `.agent/todos/20260812/20260812-todo-2.md`
**Global plan:** `.kilo/plans/20260813-theme-dev-server-index-fix.md` (Step 4.1b)
**Branch:** `fix/theme-import-dev-server` (already created & checked out)
**Version target:** `0.15.2` (already bumped in `package.json` by Step 3)
**Front-end related:** No (library packaging / Sass resolution fix; no UI changes)

---

## Pre-Analysis (technical & architecture decisions)

### Problem recap
`@use '@cobranza-apps/ui/theme';` still fails under Angular `ng serve` (dev-server) even after v0.15.1
added a package-root shim `src/theme.scss` (`@forward './theme/theme.scss'`). Production `ng build`
(Native Federation esbuild pipeline) resolves the canonical import; the dev-server does not.

### Root cause (confirmed from TODO §"Why the 0.15.1 `theme.scss` did not work")
Angular's dev-server Sass importer
(`@angular/build/src/tools/esbuild/stylesheets/sass-language.js`) resolves the specifier
`@cobranza-apps/ui/theme` by:
1. Trying literal file resolution of `theme` (no extension) → fails.
2. Parsing specifier into `packageName` (`@cobranza-apps/ui`) + `pathSegments` (`theme`),
   resolving `@cobranza-apps/ui/package.json` to the package root, joining
   `<packageRoot>/theme`, and looking for it as a **file** — it does NOT append `.scss`.
   Therefore `<packageRoot>/theme.scss` (the 0.15.1 shim) is never matched.
3. Falling back to `loadPaths` (`stylePreprocessorOptions.includePaths`).
   `package.json` `exports["./theme"]` conditions are ignored entirely by this importer.

### Fix: Sass directory-index resolution via `theme/_index.scss`
Add `src/theme/_index.scss` (a Sass partial inside the existing `theme/` directory) that
`@forward`s the real entry:

```scss
@forward './theme.scss';
```

When the dev-server importer joins the specifier to `<packageRoot>/theme`, that path points at a
**directory**. Dart Sass's standard "Partials in directories" / directory-index resolution then
loads `<packageRoot>/theme/_index.scss` automatically — no `.scss` suffix and no `exports`
conditions are involved. (Confirmed: Dart Sass resolves a directory specifier to `_index.scss`
inside it; documented in the Sass spec under "Loading Partials: Index Files".)

### Build-config confirmation
- `ng-package.json` already declares the asset entry:
  `{ "glob": "**/*.scss", "input": "src/theme", "output": "theme" }`.
  The `**/*.scss` glob WILL copy `src/theme/_index.scss` to `dist/theme/_index.scss` with **no
  `ng-package.json` change** required.
- The second asset entry `{ "glob": "theme.scss", "input": "src", "output": "" }` (0.15.1 root
  shim) is preserved per `.kilo/rules/code-guidelines.md` §5 "Preserve Existing Code". It is now
  redundant for the dev-server resolution path but remains a harmless fallback for any resolver
  that still looks for a literal `<pkgRoot>/theme.scss` file (e.g. some older bundler configs).
  **Do NOT remove it.**
- `package.json` `exports["./theme"]` still maps `sass`/`style`/`default` to
  `./theme/theme.scss`. Resolvers that honor `exports` (esbuild production) continue to use the
  canonical real entry directly. **No `exports` change.** (Pointing `exports` at the new
  `_index.scss` would add an unnecessary indirection layer for resolvers that already work.)

### Confirmed current state (file research done)
- `src/theme/_index.scss` does NOT exist yet (glob of `src/theme/*` returns 16 files, none is
  `_index.scss`).
- `src/theme/theme.scss` is the real entry: `@use`s variables/base/modal/datepicker/popover/
  typeahead/accordion, `@forward`s mixins, `@use`s utilities.
- `package.json` `version` is already `"0.15.2"` (Step 3 done).
- `CHANGELOG.md` current top dated header is `## [0.15.1] — 2026-08-12`. No `[Unreleased]`
  section present.
- `.agent/project-info/context.md`:
  - Active branch line says `v0.15.1 — theme dev-server import fix in progress`.
  - Most-recent "Recent Changes" entry is the v0.15.1 one.
  - Cross-Reference list says `CHANGELOG … latest 0.15.1.`
- `docs/THEME.md` cross-reference file list (line 268) lists
  `_variables.scss, _base.scss, _mixins.scss, _utilities.scss, theme.scss` — missing
  `_index.scss`.
- `src/theme/docs-compliance.spec.ts` asserts: no `[Unreleased]` section (case-insensitive),
  the `changelog-versioning.md` rule is referenced from `.agent/RULES.md`, and the rule file
  exists. It does NOT assert the version header matches `package.json`, but the changelog-
  versioning rule still requires every change to live under a dated header matching the current
  bump — so we add `[0.15.2] — 2026-08-13`.

### Files touched (summary)
| File | Action | Purpose |
|------|--------|---------|
| `src/theme/_index.scss` | CREATE | Sass directory-index partial for dev-server resolution |
| `CHANGELOG.md` | EDIT | Add `[0.15.2] — 2026-08-13` `Fixed` header |
| `.agent/project-info/context.md` | EDIT | Record v0.15.2 fix in Recent Changes + status line |
| `docs/THEME.md` | EDIT | Add `_index.scss` to cross-reference file list |

Files NOT to touch (explicitly):
- `package.json` (already 0.15.2)
- `ng-package.json` (glob already covers `_index.scss`)
- `package.json` `exports["./theme"]` (no change)
- `src/theme.scss` package-root shim (preserve)
- `src/theme/theme.scss` and other existing theme partials (no change)
- `docs/CONSUMER_GUIDE.md`, `README.md`, `docs/USAGE.md` (no change — they already state the
  canonical import without explaining internal resolution)

### Rule compliance
- `.kilo/rules/changelog-versioning.md` — no `[Unreleased]` section; bump + dated header in the
  same change; new entries directly under the in-progress dated header.
- `.kilo/rules/code-guidelines.md` §5 — preserve existing code (root `src/theme.scss` shim kept).
- `.kilo/rules/no-commented-code.md` — only documentation comments in `_index.scss`, no
  commented-out code.
- `.kilo/rules/self-documenting-code.md` — comment block in `_index.scss` explains the
  non-obvious Sass resolution mechanism for AI agents (acceptable: high-level explanation of a
  non-obvious packaging mechanism is an explicitly-allowed exception).
- `.kilo/rules/markdown-generation-rule.md` — only Plan Agent edits plan/docs markdown; edits here
  are confined to `CHANGELOG.md` (release log), `context.md` (project-info), and `docs/THEME.md`
  (docs), all of which are in-scope for the implementer executing an approved plan.

---

## Implementation Steps

> All commits go on the current branch `fix/theme-import-dev-server`. One logical commit per
> step. The implementer MUST follow these steps verbatim, checking the plan between steps.
> Follow `.kilo/rules/tool-selection-priority.md` (prefer `vscode-mcp-server_*` /
> `Bifrost_*` for edits). Follow `.kilo/rules/gitignore-compliance.md` before each commit
> (`git status` + verify no gitignored files staged).

### Step 1 — Create `src/theme/_index.scss`

**Why:** This is the core fix. The directory-index partial is what Angular's dev-server Sass
importer resolves `<pkgRoot>/theme` to.

**Action:** Create the new file at `src/theme/_index.scss` with the exact content below.

```scss
// Sass directory-index partial for @cobranza-apps/ui/theme.
//
// PURPOSE:
//   Make `@use '@cobranza-apps/ui/theme';` resolvable by Angular's dev-server
//   (`ng serve`) Sass importer. The dev-server importer joins the specifier to
//   `<pkgRoot>/theme`, which points at the `theme/` directory, and Dart Sass then
//   auto-resolves that directory to this `_index.scss` (standard directory-index
//   resolution — no `.scss` suffix needed, no package.json `exports` involved).
//   The v0.15.1 package-root `src/theme.scss` shim is insufficient because the
//   dev-server importer never appends `.scss` to the joined path.
//
// REAL ENTRY: ./theme.scss   (src/theme/theme.scss)
// SOURCE OF TRUTH: .agent/project-info/brief.md §5
// PUBLISHED AS: dist/theme/_index.scss   (ng-package.json `**/*.scss` glob in src/theme)
// SEE ALSO: docs/THEME.md, .agent/todos/20260812/20260812-todo-2.md
@forward './theme.scss';
```

**Verification of Step 1:**
- File exists at `src/theme/_index.scss`.
- File content is exactly the block above (real newlines, no literal `\n`).
- No commented-out code (the lines are documentation comments, not disabled code).
- `@forward './theme.scss';` is the only non-comment line.

**Commit:** `fix(theme): add src/theme/_index.scss for Sass directory-index resolution`

```bash
git add src/theme/_index.scss
git commit -m "fix(theme): add src/theme/_index.scss for Sass directory-index resolution"
```

### Step 2 — Update `CHANGELOG.md`

**Why:** `.kilo/rules/changelog-versioning.md` requires a dated `[x.y.z] — YYYY-MM-DD` header
bumped in the same change that introduced the fix; version is already `0.15.2` in `package.json`.

**Action:** Insert a new `## [0.15.2] — 2026-08-13` section with a `### Fixed` block immediately
above the existing `## [0.15.1] — 2026-08-12` header. Do NOT modify any other section. Do NOT
introduce an `[Unreleased]` section.

Locate the line:

```markdown
## [0.15.1] — 2026-08-12
```

Insert the following block immediately before it:

```markdown
## [0.15.2] — 2026-08-13

### Fixed

- **Theme import resolves in Angular dev-server via directory-index partial** — `@use '@cobranza-apps/ui/theme';` now resolves under `ng serve` as well as `ng build`. The v0.15.1 package-root shim `src/theme.scss` was insufficient because Angular's dev-server Sass importer joins the specifier to `<pkgRoot>/theme` and looks for it as a file without appending `.scss`, so `theme.scss` at the package root was never matched. Added `src/theme/_index.scss` (`@forward './theme.scss';`) — a Sass partial inside the existing `theme/` directory. When the dev-server importer joins the specifier to `<pkgRoot>/theme`, the path points at a directory, and Dart Sass auto-resolves the directory to `_index.scss` via standard directory-index resolution. Published to `dist/theme/_index.scss` by the existing `ng-package.json` `**/*.scss` glob (no build-config change). The v0.15.1 root shim and `package.json` `exports["./theme"]` map are unchanged. Consumers can drop the `stylePreprocessorOptions.includePaths` workaround and use the canonical import. See `.agent/todos/20260812/20260812-todo-2.md`, [docs/THEME.md](docs/THEME.md), and [docs/CONSUMER_GUIDE.md](docs/CONSUMER_GUIDE.md).

## [0.15.1] — 2026-08-12
```

**Verification of Step 2:**
- The top-most dated header in `CHANGELOG.md` is now `## [0.15.2] — 2026-08-13`.
- A `### Fixed` block under it contains the new entry.
- No line matches `/^##\s*\[unreleased\]/i` anywhere in the file.
- The `## [0.15.1] — 2026-08-12` section below is unchanged.
- `package.json` `version` remains `"0.15.2"`.

**Commit:** `docs(changelog): record 0.15.2 theme dev-server directory-index fix`

```bash
git add CHANGELOG.md
git commit -m "docs(changelog): record 0.15.2 theme dev-server directory-index fix"
```

### Step 3 — Update `.agent/project-info/context.md`

**Why:** Keep "Current Work Focus", "Recent Changes", and the "Cross-Reference" CHANGELOG
pointer in sync with the new release.

**Action 3a — Active branch / status line.** In the "Current Work Focus" section, change the
last bullet:

Current:
```markdown
- Active branch: `fix/theme-import-dev-server` (v0.15.1 — theme dev-server import fix in progress).
```

New:
```markdown
- Active branch: `fix/theme-import-dev-server` (v0.15.2 — theme dev-server directory-index fix in progress).
```

**Action 3b — Recent Changes.** Prepend a new entry as the FIRST bullet of the "Recent Changes"
list (immediately above the existing v0.15.1 bullet). Use the exact text below (note the
correct form `Angular's dev-server Sass importer`):

```markdown
- **Theme dev-server directory-index fix (2026-08-13, v0.15.2)** — `@use '@cobranza-apps/ui/theme'` now resolves under Angular's dev-server Sass importer via standard Sass directory-index resolution. The v0.15.1 package-root `src/theme.scss` shim was insufficient because the dev-server importer joins the specifier to `<pkgRoot>/theme` and looks for it as a file without appending `.scss`, so the root shim was never matched. Added `src/theme/_index.scss` (`@forward './theme.scss';`) — a Sass partial inside the existing `theme/` directory; the dev-server importer now resolves the joined directory to `_index.scss` automatically. Published to `dist/theme/_index.scss` by the existing `ng-package.json` `**/*.scss` glob (no build-config change). The v0.15.1 root shim and `package.json` `exports["./theme"]` map are unchanged. See `.agent/todos/20260812/20260812-todo-2.md` and `.kilo/plans/20260813-theme-dev-server-index-fix-task-plan.md`.
```

**Action 3c — Cross-Reference CHANGELOG pointer.** In the "Cross-Reference" list, update the
last line:

Current:
```markdown
- [CHANGELOG](../../CHANGELOG.md) — release changelog (Keep a Changelog format), latest 0.15.1.
```

New:
```markdown
- [CHANGELOG](../../CHANGELOG.md) — release changelog (Keep a Changelog format), latest 0.15.2.
```

**Verification of Step 3:**
- "Current Work Focus" last bullet references `v0.15.2`.
- The first bullet of "Recent Changes" is the v0.15.2 entry and the second bullet remains the
  v0.15.1 entry (unchanged).
- Cross-Reference "latest" pointer says `0.15.2`.

**Commit:** `docs(context): record 0.15.2 theme dev-server directory-index fix`

```bash
git add .agent/project-info/context.md
git commit -m "docs(context): record 0.15.2 theme dev-server directory-index fix"
```

### Step 4 — Update `docs/THEME.md` cross-reference file list (optional, recommended)

**Why:** Minor accuracy improvement — the `src/theme/` file inventory in the docs should list
the new `_index.scss` so AI agents and consumers see the complete set.

**Action:** At line 268, update the cross-reference bullet.

Current:
```markdown
- [`src/theme/`](../src/theme/) — SCSS source files (`_variables.scss`, `_base.scss`, `_mixins.scss`, `_utilities.scss`, `theme.scss`).
```

New:
```markdown
- [`src/theme/`](../src/theme/) — SCSS source files (`_variables.scss`, `_base.scss`, `_mixins.scss`, `_utilities.scss`, `theme.scss`, `_index.scss`).
```

Do not change any other line in `docs/THEME.md`. The `_index.scss` is a packaging-only re-export;
it does not change the token/import/usage story already documented, so no other section needs
updating.

**Verification of Step 4:**
- Line 268 now lists `_index.scss` as the last item inside the parenthetical.
- No other content in `docs/THEME.md` changed.

**Commit:** `docs(theme): list _index.scss in src/theme cross-reference`

```bash
git add docs/THEME.md
git commit -m "docs(theme): list _index.scss in src/theme cross-reference"
```

---

## Verification Steps

Run each command from the working directory root `C:\projects\cobranza-app\front\ui`. Per
`.kilo/rules/tool-selection-priority.md`, use the `bash` tool (CLI-native operations) and run
single commands (no chaining / `&&`). If a command reports "unknown cmd", retry up to 2 more
times before escalating.

### V1 — Lint (fastest early signal)

```bash
npm run lint
```

Expected: ESLint exits 0, no errors. (`_index.scss` is not linted by `eslint "src/**/*.ts"`, but
this confirms no TS file was broken by the change set, which is expected because no `.ts` file
was touched.)

### V2 — Build (confirms `dist/theme/_index.scss` is published)

```bash
npm run build
```

Expected: `ng-packagr` exits 0. Then verify the produced asset:

```bash
ls dist/theme/_index.scss
```

Expected: the path exists (no error). Then verify its content:

```bash
cat dist/theme/_index.scss
```

Expected output (the build copies the source partial verbatim; `_` prefix is preserved by the
`ng-package.json` glob which copies `**/*.scss` as-is):

```scss
// Sass directory-index partial for @cobranza-apps/ui/theme.
// ... (comment block) ...
@forward './theme.scss';
```

If `dist/theme/_index.scss` does NOT exist after a clean build, escalate to the Plan Agent —
the `ng-package.json` glob assumption would be wrong and an additional asset entry or
`ng-package.json` change would be required. Do NOT invent a fix; return to caller.

### V3 — Tests (confirms changelog compliance spec still passes)

```bash
npm run test
```

Expected: all suites pass, including `src/theme/docs-compliance.spec.ts`:
- "contains no [Unreleased] section header (case-insensitive)" — pass.
- ".kilo/rules/changelog-versioning.md is referenced in .agent/RULES.md" — pass.
- ".kilo/rules/changelog-versioning.md file exists (importable path)" — pass.

If the docs-compliance spec fails on the `[Unreleased]` assertion, re-read `CHANGELOG.md` and
ensure no `[Unreleased]` section was introduced; fix and re-run.

### V4 — Manual import-resolve sanity (optional but recommended)

If a local `node_modules/@cobranza-apps/ui` symlink/target exists in a consuming app, a quick
dry-run import is not required by the TODO; the build artifact check (V2) plus the Sass
directory-index resolution guarantee is sufficient. If the consumer environment is not
available, skip V4 (out of scope for this library PR).

---

## Plan-Adherence Self-Check (for Step 4.5b)

After implementation, verify ALL of:
1. `src/theme/_index.scss` exists with exact content from Step 1.
2. `dist/theme/_index.scss` is produced by `npm run build` (V2).
3. `package.json` `version` is `"0.15.2"` (unchanged).
4. `package.json` `exports["./theme"]` unchanged (still `./theme/theme.scss`).
5. `ng-package.json` unchanged.
6. Root `src/theme.scss` shim unchanged (preserved per code-guidelines §5).
7. `CHANGELOG.md` top dated header is `## [0.15.2] — 2026-08-13` with a `### Fixed` block; no
   `[Unreleased]` section present.
8. `.agent/project-info/context.md` records v0.15.2 in Recent Changes, active-branch line, and
   Cross-Reference "latest" pointer.
9. `docs/THEME.md` cross-reference file list includes `_index.scss`.
10. `npm run lint` exits 0; `npm run test` all pass; `npm run build` exits 0 and produces
    `dist/theme/_index.scss`.

Report any deviation; do not auto-fix outside this plan.

---

## Cross-References

- [TODO file](../../.agent/todos/20260812/20260812-todo-2.md)
- [Global plan](./20260813-theme-dev-server-index-fix.md)
- [Project Brief §5 — Design Tokens](../../.agent/project-info/brief.md#5-design-tokens-theme)
- [docs/THEME.md](../../docs/THEME.md) — theme reference
- [docs/CONSUMER_GUIDE.md](../../docs/CONSUMER_GUIDE.md) — consumer integration guide
- [CHANGELOG.md](../../CHANGELOG.md) — release log
- [.kilo/rules/changelog-versioning.md](../rules/changelog-versioning.md)
- [.kilo/rules/code-guidelines.md](../rules/code-guidelines.md)
- [.kilo/rules/gitignore-compliance.md](../rules/gitignore-compliance.md)
- [Sass: Partials & Index Files](https://sass-lang.com/guide/#1)