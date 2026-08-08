# Code Review — Fix Solid Button Hover/Active State Visibility

**Review date:** 2026-08-07
**Reviewer:** Code Reviewer sub-agent (Critical Workflow step 4.3)
**Plan reviewed:** `.kilo/plans/20260807-fix-solid-button-states-impl.md`
**Front-end spec reviewed:** `.kilo/plans/20260807-fix-solid-button-states-frontend-spec.md`
**Branch:** `feat/fix-solid-button-states`

## Summary

No issues were found. The implementation in step 4.2 matches the implementation plan and front-end specification, all verification gates pass, and `CHANGELOG.md` complies with the versioning rule.

## Verification executed

| Command | Result |
|---------|--------|
| `npm run lint` | Passed |
| `npm test` | 22 suites, 199 tests passed |
| `npm run build` | Built `@cobranza-apps/ui` successfully |
| `npm run build:preview` | Regenerated `docs/theme-preview.css` successfully; no working-tree diff |
| `git status --short` | Only untracked plan files (expected) |
| `git log --oneline -8` | Commit sequence and messages match plan |

The `build:preview` command emitted two pre-existing Dart Sass deprecation warnings about `map-get` in `src/theme/_utilities.scss`. These warnings are unrelated to this task and do not affect output.

## File-by-file review

### `src/theme/_variables.scss`

- `--cba-hover-inverse` and `--cba-active-inverse` are added in the correct location, immediately after `--cba-active` and before `--cba-focus-ring`.
- Values match the spec and plan: `rgba(253, 252, 248, 0.12)` and `rgba(253, 252, 248, 0.22)`.
- Token hue matches `--cba-text-inverse` (`#FDFCF8`).

### `src/components/testing/theme-fixtures.ts`

- `EXPECTED_TOKENS` includes both inverse keys in the same order as `_variables.scss`.
- Values match the SCSS source exactly (spaces + leading zeros preserved).

### `src/components/button/cba-button.component.scss`

- `primary`, `danger`, and `success` variants use `--cba-hover-inverse` / `--cba-active-inverse`.
- `secondary` continues using `--cba-hover` / `--cba-active`.
- `ghost` continues using `background-color: var(--cba-hover)` / `var(--cba-active)`.
- No unrelated selectors were changed.

### `docs/theme-preview.html`

- The `.pv-btn--*` state rules are split exactly as specified:
  - Solid variants (`primary`, `danger`, `success`) use inverse overlays.
  - `secondary` keeps the dark overlay.
  - `ghost` keeps `background` overlays.
- The inline style strings match the assertions added to `preview-html.spec.ts`.

### `docs/theme-preview.css`

- Regenerated and contains both new tokens in the `:root` block.
- Emitted values preserve the spaced `rgba(...)` form, so the canonical-value assertion in `preview-html.spec.ts` passes without normalization changes.
- Re-running `npm run build:preview` produced no diff, confirming the committed file is current.

### `docs/CONSUMER_GUIDE.md`

- The introductory paragraph now explains the solid vs secondary/ghost overlay split.
- The "State overlays" table has the correct four-column layout and token references.
- No other sections were accidentally altered.

### `.agent/project-info/brief.md`

- The inverse tokens are mirrored in the §5 `:root` block in the correct order.
- The recommended usage note for `--cba-hover-inverse` / `--cba-active-inverse` is present.

### `CHANGELOG.md`

- A dated `## [0.11.2] — 2026-08-07` header sits directly above `## [0.11.1] — 2026-08-06`.
- No `[Unreleased]` section exists.
- Entries use Keep a Changelog categories and reference `brief.md` §5 and the Consumer Guide.

### `src/theme/preview-html.spec.ts`

- New assertions cover:
  - Inverse alpha difference ≥ 0.05.
  - Button SCSS references inverse tokens for solid variants.
  - Preview HTML uses inverse overlays for solid variants.
  - Preview HTML keeps dark overlays for `secondary`.
  - Compiled preview CSS declares the inverse tokens.
- Existing tests remain intact and all pass.

### `src/theme/tokens.spec.ts`

- Added explicit test declaring the inverse overlay tokens for solid accent buttons.
- Existing exact-token-set test continues to pass.

## Security / maintainability notes

- No new dependencies.
- No TypeScript contract changes.
- No hard-coded hex values; all changes reference existing or new `--cba-*` tokens.
- No commented-out code introduced.

## Conclusion

The implementation is complete, correct, and ready for the next Critical Workflow step (4.4 Documentation / 4.5 Verification). No fix plan is required.
