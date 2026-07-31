# Code Review Fix Plan — `CbaModuleFooter`

**Task:** Task 4 of `.agent/todos/20260730/20260730-todo-4.md` — Implement `CbaModuleFooter`.
**Reviewer:** Code Reviewer sub-agent (4.3 Code Review & Simplification).
**Date:** 2026-07-31
**Branch:** `feat/phase6-dropdown-popover-typeahead-footer`

---

## Executive Summary

The `CbaModuleFooter` implementation is **complete, compliant, and verified**. No code fixes are required. Build, lint, and the full Jest suite pass. The component matches the implementation plan and front-end spec, follows the project rules, and aligns with `ModuleHeader` status semantics.

This fix plan documents the review findings and confirms no corrective actions are needed.

---

## 1. Plan Adherence

| Plan Requirement | Status | Notes |
| --- | --- | --- |
| Files created under `src/components/module-footer/` | Pass | `module-footer.component.ts`, `.html`, `.scss`, `index.ts`, `.spec.ts` all present. |
| Standalone component, `OnPush`, signal inputs | Pass | `standalone: true`, `ChangeDetectionStrategy.OnPush`, `input()` / `computed()` used. |
| Reuse `ModuleHeaderStatus` type | Pass | Imported from `../module-header/module-header.types.ts`. No new public type introduced. |
| `status` input default `null` | Pass | `readonly status = input<ModuleHeaderStatus>(null);` |
| `statusText` input default `undefined` | Pass | `readonly statusText = input<string | undefined>(undefined);` |
| `STATUS_TEXTS` mapping | Pass | Matches spec exactly: `Loading…`, `Ready`, `Saved`, `Attention needed`, `Error`, `Unsaved changes`. |
| `STATUS_VISUALS` icon mapping | Pass | Mirrors `ModuleHeader` icons: `faSpinner+spin`, `faCheck`, `faCircleCheck`, `faTriangleExclamation`, `faCircleXmark`, `faPen`. |
| Footer root is `<footer>` | Pass | Template uses semantic `<footer>` element. |
| Live region attributes | Pass | `role="status"`, `aria-live="polite"`, `aria-atomic="true"`. |
| Decorative icon | Pass | `<fa-icon aria-hidden="true" />`. |
| BEM naming | Pass | Uses `.cba-module-footer`, `.cba-module-footer__status`, `--{status}` modifiers. (Plan section 6 has a typo writing `cobra-`; implementation correctly follows the spec and the rest of the plan.) |
| Barrel exports | Pass | Named export of `ModuleFooterComponent`, `export type { ModuleHeaderStatus }`. Internal helpers not exported. |
| `public-api.ts` integration | Pass | `export * from './components/module-footer';` inserted alphabetically between `module-container` and `module-header`. |
| `.agent/project-structure.md` updated | Pass | New bullet added under `# Folders in src/`. |
| Spec cases 1–10 | Pass | All cases covered in `module-footer.component.spec.ts`. |

### Minor Plan Inconsistencies (Implementation is Correct)

- **Plan Section 6 / test case 7** refers to `cobra-module-footer__status--{status}`. The implementation and tests use the correct `cba-module-footer__status--{status}` prefix, consistent with the selector `cba-module-footer` and the rest of the codebase. No change needed.

---

## 2. Rule Compliance

| Rule | Status | Notes |
| --- | --- | --- |
| `max-lines-per-file` (≤200) | Pass | Component TS ~186 lines including comments and JSDoc. |
| `max-lines-per-method` (≤50) | Pass | All methods/computeds are short; `hasExplicitText` is 3 lines. |
| `max-depth` (≤2) | Pass | Template nesting: `footer` → `@if` (level 1) → inner `@if` (level 2). SCSS nesting is shallow. |
| `max-arguments-per-method` (≤2) | Pass | `hasExplicitText(text)` takes 1 param. No other methods. |
| `prefer-private-members` | Pass | `hasExplicitText` is `private`. `STATUS_VISUALS` / `STATUS_TEXTS` are module-level constants (effectively file-private). |
| `no-commented-code` | Pass | No commented-out code found. |
| `self-documenting-code` | Pass | Clear names: `statusVisual`, `statusClass`, `displayText`, `hasStatusRegion`, `hasExplicitText`. |
| `single-section-boolean-conditions` | Pass | The condition `text !== undefined && text !== null` is extracted into `hasExplicitText(...)`. |
| `project-structure` | Pass | Component lives under `src/components/module-footer/` as documented. |

---

## 3. Quality Issues

No bugs, type errors, or accessibility gaps were found.

### Observations (No Action Required)

1. **Defensive `null` check in `displayText()`**: `statusText` is typed `string | undefined`, so it can never be `null` from the signal input. The check `text !== null` inside `hasExplicitText` is harmless defensive code. It can be left as-is or simplified in a future simplification pass, but it is not a defect.
2. **No `statusText` trim handling**: If a consumer passes `statusText=" "`, the span still renders with whitespace. This matches the spec (“`statusText` override wins”) and is acceptable for v1.

---

## 4. Alignment with `ModuleHeader`

| Aspect | `ModuleHeader` | `ModuleFooter` | Aligned? |
| --- | --- | --- | --- |
| Status values | `loading`, `loaded`, `success`, `warning`, `error`, `dirty`, `null` | Same set imported from `ModuleHeaderStatus` | Yes |
| Status icons | `faSpinner+spin`, `faCheck`, `faCircleCheck`, `faTriangleExclamation`, `faCircleXmark`, `faPen` | Identical mapping | Yes |
| Icon semantics | Decorative / status indicator | Decorative `aria-hidden="true"` | Yes |
| Status colors | `info`, `success`, `warning`, `danger`, `muted` for dirty | `info`, `success`, `warning`, `danger`, `text-secondary` for dirty | Yes — the spec explicitly authorizes `--cba-text-secondary` for dirty; this is intentional and not a defect. |
| Change detection | `OnPush` | `OnPush` | Yes |

The footer correctly extends `ModuleHeader` semantics with readable status text rather than duplicating the header UI.

---

## 5. Verification Results

Commands executed during the review:

| Command | Result |
| --- | --- |
| `npm run build` | Passed |
| `npm run lint` | Passed (no errors) |
| `npm test` | 15 suites passed, 138 tests passed |

---

## 6. Fix Actions

**No fixes are required.**

If the Plan Agent wants to address the minor observations, the following optional simplifications could be applied in a future pass (not blocking):

| # | Optional Change | File | Priority |
| --- | --- | --- | --- |
| 1 | Remove the redundant `null` branch from `hasExplicitText` (since `statusText` is `string \| undefined`). | `src/components/module-footer/module-footer.component.ts` | Low |

No code changes are recommended at this time.

---

## 7. Sign-off

Reviewer conclusion: **Implementation approved. No fix plan to execute.**
