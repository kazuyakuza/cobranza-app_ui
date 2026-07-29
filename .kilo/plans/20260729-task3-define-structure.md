# Plan — Task 3: Define Project Structure

> **Date:** 2026-07-29
> **TODO:** `.agent/todos/20260729/20260729-todo-0.md`
> **Global plan:** `.kilo/plans/20260729-ui-library-setup.md`
> **Branch:** `feat/ui-library-setup`
> **Step:** 4.1 Analysis & Planning (Architector)
> **Source of truth:** `.agent/project-info/brief.md` section 7 (Library Structure), `.agent/project-info/architecture.md` (Folder / Layout, Public API Strategy).

---

## Pre-Analysis

### Inputs verified

- `.agent/todos/20260729/20260729-todo-0.md` Task 3: "define project structure (partial details described in project brief)".
- `brief.md` §7 prescribes `src/lib/{components,theme,directives}/public-api.ts`. Components are listed as **sub-folders** (`module-header/`, `module-container/`, `button/`, `card/`, `badge/`, `empty-state/`, `skeleton/`, `modal/`, `...`). Theme is listed with concrete SCSS files (`_variables.scss`, `_utilities.scss`, `_mixins.scss`, `theme.scss`).
- `architecture.md` confirms: standalone components only; single barrel `public-api.ts`; `ng-packagr` build; theme = SCSS + `--cba-` CSS variables; `ViewEncapsulation.Emulated` default.
- Current `src/` contains only `src/.gitkeep` (verified via glob + git status). No `package.json` yet (Task 4 scope).
- `.agent/project-structure.md` currently exists with placeholder content (`# (no folders yet)`). It must be **updated** (not recreated) — see Overwrite-TODO rule N/A here; this is a structure file, not a TODO file.
- `.kilo/rules/project-structure.md` requires `.agent/project-structure.md` to exist and accurately reflect the current project structure; all source must live in `src/`.
- `.kilo/commands/project-structure.md` defines the exact format: two sections (`# Folders in src/`, `# Other folders`), bullet-point folder paths with brief AI-agent-understandable comments, **folders only** (no files), `# (no folders yet)` placeholder for empty sections.

### Ambiguities identified & resolutions

1. **Component granularity: folder vs flat file.**
   Brief lists each component as a *folder* (e.g. `module-header/`). For Angular standalone components the idiomatic layout is one folder per component containing `*.component.ts`, `*.component.html`, `*.component.scss`, and an `index.ts` barrel.
   **Decision:** Use one folder per component as in the brief. In THIS task (4.1/4.2) only the folders + placeholders are created; component implementation files arrive in later tasks.

2. **Placeholder strategy inside empty folders.**
   Git does not track empty directories. The global plan (Task 3 §4.2) says: "Add minimal `index.ts` or `.gitkeep` where appropriate."
   **Decision:**
   - Each component folder receives an `index.ts` barrel placeholder (`export * from './<component-name>.component';` is NOT added yet because the component class does not exist; instead leave a /** @todo */ doc comment). Using `index.ts` (not `.gitkeep`) because the immediate next tasks will add component files and the barrel reduces churn. This is a self-documenting, reviewer-friendly placeholder.
   - `src/lib/directives/` receives `.gitkeep` (no specific directive is planned right now — brief says "if needed").
   - `src/lib/theme/` receives `.gitkeep` (concrete SCSS files belong to the theme implementation task, not the structure task — avoid creating empty SCSS stubs that would be overwritten).
   - `src/lib/components/` itself needs no placeholder (it contains sub-folders that are tracked).

3. **Theme SCSS files (`_variables.scss`, `_utilities.scss`, `_mixins.scss`, `theme.scss`).**
   Brief §7 lists them. **Decision:** Do NOT create them in this task. They are implementation artifacts (Task for theme). They are *documented* as intended contents of `src/lib/theme/` in `project-structure.md`'s comment so the structure record stays accurate without creating empty stubs.

4. **Directives content.**
   Architecture lists "autofocus, click-outside, ..." as examples, but brief §2.1 says "if needed".
   **Decision:** Create `src/lib/directives/` folder with a `.gitkeep`; document example directives in the structure comment. No directive files in this task.

