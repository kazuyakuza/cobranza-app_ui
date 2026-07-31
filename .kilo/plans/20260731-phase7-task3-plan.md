# Phase 7 — Task 3: Public API Finalization, Package Metadata & README/Docs Completion

> **Step:** Critical Workflow 4.1b — Analysis & Implementation Plan
> **TODO file:** `.agent/todos/20260730/20260730-todo-5.md` (Phase 7, Tasks 3/4/5)
> **Branch:** `feat/phase7-accordion-spanish-delivery`
> **Target acceptance criteria:** #5 (public API surface), #6 (package metadata/build), #7 (README + docs), #8 (build succeeds + leftover scaffold removed).
> **Scope:** Plan-only. No source edits here. Implementer (4.2) executes this plan.

---

## 1. Pre-Analysis (verified current state)

### 1.1 `src/public-api.ts` — current exports
Exports (in this order):
`accordion, badge, button, card, datepicker, dropdown, empty-state, input, modal, module-container, module-footer, module-header, popover, select, skeleton, typeahead` + `i18n/ui-messages`.

Intended stable surface per TODO §3:
- ModuleHeader, ModuleContainer, ModuleFooter — present ✓
- CbaButton, CbaCard, CbaBadge, CbaEmptyState, CbaSkeleton — present ✓
- CbaModal (+ `CbaModalService`, `CbaModal*` types), CbaInput (+ `CbaInputType`), CbaSelect, CbaDatepicker — present ✓
- CbaDropdown, CbaPopover (+ `CbaPopoverPlacement`), CbaTypeahead (+ `CbaTypeahead*` types) — present ✓
- CbaAccordion — present ✓
- Intentionally public types/constants: `ModuleHeaderStatus`, `ModuleHeaderSize`, `ModuleContainerSize`, `ModuleContainerPadding`, `CBA_UI_MESSAGES` — all reachable via barrels ✓
  - `module-header/index.ts` re-exports `module-header.types` (`ModuleHeaderStatus`, `ModuleHeaderSize`) + component.
  - `module-container/index.ts` re-exports `module-container.types` (`ModuleContainerSize`, `ModuleContainerPadding`) + component.
  - `module-footer/index.ts` re-exports `ModuleFooterComponent` + `ModuleHeaderStatus` (re-export of the shared status union for footer consumers).
  - `i18n/ui-messages.ts` exports `CBA_UI_MESSAGES`.

**Conclusion:** No accidental/dead/demo exports in `public-api.ts`. The set already matches the intended stable surface. **No change required to `public-api.ts`.**

### 1.2 Barrel review (`src/components/*/index.ts`)
- All component barrels export only the public component + its public types.
- `src/components/form-field/index.ts` is explicitly annotated **"Internal barrel… Not part of the public API."** and is **NOT** referenced from `public-api.ts`. ✓
- `src/components/testing/test-helpers.ts` has **no barrel** and is **not** exported anywhere. ✓
- No barrel leaks an internal helper type, CVA base class, or test utility into `public-api.ts`.

**Conclusion:** Barrels are clean. **No change required.**

### 1.3 Class names & selectors consistency
Selectors (all `cba-*` prefix, verified via grep):
`cba-accordion, cba-badge, cba-button, cba-card, cba-datepicker, cba-dropdown, cba-empty-state, cba-field, cba-input, cba-modal, cba-module-container, cba-module-footer, cba-module-header, cba-popover, cba-select, cba-skeleton, cba-typeahead`.

Class-name convention (two intentional families, both documented):
- `Cba*Component` family: `CbaAccordionComponent, CbaBadgeComponent, CbaButtonComponent, CbaCardComponent, CbaDatepickerComponent, CbaDropdownComponent, CbaEmptyStateComponent, CbaInputComponent, CbaModalComponent, CbaPopoverComponent, CbaSelectComponent, CbaSkeletonComponent, CbaTypeaheadComponent`.
- `Module*Component` family (workspace chrome, intentionally non-`Cba` per architecture/README): `ModuleHeaderComponent, ModuleContainerComponent, ModuleFooterComponent`.

