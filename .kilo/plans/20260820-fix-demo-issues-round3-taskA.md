# Plan — Task A: Rebuild library and verify dist contains all changes

Source TODO: `.agent/todos/20260820/20260820-todo-1.md` (section: "Rebuild library and verify dist contains all changes").
Critical Workflow step: 4.1b (Analysis & Planning) for Task A. The implementer (step 4.2) executes this plan.

## 1. Root-cause analysis (verified)

### 1.1 Source symbols confirmed present
- `cbaModuleContainerFooter`:
  - `src/components/module-container/module-container.component.html:11` — `<ng-content select="[cbaModuleContainerFooter]"></ng-content>` inside the `@if (!isCollapsed())` block.
  - `src/components/module-container/module-container.component.ts:24,25,65` — JSDoc references.
- `faUpDownLeftRight`:
  - `src/components/module-header/module-header.component.ts:21` — import from `@fortawesome/free-solid-svg-icons`.
  - `src/components/module-header/module-header.component.ts:165` — `protected readonly faDrag = faUpDownLeftRight;`.
  - `src/components/module-header/module-header.component.html:24-30` — the built-in drag button (`class="cba-module-header__action cba-module-header__action--drag"`, `aria-label="Arrastrar módulo"`) rendered as the FIRST button inside `nav.cba-module-header__section--actions`, before collapse/size/fullscreen/remove.

### 1.2 Why the demo rendered stale output (the real mechanism)
- `package.json` devDependencies: `"@cobranza-apps/ui": "file:./dist"`. With a `file:` spec, npm copies `dist/` into `node_modules/@cobranza-apps/ui/` **at `npm install` time only**. A later `npm run build:lib` updates `dist/` but does NOT refresh `node_modules/@cobranza-apps/ui/`.
- `projects/demo/tsconfig.app.json` sets `"paths": {}`, which **overrides** the base `tsconfig.json` path map (`"@cobranza-apps/ui": ["src/public-api.ts"]`). Therefore `ng build demo` / `ng serve demo` resolve `@cobranza-apps/ui` from `node_modules/@cobranza-apps/ui/`, NOT from source.
- Conclusion: a bare `build:lib` is insufficient. The sequence must be `build:lib` → refresh `node_modules/@cobranza-apps/ui` → `build:demo`. The TODO's "dist is stale" framing is a symptom; the actionable cause is a stale `node_modules/@cobranza-apps/ui` copy relative to `dist/`.

### 1.3 State at plan-authoring time
Both `dist/fesm2022/cobranza-apps-ui.mjs` and `node_modules/@cobranza-apps/ui/fesm2022/cobranza-apps-ui.mjs` currently DO contain both symbols (verified via grep: import line 6, `this.faDrag = faUpDownLeftRight;` line 1410, `cbaModuleContainerFooter` in the `ModuleContainerComponent` template string). The plan still executes the full deterministic rebuild+verify cycle to guarantee correctness regardless of any intermediate state.

## 2. Scope & restrictions (hard)

- This task is **build + verify only**. No source files are modified. No commit, no version bump, no CHANGELOG entry.
- JUNIOR implementer under 50% restriction: execute exactly the steps below. No scope expansion, no architectural decisions, no edits to unrelated files.
- `dist/` and `node_modules/` are gitignored (`.gitignore` lines 30, 53). NEVER stage, commit, or `git add -f` anything under them.
- Do NOT create/switch git branches (restricted to Critical Workflow step 2).
- Do NOT edit `package.json` version (restricted to step 3).
- Do NOT run `git push` (restricted to step 5).
- If any verification fails, STOP and return the failure to the caller with the collected evidence. Do NOT attempt source fixes (that is a different task / caller decision).
- The fallback debug branch (Step 6) is **diagnostic only** — collect evidence, report, do NOT modify source.

## 3. Dist files to verify

Primary artifact:
- `dist/fesm2022/cobranza-apps-ui.mjs` — must contain `faUpDownLeftRight` (import + assignment) and `cbaModuleContainerFooter` (inside the `ModuleContainerComponent` `template:` string).

Secondary (informational, not a gate):
- `dist/fesm2022/cobranza-apps-ui.mjs.map` — source map; no grep requirement.
- `dist/types/cobranza-apps-ui.d.ts` — type declarations; no grep requirement.

