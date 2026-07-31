# Task 0 Code Review — Fix Plan

## Summary

The structural move from `src/lib/` to `src/` is functionally complete and the library builds, tests, and lints successfully. However, three cleanup issues remain.

## Verification Results

- Build: `npm run build` passed.
- Tests: `npm test` passed (10 tests).
- Lint: `npm run lint` passed.
- Config files (`ng-package.json`, `tsconfig.lib.json`, `tsconfig.json`) correctly point to `src/` paths.
- Component `templateUrl`/`styleUrl` relative paths are correct.
- No stale `src/lib/` references exist in actual TypeScript import statements.

## Issues Found

### Issue 1 — Empty `src/lib/` directory tree remains

**Location:** `src/lib/` (root of the tree).

**Problem:** The move left behind an empty directory hierarchy:

- `src/lib/components/`
- `src/lib/components/{badge,button,card,empty-state,modal,module-container,module-header,skeleton}/`
- `src/lib/theme/`

No files remain under `src/lib/` (verified with `Get-ChildItem -Recurse -File`), and no tracked files reference it. Since the stated goal of the refactor is to flatten the library root, this tree should be removed.

**Fix:** Delete the entire `src/lib/` directory.

```bash
# From repository root
Remove-Item -Recurse -Force src/lib
```

---

### Issue 2 — Stale `src/lib/` references in JSDoc / comments

**Locations:**

1. `src/public-api.ts` line 9
2. `src/components/module-header/module-header.component.ts` line 52
3. `src/components/module-container/module-container.component.ts` line 34

**Problem:** Documentation comments still refer to the old `src/lib/` layout.

**Fix:** Update the comments to reference the new flattened paths.

#### `src/public-api.ts`

Change:

```text
 * 1. Implement the component, directive, pipe, or service inside `src/lib/`.
```

To:

```text
 * 1. Implement the component, directive, pipe, or service inside `src/`.
```

#### `src/components/module-header/module-header.component.ts`

Change:

```text
 * Exported from `@cobranza-apps/ui` via `src/lib/public-api.ts`.
```

To:

```text
 * Exported from `@cobranza-apps/ui` via `src/public-api.ts`.
```

#### `src/components/module-container/module-container.component.ts`

Change:

```text
 * Exported from `@cobranza-apps/ui` via `src/lib/public-api.ts`.
```

To:

```text
 * Exported from `@cobranza-apps/ui` via `src/public-api.ts`.
```

---

### Issue 3 — Leftover `.gitkeep` files in non-empty directories

**Locations:**

- `src/components/.gitkeep`
- `src/theme/.gitkeep`

**Problem:** Both directories now contain real content, so the `.gitkeep` placeholders are unnecessary and show as untracked files in `git status`.

**Fix:** Delete both files.

```bash
# From repository root
Remove-Item src/components/.gitkeep
Remove-Item src/theme/.gitkeep
```

---

## Re-verification Steps After Fix

1. Confirm `src/lib/` no longer exists.
2. Run `npm run build` and confirm success.
3. Run `npm test` and confirm success.
4. Run `npm run lint` and confirm success.
5. Run `git status` and confirm only expected plan/TODO files remain untracked.