**Conclusion:** Consistent within each documented family. `cba-field`/`CbaFieldComponent` is internal (not in public API), so its `cba-` selector does not pollute the public surface. **No rename required.** Implementer must **not** rename `Module*` to `CbaModule*` — that is out of scope and would break the documented contract.

### 1.4 Package metadata & build output
- `package.json` v0.7.0: `exports["./theme"].sass = "./theme/theme.scss"`, `peerDependencies` (Angular 22, bootstrap 5.3, ng-bootstrap 21, FA), `publishConfig.access=public`, `engines`, `sideEffects:false`, `private:false`. ✓
- `ng-package.json`: `dest ./dist`, `lib.entryFile src/public-api.ts`, `lib.styleIncludePaths [src/theme]`, `assets` glob `**/*.scss` from `src/theme` → `theme`. ✓
- Generated `dist/package.json` (already present from a prior build): includes `.` (`types` + `default`), `./theme` (sass), `./package.json`, `module`, `typings`, `type:module`, `dependencies.tslib`, full `peerDependencies`. ✓
- `dist/` contents: `dist/theme/theme.scss` + all partials, `dist/types/cobranza-apps-ui.d.ts`, `dist/fesm2022/cobranza-apps-ui.mjs`(+`.map`), `dist/README.md`. ✓
- `.gitignore` excludes `dist/`, `node_modules/`, `*.tsbuildinfo`, `.eslintcache`, `.angular/`. No dist artifact will be staged. ✓

**Conclusion:** Metadata is publishable/consumable. Implementation actions are **verification-only** (clean rebuild + dist inspection + theme consumability smoke test). No `package.json`/`ng-package.json` edits expected unless verification reveals a gap.

### 1.5 README + docs
**README.md** — already covers: what the library is (Overview), install + peer deps (Installation), theme import (Quick Start step 1), Spanish-only note (dedicated section), link to `/docs` (Documentation). ✓ most requirements met.

**Gaps found in README.md:**
1. **Quick Start lacks a concrete template example** with `<cba-module-container>` + `<cba-module-header>` (+ optional `<cba-module-footer>`). Currently Quick Start step 2 only shows an `import { … }` line and a pointer to `/docs/USAGE.md`. TODO §5 explicitly requires a quick-start example using those three selectors.
2. **Documentation section missing 3 component-doc links**: `CBA_INPUT.md`, `CBA_SELECT.md`, `CBA_DATEPICKER.md` are present in `/docs` but **not listed** in README §Documentation (verified against README lines 197–210).
3. **`CBA_FORM_FIELD.md` not listed** — it is an internal-architecture doc; it should be linked under a clearly-marked "Internal architecture" sub-bullet so AI agents can find it without implying it is public API.
4. *(Minor)* README §Overview bullet "Directives — Lightweight helpers (e.g., autofocus, click-outside) when needed." refers to a planned-but-unimplemented folder. Keep as-is (project-structure.md lists `src/directives/` as "on demand"); no action.

**USAGE.md** — TOC lists 13 components but **omits `CbaInput`, `CbaSelect`, `CbaDatepicker`** (grep confirmed zero occurrences of those identifiers). These three public form controls have dedicated doc files but no usage-pattern section in USAGE.md. **Gap.**

**`/docs` index** — No `docs/INDEX.md` or `docs/README.md` exists. README §Documentation serves as a de-facto index but TODO §5 asks `/docs` to "have an index or clear set of pages." Action: create `docs/INDEX.md` as the single entry point listing every doc page (consumer docs + theme + internal + agent-workflow docs), and link it from README §Documentation.

**`/docs` agent-meta files** — `docs/how-to-set-up-git.md` and `docs/how-to-write-todo-files.md` are agent workflow docs, not library consumer docs. Mixing them with component docs dilutes `/docs` as a consumer reference. Action: **move** them to `.agent/docs/` (create that folder) and update `docs/INDEX.md`/README accordingly. *(If the move is deemed risky by the implementer, fallback = keep in place but list under an "Agent workflow docs" section in INDEX.)*

