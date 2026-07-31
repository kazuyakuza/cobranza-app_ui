# Simplification Plan — Task 0 (move source out of `src/lib/`)

Review focus: `src/public-api.ts`, component barrel files, duplicated/left-over folders, `ng-package.json`, `tsconfig.lib.json`, and `.gitkeep` files after the `src/lib/` → `src/` structural move.

## 1. Remove the leftover empty `src/lib/` tree

**Finding:** `src/lib/` still exists as a directory tree (`src/lib/components/*`, `src/lib/theme/`) but contains **no files**. The actual source now lives under `src/components/` and `src/theme/`.

**Simplification:** Delete the entire `src/lib/` directory.

**Rationale:** Empty directories duplicate the new structure, confuse tooling/file searches, and are likely to be mistaken for the real source by AI agents or IDEs.

## 2. Update `src/public-api.ts`

**Findings:**

- The header comment still instructs implementers to place code inside `src/lib/` and references the old layout.
- Only `module-header` and `module-container` are exported. The Phase 4 components (`button`, `card`, `badge`, `empty-state`, `skeleton`) and the existing `modal` barrel are missing from the public API, even though their barrel files already exist under `src/components/`.

**Simplification:**

1. Update the comment to reference `src/` instead of `src/lib/`.
2. Add the missing component barrel exports in alphabetical order:
   - `./components/badge`
   - `./components/button`
   - `./components/card`
   - `./components/empty-state`
   - `./components/modal`
   - `./components/skeleton`

**Rationale:** A single, accurate, alphabetically ordered public API is easier to maintain and satisfies the acceptance criterion that every component is exported from `public-api.ts`.

## 3. Remove empty placeholder barrel files (or populate them)

**Finding:** These barrel files contain only a comment and `export {};`:

- `src/components/button/index.ts`
- `src/components/card/index.ts`
- `src/components/badge/index.ts`
- `src/components/empty-state/index.ts`
- `src/components/skeleton/index.ts`
- `src/components/modal/index.ts`

They do not export any symbols and are currently dead weight.

**Simplification:** Delete the empty barrels. Re-create each one when the matching component is implemented.

**Rationale:** Empty barrels with misleading "re-exports the public API" comments add noise and will be recreated automatically as part of component implementation. Keeping them does not provide value.

## 4. Remove unnecessary `.gitkeep` files

**Findings:**

- `src/components/.gitkeep` — the folder already contains subdirectories and is tracked via their contents.
- `src/theme/.gitkeep` — the folder contains real SCSS files.
- `src/directives/.gitkeep` — keep for now; the folder is otherwise empty and still listed in the project structure.

**Simplification:** Delete `src/components/.gitkeep` and `src/theme/.gitkeep`.

**Rationale:** `.gitkeep` is only needed to preserve empty directories that must be tracked. Once a directory has real contents, the file is redundant.

## 5. Update stale `src/lib/` references in project metadata

**Findings:**

- `.agent/project-structure.md` still describes paths as `src/lib/components/...` and `src/lib/theme/...`.
- `README.md` states that `ng-package.json` points to `src/lib/public-api.ts` and references theme files under `src/lib/theme/`.

**Simplification:** Update all of these references to the new `src/` paths:

- `.agent/project-structure.md` → `src/components/...`, `src/theme/...`, `src/public-api.ts`.
- `README.md` → `src/public-api.ts`, `src/theme/`.

**Rationale:** Outdated canonical documentation contradicts the real folder layout and will mislead future implementers and consumers.

## 6. Reconsider `tsconfig.lib.json` `outDir`

**Finding:**

```json
"outDir": "./dist/out-tsc/lib"
```

The `lib` segment reflects the old `src/lib/` source layout. Source now lives under `src/`.

**Simplification:** Change to `"./dist/out-tsc"` (or remove the segment) after verifying that ng-packagr still outputs to the correct `dest` directory.

**Rationale:** Removes a misleading path artifact left over from the previous layout.

## 7. Keep `ng-package.json` unchanged

**Finding:** `ng-package.json` already uses the new paths:

- `"entryFile": "src/public-api.ts"`
- `"styleIncludePaths": ["src/theme"]`
- assets glob from `src/theme`

**Rationale:** No redundant or unnecessary settings were found here.

---

## Summary

| Area | Action |
| --- | --- |
| `src/lib/` | Delete empty leftover tree |
| `src/public-api.ts` | Update comment + add missing component exports alphabetically |
| Empty component barrels | Delete placeholder `index.ts` files |
| `.gitkeep` files | Remove `src/components/.gitkeep` and `src/theme/.gitkeep` |
| Metadata/docs | Update `src/lib/` references in `.agent/project-structure.md` and `README.md` |
| `tsconfig.lib.json` | Simplify `outDir` to remove stale `lib` segment (verify build) |
| `ng-package.json` | No change needed |