Mirror that must also be refreshed (the demo's actual resolution target):
- `node_modules/@cobranza-apps/ui/fesm2022/cobranza-apps-ui.mjs` — must contain the same two symbols.

Demo build output to verify:
- `dist/demo/browser/` — at least one `.mjs`/`.js` chunk must contain `cbaModuleContainerFooter` and `faUpDownLeftRight` (or the minified icon reference), proving the demo bundled the fresh library.

## 4. Implementation steps (execute in order)

### Step 1 — Rebuild the library
- Command (single, not chained): `npm run build:lib`
- Workdir: project root (`C:\projects\cobranza-app\front\ui`).
- Expected: exit code 0. `dist/fesm2022/cobranza-apps-ui.mjs` regenerated.
- If the command fails: capture the full error output and STOP. Do NOT proceed. Report to caller.

### Step 2 — Verify dist contains the symbols
Use the `grep` tool (NOT PowerShell `Select-String`). The `.mjs` file is large; pass `limit: 5` to avoid truncation.

2a. `grep` pattern `faUpDownLeftRight` on `C:\projects\cobranza-app\front\ui\dist\fesm2022\cobranza-apps-ui.mjs`.
- Expected: at least 2 matches. One on the `import { ... faUpDownLeftRight ... } from '@fortawesome/free-solid-svg-icons';` line, one on the `this.faDrag = faUpDownLeftRight;` line.

2b. `grep` pattern `cbaModuleContainerFooter` on the same file.
- Expected: at least 1 match inside the `ModuleContainerComponent` `template:` string (`<ng-content select="[cbaModuleContainerFooter]">`). Comment-line matches (JSDoc) are also acceptable but the template-string match is the gate.

Gate: if either symbol is absent, STOP. The library build is broken — return the grep output to caller. Do NOT proceed to Step 3.

### Step 3 — Refresh `node_modules/@cobranza-apps/ui` from the fresh dist
This step is mandatory. Without it, Step 4 builds the demo against the stale `node_modules` copy.

3a. Command (single): `npm install`
- Workdir: project root.
- Expected: exit code 0. `node_modules/@cobranza-apps/ui/fesm2022/cobranza-apps-ui.mjs` updated to match `dist/`.

3b. Verify with `grep` (`limit: 5`) on `C:\projects\cobranza-app\front\ui\node_modules\@cobranza-apps\ui\fesm2022\cobranza-apps-ui.mjs`:
- pattern `faUpDownLeftRight` → expect ≥2 matches.
- pattern `cbaModuleContainerFooter` → expect ≥1 match in the `ModuleContainerComponent` template string.

3c. Fallback only if 3b fails: delete the folder `node_modules/@cobranza-apps/ui` (use `vscode-mcp-server` file ops are not available for folder delete; use a single PowerShell `Remove-Item -LiteralPath "node_modules\@cobranza-apps\ui" -Recurse -Force` — this is the ONLY permitted PowerShell use in this plan, and only in this fallback), then re-run `npm install`, then re-run 3b. If 3b still fails, STOP and report to caller.

### Step 4 — Rebuild the demo against the fresh library
4a. Command (single): `npm run build:demo`
- Workdir: project root.
- Expected: exit code 0. `dist/demo/browser/` regenerated.
- If it fails: capture errors, STOP, report to caller.

4b. Verify the demo bundle inlined the fresh library:
- Use `glob` pattern `dist/demo/browser/**/*.mjs` (and `dist/demo/browser/**/*.js` if no `.mjs` files return) to list demo chunks.
- For each returned chunk, `grep` (`limit: 5`) for `cbaModuleContainerFooter` and for `faUpDownLeftRight`.
- Expected: at least one chunk contains both. (The icon import may be minified/mangled; if `faUpDownLeftRight` is not found as a literal, also accept the presence of `cbaModuleContainerFooter` AND the `cba-module-header__action--drag` class string as proof the fresh lib was bundled — the drag button markup is unique to the new template.)
- If none contain the symbols, STOP — the demo did not consume the fresh lib. Re-check Step 3. Report to caller.

### Step 5 — Visual verification (serve + DOM check)
5a. Start the dev server with the `background_process` tool:
- action: `start`
- command: `npm run start:demo`
- workdir: project root
- description: `demo dev server`
- ready: `{ "port": 4200, "timeout": 120000 }`
- Do NOT set `persistent` or `inherit` (defaults; process stops when the session ends).

5b. Once ready, use Playwright MCP tools:
- `playwright_browser_navigate` → url `http://localhost:4200/`
- `playwright_browser_snapshot` (capture the accessibility tree)

5c. Concrete assertions on the snapshot (deterministic; no "looks good" judgments):
1. **Drag button**: at least one element with `aria-label="Arrastrar módulo"` exists. For each visible `nav.cba-module-header__section--actions`, the first button child must carry `aria-label="Arrastrar módulo"` (the built-in drag button is rendered first in the template, before collapse/size/fullscreen/remove).
2. **Footer — expanded cards**: for each expanded module card (workspace rows 1, 3, 5 in `demo-workspace.component.html`, i.e. the cards NOT passing `[isCollapsed]="true"` AND passing a non-null `footerStatus` or non-empty `footerText`), the snapshot must contain a `cba-module-footer` element nested under a `cba-module-container` (the `.cba-module-container__footer` projection slot). Specifically the cards titled "Customer portfolio", "New customer", "Export data", "Payment schedule".
3. **Footer — collapsed cards**: for collapsed cards (rows 2, 4, 6: "Quick actions", "Invoices", "Reports", "Settings"), the `cba-module-footer` element must NOT be present (the `@if (!isCollapsed())` guard removes the footer slot).

5d. Capture evidence:
- `playwright_browser_take_screenshot` → filename `taskA-demo-verify.png`, `type: "png"`, `fullPage: true`. Keep the path; include it in the completion summary.

5e. Collect any console errors:
- `playwright_browser_console_messages` → level `error`. If non-empty, include in the summary (do NOT treat as a hard failure unless assertions 5c fail).

5f. Tear down:
- `background_process` action `stop` on the dev server id obtained in 5a.
- `playwright_browser_close`.

### Step 6 — Fallback debug branch (ONLY if Step 5c assertions fail while Steps 2–4 passed)
This branch is **diagnostic only**. Collect evidence and return to caller. Do NOT modify any source file. Do NOT invent fixes.

6a. Read `dist/demo/browser/index.html` (via `read` tool) and confirm the app root selector is present (proves bootstrap target exists).

6b. Use `glob` `dist/demo/browser/**/*.mjs` (or `*.js`) to find the main/lazy chunk that contains `ModuleContainerComponent`. Use `grep` to locate the `ModuleContainerComponent` template string. Read the surrounding ~30 lines and confirm:
- the `@if (!isCollapsed())` block is compiled present, AND
- the `<ng-content select="[cbaModuleContainerFooter]">` substring is inside the compiled template.

6c. Similarly locate and read the `ModuleHeaderComponent` compiled template; confirm the `cba-module-header__action--drag` button and `faDrag` binding are present.

6d. Read `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts` and confirm the projected `<cba-module-footer cbaModuleContainerFooter ...>` is a **direct child** of `<cba-module-container>` (content projection requires the projected element to be a direct child of the host whose template declares the `<ng-content>`; wrapping it in another element without the `cbaModuleContainerFooter` attribute would break projection). Record the exact nesting.

6e. Read `demo-workspace.component.html` and confirm which cards pass `footerStatus`/`footerText` and which pass `[isCollapsed]="true"`. Cross-check with the snapshot.

6f. Run `playwright_browser_console_messages` (level `warning`) and capture any Angular template/projection warnings.

6g. Compile a report containing: (i) the compiled template snippets from 6b/6c, (ii) the projected DOM nesting from 6d, (iii) the card input matrix from 6e, (iv) console warnings from 6f, (v) the screenshot path from 5d. Return to caller with the explicit statement: "Fresh build verified (Steps 2–4 pass) but rendering still fails; diagnostics attached; caller decision required." Do NOT proceed to any fix.

## 5. Acceptance gate for this task (Task A only)

All of the following must hold before reporting Task A complete:
- Step 1: `npm run build:lib` exit 0.
- Step 2: `dist/fesm2022/cobranza-apps-ui.mjs` contains `faUpDownLeftRight` (≥2 matches) and `cbaModuleContainerFooter` (≥1 template match).
- Step 3: `node_modules/@cobranza-apps/ui/fesm2022/cobranza-apps-ui.mjs` contains the same two symbols.
- Step 4: `npm run build:demo` exit 0; at least one `dist/demo/browser/**/*.{mjs,js}` chunk contains `cbaModuleContainerFooter` (and `cba-module-header__action--drag` if the icon literal was mangled).
- Step 5c: drag-button assertion passes; footer-present assertion passes for the 4 expanded footer cards; footer-absent assertion passes for the 4 collapsed cards.

If Step 6 was triggered, Task A is NOT complete — return the diagnostics and await caller decision.

## 6. Files touched / created

- No source files modified.
- No files created (the screenshot `taskA-demo-verify.png` is the only artifact; it is under the working directory and gitignored as a build/dev artifact — do NOT commit it).
- No documentation updates (this is a build/verify task).

## 7. Completion summary format (implementer must return)

```
TASK A — DONE / BLOCKED
- build:lib: <exit code, dist mjs timestamp>
- dist symbol check: faUpDownLeftRight=<match count>, cbaModuleContainerFooter=<match count>
- npm install: <exit code>
- node_modules symbol check: faUpDownLeftRight=<match count>, cbaModuleContainerFooter=<match count>
- build:demo: <exit code>
- demo bundle symbol check: chunk(s) with symbols = <list>
- visual assertions: drag-button=<pass/fail>, footer-expanded=<pass/fail (list cards)>, footer-collapsed=<pass/fail (list cards)>
- screenshot: <path>
- console errors: <none / summary>
- Step 6 triggered: <no / yes — diagnostics attached>
- NOT done: <explicit list, e.g. "no source changes; no commit; no push">
```
