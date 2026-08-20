<!--
  FILE: 20260820-fix-demo-issues-round3-taskD.md
  PURPOSE: Implementation plan for Task D — Verify demo app uses library tokens/components exclusively.
  SCOPE: Sub-task 1 demo SCSS hard-coded-value audit + replacement,
         Sub-task 2 demo TS import audit (verify only),
         Sub-task 3 demo token-compliance Jest spec + Jest/tsconfig wiring.
  AUDIENCE: Implementer (Junior, 50% restriction), Code Reviewer, Code Simplifier, Architector.
  TODO SOURCE: .agent/todos/20260820/20260820-todo-1.md (section: "Verify demo app uses library tokens/components exclusively").
-->

# Task D — Implementation Plan

## 0. Reference & Constraints

- **TODO source:** `.agent/todos/20260820/20260820-todo-1.md` (section "Verify demo app uses library tokens/components exclusively", lines 109–120).
- **Implementer profile:** JUNIOR developer, 50% restriction. ZERO authority over scope, architecture, or unrelated files. Only minor local latitude (e.g., local var names). Every structural/architectural decision is encoded below; do not deviate. If anything is ambiguous or out of scope, STOP and return the question to the caller.
- **Rules to obey:**
  - `.kilo/rules/tool-selection-priority.md` — prefer `vscode-mcp-server_replace_lines_code` / `vscode-mcp-server_create_file_code` and `Bifrost_*` over `edit`/`bash` for code edits. Reserve `bash` for `git`, `npm`, and the verification greps.
  - `.kilo/rules/gitignore-compliance.md` — read `.gitignore`, run `git status` before commit, never stage `node_modules/`, `dist/`, `.angular/`, `coverage/`, etc.
  - `.kilo/rules/changelog-versioning.md` — NEVER introduce an `[Unreleased]` section. New entries go directly under the existing dated `[0.18.4] — 2026-08-20` header.
  - `.kilo/rules/max-arguments-per-method.md`, `max-depth.md` (≤2), `max-lines-per-file.md` (≤200), `max-lines-per-method.md` (≤50), `prefer-private-members.md`, `no-commented-code.md`, `self-documenting-code.md`, `single-section-boolean-conditions.md` — the new spec file must comply.
  - `AGENTS.md` §Component authoring: host modifiers — not relevant here (no host-binding changes); the demo pill edit is a plain SCSS variable removal + token swap.
- **Branch / version / push restrictions:** This is step 4.1b (Analysis & Planning) ONLY. Do NOT create/switch branches, do NOT bump `package.json`, do NOT run `git push`, do NOT write code. Output = this plan file only. The implementer in step 4.2 will execute the edits.
- **Current branch (verified):** `fix/demo-issues-round3` (already created by Critical Workflow step 2). The implementer reuses this branch; do NOT create a new one.
- **Version (verified):** `package.json` is `0.18.4`; `CHANGELOG.md` has a populated `[0.18.4] — 2026-08-20` header. Do NOT bump the version — this task belongs to the same round.

## 1. Project status & verification (already performed by Architector)

All 12 demo SCSS files and all 14 demo TS files under `projects/demo/src/app/` were read and grep-audited. Results below are verified against the working tree as of 2026-08-20.

### 1.1 Demo SCSS audit results

Grep patterns run: `#[0-9a-fA-F]{3,8}\b`, `\d+(\.\d+)?px`, `\d+(\.\d+)?rem`, `shadow|rgba|hsl`, `(padding|margin|gap).*\d+px`, `\$.*:\s*\d+px`.