**Component-doc completeness** — Each public component must have a doc page with: selector, inputs/outputs/slots, minimal example, important non-goals. Files exist for every public component:
`MODULE_HEADER.md, MODULE_CONTAINER.md, CBA_BUTTON.md, CBA_CARD.md, CBA_BADGE.md, CBA_EMPTY_STATE.md, CBA_SKELETON.md, CBA_MODAL.md, CBA_INPUT.md, CBA_SELECT.md, CBA_DATEPICKER.md, CBA_DROPDOWN.md, CBA_POPOVER.md, CBA_TYPEAHEAD.md, CBA_ACCORDION.md, CBA_MODULE_FOOTER.md` + `CBA_FORM_FIELD.md` (internal) + `THEME.md` + `USAGE.md`. Action: implementer **audits each file** for the 4 required sections and fills any gaps.

### 1.6 Leftover scaffold / demo code
- `src/directives/.gitkeep` exists (only `.gitkeep` in `src/`). `src/directives/` is documented in `project-structure.md` as "attribute directives created on demand" and README references directives as future work. **Decision: KEEP** — it is an intentional empty-folder placeholder, not leftover scaffold.
- No `demo/`, `app/`, or example-host project present. No commented-out code scan flagged (lint step covers it).
- No unused placeholder SCSS detected under `src/theme/` (all partials are `@use`d by `theme.scss` chain); implementer should confirm via grep in the audit step but no removal is expected.

**Conclusion:** No scaffold/demo removal actually required. Acceptance criterion #8's "leftover scaffold/demo removed" is already satisfied; implementer **verifies** rather than removes. (If the audit finds any genuinely dead file, handle in 4.3 review.)

---

## 2. High-Level Approach

Task 3 is a **closing/verification task** — Tasks 1 & 2 already shipped accordion + Spanish copy + partial docs. The remaining work is:

1. **Confirm** the public API surface is exactly the intended stable set (already true; no edits).
2. **Verify** a clean library build produces a correct, consumable `dist/` (rebuild + inspect + theme smoke test).
3. **Complete README** (quick-start template + missing doc links + internal form-field link).
4. **Complete USAGE.md** (add `CbaInput`/`CbaSelect`/`CbaDatepicker` usage-pattern sections + TOC entries).
5. **Create `/docs/INDEX.md`** and reorganize agent-meta docs to `.agent/docs/`.
6. **Audit each component doc** for the 4 mandatory sections; fill gaps.
7. **Final build + lint + test** green run; commit per logical change.

All changes are docs/config-adjacent and **non-breaking**. No public source files should be edited (only if the doc audit uncovers an actual public-API leak, which the pre-analysis says it will not).

---

## 3. Detailed Implementation Steps

> Conventions: every step ends with a **verification** checkpoint (✅). Commit after each labeled group. Never stage `dist/` or `node_modules/` (gitignore-compliance rule). Use single `bash` commands (no `&&` chaining), and prefer MCP tools for file ops.

### Step-group A — Public API verification (no-edit confirmation)

**A1.** Re-read `src/public-api.ts` and confirm it exports exactly:
`./components/accordion, badge, button, card, datepicker, dropdown, empty-state, input, modal, module-container, module-footer, module-header, popover, select, skeleton, typeahead` and `./i18n/ui-messages`.

✅ Verify: the 16 component lines + 1 i18n line match §1.1; no extra/missing lines. If mismatch → stop and return to caller (do not silently edit `public-api.ts`).

**A2.** For each `src/components/*/index.ts`, confirm it re-exports only the public component + public types (no internal CVA/field base, no test helper).

✅ Verify: `form-field/index.ts` and `testing/` are NOT in `public-api.ts`. Confirmed in §1.2 — no edits.

**A3.** Confirm selector/class-name convention via grep:
- All public selectors start with `cba-`.
- `Module*Component` family intentionally lacks `Cba` prefix (workspace chrome); document this is intentional and must NOT be renamed.