5. **`public-api.ts` initial content.**
   Single barrel entry point per architecture. Nothing to re-export yet (no components implemented).
   **Decision:** Create `src/lib/public-api.ts` with a header JSDoc describing its purpose + an `@todo` that lists the future exports grouped by category. **No actual `export` statements yet** (would reference non-existent symbols and break any future `tsc` until components land). Keeping the file small also complies with `max-lines-per-file.md` (well under 200 lines).

6. **`src/.gitkeep` after creating `src/lib/`.**
   Once `src/lib/public-api.ts` exists, `src/` is no longer empty and `.gitkeep` is redundant.
   **Decision:** Remove `src/.gitkeep` in the same task (4.2) to avoid leaving a stale marker. This is a tracked-file deletion, safe to commit.

7. **Other folders section.**
   Existing `.agent/project-structure.md` lists `.kilo/modes/` and `docs/`. Verify they exist; if yes, keep concise comments. The `project-structure` command says "Other folders" = project-level dirs supporting development; `.agent/` and `.kilo/` qualify. Add `.agent/`? The existing file omits it.
   **Decision:** Preserve existing entries (`.kilo/modes/`, `docs/`) and add `.agent/` + `.kilo/plans/` for completeness/accuracy, since these are actively used by the workflow. Keep comments minimal.

8. **Naming conventions (recorded for future implementer tasks).**
   - Component folders: **kebab-case** (matches brief: `module-header/`, `empty-state/`, etc.).
   - Component class names: PascalCase with `Cba` prefix per brief §2.1 (`CbaButton`, `CbaCard`, `CbaBadge`, `CbaEmptyState`, `CbaSkeleton`, `CbaModal`) and `ModuleHeader`, `ModuleContainer` (no `Cba` prefix for the layout primitives — consistent with brief §2.1 / §6.1 / §6.2).
   - Files inside a component folder (when implemented later): `<component-name>.component.ts`, `<component-name>.component.html`, `<component-name>.component.scss`, `index.ts` barrel.
   - Public surface goes through `public-api.ts` only.

9. **Rule compliance check.**
   - `project-structure.md` (markdown): only Plan Agent / Docs Specialist may edit — this is a Plan Agent step, OK.
   - `max-lines-per-file.md`: applies to `src/` code files. `public-api.ts` will be ~20 lines. OK.
   - `newline-prevention.md`: real newlines, no `\n` literals. OK.
   - `gitignore-compliance.md`: run `git status` before commit; only the new structure files + `public-api.ts` + `index.ts`/`.gitkeep` markers staged; ensure no `node_modules/` (none yet). OK.

### High-Level Approach

1. Resolve all ambiguities (above).
2. Update `.agent/project-structure.md` to declare the new `src/lib/...` folder tree with brief AI-agent comments (folders only).
3. Create the physical directory tree under `src/lib/`, with minimal placeholders (`index.ts` per component, `.gitkeep` for `theme/` and `directives/`).
4. Create `src/lib/public-api.ts` as an empty barrel with documentation header.
5. Remove the now-redundant `src/.gitkeep`.
6. Commit. Verify physical folders == `project-structure.md` == brief.
7. Hand off to 4.2 implementer; do NOT execute file creation in this planning step.

---

## Detailed Atomic Steps (for implementer — 4.2)

> The implementer executes these EXACTLY as written. This plan step itself performs NO file creation.

### Step A — Update `.agent/project-structure.md`

Replace the entire current content of `.agent/project-structure.md` with:

```markdown
# Project Structure

# Folders in src/

- src/lib/ - root of the publishable Angular library (ng-packagr entry via src/lib/public-api.ts)
- src/lib/components/ - reusable standalone Angular UI components consumed by Shell and MFEs
- src/lib/components/module-header/ - ModuleHeader component: Shell-injected header with title, size/collapse/fullscreen actions and status indicator
- src/lib/components/module-container/ - ModuleContainer component: wraps ModuleHeader + MFE content; handles size, collapse, fullscreen, padding and internal scroll
- src/lib/components/button/ - CbaButton component: variants primary/secondary/ghost/danger/success, sizes sm/md, loading state, icon support
- src/lib/components/card/ - CbaCard component: optional and configurable header & footer
- src/lib/components/badge/ - CbaBadge component: semantic colours with solid or outline styles
- src/lib/components/empty-state/ - CbaEmptyState component: slots for icon, title, description and primary action
- src/lib/components/skeleton/ - CbaSkeleton component: variants text, avatar, card, table-row and generic
- src/lib/components/modal/ - CbaModal component: thin wrapper around ng-bootstrap modal
- src/lib/theme/ - SCSS theme package intended to contain _variables.scss, _utilities.scss, _mixins.scss and theme.scss (CSS variables under --cba- prefix)
- src/lib/directives/ - lightweight attribute directives created on demand (e.g. autofocus, click-outside)

# Other folders

- .agent/ - AI-agent context: project-info, todos, project-structure, workflows
- .kilo/ - Kilo agent configuration: rules, commands, modes, plans
- docs/ - developer documentation files
```