| Category | Finding |
| --- | --- |
| Hex colors (`#xxx` / `#xxxxxx`) | **None.** Zero matches across all 12 demo SCSS files. |
| `rem` font-size / spacing literals | **None.** Zero matches. |
| `rgba` / `hsl` / `shadow` literals | **None.** Zero matches. |
| `1px` in `border` / `border-bottom` declarations | 10 matches — **ALLOWED** per TODO explicit exception ("e.g., px in `border: 1px`"). Not flagged. |
| px font-size (`font-size: ...px`) | **None.** All 21 `font-size` declarations already use `var(--cba-font-size-*)` tokens. |
| px **spacing** literals (`padding` / `margin` / `gap` with px) | **1 match:** `projects/demo/src/app/components/demo-pill-matrix/demo-pill-matrix.component.scss` line 5: `$pill-padding: 4px 12px;`. **MUST be replaced** with token equivalents. |
| px **layout dimension** literals (`width` / `min-width` / `max-width` / `min-height` / `grid-template-columns` `minmax(...)`) | 5 matches: `$swatch-min-height: 72px`, `$icon-cell-min-size: 96px`, `$matrix-status-width: 80px` (×2 files), `$section-max-width: 960px`. **ALLOWED to remain** — these are demo-specific layout dimensions, not "colors, font sizes, spacing values, or shadows" per TODO action 1. No `--cba-*` token equivalents exist (spacing tokens top out at `--cba-space-8: 32px`; there are no width/height/layout tokens). Each file already documents them as "Pixel value exposed as a named SCSS constant; the rest use theme tokens." |
| px **border-radius** literal | 1 match: `$pill-border-radius: 999px;` (fully-rounded pill). **ALLOWED to remain** — border-radius is not color/font-size/spacing/shadow. No `--cba-radius-*` token equals a full pill (max `--cba-radius-lg: 14px`). |

**Conclusion:** Exactly ONE SCSS edit is required — the `$pill-padding` spacing literal in `demo-pill-matrix.component.scss`. All other px values are out of the TODO's scope (layout dimensions / radius) and have no token equivalents.

### 1.2 Demo TS import audit results

Grep `import .* from ['"]@cobranza-apps/ui['"]` → 5 matches (all UI component imports resolve to `@cobranza-apps/ui`):
- `demo-icon-grid.component.ts`: `CbaButtonComponent`
- `demo-customer-form.component.ts`: `CbaButtonComponent, CbaInputComponent`
- `demo-workspace.component.ts`: `CbaButtonComponent`
- `demo-table.component.ts`: `CbaBadgeComponent`
- `demo-payment-schedule.component.ts`: `CbaBadgeComponent, CbaBadgeVariant`

All other imports across the 14 demo TS files are from:
- `@angular/core`, `@angular/common`, `@angular/forms` (Angular core — allowed, peer deps).
- `@ng-bootstrap/ng-bootstrap` (1 import: `NgbDateStruct` type in `app.component.ts` — a type-only import, not a UI component; ng-bootstrap is a library peer dep, not an external UI library).
- `@fortawesome/fontawesome-svg-core` and `@fortawesome/free-solid-svg-icons` (icon packs — library peer deps, not UI components).
- Relative `./components/...` / `../demo-.../...` (internal demo modules).

**Conclusion:** Zero external UI libraries (no Angular Material, PrimeNG, ngx-bootstrap, etc.). All UI components come from `@cobranza-apps/ui`. **No TS edits required.** This sub-task is verification-only; the compliance is documented in the new spec via a runtime assertion (see Step 4) so it stays regression-guarded.

### 1.3 Test infrastructure

- `jest.config.js` (18 lines): `testMatch: ['<rootDir>/src/**/*.spec.ts']` — currently EXCLUDES `projects/demo/**`. To make the TODO-mandated `projects/demo/src/app/demo-token-compliance.spec.ts` runnable by `npm test`, `testMatch` MUST be extended.
- `tsconfig.spec.json` (13 lines): `"include": ["src/**/*.spec.ts", "src/**/*.d.ts", "setup-jest.ts"]` — currently EXCLUDES `projects/demo/**`. Must be extended so ts-jest type-checks the new spec.
- `setup-jest.ts` calls `setupZoneTestEnv()` — the new spec does NOT need Angular test environment (it is a pure Node fs/string test), but it will run under the same preset; that is fine.
- Existing pattern for project-file reading: `src/components/testing/project-files.ts` exports `readProjectText(relativePath)` which reads from `process.cwd()` (project root). Reuse it.
- Existing pattern for file-discovery + content assertions: `src/theme/docs-compliance.spec.ts` and `src/theme/consumer-guide.spec.ts`. The new spec follows the same style.
- `package.json` scripts: `test` = `jest --passWithNoTests`. No script change needed.

### 1.4 Feasibility of the compliance test

**Feasible.** Node 22 (engine requirement `^22.22.3`) supports `fs.readdirSync(path, { recursive: true })` for directory traversal. `@types/node` is already a devDependency. The test is a pure string-grep test over file contents — no Angular compilation, no DOM. The regexes are deterministic and match the TODO's explicit exception (`border: 1px`).

**No ambiguities.** The plan encodes every decision (regexes, allowed-vs-flagged categories, file paths, config edits).