✅ Verify: grep `selector:\s*'[^']*'` in `src/components` returns only `cba-*` selectors; `ModuleHeaderComponent/ModuleContainerComponent/ModuleFooterComponent` are the only non-`Cba` public classes. No edits.

**A4.** Commit group A: none (no changes) — skip commit. If any verification fails, escalate back to caller instead of editing.

---

### Step-group B — Package metadata & build-output verification

**B1.** Clean previous build artifacts:
- Command (PowerShell, single): `Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue`
- ✅ Verify: `Test-Path dist` → `False`.

**B2.** Run a clean library build:
- Command: `npm run build`
- Keep default 2-minute timeout; if it needs more, raise timeout.
- ✅ Verify: build exits 0, prints `Building Angular Package … Built Angular Package!` (or equivalent ng-packagr success), no errors. Capture any warnings and triage: warnings about unused SCSS `@use` are acceptable; TS/entry errors are blockers.

**B3.** Inspect `dist/` structure:
- List `dist/` recursively (use `vscode-mcp-server_list_files_code` with path `dist`).
- ✅ Verify presence of: `dist/package.json`, `dist/README.md`, `dist/theme/theme.scss`, `dist/theme/_*.scss` partials, `dist/types/cobranza-apps-ui.d.ts`, `dist/fesm2022/cobranza-apps-ui.mjs`.

**B4.** Verify `dist/package.json` entry points:
- Read `dist/package.json`.
- ✅ Verify `exports` contains:
  - `"."` → `{ "types": "./types/cobranza-apps-ui.d.ts", "default": "./fesm2022/cobranza-apps-ui.mjs" }`
  - `"./theme"` → `{ "sass": "./theme/theme.scss" }`
  - `"./package.json"` entry
- Verify `peerDependencies` block matches root `package.json` (Angular 22, bootstrap ^5.3, ng-bootstrap ^21, FA packs).
- Verify `module`, `typings`, `type:module`, `dependencies.tslib` present.

**B5.** Verify the public type declarations include every intended export:
- Open `dist/types/cobranza-apps-ui.d.ts`.
- ✅ Verify symbols present in the bundled `.d.ts`: `ModuleHeaderComponent, ModuleContainerComponent, ModuleFooterComponent, CbaButtonComponent, CbaCardComponent, CbaBadgeComponent, CbaEmptyStateComponent, CbaSkeletonComponent, CbaModalComponent, CbaModalService, CbaModalSize, CbaModalDismissReason, CbaModalOptions, CbaInputComponent, CbaInputType, CbaSelectComponent, CbaDatepickerComponent, CbaDropdownComponent, CbaDropdownPlacement, CbaPopoverComponent, CbaPopoverPlacement, CbaTypeaheadComponent, CbaTypeaheadSearchFn, CbaTypeaheadFormatter, CbaTypeaheadPlacement, CbaTypeaheadItemSelectedEvent, CbaAccordionComponent, ModuleHeaderStatus, ModuleHeaderSize, ModuleContainerSize, ModuleContainerPadding, CBA_UI_MESSAGES`.
  - It is acceptable for ng-packagr to **omit** unused-but-exported types from `.d.ts` only if tree-shaken; if a symbol is missing that IS used, treat as blocker; if a symbol is exported but unused it may legitimately be absent — note but do not block.
- ✅ Verify `CbaFieldComponent`/`CbaControlValueAccessor`/`CbaFieldControlValueAccessor` are **absent** (internal). If present → internal leak; escalate (do not edit `public-api.ts` without caller approval).

**B6.** Theme consumability smoke test (no publish required):
- Create a throwaway SCSS test under the pre-approved temp dir `C:\Users\ibej_\AppData\Local\Temp\kilo\phase7-theme-check\test-theme.scss` with content:
  ```scss
  @use 'C:/projects/cobranza-app/front/ui/dist/theme/theme' as theme;
  :root { color: theme.$cba-text-primary; }
  ```
  (Use only variables known to exist in `src/theme/_variables.scss`; if `$cba-text-primary` is not exported as a Sass var, swap to a confirmed public token — first read `_variables.scss` to pick a real one.)
