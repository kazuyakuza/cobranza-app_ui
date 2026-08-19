# Code Review — Update Demo App (Task 1)

Reviewer step 4.3 — findings and fix plan.

## Verdict

Conditional pass. The implementation matches the plan and front-end spec functionally, builds successfully, uses real library components, keeps English text, and follows the required section order. Several project-rule compliance issues need fixes before task completion.

## Verification performed

- Read TODO, implementation plan, and front-end spec.
- Inspected all files in `projects/demo/src/app/` scope.
- Grep for Spanish UI strings in `projects/demo/src/`: none found.
- `npm run build:demo`: passed.
- `git status`: clean working tree on `feat/update-demo-project`.

## Correct (no fix needed)

1. Section order matches TODO/spec: preview → header → workspace (6 rows) → tokens → buttons → pills → sizes → icons → texts → table → nav → inputs → form → footer.
2. Workspace module row order matches TODO exactly: expanded 100%, collapsed 100%, 2× expanded 50%, 2× collapsed 50%, expanded 50% with empty space, collapsed 50% with empty space.
3. All `<cba-*>` elements are real library components; demo-only elements (`demo-pill`, `demo-nav-item`) are explicitly demo-only.
4. Token grid shows color, name, tag, hex.
5. Button and pill matrices show variants × surfaces × states with captions.
6. Size variants (`sm`/`md`) shown for buttons and pills.
7. Icon grid shows 15 predefined icons with English labels and `aria-label`s.
8. Text showcase covers typography scale and allowed text colors per surface.
9. Complete table example with header, body, selected row, and status badges.
10. Navigation items show normal/selected/hover/disabled states with proper ARIA.
11. Inputs variants over four surfaces; form example uses inputs, select, datepicker, labels, hints.
12. Footer is centered; header has Back button, brand, centered search (~50%), notifications + profile icons.
13. `index.html` uses `lang="en"`.

## Acceptable deviations from plan (build-required)

These changes from the exact plan code were necessary to make the demo compile and are functionally equivalent. No action required.

| File | Plan | Actual | Reason |
|------|------|--------|--------|
| `app.component.ts` imports | Included `CbaBadgeComponent`, `CbaModuleFooterComponent` | Removed unused imports | Components are used only in child components; Angular standalone imports must be used. |
| `demo-module-card.component.ts` | `private get hasFooter()` | `protected get hasFooter()` | Template must access the getter; `private` is not accessible. |
| `demo-icon-grid.component.ts` | `icon: unknown`; import `FaIconComponent` | `icon: IconDefinition`; no `FaIconComponent` | `cba-button` consumes the icon directly; `FaIconComponent` is unused. |
| `demo-pill-matrix.component.ts` | `readonly pills: PillCell[]` | `readonly pills: readonly PillCell[]` | Stricter immutability; no behavior change. |

## Defects to fix

### 1. Magic numbers in styles (code-guidelines.md #13, self-documenting-code.md)

Several inline styles use raw pixel values without named constants.

- `projects/demo/src/app/app.component.scss:129` — `border-radius: 999px;` in `.demo-pill`.
- `projects/demo/src/app/components/demo-button-matrix/demo-button-matrix.component.ts:114` — `width: 80px;` in `.demo-matrix-row__status`.
- `projects/demo/src/app/components/demo-pill-matrix/demo-pill-matrix.component.ts:116` — `width: 80px;` in `.demo-matrix-row__status`.
- `projects/demo/src/app/components/demo-pill-matrix/demo-pill-matrix.component.ts:135` — `padding: 4px 12px;` in `.demo-pill`.
- `projects/demo/src/app/components/demo-pill-matrix/demo-pill-matrix.component.ts:136` — `border-radius: 999px;` in `.demo-pill`.
- `projects/demo/src/app/components/demo-icon-grid/demo-icon-grid.component.ts:62` — `minmax(96px, 1fr)` in grid template.
- `projects/demo/src/app/components/demo-section/demo-section.component.ts:29` — `max-width: 960px;` (file in scope).

**Fix:** introduce named SCSS variables / CSS custom properties for each value, e.g. `$pill-border-radius: 999px;`, `$matrix-status-width: 80px;`, `$icon-cell-min-size: 96px;`, `$section-max-width: 960px;`.

### 2. Compound boolean conditions (single-section-boolean-conditions.md)

- `projects/demo/src/app/components/demo-module-card/demo-module-card.component.ts:69`
  ```ts
  return this.footerStatus !== null || this.footerText.length > 0;
  ```
  Fix: extract to a named method such as `private hasFooterContent(): boolean { ... }` and return its result.

- `projects/demo/src/app/app.component.ts:126`
  ```ts
  return isTextTag && !isInverse ? 'var(--cba-bg-elevated)' : undefined;
  ```
  Fix: extract to a named method such as `private needsSwatchInverseColor(token: ColorToken): boolean { ... }` and use it in the ternary.

### 3. HTML template length note (max-lines-per-file.md)

`projects/demo/src/app/app.component.html` is 240 lines total; after excluding blank lines and comments it is ~197 lines, within the 200-line hard limit but far above the 125-line ideal. Consider extracting one or more sections into separate components if future additions are made.

## Fix plan

1. Add named SCSS variables / CSS custom properties for all magic numbers listed above.
2. Extract the two compound boolean expressions into named helper methods.
3. Verify `app.component.html` remains under 200 content lines after the above changes.
4. Re-run `npm run build:demo` and confirm no regressions.
5. Re-run Spanish-text grep and confirm zero matches.
