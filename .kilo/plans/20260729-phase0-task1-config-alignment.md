# Per-Task Plan — Phase 0, Task 1: Library Configuration Alignment

> **Date:** 2026-07-29
> **TODO:** `.agent/todos/20260729/20260729-todo-1.md` (Tasks 1, 2, 3, 5, 6)
> **Global plan:** `.kilo/plans/20260729-phase0-library-scaffolding.md`
> **Branch:** `feat/phase0-library-scaffolding`
> **Target step:** 4.2 Implementation (this plan is consumed by the implementer)
> **Auto-approved:** user selected "Approve Global and Tasks Plans".

---

## 1. Scope

This task covers TODO Tasks **1, 2, 3, 5, 6** only:

- **Task 1** — Confirm Angular 22 publishable library shape (ng-packagr, standalone, prefix `cba`).
- **Task 2** — Align `peerDependencies` in `package.json` with the TODO spec.
- **Task 3** — Verify all runtime dependencies are installed; refresh lockfile.
- **Task 5** — Confirm the public API entry point is minimal and exports nothing unwanted.
- **Task 6** — Add TypeScript path mapping for `@cobranza-apps/ui`.

**Out of scope** (handled by other tasks): Task 4 (theme SCSS skeleton), Task 7 (clean-up & build verification), Step 5 (TODO file rename/merge).

---

## 2. Findings from Analysis (Current State)

| Artifact | Status | Notes |
| --- | --- | --- |
| `package.json` name | OK | `@cobranza-apps/ui` |
| Angular version | OK | `^22.0.0` peers / `^22.0.8` dev |
| Build system | OK | `ng-packagr -p ng-package.json -c tsconfig.lib.json` |
| `ng-package.json` | OK | entry `src/lib/public-api.ts`, dest `./dist` |
| Standalone / no NgModules | OK | no `.module.ts` files exist in `src/` |
| Selector prefix `cba` | OK (convention) | No `angular.json`; prefix is enforced by convention at component-creation time in later phases. No file to edit now. |
| `peerDependencies` | GAP | Missing `@fortawesome/fontawesome-svg-core`; `free-solid/regular-svg-icons` ranges are `^7.3.0` instead of `^6.0.0 || ^7.0.0`. |
| Runtime deps installed | OK | All 7 required packages already present in `devDependencies`. |
| `src/lib/public-api.ts` | OK | Contains `export {};` — exports nothing. Detailed JSDoc guides future exports. No demo component exported. |
| Component placeholder barrels | OK | 8 `index.ts` files, each `export {};` with barrel guidance comments. Not imported by public-api, so no leakage. No CLI demo components to remove. |
| `tsconfig.json` path mapping | GAP | No `paths` block; `baseUrl: "./"` already present. |

---

## 3. Technical & Architecture Decisions

### 3.1 Peer dependency ranges (`^6.0.0 || ^7.0.0`)

- The TODO spec mandates `^6.0.0 || ^7.0.0` for the three Font Awesome packages (`fontawesome-svg-core`, `free-solid-svg-icons`, `free-regular-svg-icons`).
- Rationale: allow consumers to use either Font Awesome 6 or 7 (the library uses only stable, version-agnostic APIs from `angular-fontawesome`). The dev environment pins 7.x for the latest features, but the peer range keeps the published library broadly compatible.
- `@fortawesome/fontawesome-svg-core` must be added as a peer because `angular-fontawesome` re-exports types/constants from it that consumers may need for icon definitions.
- `angular-fontawesome` peer stays `^5.0.0` (per TODO), dev `^5.1.0`.
- Angular peers stay `^22.0.0`; `bootstrap` `^5.3.0`; `@ng-bootstrap/ng-bootstrap` `^21.0.0`. These already match — do not touch.
- devDependencies are NOT changed: they correctly pin the concrete 7.x versions used for building/testing.

### 3.2 Path mapping strategy

- Add to the **base** `tsconfig.json` (extended by both `tsconfig.lib.json` and `tsconfig.spec.json`).
- Map `"@cobranza-apps/ui"` → `["src/lib/public-api.ts"]`.
- Rationale: the repo *is* the library, so a single path to the ng-packagr entry file is sufficient for local dev/test imports. `baseUrl: "./"` already exists, so `paths` resolves relative to the repo root.
- ng-packagr's own build uses `ng-package.json`'s `entryFile` and is unaffected: the entry file does not self-import `@cobranza-apps/ui`, so there is no circular-resolution risk during the publishable build.
- Path mapping enables future spec files / consuming code to `import { ... } from '@cobranza-apps/ui'` during development.

### 3.3 Public API entry point

- Entry file location is `src/lib/public-api.ts` (NOT `src/public-api.ts`). The TODO says "usually `src/public-api.ts`" — flexible wording. The existing `ng-package.json` and `.agent/project-structure.md` both codify `src/lib/public-api.ts`. Do **not** move it; moving would break ng-package.json, the structure doc, and git history churn.
- The existing JSDoc comment is **superior** to the TODO's minimal example (it documents the barrel/export contract for AI agents and future contributors). The TODO's "Example:" is illustrative, not prescriptive. Per the **Preserve Existing Code** and **Self-Documenting Code** rules, **keep the existing comment unchanged**. The "keep it minimal" requirement refers to the *export surface*, which is already minimal (`export {};`).
- No demo/placeholder component is exported. No action required on this file beyond verification.