- Compile with the project Sass (if available): `npx sass "C:/Users/ibej_/AppData/Local/Temp/kilo/phase7-theme-check/test-theme.scss" "C:/Users/ibej_/AppData/Local/Temp/kilo/phase7-theme-check/out.css"`
- ✅ Verify: `out.css` generated without "Cannot find module" errors; confirms `@cobranza-apps/ui/theme` package-subpath resolves to `dist/theme/theme.scss` after install.
- Delete the temp scratch dir: `Remove-Item -Recurse -Force "C:\Users\ibej_\AppData\Local\Temp\kilo\phase7-theme-check"`
- If Sass is unavailable, fallback verification: read `dist/theme/theme.scss` and confirm it `@use`s the partials and would emit `:root` token vars; document that a real Sass compile could not be run.

**B7.** Confirm `dist/` is gitignored (never staged):
- ✅ Verify: `git status --short` shows no `dist/` entries after build. `dist/` matches `.gitignore` line 31.

**B8.** Commit group B: none (no tracked changes — only rebuild verification). If `dist/` accidentally tracked, unstage it.

---

### Step-group C — README.md completion

**C1.** Add a concrete quick-start template to README §Quick Start (after the existing import step 2). Insert before the "For usage patterns…" pointer line. Suggested exact block:

  ```html
  <!-- my-module.component.html -->
  <cba-module-container [size]="'50%'">
    <cba-module-header
      [title]="'Clientes'"
      [status]="'loaded'"
      (collapseToggle)="onCollapse($event)"
      (sizeToggle)="onSize($event)"
    />
    <div class="my-module-body">
      <!-- MFE / business content here -->
    </div>

    <!-- optional footer -->
    <cba-module-footer status="loaded">Listo</cba-module-footer>
  </cba-module-container>
  ```

  Keep self-closing `<cba-module-header …/>` (matches existing component usage style in repo; if repo uses explicit closing tags elsewhere, follow that convention). Add a one-line caption: "Minimal quick start with `ModuleContainer` + `ModuleHeader` + optional `ModuleFooter`."

  ✅ Verify: README §Quick Start now contains both the theme import, the TS import, and a runnable HTML template using the three required selectors.

**C2.** Add the 3 missing component-doc links to README §Documentation. After the `CBA_MODAL.md` line (logical grouping: basic components then form controls), insert:
  - `- [`/docs/CBA_INPUT.md`](/docs/CBA_INPUT.md) — `CbaInput` selector, API, control types, ControlValueAccessor, label/hint/error, theming.`
  - `- [`/docs/CBA_SELECT.md`](/docs/CBA_SELECT.md) — `CbaSelect` selector, API, projected options, ControlValueAccessor, theming.`
  - `- [`/docs/CBA_DATEPICKER.md`](/docs/CBA_DATEPICKER.md) — `CbaDatepicker` selector, API, ng-bootstrap NgbInputDateadapter notes, aria toggle label, theming.`

  ✅ Verify: README §Documentation lists 19 doc links (16 public component docs + USAGE + THEME + INDEX once created) plus an internal-architecture sub-bullet (C3) and the project-info links.

**C3.** Add an internal-architecture sub-bullet under §Documentation (after the public component links):
  - `- Internal architecture: [`/docs/CBA_FORM_FIELD.md`](/docs/CBA_FORM_FIELD.md) — shared `CbaField` layout + `CbaControlValueAccessor` used by Input/Select/Datepicker. **Not part of the public API.**`

  ✅ Verify: clearly marked "Not part of the public API" so consumers do not import `CbaFieldComponent`.

**C4.** Add link to the new `/docs/INDEX.md` (created in group E) at the top of §Documentation:
  - `- [`/docs/INDEX.md`](/docs/INDEX.md) — Index of all library documentation pages.`

  ✅ Verify: INDEX link present and points at the file created in E1. (C4 depends on E1 — perform after E1, or create INDEX first.)

**C5.** Commit group C: `docs(readme): add quick-start template and missing component doc links`

---

### Step-group D — USAGE.md completion (form controls)