**Verification for Step A:**
- File uses actual newlines (not `\n` literals).
- Section headers present: `# Folders in src/` and `# Other folders`.
- Every line under `# Folders in src/` ends with `/` (folder, not file).
- No files are listed (only folders). `public-api.ts` is intentionally absent from the folder list because it is a file; it is referenced in the `src/lib/` comment instead.

### Step B — Create physical directories

Create the following folders (Windows paths):

- `src/lib/`
- `src/lib/components/`
- `src/lib/components/module-header/`
- `src/lib/components/module-container/`
- `src/lib/components/button/`
- `src/lib/components/card/`
- `src/lib/components/badge/`
- `src/lib/components/empty-state/`
- `src/lib/components/skeleton/`
- `src/lib/components/modal/`
- `src/lib/theme/`
- `src/lib/directives/`

Command (single, no chaining):
```powershell
New-Item -ItemType Directory -Path "src\lib\components\module-header" -Force
```
Run equivalent `-Force` mkdir for each of the listed paths. Do NOT chain with `&&`; one `New-Item` per path.

### Step C — Component barrel placeholders `index.ts`

For EACH of the 8 component folders, create `index.ts` with this exact content (substitute the `<component-name>` comment):

```ts
/**
 * Barrel for the <ComponentName> component.
 *
 * @todo Implement <ComponentName> standalone component and re-export its public
 * symbols here (e.g. `export * from './<component-name>.component';`).
 */
export {};
```

Mapping (folder → `<ComponentName>` used in the doc comment):

| Folder | `<ComponentName>` |
| --- | --- |
| `src/lib/components/module-header/` | `ModuleHeader` |
| `src/lib/components/module-container/` | `ModuleContainer` |
| `src/lib/components/button/` | `CbaButton` |
| `src/lib/components/card/` | `CbaCard` |
| `src/lib/components/badge/` | `CbaBadge` |
| `src/lib/components/empty-state/` | `CbaEmptyState` |
| `src/lib/components/skeleton/` | `CbaSkeleton` |
| `src/lib/components/modal/` | `CbaModal` |

`export {};` keeps the file a valid ES module while there is nothing to export. Each `index.ts` is far under 200 lines.

### Step D — `.gitkeep` placeholders

- Create `src/lib/theme/.gitkeep` (empty file; theme SCSS implementation arrives in a later task).
- Create `src/lib/directives/.gitkeep` (empty file; directives are created on demand).

### Step E — Create `src/lib/public-api.ts`

File path: `src/lib/public-api.ts`. Exact content:

```ts
/**
 * Public entry point for @cobranza-apps/ui.
 *
 * Single barrel re-exporting all public components, directives and theme of the
 * Cobranza App Company Back-office UI library. Consumed by the Shell and every
 * Micro-frontend (MFE) via `ng-packagr` (configured in ../../ng-package.json).
 *
 * @todo Add re-exports as components, directives and theme become available:
 *   - Components: ModuleHeader, ModuleContainer, CbaButton, CbaCard, CbaBadge,
 *     CbaEmptyState, CbaSkeleton, CbaModal.
 *   - Directives: lightweight attribute directives (e.g. autofocus, click-outside).
 *   - Theme: SCSS variables, utilities and mixins (re-exported where applicable).
 *
 * Keep this file as the ONLY public surface until secondary entry points are
 * introduced (see architecture.md "Public API Strategy").
 */
export {};
```

