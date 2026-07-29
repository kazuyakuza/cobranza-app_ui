# Code Review — Task 1: Library Configuration Alignment

**Review date:** 2026-07-29
**Reviewer:** code-reviewer sub-agent
**TODO:** `.agent/todos/20260729/20260729-todo-1.md`
**Per-task plan:** `.kilo/plans/20260729-phase0-task1-config-alignment.md`
**Commit reviewed:** `d7a24e2` — `chore(lib): align peer deps and add @cobranza-apps/ui path mapping`

---

## Scope of Review

Review the implementation of peer dependency alignment and TypeScript path mapping for the `@cobranza-apps/ui` library.

---

## Findings

### 1. `package.json` peerDependencies

**Status:** Correct.

The commit updated the `peerDependencies` block to exactly match the TODO spec and the per-task plan:

- `@angular/common`: `^22.0.0` ✓
- `@angular/core`: `^22.0.0` ✓
- `@angular/forms`: `^22.0.0` ✓
- `@fortawesome/angular-fontawesome`: `^5.0.0` ✓
- `@fortawesome/fontawesome-svg-core`: `^6.0.0 || ^7.0.0` ✓ (newly added)
- `@fortawesome/free-regular-svg-icons`: `^6.0.0 || ^7.0.0` ✓ (widened from `^7.3.0`)
- `@fortawesome/free-solid-svg-icons`: `^6.0.0 || ^7.0.0` ✓ (widened from `^7.3.0`)
- `@ng-bootstrap/ng-bootstrap`: `^21.0.0` ✓
- `bootstrap`: `^5.3.0` ✓

Keys remain in alphabetical order. JSON is valid.

### 2. `package.json` devDependencies

**Status:** Unchanged.

No dev dependency entries were added, removed, or modified. The concrete versions used for development (`@fortawesome/fontawesome-svg-core@^7.3.0`, `@fortawesome/free-regular-svg-icons@^7.3.1`, `@fortawesome/free-solid-svg-icons@^7.3.1`, etc.) remain intact.

### 3. `tsconfig.json` path mapping

**Status:** Correct.

The `paths` entry was added directly under `compilerOptions`, immediately after `baseUrl`:

```json
"paths": {
  "@cobranza-apps/ui": ["src/lib/public-api.ts"]
},
```

- `baseUrl` remains `"./"`.
- Path target is `src/lib/public-api.ts`, matching the established `ng-package.json` entry point.
- JSON is valid.

### 4. File footprint

**Status:** Correct.

`git show --stat d7a24e2` confirms only the intended files were modified:

- `package.json`
- `tsconfig.json`

No unrelated files, no `node_modules/`, no `dist/`, no source code changes.

### 5. Public API surface

**Status:** Not changed by this commit; verified separately.

`src/lib/public-api.ts` continues to export only `export {};` and contains no leaked component/service imports.

---

## Deviations from Plan

None identified.

---

## Fix Plan

No fixes are required. The implementation is fully aligned with the TODO spec and the per-task plan.

---

## Recommendations

1. Proceed to the next workflow step (4.4 Documentation / 4.5 Verification) without further changes.
2. Ensure the verification step re-runs `npm run build` and `npm test` to confirm the path mapping and peer dependency changes do not break the build or test runner.

(End of review)
