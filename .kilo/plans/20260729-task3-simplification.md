# Task 3 Simplification Plan — Clean-up & Build Verification

> **Scope:** Review-only simplification opportunities for Phase 0 Task 7 (clean-up & build verification).  
> **Do NOT implement** the changes below; this file is input for the next implementer/code-review cycle.

---

## Build / test state observed

- `npm run build` exits `0` and produces the expected `dist/` layout.
- `npm test` exits `0` but prints a `jest-haste-map` naming-collision warning.
- `npm run lint` exits `0` with no errors.
- No leftover CLI components, NgModules, or application boilerplate were found.

---

## Simplification findings

### 1. `.gitignore` is missing common Angular / Jest / TypeScript artifacts

Current `.gitignore` covers the basics (`dist/`, `node_modules/`, OS files, `.env` variants), but omits directories/files that will appear as soon as tooling is used more broadly:

- `.angular/` — Angular CLI cache directory (created by `ng`/`ng-packagr` when the CLI is involved).
- `coverage/` — Jest coverage reports when `npm test -- --coverage` is run.
- `.eslintcache` — ESLint persistent cache if enabled later.
- `*.tsbuildinfo` — TypeScript incremental build info files.

**Recommendation:** Add these entries to `.gitignore` to keep the working tree clean and avoid accidental commits.

### 2. `package-lock.json` is ignored despite an explicit "update lockfile" task

The project context lists *"Update the lockfile"* as a completed Phase 0 task, and `package-lock.json` exists in the working tree. However, `.gitignore` line 41 ignores `package-lock.json`, so the lockfile cannot be tracked.

**Recommendation:** Decide whether the lockfile should be committed.
- If the team wants reproducible CI / install reproducibility, **remove `package-lock.json` from `.gitignore`** and track it.
- If the library intentionally avoids a lockfile, **update the project context** to remove the "Update the lockfile" task and delete the local `package-lock.json` to avoid confusion.

The current mixed state is the most confusing option and should be resolved.

### 3. `npm test` emits a `jest-haste-map` collision warning

`npm test` prints:

```text
jest-haste-map: Haste module naming collision: @cobranza-apps/ui
  The following files share their name; please adjust your hasteImpl:
    * <rootDir>\package.json
    * <rootDir>\dist\package.json
```

This happens because Jest scans the whole project root and finds two `package.json` files with the same package name. The warning is benign today but adds noise and will recur after every build.

**Recommendation:** Tell Jest to ignore the build output directory.

Options:
- Add `modulePathIgnorePatterns: ['<rootDir>/dist/']` to `jest.config.js`.
- Or restrict Jest roots to `src/` with `roots: ['<rootDir>/src']`.

Both are small, low-risk changes that make the test output clean.

### 4. `src/lib/public-api.ts` comment references the wrong barrel filename

The doc block in `src/lib/public-api.ts` says:

```text
3. Add a `export * from './<path>/public-api'` line below
```

The actual barrel files are named `index.ts` (e.g., `src/lib/components/button/index.ts`). New contributors will follow the comment and fail.

**Recommendation:** Change the comment to reference `index.ts` (or the generic term "barrel file"). No code change is needed.

### 5. No `clean` script for reproducible build verification

The implementation plan manually deletes `dist/` before rebuilding. A dedicated `clean` script in `package.json` would make build verification simpler and less error-prone, especially as `.angular/` cache is introduced.

**Recommendation:** Add a `clean` script.

- Cross-platform option: add `rimraf` as a dev dependency and use `"clean": "rimraf dist .angular coverage"`.
- Windows-only option (current environment): `"clean": "if exist dist rmdir /s /q dist && if exist .angular rmdir /s /q .angular && if exist coverage rmdir /s /q coverage"`.

The `rimraf` route is preferred because it keeps the script platform-independent.

### 6. Component barrel placeholders are empty scaffolding

Eight files under `src/lib/components/*/index.ts` exist with only `export {};` and nearly identical comments. They do not currently export anything and are not imported by `src/lib/public-api.ts`.

**Recommendation:** Either
- **Keep them** as intentional skeletons (update `project-structure.md` to clarify they are placeholders), or
- **Remove them** and recreate each barrel when the corresponding component is implemented.

Removing them is the simpler state for Phase 0, but it requires updating `project-structure.md` so the documented folder list stays accurate.

### 7. `.git-credentials` file exists on disk

A `.git-credentials` file is present in the repository root. It is correctly ignored by `.gitignore`, but leaving credentials on disk is a security risk.

**Recommendation:** Delete the file from the working tree and rotate the credentials if they are real.

---

## Proposed implementation order

If these simplifications are approved, implement them in this order:

1. **Resolve lockfile status** first (decide + update `.gitignore` or context).
2. **Update `.gitignore`** with missing artifacts and `.git-credentials` note if needed.
3. **Add Jest ignore** for `dist/` in `jest.config.js`.
4. **Fix `public-api.ts` comment** referencing `index.ts`.
5. **Add `clean` script** to `package.json` (and `rimraf` dev dependency if chosen).
6. **Delete `.git-credentials`** from disk.
7. **Decide on component barrel placeholders** and update `project-structure.md` accordingly.
8. Re-run `npm run clean`, `npm run build`, `npm test`, `npm run lint` to verify.

---

## Out of scope

- No component, directive, or theme implementation.
- No changes to peer dependencies, `ng-package.json`, or `tsconfig*.json`.
- No deletion of `src/lib/directives/.gitkeep` (intentional placeholder).
