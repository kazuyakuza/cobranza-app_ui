# Code Review — Task 1 Step 4.3: `docs/theme-preview.html`

**Date:** 2026-08-08
**Reviewer:** Code Reviewer sub-agent
**Scope:** `docs/theme-preview.html` implementation against plan `.kilo/plans/20260808-fix-preview-accuracy-task1.md` and front-end spec `.kilo/plans/20260808-fix-preview-accuracy-frontend-spec.md`

## Summary

The implementation in `docs/theme-preview.html` conforms to the implementation plan and front-end spec. No blocker issues were found. The targeted preview-HTML spec, the full test suite, and the linter all pass. There are two non-blocking observations: an accepted container-radius divergence documented in the spec/plan, and a few residual hardcoded `px` values that the plan explicitly left out of scope.

## Verification performed

- Read `docs/theme-preview.html` current state.
- Read `.kilo/plans/20260808-fix-preview-accuracy-task1.md`.
- Read `.kilo/plans/20260808-fix-preview-accuracy-frontend-spec.md`.
- Read source-of-truth files:
  - `src/components/module-header/module-header.component.scss`
  - `src/components/module-container/module-container.component.scss`
  - `src/components/module-header/module-header.component.html`
  - `src/i18n/ui-messages.ts`
  - `src/theme/preview-html.spec.ts`
- `git status --short` and `git diff -- docs/theme-preview.html docs/theme-preview.css src/` — no uncommitted changes.
- `npm test -- src/theme/preview-html.spec.ts` — 1 suite, 24 tests passed.
- `npm test` — 22 suites, 202 tests passed.
- `npm run lint` — clean.

## Checklist findings

| # | Check | Result | Notes |
|---|-------|--------|-------|
| 1 | Icon order: drag → collapse → size toggle → fullscreen → remove | ✅ | Verified in both the main mockup markup and the `renderDensityStrip()` template. |
| 2 | Icon names match Font Awesome 6/7 solid pack | ✅ | `fa-up-down-left-right`, `fa-chevron-up`, `fa-arrows-left-right-to-line`, `fa-window-maximize`, `fa-xmark`; status uses `fa-check`. |
| 3 | CSS classes match component BEM naming | ✅ | `.cba-module-header`, `.cba-module-header__section`, `.cba-module-header__action`, `.cba-module-container`, etc. The SCSS `transition` multi-line declaration was collapsed to a single line (semantically equivalent), and the `@include cba-focus-ring` was expanded to `outline:none;box-shadow:var(--cba-focus-ring)` as authorized by the plan. |
| 4 | Aria-labels are Spanish and match `CBA_UI_MESSAGES.moduleHeader.aria` | ✅ | `Arrastrar módulo`, `Colapsar módulo`, `Reducir módulo a 50%`, `Pantalla completa`, `Quitar módulo`. Every `<button>` also has a matching `title`. |
| 5 | Copied SCSS selectors are complete and accurate | ✅ | Header block matches `module-header.component.scss` (minus `:host` and `::ng-deep .fa-spin`, which the plan says to omit). Container block maps `:host` selectors to plain `.cba-module-container` classes correctly. |
| 6 | No hardcoded px values where tokens exist | ✅ | Plan-listed substitutions (`15px`, `13.5px`, `12.5px`, `border-radius:12px`, `min-height:42px`) are gone. A few residual hardcoded values remain but were explicitly out of scope (see Observations). |
| 7 | Old selectors removed | ✅ | `.module-header`, `.module-actions`, `.module-title`, and standalone `.status` are gone. `.status-row`/`.status-badge` remain but are unrelated semantic-badge selectors. |
| 8 | `renderDensityStrip()` uses updated structure | ✅ | Emits `.cba-module-container`, `.cba-module-header`, status section with `fa-check`, five action buttons in order, and metadata inside the title section. |
| 9 | Test stability contract maintained | ✅ | Exact `toContain` substrings from `preview-html.spec.ts` are unchanged; `TOKEN_ROLES` still has 9 entries; all `REQUIRED_IDS` are present. |
| 10 | `TOKEN_ROLES` length still 9, `REQUIRED_IDS` present | ✅ | Verified in the HTML source and by passing tests. |
| 11 | No accidental changes to `src/` files | ✅ | `git diff src/` is empty. |

## Issues / observations

No blocker issues.

### Observation 1 — Accepted container radius divergence

- **Location:** `docs/theme-preview.html`, inline `<style>`, rule `.cba-module-container:not(.cba-module-container--fullscreen)` (`border-radius: var(--cba-radius-lg)`).
- **Expected vs actual:** The source component (`module-container.component.scss`) uses `--cba-radius-md`. The preview uses `--cba-radius-lg`.
- **Severity:** warning (intentional divergence)
- **Rationale:** The front-end spec §5 and implementation plan §1 explicitly authorize this divergence and document it with an inline comment in the copied CSS block. It is flagged as a follow-up, not a defect in this task.

### Observation 2 — Residual hardcoded `px` values left out of scope

- **Locations:**
  - `.module-body{padding:14px}`
  - `.module-footer{padding:9px 12px}`
  - `.panel-meta{font-size:12px}`
- **Expected vs actual:** Values remain in `px` even though some nearby tokens exist (e.g., `--cba-space-*`, `--cba-font-size-caption`).
- **Severity:** suggestion
- **Rationale:** The implementation plan (Step E) explicitly states these values have no exact matching `--cba-*` token or were outside the token-substitution table, and left them unchanged. They do not violate the plan, but could be revisited in a future cleanup once matching tokens/utilities are defined.

## Conclusion

The implementation is approved from the Step 4.3 code-review perspective. No fixes are required for Task 1. This review does **not** include the optional Step 4.3-fix implementation pass; if the Plan Agent decides to act on the suggestions above, they should be handled as a separate sub-task.