## 2. High-level approach

Three independent sub-tasks, executed in TODO order, with a single combined commit at the end of the implementer step (step 4.2 owns the commit):

1. **Sub-task 1 (SCSS audit):** Replace the single spacing literal `$pill-padding: 4px 12px` in `demo-pill-matrix.component.scss` with token-based padding (`var(--cba-space-1) var(--cba-space-3)`). Remove the now-unused `$pill-padding` SCSS variable. No other SCSS file changes.
2. **Sub-task 2 (TS audit):** Verification only — no code change. The import compliance is encoded as a runtime assertion in the new spec (Sub-task 3) so it stays guarded.
3. **Sub-task 3 (compliance test):**
   - Extend `jest.config.js` `testMatch` and `tsconfig.spec.json` `include` to cover `projects/demo/**/*.spec.ts`.
   - Create `projects/demo/src/app/demo-token-compliance.spec.ts` that reads every `*.scss` under `projects/demo/src/app/components/` and asserts: no hex color literals, no px font-size declarations, no px spacing (`padding`/`margin`/`gap`) declarations. Also asserts all UI component imports in demo TS files resolve to `@cobranza-apps/ui` (no external UI library imports).
4. Cross-file verification greps.
5. Build + lint + test.
6. CHANGELOG entry under `[0.18.4] — 2026-08-20`.
7. Single commit (instructions only — implementer executes).

---

## 3. Detailed atomic steps

### Step 1 — Sub-task 1: replace `$pill-padding` spacing literal

#### 1.1 `projects/demo/src/app/components/demo-pill-matrix/demo-pill-matrix.component.scss`

Two edits in this file.

**Edit A — remove the `$pill-padding` variable declaration (line 5).**

Replace lines 4–6 (the three SCSS variable declarations) with two (drop `$pill-padding`).

**Original (exact, lines 4–6):**

```scss
$matrix-status-width: 80px;
$pill-padding: 4px 12px;
$pill-border-radius: 999px;
```

**New (exact):**

```scss
$matrix-status-width: 80px;
$pill-border-radius: 999px;
```

Tool: `vscode-mcp-server_replace_lines_code` with `startLine: 4`, `endLine: 6`, `originalCode` = the original 3-line block, `content` = the new 2-line block.

**Edit B — replace the `padding: $pill-padding;` usage with token-based padding (line 74).**

**Original (exact, lines 70–78):**

```scss
.demo-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--cba-space-1);
  padding: $pill-padding;
  border-radius: $pill-border-radius;
  font-size: var(--cba-font-size-small);
  border: 1px solid transparent;
}
```

**New (exact):**

```scss
.demo-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--cba-space-1);
  padding: var(--cba-space-1) var(--cba-space-3);
  border-radius: $pill-border-radius;
  font-size: var(--cba-font-size-small);
  border: 1px solid transparent;
}
```

Only the `padding` line changes: `$pill-padding` → `var(--cba-space-1) var(--cba-space-3)` (4px = `--cba-space-1`, 12px = `--cba-space-3`). `border-radius: $pill-border-radius;` is intentionally KEPT (999px pill radius has no token equivalent; it is a layout/shape value, out of TODO scope). `border: 1px solid transparent;` is the allowed `1px` border exception.

Tool: `vscode-mcp-server_replace_lines_code` with `startLine: 70`, `endLine: 78`.

**After Edit A, line numbers shift by −1.** The implementer MUST re-read the file (or compute the shifted range: original line 74 → new line 73; the `.demo-pill` block originally at lines 70–78 moves to 69–77). To avoid line-number drift errors, the implementer MUST perform Edit A first, then re-read the file to confirm the `.demo-pill` block's new line range, then perform Edit B using the confirmed range. The `originalCode` match string in `vscode-mcp-server_replace_lines_code` protects against wrong-line mistakes (the tool fails if the original block does not match exactly).

No other demo SCSS file is edited.

### Step 2 — Sub-task 2: demo TS import audit (verify only, NO code change)

The Architector's audit (§1.2) confirmed every UI component import resolves to `@cobranza-apps/ui` and no external UI library is imported. The implementer re-runs this grep to confirm no drift was introduced by earlier tasks in the round:

```
grep -rn "import .* from ['\"]@cobranza-apps/ui['\"]" projects/demo/src/app
```

Expected: exactly 5 matches (the files listed in §1.2). Then:

```
grep -rnE "from ['\"]@(angular/material|primeng|ngx-bootstrap|ng-zorro|ng2|@ng-bootstrap/ng-bootstrap)['\"]" projects/demo/src/app
```

Expected: at most 1 match — the `NgbDateStruct` type import in `app.component.ts` (a type-only peer-dep import, not a UI component). If any OTHER match appears (e.g., a real component import from an external UI lib), STOP and return the question to the caller — do NOT edit TS files unilaterally.

No TS file is modified in this task.

### Step 3 — Sub-task 3: Jest + tsconfig wiring for demo specs

#### 3.1 `jest.config.js` — extend `testMatch`

Replace line 16.

**Original (exact, line 16):**

```js
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
```

**New (exact):**

```js
  testMatch: ['<rootDir>/src/**/*.spec.ts', '<rootDir>/projects/demo/**/*.spec.ts'],
```

Tool: `vscode-mcp-server_replace_lines_code` with `startLine: 16`, `endLine: 16`. This is the ONLY change to `jest.config.js`. Do NOT change `setupFilesAfterEnv`, `modulePathIgnorePatterns`, or the preset spread.

#### 3.2 `tsconfig.spec.json` — extend `include`

Replace line 12.

**Original (exact, line 12):**

```json
  "include": ["src/**/*.spec.ts", "src/**/*.d.ts", "setup-jest.ts"]
```

**New (exact):**

```json
  "include": ["src/**/*.spec.ts", "src/**/*.d.ts", "setup-jest.ts", "projects/demo/**/*.spec.ts"]
```

Tool: `vscode-mcp-server_replace_lines_code` with `startLine: 12`, `endLine: 12`. Do NOT change `compilerOptions`, `extends`, or any other field.

### Step 4 — Sub-task 3: create the compliance spec

Create a NEW file: `projects/demo/src/app/demo-token-compliance.spec.ts`.

This file MUST stay under the 200-line limit and comply with all `.kilo/rules/*` (max-depth ≤2, max-args ≤2, methods ≤50 lines, private-by-default, self-documenting names, single-section boolean conditions, no commented code).

Use `vscode-mcp-server_create_file_code` with `path: "projects/demo/src/app/demo-token-compliance.spec.ts"`, `overwrite: false`.

**Full file content (exact — 94 lines):**

```ts
/**
 * @file demo-token-compliance.spec.ts — Guards that the demo app consumes only
 *   `@cobranza-apps/ui` tokens and components: no hard-coded hex colors, no px
 *   font-size declarations, no px spacing (padding/margin/gap) declarations, and
 *   no UI component imports from external UI libraries.
 *
 * Allowed px: `1px` borders (and any `border` / `border-bottom` 1px usage),
 * plus demo-specific layout dimensions (width/min-width/max-width/min-height/
 * grid minmax) and border-radius — these have no `--cba-*` token equivalents.
 *
 * Run: `npm test -- projects/demo/src/app/demo-token-compliance.spec.ts`
 *
 * Authoritative sources:
 * - Design tokens: {@link file:///src/theme/_variables.scss}
 * - Brief: {@link file:///.agent/project-info/brief.md} §5
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const DEMO_APP_DIR = resolve(process.cwd(), 'projects/demo/src/app');
const DEMO_SCSS_DIR = join(DEMO_APP_DIR, 'components');

/** Absolute paths of every `*.scss` file under the demo components directory. */
function readDemoScssFiles(): string[] {
  return readdirSync(DEMO_SCSS_DIR, { recursive: true })
    .filter((entry): entry is string => typeof entry === 'string')
    .filter((entry) => entry.endsWith('.scss'))
    .map((entry) => join(DEMO_SCSS_DIR, entry));
}

/** Absolute paths of every `*.ts` file under the demo app directory. */
function readDemoTsFiles(): string[] {
  return readdirSync(DEMO_APP_DIR, { recursive: true })
    .filter((entry): entry is string => typeof entry === 'string')
    .filter((entry) => entry.endsWith('.ts'))
    .map((entry) => join(DEMO_APP_DIR, entry));
}

describe('demo app token compliance', () => {
  const scssFiles = readDemoScssFiles();

  it('discovers at least one demo SCSS file to audit', () => {
    expect(scssFiles.length).toBeGreaterThan(0);
  });

  for (const file of scssFiles) {
    const relPath = relative(process.cwd(), file);
    const source = readFileSync(file, 'utf8');

    it(`${relPath} has no hard-coded hex color literals`, () => {
      const hexColorPattern = /#[0-9a-fA-F]{3,8}\b/;
      expect(hexColorPattern.test(source)).toBe(false);
    });

    it(`${relPath} has no px font-size declarations`, () => {
      const pxFontSizePattern = /font-size\s*:[^;}]*\d+px/i;
      expect(pxFontSizePattern.test(source)).toBe(false);
    });

    it(`${relPath} has no px spacing declarations (padding/margin/gap)`, () => {
      const pxSpacingPattern = /(padding|margin|gap)\s*:[^;}]*\d+px/i;
      expect(pxSpacingPattern.test(source)).toBe(false);
    });
  }

  describe('demo TS imports resolve UI components from @cobranza-apps/ui only', () => {
    const tsFiles = readDemoTsFiles();
    const externalUiLibPattern = /from\s+['"]@(angular\/material|primeng|ngx-bootstrap|ng-zorro|ng2)[^'"]*['"]/;

    for (const file of tsFiles) {
      const relPath = relative(process.cwd(), file);
      const source = readFileSync(file, 'utf8');

      it(`${relPath} imports no external UI library`, () => {
        expect(externalUiLibPattern.test(source)).toBe(false);
      });
    }
  });
});
```