**Verification for Step E:**
- Uses real newlines.
- Well under 200 lines (≤ 20 lines).
- `export {};` keeps it a valid module with no broken references; `tsc`/`ng-packagr` won't fail on missing symbols.
- No imports of not-yet-existing modules.

### Step F — Remove redundant `src/.gitkeep`

```powershell
Remove-Item -LiteralPath "src\.gitkeep"
```

**Rationale:** `src/` now contains tracked content (`src/lib/public-api.ts`, `index.ts`, `.gitkeep` files), so the keep-marker is obsolete.

### Step G — Gitignore compliance & staging

1. Read `.gitignore` (implementer must follow `.kilo/rules/gitignore-compliance.md`).
2. Run `git status` (single command).
3. Verify the following paths (and ONLY these, plus the updated structure file) appear as new/modified:
   - `.agent/project-structure.md` (modified)
   - `src/lib/components/module-header/index.ts` (new)
   - `src/lib/components/module-container/index.ts` (new)
   - `src/lib/components/button/index.ts` (new)
   - `src/lib/components/card/index.ts` (new)
   - `src/lib/components/badge/index.ts` (new)
   - `src/lib/components/empty-state/index.ts` (new)
   - `src/lib/components/skeleton/index.ts` (new)
   - `src/lib/components/modal/index.ts` (new)
   - `src/lib/theme/.gitkeep` (new)
   - `src/lib/directives/.gitkeep` (new)
   - `src/lib/public-api.ts` (new)
   - `src/.gitkeep` (deleted)
4. Ensure NO `node_modules/`, lockfile, or build artifacts are staged. (None exist yet — Task 4 will install deps.)
5. Stage only the intended paths. Single commands:
   ```powershell
   git add .agent/project-structure.md
   ```
   then one `git add` per new path (or `git add src/lib src/.gitkeep`) — no chaining.

### Step H — Commit

Single command, meaningful message:
```
git commit -m "feat(structure): define src/lib folder layout and public-api barrel

- Map src/lib tree in .agent/project-structure.md (components, theme, directives)
- Scaffold per-component index.ts barrels with @todo placeholders
- Add src/lib/theme and src/lib/directives .gitkeep markers
- Add empty public-api.ts barrel (single entry point per architecture)
- Remove now-redundant src/.gitkeep"
```

Do NOT push in this step (push happens at the end of the Critical Workflow, Step 5).

---

## Rule Compliance Checklist

| Rule | Status |
| --- | --- |
| `project-structure.md` exists & accurate | Updated in Step A |
| All source under `src/` | All new code files under `src/lib/` |
| `max-lines-per-file` (<200) | `public-api.ts` ~20 lines; `index.ts` ~7 lines each |
| `newline-prevention` (real newlines) | Enforced at write time |
| `gitignore-compliance` | Step G runs `git status` + staged paths only |
| `markdown-generation-rule` | `.agent/project-structure.md` updated by Plan Agent (this step) — Docs Specialist may refine in 4.4 |
| `no-commented-code` | `@todo` JSDoc is documentation, not commented-out code; `export {};` is live code |
| Military-mode / self-documenting | Names and JSDoc self-document intent |

---

## Deliverables of THIS Plan Step (4.1)

1. This plan file at `.kilo/plans/20260729-task3-define-structure.md`.
2. No folders, no files, no git operations performed by the Architector.

## Verification (self-check against original task)

- TODO Task 3 = "define project structure (partial details described in project brief)". ✅ Plan defines the structure fully from brief §7.
- Global plan Task 3 §4.1 requires saving plan to `.kilo/plans/20260729-task3-define-structure.md`. ✅ Saved.
- Plan covers `.agent/project-structure.md` creation/update + folder structure + `public-api.ts` + compliance. ✅
- Plan does NOT create folders/files (planning only). ✅
- Plan does NOT call `plan_exit`. ✅ (handled by caller via `question` tool.)

## What was done

- Analysis & planning completed for Task 3 (Define Project Structure).
- Plan saved to `.kilo/plans/20260729-task3-define-structure.md`.

## What was NOT done

- No folders or files created under `src/`.
- `.agent/project-structure.md` was NOT modified (implementer will do it in 4.2).
- No git commit / push.
- No `public-api.ts` written.
- No review (4.3), docs (4.4), verification (4.5), or task completion (4.6) performed.