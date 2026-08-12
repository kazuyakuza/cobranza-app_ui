# Task A — Code Review Fix Plan

**Date:** 2026-08-12
**Branch:** `feat/project-audit-and-fixes`
**Reviewer step:** 4.3 Code Review
**Scope:** Tasks 1–4 of `.kilo/plans/20260812-task-a-implementation.md`

## Summary

Implementation is **largely adherent** to the plan. All 10 implementation commits were inspected (plus the preceding version-bump commit). The code changes match the authorized edits for package exports, theme tokens, component SCSS token compliance, `ModuleFooterComponent` → `CbaModuleFooterComponent` rename, host blocks, doc renames, stale-value fixes, and CHANGELOG entry.

One **low-severity doc inconsistency** was found in `docs/USAGE.md`.

---

## Issue Found

### 1. `docs/USAGE.md` still carries a misleading "CSS variables only" heading

- **File:** `docs/USAGE.md`
- **Line:** 139
- **Severity:** Low
- **Category:** Deviation from plan / documentation accuracy

#### Current state

```markdown
**CSS variables only (if not using SCSS):**

> **Note:** The theme is shipped as Sass only — no compiled `theme.css` artifact is published. Import via `@use '@cobranza-apps/ui/theme';`. Custom CSS properties (`--cba-*`) and opt-in `.cba-*` utility classes emit on `:root` after the `@use`.
```

#### Expected state (per §1.6 of implementation plan)

The implementation plan explicitly says to replace the **entire** old block (heading + CSS snippet + note) with the Sass-only clarification note. The leftover heading now contradicts the note beneath it, because the heading still promises a CSS-only path that no longer exists.

```markdown
> **Note:** The theme is shipped as Sass only — no compiled `theme.css` artifact is published. Import via `@use '@cobranza-apps/ui/theme';`. Custom CSS properties (`--cba-*`) and opt-in `.cba-*` utility classes emit on `:root` after the `@use`.
```

#### Fix

Remove line 139 (`**CSS variables only (if not using SCSS):**`) so the Sass-only note directly follows the SCSS `@use` example, matching `docs/THEME.md` and the plan.

#### Verification after fix

- `grep -R "CSS variables only (if not using SCSS)" docs/USAGE.md` returns no matches.
- `grep "theme\.css" docs/USAGE.md docs/THEME.md docs/CONSUMER_GUIDE.md` returns only the "no compiled `theme.css` artifact" explanatory sentences.

---

## Checks Performed (all passed except the issue above)

| Check | Result |
|-------|--------|
| `package.json` version is `0.15.0` | Pass |
| `exports["./theme"]` has `sass`, `style`, `default` | Pass |
| `sideEffects` is `["**/*.scss"]` | Pass |
| `src/theme/theme.scss` uses `@forward 'mixins'` | Pass |
| `_variables.scss` contains 3 new tokens with correct values | Pass |
| `theme-fixtures.ts` registers 3 new tokens | Pass |
| `docs/theme-preview.css` regenerated with new tokens | Pass |
| All 6 component SCSS files use tokens instead of hard-coded sizes | Pass |
| No hard-coded `font-size`/`line-height`/`min-width` targets remain in `src/components/**/*.scss` | Pass |
| `ModuleFooterComponent` renamed to `CbaModuleFooterComponent` in src/specs/docs/README | Pass |
| `module-header` host block + `:host(--fullscreen)` retarget applied correctly | Pass |
| Doc files renamed via `git mv` (R099 / R100) | Pass |
| All current cross-refs use `CBA_MODULE_HEADER.md` / `CBA_MODULE_CONTAINER.md` | Pass |
| Stale hex values removed from docs | Pass |
| Host-class lists include `--invalid` in input/select/datepicker docs | Pass |
| `CBA_EMPTY_STATE.md` aria attribution clarified | Pass |
| `CBA_FORM_FIELD.md` ASCII tree lists `readonly`/`valid` | Pass |
| `CBA_TYPEAHEAD.md` uses `--cba-bg-secondary` | Pass |
| `CBA_BUTTON.md` ToC has `Non-goals` and `Related docs` | Pass |
| `CHANGELOG.md` has dated `0.15.0` header, no `[Unreleased]` section | Pass |
| No tracked `dist/` files | Pass |
| No `.gitignore` violations in staged/untracked files | Pass |
| No secrets in diff | Pass |

---

## Recommended Action

1. Apply the single fix above (remove the leftover heading in `docs/USAGE.md`).
2. Re-run `npm test -- src/theme/docs-compliance.spec.ts` (and a quick `npm run lint`) to confirm no regressions.
3. Amend or add a follow-up commit (e.g., `docs(usage): remove misleading css-only heading`) so the doc change stays with the theme.css-removal commit history.