**D1.** Read `docs/CBA_INPUT.md`, `docs/CBA_SELECT.md`, `docs/CBA_DATEPICKER.md` to extract each control's selector, key `@Input()`/`@Output()` list, and a minimal example.

**D2.** Add three new sections to `docs/USAGE.md` under §Component Usage Patterns, after the existing `CbaModal` section (form-controls grouping), in this order: `CbaInput`, `CbaSelect`, `CbaDatepicker`. Each section must include:
  - A level-3 heading: `### CbaInput` / `### CbaSelect` / `### CbaDatepicker`.
  - A one-line purpose statement (thin wrapper around native/ng-bootstrap control with shared field layout).
  - A selector line: `Selector: \`cba-input\`` etc.
  - A minimal `import` + template example (~10–15 lines) demonstrating label/hint/error and `ngModel`.
  - A short note linking to the dedicated doc (e.g., "Full API: [`CBA_INPUT.md`](./CBA_INPUT.md)").
  - Cross-reference to `CBA_FORM_FIELD.md` for the shared layout contract (so consumers understand the common label/hint/error slots).

**D3.** Update `docs/USAGE.md` TOC: insert three entries into the §Component Usage Patterns sub-list, in the same order:
  - `- [CbaInput](#cbainput)`
  - `- [CbaSelect](#cbaselect)`
  - `- [CbaDatepicker](#cbadatepicker)`

  ✅ Verify: TOC anchors match the new heading slugs (GitHub-style lowercasing + dash for non-alnum). Re-read the file to confirm ordering and that no duplicate anchors exist.

**D4.** Commit group D: `docs(usage): add CbaInput/CbaSelect/CbaDatepicker usage patterns`

---

### Step-group E — `/docs` index + agent-meta doc reorganization

**E1.** Create `docs/INDEX.md` — single entry point for all library documentation. Structure:
  ```markdown
  # @cobranza-apps/ui — Documentation Index

  > Single entry point for consumers and AI agents. Keep alphabetical within each section.

  ## Getting started
  - [USAGE.md](./USAGE.md) — Install, peer deps, theme import, quick start, per-component usage patterns.
  - [THEME.md](./THEME.md) — Theme import, design tokens, utility classes.

  ## Workspace chrome
  - [MODULE_HEADER.md](./MODULE_HEADER.md)
  - [MODULE_CONTAINER.md](./MODULE_CONTAINER.md)
  - [CBA_MODULE_FOOTER.md](./CBA_MODULE_FOOTER.md)

  ## Basic components
  - [CBA_BADGE.md](./CBA_BADGE.md)
  - [CBA_BUTTON.md](./CBA_BUTTON.md)
  - [CBA_CARD.md](./CBA_CARD.md)
  - [CBA_EMPTY_STATE.md](./CBA_EMPTY_STATE.md)
  - [CBA_SKELETON.md](./CBA_SKELETON.md)

  ## Overlays
  - [CBA_DROPDOWN.md](./CBA_DROPDOWN.md)
  - [CBA_MODAL.md](./CBA_MODAL.md)
  - [CBA_POPOVER.md](./CBA_POPOVER.md)

  ## Form controls
  - [CBA_DATEPICKER.md](./CBA_DATEPICKER.md)
  - [CBA_INPUT.md](./CBA_INPUT.md)
  - [CBA_SELECT.md](./CBA_SELECT.md)
  - [CBA_TYPEAHEAD.md](./CBA_TYPEAHEAD.md)

  ## Other components
  - [CBA_ACCORDION.md](./CBA_ACCORDION.md)

  ## Internal architecture (NOT public API)
  - [CBA_FORM_FIELD.md](./CBA_FORM_FIELD.md) — shared field layout + ControlValueAccessor base used by Input/Select/Datepicker. Do not import directly.

  ## Project & AI-agent context
  - [Project brief](../.agent/project-info/brief.md)
  - [Architecture](../.agent/project-info/architecture.md)
  - [Tech stack](../.agent/project-info/tech.md)
  ```
  Update README §Documentation top to link this INDEX (per C4).

  ✅ Verify: `docs/INDEX.md` exists; every listed file exists (`Test-Path` each); INDEX has < 100 lines so no separate TOC needed (still add a short section structure).