### 3.4 Dependency install

- All required packages are already in `devDependencies`. No new `npm install <pkg>` needed.
- Run `npm install` once (after `package.json` edit) to ensure the lockfile is consistent with the (unchanged) dep set and to surface any drift. If `npm install` reports no changes, no lockfile modification occurs — that is acceptable.

---

## 4. Implementation Steps (atomic, ordered)

> Each step ends with its own verification (✅) so the implementer can self-check before committing.

### Step 4.1 — Edit `peerDependencies` in `package.json`

**File:** `C:\projects\cobranza-app\front\ui\package.json`

**Action:** Replace the `peerDependencies` block (lines 20–29) with the TODO-aligned version.

**Old (current):**
```json
  "peerDependencies": {
    "@angular/common": "^22.0.0",
    "@angular/core": "^22.0.0",
    "@angular/forms": "^22.0.0",
    "@fortawesome/angular-fontawesome": "^5.0.0",
    "@fortawesome/free-regular-svg-icons": "^7.3.0",
    "@fortawesome/free-solid-svg-icons": "^7.3.0",
    "@ng-bootstrap/ng-bootstrap": "^21.0.0",
    "bootstrap": "^5.3.0"
  },
```

**New:**
```json
  "peerDependencies": {
    "@angular/common": "^22.0.0",
    "@angular/core": "^22.0.0",
    "@angular/forms": "^22.0.0",
    "@fortawesome/angular-fontawesome": "^5.0.0",
    "@fortawesome/fontawesome-svg-core": "^6.0.0 || ^7.0.0",
    "@fortawesome/free-regular-svg-icons": "^6.0.0 || ^7.0.0",
    "@fortawesome/free-solid-svg-icons": "^6.0.0 || ^7.0.0",
    "@ng-bootstrap/ng-bootstrap": "^21.0.0",
    "bootstrap": "^5.3.0"
  },
```

**Changes:**
1. Insert `"@fortawesome/fontawesome-svg-core": "^6.0.0 || ^7.0.0",` (new line, alphabetically between `angular-fontawesome` and `free-regular-svg-icons`).
2. Change `"@fortawesome/free-regular-svg-icons": "^7.3.0"` → `"^6.0.0 || ^7.0.0"`.
3. Change `"@fortawesome/free-solid-svg-icons": "^7.3.0"` → `"^6.0.0 || ^7.0.0"`.
4. Keep alphabetical key order (already alphabetical; the inserted `fontawesome-svg-core` maintains it).

✅ **Verify:** Open `package.json`; confirm the `peerDependencies` block is byte-identical to the "New" block above and JSON is valid (no trailing commas).

---

### Step 4.2 — Add TypeScript path mapping in `tsconfig.json`

**File:** `C:\projects\cobranza-app\front\ui\tsconfig.json`

**Action:** Add a `paths` entry inside `compilerOptions`, immediately after `baseUrl`.

**Old (lines 6–8):**
```json
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
```

**New:**
```json
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@cobranza-apps/ui": ["src/lib/public-api.ts"]
    },
    "outDir": "./dist/out-tsc",
```

**Notes:**
- `baseUrl: "./"` is already present and required for `paths` to resolve. Do not add it again.
- Place `paths` directly under `baseUrl` for readability.
- Do not modify `tsconfig.lib.json` or `tsconfig.spec.json` — they extend the base and inherit `paths`.

✅ **Verify:** Confirm `tsconfig.json` is valid JSON and `paths` maps `@cobranza-apps/ui` to `["src/lib/public-api.ts"]`.

---

### Step 4.3 — Verify `src/lib/public-api.ts` (no edit unless needed)

**File:** `C:\projects\cobranza-app\front\ui\src\lib\public-api.ts`

**Action:** Read-only verification. Do NOT modify.

**Checklist:**
1. File contains exactly `export {};` as its export statement.
2. No component, directive, or service is imported/exported.
3. No demo/CLI-generated component is referenced.

**Expected result:** All three pass. No changes needed.

✅ **Verify:** File unchanged; `git status` shows no modification for this file.

> **If** (defensive, not expected) the file is found to export anything beyond `export {};`, remove the stray exports and leave only `export {};` plus the existing comment. Do not alter the comment.

---

### Step 4.4 — Verify all runtime dependencies are installed

**Action:** Confirm the 7 required packages exist in `devDependencies` of `package.json` (they already do).

**Expected `devDependencies` entries (already present):**
```json
"@fortawesome/angular-fontawesome": "^5.1.0",
"@fortawesome/fontawesome-svg-core": "^7.3.0",
"@fortawesome/free-regular-svg-icons": "^7.3.1",
"@fortawesome/free-solid-svg-icons": "^7.3.1",
"@ng-bootstrap/ng-bootstrap": "^21.0.0",
"bootstrap": "^5.3.8",
```
Plus the Angular framework packages (`@angular/common`, `@angular/core`, `@angular/forms` at `^22.0.8`).

