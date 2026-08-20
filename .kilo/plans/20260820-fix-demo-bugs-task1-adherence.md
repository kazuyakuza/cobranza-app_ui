# Overall Plan Adherence Report — Task 1: Module Layout Fixes

- **Plan**: `.kilo/plans/20260820-fix-demo-bugs-task1.md`
- **Front-end verification**: `.kilo/plans/20260820-fix-demo-bugs-task1-verification.md`
- **TODO**: `.agent/todos/20260819/20260819-todo-1.md`
- **Report date**: 2026-08-20

## Method

Each plan step (1.1–3.2) was compared against the current on-disk content of the
eight modified files. Step-by-step findings below.

## Step-by-step adherence

### Bug 1 — modules footer

| Step | File | Result |
| --- | --- | --- |
| 1.1 Move footer inside container | `projects/demo/.../demo-module-card.component.ts` | ✅ Matches. `@if (hasFooter) { <cba-module-footer ... /> }` is inside `<cba-module-container>`, immediately after `<ng-content />` (lines 44–47). All bindings and `(event)="noop()"` handlers unchanged. |
| 1.2 Update class JSDoc | `projects/demo/.../demo-module-card.component.ts` | ✅ Matches. JSDoc now says "INSIDE the container so the footer shares the module chrome (rounded border + shadow) and is removed from the DOM when the module body is collapsed." (lines 14–16). |
| 1.3 Reverse status children order | `src/components/module-footer/module-footer.component.html` | ✅ Matches. Text `<span>` renders before `<fa-icon>` (lines 9–14). Surrounding `<div class="cba-module-footer__status" ...>` and `<ng-content>` untouched. |
| 1.4 Right-align footer status | `src/components/module-footer/module-footer.component.scss` | ✅ Matches. `justify-content: flex-end;` inserted immediately after `align-items: center;` (line 8). No other declaration reordered or removed. |

### Bug 2 — modules header btns (no-op drag icon)

| Step | File | Result |
| --- | --- | --- |
| 2.1 Add icon import | `src/components/module-header/module-header.component.ts` | ✅ Matches. `faUpDownLeftRight,` is in alphabetical position after `faTriangleExclamation,` and before `faWindowMaximize,` (line 21). No duplicate import statement. |
| 2.2 Expose `faDrag` template field | `src/components/module-header/module-header.component.ts` | ⚠️ Partial. The field `protected readonly faDrag = faUpDownLeftRight;` is placed immediately after `faXmark` and before `aria` (line 165), as specified. **However, the dedicated JSDoc line** `/** Drag-handle icon shown as the first built-in action (no-op in this library). Template-referenced. */` **is absent.** The field is instead covered by the pre-existing shared comment `/** Icons referenced directly by the header template. */` (line 162) that also documents `faFullscreen` and `faXmark`. See Diffs #2. |
| 2.3 Render no-op drag button | `src/components/module-header/module-header.component.html` | ✅ Matches. Button added immediately after `<ng-content select="[cbaModuleDragHandle]">` and before the collapse button (lines 24–30). Has `type="button"`, classes `cba-module-header__action cba-module-header__action--drag`, `aria-label="Arrastrar módulo"`, `title="Arrastrar módulo"`, no `(click)` handler, `<fa-icon [icon]="faDrag" aria-hidden="true" />`. Collapse/size-toggle/fullscreen/remove buttons unchanged. |
| 2.4 Update docs Icon order table | `docs/CBA_MODULE_HEADER.md` | ✅ Matches. Six-row table (positions 0–5) replaces the old four-row table (lines 123–130). |
| 2.5 Update projected-slot note | `docs/CBA_MODULE_HEADER.md` | ✅ Matches. Note now states position 0 is the projected slot and position 1 is always rendered as a no-op drag affordance (lines 134–138). |
| 2.6 Update Drag handle slot bullet | `docs/CBA_MODULE_HEADER.md` | ✅ Matches. Last bullet now reads "When nothing is projected at position 0, no empty gap is left; the built-in no-op drag button (position 1) is always rendered." (line 159). |

### Bug 3 — modules at 50% mode all wrong

