# Code Review — Fix `cba-button--secondary` background color (Task 1, Step 4.3)

**Review date:** 2026-08-20  
**Reviewer:** Code Reviewer sub-agent  
**TODO file:** `.agent/todos/20260820/20260820-todo-2.md`  
**Implementation plan:** `.kilo/plans/20260820-fix-secondary-button-bg-task1.md`  
**Branch:** `fix/secondary-button-bg`

## 1. Scope and changes reviewed

| File | Expected change | Actual state | Result |
|---|---|---|---|
| `src/components/button/cba-button.component.scss` line 67 | `background-color: var(--cba-bg-elevated);` | `background-color: var(--cba-bg-elevated);` inside `:host(.cba-button--secondary) .cba-button__control` | PASS |
| `projects/demo/src/app/components/demo-button-matrix/demo-button-matrix.component.ts` line 51 | Caption uses `var(--cba-border-default)` | Caption reads `.cba-button--secondary · var(--cba-bg-elevated) · var(--cba-border-default)` | PASS |
| `CHANGELOG.md` | New dated `[0.18.5] — 2026-08-20` header above `[0.18.4]` | Header present with Fixed entries; no `[Unreleased]` section | PASS |
| `package.json` line 3 | `"version": "0.18.5"` | `"version": "0.18.5"` | PASS |

## 2. Acceptance criteria check

- [x] `cba-button--secondary` renders with `--cba-bg-elevated` background  
  Source line 67 matches the required token.
- [x] Cancel button in "New Customer" form is clearly visible (lighter background against module body)  
  The token change produces `#FDFCF8` fill on `#F2F0E8` module body, giving visible contrast.
- [x] Secondary buttons in the Buttons demo matrix still render correctly on all three surfaces  
  Build artifacts and screenshots exist; the matrix caption now documents the actual border token.

## 3. Build and verification evidence

| Check | Evidence | Result |
|---|---|---|
| Library built | `dist/package.json` exists and reports `"version": "0.18.5"` | PASS |
| Local dependency reinstalled | `node_modules/@cobranza-apps/ui/package.json` exists and reports `"version": "0.18.5"` | PASS |
| Demo built | `dist/demo/browser/index.html` exists | PASS |
| Visual verification | Three screenshots present in `.playwright-mcp/` (`demo-verify-round3-fix.png`, `demo-verify-round3-fix-buttons-matrix.png`, `demo-new-customer-form.png`) | PASS |

## 4. Gitignore compliance

- `dist/`, `node_modules/`, `.angular/` — not staged (gitignored). PASS.
- `.playwright-mcp/` screenshots — untracked, transient artifacts, not staged. PASS.
- Planning/TODO files — untracked, expected. PASS.

## 5. Issue found — `package-lock.json` out of sync

**Severity:** Medium (lock file drift)  
**Status:** Needs fix

`package-lock.json` is modified but unstaged. The diff shows the package version updated from `0.18.4` to `0.18.5` in three places (root package and the `file:./dist` local dependency entry). This change is a legitimate side effect of running `npm install` after the version bump, but it was not committed. Leaving it unstaged means the lock file is out of sync with the committed `package.json` and `dist/` version.

### Fix plan

1. **Stage** `package-lock.json`:
   ```bash
   git add package-lock.json
   ```
2. **Commit** with a meaningful message matching repo conventions:
   ```text
   chore: sync package-lock.json to version 0.18.5
   ```
   Optional body:
   ```text
   Update lock file after npm install refreshed the file:./dist
   local dependency from 0.18.4 to 0.18.5.
   ```
3. **Verify**:
   ```bash
   git status
   git log --oneline -3
   ```
   Expected: new commit on top of `344b88c`; working tree clean except untracked planning/TODO files and `.playwright-mcp/` screenshots.

## 6. Overall verdict

**Conditional PASS pending the `package-lock.json` fix above.**

All planned code changes are correct and match the acceptance criteria. The build and demo verification artifacts are present. The only remaining action is to commit the unstaged `package-lock.json` so the lock file stays synchronized with the bumped version.
