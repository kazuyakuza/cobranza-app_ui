# Front-end Implementation Verification — Task 1: Module Layout Fixes

## Scope

Verification of the three layout fixes defined in `.kilo/plans/20260820-fix-demo-bugs-task1-frontend-spec.md`.

## File-by-file verification

### `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts`

- Footer moved inside `<cba-module-container>`, placed after `<ng-content />` and before the closing `</cba-module-container>`.
- Template matches the spec exactly.
- `hasFooter` getter preserves footer visibility logic (`footerStatus !== null || footerText.length > 0`).
- ✅ Compliant.

### `src/components/module-footer/module-footer.component.html`

- Children inside `.cba-module-footer__status` are reversed: the text `<span>` now renders before the `<fa-icon>`.
- ✅ Compliant.

### `src/components/module-footer/module-footer.component.scss`

- `.cba-module-footer` has `justify-content: flex-end` and continues to use theme tokens for spacing, height, and background color.
- ✅ Compliant.

### `src/components/module-header/module-header.component.ts`

- Imports `faUpDownLeftRight` from `@fortawesome/free-solid-svg-icons`.
- Exposes `protected readonly faDrag = faUpDownLeftRight;` for template use.
- ✅ Compliant.

### `src/components/module-header/module-header.component.html`

- Built-in drag button is the first built-in action, placed immediately after `<ng-content select="[cbaModuleDragHandle]">` and before the collapse button.
- Has `type="button"`, `aria-label="Arrastrar módulo"`, `title="Arrastrar módulo"`, and no `(click)` handler.
- ✅ Compliant.

### `projects/demo/src/app/components/demo-workspace/demo-workspace.component.scss`

- Uses CSS Grid with `grid-template-columns: repeat(2, 1fr)` for rows.
- `.workspace__row--single-50` uses `grid-template-columns: 50% 1fr`.
- Old ineffective `flex: 0 0 50%` rule is removed.
- ✅ Compliant.

### `projects/demo/src/app/components/demo-module-card/demo-module-card.component.scss`

- `:host { display: block; }` present.
- `.demo-module-card { width: 100%; }` present.
- Width override rule is `.demo-module-card--size-50 > cba-module-container { width: 100%; }`.
- ⚠️ Differs from spec selector `.demo-module-card--size-50 > cba-module-container.cba-module-container--size-50` (see Diffs).

## Diffs between spec and implementation

| # | Spec | Implementation | File | Impact |
|---|---|---|---|---|
| 1 | `.demo-module-card--size-50 > cba-module-container.cba-module-container--size-50 { width: 100%; }` | `.demo-module-card--size-50 > cba-module-container { width: 100%; }` | `demo-module-card.component.scss` | Low. Functional result is the same because each card contains exactly one `cba-module-container`. The implementation selector is less specific and does not explicitly anchor to the container's size-50 state. |

## Front-end quality issues

| # | Issue | Category | Severity | Notes |
|---|---|---|---|---|
| 1 | `[class]="statusClass() ?? ''"` string binding coexists with a static `class` attribute on the same element in `module-footer.component.html` and `module-header.component.html`. Depending on Angular binding precedence, the static base class may be overwritten when a modifier class is applied. | CSS specificity / Angular class binding | Medium | Pre-existing pattern, not introduced by this task. Affects both header status section and footer status region. Consider `[class.cba-module-footer__status--loaded]="status() === 'loaded'"` style bindings or `ngClass` to preserve base classes. |
| 2 | `module-header.component.ts` is 203 lines, exceeding the project `max-lines-per-file` rule of 200 lines for files under `src/`. | Code style | Low | Likely near the limit before this change; the added `faUpDownLeftRight` import and `faDrag` field pushed it over. |

## Conclusion

All three bug fixes are implemented and functionally match the front-end technical specification. The only spec deviation is a slightly less specific CSS selector in `demo-module-card.component.scss`, which does not change runtime behavior. Two low/medium quality issues were noted; neither was introduced by this task.

- Report date: 2026-08-20