**E2.** Move agent-meta docs out of `/docs`:
- Create `.agent/docs/` folder.
- Move `docs/how-to-set-up-git.md` → `.agent/docs/how-to-set-up-git.md` (use `vscode-mcp-server_move_file_code`).
- Move `docs/how-to-write-todo-files.md` → `.agent/docs/how-to-write-todo-files.md`.
- Do NOT add these to `docs/INDEX.md` (they are agent-workflow docs, not library-consumer docs). They may be linked from `.agent/WORKFLOWS.md` if/when relevant — out of scope here.
- Update `.agent/project-structure.md` `# Other folders` section: add `- .agent/docs/ - AI-agent workflow how-to documentation` and update `docs/` description to `- docs/ - consumer-facing library documentation (component contracts, theme, usage)`.

  ✅ Verify: `docs/` no longer contains the two `how-to-*` files; `.agent/docs/` does; `project-structure.md` reflects the move; no broken links remain in README/INDEX (grep `/docs/how-to-set-up-git` and `/docs/how-to-write-todo-files` → no matches). If any reference existed outside README, fix it.

**E3.** Commit group E: `docs: add /docs index and relocate agent-meta how-to docs to .agent/docs`

---

### Step-group F — Component-doc completeness audit (read+fill)

For **each** of the 16 public component docs + `CBA_FORM_FIELD.md`, verify the 4 mandatory sections exist and are accurate. Use a checklist; only edit files with actual gaps.

**F1.** Audit checklist per file (`selector`, `inputs/outputs/slots`, `minimal example`, `non-goals`):
1. `MODULE_HEADER.md` — inputs: title/size/status/collapsible/fullscreen/removable…; outputs: collapseToggle/sizeToggle/remove/fullscreenToggle; non-goal: drag handled by Shell.
2. `MODULE_CONTAINER.md` — inputs: size/padding/collapsible/fullscreen/…; non-goals: no DnD, no persistence.
3. `CBA_MODULE_FOOTER.md` — inputs: status/statusText; slot: default projection; non-goal: not a toolbar.
4. `CBA_BUTTON.md` — inputs: variant/size/type/loading/disabled/icon…; non-goals: no dropdown split.
5. `CBA_CARD.md` — slots: header/body/footer; non-goal: no forced hover elevation.
6. `CBA_BADGE.md` — inputs: variant/appearance; non-goal: decorative only.
7. `CBA_EMPTY_STATE.md` — slots: icon/title/description/action; non-goal: no async handling.
8. `CBA_SKELETON.md` — inputs: variant; non-goal: no shimmer config.
9. `CBA_MODAL.md` — service API + size/dismiss reason; non-goal: no business dialog logic.
10. `CBA_DROPDOWN.md` — selector, slots (toggle/menu items), placement; note behaviour from ng-bootstrap.
11. `CBA_POPOVER.md` — selector, placement, body string/template; note behaviour from ng-bootstrap.
12. `CBA_TYPEAHEAD.md` — selector, searchFn, formatter, itemSelected; note behaviour from ng-bootstrap.
13. `CBA_ACCORDION.md` — already created in Task 1; verify 4 sections + Spanish-default note + ng-bootstrap behaviour note.
14. `CBA_INPUT.md` — selector, control types, CVA, label/hint/error slots.
15. `CBA_SELECT.md` — selector, projected options, CVA, slots.
16. `CBA_DATEPICKER.md` — selector, ng-bootstrap NgbInputDateadapter, aria toggle label (`Abrir selector de fecha`), Spanish default.
17. `CBA_FORM_FIELD.md` (internal) — verify "Not part of the public API" banner stays present.

**F2.** For each file with a missing section, append the missing block using content sourced from the component's `.component.ts` JSDoc (read each component file to extract accurate `@Input()/@Output()` names). **Do not invent** inputs/outputs — if uncertain, read the component source.

