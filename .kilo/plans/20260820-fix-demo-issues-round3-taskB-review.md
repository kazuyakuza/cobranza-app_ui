# Code Review Report — Task B: Fix failing tests (module-header)

**Reviewed file:** `src/components/module-header/module-header.component.spec.ts`
**Plan:** `.kilo/plans/20260820-fix-demo-issues-round3-taskB.md`
**Commit reviewed:** `aa106841` — `test(module-header): update button counts for built-in drag button`

## 1. Verification against plan

| Plan requirement | Status | Evidence |
|------------------|--------|----------|
| Test name updated from "four" to "five" built-in action buttons | PASS | Spec line 112: `it('renders the five built-in action buttons when no drag handle is projected (empty slot)', ...)` |
| `toHaveLength(4)` → `toHaveLength(5)` (no projection) | PASS | Spec line 115: `expect(navButtons).toHaveLength(5);` |
| `toHaveLength(5)` → `toHaveLength(6)` (with projected drag handle) | PASS | Spec line 142: `expect(navButtons).toHaveLength(6);` |
| `ACTION_CASES` left unchanged | PASS | Spec lines 12-17 still contain exactly 4 emit cases; no built-in drag button case added |
| Only the spec file modified and committed for Task B | PARTIAL | Commit `aa106841` touches only the spec file, but the working tree currently has `package-lock.json` modified |

## 2. Test / lint / build results

| Command | Result |
|---------|--------|
| `npm run test -- --testPathPatterns=module-header.component.spec.ts --no-watch` | PASS — 10/10 tests passed |
| `npm run lint` | PASS — no errors |
| `npm run build:lib` | PASS — build completed with only pre-existing ng-packagr warnings |

## 3. Issues found

### Issue 1 — `package-lock.json` is modified in the working tree (deviation)

**Severity:** Medium — blocks clean Task B completion because the plan’s Step 4 explicitly expects only `src/components/module-header/module-header.component.spec.ts` to appear as modified.

**Details:**
- Commit `aa106841` correctly changed only the spec file.
- `git status --short` currently shows ` M package-lock.json`.
- `package.json` is **not** modified, so this does not appear to be an intentional version-bump artifact.
- This change was likely produced by an `npm install` run in the workspace.

**Impact:**
- If Task B is considered complete and the working tree is committed/merged as-is, `package-lock.json` changes would leak into the feature branch outside the scope of Task B.
- Violates the plan’s instruction: "Review output. Only `src/components/module-header/module-header.component.spec.ts` should appear as modified. If other files appear, STOP and return a question to the caller."

## 4. Fix plan

### Step 1 — Determine intent of the `package-lock.json` change

Run the following command (or equivalent) to inspect the diff:

```bash
git diff package-lock.json
```

- If the diff is empty / whitespace-only / lockfile version noise and not required: revert the file.
- If the diff contains meaningful dependency changes required by the project: it likely belongs to a different task/version-bump step and should be handled there, not under Task B.

### Step 2 — Revert `package-lock.json` if not intentional

```bash
git checkout -- package-lock.json
```

Then verify:

```bash
git status --short
```

Expected output: only untracked plan/todo files remain; `package-lock.json` no longer appears as modified.

### Step 3 — Re-run verification commands

```bash
npm run test -- --testPathPatterns=module-header.component.spec.ts --no-watch
npm run lint
npm run build:lib
```

All three must still pass.

### Step 4 — Confirm Task B commit is correct

```bash
git show --stat aa106841
```

Expected: only `src/components/module-header/module-header.component.spec.ts` changed.

## 5. Conclusion

The spec-file changes for Task B fully match the implementation plan and all targeted tests pass. The only blocker is the unrelated `package-lock.json` modification in the working tree, which must be resolved before Task B can be considered cleanly complete.

**Recommendation:** Execute the fix plan above (revert `package-lock.json` unless it is intentionally required elsewhere) and then proceed to step 4.6 (Task Completion).