**Design notes (encoded for the implementer — do NOT deviate):**

1. **Regex scope is deterministic and matches the TODO exception.**
   - Hex: `#[0-9a-fA-F]{3,8}\b` flags any hex color literal.
   - px font-size: `font-size\s*:[^;}]*\d+px` flags `font-size: 14px` etc. (case-insensitive). Does NOT match `font-size: var(--cba-font-size-body)`.
   - px spacing: `(padding|margin|gap)\s*:[^;}]*\d+px` flags `padding: 4px 12px`, `margin: 8px`, `gap: 4px`. Does NOT match `border: 1px solid ...` (no padding/margin/gap keyword), does NOT match `$pill-border-radius: 999px` (no spacing keyword), does NOT match `$section-max-width: 960px` / `$swatch-min-height: 72px` / `$icon-cell-min-size: 96px` / `$matrix-status-width: 80px` (no spacing keyword). The `$pill-padding: 4px 12px` line IS matched (the substring `padding:` appears in `$pill-padding:`) — which is why Step 1 removes it first.
2. **Allowed px that the regex correctly does NOT flag:** all 10 `border: 1px` / `border-bottom: 1px` occurrences (no spacing keyword on those lines), all 5 layout-dimension constants, the 999px border-radius.
3. **External-UI-library regex** excludes `@ng-bootstrap/ng-bootstrap` (a peer-dep used for a type-only import and for the library's own ng-bootstrap wrappers) and `@fortawesome/*` (icon peer deps). It flags Angular Material / PrimeNG / ngx-bootstrap / ng-zorro / ng2 — none of which are present. This matches the TODO intent ("No external UI libraries") while not false-flagging allowed peer-dep type imports.
4. **`recursive: true` on `readdirSync`** requires Node ≥18.17; the project requires Node `^22.22.3`, so it is supported.
5. **`filter((entry): entry is string => typeof entry === 'string')`** — `readdirSync(recursive)` returns `string[]` in Node 22, but the type guard keeps the call robust across `Buffer`/`Dirent` union typings in some `@types/node` versions.
6. **Method line counts:** `readDemoScssFiles` (6 lines), `readDemoTsFiles` (6 lines) — well under 50. File is 94 lines — under 200.
7. **Max-depth:** the `for` loops are depth-1 inside `describe`; the `it` callbacks are depth-2 (the `expect` is inside `it`). No depth-3 nesting.
8. **Max-args:** both helpers take zero params; the regex tests take none. Compliant.

### Step 5 — Cross-file verification greps (implementer, after edits)

Run each command separately. Stop and report on any unexpected match.

```
grep -rnE "#[0-9a-fA-F]{3,8}\b" projects/demo/src/app/components --include="*.scss"
```
Expected: zero matches.

```
grep -rnE "font-size\s*:[^;}]*[0-9]+px" projects/demo/src/app/components --include="*.scss"
```
Expected: zero matches.

```
grep -rnE "(padding|margin|gap)\s*:[^;}]*[0-9]+px" projects/demo/src/app/components --include="*.scss"
```
Expected: zero matches (the `$pill-padding: 4px 12px;` line must be gone after Step 1).

```
grep -rn "\$pill-padding" projects/demo/src/app/components/demo-pill-matrix/demo-pill-matrix.component.scss
```
Expected: zero matches (the variable declaration AND its usage are both removed/replaced).

```
grep -rnE "from ['\"]@(angular/material|primeng|ngx-bootstrap|ng-zorro|ng2)" projects/demo/src/app --include="*.ts"
```
Expected: zero matches.

If any grep returns an unexpected match, STOP and return the question to the caller — do NOT patch files unilaterally beyond the edits in Steps 1–4.

### Step 6 — Build, lint, test (implementer, after edits & verification)

Run each command separately (no chaining, per `tool-selection-priority.md`). Stop and report on first failure.

1. `npm run build:lib`
2. `npm run build:demo`
3. `npm run lint`
4. `npm run test`

Acceptance gates (Task D subset of TODO §Acceptance):
- `npm run test` passes with zero failures — INCLUDING the new `demo-token-compliance.spec.ts` suite. Verify the new suite ran: `npm test -- projects/demo/src/app/demo-token-compliance.spec.ts` should report `demo app token compliance` describe block with one `it` per SCSS file (3 assertions × 12 files = 36) plus one per TS file (14) plus the discovery `it` = 51 `it`s total. If the suite does not appear in the test run, the `jest.config.js` / `tsconfig.spec.json` wiring in Step 3 failed — re-check those edits.
- `npm run build:lib` passes with zero errors.
- `npm run build:demo` passes with zero errors.
- `npm run lint` passes with zero errors. (Note: `lint` script is `eslint "src/**/*.ts"` — it does NOT lint `projects/demo/**`. The new spec is NOT linted by `npm run lint`. This is acceptable and matches the existing project configuration; do NOT expand the lint glob in this task.)

If `npm run test` fails on the new suite, inspect which file/regex failed. The most likely failure is a residual spacing literal the Architector's audit did not catch. If a real hard-coded spacing/font-size/hex value is found in a demo SCSS file, replace it with the matching `--cba-*` token (this is the ONLY bounded judgment call permitted, constrained to a token swap from `src/theme/_variables.scss`). If the value has no token equivalent (e.g., a layout width), STOP and return the question to the caller — the test's regex scope may need adjustment, which is an architectural decision.

### Step 7 — CHANGELOG entry

Add an `### Added` section under the existing `[0.18.4] — 2026-08-20` header, and a `### Fixed` bullet for the pill padding. Insert the `### Added` section BEFORE the existing `### Changed` section (Keep a Changelog category order: Added → Changed → Deprecated → Removed → Fixed → Security). The existing `### Fixed` section already exists; append one bullet to it.

**Edit — insert `### Added` block before `### Changed` (line 35).**

Replace lines 33–35.

**Original (exact, lines 33–35):**

```markdown
## [0.18.4] — 2026-08-20

### Changed
```

**New (exact):**

```markdown
## [0.18.4] — 2026-08-20

### Added

- Demo app token-compliance regression test `projects/demo/src/app/demo-token-compliance.spec.ts`: asserts no demo SCSS file contains hard-coded hex colors, px font-size, or px spacing (padding/margin/gap) declarations, and no demo TS file imports an external UI library. Jest `testMatch` and `tsconfig.spec.json` `include` extended to cover `projects/demo/**/*.spec.ts`.

### Changed
```

**Edit — append a Fixed bullet for the pill padding.**

The existing `### Fixed` section (lines 41–44 after the first edit shifts everything; re-read the file to confirm) ends with the "Added Cancel button ..." bullet. Append one new bullet immediately after that bullet (before the blank line that separates `### Fixed` from the next version header).

**New bullet (exact text to append):**

```markdown
- Demo pill matrix no longer hard-codes padding: `$pill-padding: 4px 12px` replaced with `padding: var(--cba-space-1) var(--cba-space-3)`. See `projects/demo/src/app/components/demo-pill-matrix/demo-pill-matrix.component.scss`.
```

Tool: use `vscode-mcp-server_replace_lines_code` on the existing last Fixed bullet block (re-read to get exact line numbers after the first edit), replacing it with the same bullet + the new bullet. Do NOT delete or reorder the existing Fixed bullets.

Compliance check (implementer MUST verify before commit):
- NO `[Unreleased]` section is introduced.
- The new entries live directly under the existing dated `[0.18.4] — 2026-08-20` header.
- `package.json` version is NOT bumped.

### Step 8 — Git commit (implementer; single commit)

Before commit:
- Read `.gitignore`.
- Run `git status`.
- Confirm `node_modules/`, `dist/`, `.angular/`, `coverage/`, `.vscode/`, `.idea/`, `*.tsbuildinfo`, `.eslintcache`, `.kilo/agent-manager.json`, `.agent/.logs/` and any other gitignored paths are NOT staged. Unstage if found.
- Confirm only the files listed in §4 "Files affected" are staged.

Stage exactly these files (relative to repo root `C:\projects\cobranza-app\front\ui`):

```
projects/demo/src/app/components/demo-pill-matrix/demo-pill-matrix.component.scss
projects/demo/src/app/demo-token-compliance.spec.ts
jest.config.js
tsconfig.spec.json
CHANGELOG.md
```

Commit message (single line, conventional-commits style matching repo history):

```
test(demo): token-compliance spec + replace hard-coded pill padding (v0.18.4)
```

Do NOT push. Push is restricted to Critical Workflow step 5.

## 4. Files affected summary

| File | Change type | Sub-task |
| --- | --- | --- |
| `projects/demo/src/app/components/demo-pill-matrix/demo-pill-matrix.component.scss` | Modify (remove `$pill-padding` var; replace `padding` usage with tokens) | 1 |
| `projects/demo/src/app/demo-token-compliance.spec.ts` | New file (compliance spec) | 3 |
| `jest.config.js` | Modify (extend `testMatch`) | 3 |
| `tsconfig.spec.json` | Modify (extend `include`) | 3 |
| `CHANGELOG.md` | Modify (add `### Added` block + one `### Fixed` bullet under `[0.18.4]`) | 7 |

No TypeScript component files. No library `src/` files. No `package.json` (version stays 0.18.4). No other demo SCSS files. No docs files (the TODO does not require docs updates for this task; the compliance is enforced by the test, not by prose).

## 5. Acceptance criteria mapping (Task D subset of TODO §Acceptance)

| TODO criterion | Verified by |
| --- | --- |
| "Demo app contains no hard-coded colors, font sizes, or spacing values." | Step 1 (removes the one spacing literal) + Step 4 compliance spec (regression guard) + Step 5 greps. |
| `npm run test` passes with zero failures. | Step 6.4 (must include the new `demo app token compliance` suite). |
| `npm run build:lib` passes with zero errors. | Step 6.1. |
| `npm run build:demo` passes with zero errors. | Step 6.2 (the new spec is not part of the Angular demo build; it only affects Jest). |
| `npm run lint` passes with zero errors. | Step 6.3. |
| No `[Unreleased]` section introduced in `CHANGELOG.md`. | Step 7 compliance check. |

## 6. Out of scope (do NOT touch)

- Any library `src/` file (`src/components/**`, `src/theme/**`, `src/directives/**`, `src/public-api.ts`). Task D is demo-only + test wiring.
- Any demo component TypeScript file (`*.component.ts`) — the TS audit is verification only; no TS edits.
- Any demo SCSS file other than `demo-pill-matrix.component.scss` — the audit found no other in-scope violations.
- The allowed px layout-dimension constants (`$swatch-min-height`, `$icon-cell-min-size`, `$matrix-status-width` ×2, `$section-max-width`) and `$pill-border-radius: 999px` — these are NOT spacing/font-size/color and have no token equivalents. Do NOT replace them. Do NOT add new tokens for them (token creation is an architectural decision owned by the caller).
- The `NgbDateStruct` type import from `@ng-bootstrap/ng-bootstrap` in `app.component.ts` — it is a peer-dep type import, not an external UI component. Do NOT remove it.
- `package.json` version bump (owned by Critical Workflow step 3; already at 0.18.4).
- Branch creation/switch, `git push` (owned by steps 2 and 5).
- Expanding the `npm run lint` glob to cover `projects/demo/**` — out of scope; the lint script stays `eslint "src/**/*.ts"`.
- Any docs file (`docs/*.md`, `.agent/project-info/*.md`) — the TODO does not require docs for this task. The compliance is enforced by the test.

## 7. Risk notes for the implementer

1. **Line-number drift between Edit A and Edit B in Step 1.** Edit A removes one line, so the `.demo-pill` block shifts up by one. The implementer MUST re-read the file after Edit A and use the confirmed line range for Edit B. The `originalCode` match in `vscode-mcp-server_replace_lines_code` will fail safely if the wrong range is supplied — do NOT bypass it by switching to a non-validating tool.
2. **The compliance spec will FAIL if Step 1 is skipped or incomplete.** The regex `(padding|margin|gap)\s*:[^;}]*\d+px` matches `$pill-padding: 4px 12px;` (the `padding:` substring inside `$pill-padding:`). Step 1 removes both the declaration and the usage. If `npm run test` fails on `demo-pill-matrix.component.scss` → "has no px spacing declarations", re-check that both Edit A and Edit B were applied.
3. **`readdirSync(recursive)` typing.** Some `@types/node` versions type the recursive return as `(string | Buffer)[]` or `(string | Dirent)[]`. The `typeof entry === 'string'` filter + type predicate handles this. Do NOT remove the type guard to "simplify" — it is what keeps the call type-safe across versions.
4. **Jest preset ts-jest config.** `jest-preset-angular`'s `createCjsPreset()` defaults to `tsconfig.spec.json`. Adding `projects/demo/**/*.spec.ts` to its `include` ensures the new spec is type-checked under the same `commonjs`/`ES2016` module settings. If `npm run test` reports a TypeScript error on the new spec (e.g., "Cannot find module 'node:fs'"), confirm `@types/node` is installed (it is, `^22.0.0`) and that `tsconfig.spec.json` `compilerOptions.types` includes `"node"` (it does).
5. **`npm run lint` does NOT cover the new spec.** This is intentional and matches existing project behavior (`lint` globs `src/**/*.ts` only). Do NOT expand the lint glob. The spec is still type-checked by ts-jest during `npm test`.
6. **CHANGELOG edit ordering.** Insert `### Added` BEFORE the existing `### Changed` (Keep a Changelog category order). Re-read the file after the first CHANGELOG edit to get the exact line numbers for the second edit (the `### Fixed` append), because the first edit shifts all subsequent lines.

## 8. Plan vs. original task verification (Architector self-check)

- TODO action 1 "Audit demo SCSS files: Search for hard-coded colors, font sizes, spacing values, or shadows in `projects/demo/src/app/components/**/*.scss`. Replace any found with `--cba-*` token equivalents." → Covered by Step 1 (the single in-scope spacing literal `$pill-padding` is replaced with `--cba-space-1`/`--cba-space-3`). The audit (§1.1) verified zero hex colors, zero px/rem font sizes, zero shadows, zero rgba/hsl, and that all remaining px values are out-of-scope layout dimensions / radius with no token equivalents. ✅
- TODO action 2 "Audit demo TS files: Verify all imported components come from `@cobranza-apps/ui`. No external UI libraries." → Covered by §1.2 audit (5 UI imports all from `@cobranza-apps/ui`; no external UI library imports) + Step 2 re-verification grep + Step 4 runtime assertion in the compliance spec (regression guard). No TS edits required. ✅
- TODO action 3 "Add a test (if feasible): Create `projects/demo/src/app/demo-token-compliance.spec.ts` that reads all demo SCSS files and asserts no hex colors, px font sizes, or px spacing values exist (except where explicitly allowed, e.g., px in `border: 1px`)." → Covered by Step 3 (Jest + tsconfig wiring so the spec actually runs) + Step 4 (the spec file with the three regex assertions + the TS import assertion). Feasibility confirmed in §1.4. The regexes precisely honor the `border: 1px` exception and do not false-flag allowed layout-dimension/radius px. ✅
- TODO §Acceptance "Demo app contains no hard-coded colors, font sizes, or spacing values." → Covered by Step 1 + Step 4 + Step 5. ✅
- TODO §Acceptance `npm run test` / `build:lib` / `build:demo` / `lint` pass → Covered by Step 6. ✅
- Changelog versioning rule → Step 7 adds entries under the existing dated header; no `[Unreleased]` introduced. ✅
- No other TODO sections are touched (rebuild/dist, failing tests, form overflow, input styling, cancel button, typography belong to other tasks). ✅
- Plan is fully deterministic for a JUNIOR developer under 50% restriction: every edit is given as exact original → exact new, with file path, line range, and tool. The only bounded judgment call is a token-swap for any residual hard-coded spacing/font-size/hex value the audit missed — and that is constrained to a `--cba-*` substitution from `_variables.scss`, with a STOP-and-escalate path for token-less values. ✅

Plan is complete and ready for the implementer (step 4.2).