✅ **Verify:** All 7 packages present. No `npm install <pkg>` command required.

---

### Step 4.5 — Refresh lockfile & install

**Command (run in repo root `C:\projects\cobranza-app\front\ui`):**
```bash
npm install
```

**Purpose:**
- Ensure `package-lock.json` is consistent with the edited `peerDependencies`.
- Peer dep range edits (widening from `^7.3.0` to `^6.0.0 || ^7.0.0`) do not change the installed dev versions, so `node_modules/` should remain stable. If `npm install` reports "up to date", that is the expected/successful outcome.

✅ **Verify:**
- `npm install` exits 0.
- Run `npm ls @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons` — confirm each resolves without `UNMET` errors.
- `git status` — if `package-lock.json` changed, it will be staged in the commit below.

---

### Step 4.6 — Sanity build & test

**Commands (run in repo root):**
```bash
npm run build
```
```bash
npm test
```

**Purpose:**
- Confirm the `tsconfig.json` `paths` addition did not break the ng-packagr build.
- Confirm tests still pass (no spec files exist yet, so `--passWithNoTests` should yield 0 tests, exit 0).

✅ **Verify:**
- `npm run build` finishes with no errors; `dist/` is produced.
- `npm test` exits 0 (`No tests found` is acceptable).

---

### Step 4.7 — Gitignore compliance check before commit

**Per `.kilo/rules/gitignore-compliance.md`:**
1. Read `.gitignore`.
2. Run `git status`.
3. Ensure no `.gitignore`-matching files (e.g., `node_modules/`, `dist/`) are staged. Unstage if found.

✅ **Verify:** `git status` shows only intended files (`package.json`, `tsconfig.json`, `package-lock.json` if changed) staged; no `node_modules/` or `dist/`.

---

### Step 4.8 — Commit

**Files to stage:**
- `package.json`
- `tsconfig.json`
- `package-lock.json` (only if changed by `npm install`)

Do **not** stage `node_modules/`, `dist/`, or any auto-generated artifacts.

**Commit message (single commit for Task 1 config alignment):**
```
chore(lib): align peer deps and add @cobranza-apps/ui path mapping

- Add @fortawesome/fontawesome-svg-core to peerDependencies
- Widen free-solid/regular-svg-icons peer range to ^6.0.0 || ^7.0.0
- Add TypeScript path mapping @cobranza-apps/ui -> src/lib/public-api.ts
```

✅ **Verify:** `git log -1 --stat` shows exactly the intended files in this commit.

---

## 5. Files Touched (summary)

| File | Change |
| --- | --- |
| `package.json` | Edit `peerDependencies` (add 1 line, change 2 ranges). |
| `tsconfig.json` | Add `paths` block (3 inserted lines). |
| `package-lock.json` | Possibly unchanged; include if `npm install` modified it. |
| `src/lib/public-api.ts` | No change (verified only). |
| `ng-package.json` | No change. |
| `tsconfig.lib.json` / `tsconfig.spec.json` | No change (inherit base). |

---

## 6. Verification Checklist (for 4.5 Verification step)

- [ ] `package.json` `peerDependencies` matches the TODO spec exactly (9 entries, FA ranges `^6.0.0 || ^7.0.0`).
- [ ] `@fortawesome/fontawesome-svg-core` present in `peerDependencies`.
- [ ] `tsconfig.json` `compilerOptions.paths` maps `@cobranza-apps/ui` to `["src/lib/public-api.ts"]`.
- [ ] `src/lib/public-api.ts` exports only `export {};` (nothing unwanted).
- [ ] All 7 required runtime packages present in `devDependencies`.
- [ ] `npm install` exits 0; no `UNMET` peer dependency errors.
- [ ] `npm run build` succeeds; `dist/` produced.
- [ ] `npm test` exits 0.
- [ ] No `.gitignore`-matching files staged.
- [ ] Commit message is meaningful and scoped.

---

## 7. Risks / Notes for Implementer

- **Do not** move `public-api.ts` from `src/lib/` to `src/`. The TODO path wording is illustrative; the canonical entry is `src/lib/public-api.ts` per `ng-package.json` and `.agent/project-structure.md`.
- **Do not** downgrade the `public-api.ts` JSDoc to the TODO's minimal example. The existing comment is more valuable and already satisfies "keep the API surface minimal".
- **Do not** edit `devDependencies` versions — they correctly pin concrete 7.x build versions.
- **Do not** create the theme SCSS files — that is Task 2 scope (TODO Task 4).
- **Do not** run the build clean-up / dist inspection / TODO `[DONE]` marking — those belong to later steps (Task 3 and Step 4.6).
- If `npm install` rewrites `package-lock.json` extensively (e.g., format change), include the whole file in the commit; this is expected and safe.
- If `npm run build` fails after the `paths` edit, double-check that `paths` was added inside `compilerOptions` (not at the root) and that `baseUrl` remains `"./"`.