# Code Review — Task Group A Implementation

**Date:** 2026-08-20
**Reviewed against:** `.kilo/plans/20260820-fix-demo-bugs-taskA.md`
**Scope:** Bugs 1–4 from `.agent/todos/20260820/20260820-todo-0.md`

---

## Files reviewed

| # | File | Result |
|---|---|---|
| 1 | `src/components/module-container/module-container.component.html` | ✅ Matches plan |
| 2 | `src/components/module-container/module-container.component.scss` | ✅ Matches plan |
| 3 | `src/components/module-footer/module-footer.component.scss` | ✅ Matches plan |
| 4 | `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts` | ✅ Matches plan |
| 5 | `projects/demo/src/app/components/demo-workspace/demo-workspace.component.scss` | ✅ Matches plan |
| 6 | `docs/CBA_MODULE_CONTAINER.md` | ✅ Matches plan |
| 7 | `src/components/module-header/module-header.component.ts` | ✅ Verified, no change needed |
| 8 | `src/components/module-header/module-header.component.html` | ✅ Verified, no change needed |
| 9 | `src/components/module-header/module-header.component.scss` | ✅ Verified, no change needed |
| 10 | `CHANGELOG.md` | ❌ Missing required `0.18.3` section |

---

## Detailed findings

### 1. `module-container.component.html`

- Footer `<div>` is a sibling of `.cba-module-container__body`.
- Both live inside the same `@if (!isCollapsed())` block.
- Slot selector is exactly `[cbaModuleContainerFooter]`.
- Footer wrapper renders whenever the module is expanded, even if empty.

**Verdict:** Correct.

### 2. `module-container.component.scss`

- `.cba-module-container__footer` inserted immediately after `.cba-module-container__body` and before the padding-modifiers comment.
- Uses `flex: 0 0 auto`, `min-width: 0`.
- Uses `border-top: 1px solid var(--cba-border-default)` (not `--cba-border-subtle`).
- Uses `background-color: var(--cba-bg-tertiary)`.
- No padding, height, or scroll rules added to the wrapper.

**Verdict:** Correct.

### 3. `module-footer.component.scss`

- `.cba-module-footer__status` includes the single added declaration `justify-content: flex-end;`.
- Parent `.cba-module-footer` unchanged.
- `gap`, `display`, and `align-items` unchanged.

**Verdict:** Correct.

### 4. `demo-module-card.component.ts`

- `cbaModuleContainerFooter` attribute added to `<cba-module-footer>`.
- `@if (hasFooter)` guard preserved.
- `[status]` and `[statusText]` bindings unchanged.
- `<ng-content />` remains above the footer conditional.

**Verdict:** Correct.

### 5. `demo-workspace.component.scss`

- `.workspace__row--single-50` now uses `grid-template-columns: repeat(2, 1fr);`.
- `.workspace__row` and `.demo-actions` untouched.

**Verdict:** Correct.

### 6. `docs/CBA_MODULE_CONTAINER.md`

- Content-projection table includes the Footer slot row.
- Basic-usage example includes a `<cba-module-footer cbaModuleContainerFooter>` footer band.
- Collapsed-behaviour section notes that the footer region is removed together with the body.

**Verdict:** Correct.

### 7. `module-header.component.ts` (Bug 2 verify-only)

- `faUpDownLeftRight` imported on line 21.
- `protected readonly faDrag = faUpDownLeftRight;` present on line 165.

**Verdict:** Correct.

### 8. `module-header.component.html` (Bug 2 verify-only)

- Drag button rendered inside `@if (!isFullscreen())`.
- Uses `<fa-icon [icon]="faDrag" aria-hidden="true" />`.
- First rendered icon in the actions nav (preceded only by the empty `[cbaModuleDragHandle]` projection slot).

**Verdict:** Correct.

### 9. `module-header.component.scss` (Bug 2 verify-only)

- `.cba-module-header__action--drag` sets only `cursor: grab` and `:active { cursor: grabbing; background-color: transparent; }`.
- No `display: none`, `visibility: hidden`, `opacity: 0`, `width: 0`, or `height: 0` targeting the drag action.

**Verdict:** Correct.

### 10. `CHANGELOG.md`

**Issue:** The required `## [0.18.3] — 2026-08-20` header and its Added/Fixed entries were **not added**. The latest header is still `## [0.18.2] — 2026-08-20` even though `package.json` was already bumped to `0.18.3`.

This violates `.kilo/rules/changelog-versioning.md`:

> `CHANGELOG.md` MUST NOT contain an `[Unreleased]` section. Every push to remote `origin` publishes the library, so every change MUST be documented under a dated `[x.y.z] — YYYY-MM-DD` header before it lands on `main`.

**Impact:** Pushing `main` without a dated `0.18.3` section would publish version `0.18.3` with no changelog entry.

**Required fix:** Add the section exactly as specified in the implementation plan Step C.1.

---

## Required fix plan

### Fix 1 — Add `0.18.3` changelog section

**File:** `CHANGELOG.md`

**Action:** Insert a new section immediately above `## [0.18.2] — 2026-08-20` (currently line 33) with this exact content:

```markdown
## [0.18.3] — 2026-08-20

### Added

- `ModuleContainerComponent` now exposes a dedicated footer projection slot `[cbaModuleContainerFooter]`, rendered below the body and removed together with the body when the module is collapsed. See `docs/CBA_MODULE_CONTAINER.md`.

### Fixed

- `CbaModuleFooterComponent` status region (`__status`) now aligns its text+icon group to the right edge via `justify-content: flex-end`.
- Demo `demo-workspace` single 50% row (`.workspace__row--single-50`) now uses `grid-template-columns: repeat(2, 1fr)` so the module cell and the empty cell have equal widths.

```

**Rules:**
- Do NOT add an `[Unreleased]` section.
- Do NOT modify existing `0.18.2` or earlier entries.
- Do NOT bump `package.json` version (already `0.18.3`).

### Fix 2 — Commit the changelog update

After editing `CHANGELOG.md`, commit with:

```text
git add CHANGELOG.md
git commit -m "docs(changelog): record 0.18.3 footer slot and demo fixes"
```

### Fix 3 — Remove transient crash dump

**File:** `bash.exe.stackdump` (untracked, root of repo)

**Action:** Delete this transient file; it is not a source artifact and is not gitignored.

**Command:**

```text
git clean -fd bash.exe.stackdump
```

or manually remove it before the final `git status` check.

---

## Verification already completed by reviewer

| Command | Result |
|---|---|
| `npm run build:lib` | ✅ Pass (warnings about pre-existing `package.json` export conditions only) |
| `npm run build:demo` | ✅ Pass |
| `npm run lint` | ✅ Pass |

After the changelog fix is applied, re-run the same three commands to confirm no regressions.

---

## Deviations from plan

| Plan expectation | Actual | Severity | Notes |
|---|---|---|---|
| Commit message: `fix(demo-workspace): make single 50% row columns equal width` | Commit message: `fix(demo): equal module and empty-space widths for 50% rows` | Low | Wording difference only; file changed is correct. |
| CHANGELOG.md should have a new `0.18.3` section committed as `docs(changelog): record 0.18.3 footer slot and demo fixes` | No CHANGELOG update committed | **High** | Must be fixed before merge/push. |

---

## Summary

All source-code changes for Bugs 1–4 are correct and match the implementation plan. The only blocker is the missing `CHANGELOG.md` `0.18.3` section, which must be added and committed before the Critical Workflow can proceed to Step 5 (merge/push).