**F3.** Ensure every component doc lists its **non-goal** explicitly (TODO §5 requires). At minimum each doc should state the ng-bootstrap pass-through nature (for overlay/form components) or the desktop-only/no-business-logic non-goal (for chrome components).

✅ Verify after F: every component doc contains the strings "selector" (or a `Selector:` line), "@Input"/"Inputs"/"Outputs"/"Slots" equivalent, an example block, and a "Non-goals"/"Not goals" section. Run grep `docs/MODULE_*.md` and `docs/CBA_*.md` to confirm each contains the word "Non-goals" (or equivalent).

**F4.** Commit group F: `docs: fill missing component-doc sections (selector/inputs/slots/examples/non-goals)`
  - If no gaps found, skip commit and note "audit passed, no edits" in the completion summary.

---

### Step-group G — Final verification run

**G1.** Lint: `npm run lint` → exit 0.
**G2.** Test: `npm test` → exit 0 (`--passWithNoTests` allowed).
**G3.** Build (already done in B, but re-run to confirm docs/config touched nothing that affects build): `npm run build` → exit 0.
**G4.** Gitignore compliance: `git status` — ensure no `dist/`, `node_modules/`, `*.tsbuildinfo`, `.eslintcache` staged. Unstage if found.
**G5.** Confirm `public-api.ts` was **not** modified: `git diff --stat src/public-api.ts` → empty (this task must not change the public API surface; verification-only).
**G6.** Commit G: none unless a stray file needs unstaging.

---

## 4. Git / Commit Sequence

All commits on branch `feat/phase7-accordion-spanish-delivery` (already checked out). Suggested linear commits:

1. `docs(readme): add quick-start template and missing component doc links` (group C)
2. `docs(usage): add CbaInput/CbaSelect/CbaDatepicker usage patterns` (group D)
3. `docs: add /docs index and relocate agent-meta how-to docs to .agent/docs` (group E)
4. `docs: fill missing component-doc sections (selector/inputs/slots/examples/non-goals)` (group F, only if edits made)

> Do **NOT** push in this step (4.2). Pushing/merge happens at TODO-completion (step 5) by the implementer assigned there, to `origin` only.

---

## 5. Acceptance-Criteria Mapping

| TODO criterion | Satisfied by |
| --- | --- |
| #5 public API exports only intended stable surface | Group A (verify, no edits) |
| #6 package metadata + build output correct for local consumption | Group B (rebuild + dist inspection + theme smoke test) |
| #7 README + docs index/examples complete for Shell/MFE/AI | Groups C, D, E, F |
| #8 build succeeds + leftover scaffold removed | Group G + §1.6 (scaffold already absent; `directives/.gitkeep` kept intentionally) |

---

## 6. Out of Scope (do NOT do)

- Edit `src/public-api.ts` or any `src/components/*/index.ts` (public API is already correct; verification-only).
- Rename `Module*Component` → `CbaModule*` orvice versa; selectors are final.
- Add i18n/locale infrastructure.
- Add npm publish automation / CI release pipeline.
- Remove `src/directives/.gitkeep` (intentional placeholder).
- Push to any remote (defer to step-5 implementer).
- Implement new components beyond the existing public set.

---

## 7. Risks / Notes

- **`dist/` already exists on disk** from a prior build (untracked). Group B deletes and rebuilds it; ensure `git status` never stages it (gitignored — confirmed).
- **ng-packagr `.d.ts` tree-shaking** may omit some exported-but-unused type aliases from `dist/types/…d.ts`. B5 treats absent-used symbols as blockers and absent-unused symbols as acceptable.
- **Theme smoke test** depends on `sass` availability via `npx`. If offline, fall back to manual `_variables.scss`/`theme.scss` read-through as documented in B6.
- **Moving `how-to-*` docs** changes file paths referenced nowhere in README/INDEX (verified by grep), so no broken-link risk; implementer should re-grep before committing E2.
- **Component-doc audit (F)** may surface real content gaps that take several edits; cap effort at filling the 4 mandatory sections — do not rewrite docs wholesale. Deep prose belongs in a future docs task.