| Step | File | Result |
| --- | --- | --- |
| 3.1 Replace workspace layout with grid | `projects/demo/.../demo-workspace.component.scss` | ✅ Matches the plan's full-file replacement exactly. `.workspace__row` is `display: grid; grid-template-columns: repeat(2, 1fr);`. `.workspace__row--single-50` is `grid-template-columns: 50% 1fr;`. Old ineffective `flex: 0 0 50%` rule removed. `.workspace`, `.demo-actions`, `:host` unchanged. |
| 3.2 Override container 50% host width | `projects/demo/.../demo-module-card.component.scss` | ⚠️ Partial. `:host { display: block; }` and `.demo-module-card { width: 100%; }` match. **The width-override selector is `.demo-module-card--size-50 > cba-module-container { width: 100%; }` (line 10), missing the `.cba-module-container--size-50` class qualifier** the plan specified (`.demo-module-card--size-50 > cba-module-container.cba-module-container--size-50`). See Diffs #1. |

## Diffs between plan and implementation

| # | Plan (exact) | Implementation (exact) | File | Impact | Acceptable? |
| --- | --- | --- | --- | --- | --- |
| 1 | `.demo-module-card--size-50 > cba-module-container.cba-module-container--size-50 { width: 100%; }` | `.demo-module-card--size-50 > cba-module-container { width: 100%; }` | `demo-module-card.component.scss` (line 10) | Low. Each `demo-module-card--size-50` contains exactly one `cba-module-container`, which is always in `--size-50` mode (the card's `size` input is `'50%'`). Runtime behavior is identical. Both selectors still out-specify the library's `:host(.cba-module-container--size-50) { width: 50% }` rule (demo rule specificity (0,2,1) vs library (0,2,0)), so the override wins either way. The implementation selector is less explicit about anchoring to the 50% state. | Yes |
| 2 | `/** Drag-handle icon shown as the first built-in action (no-op in this library). Template-referenced. */` + `protected readonly faDrag = faUpDownLeftRight;` | `protected readonly faDrag = faUpDownLeftRight;` (no dedicated JSDoc) | `module-header.component.ts` (line 165) | Low. The field is placed in the correct position and is still documented under the shared `/** Icons referenced directly by the header template. */` comment (line 162) that covers `faFullscreen` and `faXmark`. Only the per-field JSDoc text from the plan is missing. No functional or public-API impact. | Yes |

No other diffs. Steps 1.1, 1.2, 1.3, 1.4, 2.1, 2.3, 2.4, 2.5, 2.6, 3.1 match the plan byte-for-byte.

## Pre-existing / out-of-scope items (not introduced by this task)

| # | Item | Source | Plan disposition |
| --- | --- | --- | --- |
| 1 | `module-header.component.ts` is 203 lines, exceeding the 200-line `src/` limit (`max-lines-per-file.md`). | Front-end verification report §"Front-end quality issues" #2. | Plan §"Known constraint conflict" explicitly declares line reduction **out of scope** for Task 1 (pre-existing non-compliance). The plan predicted ~218 lines; actual is 203 because the JSDoc line (Diff #2) was omitted. Acceptable per plan. |
| 2 | `[class]="statusClass() ?? ''"` string binding coexisting with a static `class` attribute on the same element in `module-footer.component.html` and `module-header.component.html`. | Front-end verification report §"Front-end quality issues" #1. | Pre-existing pattern, not introduced by Task 1. Out of scope. |

## Scope adherence

- ✅ Only the eight files listed in the plan's "Summary of files changed" were modified.
- ✅ No edits to out-of-scope files: `app.component.*`, `module-container.component.*`, `module-header.component.scss`, `CBA_MODULE_FOOTER.md`, `CBA_MODULE_CONTAINER.md`, `package.json`, `CHANGELOG.md`.
- ✅ No new files, no deleted files.
- ✅ No git branch/push actions taken in this step (correct — those belong to Steps 2 and 5).
- ✅ Bug scope limited to the three assigned bugs; other TODO items untouched.

## Conclusion

The implementation **adheres to the plan**. Two minor diffs exist (CSS selector qualifier missing; per-field JSDoc line missing), both Low severity with no functional, specificity, or public-API impact. Both deviations are **acceptable** and do not require corrective action or a new TODO file.

No unacceptable deviations. No new TODO file proposed.

## Files reviewed

- `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts`
- `projects/demo/src/app/components/demo-module-card/demo-module-card.component.scss`
- `projects/demo/src/app/components/demo-workspace/demo-workspace.component.scss`
- `src/components/module-footer/module-footer.component.html`
- `src/components/module-footer/module-footer.component.scss`
- `src/components/module-header/module-header.component.ts`
- `src/components/module-header/module-header.component.html`
- `docs/CBA_MODULE_HEADER.md`
